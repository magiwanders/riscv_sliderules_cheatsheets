// Intel MCS-51 (8051): encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// instruction definitions of Intel's MCS-51 Microcontroller Family User's Manual. Neither Intel, the Sail project nor
// LLVM publish an 8051 description; this one is checked by assembling every instruction with the Macro Assembler AS and
// ASxxxx's as8051 (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses, encdec and assembly mappings, no execute clauses, and not
// checked by the Sail compiler. An instruction is its bytes in memory order, the first byte leftmost, as the sheets
// show it; 16 bitaddr values are written high byte first, as the 8051 stores them. Operand fields keep the manual's names
// (rrr of Rn is r, i of @Ri is i; MOV direct,direct has the source byte first, direct2 here).

// Names of the operand fields, for the assembly mappings
mapping r_name : bits(3) <-> string = {
  0b000 <-> "R0",
  0b001 <-> "R1",
  0b010 <-> "R2",
  0b011 <-> "R3",
  0b100 <-> "R4",
  0b101 <-> "R5",
  0b110 <-> "R6",
  0b111 <-> "R7",
}

mapping i_name : bits(1) <-> string = {
  0b0 <-> "R0",
  0b1 <-> "R1",
}

scattered union instruction

// ADD A,r: Add Register to A
union clause instruction = ADD_A_Rn : (bits(3))
mapping clause encdec = ADD_A_Rn(r)
  <-> 0b00101 @ r
mapping clause assembly = ADD_A_Rn(r)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ADD A,direct: Add Direct Byte to A
union clause instruction = ADD_A_dir : (bits(8))
mapping clause encdec = ADD_A_dir(direct)
  <-> 0b00100101 @ direct
mapping clause assembly = ADD_A_dir(direct)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// ADD A,@i: Add Indirect RAM to A
union clause instruction = ADD_A_iRi : (bits(1))
mapping clause encdec = ADD_A_iRi(i)
  <-> 0b0010011 @ i
mapping clause assembly = ADD_A_iRi(i)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// ADD A,#data: Add Immediate to A
union clause instruction = ADD_A_imm : (bits(8))
mapping clause encdec = ADD_A_imm(data)
  <-> 0b00100100 @ data
mapping clause assembly = ADD_A_imm(data)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// ADDC A,r: Add with Carry Register to A
union clause instruction = ADDC_A_Rn : (bits(3))
mapping clause encdec = ADDC_A_Rn(r)
  <-> 0b00111 @ r
mapping clause assembly = ADDC_A_Rn(r)
  <-> "ADDC" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ADDC A,direct: Add with Carry Direct Byte to A
union clause instruction = ADDC_A_dir : (bits(8))
mapping clause encdec = ADDC_A_dir(direct)
  <-> 0b00110101 @ direct
mapping clause assembly = ADDC_A_dir(direct)
  <-> "ADDC" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// ADDC A,@i: Add with Carry Indirect RAM to A
union clause instruction = ADDC_A_iRi : (bits(1))
mapping clause encdec = ADDC_A_iRi(i)
  <-> 0b0011011 @ i
mapping clause assembly = ADDC_A_iRi(i)
  <-> "ADDC" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// ADDC A,#data: Add with Carry Immediate to A
union clause instruction = ADDC_A_imm : (bits(8))
mapping clause encdec = ADDC_A_imm(data)
  <-> 0b00110100 @ data
mapping clause assembly = ADDC_A_imm(data)
  <-> "ADDC" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// SUBB A,r: Subtract with Borrow Register to A
union clause instruction = SUBB_A_Rn : (bits(3))
mapping clause encdec = SUBB_A_Rn(r)
  <-> 0b10011 @ r
mapping clause assembly = SUBB_A_Rn(r)
  <-> "SUBB" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// SUBB A,direct: Subtract with Borrow Direct Byte to A
union clause instruction = SUBB_A_dir : (bits(8))
mapping clause encdec = SUBB_A_dir(direct)
  <-> 0b10010101 @ direct
mapping clause assembly = SUBB_A_dir(direct)
  <-> "SUBB" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// SUBB A,@i: Subtract with Borrow Indirect RAM to A
union clause instruction = SUBB_A_iRi : (bits(1))
mapping clause encdec = SUBB_A_iRi(i)
  <-> 0b1001011 @ i
mapping clause assembly = SUBB_A_iRi(i)
  <-> "SUBB" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// SUBB A,#data: Subtract with Borrow Immediate to A
union clause instruction = SUBB_A_imm : (bits(8))
mapping clause encdec = SUBB_A_imm(data)
  <-> 0b10010100 @ data
