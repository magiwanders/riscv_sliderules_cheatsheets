// IA-32: the 8086's encoding in 32 bit protected mode, with the 186 / 286 / 386 / 486 / Pentium / Pentium Pro integer
// and system instructions (no x87, MMX or SSE). Operands are 32 bit, 16 bit with the 66 prefix; a ModRM operand has a
// row per addressing form: the register, [base], [disp32], [base+disp8], [base+disp32] and, with a SIB byte,
// [base+index*scale] with no, an 8 or a 32 bit displacement and [index*scale+disp32]. Up to 11 bytes, the spine's width.
//
// The lines are generated (src/isa/generated/ia32.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import { formats, sections, extensions, families, lines, registers } from './generated/ia32.mjs';
import { x86Rows, x86Operands, x86Immediates, immText } from './x86.mjs';

export { formats, sections, extensions, registers, immText };
export const { groups, instructions } = x86Rows({ lines, families, mode: 32 });
export const operands = x86Operands({ mode: 32 });
export const name = 'x86';
export const spine = { width: 88, bytes: true, title: 'bytes 0-10, in memory order' };
export const immediates = x86Immediates;
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 130, instruction: 250, pseudocode: 280, type: 120 };
export const plainFormats = true;
export const repeatedNames = true;
