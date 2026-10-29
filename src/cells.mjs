import { formats } from './isa/rv32gc.mjs';
import { immediateView, registerName, fenceText, ROUNDING, CSRS } from './isa/codec.mjs';
import { version } from '../package.json';

// Table cells shared by the encoder and decoder sliderules.

export function cell({ width = 1, rowspan = 1, classes = '', text = '', title = '' }) {
  const attributes = { class: classes };
  if (width > 1) attributes.colspan = String(width);
  if (rowspan > 1) attributes.rowspan = String(rowspan);
  if (title) attributes.title = title;
  return _td(attributes, text);
}

// Bits 31..16 of a compressed instruction belong to the next instruction: black, as on paper.
export function unusedUpperHalf({ width = 32 }) {
  return width === 16 ? [cell({ width: 16, classes: 'bit unused' })] : [];
}

function _range({ segment = {} }) {
  return `inst[${segment.hi}${segment.width > 1 ? ':' + segment.lo : ''}]`;
}

function _fieldText({ key = 'rm', value = 0 }) {
  if (key === 'pred' || key === 'succ') return fenceText({ value });
  if (key === 'rm') return `rm = ${ROUNDING[value] || value}`;
  if (key === 'csr') return `csr = ${Object.keys(CSRS).find((name) => CSRS[name] === value) || `0x${value.toString(16)}`}`;
  return String(value);
}

// One cell per encoding segment; literal bits get one cell each. With decoded fields, registers show their names.
export function segmentCells({ segments = [], width = 32, fields = null, inst = {} }) {
  const cells = unusedUpperHalf({ width });
  for (const s of segments) {
    if (s.kind === 'lit') {
      for (const bit of s.bits) cells.push(cell({ classes: `bit lit-${s.role}`, text: bit }));
    } else if (s.kind === 'any') {
      cells.push(cell({ width: s.width, classes: 'bit any', text: s.width > 1 ? '– any –' : '–', title: `${_range({ segment: s })} = don't care` }));
    } else if (s.kind === 'imm') {
      cells.push(cell({ width: s.width, classes: `bit imm imm-${s.part % 4}`, text: s.width > 1 ? `${s.name}[${s.label}]` : s.label,
        title: `${_range({ segment: s })} = ${s.name}[${s.immBits.join('|')}]` }));
    } else if (fields && s.kind === 'reg') {
      const value = registerName({ number: fields[s.key], fp: (inst.fregs || []).includes(s.key) });
      cells.push(cell({ width: s.width, classes: 'bit field-reg', text: s.width > 3 ? `${s.key} = ${value}` : value }));
    } else if (fields && s.kind === 'field') {
      cells.push(cell({ width: s.width, classes: 'bit field-field', text: _fieldText({ key: s.key, value: fields[s.key] }) }));
    } else {
      cells.push(cell({ width: s.width, classes: `bit field-${s.kind}`, text: s.label }));
    }
  }
  return cells;
}

// The actual bits of an encoded word, coloured like the segments they belong to.
export function valueCells({ inst = {}, word = 0 }) {
  const cells = unusedUpperHalf({ width: inst.width });
  for (const s of inst.segments) {
    const classes = s.kind === 'lit' ? `lit-${s.role}` : s.kind === 'imm' ? `imm imm-${s.part % 4}` : `field-${s.kind}`;
    for (let bit = s.hi; bit >= s.lo; bit--) {
      cells.push(cell({ classes: `bit value ${classes}`, text: String((word >>> bit) & 1), title: s.kind === 'lit' ? '' : s.label }));
    }
  }
  return cells;
}

// Immediate view: how the scattered immediate bits are reassembled, same colours as their source.
export function immediateCells({ inst = {} }) {
  return immediateView({ inst }).map((c) => {
    if (c.kind === 'zero') return cell({ width: c.width, classes: 'bit imm-zero', text: c.width > 1 ? '– 0 –' : '0' });
    const label = c.kind === 'sext' ? `– ${c.segment.immBits[0]} –` : c.segment.label;
    return cell({ width: c.width, classes: `bit imm imm-${c.segment.part % 4}${c.kind === 'sext' ? ' sext' : ''}`, text: label,
      title: c.kind === 'sext' ? `sign extension of inst[${c.segment.hi}]` : `from ${_range({ segment: c.segment })}` });
  });
}

export function typeCell({ format = 'R', rowspan = 1 }) {
  if (!formats[format]) return cell({ rowspan, classes: 'text type', text: format });
  return _td({ class: 'text type', rowspan: String(rowspan) }, [_b({}, `${format} - Type`), _br(), `"${formats[format].title}"`]);
}

// Bit numbers and the bit switches form the "spine": the only part that stays visible while switching tables.
export function bitNumbers() {
  const numbers = [];
  for (let bit = 31; bit >= 0; bit--) numbers.push(_th({ class: 'bit-number spine' }, String(bit)));
  return numbers;
}

export const PDF_NAME = 'RV32GC-Sliderules.pdf';
// The PDF sits next to the page on the site; pages embedding the library elsewhere link to the site's copy.
const PDF_URL = ['localhost', '127.0.0.1', 'sliderules.magiwanders.com'].includes(location.hostname) ? PDF_NAME : `https://sliderules.magiwanders.com/${PDF_NAME}`;

function _pdfButton() {
  return _a({ class: 'pdf-button', href: PDF_URL, download: PDF_NAME, title: `Download both sheets as an A3 PDF (v${version})` }, [
    _span({ class: 'pdf-icon', 'aria-hidden': 'true' }, '⤓'), ' PDF',
  ]);
}

// Title of the sheet, as on paper. The button to the other sheet sits in the corner on the side its table appears,
// the PDF download in the opposite corner. A caption, so a printed table does not repeat it on every page.
export function titleCaption({ name = 'Decoder', button = null, side = 'left' }) {
  const corner = _div({ class: `title-corner ${side}` }, [button]);
  const download = _div({ class: `title-corner ${side === 'left' ? 'right' : 'left'}` }, [_pdfButton()]);
  const title = _div({ class: 'title-main' }, [
    _div({ class: 'title-isa' }, 'RV32GC'),
    _div({ class: 'title-name' }, `Sliderule ${name}`),
    _div({ class: 'title-credits' }, `Instruction Set "Sliderule" ${name} by Simone Shawn Cazzaniga (magiwanders@github | www.magiwanders.com | shawn@magiwanders.com)`),
  ]);
  return _caption({ class: 'title-cell' }, [_div({ class: 'title-bar' }, side === 'left' ? [corner, title, download] : [download, title, corner])]);
}

export function columns({ widths = [] }) {
  return _colgroup({}, widths.map((width) => _col({ style: `width: ${width}px` }, '')));
}

// Fixed layout only holds with an explicit table width.
export function tableWidth({ widths = [] }) {
  return `width: ${widths.reduce((sum, w) => sum + w, 0)}px`;
}

export function hex({ word = 0, width = 32 }) {
  return `0x${(word >>> 0).toString(16).padStart(width / 4, '0')}`;
}
