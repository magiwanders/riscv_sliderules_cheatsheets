import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';
import { thumbImmediate } from '../src/isa/t32.mjs';

// The Thumb sheets against GNU as and llvm-mc (test/vectors/t32-{gnu,llvm}.json, `npm run vectors:t32`), which must also
// agree with each other where both assemble a line (GNU as knows the hints by name only).

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));
const codec = isas.find((i) => i.value === 'arm-thumb').codec;

for (const dialect of ['gnu', 'llvm']) {
  test(`Thumb encodings match ${vectors(`t32-${dialect}`).reference}`, () => {
    const failures = [];
    const { vectors: list } = vectors(`t32-${dialect}`);
    for (const { id, operands, assembly, word } of list) {
      const entry = codec.encodable.find((e) => e.id === id);
      const [w] = codec.encodeEntry({ entry, operands }).words;
      const ours = codec.hex({ word: w.word, width: w.inst.width });
      if (ours !== word) failures.push(`${assembly}: sliderule ${ours}, ${dialect} ${word}`);
    }
    assert.deepEqual(failures, []);
  });
}

test('Thumb: every instruction is assembled by GNU as or llvm-mc', () => {
  const ids = new Set([...vectors('t32-gnu').vectors, ...vectors('t32-llvm').vectors].map((v) => v.id));
  assert.deepEqual(codec.encodable.map((e) => e.id).filter((id) => !ids.has(id)), []);
});

test('Thumb: GNU as and llvm-mc agree', () => {
  const llvm = new Map(vectors('t32-llvm').vectors.map((v) => [`${v.id}|${v.operands}`, v.word]));
  for (const v of vectors('t32-gnu').vectors) if (llvm.has(`${v.id}|${v.operands}`)) assert.equal(v.word, llvm.get(`${v.id}|${v.operands}`), v.assembly);
});

test('Thumb: every entry decodes back to itself', () => {
  let refused = 0;
  const cases = allCases({ codec });
  for (const { entry, operands } of cases) {
    // random register lists the sheet refuses (sp in a list, pc in push's): most cases are not
    let encoded;
    try {
      [encoded] = codec.encodeEntry({ entry, operands }).words;
    } catch {
      refused++;
      continue;
    }
    const { word, inst, assembly, fields } = encoded;
    const decoded = codec.decodeWord({ word });
    assert.ok(decoded, `${assembly} does not decode`);
    assert.equal(decoded.assembly, assembly);
    assert.equal(decoded.inst.id, inst.id, assembly);
    assert.deepEqual(decoded.fields, fields, assembly);
  }
  assert.ok(refused < cases.length / 20, `${refused} of ${cases.length} refused`);
});

test('Thumb: modified immediates, long branches, IT and widths as the Arm ARM writes them', () => {
  // i:imm3:imm8: a byte, 00XY00XY, XY00XY00, XYXYXYXY, or 1bcdefgh rotated
  assert.deepEqual([0x0ab, 0x1ab, 0x2ab, 0x3ab, 0x400, 0x7ff].map((value) => thumbImmediate({ value })), [0xab, 0xab00ab, 0xab00ab00, 0xabababab, 0x80000000, 0x1fe0000]);
  const round = (assembly) => codec.decodeWord({ word: codec.encodeAssembly({ assembly }).words[0].word }).assembly;
  for (const text of ['adds r0, r1, r2', 'add r8, r9', 'push {r4, r5, lr}', 'ldm r1!, {r2, r3}', 'ldm r1, {r1, r3}', 'bl -1048576', 'blx 4096', 'itte ne', 'it eq',
    'add.w r0, r1, #0xff00ff', 'adds.w r0, r1, r2, lsl #3', 'ldr r0, [r1, #-4]!', 'tbh [r0, r1, LSL #1]', 'bne.w 1048574', 'b.w -16777216', 'cbz r2, 64']) {
    assert.equal(round(text), text);
  }
  const word = (assembly) => { const [w] = codec.encodeAssembly({ assembly }).words; return codec.hex({ word: w.word, width: w.inst.width }); };
  assert.equal(word('bx lr'), '0x4770');
  assert.equal(word('bl -1048576'), '0xf700f800');
  assert.equal(word('dmb ish'), '0xf3bf8f5b');
  assert.throws(() => codec.encodeAssembly({ assembly: 'push {r8}' }));
  assert.throws(() => codec.encodeAssembly({ assembly: 'ldm.w r0, {r1, sp}' }));
  assert.throws(() => codec.encodeAssembly({ assembly: 'add.w r0, r1, #0x101' }));
  // the halfwords of memory: 32 bit instructions start with hw1[15:11] 11101, 11110 or 11111
  assert.equal(codec.spec.widthOf({ bit: (b) => '11110'[31 - b] ?? '-' }), 32);
  assert.equal(codec.spec.widthOf({ bit: (b) => '01000'[31 - b] ?? '-' }), 16);
});
