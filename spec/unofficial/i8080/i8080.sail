// Intel 8080: encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// instruction set chapter of Intel's 8080 Microcomputer Systems User's Manual (September 1975). Neither Intel, the Sail
// project nor LLVM publish an 8080 description; this one is checked by assembling every instruction with the Macro
// Assembler AS and ASxxxx's as8085 (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses, encdec and assembly mappings, no execute clauses, and not
// checked by the Sail compiler. An instruction is its bytes in memory order, the first byte leftmost, as the sheets
// show it; 16 bit values are written low byte first (addr[7..0] @ addr[15..8]). Operand fields keep the manual's names
// (DDD / SSS are r, r1, r2; RP is rp, or rs where 11 is PSW; NNN of RST is n).

// Names of the operand fields, for the assembly mappings
mapping r_name : bits(3) <-> string = {
  0b000 <-> "B",
  0b001 <-> "C",
  0b010 <-> "D",
  0b011 <-> "E",
  0b100 <-> "H",
  0b101 <-> "L",
  0b110 <-> "M",
  0b111 <-> "A",
}

mapping rp_name : bits(2) <-> string = {
  0b00 <-> "B",
  0b01 <-> "D",
  0b10 <-> "H",
  0b11 <-> "SP",
}

mapping rs_name : bits(2) <-> string = {
  0b00 <-> "B",
  0b01 <-> "D",
  0b10 <-> "H",
  0b11 <-> "PSW",
}

mapping n_name : bits(3) <-> string = {
  0b000 <-> "0",
  0b001 <-> "1",
  0b010 <-> "2",
  0b011 <-> "3",
  0b100 <-> "4",
  0b101 <-> "5",
  0b110 <-> "6",
  0b111 <-> "7",
}

scattered union instruction

// MOV r1,r2: Move Register
union clause instruction = MOV_r1_r2 : (bits(3), bits(3))
mapping clause encdec = MOV_r1_r2(r1, r2)
  <-> 0b01 @ r1 @ r2
  when r1 != 0b110 & r2 != 0b110
mapping clause assembly = MOV_r1_r2(r1, r2)
  <-> "MOV" ^ spc() ^ r_name(r1) ^ sep() ^ r_name(r2)

// MOV r,M: Move from Memory
union clause instruction = MOV_r_M : (bits(3))
mapping clause encdec = MOV_r_M(r)
  <-> 0b01 @ r @ 0b110
  when r != 0b110
mapping clause assembly = MOV_r_M(r)
  <-> "MOV" ^ spc() ^ r_name(r) ^ sep() ^ "M"

// MOV M,r: Move to Memory
union clause instruction = MOV_M_r : (bits(3))
mapping clause encdec = MOV_M_r(r)
  <-> 0b01110 @ r
  when r != 0b110
mapping clause assembly = MOV_M_r(r)
  <-> "MOV" ^ spc() ^ "M" ^ sep() ^ r_name(r)

// MVI r,data: Move Immediate
union clause instruction = MVI_r : (bits(3), bits(8))
mapping clause encdec = MVI_r(r, data)
  <-> 0b00 @ r @ 0b110 @ data
  when r != 0b110
mapping clause assembly = MVI_r(r, data)
  <-> "MVI" ^ spc() ^ r_name(r) ^ sep() ^ hex_bits_8(data)

// MVI M,data: Move to Memory Immediate
union clause instruction = MVI_M : (bits(8))
mapping clause encdec = MVI_M(data)
  <-> 0b00110110 @ data
mapping clause assembly = MVI_M(data)
  <-> "MVI" ^ spc() ^ "M" ^ sep() ^ hex_bits_8(data)

// LXI rp,data16: Load Register Pair Immediate
union clause instruction = LXI : (bits(2), bits(16))
mapping clause encdec = LXI(rp, data16)
  <-> 0b00 @ rp @ 0b0001 @ data16[7..0] @ data16[15..8]
mapping clause assembly = LXI(rp, data16)
  <-> "LXI" ^ spc() ^ rp_name(rp) ^ sep() ^ hex_bits_16(data16)

