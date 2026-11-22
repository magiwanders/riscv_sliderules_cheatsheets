// x86-64 (64 bit mode): IA-32's integer and system instructions as they are in 64 bit mode, and its own (movsxd,
// cmpxchg16b, syscall, swapgs, ...). Operands are 32 bit, 16 with the 66 prefix, 64 with REX.W (push, pop, near branches:
// 64 by default); REX.R, X and B extend the register fields to r8-r15, so a row with registers comes without REX and
// with it. The addressing forms are IA-32's, with [rip+disp32] in place of [disp32] (which takes a SIB byte). Up to 12
// bytes, the spine's width.
//
// The lines are generated (src/isa/generated/x86_64.mjs, `npm run isa`) from the typed opcode table of
// src/isa/overlay/x86.json, checked against LLVM's X86 records (tools/isa/gen-x86.mjs); src/isa/x86.mjs makes the rows.

import * as data from './generated/x86_64.mjs';
import { x86Sheet } from './x86.mjs';

// The sheet's settings and rows, made the first time its codec is asked for (src/isa/isas.mjs): the rows are many.
let _sheet = null;
export const sheet = () => (_sheet ??= x86Sheet({ data, mode: 64, name: 'x86-64', spine: { width: 96, bytes: true, title: 'bytes 0-11, in memory order' } }));
