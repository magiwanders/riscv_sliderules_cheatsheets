// Assembles the A64 test cases (test/cases.mjs) with GNU as and llvm-mc and stores the words in
// test/vectors/a64-{gnu,llvm}.json, which a64.test.mjs compares the sliderule against.
//
//   npm run vectors:a64   (AARCH64_PREFIX=/path/to/binutils-build/ with gas/as-new and binutils/objdump, or an
//                          aarch64-elf- prefix; LLVM_MC_BIN=/path/to/llvm/bin with llvm-mc built for AArch64)
//
// How a case is written: a PC-relative offset is an address for GNU as (.+offset), the number itself for llvm-mc. GNU as
// leaves ADRP to the linker (a relocation), so ADRP is checked against llvm-mc only. Left out: what the Arm ARM calls
// CONSTRAINED UNPREDICTABLE and the assemblers refuse (writeback to the transferred register, a load pair into one
// register, an exclusive store whose status register is another operand).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const local = (...path) => join(homedir(), '.local', 'src', ...path);
const BUILD = local('binutils-build-aarch64');
const tool = (name, sub) => (process.env.AARCH64_PREFIX ? `${process.env.AARCH64_PREFIX}${name}` : existsSync(join(BUILD, sub)) ? join(BUILD, sub) : `aarch64-elf-${name}`);
const GAS = tool('as', join('gas', 'as-new'));
const OBJDUMP = tool('objdump', join('binutils', 'objdump'));
const LLVM = process.env.LLVM_MC_BIN || local('llvm-project', 'build-mc', 'bin');

const pcRelative = (entry) => entry.segments.some((s) => s.kind === 'imm' && ['label', 'page'].includes(s.name));
const isAdrp = (entry) => entry.segments.some((s) => s.kind === 'imm' && s.name === 'page');

// The general registers an entry transfers (t, t2), its base and its status register.
function _usable({ entry, values }) {
  const has = (k) => values[k] !== undefined;
  const t = ['wt', 'xt'].find(has);
  const t2 = ['wt2', 'xt2'].find(has);
  const n = values.xn_sp;
  const writeback = /\]!$|\], #/.test(entry.asm);
  if (writeback && n !== 31 && ((t && values[t] === n) || (t2 && values[t2] === n))) return false;
  // a load pair into one register, general or floating-point
  const pair = [['wt', 'wt2'], ['xt', 'xt2'], ['st', 'st2'], ['dt', 'dt2'], ['qt', 'qt2']].find(([a]) => has(a) && has(`${a}2`));
  if (/^ld.*p/.test(entry.name) && pair && values[pair[0]] === values[pair[1]]) return false;
  if (values.ws !== undefined && ((t && values[t] === values.ws) || (t2 && values[t2] === values.ws) || (n !== 31 && n === values.ws))) return false;
  return true;
}

function _line({ entry, operands, values, dialect }) {
  let text = operands;
  if (pcRelative(entry) && dialect === 'gnu') text = text.replace(new RegExp(`${String(values.imm).replace('-', '\\-')}$`), `.${values.imm >= 0 ? '+' : ''}${values.imm}`);
  return `${entry.name}${text ? ' ' + text : ''}`;
}

function _gnu({ dir, lines }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, [...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  execFileSync(GAS, ['-o', join(dir, 'cases.o'), source], { stdio: ['ignore', 'ignore', 'inherit'] });
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
  writeFileSync(source, [...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  const out = execFileSync(join(LLVM, 'llvm-mc'), ['-triple=aarch64', '-show-encoding', source], { encoding: 'utf8', maxBuffer: 2 ** 28, stdio: ['ignore', 'pipe', 'inherit'] });
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

const dir = mkdtempSync(join(tmpdir(), 'sliderule-a64-'));
try {
  const codec = isas.find((i) => i.value === 'arm64').codec;
  const all = allCases({ codec }).filter(_usable);
  for (const [dialect, assemble] of [['gnu', _gnu], ['llvm', _llvm]]) {
    const cases = dialect === 'gnu' ? all.filter((c) => !isAdrp(c.entry)) : all;
    const lines = cases.map((c) => _line({ ...c, dialect }));
    const words = assemble({ dir, lines });
    const vectors = cases.map((c, i) => ({ id: c.id, operands: c.operands, assembly: lines[i], word: words[i] }));
    const missing = vectors.filter((v) => !v.word);
    if (missing.length) throw new Error(`${dialect}: no word for ${missing.slice(0, 5).map((v) => v.assembly).join('; ')}`);
    writeFileSync(new URL(`./vectors/a64-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
    console.log(`A64: ${vectors.length} vectors from ${version[dialect]()}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
