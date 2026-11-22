// The Intel 8080: one opcode byte, then up to two operand bytes, 16 bit values low byte first.
//
// The sheets follow the opcode map's quarters, the opcode's top two bits: loads, increments and rotates (00), moves
// (01), arithmetic and logic on a register (10), jumps, calls, the stack and immediates (11). M, register 110, is the
// memory byte HL points to; its rows are those of the register indirect mode. Conditions are part of the mnemonic
// (JNZ, CPE, RC), as Intel writes them. The twelve undocumented opcodes are not listed.
//
// The instruction data is generated (src/isa/generated/i8080.mjs, `npm run isa`) from the unofficial Sail and TableGen
// of spec/unofficial/i8080 with src/isa/overlay/i8080.json; see tools/isa/gen-retro.mjs. This module adds what the
// codec needs to read it.

export { formats, sections, extensions, operands, groups, instructions, registers } from './generated/i8080.mjs';

export const name = '8080';
export const spine = { width: 24, bytes: true, title: 'bytes 0-2, in memory order' };
export const immediates = { data: false, data16: false, addr: false, port: false };
export const labels = { ext: 'Group', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 130, instruction: 170, pseudocode: 260, type: 130 };
export const separator = ',';
export const plainFormats = true;
export const repeatedNames = true;

// Values, addresses and ports in hex.
export function immText({ inst = {}, value = 0 }) {
  return `$${value.toString(16).padStart((inst.immMsb + 1) / 4, '0')}`;
}
