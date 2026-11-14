# Instruction set sources

The sheets' instruction data is generated from these, by the scripts in `tools/isa/` (`npm run isa`). Files here are
copies of the official sources at the versions below (do not edit them, update them), and the unofficial descriptions
of `unofficial/`, which are this project's own: edit those, then run `npm run isa`.

| Directory / file | Source | Version | Licence |
| --- | --- | --- | --- |
| `sail-riscv/` | The RISC-V Sail model, [riscv/sail-riscv](https://github.com/riscv/sail-riscv): the files with the RV32GC encodings (`model/...`) | tag `2026-11-09-8118453` (commit `8118453168a11439fd88318e7e1192eb938efcd1`) | BSD 2-Clause, `sail-riscv/LICENCE` |
| `llvm/RISCV.json` | LLVM's RISC-V TableGen description, [llvm/llvm-project](https://github.com/llvm/llvm-project) `llvm/lib/Target/RISCV`, extracted with `llvm-tblgen --dump-json` | `llvmorg-23.1.5` | Apache 2.0 with LLVM exception, `llvm/LICENSE.TXT` |
| `llvm/MOS.json` | llvm-mos's 6502 TableGen description, [llvm-mos/llvm-mos](https://github.com/llvm-mos/llvm-mos) `llvm/lib/Target/MOS` (not part of upstream LLVM), same extraction | commit `ae72e49843c256272d89421942079cd623bedafb` | Apache 2.0 with LLVM exception |

Also here, so the header's TableGen downloads are the real files: the RV32GC `.td` files of LLVM's RISC-V target
(`llvm/RISCV/`, including `RISCVRegisterInfo.td` and `RISCVSystemOperands.td`, where the registers sheet takes register
names, ABI names, encodings and CSR addresses from) and llvm-mos's instruction files (`llvm/MOS/`), same versions.

## Unofficial descriptions

There is no Sail model of the 6502, the Z80 or the Hack computer, and no TableGen description of the Z80's or Hack's
encodings (the Z80 backends outside LLVM describe instructions for code generation only, without their bits). The
files in `unofficial/` are written for the sheets, in the style of the official ones, and marked UNOFFICIAL in their
headers:

| File | What it is |
| --- | --- |
| `unofficial/z80/z80.sail`, `Z80.td` | The Z80's documented instructions, from the opcode tables of Zilog's Z80 CPU User Manual (UM0080) |
| `unofficial/hack/hack.sail`, `Hack.td` | The Hack machine language, from chapter 4 of The Elements of Computing Systems |
| `unofficial/mos6502/mos6502.sail` | The 6502's official opcodes, from MOS Technology's programming manual; checked against llvm-mos |
| `unofficial/*/*.json` | Their TableGen, extracted as for the official ones (`npm run isa:tablegen -- --target Z80 --td ...`) |

They describe encodings and assembly only (union clauses, `encdec` and `assembly` mappings; TableGen records with
`Inst` and `AsmString`), no semantics. `llvm-tblgen` reads the TableGen files; the Sail files have not been through the
Sail compiler. The generator checks each Sail clause against the TableGen record of the same name bit by bit, and the
tests assemble every instruction with two independent assemblers (py65 and ca65, skoolkit and sjasmplus; Hack against
the book's examples). An instruction is its bytes in memory order in Sail, while TableGen numbers the first byte lowest,
as LLVM does.

## Updating

Sail: copy the same files from a newer tag of sail-riscv into `sail-riscv/model/` (and the `.td` files of `llvm/RISCV/`
and `llvm/MOS/` from the new LLVM / llvm-mos) and run `npm run isa`. The Sail reader
(`tools/isa/sail.mjs`) understands only what the encoding clauses use, so a new construct makes it stop with the clause
it cannot read rather than produce a wrong sheet.

TableGen: build `llvm-tblgen` from the release (only it is needed: `ninja llvm-tblgen`), then

```sh
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target RISCV
npm run isa:tablegen -- --llvm ~/llvm-mos --project llvm-mos/llvm-mos --tblgen ~/llvm-project/build/bin/llvm-tblgen --target MOS
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Z80 --td spec/unofficial/z80/Z80.td --out spec/unofficial/z80/Z80.json --project unofficial
npm run isa:tablegen -- --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target Hack --td spec/unofficial/hack/Hack.td --out spec/unofficial/hack/Hack.json --project unofficial
npm run isa
```

The generator compares Sail with TableGen bit by bit and stops on any disagreement. Update this table, then regenerate the
test vectors (`npm run vectors`, `npm run vectors:llvm`) and run `npm test`.
