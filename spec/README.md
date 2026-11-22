# Instruction set sources

The sheets' instruction data is generated from these, by the scripts in `tools/isa/` (`npm run isa`). Files here are
copies of the official sources at the versions below (do not edit them, update them), and the unofficial descriptions
of `unofficial/`, which are this project's own: edit those, then run `npm run isa`.

| Directory / file | Source | Version | Licence |
| --- | --- | --- | --- |
| `sail-riscv/` | The RISC-V Sail model, [riscv/sail-riscv](https://github.com/riscv/sail-riscv): the files with the encodings of RV32, RV64 and their ratified extensions (`model/...`) | tag `2026-11-09-8118453` (commit `8118453168a11439fd88318e7e1192eb938efcd1`) | BSD 2-Clause, `sail-riscv/LICENCE` |
| `udb/instructions.json` | The RISC-V Unified Database, [riscv-software-src/riscv-unified-db](https://github.com/riscv-software-src/riscv-unified-db): each instruction's long name, RV32 and RV64 encodings (match, match64), extensions and base (xlen, when only one has it), extracted from `spec/std/isa/inst` by `tools/isa/udb.py` | commit `d583fecd3d95841b9d6751f800337d1e2999c3fd` | BSD 3-Clause Clear, `udb/LICENSE` |
| `llvm/RISCV.json` | LLVM's RISC-V TableGen description, [llvm/llvm-project](https://github.com/llvm/llvm-project) `llvm/lib/Target/RISCV` (RV32 and RV64: IsRV32 / IsRV64 mark what one has), extracted with `llvm-tblgen --dump-json` | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception, `llvm/LICENSE.TXT` |
| `llvm/Mips.json` | LLVM's Mips TableGen description, same repository and version as `llvm/RISCV.json`, `llvm/lib/Target/Mips`: the MIPS32 / MIPS64 Release 2 CPU instructions in the standard encoding (filter in `tools/isa/tablegen.mjs`), same extraction | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception |
| `llvm/AArch64.json` | LLVM's AArch64 TableGen description, same repository and version, `llvm/lib/Target/AArch64`: the ARMv8.0 A64 instructions (no predicate, HasFPARMv8, HasEL3; filter in `tools/isa/tablegen.mjs`), same extraction | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception |
| `llvm/ARM.json` | LLVM's ARM TableGen description, same repository and version, `llvm/lib/Target/ARM`: the ARMv7-A ARM state instructions (decoder namespaces ARM and CoProc, no ARMv8, VFP or NEON predicate; filter in `tools/isa/tablegen.mjs`), same extraction | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception |
| `llvm/Thumb.json` | LLVM's ARM TableGen description, the ARMv7-A Thumb and Thumb-2 instructions (decoder namespaces Thumb, ThumbSBit, Thumb2, Thumb2CoProc; filter in `tools/isa/tablegen.mjs`), same extraction | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception |
| `llvm/X86.json` | LLVM's X86 TableGen description, same repository and version, `llvm/lib/Target/X86`: the records the 8086 table of `src/isa/overlay/x86.json` names, with what x86 records have instead of Inst bits (opcode, opcode map, form, operand and address size, prefixes, immediate; `compact` in `tools/isa/tablegen.mjs`) | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception |
| `llvm/MOS.json` | llvm-mos's 6502 TableGen description, [llvm-mos/llvm-mos](https://github.com/llvm-mos/llvm-mos) `llvm/lib/Target/MOS` (not part of upstream LLVM), same extraction | commit `ae72e49843c256272d89421942079cd623bedafb` | Apache 2.0 with LLVM exception |

Also here, so the header's TableGen downloads are the real files: the RV32 / RV64 `.td` files of LLVM's RISC-V target
(`llvm/RISCV/`, including `RISCVRegisterInfo.td` and `RISCVSystemOperands.td`, where the registers sheet takes register
names, ABI names, encodings and CSR addresses from) llvm-mos's instruction files (`llvm/MOS/`) the Mips files the MIPS sheets take instructions from (`llvm/Mips/`) the AArch64 ones of the A64 sheets (`llvm/AArch64/`) the ARM ones of the A32 sheets (`llvm/ARM/`) and the X86 ones of the 8086 sheet (`llvm/X86/`), same versions.

## Unofficial descriptions

There is no Sail model of MIPS, the 6502, the 8080, the 8051, the Z80 or the Hack computer, and no TableGen description of
the 8080's, the 8051's, the Z80's or Hack's encodings (the Z80 backends outside LLVM describe instructions for code generation only, without
their bits). The
files in `unofficial/` are written for the sheets, in the style of the official ones, and marked UNOFFICIAL in their
headers:

| File | What it is |
| --- | --- |
| `unofficial/z80/z80.sail`, `Z80.td` | The Z80's documented instructions, from the opcode tables of Zilog's Z80 CPU User Manual (UM0080) |
| `unofficial/i8080/i8080.sail`, `I8080.td` | The 8080's documented instructions: the Sail from the bit fields of Intel's 8080 Microcomputer Systems User's Manual, the TableGen from the opcode table of the 8080 Assembly Language Programming Manual (opcode bytes and field positions, a separate reading) |
| `unofficial/mcs51/mcs51.sail`, `MCS51.td` | The 8051's instructions: the Sail from the encodings of the instruction definitions in Intel's MCS-51 Microcontroller Family User's Manual, the TableGen from its opcode map in hexadecimal order (a separate reading) |
| `unofficial/a64/a64.sail` | A64 of ARMv8.0 (integer, loads and stores, branches and system, scalar floating point), written by hand from the encoding diagrams of the Arm Architecture Reference Manual; clauses named as LLVM's instructions, checked against them bit by bit. Not derived from Arm's machine-readable XML, which may not be copied (CLAUDE.md); `test/arm-xml.test.mjs` compares the sheet with it where it is installed |
| `unofficial/a32/a32.sail` | A32 of ARMv7-A (integer, loads and stores, branches, coprocessor, system, with the Security, Virtualization and Multiprocessing Extensions), written by hand from the Arm ARM (ARMv7-A and ARMv7-R edition); clauses named as LLVM's instructions (NAME_i / NAME_r where one LLVM record is two forms), checked against them bit by bit; compared locally with Arm's AArch32 XML, never copied from it |
| `unofficial/t32/t32.sail` | Thumb of ARMv7-A (16 bit Thumb and 32 bit Thumb-2), written by hand from the Arm ARM; clauses named as LLVM's instructions, checked against them bit by bit; compared locally with Arm's AArch32 XML, never copied from it |
| `unofficial/mips/mips.sail` | MIPS32 and MIPS64 Release 2, the CPU instructions, from MIPS Technologies' MIPS32 / MIPS64 Architecture For Programmers Volume II-A; clauses named as LLVM's instructions, checked against them bit by bit (up to the fields' names and the low bits LLVM leaves out of offsets) |
| `unofficial/x86/i8086.sail` | The 8086, generated by `tools/isa/gen-x86.mjs` from the typed table of `src/isa/overlay/x86.json` (Intel's opcode notation, written from Intel's 8086 Family User's Manual), a clause per row and addressing form; the table is what is checked against LLVM's X86 records |
| `unofficial/hack/hack.sail`, `Hack.td` | The Hack machine language, from chapter 4 of The Elements of Computing Systems |
| `unofficial/mos6502/mos6502.sail` | The 6502's official opcodes, from MOS Technology's programming manual; checked against llvm-mos |
| `unofficial/*/*.json` | Their TableGen, extracted as for the official ones (`npm run isa:tablegen -- --target Z80 --td ...`) |

They describe encodings and assembly only (union clauses, `encdec` and `assembly` mappings; TableGen records with
`Inst` and `AsmString`), no semantics. `llvm-tblgen` reads the TableGen files; the Sail files have not been through the
Sail compiler. The generator checks each Sail clause against the TableGen record of the same name bit by bit, and the
tests assemble every instruction with two independent assemblers (py65 and ca65, skoolkit and sjasmplus, asl and as8085, asl and as8051; Hack against
the book's examples). An instruction is its bytes in memory order in Sail, while TableGen numbers the first byte lowest,
as LLVM does.

## Updating

Unified Database: `~/.local/opt/sliderules-venv/bin/python -I tools/isa/udb.py ~/riscv-unified-db <commit>` (PyYAML).

Sail: copy the same files from a newer tag of sail-riscv into `sail-riscv/model/` (and the `.td` files of `llvm/RISCV/`
and `llvm/MOS/` from the new LLVM / llvm-mos) and run `npm run isa`. The Sail reader
(`tools/isa/sail.mjs`) understands only what the encoding clauses use, so a new construct makes it stop with the clause
it cannot read rather than produce a wrong sheet.

TableGen: build `llvm-tblgen` from the release (only it is needed: `ninja llvm-tblgen`), then

```sh
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target RISCV
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Mips
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target AArch64
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target ARM
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Thumb
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target X86
npm run isa:tablegen -- --llvm ~/llvm-mos --project llvm-mos/llvm-mos --tblgen ~/llvm-project/build/bin/llvm-tblgen --target MOS
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Z80 --td spec/unofficial/z80/Z80.td --out spec/unofficial/z80/Z80.json --project unofficial
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target I8080 --td spec/unofficial/i8080/I8080.td --out spec/unofficial/i8080/I8080.json --project unofficial
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target MCS51 --td spec/unofficial/mcs51/MCS51.td --out spec/unofficial/mcs51/MCS51.json --project unofficial
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Hack --td spec/unofficial/hack/Hack.td --out spec/unofficial/hack/Hack.json --project unofficial
npm run isa
```

The generator compares Sail with TableGen bit by bit and stops on any disagreement. Update this table, then regenerate the
test vectors (`npm run vectors`, `npm run vectors:llvm`) and run `npm test`.
