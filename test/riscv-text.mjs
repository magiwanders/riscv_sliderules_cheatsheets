// The assembly an assembler is given for a test case (test/cases.mjs), per dialect: GNU as reads a bare number in a
// branch as an absolute address, so PC-relative operands are written ".+offset" for it; LLVM reads it as the offset.
// Negative c.lui values are written 0xfffe0-0xfffff for both. Pseudo-instructions that need relocations (call, tail,
// la, global loads and stores) are left out: their encoding depends on the linker.

export const PC_RELATIVE = ['branch', 'jal', 'c.jal', 'c.j', 'c.branch'];
export const RELOCATED = ['call', 'tail', 'la', 'lla', 'lb', 'lh', 'lw', 'sb', 'sh', 'sw', 'flw', 'fld', 'fsw', 'fsd'];

// The base instruction a case's immediate ends up in (pseudo-instructions: the first expansion using it).
function _immBase({ entry = {} }) {
  if (!entry.pseudo) return entry;
  const x = entry.expansions.find(({ base, mapping }) => base.segments.some((s) => s.kind === 'imm') && typeof mapping.imm !== 'number');
  return x ? x.base : null;
}

export function assemblerText({ entry = {}, operands = '', ordering = '', values = {}, dialect = 'gnu' }) {
  let text = operands;
  const base = _immBase({ entry });
  if (values.imm !== undefined && base) {
    const imm = String(values.imm);
    let written = imm;
    if (dialect === 'gnu' && PC_RELATIVE.includes(base.group)) written = `.${values.imm >= 0 ? '+' : ''}${values.imm}`;
    else if (base.name === 'c.lui' && values.imm < 0) written = `0x${(values.imm & 0xfffff).toString(16)}`;
    // the immediate is the only operand written as a plain number, replace that occurrence
    text = text.replace(new RegExp(`(^|[ ,(])${imm.replace('-', '\\-')}(?=$|[,(])`), `$1${written}`);
  }
  return `${entry.name}${ordering ? '.' + ordering : ''}${text ? ' ' + text : ''}`;
}

// The cases an assembler can check: all but the relocated pseudo-instructions.
export const assemblable = (cases) => cases.filter(({ entry }) => !(entry.pseudo && RELOCATED.includes(entry.name)));
