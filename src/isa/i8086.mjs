// The Intel 8086: an opcode byte, a ModRM byte for most, then a displacement and an immediate, 16 bit values low byte
// first; up to 6 bytes, the spine's width. A ModRM operand has a row per addressing form (the register, [bx+si],
// [bx+si+disp8], [bx+si+disp16], [disp16]); the w bit of the opcode makes byte and word rows. Prefixes (lock, rep,
// segment overrides) are rows of their own, as the 8086 manual lists them.
//
// The instruction data is generated (src/isa/generated/i8086.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records; see tools/isa/gen-x86.mjs.

export { formats, sections, extensions, groups, instructions, registers } from './generated/i8086.mjs';

const named = (names, extra = {}) => ({ width: Math.log2(names.length), names, ...extra });
const REG8 = ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'];
const REG16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'];
const BASE16 = ['bx+si', 'bx+di', 'bp+si', 'bp+di', 'si', 'di', 'bp', 'bx'];
const signed = (value) => (value < 0 ? `-0x${(-value).toString(16)}` : `+0x${value.toString(16)}`);
const _number = (text) => {
  const t = text.trim().toLowerCase();
  const neg = t.startsWith('-');
  const body = t.replace(/^[+-]/, '');
  if (!/^(0x[0-9a-f]+|\d+)$/.test(body)) throw new Error(`"${text}" is not a number`);
  return (neg ? -1 : 1) * Number(body);
};

export const operands = {
  r8: named(REG8), rm8: named(REG8), r16: named(REG16), rm16: named(REG16),
  sreg: named(['es', 'cs', 'ss', 'ds']),
  // [bx+si] ... [bx]: 110 is [disp16] without a displacement, [bp] with one
  b16: named(BASE16, { exclude: [6] }), b16x: named(BASE16),
  // a displacement reads +0x12 or -0x3 after the base, a direct address 0x1234
  d8: { width: 8, signed: true, pattern: '[+-](?:0x[0-9a-f]+|\\d+)', text: ({ value = 0 }) => signed(value), parse: ({ text }) => _number(text) },
  d16: { width: 16, signed: true, pattern: '[+-](?:0x[0-9a-f]+|\\d+)', text: ({ value = 0 }) => signed(value), parse: ({ text }) => _number(text) },
  a16: { width: 16, text: ({ value = 0 }) => `0x${value.toString(16)}` },
  seg: { width: 16, text: ({ value = 0 }) => `0x${value.toString(16)}` },
  cc: named(['o', 'no', 'b', 'ae', 'e', 'ne', 'be', 'a', 's', 'ns', 'p', 'np', 'l', 'ge', 'le', 'g']),
};

export const name = '8086';
export const spine = { width: 48, bytes: true, title: 'bytes 0-5, in memory order' };
export const immediates = { imm: false, simm: true, rel: true };
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 130, instruction: 250, pseudocode: 280, type: 120 };
export const plainFormats = true;
export const repeatedNames = true;
// values and addresses in hex, signed immediates and offsets in decimal
export const immText = ({ inst = {}, value = 0 }) => (inst.immSigned ? String(value) : `0x${value.toString(16)}`);
