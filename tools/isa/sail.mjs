// Reads the encodings of the official Sail model (sail-riscv) without the Sail compiler: the `mapping clause encdec` /
// `encdec_compressed` clauses, the mapping tables they call (encdec_iop, width_enc, ...) and the `union clause
// instruction` declarations, then enumerates every instruction a configuration (xlen, extensions) has.
//
// Only the constructs the encoding clauses use are understood. Anything else (a guard calling a function this file does
// not know, a piece of an encoding of a new shape) throws, so a change in the model stops the generator instead of
// producing a wrong sheet.
import { readFileSync } from 'node:fs';

// ---------------------------------------------------------------- text

function _stripComments({ text = '' }) {
  return text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, '');
}

// Top-level items: a new one starts at every line that begins in column 0 (closing brackets continue the item).
function _items({ text = '' }) {
  const items = [];
  for (const line of text.split('\n')) {
    if (/^[^\s})\]]/.test(line)) items.push(line);
    else if (items.length) items[items.length - 1] += `\n${line}`;
  }
  return items.map((item) => item.trim()).filter(Boolean);
}

// Splits at a separator outside (), [], {} and strings. `separator` is a regex source matched at each position.
export function splitTop({ text = '', separator = ',' }) {
  const parts = [];
  const re = new RegExp(`^(?:${separator})`);
  let depth = 0;
  let quoted = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      current += c;
      if (c === '"' && text[i - 1] !== '\\') quoted = false;
      continue;
    }
    if (c === '"') quoted = true;
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) depth--;
    const m = depth === 0 && !quoted ? text.slice(i).match(re) : null;
    if (m && m[0].length) {
      parts.push(current);
      current = '';
      i += m[0].length - 1;
      continue;
    }
    current += c;
  }
  parts.push(current);
  return parts.map((p) => p.trim());
}

const _literalBits = (text) => {
  const t = text.replace(/_/g, '');
  if (/^0b[01]+$/.test(t)) return t.slice(2);
  if (/^0x[0-9a-fA-F]+$/.test(t)) return [...t.slice(2)].map((d) => parseInt(d, 16).toString(2).padStart(4, '0')).join('');
  return null;
};

// ---------------------------------------------------------------- reading the files

// { mappings, unions, clauses } of a set of .sail files.
export function readSail({ files = [] }) {
  const mappings = {};
  const unions = {};
  const clauses = [];
  for (const file of files) {
    for (const item of _items({ text: _stripComments({ text: readFileSync(file, 'utf8') }) })) {
      let m;
      if ((m = item.match(/^mapping\s+(\w+)\s*:\s*([^=]+?)\s*<->\s*([^=]+?)\s*=\s*\{([\s\S]*)\}$/))) {
        const entries = splitTop({ text: m[4] }).filter(Boolean).filter((e) => !/^(forwards|backwards)\b/.test(e))
          .map((e) => splitTop({ text: e, separator: '<->' }));
        mappings[m[1]] = { name: m[1], from: m[2].trim(), to: m[3].trim(), entries, file };
      } else if ((m = item.match(/^union\s+clause\s+instruction\s*=\s*(\w+)\s*:\s*([\s\S]+)$/))) {
        const types = m[2].trim() === 'unit' ? [] : splitTop({ text: m[2].trim().replace(/^\(([\s\S]*)\)$/, '$1') });
        unions[m[1]] = types;
      } else if ((m = item.match(/^mapping\s+clause\s+(encdec|encdec_compressed|assembly)\s*=\s*([\s\S]+)$/))) {
        const [left, right] = splitTop({ text: m[2], separator: '<->' });
        // assembly clauses written as forwards / backwards functions only print: their scales are not needed
        if (right === undefined && m[1] === 'assembly') continue;
        const [lhs, lhsGuard = null] = splitTop({ text: left, separator: '\\s+if\\s+' });
        let [rhs, when = null] = splitTop({ text: right, separator: '\\s+when\\s+' });
        const [concat, rhsGuard = null] = splitTop({ text: rhs, separator: '\\s+if\\s+' });
        const head = lhs.match(/^(\w+)\s*(?:\(([\s\S]*)\))?$/);
        if (!head) throw new Error(`${file}: cannot read clause "${lhs}"`);
        clauses.push({ kind: m[1], ctor: head[1], args: head[2] === undefined ? [] : splitTop({ text: head[2] }).filter(Boolean), lhsGuard, rhsGuard, when, rhs: concat, file });
      }
    }
  }
  return { mappings, unions, clauses };
}

