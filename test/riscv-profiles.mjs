import { isas } from '../src/isa/isas.mjs';

// The RV32 and RV64 extension sets the assemblers check, together covering every instruction of the sheets: some
// extensions take the same encodings (riscv-extensions.mjs CONFLICTS), so no single set holds them all. `march` / `mabi`
// are GNU as's, `triple` / `mattr` llvm-mc's.

const ALL_BUT = ['Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin', 'Zclsd', 'Zcmp', 'Zcmt'];
const IN_X = ['I', 'M', 'A', 'C', 'Zicsr', 'Zifencei', 'Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin', 'Zcb', 'Zcmp', 'Zcmt', 'Zclsd', 'Zilsd'];

const SINGLE = ['M', 'A', 'F', 'D', 'Q', 'C', 'B', 'V', 'H'];
function _march({ xlen, enabled }) {
  const letters = ['i', ...SINGLE.filter((e) => enabled.has(e)).map((e) => e.toLowerCase())].join('');
  const multi = [...enabled].filter((e) => e.length > 1).map((e) => e.toLowerCase()).sort();
  return [`rv${xlen}${letters}`, ...multi].join('_');
}
// llvm-mc 23 still calls these experimental
const EXPERIMENTAL = ['zicfilp', 'zicfiss'];
const _mattr = ({ enabled }) => [...[...enabled].filter((e) => e !== 'I').map((e) => e.toLowerCase())
  .map((e) => `+${EXPERIMENTAL.includes(e) ? 'experimental-' : ''}${e}`), '-relax'].join(',');

function _profile({ name, isa, enabled }) {
  const { available, codecFor, width: xlen } = isa.extensions;
  const set = new Set([...enabled].filter((e) => available.has(e) || e === 'Zca'));
  return { name, xlen, enabled: set, codec: codecFor({ enabled: set }), march: _march({ xlen, enabled: set }), mabi: xlen === 64 ? 'lp64' : 'ilp32',
    triple: `riscv${xlen}`, mattr: _mattr({ enabled: set }) };
}

const _profilesOf = ({ isa, prefix }) => [
  _profile({ name: `${prefix}gc`, isa, enabled: isa.extensions.defaults }),
  _profile({ name: prefix === 'rv32' ? 'all' : `${prefix}-all`, isa, enabled: new Set([...isa.extensions.available].filter((e) => !ALL_BUT.includes(e))) }),
  _profile({ name: prefix === 'rv32' ? 'in-x' : `${prefix}-in-x`, isa, enabled: new Set(IN_X) }),
];

export const profiles = [
  ..._profilesOf({ isa: isas.find((isa) => isa.value === 'rv32gc'), prefix: 'rv32' }),
  ..._profilesOf({ isa: isas.find((isa) => isa.value === 'rv64gc'), prefix: 'rv64' }),
];
export const profileOf = (name) => profiles.find((p) => p.name === name);
