// Generates src/isa/generated/rv32gc.mjs, the instruction data of the RV32 sheets (every ratified extension; the sheets
// start as RV32GC), from
//   - the official Sail model (spec/sail-riscv): which instructions RV32 has and their encodings, bit by bit;
//   - LLVM's TableGen description (spec/llvm/RISCV.json): mnemonics, assembly syntax, register classes, how immediates
//     are scaled, the formats, the aliases behind the pseudo-instructions;
//   - the RISC-V Unified Database (spec/udb/instructions.json): a third check of every encoding it has, and the only
//     second source of the extensions the Sail model does not have yet (LLVM_ONLY);
//   - the overlay (src/isa/overlay/rv32gc.json): what none of them has (sections, groups, titles, descriptions, HINT and
//     reserved rows, the order of rows, unused opcodes).
// The sources are checked against each other bit by bit; any disagreement, or an instruction one of them has and the
// overlay does not place, stops the generator. The rules turning them into cells are in the README ("How the sheets
// are drawn").
//
//   npm run isa          (node tools/isa/gen-rv32gc.mjs; --check only compares with the file on disk)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSail, sailInstructions } from './sail.mjs';
import { ROOT, moduleText, writeOrCheck } from './common.mjs';
import { allExtensions } from '../../src/isa/riscv-extensions.mjs';

const OUT = join(ROOT, 'src', 'isa', 'generated', 'rv32gc.mjs');
const SAIL_ROOT = join(ROOT, 'spec', 'sail-riscv', 'model');

// Every vendored file of the model, in a stable order.
const _walk = (dir) => readdirSync(dir).sort().flatMap((f) => (statSync(join(dir, f)).isDirectory() ? _walk(join(dir, f)) : f.endsWith('.sail') ? [join(dir, f)] : []));
export const SAIL_FILES = _walk(SAIL_ROOT);

// The model configured with every ratified extension it has (conflicting ones too: their encodings do not depend on it).
const CONFIG = { xlen: 32, extensions: new Set(['I', 'M', 'Zmmul', 'A', 'Zaamo', 'Zalrsc', 'F', 'D', 'Zca', 'Zcf', 'Zcd', 'Zicsr', 'Zifencei', 'Zihintpause',
  'Zba', 'Zbb', 'Zbc', 'Zbs', 'Zbkb', 'Zbkc', 'Zbkx', 'Zknd', 'Zkne', 'Zknh', 'Zksed', 'Zksh', 'Zkr', 'Zicond', 'Zimop', 'Zcmop', 'Zcb', 'Zfh', 'Zfhmin', 'Zfa',
  'Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin', 'Zfbfmin', 'Zvfbfmin', 'Zvfbfwma', 'V', 'Zve32x', 'Zve32f', 'Zve64x', 'Zve64f', 'Zve64d', 'Zvfh', 'Zvfhmin', 'Zvbb',
  'Zvbc', 'Zvkb', 'Zvkg', 'Zvkned', 'Zvknha', 'Zvknhb', 'Zvksed', 'Zvksh', 'H', 'Svinval', 'Zicbom', 'Zicbop', 'Zicboz', 'Zawrs', 'Zacas', 'Zabha', 'Zicfilp',
  'Zicfiss', 'Zihintntl', 'S', 'U']) };

// Left out of the sheets: privileged instructions of the base machine (Sail and LLVM), LLVM's spellings of illegal
// encodings and of HINTs the overlay shows as rows.
const EXCLUDE_SAIL = ['MRET', 'SRET', 'WFI', 'SFENCE_VMA'];
const EXCLUDE_LLVM = ['MRET', 'SRET', 'DRET', 'WFI', 'SFENCE_VMA', 'C_NOP_HINT', 'C_UNIMP', 'UNIMP'];
// Extensions the Sail model does not have yet: their instructions come from LLVM alone, checked against the Unified
// Database instead.
const LLVM_ONLY = ['Q', 'Zcmp', 'Zcmt', 'Zilsd', 'Zclsd', 'Smrnmi'];

// Sail operand names as the sheets (and the spec's tables) write them.
const REGISTER_NAMES = { rd: 'rd', rs1: 'rs1', rs2: 'rs2', rs3: 'rs3', rs: 'rs1', rsd: 'rd/rs1', rdc: 'rd', rsc1: 'rs1', rsc2: 'rs2', rsdc: 'rd/rs1',
  vd: 'vd', vs1: 'vs1', vs2: 'vs2', vs3: 'vs3' };
// Fields whose names the sheets write otherwise: Zfa's constant index, Zcmp's stack adjustment and register pairs.
const FIELD_NAMES = { constantidx: 'fpimm', stackadj: 'spimm', funct12: 'funct12' };
// Immediates whose assembly writes the upper 20 bits: the sheet numbers their bits as the 32 bit value (imm[31:12]).
const UPPER = ['OPERAND_UIMM20_LUI', 'OPERAND_UIMM20_AUIPC', 'OPERAND_CLUI_IMM'];
// Fields aq / rl stay fields: LLVM spells each of their values as an instruction of its own (AMOADD_W_AQ, ...).
const SPREAD_FIELDS = ['aq', 'rl'];
// Register classes whose restrictions the sheets already write otherwise (compressed registers with ', sp in the
// assembly, the HINT rows): every other class excludes the registers it lacks (even pairs, ra / t0, vector groups).
const PLAIN_CLASSES = /^(GPR|GPRC|GPRNoX0|GPRNoX2|GPRNoX0X2|SP|BasePtr|BasePtrC|GPRMemZeroOffset|SPMem|FPR16|FPR32|FPR64|FPR128|FPR32C|FPR64C|FPR16INX|FPR32INX|VR)$/;

