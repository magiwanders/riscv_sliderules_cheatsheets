# RISC-V Sliderules Cheatsheets

This project is [going to be] deployed [HERE](https://sliderules.magiwanders.com)

---

[Usage Documentation](https://github.com/magiwanders/riscv-sliderules-cheatsheets/wiki/Usage-Documentation)

[Contribution Guide](https://github.com/magiwanders/riscv-sliderules-cheatsheets/wiki/Contribution-Guide)

---

**Repository for the Summer 2023 RISC-V / LFX Mentorship "Bringing the Sliderules Cheatsheets to the Web"**

[Original Sliderules Spreadsheet](https://docs.google.com/spreadsheets/d/1NEmSSZ3zFXfEjtlMpfl4wUDlTy_tIQK-rKLOWiNk-1E/edit?usp=sharing)

---

## Development

```sh
npm install
npm run dev        # http://localhost:5173 (loads the library straight from src/)
npm test           # encoder / decoder tests (node --test)
npm run vectors    # regenerate test/vectors/gnu-as.json with GNU as (riscv-none-elf-as, or RISCV_PREFIX=...)
npm run pdf        # render both sheets to public/RV32GC-Sliderules.pdf (A3, the "PDF" button)
npm run build      # build into dist/ (served as sliderules.magiwanders.com)
```

The tests check well-known encodings, round-trip every instruction (encode → decode → re-assemble) with random
and edge-case operands, and, once `test/vectors/gnu-as.json` exists, compare every encoding against GNU as.
