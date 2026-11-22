// A64 (ARMv8.0-A): 32 bit words; the top-level encoding groups (op0, bits 28:25) are the decoder's sections. The
// integer, load / store, branch and system and scalar floating-point instructions; Advanced SIMD is not on the sheets
// yet.
//
// Registers: wn / xn where 31 is the zero register (wzr, xzr), wn_sp / xn_sp where it is the stack pointer, bn ... qn
// the floating-point and SIMD registers by size. Operands in {?...} are left out at their default (lsl #0, the shift of
// a register), as Arm's assembly writes them. A bitmask immediate (N:immr:imms) is written as the value it stands for,
// a floating-point immediate as its number, a system register as s<op0>_<op1>_c<CRn>_c<CRm>_<op2>.
//
// The instruction data is generated (src/isa/generated/a64.mjs, `npm run isa`) from LLVM's AArch64 TableGen and the
// unofficial Sail of spec/unofficial/a64 with src/isa/overlay/a64.json; see tools/isa/gen-a64.mjs.

export { formats, sections, extensions, groups, instructions, registers } from './generated/a64.mjs';

const regs = (prefix, last) => [...Array.from({ length: 31 }, (_, i) => `${prefix}${i}`), last];
const fp = (prefix) => Array.from({ length: 32 }, (_, i) => `${prefix}${i}`);
const W = regs('w', 'wzr');
const X = regs('x', 'xzr');
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
export const CONDS = ['eq', 'ne', 'cs', 'cc', 'mi', 'pl', 'vs', 'vc', 'hi', 'ls', 'ge', 'lt', 'gt', 'le', 'al', 'nv'];

