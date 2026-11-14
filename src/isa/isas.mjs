import { createCodec, rv32 } from './codec.mjs';
import * as hack from './hack.mjs';
import * as mos6502 from './mos6502.mjs';
import * as rv32gc from './rv32gc.mjs';
import * as z80 from './z80.mjs';

// The instruction sets. The title's selector lists the families; a family with several members (RISC-V 32 / 64 bit,
// Intel's 8051 ... x86-64) gets a second selector next to it, with each member's `variant` label. Only members with a
// `codec` have sheets so far; `version` is shown next to the title (see Testing in the README for what a version stands
// for). The first one is the default. `specs` says what the Sail and TableGen downloads are (src/isa/api-gen.js builds
// them from spec/). `extensions` gives a member the extension toggles under the title (RISC-V).

export const families = [
  { value: 'riscv', label: 'RISC-V' },
  { value: 'mips', label: 'MIPS' },
  { value: 'intel', label: 'Intel' },
  { value: 'arm', label: 'ARM' },
  { value: 'z80', label: 'Z80' },
  { value: '6502', label: '6502' },
  { value: 'hack', label: 'Hack (nand2tetris)', short: 'Hack' },
];

// A RISC-V member's sheets for a set of enabled extensions, made once per set.
function _extensions({ module, width }) {
  const codecs = new Map();
  return {
    width,
    available: module.sheetExtensions,
    defaults: module.sheetExtensions,
    codecFor: ({ enabled }) => {
      const key = [...enabled].sort().join(',');
      if (!codecs.has(key)) codecs.set(key, createCodec(module.withExtensions({ enabled })));
      return codecs.get(key);
    },
  };
}

export const isas = [
  { value: 'rv32gc', family: 'riscv', variant: '32 bit', label: 'RV32GC', version: 'v1.0', codec: rv32, extensions: _extensions({ module: rv32gc, width: 32 }),
    specs: { sail: 'the RV32GC files of the official RISC-V Sail model (sail-riscv)', tablegen: 'the RV32GC files of LLVM\'s RISC-V target (official)' } },
  { value: 'rv64gc', family: 'riscv', variant: '64 bit', label: 'RV64GC' },
  { value: 'mips32', family: 'mips', variant: '32 bit', label: 'MIPS32' },
  { value: 'mips64', family: 'mips', variant: '64 bit', label: 'MIPS64' },
  { value: '8051', family: 'intel', variant: '8051', label: '8051 (Intel MCS-51)', short: '8051' },
  { value: '8086', family: 'intel', variant: '8086', label: '8086' },
  { value: 'x86', family: 'intel', variant: 'x86', label: 'x86' },
  { value: 'x86_64', family: 'intel', variant: 'x86-64', label: 'x86_64' },
  { value: 'arm-thumb', family: 'arm', variant: 'Thumb', label: 'ARM Thumb' },
  { value: 'arm32', family: 'arm', variant: 'A32', label: 'ARM32' },
  { value: 'arm64', family: 'arm', variant: 'A64', label: 'ARM64' },
  { value: 'z80', family: 'z80', label: 'Z80', version: 'v0.1', codec: createCodec(z80),
    specs: { sail: 'unofficial, written for these sheets from Zilog\'s manual', tablegen: 'unofficial, written for these sheets from Zilog\'s manual' } },
  { value: '6502', family: '6502', label: '6502', version: 'v0.1', codec: createCodec(mos6502),
    specs: { sail: 'unofficial, written for these sheets and checked against llvm-mos', tablegen: 'the instruction files of llvm-mos (LLVM for the 6502, not part of upstream LLVM)' } },
  { value: 'hack', family: 'hack', label: 'Hack (nand2tetris)', short: 'Hack', version: 'v0.1', codec: createCodec(hack),
    specs: { sail: 'unofficial, written for these sheets from the nand2tetris book', tablegen: 'unofficial, written for these sheets from the nand2tetris book' } },
];

export const membersOf = (family) => isas.filter((isa) => isa.family === family);
