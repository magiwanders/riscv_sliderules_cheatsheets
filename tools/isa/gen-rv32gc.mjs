// Generates src/isa/generated/rv32gc.mjs, the instruction data of the RV32GC sheets, from
//   - the official Sail model (spec/sail-riscv): which instructions RV32GC has and their encodings, bit by bit;
//   - LLVM's TableGen description (spec/llvm/RISCV.json): mnemonics, assembly syntax, register classes, how immediates
//     are scaled, the formats, the aliases behind the pseudo-instructions;
//   - the overlay (src/isa/overlay/rv32gc.json): what neither has (sections, groups, titles, descriptions, HINT and
//     reserved rows, the order of rows, unused opcodes).
// The two sources are checked against each other bit by bit; any disagreement, or an instruction one of them has and
// the overlay does not place, stops the generator. The rules turning them into cells are in the README ("How the
// sheets are drawn").
//
//   npm run isa          (node tools/isa/gen-rv32gc.mjs; --check only compares with the file on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSail, sailInstructions } from './sail.mjs';
import { ROOT, moduleText, writeOrCheck } from './common.mjs';

const OUT = join(ROOT, 'src', 'isa', 'generated', 'rv32gc.mjs');

export const SAIL_FILES = ['prelude/prelude.sail', 'core/types.sail', 'core/regs.sail', 'extensions/I/base_insts.sail', 'extensions/M/mext_insts.sail',
  'extensions/A/aext_types.sail', 'extensions/A/zaamo_insts.sail', 'extensions/A/zalrsc_insts.sail', 'extensions/FD/freg_type.sail',
  'extensions/FD/fdext_regs.sail', 'extensions/FD/fext_insts.sail', 'extensions/FD/dext_insts.sail', 'extensions/FD/zcf_insts.sail',
  'extensions/FD/zcd_insts.sail', 'extensions/C/zca_insts.sail', 'extensions/Zicsr/zicsr_insts.sail', 'extensions/Zifencei/zifencei_insts.sail',
  'extensions/Zihintpause/zihintpause_insts.sail'].map((f) => join(ROOT, 'spec', 'sail-riscv', 'model', f));

const CONFIG = { xlen: 32, extensions: new Set(['I', 'M', 'Zmmul', 'A', 'Zaamo', 'Zalrsc', 'F', 'D', 'Zca', 'Zcf', 'Zcd', 'Zicsr', 'Zifencei', 'Zihintpause']) };

// Left out of the sheets: privileged instructions (Sail and LLVM), LLVM's HINT and prefetch spellings of base
// instructions, which the overlay's HINT rows show, and the unimp aliases of illegal encodings.
const EXCLUDE_SAIL = ['MRET', 'SRET', 'WFI', 'SFENCE_VMA'];
const EXCLUDE_LLVM = ['MRET', 'SRET', 'DRET', 'WFI', 'SFENCE_VMA', 'C_NOP_HINT', 'C_UNIMP', 'UNIMP', 'PREFETCH_I', 'PREFETCH_R', 'PREFETCH_W'];

// The extension an instruction belongs to, from its LLVM predicates and the extensions its Sail guards ask for.
const EXTENSION_LABELS = [['Zcd', 'C + D'], ['Zcf', 'C + F'], ['Zca', 'C'], ['D', 'D'], ['F', 'F'], ['Zaamo', 'A'], ['Zalrsc', 'A'], ['M', 'M'],
  ['Zmmul', 'M'], ['Zicsr', 'Zicsr'], ['Zifencei', 'Zifencei']];

// Sail operand names as the sheets (and the spec's tables) write them.
const REGISTER_NAMES = { rd: 'rd', rs1: 'rs1', rs2: 'rs2', rs3: 'rs3', rs: 'rs1', rsd: 'rd/rs1' };
// Immediates whose assembly writes the upper 20 bits: the sheet numbers their bits as the 32 bit value (imm[31:12]).
const UPPER = ['OPERAND_UIMM20_LUI', 'OPERAND_UIMM20_AUIPC', 'OPERAND_CLUI_IMM'];
// Fields aq / rl stay fields: LLVM spells each of their values as an instruction of its own (AMOADD_W_AQ, ...).
const SPREAD_FIELDS = ['aq', 'rl'];

