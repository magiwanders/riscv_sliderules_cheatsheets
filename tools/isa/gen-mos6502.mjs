// Generates src/isa/generated/mos6502.mjs, the instruction data of the 6502 sheets, from llvm-mos's TableGen
// description (spec/llvm/MOS.json: opcodes, addressing modes, operand bytes, assembly) and src/isa/overlay/mos6502.json
// (what it does not have: sections, the modes' titles, each mnemonic's class, description, pseudocode and flags).
// There is no official Sail model of the 6502: spec/unofficial/mos6502/mos6502.sail is checked against llvm-mos bit by bit.
//
//   npm run isa          (with --check only compares with the file on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, fail, moduleText, writeOrCheck } from './common.mjs';
import { readSail, sailInstructions } from './sail.mjs';

const OUT = join(ROOT, 'src', 'isa', 'generated', 'mos6502.mjs');

// llvm-mos names a definition MNEMONIC_Mode; the sheet's modes in the order a mnemonic lists them.
const MODES = { Implied: 'IMP', Accumulator: 'ACC', Immediate: 'IMM', ZeroPage: 'ZP', ZeroPageX: 'ZPX', ZeroPageY: 'ZPY', Absolute: 'ABS',
  AbsoluteX: 'ABX', AbsoluteY: 'ABY', Indirect16: 'IND', IndexedIndirect: 'IZX', IndirectIndexed: 'IZY', Relative: 'REL' };
const MODE_ORDER = Object.values(MODES);
// Operand classes and the sheet's names for them (immediates, zero page and absolute addresses, branch offsets).
const OPERANDS = { imm8: 'imm', addr8: 'zp', addr16: 'addr', pcrel8: 'rel' };

// "lda ( $param ) , y" → "(zp),Y". llvm-mos writes the accumulator mode without an operand: the sheet writes A, as MOS
// Technology's manual and most assemblers do.
function assembly({ def, mode, operand }) {
  if (mode === 'ACC') return 'A';
  const [, text = ''] = def.asm.match(/^\S+\s*(.*)$/);
  return text.replace(/\$\{?param\}?/, operand || '').replace(/\s+/g, '').replace(/\b[xy]\b/g, (r) => r.toUpperCase());
}

// The encoding in memory order: the opcode byte, then the operand's bytes low first ("addr[7:0|15:8]").
function encoding({ def, operand }) {
  const bytes = [];
  for (let i = def.inst.length - 8; i >= 0; i -= 8) bytes.push(def.inst.slice(i, i + 8));
  const [opcode, ...rest] = bytes;
  if (!opcode.every((b) => b === '0' || b === '1')) fail(`${def.asm}: opcode byte is not literal`);
  const pieces = rest.map((byte) => {
    const bits = byte.map((b) => b.match(/^param\{(\d+)\}$/));
    if (bits.some((m) => !m)) fail(`${def.asm}: operand byte not understood`);
    const hi = Number(bits[0][1]);
    const lo = Number(bits[7][1]);
    if (hi - lo !== 7) fail(`${def.asm}: operand byte is not a run of bits`);
    return `${hi}:${lo}`;
  });
  return [opcode.join(''), pieces.length ? `${operand}[${pieces.join('|')}]` : ''].filter(Boolean).join(' ');
}

// The unofficial Sail must give every llvm-mos instruction the same bytes (memory order: LLVM numbers the first byte lowest).
function checkSail({ llvm }) {
  const sail = readSail({ files: [join(ROOT, 'spec', 'unofficial', 'mos6502', 'mos6502.sail')] });
  const instances = new Map(sailInstructions({ sail, config: { xlen: 0, extensions: new Set(), immediates: Object.values(OPERANDS) } }).map((s) => [s.key, s]));
  for (const [name, def] of Object.entries(llvm.instructions)) {
    const s = instances.get(name) || fail(`${name}: not in the Sail`);
    const operand = def.ins.length ? OPERANDS[def.ins[0][0]] : null;
    const lsbFirst = [...def.inst].reverse();
    const bits = Array.from({ length: def.size * 8 }, (_, p) => lsbFirst[8 * Math.floor(p / 8) + 7 - (p % 8)]);
    const sailBits = s.bits.map((b) => (b.kind === 'lit' ? String(b.value) : `param{${b.value}}`));
    if (operand && s.bits.some((b) => b.kind === 'imm' && b.name !== operand)) fail(`${name}: Sail operand is not ${operand}`);
    if (sailBits.join(' ') !== bits.join(' ')) fail(`${name}: Sail ${sailBits.join(' ')}, llvm-mos ${bits.join(' ')}`);
    instances.delete(name);
  }
  if (instances.size) fail(`Sail instructions llvm-mos does not have: ${[...instances.keys()].join(', ')}`);
}

export function generate() {
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', 'mos6502.json'), 'utf8'));
  const llvm = JSON.parse(readFileSync(join(ROOT, 'spec', 'llvm', 'MOS.json'), 'utf8'));
  checkSail({ llvm });
  const rows = Object.entries(llvm.instructions).map(([name, def]) => {
    const [, suffix] = name.match(/^[A-Z]+_(\w+)$/) || fail(`definition ${name} not named MNEMONIC_Mode`);
    const mode = MODES[suffix] || fail(`${name}: mode ${suffix} unknown`);
    const cls = def.ins.length ? def.ins[0][0] : null;
    const operand = cls ? OPERANDS[cls] || fail(`${name}: operand class ${cls} unknown`) : null;
    const mnemonic = def.asm.split(/\s+/)[0].toUpperCase();
    const opcode = parseInt(def.inst.slice(-8).join(''), 2);
    return { mnemonic, mode, opcode, enc: encoding({ def, operand }), asm: assembly({ def, mode, operand }) };
  });
  const groups = {};
  const instructions = [];
  const known = new Set(Object.keys(overlay.mnemonics));
  for (const r of rows) if (!known.has(r.mnemonic)) fail(`${r.mnemonic}: no overlay entry`);
  for (const [mnemonic, about] of Object.entries(overlay.mnemonics)) {
    const mine = rows.filter((r) => r.mnemonic === mnemonic).sort((a, b) => MODE_ORDER.indexOf(a.mode) - MODE_ORDER.indexOf(b.mode));
    if (!mine.length) fail(`${mnemonic}: not in llvm-mos`);
    for (const r of mine) {
      // the opcode's aaabbbcc structure: a section per cc, a group per mode inside it
      const section = `cc${r.opcode & 3}`;
      const group = `${section}/${r.mode}`;
      const mode = overlay.modes[r.mode] || fail(`mode ${r.mode}: no overlay entry`);
      groups[group] = { section, format: r.mode, title: mode.title, pseudocode: mode.pseudocode };
      instructions.push({ group, name: mnemonic, extension: about.class, enc: r.enc, asm: r.asm, description: about.description, pseudocode: about.pseudocode, expands: about.flags });
    }
  }
  return { formats: overlay.formats, sections: overlay.sections, extensions: overlay.extensions, groups, instructions, registers: overlay.registers, source: llvm.source };
}

export function mos6502Module({ data = generate() } = {}) {
  return moduleText({
    header: ['Generated by tools/isa/gen-mos6502.mjs from llvm-mos TableGen (spec/llvm/MOS.json,',
      `${data.source.project} ${data.source.revision}) and src/isa/overlay/mos6502.json. Do not edit: change those and run npm run isa.`],
    exports: { formats: data.formats, sections: data.sections, extensions: data.extensions, groups: data.groups, instructions: data.instructions, registers: data.registers },
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) writeOrCheck({ out: OUT, text: mos6502Module() });
