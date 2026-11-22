import { cell, segmentCells, immediateCells, immediateBits, typeCell, bitNumbers, columns, tableWidth, sectionHeader, outsideCells } from './cells.mjs';
import { Tristates } from './tristate.mjs';
import { bitOf } from './isa/codec.mjs';

// b2a "Decoder" sliderule: the bit selector is the table header (bits on the left), rows are ordered lsb first.

const TEXT_COLUMNS = [{ key: 'instruction', title: 'Instruction', width: 170 }, { key: 'mnemonic', title: 'Mnemonic', width: 90 }, { key: 'operands', title: 'Operands', width: 150 },
  { key: 'expansion', title: 'Expansion', width: 150 }, { key: 'pseudocode', title: 'Pseudocode', width: 230 }, { key: 'type', title: 'Type', width: 120 }, { key: 'ext', title: 'Ext', width: 60 }];

// The text columns of an instruction set, with its titles (a title of null leaves the column out).
function _textColumns({ codec = null }) {
  const { labels = {}, widths = {} } = codec.spec;
  return TEXT_COLUMNS.map((c) => ({ ...c, title: labels[c.key] === undefined ? c.title : labels[c.key], width: widths[c.key] ?? c.width })).filter((c) => c.title !== null);
}

// Instruction, Mnemonic, Operands and Expansion, which a group's title spans.
const _titleWidth = ({ codec = null }) => _textColumns({ codec }).length - 3;
const _allColumns = ({ codec = null }) => codec.spec.spine.width + _textColumns({ codec }).length;
const _hasExpansion = ({ codec = null }) => _titleWidth({ codec }) === 4;

function _literalAt({ inst = {}, bit = 0 }) {
  return bitOf(inst.mask, bit) ? String(bitOf(inst.match, bit)) : null;
}

function _sectionRow({ codec = null, title = '' }) {
  return _tr({ class: 'section-row' }, [cell({ width: _allColumns({ codec }), text: title })]);
}

// The slots of a group header: a format's layout or, for a set without layouts, the first member's segments, literal
// bits taken one by one and the runs of those that differ between members merged into an "op" field.
function _groupLayout({ codec = null, group = {}, members = [] }) {
  const { layout } = codec.spec.formats[group.format];
  if (layout) return layout;
  const slots = [];
  for (const s of members[0].segments) {
    if (s.kind !== 'lit') {
      slots.push([s.kind === 'imm' ? s.name : s.label, s.hi, s.lo, s.kind === 'imm' || s.numeric ? 'imm' : 'reg']);
      continue;
    }
    for (let bit = s.hi; bit >= s.lo; bit--) {
      const value = _literalAt({ inst: members[0], bit });
      const same = members.every((m) => _literalAt({ inst: m, bit }) === value);
      const last = slots[slots.length - 1];
      if (!same && last && last[0] === 'op' && last[2] === bit + 1) last[2] = bit;
      else slots.push([same ? value : 'op', bit, bit, same ? 'opcode' : 'funct']);
    }
  }
  return slots;
}

// Format header row: field names from the format layout, bits written out where all members agree.
function _groupRow({ codec = null, group = {}, members = [], rowspan = 1 }) {
  const cells = [];
  const { spine } = codec.spec;
  const outside = outsideCells({ codec, width: members[0].width });
  if (!spine.bytes) cells.push(...outside);
  for (const [name, hi, lo, role] of _groupLayout({ codec, group, members })) {
    const bits = [];
    for (let bit = hi; bit >= lo; bit--) {
      const value = _literalAt({ inst: members[0], bit });
      bits.push(value !== null && members.every((m) => _literalAt({ inst: m, bit }) === value) ? value : null);
    }
    if (bits.every((b) => b !== null)) bits.forEach((b) => cells.push(cell({ classes: `bit lit-${role}`, text: b })));
    else cells.push(cell({ width: hi - lo + 1, classes: `bit field-${role}`, text: name }));
  }
  if (spine.bytes) cells.push(...outside);
  // Members of a set without group extensions may differ: then the column stays empty.
  const extensions = new Set(members.map((m) => m.extension));
  const extension = group.extension ?? (extensions.size === 1 ? members[0].extension : '');
  cells.push(
    cell({ width: _titleWidth({ codec }), classes: 'text group-title', text: group.title }),
    cell({ classes: 'text group-pseudo', text: group.pseudocode }),
    typeCell({ codec, format: group.format, rowspan }),
    cell({ rowspan, classes: 'text ext', text: extension ? `'${extension}'` : '' }),
  );
  return _tr({ class: `group-row fmt-${group.format}` }, cells);
}

