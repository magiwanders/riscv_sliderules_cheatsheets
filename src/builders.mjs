import { operandInfo, templateParts, X_ABI, F_ABI, ROUNDING, CSRS, fenceText } from './isa/codec.mjs';
import { Carousel } from './carousel.mjs';

// Encoder operands: one selector per operand of the chosen instruction. Registers, CSRs, rounding modes and fence
// sets are carousels; immediates a slider plus a text field (decimal, 0x hex or 0b binary) limited to valid values.
// Every operand always holds a valid value, so the instruction is always encodable. Values carry over between
// instructions (rd stays a0 when switching from addi to andi) as long as they are valid there.

const DEFAULT_REGISTER = { rd: 10, rs1: 11, rs2: 12, rs3: 13, rs: 11, rt: 12 };

function _registerOptions({ info = {} }) {
  const options = [];
  for (let n = 0; n < 32; n++) {
    if (info.compressed && (n < 8 || n > 15)) continue;
    if (info.exclude.includes(n)) continue;
    const name = (info.fp ? F_ABI : X_ABI)[n];
    options.push({ value: n, label: name, hint: `${info.fp ? 'f' : 'x'}${n}` });
  }
  return options;
}

function _parseNumber({ text = '' }) {
  const t = text.trim().toLowerCase().replace(/_/g, '');
  const m = t.match(/^(-?)(0x[0-9a-f]+|0b[01]+|\d+)$/);
  if (!m) return null;
  const body = m[2];
  const value = body.startsWith('0b') ? parseInt(body.slice(2), 2) : Number(body);
  return m[1] ? -value : value;
}

function _immProblem({ value = 0, range = {} }) {
  if (value < range.min || value > range.max) return `must be between ${range.min} and ${range.max}`;
  if (range.step > 1 && value % range.step !== 0) return `must be a multiple of ${range.step}`;
  if (range.nonZero && value === 0) return 'cannot be 0';
  return null;
}

function _immDefault({ range = {} }) {
  if (!range.nonZero) return Math.min(Math.max(0, range.min), range.max);
  return range.step <= range.max ? range.step : range.min;
}

function _hex({ value = 0 }) {
  return value >= 0 ? `0x${value.toString(16)}` : `-0x${(-value).toString(16)}`;
}

// Slider + text field. The slider covers the whole range in valid steps; the text field takes exact values.
function _ImmediateControl({ token = 'imm', range = {}, value = 0, onChange = () => {} }) {
  let _value = value;
  const hint = `${range.min} … ${range.max}` + (range.step > 1 ? `, multiple of ${range.step}` : '') + (range.nonZero ? ', ≠ 0' : '');
  const slider = _input({ class: 'imm-slider', type: 'range', min: String(range.min), max: String(range.max), step: String(range.step),
    'aria-label': `${token} slider`, title: `${token}: ${hint}` });
  const field = _input({ class: 'imm-field', type: 'text', inputmode: 'numeric', spellcheck: 'false', 'aria-label': token,
    title: `${token}: ${hint} (decimal, 0x… or 0b…; scroll to step)` });
  const readout = _span({ class: 'imm-readout' }, '');
  const set = ({ newValue = 0, from = null }) => {
    _value = newValue;
    if (from !== slider) slider.value = String(_value);
    if (from !== field) field.value = String(_value);
    field.classList.remove('invalid');
    readout.textContent = _hex({ value: _value });
    readout.classList.remove('error');
    onChange(_value);
  };
  slider.addEventListener('input', () => {
    let v = Number(slider.value);
    if (range.nonZero && v === 0) v = range.step <= range.max ? range.step : -range.step;
    set({ newValue: v, from: v === Number(slider.value) ? slider : null });
  });
  field.addEventListener('input', () => {
    const v = _parseNumber({ text: field.value });
    const problem = v === null ? 'is not a number' : _immProblem({ value: v, range });
    if (problem) {
      field.classList.add('invalid');
      readout.textContent = `${token} ${problem}`;
      readout.classList.add('error');
      return;
    }
    set({ newValue: v, from: field });
  });
  field.addEventListener('blur', () => set({ newValue: _value }));
  // Wheel over the field steps the value, like the carousels.
  field.addEventListener('wheel', (event) => {
    event.preventDefault();
    let v = Math.min(range.max, Math.max(range.min, _value - Math.sign(event.deltaY) * range.step));
    if (range.nonZero && v === 0) v -= Math.sign(event.deltaY) * range.step;
    if (!_immProblem({ value: v, range })) set({ newValue: v });
  }, { passive: false });
  slider.value = String(_value);
  field.value = String(_value);
  readout.textContent = _hex({ value: _value });
  return _div({ class: 'imm-control' }, [slider, field, readout]);
}

