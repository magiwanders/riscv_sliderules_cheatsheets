# RISC-V Sliderules: notes for coding agents

An instruction encoder / decoder rendered as two big HTML tables (the "sliderules"), for RV32 and RV64 (every ratified
extension), A64, A32, Thumb, MIPS32 and MIPS64, the 8080, the 8051, the 8086, IA-32, x86-64, the Z80, the 6502 and the Hack computer. Plain ES modules, no framework, built as a library with Vite. Read this before changing anything;
the most common changes, adding a RISC-V extension or a whole instruction set, have their own checklists below.

## Layout

| Path | What it is |
| --- | --- |
| `src/isa/rv32gc.mjs`, `rv64gc.mjs`, `hack.mjs`, `mos6502.mjs`, `z80.mjs`, `i8080.mjs`, `mcs51.mjs`, `mips32.mjs`, `mips64.mjs`, `a64.mjs`, `a32.mjs`, `t32.mjs`, `i8086.mjs`, `ia32.mjs`, `x86_64.mjs` (the three x86 sheets make their rows from their lines with `x86.mjs`) | One module per instruction set (RV32 and RV64 share `riscv.mjs`: `riscvSheets` makes their settings, extension subsets and CSR names; MIPS32 and MIPS64 `mips.mjs`), what the codec reads: formats, decoder sections, groups, instructions, unused opcodes, pseudo-instructions, and the set's own settings (spine, immediates, decode order, ...). Encodings are strings in the spec's notation. Each re-exports its data, registers included, from `generated/`. |
| `src/isa/generated/` | **Generated, do not edit**: the instruction data and registers of every set, written by `npm run isa`. |
| `src/isa/overlay/*.json` | What the sheets show that Sail and TableGen do not carry: sections, groups, titles, descriptions, pseudocode, flags, HINT / reserved rows, the order of rows, unused opcodes, pseudo-instructions, register meanings, and the few presentation overrides. Edit these. |
| `spec/` | The sources. Official, pinned (do not edit): the Sail model's files (`spec/sail-riscv/`, RV32 and RV64 alike), LLVM's RISC-V and llvm-mos's 6502 `.td` files and their TableGen extracts (`spec/llvm/`), the RISC-V Unified Database's instructions (`spec/udb/`). Unofficial, this project's own (edit, then `npm run isa`): Sail and TableGen of the 8080, the 8051, the Z80 and Hack, Sail of the 6502 (`spec/unofficial/`). `spec/README.md` has the versions and how to update them. |
| `tools/isa/` | The generators: `sail.mjs` reads Sail encodings, `tablegen.mjs` extracts TableGen (`npm run isa:tablegen`), `gen-riscv.mjs` (RV32 and RV64), `gen-mos6502.mjs`, `gen-mips.mjs` (MIPS32, MIPS64), `gen-a64.mjs` (A64), `gen-a32.mjs` (A32), `gen-t32.mjs` (Thumb; all LLVM's TableGen against the unofficial Sail, through `llvm-sail.mjs`), `gen-x86.mjs` (8086, IA-32, x86-64: a typed table in Intel's opcode notation with the operand size as a parameter, `src/isa/overlay/x86.json`, resolved per mode and size and checked against LLVM's X86 records, which have no Inst bits; the generated modules hold the lines, `src/isa/x86.mjs` expands them to a row per addressing form and REX when a sheet loads; it also writes the Sail), `gen-retro.mjs` (Z80, 8080, 8051, Hack) check Sail against TableGen and merge them with the overlay into `src/isa/generated/`. |
| `src/isa/isas.mjs` | The instruction sets of the title's selector: `isas`, listed under their `family` (`families` names them). Those with a `codec` have sheets; the others show a `<Coming soon>` placeholder (`_selectIsa` in `src/sliderule.mjs`). `extensions` gives a member the extension toggles. A codec is made on first use (`make`; test `'codec' in isa`, not `isa.codec`, to avoid making it); `heavy` members (x86) are first opened under a spinner (`_busy` in `src/sliderule.mjs`). |
| `TODO.md` | Open work: the extensions still to come as toggles per instruction set, and the known details and limits of the sheets. |
| `src/isa/riscv-extensions.mjs` | The ratified RISC-V extensions the toggles show: the letters, the Z extensions folded under each, G and the bundles (B, Zk), what each needs, the ISA string. `withExtensions` (from `riscvSheets` in `riscv.mjs`) makes the sheets of a set of them; `BASE_ONLY` marks those of one width (Zilsd, Zclsd). |
| `src/isa/codec.mjs` | Everything derived from that data, per set (`createCodec`): parsing encodings into segments, masks, matching, decoding, encoding (`encodeAssembly`; `assemblyChoice` gives the entry and operand values the encoder's Paste Assembly sets), pseudo-instruction expansion, operand descriptions for the UI, the spine. No DOM. Its named exports are RV32GC's. |
| `src/isa/api-gen.js` | Writes `public/isa/*.json` (the data as an API) and the header's Sail / TableGen downloads (`public/isa/<set>.sail`, `.td`, git-ignored) during `npm run build`; run it once before `npm run dev` to have the downloads there. |
| `src/sliderule.mjs` | The app: per set state and sheets (`_use`), encoder selectors, decoder output, header tools, URL state (share links), view switching animation. |
| `src/encoder.mjs`, `src/selector.mjs` | Encoder table (a2b) and decoder table (b2a). They give their rows as units (an instruction, a decoder group) to `src/lazyrows.mjs`, and keep the rows that do not depend on the chosen operands / bits per sheet (`sheet.rowCache`). |
| `src/lazyrows.mjs` | A sheet's rows built as they come near the screen: chunks of units, each its own `<tbody>`, an empty spacer row until built, kept once built (`lazyRows`; `buildAllRows` before a PDF; `builtRows` for code that walks the rows). Short sheets are built at once. Never put a whole long sheet in the DOM: x86-64's took the browser over 20 s to lay out. |
| `src/cells.mjs` | Table cells shared by both tables, the header above them (title, pill, tools, credits). |
| `src/carousel.mjs`, `src/builders.mjs`, `src/tristate.mjs` | Carousel selector, encoder operand selectors, the 0/1/x switches of the spine with their hex digits. |
| `src/pdf.mjs` | PDF download of the visible sheet, A4 landscape or A3 portrait (loads html-to-image and jsPDF from CDNs on demand). Pages break on the grid lines found in the rendered picture, not on the page's row positions (the picture's rows are not as high as on screen). |
| `src/line.mjs` | One line of a sheet for other pages (`sliderules.line`, `public/line.js`): `encoderLine` / `decoderLine` of an assembly instruction or of bytes of memory, `show` / `hide` them in a popup by the pointer, `disassemble`, `assemble`. Ash calls it; keep its names and arguments stable (`test/line.test.mjs`). |
| `src/registers.mjs` | The register tables of the header's register buttons: `codec.spec.registers` grouped by each section's `group` (one button per group), the popups' tables. |
| `public/` | Copied as is into the build: `styles.css`, `embed.js` (one-line embedding), `line.js` (the line API on its own), `index.html` (the site, uses `embed.js`). |
| `index.html`, `src/dev.mjs` | Development entry (`npm run dev`): mounts the sheets straight from `src/`. |
| `docs/` | README screenshots: retake them when the UI changes visibly. |
| `test/` | `node --test` suites, shared test cases, the vector generators (GNU as, llvm-mc, py65, skoolkit, ca65, sjasmplus) and their output. |
| `dist/` | Build output (git-ignored), **served live** as sliderules.magiwanders.com. Only `npm run build` writes it. |

## What must never be committed (licences)

- **Arm's machine-readable ISA specification** (the A64 / AArch32 XML, its ASL, the PDFs and anything generated from
  them by a script, such as a Sail or TableGen file or a table of encodings): recent releases say *"No part of this
  document may be reproduced in any form by any means without the express prior written permission of Arm"*. It may
  be used on a developer's machine as a check that reads it in place (a test that skips when it is missing), never
  copied into the repository or the build. The Arm sheets' unofficial Sail is written by hand from the Architecture
  Reference Manual and checked against LLVM's TableGen (Apache 2.0, which may be committed) and the assemblers.