mapping clause assembly = SUBB_A_imm(data)
  <-> "SUBB" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// INC A: Increment A
union clause instruction = INC_A : unit
mapping clause encdec = INC_A()
  <-> 0b00000100
mapping clause assembly = INC_A()
  <-> "INC" ^ spc() ^ "A"

// INC r: Increment Register
union clause instruction = INC_Rn : (bits(3))
mapping clause encdec = INC_Rn(r)
  <-> 0b00001 @ r
mapping clause assembly = INC_Rn(r)
  <-> "INC" ^ spc() ^ r_name(r)

// INC direct: Increment Direct Byte
union clause instruction = INC_dir : (bits(8))
mapping clause encdec = INC_dir(direct)
  <-> 0b00000101 @ direct
mapping clause assembly = INC_dir(direct)
  <-> "INC" ^ spc() ^ hex_bits_8(direct)

// INC @i: Increment Indirect RAM
union clause instruction = INC_iRi : (bits(1))
mapping clause encdec = INC_iRi(i)
  <-> 0b0000011 @ i
mapping clause assembly = INC_iRi(i)
  <-> "INC" ^ spc() ^ "@" ^ i_name(i)

// DEC A: Decrement A
union clause instruction = DEC_A : unit
mapping clause encdec = DEC_A()
  <-> 0b00010100
mapping clause assembly = DEC_A()
  <-> "DEC" ^ spc() ^ "A"

// DEC r: Decrement Register
union clause instruction = DEC_Rn : (bits(3))
mapping clause encdec = DEC_Rn(r)
  <-> 0b00011 @ r
mapping clause assembly = DEC_Rn(r)
  <-> "DEC" ^ spc() ^ r_name(r)

// DEC direct: Decrement Direct Byte
union clause instruction = DEC_dir : (bits(8))
mapping clause encdec = DEC_dir(direct)
  <-> 0b00010101 @ direct
mapping clause assembly = DEC_dir(direct)
  <-> "DEC" ^ spc() ^ hex_bits_8(direct)

// DEC @i: Decrement Indirect RAM
union clause instruction = DEC_iRi : (bits(1))
mapping clause encdec = DEC_iRi(i)
  <-> 0b0001011 @ i
mapping clause assembly = DEC_iRi(i)
  <-> "DEC" ^ spc() ^ "@" ^ i_name(i)

// INC DPTR: Increment Data Pointer
union clause instruction = INC_DPTR : unit
mapping clause encdec = INC_DPTR()
  <-> 0b10100011
mapping clause assembly = INC_DPTR()
  <-> "INC" ^ spc() ^ "DPTR"

// MUL AB: Multiply A and B
union clause instruction = MUL_AB : unit
mapping clause encdec = MUL_AB()
  <-> 0b10100100
mapping clause assembly = MUL_AB()
  <-> "MUL" ^ spc() ^ "AB"

// DIV AB: Divide A by B
union clause instruction = DIV_AB : unit
mapping clause encdec = DIV_AB()
  <-> 0b10000100
mapping clause assembly = DIV_AB()
  <-> "DIV" ^ spc() ^ "AB"

// DA A: Decimal Adjust A
union clause instruction = DA_A : unit
mapping clause encdec = DA_A()
  <-> 0b11010100
mapping clause assembly = DA_A()
  <-> "DA" ^ spc() ^ "A"

// ANL A,r: AND Register to A
union clause instruction = ANL_A_Rn : (bits(3))
mapping clause encdec = ANL_A_Rn(r)
  <-> 0b01011 @ r
mapping clause assembly = ANL_A_Rn(r)
  <-> "ANL" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ANL A,direct: AND Direct Byte to A
union clause instruction = ANL_A_dir : (bits(8))
mapping clause encdec = ANL_A_dir(direct)
  <-> 0b01010101 @ direct
mapping clause assembly = ANL_A_dir(direct)
  <-> "ANL" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// ANL A,@i: AND Indirect RAM to A
union clause instruction = ANL_A_iRi : (bits(1))
mapping clause encdec = ANL_A_iRi(i)
  <-> 0b0101011 @ i
mapping clause assembly = ANL_A_iRi(i)
  <-> "ANL" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// ANL A,#data: AND Immediate to A
union clause instruction = ANL_A_imm : (bits(8))
mapping clause encdec = ANL_A_imm(data)
  <-> 0b01010100 @ data
mapping clause assembly = ANL_A_imm(data)
  <-> "ANL" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// ANL direct,A: AND A to Direct Byte
union clause instruction = ANL_dir_A : (bits(8))
mapping clause encdec = ANL_dir_A(direct)
  <-> 0b01010010 @ direct
mapping clause assembly = ANL_dir_A(direct)
  <-> "ANL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "A"

