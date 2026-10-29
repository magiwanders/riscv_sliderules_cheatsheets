import { formats, groups, sections } from './isa/rv32gc.mjs';
import { compiled, matchesConstraints, assemblyParts, unusedOpcodeRows } from './isa/codec.mjs';
import { cell, segmentCells, valueCells, immediateCells, immediateValueCells, typeCell, bitNumbers, columns, tableWidth, sectionHeader } from './cells.mjs';
import { Tristates } from './tristate.mjs';

// b2a "Decoder" sliderule: the bit selector is the table header (bits on the left), rows are ordered lsb first.

const TEXT_COLUMNS = ['Instruction', 'Mnemonic', 'Operands', 'Expansion', 'Pseudocode', 'Type', 'Ext'];
const TEXT_WIDTHS = [170, 90, 150, 150, 230, 120, 60];
const ALL_COLUMNS = 32 + TEXT_COLUMNS.length;
let _bits = null;

function _literalAt({ inst = {}, bit = 0 }) {
  return (inst.mask >>> bit) & 1 ? String((inst.match >>> bit) & 1) : null;
}

function _sectionRow({ title = '' }) {
  return _tr({ class: 'section-row' }, [cell({ width: ALL_COLUMNS, text: title })]);
}

// Format header row: field names from the format layout, bits written out where all members agree.
function _groupRow({ group = {}, members = [], rowspan = 1 }) {
  const format = formats[group.format];
  const cells = [];
  if (format.width === 16) cells.push(cell({ width: 16, classes: 'bit unused' }));
  for (const [name, hi, lo, role] of format.layout) {
    const bits = [];
    for (let bit = hi; bit >= lo; bit--) {
      const value = _literalAt({ inst: members[0], bit });
      bits.push(value !== null && members.every((m) => _literalAt({ inst: m, bit }) === value) ? value : null);
    }
    if (bits.every((b) => b !== null)) bits.forEach((b) => cells.push(cell({ classes: `bit lit-${role}`, text: b })));
    else cells.push(cell({ width: hi - lo + 1, classes: `bit field-${role}`, text: name }));
  }
  cells.push(
    cell({ width: 4, classes: 'text group-title', text: group.title }),
    cell({ classes: 'text group-pseudo', text: group.pseudocode }),
    typeCell({ format: group.format, rowspan }),
    cell({ rowspan, classes: 'text ext', text: `'${group.extension}'` }),
  );
  return _tr({ class: `group-row fmt-${group.format}` }, cells);
}

function _instructionRow({ inst = {}, decoded = null, onPattern = () => {} }) {
  const fields = decoded && decoded.inst === inst ? decoded.fields : null;
  const cells = segmentCells({ segments: inst.segments, width: inst.width, fields, inst });
  if (inst.reserved || inst.hint) {
    const kind = inst.reserved ? 'reserved' : 'hint';
    cells.push(cell({ width: 5, classes: `text ${kind}`, text: inst.hint ? `${inst.description} : PC += ${inst.width / 8}, no other effect` : inst.description }));
    return _tr({ class: `instruction-row ${kind}-row fmt-${inst.format}` + (fields ? ' decoded' : '') }, cells);
  }
  const mnemonic = _td({ class: 'text mnemonic', title: 'Show this encoding in the bit selector' }, inst.name);
  mnemonic.addEventListener('click', () => onPattern({ inst }));
  cells.push(
    cell({ classes: 'text description', text: inst.description }),
    mnemonic,
    cell({ classes: 'text operands', text: fields ? assemblyParts({ inst, fields }).slice(1).map((p) => p.text).join('').trim() || '—' : inst.asm || '—' }),
    cell({ classes: 'text expansion', text: inst.expands || '' }),
    cell({ classes: 'text pseudocode', text: inst.pseudocode }),
  );
  return _tr({ class: `instruction-row fmt-${inst.format}` + (fields ? ' decoded' : '') }, cells);
}

