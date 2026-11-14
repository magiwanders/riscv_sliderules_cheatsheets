// RV32 for the sliderules: every ratified extension, the sheets starting as RV32GC (RV32IMAFD + Zicsr + Zifencei + C).
//
// The instruction data is generated (src/isa/generated/rv32gc.mjs, `npm run isa`) from the official Sail model and
// LLVM's TableGen description, with src/isa/overlay/rv32gc.json for what neither has; see tools/isa/gen-rv32gc.mjs.
// This module adds what the codec needs to read it, and is RV32GC itself: withExtensions makes the instruction set of
// any other set of extensions. Encodings are written MSB-first in the notation of the spec's tables:
//   - literal bits:            0110011
//   - don't-care bits:         -----
//   - registers:               rd rs1 rs2 rs3 (5 bit), rd' rs1' rs2' (3 bit, x8-x15), vd vs1 vs2 vs3 (vector)
//   - shared registers:        rd/rs1, rd'/rs1'
//   - register constraints:    rd!=0, rd!={0,2} (not these), rs2={1,5} (only these)
//   - immediates:              imm[12|10:5], uimm[5:3], nzuimm[5:4|9:6|2|3], shamt[4:0], zimm[4:0]
//   - other fields:            aq rl rm pred succ csr[11:0], vm sew lmul ta ma, fpimm bs rnd rlist spimm r1s r2s
// nonZeroImm marks immediates that cannot be 0 although the spec calls them shamt (c.slli / c.srli / c.srai: 0 is a HINT).
// Everything else (masks, decoding, encoding, table layout) is derived from these strings.

import { formats as _formats, sections as _sections, groups as _groups, instructions as _instructions, pseudoInstructions as _pseudos,
  extensions as _extensions, unusedOpcodes as _unusedOpcodes, registers as _registers } from './generated/rv32gc.mjs';
import * as _self from './rv32gc.mjs';
import { isaString } from './riscv-extensions.mjs';

// ---------------------------------------------------------------- what the codec and the sheets need (see createCodec)

export const name = 'RV32GC';
export const spine = { width: 32, title: 'inst[31:0]' };
export const formats = _formats;
export const sections = _sections;
export const registers = _registers;
export const immediates = { imm: true, uimm: false, nzimm: true, nzuimm: false, offset: true, shamt: false, zimm: false };
export const alwaysImmediateRow = true;
export const operandPattern = /\b(?:rd|rs1|rs2|rs3|rs|rt)'|\b(?:rd|rs1|rs2|rs3|rs|rt|vd|vs1|vs2|vs3|vm|imm|csr|rm|pred|succ|spimm|sp|sew|lmul|ta|ma|fpimm|bs|rnd|rlist|r1s|r2s)\b/g;

const _V = Array.from({ length: 32 }, (_, n) => `v${n}`);
// Zfa's fli: the 32 constants its index selects, as assemblers write them
const _FLI = ['-1.0', 'min', '1.52587890625e-05', '3.0517578125e-05', '0.00390625', '0.0078125', '0.0625', '0.125', '0.25', '0.3125', '0.375', '0.4375', '0.5', '0.625',
  '0.75', '0.875', '1.0', '1.25', '1.5', '1.75', '2.0', '2.5', '3.0', '4.0', '8.0', '16.0', '128.0', '256.0', '32768.0', '65536.0', 'inf', 'nan'];
// Zcmp's register lists: 4 is {ra}, ..., 15 is {ra, s0-s11} (s10 never without s11)
const _RLIST = ['', '', '', '', '{ra}', '{ra, s0}', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `{ra, s0-s${n}}`), '{ra, s0-s11}'];
// Zcmp's stack adjustment: the registers' space (16 byte units) plus spimm × 16, negative for cm.push
const _stackBase = (rlist) => (rlist < 8 ? 16 : rlist < 12 ? 32 : rlist < 15 ? 48 : 64);

