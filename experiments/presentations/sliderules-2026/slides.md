---
marp: true
size: 16:9
paginate: true
title: RISC-V Sliderules
author: Simone Shawn Cazzaniga
style: |
  section {
    font-family: 'DejaVu Sans', sans-serif;
    font-size: 24px;
    color: #1f2a30;
    background: #ffffff;
    padding: 50px 64px;
  }
  h1, h2 { color: #3f7280; margin-bottom: 0.3em; }
  h2 { font-size: 1.6em; border-bottom: 4px solid #74a4b0; padding-bottom: 0.15em; }
  strong { color: #2d5a66; }
  code { background: #e6f0f2; color: #1f2a30; border-radius: 4px; }
  pre { background: #f2f6f7; border-left: 4px solid #74a4b0; font-size: 0.62em; margin: 0.3em 0; }
  section::after { color: #8aa; font-size: 0.6em; }
  section p img { display: block; margin: 0.2em auto; }
  section.title { background: linear-gradient(135deg, #3f7280 0%, #74a4b0 100%); color: #fff; justify-content: center; }
  section.title h1 { color: #fff; font-size: 2.3em; margin-bottom: 0.1em; }
  section.title strong { color: #fff; }
  section.title a { color: #e6f0f2; }
  .sub { font-size: 1.15em; opacity: 0.95; margin-top: 0; }
  .people { margin-top: 1.4em; font-size: 0.95em; line-height: 1.6; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; }
  .note { font-size: 0.7em; color: #6b7d84; }
  .todo { background: #fff3cd; border: 2px dashed #d9a400; padding: 2px 8px; border-radius: 4px; }
  img.wide { width: 100%; border: 1px solid #c9d8dc; border-radius: 4px; }
  ul { margin-top: 0.3em; }
  li { margin: 0.15em 0; }
---

<!-- _class: title -->
<!-- _paginate: false -->

# RISC-V Sliderules

<p class="sub">An instruction encoder and decoder for the web,<br>laid out like the paper "sliderule" cheatsheets</p>

<div class="people">

**Simone Shawn Cazzaniga** ([@magiwanders](https://github.com/magiwanders))

Contributors: **Jayaraj J** ([@jyrj](https://github.com/jyrj)) · **Karbon Chen** ([@CSY-tvgo](https://github.com/CSY-tvgo))

[sliderules.magiwanders.com](https://sliderules.magiwanders.com)

</div>

---

## Who am I · what are the Sliderules

<div class="cols">
<div>

**Simone Shawn Cazzaniga**

- <span class="todo">TODO: role / affiliation</span>
- <span class="todo">TODO: background</span>
- <span class="todo">TODO: link to RISC-V / teaching</span>

**The Sliderules**

- Cheatsheets where every instruction's bits line up in columns: read across to **encode**, read down to **decode**
- <span class="todo">TODO: origin of the paper sheets</span>
- 2023: RISC-V / LFX Mentorship *"Bringing the Sliderules Cheatsheets to the Web"*

</div>
<div>

![w:540](img/sheet.png)

</div>
</div>

---

## Encoder: pick an instruction, read its bits

![](img/encoder-crop.png)

- Pick **extension**, **type**, **mnemonic**, then each **operand**: sliders and `0x…` / `0b…` fields that only take valid values
- The bits update live, grouped by field, hex digits on top; copy assembly, binary or hex
- **RV32 / RV64** with every ratified extension (1,142 / 1,245 instructions), **Z80**, **6502**, **Hack**
- Generated from the official **Sail** model, **LLVM TableGen** and the **Unified Database**; **bit-perfect against GNU as and llvm-mc**

---

## Decoder: set bits, read the instruction

![](img/decoder-crop.png)

![](img/decoder-full.png)

- Click or type bits (`0`, `1`, `x` = don't care), or **paste a word** (`0xfff50513`)
- The table **narrows as you go**: 10 bits set and only `addi` is left; 32 and it reads `addi a0, a0, -1`
- Sorted as hardware decodes: quadrant, opcode, funct3, funct7
- **Share** puts the session in a link; **⤓ PDF** prints the sheet as shown

---

## Ash integration: one line of the sheet, anywhere

<div class="cols">
<div>

```html
<script type="module"
  src="https://sliderules.magiwanders.com/line.js">
</script>
```

```js
const line = window.sliderulesLine;
line.encoderLine({ isa: 'rv32gc',
                   assembly: 'addi a0, a0, -1' });
line.decoderLine({ isa: 'rv32gc', bytes: [0x01, 0x45] });
line.show({ isa, bytes, x, y });   // popup by the pointer
```

</div>
<div>

![w:500](img/ash.png)

</div>
</div>

**[Ash](https://ash.magiwanders.com)**, a simulator from NAND gates up to the Hack and RISC-V computers: hover an instruction, its bits or a byte of memory and its sliderules line pops up.

![w:1000](img/line.png)
