import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { riscvModule } from '../tools/isa/gen-riscv.mjs';
import { mos6502Module } from '../tools/isa/gen-mos6502.mjs';
import { retroModule } from '../tools/isa/gen-retro.mjs';
import { mipsModule } from '../tools/isa/gen-mips.mjs';
import { a64Module } from '../tools/isa/gen-a64.mjs';
import { a32Module } from '../tools/isa/gen-a32.mjs';
import { t32Module } from '../tools/isa/gen-t32.mjs';
import { x86Module } from '../tools/isa/gen-x86.mjs';

// The instruction data is generated: RV32 and RV64 from the Sail model and LLVM's TableGen (tools/isa/gen-riscv.mjs), the
// 6502 from llvm-mos's TableGen (tools/isa/gen-mos6502.mjs), the Z80, 8080, 8051 and Hack from their unofficial Sail and TableGen
// (tools/isa/gen-retro.mjs). Generating it again checks the sources against each other
// bit by bit, and that the committed modules are what they give.

const committed = (name) => readFileSync(new URL(`../src/isa/generated/${name}.mjs`, import.meta.url), 'utf8');

test('src/isa/generated/rv32gc.mjs and rv64gc.mjs are what Sail, TableGen and the overlays give (npm run isa)', () => {
  assert.equal(riscvModule({ xlen: 32 }), committed('rv32gc'));
  assert.equal(riscvModule({ xlen: 64 }), committed('rv64gc'));
});

test('src/isa/generated/mos6502.mjs is what llvm-mos TableGen and the overlay give (npm run isa)', () => {
  assert.equal(mos6502Module(), committed('mos6502'));
});

test('src/isa/generated/{z80,i8080,mcs51,hack}.mjs are what the unofficial Sail, TableGen and the overlays give (npm run isa)', () => {
  assert.equal(retroModule({ set: 'z80' }), committed('z80'));
  assert.equal(retroModule({ set: 'i8080' }), committed('i8080'));
  assert.equal(retroModule({ set: 'mcs51' }), committed('mcs51'));
  assert.equal(retroModule({ set: 'hack' }), committed('hack'));
});

test('src/isa/generated/mips32.mjs and mips64.mjs are what LLVM\'s Mips TableGen, the unofficial Sail and the overlay give (npm run isa)', () => {
  assert.equal(mipsModule({ xlen: 32 }), committed('mips32'));
  assert.equal(mipsModule({ xlen: 64 }), committed('mips64'));
});

test('src/isa/generated/a64.mjs is what LLVM\'s AArch64 TableGen, the unofficial Sail and the overlay give (npm run isa)', () => {
  assert.equal(a64Module(), committed('a64'));
});

test('src/isa/generated/a32.mjs is what LLVM\'s ARM TableGen, the unofficial Sail and the overlay give (npm run isa)', () => {
  assert.equal(a32Module(), committed('a32'));
});

test('src/isa/generated/t32.mjs is what LLVM\'s ARM TableGen (Thumb), the unofficial Sail and the overlay give (npm run isa)', () => {
  assert.equal(t32Module(), committed('t32'));
});

test('src/isa/generated/i8086.mjs is what the x86 table of the overlay gives, checked against LLVM\'s X86 records (npm run isa)', () => {
  assert.equal(x86Module({ set: 'i8086' }), committed('i8086'));
});

test('the CSRs the encoder knows by name have the addresses LLVM gives them, and the registers sheet lists them all', async () => {
  const { CSRS } = await import('../src/isa/codec.mjs');
  const { registers } = await import('../src/isa/rv32gc.mjs');
  const { sysregs } = JSON.parse(readFileSync(new URL('../spec/llvm/RISCV.json', import.meta.url), 'utf8'));
  for (const [name, address] of Object.entries(CSRS)) assert.equal(sysregs[name], address, name);
  assert.deepEqual(registers.at(-1).rows.map(([name]) => name).sort(), Object.keys(CSRS).sort());
});

test('RV64 knows the same CSRs but the upper halves only RV32 has (cycleh, ...)', async () => {
  const { CSRS } = await import('../src/isa/codec.mjs');
  const { csrs } = await import('../src/isa/rv64gc.mjs');
  const { sysregsRV32Only } = JSON.parse(readFileSync(new URL('../spec/llvm/RISCV.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(csrs).sort(), Object.keys(CSRS).filter((name) => !sysregsRV32Only.includes(name)).sort());
  assert.ok(!('cycleh' in csrs) && !('mstatush' in csrs) && 'cycle' in csrs);
});
