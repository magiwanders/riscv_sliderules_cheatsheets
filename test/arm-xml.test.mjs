import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { isas } from '../src/isa/isas.mjs';

// A third, local check of the Arm sheets: Arm's machine-readable specification (the A64 and AArch32 XML). Its licence
// does not let it be copied (see CLAUDE.md, "What must never be committed"), so it is read where it lies (ARM_A64_XML,
// ARM_AARCH32_XML, or under ~/.local/src/arm-xml), and the tests are skipped without it. Every row of the sheet must be
// an encoding Arm lists for its mnemonic: each bit Arm fixes is a literal of the row, with the same value.

const DIRS = {
  arm64: process.env.ARM_A64_XML || join(homedir(), '.local', 'src', 'arm-xml', 'a64', 'ISA_A64_xml_A_profile-2025-12'),
  'arm-thumb': process.env.ARM_AARCH32_XML || join(homedir(), '.local', 'src', 'arm-xml', 'a32', 'ISA_AArch32_xml_A_profile-2025-12'),
  arm32: process.env.ARM_AARCH32_XML || join(homedir(), '.local', 'src', 'arm-xml', 'a32', 'ISA_AArch32_xml_A_profile-2025-12'),
};

// mask / match of the bits a list of <box> elements fixes (0, 1, and the should-be (0), (1)), msb first
function _boxes(xml, into) {
  const width = into.mask.length;
  for (const box of xml.matchAll(/<box hibit="(\d+)"(?: width="(\d+)")?[^>]*>([\s\S]*?)<\/box>/g)) {
    const hi = Number(box[1]);
    const cells = [...box[3].matchAll(/<c(?: colspan="(\d+)")?\s*(?:\/>|>([^<]*)<\/c>)/g)];
    let bit = hi;
    for (const [, span, text = ''] of cells) {
      const width = Number(span || 1);
      const value = text.replace(/[()]/g, '');
      for (let k = 0; k < width; k++, bit--) {
        into.mask[into.mask.length - 1 - bit] = width === 1 && /^[01]$/.test(value) ? 1 : 0;
        into.match[into.mask.length - 1 - bit] = width === 1 && /^[01]$/.test(value) ? Number(value) : 0;
      }
    }
  }
}

// isa: the docvar of the encodings to read (A64, A32)
function _encodings({ dir, isa }) {
  const list = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.xml'))) {
    const xml = readFileSync(join(dir, file), 'utf8');
    if (!/<instructionsection [^>]*type="instruction"/.test(xml)) continue;
    for (const iclass of xml.matchAll(/<iclass [\s\S]*?<\/iclass>/g)) {
      // A64 and A32 are drawn as 32 bits, Thumb as 16 or as two halfwords (16x2, bits 31-0, hw1 high)
      const diagram = iclass[0].match(/<regdiagram[^>]*form="(32|16x2|16)"[\s\S]*?<\/regdiagram>/);
      if (!diagram || !new RegExp(`isa="${isa}"`).test(iclass[0].slice(0, 300))) continue;
      const width = diagram[1] === '16' ? 16 : 32;
      const base = { mask: new Array(width).fill(0), match: new Array(width).fill(0) };
      _boxes(diagram[0], base);
      for (const encoding of iclass[0].matchAll(/<encoding name="(\w+)"[\s\S]*?<\/encoding>/g)) {
        const e = { name: encoding[1], mask: [...base.mask], match: [...base.match] };
        _boxes(encoding[0].replace(/<asmtemplate>[\s\S]*$/, ''), e);
        const mnemonic = encoding[0].match(/<docvar key="mnemonic" value="([^"]+)"/);
        // srs{ia}: Arm's braces mark the default suffix
        list.push({ ...e, width, mnemonic: mnemonic ? mnemonic[1].toLowerCase().replace(/[{}]/g, '') : null });
      }
    }
  }
  return list;
}