// ---------------------------------------------------------------- guards

// The functions guards call, as the model defines them, for the configurations the sheets need (no Zfinx, Zdinx,
// Zacas, Zabha). Each mirrors its Sail definition; a guard calling anything else throws.
const _HELPERS = {
  haveSingleFPU: ({ config }) => config.extensions.has('F') || config.extensions.has('Zfinx'),
  haveDoubleFPU: ({ config }) => config.extensions.has('D') || config.extensions.has('Zdinx'),
  // dext_insts.sail: odd registers only matter for RV32 Zdinx
  validDoubleRegs: ({ config }) => !(config.extensions.has('Zdinx') && config.xlen === 32) || _unsupported('validDoubleRegs with Zdinx'),
  // fext_insts.sail
  float_load_store_width_supported: ({ config, args: [width] }) =>
    ({ 1: false, 2: config.extensions.has('Zfhmin') || config.extensions.has('Zfbfmin'), 4: config.extensions.has('F'), 8: config.extensions.has('D') })[width],
  // base_insts.sail
  valid_load_encdec: ({ config, args: [width, isUnsigned] }) => width < config.xlen / 8 || (!isUnsigned && width <= config.xlen / 8),
  // zalrsc_insts.sail
  lrsc_width_valid: ({ config, args: [width] }) => width === 4 || (width === 8 && config.xlen >= 64),
  // zaamo_insts.sail: without Zacas and Zabha, the AMOs other than AMOCAS of at least a word and at most xlen
  amo_encoding_valid: ({ config, args: [width, op] }) => {
    if (config.extensions.has('Zacas') || config.extensions.has('Zabha')) _unsupported('amo_encoding_valid with Zacas / Zabha');
    return op !== 'AMOCAS' && config.extensions.has('Zaamo') && width >= 4 && width <= config.xlen / 8;
  },
};

function _unsupported(what) {
  throw new Error(`Sail guard not supported: ${what}`);
}

// Tokens of a guard expression.
function _tokens({ text = '' }) {
  const tokens = [];
  const re = /\s*(0b[01_]+|0x[0-9a-fA-F_]+|\d+|[A-Za-z_][\w]*|==|!=|<=|>=|\.\.|[()[\],&|<>*+\-])/y;
  let m;
  let at = 0;
  while (at < text.length) {
    re.lastIndex = at;
    m = re.exec(text);
    if (!m) {
      if (!text.slice(at).trim()) break;
      throw new Error(`Sail guard: cannot read "${text.slice(at)}"`);
    }
    tokens.push(m[1]);
    at = re.lastIndex;
  }
  return tokens;
}

