// The Zilog Z80 (documented instructions): an opcode byte, after a CB, ED, DD or FD prefix for some, then operand
// bytes, 16 bit values low byte first. Undocumented instructions (SLL, IXH, ...) are not listed.
//
// DD and FD select IX or IY and differ in one bit, the operand i, so one row covers both. A displacement is its own
// operand, d, as LD (IX+d), n also has an immediate. A relative offset e is the byte itself, counted from the next
// instruction (Zilog's assembly counts from the instruction, 2 more).
//
// The instruction data is generated (src/isa/generated/z80.mjs, `npm run isa`) from the unofficial Sail and TableGen
// of spec/unofficial/z80 with src/isa/overlay/z80.json; see tools/isa/gen-retro.mjs. This module adds what the codec
// needs to read it.
import { operands as generatedOperands } from './generated/z80.mjs';

export { formats, sections, extensions, groups, instructions, registers } from './generated/z80.mjs';

export const name = 'Z80';
export const spine = { width: 32, bytes: true, title: 'bytes 0-3, in memory order' };
export const immediates = { nn: false, n: false, e: true };
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 124, instruction: 216, pseudocode: 280, type: 130 };
export const plainFormats = true;
export const repeatedNames = true;

// A displacement reads +5 or -3, as in LD A, (IX+5).
export const operands = { ...generatedOperands, d: { ...generatedOperands.d, text: ({ value = 0 }) => (value < 0 ? String(value) : `+${value}`) } };

// Values and addresses in hex, offsets as a signed count of bytes.
export function immText({ inst = {}, value = 0 }) {
  return inst.immSigned ? String(value) : `$${value.toString(16).padStart((inst.immMsb + 1) / 4, '0')}`;
}
