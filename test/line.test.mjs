// The embeddable line API (src/line.mjs): decoding bytes of memory, encoding assembly, disassembling a program. The
// DOM helpers of cdn.magiwanders.com/main.js are stood in for by plain objects, enough to read the lines' text.
import test from 'node:test';
import assert from 'node:assert/strict';

const _el = (tag) => (attributes = {}, children = '') => {
  const kids = Array.isArray(children) ? children : [children];
  const node = { tag, attributes, children: kids, classList: { add() {} }, dataset: {} };
  Object.defineProperty(node, 'textContent', { get: () => kids.map((k) => (typeof k === 'string' ? k : k.textContent)).join('') });
  return node;
};
for (const tag of ['td', 'th', 'tr', 'table', 'tbody', 'colgroup', 'col', 'span', 'div', 'b', 'br']) globalThis[`_${tag}`] = _el(tag);

const { decoderLine, encoderLine, disassemble, assemble } = await import('../src/line.mjs');

test('decodes RISC-V bytes little-endian, compressed or not', () => {
  // addi a0, a0, -1 = 0xfff50513; c.li a0, 0 = 0x4501
  const full = decoderLine({ isa: 'rv32gc', bytes: [0x13, 0x05, 0xf5, 0xff] });
  assert.equal(full.assembly, 'addi a0, a0, -1');
  assert.equal(full.length, 4);
  const short = decoderLine({ isa: 'rv32gc', extensions: ['I', 'M', 'C'], bytes: [0x01, 0x45, 0x13, 0x05] });
  assert.equal(short.assembly, 'c.li a0, 0');
  assert.equal(short.length, 2);
  const cut = decoderLine({ isa: 'rv32gc', bytes: [0x13, 0x05] });
  assert.equal(cut.assembly, null);
  assert.match(cut.error, /4 bytes/);
});

test('decodes a Hack word from its two bytes, low byte first', () => {
  // D=A = 0b1110110000010000 = 0xec10
  assert.equal(decoderLine({ isa: 'hack', bytes: [0x10, 0xec] }).assembly, 'D=A');
  assert.equal(decoderLine({ isa: 'hack', bytes: [17, 0] }).assembly, '@17');
});

test('encodes assembly, a pseudo-instruction into all its words', () => {
  const addi = encoderLine({ isa: 'rv32gc', assembly: 'addi a0, a0, -1' });
  assert.equal(addi.error, null);
  assert.deepEqual(addi.words.map((w) => w.hex), ['0xfff50513']);
  assert.match(addi.element.textContent, /addi a0, a0, -1/);
  assert.equal(encoderLine({ isa: 'rv32gc', assembly: 'li a0, 0x12345' }).words.length, 2);
  assert.equal(encoderLine({ isa: 'hack', assembly: 'D=A' }).words[0].binary, '1110110000010000');
  assert.ok(encoderLine({ isa: 'rv32gc', assembly: 'frobnicate a0' }).error);
  assert.deepEqual(assemble({ isa: 'hack', assembly: '@17' }).words.map((w) => w.word), [17]);
});

test('disassembles a program, stepping over what is no instruction', () => {
  const bytes = [0x01, 0x45, 0x13, 0x05, 0xf5, 0xff, 0x00, 0x00];
  const lines = disassemble({ isa: 'rv32gc', extensions: ['I', 'M', 'C'], bytes });
  assert.deepEqual(lines.map((l) => [l.offset, l.length, l.assembly]), [[0, 2, 'c.li a0, 0'], [2, 4, 'addi a0, a0, -1'], [6, 2, null]]);
});