// Operands that are neither the integer / FP registers nor an immediate: names to choose from, or a number.
export const operands = {
  vd: { width: 5, names: _V }, vs1: { width: 5, names: _V }, vs2: { width: 5, names: _V }, vs3: { width: 5, names: _V },
  // the mask: v0.t, or nothing at all when the instruction is unmasked (omit: the value whose operand is left out)
  vm: { width: 1, names: ['v0.t', 'unmasked'], omit: 1 },
  sew: { width: 3, names: ['e8', 'e16', 'e32', 'e64', '(e128)', '(e256)', '(e512)', '(e1024)'], exclude: [4, 5, 6, 7] },
  lmul: { width: 3, names: ['m1', 'm2', 'm4', 'm8', '(reserved)', 'mf8', 'mf4', 'mf2'], exclude: [4] },
  ta: { width: 1, names: ['tu', 'ta'] },
  ma: { width: 1, names: ['mu', 'ma'] },
  fpimm: { width: 5, names: _FLI },
  bs: { width: 2, names: ['0', '1', '2', '3'] },
  rnd: { width: 5 },
  rlist: { width: 4, names: _RLIST, exclude: [0, 1, 2, 3] },
  spimm: {
    width: 2,
    text: ({ value = 0, fields = {}, inst = {} }) => `${inst.name === 'cm.push' ? '-' : ''}${_stackBase(fields.rlist ?? 4) + value * 16}`,
    parse: ({ text = '', values = {}, inst = {} }) => {
      const n = Number(text.trim());
      const size = (inst.name === 'cm.push' ? -n : n) - _stackBase(values.rlist ?? 4);
      if (!Number.isInteger(n) || size % 16 || size < 0 || size > 48) throw new Error(`${inst.name}: stack adjustment ${text} does not fit ${_RLIST[values.rlist]}`);
      return size / 16;
    },
  },
  r1s: { width: 3, names: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7'] },
  r2s: { width: 3, names: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7'] },
};

// Bit order used to sort the decoder: lsb first, then opcode, funct3, funct7 / compressed funct3, ...
export const decodeOrder = {
  32: [0, 1, 2, 3, 4, 5, 6, 12, 13, 14, 25, 26, 27, 28, 29, 30, 31, 20, 21, 22, 23, 24, 15, 16, 17, 18, 19, 7, 8, 9, 10, 11],
  16: [0, 1, 13, 14, 15, 12, 10, 11, 5, 6, 2, 3, 4, 7, 8, 9],
};

// inst[1:0] tell the width of an instruction.
export function widthOf({ bit = () => '-' }) {
  if (bit(0) === '-' || bit(1) === '-') return null;
  return bit(0) === '1' && bit(1) === '1' ? 32 : 16;
}

// RV32I HINTs (spec table "RV32I HINT instructions"): computational instructions writing x0, and fences with an empty set.
const _STANDARD_HINTS = ['lui', 'auipc', 'addi', 'andi', 'ori', 'xori', 'add', 'sub', 'and', 'or', 'xor', 'sll', 'srl', 'sra'];
const _CUSTOM_HINTS = ['slti', 'sltiu', 'slli', 'srli', 'srai', 'slt', 'sltu'];
const _NTL_HINTS = { 2: 'ntl.p1', 3: 'ntl.pall', 4: 'ntl.s1', 5: 'ntl.all' };

function _baseHint({ inst = {}, fields = {}, word = 0 }) {
  if (inst.name === 'fence') return fields.pred === 0 || fields.succ === 0 ? 'HINT (empty predecessor or successor set): standard use, executes as a no-op' : '';
  if (fields.rd !== 0 || word === 0x13) return '';
  if (inst.name === 'add' && fields.rs1 === 0 && _NTL_HINTS[fields.rs2]) return `HINT: ${_NTL_HINTS[fields.rs2]} (Zihintntl non-temporal locality)`;
  if (inst.name === 'slli' && fields.rs1 === 0 && fields.imm === 31) return 'HINT: semihosting entry marker';
  if (inst.name === 'srai' && fields.rs1 === 0 && fields.imm === 7) return 'HINT: semihosting exit marker';
  if (_STANDARD_HINTS.includes(inst.name)) return 'HINT (rd = x0): standard use, executes as a no-op';
  if (_CUSTOM_HINTS.includes(inst.name)) return 'HINT (rd = x0): custom use, executes as a no-op';
  return '';
}

function _reservedRounding({ fields = {} }) {
  return fields.rm === 5 || fields.rm === 6 ? `rm = ${fields.rm.toString(2)} is reserved: illegal instruction` : '';
}

export function note({ inst = {}, fields = {}, word = 0 }) {
  return [_baseHint({ inst, fields, word }), _reservedRounding({ fields })].filter(Boolean).join(' ; ');
}

// ---------------------------------------------------------------- extension toggles

// The extensions a row needs: its own or its group's ("C + F" needs both, "F / D" either), or what it `requires`.
function _needs({ row = {} }) {
  if (row.requires) return [[row.requires]];
  const text = row.extension ?? _groups[row.group].extension;
  return text.split(/\s*\+\s*/).map((part) => part.split(/\s*\/\s*/));
}

const _allowed = ({ row = {}, enabled = new Set() }) => _needs({ row }).every((anyOf) => anyOf.some((e) => enabled.has(e)));

// Every extension the sheets have rows for: those the toggles can turn on and off.
export const sheetExtensions = new Set([..._instructions, ..._pseudos].flatMap((row) => (row.requires || row.group ? _needs({ row }).flat() : [])));

// The sheets start as RV32GC.
export const defaultExtensions = new Set(['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei', 'C']);

const _opcode = (row) => row.enc.replace(/\s+/g, '').slice(-7);

// The data of an instruction set with only the given extensions: rows they allow, groups that keep a row,
// pseudo-instructions whose base instructions all stay, unused opcodes no row takes.
function _subset({ enabled }) {
  const instructions = _instructions.filter((row) => _allowed({ row, enabled }));
  const names = new Set(instructions.filter((i) => !i.reserved && !i.hint).map((i) => i.name));
  const pseudoInstructions = _pseudos.filter((p) => (!p.requires || enabled.has(p.requires))
    && [...p.expands, ...(Array.isArray(p.short) ? p.short : [])].every(([base]) => names.has(base)));
  const used = new Set(instructions.map((i) => i.group));
  const groups = Object.fromEntries(Object.entries(_groups).filter(([key]) => used.has(key)));
  const shown = new Set(instructions.map((i) => i.extension ?? groups[i.group].extension));
  const extensions = _extensions.filter((e) => e === 'PSEUDO' || shown.has(e));
  const taken = new Set(instructions.filter((i) => !i.reserved && !i.hint && /^[01]{7}$/.test(_opcode(i))).map(_opcode));
  const unusedOpcodes = _unusedOpcodes.filter((u) => !taken.has(u.opcode));
  return { name: isaString({ width: 32, enabled }), instructions, groups, pseudoInstructions, extensions, unusedOpcodes };
}

const _gc = _subset({ enabled: defaultExtensions });
export const { instructions, groups, pseudoInstructions, extensions, unusedOpcodes } = _gc;

// The instruction set of any set of extensions, named by its ISA string (RV32IMC, RV32GC_Zba_Zbb, ...).
export function withExtensions({ enabled = defaultExtensions }) {
  return { ..._self, ..._subset({ enabled }) };
}
