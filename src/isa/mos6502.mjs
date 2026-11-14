// The MOS 6502 (official opcodes): one opcode byte, then up to two operand bytes, addresses low byte first.
//
// The sheets follow the opcode's aaabbbcc structure: a section per cc, a group per addressing mode inside it, which is
// the group the opcode's bbb bits select. Undocumented opcodes are not listed.
//
// The instruction data is generated (src/isa/generated/mos6502.mjs, `npm run isa`) from llvm-mos's TableGen description
// with src/isa/overlay/mos6502.json for what it does not have; see tools/isa/gen-mos6502.mjs. This module adds what the
// codec needs to read it.

export { formats, sections, extensions, groups, instructions, registers } from './generated/mos6502.mjs';

export const name = '6502';
export const spine = { width: 24, bytes: true, title: 'bytes 0-2, in memory order' };
export const immediates = { imm: false, zp: false, addr: false, rel: true };
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 100, instruction: 190, pseudocode: 250 };
export const separator = ',';
export const plainFormats = true;
export const repeatedNames = true;

// Addresses and values in hex as 6502 listings have them, offsets as a signed count of bytes.
export function immText({ inst = {}, value = 0 }) {
  return inst.immSigned ? String(value) : `$${value.toString(16).padStart((inst.immMsb + 1) / 4, '0')}`;
}