// The extension label of an LLVM predicate: the toggles' names, "X / Y" for either, nothing for RV32 itself.
const PREDICATE_LABELS = { HasStdExtZca: 'C', HasStdExtZcf: 'C + F', HasStdExtZcd: 'C + D', HasStdExtZmmul: 'M', HasStdExtZaamo: 'A', HasStdExtZalrsc: 'A',
  HasVInstructions: 'V', HasVInstructionsAnyF: 'V', HasVInstructionsI64: 'V', HasHalfFPLoadStoreMove: 'Zfh / Zfhmin / Zfbfmin', HasStdExtFOrZfinx: 'F / Zfinx' };
// The extensions the toggles know; parts of HasStdExtXOrY names that are not among them (Zvbc32e, P) are left out.
const KNOWN = new Set([...allExtensions(), 'Zca', 'Zcf', 'Zcd', 'Zmmul', 'Zaamo', 'Zalrsc']);

function fail(message) {
  throw new Error(`gen-rv32gc: ${message}`);
}

const encoderShift = ({ operand = {} }) => {
  const m = (operand.encoder || '').match(/^getImmOpValueAsrN<(\d+)>$/);
  return m ? Number(m[1]) : 0;
};

// Bit index → LLVM variable bit, msb first as Sail.
const llvmBit = (token) => {
  const m = token.match(/^(\w+)\{(\d+)\}$/);
  return m ? { var: m[1], bit: Number(m[2]) } : null;
};

const operandsOf = ({ def }) => Object.fromEntries([...def.outs, ...def.ins].map(([cls, n]) => [n, cls]));

// "5:4|9:6|2|3" from the immediate bits of a cell, msb first.
function immLabel({ bits = [] }) {
  const runs = [];
  for (const b of bits) {
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === b + 1) last.push(b);
    else runs.push([b]);
  }
  return runs.map((r) => (r.length === 1 ? `${r[0]}` : `${r[0]}:${r[r.length - 1]}`)).join('|');
}

// An overlay row's bits, msb first: its literal and don't care bits, ? for an operand's.
function bitsFromEnc({ enc = '' }) {
  return enc.split(/\s+/).flatMap((t) => (/^[01-]+$/.test(t) ? [...t] : Array(tokenWidth(t)).fill('?')));
}

function labelOf({ def, sail = null }) {
  const parts = def.predicates.filter((p) => p !== 'IsRV32').map((p) => {
    if (PREDICATE_LABELS[p]) return PREDICATE_LABELS[p];
    const m = p.match(/^HasStdExt(\w+)$/) || fail(`${def.asm}: predicate ${p}`);
    return m[1].split(/Or(?=[A-Z])/).filter((e) => KNOWN.has(e)).map((e) => PREDICATE_LABELS[`HasStdExt${e}`] || e).join(' / ');
  });
  // the extensions LLVM leaves implicit (Zicsr, Zifencei, Zicbop's prefetches) come from the Sail guards
  if (!parts.length && sail) for (const ext of sail.extensions) if (KNOWN.has(ext) && !['I', 'Zca'].includes(ext)) parts.push(ext);
  return parts.length ? parts.join(' + ') : 'I';
}

// ---------------------------------------------------------------- 1. Sail ↔ LLVM