// A guard value is true, false, a number / enum name, a symbolic operand, or a list of constraints on operands (what
// must hold for the encoding to be this instruction: a register that is not x0, an immediate that is not zero, ...).
function _evaluate({ text = '', config, bindings = {} }) {
  const tokens = _tokens({ text });
  let at = 0;
  const peek = () => tokens[at];
  const take = (t) => {
    if (t !== undefined && tokens[at] !== t) throw new Error(`Sail guard "${text}": expected ${t}, found ${tokens[at]}`);
    return tokens[at++];
  };

  const and = (a, b) => {
    if (a === false || b === false) return false;
    if (a === true) return b;
    if (b === true) return a;
    return [...a, ...b];
  };
  const or = (a, b) => {
    if (a === true || b === true) return true;
    if (a === false) return b;
    if (b === false) return a;
    return _unsupported(`"${text}" (alternative constraints)`);
  };

  function compare(a, op, b) {
    const symbolic = (v) => v && typeof v === 'object' && v.sym;
    if (symbolic(a) || symbolic(b)) {
      const [s, v] = symbolic(a) ? [a, b] : [b, a];
      if (op === '!=' && s.bit === undefined && (v === 0 || v === 'zreg')) return [{ kind: 'nonzero', name: s.sym }];
      if (op === '!=' && s.bit === undefined && v === 'sp') return [{ kind: 'exclude', name: s.sym, value: 2 }];
      if (op === '!=' && s.bit === undefined && typeof v === 'number') return [{ kind: 'exclude', name: s.sym, value: v }];
      if (op === '==' && s.bit !== undefined && typeof v === 'number') return [{ kind: 'fixed', name: s.sym, bit: s.bit, value: v }];
      return _unsupported(`"${text}"`);
    }
    switch (op) {
      case '==': return a === b;
      case '!=': return a !== b;
      case '<': return a < b;
      case '<=': return a <= b;
      case '>': return a > b;
      case '>=': return a >= b;
      default: return _unsupported(op);
    }
  }

  function primary() {
    const t = take();
    if (t === '(') {
      const v = orExpr();
      take(')');
      return v;
    }
    if (/^0b|^0x/.test(t)) return parseInt(_literalBits(t), 2);
    if (/^\d+$/.test(t)) return Number(t);
    if (t === 'true' || t === 'false') return t === 'true';
    if (t === 'not') {
      take('(');
      const v = orExpr();
      take(')');
      if (typeof v !== 'boolean') return _unsupported(`not() of constraints in "${text}"`);
      return !v;
    }
    if (t === 'if') {
      const c = orExpr();
      take('then');
      const a = orExpr();
      take('else');
      const b = orExpr();
      if (typeof c !== 'boolean') return _unsupported(`if on constraints in "${text}"`);
      return c ? a : b;
    }
    if (peek() === '(') {
      take('(');
      const args = [];
      while (peek() !== ')') {
        args.push(orExpr());
        if (peek() === ',') take(',');
      }
      take(')');
      if (t === 'currentlyEnabled') return config.extensions.has(String(args[0]).replace(/^Ext_/, ''));
      if (t === 'zeros') return 0;
      if (!_HELPERS[t]) return _unsupported(`function ${t} in "${text}"`);
      return _HELPERS[t]({ config, args });
    }
    if (t === 'xlen') return config.xlen;
    if (t === 'xlen_bytes') return config.xlen / 8;
    if (t in bindings) {
      const v = bindings[t];
      if (peek() === '[') {
        take('[');
        const bit = Number(take());
        take(']');
        return typeof v === 'object' && v.sym ? { sym: v.sym, bit } : (v >> bit) & 1;
      }
      return v;
    }
    return t; // an enum name, zreg, sp, Ext_...
  }

  function cmpExpr() {
    const a = primary();
    if (['==', '!=', '<', '<=', '>', '>='].includes(peek())) {
      const op = take();
      return compare(a, op, primary());
    }
    return a;
  }

  function andExpr() {
    let v = cmpExpr();
    while (peek() === '&') {
      take('&');
      v = and(v, cmpExpr());
    }
    return v;
  }

  function orExpr() {
    let v = andExpr();
    while (peek() === '|') {
      take('|');
      v = or(v, andExpr());
    }
    return v;
  }

  const value = orExpr();
  if (at !== tokens.length) throw new Error(`Sail guard "${text}": unexpected ${tokens[at]}`);
  return value;
}

// ---------------------------------------------------------------- enumerating instructions

const REGISTER_MAPPINGS = { encdec_reg: 'x', encdec_creg: 'xc', encdec_freg: 'f', encdec_cfreg: 'fc' };
const REGISTER_TYPES = { regidx: 'x', cregidx: 'xc', fregidx: 'f', cfregidx: 'fc' };
const REGISTER_WIDTHS = { x: 5, xc: 3, f: 5, fc: 3 };
// Operands written as fields of their own on the sheets rather than enumerated or read as immediates.
const FIELD_MAPPINGS = { encdec_rounding_mode: 'rm' };
const FIELD_OPERANDS = ['aq', 'rl'];
// Which bits(n) operands are immediates (the others are fields): RISC-V's names, or the list a configuration gives.
const IMMEDIATE_NAME = /imm|shamt|offset/;

function _typeWidth({ type = '' }) {
  const m = type.match(/^bits\((\d+)\)$/);
  if (m) return Number(m[1]);
  if (type === 'csreg') return 12;
  return null;
}

// Values a mapping table maps from, with their bits.
function _table({ sail, name }) {
  const mapping = sail.mappings[name];
  if (!mapping) throw new Error(`Sail mapping ${name} not found`);
  return mapping.entries.map(([from, to]) => {
    const bits = _literalBits(to);
    if (bits === null) throw new Error(`Sail mapping ${name}: "${to}" is not a bit literal`);
    const value = /^\d+$/.test(from) ? Number(from) : from === 'true' ? true : from === 'false' ? false : from;
    return { value, bits };
  });
}

