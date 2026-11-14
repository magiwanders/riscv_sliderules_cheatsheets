// The Hack computer (nand2tetris) machine language: 16 bit words, A-instructions and C-instructions.
//
// A C-instruction is written dest=comp;jump. Here comp is the "mnemonic" (one row per ALU operation, which is what
// a sheet of the language has to show), dest and jump its two operands; `arrange` puts them in place for the assembly.
//
// The instruction data is generated (src/isa/generated/hack.mjs, `npm run isa`) from the unofficial Sail and TableGen
// of spec/unofficial/hack with src/isa/overlay/hack.json; see tools/isa/gen-retro.mjs. This module adds what the codec
// needs to read it.

export { formats, sections, extensions, operands, groups, instructions, pseudoInstructions, registers } from './generated/hack.mjs';

export const name = 'Hack';
export const spine = { width: 16, title: 'inst[15:0]' };
export const immediates = { imm: false };
export const labels = { expansion: null };
export const widths = { ext: 76, pseudocode: 300 };
export const listedOrder = true; // the order of the language's tables, not of the mnemonics' characters
export const mnemonicGap = '';

// dest=comp;jump, the parts that are null left out; @value without a gap.
export function arrange({ parts = [] }) {
  const [mnemonic, ...rest] = parts;
  const [first, second] = rest.filter((part) => part.kind !== 'punct');
  if (mnemonic.text === '@') return [mnemonic, first];
  return [
    ...(first.text === 'null' ? [] : [first, { kind: 'punct', text: '=' }]),
    mnemonic,
    ...(second.text === 'null' ? [] : [{ kind: 'punct', text: ';' }, second]),
  ];
}

// The other way: the mnemonic and operand text of a line of Hack assembly (encodeAssembly).
export function parseAssembly({ assembly = '' }) {
  const text = assembly.trim();
  const address = text.match(/^@(\d+)$/);
  if (address) return [text, '@', address[1]];
  if (text.startsWith('@')) return [text, text, ''];
  const [, dest = 'null', comp = '', jump = 'null'] = text.match(/^(?:(\w+)=)?([^;]+)(?:;(\w+))?$/) || [];
  return [text, comp, `${dest}, ${jump}`];
}

export const widthOf = () => 16;
