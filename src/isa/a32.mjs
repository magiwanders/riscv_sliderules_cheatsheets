// A32 (ARMv7-A, the ARM instruction set): 32 bit words, a condition in bits 31:28 (1111: the unconditional instructions).
// The integer, load / store, branch, coprocessor and system instructions, with the Security, Virtualization and
// Multiprocessing Extensions; VFP and Advanced SIMD are not on the sheets yet.
//
// The condition and the S bit are written into the mnemonic as Arm's unified syntax does (addseq): the templates start
// with ~ for that part. A modified immediate (rotation : imm8) is written as its value; offsets of loads and stores
// carry their sign (the U bit) in front; lsr / asr #32 are shift amount 0, ror #0 is rrx; ldrd / strd / ldrexd / strexd
// name the second register, which is the first plus one.
//
// The instruction data is generated (src/isa/generated/a32.mjs, `npm run isa`) from LLVM's ARM TableGen and the
// unofficial Sail of spec/unofficial/a32 with src/isa/overlay/a32.json; see tools/isa/gen-a32.mjs.

export { formats, sections, extensions, groups, instructions, registers } from './generated/a32.mjs';

const R = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'sp', 'lr', 'pc'];
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const named = (names, extra = {}) => ({ width: Math.log2(names.length), names, ...extra });
const _number = (text) => {
  const t = text.trim().replace(/^#/, '').toLowerCase();
  if (!/^-?(0x[0-9a-f]+|\d+)$/.test(t)) throw new Error(`"${text}" is not a number`);
  return t.startsWith('-') ? -Number(t.slice(1)) : Number(t);
};
const ror = (value, n) => ((value >>> n) | (value << (32 - n))) >>> 0;

// A modified immediate's value (imm8 rotated right by twice the rotation) and the encoding assemblers choose for a
// value: the smallest rotation.
export const modifiedImmediate = ({ value = 0 }) => ror(value & 0xff, 2 * (value >> 8));
const _mimm = {
  width: 12,
  text: ({ value = 0 }) => {
    const v = modifiedImmediate({ value });
    return v > 255 ? `0x${v.toString(16)}` : String(v);
  },
  parse: ({ text }) => {
    const v = _number(text) >>> 0;
    for (let rot = 0; rot < 16; rot++) {
      const imm8 = ror(v, 32 - 2 * rot) >>> 0;
      if (imm8 < 256 && modifiedImmediate({ value: (rot << 8) | imm8 }) === v) return (rot << 8) | imm8;
    }
    throw new Error(`${text} is not a modified immediate`);
  },
};

// {r0, r4, lr}: a register list, bit n for rn
const _reglist = {
  width: 16,
  exclude: [0],
  pattern: '\\{[^}]*\\}',
  text: ({ value = 0 }) => `{${R.filter((_, n) => (value >> n) & 1).join(', ')}}`,
  parse: ({ text }) => {
    let mask = 0;
    for (const item of text.trim().replace(/^\{|\}$/g, '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean)) {
      const [from, to = from] = item.split('-').map((x) => R.indexOf(x.trim()));
      if (from < 0 || to < 0 || to < from) throw new Error(`"${item}" is not a register or range`);
      for (let n = from; n <= to; n++) mask |= 1 << n;
    }
    return mask;
  },
};

const SHIFTS = ['lsl', 'lsr', 'asr', 'ror'];
const PSR_FIELDS = range(0, 15).map((m) => (m ? `_${m & 8 ? 'f' : ''}${m & 4 ? 's' : ''}${m & 2 ? 'x' : ''}${m & 1 ? 'c' : ''}` : ''));

export const operands = {
  ...Object.fromEntries(['rd', 'rn', 'rm', 'rs', 'rt', 'rt2', 'ra', 'rdlo', 'rdhi'].map((k) => [k, named(R)])),
  // ldrd's first register is even and not lr, the second follows it
  rtd: named(R, { exclude: [...range(0, 15).filter((n) => n % 2), 14] }),
  rtd2: named(R, { derive: ({ fields = {} }) => (fields.rtd === undefined || fields.rtd === null ? null : fields.rtd + 1) }),
  cond: named(['eq', 'ne', 'cs', 'cc', 'mi', 'pl', 'vs', 'vc', 'hi', 'ls', 'ge', 'lt', 'gt', 'le', '', 'nv'], { exclude: [15] }),
  sflag: named(['', 's']),
  mimm: _mimm,
  // lsl #0 is left out, lsr / asr #32 are amount 0, ror #0 is rrx
  shift: named(SHIFTS, {
    omit: 0,
    pattern: 'lsl|lsr|asr|ror|rrx',
    text: ({ value = 0, fields = {} }) => (value === 3 && fields.amount === 0 ? 'rrx' : SHIFTS[value]),
    parse: ({ text }) => (text.toLowerCase() === 'rrx' ? 3 : SHIFTS.indexOf(text.toLowerCase())),
  }),
  amount: {
    width: 5,
    omit: 0,
    pattern: '(?: #(?:0x[0-9a-f]+|\\d+))?',
    text: ({ value = 0, fields = {} }) => (fields.shift === 3 && value === 0 ? '' : ` #${[1, 2].includes(fields.shift) && value === 0 ? 32 : value}`),
    parse: ({ text, values = {} }) => {
      if (text.trim() === '') return 0;
      const n = _number(text);
      return [1, 2].includes(values.shift) && n === 32 ? 0 : n;
    },
  },
  shiftr: named(SHIFTS),
  sign: named(['-', '']),
  pkhsh: { width: 5, omit: 0 },
  pkha: { width: 5, text: ({ value = 0 }) => String(value || 32), parse: ({ text }) => _number(text) % 32 },
  ssat: { width: 5, text: ({ value = 0 }) => String(value + 1), parse: ({ text }) => _number(text) - 1 },
  usat: { width: 5 },
  ssat4: { width: 4, text: ({ value = 0 }) => String(value + 1), parse: ({ text }) => _number(text) - 1 },
  usat4: { width: 4 },
  shsat: named(['lsl', 'asr'], { omit: 0 }),
  samt: { width: 5, omit: 0, text: ({ value = 0, fields = {} }) => String(fields.shsat === 1 && value === 0 ? 32 : value),
    parse: ({ text, values = {} }) => (values.shsat === 1 && _number(text) === 32 ? 0 : _number(text)) },
  rot: named(['ror #0', 'ror #8', 'ror #16', 'ror #24'], { omit: 0 }),
  lsb: { width: 5 },
  // bfi / bfc write the width: msb - lsb + 1
  msb: { width: 5, text: ({ value = 0, fields = {} }) => String(value - (fields.lsb ?? 0) + 1), parse: ({ text, values = {} }) => (values.lsb ?? 0) + _number(text) - 1 },
  widthm1: { width: 5, text: ({ value = 0 }) => String(value + 1), parse: ({ text }) => _number(text) - 1 },
  reglist: _reglist,
  mode: { width: 5 },
  // p8-p11: floating point and Advanced SIMD (p10, p11 VFP; p8, p9 reserved for them, half precision in ARMv8.2), not
  // these generic coprocessor instructions
  cp: named(range(0, 15).map((n) => `p${n}`), { exclude: [8, 9, 10, 11] }),
  opc1: { width: 4 }, copc1: { width: 3 }, opc2: { width: 3 }, opc4: { width: 4 },
  ...Object.fromEntries(['cn', 'cm', 'cd'].map((k) => [k, named(range(0, 15).map((n) => `c${n}`))])),
  coption: { width: 8 },
  psr: named(['CPSR', 'SPSR']),
  msk: named(PSR_FIELDS, { exclude: [0] }),
  imod: { width: 2 },
  iflags: named(['', 'f', 'i', 'if', 'a', 'af', 'ai', 'aif'], { exclude: [0] }),
  endian: named(['le', 'be']),
  barrier: named(['#0', '#1', 'oshst', 'osh', '#4', '#5', 'nshst', 'nsh', '#8', '#9', 'ishst', 'ish', '#12', '#13', 'st', 'sy']),
  isbopt: named([...range(0, 14).map((n) => `#${n}`), 'sy'], { omit: 15 }),
};

export const name = 'A32';
export const spine = { width: 32, title: 'inst[31:0]' };
export const immediates = { imm: false, label: true, cimm: false };
export const labels = { ext: 'Arch', expansion: null };
export const widths = { ext: 96, instruction: 260, pseudocode: 300, type: 120 };
export const repeatedNames = true;
export const plainFormats = true;
export const alwaysImmediateRow = true;
export const widthOf = () => 32;
export const immText = ({ value = 0 }) => String(value);
