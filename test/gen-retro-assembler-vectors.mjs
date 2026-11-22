// The assemblers of the retro sets: assembles the 6502 test cases with ca65 / ld65 (cc65) and the Z80 ones with
// sjasmplus, the second assembler of each next to py65's and skoolkit's (gen-retro-vectors.mjs), the 8080 and 8051 ones
// with two each: the Macro Assembler AS (asl) and ASxxxx's as8085 / as8051. Stores the bytes in test/vectors/<set>-<assembler>.json, which
// retro.test.mjs compares the sliderule against.
//
//   npm run vectors:retro-asm   (CC65_BIN=/path/to/cc65/bin, SJASMPLUS=/path/to/sjasmplus, ASL=/path/to/asl (p2bin next
//                                to it), ASXXXX_BIN=/path/to/asxxxx/exe; all build from source in seconds)
//
// One assembler run per case, so a case an assembler reads differently cannot shift the bytes of the next one.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { allCases, everyEncoding } from './cases.mjs';
import { isas } from '../src/isa/isas.mjs';

const PC = 0x4000;
const local = (...path) => join(homedir(), '.local', 'src', ...path);
const CC65 = process.env.CC65_BIN || (existsSync(local('cc65', 'bin', 'ca65')) ? local('cc65', 'bin') : '');
const SJASMPLUS = process.env.SJASMPLUS || (existsSync(local('sjasmplus', 'sjasmplus')) ? local('sjasmplus', 'sjasmplus') : 'sjasmplus');
const ASL = process.env.ASL || (existsSync(local('asl', 'asl-current', 'asl')) ? local('asl', 'asl-current', 'asl') : 'asl');
const ASXXXX = process.env.ASXXXX_BIN || local('asxxxx', 'asxv6pxx', 'asxmak', 'linux', 'exe');
const codecOf = (value) => isas.find((i) => i.value === value).codec;

// As gen-retro-vectors.mjs: relative operands as the address they reach, cases with a shorter twin left out.
function _line({ encoded = {} }) {
  const { inst, fields, assembly } = encoded;
  const target = inst.immName && inst.immSigned ? `$${(PC + inst.width / 8 + fields.imm).toString(16)}` : null;
  return (target ? assembly.replace(/-?\d+$/, target) : assembly).replace(/, /g, ',');
}

function _hasShorterTwin({ codec, encoded = {} }) {
  const { inst, fields } = encoded;
  if (codec.spec.name === '6502') return ['ABS', 'ABX', 'ABY'].includes(inst.format) && fields.imm < 256;
  return codec.spec.name === 'Z80' && inst.groupKey === 'ed-nn' && fields.dd === 2;
}

