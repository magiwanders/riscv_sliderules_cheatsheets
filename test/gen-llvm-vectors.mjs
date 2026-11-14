// Assembles the test cases (test/cases.mjs) with LLVM's llvm-mc and stores the resulting words in
// test/vectors/llvm-mc.json, the second assembler llvm.test.mjs compares the sliderule encoder against (the first is
// GNU as, gen-gnu-vectors.mjs). LLVM's TableGen is one of the sources the sheet is generated from, so this checks the
// generator end to end; GNU as is the independent one.
//
//   npm run vectors:llvm       (needs llvm-mc and llvm-objdump with the RISC-V target; LLVM_BIN=/path/to/llvm/bin)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allCases } from './cases.mjs';
import { assemblerText, assemblable } from './riscv-text.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'vectors', 'llvm-mc.json');
const MATTR = '+m,+a,+f,+d,+c,+zicsr,+zifencei,+zihintpause,-relax';

function _bin(tool) {
  if (process.env.LLVM_BIN) return join(process.env.LLVM_BIN, tool);
  const local = join(homedir(), '.local', 'src', 'llvm-project', 'build', 'bin', tool);
  return existsSync(local) ? local : tool;
}

function _assemble({ lines = [], rvc = false }) {
  const dir = mkdtempSync(join(tmpdir(), 'sliderule-llvm-'));
  try {
    const source = join(dir, 'cases.s');
    const object = join(dir, 'cases.o');
    writeFileSync(source, [`.option ${rvc ? 'rvc' : 'norvc'}`, ...lines.flatMap((line, i) => [`case${i}:`, `  ${line}`]), ''].join('\n'));
    execFileSync(_bin('llvm-mc'), ['-triple=riscv32', `-mattr=${MATTR}`, '-filetype=obj', '-o', object, source], { stdio: ['ignore', 'ignore', 'inherit'] });
    const dump = execFileSync(_bin('llvm-objdump'), ['-d', '-M', 'no-aliases', `--mattr=${MATTR}`, object], { encoding: 'utf8' });
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

const cases = assemblable(allCases());
const vectors = [];
for (const rvc of [false, true]) {
  const group = cases.filter(({ entry }) => (entry.width === 16) === rvc);
  const lines = group.map((c) => assemblerText({ ...c, dialect: 'llvm' }));
  const words = _assemble({ lines, rvc });
  group.forEach((c, i) => vectors.push({ id: c.id, operands: c.operands, ordering: c.ordering, llvm: lines[i], words: words[i] }));
}
const version = execFileSync(_bin('llvm-mc'), ['--version'], { encoding: 'utf8' }).match(/LLVM version (\S+)/)[1];
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ assembler: `llvm-mc ${version}`, mattr: MATTR, vectors }, null, 1) + '\n');
console.log(`${vectors.length} vectors from llvm-mc ${version} → ${OUT}`);
