import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { encodable, encodeEntry } from '../src/isa/codec.mjs';

// The RV32GC encoder against two assemblers: GNU as (test/vectors/gnu-as.json, `npm run vectors`) and LLVM's llvm-mc
// (test/vectors/llvm-mc.json, `npm run vectors:llvm`). Both assemble the same cases (test/cases.mjs): every instruction
// and pseudo-instruction with random operands and the edges of its immediate's range.

const hex = (word) => `0x${(word >>> 0).toString(16).padStart(8, '0')}`;
const FILES = { 'gnu-as': 'npm run vectors', 'llvm-mc': 'npm run vectors:llvm' };
const read = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));
const exists = (name) => existsSync(new URL(`./vectors/${name}.json`, import.meta.url));

for (const [name, command] of Object.entries(FILES)) {
  test(`encodings match ${name}`, { skip: !exists(name) && `no test/vectors/${name}.json yet: run \`${command}\`` }, () => {
    const { assembler, vectors } = read(name);
    const failures = [];
    for (const { id, operands, ordering, words, ...rest } of vectors) {
      const text = rest.gnu || rest.llvm;
      const entry = encodable.find((e) => e.id === id);
      if (!entry) {
        failures.push(`${text}: no entry ${id}`);
        continue;
      }
      try {
        const ours = encodeEntry({ entry, operands, ordering }).words.map((w) => hex(w.word));
        if (JSON.stringify(ours) !== JSON.stringify(words)) failures.push(`${text}: sliderule ${ours.join(' ')}, ${assembler} ${words.join(' ')}`);
      } catch (e) {
        failures.push(`${text}: ${e.message}`);
      }
    }
    assert.deepEqual(failures, [], `differences from ${assembler}`);
    assert.ok(vectors.length > 500, `only ${vectors.length} vectors`);
  });
}

test('GNU as and llvm-mc agree on every case', { skip: !(exists('gnu-as') && exists('llvm-mc')) && 'needs both vector files' }, () => {
  const gnu = read('gnu-as').vectors;
  const llvm = read('llvm-mc').vectors;
  assert.equal(gnu.length, llvm.length);
  const failures = gnu.filter((g, i) => g.id !== llvm[i].id || JSON.stringify(g.words) !== JSON.stringify(llvm[i].words))
    .map((g) => `${g.gnu}: GNU ${g.words.join(' ')}`);
  assert.deepEqual(failures, []);
});
