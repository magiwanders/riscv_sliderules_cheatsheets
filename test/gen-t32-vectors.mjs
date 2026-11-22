// Assembles the Thumb test cases (test/cases.mjs) with GNU as and llvm-mc and stores the words in
// test/vectors/t32-{gnu,llvm}.json, which a64.test.mjs compares the sliderule against.
//
//   npm run vectors:t32   (ARM_PREFIX=/path/to/binutils-build/ with gas/as-new and binutils/objdump, or an
//                          arm-none-eabi- prefix; LLVM_MC_BIN=/path/to/llvm/bin with llvm-mc built for AArch64)
//
// How a case is written: a PC-relative offset is an address for GNU as (.+offset), the number itself for llvm-mc. GNU as
// leaves ADRP to the linker (a relocation), so ADRP is checked against llvm-mc only. Left out: what the Arm ARM calls
// CONSTRAINED UNPREDICTABLE and the assemblers refuse (writeback to the transferred register, a load pair into one
// register, an exclusive store whose status register is another operand).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const codecOf = () => isas.find((i) => i.value === 'arm-thumb').codec;

const local = (...path) => join(homedir(), '.local', 'src', ...path);
const BUILD = local('binutils-build-arm');
const tool = (name, sub) => (process.env.ARM_PREFIX ? `${process.env.ARM_PREFIX}${name}` : existsSync(join(BUILD, sub)) ? join(BUILD, sub) : `arm-none-eabi-${name}`);
const GAS = tool('as', join('gas', 'as-new'));
const OBJDUMP = tool('objdump', join('binutils', 'objdump'));
const LLVM = process.env.LLVM_MC_BIN || local('llvm-project', 'build-mc', 'bin');

const pcRelative = (entry) => entry.segments.some((s) => (s.kind === 'imm' && ['label', 'cbl'].includes(s.name)) || ['bllabel', 'blxlabel'].includes(s.key));
const CONDS = ['eq', 'ne', 'cs', 'cc', 'mi', 'pl', 'vs', 'vc', 'hi', 'ls', 'ge', 'lt', 'gt', 'le', 'al'];
const HEADER = ['\t.syntax unified', '\t.thumb', '\t.arch armv7-a', '\t.arch_extension sec', '\t.arch_extension virt', '\t.arch_extension mp', '\t.arch_extension idiv'];

// UNPREDICTABLE operands the assemblers refuse.
function _usable({ entry, values }) {
  if (['sbfx', 'ubfx'].includes(entry.name) && values.lsb + values.widthm1 + 1 > 32) return false;
  if (['bfi', 'bfc'].includes(entry.name) && values.msb < values.lsb) return false;
  // register lists: no sp, not both lr and pc, a store no pc; a writeback base not in its own list
  const list = values.tlistl ?? values.tlists ?? values.reglist;
  if (list !== undefined && ((list >> 13) & 1 || ((list >> 14) & 1 && (list >> 15) & 1) || (values.tlists !== undefined && (list >> 15) & 1))) return false;
  if (list !== undefined && /!,/.test(entry.asm) && (list >> values.rn) & 1) return false;
  // writeback to the transferred register; cmp of two low registers is the 16 bit one
  if (/\]!|\], /.test(entry.asm) && [values.rt, values.rt2].includes(values.rn)) return false;
  if (entry.name === 'cmp' && values.rn !== undefined && values.rm !== undefined && values.rn < 8 && values.rm < 8 && /rn\[3\]/.test(entry.enc)) return false;
  if (/^strex/.test(entry.name) && values.rd === values.rn) return false;
  // twins assemblers write otherwise: #-0 is #0 to them, adds rd, rd, #imm the 8 bit immediate form
  if (/#-0\b/.test(arguments[0].operands)) return false;
  if (/^(adds|subs)$/.test(entry.name) && entry.asm === 'rdl, rnl, #imm' && values.rdl === values.rnl) return false;
  // what the sheet itself refuses (a list with registers the instruction cannot hold, push's pc)
  try {
    codecOf().encodeEntry({ entry, operands: arguments[0].operands });
  } catch {
    return false;
  }
  // IT al takes no else
  if (entry.name === 'it' && values.firstcond === 14 && values.itmask !== 8 && (values.itmask & 15) !== 0 && codecOf().operandText({ key: 'itmask', value: values.itmask, fields: values }).includes('e')) return false;
  return true;
}

// GNU as knows the hints by name only (nop, yield, wfe, wfi, sev), llvm-mc as hint #n too
const HINTS = ['nop', 'yield', 'wfe', 'wfi', 'sev'];
const gnuKnows = ({ entry, values }) => !/^hint/.test(entry.name) || values.imm < HINTS.length;
const llvmKnows = () => true;