// LDA addr: Load Accumulator Direct
union clause instruction = LDA : (bits(16))
mapping clause encdec = LDA(addr)
  <-> 0b00111010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDA(addr)
  <-> "LDA" ^ spc() ^ hex_bits_16(addr)

// STA addr: Store Accumulator Direct
union clause instruction = STA : (bits(16))
mapping clause encdec = STA(addr)
  <-> 0b00110010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STA(addr)
  <-> "STA" ^ spc() ^ hex_bits_16(addr)

// LHLD addr: Load H and L Direct
union clause instruction = LHLD : (bits(16))
mapping clause encdec = LHLD(addr)
  <-> 0b00101010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LHLD(addr)
  <-> "LHLD" ^ spc() ^ hex_bits_16(addr)

// SHLD addr: Store H and L Direct
union clause instruction = SHLD : (bits(16))
mapping clause encdec = SHLD(addr)
  <-> 0b00100010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = SHLD(addr)
  <-> "SHLD" ^ spc() ^ hex_bits_16(addr)

// LDAX B: Load Accumulator Indirect
union clause instruction = LDAX_B : unit
mapping clause encdec = LDAX_B()
  <-> 0b00001010
mapping clause assembly = LDAX_B()
  <-> "LDAX" ^ spc() ^ "B"

// LDAX D: Load Accumulator Indirect
union clause instruction = LDAX_D : unit
mapping clause encdec = LDAX_D()
  <-> 0b00011010
mapping clause assembly = LDAX_D()
  <-> "LDAX" ^ spc() ^ "D"

// STAX B: Store Accumulator Indirect
union clause instruction = STAX_B : unit
mapping clause encdec = STAX_B()
  <-> 0b00000010
mapping clause assembly = STAX_B()
  <-> "STAX" ^ spc() ^ "B"

// STAX D: Store Accumulator Indirect
union clause instruction = STAX_D : unit
mapping clause encdec = STAX_D()
  <-> 0b00010010
mapping clause assembly = STAX_D()
  <-> "STAX" ^ spc() ^ "D"

// XCHG: Exchange H and L with D and E
union clause instruction = XCHG : unit
mapping clause encdec = XCHG()
  <-> 0b11101011
mapping clause assembly = XCHG()
  <-> "XCHG"

// ADD r: Add Register
union clause instruction = ADD_r : (bits(3))
mapping clause encdec = ADD_r(r)
  <-> 0b10000 @ r
  when r != 0b110
mapping clause assembly = ADD_r(r)
  <-> "ADD" ^ spc() ^ r_name(r)

// ADD M: Add Memory
union clause instruction = ADD_M : unit
mapping clause encdec = ADD_M()
  <-> 0b10000110
mapping clause assembly = ADD_M()
  <-> "ADD" ^ spc() ^ "M"

// ADI data: Add Immediate
union clause instruction = ADI : (bits(8))
mapping clause encdec = ADI(data)
  <-> 0b11000110 @ data
mapping clause assembly = ADI(data)
  <-> "ADI" ^ spc() ^ hex_bits_8(data)

// ADC r: Add Register with Carry
union clause instruction = ADC_r : (bits(3))
mapping clause encdec = ADC_r(r)
  <-> 0b10001 @ r
  when r != 0b110
mapping clause assembly = ADC_r(r)
  <-> "ADC" ^ spc() ^ r_name(r)

// ADC M: Add Memory with Carry
union clause instruction = ADC_M : unit
mapping clause encdec = ADC_M()
  <-> 0b10001110
mapping clause assembly = ADC_M()
  <-> "ADC" ^ spc() ^ "M"

// ACI data: Add Immediate with Carry
union clause instruction = ACI : (bits(8))
mapping clause encdec = ACI(data)
  <-> 0b11001110 @ data
mapping clause assembly = ACI(data)
  <-> "ACI" ^ spc() ^ hex_bits_8(data)

// SUB r: Subtract Register
union clause instruction = SUB_r : (bits(3))
mapping clause encdec = SUB_r(r)
  <-> 0b10010 @ r
  when r != 0b110
mapping clause assembly = SUB_r(r)
  <-> "SUB" ^ spc() ^ r_name(r)

// SUB M: Subtract Memory
union clause instruction = SUB_M : unit
mapping clause encdec = SUB_M()
  <-> 0b10010110