function _controlFor({ token = 'rd', info = {}, memory = {}, onChange = () => {} }) {
  const key = token.replace("'", '');
  if (info.kind === 'reg') {
    const options = _registerOptions({ info });
    const remembered = memory[key];
    const fallback = DEFAULT_REGISTER[key] ?? 10;
    const value = options.some((o) => o.value === remembered) ? remembered : options.some((o) => o.value === fallback) ? fallback : options[0].value;
    memory[key] = value;
    return Carousel({ options, value, label: token, searchable: true, onChange: (v) => { memory[key] = v; onChange(); } });
  }
  if (info.kind === 'imm') {
    const value = memory.imm !== undefined && !_immProblem({ value: memory.imm, range: info.range }) ? memory.imm : _immDefault({ range: info.range });
    memory.imm = value;
    return _ImmediateControl({ token, range: info.range, value, onChange: (v) => { memory.imm = v; onChange(); } });
  }
  if (info.kind === 'csr') {
    const options = Object.keys(CSRS).map((name) => ({ value: name, label: name, hint: `0x${CSRS[name].toString(16).padStart(3, '0')}` }));
    const value = memory.csr in CSRS ? memory.csr : 'mstatus';
    memory.csr = value;
    return Carousel({ options, value, label: 'csr', searchable: true, onChange: (v) => { memory.csr = v; onChange(); } });
  }
  if (info.kind === 'rm') {
    const options = [7, 0, 1, 2, 3, 4].map((v) => ({ value: ROUNDING[v], label: ROUNDING[v], hint: v === 7 ? 'default (frm)' : `rm = ${v}` }));
    const value = memory.rm || 'dyn';
    memory.rm = value;
    return Carousel({ options, value, label: 'rounding mode', onChange: (v) => { memory.rm = v; onChange(); } });
  }
  // Fence predecessor / successor sets.
  const options = [];
  for (let v = 15; v >= 1; v--) options.push({ value: fenceText({ value: v }), label: fenceText({ value: v }) });
  const value = memory[key] || 'rw';
  memory[key] = value;
  return Carousel({ options, value, label: token, onChange: (v) => { memory[key] = v; onChange(); } });
}

function _valueText({ token = 'rd', info = {}, memory = {} }) {
  const key = token.replace("'", '');
  if (info.kind === 'sp') return 'sp';
  if (info.kind === 'reg') return (info.fp ? F_ABI : X_ABI)[memory[key]];
  if (info.kind === 'imm') return String(memory.imm);
  return String(memory[key]);
}

const ORDERINGS = [
  { value: '', label: '—', hint: 'no ordering' },
  { value: 'aq', label: '.aq', hint: 'acquire' },
  { value: 'rl', label: '.rl', hint: 'release' },
  { value: 'aqrl', label: '.aqrl', hint: 'sequentially consistent' },
];

function _hasOrdering({ entry = null }) {
  return Boolean(entry && !entry.pseudo && entry.segments.some((s) => s.key === 'aq'));
}

export function OperandPanel({ onChange = () => {} }) {
  const memory = {};
  let _entry = null;
  let _template = [];
  const panel = _div({ class: 'operand-panel' }, '');

  const emit = () => onChange(panel.read());

  panel.show = ({ entry = null }) => {
    _entry = entry;
    _template = entry ? (entry.asm || '').split(',').map((op) => op.trim()).filter((op) => op !== '') : [];
    const rows = [];
    for (const op of _template) {
      for (const part of templateParts({ op })) {
        if (!part.token) continue;
        const info = operandInfo({ entry, token: part.token });
        if (info.kind === 'sp') continue;
        rows.push(_div({ class: `operand-row operand-${info.kind}` }, [
          _span({ class: 'operand-name' }, part.token),
          _controlFor({ token: part.token, info, memory, onChange: emit }),
        ]));
      }
    }
    if (_hasOrdering({ entry })) {
      memory.ordering = memory.ordering || '';
      rows.push(_div({ class: 'operand-row operand-field' }, [
        _span({ class: 'operand-name' }, 'order'),
        Carousel({ options: ORDERINGS, value: memory.ordering, label: 'memory ordering', onChange: (v) => { memory.ordering = v; emit(); } }),
      ]));
    }
    if (entry && !rows.length) rows.push(_div({ class: 'operand-none' }, 'no operands'));
    if (!entry) rows.push(_div({ class: 'operand-none' }, 'choose a mnemonic'));
    panel.replaceChildren(...rows);
    emit();
  };

  // The operands as assembly text (what encodeEntry parses) and the memory ordering suffix.
  panel.read = () => {
    if (!_entry) return { entry: null, operands: null, ordering: '' };
    const operands = _template.map((op) => templateParts({ op })
      .map((part) => (part.token ? _valueText({ token: part.token, info: operandInfo({ entry: _entry, token: part.token }), memory }) : part.text))
      .join('')).join(', ');
    return { entry: _entry, operands, ordering: _hasOrdering({ entry: _entry }) ? memory.ordering || '' : '' };
  };

  return panel;
}
