import { isas } from './isa/isas.mjs';
import { segmentCells, typeCell, bitNumbers } from './cells.mjs';

// One line of a sheet, for other pages to show (sliderules.line, or public/line.js on its own): the encoder's line
// of an assembly instruction (its assembly, then its bits by field) or the decoder's line of some bytes of memory
// (the bits by field, then the instruction they are). `show` puts either in a popup that follows the pointer.
//
//   isa: an instruction set's value in isas.mjs ('rv32gc', 'rv64gc', 'arm64', 'arm32', 'mips32', 'mips64', '8080', '8051', 'z80', '6502', 'hack');
//   extensions: RISC-V only, the extensions to decode and encode with (['I', 'M', 'C']); the sheet's default otherwise;
//   bytes: in memory order. A word instruction set reads them little-endian (RISC-V, and Hack as Ash lays it out).

const BIT_WIDTH = 18;
const TEXT_WIDTHS = { type: 96, assembly: 170, description: 210 };

function _member({ isa = 'rv32gc' }) {
  const key = String(isa).toLowerCase();
  const member = isas.find((m) => m.value === key || m.label.toLowerCase() === key);
  if (!member || !member.codec) throw new Error(`no sheets for "${isa}"`);
  return member;
}

function _codec({ isa = 'rv32gc', extensions = null }) {
  const member = _member({ isa });
  if (!extensions || !member.extensions) return member.codec;
  return member.extensions.codecFor({ enabled: new Set(extensions) });
}

// The smallest step between two instructions, in bytes: where an unknown word is skipped to.
function _step({ codec = null }) {
  const { spine } = codec.spec;
  if (spine.bytes) return (spine.unit || 8) / 8;
  const widths = codec.compiled.map((i) => i.width);
  return Math.max(1, Math.min(...widths) / 8);
}

// The spine word of the instruction starting at bytes[0], and how many bytes it takes (null: not enough of them).
function _wordAt({ codec = null, bytes = [] }) {
  const { spine } = codec.spec;
  const size = spine.width / 8;
  const at = (i) => (bytes[i] ?? 0) & 0xff;
  let word = 0;
  // a halfword machine (Thumb) keeps each halfword little-endian, the first one first
  if (spine.bytes && spine.unit === 16) for (let i = 0; i < size; i += 2) word = word * 65536 + at(i + 1) * 256 + at(i);
  else if (spine.bytes) for (let i = 0; i < size; i++) word = word * 256 + at(i);
  else for (let i = size - 1; i >= 0; i--) word = word * 256 + at(i);
  word >>>= 0;
  const width = codec.spec.widthOf ? codec.spec.widthOf({ bit: (b) => String((word >>> b) & 1) }) : spine.width;
  const length = (width || spine.width) / 8;
  if (!spine.bytes && width && width < 32) word = (word & (2 ** width - 1)) >>> 0;
  return { word, length, complete: bytes.length >= length };
}

// The class of a bit's cell, after the cell of its field above it.
function _bitClass({ codec = null, segments = [], position = 0 }) {
  const s = segments.find((x) => position <= x.hi && position >= x.lo);
  if (!s) return codec.spec.spine.bytes ? 'bit absent' : 'bit unused';
  if (s.kind === 'lit') return `bit lit-${s.role}`;
  if (s.kind === 'imm') return `bit imm imm-${s.part % 4}`;
  if (s.kind === 'reg') return 'bit field-reg';
  if (s.kind === 'field') return `bit field-${s.numeric ? 'imm' : 'field'}`;
  return 'bit any';
}

// The instruction's bits one by one, under its fields; the spine positions it does not reach stay empty.
function _bitsRow({ codec = null, inst = null, word = 0 }) {
  const cells = [];
  const segments = inst ? inst.segments : [];
  const lsb = inst ? inst.lsb : 0;
  const width = inst ? inst.width : codec.spec.spine.width;
  for (let position = codec.spec.spine.width - 1; position >= 0; position--) {
    const inside = position >= lsb && position < lsb + width;
    const classes = inst ? _bitClass({ codec, segments, position }) : 'bit any';
    cells.push(_td({ class: `${classes} line-bit` }, inside ? String((word >>> position) & 1) : ''));
  }
  return cells;
}

