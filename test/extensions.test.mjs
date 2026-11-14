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
  const all = new Set(defaults);
  assert.ok(!toggled({ enabled: all, name: 'F', on: false, available }).has('D'), 'F off takes D');
  assert.ok(!toggled({ enabled: all, name: 'Zfinx', on: true, available }).has('F'), 'Zfinx takes the place of F');
  assert.ok(!toggled({ enabled: all, name: 'Zcmp', on: true, available }).has('D'), 'Zcmp takes the encodings of C + D');
  assert.ok(toggled({ enabled: all, name: 'Zvbb', on: true, available }).has('V'), 'Zvbb brings V');
  assert.ok(toggled({ enabled: new Set(['I']), name: 'D', on: true, available }).has('F'), 'D on brings F');
  assert.ok(toggled({ enabled: new Set(['I']), name: 'D', on: true, available }).has('Zicsr'), 'and F brings Zicsr');
  assert.ok(toggled({ enabled: all, name: 'I', on: false, available }).has('I'));
  assert.equal(isaString({ width: 32, enabled: new Set([...defaults, 'Zihintpause']) }), 'RV32GC_Zihintpause');
  assert.equal(isaString({ width: 32, enabled: defaults }), 'RV32GC', 'it starts as RV32GC');
  assert.equal(isaString({ width: 32, enabled: new Set(['I', 'M', 'Zba', 'Zbb', 'Zbs', 'Zbc']) }), 'RV32IMB_Zbc');
  assert.equal(isaString({ width: 32, enabled: new Set(['I', 'M', 'C', 'Zicsr']) }), 'RV32IMC_Zicsr');
});

test('the sheets of a set of extensions hold its rows only', () => {
  assert.equal(codecFor({ enabled: defaults }), rv32.codec);
  assert.equal(rv32.codec.spec.name, 'RV32GC');
  const pause = codecFor({ enabled: new Set([...defaults, 'Zihintpause']) });
  assert.ok(!names(rv32.codec).has('pause') && names(pause).has('pause'), 'pause is Zihintpause');
  assert.deepEqual(pause.encodeAssembly({ assembly: 'pause' }).words.map((w) => w.word), [0x0100000f]);
  const imc = codecFor({ enabled: new Set(['I', 'M', 'C']) });
  assert.equal(imc.spec.name, 'RV32IMC');
  const shown = names(imc);
  for (const n of ['add', 'mul', 'c.lw', 'c.addi', 'li', 'nop']) assert.ok(shown.has(n), n);
  for (const n of ['amoadd.w', 'fadd.s', 'fld', 'c.flw', 'c.fld', 'csrrw', 'fence.i', 'csrr', 'fmv.s', 'frcsr']) assert.ok(!shown.has(n), n);
  assert.ok(imc.compiled.every((i) => i.width === 16 || i.width === 32));
  const noC = codecFor({ enabled: new Set([...defaults].filter((e) => e !== 'C')) });
  assert.ok(noC.compiled.every((i) => i.width === 32), 'without C, no 16 bit rows');
  const noD = codecFor({ enabled: toggled({ enabled: new Set(defaults), name: 'D', on: false, available }) });
  assert.ok(!names(noD).has('c.fld') && names(noD).has('c.flw') && !names(noD).has('fmv.d'));
  // decoding a word of a turned-off extension finds nothing
  assert.equal(imc.decodeWord({ word: 0x00c5f553 }), null, 'fadd.s');
  assert.equal(imc.decodeWord({ word: 0x02b50533 }).inst.name, 'mul');
});

test('the profiles the assemblers check hold every instruction of the sheets, and each decodes its own words', async () => {
  const { profiles } = await import('./riscv-profiles.mjs');
  const { instructions } = await import('../src/isa/generated/rv32gc.mjs');
  const covered = new Set(profiles.flatMap((p) => p.codec.compiled.filter((i) => !i.hint && !i.reserved).map((i) => `${i.name} ${i.enc}`)));
  const missing = instructions.filter((i) => !i.hint && !i.reserved).map((i) => `${i.name} ${i.enc}`).filter((k) => !covered.has(k));
  assert.deepEqual(missing, []);
  // round trip in each profile: encode every instruction with valid operands, decode, same instruction and word
  const { allCases } = await import('./cases.mjs');
  const failures = [];
  for (const p of profiles) {
    for (const { entry, operands, ordering } of allCases({ codec: p.codec, perEntry: 2 }).filter((c) => !c.entry.pseudo)) {
      const label = `${p.name}: ${entry.name}${ordering ? '.' + ordering : ''} ${operands}`;
      try {
        const [{ word }] = p.codec.encodeEntry({ entry, operands, ordering }).words;
        const decoded = p.codec.decodeWord({ word });
        if (!decoded || decoded.inst.id !== entry.id) failures.push(`${label} decodes as ${decoded ? decoded.inst.name : 'nothing'}`);
        else if (p.codec.encodeAssembly({ assembly: decoded.assembly }).words[0].word !== word) failures.push(`${label}: ${decoded.assembly} does not encode back`);
      } catch (e) {
        failures.push(`${label}: ${e.message}`);
      }
    }
  }
  assert.deepEqual(failures.slice(0, 20), []);
});