function _immediateRow({ inst = {}, decoded = null }) {
  const cells = immediateCells({ inst });
  cells.push(
    cell({ width: 4, classes: 'text imm-name', text: decoded && decoded.inst === inst ? `${inst.immName} = ${decoded.fields.imm}` : inst.immName }),
    cell({ classes: 'text imm-desc', text: `${inst.format} ${inst.immSigned ? 'sign-extended' : 'zero-extended'} immediate` }),
  );
  return _tr({ class: `immediate-row fmt-${inst.format}` }, cells);
}

// The decoded instruction once nothing else matches: no group header, its bits in their own places in its row
// (Type / Ext move there) and the immediate's bits in the immediate row.
function _decodedRows({ decoded = {}, onPattern = () => {} }) {
  const { inst, fields, word } = decoded;
  const rowspan = inst.immName ? 2 : 1;
  const mnemonic = _td({ class: 'text mnemonic', title: 'Show this encoding in the bit selector' }, inst.name);
  mnemonic.addEventListener('click', () => onPattern({ inst }));
  const rows = [_tr({ class: `instruction-row fmt-${inst.format}` }, [
    ...valueCells({ segments: inst.segments, width: inst.width, word, fields, inst }),
    cell({ classes: 'text description', text: inst.description }),
    mnemonic,
    cell({ classes: 'text operands', text: assemblyParts({ inst, fields }).slice(1).map((p) => p.text).join('').trim() || '—' }),
    cell({ classes: 'text expansion', text: inst.expands || '' }),
    cell({ classes: 'text pseudocode', text: inst.pseudocode }),
    typeCell({ format: inst.format, rowspan }),
    cell({ rowspan, classes: 'text ext', text: `'${inst.extension}'` }),
  ])];
  if (inst.immName) {
    rows.push(_tr({ class: `immediate-row fmt-${inst.format}` }, [
      ...immediateValueCells({ inst, value: fields.imm }),
      cell({ width: 4, classes: 'text imm-name', text: `${inst.immName} = ${fields.imm}` }),
      cell({ classes: 'text imm-desc', text: `${inst.format} ${inst.immSigned ? 'sign-extended' : 'zero-extended'} immediate` }),
    ]));
  }
  return rows;
}

function _immediateSignature({ inst = {} }) {
  return inst.segments.filter((s) => s.kind === 'imm').map((s) => `${s.hi}:${s.immBits}`).join(' ');
}

// A major opcode that RV32GC does not use: the rest of the instruction is meaningless.
function _unusedOpcodeRow({ unused = {} }) {
  const cells = [cell({ width: 25, classes: 'bit any', text: '– not used in RV32GC –' })];
  for (const bit of unused.opcode) cells.push(cell({ classes: 'bit lit-opcode', text: bit }));
  cells.push(
    cell({ width: 4, classes: 'text unused-name', text: unused.name }),
    cell({ classes: 'text unused-note', text: unused.note }),
    cell({ classes: 'text unused-note', text: '—' }),
    cell({ classes: 'text unused-note', text: '—' }),
  );
  return _tr({ class: 'unused-row' }, cells);
}

function _unusedMatches({ unused = {}, constraints = [] }) {
  return [...unused.opcode].every((bit, i) => [bit, '-'].includes(constraints[25 + i]));
}