// One clause of a constructor with every enumerated operand fixed: the bits of the encoding from the msb down.
// A bit is { kind: 'lit', value } | { kind: 'reg', name, cls, bit } | { kind: 'imm', name, bit } (bit of the operand
// as the AST holds it) | { kind: 'field', name, bit }. `pieces` keeps the clause's own `@` pieces.
function _instances({ sail, clause, config }) {
  const isImmediate = (name) => (config.immediates ? config.immediates.includes(name) : IMMEDIATE_NAME.test(name));
  const types = sail.unions[clause.ctor];
  if (!types) throw new Error(`no union clause for ${clause.ctor}`);
  const operands = {};
  clause.args.forEach((arg, position) => {
    const type = types[position];
    const pieces = splitTop({ text: arg, separator: '@' });
    // an AST operand written with constant low bits, as in BTYPE(imm @ 0b0, ...): imm[k] is bit k + 1 of the offset
    if (pieces.length > 1) {
      const [name, ...rest] = pieces;
      const low = rest.map((p) => _literalBits(p));
      if (!/^\w+$/.test(name) || low.some((b) => b === null || /1/.test(b))) throw new Error(`${clause.ctor}: argument "${arg}" not understood`);
      operands[name] = { position, type, scale: low.join('').length };
      return;
    }
    if (_literalBits(arg) !== null) {
      operands[`#${position}`] = { position, type, literal: _literalBits(arg) };
      return;
    }
    if (arg === '_' || !/^\w+$/.test(arg)) throw new Error(`${clause.ctor}: argument "${arg}" not understood`);
    if (/^[A-Z][A-Z0-9_]*$/.test(arg) && !REGISTER_TYPES[type]) {
      operands[`#${position}`] = { position, type, value: arg };
      return;
    }
    operands[arg] = { position, type, scale: 0 };
  });

  // Pieces of the encoding, and which operands a mapping table enumerates.
  const pieces = splitTop({ text: clause.rhs, separator: '@' }).map((text) => {
    let m;
    const bits = _literalBits(text);
    if (bits !== null) return { kind: 'lit', bits };
    if ((m = text.match(/^(\w+)\s*\(\s*(\w+)\s*\)$/))) {
      const [, fn, name] = m;
      if (REGISTER_MAPPINGS[fn]) return { kind: 'reg', name, cls: REGISTER_MAPPINGS[fn], width: REGISTER_WIDTHS[REGISTER_MAPPINGS[fn]] };
      if (FIELD_MAPPINGS[fn]) return { kind: 'field', name: FIELD_MAPPINGS[fn], operand: name, width: 3 };
      if (fn === 'bool_bit' && FIELD_OPERANDS.includes(name)) return { kind: 'field', name, operand: name, width: 1 };
      return { kind: 'table', fn, name, table: _table({ sail, name: fn }) };
    }
    if ((m = text.match(/^(\w+)\[(\d+)(?:\.\.(\d+))?\]$/))) return { kind: 'slice', name: m[1], hi: Number(m[2]), lo: Number(m[3] ?? m[2]) };
    if ((m = text.match(/^(\w+)\s*:\s*(.+)$/))) {
      const width = _typeWidth({ type: m[2].trim() }) ?? (REGISTER_TYPES[m[2].trim()] ? REGISTER_WIDTHS[REGISTER_TYPES[m[2].trim()]] : null);
      if (width === null) throw new Error(`${clause.ctor}: piece "${text}" of unknown width`);
      return { kind: 'var', name: m[1], width };
    }
    if (/^\w+$/.test(text)) return { kind: 'var', name: text };
    throw new Error(`${clause.ctor}: piece "${text}" not understood`);
  });

  // Every combination of the values the tables enumerate.
  let combinations = [{}];
  for (const p of pieces.filter((p) => p.kind === 'table')) {
    combinations = combinations.flatMap((c) => (p.name in c ? [c] : p.table.map(({ value }) => ({ ...c, [p.name]: value }))));
  }

  const result = [];
  for (const values of combinations) {
    const bindings = { ...values };
    for (const name of Object.keys(operands).filter((n) => !n.startsWith('#') && !(n in values))) bindings[name] = { sym: name };
    let constraints = [];
    let valid = true;
    for (const guard of [clause.lhsGuard, clause.rhsGuard, clause.when].filter(Boolean)) {
      const v = _evaluate({ text: guard, config, bindings });
      if (v === false) valid = false;
      else if (Array.isArray(v)) constraints.push(...v);
      else if (v !== true) throw new Error(`${clause.ctor}: guard "${guard}" is ${v}`);
    }
    if (!valid) continue;
    const bits = [];
    const cuts = [];
    for (const p of pieces) {
      cuts.push(bits.length);
      if (p.kind === 'lit') for (const b of p.bits) bits.push({ kind: 'lit', value: Number(b) });
      else if (p.kind === 'table') {
        const entry = p.table.find((e) => e.value === values[p.name]);
        for (const b of entry.bits) bits.push({ kind: 'lit', value: Number(b), from: p.name });
      } else if (p.kind === 'reg') {
        for (let b = p.width - 1; b >= 0; b--) bits.push({ kind: 'reg', name: p.name, cls: p.cls, bit: b });
      } else if (p.kind === 'field') {
        for (let b = p.width - 1; b >= 0; b--) bits.push({ kind: 'field', name: p.name, bit: b });
      } else {
        const operand = operands[p.name];
        if (!operand) throw new Error(`${clause.ctor}: ${p.name} is not an argument`);
        const width = p.kind === 'var' ? p.width ?? _typeWidth({ type: operand.type }) - operand.scale : null;
        const [hi, lo] = p.kind === 'slice' ? [p.hi, p.lo] : [width - 1, 0];
        const cls = REGISTER_TYPES[operand.type];
        for (let b = hi; b >= lo; b--) {
          if (cls) bits.push({ kind: 'reg', name: p.name, cls, bit: b });
          else if (operand.type === 'csreg') bits.push({ kind: 'field', name: 'csr', bit: b });
          else if (isImmediate(p.name)) bits.push({ kind: 'imm', name: p.name, bit: b, scale: operand.scale });
          else bits.push({ kind: 'field', name: p.name, bit: b });
        }
      }
    }
    // Constraints fixing single bits (shamt[5] == 0 on RV32) make those bits literal.
    for (const c of constraints.filter((c) => c.kind === 'fixed')) {
      for (const b of bits.filter((b) => b.name === c.name && b.bit === c.bit)) Object.assign(b, { kind: 'lit', value: c.value, fixedOperand: c.name });
    }
    constraints = constraints.filter((c) => c.kind !== 'fixed');
    // what tells this clause's instruction apart: the constructor, or its enum arguments (C_INSTR(C_D_PLUS_1, ...))
    const literals = Object.keys(operands).filter((n) => n.startsWith('#') && operands[n].value).map((n) => operands[n].value);
    result.push({ ctor: clause.ctor, key: literals.length ? literals.join('_') : clause.ctor, values, compressed: clause.kind === 'encdec_compressed', width: bits.length, bits, cuts, constraints, operands, file: clause.file });
  }
  return result;
}

