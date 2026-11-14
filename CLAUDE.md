# RISC-V Sliderules: notes for coding agents

An instruction encoder / decoder rendered as two big HTML tables (the "sliderules"), for RV32GC, the Z80, the 6502 and
the Hack computer. Plain ES modules, no framework, built as a library with Vite. Read this before changing anything;
the most common changes, adding a RISC-V extension or a whole instruction set, have their own checklists below.

## Layout

| Path | What it is |
| --- | --- |
| `src/isa/rv32gc.mjs`, `hack.mjs`, `mos6502.mjs`, `z80.mjs` | One module per instruction set, what the codec reads: formats, decoder sections, groups, instructions, unused opcodes, pseudo-instructions, and the set's own settings (spine, immediates, decode order, ...). Encodings are strings in the spec's notation. Each re-exports its data, registers included, from `generated/`. |
| `src/isa/generated/` | **Generated, do not edit**: the instruction data and registers of every set, written by `npm run isa`. |
| `src/isa/overlay/*.json` | What the sheets show that Sail and TableGen do not carry: sections, groups, titles, descriptions, pseudocode, flags, HINT / reserved rows, the order of rows, unused opcodes, pseudo-instructions, register meanings, and the few presentation overrides. Edit these. |
| `spec/` | The sources. Official, pinned (do not edit): the Sail model's RV32GC files (`spec/sail-riscv/`), LLVM's RISC-V and llvm-mos's 6502 `.td` files and their TableGen extracts (`spec/llvm/`). Unofficial, this project's own (edit, then `npm run isa`): Sail and TableGen of the Z80 and Hack, Sail of the 6502 (`spec/unofficial/`). `spec/README.md` has the versions and how to update them. |
| `tools/isa/` | The generators: `sail.mjs` reads Sail encodings, `tablegen.mjs` extracts TableGen (`npm run isa:tablegen`), `gen-rv32gc.mjs`, `gen-mos6502.mjs`, `gen-retro.mjs` (Z80, Hack) check Sail against TableGen and merge them with the overlay into `src/isa/generated/`. |
| `src/isa/isas.mjs` | The instruction sets: `families` for the title's selector, `isas` (each with its `family` and, in a family of several, its `variant` label for the pill next to it). Those with a `codec` have sheets; the others show a `<Coming soon>` placeholder (`_selectIsa` in `src/sliderule.mjs`). `extensions` gives a member the extension toggles. |
| `src/isa/riscv-extensions.mjs` | The ratified RISC-V extensions the toggles show, in groups (bundles G and B), what each needs, the ISA string. `withExtensions` in `rv32gc.mjs` makes the sheets of a set of them. |
| `src/isa/codec.mjs` | Everything derived from that data, per set (`createCodec`): parsing encodings into segments, masks, matching, decoding, encoding, pseudo-instruction expansion, operand descriptions for the UI, the spine. No DOM. Its named exports are RV32GC's. |
| `src/isa/api-gen.js` | Writes `public/isa/*.json` (the data as an API) and the header's Sail / TableGen downloads (`public/isa/<set>.sail`, `.td`, git-ignored) during `npm run build`; run it once before `npm run dev` to have the downloads there. |
| `src/sliderule.mjs` | The app: per set state and sheets (`_use`), encoder selectors, decoder output, header tools, URL state (share links), view switching animation. |
| `src/encoder.mjs`, `src/selector.mjs` | Encoder table (a2b) and decoder table (b2a). |
| `src/cells.mjs` | Table cells shared by both tables, the header above them (title, pill, tools, credits). |
| `src/carousel.mjs`, `src/builders.mjs`, `src/tristate.mjs` | Carousel selector, encoder operand selectors, the 0/1/x switches of the spine with their hex digits. |
| `src/pdf.mjs` | PDF download of the visible sheet (loads html-to-image and jsPDF from CDNs on demand). |
| `src/registers.mjs` | The register tables of the header's register buttons: `codec.spec.registers` grouped by each section's `group` (one button per group), the popups' tables. |
| `public/` | Copied as is into the build: `styles.css`, `embed.js` (one-line embedding), `index.html` (the site, uses `embed.js`). |
| `index.html`, `src/dev.mjs` | Development entry (`npm run dev`): mounts the sheets straight from `src/`. |
| `docs/` | README screenshots: retake them when the UI changes visibly. |
| `test/` | `node --test` suites, shared test cases, the vector generators (GNU as, llvm-mc, py65, skoolkit, ca65, sjasmplus) and their output. |
| `dist/` | Build output (git-ignored), **served live** as sliderules.magiwanders.com. Only `npm run build` writes it. |

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

- **A compressed format reuses the hue of the 32 bit format it mirrors** (CA → R, CI / CIW → I, CS / CSS → S, CB → B,
  CJ → J). Give it the *light 2* shade as `--strong` only when it has to be told apart from a sibling in the same
  decoder section (as CR is from CA).
- **A genuinely new format gets a hue nobody uses yet**, as a *light 1* / *light 3* pair. Still free: blue
  (`#6fa8dc` / `#cfe2f3`). Teal-cyan is taken by the section bars, greys by the grid (`#b7b7b7`) and `--muted`. If you need a
  colour outside the palette, pick a strong shade that dark text reads well on and a light shade around 80 % towards
  white, as R4's tan does.
- **Never reuse the reserved colours** for a format: section bars and the bit-number row `--section` `#76a5af`
  (teal); reserved encodings `--reserved` `#ff0000`; pseudo-instructions `--pseudo` `#ff00ff` (magenta, white bold
  text); the unused upper half of a compressed instruction `--unused` `#000000`; HINTs, unused opcodes, `x` / zero
  bits `--muted` `#f3f3f3` with grey text.
