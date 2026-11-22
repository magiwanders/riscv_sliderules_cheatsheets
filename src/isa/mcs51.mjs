// The Intel MCS-51 (8051): one opcode byte, then up to two operand bytes, 16 bit values high byte first.
//
// The sheets follow the opcode map's columns, the opcode's low nibble, which chooses the operand of the regular
// instructions: x4 the accumulator or an immediate, x5 a direct byte, x6-x7 indirect RAM @R0 / @R1, x8-xF the
// registers R0-R7; x0-x3 hold the jumps, calls and bit operations. Opcode A5 is undefined.
//
// Instructions may have two or three numbers (MOV direct,#data; CJNE A,#data,rel): data, data16 and the addresses of
// jumps are the immediate, direct bytes, bit addresses and relative offsets operands of their own. A relative offset is
// the byte itself, counted from the next instruction (assemblers take the address it reaches).
//
// The instruction data is generated (src/isa/generated/mcs51.mjs, `npm run isa`) from the unofficial Sail and TableGen
// of spec/unofficial/mcs51 with src/isa/overlay/mcs51.json; see tools/isa/gen-retro.mjs. This module adds what the
// codec needs to read it.
import { operands as generatedOperands } from './generated/mcs51.mjs';

export { formats, sections, extensions, groups, instructions, registers } from './generated/mcs51.mjs';

const hex = ({ value = 0 }) => `$${value.toString(16).padStart(2, '0')}`;

export const name = '8051';
export const spine = { width: 24, bytes: true, title: 'bytes 0-2, in memory order' };
export const immediates = { data: false, data16: false, addr16: false, addr11: false };
export const labels = { ext: 'Group', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 140, instruction: 200, pseudocode: 280, type: 130 };
export const separator = ',';
export const plainFormats = true;
export const repeatedNames = true;

// Direct bytes and bit addresses in hex, as the immediates.
export const operands = {
  ...generatedOperands,
  direct: { ...generatedOperands.direct, text: hex },
  direct2: { ...generatedOperands.direct2, text: hex },
  bitaddr: { ...generatedOperands.bitaddr, text: hex },
};

// Values and addresses in hex.
export function immText({ inst = {}, value = 0 }) {
  return `$${value.toString(16).padStart(Math.ceil((inst.immMsb + 1) / 4), '0')}`;
}
