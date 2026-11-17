import json
ACC = '#e8590c'


def load(n):
    return json.load(open(f'shots/{n}.json'))['rects']


def box(r, pad=3, rx=6):
    x, y, w, h = r
    return f'<rect x="{x-pad}" y="{y-pad}" width="{w+2*pad}" height="{h+2*pad}" rx="{rx}" fill="{ACC}" fill-opacity="0.06" stroke="{ACC}" stroke-width="3"/>'


def ring(r, pad=5):
    x, y, w, h = r
    return f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2+pad+4}" ry="{h/2+pad}" fill="none" stroke="{ACC}" stroke-width="3"/>'


def outline(r):
    x, y, w, h = r
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{ACC}" stroke-width="2"/>'


def label(x, y, lines, anchor='middle', bg=False):
    out = []
    for i, t in enumerate(lines):
        if i == 0:
            out.append(f'<text x="{x}" y="{y+i*22}" text-anchor="{anchor}" font-size="20" font-weight="bold" fill="#c2410c">{t}</text>')
        else:
            out.append(f'<text x="{x}" y="{y+i*22}" text-anchor="{anchor}" font-size="17" fill="#1f2a30">{t}</text>')
    return '\n'.join(out)


def line(points):
    pts = ' '.join(f'{x},{y}' for x, y in points)
    return (f'<polyline points="{pts}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<polyline points="{pts}" fill="none" stroke="{ACC}" stroke-width="2.5" stroke-linejoin="round" marker-end="url(#ua)"/>')


def top_end(r, tx=None):
    x, y, w, h = r
    return (x + w / 2 if tx is None else tx, y - 6)


def bottom_end(r, tx=None):
    x, y, w, h = r
    return (x + w / 2 if tx is None else tx, y + h + 6)


def callout(shapes, lx, ly, lines, ends, side='top'):
    """shapes: highlight markup; ends: arrow end points; the arrows start under (top) or over (bottom) the label."""
    start = (lx, ly + 22 * (len(lines) - 1) + 8) if side == 'top' else (lx, ly - 22)
    arrows = ''.join(line([start, e]) if not isinstance(e, list) else line([start] + e) for e in ends)
    return ''.join(shapes), arrows + label(lx, ly, lines)


def svg(vb, images, callouts, extra=''):
    shapes = '\n'.join(c[0] for c in callouts if c[0])
    arrows = '\n'.join(c[1] for c in callouts if c[1])
    body = '\n'.join(x for x in [images, shapes, extra, arrows] if x)
    return (f'<svg class="ui" viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans, sans-serif">\n'
            f'<defs><marker id="ua" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{ACC}"/></marker></defs>\n'
            + body + '\n</svg>')


def union(*rs):
    x = min(r[0] for r in rs); y = min(r[1] for r in rs)
    X = max(r[0] + r[2] for r in rs); Y = max(r[1] + r[3] for r in rs)
    return [x, y, X - x, Y - y]


