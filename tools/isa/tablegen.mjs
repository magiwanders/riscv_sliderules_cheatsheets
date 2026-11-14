// Extracts what the sheets need from an LLVM target's TableGen description into a small JSON file that is committed
// (spec/llvm/<target>.json), so generating the sheets does not need an LLVM checkout. Runs llvm-tblgen --dump-json
// on the target and keeps, for the instructions and aliases a filter selects: assembly strings, operand lists, the
// encoding bit by bit, predicates, formats; for the operand classes they use: how they are encoded and printed; for
// register classes: their register numbers.
//
//   node tools/isa/tablegen.mjs --llvm ~/llvm-project --tblgen ~/llvm-project/build/bin/llvm-tblgen --target RISCV
//   node tools/isa/tablegen.mjs --llvm ~/llvm-mos --project llvm-mos/llvm-mos --tblgen ... --target MOS
//   node tools/isa/tablegen.mjs --llvm ~/llvm-project --tblgen ... --target Z80 --td spec/unofficial/z80/Z80.td \
//     --out spec/unofficial/z80/Z80.json --project unofficial
//
// The filters per target are at the end of this file.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allExtensions } from '../../src/isa/riscv-extensions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// The RISC-V predicates of ratified extensions: HasStdExtX for an extension the toggles know (or one of its parts),
// HasStdExtXOrY when one of them is, the vector predicates, RV32. Not RV64-only, vendor or draft extensions.
const _RATIFIED = new Set([...allExtensions(), 'Zca', 'Zcf', 'Zcd', 'Zmmul', 'Zaamo', 'Zalrsc', 'Zve32x', 'Zve32f', 'Zve64x', 'Zve64f', 'Zve64d']);
function _ratified(predicate) {
  if (['IsRV32', 'HasVInstructions', 'HasVInstructionsAnyF', 'HasVInstructionsI64', 'HasHalfFPLoadStoreMove', 'HasStdExtFOrZfinx'].includes(predicate)) return true;
  const m = predicate.match(/^HasStdExt(\w+)$/);
  return Boolean(m) && m[1].split(/Or(?=[A-Z])/).some((e) => _RATIFIED.has(e));
}
const ROOT = join(HERE, '..', '..');

