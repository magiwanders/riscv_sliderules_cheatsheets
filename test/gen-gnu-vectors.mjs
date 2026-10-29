// Assembles the test cases (test/cases.mjs) with GNU as and stores the resulting words in test/vectors/gnu-as.json,
// the reference gnu.test.mjs compares the sliderule encoder against.
//
//   npm run vectors            (needs riscv-none-elf-as / -objdump, e.g. the xPack GNU RISC-V toolchain)
//   RISCV_PREFIX=/path/to/riscv64-unknown-elf- npm run vectors
//   npm run vectors -- --source   (only print the GNU assembly, no toolchain needed)
//
// PC-relative operands are written as ".+offset" for GNU (a bare number is an absolute address there), negative
// c.lui values as 0xfffe0-0xfffff. Pseudo-instructions that need relocations (call, tail, la, global loads and
// stores) are left out: their encoding depends on the linker.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allCases } from './cases.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'vectors', 'gnu-as.json');
const MARCH = 'rv32gc_zicsr_zifencei_zihintpause';
const PC_RELATIVE = ['branch', 'jal', 'c.jal', 'c.j', 'c.branch'];
const RELOCATED = ['call', 'tail', 'la', 'lla', 'lb', 'lh', 'lw', 'sb', 'sh', 'sw', 'flw', 'fld', 'fsw', 'fsd'];

function _prefix() {
  if (process.env.RISCV_PREFIX) return process.env.RISCV_PREFIX;
  const opt = join(homedir(), '.local', 'opt');
  const xpack = existsSync(opt) ? readdirSync(opt).filter((d) => d.startsWith('xpack-riscv-none-elf-gcc-')).sort().pop() : null;
  return xpack ? join(opt, xpack, 'bin', 'riscv-none-elf-') : 'riscv-none-elf-';
}

// The base instruction a case's immediate ends up in (pseudo-instructions: the first expansion using it).
function _immBase({ entry = {} }) {
  if (!entry.pseudo) return entry;
  const x = entry.expansions.find(({ base, mapping }) => base.segments.some((s) => s.kind === 'imm') && typeof mapping.imm !== 'number');
  return x ? x.base : null;
}

function _gnuText({ entry = {}, operands = '', ordering = '', values = {} }) {
  let text = operands;
  const base = _immBase({ entry });
  if (values.imm !== undefined && base) {
    const imm = String(values.imm);
    let gnu = imm;
    if (PC_RELATIVE.includes(base.group)) gnu = `.${values.imm >= 0 ? '+' : ''}${values.imm}`;
    else if (base.name === 'c.lui' && values.imm < 0) gnu = `0x${(values.imm & 0xfffff).toString(16)}`;
    // the immediate is the only operand written as a plain number, replace that occurrence
    text = text.replace(new RegExp(`(^|[ ,(])${imm.replace('-', '\\-')}(?=$|[,(])`), `$1${gnu}`);
  }
  return `${entry.name}${ordering ? '.' + ordering : ''}${text ? ' ' + text : ''}`;
}

function _assemble({ prefix = '', lines = [], rvc = false }) {
  const dir = mkdtempSync(join(tmpdir(), 'sliderule-vectors-'));
  try {
    const source = join(dir, 'cases.s');
    const object = join(dir, 'cases.o');
    writeFileSync(source, [`.option ${rvc ? 'rvc' : 'norvc'}`, '.option norelax', ...lines.flatMap((line, i) => [`case${i}:`, `  ${line}`]), ''].join('\n'));
    execFileSync(`${prefix}as`, [`-march=${MARCH}`, '-mabi=ilp32d', '-mno-relax', '-o', object, source], { stdio: ['ignore', 'ignore', 'inherit'] });
    const dump = execFileSync(`${prefix}objdump`, ['-d', '-M', 'no-aliases,numeric', object], { encoding: 'utf8' });
    const words = lines.map(() => []);
    let current = -1;
    for (const line of dump.split('\n')) {
      const label = line.match(/^[0-9a-f]+ <case(\d+)>:/);
      if (label) current = Number(label[1]);
      const insn = line.match(/^\s+[0-9a-f]+:\s+([0-9a-f]{4}|[0-9a-f]{8})\s/);
      if (insn && current >= 0) words[current].push(`0x${insn[1].padStart(8, '0')}`);
    }
    return words;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const prefix = _prefix();
const cases = allCases().filter(({ entry }) => !(entry.pseudo && RELOCATED.includes(entry.name)));
if (process.argv.includes('--source')) {
  for (const c of cases) console.log(`${_gnuText(c).padEnd(44)} # ${c.entry.name} ${c.operands}`);
  process.exit(0);
}
const vectors = [];
for (const rvc of [false, true]) {
  const group = cases.filter(({ entry }) => (entry.width === 16) === rvc);
  const lines = group.map((c) => _gnuText(c));
  const words = _assemble({ prefix, lines, rvc });
  group.forEach((c, i) => vectors.push({ id: c.id, operands: c.operands, ordering: c.ordering, gnu: lines[i], words: words[i] }));
}
const version = execFileSync(`${prefix}as`, ['--version'], { encoding: 'utf8' }).split('\n')[0];
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ assembler: version, march: MARCH, vectors }, null, 1) + '\n');
console.log(`${vectors.length} vectors from ${version} → ${OUT}`);
