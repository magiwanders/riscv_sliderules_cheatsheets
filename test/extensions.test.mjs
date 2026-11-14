import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isas, families, membersOf } from '../src/isa/isas.mjs';
import { toggled, isaString, allExtensions } from '../src/isa/riscv-extensions.mjs';

// The title's list (members under their family's name), and RISC-V's extension toggles: the sheets of a set of extensions hold exactly
// the rows those extensions allow.

const rv32 = isas.find((isa) => isa.value === 'rv32gc');
const { available, codecFor, defaults } = rv32.extensions;
const names = (codec) => new Set(codec.encodable.map((e) => e.name));

test('every member belongs to a family, every family has members, listed together', () => {
  assert.deepEqual(families.map((f) => f.label), ['RISC-V', 'MIPS', 'Intel', 'Arm', 'Zilog', 'MOS Technology', 'nand2tetris']);
  for (const isa of isas) assert.ok(families.some((f) => f.value === isa.family), isa.value);
  for (const f of families) assert.ok(membersOf(f.value).length, f.value);
  assert.deepEqual(isas.map((i) => i.family).filter((f, k, all) => all.indexOf(f) === k), families.map((f) => f.value), 'one run per family');
});

test('the toggles cover every extension the sheets have, and only ratified names', () => {
  const listed = new Set(allExtensions());
  for (const e of available) assert.ok(listed.has(e), e);
});

test('turning an extension on or off follows what it needs, and the base stays', () => {
  const all = new Set(available);
  assert.ok(!toggled({ enabled: all, name: 'F', on: false, available }).has('D'), 'F off takes D');
  assert.ok(toggled({ enabled: new Set(['I']), name: 'D', on: true, available }).has('F'), 'D on brings F');
  assert.ok(toggled({ enabled: new Set(['I']), name: 'D', on: true, available }).has('Zicsr'), 'and F brings Zicsr');
  assert.ok(toggled({ enabled: all, name: 'I', on: false, available }).has('I'));
  assert.equal(isaString({ width: 32, enabled: all }), 'RV32GC_Zihintpause');
  assert.equal(isaString({ width: 32, enabled: defaults }), 'RV32GC', 'it starts as RV32GC');
  assert.equal(isaString({ width: 32, enabled: new Set(['I', 'M', 'Zba', 'Zbb', 'Zbs', 'Zbc']) }), 'RV32IMB_Zbc');
  assert.equal(isaString({ width: 32, enabled: new Set(['I', 'M', 'C', 'Zicsr']) }), 'RV32IMC_Zicsr');
});

test('the sheets of a set of extensions hold its rows only', () => {
  const full = names(rv32.codec);
  assert.equal(codecFor({ enabled: defaults }).spec.name, 'RV32GC');
  assert.ok(!names(codecFor({ enabled: defaults })).has('pause') && full.has('pause'), 'pause is Zihintpause');
  assert.equal(codecFor({ enabled: new Set(available) }), rv32.codec);
  const imc = codecFor({ enabled: new Set(['I', 'M', 'C']) });
  assert.equal(imc.spec.name, 'RV32IMC');
  const shown = names(imc);
  for (const n of ['add', 'mul', 'c.lw', 'c.addi', 'li', 'nop']) assert.ok(shown.has(n), n);
  for (const n of ['amoadd.w', 'fadd.s', 'fld', 'c.flw', 'c.fld', 'csrrw', 'fence.i', 'csrr', 'fmv.s', 'frcsr']) assert.ok(!shown.has(n), n);
  assert.ok(imc.compiled.every((i) => i.width === 16 || i.width === 32));
  const noC = codecFor({ enabled: new Set([...available].filter((e) => e !== 'C')) });
  assert.ok(noC.compiled.every((i) => i.width === 32), 'without C, no 16 bit rows');
  const noD = codecFor({ enabled: toggled({ enabled: new Set(available), name: 'D', on: false, available }) });
  assert.ok(!names(noD).has('c.fld') && names(noD).has('c.flw') && !names(noD).has('fmv.d'));
  // every row of the full sheet is in the sheets of the extensions it needs
  for (const e of full) assert.ok(names(codecFor({ enabled: new Set(available) })).has(e), e);
  // decoding a word of a turned-off extension finds nothing
  assert.equal(imc.decodeWord({ word: 0x00c5f553 }), null, 'fadd.s');
  assert.equal(imc.decodeWord({ word: 0x02b50533 }).inst.name, 'mul');
});