// ANL direct,#data: AND Immediate to Direct Byte
union clause instruction = ANL_dir_imm : (bits(8), bits(8))
mapping clause encdec = ANL_dir_imm(direct, data)
  <-> 0b01010011 @ direct @ data
mapping clause assembly = ANL_dir_imm(direct, data)
  <-> "ANL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "#" ^ hex_bits_8(data)

// ORL A,r: OR Register to A
union clause instruction = ORL_A_Rn : (bits(3))
mapping clause encdec = ORL_A_Rn(r)
  <-> 0b01001 @ r
mapping clause assembly = ORL_A_Rn(r)
  <-> "ORL" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ORL A,direct: OR Direct Byte to A
union clause instruction = ORL_A_dir : (bits(8))
mapping clause encdec = ORL_A_dir(direct)
  <-> 0b01000101 @ direct
mapping clause assembly = ORL_A_dir(direct)
  <-> "ORL" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// ORL A,@i: OR Indirect RAM to A
union clause instruction = ORL_A_iRi : (bits(1))
mapping clause encdec = ORL_A_iRi(i)
  <-> 0b0100011 @ i
mapping clause assembly = ORL_A_iRi(i)
  <-> "ORL" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// ORL A,#data: OR Immediate to A
union clause instruction = ORL_A_imm : (bits(8))
mapping clause encdec = ORL_A_imm(data)
  <-> 0b01000100 @ data
mapping clause assembly = ORL_A_imm(data)
  <-> "ORL" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// ORL direct,A: OR A to Direct Byte
union clause instruction = ORL_dir_A : (bits(8))
mapping clause encdec = ORL_dir_A(direct)
  <-> 0b01000010 @ direct
mapping clause assembly = ORL_dir_A(direct)
  <-> "ORL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "A"

// ORL direct,#data: OR Immediate to Direct Byte
union clause instruction = ORL_dir_imm : (bits(8), bits(8))
mapping clause encdec = ORL_dir_imm(direct, data)
  <-> 0b01000011 @ direct @ data
mapping clause assembly = ORL_dir_imm(direct, data)
  <-> "ORL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "#" ^ hex_bits_8(data)

// XRL A,r: Exclusive OR Register to A
union clause instruction = XRL_A_Rn : (bits(3))
mapping clause encdec = XRL_A_Rn(r)
  <-> 0b01101 @ r
mapping clause assembly = XRL_A_Rn(r)
  <-> "XRL" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// XRL A,direct: Exclusive OR Direct Byte to A
union clause instruction = XRL_A_dir : (bits(8))
mapping clause encdec = XRL_A_dir(direct)
  <-> 0b01100101 @ direct
mapping clause assembly = XRL_A_dir(direct)
  <-> "XRL" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// XRL A,@i: Exclusive OR Indirect RAM to A
union clause instruction = XRL_A_iRi : (bits(1))
mapping clause encdec = XRL_A_iRi(i)
  <-> 0b0110011 @ i
mapping clause assembly = XRL_A_iRi(i)
  <-> "XRL" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// XRL A,#data: Exclusive OR Immediate to A
union clause instruction = XRL_A_imm : (bits(8))
mapping clause encdec = XRL_A_imm(data)
  <-> 0b01100100 @ data
mapping clause assembly = XRL_A_imm(data)
  <-> "XRL" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// XRL direct,A: Exclusive OR A to Direct Byte
union clause instruction = XRL_dir_A : (bits(8))
mapping clause encdec = XRL_dir_A(direct)
  <-> 0b01100010 @ direct
mapping clause assembly = XRL_dir_A(direct)
  <-> "XRL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "A"

// XRL direct,#data: Exclusive OR Immediate to Direct Byte
union clause instruction = XRL_dir_imm : (bits(8), bits(8))
mapping clause encdec = XRL_dir_imm(direct, data)
  <-> 0b01100011 @ direct @ data
mapping clause assembly = XRL_dir_imm(direct, data)
  <-> "XRL" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "#" ^ hex_bits_8(data)

// CLR A: Clear A
union clause instruction = CLR_A : unit
mapping clause encdec = CLR_A()
  <-> 0b11100100
mapping clause assembly = CLR_A()
  <-> "CLR" ^ spc() ^ "A"

// CPL A: Complement A
union clause instruction = CPL_A : unit
mapping clause encdec = CPL_A()
  <-> 0b11110100
mapping clause assembly = CPL_A()
  <-> "CPL" ^ spc() ^ "A"

// RL A: Rotate A Left
union clause instruction = RL_A : unit
mapping clause encdec = RL_A()
  <-> 0b00100011
