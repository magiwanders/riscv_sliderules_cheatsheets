// Assembles the MIPS32 and MIPS64 test cases (test/cases.mjs) with GNU as and llvm-mc and stores the words in
// test/vectors/mips{32,64}-{gnu,llvm}.json, which mips.test.mjs compares the sliderule against.
//
//   npm run vectors:mips   (MIPS_PREFIX=/path/to/binutils-build/ with gas/as-new and binutils/objdump, or a
//                           mips64-elf- prefix; LLVM_MC_BIN=/path/to/llvm/bin with llvm-mc built for Mips)
//
// How a case is written for them: a branch offset counts from the delay slot, which GNU as wants as an address
// (.+offset+4) and llvm-mc as the number itself; div and its kin are written with $zero first, as both read the
// manual's two operand form as a macro (with a divide by zero check). Left out: what the manual calls UNPREDICTABLE and
// the assemblers refuse (jalr with rd = rs, bit fields outside the register).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const local = (...path) => join(homedir(), '.local', 'src', ...path);
const BUILD = local('binutils-build-mips');
const GAS = process.env.MIPS_PREFIX ? `${process.env.MIPS_PREFIX}as` : existsSync(join(BUILD, 'gas', 'as-new')) ? join(BUILD, 'gas', 'as-new') : 'mips64-elf-as';
const OBJDUMP = process.env.MIPS_PREFIX ? `${process.env.MIPS_PREFIX}objdump` : existsSync(join(BUILD, 'binutils', 'objdump')) ? join(BUILD, 'binutils', 'objdump') : 'mips64-elf-objdump';
const LLVM = process.env.LLVM_MC_BIN || local('llvm-project', 'build-mc', 'bin');

// The base instruction a case's immediate goes to (a pseudo-instruction's expansion).
const baseOf = (entry) => (entry.pseudo ? entry.expansions[0].base : entry);
const pcRelative = (inst) => inst.segments.some((s) => s.kind === 'imm' && s.name === 'offset' && s.immBits[0] === 17);

// The bit fields each extract / insert takes (the manual's restrictions): pos + size from minEnd to maxEnd, size at
// least 1 (or above 32).
const BIT_FIELDS = { ext: [1, 32], ins: [1, 32], dext: [1, 63], dins: [1, 32], dextm: [33, 64, 33], dinsm: [33, 64, 2], dextu: [33, 64], dinsu: [33, 64] };
function _bitFieldValid({ entry, values }) {
  if (!('lsb' in values)) return true;
  const pos = values.lsb + (entry.posBias || 0);
  const size = 'msbd' in values ? values.msbd + 1 + (entry.sizeBias || 0) : values.msb + (entry.msbBias || 0) - pos + 1;
  const [minEnd, maxEnd, minSize = 1] = BIT_FIELDS[entry.name];
  return size >= minSize && pos + size >= minEnd && pos + size <= maxEnd;
}

function _usable({ entry, values }) {
  if (['jalr', 'jalr.hb'].includes(entry.name) && values.rd === values.rs) return false;
  return _bitFieldValid({ entry, values });
}

function _line({ entry, operands, values, dialect }) {
  let text = operands;
  if (/^d?divu?$/.test(entry.name)) text = `$zero, ${text}`;
  if (pcRelative(baseOf(entry)) && dialect === 'gnu') {
    const off = values.imm;
    text = text.replace(new RegExp(`${String(off).replace('-', '\\-')}$`), `.+${off + 4}`).replace('+-', '-');
  }
  return `${entry.name}${text ? ' ' + text : ''}`;
}

function _gnu({ dir, lines, xlen }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, ['\t.set noreorder', '\t.set noat', ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`, '\tnop']), ''].join('\n'));
  execFileSync(GAS, [`-march=mips${xlen}r2`, `-mabi=${xlen === 64 ? '64' : '32'}`, '-o', join(dir, 'cases.o'), source], { stdio: ['ignore', 'ignore', 'inherit'] });
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

function _llvm({ dir, lines, xlen }) {
  const source = join(dir, 'cases.s');
  writeFileSync(source, ['\t.set noreorder', '\t.set noat', ...lines.flatMap((l, i) => [`c${i}:`, `\t${l}`]), ''].join('\n'));
  const out = execFileSync(join(LLVM, 'llvm-mc'), [`-triple=${xlen === 64 ? 'mips64el' : 'mipsel'}`, `-mcpu=mips${xlen}r2`, `-target-abi=${xlen === 64 ? 'n64' : 'o32'}`, '-show-encoding', source],
    { encoding: 'utf8', maxBuffer: 2 ** 28, stdio: ['ignore', 'pipe', 'inherit'] });
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

const dir = mkdtempSync(join(tmpdir(), 'sliderule-mips-'));
try {
  for (const xlen of [32, 64]) {
    const codec = isas.find((i) => i.value === `mips${xlen}`).codec;
    const cases = allCases({ codec }).filter(_usable);
    for (const [dialect, assemble] of [['gnu', _gnu], ['llvm', _llvm]]) {
      const lines = cases.map((c) => _line({ ...c, dialect }));
      const words = assemble({ dir, lines, xlen });
      const vectors = cases.map((c, i) => ({ id: c.id, operands: c.operands, assembly: lines[i], word: words[i] }));
      const missing = vectors.filter((v) => !v.word);
      if (missing.length) throw new Error(`${dialect} MIPS${xlen}: no word for ${missing.slice(0, 5).map((v) => v.assembly).join('; ')}`);
      writeFileSync(new URL(`./vectors/mips${xlen}-${dialect}.json`, import.meta.url), JSON.stringify({ reference: version[dialect](), vectors }) + '\n');
      console.log(`MIPS${xlen}: ${vectors.length} vectors from ${version[dialect]()}`);
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
