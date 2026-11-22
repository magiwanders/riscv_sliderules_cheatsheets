import { createCodec, rv32 } from './codec.mjs';
import * as hack from './hack.mjs';
import * as i8080 from './i8080.mjs';
import * as mcs51 from './mcs51.mjs';
import mips32 from './mips32.mjs';
import mips64 from './mips64.mjs';
import * as a64 from './a64.mjs';
import * as a32 from './a32.mjs';
import * as t32 from './t32.mjs';
import * as i8086 from './i8086.mjs';
import * as ia32 from './ia32.mjs';
import * as x86_64 from './x86_64.mjs';
import * as mos6502 from './mos6502.mjs';
import * as rv32gc from './rv32gc.mjs';
import * as rv64gc from './rv64gc.mjs';
import * as z80 from './z80.mjs';

// The instruction sets, in the title's selector: one list, divided by family (`families`: the vendor, or the project
// for Hack); `label` names a member there, `short` (defaults to label) when the list is closed. Only members with a
// `codec` (made on first use from `make`) have sheets so far; `version` is shown next to the title (see Testing in the README for what a version stands
// for). The first one is the default. `specs` says what the Sail and TableGen downloads are (src/isa/api-gen.js builds
// them from spec/). `extensions` gives a member the extension toggles under the title (RISC-V): its name then follows
// them (RV32GC, RV64IMC, ...).

const rv64 = createCodec(rv64gc);

export const families = [
  { value: 'riscv', label: 'RISC-V' },
  { value: 'mips', label: 'MIPS' },
  { value: 'intel', label: 'Intel' },
  { value: 'arm', label: 'Arm' },
  { value: 'z80', label: 'Zilog' },
  { value: '6502', label: 'MOS Technology' },
  { value: 'hack', label: 'nand2tetris' },
];

// A RISC-V member's sheets for a set of enabled extensions, made once per set; with the extensions it starts with
// (RV32GC / RV64GC), the member's own codec.
function _extensions({ module, width, base }) {
  const codecs = new Map();
  const key = (set) => [...set].sort().join(',');
  return {
    width,
    available: module.sheetExtensions,
    defaults: module.defaultExtensions,
    codecFor: ({ enabled }) => {
      if (key(enabled) === key(module.defaultExtensions)) return base;
      if (!codecs.has(key(enabled))) codecs.set(key(enabled), createCodec(module.withExtensions({ enabled })));
      return codecs.get(key(enabled));
    },
  };
}

