// MIPS32 and MIPS64 (Release 2, the CPU instructions): 32 bit words, a 6 bit major opcode at the top. The sheets
// follow the opcode map: the major opcodes, and the instructions SPECIAL, REGIMM, COP0, COP2, SPECIAL2 and SPECIAL3 tell
// apart by another field (function, rt, rs). The ISA column says where an instruction comes from (MIPS I to MIPS64 R2),
// from LLVM's predicates.
//
// Registers carry the ABI's names: o32's on MIPS32, n64's on MIPS64 (a4-a7 are $8-$11, t0-t3 $12-$15). Branch offsets
// count bytes from the delay slot (the next instruction), jump targets are addresses in the 256 MB region of the delay
// slot, as the manual writes them. EXT / INS and their doubleword forms are written with pos and size as assemblers
// take them: the fields lsb, msbd and msb hold them less a bias (posBias, sizeBias, msbBias of the row).
//
// The instruction data is generated (src/isa/generated/mips{32,64}.mjs, `npm run isa`) from LLVM's Mips TableGen and
// the unofficial Sail of spec/unofficial/mips with src/isa/overlay/mips.json; see tools/isa/gen-mips.mjs.

const _number = (text) => {
  const t = text.trim().toLowerCase();
  const value = t.startsWith('0x') ? parseInt(t, 16) : Number(t);
  if (!Number.isInteger(value)) throw new Error(`"${text}" is not a number`);
  return value;
};

// pos = lsb + posBias; size = msbd + 1 + sizeBias (EXT) or msb + msbBias - pos + 1 (INS)
function _bitField(operands) {
  return {
    ...operands,
    lsb: { ...operands.lsb, text: ({ value = 0, inst = {} }) => String(value + (inst.posBias || 0)),
      parse: ({ text, inst = {} }) => _number(text) - (inst.posBias || 0) },
    msbd: { ...operands.msbd, text: ({ value = 0, inst = {} }) => String(value + 1 + (inst.sizeBias || 0)),
      parse: ({ text, inst = {} }) => _number(text) - 1 - (inst.sizeBias || 0) },
    msb: { ...operands.msb, text: ({ value = 0, fields = {}, inst = {} }) => String(value + (inst.msbBias || 0) - ((fields.lsb ?? 0) + (inst.posBias || 0)) + 1),
      parse: ({ text, values = {}, inst = {} }) => (values.lsb ?? 0) + (inst.posBias || 0) + _number(text) - 1 - (inst.msbBias || 0) },
  };
}

// The module the codec reads (createCodec), for the generated data of one width.
export function mipsSet({ data, xlen = 32 }) {
  return {
    ...data,
    name: `MIPS${xlen}`,
    xlen,
    operands: _bitField(data.operands),
    spine: { width: 32, title: 'inst[31:0]' },
    immediates: { imm: true, uimm: false, offset: true, target: false },
    labels: { ext: 'ISA', expansion: null },
    // the decoder sorts as the hardware decodes: major opcode, function, then rs and rt (REGIMM's and COP0's selectors)
    decodeOrder: { 32: [...[31, 30, 29, 28, 27, 26], ...[5, 4, 3, 2, 1, 0], ...[25, 24, 23, 22, 21], ...[20, 19, 18, 17, 16], ...[15, 14, 13, 12, 11, 10, 9, 8, 7, 6]] },
    widths: { ext: 96, instruction: 230, pseudocode: 300 },
    alwaysImmediateRow: true,
    widthOf: () => 32,
    // unsigned immediates and jump targets in hex, offsets and signed immediates in decimal
    immText: ({ inst = {}, value = 0 }) => (inst.immSigned ? String(value) : `0x${value.toString(16)}`),
  };
}
