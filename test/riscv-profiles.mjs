import { isas } from '../src/isa/isas.mjs';

// The RV32 extension sets the assemblers check, together covering every instruction of the sheets: some extensions take
// the same encodings (riscv-extensions.mjs CONFLICTS), so no single set holds them all. `march` is GNU as's, `mattr`
// llvm-mc's.

const rv32 = isas.find((isa) => isa.value === 'rv32gc');
const { available, codecFor } = rv32.extensions;

const ALL_BUT = ['Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin', 'Zclsd', 'Zcmp', 'Zcmt'];
const IN_X = ['I', 'M', 'A', 'C', 'Zicsr', 'Zifencei', 'Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin', 'Zcb', 'Zcmp', 'Zcmt', 'Zclsd', 'Zilsd'];

const SINGLE = ['M', 'A', 'F', 'D', 'Q', 'C', 'B', 'V', 'H'];
function _march({ enabled }) {
  const letters = ['i', ...SINGLE.filter((e) => enabled.has(e)).map((e) => e.toLowerCase())].join('');
  const multi = [...enabled].filter((e) => e.length > 1).map((e) => e.toLowerCase()).sort();
  return [`rv32${letters}`, ...multi].join('_');
}
// llvm-mc 23 still calls these experimental
const EXPERIMENTAL = ['zicfilp', 'zicfiss'];
const _mattr = ({ enabled }) => [...[...enabled].filter((e) => e !== 'I').map((e) => e.toLowerCase())
  .map((e) => `+${EXPERIMENTAL.includes(e) ? 'experimental-' : ''}${e}`), '-relax'].join(',');

function _profile({ name, enabled }) {
  const set = new Set([...enabled].filter((e) => available.has(e) || e === 'Zca'));
  return { name, enabled: set, codec: codecFor({ enabled: set }), march: _march({ enabled: set }), mattr: _mattr({ enabled: set }) };
}

export const profiles = [
  _profile({ name: 'rv32gc', enabled: rv32.extensions.defaults }),
  _profile({ name: 'all', enabled: new Set([...available].filter((e) => !ALL_BUT.includes(e))) }),
  _profile({ name: 'in-x', enabled: new Set(IN_X) }),
];
export const profileOf = (name) => profiles.find((p) => p.name === name);