// every: also every combination of the register operands (every opcode), for the 8080
function _cases({ codec, every = false }) {
  return [...allCases({ codec }), ...(every ? everyEncoding({ codec }) : [])].map((c) => ({ ...c, encoded: codec.encodeEntry({ entry: c.entry, operands: c.operands }).words[0] }))
    .filter((c) => !_hasShorterTwin({ ...c, codec })).map((c) => ({ ...c, line: _line(c) }));
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

// Intel's hex for the 8080 assemblers: $3a is 03AH (a leading digit), and as8085 marks immediate data with #.
const _intelHex = (line) => line.replace(/\$([0-9a-f]+)/gi, (_, digits) => `0${digits.toUpperCase()}H`);
// The 8051 assemblers take the address a relative offset reaches, and the whole address of AJMP / ACALL (in the 2 KB
// block of the next instruction).
function _mcs51Targets({ line, encoded }) {
  const { inst, fields } = encoded;
  const next = PC + inst.width / 8;
  if ('rel' in fields) return line.replace(/-?\d+$/, `$${(next + fields.rel).toString(16)}`);
  if (inst.immName === 'addr11') return line.replace(/\$[0-9a-f]+$/, `$${((next & 0xf800) | fields.imm).toString(16)}`);
  return line;
}

const _asxxxxHex = ({ line, encoded }) => line.replace(/\$([0-9a-f]+)/gi, (_, digits) => `${['data', 'data16'].includes(encoded.inst.immName) ? '#' : ''}0x${digits}`);

function _asl({ dir, line }) {
  writeFileSync(join(dir, 'case.asm'), ` cpu 8080\n org ${PC.toString(16)}h\n ${line}\n`);
  execFileSync(ASL, ['-q', '-o', join(dir, 'case.p'), join(dir, 'case.asm')], { stdio: ['ignore', 'ignore', 'inherit'] });
  execFileSync(join(ASL, '..', 'p2bin'), ['-q', join(dir, 'case.p'), join(dir, 'case.bin')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return [...readFileSync(join(dir, 'case.bin'))];
}

// as8085 in its 8080 mode; the bytes from the object file's T records (each starts with its 16 bit address)
function _as8085({ dir, line }) {
  writeFileSync(join(dir, 'case.asm'), `\t.8080\n\t.area\tCODE (ABS)\n\t.org\t0x${PC.toString(16)}\n\t${line}\n`);
  execFileSync(join(ASXXXX, 'as8085'), ['-o', join(dir, 'case.asm')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return readFileSync(join(dir, 'case.rel'), 'utf8').split('\n').filter((l) => l.startsWith('T ')).flatMap((l) => l.trim().split(/\s+/).slice(3).map((b) => parseInt(b, 16)));
}

function _asl51({ dir, line }) {
  writeFileSync(join(dir, 'case.asm'), ` cpu 8051\n org ${PC.toString(16)}h\n ${line}\n`);
  execFileSync(ASL, ['-q', '-o', join(dir, 'case.p'), join(dir, 'case.asm')], { stdio: ['ignore', 'ignore', 'inherit'] });
  execFileSync(join(ASL, '..', 'p2bin'), ['-q', join(dir, 'case.p'), join(dir, 'case.bin')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return [...readFileSync(join(dir, 'case.bin'))];
}

// as8051 leaves relative offsets to its linker: the bytes from aslink's Intel HEX
function _as8051({ dir, line }) {
  writeFileSync(join(dir, 'case.asm'), `\t.area\tCODE (ABS)\n\t.org\t0x${PC.toString(16)}\n\t${line}\n`);
  execFileSync(join(ASXXXX, 'as8051'), ['-o', join(dir, 'case.asm')], { stdio: ['ignore', 'ignore', 'inherit'] });
  execFileSync(join(ASXXXX, 'aslink'), ['-i', join(dir, 'case'), join(dir, 'case.rel')], { stdio: ['ignore', 'ignore', 'inherit'] });
  const memory = new Map();
  for (const record of readFileSync(join(dir, 'case.hex'), 'utf8').split('\n').filter((l) => l.startsWith(':'))) {
    const bytes = record.slice(1).match(/../g).map((b) => parseInt(b, 16));
    if (bytes[3] === 0) bytes.slice(4, 4 + bytes[0]).forEach((b, k) => memory.set(bytes[1] * 256 + bytes[2] + k, b));
  }
  const bytes = [];
  for (let a = PC; memory.has(a); a++) bytes.push(memory.get(a));
  return bytes;
}

// The first line an assembler prints for --version (or the given flag, or none), on whichever stream it uses.
function _version(tool, flags = ['--version']) {
  const { stdout, stderr } = spawnSync(tool, flags, { encoding: 'utf8' });
  return `${stdout}${stderr}`.trim().split('\n')[0].replace(/ \(.*$/, '').replace(/\s+/g, ' ').trim();
}

// ca65 refuses JMP ($xxFF), whose pointer the NMOS 6502 reads across a page wrongly; the encoding exists all the same.
const _jmpPageBug = ({ encoded }) => encoded.inst.format === 'IND' && (encoded.fields.imm & 0xff) === 0xff;

const SETS = [
  { file: 'mos6502-ca65', codec: codecOf('6502'), assemble: _ca65, refused: _jmpPageBug, version: () => _version(CC65 ? join(CC65, 'ca65') : 'ca65') },
  { file: 'z80-sjasmplus', codec: codecOf('z80'), assemble: _sjasmplus, refused: () => false, version: () => _version(SJASMPLUS) },
  { file: 'mcs51-asl', codec: codecOf('8051'), every: true, assemble: _asl51, refused: () => false, write: (c) => _intelHex(_mcs51Targets(c)), version: () => _version(ASL, ['-version']) },
  { file: 'mcs51-as8051', codec: codecOf('8051'), every: true, assemble: _as8051, refused: () => false, write: (c) => _mcs51Targets(c).replace(/\$([0-9a-f]+)/gi, '0x$1'), version: () => _version(join(ASXXXX, 'as8051'), []) },
  { file: 'i8080-asl', codec: codecOf('8080'), every: true, assemble: _asl, refused: () => false, write: ({ line }) => _intelHex(line), version: () => _version(ASL, ['-version']) },
  { file: 'i8080-as8085', codec: codecOf('8080'), every: true, assemble: _as8085, refused: () => false, write: _asxxxxHex, version: () => _version(join(ASXXXX, 'as8085'), []) },
];

const dir = mkdtempSync(join(tmpdir(), 'sliderule-retro-'));
try {
  for (const { file, codec, every, assemble, refused, write = ({ line }) => line, version } of SETS) {
    const name = version();
    const vectors = _cases({ codec, every }).filter((c) => !refused(c)).map((c) => ({ ...c, line: write(c) }))
      .map((c) => ({ id: c.id, operands: c.operands, assembly: c.line, bytes: assemble({ dir, line: c.line }) }));
    writeFileSync(new URL(`./vectors/${file}.json`, import.meta.url), JSON.stringify({ reference: name, vectors }) + '\n');
    console.log(`${vectors.length} vectors from ${name}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
