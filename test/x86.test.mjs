import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isas } from '../src/isa/isas.mjs';
import { allCases } from './cases.mjs';

// The 8086, IA-32 and x86-64 sheets against GNU as and llvm-mc (test/vectors/{i8086,ia32,x86_64}-{gnu,llvm}.json,
// `npm run vectors:x86`), which must also agree with each other. llvm-mc chooses the ModRM direction of a register to
// register line itself (GNU as is told with {load} / {store}); its vectors are checked to be the same instruction, not
// the same bytes.

const vectors = (name) => JSON.parse(readFileSync(new URL(`./vectors/${name}.json`, import.meta.url), 'utf8'));

const SETS = [
  { value: '8086', file: 'i8086', title: '8086', width: 48 },
  { value: 'x86', file: 'ia32', title: 'IA-32', width: 88 },
  { value: 'x86_64', file: 'x86_64', title: 'x86-64', width: 96 },
].filter(({ file }) => !process.env.X86_SETS || process.env.X86_SETS.split(',').includes(file));

// The instruction's bytes in memory order, and the word a list of bytes is on the spine (first byte highest).
const bytesOf = ({ codec, word }) => codec.hex({ word: word.word, width: word.inst.width }).slice(2).match(/../g).map((b) => parseInt(b, 16));
const wordOf = ({ bytes, width }) => [...bytes, ...new Array(width / 8).fill(0)].slice(0, width / 8).reduce((word, b) => word * 256n + BigInt(b), 0n);
// a case's line, the accumulator written as a register (AX is a literal of its own rows, ax a register of the others')
const lineOf = ({ entry, operands }) => `${entry.asm.startsWith('~') ? entry.name : `${entry.name} `}${operands}`.trim().replace(/\b(AL|AX|EAX|RAX)\b/g, (r) => r.toLowerCase());

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
    });
  }

  test(`${title}: every row is assembled, but the longer twins the sheet itself writes shorter`, () => {
    const assembled = new Set([...vectors(`${file}-gnu`).vectors, ...vectors(`${file}-llvm`).vectors].map((v) => v.id));
    const missing = codec.encodable.filter((e) => !assembled.has(e.id));
    // a row no assembler writes: one of its lines is encoded by a shorter row (inc ax is 40, not ff c0; add eax, ecx
    // has no REX)
    const cases = allCases({ codec });
    const twin = (entry) => cases.filter((c) => c.id === entry.id).some((c) => {
      try {
        return codec.encodeAssembly({ assembly: lineOf(c) }).words[0].inst.width < entry.width;
      } catch {
        return false;
      }
    });
    assert.deepEqual(missing.filter((e) => !twin(e)).map((e) => e.id), []);
    assert.ok(missing.length < codec.encodable.length / 20, `${missing.length} rows not assembled`);
  });

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

const hexOf = (value) => {
  const codec = isas.find((i) => i.value === value).codec;
  return (assembly) => {
    const [w] = codec.encodeAssembly({ assembly }).words;
    return codec.hex({ word: w.word, width: w.inst.width });
  };
};
const roundOf = (value) => {
  const codec = isas.find((i) => i.value === value).codec;
  return (assembly) => codec.decodeWord({ word: codec.encodeAssembly({ assembly }).words[0].word }).assembly;
};

test('8086 assembly the way Intel writes it', () => {
  const hex = hexOf('8086');
  const round = roundOf('8086');
  assert.equal(hex('add al, cl'), '0x00c8');
  assert.equal(hex('add [bp+si-0x1234], ax'), '0x0182cced');
  assert.equal(hex('mov WORD [bp+si-0x80], 0xbeef'), '0xc74280efbe');
  assert.equal(hex('call 0x1234:0x5678'), '0x9a78563412');
  assert.equal(hex('int 0x21'), '0xcd21');
  assert.equal(hex('rol BYTE [si], CL'), '0xd204');
  // a displacement that does not fit a byte takes 16 bits
  assert.equal(hex('mov ax, [bp+0x80]'), '0x8b868000');
  // the accumulator's own forms show it as a literal
  assert.equal(round('mov ax, [0x1234]'), 'mov AX, [0x1234]');
  assert.equal(round('jne -2'), 'jne -2');
  assert.equal(round('call FAR [bx]'), 'call FAR [bx]');
});

test('IA-32: SIB addressing, the 66 prefix, the two-byte map', () => {
  const hex = hexOf('x86');
  assert.equal(hex('add eax, ecx'), '0x01c8');
  assert.equal(hex('add ax, cx'), '0x6601c8');
  assert.equal(hex('add [esp], ebx'), '0x011c24');
  assert.equal(hex('add [eax+ecx*4+0x10], ebx'), '0x015c8810');
  assert.equal(hex('add [ecx*4+0x100], ebx'), '0x011c8d00010000');
  assert.equal(hex('mov DWORD [ebp-0x8], 0x12345678'), '0xc745f878563412');
  assert.equal(hex('movzx eax, BYTE [esi]'), '0x0fb606');
  assert.equal(hex('lea eax, [ebx+esi*8-0x4]'), '0x8d44f3fc');
  assert.equal(hex('enter 0x10, 1'), '0xc8100001');
  assert.equal(hex('cmovne eax, [ebx]'), '0x0f4503');
});

test('x86-64: REX, RIP-relative and absolute addresses, 64 bit immediates', () => {
  const hex = hexOf('x86_64');
  const round = roundOf('x86_64');
  assert.equal(hex('add eax, ecx'), '0x01c8');
  assert.equal(hex('add rax, rcx'), '0x4801c8');
  assert.equal(hex('add r8, r15'), '0x4d01f8');
  assert.equal(hex('add spl, al'), '0x4000c4');
  assert.equal(hex('add al, ah'), '0x00e0');
  assert.equal(hex('mov rax, [rip+0x10]'), '0x488b0510000000');
  assert.equal(hex('mov rax, [0x1234]'), '0x488b042534120000');
  // r12 as a base takes a SIB byte, r13 a displacement, as rsp and rbp do
  assert.equal(hex('mov rax, [r12]'), '0x498b0424');
  assert.equal(hex('mov rax, [r13+0x8]'), '0x498b4508');
  assert.equal(hex('push r12'), '0x4154');
  assert.equal(hex('mov r9, -1'), '0x49c7c1ffffffff');
  assert.equal(hex('mov rax, 0x1122334455667'), '0x48b86756453423120100');
  assert.equal(round('mov rax, [rbx+r12*2+0x80]'), 'mov rax, [rbx+r12*2+0x80]');
});