mapping clause assembly = RL_A()
  <-> "RL" ^ spc() ^ "A"

// RLC A: Rotate A Left through Carry
union clause instruction = RLC_A : unit
mapping clause encdec = RLC_A()
  <-> 0b00110011
mapping clause assembly = RLC_A()
  <-> "RLC" ^ spc() ^ "A"

// RR A: Rotate A Right
union clause instruction = RR_A : unit
mapping clause encdec = RR_A()
  <-> 0b00000011
mapping clause assembly = RR_A()
  <-> "RR" ^ spc() ^ "A"

// RRC A: Rotate A Right through Carry
union clause instruction = RRC_A : unit
mapping clause encdec = RRC_A()
  <-> 0b00010011
mapping clause assembly = RRC_A()
  <-> "RRC" ^ spc() ^ "A"

// SWAP A: Swap Nibbles of A
union clause instruction = SWAP_A : unit
mapping clause encdec = SWAP_A()
  <-> 0b11000100
mapping clause assembly = SWAP_A()
  <-> "SWAP" ^ spc() ^ "A"

// MOV A,r: Move Register to A
union clause instruction = MOV_A_Rn : (bits(3))
mapping clause encdec = MOV_A_Rn(r)
  <-> 0b11101 @ r
mapping clause assembly = MOV_A_Rn(r)
  <-> "MOV" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// MOV A,direct: Move Direct Byte to A
union clause instruction = MOV_A_dir : (bits(8))
mapping clause encdec = MOV_A_dir(direct)
  <-> 0b11100101 @ direct
mapping clause assembly = MOV_A_dir(direct)
  <-> "MOV" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// MOV A,@i: Move Indirect RAM to A
union clause instruction = MOV_A_iRi : (bits(1))
mapping clause encdec = MOV_A_iRi(i)
  <-> 0b1110011 @ i
mapping clause assembly = MOV_A_iRi(i)
  <-> "MOV" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// MOV A,#data: Move Immediate to A
union clause instruction = MOV_A_imm : (bits(8))
mapping clause encdec = MOV_A_imm(data)
  <-> 0b01110100 @ data
mapping clause assembly = MOV_A_imm(data)
  <-> "MOV" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data)

// MOV r,A: Move A to Register
union clause instruction = MOV_Rn_A : (bits(3))
mapping clause encdec = MOV_Rn_A(r)
  <-> 0b11111 @ r
mapping clause assembly = MOV_Rn_A(r)
  <-> "MOV" ^ spc() ^ r_name(r) ^ sep() ^ "A"

// MOV r,direct: Move Direct Byte to Register
union clause instruction = MOV_Rn_dir : (bits(3), bits(8))
mapping clause encdec = MOV_Rn_dir(r, direct)
  <-> 0b10101 @ r @ direct
mapping clause assembly = MOV_Rn_dir(r, direct)
  <-> "MOV" ^ spc() ^ r_name(r) ^ sep() ^ hex_bits_8(direct)

// MOV r,#data: Move Immediate to Register
union clause instruction = MOV_Rn_imm : (bits(3), bits(8))
mapping clause encdec = MOV_Rn_imm(r, data)
  <-> 0b01111 @ r @ data
mapping clause assembly = MOV_Rn_imm(r, data)
  <-> "MOV" ^ spc() ^ r_name(r) ^ sep() ^ "#" ^ hex_bits_8(data)

// MOV direct,A: Move A to Direct Byte
union clause instruction = MOV_dir_A : (bits(8))
mapping clause encdec = MOV_dir_A(direct)
  <-> 0b11110101 @ direct
mapping clause assembly = MOV_dir_A(direct)
  <-> "MOV" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "A"

// MOV direct,r: Move Register to Direct Byte
union clause instruction = MOV_dir_Rn : (bits(3), bits(8))
mapping clause encdec = MOV_dir_Rn(r, direct)
  <-> 0b10001 @ r @ direct
mapping clause assembly = MOV_dir_Rn(r, direct)
  <-> "MOV" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ r_name(r)

// MOV direct,direct2: Move Direct Byte to Direct Byte
union clause instruction = MOV_dir_dir : (bits(8), bits(8))
mapping clause encdec = MOV_dir_dir(direct2, direct)
  <-> 0b10000101 @ direct2 @ direct
mapping clause assembly = MOV_dir_dir(direct2, direct)
  <-> "MOV" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ hex_bits_8(direct2)

// MOV direct,@i: Move Indirect RAM to Direct Byte
union clause instruction = MOV_dir_iRi : (bits(1), bits(8))
mapping clause encdec = MOV_dir_iRi(i, direct)
  <-> 0b1000011 @ i @ direct
