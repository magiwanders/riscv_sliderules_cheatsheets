import { createCodec, rv32 } from './codec.mjs';
import * as hack from './hack.mjs';
import * as mos6502 from './mos6502.mjs';
import * as rv32gc from './rv32gc.mjs';
import * as z80 from './z80.mjs';

// The instruction sets, in the title's selector: one list, divided by family (`families`: the vendor, or the project
// for Hack); `label` names a member there, `short` (defaults to label) when the list is closed. Only members with a
// `codec` have sheets so far; `version` is shown next to the title (see Testing in the README for what a version stands
// for). The first one is the default. `specs` says what the Sail and TableGen downloads are (src/isa/api-gen.js builds
// them from spec/). `extensions` gives a member the extension toggles under the title (RISC-V): its name then follows
// them (RV32GC, RV32IMC, ...).

export const families = [
  { value: 'riscv', label: 'RISC-V' },
  { value: 'mips', label: 'MIPS' },
  { value: 'intel', label: 'Intel' },
  { value: 'arm', label: 'Arm' },
  { value: 'z80', label: 'Zilog' },
  { value: '6502', label: 'MOS Technology' },
  { value: 'hack', label: 'nand2tetris' },
];

// A RISC-V member's sheets for a set of enabled extensions, made once per set; with every extension the sheets have,
// the member's own codec. It starts as G + C.
function _extensions({ module, width, full }) {
  const codecs = new Map();
  const key = (set) => [...set].sort().join(',');
  return {
    width,
    available: module.sheetExtensions,
    defaults: new Set(['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei', 'C'].filter((e) => module.sheetExtensions.has(e))),
    codecFor: ({ enabled }) => {
      if (key(enabled) === key(module.sheetExtensions)) return full;
      if (!codecs.has(key(enabled))) codecs.set(key(enabled), createCodec(module.withExtensions({ enabled })));
      return codecs.get(key(enabled));
    },
  };
}

export const isas = [
  { value: 'rv32gc', family: 'riscv', label: 'RV32', version: 'v1.0', codec: rv32, extensions: _extensions({ module: rv32gc, width: 32, full: rv32 }),
    specs: { sail: 'the RV32GC files of the official RISC-V Sail model (sail-riscv)', tablegen: 'the RV32GC files of LLVM\'s RISC-V target (official)' } },
  { value: 'rv64gc', family: 'riscv', label: 'RV64' },
  { value: 'mips32', family: 'mips', label: 'MIPS32' },
  { value: 'mips64', family: 'mips', label: 'MIPS64' },
  { value: '8051', family: 'intel', label: '8051 (MCS-51)', short: '8051' },
  { value: '8086', family: 'intel', label: '8086' },
  { value: 'x86', family: 'intel', label: 'x86 (IA-32)', short: 'x86' },
  { value: 'x86_64', family: 'intel', label: 'x86-64' },
  { value: 'arm-thumb', family: 'arm', label: 'Thumb' },
  { value: 'arm32', family: 'arm', label: 'A32 (ARM32)', short: 'A32' },
  { value: 'arm64', family: 'arm', label: 'A64 (ARM64)', short: 'A64' },
  { value: 'z80', family: 'z80', label: 'Z80', version: 'v0.1', codec: createCodec(z80),
    specs: { sail: 'unofficial, written for these sheets from Zilog\'s manual', tablegen: 'unofficial, written for these sheets from Zilog\'s manual' } },
  { value: '6502', family: '6502', label: '6502', version: 'v0.1', codec: createCodec(mos6502),
    specs: { sail: 'unofficial, written for these sheets and checked against llvm-mos', tablegen: 'the instruction files of llvm-mos (LLVM for the 6502, not part of upstream LLVM)' } },
  { value: 'hack', family: 'hack', label: 'Hack', version: 'v0.1', codec: createCodec(hack),
    specs: { sail: 'unofficial, written for these sheets from the nand2tetris book', tablegen: 'unofficial, written for these sheets from the nand2tetris book' } },
];

export const membersOf = (family) => isas.filter((isa) => isa.family === family);
