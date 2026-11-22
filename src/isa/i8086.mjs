// The Intel 8086: an opcode byte, a ModRM byte for most, then a displacement and an immediate, 16 bit values low byte
// first; up to 6 bytes, the spine's width. A ModRM operand has a row per addressing form (the register, [bx+si],
// [bx+si+disp8], [bx+si+disp16], [disp16]); the w bit of the opcode makes byte and word rows. Prefixes (lock, rep,
// segment overrides) are rows of their own, as the 8086 manual lists them.
//
// The lines are generated (src/isa/generated/i8086.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import { formats, sections, extensions, families, lines, registers } from './generated/i8086.mjs';
import { x86Rows, x86Operands, x86Immediates, immText } from './x86.mjs';

export { formats, sections, extensions, registers, immText };
export const { groups, instructions } = x86Rows({ lines, families, mode: 16 });
export const operands = x86Operands({ mode: 16 });
export const name = '8086';
export const spine = { width: 48, bytes: true, title: 'bytes 0-5, in memory order' };
export const immediates = x86Immediates;
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 130, instruction: 250, pseudocode: 280, type: 120 };
export const plainFormats = true;
export const repeatedNames = true;
