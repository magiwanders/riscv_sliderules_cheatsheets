// Generates the x86 sheets' data, src/isa/generated/{i8086,ia32,x86_64}.mjs, and their unofficial Sail
// (spec/unofficial/x86/), from the typed opcode table of src/isa/overlay/x86.json: the instructions as Intel's opcode
// tables write them ("01 /r  add r/mv, rv", "B8+r iv  mov rv, immv", "83 /0 ib"), with the operand size v as a
// parameter, each with the LLVM X86 records it is.
//
// For each sheet (a mode: 16 bit for the 8086, 32 for IA-32, 64 for x86-64) every line becomes a line per operand size
// with the prefix that size takes in that mode (66, REX.W). LLVM's X86 TableGen has no Inst bits: its records give the
// opcode, map (0F), form (ModRM register / memory, +r, raw), operand and address size, prefixes, immediate and the modes
// they exist in, from which the generator derives what each line must be and checks it (spec/llvm/X86.json). The rows
// per addressing form are made by src/isa/x86.mjs when a sheet loads.
//
//   npm run isa          (with --check only compares with the files on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, fail, moduleText, writeOrCheck } from './common.mjs';
import { parseOpcode, expandLine, accumulator } from '../../src/isa/x86.mjs';

// The sheets: their mode and the CPUs whose instructions they hold.
export const SETS = {
  i8086: { mode: 16, title: 'Intel 8086', keep: (line) => line.since === '8086' },
  ia32: { mode: 32, title: 'IA-32 (the integer and system instructions up to the Pentium Pro)', keep: (line) => line.since !== 'x86-64' },
  x86_64: { mode: 64, title: 'x86-64 (the integer and system instructions of 64 bit mode)', keep: () => true },
};

// The operand sizes a line has per mode; for 64 bit operands REX.W, but for the lines that are 64 bit by default.
const SIZES = {
  SZ: { 16: [16], 32: [32, 16], 64: [32, 16, 64] }, SZ32: { 16: [16], 32: [32, 16], 64: [32, 16] }, X16: { 32: [32], 64: [32, 64] }, W64: { 64: [64] },
  D64: { 16: [16], 32: [32, 16], 64: [64, 16] }, N: { 16: [16], 32: [32], 64: [64] }, F64: { 16: [16], 32: [32], 64: [64] }, FAR: { 16: [16], 32: [32], 64: [32, 64] },
  CR: { 32: [32], 64: [64] },
  // moves to a segment register: the operand size does not matter, assemblers write no 66 (mov ds, ax is mov ds, eax)
  SREG: { 16: [16], 32: [32], 64: [32] },
};
const DEFAULT64 = new Set(['D64', 'N', 'F64', 'CR']);
const NAMES = { 8: 'byte', 16: 'word', 32: 'doubleword', 64: 'quadword' };
const REGS = { A: 'AX', B: 'BX', C: 'CX', D: 'DX', SP: 'SP', BP: 'BP', SI: 'SI', DI: 'DI', IP: 'IP' };
const wide = (name, size) => (size === 16 ? name : `${size === 32 ? 'E' : 'R'}${name}`);

function _fill({ text, v, mode }) {
  const operand = v ?? (mode === 16 ? 16 : 32);
  return text.replace(/\{size\}/g, NAMES[operand]).replace(/\{Size\}/g, NAMES[operand][0].toUpperCase() + NAMES[operand].slice(1)).replace(/\{bytes\}/g, String(operand / 8))
    .replace(/\{(A|B|C|D)\}/g, (_, r) => wide(REGS[r], operand)).replace(/\{(SP|BP|SI|DI|IP|CX|BX)\}/g, (_, r) => wide(r, mode)).replace(/\{v\}/g, String(operand));
}