- **Manuals and datasheets** (Intel, Zilog, MOS, MIPS, Arm PDFs): cite them, do not commit them or text copied from them.
- **Assembler and toolchain sources or binaries** (binutils, LLVM builds, asl, ASxxxx, cc65, sjasmplus, nasm): the
  tests run them from outside the repository (`~/.local/src`, environment variables); only their output (the vectors in
  `test/vectors/`) is committed.
- What may be committed: the official sources of `spec/` with their licence files (sail-riscv BSD 2-Clause, LLVM and
  llvm-mos Apache 2.0 with LLVM exception, the RISC-V Unified Database BSD 3-Clause Clear) and this project's own
  unofficial descriptions (CC BY-SA 4.0). A new official source needs its licence checked and added to
  `spec/README.md` first.

## Conventions

- Functions take one object with defaulted names: `function cell({ width = 1, classes = '' })`, called as
  `cell({ width: 2 })`. Module-private helpers start with `_`.
- DOM elements come from the global helpers of `https://cdn.magiwanders.com/main.js`: `_div(attributes, children)`,
  `_td(...)`, `_button(...)` and so on, one per HTML tag. Do not shadow them (no local variable called `_table`).
- Instruction knowledge lives in the official sources, the overlays and the instruction set modules only. If you find
  yourself writing an instruction name in UI code, add a property to the data instead (see `asmShift`, `rmDefault`,
  `nonZeroImm`). Never edit `src/isa/generated/`: change its sources or overlay and run `npm run isa`.