mapping clause assembly = MOV_dir_iRi(i, direct)
  <-> "MOV" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "@" ^ i_name(i)

// MOV direct,#data: Move Immediate to Direct Byte
union clause instruction = MOV_dir_imm : (bits(8), bits(8))
mapping clause encdec = MOV_dir_imm(direct, data)
  <-> 0b01110101 @ direct @ data
mapping clause assembly = MOV_dir_imm(direct, data)
  <-> "MOV" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ "#" ^ hex_bits_8(data)

// MOV @i,A: Move A to Indirect RAM
union clause instruction = MOV_iRi_A : (bits(1))
mapping clause encdec = MOV_iRi_A(i)
  <-> 0b1111011 @ i
mapping clause assembly = MOV_iRi_A(i)
  <-> "MOV" ^ spc() ^ "@" ^ i_name(i) ^ sep() ^ "A"

// MOV @i,direct: Move Direct Byte to Indirect RAM
union clause instruction = MOV_iRi_dir : (bits(1), bits(8))
mapping clause encdec = MOV_iRi_dir(i, direct)
  <-> 0b1010011 @ i @ direct
mapping clause assembly = MOV_iRi_dir(i, direct)
  <-> "MOV" ^ spc() ^ "@" ^ i_name(i) ^ sep() ^ hex_bits_8(direct)

// MOV @i,#data: Move Immediate to Indirect RAM
union clause instruction = MOV_iRi_imm : (bits(1), bits(8))
mapping clause encdec = MOV_iRi_imm(i, data)
  <-> 0b0111011 @ i @ data
mapping clause assembly = MOV_iRi_imm(i, data)
  <-> "MOV" ^ spc() ^ "@" ^ i_name(i) ^ sep() ^ "#" ^ hex_bits_8(data)

// MOV DPTR,#data16: Load Data Pointer
union clause instruction = MOV_DPTR_imm : (bits(16))
mapping clause encdec = MOV_DPTR_imm(data16)
  <-> 0b10010000 @ data16[15..8] @ data16[7..0]
mapping clause assembly = MOV_DPTR_imm(data16)
  <-> "MOV" ^ spc() ^ "DPTR" ^ sep() ^ "#" ^ hex_bits_16(data16)

// MOVC A,@A+DPTR: Move Code Byte relative to DPTR
union clause instruction = MOVC_A_iA_DPTR : unit
mapping clause encdec = MOVC_A_iA_DPTR()
  <-> 0b10010011
mapping clause assembly = MOVC_A_iA_DPTR()
  <-> "MOVC" ^ spc() ^ "A" ^ sep() ^ "@A+DPTR"

// MOVC A,@A+PC: Move Code Byte relative to PC
union clause instruction = MOVC_A_iA_PC : unit
mapping clause encdec = MOVC_A_iA_PC()
  <-> 0b10000011
mapping clause assembly = MOVC_A_iA_PC()
  <-> "MOVC" ^ spc() ^ "A" ^ sep() ^ "@A+PC"

// MOVX A,@i: Move External RAM (8 bitaddr address) to A
union clause instruction = MOVX_A_iRi : (bits(1))
mapping clause encdec = MOVX_A_iRi(i)
  <-> 0b1110001 @ i
mapping clause assembly = MOVX_A_iRi(i)
  <-> "MOVX" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// MOVX A,@DPTR: Move External RAM (16 bitaddr address) to A
union clause instruction = MOVX_A_iDPTR : unit
mapping clause encdec = MOVX_A_iDPTR()
  <-> 0b11100000
mapping clause assembly = MOVX_A_iDPTR()
  <-> "MOVX" ^ spc() ^ "A" ^ sep() ^ "@DPTR"

// MOVX @i,A: Move A to External RAM (8 bitaddr address)
union clause instruction = MOVX_iRi_A : (bits(1))
mapping clause encdec = MOVX_iRi_A(i)
  <-> 0b1111001 @ i
mapping clause assembly = MOVX_iRi_A(i)
  <-> "MOVX" ^ spc() ^ "@" ^ i_name(i) ^ sep() ^ "A"

// MOVX @DPTR,A: Move A to External RAM (16 bitaddr address)
union clause instruction = MOVX_iDPTR_A : unit
mapping clause encdec = MOVX_iDPTR_A()
  <-> 0b11110000
mapping clause assembly = MOVX_iDPTR_A()
  <-> "MOVX" ^ spc() ^ "@DPTR" ^ sep() ^ "A"

// PUSH direct: Push Direct Byte
union clause instruction = PUSH : (bits(8))
mapping clause encdec = PUSH(direct)
  <-> 0b11000000 @ direct
