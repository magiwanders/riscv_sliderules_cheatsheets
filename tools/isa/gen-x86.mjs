// Generates src/isa/generated/i8086.mjs (and later the IA-32 / x86-64 data) and the unofficial Sail of
// spec/unofficial/x86/, from src/isa/overlay/x86.json: the instructions as Intel's opcode tables write them
// ("00 /r  add r/m8, r8", "B8+rw iw  mov r16, imm16", "83 /0 ib"), each with the LLVM X86 records it is. LLVM's X86
// TableGen has no Inst bits: its records give the opcode byte, the form (ModRM register / memory, +r, raw), the
// prefixes, the operand size and the immediate, from which the generator derives the bytes and checks them against the
// typed table's (spec/llvm/X86.json). Each ModRM instruction becomes a row per addressing form of the mode (16 bit:
// register, [bx+si], [bx+si+disp8], [bx+si+disp16], [disp16]).
//
//   npm run isa          (with --check only compares with the files on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, fail, moduleText, writeOrCheck } from './common.mjs';

const hex2 = (n) => n.toString(16).padStart(2, '0');
const bin = (n, w) => n.toString(2).padStart(w, '0');

// "00 /r", "B8+rw iw", "F6 /0 ib", "70+cc cb", "D4 0A": the opcode bytes, ModRM (reg operand or a fixed /n), +r / +cc and
// what follows (ib, iw, cb, cw, cd: immediates and relative offsets; cp: a far pointer)
export function parseOpcode(text) {
  const out = { bytes: [], modrm: null, plus: null, tail: [] };
  for (const t of text.split(/\s+/)) {
    let m;
    if ((m = t.match(/^([0-9A-F]{2})\+(rb|rw|rd|ro|cc)$/))) { out.bytes.push(parseInt(m[1], 16)); out.plus = m[2]; }
    else if (/^[0-9A-F]{2}$/.test(t)) out.bytes.push(parseInt(t, 16));
    else if (t === '/r') out.modrm = 'r';
    else if ((m = t.match(/^\/([0-7])$/))) out.modrm = Number(m[1]);
    else if (/^(ib|iw|id|io|cb|cw|cd|cp)$/.test(t)) out.tail.push(t);
    else fail(`opcode notation "${t}" in "${text}" not understood`);
  }
  return out;
}

// The bytes LLVM's record describes, in the same terms: opcode bytes (0F for its two byte map), ModRM ('r', a fixed
// /n, or none), +r / +cc, and the immediate's size.
const IMM = { NoImm: [], Imm8: ['i8'], Imm8Reg: ['i8'], Imm8PCRel: ['c8'], Imm16: ['i16'], Imm16PCRel: ['c16'], Imm32: ['i32'], Imm32PCRel: ['c32'], Imm32S: ['i32'], Imm64: ['i64'] };
const TAIL = { ib: 'i8', iw: 'i16', id: 'i32', io: 'i64', cb: 'c8', cw: 'c16', cd: 'c32', cp: 'cp' };
function llvmShape({ name, def }) {
  const bytes = [...(def.map === 'TB' ? [0x0f] : []), def.op];
  let modrm = null;
  let plus = null;
  let m;
  if (/^MRM(Dest|Src)(Reg|Mem)$/.test(def.form)) modrm = 'r';
  else if ((m = def.form.match(/^MRM([0-7])[rm]$/))) modrm = Number(m[1]);
  else if (def.form === 'AddRegFrm') plus = 'r';
  else if (def.form === 'AddCCFrm') plus = 'cc';
  else if ((m = def.form.match(/^MRM_([0-9A-F]{2})$/))) bytes.push(parseInt(m[1], 16));
  else if (!/^(RawFrm|RawFrmDstSrc|RawFrmSrc|RawFrmDst|PrefixByte|RawFrmMemOffs|RawFrmImm16)$/.test(def.form)) fail(`${name}: form ${def.form} not understood`);
  let tail = IMM[def.imm] ?? fail(`${name}: immediate ${def.imm} not understood`);
  if (def.form === 'RawFrmImm16') tail = ['cp'];
  if (def.form === 'RawFrmMemOffs') tail = ['moffs'];
  return { bytes, modrm, plus, tail };
}