// One line of the table as the lines of a mode: [{ op, asm, llvm, size, ... }].
export function resolve({ line, mode }) {
  const sizes = line.sizes ? SIZES[line.sizes][mode] || [] : [undefined];
  return sizes.map((v) => {
    const prefix = v === undefined ? '' : mode === 16 ? (v === 16 ? '' : '66') : v === 16 ? '66' : v === 64 && !DEFAULT64.has(line.sizes) ? 'REX.W' : '';
    let asm = typeof line.asm === 'string' ? line.asm : line.asm[v];
    if (asm === undefined) fail(`${line.op}: no assembly for ${v} bit operands`);
    // in 32 / 64 bit mode the 16 bit forms of the instructions without operands to tell their size end in w (pushfw)
    if (mode !== 16 && v === 16 && typeof line.asm !== 'string' && /^(pushf|popf|ret|retf|iret)\b/.test(asm)) asm = asm.replace(/^(\w+)/, '$1w');
    if (mode === 64 && line.mnemonic64) asm = asm.replace(/^\w+/, line.mnemonic64);
    if (v !== undefined) {
      asm = asm.replace(/r\/mv\b/g, `r/m${v}`).replace(/\brv\b/g, `r${v}`).replace(/\bAv\b/g, accumulator[v]).replace(/\bimmz\b/g, v === 16 ? 'imm16' : v === 32 ? 'imm32' : 'simm32')
        .replace(/\bimmv\b/g, `imm${v}`).replace(/\brelz\b/g, v === 16 ? 'rel16' : 'rel32').replace('[moffsv]', `[moffs${v}]`).replace(/m16:v\b/, `m16:${v}`).replace(/ptr16:v\b/, `ptr16:${v}`);
    }
    let op = line.op.replace(/\biz\b/, v === 16 ? 'iw' : 'id').replace(/\biv\b/, { 16: 'iw', 32: 'id', 64: 'io' }[v]).replace(/\bcz\b/, v === 16 ? 'cw' : 'cd');
    if (prefix) op = `${prefix} ${op}`;
    // the records: one list, or a list per operand size ("32@64": LLVM's own records of a size in 64 bit mode)
    const names = Array.isArray(line.llvm) ? line.llvm : line.llvm[`${v}@${mode}`] || line.llvm[v ?? mode] || fail(`${line.op} ${asm}: no LLVM records for ${v ?? mode}`);
    const llvm = names.map((n) => n.replace(/\{v\}/g, String(v)).replace(/\{z\}/g, String(Math.min(v, 32))).replace(/\{a\}/g, String(mode)).replace(/\{r32\}/g, v === 64 ? '32' : ''));
    const out = { op, asm, llvm, group: line.group, class: line.class, description: _fill({ text: line.description, v, mode }), pseudocode: _fill({ text: line.pseudocode || '', v, mode }),
      flags: line.flags || '' };
    if (line.forms) out.forms = line.forms;
    // a register the +r opcode cannot have (90 is nop, not xchg ax, ax)
    if (line.plusNot !== undefined) out.plusNot = line.plusNot;
    // a 64 bit immediate or address: as far as a JavaScript number is exact
    if (/\bio\b/.test(op) || (mode === 64 && /moffs/.test(asm))) out.immMax = Number.MAX_SAFE_INTEGER;
    return out;
  });
}

const _overlay = () => JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'x86.json'), 'utf8'));
export const linesOf = ({ set, overlay = _overlay() }) => overlay.instructions.filter((line) => SETS[set].keep(line) && (line.modes || [16, 32, 64]).includes(SETS[set].mode))
  .flatMap((line) => resolve({ line, mode: SETS[set].mode }));
// Every LLVM record the sheets name (what tools/isa/tablegen.mjs keeps of LLVM's X86 records).
export const llvmNames = () => [...new Set(Object.keys(SETS).flatMap((set) => linesOf({ set }).flatMap((line) => line.llvm)))].sort();

// ---------------------------------------------------------------- the check against LLVM