// Each LLVM instruction takes the Sail encoding that agrees with it bit by bit and that it fixes the fewest operands
// of (LLVM writes some operands of a Sail clause as instructions of their own: the 32 mop.r.N of one clause). A field
// may sit at a constant offset in an LLVM operand (Sail's sew is bits 5:3 of LLVM's vtypei).
function pair({ sail = [], llvm = {} }) {
  const defs = Object.entries(llvm.instructions).filter(([name]) => !EXCLUDE_LLVM.includes(name));
  const pairs = [];
  const llvmOnly = [];
  const unmatched = [];
  for (const [name, def] of defs) {
    const operands = operandsOf({ def });
    const candidates = [];
    for (const s of sail) {
      if (def.size * 8 !== s.width) continue;
      const links = {};
      let fixedByLlvm = 0;
      let ok = true;
      for (let i = 0; i < s.width && ok; i++) {
        const sb = s.bits[i];
        const lb = def.inst[i];
        const lv = llvmBit(lb);
        if (lb === '-') ok = false;
        else if (!lv) {
          if (sb.kind === 'lit') ok = sb.value === Number(lb);
          else if (sb.kind === 'field' && SPREAD_FIELDS.includes(sb.name)) ok = lb === '0';
          else fixedByLlvm++;
        } else if (sb.kind === 'lit') {
          // RV32's shamt[5], or an operand LLVM prints fixed (rtz)
          ok = Boolean(sb.fixedOperand) || (llvm.operands[operands[lv.var]] || {}).operandType === 'OPERAND_RTZARG';
        } else {
          const cls = operands[lv.var];
          // the same kind of operand on both sides: a register is a register class in LLVM, an immediate is not
          // (the mask is a register operand in LLVM, a one-bit field for Sail and the sheets)
          const isReg = Boolean(regClassOf({ llvm, cls })) && (llvm.operands[cls] || {}).operandType !== 'OPERAND_VMASK';
          if ((sb.kind === 'reg') !== isReg && !(sb.kind === 'field' && !isReg)) ok = false;
          const expected = sb.kind === 'imm' ? sb.value : sb.bit;
          const actual = lv.bit + (sb.kind === 'imm' ? encoderShift({ operand: llvm.operands[cls] || {} }) : 0);
          const key = `${sb.kind}:${sb.name}`;
          const offset = expected - actual;
          if (sb.kind !== 'field' && offset !== 0) ok = false;
          if (links[key] && (links[key].var !== lv.var || links[key].offset !== offset)) ok = false;
          links[key] = { var: lv.var, offset };
        }
      }
      if (ok) candidates.push({ sail: s, links, fixedByLlvm });
    }
    candidates.sort((a, b) => a.fixedByLlvm - b.fixedByLlvm);
    const best = candidates.filter((c) => c.fixedByLlvm === (candidates[0] || {}).fixedByLlvm);
    if (best.length > 1) fail(`${name} matches several Sail encodings: ${best.map((c) => c.sail.key).join(', ')}`);
    if (best.length === 1) pairs.push({ name, def, ...best[0] });
    else if (labelOf({ def }).split(/[+/]/).some((e) => LLVM_ONLY.includes(e.trim()))) llvmOnly.push({ name, def });
    else unmatched.push(name);
  }
  if (unmatched.length) fail(`LLVM instructions without a Sail encoding: ${unmatched.join(', ')}`);
  const used = new Set(pairs.map((p) => p.sail));
  const unpaired = sail.filter((s) => !used.has(s));
  return { pairs, llvmOnly, unpaired };
}

// ---------------------------------------------------------------- 2. one instruction

const mnemonicOf = ({ def }) => def.asm.split(/\s+/)[0];

// The registers an LLVM class lacks, within its field (compressed fields: x8-x15), for classes that restrict.
function excludedBy({ llvm, cls, compressed = false }) {
  const regClass = llvm.registerClasses[cls] ? cls : (llvm.operands[cls] || {}).regClass;
  if (!regClass || PLAIN_CLASSES.test(regClass)) return [];
  const members = new Set(llvm.registerClasses[regClass] || []);
  const range = compressed ? [8, 9, 10, 11, 12, 13, 14, 15] : Array.from({ length: 32 }, (_, n) => n);
  return range.filter((n) => !members.has(n));
}

const isFp = (cls) => /^FPR(16|32|64|128)C?$/.test(cls || '');
const regClassOf = ({ llvm, cls }) => (llvm.registerClasses[cls] ? cls : (llvm.operands[cls] || {}).regClass);

// The sheet's view of each bit, msb first: lit (origin 'sail', 'fixed' by an RV32 constraint, 'llvm' when LLVM fixes
// an operand the assembly does not have), reg, imm (bit of the value), field, any.
function sheetBits({ p, llvm }) {
  const { sail, def } = p;
  const operands = operandsOf({ def });
  return sail.bits.map((sb, i) => {
    const lb = def.inst[i];
    if (sb.kind === 'lit') return { kind: 'lit', value: sb.value, origin: sb.fixedOperand ? 'fixed' : 'sail' };
    if (!llvmBit(lb) && !(sb.kind === 'field' && SPREAD_FIELDS.includes(sb.name))) return { kind: 'lit', value: Number(lb), origin: 'llvm', operand: sb.name };
    const cls = llvmBit(lb) ? operands[llvmBit(lb).var] : null;
    if (sb.kind === 'reg') {
      // a name Sail shares between instructions (vd_or_vs3) is LLVM's
      const name = REGISTER_NAMES[sb.name] || REGISTER_NAMES[llvmBit(lb).var] || fail(`${mnemonicOf(p)}: register operand ${sb.name}`);
      const compressed = sb.cls === 'xc' || sb.cls === 'fc';
      return { kind: 'reg', name, sail: sb.name, compressed, fp: isFp(regClassOf({ llvm, cls })), vector: sb.cls === 'v', llvmClass: cls,
        exclude: excludedBy({ llvm, cls, compressed }) };
    }
    if (sb.kind === 'imm') return { kind: 'imm', value: sb.value, sail: sb.name, llvmClass: cls };
    return { kind: 'field', name: FIELD_NAMES[sb.name] || sb.name, bit: sb.bit, llvmClass: cls };
  });
}