// The typed table's line in the same terms (cp: a 16 bit offset and a segment; moffs: a direct address).
function tableShape({ op, asm }) {
  const p = parseOpcode(op);
  const tail = p.tail.map((t) => TAIL[t]);
  if (/\[moffs/.test(asm)) tail.push('moffs');
  return { bytes: p.bytes, modrm: p.modrm, plus: p.plus ? (p.plus === 'cc' ? 'cc' : 'r') : null, tail };
}

// ---------------------------------------------------------------- addressing forms

const REG8 = ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'];
const REG16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di'];
const SREG = ['es', 'cs', 'ss', 'ds'];
// The 8086's ModRM forms of an r/m operand: the register, then memory by mod.
const FORMS16 = [
  { key: 'reg', title: 'Register', format: 'REG', mod: '11' },
  { key: 'ind', title: '[base + index]', format: 'IND', mod: '00', rm: 'b16', text: '[b16]' },
  { key: 'dir', title: '[disp16]', format: 'EXT', mod: '00', rmBits: '110', disp: 'a16', text: '[a16]' },
  { key: 'd8', title: '[base + index + disp8]', format: 'IDX', mod: '01', rm: 'b16x', disp: 'd8', text: '[b16xd8]' },
  { key: 'd16', title: '[base + index + disp16]', format: 'IDX', mod: '10', rm: 'b16x', disp: 'd16', text: '[b16xd16]' },
];

// The operands of a template ("r/m8, imm8") as the sheet writes them for a form, and what each contributes.
const SIZE = { 8: 'BYTE', 16: 'WORD', 32: 'DWORD', 64: 'QWORD' };
function operandSpec(spec) {
  let m;
  if ((m = spec.match(/^r\/m(8|16)$/))) return { kind: 'rm', size: Number(m[1]) };
  if ((m = spec.match(/^m(8|16)?$/))) return { kind: 'm', size: m[1] ? Number(m[1]) : null };
  if (spec === 'm16:16') return { kind: 'm', size: null, far: true };
  if (spec === 'FAR m16:16') return { kind: 'm', size: null, far: true, keyword: 'FAR' };
  if ((m = spec.match(/^r(8|16)$/))) return { kind: 'r', size: Number(m[1]) };
  if (spec === 'Sreg') return { kind: 'sreg' };
  if ((m = spec.match(/^imm(8|16)$/))) return { kind: 'imm', size: Number(m[1]) };
  if (spec === 'simm8') return { kind: 'simm' };
  if ((m = spec.match(/^rel(8|16)$/))) return { kind: 'rel', size: Number(m[1]) };
  if ((m = spec.match(/^\[moffs(8|16)\]$/))) return { kind: 'moffs', size: Number(m[1]) };
  if (spec === 'ptr16:16') return { kind: 'far' };
  return { kind: 'lit', text: spec.toUpperCase() };
}

// One row per form: the encoding string in the codec's notation, the assembly template.
function expand({ row, mode = 16 }) {
  const p = parseOpcode(row.op);
  const [word, rest = ''] = row.asm.split(/\s(.*)/);
  // j~cc: the condition is the mnemonic's tail (jne)
  const [mnemonic, tail = null] = word.split('~');
  const specs = rest ? rest.split(/,\s*/).map(operandSpec) : [];
  const rmSpec = specs.find((s) => s.kind === 'rm' || s.kind === 'm');
  const sizeKnown = specs.some((s) => s.kind === 'r' || s.kind === 'sreg' || (s.kind === 'lit' && /^(AL|AX|DX)$/.test(s.text)));
  const forms = rmSpec ? FORMS16.filter((f) => (rmSpec.kind === 'm' ? f.key !== 'reg' : true)) : [null];
  return forms.map((form) => {
    const enc = [];
    const opBytes = [...p.bytes];
    const last = opBytes.pop();
    for (const b of opBytes) enc.push(bin(b, 8));
    const regToken = specs.find((s) => s.kind === 'r');
    const sregToken = specs.find((s) => s.kind === 'sreg');
    if (p.plus === 'cc') enc.push(bin(last >> 4, 4), 'cc');
    else if (p.plus) enc.push(bin(last >> 3, 5), `r${regToken.size}`);
    else enc.push(bin(last, 8));
    if (p.modrm !== null) {
      enc.push(form ? form.mod : '11');
      enc.push(p.modrm === 'r' ? (sregToken ? '0 sreg' : `r${regToken.size}`) : bin(p.modrm, 3));
      if (!form || form.key === 'reg') enc.push(`rm${rmSpec ? rmSpec.size : regToken.size}`);
      else if (form.rmBits) enc.push(form.rmBits);
      else enc.push(form.rm);
      if (form && form.disp === 'd8') enc.push('d8');
      if (form && form.disp === 'd16') enc.push('d16[7:0] d16[15:8]');
      if (form && form.disp === 'a16') enc.push('a16[7:0] a16[15:8]');
    }
    for (const t of p.tail) {
      if (t === 'ib') enc.push(specs.some((s) => s.kind === 'simm') ? 'simm[7:0]' : specs.some((s) => s.kind === 'imm') ? 'imm[7:0]' : 'imm[7:0]');
      if (t === 'iw') enc.push('imm[7:0|15:8]');
      if (t === 'cb') enc.push('rel[7:0]');
      if (t === 'cw') enc.push('rel[7:0|15:8]');
      if (t === 'cp') enc.push('imm[7:0|15:8] seg[7:0] seg[15:8]');
    }
    if (specs.some((s) => s.kind === 'moffs')) enc.push('imm[7:0|15:8]');
    // the template
    const ops = specs.map((s) => {
      if (s.kind === 'rm' || s.kind === 'm') {
        if (form.key === 'reg') return `rm${s.size}`;
        return `${s.keyword ? `${s.keyword} ` : sizeKnown || !s.size ? '' : `${SIZE[s.size]} `}${form.text}`;
      }
      if (s.kind === 'r') return `r${s.size}`;
      if (s.kind === 'sreg') return 'sreg';
      if (s.kind === 'imm') return 'imm';
      if (s.kind === 'simm') return 'simm';
      if (s.kind === 'rel') return 'rel';
      if (s.kind === 'moffs') return `${SIZE[s.size] && !sizeKnown ? `${SIZE[s.size]} ` : ''}[imm]`;
      if (s.kind === 'far') return 'seg:imm';
      return s.text;
    });
    // ESC-free 8086: the codec's split notation for little-endian values
    const encoding = enc.join(' ').replace('imm[7:0|15:8]', 'imm[7:0|15:8]');
    return { form, enc: encoding, asm: `${tail ? `~${tail}${ops.length ? ' ' : ''}` : ''}${ops.join(', ')}`, mnemonic, first: p.bytes[0] };
  });
}

// ---------------------------------------------------------------- the set

export function generate({ set = 'i8086' }) {
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'x86.json'), 'utf8'));
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'X86.json'), 'utf8')).instructions;
  const instructions = [];
  const groups = {};
  for (const row of overlay.instructions.filter((r) => r.sets.includes(set))) {
    // the typed line and each LLVM record it is must give the same bytes
    const shape = JSON.stringify(tableShape(row));
    for (const name of row.llvm) {
      const def = llvm[name] || fail(`${row.op} ${row.asm}: no LLVM record ${name}`);
      const theirs = JSON.stringify(llvmShape({ name, def }));
      if (theirs !== shape) fail(`${row.op} ${row.asm}: the table gives ${shape}, LLVM's ${name} ${theirs}`);
    }
    for (const { form, enc, asm, mnemonic, first } of expand({ row })) {
      // the section is the first opcode byte's quarter
      const section = `s${first >> 6}`;
      const key = `${row.group}${form ? `-${form.key}` : ''}-${section}`;
      const family = overlay.groups[row.group] || fail(`${row.group}: no group`);
      groups[key] ??= { section, format: form ? (form.key === 'reg' && family.format === 'REG' ? 'REG' : form.format) : family.format,
        title: form ? `${family.title}, ${form.title}` : family.title, pseudocode: family.pseudocode };
      instructions.push({ group: key, extension: row.class, name: mnemonic, enc, asm, description: row.description, pseudocode: row.pseudocode, expands: row.flags ?? '' });
    }
  }
  return { formats: overlay.formats, sections: overlay.sections, extensions: overlay.extensions, groups, instructions, registers: overlay.registers };
}

