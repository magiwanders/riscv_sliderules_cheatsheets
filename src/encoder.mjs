import { encodable } from './isa/codec.mjs';
import { cell, segmentCells, valueCells, immediateCells, typeCell, bitNumbers, tableWidth, hex, titleCaption, sectionHeader } from './cells.mjs';
import { Tristates } from './tristate.mjs';

// a2b "Encoder" sliderule: every instruction and pseudo-instruction in alphabetical order, encoding on the right.
// Over each text column's title sits its selector (Ext, Type, Mnemonic, Operands); Description and Explanation
// are folded into one narrow "Descr. ›" column by default (click its title to unfold both). The bits are the
// read-only output.

const COLUMNS = [
  { key: 'ext', title: 'Ext', width: 92 },
  { key: 'type', title: 'Type', width: 120 },
  { key: 'description', title: 'Description', width: 220, details: true },
  { key: 'explanation', title: 'Explanation', width: 240, details: true },
  { key: 'mnemonic', title: 'Mnemonic', width: 150 },
  { key: 'operands', title: 'Operands', width: 360 },
];
// Folded: the description column shrinks to its "Descr. ›" title, the explanation column to nothing.
const FOLDED_WIDTHS = { description: 58, explanation: 0 };
const BIT_WIDTH = 24;
let _folded = true;
let _bits = null;
let _sheet = null;
let _onLayout = () => {};

function _explanation({ entry = {} }) {
  if (entry.expands && !entry.pseudo) return [entry.expands, _br(), entry.pseudocode];
  return entry.pseudocode || '';
}

function _explanationText({ explanation = '' }) {
  return (Array.isArray(explanation) ? explanation : [explanation]).map((part) => (typeof part === 'string' ? part : '\n')).join('');
}

// Text cells on the left, spanning every row of the entry. Collapsed columns keep their text as a tooltip.
function _textCells({ entry = {}, rowspan = 1, explanation = '', operands = null, onPick = () => {} }) {
  const mnemonic = _td({ class: 'text mnemonic' + (entry.pseudo ? ' pseudo' : ''), rowspan: String(rowspan), title: 'Build this instruction' }, entry.name);
  mnemonic.addEventListener('click', () => onPick({ entry }));
  return [
    cell({ rowspan, classes: 'text ext' + (entry.pseudo ? ' pseudo' : ''), text: entry.extension }),
    typeCell({ format: entry.format, rowspan }),
    cell({ rowspan, classes: 'text description', text: entry.description, title: entry.description }),
    _td({ class: 'text explanation', title: _explanationText({ explanation }) }, explanation),
    mnemonic,
    cell({ rowspan, classes: 'text operands' + (operands ? ' chosen' : ''), text: operands ?? (entry.asm || '—') }),
  ];
}

// Rows of one entry. With an encoding, the expansions actually used (li may need one or two instructions) and
// their fields fill the register / immediate placeholders, and the encoded words follow.
function _entryRows({ entry = {}, encoded = null, operands = null, onPick = () => {} }) {
  const parts = encoded
    ? encoded.words.map((w) => (w.expansion ? { ...w.expansion, word: w } : { base: entry, segments: entry.segments, text: _explanation({ entry }), word: w }))
    : entry.pseudo
      ? entry.expansions.map((x) => ({ ...x, word: null }))
      : [{ base: entry, segments: entry.segments, text: _explanation({ entry }), word: null }];
  const showImm = parts.length === 1 && parts[0].segments.some((s) => s.kind === 'imm');
  const rowspan = parts.length + (showImm ? 1 : 0);
  const rows = parts.map(({ base, segments, text, word }, i) => {
    const textCells = i === 0
      ? _textCells({ entry, rowspan, explanation: text, operands, onPick })
      : [_td({ class: 'text explanation', title: _explanationText({ explanation: text }) }, text)];
    return _tr({ class: `instruction-row fmt-${base.format}` + (encoded ? ' chosen' : '') },
      [...textCells, ...segmentCells({ segments, width: base.width, fields: word ? word.fields : null, inst: base })]);
  });
  if (showImm) {
    const { base, word } = parts[0];
    rows.push(_tr({ class: `immediate-row fmt-${base.format}` }, [
      _td({ class: 'text imm-name explanation' }, word ? `${base.immName} = ${word.fields.imm}` : base.immName), ...immediateCells({ inst: base }),
    ]));
  }
  if (encoded) {
    for (const { inst, word, assembly } of encoded.words) {
      rows.push(_tr({ class: `encoded-row fmt-${inst.format}` }, [
        cell({ width: 4, classes: 'text encoded-asm', text: assembly }),
        cell({ width: 2, classes: 'text encoded-hex', text: hex({ word, width: inst.width }) }),
        ...valueCells({ inst, word }),
      ]));
    }
  }
  return rows;
}

