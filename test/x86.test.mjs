import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';

// The 8086 sheet against GNU as and llvm-mc (test/vectors/i8086-{gnu,llvm}.json, `npm run vectors:x86`), which must also
// agree with each other. llvm-mc chooses the ModRM direction of a register to register line itself (GNU as is told
// with {load} / {store}); its vectors are checked to be the same instruction, not the same bytes.

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));

const UNASSEMBLED = ['inc rm16', 'dec rm16', 'push rm16', 'pop rm16', 'mov rm8, imm', 'mov rm16, imm'];

const SETS = [{ value: '8086', file: 'i8086', title: '8086', width: 48 }];

// The instruction's bytes in memory order, and the word a list of bytes is on the spine (first byte highest).
const bytesOf = ({ codec, word }) => codec.hex({ word: word.word, width: word.inst.width }).slice(2).match(/../g).map((b) => parseInt(b, 16));
const wordOf = ({ bytes, width }) => [...bytes, ...new Array(width / 8).fill(0)].slice(0, width / 8).reduce((word, b) => word * 256n + BigInt(b), 0n);

for (const { value, file, title, width } of SETS) {
  const codec = isas.find((i) => i.value === value).codec;

  for (const dialect of ['gnu', 'llvm']) {
    test(`${title} encodings match ${vectors(`${file}-${dialect}`).reference}`, () => {
      const failures = [];
      const { vectors: list } = vectors(`${file}-${dialect}`);
      for (const { id, operands, assembly, bytes, eitherDirection, eitherOrder } of list) {
        const entry = codec.encodable.find((e) => e.id === id);
        const [w] = codec.encodeEntry({ entry, operands }).words;
        const ours = bytesOf({ codec, word: w });
        if (JSON.stringify(ours) === JSON.stringify(bytes)) continue;
        if (eitherDirection || eitherOrder) {
          // the other direction's opcode, the same line; xchg's registers the other way round
          const decoded = codec.decodeWord({ word: wordOf({ bytes, width }) });
          const swapped = (text) => text.replace(/^(\S+) (\S+), (\S+)$/, '$1 $3, $2');
          if (decoded && decoded.inst.width === bytes.length * 8 && (decoded.assembly === w.assembly || (eitherOrder && decoded.assembly === swapped(w.assembly)))) continue;
        }
        failures.push(`${assembly}: sliderule ${ours.map((b) => b.toString(16))}, ${dialect} ${bytes.map((b) => b.toString(16))}`);
      }
      assert.deepEqual(failures, []);
      // every instruction is assembled at least once, but for the register forms no assembler writes: the one byte
      // opcodes (inc ax is 40, not ff c0) and mov r, imm (b8+r) win (the round trip below checks them)
      assert.deepEqual(codec.encodable.map((e) => e.id).filter((id) => !list.some((v) => v.id === id) && !UNASSEMBLED.includes(id)), []);
    });
  }

  test(`${title}: GNU as and llvm-mc agree`, () => {
    const gnu = vectors(`${file}-gnu`).vectors;
    const llvm = vectors(`${file}-llvm`).vectors;
    assert.equal(gnu.length, llvm.length);
    gnu.forEach((v, i) => {
      if (!llvm[i].eitherDirection && !v.eitherOrder) assert.deepEqual(v.bytes, llvm[i].bytes, v.assembly);
    });
  });

  test(`${title}: every entry decodes back to itself, the assembled bytes decode to the line`, () => {
    for (const { entry, operands } of allCases({ codec })) {
      const [{ word, inst, assembly }] = codec.encodeEntry({ entry, operands }).words;
      const decoded = codec.decodeWord({ word });
      assert.ok(decoded, `${assembly} does not decode`);
      assert.equal(decoded.assembly, assembly);
      assert.equal(decoded.inst.id, inst.id, assembly);
    }
    for (const { bytes, id, operands, eitherOrder } of vectors(`${file}-gnu`).vectors) {
      if (eitherOrder) continue;
      const decoded = codec.decodeWord({ word: wordOf({ bytes, width }) });
      const entry = codec.encodable.find((e) => e.id === id);
      assert.equal(decoded && decoded.assembly, codec.encodeEntry({ entry, operands }).words[0].assembly, bytes.map((b) => b.toString(16)).join(' '));
    }
  });

  test(`${title}: groups have one format and section, ids are unique`, () => {
    const { groups, sections } = codec.spec;
    for (const key of Object.keys(groups)) assert.ok(sections[groups[key].section], key);
    assert.equal(new Set(codec.encodable.map((e) => e.id)).size, codec.encodable.length);
  });
}

test('8086 assembly the way Intel writes it', () => {
  const codec = isas.find((i) => i.value === '8086').codec;
  const hex = (assembly) => {
    const [w] = codec.encodeAssembly({ assembly }).words;
    return codec.hex({ word: w.word, width: w.inst.width });
  };
  const round = (assembly) => codec.decodeWord({ word: codec.encodeAssembly({ assembly }).words[0].word }).assembly;
  assert.equal(hex('add al, cl'), '0x00c8');
  assert.equal(hex('add [bp+si-0x1234], ax'), '0x0182cced');
  assert.equal(hex('mov WORD [bp+si-0x80], 0xbeef'), '0xc74280efbe');
  assert.equal(hex('call 0x1234:0x5678'), '0x9a78563412');
  assert.equal(hex('int 0x21'), '0xcd21');
  assert.equal(hex('rol BYTE [si], CL'), '0xd204');
  // the accumulator's own forms show it as a literal
  assert.equal(round('mov ax, [0x1234]'), 'mov AX, [0x1234]');
  assert.equal(round('jne -2'), 'jne -2');
  assert.equal(round('call FAR [bx]'), 'call FAR [bx]');
});
