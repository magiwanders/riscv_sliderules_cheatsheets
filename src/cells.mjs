import { formats } from './isa/rv32gc.mjs';
import { immediateView, registerName, fenceText, ROUNDING, CSRS } from './isa/codec.mjs';

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

const REPO = 'https://github.com/magiwanders/riscv_sliderules_cheatsheets';
const GITHUB_PATH = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';

function _svg({ children = '' }) {
  const template = document.createElement('template');
  template.innerHTML = `<svg class="icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">${children}</svg>`;
  return template.content.firstChild;
}

function _iconLink({ href = '', label = '', icon = null }) {
  return _a({ class: 'credit-icon', href, target: '_blank', rel: 'noopener', title: label, 'aria-label': label }, [icon]);
}

// The 2023 LFX mentorship contributors.
const CONTRIBUTORS = [['Jayaraj J', 'jyrj'], ['Karbon Chen', 'CSY-tvgo']];

function _link({ href = '', text = '' }) {
  return _a({ href, target: '_blank', rel: 'noopener' }, text);
}

function _credits() {
  const github = _svg({ children: `<path fill="currentColor" d="${GITHUB_PATH}"/>` });
  const linkedin = _svg({ children: '<rect width="16" height="16" rx="3" fill="currentColor"/><text x="8" y="12.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10" fill="#fff">in</text>' });
  const contributors = CONTRIBUTORS.flatMap(([name, login], i) => [...(i ? [', '] : []), _link({ href: `https://github.com/${login}`, text: `${name} (@${login})` })]);
  return _div({ class: 'header-credits' }, [
    'by Simone Shawn Cazzaniga ',
    _iconLink({ href: 'https://github.com/magiwanders', label: 'GitHub: magiwanders', icon: github }),
    _iconLink({ href: 'https://www.linkedin.com/in/simone-shawn-cazzaniga/', label: 'LinkedIn', icon: linkedin }),
    ' ', _link({ href: 'https://www.magiwanders.com', text: 'www.magiwanders.com' }),
    ' | ', _a({ href: 'mailto:shawn@magiwanders.com' }, 'shawn@magiwanders.com'),
    _span({ class: 'header-separator' }, '·'), 'Contributors: ', ...contributors,
  ]);
}

// The header above both sheets (it does not move when switching): the title and the Encoder / Decoder pill on the
// left, the tools (PDF, Clear, Share) on the right; credits and the contribution link below. Tools and the
// contribution link are left out of the PDF (no-print).
export function sheetHeader({ switcher = null, tools = [] }) {
  return _div({ class: 'sheet-header' }, [
    _div({ class: 'header-main' }, [
      _span({ class: 'header-title' }, 'Sliderule RV32GC Cheatsheet'),
      switcher,
      _div({ class: 'header-tools no-print' }, tools),
    ]),
    _div({ class: 'header-sub' }, [
      _credits(),
      _a({ class: 'contribute-link no-print', href: `${REPO}#contributing`, target: '_blank', rel: 'noopener' }, 'Contribute or report an issue ↗'),
    ]),
  ]);
}

// A section title in the top header row, with optional content before / after it (values, copy buttons).
export function sectionHeader({ colspan = 1, title = '', before = null, after = null, classes = '' }) {
  return _th({ colspan: String(colspan), class: classes }, [_div({ class: 'section-title' }, [
    _div({ class: 'section-side before' }, before ? [before] : ''),
    _span({ class: 'section-name' }, title),
    _div({ class: 'section-side after' }, after ? [after] : ''),
  ])]);
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