// How an operand is written in assembly when that differs from the AST: `hex_bits_7(uimm @ 0b00)` in the assembly
// clause of C_LW says the offset is uimm shifted left by 2. By argument position, as the names can differ.
function _assemblyScales({ sail, ctor }) {
  const scales = {};
  for (const clause of sail.clauses.filter((c) => c.kind === 'assembly' && c.ctor === ctor)) {
    clause.args.forEach((arg, position) => {
      if (!/^\w+$/.test(arg)) return;
      const m = clause.rhs.match(new RegExp(`\\b${arg}\\s*@\\s*(0b0+|0x0+)\\b`));
      if (m) scales[position] = _literalBits(m[1]).length;
    });
  }
  return scales;
}

// Every encoding the configuration { xlen, extensions, immediates } has, one per constructor and enumerated operand values.
// `exclude` lists constructors left out before their guards are read (privileged instructions, for one).
export function sailInstructions({ sail, config, exclude = [] }) {
  const instructions = [];
  for (const clause of sail.clauses.filter((c) => (c.kind === 'encdec' || c.kind === 'encdec_compressed') && !exclude.includes(c.ctor))) {
    const scales = _assemblyScales({ sail, ctor: clause.ctor });
    for (const inst of _instances({ sail, clause, config })) {
      for (const b of inst.bits.filter((b) => b.kind === 'imm')) {
        const extra = scales[inst.operands[b.name].position] || 0;
        b.value = b.bit + b.scale + extra; // the bit of the number as assembly writes it
      }
      instructions.push(inst);
    }
  }
  return instructions;
}