// The line's table: a title, the column titles and bit numbers, its rows.
function _lineTable({ title = '', widths = [], head = [], rows = [] }) {
  return _table({ class: 'sliderule sliderule-line', style: `width: ${widths.reduce((a, b) => a + b, 0)}px` }, [
    _colgroup({}, widths.map((width) => _col({ style: `width: ${width}px` }, ''))),
    _tbody({}, [
      _tr({ class: 'line-title' }, [_th({ colspan: String(widths.length) }, title)]),
      _tr({ class: 'line-numbers' }, head),
      ...rows,
    ]),
  ]);
}

const _spineWidths = ({ codec = null }) => new Array(codec.spec.spine.width).fill(BIT_WIDTH);
const _hexOf = ({ codec = null, inst = null, word = 0 }) => (inst ? codec.hex({ word, width: inst.width }) : `0x${word.toString(16)}`);

// The encoder's line of an assembly instruction (a pseudo-instruction gives a line per instruction it expands to).
// Returns { element, words: [{ word, width, hex, binary }], error }; with an error the element says why.
export function encoderLine({ isa = 'rv32gc', extensions = null, assembly = '', title = '' }) {
  const codec = _codec({ isa, extensions });
  const widths = [TEXT_WIDTHS.type, TEXT_WIDTHS.assembly, ..._spineWidths({ codec })];
  const head = [_th({}, 'Type'), _th({}, 'Assembly'), ...bitNumbers({ codec })];
  let encoded;
  try {
    encoded = codec.encodeAssembly({ assembly });
  } catch (e) {
    const rows = [_tr({}, [_td({ class: 'text line-error', colspan: String(widths.length) }, `${assembly.trim()}: ${e.message}`)])];
    return { element: _lineTable({ title: title || `${codec.spec.name} · ${assembly.trim()}`, widths, head, rows }), words: [], error: e.message };
  }
  const { entry, words } = encoded;
  const rows = [];
  words.forEach(({ inst, word, fields, assembly: text }, i) => {
    const cells = i === 0
      ? [typeCell({ codec, format: entry.format || inst.format, rowspan: 2 * words.length }),
        _td({ class: 'text line-assembly' + (entry.pseudo ? ' pseudo' : ''), rowspan: String(2 * words.length) }, assembly.trim())]
      : [];
    rows.push(_tr({ class: `instruction-row fmt-${inst.format}`, title: text }, [...cells, ...segmentCells({ codec, segments: inst.segments, width: inst.width, fields, inst })]));
    rows.push(_tr({ class: `instruction-row fmt-${inst.format}` }, _bitsRow({ codec, inst, word })));
  });
  const hexes = words.map(({ inst, word }) => _hexOf({ codec, inst, word })).join(' ');
  return {
    element: _lineTable({ title: title || `${codec.spec.name} · ${assembly.trim()} · ${hexes}`, widths, head, rows }),
    words: words.map(({ inst, word }) => ({ word, width: inst.width, hex: _hexOf({ codec, inst, word }), binary: codec.binary({ word, width: inst.width }) })),
    error: null,
  };
}

// The decoder's line of the instruction starting at bytes[0]. Returns { element, assembly, length (bytes it takes),
// error }: assembly is null when the bytes are no instruction, or not all of it.
export function decoderLine({ isa = 'rv32gc', extensions = null, bytes = [], title = '' }) {
  const codec = _codec({ isa, extensions });
  const widths = [..._spineWidths({ codec }), TEXT_WIDTHS.assembly, TEXT_WIDTHS.description, TEXT_WIDTHS.type];
  const head = [...bitNumbers({ codec }), _th({}, 'Assembly'), _th({}, 'Description'), _th({}, 'Type')];
  const { word, length, complete } = _wordAt({ codec, bytes: [...bytes] });
  const decoded = complete ? codec.decodeWord({ word }) : null;
  const error = !complete ? `the instruction takes ${length} bytes, ${bytes.length} given` : decoded ? null : 'no instruction';
  const inst = decoded ? decoded.inst : null;
  const hex = _hexOf({ codec, inst, word });
  let rows;
  if (decoded) {
    const special = inst.reserved || inst.hint;
    rows = [
      _tr({ class: `instruction-row fmt-${inst.format}` }, [
        ...segmentCells({ codec, segments: inst.segments, width: inst.width, fields: decoded.fields, inst }),
        _td({ class: 'text line-assembly' + (special ? ` ${inst.reserved ? 'reserved' : 'hint'}` : ''), rowspan: '2' }, decoded.assembly),
        _td({ class: 'text line-description', rowspan: '2', title: [inst.description, decoded.note].filter(Boolean).join(' · ') }, [inst.description, decoded.note].filter(Boolean).join(' · ')),
        typeCell({ codec, format: inst.format, rowspan: 2 }),
      ]),
      _tr({ class: `instruction-row fmt-${inst.format}` }, _bitsRow({ codec, inst, word })),
    ];
  } else {
    rows = [
      _tr({}, [_td({ class: 'bit any', colspan: String(codec.spec.spine.width) }, '– no instruction –'),
        _td({ class: 'text line-error', colspan: '3', rowspan: '2' }, error)]),
      _tr({}, _bitsRow({ codec, inst: null, word })),
    ];
  }
  const name = decoded ? decoded.assembly : error;
  return { element: _lineTable({ title: title || `${codec.spec.name} · ${hex} · ${name}`, widths, head, rows }), assembly: decoded && !inst.reserved ? decoded.assembly : null, length, error };
}