// Rows Arm's current specification does not have as they are, and why.
const DIFFERENT = {
  'arm-thumb': [
    [/^hint$/, 'hint #n: Arm lists the hints by name (nop, yield, wfe, wfi, sev, ...), LLVM has the generic form'],
    [/^(cdp|mcr|mrc|mcrr|mrrc|stc|ldc)2?l?$/, 'the generic coprocessor instructions: ARMv8\'s AArch32 keeps them for cp14 and cp15 only'],
  ],
  arm32: [
    [/^swpb?$/, 'SWP, SWPB: ARMv7 only, gone from the AArch32 of ARMv8 and later, which the XML describes'],
    [/^hint$/, 'hint #n: Arm lists the hints by name (nop, yield, wfe, wfi, sev, ...), LLVM has the generic form'],
    [/^(cdp|mcr|mrc|mcrr|mrrc|stc|ldc)2?l?$/, 'the generic coprocessor instructions: ARMv8\'s AArch32 keeps them for cp14 and cp15 only'],
    [/^(ldm|stm)/, 'the user-registers forms (^): Arm lists LDM (user registers) and (exception return) apart by bit 15, one row on the sheet; STM^ with writeback is UNPREDICTABLE, kept as LLVM keeps it', (inst) => /\^/.test(inst.asm)],
  ],
};

for (const [value, isa] of [['arm64', 'A64'], ['arm32', 'A32'], ['arm-thumb', 'T32']]) {
  test(`every ${isa} row is an encoding of Arm's machine-readable specification (local, skipped without it)`, { skip: !existsSync(DIRS[value]) && `no Arm XML at ${DIRS[value]}` }, () => {
    const codec = isas.find((i) => i.value === value).codec;
    const encodings = _encodings({ dir: DIRS[value], isa });
    assert.ok(encodings.length > 300);
    const failures = [];
    for (const inst of codec.compiled) {
      const bits = codec.binary({ word: inst.match, width: inst.width });
      const mask = codec.binary({ word: inst.mask, width: inst.width });
      // A64's b.eq is b.cond. An A32 row writes S and the condition in the mnemonic's tail ({s}{cond}), where Arm lists
      // add and adds apart: bits Arm fixes there are the row's choice
      // Thumb: adds (16 bit outside IT) is Arm's add, .w is no part of the name
      const mnemonic = inst.name.replace(/\.w$/, '').split('.')[0];
      // (and SSAT / USAT's shift kind, which Arm splits by too)
      const tail = new Set(inst.segments.filter((g) => ['sflag', 'cond', 'shsat'].includes(g.key)).flatMap((g) => Array.from({ length: g.width }, (_, k) => 31 - g.lo - k)));
      const names = inst.segments.some((g) => g.key === 'sflag') ? [mnemonic, `${mnemonic}s`] : [mnemonic, ...(value === 'arm-thumb' ? [mnemonic.replace(/s$/, '')] : [])];
      const fits = (e) => e.width === inst.width && e.mask.every((m, i) => !m || tail.has(i) || (mask[i] === '1' && Number(bits[i]) === e.match[i]));
      // ldmda / stmib / rfedb: Arm names them ldm, stm, rfe with a suffix
      // ARMv8's AArch32 lists the shifts as mov / movs with a shifted register
      const shiftAsMov = value === 'arm-thumb' && /^(lsl|lsr|asr|ror|rrx)s?$/.test(mnemonic) ? [mnemonic.endsWith('s') || inst.width === 16 ? 'movs' : 'mov', 'mov', 'movs'] : [];
      const named = (e) => names.includes(e.mnemonic) || shiftAsMov.includes(e.mnemonic) || (/^(ldm|stm|rfe|srs)$/.test(e.mnemonic) && mnemonic.startsWith(e.mnemonic));
      if ((DIFFERENT[value] || []).some(([re, , when = () => true]) => re.test(mnemonic) && when(inst))) continue;
      if (!encodings.some((e) => named(e) && fits(e))) {
        const near = encodings.filter(fits).map((e) => `${e.name} (${e.mnemonic})`).slice(0, 3);
        failures.push(`${inst.name} ${inst.asm} (${inst.enc}): ${near.length ? `fits ${near.join(', ')}` : 'no encoding fits'}`);
      }
    }
    assert.deepEqual(failures, []);
  });
}