mapping clause assembly = PUSH(direct)
  <-> "PUSH" ^ spc() ^ hex_bits_8(direct)

// POP direct: Pop Direct Byte
union clause instruction = POP : (bits(8))
mapping clause encdec = POP(direct)
  <-> 0b11010000 @ direct
mapping clause assembly = POP(direct)
  <-> "POP" ^ spc() ^ hex_bits_8(direct)

// XCH A,r: Exchange Register with A
union clause instruction = XCH_A_Rn : (bits(3))
mapping clause encdec = XCH_A_Rn(r)
  <-> 0b11001 @ r
mapping clause assembly = XCH_A_Rn(r)
  <-> "XCH" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// XCH A,direct: Exchange Direct Byte with A
union clause instruction = XCH_A_dir : (bits(8))
mapping clause encdec = XCH_A_dir(direct)
  <-> 0b11000101 @ direct
mapping clause assembly = XCH_A_dir(direct)
  <-> "XCH" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct)

// XCH A,@i: Exchange Indirect RAM with A
union clause instruction = XCH_A_iRi : (bits(1))
mapping clause encdec = XCH_A_iRi(i)
  <-> 0b1100011 @ i
mapping clause assembly = XCH_A_iRi(i)
  <-> "XCH" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// XCHD A,@i: Exchange Low Digit of Indirect RAM with A
union clause instruction = XCHD_A_iRi : (bits(1))
mapping clause encdec = XCHD_A_iRi(i)
  <-> 0b1101011 @ i
mapping clause assembly = XCHD_A_iRi(i)
  <-> "XCHD" ^ spc() ^ "A" ^ sep() ^ "@" ^ i_name(i)

// CLR C: Clear Carry
union clause instruction = CLR_C : unit
mapping clause encdec = CLR_C()
  <-> 0b11000011
mapping clause assembly = CLR_C()
  <-> "CLR" ^ spc() ^ "C"

// CLR bitaddr: Clear Bit
union clause instruction = CLR_bit : (bits(8))
mapping clause encdec = CLR_bit(bitaddr)
  <-> 0b11000010 @ bitaddr
mapping clause assembly = CLR_bit(bitaddr)
  <-> "CLR" ^ spc() ^ hex_bits_8(bitaddr)

// SETB C: Set Carry
union clause instruction = SETB_C : unit
mapping clause encdec = SETB_C()
  <-> 0b11010011
mapping clause assembly = SETB_C()
  <-> "SETB" ^ spc() ^ "C"

// SETB bitaddr: Set Bit
union clause instruction = SETB_bit : (bits(8))
mapping clause encdec = SETB_bit(bitaddr)
  <-> 0b11010010 @ bitaddr
mapping clause assembly = SETB_bit(bitaddr)
  <-> "SETB" ^ spc() ^ hex_bits_8(bitaddr)

// CPL C: Complement Carry
union clause instruction = CPL_C : unit
mapping clause encdec = CPL_C()
  <-> 0b10110011
mapping clause assembly = CPL_C()
  <-> "CPL" ^ spc() ^ "C"

// CPL bitaddr: Complement Bit
union clause instruction = CPL_bit : (bits(8))
mapping clause encdec = CPL_bit(bitaddr)
  <-> 0b10110010 @ bitaddr
mapping clause assembly = CPL_bit(bitaddr)
  <-> "CPL" ^ spc() ^ hex_bits_8(bitaddr)

// ANL C,bitaddr: AND Bit to Carry
union clause instruction = ANL_C_bit : (bits(8))
mapping clause encdec = ANL_C_bit(bitaddr)
  <-> 0b10000010 @ bitaddr
mapping clause assembly = ANL_C_bit(bitaddr)
  <-> "ANL" ^ spc() ^ "C" ^ sep() ^ hex_bits_8(bitaddr)

// ANL C,/bitaddr: AND Complement of Bit to Carry
union clause instruction = ANL_C_nbit : (bits(8))
mapping clause encdec = ANL_C_nbit(bitaddr)
  <-> 0b10110000 @ bitaddr
mapping clause assembly = ANL_C_nbit(bitaddr)
  <-> "ANL" ^ spc() ^ "C" ^ sep() ^ "/" ^ hex_bits_8(bitaddr)

// ORL C,bitaddr: OR Bit to Carry
union clause instruction = ORL_C_bit : (bits(8))
mapping clause encdec = ORL_C_bit(bitaddr)
  <-> 0b01110010 @ bitaddr
mapping clause assembly = ORL_C_bit(bitaddr)
  <-> "ORL" ^ spc() ^ "C" ^ sep() ^ hex_bits_8(bitaddr)