// Groups (and unused opcodes) of a section, in lsb-first order of their most significant member.
function _orderedItems({ section = 'q3' }) {
  const first = (g) => compiled.filter((i) => i.groupKey === g).map((i) => i.sortKey).sort()[0];
  const items = Object.keys(groups).filter((g) => groups[g].section === section).map((groupKey) => ({ groupKey, sortKey: first(groupKey) }));
  if (section === 'q3') items.push(...unusedOpcodeRows.map((unused) => ({ unused, sortKey: unused.sortKey })));
  return items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

export function decoderRows({ constraints = [], decoded = null, onPattern = () => {} }) {
  const rows = [];
  for (const section of Object.keys(sections)) {
    const sectionRows = [];
    for (const { groupKey, unused } of _orderedItems({ section })) {
      if (unused) {
        if (_unusedMatches({ unused, constraints })) sectionRows.push(_unusedOpcodeRow({ unused }));
        continue;
      }
      const members = compiled.filter((i) => i.groupKey === groupKey && matchesConstraints({ inst: i, constraints }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      if (!members.length) continue;
      if (members.length === 1 && decoded && members[0] === decoded.inst && !decoded.inst.reserved && !decoded.inst.hint) {
        sectionRows.push(..._decodedRows({ decoded, onPattern }));
        continue;
      }
      // Shared immediate layout: one immediate view under the group header, otherwise one per instruction.
      const withImm = members.filter((m) => m.immName);
      const shared = withImm.length > 0 && withImm.every((m) => _immediateSignature({ inst: m }) === _immediateSignature({ inst: withImm[0] }));
      const body = [];
      if (shared) body.push(_immediateRow({ inst: decoded && withImm.includes(decoded.inst) ? decoded.inst : withImm[0], decoded }));
      for (const inst of members) {
        body.push(_instructionRow({ inst, decoded, onPattern }));
        if (inst.immName && !shared) body.push(_immediateRow({ inst, decoded }));
      }
      sectionRows.push(_groupRow({ group: groups[groupKey], members, rowspan: body.length + 1 }), ...body);
    }
    if (sectionRows.length) rows.push(_sectionRow({ title: sections[section] }), ...sectionRows);
  }
  if (!rows.length) rows.push(_tr({}, [cell({ width: ALL_COLUMNS, classes: 'text empty', text: 'No instruction matches the selected bits.' })]));
  return rows;
}

export function readConstraints() {
  return _bits.read();
}

// Sets the selector to a value; bits outside the mask (and above a 16 bit width) become don't-care.
export function writeBits({ value = 0, mask = 0xffffffff, width = 32 }) {
  _bits.write({ value, mask, width });
}

export function dimUpperHalf({ dim = false }) {
  _bits.dimUpper({ dim });
}

export function pasteBits({ text = '' }) {
  return _bits.paste({ text });
}

export function highlightBits({ mask = 0 }) {
  _bits.highlight({ mask });
}

// The word under the selector, once every bit of a 16 bit (inst[1:0] != 11) or 32 bit instruction is set.
export function selectedWord({ constraints = [] }) {
  const bit = (b) => constraints[31 - b];
  if (bit(0) === '-' || bit(1) === '-') return null;
  const width = bit(0) === '1' && bit(1) === '1' ? 32 : 16;
  let word = 0;
  for (let b = 0; b < width; b++) {
    if (bit(b) === '-') return null;
    word += Number(bit(b)) * 2 ** b;
  }
  return word;
}

// io: what goes next to the bit switches (the decoded result).
// copies: { binary, hex } copy buttons by the bits' section title.
// Header rows: section titles, the controls (hex digits over the switches, the decoded instruction beside both),
// then the bit numbers and column titles right above the sheet's rows.
export function decoderTable({ onBits = () => {}, copies = {}, io = null }) {
  _bits = Tristates({ editable: true, onChange: onBits });
  const widths = [...new Array(32).fill(24), ...TEXT_WIDTHS];
  return _table({ class: 'sliderule', id: 'decoder-sheet', style: tableWidth({ widths }) }, [
    columns({ widths }),
    _thead({}, [
      _tr({ class: 'label-row' }, [
        sectionHeader({ colspan: 32, title: 'Bitwise Breakdown — inst[31:0]', before: copies.binary, after: copies.hex, classes: 'spine' }),
        sectionHeader({ colspan: TEXT_COLUMNS.length, title: 'Meaning' }),
      ]),
      _tr({ class: 'hex-row' }, [..._bits.hexCells, _td({ class: 'io-cell', colspan: String(TEXT_COLUMNS.length), rowspan: '2' }, [io])]),
      _tr({ class: 'input-row' }, _bits.cells),
      _tr({ class: 'number-row' }, [...bitNumbers(), ...TEXT_COLUMNS.map((name) => _th({ class: 'column-title' }, name))]),
    ]),
    _tbody({}, ''),
  ]);
}