// An instruction only LLVM has: its bits from the TableGen record, operands by their class.
function llvmOnlyBits({ def, llvm }) {
  const operands = operandsOf({ def });
  const low = {};
  def.inst.forEach((t) => {
    const lv = llvmBit(t);
    if (lv) low[lv.var] = Math.min(low[lv.var] ?? 99, lv.bit);
  });
  return def.inst.map((t) => {
    if (t === '0' || t === '1') return { kind: 'lit', value: Number(t), origin: 'sail' };
    const lv = llvmBit(t) || fail(`${def.asm}: bit ${t}`);
    const cls = operands[lv.var];
    const regClass = regClassOf({ llvm, cls });
    if (regClass === 'SR07') return { kind: 'field', name: { rs1: 'r1s', rs2: 'r2s' }[lv.var] || fail(`${def.asm}: ${lv.var}`), bit: lv.bit };
    if (regClass) {
      const compressed = /C(RV32)?$/.test(regClass);
      const name = REGISTER_NAMES[lv.var] || fail(`${def.asm}: register operand ${lv.var}`);
      return { kind: 'reg', name, sail: lv.var, compressed, fp: isFp(regClass), vector: /^VR/.test(regClass), llvmClass: cls,
        exclude: excludedBy({ llvm, cls, compressed }) };
    }
    const operand = llvm.operands[cls] || {};
    if (/IMM|PCREL/.test(operand.operandType || '') && cls !== 'loadfpimm') {
      return { kind: 'imm', value: lv.bit + encoderShift({ operand }), sail: lv.var, llvmClass: cls };
    }
    const name = { OPERAND_RLIST: 'rlist', OPERAND_STACKADJ: 'spimm', OPERAND_FRMARG: 'rm' }[operand.operandType] || { loadfpimm: 'fpimm', byteselect: 'bs' }[cls]
      || FIELD_NAMES[lv.var] || lv.var;
    return { kind: 'field', name, bit: lv.bit - low[lv.var], llvmClass: cls };
  });
}

function parseRange(text) {
  const [hi, lo = hi] = text.split(':').map(Number);
  return { hi, lo };
}

// ---------------------------------------------------------------- 3. cells

// A cell starts where the kind of bit changes, at a register or field of another name, where a literal of another
// origin starts, and at the boundaries of the format's fields (so funct3 written as `0b0 @ width_enc(width)` is one
// cell, fm | pred | succ three). `cells` in the overlay re-splits an instruction's literal runs ("7 5 ...").
function cellsOf({ bits = [], layout = [], width = 32, override = null }) {
  const boundary = new Set();
  for (const [, hi] of layout) boundary.add(width - 1 - hi);
  const cells = [];
  bits.forEach((b, i) => {
    const last = cells[cells.length - 1];
    const prev = bits[i - 1];
    const same = last && prev && b.kind === prev.kind && !boundary.has(i) && (
      (b.kind === 'lit' && (b.origin === 'fixed') === (prev.origin === 'fixed')) ||
      (b.kind === 'any') || (b.kind === 'imm') ||
      ((b.kind === 'reg' || b.kind === 'field') && b.name === prev.name));
    if (same) last.bits.push(b);
    else cells.push({ kind: b.kind, bits: [b] });
  });
  if (!override) return cells;
  // re-split: cell widths in bits, msb first; only literal and don't care runs can be cut or joined
  const out = [];
  let at = 0;
  for (const w of override.split(/\s+/).map(Number)) {
    const group = bits.slice(at, at + w);
    const cell = cells.find((c) => c.bits[0] === group[0]);
    const whole = cell && cell.bits.length === w && cell.bits.every((x, k) => x === group[k]);
    if (!whole && group.some((x) => x.kind !== group[0].kind || (x.kind !== 'lit' && x.kind !== 'any'))) fail(`cells "${override}": bits ${at}-${at + w - 1} are not one literal run`);
    out.push(whole ? cell : { kind: group[0].kind, bits: group });
    at += w;
  }
  if (at !== bits.length) fail(`cells "${override}" covers ${at} of ${bits.length} bits`);
  return out;
}

const _constraint = (ex) => (ex.length === 1 ? `!=${ex[0]}` : ex.length ? `!={${ex.join(',')}}` : '');

// A register's restriction, as short as it reads: "rd!=0", "rd!={0,2}", or the few it may be, "rs2={1,5}".
function regConstraint({ ex = [], compressed = false }) {
  const range = compressed ? 8 : 32;
  const allowed = Array.from({ length: range }, (_, n) => (compressed ? n + 8 : n)).filter((n) => !ex.includes(n));
  if (ex.length > range / 2 && allowed.length <= 4) return `={${allowed.join(',')}}`;
  return _constraint(ex);
}

function cellText({ cell, immName, excludes = {} }) {
  const b = cell.bits[0];
  if (cell.kind === 'lit') return cell.bits.map((x) => x.value).join('');
  if (cell.kind === 'any') return '-'.repeat(cell.bits.length);
  if (cell.kind === 'imm') return `${immName}[${immLabel({ bits: cell.bits.map((x) => x.sheet) })}]`;
  if (cell.kind === 'field') return b.name === 'csr' ? 'csr[11:0]' : b.name;
  const prime = b.compressed ? "'" : '';
  const name = b.name.split('/').map((n) => n + prime).join('/');
  const ex = [...new Set([...(excludes[b.name] || []), ...(b.exclude || [])])].sort((x, y) => x - y);
  return `${name}${regConstraint({ ex, compressed: b.compressed })}`;
}

// ---------------------------------------------------------------- 4. carving constraints out of HINT / reserved rows

