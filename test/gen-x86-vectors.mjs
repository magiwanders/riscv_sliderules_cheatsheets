// Assembles the 8086 test cases (test/cases.mjs) with GNU as (16 bit code, .arch i8086) and llvm-mc (16 bit mode) and
// stores the bytes in test/vectors/i8086-{gnu,llvm}.json, which x86.test.mjs compares the sliderule against.
//
//   npm run vectors:x86   (X86_AS=/path/to/as for an x86 GNU as, the system one by default; LLVM_MC_BIN=/path/to/llvm/bin
//                          with llvm-mc built for X86)
//
// x86 assemblers choose between encodings of the same line; the sheets show all of them. How a case is written for
// them: the ModRM direction with {load} / {store} where both registers could go either way, sizes as BYTE PTR / WORD
// PTR, a relative offset as .+n. Left out, as longer twins the assemblers never choose (as the 6502's absolute
// addresses of the zero page): an immediate or displacement that fits the shorter form, the ModRM forms of a register
// that has a one byte opcode (inc ax, push ax, xchg ax, ...) or of the accumulator that has its own (add al, imm8,
// mov al, [addr]).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const GAS = process.env.X86_AS || 'as';
const OBJDUMP = process.env.X86_OBJDUMP || 'objdump';
const LLVM = process.env.LLVM_MC_BIN || join(homedir(), '.local', 'src', 'llvm-project', 'build-mc', 'bin');
const codec = isas.find((i) => i.value === '8086').codec;

const opcode = (entry) => parseInt(entry.enc.split(' ')[0].padEnd(8, '0').slice(0, 8), 2);
const fitsByte = (v) => v >= -128 && v <= 127;

