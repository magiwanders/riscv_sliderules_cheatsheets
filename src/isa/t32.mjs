// Thumb (T32, ARMv7-A): 16 bit Thumb and 32 bit Thumb-2 instructions, a 32 bit one when hw1[15:11] is 11101, 11110 or
// 11111. The spine is two halfwords in memory order, each numbered 15-0; a 16 bit instruction takes the first one.
//
// Outside IT blocks, as written here, the 16 bit data processing instructions set the flags (adds, movs, ...); conditions
// are the branches' own and IT's. .w is written where an assembler could otherwise choose a 16 bit encoding. A modified
// immediate (i:imm3:imm8) is written as its value, BL / B.W's offset (S:J1:J2:imm10:imm11) as the offset from PC + 4.
//
// The instruction data is generated (src/isa/generated/t32.mjs, `npm run isa`) from LLVM's ARM TableGen and the
// unofficial Sail of spec/unofficial/t32 with src/isa/overlay/t32.json; see tools/isa/gen-t32.mjs.
import { operands as a32 } from './a32.mjs';

export { formats, sections, extensions, groups, instructions, registers } from './generated/t32.mjs';

const R = a32.rd.names;
const LOW = R.slice(0, 8);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const named = (names, extra = {}) => ({ width: Math.log2(names.length), names, ...extra });
const _number = (text) => {
  const t = text.trim().replace(/^#/, '').toLowerCase();
  if (!/^-?(0x[0-9a-f]+|\d+)$/.test(t)) throw new Error(`"${text}" is not a number`);
  return t.startsWith('-') ? -Number(t.slice(1)) : Number(t);
};
const ror = (value, n) => ((value >>> n) | (value << (32 - n))) >>> 0;
const CONDS = ['eq', 'ne', 'cs', 'cc', 'mi', 'pl', 'vs', 'vc', 'hi', 'ls', 'ge', 'lt', 'gt', 'le', 'al', 'nv'];

// ThumbExpandImm: i:imm3:imm8 as a byte pattern (00XY00XY, XY00XY00, XYXYXYXY) or a rotated 1bcdefgh
export function thumbImmediate({ value = 0 }) {
  const imm8 = value & 0xff;
  if (value >> 10 === 0) return [imm8, imm8 * 0x10001, imm8 * 0x1000100, imm8 * 0x1010101][(value >> 8) & 3] >>> 0;
  return ror(0x80 | (value & 0x7f), value >> 7);
}
const _tmimm = {
  width: 12,
  // a pattern of a zero byte is UNPREDICTABLE
  exclude: range(0, 4095).filter((v) => v >> 10 === 0 && (v >> 8) & 3 && (v & 0xff) === 0),
  text: ({ value = 0 }) => {
    const v = thumbImmediate({ value });
    return v > 255 ? `0x${v.toString(16)}` : String(v);
  },
  parse: ({ text }) => {
    const v = _number(text) >>> 0;
    for (let i = 0; i < 4096; i++) if (!_tmimm.exclude.includes(i) && thumbImmediate({ value: i }) === v) return i;
    throw new Error(`${text} is not a Thumb modified immediate`);
  },
};

// BL / BLX / B.W: S:J1:J2:imm10:imm11, I1 = NOT(J1 XOR S), I2 = NOT(J2 XOR S), offset S:I1:I2:imm10:imm11:0
const _longBranch = {
  width: 24,
  text: ({ value = 0 }) => {
    const s = (value >> 23) & 1;
    const i1 = 1 ^ (((value >> 22) & 1) ^ s);
    const i2 = 1 ^ (((value >> 21) & 1) ^ s);
    return String((i1 << 23 | i2 << 22 | ((value >> 11) & 0x3ff) << 12 | (value & 0x7ff) << 1) - (s ? 2 ** 24 : 0));
  },
  parse: ({ text }) => {
    const off = _number(text);
    if (off % 2 || off < -(2 ** 24) || off >= 2 ** 24) throw new Error(`${text} is not an even offset of 25 bits`);
    const u = off < 0 ? off + 2 ** 25 : off;
    const s = off < 0 ? 1 : 0;
    const j1 = (1 ^ ((u >> 23) & 1)) ^ s;
    const j2 = (1 ^ ((u >> 22) & 1)) ^ s;
    return (s << 23 | j1 << 22 | j2 << 21 | ((u >> 12) & 0x3ff) << 11 | ((u >> 1) & 0x7ff)) >>> 0;
  },
};

// IT's mask: t / e for each instruction after the first, then a 1
const _itLetters = ({ value = 0, cond = 0 }) => {
  if (!value) return '';
  const end = 31 - Math.clz32(value & -value);
  return range(end + 1, 3).reverse().map((bit) => ((value >> bit) & 1) === (cond & 1) ? 't' : 'e').join('');
};
const _itMask = ({ letters = '', cond = 0 }) => {
  const bits = [...letters].map((l) => (l === 't' ? cond & 1 : 1 - (cond & 1)));
  return [...bits, 1, 0, 0, 0].slice(0, 4).reduce((v, bit) => v * 2 + bit, 0);
};

const list = (names) => ({ width: 16, pattern: '\\{[^}]*\\}', text: a32.reglist.text, parse: a32.reglist.parse, exclude: [0], ...names });
const derived = (from) => named(R, { derive: ({ fields = {} }) => (fields[from] === undefined || fields[from] === null ? null : fields[from]) });

export const operands = {
  ...Object.fromEntries(['rd', 'rn', 'rm', 'rt', 'rt2', 'ra', 'rdlo', 'rdhi', 'rdn'].map((k) => [k, named(R)])),
  ...Object.fromEntries(['rdl', 'rnl', 'rml', 'rtl'].map((k) => [k, named(LOW)])),
  // muls rd, rn, rd and add rd, sp, rd name a register twice
  rdl2: { ...named(LOW), derive: ({ fields = {} }) => fields.rdl ?? null },
  rdn2: derived('rdn'),
  // ldm writes back when the base is not loaded
  wbang: { width: 1, names: ['', '!'], derive: ({ fields = {} }) => (fields.rnl === undefined || fields.reglist8 === undefined ? null : (fields.reglist8 >> fields.rnl) & 1 ? 0 : 1) },
  imm5l: { width: 5, exclude: [0] },
  imm5r: { width: 5, text: ({ value = 0 }) => String(value || 32), parse: ({ text }) => _number(text) % 32 },
  tlsli: { width: 5, exclude: [0] },
  tshr: { width: 5, text: ({ value = 0 }) => String(value || 32), parse: ({ text }) => _number(text) % 32 },
  reglist: list({}),
  reglist8: { width: 8, pattern: '\\{[^}]*\\}', exclude: [0], text: ({ value = 0 }) => `{${LOW.filter((_, n) => (value >> n) & 1).join(', ')}}`,
    parse: ({ text }) => { const m = a32.reglist.parse({ text }); if (m > 255) throw new Error(`${text}: low registers only`); return m; } },
  tlistl: list({}),
  tlists: list({}),
  tmimm: _tmimm,
  bllabel: _longBranch,
  // blx's target is a word: H, the raw field's bit 0, is 0
  blxlabel: { ..._longBranch, step: 2 },
  cond: named(CONDS.map((c) => (c === 'al' ? '' : c)), { exclude: [15] }),
  firstcond: named(CONDS, { exclude: [15],
    // the mask's letters were read before the condition: now they become bits
    parse: ({ text, values = {} }) => {
      const cond = CONDS.indexOf(text.toLowerCase());
      if (cond < 0 || cond === 15) throw new Error(`"${text}" is not a condition`);
      if (typeof values.itmask === 'string') values.itmask = _itMask({ letters: values.itmask, cond });
      return cond;
    } }),
  itmask: { width: 4, exclude: [0], pattern: '[te]{0,3}', text: ({ value = 0, fields = {} }) => _itLetters({ value, cond: fields.firstcond ?? 0 }), parse: ({ text }) => text.toLowerCase() },
  lsl2: { width: 2, omit: 0 },
  adrsub: { width: 1 }, imod: { width: 2 }, imod1: { width: 1 },
  ...Object.fromEntries(['sflag', 'shift', 'amount', 'sign', 'ssat', 'usat', 'ssat4', 'usat4', 'shsat', 'samt', 'rot', 'lsb', 'msb', 'widthm1', 'pkhsh', 'pkha', 'psr', 'msk',
    'iflags', 'endian', 'barrier', 'isbopt', 'mode', 'cp', 'opc1', 'copc1', 'opc2', 'opc4', 'cn', 'cm', 'cd', 'coption'].map((k) => [k, a32[k]])),
};

export const name = 'Thumb';
export const spine = { width: 32, bytes: true, unit: 16, title: 'halfwords 0-1, in memory order' };
export const immediates = { imm: false, uoff: false, label: true, doff: false, cimm: false, cbl: false };
export const labels = { ext: 'Arch', expansion: null };
export const widths = { ext: 96, instruction: 260, pseudocode: 300, type: 120 };
export const repeatedNames = true;
export const plainFormats = true;
export const alwaysImmediateRow = true;
export const immText = ({ value = 0 }) => String(value);
// hw1[15:11]: 11101, 11110, 11111 begin a 32 bit instruction
export function widthOf({ bit = () => '-' }) {
  const top = [31, 30, 29, 28, 27].map(bit);
  if (top.slice(0, 3).includes('0')) return 16;
  if (top.slice(0, 3).includes('-')) return null;
  if (top[3] === '1' || top[4] === '1') return 32;
  return top[3] === '0' && top[4] === '0' ? 16 : null;
}