// ORL C,/bitaddr: OR Complement of Bit to Carry
union clause instruction = ORL_C_nbit : (bits(8))
mapping clause encdec = ORL_C_nbit(bitaddr)
  <-> 0b10100000 @ bitaddr
mapping clause assembly = ORL_C_nbit(bitaddr)
  <-> "ORL" ^ spc() ^ "C" ^ sep() ^ "/" ^ hex_bits_8(bitaddr)

// MOV C,bitaddr: Move Bit to Carry
union clause instruction = MOV_C_bit : (bits(8))
mapping clause encdec = MOV_C_bit(bitaddr)
  <-> 0b10100010 @ bitaddr
mapping clause assembly = MOV_C_bit(bitaddr)
  <-> "MOV" ^ spc() ^ "C" ^ sep() ^ hex_bits_8(bitaddr)

// MOV bitaddr,C: Move Carry to Bit
union clause instruction = MOV_bit_C : (bits(8))
mapping clause encdec = MOV_bit_C(bitaddr)
  <-> 0b10010010 @ bitaddr
mapping clause assembly = MOV_bit_C(bitaddr)
  <-> "MOV" ^ spc() ^ hex_bits_8(bitaddr) ^ sep() ^ "C"

// JC rel: Jump if Carry
union clause instruction = JC : (bits(8))
mapping clause encdec = JC(rel)
  <-> 0b01000000 @ rel
mapping clause assembly = JC(rel)
  <-> "JC" ^ spc() ^ hex_bits_signed_8(rel)

// JNC rel: Jump if No Carry
union clause instruction = JNC : (bits(8))
mapping clause encdec = JNC(rel)
  <-> 0b01010000 @ rel
mapping clause assembly = JNC(rel)
  <-> "JNC" ^ spc() ^ hex_bits_signed_8(rel)

// JB bitaddr,rel: Jump if Bit Set
union clause instruction = JB : (bits(8), bits(8))
mapping clause encdec = JB(bitaddr, rel)
  <-> 0b00100000 @ bitaddr @ rel
mapping clause assembly = JB(bitaddr, rel)
  <-> "JB" ^ spc() ^ hex_bits_8(bitaddr) ^ sep() ^ hex_bits_signed_8(rel)

// JNB bitaddr,rel: Jump if Bit Not Set
union clause instruction = JNB : (bits(8), bits(8))
mapping clause encdec = JNB(bitaddr, rel)
  <-> 0b00110000 @ bitaddr @ rel
mapping clause assembly = JNB(bitaddr, rel)
  <-> "JNB" ^ spc() ^ hex_bits_8(bitaddr) ^ sep() ^ hex_bits_signed_8(rel)

// JBC bitaddr,rel: Jump if Bit Set and Clear Bit
union clause instruction = JBC : (bits(8), bits(8))
mapping clause encdec = JBC(bitaddr, rel)
  <-> 0b00010000 @ bitaddr @ rel
mapping clause assembly = JBC(bitaddr, rel)
  <-> "JBC" ^ spc() ^ hex_bits_8(bitaddr) ^ sep() ^ hex_bits_signed_8(rel)

// ACALL addr11: Absolute Call
union clause instruction = ACALL : (bits(11))
mapping clause encdec = ACALL(addr11)
  <-> addr11[10..8] @ 0b10001 @ addr11[7..0]
mapping clause assembly = ACALL(addr11)
  <-> "ACALL" ^ spc() ^ hex_bits_11(addr11)

// LCALL addr16: Long Call
union clause instruction = LCALL : (bits(16))
mapping clause encdec = LCALL(addr16)
  <-> 0b00010010 @ addr16[15..8] @ addr16[7..0]
mapping clause assembly = LCALL(addr16)
  <-> "LCALL" ^ spc() ^ hex_bits_16(addr16)

// RET: Return from Subroutine
union clause instruction = RET : unit
mapping clause encdec = RET()
  <-> 0b00100010
mapping clause assembly = RET()
  <-> "RET"

// RETI: Return from Interrupt
union clause instruction = RETI : unit
mapping clause encdec = RETI()
  <-> 0b00110010
mapping clause assembly = RETI()
  <-> "RETI"

// AJMP addr11: Absolute Jump
union clause instruction = AJMP : (bits(11))
mapping clause encdec = AJMP(addr11)
  <-> addr11[10..8] @ 0b00001 @ addr11[7..0]
mapping clause assembly = AJMP(addr11)
  <-> "AJMP" ^ spc() ^ hex_bits_11(addr11)

// LJMP addr16: Long Jump
union clause instruction = LJMP : (bits(16))
mapping clause encdec = LJMP(addr16)
  <-> 0b00000010 @ addr16[15..8] @ addr16[7..0]
