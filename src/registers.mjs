import { cell } from './cells.mjs';

// The registers of an instruction set (codec.spec.registers, generated with its instructions), as the popups of the
// register buttons in the header: one button per group of sections ("CPU Registers", "Stack", "Float Registers", ...),
// in the order the groups first appear. Tables are in the sheets' look; registers take the hue of formats on registers
// (red), as the palette says; a section's last column (Meaning) takes the width the others leave.

export function registerGroups({ codec = null }) {
  const groups = [];
  for (const section of (codec && codec.spec.registers) || []) {
    const label = section.group || 'Registers';
    let group = groups.find((g) => g.label === label);
    if (!group) groups.push((group = { label, sections: [] }));
    group.sections.push(section);
  }
  return groups;
}

// Values written as bits, hex or numbers read better in the monospace of the bits.
const _isValue = (text) => /^([01]+|0x[0-9a-f]+|\$[0-9A-F]+|\d+([:–]\d+)?|—)$/.test(text);

export function registersTable({ sections = [] }) {
  const width = Math.max(1, ...sections.map((s) => s.columns.length));
  const rows = [];
  for (const { title, columns, rows: data } of sections) {
    rows.push(_tr({ class: 'section-row' }, [cell({ width, text: title })]));
    rows.push(_tr({ class: 'registers-head fmt-REG' }, columns.map((column, i) =>
      _th({ class: 'column-title', ...(i === columns.length - 1 && width > columns.length ? { colspan: String(width - columns.length + 1) } : {}) }, column))));
    for (const row of data) {
      rows.push(_tr({ class: 'registers-row fmt-REG' }, row.map((text, i) => {
        const last = i === row.length - 1;
        const classes = i === 0 ? 'text register-name' : last ? 'text register-meaning' : `text${_isValue(text) ? ' register-value' : ''}`;
        return cell({ width: last ? width - row.length + 1 : 1, classes, text });
      })));
    }
  }
  return _table({ class: 'sliderule registers-sheet' }, [_tbody({}, rows)]);
}
