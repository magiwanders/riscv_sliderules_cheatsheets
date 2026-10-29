import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { encodable, encodeEntry } from '../src/isa/codec.mjs';

// The encoder against GNU as: test/vectors/gnu-as.json is written by `npm run vectors` (test/gen-gnu-vectors.mjs).

const FILE = new URL('./vectors/gnu-as.json', import.meta.url);
const hex = (word) => `0x${(word >>> 0).toString(16).padStart(8, '0')}`;

test('encodings match GNU as', { skip: !existsSync(FILE) && 'no test/vectors/gnu-as.json yet: run `npm run vectors` with a RISC-V GNU toolchain' }, () => {
  const { assembler, vectors } = JSON.parse(readFileSync(FILE, 'utf8'));
  const failures = [];
  for (const { id, operands, ordering, gnu, words } of vectors) {
    const entry = encodable.find((e) => e.id === id);
    if (!entry) {
      failures.push(`${gnu}: no entry ${id}`);
      continue;
    }
    try {
      const ours = encodeEntry({ entry, operands, ordering }).words.map((w) => hex(w.word));
      if (JSON.stringify(ours) !== JSON.stringify(words)) failures.push(`${gnu}: sliderule ${ours.join(' ')}, GNU ${words.join(' ')}`);
    } catch (e) {
      failures.push(`${gnu}: ${e.message}`);
    }
  }
  assert.deepEqual(failures, [], `differences from ${assembler}`);
  assert.ok(vectors.length > 500, `only ${vectors.length} vectors`);
});
