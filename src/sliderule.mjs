import { formats } from './isa/rv32gc.mjs';
import { decodeWord, encodeEntry, unusedOpcode, encodable, assemblyParts, fieldMask, partialDecode } from './isa/codec.mjs';
import { decoderTable, decoderRows, readConstraints, writeBits, selectedWord, dimUpperHalf, pasteBits, highlightBits } from './selector.mjs';
import { encoderTable, encoderRows, showEncodedBits, expandAllColumns } from './encoder.mjs';
import { OperandPanel } from './builders.mjs';
import { Carousel } from './carousel.mjs';
import { hex, columns, tableWidth } from './cells.mjs';

// The sliderule app: the b2a Decoder (bits on the left) or the a2b Encoder (bits on the right), one table at a time.
// Switching fades out everything but the 32 bit "spine", slides the spine to the other side, then fades the new table in.
// With ?print in the URL both sheets are laid out for paper (used to render the PDF).

const FADE_MS = 220;
const SLIDE_MS = 560;
const COPIED_MS = 1200;
const EXTENSION_ORDER = ['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei', 'C', 'C + F', 'C + D', 'PSEUDO'];
const state = { mode: 'decoder', ext: '*', type: '*', entry: null, encoded: null, operands: null, switching: false };
let _elements = null;

// ---------------------------------------------------------------- assembly with coloured operands

function _tokenTitle({ inst = {}, part = {}, fields = {} }) {
  if (!part.known) return `${part.text}: bits not set yet`;
  if (part.kind === 'imm') {
    const v = fields.imm;
    return `${inst.immName} = ${v} = ${v < 0 ? '-' : ''}0x${Math.abs(v).toString(16)}` + (inst.asmShift ? ` (written as imm >> ${inst.asmShift})` : '');
  }
  if (part.kind === 'reg' && part.key !== 'sp') return `${part.key} = ${(inst.fregs || []).includes(part.key) ? 'f' : 'x'}${fields[part.key]}`;
  return part.key ? `${part.key} = ${fields[part.key]}` : '';
}

// One instruction as tokens; hovering a token marks its bits in the switches (decoder only: onHover).
function _assemblyLine({ inst = {}, fields = {}, onHover = null }) {
  const parts = assemblyParts({ inst, fields });
  return _span({ class: `asm-line fmt-${inst.format}` }, parts.map((part) => {
    if (part.kind === 'punct') return _span({ class: 'asm-punct' }, part.text);
    const token = _span({ class: `asm-token asm-${part.kind}` + (part.known ? '' : ' unknown'), title: _tokenTitle({ inst, part, fields }) }, part.text);
    if (onHover) {
      const mask = part.kind === 'mnemonic' ? inst.mask : part.key === 'sp' ? 0 : fieldMask({ inst, key: part.key });
      token.addEventListener('mouseenter', () => onHover({ mask }));
      token.addEventListener('mouseleave', () => onHover({ mask: 0 }));
    }
    return token;
  }));
}

function _show({ target = null, content = '', error = false }) {
  target.classList.toggle('error', error);
  target.replaceChildren(...(Array.isArray(content) ? content : [content]));
}

function _button({ label = '', title = '', classes = 'tool-button', onClick = () => {} }) {
  const button = window._button({ class: classes, type: 'button', title }, label);
  button.addEventListener('click', onClick);
  return button;
}

// Copies text and briefly confirms on the button.
function _copyButton({ label = 'Copy', title = '', text = () => '' }) {
  const button = _button({ label, title });
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text());
      button.textContent = 'Copied ✓';
    } catch (e) {
      button.textContent = 'Copy failed';
    }
    setTimeout(() => { button.textContent = label; }, COPIED_MS);
  });
  return button;
}

// ---------------------------------------------------------------- decoder

