// What the x86 sheets (8086, IA-32, x86-64) share: the rows of a sheet from its lines, and the operands of a mode.
//
// A line is one instruction of one operand size as Intel's opcode tables write it ("66 01 /r  add r/m16, r16",
// "REX.W B8+r io  mov r64, imm64"), checked against LLVM by tools/isa/gen-x86.mjs and stored in src/isa/generated/.
// Each becomes a row per addressing form of its ModRM operand (the register, then memory by mod, with SIB in 32 and 64
// bit mode), and in 64 bit mode a row without REX and one with it (REX.R, X and B extend the register fields to 16
// registers; rows with REX.W have only the latter). The sheets then lay the rows out as any other instruction set's.

const range = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const hex2 = (n) => n.toString(16).padStart(2, '0');
const bin = (n, w) => n.toString(2).padStart(w, '0');

export const REG8 = ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'];
export const REG8X = ['al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil', ...range(8, (i) => `r${i + 8}b`)];
export const REG16 = ['ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di', ...range(8, (i) => `r${i + 8}w`)];
export const REG32 = ['eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi', ...range(8, (i) => `r${i + 8}d`)];
export const REG64 = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi', ...range(8, (i) => `r${i + 8}`)];
const BASE16 = ['bx+si', 'bx+di', 'bp+si', 'bp+di', 'si', 'di', 'bp', 'bx'];
const CC = ['o', 'no', 'b', 'ae', 'e', 'ne', 'be', 'a', 's', 'ns', 'p', 'np', 'l', 'ge', 'le', 'g'];
const SIZE = { 8: 'BYTE', 16: 'WORD', 32: 'DWORD', 64: 'QWORD' };
const ACC = { 16: 'AX', 32: 'EAX', 64: 'RAX' };

// "00 /r", "66 B8+r iw", "REX.W F7 /0 id", "70+cc cb", "D4 0A": the prefix (66 / REX.W), opcode bytes, ModRM (reg operand
// or a fixed /n), +r / +cc and what follows (ib iw id io: immediates; cb cw cd: relative offsets; cp: a far pointer)
export function parseOpcode(text) {
  const out = { prefix: [], bytes: [], modrm: null, plus: null, tail: [] };
  const tokens = text.split(/\s+/);
  for (const [i, t] of tokens.entries()) {
    let m;
    if (t === 'REX.W' || (t === '66' && i === 0 && tokens.length > 1 && /^[0-9A-F]{2}/.test(tokens[1]))) out.prefix.push(t);
    else if ((m = t.match(/^([0-9A-F]{2})\+(r|cc)$/))) { out.bytes.push(parseInt(m[1], 16)); out.plus = m[2]; }
    else if (/^[0-9A-F]{2}$/.test(t)) out.bytes.push(parseInt(t, 16));
    else if (t === '/r') out.modrm = 'r';
    else if ((m = t.match(/^\/([0-7])$/))) out.modrm = Number(m[1]);
    else if (/^(ib|iw|id|io|cb|cw|cd|cp)$/.test(t)) out.tail.push(t);
    else throw new Error(`opcode notation "${t}" in "${text}" not understood`);
  }
  return out;
}

// An operand of a line's template ("r/m32", "imm8", "FAR m16:32") and what it is.
export function operandSpec(spec) {
  let m;
  if ((m = spec.match(/^r\/m(8|16|32|64)$/))) return { kind: 'rm', size: Number(m[1]) };
  if ((m = spec.match(/^m(8|16|32)$/))) return { kind: 'm', size: Number(m[1]) };
  if (/^m(64|128)?$/.test(spec)) return { kind: 'm', size: null };
  if ((m = spec.match(/^(FAR )?m16:(16|32|64)$/))) return { kind: 'm', size: null, far: Number(m[2]), keyword: m[1] ? 'FAR' : null };
  if ((m = spec.match(/^r(8|16|32|64)$/))) return { kind: 'r', size: Number(m[1]) };
  if (spec === 'Sreg') return { kind: 'sreg' };
  if (spec === 'CRn' || spec === 'DRn') return { kind: 'ctl', key: spec === 'CRn' ? 'cr' : 'dr' };
  if ((m = spec.match(/^imm(8|16|32|64)$/))) return { kind: 'imm', size: Number(m[1]) };
  if ((m = spec.match(/^simm(8|32)$/))) return { kind: 'simm', size: Number(m[1]) };
  if (spec === 'lvl8') return { kind: 'lvl' };
  if ((m = spec.match(/^rel(8|16|32)$/))) return { kind: 'rel', size: Number(m[1]) };
  if ((m = spec.match(/^\[moffs(8|16|32|64)\]$/))) return { kind: 'moffs', size: Number(m[1]) };
  if ((m = spec.match(/^ptr16:(16|32)$/))) return { kind: 'far', size: Number(m[1]) };
  return { kind: 'lit', text: spec.toUpperCase(), size: { AL: 8, AX: 16, EAX: 32, RAX: 64, DX: 16 }[spec.toUpperCase()] };
}