// A HINT or reserved row of the same group that equals the instruction with exactly one operand fixed takes that
// value away from it: c.li's HINT row (rd = 00000) makes c.li's rd != 0, c.addi's (nzimm = 0) its immediate non-zero.
function carved({ bits = [], rows = [] }) {
  const result = [];
  for (const row of rows) {
    const rowBits = row.enc.split(/\s+/).flatMap((t) => (/^[01-]+$/.test(t) ? [...t] : Array(tokenWidth(t)).fill('op')));
    if (rowBits.length !== bits.length) continue;
    const fixed = {};
    let compatible = true;
    bits.forEach((b, i) => {
      const r = rowBits[i];
      // the row must lie inside the instruction: its literals agree, it has no operand where the instruction is fixed
      if (b.kind === 'lit') compatible &&= r === '-' || (r !== 'op' && Number(r) === b.value);
      else if (b.kind !== 'any' && (r === '0' || r === '1')) {
        const key = b.kind === 'imm' ? 'imm' : b.name;
        (fixed[key] ||= []).push({ b, value: Number(r) });
      }
    });
    if (!compatible) continue;
    const keys = Object.keys(fixed);
    if (keys.length !== 1) continue;
    const [key] = keys;
    const all = bits.filter((b) => (b.kind === 'imm' ? 'imm' : b.name) === key && b.kind !== 'lit');
    if (all.length !== fixed[key].length) continue;
    const value = fixed[key].reduce((v, { b, value: bit }) => (b.kind === 'imm' ? v + bit * 2 ** b.sheet : v * 2 + bit), 0);
    result.push({ key, value, kind: all[0].kind });
  }
  return result;
}