function _renderDecoder() {
  const constraints = readConstraints();
  const word = selectedWord({ constraints });
  const decoded = word === null ? null : decodeWord({ word });
  const target = _elements.decoderResult;
  dimUpperHalf({ dim: constraints[31] !== '-' && constraints[30] !== '-' && !(constraints[31] === '1' && constraints[30] === '1') });
  highlightBits({ mask: 0 });
  if (word === null) {
    const partial = partialDecode({ constraints });
    if (constraints.every((c) => c === '-')) {
      _show({ target, content: 'Click 1 / 0 on the bits, type 0s and 1s (each one moves to the next bit), or paste a word: the instruction builds up here.' });
    } else if (partial.inst) {
      // index 0 is bit 31: the instruction's own bits are the last `width` entries
      const missing = constraints.slice(32 - partial.inst.width).filter((c) => c === '-').length;
      _show({ target, content: [
        _div({ class: 'io-line' }, [_assemblyLine({ inst: partial.inst, fields: partial.fields, onHover: highlightBits })]),
        _div({ class: 'io-note' }, `${missing} bit${missing === 1 ? '' : 's'} still unset`),
      ] });
    } else if (!partial.names.length) {
      _show({ target, error: true, content: 'No RV32GC instruction starts with these bits.' });
    } else {
      const shown = partial.names.slice(0, 8).join(', ') + (partial.names.length > 8 ? ', …' : '');
      _show({ target, content: `${partial.names.length} candidates: ${shown}` });
    }
  } else if (!decoded) {
    const unused = (word & 3) === 3 ? unusedOpcode({ word }) : null;
    _show({ target, error: true,
      content: `${hex({ word, width: (word & 3) === 3 ? 32 : 16 })} is not a valid RV32GC instruction` + (unused ? ` (${unused.name} opcode: ${unused.note})` : '') });
  } else if (decoded.inst.reserved || decoded.inst.hint) {
    _show({ target, content: [_div({ class: 'io-line' }, [_b({ class: 'io-asm' }, decoded.assembly), _span({ class: 'io-hex' }, hex({ word, width: decoded.inst.width }))])] });
  } else {
    const { inst, fields } = decoded;
    const lines = [_div({ class: 'io-line' }, [
      _assemblyLine({ inst, fields, onHover: highlightBits }),
      _span({ class: 'io-hex' }, hex({ word: decoded.word, width: inst.width })),
      _copyButton({ label: 'Copy', title: 'Copy the assembly', text: () => decoded.assembly }),
    ])];
    if (inst.immName) {
      const v = fields.imm;
      lines.push(_div({ class: 'io-note' }, `${inst.immName} = ${v} = ${v < 0 ? '-' : ''}0x${Math.abs(v).toString(16)} (${inst.immSigned ? 'sign' : 'zero'}-extended)`));
    }
    if (decoded.note) lines.push(_div({ class: 'io-note' }, decoded.note));
    _show({ target, content: lines });
  }
  const onPattern = ({ inst }) => {
    writeBits({ value: inst.match, mask: inst.mask, width: inst.width });
    refresh();
  };
  _elements.decoder.querySelector('tbody').replaceChildren(...decoderRows({ constraints, decoded, onPattern }));
}

async function _pasteFromClipboard() {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
  } catch (e) {
    _show({ target: _elements.decoderResult, error: true, content: 'The browser did not allow reading the clipboard: click a bit and press Ctrl+V instead.' });
    return;
  }
  if (!pasteBits({ text })) _show({ target: _elements.decoderResult, error: true, content: `"${text.trim().slice(0, 40)}" is not a hex word (0x…) or a bit pattern.` });
}

// ---------------------------------------------------------------- encoder selectors

function _filtered() {
  return encodable.filter((e) => (state.ext === '*' || e.extension === state.ext) && (state.type === '*' || e.format === state.type));
}

function _extOptions() {
  const present = new Set(encodable.map((e) => e.extension));
  return [{ value: '*', label: 'All', hint: 'every extension' },
    ...EXTENSION_ORDER.filter((x) => present.has(x)).map((x) => ({ value: x, label: x === 'PSEUDO' ? 'Pseudo' : x, classes: x === 'PSEUDO' ? 'pseudo' : '' }))];
}