# ---------------- encoder
e = load('ui-encoder')
encoding = union(e['hex'], e['bits'])
x, y, w, h = encoding
enc = svg('-10 -125 1610 455', '<image href="img/ui-encoder.png" x="0" y="0" width="1562" height="170"/>', [
    callout([box(e['extType'])], 110, -100, ['Ext · Type', 'narrow the table'], [top_end(e['extType'])]),
    # the mnemonic's arrow comes down the gap left of its box, clear of the assembly's
    callout([box(e['mnemonic'])], 265, -100, ['Mnemonic', 'searchable list'], [[(262, 20), (e['mnemonic'][0] - 5, 62)]]),
    callout([box(e['asm'])], 560, -100, ['Assembly', 'hover an operand: its bits light up'], [top_end(e['asm'], tx=470)]),
    callout([ring(e['pasteAsm'])], 395, -32, ['Paste assembly'], [top_end(e['pasteAsm'])]),
    callout([box(e['operands'])], 885, -100, ['Operands', 'slider + dec / 0x / 0b field'], [top_end(e['operands'], tx=530)]),
    callout([ring(e['copyAsm']), ring(e['copyBin']), ring(e['copyHex'])], 1210, -100, ['Copy', 'assembly · bin · hex'],
            [top_end(e['copyAsm']), top_end(e['copyBin']), top_end(e['copyHex'])]),
    callout([box(e['descr'])], 175, 230, ['Descr. ›', 'unfolds description + explanation'], [bottom_end(e['descr'])], side='bottom'),
    callout([box(e['text'])], 490, 230, ['The chosen instruction', 'click any mnemonic to pick it'], [bottom_end(e['text'], tx=540)], side='bottom'),
    callout([box(e['fields'])], 860, 230, ['Fields', 'registers white, immediates in colour'], [bottom_end(e['fields'], tx=880)], side='bottom'),
    callout([box(e['immrow'])], 1215, 230, ['Immediate row', "the immediate's encoding, bit by bit"], [bottom_end(e['immrow'], tx=1250)], side='bottom'),
    # the encoding's arrow climbs the right margin and enters its box from the side
    callout([box(encoding)], 1460, 292, ['Encoding', 'hex digits over the bits'], [[(1585, 266), (1585, y + h / 2), (x + w + 7, y + h / 2)]], side='bottom'),
])

# ---------------- decoder: a partial decode (two candidates) over a complete one
d = load('ui-decoder'); d2 = load('ui-decoder2')
Y2 = 390  # where the second screenshot starts


def badge(n, cy):
    return (f'<line x1="-12" y1="{cy}" x2="5" y2="{cy}" stroke="{ACC}" stroke-width="2.5"/>'
            f'<circle cx="-22" cy="{cy}" r="8.5" fill="{ACC}"/><text x="-22" y="{cy+4}" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#fff">{n}</text>')


def at2(r):
    x, y, w, h = r
    return [x, y + Y2, w, h]


meaning = at2([778, 40, 312, 50])
row2 = at2(union(d2['row'], d2['imm']))
images = ('<svg x="0" y="0" width="1760" height="216" viewBox="0 0 1760 216"><image href="img/ui-decoder.png" x="0" y="0" width="1760" height="260"/></svg>'
          f'<image href="img/ui-decoder2.png" x="0" y="{Y2}" width="1760" height="180"/>')
dec = svg(f'-40 -125 1800 {Y2 + 180 + 205}', images, [
    callout([box(union(d['hex'], d['bits']))], 390, -100, ['Bits · hex digits', 'click 1 / 0 (again: x), type, paste, or set a digit'], [top_end(d['bits'], tx=390)]),
    callout([ring(d['copyBin'])], 30, -35, ['Copy bin'], [top_end(d['copyBin'])]),
    callout([ring(d['pasteBin'])], 160, -35, ['Paste bin'], [top_end(d['pasteBin'])]),
    callout([ring(d['pasteHex'])], 610, -35, ['Paste hex'], [top_end(d['pasteHex'])]),
    callout([ring(d['copyHex'])], 790, -35, ['Copy hex'], [top_end(d['copyHex'])]),
    ('', label(330, 265, ['① Section', 'by the lowest bits'])),
    ('', label(760, 265, ['② Group header', 'the bits all members share'])),
    ('', label(1190, 265, ['③ Shared immediate row', 'one for the whole group'])),
    callout([box(d['typeExt'])], 1600, 265, ['Type · Ext', 'format and extension'], [bottom_end(d['typeExt'])], side='bottom'),
    # the second screenshot: the meaning's label sits in the panel's own white space
    callout([box(meaning)], 1420, Y2 + 58, ['Meaning', 'the instruction, built as bits are set'], [(meaning[0] + meaning[2] + 7, meaning[1] + 25)]),
    callout([box(row2)], 880, Y2 + 230, ['One instruction left', 'its own row, operands filled in'], [bottom_end(row2, tx=880)], side='bottom'),
], extra=''.join(outline(d[k]) for k in ['section', 'group', 'imm']) + badge(1, 128) + badge(2, 148) + badge(3, 166))
# the meaning label starts left of its arrow: fix the arrow start to the label's left edge
dec = dec.replace(f'points="1420,{Y2 + 88} ', f'points="1265,{Y2 + 64} ')

