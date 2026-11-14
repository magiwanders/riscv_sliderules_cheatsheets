// The RISC-V extensions the toggles under the title show, in one line: the single-letter extensions (and the bundles
// B and Zk), each with the ratified Z extensions closest to it folded under it (Zicsr under I, Zfh under F, Zcb under
// C, ...), shown in a popover from the letter's arrow. G frames I, M, A, F, D: its label toggles them with Zicsr and
// Zifencei. A bundle (B, Zk) is not an extension of its own: its letter toggles the Z extensions it stands for.
// Only the extensions the sheets have instructions for can be toggled (sheetExtensions in rv32gc.mjs).

export const EXTENSION_TREE = [
  { name: 'I', title: 'Base integer instructions', children: ['Zicsr', 'Zifencei', 'Zicond', 'Zimop', 'Zilsd', 'Zicntr', 'Zihpm', 'Zihintpause', 'Zihintntl', 'Zicbom', 'Zicbop', 'Zicboz', 'Zicfilp', 'Zicfiss'] },
  { name: 'M', title: 'Integer multiplication and division', children: [] },
  { name: 'A', title: 'Atomic instructions', children: ['Zacas', 'Zabha', 'Zawrs', 'Zalasr', 'Ztso'] },
  { name: 'F', title: 'Single-precision floating point', children: ['Zfh', 'Zfhmin', 'Zfa', 'Zfbfmin', 'Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin'] },
  { name: 'D', title: 'Double-precision floating point', children: [] },
  { name: 'Q', title: 'Quad-precision floating point', children: [] },
  { name: 'C', title: 'Compressed instructions', children: ['Zcb', 'Zcmp', 'Zcmt', 'Zcmop', 'Zclsd'] },
  { name: 'B', bundle: ['Zba', 'Zbb', 'Zbs'], title: 'Bit manipulation: B is Zba + Zbb + Zbs', children: ['Zba', 'Zbb', 'Zbs', 'Zbc'] },
  { name: 'Zk', bundle: ['Zbkb', 'Zbkc', 'Zbkx', 'Zkne', 'Zknd', 'Zknh', 'Zkr', 'Zkt'], title: 'Scalar cryptography: Zk is Zkn + Zkr + Zkt',
    children: ['Zbkb', 'Zbkc', 'Zbkx', 'Zknd', 'Zkne', 'Zknh', 'Zksed', 'Zksh', 'Zkr', 'Zkt'] },
  { name: 'V', title: 'Vector instructions', children: ['Zvfh', 'Zvfhmin', 'Zvfbfmin', 'Zvfbfwma', 'Zvbb', 'Zvbc', 'Zvkb', 'Zvkg', 'Zvkned', 'Zvknha', 'Zvknhb', 'Zvksed', 'Zvksh', 'Zvkt'] },
  { name: 'H', title: 'Hypervisor, and the privileged extensions that add instructions', children: ['Svinval', 'Smrnmi'] },
];

// G, the general-purpose ISA: the letters it frames, and what its label turns on.
export const G = { letters: ['I', 'M', 'A', 'F', 'D'], extensions: ['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei'] };

// The base, always there.
export const BASE = 'I';

// What an extension needs: turning it on turns these on, turning one of these off turns it off.
export const REQUIRES = { D: ['F'], F: ['Zicsr'], Q: ['D'], Zfh: ['F'], Zfhmin: ['F'], Zfa: ['F'], Zfbfmin: ['F'], Zdinx: ['Zfinx'], Zhinx: ['Zfinx'],
  Zhinxmin: ['Zfinx'], Zcb: ['C'], Zcmp: ['C'], Zcmt: ['C', 'Zicsr'], Zcmop: ['C'], Zclsd: ['C', 'Zilsd'], V: ['Zicsr'], Zvfh: ['V'], Zvfhmin: ['V'],
  Zvfbfmin: ['V'], Zvfbfwma: ['V'] };

// Every extension the toggles know.
export const allExtensions = () => [...new Set(EXTENSION_TREE.flatMap((e) => [...(e.bundle ? [] : [e.name]), ...e.children]))];

// The enabled set after turning `name` on or off, following REQUIRES both ways; the base stays.
export function toggled({ enabled = new Set(), name = '', on = true, available = new Set() }) {
  const next = new Set(enabled);
  const add = (n) => {
    if (next.has(n) || !available.has(n)) return;
    next.add(n);
    (REQUIRES[n] || []).forEach(add);
  };
  const remove = (n) => {
    if (n === BASE || !next.has(n)) return;
    next.delete(n);
    Object.entries(REQUIRES).filter(([, needs]) => needs.includes(n)).forEach(([dependent]) => remove(dependent));
  };
  if (on) add(name);
  else remove(name);
  return next;
}

// The ISA string the toggles spell, in the specification's naming: RV32, the single letters in canonical order (G for
// all of IMAFD, Zicsr, Zifencei; B when Zba, Zbb, Zbs are all there), then the other extensions, each after an _.
export function isaString({ width = 32, enabled = new Set() }) {
  const hasG = G.extensions.every((e) => enabled.has(e));
  const hasB = ['Zba', 'Zbb', 'Zbs'].every((e) => enabled.has(e));
  const letters = (hasG ? 'G' : ['I', 'M', 'A', 'F', 'D'].filter((e) => enabled.has(e)).join(''))
    + ['Q', 'C', ...(hasB ? ['B'] : []), 'V', 'H'].filter((e) => e === 'B' || enabled.has(e)).join('');
  const covered = new Set([...(hasG ? G.extensions : []), ...(hasB ? ['Zba', 'Zbb', 'Zbs'] : [])]);
  const multi = [...enabled].filter((e) => e.length > 1 && !covered.has(e)).sort();
  return [`RV${width}${letters}`, ...multi].join('_');
}