mapping clause assembly = SUB_M()
  <-> "SUB" ^ spc() ^ "M"

// SUI data: Subtract Immediate
union clause instruction = SUI : (bits(8))
mapping clause encdec = SUI(data)
  <-> 0b11010110 @ data
mapping clause assembly = SUI(data)
  <-> "SUI" ^ spc() ^ hex_bits_8(data)

// SBB r: Subtract Register with Borrow
union clause instruction = SBB_r : (bits(3))
mapping clause encdec = SBB_r(r)
  <-> 0b10011 @ r
  when r != 0b110
mapping clause assembly = SBB_r(r)
  <-> "SBB" ^ spc() ^ r_name(r)

// SBB M: Subtract Memory with Borrow
union clause instruction = SBB_M : unit
mapping clause encdec = SBB_M()
  <-> 0b10011110
mapping clause assembly = SBB_M()
  <-> "SBB" ^ spc() ^ "M"

// SBI data: Subtract Immediate with Borrow
union clause instruction = SBI : (bits(8))
mapping clause encdec = SBI(data)
  <-> 0b11011110 @ data
mapping clause assembly = SBI(data)
  <-> "SBI" ^ spc() ^ hex_bits_8(data)

// ANA r: AND Register
union clause instruction = ANA_r : (bits(3))
mapping clause encdec = ANA_r(r)
  <-> 0b10100 @ r
  when r != 0b110
mapping clause assembly = ANA_r(r)
  <-> "ANA" ^ spc() ^ r_name(r)

// ANA M: AND Memory
union clause instruction = ANA_M : unit
mapping clause encdec = ANA_M()
  <-> 0b10100110
mapping clause assembly = ANA_M()
  <-> "ANA" ^ spc() ^ "M"

// ANI data: AND Immediate
union clause instruction = ANI : (bits(8))
mapping clause encdec = ANI(data)
  <-> 0b11100110 @ data
mapping clause assembly = ANI(data)
  <-> "ANI" ^ spc() ^ hex_bits_8(data)

// XRA r: Exclusive OR Register
union clause instruction = XRA_r : (bits(3))
mapping clause encdec = XRA_r(r)
  <-> 0b10101 @ r
  when r != 0b110
mapping clause assembly = XRA_r(r)
  <-> "XRA" ^ spc() ^ r_name(r)

// XRA M: Exclusive OR Memory
union clause instruction = XRA_M : unit
mapping clause encdec = XRA_M()
  <-> 0b10101110
mapping clause assembly = XRA_M()
  <-> "XRA" ^ spc() ^ "M"

// XRI data: Exclusive OR Immediate
union clause instruction = XRI : (bits(8))
mapping clause encdec = XRI(data)
  <-> 0b11101110 @ data
mapping clause assembly = XRI(data)
  <-> "XRI" ^ spc() ^ hex_bits_8(data)

// ORA r: OR Register
union clause instruction = ORA_r : (bits(3))
mapping clause encdec = ORA_r(r)
  <-> 0b10110 @ r
  when r != 0b110
mapping clause assembly = ORA_r(r)
  <-> "ORA" ^ spc() ^ r_name(r)

// ORA M: OR Memory
union clause instruction = ORA_M : unit
mapping clause encdec = ORA_M()
  <-> 0b10110110
mapping clause assembly = ORA_M()
  <-> "ORA" ^ spc() ^ "M"

// ORI data: OR Immediate
union clause instruction = ORI : (bits(8))
mapping clause encdec = ORI(data)
  <-> 0b11110110 @ data
mapping clause assembly = ORI(data)
  <-> "ORI" ^ spc() ^ hex_bits_8(data)

// CMP r: Compare Register
union clause instruction = CMP_r : (bits(3))
mapping clause encdec = CMP_r(r)
  <-> 0b10111 @ r
  when r != 0b110
mapping clause assembly = CMP_r(r)
  <-> "CMP" ^ spc() ^ r_name(r)

// CMP M: Compare Memory
union clause instruction = CMP_M : unit
mapping clause encdec = CMP_M()
  <-> 0b10111110
mapping clause assembly = CMP_M()
  <-> "CMP" ^ spc() ^ "M"

