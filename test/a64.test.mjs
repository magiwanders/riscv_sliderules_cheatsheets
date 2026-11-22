import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';
import { bitmask, fpImmediate } from '../src/isa/a64.mjs';

// The A64 sheets against GNU as and llvm-mc (test/vectors/a64-{gnu,llvm}.json, `npm run vectors:a64`), which must also
// agree with each other where both assemble a line (GNU as leaves ADRP to the linker).

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));
const codec = isas.find((i) => i.value === 'arm64').codec;

for (const dialect of ['gnu', 'llvm']) {
  test(`A64 encodings match ${vectors(`a64-${dialect}`).reference}`, () => {
    const failures = [];
    const { vectors: list } = vectors(`a64-${dialect}`);
    for (const { id, operands, assembly, word } of list) {
      const entry = codec.encodable.find((e) => e.id === id);
      const ours = codec.hex({ word: codec.encodeEntry({ entry, operands }).words[0].word, width: 32 });
      if (ours !== word) failures.push(`${assembly}: sliderule ${ours}, ${dialect} ${word}`);
    }
    assert.deepEqual(failures, []);
    // every instruction is assembled at least once (ADRP by llvm-mc)
    const missing = codec.encodable.map((e) => e.id).filter((id) => !list.some((v) => v.id === id));
    assert.deepEqual(missing, dialect === 'gnu' ? ['adrp xd, page'] : []);
  });
}

test('A64: GNU as and llvm-mc agree', () => {
  const llvm = new Map(vectors('a64-llvm').vectors.map((v) => [`${v.id}|${v.operands}`, v.word]));
  for (const v of vectors('a64-gnu').vectors) assert.equal(v.word, llvm.get(`${v.id}|${v.operands}`), v.assembly);
});

test('A64: every entry decodes back to itself', () => {
  for (const { entry, operands } of allCases({ codec })) {
    const [{ word, inst, assembly, fields }] = codec.encodeEntry({ entry, operands }).words;
    const decoded = codec.decodeWord({ word });
    assert.ok(decoded, `${assembly} does not decode`);
    // hint #0 is nop
    if (inst.name === 'hint' && decoded.inst.name === 'nop') continue;
    assert.equal(decoded.assembly, assembly);
    assert.equal(decoded.inst.id, inst.id, assembly);
    assert.deepEqual(decoded.fields, fields, assembly);
  }
});

test('A64: bitmask and floating-point immediates as the Arm ARM expands them', () => {
  // 0x5555555555555555: element 2, one bit set; 0xff: element 64, eight ones; N:immr:imms = 1 000000 000111
  assert.equal(bitmask({ value: 0b0_000000_111100, bits: 64 }), 0x5555555555555555n);
  assert.equal(bitmask({ value: 0b1_000000_000111, bits: 64 }), 0xffn);
  assert.equal(bitmask({ value: 0b0_000000_111111, bits: 64 }), null);
  // 5334 and 1302 values (the known counts); more encodings, as immr bits above the element size repeat them
  const values = (bits) => new Set(Array.from({ length: 2 ** (bits === 64 ? 13 : 12) }, (_, v) => bitmask({ value: v, bits })).filter((v) => v !== null)).size;
  assert.equal(values(64), 5334);
  assert.equal(values(32), 1302);
  assert.deepEqual([0x70, 0x00, 0xf0, 0x40, 0x3f].map((value) => fpImmediate({ value })), [1, 2, -1, 0.125, 31]);
  const round = (assembly) => codec.decodeWord({ word: codec.encodeAssembly({ assembly }).words[0].word }).assembly;
  assert.equal(round('orr x0, xzr, #0x5555555555555555'), 'orr x0, xzr, #0x5555555555555555');
  assert.equal(round('fmov d1, #-0.125'), 'fmov d1, #-0.125');
  assert.equal(round('add x0, sp, #1, lsl #12'), 'add x0, sp, #1, lsl #12');
  assert.equal(round('add x0, x1, x2, lsl #0'), 'add x0, x1, x2');
  assert.equal(round('ldr x0, [x1, x2]'), 'ldr x0, [x1, x2]');
  assert.equal(round('ldrb w0, [x1, x2, lsl #0]'), 'ldrb w0, [x1, x2, lsl #0]');
  assert.equal(round('ret x30'), 'ret');
  assert.equal(round('b.ne -8'), 'b.ne -8');
  assert.throws(() => codec.encodeAssembly({ assembly: 'and x0, x1, #0' }));
  assert.throws(() => codec.encodeAssembly({ assembly: 'msr SPSEL, #2' }));
});