// ---------------------------------------------------------------- addressing forms

// The ModRM forms of an r/m operand by mode: mod, the r/m field (or SIB), the displacement, the template text. In 32 and
// 64 bit mode b is the base register (r/m or SIB base), x the SIB index, scale its factor; R the register field's REX
// bit, X / B those of the index and base (null: the form has none, the bit is 0).
const FORMS = {
  16: [
    { key: 'reg', title: 'Register', format: 'REG', mod: '11' },
    { key: 'ind', title: '[base + index]', format: 'IND', mod: '00', rm: ['b16'], text: '[b16]' },
    { key: 'dir', title: '[disp16]', format: 'EXT', mod: '00', rm: ['110'], disp: ['a16', 16], text: '[a16]' },
    { key: 'd8', title: '[base + index + disp8]', format: 'IDX', mod: '01', rm: ['b16x'], disp: ['d8', 8], text: '[b16xd8]' },
    { key: 'd16', title: '[base + index + disp16]', format: 'IDX', mod: '10', rm: ['b16x'], disp: ['d16', 16], text: '[b16xd16]' },
  ],
  32: [
    { key: 'reg', title: 'Register', format: 'REG', mod: '11' },
    { key: 'ind', title: '[base]', format: 'IND', mod: '00', rm: ['b', '!={4,5}'], text: '[§B]' },
    { key: 'dir', title: '[disp32]', format: 'EXT', mod: '00', rm: ['101'], disp: ['a32', 32], text: '[a32]' },
    { key: 'd8', title: '[base + disp8]', format: 'IDX', mod: '01', rm: ['b', '!=4'], disp: ['d8', 8], text: '[§Bd8]' },
    { key: 'd32', title: '[base + disp32]', format: 'IDX', mod: '10', rm: ['b', '!=4'], disp: ['d32', 32], text: '[§Bd32]' },
    { key: 'sib', title: '[base + index × scale]', format: 'SIB', mod: '00', sib: { base: '!=5' }, text: '[§B{?+§X*scale}]' },
    { key: 'sibdir', title: '[index × scale + disp32]', format: 'SIBX', mod: '00', sib: { base: '101', index: '!=4' }, disp: ['d32', 32], text: '[§X*scaled32]' },
    { key: 'sibd8', title: '[base + index × scale + disp8]', format: 'SIBX', mod: '01', sib: {}, disp: ['d8', 8], text: '[§B{?+§X*scale}d8]' },
    { key: 'sibd32', title: '[base + index × scale + disp32]', format: 'SIBX', mod: '10', sib: {}, disp: ['d32', 32], text: '[§B{?+§X*scale}d32]' },
  ],
  64: [
    { key: 'reg', title: 'Register', format: 'REG', mod: '11' },
    { key: 'ind', title: '[base]', format: 'IND', mod: '00', rm: ['b', '!={4,5,12,13}'], text: '[§B]' },
    { key: 'rip', title: '[RIP + disp32]', format: 'RIP', mod: '00', rm: ['101'], disp: ['d32', 32], text: '[RIPd32]' },
    { key: 'abs', title: '[disp32]', format: 'EXT', mod: '00', sib: { base: '101', index: '100' }, disp: ['a32', 32], text: '[a32]' },
    { key: 'd8', title: '[base + disp8]', format: 'IDX', mod: '01', rm: ['b', '!={4,12}'], disp: ['d8', 8], text: '[§Bd8]' },
    { key: 'd32', title: '[base + disp32]', format: 'IDX', mod: '10', rm: ['b', '!={4,12}'], disp: ['d32', 32], text: '[§Bd32]' },
    { key: 'sib', title: '[base + index × scale]', format: 'SIB', mod: '00', sib: { base: '!={5,13}' }, text: '[§B{?+§X*scale}]' },
    { key: 'sibdir', title: '[index × scale + disp32]', format: 'SIBX', mod: '00', sib: { base: '101', index: '!=4' }, disp: ['d32', 32], text: '[§X*scaled32]' },
    { key: 'sibd8', title: '[base + index × scale + disp8]', format: 'SIBX', mod: '01', sib: {}, disp: ['d8', 8], text: '[§B{?+§X*scale}d8]' },
    { key: 'sibd32', title: '[base + index × scale + disp32]', format: 'SIBX', mod: '10', sib: {}, disp: ['d32', 32], text: '[§B{?+§X*scale}d32]' },
  ],
};