// CPI data: Compare Immediate
union clause instruction = CPI : (bits(8))
mapping clause encdec = CPI(data)
  <-> 0b11111110 @ data
mapping clause assembly = CPI(data)
  <-> "CPI" ^ spc() ^ hex_bits_8(data)

// INR r: Increment Register
union clause instruction = INR_r : (bits(3))
mapping clause encdec = INR_r(r)
  <-> 0b00 @ r @ 0b100
  when r != 0b110
mapping clause assembly = INR_r(r)
  <-> "INR" ^ spc() ^ r_name(r)

// INR M: Increment Memory
union clause instruction = INR_M : unit
mapping clause encdec = INR_M()
  <-> 0b00110100
mapping clause assembly = INR_M()
  <-> "INR" ^ spc() ^ "M"

// DCR r: Decrement Register
union clause instruction = DCR_r : (bits(3))
mapping clause encdec = DCR_r(r)
  <-> 0b00 @ r @ 0b101
  when r != 0b110
mapping clause assembly = DCR_r(r)
  <-> "DCR" ^ spc() ^ r_name(r)

// DCR M: Decrement Memory
union clause instruction = DCR_M : unit
mapping clause encdec = DCR_M()
  <-> 0b00110101
mapping clause assembly = DCR_M()
  <-> "DCR" ^ spc() ^ "M"

// INX rp: Increment Register Pair
union clause instruction = INX : (bits(2))
mapping clause encdec = INX(rp)
  <-> 0b00 @ rp @ 0b0011
mapping clause assembly = INX(rp)
  <-> "INX" ^ spc() ^ rp_name(rp)

// DCX rp: Decrement Register Pair
union clause instruction = DCX : (bits(2))
mapping clause encdec = DCX(rp)
  <-> 0b00 @ rp @ 0b1011
mapping clause assembly = DCX(rp)
  <-> "DCX" ^ spc() ^ rp_name(rp)

// DAD rp: Add Register Pair to H and L
union clause instruction = DAD : (bits(2))
mapping clause encdec = DAD(rp)
  <-> 0b00 @ rp @ 0b1001
mapping clause assembly = DAD(rp)
  <-> "DAD" ^ spc() ^ rp_name(rp)

// DAA: Decimal Adjust Accumulator
union clause instruction = DAA : unit
mapping clause encdec = DAA()
  <-> 0b00100111
mapping clause assembly = DAA()
  <-> "DAA"

// RLC: Rotate Left
union clause instruction = RLC : unit
mapping clause encdec = RLC()
  <-> 0b00000111
mapping clause assembly = RLC()
  <-> "RLC"

// RRC: Rotate Right
union clause instruction = RRC : unit
mapping clause encdec = RRC()
  <-> 0b00001111
mapping clause assembly = RRC()
  <-> "RRC"

// RAL: Rotate Left through Carry
union clause instruction = RAL : unit
mapping clause encdec = RAL()
  <-> 0b00010111
mapping clause assembly = RAL()
  <-> "RAL"

// RAR: Rotate Right through Carry
union clause instruction = RAR : unit
mapping clause encdec = RAR()
  <-> 0b00011111
mapping clause assembly = RAR()
  <-> "RAR"

// CMA: Complement Accumulator
union clause instruction = CMA : unit
mapping clause encdec = CMA()
  <-> 0b00101111
mapping clause assembly = CMA()
  <-> "CMA"

// CMC: Complement Carry
union clause instruction = CMC : unit
mapping clause encdec = CMC()
  <-> 0b00111111
mapping clause assembly = CMC()
  <-> "CMC"

// STC: Set Carry
union clause instruction = STC : unit
mapping clause encdec = STC()
  <-> 0b00110111
mapping clause assembly = STC()
  <-> "STC"

// JMP addr: Jump
union clause instruction = JMP : (bits(16))
mapping clause encdec = JMP(addr)
  <-> 0b11000011 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JMP(addr)
  <-> "JMP" ^ spc() ^ hex_bits_16(addr)

// JNZ addr: Jump if Not Zero
union clause instruction = JNZ : (bits(16))
mapping clause encdec = JNZ(addr)
  <-> 0b11000010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JNZ(addr)
  <-> "JNZ" ^ spc() ^ hex_bits_16(addr)

