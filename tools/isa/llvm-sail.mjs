// What the generators of the sheets checked against official LLVM TableGen share (gen-mips.mjs, gen-a64.mjs): comparing
// an unofficial Sail clause with the LLVM instruction of the same name bit by bit, and the sheet's encoding string from
// the Sail pieces.
//
// The two name fields differently (LLVM's imm16, shamt, a mem operand addr holding offset and base; the Sail's names
// are the sheets' operands) and LLVM often encodes an offset without its low bits, so the comparison is up to a
// renaming: each Sail field comes from one LLVM operand, at a fixed distance in bit numbers. An LLVM operand may feed
// several Sail fields (addr: base and offset).
import { fail } from './common.mjs';

// Sail and LLVM agree on every bit of a 32 bit instruction: literals equal (or unset in LLVM, which leaves some
// should-be-zero bits out), each Sail field one LLVM operand's bits at a fixed distance. llvmFixed: LLVM operands that
// may cover bits the Sail writes as literals (A64's ADD imm{13} over the reserved shift bit, MIPS's RDHWR sel). Returns
// the LLVM operand each Sail field comes from.
export function compare({ name, s, def, llvmFixed = [], width = 32 }) {
  const llvm = def.inst;
  if (llvm.length !== width || s.width !== width) fail(`${name}: ${s.width} bits in Sail, ${llvm.length} in LLVM`);
  const from = {};
  const shift = {};
  s.bits.forEach((b, i) => {
    const t = llvm[i];
    const m = t.match(/^(\w+)\{(\d+)\}$/);
    if (b.kind === 'lit') {
      if (t === String(b.value) || t === '-' || (m && llvmFixed.includes(m[1]))) return;
      fail(`${name}: bit ${width - 1 - i} is ${b.value} in Sail, ${t} in LLVM`);
    }
    if (!m) fail(`${name}: bit ${width - 1 - i} is ${b.name} in Sail, ${t} in LLVM`);
    const index = b.kind === 'imm' ? b.value : b.bit;
    if ((from[b.name] ?? m[1]) !== m[1]) fail(`${name}: Sail ${b.name} comes from LLVM ${from[b.name]} and ${m[1]}`);
    if ((shift[b.name] ?? index - Number(m[2])) !== index - Number(m[2])) fail(`${name}: Sail ${b.name} is not LLVM ${m[1]} shifted`);
    from[b.name] = m[1];
    shift[b.name] = index - Number(m[2]);
  });
  return from;
}

export function immLabel({ bits = [] }) {
  const runs = [];
  for (const b of bits) {
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === b + 1) last.push(b);
    else runs.push([b]);
  }
  return runs.map((r) => (r.length === 1 ? `${r[0]}` : `${r[0]}:${r[r.length - 1]}`)).join('|');
}

// The sheet's encoding: a cell per Sail piece, the pieces of one immediate as name[hi:lo|...]. fix: fields a row
// fixes (b.eq is b.cond with cond 0), written as literal bits.
export function encoding({ s, fix = {} }) {
  const bits = s.bits.map((b) => (b.kind === 'field' && fix[b.name] !== undefined ? { kind: 'lit', value: (fix[b.name] >> b.bit) & 1 } : b));
  for (const name of Object.keys(fix)) if (!s.bits.some((b) => b.kind === 'field' && b.name === name)) fail(`${s.key}: no field ${name} to fix`);
  const cells = [];
  bits.forEach((b, i) => {
    const last = cells[cells.length - 1];
    if (last && !s.cuts.includes(i) && last.kind === b.kind) last.bits.push(b);
    else cells.push({ kind: b.kind, name: b.name, bits: [b] });
  });
  return cells.map((c) => {
    if (c.kind === 'lit') return c.bits.map((b) => b.value).join('');
    if (c.kind === 'imm') return `${c.name}[${immLabel({ bits: c.bits.map((b) => b.value) })}]`;
    return c.name;
  }).join(' ');
}
