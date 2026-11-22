import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';

// The MIPS32 and MIPS64 sheets against GNU as and llvm-mc (test/vectors/mips{32,64}-{gnu,llvm}.json, `npm run
// vectors:mips`), which must also agree with each other.

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));

for (const xlen of [32, 64]) {
  const codec = isas.find((i) => i.value === `mips${xlen}`).codec;

  for (const dialect of ['gnu', 'llvm']) {
    test(`MIPS${xlen} encodings match ${vectors(`mips${xlen}-${dialect}`).reference}`, () => {
      const failures = [];
      const { vectors: list } = vectors(`mips${xlen}-${dialect}`);
      for (const { id, operands, assembly, word } of list) {
        const entry = codec.encodable.find((e) => e.id === id);
        const ours = codec.hex({ word: codec.encodeEntry({ entry, operands }).words[0].word, width: 32 });
        if (ours !== word) failures.push(`${assembly}: sliderule ${ours}, ${dialect} ${word}`);
      }
      assert.deepEqual(failures, []);
      // every instruction and pseudo-instruction is assembled at least once
      assert.deepEqual(codec.encodable.map((e) => e.id).filter((id) => !list.some((v) => v.id === id)), []);
    });
  }

  test(`MIPS${xlen}: GNU as and llvm-mc agree`, () => {
    const gnu = vectors(`mips${xlen}-gnu`).vectors;
    const llvm = vectors(`mips${xlen}-llvm`).vectors;
    assert.equal(gnu.length, llvm.length);
    gnu.forEach((v, i) => assert.equal(v.word, llvm[i].word, v.assembly));
  });

  test(`MIPS${xlen}: every entry decodes back to itself`, () => {
    for (const { entry, operands } of allCases({ codec })) {
      if (entry.pseudo) continue;
      const [{ word, inst, assembly, fields }] = codec.encodeEntry({ entry, operands }).words;
      const decoded = codec.decodeWord({ word });
      assert.ok(decoded, `${assembly} does not decode`);
      // sll $zero, $zero, 1 / 3 / 5 are ssnop, ehb and pause
      if (decoded.inst.group === 'barrier' && inst.name === 'sll') continue;
      assert.equal(decoded.assembly, assembly);
      assert.equal(decoded.inst.id, inst.id, assembly);
      assert.deepEqual(decoded.fields, fields, assembly);
    }
  });

  test(`MIPS${xlen}: groups have one format and section, the sheets know every ISA level`, () => {
    const { groups, extensions, sections } = codec.spec;
    for (const key of Object.keys(groups)) assert.ok(sections[groups[key].section], key);
    for (const { extension, id } of codec.encodable.filter((e) => !e.pseudo)) assert.ok(extensions.includes(extension), `${id}: ${extension}`);
    assert.equal(new Set(codec.encodable.map((e) => e.id)).size, codec.encodable.length);
  });
}

test('MIPS32 has no doubleword instructions, MIPS64 all of MIPS32\'s and the n64 register names', () => {
  const mips32 = isas.find((i) => i.value === 'mips32').codec;
  const mips64 = isas.find((i) => i.value === 'mips64').codec;
  // what MIPS64 adds: the doubleword instructions (d..., ld, sd, ...) and lwu
  const added = mips64.compiled.filter((i) => !mips32.compiled.some((j) => j.name === i.name)).map((i) => i.name);
  assert.deepEqual(added.filter((n) => !/^d/.test(n)).sort(), ['ld', 'ldl', 'ldr', 'lld', 'lwu', 'scd', 'sd', 'sdl', 'sdr']);
  assert.ok(added.length > 40);
  for (const inst of mips32.compiled) assert.ok(mips64.compiled.some((i) => i.name === inst.name && i.enc === inst.enc), inst.name);
  const word = (codec, assembly) => codec.hex({ word: codec.encodeAssembly({ assembly }).words[0].word, width: 32 });
  // $t0 is $8 in o32, $12 in n64
  assert.equal(word(mips32, 'addu $t0, $zero, $zero'), '0x00004021');
  assert.equal(word(mips64, 'addu $t0, $zero, $zero'), '0x00006021');
  assert.equal(word(mips64, 'addu $a4, $zero, $zero'), '0x00004021');
});

test('MIPS assembly the way the manual writes it', () => {
  const mips32 = isas.find((i) => i.value === 'mips32').codec;
  const round = (assembly) => mips32.decodeWord({ word: mips32.encodeAssembly({ assembly }).words[0].word }).assembly;
  assert.equal(round('lw $ra, -4($sp)'), 'lw $ra, -4($sp)');
  assert.equal(round('ext $t0, $t1, 3, 5'), 'ext $t0, $t1, 3, 5');
  assert.equal(round('ins $t0, $t1, 30, 2'), 'ins $t0, $t1, 30, 2');
  assert.equal(round('beq $a0, $a1, -4'), 'beq $a0, $a1, -4');
  assert.equal(round('div $a0, $a1'), 'div $a0, $a1');
  assert.throws(() => mips32.encodeAssembly({ assembly: 'bltzal $ra, 8' }));
  assert.throws(() => mips32.encodeAssembly({ assembly: 'jalr $t0, $t0' }));
  assert.throws(() => mips32.encodeAssembly({ assembly: 'beq $a0, $a1, 2' }));
});