function _typeOptions() {
  const present = new Set(encodable.filter((e) => state.ext === '*' || e.extension === state.ext).map((e) => e.format));
  const order = [...Object.keys(formats), '/'];
  return [{ value: '*', label: 'All', hint: 'every format' },
    ...order.filter((f) => present.has(f)).map((f) => ({ value: f, label: f === '/' ? 'Multiple' : `${f}-Type`, hint: f === '/' ? 'expands to several instructions' : formats[f].title, classes: `fmt-${f}` }))];
}

function _mnemonicOptions({ entries = _filtered() } = {}) {
  const rank = (e) => EXTENSION_ORDER.indexOf(e.extension);
  entries = [...entries].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  return [{ value: '', label: '—', hint: 'any instruction' }, ...entries.map((e) => ({
    value: e.id, label: e.name, hint: e.asm || '', group: e.pseudo ? 'Pseudo-instructions' : `'${e.extension}'`, classes: e.pseudo ? 'pseudo' : `fmt-${e.format}`,
  }))];
}

// Brings every selector in line with the state (after any of them changed).
function _syncSelectors() {
  const { ext, type, mnemonic } = _elements.selectors;
  ext.setOptions({ options: _extOptions(), value: state.ext });
  type.setOptions({ options: _typeOptions(), value: state.type });
  state.type = type.value;
  mnemonic.setOptions({ options: _mnemonicOptions(), value: state.entry ? state.entry.id : '' });
}

function _selectEntry({ entry = null }) {
  state.entry = entry;
  if (entry) {
    state.ext = entry.extension;
    state.type = entry.format;
  }
  _syncSelectors();
  _elements.operands.show({ entry });
}

function _onFilter() {
  if (state.entry && !_filtered().includes(state.entry)) {
    _syncSelectors();
    _elements.operands.show({ entry: null });
    return;
  }
  _syncSelectors();
  _renderEncoder();
}

function _onOperands({ entry = null, operands = null, ordering = '' }) {
  state.entry = entry;
  state.operands = operands;
  state.encoded = null;
  if (entry && operands !== null) {
    try {
      state.encoded = encodeEntry({ entry, operands, ordering });
    } catch (e) {
      state.encoded = { error: e.message };
    }
  }
  refresh();
}

function _encodedText({ format = 'hex' }) {
  const encoded = state.encoded && !state.encoded.error ? state.encoded : null;
  if (!encoded) return '';
  return encoded.words.map(({ word, inst }) => (format === 'hex' ? hex({ word, width: inst.width }) : (word >>> 0).toString(2).padStart(inst.width, '0'))).join('\n');
}

function _renderEncoder() {
  const encoded = state.encoded && !state.encoded.error ? state.encoded : null;
  const { encoderStatus, encoderWords, copyButtons } = _elements;
  if (state.encoded && state.encoded.error) _show({ target: encoderStatus, content: state.encoded.error, error: true });
  else if (encoded) {
    _show({ target: encoderStatus, content: encoded.words.map(({ inst, fields }) => _div({ class: 'io-line' }, [_assemblyLine({ inst, fields })])) });
  } else {
    const count = _filtered().length;
    _show({ target: encoderStatus, content: `${count} instruction${count === 1 ? '' : 's'}: scroll the selectors (or click to pick from a list), or click a mnemonic below.` });
  }
  encoderWords.replaceChildren(...(encoded
    ? encoded.words.map(({ word, inst }) => _span({ class: 'io-word' }, [_b({ class: 'io-hex-big' }, hex({ word, width: inst.width })), _span({ class: 'io-bin' }, (word >>> 0).toString(2).padStart(inst.width, '0'))]))
    : [_span({ class: 'io-placeholder' }, 'The encoding appears here once an instruction is chosen.')]));
  copyButtons.forEach((button) => { button.disabled = !encoded; });
  showEncodedBits({ entry: state.entry, encoded });
  _elements.encoder.querySelector('tbody').replaceChildren(...encoderRows({
    entries: _filtered(), entry: state.entry, encoded, operands: encoded ? state.operands : null, onPick: _selectEntry,
  }));
}

