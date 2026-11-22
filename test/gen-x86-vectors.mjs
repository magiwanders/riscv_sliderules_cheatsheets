// Assembles the x86 test cases (test/cases.mjs) of the 8086, IA-32 and x86-64 sheets with GNU as and llvm-mc (16, 32
// and 64 bit code) and stores the bytes in test/vectors/{i8086,ia32,x86_64}-{gnu,llvm}.json, which x86.test.mjs
// compares the sheets against.
//
//   npm run vectors:x86   (X86_AS=/path/to/as for an x86 GNU as, the system one by default, X86_OBJDUMP likewise;
//                          LLVM_MC_BIN=/path/to/llvm/bin with llvm-mc built for X86; SETS=ia32,x86_64 for some)
//
// x86 assemblers choose between encodings of the same line; the sheets show all of them. A case is left out when the
// sheet itself encodes its line (or the line with its immediate read as signed, as assemblers do) shorter: the longer
// twin no assembler writes (as the 6502's absolute addresses of the zero page). How a case is written for them: the ModRM
// direction with {load} / {store} where both registers could go either way (GNU as; llvm-mc chooses itself and the test
// accepts either), sizes as BYTE PTR ..., a relative offset from the case's label, AT&T syntax where llvm-mc's Intel
// syntax cannot say the operand size (callw, retw, lretw, ...).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

// the twin check tries many rows per line and each refusal throws: no stack traces to build
Error.stackTraceLimit = 0;

const GAS = process.env.X86_AS || 'as';
const OBJDUMP = process.env.X86_OBJDUMP || 'objdump';
const LLVM = process.env.LLVM_MC_BIN || join(homedir(), '.local', 'src', 'llvm-project', 'build-mc', 'bin');
const SETS = {
  i8086: { value: '8086', mode: 16, gnu: ['.code16', '.arch i8086'], as: '--32', objdump: 'i8086', triple: 'i386-unknown-unknown-code16' },
  ia32: { value: 'x86', mode: 32, gnu: ['.code32'], as: '--32', objdump: 'i386', triple: 'i386-unknown-unknown' },
  x86_64: { value: 'x86_64', mode: 64, gnu: ['.code64'], as: '--64', objdump: 'x86-64', triple: 'x86_64-unknown-unknown' },
};

