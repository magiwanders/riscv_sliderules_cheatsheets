import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodable, compiled, encodeAssembly, encodeEntry, decodeWord, partialDecode, formatAssembly } from '../src/isa/codec.mjs';
import { allCases } from './cases.mjs';

const hex = (word) => `0x${(word >>> 0).toString(16).padStart(8, '0')}`;
const words = (assembly) => encodeAssembly({ assembly }).words.map((w) => hex(w.word));

// Encodings found in the RISC-V spec or in every objdump of a RISC-V binary (function prologues, CSR reads, ...),
// and a few written out by hand from the spec's encoding tables.
const KNOWN = [
  ['nop', [0x00000013]],
  ['ecall', [0x00000073]],
  ['ebreak', [0x00100073]],
  ['ret', [0x00008067]],
  ['fence', [0x0ff0000f]],
  ['fence.i', [0x0000100f]],
  ['fence.tso', [0x8330000f]],
  ['pause', [0x0100000f]],
  ['csrr a0, mhartid', [0xf1402573]],
  ['auipc ra, 0', [0x00000097]],
  ['lui a0, 0x12345', [0x12345537]],
  ['addi a0, a1, -1', [0xfff58513]],
  ['li a0, 0x12345678', [0x12345537, 0x67850513]],
  ['li a0, 5', [0x00500513]],
  ['li a0, 0x1000', [0x00001537]],
  ['mul a0, a0, a1', [0x02b50533]],
  ['beq a0, a1, 8', [0x00b50463]],
  ['jal x0, 0', [0x0000006f]],
  ['lr.w a0, (a1)', [0x1005a52f]],
  ['amoadd.w.aq a3, a2, (a1)', [0x04c5a6af]],
  ['fadd.s fa0, fa1, fa2', [0x00c5f553]],
  ['fmadd.d fa0, fa1, fa2, fa3', [0x6ac5f543]],
  ['c.nop', [0x0001]],
  ['c.ebreak', [0x9002]],
  ['c.jr ra', [0x8082]],
  ['c.li a0, 0', [0x4501]],
  ['c.mv a0, a1', [0x852e]],
  ['c.addi sp, -16', [0x1141]],
  ['c.addi sp, -32', [0x1101]],
  ['c.addi16sp sp, -48', [0x7179]],
  ['c.addi4spn s0, sp, 16', [0x0800]],
  ['c.swsp ra, 12(sp)', [0xc606]],
  ['c.lwsp ra, 12(sp)', [0x40b2]],
  ['c.swsp s0, 8(sp)', [0xc422]],
  ['c.lwsp s0, 8(sp)', [0x4422]],
];

test('well-known encodings', () => {
  for (const [assembly, expected] of KNOWN) assert.deepEqual(words(assembly), expected.map(hex), assembly);
});

const cases = allCases();

test('every instruction round-trips: encode → decode → same instruction and assembly → same word', () => {
  const failures = [];
  const real = cases.filter((c) => !c.entry.pseudo);
  for (const { entry, operands, ordering } of real) {
    const label = `${entry.name}${ordering ? '.' + ordering : ''} ${operands}`;
    try {
      const [encoded] = encodeEntry({ entry, operands, ordering }).words;
      const decoded = decodeWord({ word: encoded.word });
      if (!decoded) failures.push(`${label}: ${hex(encoded.word)} does not decode`);
      else if (decoded.inst !== entry) failures.push(`${label}: ${hex(encoded.word)} decodes as ${decoded.assembly}`);
      else if (decoded.assembly !== encoded.assembly) failures.push(`${label}: decodes as "${decoded.assembly}", encoder says "${encoded.assembly}"`);
      else if (encodeAssembly({ assembly: decoded.assembly }).words[0].word !== encoded.word) failures.push(`${label}: re-assembling "${decoded.assembly}" gives another word`);
    } catch (e) {
      failures.push(`${label}: ${e.message}`);
    }
  }
  assert.deepEqual(failures, []);
  assert.ok(real.length > 600, `only ${real.length} cases`);
});

test('every pseudo-instruction encodes to words that decode as its base instructions', () => {
  for (const { entry, operands } of cases.filter((c) => c.entry.pseudo)) {
    const { words: encoded } = encodeEntry({ entry, operands });
    assert.ok(encoded.length >= 1 && encoded.length <= entry.expansions.length, `${entry.name} ${operands}`);
    for (const w of encoded) {
      const decoded = decodeWord({ word: w.word });
      assert.ok(decoded, `${entry.name} ${operands}: ${hex(w.word)} does not decode`);
      // pause (fence w, 0) is listed as a HINT encoding of fence
      assert.ok(decoded.inst.name === w.inst.name || decoded.inst.hint, `${entry.name} ${operands}: decodes as ${decoded.inst.name}`);
    }
  }
});

test('li and call split a 32 bit value so that hi + lo gives it back', () => {
  for (const value of [0, 1, -1, 2047, 2048, -2048, -2049, 0x7ff, 0x800, 0xfff, 0x12345678, 0x7fffffff, -0x80000000, 0x7ffff800]) {
    const encoded = encodeAssembly({ assembly: `li a0, ${value}` }).words;
    const result = encoded.reduce((acc, w) => (w.inst.name === 'lui' ? (w.fields.imm | 0) : (acc + w.fields.imm) | 0), 0);
    assert.equal(result, value, `li a0, ${value}`);
    const call = encodeAssembly({ assembly: `call ${value}` }).words;
    assert.equal(((call[0].fields.imm | 0) + call[1].fields.imm) | 0, value, `call ${value}`);
  }
});

test('out-of-range and misaligned operands are rejected', () => {
  for (const assembly of ['addi a0, a0, 2048', 'addi a0, a0, -2049', 'beq a0, a1, 3', 'c.lw a0, 2(a1)', 'c.lw a0, 4(a6)', 'c.addi4spn a0, sp, 0',
    'c.li x0, 1', 'slli a0, a0, 32', 'lui a0, 0x100000', 'c.addi16sp sp, 8', 'fadd.s a0, fa1, fa2']) {
    assert.throws(() => encodeAssembly({ assembly }), undefined, assembly);
  }
});

test('partial decoding names the instruction and the operands whose bits are all set', () => {
  // addi: opcode 0010011, funct3 000 set; everything else x.
  const constraints = new Array(32).fill('-');
  [...'0010011'].forEach((b, i) => { constraints[25 + i] = b; });
  [...'000'].forEach((b, i) => { constraints[17 + i] = b; });
  let partial = partialDecode({ constraints });
  assert.equal(partial.inst && partial.inst.name, 'addi');
  assert.deepEqual(partial.fields, { rd: null, rs1: null, imm: null });
  // then rd = a0 (01010, bits 11:7)
  [...'01010'].forEach((b, i) => { constraints[20 + i] = b; });
  partial = partialDecode({ constraints });
  assert.deepEqual(partial.fields, { rd: 10, rs1: null, imm: null });
  assert.equal(formatAssembly({ inst: partial.inst, fields: partial.fields }), 'addi a0, rs1, imm');
  // only the opcode: several candidates
  partial = partialDecode({ constraints: [...new Array(25).fill('-'), ...'0010011'] });
  assert.equal(partial.inst, null);
  assert.ok(partial.names.includes('addi') && partial.names.includes('srai'));
});

test('every RV32GC instruction and pseudo-instruction is encodable', () => {
  const real = compiled.filter((i) => !i.reserved && !i.hint);
  assert.equal(encodable.filter((e) => !e.pseudo).length, real.length);
  assert.ok(encodable.length > 220);
});