// A little-endian value of `bits` bits as the codec's split notation: name[7:0|15:8|...] (an immediate's pieces) or
// name[7:0] name[15:8] ... (an operand's).
const littleEndian = ({ name, bits, field = false }) => {
  const parts = range(bits / 8, (i) => `${i * 8 + 7}:${i * 8}`);
  return field ? parts.map((p) => `${name}[${p}]`).join(' ') : `${name}[${parts.join('|')}]`;
};

// One line's rows: [{ form, rex, enc, asm, name, first }].
export function expandLine({ line, mode }) {
  const p = parseOpcode(line.op);
  const [word, rest = ''] = line.asm.split(/\s(.*)/);
  // j~cc: the condition is the mnemonic's tail (jne)
  const [name, tail = null] = word.split('~');
  const specs = rest ? rest.split(/,\s*/).map(operandSpec) : [];
  const rmSpec = specs.find((s) => s.kind === 'rm' || s.kind === 'm');
  const regSpec = specs.find((s) => s.kind === 'r');
  const sizeOf = (s) => (s.kind === 'r' || s.kind === 'lit' ? s.size : s.kind === 'sreg' ? 16 : undefined);
  // the memory operand's size is written unless another operand has it
  const sizeKnown = rmSpec && specs.some((s) => s !== rmSpec && sizeOf(s) === rmSpec.size);
  const wide = mode === 64;
  const rexW = p.prefix.includes('REX.W');
  // the variants of a 64 bit mode line: without REX (8 registers, ah-bh) and with it (16 registers; spl-dil); REX.W
  // lines have only the latter, lines without a register field only the former
  const hasRegisters = Boolean(rmSpec || regSpec || p.plus === 'r');
  const variants = !wide ? [false] : rexW ? [true] : hasRegisters ? [false, true] : [false];
  let forms = rmSpec ? FORMS[mode].filter((f) => (rmSpec.kind === 'm' ? f.key !== 'reg' : true)) : [null];
  if (line.forms === 'reg') forms = forms.filter((f) => f && f.key === 'reg');
  const rows = [];
  for (const rex of variants) {
    // the operand keys of this variant: 8 bit registers with REX are r8x / rm8x; base and index by mode
    const regKey = (size, rm = false) => `${rm ? 'rm' : 'r'}${size}${size === 8 && rex ? 'x' : ''}`;
    const baseKey = mode === 64 ? 'b64' : 'b32';
    const indexKey = mode === 64 ? 'x64' : 'x32';
    // a 64 bit mode register field: its low three bits in ModRM / the opcode, the fourth (REX) only with REX
    const low = (key) => (wide && !/8$/.test(key) ? `${key}[2:0]` : key);
    for (const form of forms) {
      const enc = [];
      const rexBits = { R: '0', X: '0', B: '0' };
      const opBytes = [...p.bytes];
      const last = opBytes.pop();
      for (const b of opBytes) enc.push(bin(b, 8));
      if (p.plus === 'cc') enc.push(bin(last >> 4, 4), 'cc');
      else if (p.plus) {
        const key = regKey(regSpec.size);
        enc.push(bin(last >> 3, 5), `${low(key)}${line.plusNot !== undefined ? `!=${line.plusNot}` : ''}`);
        if (rex) rexBits.B = `${key}[3]`;
      } else enc.push(bin(last, 8));
      if (p.modrm !== null) {
        enc.push(form ? form.mod : '11');
        if (p.modrm === 'r') {
          const ctl = specs.find((s) => s.kind === 'ctl');
          if (specs.some((s) => s.kind === 'sreg')) enc.push(mode === 16 ? '0 sreg' : 'sreg');
          else if (ctl) enc.push(ctl.key);
          else {
            const key = regKey(regSpec.size);
            enc.push(low(key));
            if (rex) rexBits.R = `${key}[3]`;
          }
        } else enc.push(bin(p.modrm, 3));
        if (!form || form.key === 'reg') {
          const key = regKey(rmSpec ? rmSpec.size : regSpec.size, true);
          enc.push(low(key));
          if (rex) rexBits.B = `${key}[3]`;
        } else if (form.rm) {
          const [field, constraint = ''] = form.rm;
          if (/^[01]+$/.test(field)) enc.push(field);
          else if (mode === 16) enc.push(field);
          else {
            enc.push(`${low(baseKey)}${constraint}`);
            if (rex) rexBits.B = `${baseKey}[3]`;
          }
        } else if (form.sib) {
          const { base = '', index = '' } = form.sib;
          // no index: the scale is 00, as assemblers write it
          enc.push('100', index === '100' ? '00' : 'scale');
          if (index === '100') enc.push('100');
          else {
            enc.push(`${low(indexKey)}${index}`);
            if (rex) rexBits.X = `${indexKey}[3]`;
          }
          if (base === '101') enc.push('101');
          else {
            enc.push(`${low(baseKey)}${base}`);
            if (rex) rexBits.B = `${baseKey}[3]`;
          }
        }
        if (form && form.disp) {
          const [disp, bits] = form.disp;
          enc.push(bits === 8 ? disp : littleEndian({ name: disp, bits, field: true }));
        }
      }
      for (const t of p.tail) {
        // (enter's second immediate, the nesting level, is an operand of its own: an instruction has one immediate)
        if (t === 'ib') enc.push(specs.some((s) => s.kind === 'lvl') ? 'lvl' : specs.some((s) => s.kind === 'simm' && s.size === 8) ? 'simm[7:0]' : 'imm[7:0]');
        if (t === 'iw') enc.push('imm[7:0|15:8]');
        if (t === 'id') enc.push(littleEndian({ name: specs.some((s) => s.kind === 'simm' && s.size === 32) ? 'simm' : 'imm', bits: 32 }));
        if (t === 'io') enc.push(littleEndian({ name: 'imm', bits: 64 }));
        if (t === 'cb') enc.push('rel[7:0]');
        if (t === 'cw') enc.push(littleEndian({ name: 'rel', bits: 16 }));
        if (t === 'cd') enc.push(littleEndian({ name: 'rel', bits: 32 }));
        if (t === 'cp') enc.push(littleEndian({ name: 'imm', bits: specs.find((s) => s.kind === 'far').size }), littleEndian({ name: 'seg', bits: 16, field: true }));
      }
      const moffs = specs.find((s) => s.kind === 'moffs');
      if (moffs) enc.push(littleEndian({ name: 'imm', bits: mode }));
      // a REX with nothing to say (W, R, X and B all 0, no byte register that needs it) only makes a longer twin
      if (rex && !rexW && Object.values(rexBits).every((b) => b === '0') && !specs.some((s) => s.size === 8 && (s.kind === 'r' || (s.kind === 'rm' && form && form.key === 'reg')))) continue;
      // prefixes in front: 66, then REX
      const front = [];
      if (p.prefix.includes('66')) front.push('01100110');
      if (rex) front.push('0100', rexW ? '1' : '0', rexBits.R, rexBits.X, rexBits.B);
      // the template
      const ops = specs.map((s) => {
        if (s.kind === 'rm' || s.kind === 'm') {
          if (form.key === 'reg') return regKey(s.size, true);
          const text = form.text.replace('§B', baseKey).replace('§X', indexKey);
          const keyword = s.keyword ? (mode === 16 ? 'FAR ' : `FAR ${s.far === 64 ? 'TBYTE' : 'FWORD'} `) : sizeKnown || !s.size ? '' : `${SIZE[s.size]} `;
          return `${keyword}${text}`;
        }
        if (s.kind === 'r') return regKey(s.size);
        if (s.kind === 'sreg') return 'sreg';
        if (s.kind === 'ctl') return s.key;
        if (s.kind === 'imm') return 'imm';
        if (s.kind === 'simm') return 'simm';
        if (s.kind === 'lvl') return 'lvl';
        if (s.kind === 'rel') return 'rel';
        if (s.kind === 'moffs') return `${SIZE[s.size] && !specs.some((o) => o !== s && sizeOf(o) === s.size) ? `${SIZE[s.size]} ` : ''}[imm]`;
        if (s.kind === 'far') return 'seg:imm';
        return s.text;
      });
      rows.push({ form, rex, enc: [...front, ...enc].join(' '), asm: `${tail ? `~${tail}${ops.length ? ' ' : ''}` : ''}${ops.join(', ')}`, name, first: p.bytes[0], second: p.bytes[1] });
    }
  }
  return rows;
}