// Width of a non-literal token of an overlay row ("rd/rs1!=0" is 5, "nzimm[4:0]" 5, "rd'" 3).
function tokenWidth(token) {
  const m = token.match(/^\w+\[([\d:|]+)\]$/);
  if (m) return m[1].split('|').reduce((n, part) => {
    const [hi, lo = hi] = part.split(':').map(Number);
    return n + hi - lo + 1;
  }, 0);
  if (/'/.test(token)) return 3;
  if (/^(rd|rs1|rs2|rs3)/.test(token)) return 5;
  fail(`overlay row token "${token}" not understood`);
}

// ---------------------------------------------------------------- 5. assembly

// The sheet's assembly template from LLVM's AsmString: operands by the operand at the same bits. Operands without bits
// print what they are fixed to (sp, ra, v0, rtz); the mask, the rounding mode and vtype print as the sheets' tokens.
function assemblyOf({ name, def, bits, llvm }) {
  const operands = operandsOf({ def });
  const tokenFor = {};
  def.inst.forEach((lb, i) => {
    const lv = llvmBit(lb);
    if (!lv) return;
    const b = bits[i];
    let token;
    if (b.kind === 'reg') token = b.name.split('/')[0] + (b.compressed ? "'" : '');
    else if (b.kind === 'imm') token = 'imm';
    else if (b.kind === 'field') token = b.name;
    else return;
    (tokenFor[lv.var] ||= []).includes(token) || tokenFor[lv.var].push(token);
  });
  let rmDefault = null;
  const [, text = ''] = def.asm.match(/^\S+\s*(.*)$/);
  const asm = text.replace(/\$\{?(\w+)\}?/g, (_, op) => {
    const cls = operands[op];
    const operand = llvm.operands[cls] || {};
    if (operand.operandType === 'OPERAND_FRMARG') {
      if (operand.printer === 'printFRMArgLegacy') {
        rmDefault = 0;
        return '';
      }
      return ', rm';
    }
    if (operand.operandType === 'OPERAND_RTZARG') return ', rtz';
    if (operand.operandType === 'OPERAND_VMASK') return ', vm';
    if (operand.printer === 'printVTypeI') return 'sew, lmul, ta, ma';
    const regClass = regClassOf({ llvm, cls });
    if (!tokenFor[op] && regClass && (llvm.registerClasses[regClass] || []).length === 1) {
      const [n] = llvm.registerClasses[regClass];
      return /^VMV0$/.test(regClass) ? 'v0' : ['zero', 'ra', 'sp', 'gp', 'tp', 't0'][n] ?? `x${n}`;
    }
    const tokens = tokenFor[op] || fail(`${name}: operand ${op} has no bits`);
    if (tokens.length > 1) fail(`${name}: operand ${op} is ${tokens.join(' and ')}`);
    return operand.printer === 'printZeroOffsetMemOp' ? `(${tokens[0]})` : tokens[0];
  }).replace(/\t/g, ' ').replace(/^, /, '').trim();
  return { asm, rmDefault };
}

// ---------------------------------------------------------------- 6. pseudo-instructions

function pseudoFromAlias({ pseudo, llvm, byLlvmName }) {
  const tokens = pseudo.asm ? pseudo.asm.split(/,\s*/) : [];
  const aliases = llvm.aliases.filter((a) => a.asm.split(/\s+/)[0] === pseudo.name && byLlvmName[a.base]);
  for (const alias of aliases) {
    const names = (alias.asm.match(/\$\{?\w+\}?/g) || []).map((n) => n.replace(/[${}]/g, ''));
    const asImm = (n) => (n === 'offset' || /^imm\d*$/.test(n) ? 'imm' : n);
    const sheet = names.map(asImm);
    if (JSON.stringify(sheet) !== JSON.stringify(tokens)) continue;
    const base = byLlvmName[alias.base];
    const mapping = {};
    // alias arguments follow the base instruction's operand list, tied operands once
    const tied = new Set((base.def.constraints.match(/\$(\w+)\s*=\s*\$(\w+)/g) || []).map((c) => c.match(/\$(\w+)\s*$/)[1]));
    const list = [...base.def.outs, ...base.def.ins].filter(([, n]) => !tied.has(n));
    if (list.length !== alias.args.length) continue;
    list.forEach(([, n], k) => {
      const arg = alias.args[k];
      const key = base.keyOf[n];
      if (!key) return;
      if ('register' in arg) mapping[key] = arg.register;
      else if ('value' in arg) mapping[key] = arg.value;
      else if ('bits' in arg) mapping[key] = arg.bits;
      else {
        const name = asImm(arg.name);
        if (name !== key) mapping[key] = name;
      }
    });
    return [[base.name, mapping]];
  }
  return null;
}

// ---------------------------------------------------------------- the Unified Database

// The UDB's encoding of an instruction against ours: its match string (msb first, - for operands) must agree with our
// literal bits, wherever it fixes a bit. Instructions it does not have, or has for RV64 only, are skipped.
function checkUdb({ name, bits, udb }) {
  const entry = udb[name];
  if (!entry || !entry.match || entry.match.length !== bits.length) return false;
  bits.forEach((b, i) => {
    const m = entry.match[i];
    if (b.kind === 'lit' && m !== '-' && Number(m) !== b.value && b.origin !== 'llvm') fail(`${name}: bit ${bits.length - 1 - i} is ${b.value}, the Unified Database's ${m}`);
    // aq / rl: the UDB spells each of their values as an instruction of its own, as LLVM does
    if (b.kind !== 'lit' && b.kind !== 'any' && m !== '-' && !(b.kind === 'field' && SPREAD_FIELDS.includes(b.name))) fail(`${name}: bit ${bits.length - 1 - i} is an operand here, ${m} in the Unified Database`);
  });
  return true;
}

// ---------------------------------------------------------------- generator

// draft: return every instruction after pairing, before the overlay places them (for drafting the overlay's rows).
export function generate({ draft = false } = {}) {
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'rv32gc.json'), 'utf8'));
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'RISCV.json'), 'utf8'));
  const udb = JSON.parse(readFileSync(join(ROOT, 'spec', 'udb', 'instructions.json'), 'utf8')).instructions;
  const sail = readSail({ files: SAIL_FILES });
  const instances = sailInstructions({ sail, config: CONFIG, exclude: EXCLUDE_SAIL });
  for (const s of instances) {
    const clause = sail.clauses.find((c) => c.ctor === s.ctor && (c.kind === 'encdec' || c.kind === 'encdec_compressed'));
    s.extensions = [...new Set([clause.when, clause.lhsGuard, clause.rhsGuard].filter(Boolean).join(' ').match(/Ext_\w+/g) || [])].map((e) => e.slice(4));
  }
  const { pairs, llvmOnly, unpaired } = pair({ sail: instances, llvm });

  // 2. instructions by LLVM name
  const byDef = {};
  let udbChecked = 0;
  const entries = [
    ...pairs.map((p) => ({ name: p.name, def: p.def, sail: p.sail, bits: sheetBits({ p, llvm }) })),
    ...llvmOnly.map(({ name, def }) => ({ name, def, sail: null, bits: llvmOnlyBits({ def, llvm }) })),
  ];
  for (const e of entries) {
    const entry = { ...e, mnemonic: mnemonicOf(e), format: (e.def.format || '').replace(/^InstFormat/, ''), extension: labelOf({ def: e.def, sail: e.sail }), keyOf: {} };
    e.def.inst.forEach((lb, i) => {
      const lv = llvmBit(lb);
      const b = entry.bits[i];
      if (!lv || b.kind === 'lit') return;
      entry.keyOf[lv.var] = b.kind === 'reg' ? b.name.split('/')[0] : b.kind === 'imm' ? 'imm' : b.name;
    });
    if (checkUdb({ name: entry.mnemonic, bits: entry.bits, udb })) udbChecked++;
    else if (!e.sail) fail(`${e.name}: only LLVM has it, and the Unified Database does not (a second source is needed)`);
    byDef[e.name] = entry;
  }

  if (draft) return { byDef, unpaired, llvm };

  // 3. the overlay's rows, in its order (the decoder breaks ties by it)
  const instructions = [];
  const placed = new Set();
  const usedSail = new Set();
  // a row that only some extension brings (LPAD with Zicfilp) carves nothing out of the instructions that are always there
  const carvingRows = (groupKey) => overlay.instructions.filter((r) => r.group === groupKey && (r.hint || r.reserved) && !r.requires);
  for (const row of overlay.instructions) {
    const groupKey = row.group;
    const group = overlay.groups[groupKey] || fail(`row ${row.def || row.enc}: no group ${groupKey}`);
    const format = overlay.formats[group.format] || fail(`group ${groupKey}: no format ${group.format}`);
    if (row.hint || row.reserved) {
      if (row.sail) {
        // the row is one of the clause's encodings (NTL has four), bit for bit
        const want = bitsFromEnc({ enc: row.enc }).join('').replace(/-/g, '?');
        const sailBits = (u) => u.bits.map((b) => (b.kind === 'lit' ? String(b.value) : '?')).join('');
        const s = unpaired.find((u) => u.key === row.sail && !usedSail.has(u) && sailBits(u) === want) || fail(`row ${row.enc}: no Sail encoding ${row.sail} with these bits left`);
        usedSail.add(s);
      }
      instructions.push({ group: groupKey, name: row.reserved ? 'reserved' : 'hint', ...(row.reserved ? { reserved: true } : { hint: true }), enc: row.enc, description: row.description,
        ...(row.requires ? { requires: row.requires } : {}) });
      continue;
    }
    const entry = byDef[row.def] || fail(`group ${groupKey}: no instruction ${row.def} in Sail + LLVM`);
    const name = entry.mnemonic;
    if (placed.has(row.def)) fail(`${row.def} placed twice`);
    placed.add(row.def);
    if (entry.format !== group.format && !(group.llvmFormats || []).includes(entry.format)) fail(`${row.def}: LLVM format ${entry.format}, group ${groupKey} is ${group.format}`);
    // the bits as the sheet numbers them
    const upper = entry.bits.some((b) => b.kind === 'imm' && UPPER.includes((llvm.operands[b.llvmClass] || {}).operandType));
    const asmShift = upper ? 12 : 0;
    const bits = entry.bits.map((b) => (b.kind === 'imm' ? { ...b, sheet: b.value + asmShift } : { ...b }));
    for (const range of row.dontCare || []) {
      const { hi, lo } = parseRange(range);
      for (let bit = hi; bit >= lo; bit--) bits[bits.length - 1 - bit] = { kind: 'any' };
    }
    // reserved fields the assembly cannot set (vsetvli's vtr): zeros
    for (const field of row.zero || []) bits.forEach((b, i) => { if (b.kind === 'field' && b.name === field) bits[i] = { kind: 'lit', value: 0, origin: 'llvm' }; });
    // constraints: Sail's guards, then what the group's HINT / reserved rows carve out
    const excludes = {};
    let nonZero = false;
    for (const c of entry.sail ? entry.sail.constraints : []) {
      if (c.kind === 'oneOf') continue; // the register class says the same (sspush: ra or t0)
      // an operand LLVM spells as instructions of their own (sh1add ... sh3add) is fixed already
      if (!entry.bits.some((x) => x.sail === c.name) && entry.bits.some((x) => x.kind === 'lit' && x.operand === c.name)) continue;
      const b = entry.bits.find((x) => x.sail === c.name) || fail(`${name}: constraint on ${c.name}`);
      if (b.kind === 'imm') nonZero = true;
      else (excludes[b.name] ||= new Set()).add(c.kind === 'nonzero' ? 0 : c.value);
    }
    for (const c of carved({ bits, rows: carvingRows(groupKey) })) {
      if (c.kind !== 'imm') (excludes[c.key] ||= new Set()).add(c.value);
      else if (c.value === 0) nonZero = true;
      else fail(`${name}: a row takes immediate ${c.value} away`);
    }
    const ex = Object.fromEntries(Object.entries(excludes).map(([k, v]) => [k, [...v].sort((a, b) => a - b)]));
    // the immediate's name: shamt stays shamt; otherwise imm, u for unsigned, nz for non-zero
    const immBit = bits.find((b) => b.kind === 'imm');
    let immName = null;
    let immMin = null;
    if (immBit) {
      const operandType = (llvm.operands[immBit.llvmClass] || {}).operandType || '';
      const unsigned = /UIMM/.test(operandType) && !asmShift;
      immName = row.immName || (immBit.sail === 'shamt' ? 'shamt' : `${nonZero ? 'nz' : ''}${unsigned ? 'u' : ''}imm`);
      const ge = operandType.match(/_GE(\d+)$/);
      if (ge) immMin = Number(ge[1]);
    }
    const cells = cellsOf({ bits, layout: format.layout, width: bits.length, override: row.cells || null });
    const enc = cells.map((cell) => cellText({ cell, immName, excludes: ex })).join(' ');
    const { asm, rmDefault } = assemblyOf({ name: row.def, def: entry.def, bits, llvm });
    const fregs = ['rd', 'rs1', 'rs2', 'rs3'].filter((key) => bits.some((b) => b.kind === 'reg' && b.fp && b.name.split('/')[0] === key));
    const inst = { group: groupKey, name };
    if (entry.extension !== group.extension) inst.extension = entry.extension;
    Object.assign(inst, { enc, asm });
    if (fregs.length) inst.fregs = fregs;
    if (asmShift) inst.asmShift = asmShift;
    if (rmDefault !== null) inst.rmDefault = rmDefault;
    if (immName === 'shamt' && nonZero) inst.nonZeroImm = true;
    if (immMin !== null) inst.immMin = immMin;
    if (row.expands) inst.expands = row.expands;
    inst.description = row.description;
    inst.pseudocode = row.pseudocode;
    instructions.push(inst);
  }
  const unplaced = Object.keys(byDef).filter((n) => !placed.has(n));
  if (unplaced.length) fail(`instructions of Sail + LLVM no row places: ${unplaced.join(', ')}`);
  const leftover = unpaired.filter((u) => !usedSail.has(u));
  if (leftover.length) fail(`Sail encodings without an LLVM instruction or overlay row: ${leftover.map((u) => u.key).join(', ')}`);

  // 4. unused major opcodes: what no 32 bit instruction of RV32GC uses (the sheets drop those other extensions take)
  const gc = new Set(['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei']);
  const usedOpcodes = new Set(Object.values(byDef).filter((e) => e.bits.length === 32 && e.extension.split(/\s*\+\s*/).every((part) => part.split(/\s*\/\s*/).some((x) => gc.has(x))))
    .map((e) => e.bits.slice(25).map((b) => (b.kind === 'lit' ? b.value : '?')).join('')));
  const unused = [];
  for (let op = 3; op < 128; op += 4) {
    const bits = op.toString(2).padStart(7, '0');
    if (!usedOpcodes.has(bits)) unused.push(bits);
  }
  const listed = overlay.unusedOpcodes.map((u) => u.opcode).sort();
  if (JSON.stringify(listed) !== JSON.stringify(unused.sort())) fail(`unused opcodes: RV32GC leaves ${unused.join(' ')}, the overlay lists ${listed.join(' ')}`);

  // 5. pseudo-instructions: LLVM's aliases where it has them, the overlay's expansion otherwise
  const byLlvmName = Object.fromEntries(Object.entries(byDef).map(([n, e]) => [n, { ...e, name: e.mnemonic }]));
  const pseudoInstructions = overlay.pseudoInstructions.map((p) => {
    const fromAlias = pseudoFromAlias({ pseudo: p, llvm, byLlvmName });
    const { description, ...rest } = p;
    // li: the overlay has the long expansion (lui + addi), LLVM's alias is the short one (`short: true`)
    if (p.short === true) {
      if (!fromAlias || !p.expands) fail(`pseudo-instruction ${p.name} ${p.asm}: short needs an LLVM alias and an expansion in the overlay`);
      return { ...rest, short: fromAlias, description };
    }
    if (!fromAlias && !p.expands) fail(`pseudo-instruction ${p.name} ${p.asm}: no LLVM alias and no expansion in the overlay`);
    if (fromAlias && p.expands) {
      const same = JSON.stringify(fromAlias) === JSON.stringify(p.expands);
      fail(`pseudo-instruction ${p.name} ${p.asm}: LLVM has an alias, ${same ? 'drop the overlay\'s expansion' : `${JSON.stringify(fromAlias)} differs from the overlay's ${JSON.stringify(p.expands)}`}`);
    }
    return { ...rest, expands: fromAlias || p.expands, description };
  });

  return { formats: overlay.formats, sections: overlay.sections, extensions: overlay.extensions, groups: overlay.groups, instructions, registers: registers({ overlay, llvm }),
    unusedOpcodes: overlay.unusedOpcodes, pseudoInstructions, llvm: llvm.source, udbChecked, byDef };
}