function _line({ entry, operands, values, dialect }) {
  let text = operands;
  if (pcRelative(entry)) {
    const off = values.imm ?? Number(codecOf().operandText({ key: values.bllabel !== undefined ? 'bllabel' : 'blxlabel', value: values.bllabel ?? values.blxlabel }));
    text = text.replace(/-?\d+$/, dialect === 'gnu' ? `.+${off + 4}`.replace('+-', '-') : `#${off}`);
  }
  // adr's offset counts from Align ( PC, 4 ), the case's address + 4
  if (entry.name === 'adr' && dialect === 'gnu') text = text.replace(/#(\d+)$/, (_, n) => `.+${Number(n) + 4}`);
  if (/^hint/.test(entry.name) && dialect === 'gnu') return `${HINTS[values.imm]}${entry.name.endsWith('.w') ? '.w' : ''}`;
  const line = entry.asm.startsWith('~') ? `${entry.name}${text}` : `${entry.name}${text ? ' ' + text : ''}`;
  // the instructions of an IT block: nops of its conditions
  if (entry.name === 'it') {
    const letters = text.trim().split(' ')[0];
    const cond = values.firstcond;
    const inverse = CONDS[cond ^ 1];
    return [line, `nop${CONDS[cond] === 'al' ? '' : CONDS[cond]}`, ...[...letters].map((l) => `nop${l === 't' ? (CONDS[cond] === 'al' ? '' : CONDS[cond]) : inverse}`)].join('\n\t');
  }
  return line;
}

function _gnu({ dir, lines }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, [...HEADER, ...lines.flatMap((l, i) => ['\t.balign 4', `c${i}:`, `\t${l}`]), ''].join('\n'));
  try {
    execFileSync(GAS, ['-o', join(dir, 'cases.o'), source], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' });
  } catch (e) {
    // the lines GNU as refuses, with its message
    const text = readFileSync(source, 'utf8').split('\n');
    for (const [, n, message] of String(e.stderr).matchAll(/cases\.s:(\d+): Error: ([^\n]*)/g)) console.error(`${text[n - 1].trim()}: ${message}`);
    throw new Error('GNU as refused lines');
  }
  const dump = execFileSync(OBJDUMP, ['-d', '-z', join(dir, 'cases.o')], { encoding: 'utf8', maxBuffer: 2 ** 28 });
  const words = [];
  let current = -1;
  for (const line of dump.split('\n')) {
    const label = line.match(/<c(\d+)>:/);
    if (label) current = Number(label[1]);
    // a 32 bit Thumb instruction is printed as its two halfwords
    const insn = line.match(/^\s+[0-9a-f]+:\s+([0-9a-f]{4})(?: ([0-9a-f]{4}))?\s/);
    if (insn && current >= 0 && words[current] === undefined) words[current] = `0x${insn[1]}${insn[2] || ''}`;
  }
  return words;
}

function _llvm({ dir, lines }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, ['\t.syntax unified', '\t.thumb', ...lines.flatMap((l, i) => ['\t.balign 4', `c${i}:`, `\t${l}`]), ''].join('\n'));
  const out = execFileSync(join(LLVM, 'llvm-mc'), ['-triple=thumbv7a', '-mattr=+trustzone,+virtualization,+mp,+hwdiv-arm', '-show-encoding', source], { encoding: 'utf8', maxBuffer: 2 ** 28, stdio: ['ignore', 'pipe', 'inherit'] });
  const words = [];
  let current = -1;
  for (const line of out.split('\n')) {
    const label = line.match(/^c(\d+):/);
    if (label) current = Number(label[1]);
    // halfwords little-endian, the first one first
    const enc = line.match(/encoding: \[(0x[0-9a-f]{2}),(0x[0-9a-f]{2})(?:,(0x[0-9a-f]{2}),(0x[0-9a-f]{2}))?\]/);
    if (enc && current >= 0 && words[current] === undefined) words[current] = `0x${[enc[2], enc[1], enc[4], enc[3]].filter(Boolean).map((b) => b.slice(2)).join('')}`;
  }
  return words;
}

const version = {
  gnu: () => execFileSync(GAS, ['--version'], { encoding: 'utf8' }).split('\n')[0],
  llvm: () => `llvm-mc ${execFileSync(join(LLVM, 'llvm-mc'), ['--version'], { encoding: 'utf8' }).match(/version\s+(\S+)/)[1]}`,
};

const dir = mkdtempSync(join(tmpdir(), 'sliderule-t32-'));
try {
  const codec = isas.find((i) => i.value === 'arm-thumb').codec;
  const all = allCases({ codec }).filter(_usable);
  // entries whose random cases are all UNPREDICTABLE (ldmib rn!, reglist^ needs pc in the list): more seeds
  for (let seed = 1; seed < 1024; seed++) {
    const without = new Set(codec.encodable.map((e) => e.id).filter((id) => !all.some((c) => c.id === id)));
    if (!without.size) break;
    all.push(...allCases({ codec, seed }).filter((c) => without.has(c.id) && _usable(c)).slice(0, 2));
  }
  for (const [dialect, assemble] of [['gnu', _gnu], ['llvm', _llvm]]) {
    const cases = all.filter(dialect === 'gnu' ? gnuKnows : llvmKnows);
    const lines = cases.map((c) => _line({ ...c, dialect }));
    const words = assemble({ dir, lines });
    const vectors = cases.map((c, i) => ({ id: c.id, operands: c.operands, assembly: lines[i], word: words[i] }));
    const missing = vectors.filter((v) => !v.word);
    if (missing.length) throw new Error(`${dialect}: no word for ${missing.slice(0, 5).map((v) => v.assembly).join('; ')}`);
    writeFileSync(new URL(`./vectors/t32-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
    console.log(`Thumb: ${vectors.length} vectors from ${version[dialect]()}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
