import * as rv32gc from './rv32gc.mjs';

// Matching, decoding and encoding driven by the spec-notation encodings of an instruction set. Everything an instruction
// set is (a module such as rv32gc.mjs or z80.mjs) goes through createCodec, which returns the functions for that set.

const REG = /^(rd|rs1|rs2|rs3)('?)(?:\/(?:rd|rs1|rs2)'?)?(?:(!=|=)(\d+|\{[\d,]+\}))?$/;
// A constraint on a field: "!=0", "!={0,2}" (not these) or "={1,5}" (only these, of the field's values in `range`).
// range: the field's values, or a function giving them (built only for an "=" constraint: a 16 bit field has 65,536)
function _excluded({ op = null, list = '', range = [] }) {
  if (!op) return [];
  const values = list.replace(/[{}]/g, '').split(',').map(Number);
  return op === '!=' ? values : (typeof range === 'function' ? range() : range).filter((n) => !values.includes(n));
}
const _constraintLabel = (token) => token.replace(/!=\{?([\d,]+)\}?/, ' ≠ $1').replace(/=\{?([\d,]+)\}?/, ' ∈ $1').replace(/,/g, ', ');
const FIELDS = { aq: 1, rl: 1, rm: 3, pred: 4, succ: 4 };
const REGISTER_KEYS = ['rd', 'rs1', 'rs2', 'rs3', 'rs', 'rt'];