- Comments say why, briefly, in the style of the surrounding code. Two-space indent, single quotes, semicolons.
- Colours: see *Colour palette* below.

## Colour palette

The colours come from the original spreadsheet sheets (Google Sheets' palette) and carry meaning. Keep to these rules
(the README's *How the sheets are drawn* sums them up, with the rules for cells, immediates and order).

**Every format is one hue with two shades**, set by a `.fmt-<FORMAT>` rule in `public/styles.css`:
`--strong` is the hue's Google Sheets *light 1* shade (format header row, mnemonic cell, funct / literal bits),
`--light` its *light 3* shade (text cells, Ext / Type columns). Current hues:

| Format(s) | Hue | `--strong` | `--light` |
| --- | --- | --- | --- |
| R, CA | red | `#e06666` | `#f4cccc` |
| CR | red (*light 2* as strong: a lighter variant) | `#ea9999` | `#f4cccc` |
| I, CI, CIW | green | `#93c47d` | `#d9ead3` |
| S, CS, CSS | yellow | `#ffd966` | `#fff2cc` |
| B, CB | cornflower blue | `#6d9eeb` | `#c9daf8` |
| U | purple | `#8e7cc3` | `#d9d2e9` |
| J, CJ | orange | `#f6b26b` | `#fce5cd` |
| CL | magenta | `#c27ba0` | `#ead1dc` |
| R4 | tan (not on paper, custom) | `#c9a46b` | `#f1e4cf` |
| V (vector arithmetic) | blue | `#6fa8dc` | `#cfe2f3` |
| VL, VS (vector loads / stores) | as I, S | | |
| CLB, CLH / CSB, CSH, CMPP / CU (Zcb, Zcmp) | as CL / CS, CSS / CA | | |

- **A compressed format reuses the hue of the 32 bit format it mirrors** (CA → R, CI / CIW → I, CS / CSS → S, CB → B,
  CJ → J). Give it the *light 2* shade as `--strong` only when it has to be told apart from a sibling in the same
  decoder section (as CR is from CA).
- **A genuinely new format gets a hue nobody uses yet**, as a *light 1* / *light 3* pair. The palette's last free
  hue, blue (`#6fa8dc` / `#cfe2f3`), went to the vector format V. Teal-cyan is taken by the section bars, greys by the grid (`#b7b7b7`) and `--muted`. If you need a
  colour outside the palette, pick a strong shade that dark text reads well on and a light shade around 80 % towards
  white, as R4's tan does.
- **Never reuse the reserved colours** for a format: section bars and the bit-number row `--section` `#76a5af`
  (teal); reserved encodings `--reserved` `#ff0000`; pseudo-instructions `--pseudo` `#ff00ff` (magenta, white bold
  text); the unused upper half of a compressed instruction `--unused` `#000000`; HINTs, unused opcodes, `x` / zero
  bits `--muted` `#f3f3f3` with grey text.
- **The other instruction sets reuse these hues** by what a format mirrors, so a colour means the same on every sheet:
  operands in registers red (Hack's C, `IMP`, `ACC`, `REG`), immediates green (Hack's A, `IMM`), short addresses yellow
  (`ZP`, `ZPX`, `ZPY`, the 8051's direct bytes `DIR`), long ones blue (`ABS`, `ABX`, `ABY`, `EXT`), pointers purple (`IND`) or magenta (`IZX`, `IZY`,
  `IDX`), relative jumps orange (`REL`), bit operations tan (`BIT`). Bytes a byte instruction does not have are
  `--muted` (`.bit.absent`), not black: most rows have some, and on these sheets nothing else lives there.
- **Registers and opcode bits are white** (`--register`) in every format, so the format colour marks what the
  instruction does, not where its operands are.
- **Immediates are derived, not picked**: the pieces of a split immediate get four shades of `--strong`
  (`.imm-0` the strong colour itself, `.imm-1` 45 % mixed with white, `.imm-2` 70 % mixed with black with white text,
  `.imm-3` 70 % mixed with white) through `color-mix()`. The same piece has the same shade in the instruction row and
  in the immediate row underneath, so a new format only needs its two shades.

## Adding an extension

RV32 and RV64 have every ratified extension the Sail model, LLVM and the Unified Database know; a new one (once
ratified) goes in `EXTENSION_TREE` of `src/isa/riscv-extensions.mjs` (with `REQUIRES` / `CONFLICTS`), and its
instructions follow these steps. The data is generated (`npm run isa`, `tools/isa/gen-riscv.mjs`, once per width):
encodings and assembly from the Sail model and LLVM's TableGen, checked against the Unified Database, everything else
from `src/isa/overlay/rv32gc.json`; RV64 reads that overlay changed by `rv64gc.json` (rows of RV32-only instructions go,
its rows come in by `replaces` / `after` / their group, see `loadOverlay`). An instruction both widths have needs a row
in `rv32gc.json` only; one only RV64 has (IsRV64 in LLVM) a row in `rv64gc.json`. The generator stops with a message naming what is
missing or disagrees, so the order below is the order its messages come in. Work through these in order.

1. **Sail**: copy the extension's `*_insts.sail` (and the types / mappings it uses) from the pinned sail-riscv tag into
   `spec/sail-riscv/model/`, add the files to `SAIL_FILES` and the extension to `CONFIG` in
   `gen-riscv.mjs` (`RV32_ONLY` if RV64 lacks it). Guards calling a function the Sail reader does not know stop it: add the function to `_HELPERS`
   in `tools/isa/sail.mjs`, mirroring its Sail definition.
2. **TableGen**: allow the extension's predicate in `TARGETS.RISCV` of `tools/isa/tablegen.mjs` and extract again (see
   `spec/README.md`). Sail and TableGen must then agree on every bit: the generator pairs each Sail encoding with one
   LLVM instruction (several LLVM instructions may share one Sail clause: the 32 mop.r.N). Instructions only one of them
   has go in `EXCLUDE_SAIL` / `EXCLUDE_LLVM` with a reason; an extension the Sail model lacks goes in `LLVM_ONLY`, and its
   instructions then need the Unified Database (`spec/udb`) as their second source.
3. **Groups** (`groups` in the overlay). A group is one header row of the decoder: instructions sharing a format and
   a meaning, usually a major opcode or a funct3 family. Give it `section` (`q0`–`q2` compressed quadrants, `q3`
   32 bit), `format` (must be LLVM's format of its members), `extension` (the name shown in the Ext column, e.g.
   `'Zba'`), `title` and `pseudocode`.
4. **Rows** (`instructions` in the overlay, in order: the decoder breaks ties by it). One object per row:
   - instructions: `group`, `def` (the LLVM instruction: mnemonics repeat, as F's and Zfinx's fadd.s), `description`,
     `pseudocode`, `expands` for a compressed
     instruction's 32 bit equivalent. `enc`, `asm`, `fregs`, `extension`, `asmShift`, `rmDefault`, `nonZeroImm` and the
     register constraints are generated; the README's *How the sheets are drawn* gives the rules;
   - HINT and reserved rows: `group`, `hint: true` or `reserved: true`, `enc`, `description`. A row that equals an
     instruction of its group with one operand fixed takes that value away from it (c.li's HINT row makes its `rd!=0`).
     `sail: 'CTOR'` ties a row to a Sail encoding LLVM spells as something else (PAUSE);
   - overrides, only where the spec's tables draw something differently: `dontCare` (bit ranges `'19:15'` the hardware
     ignores), `cells` (cell widths in bits, msb first, re-splitting literal runs), `immName`, `zero` (fields the
     assembly cannot set, written as 0: vsetvli's vtr). A group whose sheet format is not LLVM's says so in `llvmFormats`
     (vector instructions are LLVM's R, the sheets' V).
   Masks, matching, decoding, encoding, table cells and the encoder's selectors all follow from the generated strings.
5. **New format?** Add it to `formats` in the overlay (`title`, `width`, `layout` of `[name, hi, lo, role]` with roles
   `opcode`, `funct`, `reg`, `imm`; the layout also cuts cells) and give it a `.fmt-<NAME>` colour pair in
   `public/styles.css` following the palette rules above.
6. **New operand kind?** (a field that is not a register, immediate, csr, rm, fence set or aq/rl, e.g. a vector mask.)
   Teach `sail.mjs` and `gen-riscv.mjs` its bits, then extend `FIELDS` / `OPERAND` and `operandInfo` in `codec.mjs`,
   `_controlFor` in `builders.mjs` (its selector), `assemblyParts` (how it prints) and `test/cases.mjs` (how tests pick
   values).
7. **Ext selector**: add the extension name to `extensions` in the overlay. Entries whose extension is not listed there
   cannot be reached through the Ext selector.
8. **Opcodes**: the generator checks `unusedOpcodes` against the major opcodes Sail leaves free; drop the ones the
   extension takes.
9. **Pseudo-instructions** (`pseudoInstructions` in the overlay): `name`, `asm`, `description`. The expansion comes from
   LLVM's `InstAlias` with the same operands; only pseudo-instructions LLVM expands in C++ (`li`, `call`, `la`, global
   loads and stores) give `expands`: `[base instruction, mapping]` pairs, where a number fixes the base field, a string
   passes a pseudo operand, `'hi'` / `'lo'` split a 32 bit value as `lui` / `auipc` + `addi` do. `short: true` takes
   the short form from LLVM's alias (`li`).
10. **Title**: the header says "Sliderule RV32GC Cheatsheet", the middle being the instruction set selector (its names
    are in `src/isa/isas.mjs`); update the label if the extension changes the name.

## Adding an instruction set

The sheets, the selectors and the codec all work from what an instruction set module exports (`createCodec` in
`codec.mjs` lists it; `hack.mjs` is the small example, `z80.mjs` the full one). Take the data from official machine
readable sources when they exist (a Sail model, an LLVM TableGen description, as `tools/isa/gen-mos6502.mjs` does for
the 6502 in a hundred lines), with an overlay for the rest. When they do not, write both as `spec/unofficial/` does
for the Z80 and Hack (marked UNOFFICIAL, encodings and assembly only) and generate from them with `gen-retro.mjs`;
give the set `specs` in `isas.mjs` and its files in `EXPORTS` of `api-gen.js` for the header's downloads, and
`registers` in its overlay (sections with a `group`, which names their button) for the register popups. To turn a placeholder in `isas.mjs` into real sheets:

1. **The spine**, `spine = { width, title, bytes }`: as many switches as the longest instruction has bits, a multiple
   of 4. With `bytes` an instruction starts on the left in memory order, the bytes it does not have stay empty on the
   right, and bits are numbered per byte (for little-endian byte machines: the 6502, the Z80, x86). Without it,
   inst[0] is the rightmost switch and shorter instructions sit on the right. Everything in the codec counts in spine
   positions, so a word of a shorter byte instruction has its bits at the top: use `codec.hex` / `codec.binary`.
2. **Data**: `formats`, `sections`, `groups`, `instructions`, `extensions` as in the extension checklist. Assembly
   templates may mark an optional part `{?...}`: it is left out when every operand in it is at its `omit` value (A64's
   `xm{?, shift #amount}`, `{?xr}`), and parsing takes it with its commas. A template starting with `~` glues its first
   part to the mnemonic (A32's `~sflagcond rd, rn, #mimm`: `addseq`); the operand text the codec parses then starts with
   that part and a space. An operand may `derive` its value from others (ldrd's second register), set its own `pattern`
   for parsing, and give a `text` that wins over its `names`. Write literal words of a template in upper case (`APSR`):
   lower case ones can contain an operand's name. An operand may be split over several cells like an immediate
   (`rdn[3] ... rdn[2:0]`; a value with bits no part holds is refused) and give a `step`; `spine.unit` (16) numbers a
   byte spine per halfword (Thumb). A spine wider than 32 bits (x86: 48, 88 and 96) makes words BigInts: the codec's
   `W` operations and the exported `bitOf` handle both, so code outside the codec never shifts a word itself. A format needs
   a `width` and `layout` only for instruction sets with fixed fields; without them the decoder's group headers come
   from the members' encodings, and a group's members must have the same width. Keep `sections` keys in the decoder's
   order. Encoding `name[7:0|15:8]` is a little-endian immediate.
3. **Operands**: `immediates` names the immediates of the encodings (`{ name: signed }`, all of them the operand `imm`,
   only one per instruction), `operands` everything else: `{ width, names, exclude }` for what is chosen from a list,
   `{ width, signed, text }` for a second number. Their names are the tokens of `enc` and `asm`; write everything
   else in `asm` in upper case so it stays literal. `repeatedNames` when a mnemonic has several rows (`LD`, `LDA`).
4. **Telling instructions apart**: without `widthOf` the width comes from which instructions the bits still allow,
   which suits prefixes and opcodes. Instruction sets that read differently: `separator`, `immText`, and for assembly
   that does not start with a mnemonic `arrange` and `parseAssembly` (Hack's `dest=comp;jump`).
5. **Sheets**: `labels` retitles columns (`null` leaves the Expansion column out; `expands` is what it shows),
   `widths` sizes them, `plainFormats` drops "-Type", `listedOrder` keeps the data's order in the encoder.
6. **Colours**: a `.fmt-<FORMAT>` rule per format, following the palette above.
7. **Register it** in `isas.mjs` with `codec: createCodec(module)` and a `version` (v0.1 until its text is reviewed too,
   see Testing in the README, and add it to that table); `api-gen.js` generates its API file.
8. **Reference**: never type opcode tables from memory unchecked. Compare against two independent assemblers as
   `test/gen-retro-vectors.mjs` and `test/gen-retro-assembler-vectors.mjs` do, including that every opcode they know is
   either listed or deliberately left out.

## Checking your change

```sh
npm run isa        # generate src/isa/generated/ from spec/ and the overlays (checks Sail against TableGen)
npm test           # generated data up to date, known encodings, round trips, pseudo-instructions, partial decoding, assemblers
npm run vectors    # re-assemble every RV32GC test case with GNU as into test/vectors/gnu-as.json (then npm test again)
npm run vectors:llvm   # the same with llvm-mc into test/vectors/llvm-mc.json (LLVM_BIN=... for its bin directory)
npm run vectors:retro  # the 6502 and the Z80 with py65 and skoolkit (PYTHON=... for a venv with them)
npm run vectors:retro-asm  # the 6502 and the Z80 with ca65 and sjasmplus, the 8080 / 8051 with asl and as8085 / as8051 (CC65_BIN=..., SJASMPLUS=..., ASL=..., ASXXXX_BIN=...)
npm run vectors:mips   # MIPS32 and MIPS64 with GNU as and llvm-mc (MIPS_PREFIX=..., LLVM_MC_BIN=...)
npm run vectors:a64    # A64 with GNU as and llvm-mc (AARCH64_PREFIX=..., LLVM_MC_BIN=...)
npm run vectors:a32    # A32 with GNU as and llvm-mc (ARM_PREFIX=..., LLVM_MC_BIN=...)
npm run vectors:t32    # Thumb with GNU as and llvm-mc (ARM_PREFIX=..., LLVM_MC_BIN=...)
npm run vectors:x86    # the 8086, IA-32 and x86-64 with GNU as and llvm-mc (X86_AS=..., X86_OBJDUMP=..., LLVM_MC_BIN=..., SETS=ia32,...)
npm run dev        # look at both sheets: http://localhost:5173
```

- Add a few encodings you can cite (spec examples, objdump output) to `KNOWN` in `test/codec.test.mjs`.
- `npm run vectors` needs a RISC-V GNU toolchain (`riscv-none-elf-as`, or set `RISCV_PREFIX`), `npm run vectors:llvm`
  llvm-mc and llvm-objdump with the RISC-V target. Both assemble the profiles of `test/riscv-profiles.mjs` (their
  `-march` / `-mattr` follow from the extensions); an extension that conflicts with others goes in the profile that has
  room for it. PC-relative groups go in `PC_RELATIVE`, pseudo-instructions that need relocations in `RELOCATED`
  (`test/riscv-text.mjs`). Commit the regenerated vectors with the change.
- In the browser: pick the new instructions in the encoder (each operand selector, extreme immediates), paste their
  words into the decoder, and check the colours and the decoder's grouping.
- `dist/` is git-ignored; building it deploys the live site, so only run `npm run build` when asked.

## The x86 table

- One generic table, `src/isa/overlay/x86.json`, is the source (it was first written by a one-off script): operand size
  `v` as a parameter, `sizes` setting SZ/D64/... (defined in `tools/isa/gen-x86.mjs`), `since`, `modes`; llvm names with
  `{v}{z}{a}{r32}` or per-size objects, `"32@64"` for mode-specific records.
- `gen-x86.mjs` resolves the lines per set (i8086 / ia32 / x86_64), checks each against the shape of its LLVM record
  (prefix 66 / REX.W from opsz / rexw, map, form, imm, In64BitMode / Not64BitMode, adsz) and writes
  `generated/{set}.mjs` with lines only; `src/isa/x86.mjs` expands the rows at load (forms per mode, REX variants with
  split fields `r64[3]` / `r64[2:0]`). Its Sail is generated, so weaker than the others (the docs say so).
- Vectors (`test/gen-x86-vectors.mjs`, ~4 min for x86-64): twins are dropped when the codec encodes the same line
  shorter. Assembler quirks: GNU needs `.allow_index_reg` for eiz, and rex.W + a 32-bit register for
  lgs / lar / lsl / sldt / str / mov r64,sreg; llvm-mc needs AT&T syntax for callw / retw / lret* / iret* / pushf* /
  push seg / mov r16,sreg and for 64-bit far indirect (lcallq / lcalll).
- Arm's XML on the maintainer's machine (`~/.local/src/arm-xml`) is only read in place by `test/arm-xml.test.mjs`.

## Toolchain on the maintainer's server

Everything was built from source under `~/.local` without root; reuse it instead of rebuilding, and run the vector
generators before claiming bit-perfect encodings. The vector scripts find these paths by default.

- `~/.local/src/llvm-project` (sparse, llvmorg-23.1.5): `build/bin/{llvm-tblgen,llvm-mc,llvm-objdump,clang,ld.lld}`
  with the RISCV target only (Ash's server also builds RISC-V C with this clang); `build-mc/bin/{llvm-mc,llvm-objdump,llvm-tblgen}`
  with X86, Mips, ARM and AArch64. A full clang rebuild takes hours: avoid.
- `~/.local/src/sail-riscv`, `~/.local/src/llvm-mos` (sparse), `~/.local/src/riscv-unified-db` (read by
  `tools/isa/udb.py` with the venv's PyYAML).
- `~/.local/opt/sliderules-venv` (cmake, ninja, py65, skoolkit, PyYAML):
  `PYTHON=~/.local/opt/sliderules-venv/bin/python npm run vectors:retro`.
- Assemblers: GNU as for RISC-V in `~/.local/opt/xpack-riscv-none-elf-gcc-15.2.0-1`; binutils 2.45
  `~/.local/src/binutils-build-{mips,arm,aarch64}/{gas/as-new,binutils/objdump}` (the system `as` / `objdump` 2.42 do
  x86); `~/.local/src/cc65/bin/{ca65,ld65}`; `~/.local/src/sjasmplus/sjasmplus`; `~/.local/src/asl/asl-current/{asl,p2bin}`;
  `~/.local/src/asxxxx/asxv6pxx/asxmak/linux/exe/{as8085,as8051}`; `~/.local/src/nasm-2.16.03/{nasm,ndisasm}`.
- Run builds as one plain command each (`make x 2>&1 | tail`): multi-target loops and subshells have been refused by
  the agent's permission checks.