// extra: cells appended at the end (Type / Ext when the instruction stands without its group header).
function _instructionRow({ codec = null, inst = {}, decoded = null, bitAt = null, onPattern = () => {}, extra = [] }) {
  const fields = decoded && decoded.inst === inst ? decoded.fields : null;
  const cells = segmentCells({ codec, segments: inst.segments, width: inst.width, fields, inst, bitAt });
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
    cell({ classes: 'text operands', text: fields ? codec.operandsText({ inst, fields }) || '—' : codec.templateText({ entry: inst }) || '—' }),
    ...(_hasExpansion({ codec }) ? [cell({ classes: 'text expansion', text: inst.expands || '' })] : []),
    cell({ classes: 'text pseudocode', text: inst.pseudocode }),
    ...extra,
  );
  return _tr({ class: `instruction-row fmt-${inst.format}` + (fields ? ' decoded' : '') }, cells);
}

function _immediateRow({ codec = null, inst = {}, decoded = null, bitAt = null }) {
  const cells = immediateCells({ codec, inst, bitAt: bitAt ? immediateBits({ inst, wordBitAt: bitAt }) : null });
  cells.push(
    cell({ width: _titleWidth({ codec }), classes: 'text imm-name', text: decoded && decoded.inst === inst ? `${inst.immName} = ${decoded.fields.imm}` : inst.immName }),
    cell({ classes: 'text imm-desc', text: codec.spec.spine.bytes ? 'low byte first' : `${inst.format} ${inst.immSigned ? 'sign-extended' : 'zero-extended'} immediate` }),
  );
  return _tr({ class: `immediate-row fmt-${inst.format}` }, cells);
}

function _immediateSignature({ inst = {} }) {
  return inst.segments.filter((s) => s.kind === 'imm').map((s) => `${s.hi}:${s.immBits}`).join(' ');
}