// CNZ addr: Call if Not Zero
union clause instruction = CNZ : (bits(16))
mapping clause encdec = CNZ(addr)
  <-> 0b11000100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CNZ(addr)
  <-> "CNZ" ^ spc() ^ hex_bits_16(addr)

// RNZ: Return if Not Zero
union clause instruction = RNZ : unit
mapping clause encdec = RNZ()
  <-> 0b11000000
mapping clause assembly = RNZ()
  <-> "RNZ"

// JZ addr: Jump if Zero
union clause instruction = JZ : (bits(16))
mapping clause encdec = JZ(addr)
  <-> 0b11001010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JZ(addr)
  <-> "JZ" ^ spc() ^ hex_bits_16(addr)

// CZ addr: Call if Zero
union clause instruction = CZ : (bits(16))
mapping clause encdec = CZ(addr)
  <-> 0b11001100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CZ(addr)
  <-> "CZ" ^ spc() ^ hex_bits_16(addr)

// RZ: Return if Zero
union clause instruction = RZ : unit
mapping clause encdec = RZ()
  <-> 0b11001000
mapping clause assembly = RZ()
  <-> "RZ"

// JNC addr: Jump if No Carry
union clause instruction = JNC : (bits(16))
mapping clause encdec = JNC(addr)
  <-> 0b11010010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JNC(addr)
  <-> "JNC" ^ spc() ^ hex_bits_16(addr)

// CNC addr: Call if No Carry
union clause instruction = CNC : (bits(16))
mapping clause encdec = CNC(addr)
  <-> 0b11010100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CNC(addr)
  <-> "CNC" ^ spc() ^ hex_bits_16(addr)

// RNC: Return if No Carry
union clause instruction = RNC : unit
mapping clause encdec = RNC()
  <-> 0b11010000
mapping clause assembly = RNC()
  <-> "RNC"

// JC addr: Jump if Carry
union clause instruction = JC : (bits(16))
mapping clause encdec = JC(addr)
  <-> 0b11011010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JC(addr)
  <-> "JC" ^ spc() ^ hex_bits_16(addr)

// CC addr: Call if Carry
union clause instruction = CC : (bits(16))
mapping clause encdec = CC(addr)
  <-> 0b11011100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CC(addr)
  <-> "CC" ^ spc() ^ hex_bits_16(addr)

// RC: Return if Carry
union clause instruction = RC : unit
mapping clause encdec = RC()
  <-> 0b11011000
mapping clause assembly = RC()
  <-> "RC"

// JPO addr: Jump if Parity Odd
union clause instruction = JPO : (bits(16))
mapping clause encdec = JPO(addr)
  <-> 0b11100010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JPO(addr)
  <-> "JPO" ^ spc() ^ hex_bits_16(addr)

// CPO addr: Call if Parity Odd
union clause instruction = CPO : (bits(16))
mapping clause encdec = CPO(addr)
  <-> 0b11100100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CPO(addr)
  <-> "CPO" ^ spc() ^ hex_bits_16(addr)

// RPO: Return if Parity Odd
union clause instruction = RPO : unit
mapping clause encdec = RPO()
  <-> 0b11100000
mapping clause assembly = RPO()
  <-> "RPO"

// JPE addr: Jump if Parity Even
union clause instruction = JPE : (bits(16))
mapping clause encdec = JPE(addr)
  <-> 0b11101010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JPE(addr)
  <-> "JPE" ^ spc() ^ hex_bits_16(addr)

// CPE addr: Call if Parity Even
union clause instruction = CPE : (bits(16))
mapping clause encdec = CPE(addr)
  <-> 0b11101100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CPE(addr)
  <-> "CPE" ^ spc() ^ hex_bits_16(addr)

// RPE: Return if Parity Even
union clause instruction = RPE : unit
mapping clause encdec = RPE()
  <-> 0b11101000
mapping clause assembly = RPE()
  <-> "RPE"

// JP addr: Jump if Plus
union clause instruction = JP : (bits(16))
mapping clause encdec = JP(addr)
  <-> 0b11110010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JP(addr)
  <-> "JP" ^ spc() ^ hex_bits_16(addr)

