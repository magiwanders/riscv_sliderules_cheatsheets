import { encodable } from './isa/codec.mjs';
import { cell, segmentCells, valueCells, immediateCells, typeCell, bitNumbers, tableWidth, hex, titleCaption } from './cells.mjs';
import { Tristates } from './tristate.mjs';

// a2b "Encoder" sliderule: every instruction and pseudo-instruction in alphabetical order, encoding on the right.
// Under each text column header sits its selector (Ext, Type, Mnemonic, Operands); Description and Explanation
// are collapsed to a narrow strip by default (click the header to expand). The bits are the read-only output.

const COLUMNS = [
  { key: 'ext', title: 'Ext', width: 92 },
  { key: 'type', title: 'Type', width: 120 },
  { key: 'description', title: 'Description', width: 220, collapsible: true },
  { key: 'explanation', title: 'Explanation', width: 240, collapsible: true },
  { key: 'mnemonic', title: 'Mnemonic', width: 150 },
  { key: 'operands', title: 'Operands', width: 300 },
];
const COLLAPSED_WIDTH = 26;
const BIT_WIDTH = 24;
const _collapsed = { description: true, explanation: true };
let _bits = null;
let _sheet = null;

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
  return [...COLUMNS.map((c) => (c.collapsible && _collapsed[c.key] ? COLLAPSED_WIDTH : c.width)), ...new Array(32).fill(BIT_WIDTH)];
}

function _applyWidths() {
  const widths = _widths();
  _sheet.querySelectorAll(':scope > colgroup > col').forEach((col, i) => { col.style.width = `${widths[i]}px`; });
  _sheet.style.cssText = tableWidth({ widths });
  for (const c of COLUMNS.filter((c) => c.collapsible)) {
    _sheet.classList.toggle(`collapsed-${c.key}`, _collapsed[c.key]);
    const head = _sheet.querySelector(`th.text-head.${c.key}`);
    head.setAttribute('aria-expanded', String(!_collapsed[c.key]));
    head.title = `${_collapsed[c.key] ? 'Show' : 'Hide'} the ${c.title.toLowerCase()} column`;
  }
}

// Expands every collapsible column (printing) or restores the defaults.
export function expandAllColumns({ expand = true }) {
  for (const c of COLUMNS.filter((c) => c.collapsible)) _collapsed[c.key] = !expand;
  _applyWidths();
}

function _columnHead({ column = {}, rowspan = 1 }) {
  const attributes = { class: `text-head ${column.key}` };
  if (rowspan > 1) attributes.rowspan = String(rowspan);
  if (!column.collapsible) return _th(attributes, column.title);
  attributes.class += ' collapsible';
  attributes.tabindex = '0';
  attributes.role = 'button';
  const head = _th(attributes, [_span({ class: 'collapse-icon', 'aria-hidden': 'true' }), _span({ class: 'collapse-title' }, column.title)]);
  const toggle = () => {
    _collapsed[column.key] = !_collapsed[column.key];
    _applyWidths();
  };
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggle();
  });
  return head;
}

// toggle: the button to the decoder; controls: { ext, type, mnemonic, operands } selector elements;
// status: message area left of the output; output: hex / copy area under the bits.
export function encoderTable({ toggle = null, controls = {}, status = null, output = null }) {
  _bits = Tristates({ editable: false });
  const widths = _widths();
  // Collapsible headers span the selector row too: their vertical title needs the height.
  const selectorCells = COLUMNS.filter((c) => !c.collapsible).map((c) => _td({ class: `selector-cell ${c.key}` }, [controls[c.key]]));
  _sheet = _table({ class: 'sliderule', id: 'encoder', style: tableWidth({ widths }) }, [
    titleCaption({ name: 'Encoder', button: toggle, side: 'right' }),
    _colgroup({}, widths.map((width) => _col({ style: `width: ${width}px` }, ''))),
    _thead({}, [
      _tr({ class: 'label-row' }, [
        _th({ colspan: '4' }, 'Meaning'),
        _th({ colspan: '2' }, 'Assembly'),
        _th({ colspan: '32' }, 'Bitwise Encoding — inst[31:0]'),
      ]),
      _tr({ class: 'number-row' }, [...COLUMNS.map((column) => _columnHead({ column, rowspan: column.collapsible ? 2 : 1 })), ...bitNumbers()]),
      _tr({ class: 'input-row' }, [...selectorCells, ..._bits.cells]),
      _tr({ class: 'output-row' }, [
        _td({ class: 'io-cell', colspan: String(COLUMNS.length) }, [status]),
        _td({ class: 'io-cell output-cell', colspan: '32' }, [output]),
      ]),
    ]),
    _tbody({}, ''),
  ]);
  _applyWidths();
  return _sheet;
}
