# To do

What is left after every instruction set of the title's selector got its base sheet (2026-11-22). The base sets came
first; their extensions are to come as toggles under the title, as RISC-V's are (`extensions` in `src/isa/isas.mjs`,
`src/isa/riscv-extensions.mjs` for how RISC-V does it). Each needs the same checks as a base set: its Sail and TableGen
against each other, two assemblers, every row assembled (see CLAUDE.md, "Adding an instruction set").

## Extensions, as toggles

| Sheet | Extensions to add | Sources |
| --- | --- | --- |
| MIPS32, MIPS64 | FPU (COP1, single / double / paired single), COP2, MIPS-3D, DSP and DSP r2, MSA, MT, VZ; later Release 6 (other encodings: a sheet of its own) and microMIPS / MIPS16e (16 / 32 bit: like Thumb) | LLVM's Mips target has them all (`_MIPS_BASE` in `tools/isa/tablegen.mjs` filters them out) |
| A64 | ARMv8.1+ (LSE atomics, RDM, CRC32, PAuth, BTI, MTE, RCpc, FP16, BF16, dot product, ...), Advanced SIMD (NEON), crypto (AES, SHA, SM3 / SM4), SVE / SVE2, SME | LLVM's AArch64 target (`_A64_LATER`); Arm's XML only to compare locally, never to copy (CLAUDE.md, licences) |
| A32, Thumb | VFPv3 / v4 floating point, Advanced SIMD (NEON), the ARMv8 AArch32 additions (LDA / STL, CRC32, crypto, VSEL ...), the M profile's Thumb (ARMv7-M, v8-M: a sheet or a toggle) | LLVM's ARM target (`_ARMV7`, `_THUMBV7`) |
| 8086 | the 8087's x87 instructions; the 80186 / 80286 additions as a sheet or toggle of their own (now only on IA-32) | the typed table (`src/isa/overlay/x86.json`, `since`) |
| IA-32, x86-64 | x87, MMX, SSE to SSE4.2, AVX / AVX2 / AVX-512 (VEX and EVEX prefixes: a new prefix model in `src/isa/x86.mjs`), BMI1 / 2, ADX, AES-NI, PCLMUL, SHA, RDRAND / RDSEED, TSX, CET, VMX / SVM, APX (REX2) | LLVM's X86 target; the typed table needs mandatory prefixes (66 / F2 / F3 as part of the opcode: `pfx` in LLVM's records), VEX / EVEX fields, the 0F38 / 0F3A maps |
| 8080 | the 8085's RIM and SIM (an 8085 sheet or toggle) | asl and as8085 already assemble them |
| 8051 | the derivatives' extra instructions, if any is wanted (most add only SFRs) | |
| Z80 | the undocumented instructions (IXH / IXL halves, SLL, ED duplicates; skoolkit knows them), Z180 / eZ80 | skoolkit, sjasmplus |
| 6502 | the 65C02 (CMOS) and the NMOS undocumented opcodes, the 65816 | llvm-mos has the 65C02 and others |

## Details and limits of the sheets as they are

- **x86 (8086, IA-32, x86-64)**
  - 64 bit immediates and addresses (`mov r64, imm64`, `movabs`) are exact only up to 2^53, as far as a JavaScript number
    is: the codec's immediates are numbers. BigInt immediates would lift it.
  - Not on the sheets: CR8 (REX.R on `mov cr`); the 67 prefix's other address size (16 bit addressing in 32 bit mode, 32
    bit in 64 bit mode) as rows of its own (only the prefix's own row); the 66 prefixed near branches of 32 bit mode;
    the 16 bit `push imm` / `push sreg` of 32 and 64 bit mode; `mov sreg, r16` with the 66 prefix (assemblers do not write
    it); the ES / CS / SS / DS overrides in 64 bit mode (they do nothing there).
  - `[bp]`, `[ebp]`, `[rbp]`, `[r13]` are written with `+0x0`: they have no form without a displacement, and the sheet
    only parses what each row's template says.
  - Prefixes (lock, rep, segment overrides, data16) are rows of their own: an instruction with one decodes as two lines.
  - The x86 Sail (`spec/unofficial/x86/`) is generated from the typed table, not written apart from it: the table is
    what is checked against LLVM. A hand-written Sail (or an independent .td) would make the check two-sided.
  - The vectors: GNU as needs `rex.W` and the 32 bit register for a few 64 bit forms it writes without REX.W or does not
    know (`lgs`, `lar`, `lsl`, `sldt`, `str`, `smsw`, `mov r64, sreg`), llvm-mc AT&T syntax where its Intel syntax cannot
    say the size (`test/gen-x86-vectors.mjs`); generating x86-64's takes about 4 minutes (`test/cases.mjs` tries every
    shorter row of each case).
  - A PDF of a whole x86 sheet (thousands of rows) is likely beyond a canvas's height: `src/pdf.mjs` should render it in
    slices.
- **Thumb**: the line API disassembles BF00 as `hint #0`; check whether the sheet should show `nop` there.
- **v0.1 sheets**: flags, pseudocode and descriptions are not checked against a reference yet (only bits, mnemonics and
  lengths are; README, Testing).
- **Arm**: the sheets are compared with Arm's machine-readable XML only where it is installed (`test/arm-xml.test.mjs`);
  nothing derived from it may be committed.

## Performance

- Rows are built as they come near the screen (`src/lazyrows.mjs`), codecs on first use, x86 sheets under a spinner the
  first time. Still worth doing: build the codec of a heavy sheet in a worker (its 0.5 s would not block the page),
  build chunks in idle time ahead of the scroll, and keep the chunks of a sheet across filter changes (now the rows
  are kept, the chunks are cut again).
- `dist/` (the live site) is only rebuilt by `npm run build`.
