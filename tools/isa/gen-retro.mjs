// Generates src/isa/generated/z80.mjs and hack.mjs, the instruction data of the Z80 and Hack sheets, from their
// unofficial Sail and TableGen descriptions (spec/unofficial/: neither Zilog nor nand2tetris publish one) and the
// overlays src/isa/overlay/{z80,hack}.json. Each instruction must have the same bits in the Sail encdec clause and in the
// TableGen record of the same name; the overlay's operand exclusions must be the Sail guards'.
//
// Cells follow the Sail pieces: a literal piece is a cell, the pieces of one immediate make one (nn[7..0] @ nn[15..8]
// is nn[7:0|15:8]). Mnemonic and assembly come from the TableGen AsmString.
//
//   npm run isa          (with --check only compares with the files on disk)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSail, sailInstructions } from './sail.mjs';
import { ROOT, fail, moduleText, writeOrCheck } from './common.mjs';

const unescape = (text) => text.replace(/\\([|{}$])/g, '$1');

const SETS = {
  z80: {
    sail: 'spec/unofficial/z80/z80.sail', tablegen: 'spec/unofficial/z80/Z80.json', unit: 8, immediates: ['n', 'nn', 'e'],
    // "LD\t$r, ($i$d)": mnemonic LD, operands "r, (id)"
    assembly: (asm) => {
      const [, name, rest = ''] = unescape(asm).match(/^(\S+)\s*(.*)$/);
      return { name, asm: rest.replace(/\$(\w+)/g, '$1') };
    },
    exports: ['formats', 'sections', 'extensions', 'operands', 'groups', 'instructions', 'registers'],
  },
  hack: {
    sail: 'spec/unofficial/hack/hack.sail', tablegen: 'spec/unofficial/hack/Hack.json', unit: 16, immediates: ['imm'],
    // "$dest=D+1;$jump": the comp is the sheet's mnemonic, dest and jump its operands; "@$imm"
    assembly: (asm) => {
      const text = unescape(asm);
      if (text === '@$imm') return { name: '@', asm: 'imm' };
      const [, comp] = text.match(/^\$dest=(.+);\$jump$/) || fail(`Hack AsmString ${asm} not understood`);
      return { name: comp, asm: 'dest, jump' };
    },
    exports: ['formats', 'sections', 'extensions', 'operands', 'groups', 'instructions', 'pseudoInstructions', 'registers'],
  },
};

// The bits of a TableGen record in memory order (the sheets' order): LLVM numbers the first byte (or word) lowest.
function memoryBits({ def, unit }) {
  const width = def.size * 8;
  const lsbFirst = [...def.inst].reverse();
  return Array.from({ length: width }, (_, p) => lsbFirst[unit * Math.floor(p / unit) + (unit - 1 - (p % unit))]);
}

function immLabel({ bits = [] }) {
  const runs = [];
  for (const b of bits) {
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === b + 1) last.push(b);
    else runs.push([b]);
  }
  return runs.map((r) => (r.length === 1 ? `${r[0]}` : `${r[0]}:${r[r.length - 1]}`)).join('|');
}

// Cells from the Sail pieces: each literal piece, each field, and each immediate's run of pieces.
function encoding({ s }) {
  const cells = [];
  s.bits.forEach((b, i) => {
    const last = cells[cells.length - 1];
    const cut = s.cuts.includes(i);
    const sameImm = last && b.kind === 'imm' && last.kind === 'imm' && last.name === b.name;
    if (last && !cut) last.bits.push(b);
    else if (sameImm) last.bits.push(b);
    else cells.push({ kind: b.kind, name: b.name, bits: [b] });
  });
  return cells.map((c) => {
    if (c.kind === 'lit') return c.bits.map((b) => b.value).join('');
    if (c.kind === 'imm') return `${c.name}[${immLabel({ bits: c.bits.map((b) => b.value) })}]`;
    return c.name;
  }).join(' ');
}