// The groups and instructions of a sheet: a group per family, form, opcode quarter (0F: the two-byte map) and prefixes.
export function x86Rows({ lines, families, mode }) {
  const groups = {};
  const instructions = [];
  for (const line of lines) {
    for (const { form, rex, enc, asm, name, first } of expandLine({ line, mode })) {
      const section = first === 0x0f ? 's4' : `s${first >> 6}`;
      const prefixes = [line.op.startsWith('66 ') ? '66' : '', rex ? 'REX' : ''].filter(Boolean).join(' + ');
      const key = [line.group, form ? form.key : '', section, prefixes.replace(/\W+/g, '')].filter(Boolean).join('-');
      const family = families[line.group];
      if (!family) throw new Error(`${line.group}: no group`);
      groups[key] ??= { section, format: form ? (form.key === 'reg' && family.format === 'REG' ? 'REG' : form.format) : family.format,
        title: `${family.title}${form ? `, ${form.title}` : ''}${prefixes ? ` (${prefixes})` : ''}`, pseudocode: family.pseudocode };
      instructions.push({ group: key, extension: line.class, name, enc, asm, description: line.description, pseudocode: line.pseudocode, expands: line.flags ?? '',
        ...(line.immMax !== undefined ? { immMax: line.immMax } : {}) });
    }
  }
  return { groups, instructions };
}