// ---------------------------------------------------------------- helpers

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

function bitsFromEnc({ enc = '' }) {
  // literal / don't care / other, msb first, for comparing overlay rows with Sail
  return enc.split(/\s+/).flatMap((t) => (/^[01-]+$/.test(t) ? [...t] : null)).filter((b) => b !== null);
}

// ---------------------------------------------------------------- 1. Sail ↔ LLVM

function pair({ sail = [], llvm = {} }) {
  const defs = Object.entries(llvm.instructions).filter(([name]) => !EXCLUDE_LLVM.includes(name));
  const pairs = [];
  const unpaired = [];
  for (const s of sail) {
    const candidates = [];
    for (const [name, def] of defs) {
      if (def.size * 8 !== s.width) continue;
      const operands = Object.fromEntries([...def.outs, ...def.ins].map(([cls, n]) => [n, cls]));
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
          ok = Boolean(sb.fixedOperand);
        } else {
          const cls = operands[lv.var];
          const expected = sb.kind === 'imm' ? sb.value : sb.bit;
          const shift = sb.kind === 'imm' ? encoderShift({ operand: llvm.operands[cls] || {} }) : 0;
          if (lv.bit + shift !== expected) ok = false;
          const key = `${sb.kind}:${sb.name}`;
          if (links[key] && links[key] !== lv.var) ok = false;
          links[key] = lv.var;
        }
      }
      if (ok) candidates.push({ name, def, links, fixedByLlvm });
    }
    candidates.sort((a, b) => a.fixedByLlvm - b.fixedByLlvm);
    if (!candidates.length || (candidates[1] && candidates[1].fixedByLlvm === candidates[0].fixedByLlvm)) {
      unpaired.push({ sail: s, candidates: candidates.map((c) => c.name) });
      continue;
    }
    pairs.push({ sail: s, ...candidates[0] });
  }
  const used = new Set(pairs.map((p) => p.name));
  const missing = defs.map(([name]) => name).filter((n) => !used.has(n));
  if (missing.length) fail(`LLVM instructions without a Sail encoding: ${missing.join(', ')}`);
  const twice = pairs.map((p) => p.name).filter((n, i, all) => all.indexOf(n) !== i);
  if (twice.length) fail(`LLVM instructions matching several Sail encodings: ${[...new Set(twice)].join(', ')}`);
  return { pairs, unpaired };
}

// ---------------------------------------------------------------- 2. one instruction

const mnemonicOf = ({ def }) => def.asm.split(/\s+/)[0];

function extensionOf({ def, sail }) {
  const names = new Set(def.predicates.map((p) => p.replace(/^HasStdExt/, '')));
  for (const [ext] of EXTENSION_LABELS) if (sail.extensions.includes(ext)) names.add(ext);
  const hit = EXTENSION_LABELS.find(([ext]) => names.has(ext));
  return hit ? hit[1] : 'I';
}