// the first byte that is no prefix (66, REX)
const opcodeOf = (entry) => {
  const tokens = entry.enc.split(/\s+/);
  if (tokens[0] === '01100110') tokens.shift();
  // REX: 0100 W R X B
  if (tokens[0] === '0100') tokens.splice(0, 5);
  let text = '';
  for (const t of tokens) { if (/^[01]+$/.test(t)) text += t; else break; }
  return parseInt(text.slice(0, 8).padEnd(8, '0'), 2);
};
const REGREG = /^(rm8x?|rm16|rm32|rm64), (r8x?|r16|r32|r64)$|^(r8x?|r16|r32|r64), (rm8x?|rm16|rm32|rm64)$/;
const regreg = (entry, operands) => REGREG.test(entry.asm) && !/\[/.test(operands);

// A longer twin of a shorter row: the sheet writes the same line shorter (also with the immediate read as signed)
function _twin({ codec, entry, operands, values, mode }) {
  // the accumulator as a register (AX is a literal of its own rows, ax a register of the others')
  const text = `${entry.asm.startsWith('~') ? entry.name : `${entry.name} `}${operands}`.trim().replace(/\b(AL|AX|EAX|RAX)\b/g, (r) => r.toLowerCase());
  const shorter = (line) => {
    try {
      return codec.encodeAssembly({ assembly: line }).words[0].inst.width < entry.width;
    } catch {
      return false;
    }
  };
  if (shorter(text)) return true;
  // the accumulator's own immediate rows against the sign-extended imm8 ones (83 /n, 6B, 6A): as long for AX, and
  // assemblers write the latter
  const signedByte = (v) => v >= -128 && v <= 127;
  const asSigned = (v) => [v, v - 2 ** 16, v - 2 ** 32].find(signedByte);
  if (/\b(AX|EAX|RAX), imm$/.test(entry.asm) && asSigned(values.imm) !== undefined) return true;
  // xchg with the accumulator: the one byte 90+r form, either way round
  if (entry.name === 'xchg' && regreg(entry, operands) && !/8/.test(entry.asm) && Object.entries(values).some(([k, v]) => /^r/.test(k) && v === 0)) return true;
  // an unsigned immediate of 16 / 32 bits that is a sign-extended byte: assemblers write the imm8 form
  if (values.imm !== undefined && /\bimm\b/.test(entry.asm) && !entry.immSigned) {
    for (const bits of [16, 32]) {
      if (values.imm >= 2 ** (bits - 1) && values.imm < 2 ** bits && shorter(text.replace(/(0x[0-9a-f]+|\d+)$/, String(values.imm - 2 ** bits)))) return true;
    }
  }
  // a zero displacement assemblers leave out (but after bp / ebp / rbp / r13, which have no form without one)
  if ((values.d8 === 0 || values.d32 === 0 || values.d16 === 0) && !/\[(bp|ebp|rbp|r13)\b/.test(operands) && !/\[\w+\*\d/.test(operands)) return true;
  // a 64 bit mode absolute address is a sign-extended 32 bit one
  if (mode === 64 && values.a32 >= 2 ** 31) return true;
  return false;
}

// An Intel memory operand ([rbx+rcx*4+0x10], [rip+0x10], [0x1234]) in AT&T syntax (0x10(%rbx,%rcx,4)).
function _attMemory(text) {
  const inner = text.replace(/^\[|\]$/g, '');
  const m = inner.match(/^(?:([a-z]\w*)(?![\w*]))?(?:\+?([a-z]\w*)\*(\d))?([+-]0x[0-9a-f]+)?$/);
  if (!m) return inner; // an absolute address
  const [, base, index, scale, disp = ''] = m;
  return `${disp.replace(/^\+/, '')}(${base ? `%${base}` : ''}${index ? `,%${index},${scale}` : ''})`;
}

// the line one assembler reads (i: the case's label, c<i>, which a relative target counts from)
function _line({ entry, operands, values, dialect, i, mode }) {
  let text = operands.replace(/\b(BYTE|WORD|DWORD|QWORD) \[/g, '$1 PTR [').replace(/\bRIP\b/, 'rip');
  const att = (line) => `.att_syntax\n\t${line}\n\t.intel_syntax noprefix`;
  const rel = /\brel\b/.test(entry.asm);
  if (rel) text = text.replace(/-?\d+$/, `c${i}+${values.imm + entry.width / 8}`.replace('+-', '-'));
  const op = opcodeOf(entry);
  // far pointers in memory: GNU as reads them by size, llvm-mc as lcall / ljmp (q for 64 bit ones)
  if (/\bFAR\b/.test(text)) {
    // (llvm-mc's Intel syntax never sets REX.W on them: its AT&T lcallq / ljmpq)
    if (dialect === 'llvm' && /TBYTE/.test(text)) return att(`l${entry.name}q *${_attMemory(text.replace('FAR TBYTE ', ''))}`);
    // (and in 64 bit mode its Intel ljmp / lcall take REX.W: lcalll / ljmpl)
    if (dialect === 'llvm' && mode === 64) return att(`l${entry.name}l *${_attMemory(text.replace('FAR FWORD ', ''))}`);
    if (dialect === 'llvm') return `l${entry.name} ${text.replace(/FAR (FWORD )?/, '')}`;
    // (a 64 bit offset: FWORD with rex.W, as GNU as writes it)
    if (/TBYTE/.test(text)) return `rex.W ${entry.name} ${text.replace('FAR TBYTE [', 'FWORD PTR [')}`;
    text = mode === 16 ? text.replace('FAR [', 'DWORD PTR [') : text.replace(/FAR FWORD \[/, 'FWORD PTR [');
  }
  // sysexit in 64 bit mode returns to 32 bit code: GNU as wants it said
  if (dialect === 'gnu' && mode === 64 && /^(sysexit|sysret)$/.test(entry.name)) return `${entry.name}d`;
  // GNU as has no lfs / lgs / lss with a 64 bit register, and writes lar / lsl / sldt / str / smsw / mov from a segment
  // register to one without REX.W (the upper half is zeroed either way): rex.W and the 32 bit register
  if (dialect === 'gnu' && (/^(l[fgs]s|lar|lsl|sldt|str|smsw)$/.test(entry.name) || /^rm64, sreg$/.test(entry.asm)) && /\b(r|rm)64\b/.test(entry.asm) && /^r\w+(,|$)/.test(text)) {
    const reg = text.split(',')[0];
    const r32 = /^r\d+$/.test(reg) ? `${reg}d` : `e${reg.slice(1)}`;
    return `rex.W ${entry.name} ${r32}${text.slice(reg.length)}`;
  }
  // the direction of a register to register ModRM form: GNU as takes {load} / {store}, llvm-mc only mov.s
  const twoRegs = regreg(entry, operands) && !/^(xchg|movzx|movsx|movsxd|cmov|bsf|bsr|imul|lar|lsl|bt|shld|shrd|cmpxchg|xadd|test|arpl)/.test(entry.name);
  const load = (op & 2) !== 0;
  let direction = '';
  if (twoRegs && dialect === 'gnu') direction = load ? '{load} ' : '{store} ';
  const name = twoRegs && dialect === 'llvm' && load && entry.name === 'mov' ? 'mov.s' : entry.name;
  if (dialect === 'llvm' && /^(call|jmp)$/.test(entry.name) && /^\S+:\S+$/.test(text)) return `l${entry.name} ${text.replace(':', ', ')}`;
  if (dialect === 'llvm') {
    // what llvm-mc's Intel syntax cannot size: call rel16 (it writes calll), ret / retf / iret / pushf / popf by size
    const imm = text ? ` $${text}` : '';
    if (rel && entry.name === 'call' && mode === 16) return att(`callw ${text}`);
    if (/^retw?$/.test(entry.name)) return att(`${mode === 16 || entry.name === 'retw' ? 'retw' : mode === 32 ? 'retl' : 'retq'}${imm}`);
    if (/^retf[wq]?$/.test(entry.name)) return att(`lret${entry.name === 'retfw' || mode === 16 ? 'w' : entry.name === 'retfq' ? 'q' : 'l'}${imm}`);
    if (/^iret[wdq]?$/.test(entry.name)) return att(`iret${entry.name === 'iretw' || mode === 16 ? 'w' : entry.name === 'iretq' ? 'q' : 'l'}`);
    // push / pop of a segment register (llvm-mc's Intel syntax takes the 16 bit form), mov of one to a 16 bit register
    // (it leaves out the 66)
    if (/^(push|pop) [A-Z]S$/.test(`${entry.name} ${text}`)) return att(`${entry.name}${{ 16: 'w', 32: 'l', 64: 'q' }[mode]} %${text.toLowerCase()}`);
    if (entry.name === 'mov' && entry.asm === 'rm16, sreg' && mode !== 16) return att(`movw %${text.split(', ')[1]}, %${text.split(', ')[0]}`);
    if (/^(pushf|popf)[wdq]?$/.test(entry.name)) return att(`${entry.name.match(/^(pushf|popf)/)[1]}${entry.name.endsWith('w') || mode === 16 ? 'w' : entry.name.endsWith('d') ? 'l' : 'q'}`);
  }
  const line = entry.asm.startsWith('~') ? `${name}${text}` : `${name}${text ? ' ' + text : ''}`;
  return `${direction}${line}`;
}

function _assembled({ dir, lines, header, assemble, objdump }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, [...header, ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  try {
    assemble({ source, object: join(dir, 'cases.o') });
  } catch (e) {
    const text = readFileSync(source, 'utf8').split('\n');
    const errors = [...String(e.stderr).matchAll(/cases\.s:(\d+):(?:\d+:)? (?:Error|error): ([^\n]*)/g)];
    for (const [, n, message] of errors.slice(0, 40)) console.error(`${text[n - 1].trim()}: ${message}`);
    throw new Error(`the assembler refused ${errors.length} lines`);
  }
  return _bytesByLabel(execFileSync(OBJDUMP, ['-d', '-z', '-M', objdump, join(dir, 'cases.o')], { encoding: 'utf8', maxBuffer: 2 ** 30 }));
}

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

const _gnu = ({ dir, lines, set }) => _assembled({
  dir, lines, header: [...set.gnu.map((d) => `\t${d}`), '\t.intel_syntax noprefix', '\t.allow_index_reg'], objdump: set.objdump,
  assemble: ({ source, object }) => execFileSync(GAS, [set.as, '-o', object, source], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' }),
});

const _llvm = ({ dir, lines, set }) => _assembled({
  dir, lines, header: [`\t.code${set.mode}`, '\t.intel_syntax noprefix'], objdump: set.objdump,
  assemble: ({ source, object }) => execFileSync(join(LLVM, 'llvm-mc'), [`-triple=${set.triple}`, '-filetype=obj', '-o', object, source], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8', maxBuffer: 2 ** 30 }),
});

// what the test accepts instead of the same bytes: the other ModRM direction of a register to register line (llvm-mc
// chooses it itself), xchg's two registers either way round (GNU as orders them itself)
function flags({ entry, operands, dialect, line }) {
  if (regreg(entry, operands) && entry.name === 'xchg') return { eitherOrder: true };
  if (regreg(entry, operands) && dialect === 'llvm' && !line.startsWith('mov.s')) return { eitherDirection: true };
  return {};
}

const version = {
  gnu: () => execFileSync(GAS, ['--version'], { encoding: 'utf8' }).split('\n')[0],
  llvm: () => `llvm-mc ${execFileSync(join(LLVM, 'llvm-mc'), ['--version'], { encoding: 'utf8' }).match(/version\s+(\S+)/)[1]}`,
};

const dir = mkdtempSync(join(tmpdir(), 'sliderule-x86-'));
try {
  for (const [file, set] of Object.entries(SETS).filter(([file]) => !process.env.SETS || process.env.SETS.split(',').includes(file))) {
    const codec = isas.find((i) => i.value === set.value).codec;
    const usable = (c) => !_twin({ codec, ...c, mode: set.mode });
    const all = allCases({ codec }).filter(usable);
    for (let seed = 1; seed < 64; seed++) {
      const have = new Set(all.map((c) => c.id));
      const without = new Set(codec.encodable.map((e) => e.id).filter((id) => !have.has(id)));
      if (!without.size) break;
      all.push(...allCases({ codec, seed }).filter((c) => without.has(c.id) && usable(c)).slice(0, 2 * without.size));
    }
    for (const [dialect, assemble] of [['gnu', _gnu], ['llvm', _llvm]]) {
      const lines = all.map((c, i) => _line({ ...c, dialect, i, mode: set.mode }));
      const bytes = assemble({ dir, lines, set });
      const vectors = all.map((c, i) => ({ id: c.id, operands: c.operands, assembly: lines[i], bytes: bytes[i], ...flags({ ...c, dialect, line: lines[i] }) }));
      const missing = vectors.filter((v) => !v.bytes || !v.bytes.length);
      if (missing.length) throw new Error(`${file} ${dialect}: no bytes for ${missing.slice(0, 5).map((v) => v.assembly).join('; ')}`);
      writeFileSync(new URL(`./vectors/${file}-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
      console.log(`${file}: ${vectors.length} vectors from ${version[dialect]()}`);
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
