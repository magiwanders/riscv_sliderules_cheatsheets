import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { isas } from '../src/isa/isas.mjs';

// A third, local check of the Arm sheets: Arm's machine-readable specification (the A64 XML). Its licence does not let
// it be copied (see CLAUDE.md, "What must never be committed"), so it is read where it lies, ARM_A64_XML or
// ~/.local/src/arm-xml/a64/ISA_A64_xml_A_profile-2025-12, and the test is skipped without it. Every row of the sheet
// must be an encoding Arm lists for its mnemonic: each bit Arm fixes is a literal of the row, with the same value.

const DIR = process.env.ARM_A64_XML || join(homedir(), '.local', 'src', 'arm-xml', 'a64', 'ISA_A64_xml_A_profile-2025-12');

// mask / match of the bits a list of <box> elements fixes (0, 1, and the should-be (0), (1))
function _boxes(xml, into) {
  for (const box of xml.matchAll(/<box hibit="(\d+)"(?: width="(\d+)")?[^>]*>([\s\S]*?)<\/box>/g)) {
    const hi = Number(box[1]);
    const cells = [...box[3].matchAll(/<c(?: colspan="(\d+)")?\s*(?:\/>|>([^<]*)<\/c>)/g)];
    let bit = hi;
    for (const [, span, text = ''] of cells) {
      const width = Number(span || 1);
      const value = text.replace(/[()]/g, '');
      for (let k = 0; k < width; k++, bit--) {
        into.mask[31 - bit] = width === 1 && /^[01]$/.test(value) ? 1 : 0;
        into.match[31 - bit] = width === 1 && /^[01]$/.test(value) ? Number(value) : 0;
      }
    }
  }
}

function _encodings() {
  const list = [];
  for (const file of readdirSync(DIR).filter((f) => f.endsWith('.xml'))) {
    const xml = readFileSync(join(DIR, file), 'utf8');
    if (!/<instructionsection [^>]*type="instruction"/.test(xml)) continue;
    for (const iclass of xml.matchAll(/<iclass [\s\S]*?<\/iclass>/g)) {
      const diagram = iclass[0].match(/<regdiagram[^>]*form="32"[\s\S]*?<\/regdiagram>/);
      if (!diagram) continue;
      const base = { mask: new Array(32).fill(0), match: new Array(32).fill(0) };
      _boxes(diagram[0], base);
      for (const encoding of iclass[0].matchAll(/<encoding name="(\w+)"[\s\S]*?<\/encoding>/g)) {
        const e = { name: encoding[1], mask: [...base.mask], match: [...base.match] };
        _boxes(encoding[0].replace(/<asmtemplate>[\s\S]*$/, ''), e);
        const mnemonic = encoding[0].match(/<docvar key="mnemonic" value="([^"]+)"/);
        list.push({ ...e, mnemonic: mnemonic ? mnemonic[1].toLowerCase() : null });
      }
    }
  }
  return list;
}

test('every A64 row is an encoding of Arm\'s machine-readable specification (local, skipped without it)', { skip: !existsSync(DIR) && `no Arm XML at ${DIR}` }, () => {
  const codec = isas.find((i) => i.value === 'arm64').codec;
  const encodings = _encodings();
  assert.ok(encodings.length > 1000);
  const failures = [];
  for (const inst of codec.compiled) {
    const bits = codec.binary({ word: inst.match, width: 32 });
    const mask = codec.binary({ word: inst.mask, width: 32 });
    const mnemonic = inst.name.split('.')[0];
    const fits = (e) => e.mask.every((m, i) => !m || (mask[i] === '1' && Number(bits[i]) === e.match[i]));
    if (!encodings.some((e) => e.mnemonic === mnemonic && fits(e))) {
      const near = encodings.filter(fits).map((e) => e.name).slice(0, 3);
      failures.push(`${inst.name} ${inst.asm} (${inst.enc}): ${near.length ? `fits ${near.join(', ')} of another mnemonic` : 'no encoding fits'}`);
    }
  }
  assert.deepEqual(failures, []);
});
