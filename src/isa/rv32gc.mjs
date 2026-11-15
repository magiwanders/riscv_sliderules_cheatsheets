// RV32 for the sliderules: every ratified extension, the sheets starting as RV32GC (RV32IMAFD + Zicsr + Zifencei + C).
// The instruction data is generated (src/isa/generated/rv32gc.mjs, `npm run isa`, see tools/isa/gen-riscv.mjs); what the
// codec needs to read it, and the extension toggles' withExtensions, are in riscv.mjs (shared with RV64).

import * as _data from './generated/rv32gc.mjs';
import { riscvSheets } from './riscv.mjs';

const _sheets = riscvSheets({ xlen: 32, data: _data });

export const { name, xlen, spine, formats, sections, registers, csrs, immediates, alwaysImmediateRow, operandPattern, operands, decodeOrder, widthOf, note,
  sheetExtensions, defaultExtensions, withExtensions, instructions, groups, pseudoInstructions, extensions, unusedOpcodes } = _sheets;
