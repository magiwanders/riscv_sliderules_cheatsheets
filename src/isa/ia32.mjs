// IA-32: the 8086's encoding in 32 bit protected mode, with the 186 / 286 / 386 / 486 / Pentium / Pentium Pro integer
// and system instructions (no x87, MMX or SSE). Operands are 32 bit, 16 bit with the 66 prefix; a ModRM operand has a
// row per addressing form: the register, [base], [disp32], [base+disp8], [base+disp32] and, with a SIB byte,
// [base+index*scale] with no, an 8 or a 32 bit displacement and [index*scale+disp32]. Up to 11 bytes, the spine's width.
//
// The lines are generated (src/isa/generated/ia32.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import * as data from './generated/ia32.mjs';
import { x86Sheet } from './x86.mjs';

// The sheet's settings and rows, made the first time its codec is asked for (src/isa/isas.mjs): the rows are many.
let _sheet = null;
export const sheet = () => (_sheet ??= x86Sheet({ data, mode: 32, name: 'x86', spine: { width: 88, bytes: true, title: 'bytes 0-10, in memory order' } }));