export function generate({ set = 'z80' }) {
  const config = SETS[set];
  const overlay = JSON.parse(readFileSync(join(ROOT, 'src', 'isa', 'overlay', `${set}.json`), 'utf8'));
  const tablegen = JSON.parse(readFileSync(join(ROOT, config.tablegen), 'utf8'));
  const sail = readSail({ files: [join(ROOT, config.sail)] });
  const instances = sailInstructions({ sail, config: { xlen: 0, extensions: new Set(), immediates: config.immediates } });
  const byKey = new Map();
  for (const s of instances) {
    if (byKey.has(s.key)) fail(`${set}: two Sail encodings of ${s.key}`);
    byKey.set(s.key, s);
  }
  const used = new Set();
  const instructions = overlay.instructions.map((row) => {
    const def = tablegen.instructions[row.def] || fail(`${set}: no TableGen record ${row.def}`);
    const s = byKey.get(row.def) || fail(`${set}: no Sail encoding ${row.def}`);
    used.add(row.def);
    const bits = memoryBits({ def, unit: config.unit });
    if (bits.length !== s.width) fail(`${row.def}: ${s.width} bits in Sail, ${bits.length} in TableGen`);
    s.bits.forEach((b, p) => {
      const t = bits[p];
      const expected = b.kind === 'lit' ? String(b.value) : `${b.name}{${b.kind === 'imm' ? b.value : b.bit}}`;
      if (t !== expected) fail(`${row.def}: bit ${p} is ${expected} in Sail, ${t} in TableGen`);
    });
    // the overlay's exclusions (r != (HL)) are the Sail guards'
    for (const name of new Set(s.bits.filter((b) => b.kind === 'field').map((b) => b.name))) {
      const guard = s.constraints.filter((c) => c.name === name).map((c) => c.value).sort();
      const listed = [...((overlay.operands[name] || {}).exclude || [])].sort();
      if (JSON.stringify(guard) !== JSON.stringify(listed)) fail(`${row.def}: Sail excludes ${name} = ${guard}, the overlay ${listed}`);
    }
    const { name, asm } = config.assembly(def.asm);
    const out = { group: row.group };
    if (row.extension !== undefined) out.extension = row.extension;
    Object.assign(out, { name, enc: encoding({ s }), asm, description: row.description, pseudocode: row.pseudocode });
    if (row.expands !== undefined) out.expands = row.expands;
    return out;
  });
  const unused = [...byKey.keys(), ...Object.keys(tablegen.instructions)].filter((k) => !used.has(k));
  if (unused.length) fail(`${set}: Sail / TableGen instructions no overlay row places: ${[...new Set(unused)].join(', ')}`);
  const pseudoInstructions = (overlay.symbols || []).map(({ name, value, description }) => ({ name, asm: '', expands: [['@', { imm: value }]], description }));
  // the assembler's predefined symbols are on the registers sheet too (R0-R15 are Hack's virtual registers)
  const registers = [...overlay.registers, ...(overlay.symbols ? [{ group: 'Symbols', title: 'Predefined Symbols', columns: ['Symbol', 'Value', 'Meaning'],
    rows: overlay.symbols.map(({ name, value, description }) => [name.slice(1), String(value), description]) }] : [])];
  return { ...overlay, instructions, pseudoInstructions, registers, source: config };
}

export function retroModule({ set = 'z80', data = generate({ set }) } = {}) {
  const { sail, tablegen, exports } = SETS[set];
  return moduleText({
    header: [`Generated by tools/isa/gen-retro.mjs from the unofficial Sail (${sail}) and TableGen (${tablegen.replace('.json', '.td')})`,
      `of spec/unofficial/ and src/isa/overlay/${set}.json. Do not edit: change those and run npm run isa.`],
    exports: Object.fromEntries(exports.map((key) => [key, data[key]])),
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const set of Object.keys(SETS)) writeOrCheck({ out: join(ROOT, 'src', 'isa', 'generated', `${set}.mjs`), text: retroModule({ set }) });
}