mapping clause assembly = LJMP(addr16)
  <-> "LJMP" ^ spc() ^ hex_bits_16(addr16)

// SJMP rel: Short Jump
union clause instruction = SJMP : (bits(8))
mapping clause encdec = SJMP(rel)
  <-> 0b10000000 @ rel
mapping clause assembly = SJMP(rel)
  <-> "SJMP" ^ spc() ^ hex_bits_signed_8(rel)

// JMP @A+DPTR: Jump Indirect relative to DPTR
union clause instruction = JMP_iA_DPTR : unit
mapping clause encdec = JMP_iA_DPTR()
  <-> 0b01110011
mapping clause assembly = JMP_iA_DPTR()
  <-> "JMP" ^ spc() ^ "@A+DPTR"

// JZ rel: Jump if A is Zero
union clause instruction = JZ : (bits(8))
mapping clause encdec = JZ(rel)
  <-> 0b01100000 @ rel
mapping clause assembly = JZ(rel)
  <-> "JZ" ^ spc() ^ hex_bits_signed_8(rel)

// JNZ rel: Jump if A is Not Zero
union clause instruction = JNZ : (bits(8))
mapping clause encdec = JNZ(rel)
  <-> 0b01110000 @ rel
mapping clause assembly = JNZ(rel)
  <-> "JNZ" ^ spc() ^ hex_bits_signed_8(rel)

// CJNE A,direct,rel: Compare Direct Byte with A, Jump if Not Equal
union clause instruction = CJNE_A_dir : (bits(8), bits(8))
mapping clause encdec = CJNE_A_dir(direct, rel)
  <-> 0b10110101 @ direct @ rel
mapping clause assembly = CJNE_A_dir(direct, rel)
  <-> "CJNE" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(direct) ^ sep() ^ hex_bits_signed_8(rel)

// CJNE A,#data,rel: Compare Immediate with A, Jump if Not Equal
union clause instruction = CJNE_A_imm : (bits(8), bits(8))
mapping clause encdec = CJNE_A_imm(data, rel)
  <-> 0b10110100 @ data @ rel
mapping clause assembly = CJNE_A_imm(data, rel)
  <-> "CJNE" ^ spc() ^ "A" ^ sep() ^ "#" ^ hex_bits_8(data) ^ sep() ^ hex_bits_signed_8(rel)

// CJNE r,#data,rel: Compare Immediate with Register, Jump if Not Equal
union clause instruction = CJNE_Rn_imm : (bits(3), bits(8), bits(8))
mapping clause encdec = CJNE_Rn_imm(r, data, rel)
  <-> 0b10111 @ r @ data @ rel
mapping clause assembly = CJNE_Rn_imm(r, data, rel)
  <-> "CJNE" ^ spc() ^ r_name(r) ^ sep() ^ "#" ^ hex_bits_8(data) ^ sep() ^ hex_bits_signed_8(rel)

// CJNE @i,#data,rel: Compare Immediate with Indirect RAM, Jump if Not Equal
union clause instruction = CJNE_iRi_imm : (bits(1), bits(8), bits(8))
mapping clause encdec = CJNE_iRi_imm(i, data, rel)
  <-> 0b1011011 @ i @ data @ rel
mapping clause assembly = CJNE_iRi_imm(i, data, rel)
  <-> "CJNE" ^ spc() ^ "@" ^ i_name(i) ^ sep() ^ "#" ^ hex_bits_8(data) ^ sep() ^ hex_bits_signed_8(rel)

// DJNZ r,rel: Decrement Register, Jump if Not Zero
union clause instruction = DJNZ_Rn : (bits(3), bits(8))
mapping clause encdec = DJNZ_Rn(r, rel)
  <-> 0b11011 @ r @ rel
mapping clause assembly = DJNZ_Rn(r, rel)
  <-> "DJNZ" ^ spc() ^ r_name(r) ^ sep() ^ hex_bits_signed_8(rel)

// DJNZ direct,rel: Decrement Direct Byte, Jump if Not Zero
union clause instruction = DJNZ_dir : (bits(8), bits(8))
mapping clause encdec = DJNZ_dir(direct, rel)
  <-> 0b11010101 @ direct @ rel
mapping clause assembly = DJNZ_dir(direct, rel)
  <-> "DJNZ" ^ spc() ^ hex_bits_8(direct) ^ sep() ^ hex_bits_signed_8(rel)

// NOP: No Operation
union clause instruction = NOP : unit
mapping clause encdec = NOP()
  <-> 0b00000000
mapping clause assembly = NOP()
  <-> "NOP"

end instruction