// ---------------------------------------------------------------- operands

const signed = (value) => (value < 0 ? `-0x${(-value).toString(16)}` : `+0x${value.toString(16)}`);
const _number = (text) => {
  const t = text.trim().toLowerCase();
  const neg = t.startsWith('-');
  const body = t.replace(/^[+-]/, '');
  if (!/^(0x[0-9a-f]+|\d+)$/.test(body)) throw new Error(`"${text}" is not a number`);
  return (neg ? -1 : 1) * Number(body);
};
const named = (names, extra = {}) => ({ width: Math.log2(names.length), names, ...extra });
const displacement = (width) => ({ width, signed: true, pattern: '[+-](?:0x[0-9a-f]+|\\d+)', text: ({ value = 0 }) => signed(value), parse: ({ text }) => _number(text) });
const address = (width) => ({ width, text: ({ value = 0 }) => `0x${value.toString(16)}` });

export function x86Operands({ mode }) {
  const cc = named(CC);
  if (mode === 16) {
    return {
      r8: named(REG8), rm8: named(REG8), r16: named(REG16.slice(0, 8)), rm16: named(REG16.slice(0, 8)),
      sreg: named(['es', 'cs', 'ss', 'ds']),
      // [bx+si] ... [bx]: 110 is [disp16] without a displacement, [bp] with one
      b16: named(BASE16, { exclude: [6] }), b16x: named(BASE16),
      // a displacement reads +0x12 or -0x3 after the base, a direct address 0x1234
      d8: displacement(8), d16: displacement(16), a16: address(16), seg: address(16), cc,
    };
  }
  const n = mode === 64 ? 16 : 8;
  const regs = (names) => named(names.slice(0, n));
  const out = {
    r8: named(REG8), rm8: named(REG8), r16: regs(REG16), rm16: regs(REG16), r32: regs(REG32), rm32: regs(REG32),
    // es ... gs: 110 and 111 are no segment register
    sreg: named(['es', 'cs', 'ss', 'ds', 'fs', 'gs', 'sr6', 'sr7'], { exclude: [6, 7] }),
    cr: named(range(8, (i) => `cr${i}`), { exclude: [1, 5, 6, 7] }), dr: named(range(8, (i) => `dr${i}`)),
    // SIB: the index (100: none, written eiz / riz as GNU as does) and its scale, left out of [base] when none
    scale: named(['1', '2', '4', '8'], { omit: 0 }),
    d8: displacement(8), d32: displacement(32), a32: address(32), seg: address(16), lvl: { width: 8 }, cc,
  };
  if (mode === 32) Object.assign(out, { b32: named(REG32.slice(0, 8)), x32: named(['eax', 'ecx', 'edx', 'ebx', 'eiz', 'ebp', 'esi', 'edi'], { omit: 4 }) });
  else Object.assign(out, { r64: regs(REG64), rm64: regs(REG64), r8x: named(REG8X), rm8x: named(REG8X), b64: named(REG64), x64: named(['rax', 'rcx', 'rdx', 'rbx', 'riz', ...REG64.slice(5)], { omit: 4 }) });
  return out;
}

export const x86Immediates = { imm: false, simm: true, rel: true };
// values and addresses in hex, signed immediates and offsets in decimal
export const immText = ({ inst = {}, value = 0 }) => (inst.immSigned ? String(value) : `0x${value.toString(16)}`);
export const accumulator = ACC;
export { hex2 };
