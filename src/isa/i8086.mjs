// The Intel 8086: an opcode byte, a ModRM byte for most, then a displacement and an immediate, 16 bit values low byte
// first; up to 6 bytes, the spine's width. A ModRM operand has a row per addressing form (the register, [bx+si],
// [bx+si+disp8], [bx+si+disp16], [disp16]); the w bit of the opcode makes byte and word rows. Prefixes (lock, rep,
// segment overrides) are rows of their own, as the 8086 manual lists them.
//
// The lines are generated (src/isa/generated/i8086.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import * as data from './generated/i8086.mjs';
import { x86Sheet } from './x86.mjs';

// The sheet's settings and rows, made the first time its codec is asked for (src/isa/isas.mjs): the rows are many.
let _sheet = null;
export const sheet = () => (_sheet ??= x86Sheet({ data, mode: 16, name: '8086', spine: { width: 48, bytes: true, title: 'bytes 0-5, in memory order' } }));