# ---------------- header: cut the empty middle (x 1090..1236)
h = load('ui-header'); CUT0, CUT1, GAP = 1090, 1236, 60


def sh(r):
    x, y, w, hh = r
    return [x - (CUT1 - CUT0 - GAP), y, w, hh] if x >= CUT1 else r


W = CUT0 + GAP + (1566 - CUT1)
imgs = (f'<svg x="0" y="0" width="{CUT0}" height="92" viewBox="0 0 {CUT0} 92"><image href="img/ui-header.png" width="1566" height="92"/></svg>'
        f'<svg x="{CUT0+GAP}" y="0" width="{1566-CUT1}" height="92" viewBox="{CUT1} 0 {1566-CUT1} 92"><image href="img/ui-header.png" width="1566" height="92"/></svg>'
        f'<path d="M{CUT0+18},0 l12,15 l-12,15 l12,15 l-12,15 l12,15 l-12,15" fill="none" stroke="#b8c8ce" stroke-width="2"/>'
        f'<path d="M{CUT0+38},0 l12,15 l-12,15 l12,15 l-12,15 l12,15 l-12,15" fill="none" stroke="#b8c8ce" stroke-width="2"/>')
pdf = [h['pdf'][0], h['pdf'][1], h['caret'][0] + h['caret'][2] - h['pdf'][0], h['pdf'][3]]
lic = [h['license'][0], h['license'][1], h['contribute'][0] + h['contribute'][2] - h['license'][0], h['license'][3]]
hdr = svg(f'-10 -215 {W+30} 470', imgs, [
    callout([box(h['isa'])], 300, -190, ['Instruction set', 'its name follows the extensions below',
                                         'now: RV32 · RV64 · Z80 · 6502 · Hack',
                                         'soon: MIPS32/64 · 8051 · 8086 · x86 · x86-64 · Thumb · A32 · A64'], [top_end(h['isa'])]),
    callout([box(h['version'])], 470, -60, ['Version', 'of this sheet'], [top_end(h['version'])]),
    callout([box(h['pill'])], 700, -125, ['Encoder | Decoder', 'switch the sheet'], [top_end(h['pill'])]),
    callout([box(h['regs'])], 930, -60, ['Register tables', 'hover; click to keep open'], [top_end(h['regs'])]),
    callout([box(sh(pdf))], 1150, -125, ['⤓ PDF  A4 landscape', '▾ A3 portrait · Sail · TableGen'], [top_end(sh(pdf))]),
    callout([box(sh(h['share']))], 1365, -190, ['Share', 'a link to EXACTLY this view', 'sheet · choices · bits · exts'], [top_end(sh(h['share']))]),
    callout([box(h['exts'])], 260, 170, ['Extensions', 'choose which extensions the sheets show'], [bottom_end(h['exts'], tx=230)], side='bottom'),
    callout([box(h['credits'])], 760, 170, ['Credits', 'author and contributors'], [bottom_end(h['credits'], tx=640)], side='bottom'),
    callout([box(sh(h['clear']))], 1120, 170, ['Clear', 'back to the whole sheet'], [bottom_end(sh(h['clear']))], side='bottom'),
    callout([box(sh(lic))], 1360, 225, ['License · issues', 'CC BY-SA 4.0, contribute'], [bottom_end(sh(lic), tx=1400)], side='bottom'),
])
json.dump({'enc': enc, 'dec': dec, 'hdr': hdr}, open('ui-svgs.json', 'w'))
print(len(enc), len(dec), len(hdr), [('\n\n' in v) for v in (enc, dec, hdr)])