- **The other instruction sets reuse these hues** by what a format mirrors, so a colour means the same on every sheet:
  operands in registers red (Hack's C, `IMP`, `ACC`, `REG`), immediates green (Hack's A, `IMM`), short addresses yellow
  (`ZP`, `ZPX`, `ZPY`), long ones blue (`ABS`, `ABX`, `ABY`, `EXT`), pointers purple (`IND`) or magenta (`IZX`, `IZY`,
  `IDX`), relative jumps orange (`REL`), bit operations tan (`BIT`). Bytes a byte instruction does not have are
  `--muted` (`.bit.absent`), not black: most rows have some, and on these sheets nothing else lives there.
- **Registers and opcode bits are white** (`--register`) in every format, so the format colour marks what the
  instruction does, not where its operands are.
- **Immediates are derived, not picked**: the pieces of a split immediate get four shades of `--strong`
  (`.imm-0` the strong colour itself, `.imm-1` 45 % mixed with white, `.imm-2` 70 % mixed with black with white text,
  `.imm-3` 70 % mixed with white) through `color-mix()`. The same piece has the same shade in the instruction row and
  in the immediate row underneath, so a new format only needs its two shades.

## Adding an extension

RV32GC's data is generated (`npm run isa`, `tools/isa/gen-rv32gc.mjs`): encodings and assembly from the Sail model and
LLVM's TableGen, everything else from `src/isa/overlay/rv32gc.json`. The generator stops with a message naming what is
missing or disagrees, so the order below is the order its messages come in. Work through these in order.

1. **Sail**: copy the extension's `*_insts.sail` (and the types / mappings it uses) from the pinned sail-riscv tag into
   `spec/sail-riscv/model/`, add the files to `SAIL_FILES` and the extension to `CONFIG.extensions` in
   `gen-rv32gc.mjs`. Guards calling a function the Sail reader does not know stop it: add the function to `_HELPERS`
   in `tools/isa/sail.mjs`, mirroring its Sail definition.
2. **TableGen**: allow the extension's predicate in `TARGETS.RISCV` of `tools/isa/tablegen.mjs` and extract again (see
   `spec/README.md`). Sail and TableGen must then agree on every bit: the generator pairs each Sail encoding with one
   LLVM instruction. Instructions only one of them has go in `EXCLUDE_SAIL` / `EXCLUDE_LLVM` with a reason.
3. **Groups** (`groups` in the overlay). A group is one header row of the decoder: instructions sharing a format and
   a meaning, usually a major opcode or a funct3 family. Give it `section` (`q0`–`q2` compressed quadrants, `q3`
   32 bit), `format` (must be LLVM's format of its members), `extension` (the name shown in the Ext column, e.g.
   `'Zba'`), `title` and `pseudocode`.
4. **Rows** (`instructions` in the overlay, in order: the decoder breaks ties by it). One object per row:
   - instructions: `group`, `name` (the mnemonic), `description`, `pseudocode`, `expands` for a compressed
     instruction's 32 bit equivalent. `enc`, `asm`, `fregs`, `extension`, `asmShift`, `rmDefault`, `nonZeroImm` and the
     register constraints are generated; the README's *How the sheets are drawn* gives the rules;
   - HINT and reserved rows: `group`, `hint: true` or `reserved: true`, `enc`, `description`. A row that equals an
     instruction of its group with one operand fixed takes that value away from it (c.li's HINT row makes its `rd!=0`).
     `sail: 'CTOR'` ties a row to a Sail encoding LLVM spells as something else (PAUSE);
   - overrides, only where the spec's tables draw something differently: `dontCare` (bit ranges `'19:15'` the hardware
     ignores), `cells` (cell widths in bits, msb first, re-splitting literal runs), `immName`.
   Masks, matching, decoding, encoding, table cells and the encoder's selectors all follow from the generated strings.
5. **New format?** Add it to `formats` in the overlay (`title`, `width`, `layout` of `[name, hi, lo, role]` with roles
   `opcode`, `funct`, `reg`, `imm`; the layout also cuts cells) and give it a `.fmt-<NAME>` colour pair in
   `public/styles.css` following the palette rules above.
6. **New operand kind?** (a field that is not a register, immediate, csr, rm, fence set or aq/rl, e.g. a vector mask.)
   Teach `sail.mjs` and `gen-rv32gc.mjs` its bits, then extend `FIELDS` / `OPERAND` and `operandInfo` in `codec.mjs`,
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
2. **Data**: `formats`, `sections`, `groups`, `instructions`, `extensions` as in the extension checklist. A format needs
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
npm run vectors:retro-asm  # the 6502 and the Z80 with ca65 and sjasmplus (CC65_BIN=..., SJASMPLUS=...)
npm run dev        # look at both sheets: http://localhost:5173
```

- Add a few encodings you can cite (spec examples, objdump output) to `KNOWN` in `test/codec.test.mjs`.
- `npm run vectors` needs a RISC-V GNU toolchain (`riscv-none-elf-as`, or set `RISCV_PREFIX`), `npm run vectors:llvm`
  llvm-mc and llvm-objdump with the RISC-V target. Add the extension to `MARCH` in `test/gen-gnu-vectors.mjs` and
  `MATTR` in `test/gen-llvm-vectors.mjs`; PC-relative groups go in `PC_RELATIVE`, pseudo-instructions that need
  relocations in `RELOCATED` (`test/riscv-text.mjs`). Commit the regenerated vectors with the change.
- In the browser: pick the new instructions in the encoder (each operand selector, extreme immediates), paste their
  words into the decoder, and check the colours and the decoder's grouping.
- `dist/` is git-ignored; building it deploys the live site, so only run `npm run build` when asked.
