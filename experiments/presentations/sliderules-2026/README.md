# Instruction Set Sliderules: the 2026 talk

Seven slides in [Marp](https://marp.app) Markdown: `slides.md` is the source, `slides.pdf` the rendering.

1. Title, author and contributors, over a strip of the RV32GC sheet (`img/title-bg.png`)
2. Timeline, beside a Faber-Castell 2/83N from the [Slide Rule Museum](https://sliderulemuseum.com/VirtualSR2/react/faber_castell_2_83n.shtml)
3. Encoder: an annotated screenshot (`beq a0, a1, -8`)
4. Decoder: two annotated screenshots, `srli` / `srai` still open, then `srai a0, a0, 4` decoded
5. Header: an annotated screenshot of the title, the extension toggles and the tools
6. Structure: where the sheets' columns come from (TableGen, Sail, the JSON overlay)
7. Ash integration: the line API and an Ash screenshot

## Rendering

```sh
npm install --prefix ~/.local/opt/marp @marp-team/marp-cli   # once
./render.sh                                                    # slides.md -> slides.pdf
```

`render.sh` uses Playwright's Chromium (`CHROME_PATH` overrides it) and Marp's `--html`, since the annotated slides are
inline SVG. Keep blank lines out of those SVG blocks: a blank line ends an HTML block in Markdown.

## The annotated screenshots

The orange boxes, rings and arrows on slides 3–5 are SVG drawn over the screenshots, in the screenshots' own pixels,
from the positions the live page reports. When the UI changes, take them again:

```sh
cd tools
python3 capture.py    # screenshots of sliderules.magiwanders.com and the parts' positions, in shots/
python3 annotate.py   # the three SVGs (labels and where they sit are in this file)
python3 apply.py      # copies the screenshots into ../img and the SVGs into ../slides.md
cd .. && ./render.sh
```

`capture.py` drives Playwright's headless Chromium over the DevTools protocol (`cdp.py`, Python's `websocket-client`).
The label text can also be edited directly in `slides.md` (plain SVG `<text>`), but `apply.py` overwrites it.
