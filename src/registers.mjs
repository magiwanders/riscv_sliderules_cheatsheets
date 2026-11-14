import { cell } from './cells.mjs';

// The registers sheet, under the header while the Registers toggle is on: every register of the instruction set
// (codec.spec.registers, generated with the instructions), one section per register file or kind, in the sheets' look.
// Registers take the hue of formats on registers (red), as the palette says; a section's last column (Meaning) takes
// the width the others leave.

// Values written as bits or hex read better in the monospace of the bits.
const _isValue = (text) => /^([01]+|0x[0-9a-f]+|\$[0-9A-F]+|\d+(:\d+)?|—)$/.test(text);

export function registersSheet({ codec = null }) {
  const sections = (codec && codec.spec.registers) || [];
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
        return cell({ width: last ? width - row.length + 1 : 1, classes, text, title: last ? text : '' });
      })));
    }
  }
  return _table({ class: 'sliderule registers-sheet' }, [_tbody({}, rows)]);
}