export function refresh() {
  if (state.mode === 'encoder' || state.print) _renderEncoder();
  if (state.mode === 'decoder' || state.print) _renderDecoder();
}

// ---------------------------------------------------------------- switching

// A copy of the spine (bit numbers and switches) laid over the table, aligned with the original.
function _ghostSpine({ table = null }) {
  const rows = ['.number-row', '.input-row'].map((row) => _tr({}, [...table.querySelectorAll(`${row} > .spine`)].map((c) => c.cloneNode(true))));
  const widths = new Array(32).fill(24);
  const ghost = _table({ class: 'sliderule ghost', 'aria-hidden': 'true', style: tableWidth({ widths }) }, [columns({ widths }), _thead({}, rows)]);
  _elements.stage.append(ghost);
  const target = table.querySelector('.bit-number').getBoundingClientRect();
  const own = ghost.querySelector('.bit-number').getBoundingClientRect();
  ghost.style.left = `${target.left - own.left}px`;
  ghost.style.top = `${target.top - own.top}px`;
  return ghost;
}

function _animate({ element = null, keyframes = [], duration = FADE_MS, easing = 'ease-in-out' }) {
  return element.animate(keyframes, { duration, easing, fill: 'forwards' }).finished;
}

// Horizontal offset of bit 31 inside its table (the inactive table stays laid out, see .stage in styles.css).
function _spineOffset({ table = null }) {
  return table.querySelector('.bit-number').offsetLeft;
}

// Page scroll that brings the whole spine of a table into view (it is wider than most screens).
function _scrollForSpine({ table = null }) {
  const numbers = table.querySelectorAll('.bit-number');
  const left = numbers[0].getBoundingClientRect().left + window.scrollX - 16;
  const right = numbers[numbers.length - 1].getBoundingClientRect().right + window.scrollX + 16;
  if (right > window.scrollX + window.innerWidth) return Math.min(left, right - window.innerWidth);
  if (left < window.scrollX) return left;
  return window.scrollX;
}

function _activate({ mode = 'decoder' }) {
  _elements.decoder.parentElement.classList.toggle('active', mode === 'decoder');
  _elements.encoder.parentElement.classList.toggle('active', mode === 'encoder');
}

