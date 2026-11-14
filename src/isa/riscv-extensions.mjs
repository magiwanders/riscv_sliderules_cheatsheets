// The RISC-V extensions the toggles under the title show: the ratified unprivileged ones (and the privileged ones that
// add instructions), grouped as the specification groups them. A group with `bundle` is an extension of its own made of
// the others (G, B): its label toggles them all, and they stay toggles of their own. Only the extensions the sheets
// have instructions for can be toggled (sheetExtensions in rv32gc.mjs); the others are shown, waiting for their data.

export const EXTENSION_GROUPS = [
  { label: 'G', bundle: true, title: 'G = IMAFD + Zicsr + Zifencei, the general-purpose ISA', extensions: ['I', 'M', 'A', 'F', 'D', 'Zicsr', 'Zifencei'] },
  { label: 'C', title: 'Compressed instructions', extensions: ['C'] },
  { label: 'B', bundle: true, title: 'B = Zba + Zbb + Zbs, bit manipulation', extensions: ['Zba', 'Zbb', 'Zbs'] },
  { label: 'Integer', extensions: ['Zbc', 'Zicond', 'Zimop', 'Zilsd', 'Zicntr', 'Zihpm', 'Zihintpause', 'Zihintntl'] },
  { label: 'Atomics', extensions: ['Zacas', 'Zabha', 'Zawrs', 'Zalasr', 'Ztso'] },
  { label: 'Compressed', extensions: ['Zcb', 'Zcmp', 'Zcmt', 'Zcmop', 'Zclsd'] },
  { label: 'Floating Point', extensions: ['Q', 'Zfh', 'Zfhmin', 'Zfa', 'Zfbfmin', 'Zfinx', 'Zdinx', 'Zhinx', 'Zhinxmin'] },
  { label: 'Cache', extensions: ['Zicbom', 'Zicbop', 'Zicboz'] },
  { label: 'Control Flow', extensions: ['Zicfilp', 'Zicfiss'] },
  { label: 'Scalar Crypto', extensions: ['Zbkb', 'Zbkc', 'Zbkx', 'Zknd', 'Zkne', 'Zknh', 'Zksed', 'Zksh', 'Zkr', 'Zkt'] },
  { label: 'Vector', extensions: ['V', 'Zvfh', 'Zvfhmin', 'Zvfbfmin', 'Zvfbfwma', 'Zvbb', 'Zvbc', 'Zvkb', 'Zvkg', 'Zvkned', 'Zvknha', 'Zvknhb', 'Zvksed', 'Zvksh', 'Zvkt'] },
  { label: 'Privileged', extensions: ['H', 'Svinval', 'Smrnmi'] },
];

// The base, always there.
export const BASE = 'I';

// What an extension needs: turning it on turns these on, turning one of these off turns it off.
export const REQUIRES = { D: ['F'], F: ['Zicsr'], Q: ['D'], Zfh: ['F'], Zfhmin: ['F'], Zfa: ['F'], Zdinx: ['Zfinx'], Zhinx: ['Zfinx'], Zhinxmin: ['Zfinx'],
  Zcmp: ['Zcb'], Zcmt: ['Zicsr'], V: ['Zicsr'], Zvfh: ['V'], Zvfhmin: ['V'] };

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

// The ISA string the toggles spell, as the specification writes it: RV32 + single letters (G for all of IMAFD, Zicsr,
// Zifencei), then the Z extensions, joined with _.
export function isaString({ width = 32, enabled = new Set() }) {
  const [, ...g] = EXTENSION_GROUPS[0].extensions;
  const hasG = EXTENSION_GROUPS[0].extensions.every((e) => enabled.has(e));
  const letters = hasG ? 'G' : ['I', 'M', 'A', 'F', 'D', 'Q'].filter((e) => enabled.has(e)).join('');
  const single = ['C', 'B', 'V', 'H'].filter((e) => enabled.has(e)).join('');
  const multi = [...enabled].filter((e) => e.length > 1 && !(hasG && g.includes(e))).sort();
  return [`RV${width}${letters}${single}`, ...multi].join('_');
}
