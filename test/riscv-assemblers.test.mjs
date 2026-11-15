import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { profileOf } from './riscv-profiles.mjs';

// The RV32 and RV64 encoders against two assemblers: GNU as (test/vectors/gnu-as.json, `npm run vectors`) and LLVM's llvm-mc
// (test/vectors/llvm-mc.json, `npm run vectors:llvm`). Both assemble the same cases (test/cases.mjs) of the extension
// profiles (test/riscv-profiles.mjs): every instruction and pseudo-instruction of every extension, with random operands
// and the edges of its immediate's range.

const hex = (word) => `0x${(word >>> 0).toString(16).padStart(8, '0')}`;

// RV64's li of a 32 bit value: GNU as (and the sheet) always add the low part with addiw; llvm-mc with addi when the sum
// cannot overflow 32 bits, the same value. Its words are taken for that: lui the same, then addi where GNU has addiw.
const ADDIW = 0b0011011;
const ADDI = 0b0010011;
function _llvmLi({ profile = '', text = '', ours = [], theirs = [] }) {
  if (!profile.startsWith('rv64') || !/^li /.test(text) || ours.length !== 2 || theirs.length !== 2 || ours[0] !== theirs[0]) return false;
  const [a, b] = [parseInt(ours[1], 16), parseInt(theirs[1], 16)];
  return (a & 0x7f) === ADDIW && (b & 0x7f) === ADDI && (a & ~0x7f) === (b & ~0x7f);
}
const FILES = { 'gnu-as': 'npm run vectors', 'llvm-mc': 'npm run vectors:llvm' };
const read = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));
const exists = (name) => existsSync(new URL(`./vectors/${name}.json`, import.meta.url));

for (const [name, command] of Object.entries(FILES)) {
  test(`encodings match ${name}`, { skip: !exists(name) && `no test/vectors/${name}.json yet: run \`${command}\`` }, () => {
    const { assembler, vectors } = read(name);
    const failures = [];
    for (const { profile, id, operands, ordering, words, ...rest } of vectors) {
      const text = rest.gnu || rest.llvm;
      const { codec } = profileOf(profile);
      const entry = codec.encodable.find((e) => e.id === id);
      if (!entry) {
        failures.push(`${text}: no entry ${id}`);
        continue;
      }
      try {
        const ours = codec.encodeEntry({ entry, operands, ordering }).words.map((w) => hex(w.word));
        if (JSON.stringify(ours) !== JSON.stringify(words) && !_llvmLi({ profile, text, ours, theirs: words })) failures.push(`${text}: sliderule ${ours.join(' ')}, ${assembler} ${words.join(' ')}`);
      } catch (e) {
        failures.push(`${text}: ${e.message}`);
      }
    }
    assert.deepEqual(failures, [], `differences from ${assembler}`);
    assert.ok(vectors.length > 13000, `only ${vectors.length} vectors`);
    assert.ok(vectors.some((v) => v.profile.startsWith('rv64')), 'RV64 too');
  });
}

test('GNU as and llvm-mc agree on every case (but RV64 li\'s addi / addiw)', { skip: !(exists('gnu-as') && exists('llvm-mc')) && 'needs both vector files' }, () => {
  const gnu = read('gnu-as').vectors;
  const llvm = read('llvm-mc').vectors;
  assert.equal(gnu.length, llvm.length);
  const failures = gnu.filter((g, i) => g.id !== llvm[i].id || (JSON.stringify(g.words) !== JSON.stringify(llvm[i].words)
    && !_llvmLi({ profile: g.profile, text: g.gnu, ours: g.words, theirs: llvm[i].words })))
    .map((g) => `${g.gnu}: GNU ${g.words.join(' ')}`);
  assert.deepEqual(failures, []);
});
