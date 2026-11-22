// MIPS32 Release 2, the CPU instructions: see mips.mjs.
import * as data from './generated/mips32.mjs';
import { mipsSet } from './mips.mjs';

export default mipsSet({ data, xlen: 32 });