const IMM = { NoImm: [], Imm8: ['i8'], Imm8Reg: ['i8'], Imm8PCRel: ['c8'], Imm16: ['i16'], Imm16PCRel: ['c16'], Imm32: ['i32'], Imm32PCRel: ['c32'], Imm32S: ['i32'], Imm64: ['i64'] };
const TAIL = { ib: 'i8', iw: 'i16', id: 'i32', io: 'i64', cb: 'c8', cw: 'c16', cd: 'c32' };
// What LLVM's record says the bytes are in a mode: prefixes, opcode bytes (0F for its two byte map), ModRM ('r', a
// fixed /n, or none), +r / +cc, what follows.
function llvmShape({ name, def, mode }) {
  if (mode === 64 && def.predicates.includes('Not64BitMode')) fail(`${name} does not exist in 64 bit mode`);
  if (mode !== 64 && def.predicates.includes('In64BitMode')) fail(`${name} exists only in 64 bit mode`);
  if ((def.adsz === 'AdSize16' && mode !== 16) || (def.adsz === 'AdSize32' && mode !== 32) || (def.adsz === 'AdSize64' && mode !== 64)) {
    if (def.form !== 'RawFrmMemOffs') fail(`${name} takes a ${def.adsz} address size prefix in ${mode} bit mode`);
  }
  const prefix = [];
  if ((def.opsz === 'OpSize16' && mode !== 16) || (def.opsz === 'OpSize32' && mode === 16)) prefix.push('66');
  if (def.rexw) prefix.push('REX.W');
  // PS: no mandatory prefix either (the SSE-era name)
  if (def.pfx !== 'NoPrfx' && def.pfx !== 'PS') fail(`${name}: prefix ${def.pfx} not expected`);
  const bytes = [...(def.map === 'TB' ? [0x0f] : []), def.op];
  let modrm = null;
  let plus = null;
  let m;
  if (/^MRM(Dest|Src)(Reg|Mem)$/.test(def.form)) modrm = 'r';
  else if ((m = def.form.match(/^MRM([0-7])[rm]$/))) modrm = Number(m[1]);
  else if (def.form === 'AddRegFrm') plus = 'r';
  else if (def.form === 'AddCCFrm') plus = 'cc';
  else if ((m = def.form.match(/^MRM_([0-9A-F]{2})$/))) bytes.push(parseInt(m[1], 16));
  // the reg field is not looked at: the table writes it /0, as Intel does
  else if (def.form === 'MRMXr' || def.form === 'MRMXm') modrm = 0;
  else if (def.form === 'MRMXrCC' || def.form === 'MRMXmCC') { plus = 'cc'; modrm = 0; }
  else if (def.form === 'MRMSrcRegCC' || def.form === 'MRMSrcMemCC') { plus = 'cc'; modrm = 'r'; }
  else if (!/^(RawFrm|RawFrmDstSrc|RawFrmSrc|RawFrmDst|PrefixByte|RawFrmMemOffs|RawFrmImm16|RawFrmImm8)$/.test(def.form)) fail(`${name}: form ${def.form} not understood`);
  let tail = IMM[def.imm] ?? fail(`${name}: immediate ${def.imm} not understood`);
  if (def.form === 'RawFrmImm16') tail = [...tail, 's16'];
  if (def.form === 'RawFrmImm8') tail = [...tail, 'i8'];
  if (def.form === 'RawFrmMemOffs') tail = [`moffs${tail[0].slice(1)}`];
  return { prefix, bytes, modrm, plus, tail };
}

// The line's bytes in the same terms (cp: an offset of the operand size and a 16 bit segment; moffs: an address of the
// mode's size).
function tableShape({ line, mode }) {
  const p = parseOpcode(line.op);
  const tail = p.tail.flatMap((t) => (t === 'cp' ? [`i${line.asm.match(/ptr16:(\d+)/)[1]}`, 's16'] : [TAIL[t]]));
  if (/\[moffs/.test(line.asm)) tail.push(`moffs${mode}`);
  // the two-byte map's +cc lines that LLVM writes as a ModRM form with the condition (setcc, cmovcc)
  return { prefix: p.prefix, bytes: p.bytes, modrm: p.modrm, plus: p.plus, tail };
}

export function check({ set, lines = linesOf({ set }) }) {
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'X86.json'), 'utf8')).instructions;
  const { mode } = SETS[set];
  const errors = [];
  for (const line of lines) {
    const shape = JSON.stringify(tableShape({ line, mode }));
    for (const name of line.llvm) {
      try {
        const def = llvm[name] || fail(`no LLVM record ${name}`);
        const theirs = JSON.stringify(llvmShape({ name, def, mode }));
        if (theirs !== shape) fail(`the table gives ${shape}, LLVM's ${name} ${theirs}`);
      } catch (e) {
        errors.push(`${set}: ${line.op} ${line.asm}: ${e.message}`);
      }
    }
  }
  if (errors.length) fail(errors.join('\n'));
}

