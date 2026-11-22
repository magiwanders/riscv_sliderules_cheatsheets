// Generates src/isa/generated/mips32.mjs and mips64.mjs, the instruction data of the MIPS32 and MIPS64 sheets (Release 2,
// the CPU instructions), from LLVM's Mips TableGen description (spec/llvm/Mips.json: encodings, assembly, the ISA level
// of each instruction) and src/isa/overlay/mips.json (sections, groups, descriptions, pseudocode, register names). There
// is no Sail model of MIPS: spec/unofficial/mips/mips.sail, written from MIPS Technologies' manuals, must give every
// instruction the same bits as LLVM.
//
// The two name fields differently (LLVM's imm16, shamt, size, a mem operand addr for offset(base); the manual's
// immediate, sa, msbd, ...) and LLVM encodes a branch offset or jump target without its low two bits, so the comparison
// is bit by bit up to a renaming: each Sail field comes from one LLVM operand, at a fixed distance in bit numbers. Cells
// and operand names are the Sail's, the assembly LLVM's in the Sail's names.
//
//   npm run isa          (with --check only compares with the files on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSail, sailInstructions } from './sail.mjs';
import { ROOT, fail, moduleText, writeOrCheck } from './common.mjs';
import { compare, encoding } from './llvm-sail.mjs';

const IMMEDIATES = ['imm', 'uimm', 'offset', 'target'];
// LLVM's ISA predicates: where an instruction comes from, as the sheets' ISA column says it
const LEVELS = [['HasMips64r2', 'MIPS64 R2'], ['HasMips64', 'MIPS64'], ['HasMips32r2', 'MIPS32 R2'], ['HasMips32', 'MIPS32'], ['HasMips4_32', 'MIPS IV'],
  ['HasMips3_32', 'MIPS III'], ['HasMips3', 'MIPS III'], ['HasMips2', 'MIPS II']];
const ONLY_64 = ['HasMips3', 'HasMips64', 'HasMips64r2', 'IsGP64bit'];

const level = (def) => (LEVELS.find(([p]) => def.predicates.includes(p)) || [null, 'MIPS I'])[1];
export const only64 = (def) => def.predicates.some((p) => ONLY_64.includes(p));

// "lw\t$rt, $addr" → "rt, offset(base)": LLVM's operands in the Sail's names; a mem operand is two Sail fields.
function assembly({ name, def, from, zero = [] }) {
  const [, mnemonic, rest = ''] = def.asm.match(/^(\S+)\s*(.*)$/);
  const sailOf = (v) => Object.keys(from).filter((k) => from[k] === v);
  const asm = rest.replace(/\$\$(\w+)/g, '\u0000$1').replace(/,?\s*\$(\w+)/g, (all, v) => {
    if (zero.includes(v)) return '';
    const names = sailOf(v);
    const lead = all.slice(0, all.indexOf('$'));
    if (names.length === 1) return `${lead}${names[0]}`;
    if (names.length === 2 && names.includes('base')) return `${lead}${names.find((n) => n !== 'base')}(base)`;
    return fail(`${name}: LLVM operand ${v} is ${names.length ? names.join(', ') : 'in no Sail field'}`);
  }).replace(/\u0000/g, '$');
  return { mnemonic, asm };
}

export function generate({ xlen = 32 }) {
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'mips.json'), 'utf8'));
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'Mips.json'), 'utf8'));
  const sail = readSail({ files: [join(ROOT, 'spec', 'unofficial', 'mips', 'mips.sail')] });
  const byKey = new Map(sailInstructions({ sail, config: { xlen: 0, extensions: new Set(), immediates: IMMEDIATES } }).map((s) => [s.key, s]));
  for (const k of byKey.keys()) if (!llvm.instructions[k]) fail(`${k}: in the Sail, not in LLVM`);
  const wanted = Object.entries(llvm.instructions).filter(([, def]) => xlen === 64 || !only64(def)).map(([name]) => name);
  const placed = new Set();
  const instructions = [];
  for (const row of overlay.instructions) {
    const def = llvm.instructions[row.def] || fail(`overlay row ${row.def}: no LLVM instruction`);
    if (xlen === 32 && only64(def)) continue;
    const s = byKey.get(row.def) || fail(`${row.def}: not in the Sail`);
    // zero: LLVM operands the sheet writes as 0 (Release 6's RDHWR sel)
    const from = compare({ name: row.def, s, def, llvmFixed: row.zero });
    const { mnemonic, asm } = assembly({ name: row.def, def, from, zero: row.zero });
    placed.add(row.def);
    // constraints: operand values that are no instruction (rs!=31), as the encoding's token says them
    const enc = encoding({ s }).split(' ').map((t) => (row.constraints && row.constraints[t] ? `${t}${row.constraints[t]}` : t)).join(' ');
    const out = { group: row.group, extension: row.extension ?? level(def), name: mnemonic, enc, asm: row.asm ?? asm, description: row.description, pseudocode: row.pseudocode };
    for (const key of ['posBias', 'sizeBias', 'msbBias', 'distinct']) if (row[key] !== undefined) out[key] = row[key];
    instructions.push(out);
  }
  const missing = wanted.filter((n) => !placed.has(n));
  if (missing.length) fail(`MIPS${xlen}: LLVM instructions no overlay row places: ${missing.join(', ')}`);
  // the registers of the width: o32 names on MIPS32, n64 on MIPS64 (a4-a7 where o32 has t0-t3)
  const names = overlay.registerNames[xlen];
  const operands = Object.fromEntries(Object.entries(overlay.operands).map(([k, v]) => [k, v.names === 'gpr' ? { ...v, names } : v]));
  const registers = overlay.registers.map((table) => (table.gpr ? { title: table.title, columns: table.columns, group: table.group,
    rows: names.map((n, i) => [`$${i}`, n, i.toString(2).padStart(5, '0'), table.gpr[xlen][i] ?? table.gpr.all[i]]) } : table));
  const extensions = overlay.extensions.filter((e) => instructions.some((i) => i.extension === e));
  const pseudoInstructions = overlay.pseudoInstructions.filter((p) => !p.xlen || p.xlen === xlen).map(({ xlen: _, ...p }) => p);
  // the groups the width has instructions in (MIPS32 has no doubleword shifts)
  const groups = Object.fromEntries(Object.entries(overlay.groups).filter(([key]) => instructions.some((i) => i.group === key)));
  return { formats: overlay.formats, sections: overlay.sections, extensions, operands, groups, instructions, pseudoInstructions, registers };
}

export function mipsModule({ xlen = 32, data = generate({ xlen }) } = {}) {
  return moduleText({
    header: [`Generated by tools/isa/gen-mips.mjs from LLVM's Mips TableGen (spec/llvm/Mips.json), the unofficial Sail`,
      `(spec/unofficial/mips/mips.sail) and src/isa/overlay/mips.json. Do not edit: change those and run npm run isa.`],
    exports: data,
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const xlen of [32, 64]) writeOrCheck({ out: join(ROOT, 'src', 'isa', 'generated', `mips${xlen}.mjs`), text: mipsModule({ xlen }) });
}
