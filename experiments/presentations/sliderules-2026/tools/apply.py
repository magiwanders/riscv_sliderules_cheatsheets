# Copies the screenshots into ../img and puts the SVGs annotate.py wrote into ../slides.md (in place of the three
# <svg class="ui"> blocks: encoder, decoder, header, in this order).
import json, re, shutil
for name in ['ui-encoder', 'ui-decoder', 'ui-decoder2', 'ui-header']:
    shutil.copy(f'shots/{name}.png', f'../img/{name}.png')
svgs = json.load(open('ui-svgs.json'))
text = open('../slides.md').read()
blocks = list(re.finditer(r'<svg class="ui".*?\n</svg>', text, flags=re.S))
assert len(blocks) == 3, f'expected 3 annotated slides, found {len(blocks)}'
for m, key in reversed(list(zip(blocks, ['enc', 'dec', 'hdr']))):
    text = text[:m.start()] + svgs[key] + text[m.end():]
open('../slides.md', 'w').write(text)
print('slides.md updated')
