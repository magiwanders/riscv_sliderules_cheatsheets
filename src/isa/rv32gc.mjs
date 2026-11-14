// RV32GC (RV32IMAFD + Zicsr + Zifencei + C) for the sliderules.
//
// The instruction data is generated (src/isa/generated/rv32gc.mjs, `npm run isa`) from the official Sail model and
// LLVM's TableGen description, with src/isa/overlay/rv32gc.json for what neither has; see tools/isa/gen-rv32gc.mjs.
// This module adds what the codec needs to read it. Encodings are written MSB-first in the notation of the spec's tables:
//   - literal bits:            0110011
//   - don't-care bits:         -----
//   - registers:               rd rs1 rs2 rs3 (5 bit), rd' rs1' rs2' (3 bit, x8-x15)
//   - shared registers:        rd/rs1, rd'/rs1'
//   - register constraints:    rd!=0, rd!={0,2}
//   - immediates:              imm[12|10:5], uimm[5:3], nzuimm[5:4|9:6|2|3], shamt[4:0], zimm[4:0]
//   - other fields:            aq rl rm pred succ csr[11:0]
// nonZeroImm marks immediates that cannot be 0 although the spec calls them shamt (c.slli / c.srli / c.srai: 0 is a HINT).
// Everything else (masks, decoding, encoding, table layout) is derived from these strings.

export { formats, sections, groups, instructions, unusedOpcodes, pseudoInstructions, extensions, registers } from './generated/rv32gc.mjs';
import { groups as _groups, instructions as _instructions, pseudoInstructions as _pseudos, extensions as _extensions } from './generated/rv32gc.mjs';
import * as _self from './rv32gc.mjs';
import { isaString } from './riscv-extensions.mjs';

// ---------------------------------------------------------------- what the codec and the sheets need (see createCodec)

export const name = 'RV32GC';
export const spine = { width: 32, title: 'inst[31:0]' };
export const immediates = { imm: true, uimm: false, nzimm: true, nzuimm: false, offset: true, shamt: false, zimm: false };
export const alwaysImmediateRow = true;
export const operandPattern = /(?:rd|rs1|rs2|rs3|rs|rt)'?|imm|csr|rm|pred|succ|sp/g;

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

// The instruction set with only the given extensions: rows they allow, groups that keep a row, pseudo-instructions
// whose base instructions all stay. Named by its ISA string (RV32IMC, RV32GC_Zihintpause, ...).
export function withExtensions({ enabled = sheetExtensions }) {
  const instructions = _instructions.filter((row) => _allowed({ row, enabled }));
  const names = new Set(instructions.filter((i) => !i.reserved && !i.hint).map((i) => i.name));
  const pseudoInstructions = _pseudos.filter((p) => (!p.requires || enabled.has(p.requires))
    && [...p.expands, ...(Array.isArray(p.short) ? p.short : [])].every(([base]) => names.has(base)));
  const used = new Set(instructions.map((i) => i.group));
  const groups = Object.fromEntries(Object.entries(_groups).filter(([key]) => used.has(key)));
  const shown = new Set(instructions.map((i) => i.extension ?? groups[i.group].extension));
  const extensions = _extensions.filter((e) => e === 'PSEUDO' || shown.has(e));
  return { ..._self, name: isaString({ width: 32, enabled }), instructions, groups, pseudoInstructions, extensions };
}