// Fade the table out but keep its spine (as a ghost copy), slide the spine across, fade the other table in.
async function _switchTo({ mode = 'decoder' }) {
  if (mode === state.mode || state.switching) return;
  state.switching = true;
  const from = state.mode === 'encoder' ? _elements.encoder : _elements.decoder;
  const to = mode === 'encoder' ? _elements.encoder : _elements.decoder;
  state.mode = mode;
  refresh();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    _activate({ mode });
  } else {
    const ghost = _ghostSpine({ table: from });
    await _animate({ element: from, keyframes: [{ opacity: 1 }, { opacity: 0 }] });
    const delta = _spineOffset({ table: to }) - _spineOffset({ table: from });
    window.scrollTo({ left: _scrollForSpine({ table: to }), behavior: 'smooth' });
    await _animate({ element: ghost, keyframes: [{ transform: 'translateX(0)' }, { transform: `translateX(${delta}px)` }],
      duration: SLIDE_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    _activate({ mode });
    from.getAnimations().forEach((a) => a.cancel());
    await Promise.all([
      _animate({ element: to, keyframes: [{ opacity: 0 }, { opacity: 1 }] }),
      _animate({ element: ghost, keyframes: [{ opacity: 1 }, { opacity: 0 }] }),
    ]);
    to.getAnimations().forEach((a) => a.cancel());
    ghost.remove();
  }
  try { history.replaceState(null, '', `#${mode}`); } catch (e) { /* the hash only remembers the view */ }
  window.scrollTo({ left: _scrollForSpine({ table: to }) });
  state.switching = false;
}

function _modeButton({ mode = 'encoder', label = '' }) {
  return _button({ classes: 'mode-button', title: `Switch to the ${label}`, label: mode === 'encoder' ? `◀ ${label}` : `${label} ▶`, onClick: () => _switchTo({ mode }) });
}

// The bit numbers, switches and (encoder) output rows stay on screen while scrolling: each sticks below the previous.
function _stickHeaderRows({ table = null }) {
  const rows = ['.number-row', '.input-row', '.output-row'].map((r) => table.querySelector(`thead > ${r}`)).filter(Boolean);
  const place = () => {
    let top = 0;
    for (const row of rows) {
      for (const c of row.children) c.style.top = `${top}px`;
      top += row.getBoundingClientRect().height;
    }
  };
  new ResizeObserver(place).observe(table.tHead);
  place();
}

// ---------------------------------------------------------------- app

function _encoderControls() {
  const ext = Carousel({ label: 'extension', options: _extOptions(), value: '*', onChange: (v) => { state.ext = v; _onFilter(); } });
  const type = Carousel({ label: 'format type', options: _typeOptions(), value: '*', onChange: (v) => { state.type = v; _onFilter(); } });
  const mnemonic = Carousel({ label: 'mnemonic', options: _mnemonicOptions(), value: '', searchable: true, classes: 'mnemonic-carousel',
    searchAll: () => _mnemonicOptions({ entries: encodable }),
    onChange: (id) => _selectEntry({ entry: encodable.find((e) => e.id === id) || null }) });
  const operands = OperandPanel({ onChange: _onOperands });
  return { ext, type, mnemonic, operands };
}

export function Sliderule() {
  const print = new URLSearchParams(location.search).has('print');
  const decoderResult = _div({ class: 'io-result' }, '');
  const decoder = decoderTable({ onBits: refresh, toggle: _modeButton({ mode: 'encoder', label: 'a2b · Encoder' }),
    io: _div({ class: 'io' }, [
      decoderResult,
      _div({ class: 'io-tools' }, [
        _button({ label: 'Paste', title: 'Fill the bits from the clipboard (a hex word or a bit pattern)', onClick: _pasteFromClipboard }),
        _button({ label: 'Clear', title: 'Set every bit back to x', onClick: () => { writeBits({ value: 0, mask: 0 }); refresh(); } }),
      ]),
    ]) });
  const selectors = _encoderControls();
  const encoderStatus = _div({ class: 'io-result' }, '');
  const encoderWords = _div({ class: 'io-words' }, '');
  const copyButtons = [
    _copyButton({ label: 'Copy hex', title: 'Copy the encoding as hex (one word per line)', text: () => _encodedText({ format: 'hex' }) }),
    _copyButton({ label: 'Copy bin', title: 'Copy the encoding as binary (one word per line)', text: () => _encodedText({ format: 'bin' }) }),
  ];
  const encoder = encoderTable({
    toggle: _modeButton({ mode: 'decoder', label: 'b2a · Decoder' }),
    controls: { ext: selectors.ext, type: selectors.type, mnemonic: selectors.mnemonic, operands: selectors.operands },
    status: _div({ class: 'io' }, [encoderStatus, _div({ class: 'io-tools' }, [
      _button({ label: 'Clear', title: 'Back to every instruction', onClick: () => { state.ext = '*'; state.type = '*'; _selectEntry({ entry: null }); } }),
    ])]),
    output: _div({ class: 'io io-output' }, [encoderWords, _div({ class: 'io-tools' }, copyButtons)]),
  });
  const stage = _div({ id: 'sliderule', class: 'stage' + (print ? ' print' : '') }, [_div({ class: 'view' }, [decoder]), _div({ class: 'view' }, [encoder])]);
  _elements = { decoder, encoder, decoderResult, encoderStatus, encoderWords, copyButtons, selectors, operands: selectors.operands, stage };
  state.print = print;
  state.mode = location.hash === '#encoder' ? 'encoder' : 'decoder';
  _activate({ mode: state.mode });
  if (print) expandAllColumns({ expand: true });
  // Both tables are filled once; each only changes while it is shown, so the hidden one is always up to date.
  _renderDecoder();
  selectors.operands.show({ entry: null });
  requestAnimationFrame(() => [decoder, encoder].forEach((table) => _stickHeaderRows({ table })));
  return stage;
}