// The unofficial Sail of a set: an encdec clause per row, written from the typed table.
export function sailText({ set = 'i8086', data = generate({ set }) }) {
  const header = [`// Intel 8086: encodings, one clause per addressing form.`, '//',
    '// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by',
    "// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's 8086 Family User's Manual",
    "// notation), each line of which is checked against LLVM's X86 records (opcode, form, prefixes, immediate). Only the",
    '// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; 16 bit values low byte',
    '// first. Licensed CC BY-SA 4.0 like the sheets.', '', 'scattered union instruction', ''];
  const clauses = data.instructions.map((inst, i) => {
    const name = `${inst.name.toUpperCase()}_${i}`;
    const pieces = inst.enc.split(' ').map((t) => (/^[01]+$/.test(t) ? `0b${t}` : t.replace(/\[(\d+):(\d+)\]/g, '[$1..$2]').replace(/\[(\d+):(\d+)\|(\d+):(\d+)\]/, '[$1..$2] @ $3..$4')));
    return `// ${inst.name} ${inst.asm}\nmapping clause encdec = ${name}\n  <-> ${pieces.join(' @ ')}`;
  });
  return `${header.join('\n')}${clauses.join('\n\n')}\n\nend instruction\n`;
}

export function x86Module({ set = 'i8086', data = generate({ set }) } = {}) {
  return moduleText({
    header: [`Generated by tools/isa/gen-x86.mjs from src/isa/overlay/x86.json (checked against LLVM's X86 records,`,
      `spec/llvm/X86.json). Do not edit: change those and run npm run isa.`],
    exports: data,
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeOrCheck({ out: join(ROOT, 'src', 'isa', 'generated', 'i8086.mjs'), text: x86Module({ set: 'i8086' }) });
  writeOrCheck({ out: join(ROOT, 'spec', 'unofficial', 'x86', 'i8086.sail'), text: sailText({ set: 'i8086' }) });
}
