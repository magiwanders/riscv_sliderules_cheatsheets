import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';
import { modifiedImmediate } from '../src/isa/a32.mjs';

// The A32 sheets against GNU as and llvm-mc (test/vectors/a32-{gnu,llvm}.json, `npm run vectors:a32`), which must also
// agree with each other where both assemble a line (GNU as knows the hints by name only, llvm-mc refuses a user-registers
// store with writeback).

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));
const codec = isas.find((i) => i.value === 'arm32').codec;

for (const dialect of ['gnu', 'llvm']) {
  test(`A32 encodings match ${vectors(`a32-${dialect}`).reference}`, () => {
    const failures = [];
    const { vectors: list } = vectors(`a32-${dialect}`);
    for (const { id, operands, assembly, word } of list) {
      const entry = codec.encodable.find((e) => e.id === id);
      const ours = codec.hex({ word: codec.encodeEntry({ entry, operands }).words[0].word, width: 32 });
      if (ours !== word) failures.push(`${assembly}: sliderule ${ours}, ${dialect} ${word}`);
    }
    assert.deepEqual(failures, []);
  });
}

test('A32: every instruction is assembled by GNU as or llvm-mc', () => {
  const ids = new Set([...vectors('a32-gnu').vectors, ...vectors('a32-llvm').vectors].map((v) => v.id));
  assert.deepEqual(codec.encodable.map((e) => e.id).filter((id) => !ids.has(id)), []);
});

test('A32: GNU as and llvm-mc agree', () => {
  const llvm = new Map(vectors('a32-llvm').vectors.map((v) => [`${v.id}|${v.operands}`, v.word]));
  for (const v of vectors('a32-gnu').vectors) if (llvm.has(`${v.id}|${v.operands}`)) assert.equal(v.word, llvm.get(`${v.id}|${v.operands}`), v.assembly);
});

test('A32: every entry decodes back to itself', () => {
  for (const { entry, operands } of allCases({ codec })) {
    const [{ word, inst, assembly, fields }] = codec.encodeEntry({ entry, operands }).words;
    const decoded = codec.decodeWord({ word });
    assert.ok(decoded, `${assembly} does not decode`);
    assert.equal(decoded.assembly, assembly);
    assert.equal(decoded.inst.id, inst.id, assembly);
    assert.deepEqual(decoded.fields, fields, assembly);
  }
});

test('A32: modified immediates, shifts, conditions as the Arm ARM writes them', () => {
  // imm8 rotated right by twice the rotation: 0xff, 0xff ror 8, 3 ror 30, 4 ror 2
  assert.deepEqual([0x0ff, 0x4ff, 0xf03, 0x104].map((value) => modifiedImmediate({ value })), [0xff, 0xff000000, 0xc, 0x1]);
  const round = (assembly) => codec.decodeWord({ word: codec.encodeAssembly({ assembly }).words[0].word }).assembly;
  for (const text of ['addseq r0, r1, r2, lsl #3', 'mov r0, r1, rrx', 'mov r0, r1, lsr #32', 'mvnne r3, #0xff000000', 'ldr r0, [r1], -r2, asr #2',
    'ldrhne r0, [r1, -r2]', 'ldrd r2, r3, [r4, #-8]!', 'stmdb sp!, {r4, r5, lr}', 'msr CPSR_fc, r0', 'cpsid if', 'pkhtb r0, r1, r2, asr #32', 'ldr r0, [r1, #-0]']) {
    assert.equal(round(text), text);
  }
  assert.equal(round('add r0, r1, r2, lsl #0'), 'add r0, r1, r2');
  const word = (assembly) => codec.hex({ word: codec.encodeAssembly({ assembly }).words[0].word, width: 32 });
  assert.equal(word('bx lr'), '0xe12fff1e');
  assert.equal(word('dmb ish'), '0xf57ff05b');
  assert.throws(() => codec.encodeAssembly({ assembly: 'ldrd r1, r2, [r0]' }));
  assert.throws(() => codec.encodeAssembly({ assembly: 'mul pc, r0, r1' }));
  assert.throws(() => codec.encodeAssembly({ assembly: 'add r0, r1, #0x101' }));
});