// Every instruction of some bytes, one after another: [{ offset, length, assembly }] (assembly null where the bytes are
// no instruction: one step is skipped, 2 bytes on RISC-V and Hack, 1 on the byte machines).
export function disassemble({ isa = 'rv32gc', extensions = null, bytes = [] }) {
  const codec = _codec({ isa, extensions });
  const step = _step({ codec });
  const all = [...bytes];
  const out = [];
  for (let offset = 0; offset < all.length;) {
    const rest = all.slice(offset, offset + codec.spec.spine.width / 8);
    const { word, length, complete } = _wordAt({ codec, bytes: rest });
    const decoded = complete ? codec.decodeWord({ word }) : null;
    if (decoded && !decoded.inst.reserved) {
      out.push({ offset, length, assembly: decoded.assembly });
      offset += length;
    } else {
      out.push({ offset, length: step, assembly: null });
      offset += step;
    }
  }
  return out;
}

// The words of an assembly instruction: [{ word, width, hex, binary }], or { error }.
export function assemble({ isa = 'rv32gc', extensions = null, assembly = '' }) {
  const codec = _codec({ isa, extensions });
  try {
    return { words: codec.encodeAssembly({ assembly }).words.map(({ inst, word }) => ({ word, width: inst.width, hex: _hexOf({ codec, inst, word }), binary: codec.binary({ word, width: inst.width }) })) };
  } catch (e) {
    return { error: e.message };
  }
}

// ---------------------------------------------------------------- the popup

let _popup = null;
let _shownKey = null;

function _popupElement() {
  if (_popup && _popup.isConnected) return _popup;
  _popup = _div({ class: 'sliderules-line-popup', role: 'tooltip' }, '');
  _popup.hidden = true;
  document.body.append(_popup);
  return _popup;
}

// Shows the encoder line of `assembly`, or the decoder line of `bytes`, in a popup next to (x, y) (client pixels: the
// pointer), kept inside the window; given both, the decoder's line where the assembly does not encode (a disassembly
// the assembler reads differently). Called again with the same line it only moves; call it on every pointer move.
// Returns what encoderLine / decoderLine return (without the element), or null when only moved.
export function show({ isa = 'rv32gc', extensions = null, assembly = null, bytes = null, title = '', x = 0, y = 0 }) {
  const popup = _popupElement();
  const key = JSON.stringify({ isa, extensions, assembly, bytes: bytes ? [...bytes] : null, title });
  let result = null;
  if (key !== _shownKey) {
    let line = assembly !== null && assembly !== undefined ? encoderLine({ isa, extensions, assembly, title }) : null;
    if (!line || (line.error && bytes)) line = decoderLine({ isa, extensions, bytes: bytes || [], title });
    popup.replaceChildren(line.element);
    _shownKey = key;
    const { element, ...rest } = line;
    result = rest;
  }
  popup.hidden = false;
  const gap = 16;
  const { width, height } = popup.getBoundingClientRect();
  const room = { w: document.documentElement.clientWidth, h: document.documentElement.clientHeight };
  const left = x + gap + width <= room.w ? x + gap : Math.max(4, Math.min(x - gap - width, room.w - width - 4));
  const top = y + gap + height <= room.h ? y + gap : Math.max(4, y - gap - height);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  return result;
}

export function hide() {
  if (_popup) _popup.hidden = true;
}