export const isas = [
  { value: 'rv32gc', family: 'riscv', label: 'RV32', version: 'v1.0', codec: rv32, extensions: _extensions({ module: rv32gc, width: 32, base: rv32 }),
    specs: { sail: 'the RV32 files of the official RISC-V Sail model (sail-riscv), every ratified extension', tablegen: 'the RV32 files of LLVM\'s RISC-V target (official), every ratified extension' } },
  { value: 'rv64gc', family: 'riscv', label: 'RV64', version: 'v1.0', codec: rv64, extensions: _extensions({ module: rv64gc, width: 64, base: rv64 }),
    specs: { sail: 'the RV64 files of the official RISC-V Sail model (sail-riscv), every ratified extension', tablegen: 'the RV64 files of LLVM\'s RISC-V target (official), every ratified extension' } },
  { value: 'mips32', family: 'mips', label: 'MIPS32', version: 'v0.1', make: () => createCodec(mips32),
    specs: { sail: 'unofficial, written for these sheets from MIPS Technologies\' manuals and checked against LLVM', tablegen: 'the MIPS32 files of LLVM\'s Mips target (official), Release 2 CPU instructions' } },
  { value: 'mips64', family: 'mips', label: 'MIPS64', version: 'v0.1', make: () => createCodec(mips64),
    specs: { sail: 'unofficial, written for these sheets from MIPS Technologies\' manuals and checked against LLVM', tablegen: 'the MIPS64 files of LLVM\'s Mips target (official), Release 2 CPU instructions' } },
  { value: '8080', family: 'intel', label: '8080', version: 'v0.1', make: () => createCodec(i8080),
    specs: { sail: 'unofficial, written for these sheets from Intel\'s 8080 manuals', tablegen: 'unofficial, written for these sheets from Intel\'s 8080 manuals' } },
  { value: '8051', family: 'intel', label: '8051 (MCS-51)', short: '8051', version: 'v0.1', make: () => createCodec(mcs51),
    specs: { sail: 'unofficial, written for these sheets from Intel\'s MCS-51 manual', tablegen: 'unofficial, written for these sheets from Intel\'s MCS-51 manual' } },
  { value: '8086', family: 'intel', label: '8086', version: 'v0.1', make: () => createCodec(i8086),
    specs: { sail: 'unofficial, written for these sheets from Intel\'s 8086 manual (its opcode table, checked against LLVM)', tablegen: 'the records of LLVM\'s X86 target (official) the sheets\' 8086 instructions are' } },
  { value: 'x86', family: 'intel', label: 'x86 (IA-32)', short: 'x86', version: 'v0.1', make: () => createCodec(ia32),
    specs: { sail: 'unofficial, generated for these sheets from their opcode table of Intel\'s manuals (checked against LLVM)', tablegen: 'the records of LLVM\'s X86 target (official) the sheets\' IA-32 instructions are' } },
  { value: 'x86_64', family: 'intel', label: 'x86-64', version: 'v0.1', make: () => createCodec(x86_64),
    specs: { sail: 'unofficial, generated for these sheets from their opcode table of Intel\'s manuals (checked against LLVM)', tablegen: 'the records of LLVM\'s X86 target (official) the sheets\' x86-64 instructions are' } },
  { value: 'arm-thumb', family: 'arm', label: 'Thumb', version: 'v0.1', make: () => createCodec(t32),
    specs: { sail: 'unofficial, written for these sheets from the Arm Architecture Reference Manual and checked against LLVM', tablegen: 'the Thumb files of LLVM\'s ARM target (official), ARMv7-A Thumb and Thumb-2 instructions' } },
  { value: 'arm32', family: 'arm', label: 'A32 (ARM32)', short: 'A32', version: 'v0.1', make: () => createCodec(a32),
    specs: { sail: 'unofficial, written for these sheets from the Arm Architecture Reference Manual and checked against LLVM', tablegen: 'the A32 files of LLVM\'s ARM target (official), ARMv7-A integer, coprocessor and system instructions' } },
  { value: 'arm64', family: 'arm', label: 'A64 (ARM64)', short: 'A64', version: 'v0.1', make: () => createCodec(a64),
    specs: { sail: 'unofficial, written for these sheets from the Arm Architecture Reference Manual and checked against LLVM', tablegen: 'the A64 files of LLVM\'s AArch64 target (official), ARMv8.0 integer and floating-point instructions' } },
  { value: 'z80', family: 'z80', label: 'Z80', version: 'v0.1', make: () => createCodec(z80),
    specs: { sail: 'unofficial, written for these sheets from Zilog\'s manual', tablegen: 'unofficial, written for these sheets from Zilog\'s manual' } },
  { value: '6502', family: '6502', label: '6502', version: 'v0.1', make: () => createCodec(mos6502),
    specs: { sail: 'unofficial, written for these sheets and checked against llvm-mos', tablegen: 'the instruction files of llvm-mos (LLVM for the 6502, not part of upstream LLVM)' } },
  { value: 'hack', family: 'hack', label: 'Hack', version: 'v0.1', make: () => createCodec(hack),
    specs: { sail: 'unofficial, written for these sheets from the nand2tetris book', tablegen: 'unofficial, written for these sheets from the nand2tetris book' } },
];

// A member's codec is made the first time it is asked for (x86's sheets have thousands of rows): `'codec' in isa`
// says whether it has sheets without making it.
for (const isa of isas) {
  if (!isa.make) continue;
  let codec = null;
  Object.defineProperty(isa, 'codec', { enumerable: true, get: () => (codec ??= isa.make()) });
}

export const membersOf = (family) => isas.filter((isa) => isa.family === family);