// The sheet's view of each bit, msb first: lit (origin 'sail', 'fixed' by an RV32 constraint, 'llvm' when LLVM fixes
// an operand the assembly does not have), reg, imm (bit of the value), field, any.
function sheetBits({ p }) {
  const { sail, def } = p;
  const operands = Object.fromEntries([...def.outs, ...def.ins].map(([cls, n]) => [n, cls]));
  return sail.bits.map((sb, i) => {
    const lb = def.inst[i];
    if (sb.kind === 'lit') return { kind: 'lit', value: sb.value, origin: sb.fixedOperand ? 'fixed' : 'sail' };
    if (!llvmBit(lb) && !(sb.kind === 'field' && SPREAD_FIELDS.includes(sb.name))) return { kind: 'lit', value: Number(lb), origin: 'llvm', operand: sb.name };
    if (sb.kind === 'reg') {
      const name = REGISTER_NAMES[sb.name] || fail(`${mnemonicOf(p)}: register operand ${sb.name}`);
      return { kind: 'reg', name, sail: sb.name, compressed: sb.cls === 'xc' || sb.cls === 'fc', fp: sb.cls === 'f' || sb.cls === 'fc' };
    }
    if (sb.kind === 'imm') {
      const cls = operands[llvmBit(lb).var];
      return { kind: 'imm', value: sb.value, sail: sb.name, llvmClass: cls };
    }
    return { kind: 'field', name: sb.name };
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

function cellText({ cell, immName, excludes = {} }) {
  const b = cell.bits[0];
  if (cell.kind === 'lit') return cell.bits.map((x) => x.value).join('');
  if (cell.kind === 'any') return '-'.repeat(cell.bits.length);
  if (cell.kind === 'imm') return `${immName}[${immLabel({ bits: cell.bits.map((x) => x.sheet) })}]`;
  if (cell.kind === 'field') return b.name === 'csr' ? 'csr[11:0]' : b.name;
  const prime = b.compressed ? "'" : '';
  const name = b.name.split('/').map((n) => n + prime).join('/');
  const ex = excludes[b.name] || [];
  return `${name}${ex.length === 1 ? `!=${ex[0]}` : ex.length ? `!={${ex.join(',')}}` : ''}`;
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

// The sheet's assembly template from LLVM's AsmString: operands by the Sail operand at the same bits.
function assemblyOf({ p, bits, llvm }) {
  const { def } = p;
  const operands = Object.fromEntries([...def.outs, ...def.ins].map(([cls, n]) => [n, cls]));
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
    tokenFor[lv.var] = token;
  });
  let rmDefault = null;
  const [, text = ''] = def.asm.match(/^\S+\s*(.*)$/);
  const asm = text.replace(/\$\{?(\w+)\}?/g, (_, name) => {
    const cls = operands[name];
    const operand = llvm.operands[cls] || {};
    if (operand.operandType === 'OPERAND_FRMARG') {
      if (operand.printer === 'printFRMArgLegacy') {
        rmDefault = 0;
        return '';
      }
      return ', rm';
    }
    if (cls === 'SP' || operand.regClass === 'SP') return 'sp';
    const token = tokenFor[name] || fail(`${mnemonicOf(p)}: operand ${name} has no bits`);
    return operand.printer === 'printZeroOffsetMemOp' ? `(${token})` : token;
  }).replace(/\t/g, ' ').trim();
  return { asm, rmDefault };
}

// ---------------------------------------------------------------- 6. pseudo-instructions

function pseudoFromAlias({ pseudo, llvm, byLlvmName }) {
  const tokens = pseudo.asm ? pseudo.asm.split(/,\s*/) : [];
  const aliases = llvm.aliases.filter((a) => a.asm.split(/\s+/)[0] === pseudo.name && byLlvmName[a.base]);
  for (const alias of aliases) {
    const names = (alias.asm.match(/\$\{?\w+\}?/g) || []).map((n) => n.replace(/[${}]/g, ''));
    const sheet = names.map((n) => (n === 'offset' ? 'imm' : n));
    if (JSON.stringify(sheet) !== JSON.stringify(tokens)) continue;
    const base = byLlvmName[alias.base];
    const llvmOperands = [...base.def.outs, ...base.def.ins];
    const mapping = {};
    // alias arguments follow the base instruction's operand list, tied operands once
    const tied = new Set((base.def.constraints.match(/\$(\w+)\s*=\s*\$(\w+)/g) || []).map((c) => c.match(/\$(\w+)\s*$/)[1]));
    const list = llvmOperands.filter(([, n]) => !tied.has(n));
    if (list.length !== alias.args.length) continue;
    list.forEach(([cls, n], k) => {
      const arg = alias.args[k];
      const key = base.keyOf[n];
      if (!key) return;
      if ('register' in arg) mapping[key] = arg.register;
      else if ('value' in arg) mapping[key] = arg.value;
      else if ('bits' in arg) mapping[key] = arg.bits;
      else {
        const name = arg.name === 'offset' ? 'imm' : arg.name;
        if (name !== key) mapping[key] = name;
      }
    });
    return [[base.name, mapping]];
  }
  return null;
}

// ---------------------------------------------------------------- generator

export function generate() {
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'rv32gc.json'), 'utf8'));
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'RISCV.json'), 'utf8'));
  const sail = readSail({ files: SAIL_FILES });
  const instances = sailInstructions({ sail, config: CONFIG, exclude: EXCLUDE_SAIL });
  for (const s of instances) {
    const clause = sail.clauses.find((c) => c.ctor === s.ctor && (c.kind === 'encdec' || c.kind === 'encdec_compressed'));
    s.extensions = [...new Set([clause.when, clause.lhsGuard, clause.rhsGuard].filter(Boolean).join(' ').match(/Ext_\w+/g) || [])].map((e) => e.slice(4));
  }
  const { pairs, unpaired } = pair({ sail: instances, llvm });

  // 2. instructions by mnemonic
  const byName = {};
  const byLlvmName = {};
  for (const p of pairs) {
    const name = mnemonicOf(p);
    const bits = sheetBits({ p });
    const entry = { name, p, bits, format: (p.def.format || '').replace(/^InstFormat/, ''), extension: extensionOf(p), keyOf: {} };
    p.def.inst.forEach((lb, i) => {
      const lv = llvmBit(lb);
      const b = bits[i];
      if (!lv) return;
      entry.keyOf[lv.var] = b.kind === 'reg' ? b.name.split('/')[0] : b.kind === 'imm' ? 'imm' : b.name;
    });
    if (byName[name]) fail(`two instructions called ${name}`);
    byName[name] = entry;
    byLlvmName[p.name] = { ...entry, def: p.def, name };
  }

  // 3. the overlay's rows, in its order (the decoder breaks ties by it)
  const instructions = [];
  const placed = new Set();
  const usedSail = new Set();
  const carvingRows = (groupKey) => overlay.instructions.filter((r) => r.group === groupKey && (r.hint || r.reserved));
  for (const row of overlay.instructions) {
    const groupKey = row.group;
    const group = overlay.groups[groupKey] || fail(`row ${row.name || row.enc}: no group ${groupKey}`);
    const format = overlay.formats[group.format] || fail(`group ${groupKey}: no format ${group.format}`);
    if (row.hint || row.reserved) {
      if (row.sail) {
        const s = unpaired.find((u) => u.sail.ctor === row.sail) || fail(`row ${row.enc}: no Sail encoding ${row.sail} left`);
        const sailBits = s.sail.bits.map((b) => (b.kind === 'lit' ? String(b.value) : '?')).join('');
        if (sailBits !== bitsFromEnc({ enc: row.enc }).join('')) fail(`row ${row.enc} differs from Sail ${row.sail} (${sailBits})`);
        usedSail.add(row.sail);
      }
      instructions.push({ group: groupKey, name: row.reserved ? 'reserved' : 'hint', ...(row.reserved ? { reserved: true } : { hint: true }), enc: row.enc, description: row.description });
      continue;
    }
    const { name } = row;
    const entry = byName[name] || fail(`group ${groupKey}: no instruction ${name} in Sail + LLVM`);
    if (placed.has(name)) fail(`${name} placed twice`);
    placed.add(name);
    if (entry.format !== group.format) fail(`${name}: LLVM format ${entry.format}, group ${groupKey} is ${group.format}`);
    // the bits as the sheet numbers them
    const upper = entry.bits.some((b) => b.kind === 'imm' && UPPER.includes((llvm.operands[b.llvmClass] || {}).operandType));
    const asmShift = upper ? 12 : 0;
    const bits = entry.bits.map((b) => (b.kind === 'imm' ? { ...b, sheet: b.value + asmShift } : { ...b }));
    for (const range of row.dontCare || []) {
      const { hi, lo } = parseRange(range);
      for (let bit = hi; bit >= lo; bit--) bits[bits.length - 1 - bit] = { kind: 'any' };
    }
    // constraints: Sail's guards, then what the group's HINT / reserved rows carve out
    const excludes = {};
    let nonZero = false;
    for (const c of entry.p.sail.constraints) {
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
    if (immBit) {
      const unsigned = /UIMM/.test((llvm.operands[immBit.llvmClass] || {}).operandType || '') && !asmShift;
      immName = row.immName || (immBit.sail === 'shamt' ? 'shamt' : `${nonZero ? 'nz' : ''}${unsigned ? 'u' : ''}imm`);
    }
    const cells = cellsOf({ bits, layout: format.layout, width: bits.length, override: row.cells || null });
    const enc = cells.map((cell) => cellText({ cell, immName, excludes: ex })).join(' ');
    const { asm, rmDefault } = assemblyOf({ p: entry.p, bits, llvm });
    const fregs = ['rd', 'rs1', 'rs2', 'rs3'].filter((key) => bits.some((b) => b.kind === 'reg' && b.fp && b.name.split('/')[0] === key));
    const inst = { group: groupKey, name };
    if (entry.extension !== group.extension) inst.extension = entry.extension;
    Object.assign(inst, { enc, asm });
    if (fregs.length) inst.fregs = fregs;
    if (asmShift) inst.asmShift = asmShift;
    if (rmDefault !== null) inst.rmDefault = rmDefault;
    if (immName === 'shamt' && nonZero) inst.nonZeroImm = true;
    if (row.expands) inst.expands = row.expands;
    inst.description = row.description;
    inst.pseudocode = row.pseudocode;
    instructions.push(inst);
  }
  const unplaced = Object.keys(byName).filter((n) => !placed.has(n));
  if (unplaced.length) fail(`instructions of Sail + LLVM no group places: ${unplaced.join(', ')}`);
  const leftover = unpaired.filter((u) => !usedSail.has(u.sail.ctor));
  if (leftover.length) fail(`Sail encodings without an LLVM instruction or overlay row: ${leftover.map((u) => `${u.sail.ctor} (${u.candidates.join('/') || 'no candidate'})`).join(', ')}`);

  // 4. unused major opcodes: what no 32 bit instruction uses
  const usedOpcodes = new Set(instances.filter((s) => s.width === 32).map((s) => s.bits.slice(25).map((b) => (b.kind === 'lit' ? b.value : '?')).join('')));
  const unused = [];
  for (let op = 3; op < 128; op += 4) {
    const bits = op.toString(2).padStart(7, '0');
    if (!usedOpcodes.has(bits)) unused.push(bits);
  }
  const listed = overlay.unusedOpcodes.map((u) => u.opcode).sort();
  if (JSON.stringify(listed) !== JSON.stringify(unused.sort())) fail(`unused opcodes: Sail leaves ${unused.join(' ')}, the overlay lists ${listed.join(' ')}`);

  // 5. pseudo-instructions: LLVM's aliases where it has them, the overlay's expansion otherwise
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

  return { formats: overlay.formats, sections: overlay.sections, extensions: overlay.extensions, groups: overlay.groups, instructions, registers: registers({ overlay, llvm }), unusedOpcodes: overlay.unusedOpcodes, pseudoInstructions, llvm: llvm.source };
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
    { title: 'Integer Registers (x)', columns, rows: file({ prefix: 'x', about: x, compressedClass: 'GPRC' }) },
    { title: 'Floating-Point Registers (f, F and D)', columns, rows: file({ prefix: 'f', about: f, compressedClass: 'FPR32C' }) },
    ...sections,
    { title: 'Control and Status Registers (Zicsr), the ones the encoder knows by name', columns: ['CSR', 'Address', 'Access', 'Meaning'], rows: csrs },
  ];
}

export function rv32gcModule({ data = generate() } = {}) {
  return moduleText({
    header: ['Generated by tools/isa/gen-rv32gc.mjs from the Sail model (spec/sail-riscv), LLVM TableGen (spec/llvm/RISCV.json,',
      `${data.llvm.project} ${data.llvm.revision}) and src/isa/overlay/rv32gc.json. Do not edit: change those and run npm run isa.`],
    exports: { formats: data.formats, sections: data.sections, extensions: data.extensions, groups: data.groups, instructions: data.instructions,
      unusedOpcodes: data.unusedOpcodes, pseudoInstructions: data.pseudoInstructions, registers: data.registers },
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) writeOrCheck({ out: OUT, text: rv32gcModule() });
