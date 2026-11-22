// x86-64 (64 bit mode): IA-32's integer and system instructions as they are in 64 bit mode, and its own (movsxd,
// cmpxchg16b, syscall, swapgs, ...). Operands are 32 bit, 16 with the 66 prefix, 64 with REX.W (push, pop, near branches:
// 64 by default); REX.R, X and B extend the register fields to r8-r15, so a row with registers comes without REX and
// with it. The addressing forms are IA-32's, with [rip+disp32] in place of [disp32] (which takes a SIB byte). Up to 12
// bytes, the spine's width.
//
// The lines are generated (src/isa/generated/x86_64.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import { formats, sections, extensions, families, lines, registers } from './generated/x86_64.mjs';
import { x86Rows, x86Operands, x86Immediates, immText } from './x86.mjs';

export { formats, sections, extensions, registers, immText };
export const { groups, instructions } = x86Rows({ lines, families, mode: 64 });
export const operands = x86Operands({ mode: 64 });
export const name = 'x86-64';
export const spine = { width: 96, bytes: true, title: 'bytes 0-11, in memory order' };
export const immediates = x86Immediates;
export const labels = { ext: 'Class', type: 'Mode', expansion: 'Flags' };
export const widths = { ext: 130, instruction: 250, pseudocode: 280, type: 120 };
export const plainFormats = true;
export const repeatedNames = true;
