// The second, independent assembler for each retro set: assembles the 6502 test cases with ca65 / ld65 (cc65) and the
// Z80 ones with sjasmplus, and stores the bytes in test/vectors/mos6502-ca65.json and test/vectors/z80-sjasmplus.json,
// which retro.test.mjs compares the sliderule against next to py65's and skoolkit's (gen-retro-vectors.mjs).
//
//   npm run vectors:retro-asm   (CC65_BIN=/path/to/cc65/bin, SJASMPLUS=/path/to/sjasmplus; both build from source in seconds)
//
// One assembler run per case, so a case an assembler reads differently cannot shift the bytes of the next one.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const PC = 0x4000;
const local = (...path) => join(homedir(), '.local', 'src', ...path);
const CC65 = process.env.CC65_BIN || (existsSync(local('cc65', 'bin', 'ca65')) ? local('cc65', 'bin') : '');
const SJASMPLUS = process.env.SJASMPLUS || (existsSync(local('sjasmplus', 'sjasmplus')) ? local('sjasmplus', 'sjasmplus') : 'sjasmplus');
const codecOf = (value) => isas.find((i) => i.value === value).codec;

// As gen-retro-vectors.mjs: relative operands as the address they reach, cases with a shorter twin left out.
function _line({ encoded = {} }) {
  const { inst, fields, assembly } = encoded;
  const target = inst.immName && inst.immSigned ? `$${(PC + inst.width / 8 + fields.imm).toString(16)}` : null;
  return (target ? assembly.replace(/-?\d+$/, target) : assembly).replace(/, /g, ',');
}

function _hasShorterTwin({ encoded = {} }) {
  const { inst, fields } = encoded;
  return (['ABS', 'ABX', 'ABY'].includes(inst.format) && fields.imm < 256) || (inst.groupKey === 'ed-nn' && fields.dd === 2);
}

function _cases({ codec }) {
  return allCases({ codec }).map((c) => ({ ...c, encoded: codec.encodeEntry({ entry: c.entry, operands: c.operands }).words[0] }))
    .filter((c) => !_hasShorterTwin(c)).map((c) => ({ ...c, line: _line(c) }));
}

function _ca65({ dir, line }) {
  const bin = (tool) => (CC65 ? join(CC65, tool) : tool);
  // .org makes the code absolute, so a branch can name the address it reaches
  writeFileSync(join(dir, 'case.s'), `.setcpu "6502"\n.org $${PC.toString(16)}\n${line}\n`);
  writeFileSync(join(dir, 'case.cfg'), `MEMORY { RAM: start = $${PC.toString(16)}, size = $1000, file = %O; }\nSEGMENTS { CODE: load = RAM, type = rw; }\n`);
  execFileSync(bin('ca65'), ['-o', join(dir, 'case.o'), join(dir, 'case.s')], { stdio: ['ignore', 'ignore', 'inherit'] });
  execFileSync(bin('ld65'), ['-C', join(dir, 'case.cfg'), '-o', join(dir, 'case.bin'), join(dir, 'case.o')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return [...readFileSync(join(dir, 'case.bin'))];
}

function _sjasmplus({ dir, line }) {
  writeFileSync(join(dir, 'case.asm'), ` ORG $${PC.toString(16)}\n ${line}\n`);
  execFileSync(SJASMPLUS, ['--nologo', '--msg=err', `--raw=${join(dir, 'case.bin')}`, join(dir, 'case.asm')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return [...readFileSync(join(dir, 'case.bin'))];
}

// The first line an assembler prints for --version, on whichever stream it uses.
function _version(tool) {
  const { stdout, stderr } = spawnSync(tool, ['--version'], { encoding: 'utf8' });
  return `${stdout}${stderr}`.trim().split('\n')[0].replace(/ \(.*$/, '');
}

// ca65 refuses JMP ($xxFF), whose pointer the NMOS 6502 reads across a page wrongly; the encoding exists all the same.
const _jmpPageBug = ({ encoded }) => encoded.inst.format === 'IND' && (encoded.fields.imm & 0xff) === 0xff;

const SETS = [
  { file: 'mos6502-ca65', codec: codecOf('6502'), assemble: _ca65, refused: _jmpPageBug, version: () => _version(CC65 ? join(CC65, 'ca65') : 'ca65') },
  { file: 'z80-sjasmplus', codec: codecOf('z80'), assemble: _sjasmplus, refused: () => false, version: () => _version(SJASMPLUS) },
];

const dir = mkdtempSync(join(tmpdir(), 'sliderule-retro-'));
try {
  for (const { file, codec, assemble, refused, version } of SETS) {
    const name = version();
    const vectors = _cases({ codec }).filter((c) => !refused(c))
      .map((c) => ({ id: c.id, operands: c.operands, assembly: c.line, bytes: assemble({ dir, line: c.line }) }));
    writeFileSync(new URL(`./vectors/${file}.json`, import.meta.url), JSON.stringify({ reference: name, vectors }) + '\n');
    console.log(`${vectors.length} vectors from ${name}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