// The registers sheet: names, ABI names and encodings of the integer and floating-point registers, and the CSRs'
// addresses, from TableGen; what they are for, and who saves them, from the overlay. A CSR's access follows from its
// address: bits 11:10 = 11 is read-only, bits 9:8 the lowest privilege that reaches it (U, S, H, M).
function registers({ overlay, llvm }) {
  const { x, f, csr, sections } = overlay.registers;
  const file = ({ prefix, about, compressedClass }) => {
    const list = llvm.registers.filter((r) => r.name.startsWith(prefix));
    const compressed = llvm.registerClasses[compressedClass] || fail(`no register class ${compressedClass}`);
    const missing = list.filter((r) => !about[r.name]).map((r) => r.name);
    const extra = Object.keys(about).filter((name) => !list.some((r) => r.name === name));
    if (missing.length || extra.length) fail(`registers: overlay lacks ${missing.join(' ')}, has extra ${extra.join(' ')}`);
    return list.map((r) => [r.name, r.abi.join(' / '), r.encoding.toString(2).padStart(5, '0'),
      compressed.includes(r.encoding) ? (r.encoding - 8).toString(2).padStart(3, '0') : '—', about[r.name].saver, about[r.name].meaning]);
  };
  const columns = ['Register', 'ABI Name', 'Encoding', "Compressed (')", 'Saver', 'Meaning'];
  const csrs = Object.entries(csr).map(([name, meaning]) => {
    const address = llvm.sysregs[name] ?? fail(`CSR ${name}: not in LLVM's system operands`);
    const access = `${'USHM'[(address >> 8) & 3]}${(address >> 10) === 3 ? 'RO' : 'RW'}`;
    return [name, `0x${address.toString(16).padStart(3, '0')}`, access, meaning];
  });
  return [
    { group: 'CPU Registers', title: 'Integer Registers (x)', columns, rows: file({ prefix: 'x', about: x, compressedClass: 'GPRC' }) },
    { group: 'Float Registers', title: 'Floating-Point Registers (f, F and D)', columns, rows: file({ prefix: 'f', about: f, compressedClass: 'FPR32C' }) },
    ...sections,
    { group: 'CSRs', title: 'Control and Status Registers (Zicsr), the ones the encoder knows by name', columns: ['CSR', 'Address', 'Access', 'Meaning'], rows: csrs },
  ];
}

export function rv32gcModule({ data = generate() } = {}) {
  return moduleText({
    header: ['Generated by tools/isa/gen-rv32gc.mjs from the Sail model (spec/sail-riscv), LLVM TableGen (spec/llvm/RISCV.json,',
      `${data.llvm.project} ${data.llvm.revision}), the RISC-V Unified Database (spec/udb) and src/isa/overlay/rv32gc.json.`,
      'Do not edit: change those and run npm run isa.'],
    exports: { formats: data.formats, sections: data.sections, extensions: data.extensions, groups: data.groups, instructions: data.instructions,
      unusedOpcodes: data.unusedOpcodes, pseudoInstructions: data.pseudoInstructions, registers: data.registers },
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) writeOrCheck({ out: OUT, text: rv32gcModule() });