// entries: what the Ext / Type filters let through; with a chosen entry only that one is listed.
export function encoderRows({ entries = encodable, entry = null, encoded = null, operands = null, onPick = () => {} }) {
  if (entry) return _entryRows({ entry, encoded, operands, onPick });
  const rows = entries.flatMap((e) => _entryRows({ entry: e, onPick }));
  if (!rows.length) rows.push(_tr({}, [cell({ width: COLUMNS.length + 32, classes: 'text empty', text: 'No instruction has this extension and type.' })]));
  return rows;
}

// The bits show what is known so far: the fixed bits once an instruction is chosen, every bit once it is encoded.
export function showEncodedBits({ entry = null, encoded = null }) {
  if (encoded) {
    const { word, inst } = encoded.words[0];
    _bits.write({ value: word, width: inst.width, off: inst.width === 16 });
    return;
  }
  if (!entry) {
    _bits.write({ mask: 0 });
    return;
  }
  const { base, segments } = entry.pseudo ? entry.expansions[0] : { base: entry, segments: entry.segments };
  let mask = 0;
  let value = 0;
  for (const s of segments.filter((s) => s.kind === 'lit')) {
    mask |= (2 ** s.width - 1) << s.lo;
    value |= parseInt(s.bits, 2) << s.lo;
  }
  _bits.write({ value, mask: mask >>> 0, width: base.width, off: base.width === 16 });
}

function _widths() {
  return [...COLUMNS.map((c) => (c.details && _folded ? FOLDED_WIDTHS[c.key] : c.width)), ...new Array(32).fill(BIT_WIDTH)];
}

function _applyWidths() {
  const widths = _widths();
  _sheet.querySelectorAll(':scope > colgroup > col').forEach((col, i) => { col.style.width = `${widths[i]}px`; });
  _sheet.style.cssText = tableWidth({ widths });
  _sheet.classList.toggle('details-folded', _folded);
  const head = _sheet.querySelector('th.details-toggle');
  head.replaceChildren(_folded ? 'Descr. ›' : '‹ Description');
  head.setAttribute('aria-expanded', String(!_folded));
  head.title = _folded ? 'Show the description and explanation columns' : 'Fold the description and explanation columns';
}

// The folded columns as share links store them (['details'] when unfolded), and setting them back.
export function expandedColumns() {
  return _folded ? [] : ['details'];
}

export function setExpandedColumns({ keys = [] }) {
  _folded = !keys.some((key) => ['details', 'description', 'explanation'].includes(key));
  _applyWidths();
}

// Column titles (the row between the controls and the sheet's rows); the description title folds / unfolds both.
function _columnTitle({ column = {} }) {
  if (column.key === 'explanation') return _th({ class: 'column-title explanation' }, column.title);
  if (column.key !== 'description') return _th({ class: `column-title ${column.key}` }, column.title);
  const head = _th({ class: 'column-title description details-toggle', tabindex: '0', role: 'button' }, '');
  const toggle = () => {
    _folded = !_folded;
    _applyWidths();
    _onLayout();
  };
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggle();
  });
  return head;
}

// toggle: the button to the decoder; tools: PDF / Clear / Share; controls: { ext, type, mnemonic, operands } selectors;
// labels: what sits in the section headers next to their titles ({ meaning, assembly, assemblyCopy, binary, hex });
// onLayout: called when the description / explanation columns are folded or unfolded.
// Header rows: section titles, the controls (hex digits over the switches; the selectors span both rows), then the
// column titles and bit numbers right above the sheet's rows.
export function encoderTable({ toggle = null, tools = [], controls = {}, labels = {}, onLayout = () => {} }) {
  _bits = Tristates({ editable: false });
  _onLayout = onLayout;
  const widths = _widths();
  const controlCells = COLUMNS.map((c) => _td({ class: `selector-cell ${c.key}`, rowspan: '2' }, controls[c.key] ? [controls[c.key]] : ''));
  _sheet = _table({ class: 'sliderule', id: 'encoder', style: tableWidth({ widths }) }, [
    titleCaption({ name: 'Encoder', button: toggle, side: 'right', tools }),
    _colgroup({}, widths.map((width) => _col({ style: `width: ${width}px` }, ''))),
    _thead({}, [
      _tr({ class: 'label-row' }, [
        sectionHeader({ colspan: 4, title: 'Meaning', after: labels.meaning }),
        sectionHeader({ colspan: 2, title: 'Assembly', before: labels.assembly, after: labels.assemblyCopy, classes: 'section-assembly' }),
        sectionHeader({ colspan: 32, title: 'Bitwise Encoding — inst[31:0]', before: labels.binary, after: labels.hex, classes: 'spine' }),
      ]),
      _tr({ class: 'hex-row' }, [...controlCells, ..._bits.hexCells]),
      _tr({ class: 'input-row' }, _bits.cells),
      _tr({ class: 'number-row' }, [...COLUMNS.map((column) => _columnTitle({ column })), ...bitNumbers()]),
    ]),
    _tbody({}, ''),
  ]);
  _applyWidths();
  return _sheet;
}
