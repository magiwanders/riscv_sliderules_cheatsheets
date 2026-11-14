import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rv32gcModule } from '../tools/isa/gen-rv32gc.mjs';
import { mos6502Module } from '../tools/isa/gen-mos6502.mjs';
import { retroModule } from '../tools/isa/gen-retro.mjs';

// The instruction data is generated: RV32GC from the Sail model and LLVM's TableGen (tools/isa/gen-rv32gc.mjs), the
// 6502 from llvm-mos's TableGen (tools/isa/gen-mos6502.mjs), the Z80 and Hack from their unofficial Sail and TableGen
// (tools/isa/gen-retro.mjs). Generating it again checks the sources against each other
// bit by bit, and that the committed modules are what they give.

const committed = (name) => readFileSync(new URL(`../src/isa/generated/${name}.mjs`, import.meta.url), 'utf8');

test('src/isa/generated/rv32gc.mjs is what Sail, TableGen and the overlay give (npm run isa)', () => {
  assert.equal(rv32gcModule(), committed('rv32gc'));
});

test('src/isa/generated/mos6502.mjs is what llvm-mos TableGen and the overlay give (npm run isa)', () => {
  assert.equal(mos6502Module(), committed('mos6502'));
});

test('src/isa/generated/{z80,hack}.mjs are what the unofficial Sail, TableGen and the overlays give (npm run isa)', () => {
  assert.equal(retroModule({ set: 'z80' }), committed('z80'));
  assert.equal(retroModule({ set: 'hack' }), committed('hack'));
});

test('the CSRs the encoder knows by name have the addresses LLVM gives them, and the registers sheet lists them all', async () => {
  const { CSRS } = await import('../src/isa/codec.mjs');
  const { registers } = await import('../src/isa/rv32gc.mjs');
  const { sysregs } = JSON.parse(readFileSync(new URL('../spec/llvm/RISCV.json', import.meta.url), 'utf8'));
  for (const [name, address] of Object.entries(CSRS)) assert.equal(sysregs[name], address, name);
  assert.deepEqual(registers.at(-1).rows.map(([name]) => name).sort(), Object.keys(CSRS).sort());
});