export function dumpRecords({ tblgen = 'llvm-tblgen', llvm = '', target = 'RISCV', td = null, includes = [] }) {
  const dir = mkdtempSync(join(tmpdir(), 'tblgen-'));
  const out = join(dir, 'records.json');
  const targetDir = join(llvm, 'llvm', 'lib', 'Target', target);
  try {
    execFileSync(tblgen, ['--dump-json', '-I', join(llvm, 'llvm', 'include'), '-I', targetDir, ...includes.flatMap((i) => ['-I', i]),
      td || join(targetDir, `${target}.td`), '-o', out], { stdio: ['ignore', 'ignore', 'inherit'] });
    return JSON.parse(readFileSync(out, 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const _def = (value) => (value && typeof value === 'object' && value.kind === 'def' ? value.def : value);

// Register numbers of a register class, from its MemberList dag (add / sub / and / sequence of named registers, and
// the decimate / trunc / shl / rotl of register tuples): a tuple, such as the vector group V8M2, counts as the number of
// its first register. Names a sequence makes that are not registers (tuples of other strides) are left out.
function _members({ records, name, seen = new Set() }) {
  if (seen.has(name)) throw new Error(`register class ${name} refers to itself`);
  const record = records[name];
  if (!record) return [];
  if (!record['!superclasses'].includes('RegisterClass')) {
    if (record.HWEncoding) return [record.HWEncoding.reduce((v, bit, i) => v + (bit ? 2 ** i : 0), 0)];
    if (record.SubRegs && record.SubRegs.length) return _members({ records, name: _def(record.SubRegs[0]), seen });
    throw new Error(`${name} is neither a register class nor a register`);
  }
  const evaluate = (node) => {
    if (node.kind === 'def') return _members({ records, name: node.def, seen: new Set([...seen, name]) });
    if (node.kind !== 'dag') throw new Error(`register class ${name}: cannot read ${JSON.stringify(node)}`);
    const op = node.operator.def;
    const args = node.args.map(([value]) => value);
    if (op === 'add') return args.flatMap(evaluate);
    if (op === 'sub' || op === 'and') {
      const [first, ...rest] = args.map(evaluate);
      const others = new Set(rest.flat());
      return first.filter((n) => (op === 'sub' ? !others.has(n) : others.has(n)));
    }
    if (op === 'sequence') {
      const [format, from, to, stride = 1] = args;
      const names = [];
      const step = from <= to ? stride : -stride;
      for (let i = from; from <= to ? i <= to : i >= to; i += step) names.push(format.replace('%u', i));
      return names.flatMap((n) => _members({ records, name: n, seen: new Set([...seen, name]) }));
    }
    const [list, n] = [evaluate(args[0]), args[1]];
    if (op === 'decimate') return list.filter((_, i) => i % n === 0);
    if (op === 'trunc') return list.slice(0, n);
    if (op === 'shl') return list.slice(n);
    if (op === 'rotl') return [...list.slice(n), ...list.slice(0, n)];
    if (op === 'rotr') return [...list.slice(-n), ...list.slice(0, -n)];
    throw new Error(`register class ${name}: operator ${op} not supported`);
  };
  return evaluate(record.MemberList);
}

function _dagOperands({ dag = null }) {
  return dag ? dag.args.map(([value, name]) => [_def(value) ?? (typeof value === 'object' ? value.printable : value), name]) : [];
}

// The encoding from the msb down: '0', '1', '-' (not set) or 'name{bit}'.
function _bits({ inst = [] }) {
  return [...inst].reverse().map((b) => {
    if (b === 0 || b === 1) return String(b);
    if (b === null) return '-';
    if (b.kind === 'varbit') return `${b.var}{${b.index}}`;
    if (b.kind === 'var') return `${b.var}{0}`;
    throw new Error(`encoding bit ${JSON.stringify(b)} not understood`);
  });
}

// Compact description of a target: { instructions, aliases, operands, registerClasses }.
export function compactTarget({ records, keepInstruction = () => true, keepAlias = () => true, extra = () => ({}) }) {
  const instructions = {};
  const aliases = [];
  const used = new Set();
  for (const name of records['!instanceof'].Instruction) {
    const r = records[name];
    if (!keepInstruction({ name, record: r })) continue;
    const outs = _dagOperands({ dag: r.OutOperandList });
    const ins = _dagOperands({ dag: r.InOperandList });
    [...outs, ...ins].forEach(([cls]) => used.add(cls));
    instructions[name] = {
      asm: r.AsmString, outs, ins, inst: _bits({ inst: r.Inst }), predicates: (r.Predicates || []).map(_def), constraints: r.Constraints || '',
      format: _def(r.Format) ?? null, size: r.Size, superclasses: r['!superclasses'].filter((c) => !/^(Instruction|InstructionEncoding|Sched)$/.test(c)),
    };
  }
  for (const name of records['!instanceof'].InstAlias) {
    const r = records[name];
    const result = r.ResultInst;
    const base = result.operator.def;
    if (!instructions[base] || !keepAlias({ record: r })) continue;
    const args = result.args.map(([value, name]) => {
      if (Array.isArray(value)) return { bits: value.reduce((v, bit, i) => v + bit * 2 ** i, 0) };
      if (typeof value === 'number') return { value };
      const cls = _def(value);
      if (records[cls] && records[cls]['!superclasses'].includes('Register') && !name) return { register: _members({ records, name: cls })[0] };
      used.add(cls);
      return { cls, name };
    });
    aliases.push({ asm: r.AsmString, base, args, predicates: (r.Predicates || []).map(_def), priority: r.EmitPriority });
  }
  const operands = {};
  const registerClasses = {};
  for (const cls of [...used].filter((c) => records[c]).sort()) {
    const r = records[cls];
    const sc = r['!superclasses'];
    if (sc.includes('RegisterClass')) {
      registerClasses[cls] = _members({ records, name: cls });
      continue;
    }
    const regClass = _def(r.RegClass);
    if (regClass) registerClasses[regClass] = _members({ records, name: regClass });
    operands[cls] = {
      regClass: regClass ?? null, operandType: r.OperandType ?? null, encoder: r.EncoderMethod || null, decoder: r.DecoderMethod || null,
      printer: r.PrintMethod || null, parser: _def(r.ParserMatchClass) ?? null, superclasses: sc.filter((c) => !/^(DAGOperand|Operand)$/.test(c)),
    };
  }
  return { instructions, aliases, operands, registerClasses, ...extra({ records }) };
}

// ---------------------------------------------------------------- targets

const TARGETS = {
  // RV32 with every ratified extension of the toggles (src/isa/riscv-extensions.mjs) and their parts, without the AQ / RL
  // copies of the atomics (aq and rl are fields on the sheet), RV64-only and code generation pseudos.
  RISCV: {
    keepInstruction: ({ name, record }) => {
      if (record.isPseudo || record.isCodeGenOnly || !record['!superclasses'].includes('RVInstCommon')) return false;
      if (/_(AQ|RL|AQRL)$/.test(name)) return false;
      return (record.Predicates || []).every((p) => _ratified(_def(p)));
    },
    keepAlias: ({ record }) => (record.Predicates || []).every((p) => _ratified(_def(p))),
    // the registers sheet: integer and floating-point registers with their ABI names, and the CSRs' addresses
    extra: ({ records }) => {
      const number = (bits) => bits.reduce((v, bit, i) => v + bit * 2 ** i, 0);
      const registers = Object.entries(records).filter(([name, r]) => r && r.Namespace === 'RISCV' && /^(X\d+|F\d+_F)$/.test(name) && r['!superclasses'].includes('Register'))
        .map(([name, r]) => ({ def: name, name: r.AsmName, abi: r.AltNames || [], encoding: number(r.HWEncoding) }))
        .sort((a, b) => a.name[0].localeCompare(b.name[0]) || a.encoding - b.encoding);
      const sysregs = Object.fromEntries(records['!instanceof'].SysReg.map((n) => records[n]).filter((r) => !r.isAltName && !r.isDeprecatedName)
        .map((r) => [r.Name, number(r.Encoding)]).sort(([, a], [, b]) => a - b));
      return { registers, sysregs };
    },
  },
  // The NMOS 6502 of llvm-mos: what its disassembler decodes on a plain 6502 (the MOS namespace, so not the 65816's
  // 16 bit immediates), without the instructions only its assembler accepts (brk #imm).
  MOS: {
    keepInstruction: ({ record }) => record.Namespace === 'MOS' && !record.isPseudo && !record.isCodeGenOnly && !record.isAsmParserOnly &&
      record.DecoderNamespace === 'MOS' && (record.Predicates || []).map(_def).join() === 'Has6502',
    keepAlias: () => false,
  },
  // The unofficial descriptions of spec/unofficial (--td spec/unofficial/z80/Z80.td, .../hack/Hack.td).
  Z80: { keepInstruction: ({ record }) => record.Namespace === 'Z80', keepAlias: () => false },
  Hack: { keepInstruction: ({ record }) => record.Namespace === 'Hack', keepAlias: () => false },
};

function _arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = _arg('target') || 'RISCV';
  const llvm = _arg('llvm');
  if (!llvm) throw new Error('--llvm <llvm-project checkout> is required');
  const tblgen = _arg('tblgen') || 'llvm-tblgen';
  const version = execFileSync(tblgen, ['--version'], { encoding: 'utf8' }).match(/version\s+(\S+)/)[1];
  const revision = _arg('td') ? _arg('td') : (() => {
    try {
      return execFileSync('git', ['-C', llvm, 'describe', '--tags', '--always'], { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  })();
  const records = dumpRecords({ tblgen, llvm, target, td: _arg('td') });
  const compact = compactTarget({ records, ...TARGETS[target] });
  const out = _arg('out') || join(ROOT, 'spec', 'llvm', `${target}.json`);
  writeFileSync(out, `${JSON.stringify({ source: { project: _arg('project') || 'llvm/llvm-project', revision, tblgen: version, target }, ...compact }, null, 1)}\n`);
  console.log(`${out}: ${Object.keys(compact.instructions).length} instructions, ${compact.aliases.length} aliases`);
}