function _usable({ entry, values }) {
  const op = opcode(entry);
  const reg = /rm(8|16)\b/.test(entry.enc) && !/\[/.test(entry.asm);
  // a longer twin of an immediate that fits a sign-extended byte, of a displacement that fits disp8 (or none)
  if (op === 0x81 && fitsByte(values.imm > 32767 ? values.imm - 65536 : values.imm)) return false;
  if (values.d16 !== undefined && fitsByte(values.d16)) return false;
  if (values.d8 === 0 && values.b16x !== 6) return false;
  const signed16 = (v) => (v > 32767 ? v - 65536 : v);
  if ((op & 0xc7) === 0x05 && op < 0x40 && fitsByte(signed16(values.imm))) return false;
  // jmp rel16 to a target jmp rel8 reaches (two bytes shorter, so its offset is one more)
  if (op === 0xe9 && fitsByte(values.imm + 1)) return false;
  // register forms the one byte opcodes and the accumulator's own forms win
  if (reg && ((op === 0xff && /^(inc|dec|push)$/.test(entry.name)) || op === 0x8f || (op === 0xc6 || op === 0xc7))) return false;
  if (reg && [0x80, 0x81].includes(op) && values.rm8 === 0) return false;
  if (reg && op === 0x80 && values.rm8 === 0) return false;
  if (reg && op === 0x81 && values.rm16 === 0) return false;
  if (reg && [0xf6, 0xf7].includes(op) && entry.name === 'test' && (values.rm8 === 0 || values.rm16 === 0)) return false;
  if (op === 0x87 && reg && (values.rm16 === 0 || values.r16 === 0)) return false;
  if (/\[a16\]/.test(entry.asm) && [0x88, 0x89, 0x8a, 0x8b].includes(op) && (values.r8 === 0 || values.r16 === 0)) return false;
  if (op === 0x90 && entry.name === 'xchg' && values.r16 === 0) return false;
  return true;
}

// the line one assembler reads (i: the case's label, c<i>, which a relative target counts from)
function _line({ entry, operands, values, dialect, i }) {
  let text = operands.replace(/\b(BYTE|WORD|DWORD) \[/g, '$1 PTR [');
  // a far pointer in memory: GNU as reads it as DWORD PTR, llvm-mc (to which DWORD is a 32 bit operand) as lcall / ljmp
  if (/\bFAR \[/.test(text)) {
    if (dialect === 'llvm') return `l${entry.name} ${text.replace('FAR ', '')}`;
    text = text.replace('FAR [', 'DWORD PTR [');
  }
  const rel = /\brel\b/.test(entry.asm);
  if (rel) text = text.replace(/-?\d+$/, `c${i}+${values.imm + entry.width / 8}`.replace('+-', '-'));
  const op = opcode(entry);
  const regreg = /^(rm8|rm16), (r8|r16)$|^(r8|r16), (rm8|rm16)$/.test(entry.asm.replace(/^~\S+ /, '')) && !/\[/.test(operands) && entry.name !== 'xchg';
  // the direction of a register to register ModRM form: GNU as takes {load} / {store}, llvm-mc only mov.s (its
  // other lines are the default direction, which the test accepts as the same instruction)
  const load = (op & 2) !== 0;
  let direction = '';
  if (regreg && dialect === 'gnu') direction = load ? '{load} ' : '{store} ';
  const name = regreg && dialect === 'llvm' && load && entry.name === 'mov' ? 'mov.s' : entry.name;
  if (dialect === 'llvm' && entry.name.match(/^(call|jmp)$/) && /^\S+:\S+$/.test(text)) return `l${entry.name} ${text.replace(':', ', ')}`;
  // llvm-mc writes call rel16 in 16 bit code as calll (66 e8 rel32) unless told callw, which only its AT&T syntax has
  if (dialect === 'llvm' && rel && entry.name === 'call') return _att(`callw ${text}`);
  // and ret / retf as retl / lretl
  if (dialect === 'llvm' && /^retf?$/.test(entry.name)) return _att(`${entry.name === 'retf' ? 'l' : ''}retw${text ? ` $${text}` : ''}`);
  const line = entry.asm.startsWith('~') ? `${name}${text}` : `${name}${text ? ' ' + text : ''}`;
  return `${direction}${line}`;
}

const _att = (line) => `.att_syntax\n\t${line}\n\t.intel_syntax noprefix`;

function _assembled({ dir, lines, header, assemble }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, [...header, ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  try {
    assemble({ source, object: join(dir, 'cases.o') });
  } catch (e) {
    const text = readFileSync(source, 'utf8').split('\n');
    for (const [, n, message] of String(e.stderr).matchAll(/cases\.s:(\d+):(?:\d+:)? (?:Error|error): ([^\n]*)/g)) console.error(`${text[n - 1].trim()}: ${message}`);
    throw new Error('the assembler refused lines');
  }
  return _bytesByLabel(execFileSync(OBJDUMP, ['-d', '-z', '-M', 'i8086', join(dir, 'cases.o')], { encoding: 'utf8', maxBuffer: 2 ** 28 }));
}

const _gnu = ({ dir, lines }) => _assembled({
  dir, lines, header: ['\t.code16', '\t.arch i8086', '\t.intel_syntax noprefix'],
  assemble: ({ source, object }) => execFileSync(GAS, ['--32', '-o', object, source], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' }),
});

const _llvm = ({ dir, lines }) => _assembled({
  dir, lines, header: ['\t.code16', '\t.intel_syntax noprefix'],
  assemble: ({ source, object }) => execFileSync(join(LLVM, 'llvm-mc'), ['-triple=i386-unknown-unknown-code16', '-filetype=obj', '-o', object, source], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' }),
});

// objdump's lines of one label's instruction (a long one wraps over several lines)
function _bytesByLabel(dump) {
  const bytes = [];
  let current = -1;
  let first = true;
  for (const line of dump.split('\n')) {
    const label = line.match(/<c(\d+)>:/);
    if (label) { current = Number(label[1]); bytes[current] = []; first = true; continue; }
    const insn = line.match(/^\s+[0-9a-f]+:\s+((?:[0-9a-f]{2} )+)\s*(.*)$/);
    if (!insn || current < 0) continue;
    // a new instruction starts where a line has its own mnemonic; only the label's first instruction counts
    if (!first && insn[2].trim()) { current = -1; continue; }
    bytes[current].push(...insn[1].trim().split(' ').map((b) => parseInt(b, 16)));
    first = false;
  }
  return bytes;
}

// what the test accepts instead of the same bytes: the other ModRM direction of a register to register line (llvm-mc
// chooses it itself), xchg's two registers either way round (GNU as orders them itself)
function flags({ entry, operands, dialect, line }) {
  const regreg = /^(rm8|rm16), (r8|r16)$|^(r8|r16), (rm8|rm16)$/.test(entry.asm) && !/\[/.test(operands);
  if (regreg && entry.name === 'xchg') return { eitherOrder: true };
  if (regreg && dialect === 'llvm' && !line.startsWith('mov')) return { eitherDirection: true };
  return {};
}

const version = {
  gnu: () => execFileSync(GAS, ['--version'], { encoding: 'utf8' }).split('\n')[0],
  llvm: () => `llvm-mc ${execFileSync(join(LLVM, 'llvm-mc'), ['--version'], { encoding: 'utf8' }).match(/version\s+(\S+)/)[1]}`,
};

const dir = mkdtempSync(join(tmpdir(), 'sliderule-x86-'));
try {
  const all = allCases({ codec }).filter(_usable);
  for (let seed = 1; seed < 256; seed++) {
    const without = new Set(codec.encodable.map((e) => e.id).filter((id) => !all.some((c) => c.id === id)));
    if (!without.size) break;
    all.push(...allCases({ codec, seed }).filter((c) => without.has(c.id) && _usable(c)).slice(0, 2));
  }
  for (const [dialect, assemble] of [['gnu', _gnu], ['llvm', _llvm]]) {
    const lines = all.map((c, i) => _line({ ...c, dialect, i }));
    const bytes = assemble({ dir, lines });
    const vectors = all.map((c, i) => ({ id: c.id, operands: c.operands, assembly: lines[i], bytes: bytes[i], ...flags({ ...c, dialect, line: lines[i] }) }));
    const missing = vectors.filter((v) => !v.bytes || !v.bytes.length);
    if (missing.length) throw new Error(`${dialect}: no bytes for ${missing.slice(0, 5).map((v) => v.assembly).join('; ')}`);
    writeFileSync(new URL(`./vectors/i8086-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
    console.log(`8086: ${vectors.length} vectors from ${version[dialect]()}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
