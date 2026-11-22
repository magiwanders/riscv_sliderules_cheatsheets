// Assembles the A32 test cases (test/cases.mjs) with GNU as and llvm-mc and stores the words in
// test/vectors/a32-{gnu,llvm}.json, which a64.test.mjs compares the sliderule against.
//
//   npm run vectors:a32   (ARM_PREFIX=/path/to/binutils-build/ with gas/as-new and binutils/objdump, or an
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

const local = (...path) => join(homedir(), '.local', 'src', ...path);
const BUILD = local('binutils-build-arm');
const tool = (name, sub) => (process.env.ARM_PREFIX ? `${process.env.ARM_PREFIX}${name}` : existsSync(join(BUILD, sub)) ? join(BUILD, sub) : `arm-none-eabi-${name}`);
const GAS = tool('as', join('gas', 'as-new'));
const OBJDUMP = tool('objdump', join('binutils', 'objdump'));
const LLVM = process.env.LLVM_MC_BIN || local('llvm-project', 'build-mc', 'bin');

const pcRelative = (entry) => entry.segments.some((s) => s.kind === 'imm' && s.name === 'label');
const HEADER = ['\t.syntax unified', '\t.arm', '\t.arch armv7-a', '\t.arch_extension sec', '\t.arch_extension virt', '\t.arch_extension mp', '\t.arch_extension idiv'];

// UNPREDICTABLE operands the assemblers refuse.
function _usable({ entry, values }) {
  // bit fields inside the register
  if (['sbfx', 'ubfx'].includes(entry.name) && values.lsb + values.widthm1 + 1 > 32) return false;
  if (['bfi', 'bfc'].includes(entry.name) && values.msb < values.lsb) return false;
  // swp's base apart from its registers; ldm with writeback not loading its base
  if (/^swp/.test(entry.name) && (values.rn === values.rt || values.rn === values.rt2)) return false;
  // an exclusive store's status register apart from its base and the second register of a pair
  if (/^strex/.test(entry.name) && (values.rd === values.rn || (values.rtd !== undefined && values.rd === values.rtd + 1))) return false;
  if (/!, reglist/.test(entry.asm) && (values.reglist >> values.rn) & 1) return false;
  // a writeback load or store whose base is a register it transfers
  const writeback = /\]!|\], /.test(entry.asm);
  const transferred = [values.rt, values.rtd, values.rtd !== undefined ? values.rtd + 1 : undefined].filter((v) => v !== undefined);
  if (writeback && values.rn !== 15 && transferred.includes(values.rn)) return false;
  // a user-registers load with writeback is an exception return: pc in the list
  if (/^ldm/.test(entry.name) && /!, reglist\^/.test(entry.asm) && !((values.reglist >> 15) & 1)) return false;
  return true;
}

// GNU as knows the hints by name only (nop, yield, wfe, wfi, sev), llvm-mc as hint #n too
const HINTS = ['nop', 'yield', 'wfe', 'wfi', 'sev'];
const gnuKnows = ({ entry, values }) => entry.name !== 'hint' || values.imm < HINTS.length;
// llvm-mc refuses a user-registers store with writeback (UNPREDICTABLE), GNU as assembles it
const llvmKnows = ({ entry }) => !(/^stm/.test(entry.name) && /!, reglist\^/.test(entry.asm));

function _line({ entry, operands, values, dialect }) {
  let text = operands;
  if (pcRelative(entry)) text = text.replace(new RegExp(`${String(values.imm).replace('-', '\\-')}$`), dialect === 'gnu' ? `.+${values.imm + 8}`.replace('+-', '-') : `#${values.imm}`);
  if (entry.name === 'hint' && dialect === 'gnu') return `${HINTS[values.imm]}${text.replace(/ .*$/, '')}`;
  // a template with a mnemonic tail: the text starts with it
  if (entry.asm.startsWith('~')) return `${entry.name}${text}`;
  return `${entry.name}${text ? ' ' + text : ''}`;
}

function _gnu({ dir, lines }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, [...HEADER, ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
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
    const insn = line.match(/^\s+[0-9a-f]+:\s+([0-9a-f]{8})\s/);
    if (insn && current >= 0 && words[current] === undefined) words[current] = `0x${insn[1]}`;
  }
  return words;
}

function _llvm({ dir, lines }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, ['\t.syntax unified', ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  const out = execFileSync(join(LLVM, 'llvm-mc'), ['-triple=armv7a', '-mattr=+trustzone,+virtualization,+mp,+hwdiv-arm', '-show-encoding', source], { encoding: 'utf8', maxBuffer: 2 ** 28, stdio: ['ignore', 'pipe', 'inherit'] });
  const words = [];
  let current = -1;
  for (const line of out.split('\n')) {
    const label = line.match(/^c(\d+):/);
    if (label) current = Number(label[1]);
    const enc = line.match(/encoding: \[(0x[0-9a-f]{2}),(0x[0-9a-f]{2}),(0x[0-9a-f]{2}),(0x[0-9a-f]{2})\]/);
    if (enc && current >= 0 && words[current] === undefined) words[current] = `0x${enc.slice(1).reverse().map((b) => b.slice(2)).join('')}`;
  }
  return words;
}

const version = {
  gnu: () => execFileSync(GAS, ['--version'], { encoding: 'utf8' }).split('\n')[0],
  llvm: () => `llvm-mc ${execFileSync(join(LLVM, 'llvm-mc'), ['--version'], { encoding: 'utf8' }).match(/version\s+(\S+)/)[1]}`,
};

const dir = mkdtempSync(join(tmpdir(), 'sliderule-a32-'));
try {
  const codec = isas.find((i) => i.value === 'arm32').codec;
  const all = allCases({ codec }).filter(_usable);
  // entries whose random cases are all UNPREDICTABLE (ldmib rn!, reglist^ needs pc in the list): more seeds
  for (let seed = 1; seed < 64; seed++) {
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
    writeFileSync(new URL(`./vectors/a32-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
    console.log(`A32: ${vectors.length} vectors from ${version[dialect]()}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