const _number = (text) => {
  const t = text.trim().toLowerCase().replace(/^#/, '');
  const negative = t.startsWith('-');
  const body = negative ? t.slice(1) : t;
  if (!/^(0x[0-9a-f]+|\d+)$/.test(body)) throw new Error(`"${text}" is not a number`);
  const value = BigInt(body);
  return negative ? -value : value;
};

// The value of a bitmask immediate N:immr:imms (the Arm ARM's DecodeBitMasks), null for the reserved encodings.
export function bitmask({ value = 0, bits = 64 }) {
  const n = (value >> 12) & 1;
  const immr = (value >> 6) & 63;
  const imms = value & 63;
  const combined = (n << 6) | (~imms & 63);
  const len = combined ? 31 - Math.clz32(combined) : -1;
  if (len < 1 || (1 << len) > bits) return null;
  const levels = (1 << len) - 1;
  if ((imms & levels) === levels) return null;
  const esize = 1 << len;
  const s = imms & levels;
  const r = immr & levels;
  const mask = (1n << BigInt(esize)) - 1n;
  const welem = (1n << BigInt(s + 1)) - 1n;
  const elem = ((welem >> BigInt(r)) | (welem << BigInt(esize - r))) & mask;
  let out = 0n;
  for (let i = 0; i < bits; i += esize) out |= elem << BigInt(i);
  return out;
}

function _bitmaskOperand({ bits }) {
  const width = bits === 64 ? 13 : 12;
  const values = Array.from({ length: 2 ** width }, (_, v) => bitmask({ value: v, bits }));
  let byValue = null;
  return {
    width,
    exclude: range(0, 2 ** width - 1).filter((v) => values[v] === null),
    text: ({ value = 0 }) => `0x${(values[value] ?? 0n).toString(16)}`,
    parse: ({ text }) => {
      if (!byValue) byValue = new Map(values.map((v, i) => [v, i]).filter(([v]) => v !== null).reverse());
      const mask = (1n << BigInt(bits)) - 1n;
      const v = _number(text) & mask;
      if (!byValue.has(v)) throw new Error(`${text} is not a bitmask immediate`);
      return byValue.get(v);
    },
  };
}

// The value of an 8 bit floating-point immediate (VFPExpandImm): ±(16 + mantissa) / 16 × 2^n, n from -3 to 4.
export function fpImmediate({ value = 0 }) {
  const n = (((value >> 4) & 7) + 4) % 8 - 3;
  return (value & 0x80 ? -1 : 1) * ((16 + (value & 15)) / 16) * 2 ** n;
}
const _fpText = (x) => (Number.isInteger(x) ? `${x}.0` : String(x));

const SYSREG = /^s([23])_([0-7])_c(\d{1,2})_c(\d{1,2})_([0-7])$/i;

const named = (names, extra = {}) => ({ width: Math.log2(names.length), names, ...extra });
const PRFOPS = ['pldl1keep', 'pldl1strm', 'pldl2keep', 'pldl2strm', 'pldl3keep', 'pldl3strm', '#6', '#7', 'plil1keep', 'plil1strm', 'plil2keep', 'plil2strm',
  'plil3keep', 'plil3strm', '#14', '#15', 'pstl1keep', 'pstl1strm', 'pstl2keep', 'pstl2strm', 'pstl3keep', 'pstl3strm', ...range(22, 31).map((n) => `#${n}`)];
const BARRIERS = ['#0', 'oshld', 'oshst', 'osh', '#4', 'nshld', 'nshst', 'nsh', '#8', 'ishld', 'ishst', 'ish', '#12', 'ld', 'st', 'sy'];
const amount = (n) => ({ width: 1, names: ['', ` #${n}`], omit: 0 });

export const operands = {
  ...Object.fromEntries(['wd', 'wn', 'wm', 'wa', 'wt', 'wt2', 'ws'].map((k) => [k, named(W)])),
  ...Object.fromEntries(['xd', 'xn', 'xm', 'xa', 'xt', 'xt2', 'xs'].map((k) => [k, named(X)])),
  xr: named(X, { omit: 30 }),
  wd_sp: named(regs('w', 'wsp')), wn_sp: named(regs('w', 'wsp')), xd_sp: named(regs('x', 'sp')), xn_sp: named(regs('x', 'sp')),
  ...Object.fromEntries(['bt', 'ht', 'st', 'dt', 'qt', 'st2', 'dt2', 'qt2', 'hd', 'hn', 'sd', 'sn', 'sm', 'sa', 'dd', 'dn', 'dm', 'da', 'vd', 'vn']
    .map((k) => [k, named(fp(k[0]))])),
  prfop: named(PRFOPS),
  prfopr: named(PRFOPS, { exclude: range(24, 31) }),
  sh: named(['lsl #0', 'lsl #12'], { omit: 0 }),
  hw: named(['lsl #0', 'lsl #16', 'lsl #32', 'lsl #48'], { omit: 0 }),
  hw32: named(['lsl #0', 'lsl #16'], { omit: 0 }),
  immr: { width: 6 }, imms: { width: 6 }, lsb: { width: 6 }, wimmr: { width: 5 }, wimms: { width: 5 }, wlsb: { width: 5 },
  bimm64: _bitmaskOperand({ bits: 64 }),
  bimm32: _bitmaskOperand({ bits: 32 }),
  cond: named(CONDS),
  nzcv: { width: 4 },
  bitw: { width: 5 },
  bitx: { width: 5, text: ({ value = 0 }) => String(value + 32), parse: ({ text }) => Number(_number(text)) - 32 },
  op1: { width: 3 }, op2: { width: 3 },
  cn: named(fp('c').slice(0, 16)), cm: named(fp('c').slice(0, 16)),
  sysreg: {
    width: 15,
    text: ({ value = 0 }) => `s${2 + (value >> 14)}_${(value >> 11) & 7}_c${(value >> 7) & 15}_c${(value >> 3) & 15}_${value & 7}`,
    parse: ({ text }) => {
      const m = text.trim().match(SYSREG);
      if (!m || Number(m[3]) > 15 || Number(m[4]) > 15) throw new Error(`"${text}" is not s<op0>_<op1>_c<n>_c<m>_<op2>`);
      return ((Number(m[1]) - 2) << 14) | (Number(m[2]) << 11) | (Number(m[3]) << 7) | (Number(m[4]) << 3) | Number(m[5]);
    },
  },
  crm: named(range(0, 15).map((n) => `#${n}`), { omit: 15 }),
  barrier: named(BARRIERS),
  shift: named(['lsl', 'lsr', 'asr', 'ror'], { omit: 0 }),
  ashift: named(['lsl', 'lsr', 'asr', 'ror'], { omit: 0, exclude: [3] }),
  amount: { width: 6, omit: 0 },
  wamount: { width: 6, omit: 0, exclude: range(32, 63) },
  ext: named(['uxtb', 'uxth', 'uxtw', 'uxtx', 'sxtb', 'sxth', 'sxtw', 'sxtx']),
  ext64: named(['uxtb', 'uxth', 'uxtw', 'uxtx', 'sxtb', 'sxth', 'sxtw', 'sxtx'], { exclude: [3, 7] }),
  xext1: named(['uxtx', 'sxtx']),
  eamt: { width: 3, exclude: [5, 6, 7] },
  wext: named(['uxtw', 'sxtw']),
  xext: named(['lsl', 'sxtx'], { omit: 0 }),
  ro0: amount(0), ro1: amount(1), ro2: amount(2), ro3: amount(3), ro4: amount(4),
  fpimm: {
    width: 8,
    text: ({ value = 0 }) => _fpText(fpImmediate({ value })),
    parse: ({ text }) => {
      const x = Number(text.trim().replace(/^#/, ''));
      const v = range(0, 255).find((i) => fpImmediate({ value: i }) === x);
      if (v === undefined) throw new Error(`${text} is not a floating-point immediate`);
      return v;
    },
  },
  fbits: { width: 6, text: ({ value = 0 }) => String(64 - value), parse: ({ text }) => 64 - Number(_number(text)) },
  wfbits: { width: 5, text: ({ value = 0 }) => String(32 - value), parse: ({ text }) => 32 - Number(_number(text)) },
};

export const name = 'A64';
export const spine = { width: 32, title: 'inst[31:0]' };
export const immediates = { imm: false, simm: true, uoff: false, label: true, page: true };
export const labels = { ext: 'Ext', expansion: null };
export const widths = { ext: 76, instruction: 260, pseudocode: 300, type: 120 };
export const repeatedNames = true;
export const plainFormats = true;
export const alwaysImmediateRow = true;
export const widthOf = () => 32;
// the top-level encoding group (op0, bits 28:25) first, as the Arm ARM decodes
export const decodeOrder = { 32: [28, 27, 26, 25, 31, 30, 29, ...range(0, 24).reverse()] };
export const immText = ({ value = 0 }) => String(value);