// A major opcode that the instruction set (RV32GC, RV64GC_Zba, ...) does not use: the rest of the instruction is meaningless.
function _unusedOpcodeRow({ codec = null, unused = {} }) {
  const cells = [cell({ width: 25, classes: 'bit any', text: `– not used in ${codec.spec.name} –` })];
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

// What the decoder lays out of a codec, worked out once: each group's members in the decoder's order, and the groups
// (and unused opcodes) of each section in the order of their most significant member.
const _layouts = new WeakMap();
function _layout({ codec = null }) {
  if (_layouts.has(codec)) return _layouts.get(codec);
  const { compiled, unusedOpcodeRows, spec: { groups, sections } } = codec;
  const members = new Map(Object.keys(groups).map((g) => [g, []]));
  for (const inst of compiled) if (members.has(inst.groupKey)) members.get(inst.groupKey).push(inst);
  for (const list of members.values()) list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  const order = {};
  for (const section of Object.keys(sections)) {
    const items = Object.keys(groups).filter((g) => groups[g].section === section && members.get(g).length).map((groupKey) => ({ groupKey, sortKey: members.get(groupKey)[0].sortKey }));
    if (section === 'q3') items.push(...unusedOpcodeRows.map((unused) => ({ unused, sortKey: unused.sortKey })));
    order[section] = items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }
  const layout = { members, order };
  _layouts.set(codec, layout);
  return layout;
}

// One group's rows.
function _groupRows({ codec = null, groupKey = '', members = [], decoded = null, bitAt = null, onPattern = () => {} }) {
  const { groups } = codec.spec;
  // Only one instruction left: its own row (placeholders, with the bits set so far behind them) takes the place of the
  // group header, which would only repeat it; the immediate row follows.
  if (members.length === 1 && !members[0].reserved && !members[0].hint) {
    const inst = members[0];
    const rowspan = inst.immRow ? 2 : 1;
    const rows = [_instructionRow({ codec, inst, decoded, bitAt, onPattern,
      extra: [typeCell({ codec, format: inst.format, rowspan }), cell({ rowspan, classes: 'text ext', text: `'${inst.extension}'` })] })];
    if (inst.immRow) rows.push(_immediateRow({ codec, inst, decoded, bitAt }));
    return rows;
  }
  // Shared immediate layout: one immediate view under the group header, otherwise one per instruction.
  const withImm = members.filter((m) => m.immRow);
  const shared = withImm.length > 0 && withImm.every((m) => _immediateSignature({ inst: m }) === _immediateSignature({ inst: withImm[0] }));
  const body = [];
  if (shared) body.push(_immediateRow({ codec, inst: decoded && withImm.includes(decoded.inst) ? decoded.inst : withImm[0], decoded, bitAt }));
  for (const inst of members) {
    body.push(_instructionRow({ codec, inst, decoded, bitAt, onPattern }));
    if (inst.immRow && !shared) body.push(_immediateRow({ codec, inst, decoded, bitAt }));
  }
  return [_groupRow({ codec, group: groups[groupKey], members, rowspan: body.length + 1 }), ...body];
}

// How many rows a group makes, without making them.
function _groupCount({ members = [] }) {
  if (members.length === 1 && !members[0].reserved && !members[0].hint) return members[0].immRow ? 2 : 1;
  const withImm = members.filter((m) => m.immRow);
  return 1 + members.length + withImm.length;
}

// The rows as units for lazyRows (src/lazyrows.mjs): a section title, each group with its members. With no bit set the
// rows are the same every time: made once per sheet and kept.
export function decoderRows({ sheet = null, constraints = [], decoded = null, onPattern = () => {} }) {
  const { codec } = sheet;
  const { matchesConstraints, spec: { sections, spine } } = codec;
  const { members: byGroup, order } = _layout({ codec });
  const blank = constraints.every((c) => c === '-');
  // The bits set so far, shown faintly behind every matching instruction's placeholders (best effort).
  const top = spine.width - 1;
  const bitAt = blank ? null : (bit) => (constraints[top - bit] === '-' ? null : constraints[top - bit]);
  sheet.rowCache ??= new Map();
  const cached = (key, make) => {
    if (!blank) return make();
    if (!sheet.rowCache.has(key)) sheet.rowCache.set(key, make());
    return sheet.rowCache.get(key);
  };
  const units = [];
  for (const section of Object.keys(sections)) {
    const sectionUnits = [];
    for (const { groupKey, unused } of order[section]) {
      if (unused) {
        if (_unusedMatches({ unused, constraints })) sectionUnits.push({ count: 1, rows: () => [_unusedOpcodeRow({ codec, unused })] });
        continue;
      }
      const members = blank ? byGroup.get(groupKey) : byGroup.get(groupKey).filter((inst) => matchesConstraints({ inst, constraints }));
      if (!members.length) continue;
      sectionUnits.push({ count: _groupCount({ members }), rows: () => cached(groupKey, () => _groupRows({ codec, groupKey, members, decoded, bitAt, onPattern })) });
    }
    if (sectionUnits.length) units.push({ count: 1, rows: () => cached(`section:${section}`, () => [_sectionRow({ codec, title: sections[section] })]) }, ...sectionUnits);
  }
  if (!units.length) units.push({ count: 1, rows: () => [_tr({}, [cell({ width: _allColumns({ codec }), classes: 'text empty', text: 'No instruction matches the selected bits.' })])] });
  return units;
}

// io: what goes next to the bit switches (the decoded result).
// copies: { binary, hex, pasteBinary, pasteHex } copy and paste buttons by the bits' section title.
// Header rows: section titles, the controls (hex digits over the switches, the decoded instruction beside both),
// then the bit numbers and column titles right above the sheet's rows. Returns the sheet decoderRows takes; its `bits`
// are the switches (read, write, paste, highlight, dim).
export function decoderSheet({ codec = null, onBits = () => {}, copies = {}, io = null }) {
  const { spine } = codec.spec;
  const textColumns = _textColumns({ codec });
  const bits = Tristates({ codec, editable: true, onChange: onBits });
  const widths = [...new Array(spine.width).fill(24), ...textColumns.map((c) => c.width)];
  const table = _table({ class: 'sliderule', id: 'decoder-sheet', style: tableWidth({ widths }) }, [
    columns({ widths }),
    _thead({}, [
      _tr({ class: 'label-row' }, [
        sectionHeader({ colspan: spine.width, title: `Bitwise Breakdown — ${spine.title}`, before: [copies.binary, copies.pasteBinary].filter(Boolean),
          after: [copies.pasteHex, copies.hex].filter(Boolean), classes: 'spine' }),
        sectionHeader({ colspan: textColumns.length, title: 'Meaning' }),
      ]),
      _tr({ class: 'hex-row' }, [...bits.hexCells, _td({ class: 'io-cell', colspan: String(textColumns.length), rowspan: '2' }, [io])]),
      _tr({ class: 'input-row' }, bits.cells),
      _tr({ class: 'number-row' }, [...bitNumbers({ codec }), ...textColumns.map(({ title }) => _th({ class: 'column-title' }, title))]),
    ]),
    _tbody({}, ''),
  ]);
  return { codec, bits, table };
}