export const X_ABI = ['zero', 'ra', 'sp', 'gp', 'tp', 't0', 't1', 't2', 's0', 's1', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',
  's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 't3', 't4', 't5', 't6'];
export const F_ABI = ['ft0', 'ft1', 'ft2', 'ft3', 'ft4', 'ft5', 'ft6', 'ft7', 'fs0', 'fs1', 'fa0', 'fa1', 'fa2', 'fa3', 'fa4', 'fa5', 'fa6', 'fa7',
  'fs2', 'fs3', 'fs4', 'fs5', 'fs6', 'fs7', 'fs8', 'fs9', 'fs10', 'fs11', 'ft8', 'ft9', 'ft10', 'ft11'];
export const ROUNDING = ['rne', 'rtz', 'rdn', 'rup', 'rmm', '', '', 'dyn'];
export const CSRS = {
  fflags: 0x001, frm: 0x002, fcsr: 0x003,
  cycle: 0xc00, time: 0xc01, instret: 0xc02, cycleh: 0xc80, timeh: 0xc81, instreth: 0xc82,
  sstatus: 0x100, sie: 0x104, stvec: 0x105, scounteren: 0x106, sscratch: 0x140, sepc: 0x141, scause: 0x142, stval: 0x143, sip: 0x144, satp: 0x180,
  mvendorid: 0xf11, marchid: 0xf12, mimpid: 0xf13, mhartid: 0xf14,
  mstatus: 0x300, misa: 0x301, medeleg: 0x302, mideleg: 0x303, mie: 0x304, mtvec: 0x305, mcounteren: 0x306, mstatush: 0x310,
  mscratch: 0x340, mepc: 0x341, mcause: 0x342, mtval: 0x343, mip: 0x344,
  mcycle: 0xb00, minstret: 0xb02, mcycleh: 0xb80, minstreth: 0xb82,
};

// "nzuimm[5:4|9:6|2|3]" -> [[5,4],[9,8,7,6],[2],[3]]
function _immParts({ spec = '' }) {
  return spec.split('|').map((part) => {
    const [hi, lo = hi] = part.split(':').map(Number);
    const bits = [];
    for (let b = hi; b >= lo; b--) bits.push(b);
    return bits;
  });
}

function _field({ word = 0, hi = 0, lo = 0 }) {
  return (word >>> lo) & (2 ** (hi - lo + 1) - 1);
}

function _bits({ value = 0, width = 1 }) {
  return ((value >>> 0) & (2 ** width - 1)).toString(2).padStart(width, '0');
}

// Bit b of a word, a number or (on spines wider than 32 bits, x86) a BigInt.
export const bitOf = (word, b) => (typeof word === 'bigint' ? Number((word >> BigInt(b)) & 1n) : Math.floor(word / 2 ** b) % 2);

export function registerName({ number = 0, fp = false }) {
  return (fp ? F_ABI : X_ABI)[number];
}

export function fenceText({ value = 0 }) {
  return ['i', 'o', 'r', 'w'].filter((_, i) => (value >> (3 - i)) & 1).join('') || '0';
}

function _csrText({ value = 0, csrs = CSRS }) {
  return Object.keys(csrs).find((name) => csrs[name] === value) || `0x${value.toString(16)}`;
}

function _isFp({ inst = {}, key = 'rd' }) {
  return (inst.fregs || []).includes(key);
}

function _hi({ value = 0 }) {
  return ((value + 0x800) >> 12) & 0xfffff;
}

function _lo({ value = 0 }) {
  return (value - (((value + 0x800) >> 12) << 12)) | 0;
}

// Operands of an assembly template; commas inside parentheses or braces belong to the operand, as in "(zp,X)" or
// Zcmp's "{ra, s0-s1}".
export function splitOperands({ text = '' }) {
  const operands = [''];
  let depth = 0;
  for (const c of text) {
    if (c === ',' && depth === 0) {
      operands.push('');
      continue;
    }
    depth += c === '(' || c === '{' ? 1 : c === ')' || c === '}' ? -1 : 0;
    operands[operands.length - 1] += c;
  }
  return operands.map((op) => op.trim()).filter((op) => op !== '');
}

function _parseNumber({ text = '' }) {
  const t = text.trim().toLowerCase();
  const negative = t.startsWith('-');
  const body = negative || t.startsWith('+') ? t.slice(1) : t;
  if (!/^(0x[0-9a-f]+|\$[0-9a-f]+|0b[01]+|\d+)$/.test(body)) throw new Error(`"${text}" is not a number`);
  const value = body.startsWith('0b') ? parseInt(body.slice(2), 2) : body.startsWith('$') ? parseInt(body.slice(1), 16) : Number(body);
  return negative ? -value : value;
}

function _parseRegister({ text = '', fp = false }) {
  const t = text.trim().toLowerCase();
  const m = t.match(fp ? /^f(\d+)$/ : /^x(\d+)$/);
  if (m && Number(m[1]) < 32) return Number(m[1]);
  if (!fp && t === 'fp') return 8;
  const abi = (fp ? F_ABI : X_ABI).indexOf(t);
  if (abi < 0) throw new Error(`"${text}" is not a${fp ? ' floating-point' : 'n integer'} register`);
  return abi;
}

function _parseFence({ text = '' }) {
  const t = text.trim().toLowerCase();
  if (!/^[iorw]+$/.test(t)) return _parseNumber({ text: t });
  return ['i', 'o', 'r', 'w'].reduce((v, flag, i) => v | (t.includes(flag) ? 1 << (3 - i) : 0), 0);
}

const _escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The functions of one instruction set. What a set module exports (see CLAUDE.md, "Adding an instruction set"):
//   name, spine ({ width, title, bytes }), formats, sections, groups, instructions, extensions;
//   immediates: { name: signed } of the encodings' immediate names (name[hi:lo]; all of them are the operand `imm`);
//   operands: { token: { width, names, exclude, signed, text } }, operands that are not registers of the RISC-V kind;
//   csrs: { name: address } of the CSRs known by name (default CSRS, RV32's);
//   optional: pseudoInstructions, unusedOpcodes, labels and widths (of columns), separator, mnemonicGap, plainFormats,
//   repeatedNames, listedOrder, alwaysImmediateRow, decodeOrder, operandPattern, widthOf, note, immText, arrange,
//   parseAssembly.
// All positions are spine positions: bit 0 is the rightmost switch. With spine.bytes an instruction starts at the left
// (memory order, unused bytes on the right), otherwise at the right (inst[0] is position 0).
export function createCodec(spec) {
  const { formats, groups, instructions, spine } = spec;
  // the CSRs known by name: the set's own (RV64 has no cycleh), or RV32's
  const csrs = spec.csrs || CSRS;
  const SPINE = spine.width;
  // Words are numbers up to 32 bits, BigInts on wider spines (x86's instructions of up to 15 bytes): the spine's width is
  // the only parameter. W holds the few operations on them; values of fields and immediates stay numbers.
  const WIDE = SPINE > 32;
  const W = WIDE ? {
    zero: 0n,
    norm: (a) => BigInt.asUintN(SPINE, BigInt(a)),
    bits: (word, hi, lo) => Number((BigInt(word) >> BigInt(lo)) & ((1n << BigInt(hi - lo + 1)) - 1n)),
    bit: (word, b) => Number((BigInt(word) >> BigInt(b)) & 1n),
    place: (value, lo) => BigInt(value) << BigInt(lo),
    ones: (width, lo) => ((1n << BigInt(width)) - 1n) << BigInt(lo),
    or: (a, b) => a | b,
    and: (a, b) => a & b,
    xor: (a, b) => a ^ b,
  } : {
    zero: 0,
    norm: (a) => Number(a) >>> 0,
    bits: (word, hi, lo) => _field({ word, hi, lo }),
    bit: (word, b) => (word >>> b) & 1,
    place: (value, lo) => (value * 2 ** lo) >>> 0,
    ones: (width, lo) => ((2 ** width - 1) * 2 ** lo) >>> 0,
    or: (a, b) => (a | b) >>> 0,
    and: (a, b) => (a & b) >>> 0,
    xor: (a, b) => (a ^ b) >>> 0,
  };
  const pseudoInstructions = spec.pseudoInstructions || [];
  const OPERANDS = spec.operands || {};
  const immediates = spec.immediates;
  const IMM = new RegExp(`^(${[...Object.keys(immediates), 'csr'].join('|')})\\[([\\d:|]+)\\]$`);
  const tokens = [...Object.keys(immediates), ...Object.keys(OPERANDS)].sort((a, b) => b.length - a.length);
  // Operand tokens inside an assembly template such as "rd, imm(rs1)". Longer names first.
  const OPERAND = spec.operandPattern || new RegExp(tokens.join('|'), 'g');

  // Where an instruction of a width sits on the spine.
  const lsbOf = ({ width = SPINE }) => (spine.bytes ? SPINE - width : 0);
  const tokenKey = (token) => (token in immediates ? 'imm' : token.replace("'", ''));

  // Bit range of a format field ([name, hi, lo, role]) containing a given bit.
  function _layoutRole({ format = 'R', bit = 0 }) {
    const slot = (formats[format].layout || []).find(([, hi, lo]) => bit <= hi && bit >= lo);
    return slot ? slot[3] : 'funct';
  }

  // Turns an encoding string into positioned segments (one per table cell).
  function parseEncoding({ enc = '', format = 'R' }) {
    const segments = [];
    for (const token of enc.trim().split(/\s+/)) {
      let m;
      // an operand split over several cells, as a split immediate (Thumb's rd[3] ... rd[2:0], i:imm3:imm8)
      const split = token.match(/^(\w+)\[([\d:|]+)\](?:(!=|=)(\d+|\{[\d,]+\}))?$/);
      if (split && OPERANDS[split[1]] && !(split[1] in immediates)) {
        const { width, exclude = [], names } = OPERANDS[split[1]];
        const own = _excluded({ op: split[3], list: split[4], range: () => Array.from({ length: 2 ** width }, (_, n) => n) });
        _immParts({ spec: split[2] }).forEach((fieldBits, part) => segments.push({ kind: 'field', key: split[1], part, fieldBits, split: true, width: fieldBits.length,
          label: `${split[1]}[${fieldBits.length === 1 ? fieldBits[0] : `${fieldBits[0]}:${fieldBits[fieldBits.length - 1]}`}]`, exclude: own.length ? [...new Set([...exclude, ...own])] : exclude, numeric: !names }));
        continue;
      }
      const op = token.match(/^(\w+)(?:(!=|=)(\d+|\{[\d,]+\}))?$/);
      if (op && OPERANDS[op[1]]) {
        // an operand of the set's own, possibly with a constraint of this instruction (vd!={0,1})
        const { width, exclude = [], names } = OPERANDS[op[1]];
        const own = _excluded({ op: op[2], list: op[3], range: () => Array.from({ length: 2 ** width }, (_, n) => n) });
        segments.push({ kind: 'field', key: op[1], label: _constraintLabel(token), width, exclude: own.length ? [...new Set([...exclude, ...own])] : exclude, numeric: !names });
      } else if (/^[01]+$/.test(token)) {
        segments.push({ kind: 'lit', label: token, width: token.length, bits: token });
      } else if (/^-+$/.test(token)) {
        segments.push({ kind: 'any', label: '–', width: token.length });
      } else if ((m = token.match(REG))) {
        // register numbers: x8-x15 for a compressed field
        const range = Array.from({ length: m[2] ? 8 : 32 }, (_, n) => (m[2] ? n + 8 : n));
        const exclude = _excluded({ op: m[3], list: m[4], range });
        segments.push({ kind: 'reg', key: m[1], compressed: m[2] === "'", width: m[2] ? 3 : 5, exclude, label: _constraintLabel(token) });
      } else if ((m = token.match(IMM))) {
        if (m[1] === 'csr') {
          segments.push({ kind: 'field', key: 'csr', label: token, width: 12 });
          continue;
        }
        _immParts({ spec: m[2] }).forEach((immBits, part) =>
          segments.push({ kind: 'imm', key: 'imm', name: m[1], part, immBits, width: immBits.length,
            label: immBits.length === 1 ? `${immBits[0]}` : `${immBits[0]}:${immBits[immBits.length - 1]}` }));
      } else if (FIELDS[token]) {
        segments.push({ kind: 'field', key: token, label: token, width: FIELDS[token] });
      } else {
        throw new Error(`Unknown encoding token "${token}" in "${enc}"`);
      }
    }
    const width = segments.reduce((sum, s) => sum + s.width, 0);
    const lsb = lsbOf({ width });
    let bit = width + lsb;
    for (const s of segments) {
      s.hi = bit - 1;
      s.lo = bit - s.width;
      bit = s.lo;
      if (s.kind === 'lit') s.role = _layoutRole({ format, bit: s.hi - lsb });
    }
    return { width, segments };
  }

  // Bit order used to sort the decoder (by default from the first bit of the instruction on).
  function _decodeOrder({ width = SPINE }) {
    if (spec.decodeOrder) return spec.decodeOrder[width];
    return Array.from({ length: width }, (_, i) => SPINE - 1 - i - (spine.bytes ? 0 : SPINE - width));
  }

  // Pre-compute everything per instruction once.
  const compiled = instructions.map((inst, index) => {
    const group = groups[inst.group];
    const { width, segments } = parseEncoding({ enc: inst.enc, format: group.format });
    if (formats[group.format].width && width !== formats[group.format].width) throw new Error(`${inst.name}: encoding is ${width} bits`);
    let mask = W.zero;
    let match = W.zero;
    for (const s of segments.filter((s) => s.kind === 'lit')) {
      mask = W.or(mask, W.ones(s.width, s.lo));
      match = W.or(match, W.place(parseInt(s.bits, 2), s.lo));
    }
    const imm = segments.filter((s) => s.kind === 'imm');
    const immMsb = imm.length ? Math.max(...imm.flatMap((s) => s.immBits)) : -1;
    // each bit: its literal value, 2 where it is not fixed (read from the segments: no word operations per bit)
    const fixed = [];
    for (const s of segments) if (s.kind === 'lit') for (let j = 0; j < s.width; j++) fixed[s.hi - j] = s.bits[j];
    const sortKey = _decodeOrder({ width }).map((b) => fixed[b] ?? '2').join('');
    const id = inst.reserved || inst.hint ? `${inst.name}@${inst.group}#${index}` : spec.repeatedNames ? `${inst.name} ${inst.asm}`.trim() : inst.name;
    return {
      ...group, ...inst, id, groupKey: inst.group, width, lsb: lsbOf({ width }), segments, mask, match, sortKey,
      literalCount: segments.filter((s) => s.kind === 'lit').reduce((n, s) => n + s.width, 0),
      immName: imm.length ? imm[0].name : null, immMsb, immRow: imm.length > (spec.alwaysImmediateRow ? 0 : 1),
      immSigned: imm.length > 0 && immediates[imm[0].name], immNonZero: imm.length > 0 && (imm[0].name.startsWith('nz') || Boolean(inst.nonZeroImm)),
    };
  });
  // the same line in two lengths (x86 jmp rel8 / rel16): the longer one's id says its width
  const shortest = new Map();
  for (const inst of compiled) shortest.set(inst.id, Math.min(shortest.get(inst.id) ?? Infinity, inst.width));
  for (const inst of compiled) if (inst.width > shortest.get(inst.id)) inst.id = `${inst.id}@${inst.width}`;

  // Most specific encodings first, so reserved/special patterns win over generic ones.
  const _byPriority = [...compiled].sort((a, b) => b.literalCount - a.literalCount);

  function _immValue({ inst = {}, word = 0 }) {
    let value = 0;
    for (const s of inst.segments.filter((s) => s.kind === 'imm')) {
      s.immBits.forEach((immBit, j) => { value += W.bit(word, s.hi - j) * 2 ** immBit; });
    }
    if (inst.immSigned && value >= 2 ** inst.immMsb) value -= 2 ** (inst.immMsb + 1);
    return value;
  }

  // Valid assembly values of an instruction's immediate.
  function immRange({ inst = {} }) {
    const used = inst.segments.filter((s) => s.kind === 'imm').flatMap((s) => s.immBits);
    const step = 2 ** Math.min(...used);
    const msb = inst.immMsb;
    if (inst.asmShift) {
      if (msb === 31) return { min: 0, max: 0xfffff, step: 1, nonZero: false };
      const top = msb - inst.asmShift;
      return { min: -(2 ** top), max: 2 ** top - 1, step: 1, nonZero: inst.immNonZero };
    }
    // immMin / immMax: a floor / ceiling of the range (cm.jalt's index from 32, below it is cm.jt; A64's SPSel is one bit)
    const min = inst.immSigned ? -(2 ** msb) : Math.max(0, inst.immMin ?? 0);
    const max = inst.immSigned ? 2 ** msb - step : 2 ** (msb + 1) - step;
    return { min, max: Math.min(max, inst.immMax ?? max), step, nonZero: inst.immNonZero };
  }

  // distinct: two fields that cannot hold the same value (cm.mvsa01's r1s and r2s); value of a field of a word
  const _fieldValue = ({ inst = {}, key = '', word = 0 }) => {
    const segments = inst.segments.filter((x) => x.key === key && (x.kind === 'field' || x.kind === 'reg'));
    if (!segments.some((s) => s.split)) return W.bits(word, segments[0].hi, segments[0].lo);
    // a split field: its parts' bits
    let value = 0;
    for (const s of segments) s.fieldBits.forEach((b, j) => { value += W.bit(word, s.hi - j) * 2 ** b; });
    return value;
  };
  const _sameDistinct = ({ inst = {}, word = 0 }) => Boolean(inst.distinct) && _fieldValue({ inst, key: inst.distinct[0], word }) === _fieldValue({ inst, key: inst.distinct[1], word });

  function _satisfiesFieldConstraints({ inst = {}, word = 0 }) {
    for (const s of inst.segments) {
      const value = s.split ? _fieldValue({ inst, key: s.key, word }) : W.bits(word, s.hi, s.lo) + (s.compressed ? 8 : 0);
      if (s.exclude && s.exclude.includes(value)) return false;
    }
    if (_sameDistinct({ inst, word })) return false;
    return !(inst.immNonZero && _immValue({ inst, word }) === 0);
  }

  // constraints: one entry per spine position, index 0 = the leftmost, each '-', '0' or '1'.
  function matchesConstraints({ inst = {}, constraints = [] }) {
    let known = W.zero;
    let value = W.zero;
    for (let bit = inst.lsb; bit < inst.lsb + inst.width; bit++) {
      const c = constraints[SPINE - 1 - bit];
      if (c === '-') continue;
      known = W.or(known, W.place(1, bit));
      value = W.or(value, W.place(Number(c), bit));
    }
    if (W.and(W.and(W.xor(value, inst.match), inst.mask), known) != W.zero) return false;
    // Field constraints (rd != 0, nzimm) can only be checked once every bit of the field is known.
    for (const s of inst.segments) {
      if (!s.exclude || !s.exclude.length) continue;
      // a split field is checked once all its parts are known
      const parts = s.split ? inst.segments.filter((x) => x.key === s.key) : [s];
      const fieldMask = parts.reduce((m, x) => W.or(m, W.ones(x.width, x.lo)), W.zero);
      const v = s.split ? _fieldValue({ inst, key: s.key, word: value }) : W.bits(value, s.hi, s.lo) + (s.compressed ? 8 : 0);
      if (W.and(known, fieldMask) === fieldMask && s.exclude.includes(v)) return false;
    }
    if (inst.distinct) {
      const both = inst.segments.filter((s) => inst.distinct.includes(s.key)).reduce((m, s) => W.or(m, W.ones(s.width, s.lo)), W.zero);
      if (W.and(known, both) === both && _sameDistinct({ inst, word: value })) return false;
    }
    if (inst.immNonZero) {
      const immMask = inst.segments.filter((s) => s.kind === 'imm').reduce((m, s) => W.or(m, W.ones(s.width, s.lo)), W.zero);
      if (W.and(known, immMask) === immMask && W.and(value, immMask) == W.zero) return false;
    }
    return true;
  }

  // Reads every operand out of an instruction word.
  function extractFields({ inst = {}, word = 0 }) {
    const fields = {};
    for (const s of inst.segments) {
      if (s.kind === 'reg') fields[s.key] = W.bits(word, s.hi, s.lo) + (s.compressed ? 8 : 0);
      else if (s.kind === 'field') {
        const value = s.split ? _fieldValue({ inst, key: s.key, word }) : W.bits(word, s.hi, s.lo);
        const width = s.split ? OPERANDS[s.key].width : s.width;
        fields[s.key] = OPERANDS[s.key] && OPERANDS[s.key].signed && value >= 2 ** (width - 1) ? value - 2 ** width : value;
      }
    }
    if (inst.immName) fields.imm = _immValue({ inst, word });
    return fields;
  }

  // The assembly of an instruction as tokens, so the UI can colour each operand. A field set to null is not known
  // yet (partial decoding) and shows as its placeholder name.
  function assemblyParts({ inst = {}, fields = {}, arranged = true }) {
    let mnemonic = inst.name;
    if (fields.aq || fields.rl) mnemonic += '.' + (fields.aq ? 'aq' : '') + (fields.rl ? 'rl' : '');
    const parts = [{ kind: 'mnemonic', text: mnemonic, known: true }];
    // an optional part ({?...}) whose operands are all at their omit value is not written; unknown ones (null) are
    const known = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null && v !== undefined));
    const { tail, ops } = templateOperands({ entry: inst });
    const operands = ops.filter((op) => !(op === 'rm' && fields.rm === 7) && !isOmitted({ key: op, value: fields[op] }))
      .map((op) => templateParts({ op, values: known })).filter((opParts) => opParts.length);
    // the mnemonic's tail (A32's {s}{cond}) glued to it
    const groups = [...(tail !== null ? [{ tail: true, opParts: templateParts({ op: tail, values: known }) }] : []), ...operands.map((opParts) => ({ opParts }))];
    let index = 0;
    for (const { tail: isTail, opParts } of groups) {
      if (!isTail) parts.push({ kind: 'punct', text: index++ === 0 ? ' ' : spec.separator ?? ', ' });
      for (const part of opParts) {
        if (!part.token) {
          parts.push({ kind: 'punct', text: part.text, tail: isTail });
          continue;
        }
        const key = tokenKey(part.token);
        if (key === 'sp') {
          parts.push({ kind: 'reg', key, text: 'sp', known: true });
          continue;
        }
        // a derived operand (ldrd's second register) follows from the others
        const value = OPERANDS[key] && OPERANDS[key].derive ? OPERANDS[key].derive({ fields: known }) : fields[key];
        if (value === null || value === undefined) {
          parts.push({ kind: _tokenKind({ key }), key, text: part.token, known: false, tail: isTail });
          continue;
        }
        let text;
        if (OPERANDS[key]) text = operandText({ key, value, fields, inst });
        else if (key === 'imm' && spec.immText) text = spec.immText({ inst, value });
        else if (key === 'imm') text = String(inst.asmShift ? `0x${((value >>> inst.asmShift) & (2 ** (32 - inst.asmShift) - 1)).toString(16)}` : value);
        else if (key === 'csr') text = _csrText({ value, csrs });
        else if (key === 'rm') text = ROUNDING[value] || `rm${value}`;
        else if (key === 'pred' || key === 'succ') text = fenceText({ value });
        else text = registerName({ number: value, fp: _isFp({ inst, key }) });
        parts.push({ kind: _tokenKind({ key }), key, text, known: true, tail: isTail });
      }
    }
    return arranged && spec.arrange ? spec.arrange({ parts }) : parts;
  }

  // The operands alone, as the Operands columns show them.
  function operandsText({ inst = {}, fields = {} }) {
    return assemblyParts({ inst, fields, arranged: false }).slice(1).filter((p) => !p.tail).map((p) => p.text).join('').trim();
  }

  // An operand of the instruction set's own (not a RISC-V register, csr, ...) as assembly text.
  // fields, inst: the instruction's other operands, for an operand whose text depends on them (Zcmp's stack adjustment).
  function operandText({ key = '', value = 0, fields = {}, inst = {} }) {
    const operand = OPERANDS[key];
    // a text of its own first (A32's ror #0 is rrx), then the names
    if (operand.text) return operand.text({ value, fields, inst });
    return operand.names ? operand.names[value] : String(value);
  }

  // An operand left out of the assembly at this value (vm: an unmasked instruction has no mask operand).
  function isOmitted({ key = '', value = null }) {
    return Boolean(OPERANDS[key]) && OPERANDS[key].omit !== undefined && value === OPERANDS[key].omit;
  }

  function _tokenKind({ key = 'rd' }) {
    if (OPERANDS[key]) return OPERANDS[key].names ? 'reg' : 'imm';
    if (key === 'imm') return 'imm';
    if (['csr', 'rm', 'pred', 'succ'].includes(key)) return 'field';
    return 'reg';
  }

  function formatAssembly({ inst = {}, fields = {} }) {
    return assemblyParts({ inst, fields }).map((p) => p.text).join('');
  }

  // Bits of an instruction word covered by an operand (all its segments), for highlighting.
  function fieldMask({ inst = {}, key = 'rd' }) {
    return inst.segments.filter((s) => s.key === key).reduce((m, s) => W.or(m, W.ones(s.width, s.lo)), W.zero);
  }

  // Decoding while bits are still being set: the instructions the known bits allow and, when they all are the same
  // instruction, its operands as far as their bits are known (null otherwise).
  function partialDecode({ constraints = [] }) {
    const candidates = compiled.filter((i) => !i.reserved && !i.hint && matchesConstraints({ inst: i, constraints }));
    const names = [...new Set(candidates.map((i) => i.name))];
    if (candidates.length !== 1) return { candidates, names, inst: null, fields: null };
    const inst = candidates[0];
    let known = W.zero;
    let value = W.zero;
    for (let bit = inst.lsb; bit < inst.lsb + inst.width; bit++) {
      const c = constraints[SPINE - 1 - bit];
      if (c === '-') continue;
      known = W.or(known, W.place(1, bit));
      value = W.or(value, W.place(Number(c), bit));
    }
    const full = extractFields({ inst, word: value });
    const fields = {};
    for (const key of Object.keys(full)) {
      const mask = fieldMask({ inst, key });
      fields[key] = W.and(known, mask) === mask ? full[key] : null;
    }
    return { candidates, names, inst, fields };
  }

  // The width of the instruction the known bits belong to, null while they do not tell yet.
  function knownWidth({ constraints = [] }) {
    if (spec.widthOf) return spec.widthOf({ bit: (b) => constraints[SPINE - 1 - b] });
    const widths = new Set(compiled.filter((i) => matchesConstraints({ inst: i, constraints })).map((i) => i.width));
    return widths.size === 1 ? [...widths][0] : null;
  }

  // The word under the switches, once every bit of the instruction is set.
  function selectedWord({ constraints = [] }) {
    const width = knownWidth({ constraints });
    if (width === null) return null;
    const lsb = lsbOf({ width });
    let word = W.zero;
    for (let b = lsb; b < lsb + width; b++) {
      const c = constraints[SPINE - 1 - b];
      if (c === '-') return null;
      word = W.or(word, W.place(Number(c), b));
    }
    return { word, width };
  }

  function missingBits({ inst = {}, constraints = [] }) {
    return constraints.filter((c, i) => c === '-' && SPINE - 1 - i >= inst.lsb && SPINE - 1 - i < inst.lsb + inst.width).length;
  }

  // Decodes a word in spine positions. Returns null if nothing matches.
  // A byte machine's rows by the first byte they can start with, in priority order (x86-64 has thousands of rows: a word
  // is compared with the few that start as it does); others try them all.
  let _byFirstByte = null;
  function _candidatesOf(word) {
    if (!spine.bytes || compiled.length < 512) return _byPriority;
    if (!_byFirstByte) {
      _byFirstByte = Array.from({ length: 256 }, () => []);
      for (const inst of _byPriority) {
        const mask = W.bits(inst.mask, SPINE - 1, SPINE - 8);
        const match = W.bits(inst.match, SPINE - 1, SPINE - 8);
        for (let b = 0; b < 256; b++) if ((b & mask) === match) _byFirstByte[b].push(inst);
      }
    }
    return _byFirstByte[W.bits(word, SPINE - 1, SPINE - 8)];
  }

  function decodeWord({ word = 0 }) {
    word = W.norm(word);
    const width = spec.widthOf ? spec.widthOf({ bit: (b) => String(W.bit(word, b)) }) : null;
    if (width && !spine.bytes && width < SPINE) word = W.and(word, W.ones(width, 0));
    for (const inst of _candidatesOf(word)) {
      if (width && inst.width !== width) continue;
      if (W.and(word, inst.mask) !== inst.match) continue;
      if (!_satisfiesFieldConstraints({ inst, word })) continue;
      const fields = extractFields({ inst, word });
      if (inst.reserved || inst.hint) return { inst, word, fields, assembly: inst.description };
      const note = spec.note ? spec.note({ inst, fields, word }) : '';
      return { inst, word, fields, assembly: formatAssembly({ inst, fields }), note };
    }
    return null;
  }

  // Unused major opcodes, positioned for the decoder like instructions.
  const unusedOpcodeRows = (spec.unusedOpcodes || []).map((u) => {
    const match = parseInt(u.opcode, 2);
    return { ...u, match, mask: 0x7f, width: 32, sortKey: _decodeOrder({ width: 32 }).map((b) => (b < 7 ? (match >>> b) & 1 : 2)).join('') };
  });

  function unusedOpcode({ word = 0 }) {
    return unusedOpcodeRows.find((u) => ((word >>> 0) & 0x7f) === u.match) || null;
  }

  // ---------------------------------------------------------------- pseudo-instructions

  // Encoding of a pseudo-instruction expansion: fixed operands become literal bits.
  function _pseudoSegments({ base = {}, mapping = {} }) {
    return base.segments.map((s) => {
      const m = mapping[s.key];
      if (typeof m === 'number' && s.kind === 'imm') {
        const bits = s.immBits.map((immBit) => (m >> immBit) & 1).join('');
        return { ...s, kind: 'lit', bits, role: 'fixed' };
      }
      if (typeof m === 'number' && s.split) return { ...s, kind: 'lit', bits: s.fieldBits.map((b) => (m >> b) & 1).join(''), role: 'fixed' };
      if (typeof m === 'number' && (s.kind === 'reg' || s.kind === 'field')) {
        return { ...s, kind: 'lit', bits: _bits({ value: s.compressed ? m - 8 : m, width: s.width }), role: 'fixed' };
      }
      if (typeof m === 'string' && s.kind === 'reg') return { ...s, label: m };
      return s;
    });
  }

  function _expansionText({ base = {}, mapping = {} }) {
    const operands = (base.asm || '').replace(OPERAND, (token) => {
      const key = tokenKey(token);
      const m = mapping[key];
      if (m === 'hi') return 'imm[31:12]';
      if (m === 'lo') return 'imm[11:0]';
      if (typeof m === 'string') return m;
      if (typeof m !== 'number') return token;
      if (key === 'imm') return String(m);
      if (key === 'csr') return _csrText({ value: m, csrs });
      if (key === 'pred' || key === 'succ') return fenceText({ value: m });
      return `x${m}`;
    });
    return `${base.name}${spec.mnemonicGap ?? ' '}${operands}`.trim();
  }

  function _expansions({ expands = [] }) {
    return expands.map(([baseName, mapping]) => {
      const base = compiled.find((i) => i.name === baseName && !i.reserved && !i.hint);
      return { base, mapping, segments: _pseudoSegments({ base, mapping }), text: _expansionText({ base, mapping }) };
    });
  }

  const pseudos = pseudoInstructions.map((p, index) => {
    const expansions = _expansions({ expands: p.expands });
    const { width, lsb } = expansions[0].base;
    return { ...p, id: `${p.name}#pseudo${index}`, pseudo: true, extension: 'PSEUDO', width, lsb, expansions,
      shortExpansions: p.short ? _expansions({ expands: p.short }) : null,
      format: expansions.length === 1 ? expansions[0].base.format : '/' };
  });

  // Everything the encoder can produce, in alphabetical order (real instruction before its pseudo twin) unless the set
  // says its own order reads better.
  const encodable = [...compiled.filter((i) => !i.reserved && !i.hint), ...pseudos];
  const collator = new Intl.Collator();
  if (!spec.listedOrder) encodable.sort((a, b) => collator.compare(a.name, b.name) || Number(Boolean(a.pseudo)) - Number(Boolean(b.pseudo)));

  // What a template operand token of an entry accepts (used by the dropdown builder and the parser).
  function operandInfo({ entry = {}, token = 'rd' }) {
    const key = tokenKey(token);
    if (OPERANDS[key] && OPERANDS[key].derive) return { kind: 'derived', key };
    if (OPERANDS[key]) {
      const { names, exclude = [], width, signed = false, omit, step = 1 } = OPERANDS[key];
      // the instruction's own constraint on the operand too (vd!={...})
      const parts = (entry.segments || []).filter((s) => s.key === key);
      const excluded = [...new Set([...exclude, ...parts.flatMap((s) => s.exclude || [])])];
      // a split operand whose parts hold only some of its bits (x86-64 without REX: r8-r15 need the fourth bit)
      if (parts.some((s) => s.split) && names) {
        const held = parts.flatMap((s) => s.fieldBits);
        names.forEach((_, n) => { for (let b = 0; 2 ** b <= n; b++) if (Math.floor(n / 2 ** b) & 1 && !held.includes(b) && !excluded.includes(n)) { excluded.push(n); break; } });
      }
      if (names) return { kind: 'enum', key, names, exclude: excluded, omit };
      // a number up to the largest value it is not excluded from (aes64ks1i's rnum: 0 to 0xA)
      let top = 2 ** width - 1;
      while (!signed && excluded.includes(top)) top--;
      const range = signed ? { min: -(2 ** (width - 1)), max: 2 ** (width - 1) - 1 } : { min: 0, max: top };
      // step: values a field takes (Thumb's blx offsets are a multiple of 4, its raw field even)
      return { kind: 'imm', key, range: { ...range, step, nonZero: false } };
    }
    if (key === 'sp') return { kind: 'sp' };
    const targets = entry.pseudo
      ? entry.expansions.flatMap(({ base, mapping }) =>
        [...new Set(base.segments.map((s) => s.key).filter(Boolean))]
          .filter((k) => mapping[k] === key || (mapping[k] === undefined && k === key) || (key === 'imm' && k === 'imm' && ['hi', 'lo'].includes(mapping.imm)))
          .map((k) => ({ inst: base, k, split: k === 'imm' && ['hi', 'lo'].includes(mapping.imm) })))
      : [{ inst: entry, k: key, split: false }];
    const { inst, k, split } = targets[0] || { inst: entry, k: key, split: false };
    if (k === 'imm') return split ? { kind: 'imm', range: { min: -(2 ** 31), max: 2 ** 31 - 1, step: 1, nonZero: false } } : { kind: 'imm', range: immRange({ inst }) };
    if (k === 'csr') return { kind: 'csr' };
    if (k === 'rm') return { kind: 'rm', optional: true };
    if (k === 'pred' || k === 'succ') return { kind: 'fence' };
    const segment = inst.segments.find((s) => s.kind === 'reg' && s.key === k);
    return { kind: 'reg', fp: _isFp({ inst, key: k }), compressed: Boolean(segment && segment.compressed), exclude: segment ? segment.exclude : [] };
  }

  // Splits a template operand such as "imm(rs1')" into literal text and operand tokens. A part in {?...} is optional
  // (A64's "xm{?, shift #amount}", "{?xn}"): with `values`, it is left out when every operand in it is at its omit
  // value, otherwise written without the braces; without values, all of it is listed. markers: keep { open } and
  // { close } parts where an optional part starts and ends (for the parser).
  function templateParts({ op = '', values = null, markers = false }) {
    const parts = [];
    for (const piece of op.split(/(\{\?|\})/)) {
      if (piece === '{?') {
        parts.push({ open: true });
        continue;
      }
      if (piece === '}' && parts.some((p) => p.open) && parts.filter((p) => p.open).length > parts.filter((p) => p.close).length) {
        parts.push({ close: true });
        continue;
      }
      let last = 0;
      for (const m of piece.matchAll(OPERAND)) {
        if (m.index > last) parts.push({ text: piece.slice(last, m.index) });
        parts.push({ token: m[0] });
        last = m.index + m[0].length;
      }
      if (last < piece.length) parts.push({ text: piece.slice(last) });
    }
    if (markers) return parts;
    const out = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].close) continue;
      if (!parts[i].open) {
        out.push(parts[i]);
        continue;
      }
      const end = parts.findIndex((p, j) => j > i && p.close);
      const inside = parts.slice(i + 1, end);
      const omitted = values && inside.filter((p) => p.token).every((p) => {
        const key = tokenKey(p.token);
        return OPERANDS[key] && OPERANDS[key].omit !== undefined && values[key] === OPERANDS[key].omit;
      });
      if (!omitted) out.push(...inside);
      i = end;
    }
    return out;
  }

  // An entry's assembly template as the sheets show it: optional parts in braces, as Arm writes them ("{, sh}").
  const templateText = ({ entry = {} }) => (entry.asm || '').replace(/^~\S*\s?/, '').replace(/\{\?/g, '{');

  // An entry's template: the mnemonic's tail ("~sflagcond rd, rn, #mimm": {s}{cond} glued to the mnemonic, null when there
  // is none) and the operands.
  function templateOperands({ entry = {} }) {
    const asm = entry.asm || '';
    if (!asm.startsWith('~')) return { tail: null, ops: splitOperands({ text: asm }) };
    const space = asm.indexOf(' ');
    return { tail: space < 0 ? asm.slice(1) : asm.slice(1, space), ops: space < 0 ? [] : splitOperands({ text: asm.slice(space + 1) }) };
  }

  // A template operand can be left out entirely: all of it optional.
  const _optionalOperand = (op) => /^\{\?.*\}$/.test(op) && templateParts({ op, markers: true }).filter((p) => p.close).length === 1;

  // ---------------------------------------------------------------- encoding

  // Places a field value into the word, checking it fits the encoding.
  function _place({ inst = {}, key = 'rd', value = 0, word = 0 }) {
    if (key === 'imm') {
      // c.lui is written like lui (imm >> 12, 20 bits): accept 0xfffe0-0xfffff for -32..-1 as GNU as and objdump do.
      if (inst.asmShift && inst.immMsb !== 31 && value >= 2 ** 20 - 2 ** (inst.immMsb - inst.asmShift) && value < 2 ** 20) value -= 2 ** 20;
      const v = inst.asmShift ? (value * 2 ** inst.asmShift) | 0 : value;
      const { min, max } = immRange({ inst });
      if (value < min || value > max) throw new Error(`${inst.name}: immediate ${value} out of range [${min}, ${max}]`);
      const used = new Set(inst.segments.filter((s) => s.kind === 'imm').flatMap((s) => s.immBits));
      for (let b = 0; b < inst.immMsb; b++) {
        if (!used.has(b) && Math.floor(v / 2 ** b) & 1) throw new Error(`${inst.name}: immediate ${value} must be a multiple of ${2 ** Math.min(...used)}`);
      }
      if (inst.immNonZero && v === 0) throw new Error(`${inst.name}: immediate must be non-zero`);
      for (const s of inst.segments.filter((s) => s.kind === 'imm')) {
        s.immBits.forEach((immBit, j) => { word = W.or(word, W.place(Math.floor(v / 2 ** immBit) & 1, s.hi - j)); });
      }
      return word;
    }
    const parts = inst.segments.filter((s) => s.key === key);
    if (parts.some((s) => s.split)) {
      // a split field: each part takes its bits of the value
      const { width, signed } = OPERANDS[key];
      let field = value;
      // a constraint may sit on any part (x86-64's base register: on the ModRM part, not the REX bit)
      if (parts.some((s) => s.exclude && s.exclude.includes(value))) throw new Error(`${inst.name}: ${key} cannot be ${operandText({ key, value })}`);
      if (signed && field >= 2 ** (width - 1)) throw new Error(`${inst.name}: ${key} = ${value} does not fit in ${width} signed bits`);
      if (signed && field < 0 && field >= -(2 ** (width - 1))) field += 2 ** width;
      if (field < 0 || field >= 2 ** width) throw new Error(`${inst.name}: ${key} = ${value} does not fit in ${width} bits`);
      // bits the parts do not hold (push's list has no r8-r12)
      const held = parts.flatMap((s) => s.fieldBits);
      for (let b = 0; b < width; b++) if (!held.includes(b) && Math.floor(field / 2 ** b) & 1) throw new Error(`${inst.name}: ${key} cannot be ${operandText({ key, value })} here`);
      for (const s of parts) s.fieldBits.forEach((b, j) => { word = W.or(word, W.place(Math.floor(field / 2 ** b) & 1, s.hi - j)); });
      return word;
    }
    for (const s of parts) {
      let field = value;
      if (s.kind === 'reg' && s.compressed) {
        if (value < 8 || value > 15) throw new Error(`${inst.name}: ${key}' must be one of x8-x15 (s0, s1, a0-a5)`);
        field = value - 8;
      }
      if (s.exclude && s.exclude.includes(value)) throw new Error(`${inst.name}: ${key} cannot be ${s.kind === 'reg' ? `x${value}` : operandText({ key, value })}`);
      if (OPERANDS[key] && OPERANDS[key].signed && field >= 2 ** (s.width - 1)) throw new Error(`${inst.name}: ${key} = ${value} does not fit in ${s.width} signed bits`);
      if (OPERANDS[key] && OPERANDS[key].signed && field < 0 && field >= -(2 ** (s.width - 1))) field += 2 ** s.width;
      if (field < 0 || field >= 2 ** s.width) throw new Error(`${inst.name}: ${key} = ${value} does not fit in ${s.width} bits`);
      word = W.or(word, W.place(field, s.lo));
    }
    return word;
  }

  function _encodeFields({ inst = {}, fields = {} }) {
    let word = inst.match;
    const keys = [...new Set(inst.segments.map((s) => s.key).filter(Boolean))];
    for (const key of keys) {
      if (fields[key] === undefined) throw new Error(`${inst.name}: missing ${key}`);
      word = _place({ inst, key, value: fields[key], word });
    }
    word = W.norm(word);
    if (_sameDistinct({ inst, word })) throw new Error(`${inst.name}: ${inst.distinct.join(' and ')} must differ`);
    const decoded = extractFields({ inst, word });
    return { inst, word, fields: decoded, assembly: formatAssembly({ inst, fields: decoded }) };
  }

  // What a token matches in operand text; only names are told apart from what follows them, as in "(IX+5)".
  function _tokenPattern(token) {
    const operand = OPERANDS[tokenKey(token)];
    if (operand && operand.pattern) return `(${operand.pattern})`;
    return operand && operand.names ? `(${[...new Set(operand.names)].sort((a, b) => b.length - a.length).map(_escaped).join('|')})` : '(.+?)';
  }

  // the pattern of a template operand, made once
  const _patterns = new Map();

  // Parses the operand text of a given entry (instruction or pseudo-instruction) into values by token.
  // For an entry with a mnemonic tail, text is the tail, a space, then the operands ("seq r0, r1, r2" of addseq).
  function _parseOperands({ entry = {}, text = '' }) {
    const { tail, ops: template } = templateOperands({ entry });
    const space = tail !== null ? (text.indexOf(' ') < 0 ? text.length : text.indexOf(' ')) : 0;
    const given = splitOperands({ text: tail !== null ? text.slice(space + 1) : text });
    const derived = [];
    const expects = () => new Error(`${entry.name} expects: ${entry.name} ${entry.asm}`);
    const values = {};
    const omitAll = (op) => templateParts({ op }).filter((p) => p.token).forEach((p) => {
      const key = tokenKey(p.token);
      if (OPERANDS[key] && OPERANDS[key].omit !== undefined) values[key] = OPERANDS[key].omit;
    });
    const patternOf = (op) => {
      if (_patterns.has(op)) return _patterns.get(op);
      const parts = templateParts({ op, markers: true });
      const source = parts.map((p) => (p.open ? '(?:' : p.close ? ')?' : p.token ? _tokenPattern(p.token) : _escaped(p.text))).join('');
      const out = { tokens: parts.filter((p) => p.token).map((p) => p.token), pattern: new RegExp(`^${source}$`, 'i') };
      _patterns.set(op, out);
      return out;
    };
    // Each template operand takes one given operand, or more when an optional part of it holds commas ("#imm{?, sh}"
    // takes "#1, lsl #12"). Operands at the end may be left out: a rounding mode (dyn), a mask (unmasked), operands all
    // optional ({?xn}).
    let g = 0;
    if (tail !== null) {
      const { tokens, pattern } = patternOf(tail);
      const m = text.slice(0, space).match(pattern);
      if (!m) throw new Error(`"${entry.name}${text.slice(0, space)}" is not ${entry.name} with ${tail}`);
      tokens.forEach((token, k) => assign({ token, text: m[k + 1] }));
    }
    template.forEach((op, i) => {
      const inner = (op.match(/\{\?[^}]*\}/g) || []).reduce((n, span) => n + (span.match(/,/g) || []).length, 0);
      const { tokens, pattern } = patternOf(op);
      let m = null;
      let used = 0;
      for (let k = Math.min(inner, given.length - g - 1); k >= 0 && !m; k--) {
        m = given.slice(g, g + k + 1).join(', ').match(pattern);
        used = k + 1;
      }
      if (!m) {
        const rest = template.slice(i);
        const leftOut = g >= given.length && rest.every((o, j) => _optionalOperand(o) || (j === rest.length - 1 && (o === 'rm' || (OPERANDS[o] && OPERANDS[o].omit !== undefined))));
        if (!leftOut) throw g >= given.length ? expects() : new Error(`operand "${given[g]}" does not match "${op}"`);
        if (_optionalOperand(op)) omitAll(op);
        else if (OPERANDS[op] && OPERANDS[op].omit !== undefined) values[op] = OPERANDS[op].omit;
        return;
      }
      g += used;
      tokens.forEach((token, k) => assign({ token, text: m[k + 1] }));
    });
    if (g < given.length) throw expects();
    // derived operands must be what the others give
    for (const { key, text: written } of derived) {
      const value = OPERANDS[key].derive({ fields: values });
      if (value === null || value === undefined || operandText({ key, value, fields: values, inst: entry }).toLowerCase() !== written.toLowerCase()) {
        throw new Error(`${entry.name}: "${written}" is not the ${key} the other operands give`);
      }
    }
    return values;

    function assign({ token, text }) {
        const key = tokenKey(token);
        // an optional part not written: its operands at their omit values
        if (text === undefined) {
          if (OPERANDS[key] && OPERANDS[key].omit !== undefined) values[key] = OPERANDS[key].omit;
          return;
        }
        if (OPERANDS[key] && OPERANDS[key].derive) {
          derived.push({ key, text });
          return;
        }
        const info = operandInfo({ entry, token: key });
        if (info.kind === 'sp') {
          if (_parseRegister({ text }) !== 2) throw new Error(`${entry.name} only works with sp`);
        } else if (OPERANDS[key] && OPERANDS[key].parse) values[key] = OPERANDS[key].parse({ text, values, inst: entry });
        else if (info.kind === 'imm') values[key] = _parseNumber({ text });
        else if (info.kind === 'enum') {
          values[key] = info.names.findIndex((name) => name.toLowerCase() === text.toLowerCase());
          if (values[key] < 0) throw new Error(`"${text}" is not one of ${key}`);
        }
        else if (info.kind === 'csr') values[key] = text.toLowerCase() in csrs ? csrs[text.toLowerCase()] : _parseNumber({ text });
        else if (info.kind === 'rm') {
          values[key] = ROUNDING.indexOf(text.toLowerCase());
          if (values[key] < 0 || text === '') throw new Error(`"${text}" is not a rounding mode`);
        } else if (info.kind === 'fence') values[key] = _parseFence({ text });
        else values[key] = _parseRegister({ text, fp: info.fp });
    }
  }

  // Encodes one entry: returns one word per (expanded) instruction.
  function encodeEntry({ entry = {}, operands = '', ordering = '' }) {
    const values = _parseOperands({ entry, text: operands });
    const defaults = { aq: ordering.includes('aq') ? 1 : 0, rl: ordering.includes('rl') ? 1 : 0, rm: 7 };
    if (!entry.pseudo) return { entry, words: [_encodeFields({ inst: entry, fields: { ...defaults, rm: entry.rmDefault ?? 7, ...values } })] };
    const fitsShort = entry.shortExpansions && (values.imm | 0) >= -2048 && (values.imm | 0) <= 2047;
    if (fitsShort) values.imm |= 0;
    const expansions = (fitsShort ? entry.shortExpansions : entry.expansions)
      .filter(({ mapping }) => !(entry.dropZeroLo && mapping.imm === 'lo' && _lo({ value: values.imm | 0 }) === 0));
    const words = expansions.map((expansion) => {
      const { base, mapping } = expansion;
      const fields = { ...defaults, rm: base.rmDefault ?? 7 };
      for (const key of new Set(base.segments.map((s) => s.key).filter(Boolean))) {
        const m = mapping[key];
        if (typeof m === 'number') fields[key] = m;
        else if (m === 'hi') fields[key] = _hi({ value: values.imm | 0 });
        else if (m === 'lo') fields[key] = _lo({ value: values.imm | 0 });
        else if (typeof m === 'string') fields[key] = values[m];
        else if (values[key] !== undefined) fields[key] = values[key];
      }
      return { ..._encodeFields({ inst: base, fields }), expansion };
    });
    return { entry, words };
  }

  // Encodes an assembly string such as "addi a0, a0, -1", "c.lw a0, 4(a1)" or "call 0x1234".
  function encodeAssembly({ assembly = '' }) {
    const { entry, words } = _readAssembly({ assembly });
    return { entry, words };
  }

  // What an assembly string stands for, as the encoder's selectors hold it: the entry encodeAssembly encodes it with and
  // the operand values by key (ordering: 'aq', 'rl' or 'aqrl' for an atomic's .aq / .rl). Throws as encodeAssembly does.
  function assemblyChoice({ assembly = '' }) {
    const { entry, values, ordering } = _readAssembly({ assembly });
    return { entry, values: ordering ? { ...values, ordering } : values };
  }

  // The entries a mnemonic may be, shortest first: by name, and those whose mnemonic has a tail (addseq: add), indexed
  // once (x86-64 has thousands of rows).
  let _byMnemonic = null;
  function _candidates(mnemonic) {
    if (!_byMnemonic) {
      _byMnemonic = { names: new Map(), tails: encodable.filter((e) => e.asm && e.asm.startsWith('~')), position: new Map(encodable.map((e, i) => [e, i])) };
      for (const e of encodable) {
        const key = e.name.toLowerCase();
        if (!_byMnemonic.names.has(key)) _byMnemonic.names.set(key, []);
        _byMnemonic.names.get(key).push(e);
      }
    }
    const named = _byMnemonic.names.get(mnemonic) || [];
    const tailed = _byMnemonic.tails.filter((e) => mnemonic.startsWith(e.name.toLowerCase()) && !named.includes(e));
    // shortest first, then in the list's order
    return [...named, ...tailed].sort((a, b) => a.width - b.width || _byMnemonic.position.get(a) - _byMnemonic.position.get(b));
  }

  function _readAssembly({ assembly = '' }) {
    const [, mnemonicText = '', rest = ''] = spec.parseAssembly ? spec.parseAssembly({ assembly }) : assembly.trim().match(/^(\S+)\s*(.*)$/) || [];
    let mnemonic = mnemonicText.toLowerCase();
    let ordering = '';
    // A repeated mnemonic takes the shortest encoding its operands fit, as assemblers do.
    // an entry with a mnemonic tail takes the rest of the mnemonic (addseq: add, then seq)
    const operandsOf = (e) => (e.asm && e.asm.startsWith('~') ? `${mnemonic.slice(e.name.length)} ${rest}` : rest);
    let candidates = _candidates(mnemonic);
    if (!candidates.length) {
      const m = mnemonic.match(/^(.*)\.(aq|rl|aqrl)$/);
      candidates = m ? encodable.filter((e) => e.name === m[1] && e.segments && e.segments.some((s) => s.key === 'aq')) : [];
      ordering = m ? m[2] : '';
    }
    if (!candidates.length) throw new Error(`unknown instruction "${mnemonicText}"`);
    let error;
    for (const entry of candidates) {
      try {
        const operands = operandsOf(entry);
        return { ...encodeEntry({ entry, operands, ordering }), values: _parseOperands({ entry, text: operands }), ordering };
      } catch (e) {
        error = error || e;
      }
    }
    throw error;
  }

  // The "immediate view": for each immediate bit (from the top of the spine) where it comes from, merged into runs.
  function immediateView({ inst = {} }) {
    if (!inst.immName) return null;
    const source = {};
    inst.segments.filter((s) => s.kind === 'imm').forEach((s) => s.immBits.forEach((immBit) => { source[immBit] = s; }));
    const msbSegment = source[inst.immMsb];
    const cells = [];
    for (let bit = SPINE - 1; bit >= 0; bit--) {
      let cell;
      if (bit > inst.immMsb) cell = inst.immSigned ? { kind: 'sext', segment: msbSegment } : { kind: 'zero' };
      else if (source[bit]) cell = { kind: 'imm', segment: source[bit] };
      else cell = { kind: 'zero' };
      const last = cells[cells.length - 1];
      // Merge consecutive bits coming from the same segment (they are always contiguous in a part).
      if (last && last.kind === cell.kind && last.segment === cell.segment) last.width++;
      else cells.push({ ...cell, width: 1, hi: bit });
    }
    return cells;
  }

  // ---------------------------------------------------------------- the spine

  // A word as the instruction's bits (the spine position of an instruction further left does not count).
  const _aligned = ({ word = 0, width = SPINE }) => (WIDE ? (BigInt(word) >> BigInt(lsbOf({ width }))) & ((1n << BigInt(width)) - 1n) : (word >>> lsbOf({ width })) >>> 0);

  function hex({ word = 0, width = SPINE }) {
    return `0x${_aligned({ word, width }).toString(16).padStart(width / 4, '0')}`;
  }

  function binary({ word = 0, width = SPINE }) {
    return _aligned({ word, width }).toString(2).padStart(width, '0');
  }

  // the units an instruction is made of in memory: bytes, or halfwords for Thumb (spine.unit)
  const UNIT = spine.unit || 8;
  const UNIT_NAME = UNIT === 16 ? 'halfword' : 'byte';
  const _byteOf = (position) => Math.floor((SPINE - 1 - position) / UNIT);

  // The name of a spine position, or range of them, in tooltips.
  function bitName({ hi = 0, lo = hi }) {
    if (!spine.bytes) return `inst[${hi}${hi > lo ? ':' + lo : ''}]`;
    if (_byteOf(hi) !== _byteOf(lo)) return `${UNIT_NAME}s ${_byteOf(hi)}-${_byteOf(lo)}`;
    return `${UNIT_NAME} ${_byteOf(hi)}[${hi % UNIT}${hi > lo ? ':' + lo % UNIT : ''}]`;
  }

  // What the number row shows over a spine position, and whether a byte starts there.
  const bitNumber = ({ position = 0 }) => String(spine.bytes ? position % UNIT : position);
  const byteStart = ({ position = 0 }) => Boolean(spine.bytes) && position % UNIT === UNIT - 1 && position < SPINE - 1;

  // Pasted text as switch states (index 0 = the leftmost): a hex word (0x...) or a bit pattern (0b optional, x or - for
  // don't care). A word starts at the instruction's end of the spine, the other end stays x. null if it is neither.
  function pasteStates({ text = '' }) {
    const t = text.trim().toLowerCase().replace(/[_\s]/g, '');
    const m = t.match(/^0x([0-9a-f]+)$/);
    if (m && spine.bytes) {
      // whole units (bytes, or halfwords on Thumb), the first one leftmost
      const digits = m[1].padStart(Math.ceil(m[1].length / (UNIT / 4)) * (UNIT / 4), '0');
      if (digits.length * 4 > SPINE) return null;
      return [...[...digits].map((d) => parseInt(d, 16).toString(2).padStart(4, '0')).join('').padEnd(SPINE, '-')];
    }
    if (m && m[1].length * 4 <= SPINE) {
      const word = parseInt(m[1], 16) >>> 0;
      const width = spec.widthOf({ bit: (b) => String((word >>> b) & 1) });
      return Array.from({ length: SPINE }, (_, i) => (SPINE - 1 - i < width ? String((word >>> (SPINE - 1 - i)) & 1) : '-'));
    }
    const pattern = t.replace(/^0b/, '').replace(/x/g, '-');
    if (!/^[01-]+$/.test(pattern) || pattern.length > SPINE) return null;
    return [...(spine.bytes ? pattern.padEnd(SPINE, '-') : pattern.padStart(SPINE, '-'))];
  }

  const typeName = ({ format = '' }) => (spec.plainFormats ? format : `${format}-Type`);
  const numericOperand = ({ key = '' }) => key === 'imm' || Boolean(OPERANDS[key]) || REGISTER_KEYS.includes(key);

  return {
    spec, compiled, pseudos, encodable, unusedOpcodeRows, parseEncoding, immRange, matchesConstraints, extractFields, assemblyParts, operandsText,
    operandText, isOmitted, templateText, templateOperands, formatAssembly, fieldMask, partialDecode, knownWidth, selectedWord, missingBits, decodeWord, unusedOpcode, operandInfo, templateParts,
    tokenKey, encodeEntry, encodeAssembly, bitAt: ({ word, bit }) => W.bit(word, bit), wide: WIDE, assemblyChoice, immediateView, hex, binary, bitName, bitNumber, byteStart, pasteStates, typeName, numericOperand, csrs,
  };
}

// The instruction set everything started with: the tests, the API generator and the GNU as vectors use it directly.
export const rv32 = createCodec(rv32gc);
export const { compiled, pseudos, encodable, unusedOpcodeRows, parseEncoding, immRange, matchesConstraints, extractFields, assemblyParts,
  formatAssembly, fieldMask, partialDecode, decodeWord, unusedOpcode, operandInfo, templateParts, encodeEntry, encodeAssembly, assemblyChoice,
  immediateView } = rv32;