// ---------------------------------------------------------------- the generated data

export function generate({ set }) {
  const overlay = _overlay();
  const lines = linesOf({ set, overlay });
  check({ set, lines });
  // the rows are made when the sheet loads; making them here checks every line expands
  for (const line of lines) expandLine({ line, mode: SETS[set].mode });
  const registers = overlay.registers[set] || [];
  return { formats: overlay.formats, sections: overlay.sections, extensions: overlay.extensions, families: overlay.groups,
    lines: lines.map(({ llvm, ...line }) => line), registers };
}

// The unofficial Sail of a set: a clause per line, its ModRM operand through the mode's addressing mappings.
export function sailText({ set, data = generate({ set }) }) {
  const { mode, title } = SETS[set];
  const header = [`// ${title}: encodings, a clause per instruction and operand size.`, '//',
    '// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by',
    "// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's opcode table notation), each",
    "// line of which is checked against LLVM's X86 records (opcode, map, form, operand size, prefixes, immediate). Only the",
    '// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; values little-endian.',
    `// modrm(rm, reg) is a ModRM byte and what follows it (SIB, displacement) in ${mode} bit addressing; the sheet shows a`,
    `// row per form of it. ${mode === 64 ? 'rex(W, R, X, B) is the REX prefix, left out when it is 0100 0000 and no byte register needs it.' : ''}`,
    '// Licensed CC BY-SA 4.0 like the sheets.', '', 'scattered union instruction', ''];
  const clauses = data.lines.map((line, i) => {
    const p = parseOpcode(line.op);
    const [name] = line.asm.split(' ');
    const pieces = [];
    if (p.prefix.includes('66')) pieces.push('0x66');
    if (p.prefix.includes('REX.W')) pieces.push('rex(0b1, R, X, B)');
    else if (mode === 64 && /r\/m|r(8|16|32|64)\b|\+r/.test(`${line.asm} ${line.op}`)) pieces.push('rex(0b0, R, X, B)?');
    const opBytes = [...p.bytes];
    const last = opBytes.pop();
    for (const b of opBytes) pieces.push(`0x${b.toString(16).padStart(2, '0')}`);
    if (p.plus === 'cc') pieces.push(`0b${(last >> 4).toString(2).padStart(4, '0')} @ cc`);
    else if (p.plus) pieces.push(`0b${(last >> 3).toString(2).padStart(5, '0')} @ reg`);
    else pieces.push(`0x${last.toString(16).padStart(2, '0')}`);
    if (p.modrm !== null) pieces.push(p.modrm === 'r' ? 'modrm(rm, reg)' : `modrm(rm, 0b${p.modrm.toString(2).padStart(3, '0')})`);
    for (const t of p.tail) pieces.push({ ib: 'imm8', iw: 'imm16_le', id: 'imm32_le', io: 'imm64_le', cb: 'rel8', cw: 'rel16_le', cd: 'rel32_le', cp: 'offset_le @ seg16_le' }[t]);
    if (/\[moffs/.test(line.asm)) pieces.push(`addr${mode}_le`);
    return `// ${line.asm}${line.forms === 'reg' ? ' (register form only)' : ''}\nmapping clause encdec = ${name.replace('~', '').toUpperCase()}_${i}\n  <-> ${pieces.join(' @ ')}`;
  });
  return `${header.join('\n')}${clauses.join('\n\n')}\n\nend instruction\n`;
}

export function x86Module({ set = 'i8086', data = generate({ set }) } = {}) {
  return moduleText({
    header: [`Generated by tools/isa/gen-x86.mjs from src/isa/overlay/x86.json (checked against LLVM's X86 records,`,
      `spec/llvm/X86.json): the ${SETS[set].title} lines; src/isa/x86.mjs makes their rows. Do not edit: change those and run npm run isa.`],
    exports: data,
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const set of Object.keys(SETS)) {
    writeOrCheck({ out: join(ROOT, 'src', 'isa', 'generated', `${set}.mjs`), text: x86Module({ set }) });
    writeOrCheck({ out: join(ROOT, 'spec', 'unofficial', 'x86', `${set}.sail`), text: sailText({ set }) });
  }
}
