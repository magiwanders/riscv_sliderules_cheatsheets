import { rv32, splitOperands, X_ABI, F_ABI, ROUNDING, fenceText } from '../src/isa/codec.mjs';

// Operand sets for every encodable entry, shared by the tests and the GNU as vector generator.
// Deterministic (seeded) so regenerated vectors line up with the cases the tests build.

export function rng({ seed = 1 }) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function _pick({ random, list = [] }) {
  return list[Math.floor(random() * list.length)];
}

function _registers({ info = {} }) {
  const regs = [];
  for (let n = 0; n < 32; n++) {
    if (info.compressed && (n < 8 || n > 15)) continue;
    if (!info.exclude.includes(n)) regs.push(n);
  }
  return regs;
}

function _valid({ value = 0, range = {} }) {
  return value >= range.min && value <= range.max && value % range.step === 0 && !(range.nonZero && value === 0);
}

// edge: 'min', 'max' or null (random).
function _immediate({ random, range = {}, edge = null }) {
  const lo = Math.ceil(range.min / range.step);
  const hi = Math.floor(range.max / range.step);
  let value = edge === 'min' ? lo * range.step : edge === 'max' ? hi * range.step : (lo + Math.floor(random() * (hi - lo + 1))) * range.step;
  if (!_valid({ value, range })) value = range.step;
  return value;
}

// Vector registers an assembler accepts together: groups that cannot overlap each other or the mask v0 (widening,
// gathers and masked instructions refuse overlaps), at multiples of 8 so whole groups of up to 8 registers fit.
const VECTOR = ['vd', 'vs1', 'vs2', 'vs3'];
const VECTOR_SAFE = [8, 16, 24];

// One operand text (and ordering) for an entry, as the encoder's operand panel would produce it. safe: vector registers
// that assemblers accept together (see VECTOR_SAFE); otherwise any the encoding allows.
export function operandSet({ codec = rv32, entry = {}, random, edge = null, safe = false }) {
  const { operandInfo, templateParts, tokenKey, operandText } = codec;
  const template = splitOperands({ text: entry.asm });
  const values = {};
  const omitted = new Set();
  // the text of each token as chosen; an optional part ({?...}) is written as the codec would, from the values
  const tokenText = {};
  const choose = (part, op) => (part.token ? (tokenText[part.token] = chooseToken(part, op)) : part.text);
  const render = (op, texts) => (op.includes('{?') ? templateParts({ op, values }).map((p) => (p.token ? tokenText[p.token] : p.text)).join('') : texts.join(''));
  const chooseToken = (part, op) => {
    const info = operandInfo({ entry, token: part.token });
    const key = tokenKey(part.token);
    if (info.kind === 'sp') return 'sp';
    if (info.kind === 'enum') {
      // two operands that must differ (cm.mvsa01's r1s and r2s)
      const other = entry.distinct && entry.distinct.includes(key) ? values[entry.distinct.find((k) => k !== key)] : undefined;
      const allowed = info.names.map((_, n) => n).filter((n) => !info.exclude.includes(n) && n !== other);
      const taken = VECTOR.map((k) => values[k]);
      const safeList = safe && VECTOR.includes(key) ? VECTOR_SAFE.filter((n) => allowed.includes(n) && !taken.includes(n)) : [];
      values[key] = _pick({ random, list: safeList.length ? safeList : allowed });
      // an operand at the value that leaves it out (unmasked) is not written
      if (info.omit !== undefined && values[key] === info.omit && op === part.token) {
        omitted.add(op);
        return '';
      }
      return info.names[values[key]];
    }
    if (info.kind === 'imm' && info.key) {
      values[key] = _immediate({ random, range: info.range, edge });
      return operandText({ key, value: values[key], fields: values, inst: entry });
    }
    if (info.kind === 'reg') {
      values[key] = _pick({ random, list: _registers({ info }) });
      return (info.fp ? F_ABI : X_ABI)[values[key]];
    }
    if (info.kind === 'imm') return String((values.imm = _immediate({ random, range: info.range, edge })));
    if (info.kind === 'csr') return _pick({ random, list: Object.keys(codec.csrs) });
    if (info.kind === 'rm') return _pick({ random, list: ROUNDING.filter(Boolean) });
    return fenceText({ value: 1 + Math.floor(random() * 15) });
  };
  const chosen = template.map((op) => templateParts({ op }).map((part) => choose(part, op)));
  const operands = template.map((op, i) => render(op, chosen[i])).filter((text, i) => !omitted.has(template[i]) && text !== '').join(', ');
  const hasOrdering = !entry.pseudo && entry.segments.some((s) => s.key === 'aq');
  const ordering = hasOrdering ? _pick({ random, list: ['', 'aq', 'rl', 'aqrl'] }) : '';
  return { operands, ordering, values };
}

// Every entry with a few random operand sets plus the immediate's range edges.
export function allCases({ codec = rv32, perEntry = 4, seed = 2026, safe = false } = {}) {
  const random = rng({ seed });
  const cases = [];
  for (const entry of codec.encodable) {
    const hasImm = /\bimm\b/.test(entry.asm || '') || (entry.segments || []).some((s) => s.kind === 'imm');
    const edges = hasImm ? [null, 'min', 'max'] : [null];
    const runs = entry.asm ? perEntry : 1;
    for (let i = 0; i < runs + edges.length - 1; i++) {
      const edge = i < runs ? null : edges[i - runs + 1];
      cases.push({ id: entry.id, entry, ...operandSet({ codec, entry, random, edge, safe }) });
    }
  }
  return cases;
}

// Every combination of the operands chosen from a list (registers, conditions, ...) of each instruction, the immediate at
// a random value: every opcode a set has, for the small sets whose assemblers check them all (the 8080).
export function everyEncoding({ codec, seed = 2026 }) {
  const random = rng({ seed });
  const cases = [];
  for (const entry of codec.encodable.filter((e) => !e.pseudo)) {
    let texts = [{ parts: [] }];
    for (const op of splitOperands({ text: entry.asm })) {
      let options = [''];
      for (const part of codec.templateParts({ op })) {
        if (!part.token) {
          options = options.map((o) => o + part.text);
          continue;
        }
        const info = codec.operandInfo({ entry, token: part.token });
        if (info.kind === 'enum') {
          options = options.flatMap((o) => info.names.map((name, n) => (info.exclude.includes(n) ? null : o + name)).filter((x) => x !== null));
        } else if (info.key) {
          const value = _immediate({ random, range: info.range });
          options = options.map((o) => o + codec.operandText({ key: info.key, value }));
        } else {
          // immediate bits in the opcode byte (the 8051's AJMP page) make opcodes of their own: each of their values
          const SPINE = codec.spec.spine.width;
          const opcodeBits = entry.segments.filter((s) => s.kind === 'imm' && s.lo >= SPINE - 8).flatMap((s) => s.immBits);
          const values = Array.from({ length: 2 ** opcodeBits.length }, (_, k) => opcodeBits.reduce((v, b, j) => (v & ~(2 ** b)) | (((k >> j) & 1) * 2 ** b), _immediate({ random, range: info.range })));
          const text = (value) => (codec.spec.immText ? codec.spec.immText({ inst: entry, value }) : String(value));
          options = options.flatMap((o) => values.map((value) => o + text(value)));
        }
      }
      texts = texts.flatMap((t) => options.map((o) => ({ parts: [...t.parts, o] })));
    }
    for (const { parts } of texts) cases.push({ id: entry.id, entry, operands: parts.join(codec.spec.separator ?? ', '), ordering: '' });
  }
  return cases;
}