// CP addr: Call if Plus
union clause instruction = CP : (bits(16))
mapping clause encdec = CP(addr)
  <-> 0b11110100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CP(addr)
  <-> "CP" ^ spc() ^ hex_bits_16(addr)

// RP: Return if Plus
union clause instruction = RP : unit
mapping clause encdec = RP()
  <-> 0b11110000
mapping clause assembly = RP()
  <-> "RP"

// JM addr: Jump if Minus
union clause instruction = JM : (bits(16))
mapping clause encdec = JM(addr)
  <-> 0b11111010 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JM(addr)
  <-> "JM" ^ spc() ^ hex_bits_16(addr)

// CM addr: Call if Minus
union clause instruction = CM : (bits(16))
mapping clause encdec = CM(addr)
  <-> 0b11111100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CM(addr)
  <-> "CM" ^ spc() ^ hex_bits_16(addr)

// RM: Return if Minus
union clause instruction = RM : unit
mapping clause encdec = RM()
  <-> 0b11111000
mapping clause assembly = RM()
  <-> "RM"

// CALL addr: Call
union clause instruction = CALL : (bits(16))
mapping clause encdec = CALL(addr)
  <-> 0b11001101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CALL(addr)
  <-> "CALL" ^ spc() ^ hex_bits_16(addr)

// RET: Return
union clause instruction = RET : unit
mapping clause encdec = RET()
  <-> 0b11001001
mapping clause assembly = RET()
  <-> "RET"

// RST n: Restart
union clause instruction = RST : (bits(3))
mapping clause encdec = RST(n)
  <-> 0b11 @ n @ 0b111
mapping clause assembly = RST(n)
  <-> "RST" ^ spc() ^ n_name(n)

// PCHL: Jump H and L Indirect
union clause instruction = PCHL : unit
mapping clause encdec = PCHL()
  <-> 0b11101001
mapping clause assembly = PCHL()
  <-> "PCHL"

// PUSH rs: Push
union clause instruction = PUSH : (bits(2))
mapping clause encdec = PUSH(rs)
  <-> 0b11 @ rs @ 0b0101
mapping clause assembly = PUSH(rs)
  <-> "PUSH" ^ spc() ^ rs_name(rs)

// POP rs: Pop
union clause instruction = POP : (bits(2))
mapping clause encdec = POP(rs)
  <-> 0b11 @ rs @ 0b0001
mapping clause assembly = POP(rs)
  <-> "POP" ^ spc() ^ rs_name(rs)

// XTHL: Exchange Stack Top with H and L
union clause instruction = XTHL : unit
mapping clause encdec = XTHL()
  <-> 0b11100011
mapping clause assembly = XTHL()
  <-> "XTHL"

// SPHL: Move H and L to SP
union clause instruction = SPHL : unit
mapping clause encdec = SPHL()
  <-> 0b11111001
mapping clause assembly = SPHL()
  <-> "SPHL"

// IN port: Input
union clause instruction = IN : (bits(8))
mapping clause encdec = IN(port)
  <-> 0b11011011 @ port
mapping clause assembly = IN(port)
  <-> "IN" ^ spc() ^ hex_bits_8(port)

// OUT port: Output
union clause instruction = OUT : (bits(8))
mapping clause encdec = OUT(port)
  <-> 0b11010011 @ port
mapping clause assembly = OUT(port)
  <-> "OUT" ^ spc() ^ hex_bits_8(port)

// EI: Enable Interrupts
union clause instruction = EI : unit
mapping clause encdec = EI()
  <-> 0b11111011
mapping clause assembly = EI()
  <-> "EI"

// DI: Disable Interrupts
union clause instruction = DI : unit
mapping clause encdec = DI()
  <-> 0b11110011
mapping clause assembly = DI()
  <-> "DI"

// HLT: Halt
union clause instruction = HLT : unit
mapping clause encdec = HLT()
  <-> 0b01110110
mapping clause assembly = HLT()
  <-> "HLT"

// NOP: No Operation
union clause instruction = NOP : unit
mapping clause encdec = NOP()
  <-> 0b00000000
mapping clause assembly = NOP()
  <-> "NOP"

end instruction
