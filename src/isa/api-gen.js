// Writes the API files of public/isa during `npm run build`: the instruction data as JSON, one file per instruction
// set, its registers, and the Sail and TableGen downloads of the header (isa/<set>.sail, isa/<set>.td), assembled from
// spec/ (official sources concatenated, with their licence; the unofficial ones as they are).
import fs from 'fs';
import { formats, groups, instructions, registers } from './rv32gc.mjs';
import { compiled, pseudos } from './codec.mjs';
import { isas } from './isas.mjs';
import { SAIL_FILES } from '../../tools/isa/gen-rv32gc.mjs';

console.log("Generating of API .json files...")

const hex = (value) => `0x${(value >>> 0).toString(16).padStart(8, '0')}`;

fs.writeFileSync(
    'public/isa/instructions.json',
    JSON.stringify({
        formats,
        groups,
        instructions: instructions.map((inst, i) => ({
            ...inst,
            extension: compiled[i].extension,
            format: compiled[i].format,
            width: compiled[i].width,
            mask: hex(compiled[i].mask),
            match: hex(compiled[i].match),
        })),
        pseudoInstructions: pseudos.map(({ name, asm, description, expansions }) => ({
            name, asm, description, expands: expansions.map(({ text }) => text),
        })),
        registers,
    }, null, 2)
)

// The integer registers in the shape this file always had.
const [integer] = registers;
fs.writeFileSync(
    'public/isa/register-files.json',
    JSON.stringify({
        RVI: Object.fromEntries(integer.rows.map(([name, abi, encoding, compressed, , meaning]) => [name, {
            '5_bit_encoding': parseInt(encoding, 2),
            '3_bit_compressed_encoding': compressed === '—' ? '-' : parseInt(compressed, 2),
            abi: abi.replace(' / ', '/'),
            description: meaning,
        }])),
    }, null, 2)
)

// The other instruction sets, one file each. Words are hex in memory order, as on their sheets.
for (const { value, codec } of isas.filter((isa) => isa.codec && isa.value !== 'rv32gc')) {
    const { name, formats, groups, sections, operands, registers } = codec.spec;
    fs.writeFileSync(
        `public/isa/${value}.json`,
        JSON.stringify({
            name, formats, groups, sections,
            operands: JSON.parse(JSON.stringify(operands ?? {})),
            instructions: codec.compiled.map(({ id, name, group, extension, format, description, pseudocode, enc, asm, expands, width, mask, match }) => ({
                id, name, group, extension, format, description, pseudocode, enc, asm, flags: expands, width,
                mask: codec.hex({ word: mask, width }), match: codec.hex({ word: match, width }),
            })),
            pseudoInstructions: codec.pseudos.map(({ name, description, expansions }) => ({ name, description, expands: expansions.map(({ text }) => text) })),
            registers,
        }, null, 2)
    )
}

// ---------------------------------------------------------------- Sail and TableGen downloads

const RISCV_TD = ['RISCVRegisterInfo.td', 'RISCVSystemOperands.td', 'RISCVInstrFormats.td', 'RISCVInstrFormatsC.td', 'RISCVInstrInfo.td',
    'RISCVInstrInfoM.td', 'RISCVInstrInfoA.td', 'RISCVInstrInfoZa.td', 'RISCVInstrInfoF.td', 'RISCVInstrInfoD.td', 'RISCVInstrInfoC.td'];
const MOS_TD = ['MOSRegisterInfo.td', 'MOSInstrFormats.td', 'MOSInstrInfo.td'];

const EXPORTS = {
    rv32gc: {
        sail: { files: SAIL_FILES.map((f) => f.slice(f.indexOf('spec/'))), licence: 'spec/sail-riscv/LICENCE',
            about: 'RV32GC in the official RISC-V Sail model, riscv/sail-riscv tag 2026-11-09-8118453 (BSD 2-Clause)' },
        tablegen: { files: RISCV_TD.map((f) => `spec/llvm/RISCV/${f}`), licence: 'spec/llvm/LICENSE.TXT',
            about: 'RV32GC in LLVM\'s RISC-V target, llvm/llvm-project llvmorg-23.1.5 (Apache 2.0 with LLVM exception); the target\'s other files (vector, vendor extensions, scheduling) are left out' },
    },
    6502: {
        sail: { files: ['spec/unofficial/mos6502/mos6502.sail'] },
        tablegen: { files: MOS_TD.map((f) => `spec/llvm/MOS/${f}`), licence: 'spec/llvm/LICENSE.TXT',
            about: 'The 6502 in llvm-mos, llvm-mos/llvm-mos commit ae72e49843c256272d89421942079cd623bedafb (Apache 2.0 with LLVM exception); its other files are left out' },
    },
    z80: { sail: { files: ['spec/unofficial/z80/z80.sail'] }, tablegen: { files: ['spec/unofficial/z80/Z80.td'] } },
    hack: { sail: { files: ['spec/unofficial/hack/hack.sail'] }, tablegen: { files: ['spec/unofficial/hack/Hack.td'] } },
};

// One file: an unofficial description as it is, official ones concatenated (each part starting with a ==== line)
// with the licence at the end.
function assemble({ files, licence, about }) {
    if (files.length === 1 && !licence) return fs.readFileSync(files[0], 'utf8');
    const comment = (text) => text.split('\n').map((line) => `// ${line}`.trimEnd()).join('\n');
    const parts = [comment(`${about}.\nThe files the RISC-V Sliderules read (https://github.com/magiwanders/riscv_sliderules_cheatsheets), concatenated:\n${files.map((f) => `  ${f.split('/').slice(-1)[0]}`).join('\n')}`)];
    for (const file of files) parts.push(`// ==== ${file.split('/').slice(-1)[0]} ${'='.repeat(60)}\n\n${fs.readFileSync(file, 'utf8')}`);
    parts.push(`// ==== Licence ${'='.repeat(60)}\n\n${comment(fs.readFileSync(licence, 'utf8'))}`);
    return `${parts.join('\n\n')}\n`;
}

for (const [value, { sail, tablegen }] of Object.entries(EXPORTS)) {
    fs.writeFileSync(`public/isa/${value}.sail`, assemble(sail));
    fs.writeFileSync(`public/isa/${value}.td`, assemble(tablegen));
}
