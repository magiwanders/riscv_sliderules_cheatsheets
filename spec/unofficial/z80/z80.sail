// Zilog Z80 (documented instructions): encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// opcode tables of Zilog's Z80 CPU User Manual (UM0080). Neither Zilog, the Sail project nor LLVM publish a Z80
// description; this one is checked by assembling every instruction with skoolkit and sjasmplus (npm test).
// Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses, encdec and assembly mappings, no execute clauses, and not
// checked by the Sail compiler. An instruction is its bytes in memory order, the first byte leftmost, as the sheets
// show it; 16 bit values are written low byte first (nn[7..0] @ nn[15..8]). Operand fields keep the manual's names.

// Names of the operand fields, for the assembly mappings
mapping r_name : bits(3) <-> string = {
  0b000 <-> "B",
  0b001 <-> "C",
  0b010 <-> "D",
  0b011 <-> "E",
  0b100 <-> "H",
  0b101 <-> "L",
  0b110 <-> "(HL)",
  0b111 <-> "A",
}

mapping r2_name : bits(3) <-> string = {
  0b000 <-> "B",
  0b001 <-> "C",
  0b010 <-> "D",
  0b011 <-> "E",
  0b100 <-> "H",
  0b101 <-> "L",
  0b110 <-> "(HL)",
  0b111 <-> "A",
}

mapping dd_name : bits(2) <-> string = {
  0b00 <-> "BC",
  0b01 <-> "DE",
  0b10 <-> "HL",
  0b11 <-> "SP",
}

mapping ss_name : bits(2) <-> string = {
  0b00 <-> "BC",
  0b01 <-> "DE",
  0b10 <-> "HL",
  0b11 <-> "SP",
}

mapping qq_name : bits(2) <-> string = {
  0b00 <-> "BC",
  0b01 <-> "DE",
  0b10 <-> "HL",
  0b11 <-> "AF",
}

mapping pp_name : bits(2) <-> string = {
  0b00 <-> "BC",
  0b01 <-> "DE",
  0b10 <-> "IX",
  0b11 <-> "SP",
}

mapping rr_name : bits(2) <-> string = {
  0b00 <-> "BC",
  0b01 <-> "DE",
  0b10 <-> "IY",
  0b11 <-> "SP",
}

mapping cc_name : bits(3) <-> string = {
  0b000 <-> "NZ",
  0b001 <-> "Z",
  0b010 <-> "NC",
  0b011 <-> "C",
  0b100 <-> "PO",
  0b101 <-> "PE",
  0b110 <-> "P",
  0b111 <-> "M",
}

mapping jc_name : bits(2) <-> string = {
  0b00 <-> "NZ",
  0b01 <-> "Z",
  0b10 <-> "NC",
  0b11 <-> "C",
}

mapping b_name : bits(3) <-> string = {
  0b000 <-> "0",
  0b001 <-> "1",
  0b010 <-> "2",
  0b011 <-> "3",
  0b100 <-> "4",
  0b101 <-> "5",
  0b110 <-> "6",
  0b111 <-> "7",
}

mapping t_name : bits(3) <-> string = {
  0b000 <-> "$00",
  0b001 <-> "$08",
  0b010 <-> "$10",
  0b011 <-> "$18",
  0b100 <-> "$20",
  0b101 <-> "$28",
  0b110 <-> "$30",
  0b111 <-> "$38",
}

mapping i_name : bits(1) <-> string = {
  0b0 <-> "IX",
  0b1 <-> "IY",
}

scattered union instruction

// LD r, r2: Load Register
union clause instruction = LD_r_r2 : (bits(3), bits(3))
mapping clause encdec = LD_r_r2(r, r2)
  <-> 0b01 @ r @ r2
  when r != 0b110 & r2 != 0b110
mapping clause assembly = LD_r_r2(r, r2)
  <-> "LD" ^ spc() ^ r_name(r) ^ sep() ^ r2_name(r2)

// LD r, n: Load Immediate
union clause instruction = LD_r_n : (bits(3), bits(8))
mapping clause encdec = LD_r_n(r, n)
  <-> 0b00 @ r @ 0b110 @ n
  when r != 0b110
mapping clause assembly = LD_r_n(r, n)
  <-> "LD" ^ spc() ^ r_name(r) ^ sep() ^ hex_bits_8(n)

// LD r, (HL): Load from Memory
union clause instruction = LD_r_mHL : (bits(3))
mapping clause encdec = LD_r_mHL(r)
  <-> 0b01 @ r @ 0b110
  when r != 0b110
mapping clause assembly = LD_r_mHL(r)
  <-> "LD" ^ spc() ^ r_name(r) ^ sep() ^ "(HL)"

// LD (HL), r2: Store to Memory
union clause instruction = LD_mHL_r2 : (bits(3))
mapping clause encdec = LD_mHL_r2(r2)
  <-> 0b01110 @ r2
  when r2 != 0b110
mapping clause assembly = LD_mHL_r2(r2)
  <-> "LD" ^ spc() ^ "(HL)" ^ sep() ^ r2_name(r2)

// LD (HL), n: Store Immediate
union clause instruction = LD_mHL_n : (bits(8))
mapping clause encdec = LD_mHL_n(n)
  <-> 0b00110110 @ n
mapping clause assembly = LD_mHL_n(n)
  <-> "LD" ^ spc() ^ "(HL)" ^ sep() ^ hex_bits_8(n)

// LD A, (BC): Load A
union clause instruction = LD_A_mBC : unit
mapping clause encdec = LD_A_mBC()
  <-> 0b00001010
mapping clause assembly = LD_A_mBC()
  <-> "LD" ^ spc() ^ "A" ^ sep() ^ "(BC)"

// LD A, (DE): Load A
union clause instruction = LD_A_mDE : unit
mapping clause encdec = LD_A_mDE()
  <-> 0b00011010
mapping clause assembly = LD_A_mDE()
  <-> "LD" ^ spc() ^ "A" ^ sep() ^ "(DE)"

// LD (BC), A: Store A
union clause instruction = LD_mBC_A : unit
mapping clause encdec = LD_mBC_A()
  <-> 0b00000010
mapping clause assembly = LD_mBC_A()
  <-> "LD" ^ spc() ^ "(BC)" ^ sep() ^ "A"

// LD (DE), A: Store A
union clause instruction = LD_mDE_A : unit
mapping clause encdec = LD_mDE_A()
  <-> 0b00010010
mapping clause assembly = LD_mDE_A()
  <-> "LD" ^ spc() ^ "(DE)" ^ sep() ^ "A"

// LD A, (nn): Load A
union clause instruction = LD_A_mnn : (bits(16))
mapping clause encdec = LD_A_mnn(nn)
  <-> 0b00111010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_A_mnn(nn)
  <-> "LD" ^ spc() ^ "A" ^ sep() ^ "(" ^ hex_bits_16(nn) ^ ")"

// LD (nn), A: Store A
union clause instruction = LD_mnn_A : (bits(16))
mapping clause encdec = LD_mnn_A(nn)
  <-> 0b00110010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_mnn_A(nn)
  <-> "LD" ^ spc() ^ "(" ^ hex_bits_16(nn) ^ ")" ^ sep() ^ "A"

// LD r, (id): Load Indexed
union clause instruction = LD_r_mid : (bits(1), bits(3), bits(8))
mapping clause encdec = LD_r_mid(i, r, d)
  <-> 0b11 @ i @ 0b11101 @ 0b01 @ r @ 0b110 @ d
  when r != 0b110
mapping clause assembly = LD_r_mid(i, r, d)
  <-> "LD" ^ spc() ^ r_name(r) ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// LD (id), r2: Store Indexed
union clause instruction = LD_mid_r2 : (bits(1), bits(3), bits(8))
mapping clause encdec = LD_mid_r2(i, r2, d)
  <-> 0b11 @ i @ 0b11101 @ 0b01110 @ r2 @ d
  when r2 != 0b110
mapping clause assembly = LD_mid_r2(i, r2, d)
  <-> "LD" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")" ^ sep() ^ r2_name(r2)

// LD (id), n: Store Immediate Indexed
union clause instruction = LD_mid_n : (bits(1), bits(8), bits(8))
mapping clause encdec = LD_mid_n(i, d, n)
  <-> 0b11 @ i @ 0b11101 @ 0b00110110 @ d @ n
mapping clause assembly = LD_mid_n(i, d, n)
  <-> "LD" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")" ^ sep() ^ hex_bits_8(n)

// LD A, I: Load Interrupt Vector
union clause instruction = LD_A_I : unit
mapping clause encdec = LD_A_I()
  <-> 0b11101101 @ 0b01010111
mapping clause assembly = LD_A_I()
  <-> "LD" ^ spc() ^ "A" ^ sep() ^ "I"

// LD A, R: Load Refresh Register
union clause instruction = LD_A_R : unit
mapping clause encdec = LD_A_R()
  <-> 0b11101101 @ 0b01011111
mapping clause assembly = LD_A_R()
  <-> "LD" ^ spc() ^ "A" ^ sep() ^ "R"

// LD I, A: Set Interrupt Vector
union clause instruction = LD_I_A : unit
mapping clause encdec = LD_I_A()
  <-> 0b11101101 @ 0b01000111
mapping clause assembly = LD_I_A()
  <-> "LD" ^ spc() ^ "I" ^ sep() ^ "A"

// LD R, A: Set Refresh Register
union clause instruction = LD_R_A : unit
mapping clause encdec = LD_R_A()
  <-> 0b11101101 @ 0b01001111
mapping clause assembly = LD_R_A()
  <-> "LD" ^ spc() ^ "R" ^ sep() ^ "A"

// LD dd, nn: Load Immediate
union clause instruction = LD_dd_nn : (bits(2), bits(16))
mapping clause encdec = LD_dd_nn(dd, nn)
  <-> 0b00 @ dd @ 0b0001 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_dd_nn(dd, nn)
  <-> "LD" ^ spc() ^ dd_name(dd) ^ sep() ^ hex_bits_16(nn)

// LD HL, (nn): Load HL
union clause instruction = LD_HL_mnn : (bits(16))
mapping clause encdec = LD_HL_mnn(nn)
  <-> 0b00101010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_HL_mnn(nn)
  <-> "LD" ^ spc() ^ "HL" ^ sep() ^ "(" ^ hex_bits_16(nn) ^ ")"

// LD (nn), HL: Store HL
union clause instruction = LD_mnn_HL : (bits(16))
mapping clause encdec = LD_mnn_HL(nn)
  <-> 0b00100010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_mnn_HL(nn)
  <-> "LD" ^ spc() ^ "(" ^ hex_bits_16(nn) ^ ")" ^ sep() ^ "HL"

// LD dd, (nn): Load Pair
union clause instruction = LD_dd_mnn : (bits(2), bits(16))
mapping clause encdec = LD_dd_mnn(dd, nn)
  <-> 0b11101101 @ 0b01 @ dd @ 0b1011 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_dd_mnn(dd, nn)
  <-> "LD" ^ spc() ^ dd_name(dd) ^ sep() ^ "(" ^ hex_bits_16(nn) ^ ")"

// LD (nn), dd: Store Pair
union clause instruction = LD_mnn_dd : (bits(2), bits(16))
mapping clause encdec = LD_mnn_dd(dd, nn)
  <-> 0b11101101 @ 0b01 @ dd @ 0b0011 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_mnn_dd(dd, nn)
  <-> "LD" ^ spc() ^ "(" ^ hex_bits_16(nn) ^ ")" ^ sep() ^ dd_name(dd)

// LD i, nn: Load Immediate
union clause instruction = LD_i_nn : (bits(1), bits(16))
mapping clause encdec = LD_i_nn(i, nn)
  <-> 0b11 @ i @ 0b11101 @ 0b00100001 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_i_nn(i, nn)
  <-> "LD" ^ spc() ^ i_name(i) ^ sep() ^ hex_bits_16(nn)

// LD i, (nn): Load Index
union clause instruction = LD_i_mnn : (bits(1), bits(16))
mapping clause encdec = LD_i_mnn(i, nn)
  <-> 0b11 @ i @ 0b11101 @ 0b00101010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_i_mnn(i, nn)
  <-> "LD" ^ spc() ^ i_name(i) ^ sep() ^ "(" ^ hex_bits_16(nn) ^ ")"

// LD (nn), i: Store Index
union clause instruction = LD_mnn_i : (bits(1), bits(16))
mapping clause encdec = LD_mnn_i(i, nn)
  <-> 0b11 @ i @ 0b11101 @ 0b00100010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = LD_mnn_i(i, nn)
  <-> "LD" ^ spc() ^ "(" ^ hex_bits_16(nn) ^ ")" ^ sep() ^ i_name(i)

// LD SP, HL: Load Stack Pointer
union clause instruction = LD_SP_HL : unit
mapping clause encdec = LD_SP_HL()
  <-> 0b11111001
mapping clause assembly = LD_SP_HL()
  <-> "LD" ^ spc() ^ "SP" ^ sep() ^ "HL"

// LD SP, i: Load Stack Pointer
union clause instruction = LD_SP_i : (bits(1))
mapping clause encdec = LD_SP_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b11111001
mapping clause assembly = LD_SP_i(i)
  <-> "LD" ^ spc() ^ "SP" ^ sep() ^ i_name(i)

// PUSH qq: Push Pair
union clause instruction = PUSH_qq : (bits(2))
mapping clause encdec = PUSH_qq(qq)
  <-> 0b11 @ qq @ 0b0101
mapping clause assembly = PUSH_qq(qq)
  <-> "PUSH" ^ spc() ^ qq_name(qq)

// POP qq: Pop Pair
union clause instruction = POP_qq : (bits(2))
mapping clause encdec = POP_qq(qq)
  <-> 0b11 @ qq @ 0b0001
mapping clause assembly = POP_qq(qq)
  <-> "POP" ^ spc() ^ qq_name(qq)

// PUSH i: Push Index
union clause instruction = PUSH_i : (bits(1))
mapping clause encdec = PUSH_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b11100101
mapping clause assembly = PUSH_i(i)
  <-> "PUSH" ^ spc() ^ i_name(i)

// POP i: Pop Index
union clause instruction = POP_i : (bits(1))
mapping clause encdec = POP_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b11100001
mapping clause assembly = POP_i(i)
  <-> "POP" ^ spc() ^ i_name(i)

// EX DE, HL: Exchange DE and HL
union clause instruction = EX_DE_HL : unit
mapping clause encdec = EX_DE_HL()
  <-> 0b11101011
mapping clause assembly = EX_DE_HL()
  <-> "EX" ^ spc() ^ "DE" ^ sep() ^ "HL"

// EX AF, AF': Exchange with Shadow AF
union clause instruction = EX_AF_AFx : unit
mapping clause encdec = EX_AF_AFx()
  <-> 0b00001000
mapping clause assembly = EX_AF_AFx()
  <-> "EX" ^ spc() ^ "AF" ^ sep() ^ "AF'"

// EXX: Exchange Pairs with Shadows
union clause instruction = EXX : unit
mapping clause encdec = EXX()
  <-> 0b11011001
mapping clause assembly = EXX()
  <-> "EXX"

// EX (SP), HL: Exchange with Stack Top
union clause instruction = EX_mSP_HL : unit
mapping clause encdec = EX_mSP_HL()
  <-> 0b11100011
mapping clause assembly = EX_mSP_HL()
  <-> "EX" ^ spc() ^ "(SP)" ^ sep() ^ "HL"

// EX (SP), i: Exchange with Stack Top
union clause instruction = EX_mSP_i : (bits(1))
mapping clause encdec = EX_mSP_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b11100011
mapping clause assembly = EX_mSP_i(i)
  <-> "EX" ^ spc() ^ "(SP)" ^ sep() ^ i_name(i)

// LDI: Load and Increment
union clause instruction = LDI : unit
mapping clause encdec = LDI()
  <-> 0b11101101 @ 0b10100000
mapping clause assembly = LDI()
  <-> "LDI"

// LDIR: Load, Increment, Repeat
union clause instruction = LDIR : unit
mapping clause encdec = LDIR()
  <-> 0b11101101 @ 0b10110000
mapping clause assembly = LDIR()
  <-> "LDIR"

// LDD: Load and Decrement
union clause instruction = LDD : unit
mapping clause encdec = LDD()
  <-> 0b11101101 @ 0b10101000
mapping clause assembly = LDD()
  <-> "LDD"

// LDDR: Load, Decrement, Repeat
union clause instruction = LDDR : unit
mapping clause encdec = LDDR()
  <-> 0b11101101 @ 0b10111000
mapping clause assembly = LDDR()
  <-> "LDDR"

// CPI: Compare and Increment
union clause instruction = CPI : unit
mapping clause encdec = CPI()
  <-> 0b11101101 @ 0b10100001
mapping clause assembly = CPI()
  <-> "CPI"

// CPIR: Compare, Increment, Repeat
union clause instruction = CPIR : unit
mapping clause encdec = CPIR()
  <-> 0b11101101 @ 0b10110001
mapping clause assembly = CPIR()
  <-> "CPIR"

// CPD: Compare and Decrement
union clause instruction = CPD : unit
mapping clause encdec = CPD()
  <-> 0b11101101 @ 0b10101001
mapping clause assembly = CPD()
  <-> "CPD"

// CPDR: Compare, Decrement, Repeat
union clause instruction = CPDR : unit
mapping clause encdec = CPDR()
  <-> 0b11101101 @ 0b10111001
mapping clause assembly = CPDR()
  <-> "CPDR"

// INI: Input and Increment
union clause instruction = INI : unit
mapping clause encdec = INI()
  <-> 0b11101101 @ 0b10100010
mapping clause assembly = INI()
  <-> "INI"

// INIR: Input, Increment, Repeat
union clause instruction = INIR : unit
mapping clause encdec = INIR()
  <-> 0b11101101 @ 0b10110010
mapping clause assembly = INIR()
  <-> "INIR"

// IND: Input and Decrement
union clause instruction = IND : unit
mapping clause encdec = IND()
  <-> 0b11101101 @ 0b10101010
mapping clause assembly = IND()
  <-> "IND"

// INDR: Input, Decrement, Repeat
union clause instruction = INDR : unit
mapping clause encdec = INDR()
  <-> 0b11101101 @ 0b10111010
mapping clause assembly = INDR()
  <-> "INDR"

// OUTI: Output and Increment
union clause instruction = OUTI : unit
mapping clause encdec = OUTI()
  <-> 0b11101101 @ 0b10100011
mapping clause assembly = OUTI()
  <-> "OUTI"

// OTIR: Output, Increment, Repeat
union clause instruction = OTIR : unit
mapping clause encdec = OTIR()
  <-> 0b11101101 @ 0b10110011
mapping clause assembly = OTIR()
  <-> "OTIR"

// OUTD: Output and Decrement
union clause instruction = OUTD : unit
mapping clause encdec = OUTD()
  <-> 0b11101101 @ 0b10101011
mapping clause assembly = OUTD()
  <-> "OUTD"

// OTDR: Output, Decrement, Repeat
union clause instruction = OTDR : unit
mapping clause encdec = OTDR()
  <-> 0b11101101 @ 0b10111011
mapping clause assembly = OTDR()
  <-> "OTDR"

// ADD A, r: Add
union clause instruction = ADD_A_r : (bits(3))
mapping clause encdec = ADD_A_r(r)
  <-> 0b10 @ 0b000 @ r
  when r != 0b110
mapping clause assembly = ADD_A_r(r)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ADD A, (HL): Add
union clause instruction = ADD_A_mHL : unit
mapping clause encdec = ADD_A_mHL()
  <-> 0b10 @ 0b000 @ 0b110
mapping clause assembly = ADD_A_mHL()
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ "(HL)"

// ADD A, n: Add
union clause instruction = ADD_A_n : (bits(8))
mapping clause encdec = ADD_A_n(n)
  <-> 0b11 @ 0b000 @ 0b110 @ n
mapping clause assembly = ADD_A_n(n)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(n)

// ADD A, (id): Add
union clause instruction = ADD_A_mid : (bits(1), bits(8))
mapping clause encdec = ADD_A_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b000 @ 0b110 @ d
mapping clause assembly = ADD_A_mid(i, d)
  <-> "ADD" ^ spc() ^ "A" ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// ADC A, r: Add with Carry
union clause instruction = ADC_A_r : (bits(3))
mapping clause encdec = ADC_A_r(r)
  <-> 0b10 @ 0b001 @ r
  when r != 0b110
mapping clause assembly = ADC_A_r(r)
  <-> "ADC" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// ADC A, (HL): Add with Carry
union clause instruction = ADC_A_mHL : unit
mapping clause encdec = ADC_A_mHL()
  <-> 0b10 @ 0b001 @ 0b110
mapping clause assembly = ADC_A_mHL()
  <-> "ADC" ^ spc() ^ "A" ^ sep() ^ "(HL)"

// ADC A, n: Add with Carry
union clause instruction = ADC_A_n : (bits(8))
mapping clause encdec = ADC_A_n(n)
  <-> 0b11 @ 0b001 @ 0b110 @ n
mapping clause assembly = ADC_A_n(n)
  <-> "ADC" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(n)

// ADC A, (id): Add with Carry
union clause instruction = ADC_A_mid : (bits(1), bits(8))
mapping clause encdec = ADC_A_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b001 @ 0b110 @ d
mapping clause assembly = ADC_A_mid(i, d)
  <-> "ADC" ^ spc() ^ "A" ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SUB r: Subtract
union clause instruction = SUB_r : (bits(3))
mapping clause encdec = SUB_r(r)
  <-> 0b10 @ 0b010 @ r
  when r != 0b110
mapping clause assembly = SUB_r(r)
  <-> "SUB" ^ spc() ^ r_name(r)

// SUB (HL): Subtract
union clause instruction = SUB_mHL : unit
mapping clause encdec = SUB_mHL()
  <-> 0b10 @ 0b010 @ 0b110
mapping clause assembly = SUB_mHL()
  <-> "SUB" ^ spc() ^ "(HL)"

// SUB n: Subtract
union clause instruction = SUB_n : (bits(8))
mapping clause encdec = SUB_n(n)
  <-> 0b11 @ 0b010 @ 0b110 @ n
mapping clause assembly = SUB_n(n)
  <-> "SUB" ^ spc() ^ hex_bits_8(n)

// SUB (id): Subtract
union clause instruction = SUB_mid : (bits(1), bits(8))
mapping clause encdec = SUB_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b010 @ 0b110 @ d
mapping clause assembly = SUB_mid(i, d)
  <-> "SUB" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SBC A, r: Subtract with Carry
union clause instruction = SBC_A_r : (bits(3))
mapping clause encdec = SBC_A_r(r)
  <-> 0b10 @ 0b011 @ r
  when r != 0b110
mapping clause assembly = SBC_A_r(r)
  <-> "SBC" ^ spc() ^ "A" ^ sep() ^ r_name(r)

// SBC A, (HL): Subtract with Carry
union clause instruction = SBC_A_mHL : unit
mapping clause encdec = SBC_A_mHL()
  <-> 0b10 @ 0b011 @ 0b110
mapping clause assembly = SBC_A_mHL()
  <-> "SBC" ^ spc() ^ "A" ^ sep() ^ "(HL)"

// SBC A, n: Subtract with Carry
union clause instruction = SBC_A_n : (bits(8))
mapping clause encdec = SBC_A_n(n)
  <-> 0b11 @ 0b011 @ 0b110 @ n
mapping clause assembly = SBC_A_n(n)
  <-> "SBC" ^ spc() ^ "A" ^ sep() ^ hex_bits_8(n)

// SBC A, (id): Subtract with Carry
union clause instruction = SBC_A_mid : (bits(1), bits(8))
mapping clause encdec = SBC_A_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b011 @ 0b110 @ d
mapping clause assembly = SBC_A_mid(i, d)
  <-> "SBC" ^ spc() ^ "A" ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// AND r: Bitwise And
union clause instruction = AND_r : (bits(3))
mapping clause encdec = AND_r(r)
  <-> 0b10 @ 0b100 @ r
  when r != 0b110
mapping clause assembly = AND_r(r)
  <-> "AND" ^ spc() ^ r_name(r)

// AND (HL): Bitwise And
union clause instruction = AND_mHL : unit
mapping clause encdec = AND_mHL()
  <-> 0b10 @ 0b100 @ 0b110
mapping clause assembly = AND_mHL()
  <-> "AND" ^ spc() ^ "(HL)"

// AND n: Bitwise And
union clause instruction = AND_n : (bits(8))
mapping clause encdec = AND_n(n)
  <-> 0b11 @ 0b100 @ 0b110 @ n
mapping clause assembly = AND_n(n)
  <-> "AND" ^ spc() ^ hex_bits_8(n)

// AND (id): Bitwise And
union clause instruction = AND_mid : (bits(1), bits(8))
mapping clause encdec = AND_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b100 @ 0b110 @ d
mapping clause assembly = AND_mid(i, d)
  <-> "AND" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// XOR r: Bitwise Exclusive Or
union clause instruction = XOR_r : (bits(3))
mapping clause encdec = XOR_r(r)
  <-> 0b10 @ 0b101 @ r
  when r != 0b110
mapping clause assembly = XOR_r(r)
  <-> "XOR" ^ spc() ^ r_name(r)

// XOR (HL): Bitwise Exclusive Or
union clause instruction = XOR_mHL : unit
mapping clause encdec = XOR_mHL()
  <-> 0b10 @ 0b101 @ 0b110
mapping clause assembly = XOR_mHL()
  <-> "XOR" ^ spc() ^ "(HL)"

// XOR n: Bitwise Exclusive Or
union clause instruction = XOR_n : (bits(8))
mapping clause encdec = XOR_n(n)
  <-> 0b11 @ 0b101 @ 0b110 @ n
mapping clause assembly = XOR_n(n)
  <-> "XOR" ^ spc() ^ hex_bits_8(n)

// XOR (id): Bitwise Exclusive Or
union clause instruction = XOR_mid : (bits(1), bits(8))
mapping clause encdec = XOR_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b101 @ 0b110 @ d
mapping clause assembly = XOR_mid(i, d)
  <-> "XOR" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// OR r: Bitwise Or
union clause instruction = OR_r : (bits(3))
mapping clause encdec = OR_r(r)
  <-> 0b10 @ 0b110 @ r
  when r != 0b110
mapping clause assembly = OR_r(r)
  <-> "OR" ^ spc() ^ r_name(r)

// OR (HL): Bitwise Or
union clause instruction = OR_mHL : unit
mapping clause encdec = OR_mHL()
  <-> 0b10 @ 0b110 @ 0b110
mapping clause assembly = OR_mHL()
  <-> "OR" ^ spc() ^ "(HL)"

// OR n: Bitwise Or
union clause instruction = OR_n : (bits(8))
mapping clause encdec = OR_n(n)
  <-> 0b11 @ 0b110 @ 0b110 @ n
mapping clause assembly = OR_n(n)
  <-> "OR" ^ spc() ^ hex_bits_8(n)

// OR (id): Bitwise Or
union clause instruction = OR_mid : (bits(1), bits(8))
mapping clause encdec = OR_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b110 @ 0b110 @ d
mapping clause assembly = OR_mid(i, d)
  <-> "OR" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// CP r: Compare
union clause instruction = CP_r : (bits(3))
mapping clause encdec = CP_r(r)
  <-> 0b10 @ 0b111 @ r
  when r != 0b110
mapping clause assembly = CP_r(r)
  <-> "CP" ^ spc() ^ r_name(r)

// CP (HL): Compare
union clause instruction = CP_mHL : unit
mapping clause encdec = CP_mHL()
  <-> 0b10 @ 0b111 @ 0b110
mapping clause assembly = CP_mHL()
  <-> "CP" ^ spc() ^ "(HL)"

// CP n: Compare
union clause instruction = CP_n : (bits(8))
mapping clause encdec = CP_n(n)
  <-> 0b11 @ 0b111 @ 0b110 @ n
mapping clause assembly = CP_n(n)
  <-> "CP" ^ spc() ^ hex_bits_8(n)

// CP (id): Compare
union clause instruction = CP_mid : (bits(1), bits(8))
mapping clause encdec = CP_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b10 @ 0b111 @ 0b110 @ d
mapping clause assembly = CP_mid(i, d)
  <-> "CP" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// INC r: Increment
union clause instruction = INC_r : (bits(3))
mapping clause encdec = INC_r(r)
  <-> 0b00 @ r @ 0b100
  when r != 0b110
mapping clause assembly = INC_r(r)
  <-> "INC" ^ spc() ^ r_name(r)

// INC (HL): Increment
union clause instruction = INC_mHL : unit
mapping clause encdec = INC_mHL()
  <-> 0b00110 @ 0b100
mapping clause assembly = INC_mHL()
  <-> "INC" ^ spc() ^ "(HL)"

// INC (id): Increment
union clause instruction = INC_mid : (bits(1), bits(8))
mapping clause encdec = INC_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b00110 @ 0b100 @ d
mapping clause assembly = INC_mid(i, d)
  <-> "INC" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// DEC r: Decrement
union clause instruction = DEC_r : (bits(3))
mapping clause encdec = DEC_r(r)
  <-> 0b00 @ r @ 0b101
  when r != 0b110
mapping clause assembly = DEC_r(r)
  <-> "DEC" ^ spc() ^ r_name(r)

// DEC (HL): Decrement
union clause instruction = DEC_mHL : unit
mapping clause encdec = DEC_mHL()
  <-> 0b00110 @ 0b101
mapping clause assembly = DEC_mHL()
  <-> "DEC" ^ spc() ^ "(HL)"

// DEC (id): Decrement
union clause instruction = DEC_mid : (bits(1), bits(8))
mapping clause encdec = DEC_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b00110 @ 0b101 @ d
mapping clause assembly = DEC_mid(i, d)
  <-> "DEC" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// ADD HL, ss: Add Pair
union clause instruction = ADD_HL_ss : (bits(2))
mapping clause encdec = ADD_HL_ss(ss)
  <-> 0b00 @ ss @ 0b1001
mapping clause assembly = ADD_HL_ss(ss)
  <-> "ADD" ^ spc() ^ "HL" ^ sep() ^ ss_name(ss)

// ADC HL, ss: Add Pair with Carry
union clause instruction = ADC_HL_ss : (bits(2))
mapping clause encdec = ADC_HL_ss(ss)
  <-> 0b11101101 @ 0b01 @ ss @ 0b1010
mapping clause assembly = ADC_HL_ss(ss)
  <-> "ADC" ^ spc() ^ "HL" ^ sep() ^ ss_name(ss)

// SBC HL, ss: Subtract Pair with Carry
union clause instruction = SBC_HL_ss : (bits(2))
mapping clause encdec = SBC_HL_ss(ss)
  <-> 0b11101101 @ 0b01 @ ss @ 0b0010
mapping clause assembly = SBC_HL_ss(ss)
  <-> "SBC" ^ spc() ^ "HL" ^ sep() ^ ss_name(ss)

// ADD IX, pp: Add to IX
union clause instruction = ADD_IX_pp : (bits(2))
mapping clause encdec = ADD_IX_pp(pp)
  <-> 0b11011101 @ 0b00 @ pp @ 0b1001
mapping clause assembly = ADD_IX_pp(pp)
  <-> "ADD" ^ spc() ^ "IX" ^ sep() ^ pp_name(pp)

// ADD IY, rr: Add to IY
union clause instruction = ADD_IY_rr : (bits(2))
mapping clause encdec = ADD_IY_rr(rr)
  <-> 0b11111101 @ 0b00 @ rr @ 0b1001
mapping clause assembly = ADD_IY_rr(rr)
  <-> "ADD" ^ spc() ^ "IY" ^ sep() ^ rr_name(rr)

// INC ss: Increment Pair
union clause instruction = INC_ss : (bits(2))
mapping clause encdec = INC_ss(ss)
  <-> 0b00 @ ss @ 0b0011
mapping clause assembly = INC_ss(ss)
  <-> "INC" ^ spc() ^ ss_name(ss)

// DEC ss: Decrement Pair
union clause instruction = DEC_ss : (bits(2))
mapping clause encdec = DEC_ss(ss)
  <-> 0b00 @ ss @ 0b1011
mapping clause assembly = DEC_ss(ss)
  <-> "DEC" ^ spc() ^ ss_name(ss)

// INC i: Increment Index
union clause instruction = INC_i : (bits(1))
mapping clause encdec = INC_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b00100011
mapping clause assembly = INC_i(i)
  <-> "INC" ^ spc() ^ i_name(i)

// DEC i: Decrement Index
union clause instruction = DEC_i : (bits(1))
mapping clause encdec = DEC_i(i)
  <-> 0b11 @ i @ 0b11101 @ 0b00101011
mapping clause assembly = DEC_i(i)
  <-> "DEC" ^ spc() ^ i_name(i)

// RLCA: Rotate A Left Circular
union clause instruction = RLCA : unit
mapping clause encdec = RLCA()
  <-> 0b00000111
mapping clause assembly = RLCA()
  <-> "RLCA"

// RRCA: Rotate A Right Circular
union clause instruction = RRCA : unit
mapping clause encdec = RRCA()
  <-> 0b00001111
mapping clause assembly = RRCA()
  <-> "RRCA"

// RLA: Rotate A Left through Carry
union clause instruction = RLA : unit
mapping clause encdec = RLA()
  <-> 0b00010111
mapping clause assembly = RLA()
  <-> "RLA"

// RRA: Rotate A Right through Carry
union clause instruction = RRA : unit
mapping clause encdec = RRA()
  <-> 0b00011111
mapping clause assembly = RRA()
  <-> "RRA"

// RLC r: Rotate Left Circular
union clause instruction = RLC_r : (bits(3))
mapping clause encdec = RLC_r(r)
  <-> 0b11001011 @ 0b00 @ 0b000 @ r
  when r != 0b110
mapping clause assembly = RLC_r(r)
  <-> "RLC" ^ spc() ^ r_name(r)

// RLC (HL): Rotate Left Circular
union clause instruction = RLC_mHL : unit
mapping clause encdec = RLC_mHL()
  <-> 0b11001011 @ 0b00 @ 0b000 @ 0b110
mapping clause assembly = RLC_mHL()
  <-> "RLC" ^ spc() ^ "(HL)"

// RLC (id): Rotate Left Circular
union clause instruction = RLC_mid : (bits(1), bits(8))
mapping clause encdec = RLC_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b000 @ 0b110
mapping clause assembly = RLC_mid(i, d)
  <-> "RLC" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// RRC r: Rotate Right Circular
union clause instruction = RRC_r : (bits(3))
mapping clause encdec = RRC_r(r)
  <-> 0b11001011 @ 0b00 @ 0b001 @ r
  when r != 0b110
mapping clause assembly = RRC_r(r)
  <-> "RRC" ^ spc() ^ r_name(r)

// RRC (HL): Rotate Right Circular
union clause instruction = RRC_mHL : unit
mapping clause encdec = RRC_mHL()
  <-> 0b11001011 @ 0b00 @ 0b001 @ 0b110
mapping clause assembly = RRC_mHL()
  <-> "RRC" ^ spc() ^ "(HL)"

// RRC (id): Rotate Right Circular
union clause instruction = RRC_mid : (bits(1), bits(8))
mapping clause encdec = RRC_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b001 @ 0b110
mapping clause assembly = RRC_mid(i, d)
  <-> "RRC" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// RL r: Rotate Left through Carry
union clause instruction = RL_r : (bits(3))
mapping clause encdec = RL_r(r)
  <-> 0b11001011 @ 0b00 @ 0b010 @ r
  when r != 0b110
mapping clause assembly = RL_r(r)
  <-> "RL" ^ spc() ^ r_name(r)

// RL (HL): Rotate Left through Carry
union clause instruction = RL_mHL : unit
mapping clause encdec = RL_mHL()
  <-> 0b11001011 @ 0b00 @ 0b010 @ 0b110
mapping clause assembly = RL_mHL()
  <-> "RL" ^ spc() ^ "(HL)"

// RL (id): Rotate Left through Carry
union clause instruction = RL_mid : (bits(1), bits(8))
mapping clause encdec = RL_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b010 @ 0b110
mapping clause assembly = RL_mid(i, d)
  <-> "RL" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// RR r: Rotate Right through Carry
union clause instruction = RR_r : (bits(3))
mapping clause encdec = RR_r(r)
  <-> 0b11001011 @ 0b00 @ 0b011 @ r
  when r != 0b110
mapping clause assembly = RR_r(r)
  <-> "RR" ^ spc() ^ r_name(r)

// RR (HL): Rotate Right through Carry
union clause instruction = RR_mHL : unit
mapping clause encdec = RR_mHL()
  <-> 0b11001011 @ 0b00 @ 0b011 @ 0b110
mapping clause assembly = RR_mHL()
  <-> "RR" ^ spc() ^ "(HL)"

// RR (id): Rotate Right through Carry
union clause instruction = RR_mid : (bits(1), bits(8))
mapping clause encdec = RR_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b011 @ 0b110
mapping clause assembly = RR_mid(i, d)
  <-> "RR" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SLA r: Shift Left Arithmetic
union clause instruction = SLA_r : (bits(3))
mapping clause encdec = SLA_r(r)
  <-> 0b11001011 @ 0b00 @ 0b100 @ r
  when r != 0b110
mapping clause assembly = SLA_r(r)
  <-> "SLA" ^ spc() ^ r_name(r)

// SLA (HL): Shift Left Arithmetic
union clause instruction = SLA_mHL : unit
mapping clause encdec = SLA_mHL()
  <-> 0b11001011 @ 0b00 @ 0b100 @ 0b110
mapping clause assembly = SLA_mHL()
  <-> "SLA" ^ spc() ^ "(HL)"

// SLA (id): Shift Left Arithmetic
union clause instruction = SLA_mid : (bits(1), bits(8))
mapping clause encdec = SLA_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b100 @ 0b110
mapping clause assembly = SLA_mid(i, d)
  <-> "SLA" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SRA r: Shift Right Arithmetic
union clause instruction = SRA_r : (bits(3))
mapping clause encdec = SRA_r(r)
  <-> 0b11001011 @ 0b00 @ 0b101 @ r
  when r != 0b110
mapping clause assembly = SRA_r(r)
  <-> "SRA" ^ spc() ^ r_name(r)

// SRA (HL): Shift Right Arithmetic
union clause instruction = SRA_mHL : unit
mapping clause encdec = SRA_mHL()
  <-> 0b11001011 @ 0b00 @ 0b101 @ 0b110
mapping clause assembly = SRA_mHL()
  <-> "SRA" ^ spc() ^ "(HL)"

// SRA (id): Shift Right Arithmetic
union clause instruction = SRA_mid : (bits(1), bits(8))
mapping clause encdec = SRA_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b101 @ 0b110
mapping clause assembly = SRA_mid(i, d)
  <-> "SRA" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SRL r: Shift Right Logical
union clause instruction = SRL_r : (bits(3))
mapping clause encdec = SRL_r(r)
  <-> 0b11001011 @ 0b00 @ 0b111 @ r
  when r != 0b110
mapping clause assembly = SRL_r(r)
  <-> "SRL" ^ spc() ^ r_name(r)

// SRL (HL): Shift Right Logical
union clause instruction = SRL_mHL : unit
mapping clause encdec = SRL_mHL()
  <-> 0b11001011 @ 0b00 @ 0b111 @ 0b110
mapping clause assembly = SRL_mHL()
  <-> "SRL" ^ spc() ^ "(HL)"

// SRL (id): Shift Right Logical
union clause instruction = SRL_mid : (bits(1), bits(8))
mapping clause encdec = SRL_mid(i, d)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b00 @ 0b111 @ 0b110
mapping clause assembly = SRL_mid(i, d)
  <-> "SRL" ^ spc() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// RLD: Rotate Digit Left
union clause instruction = RLD : unit
mapping clause encdec = RLD()
  <-> 0b11101101 @ 0b01101111
mapping clause assembly = RLD()
  <-> "RLD"

// RRD: Rotate Digit Right
union clause instruction = RRD : unit
mapping clause encdec = RRD()
  <-> 0b11101101 @ 0b01100111
mapping clause assembly = RRD()
  <-> "RRD"

// BIT b, r: Test Bit
union clause instruction = BIT_b_r : (bits(3), bits(3))
mapping clause encdec = BIT_b_r(b, r)
  <-> 0b11001011 @ 0b01 @ b @ r
  when r != 0b110
mapping clause assembly = BIT_b_r(b, r)
  <-> "BIT" ^ spc() ^ b_name(b) ^ sep() ^ r_name(r)

// BIT b, (HL): Test Bit
union clause instruction = BIT_b_mHL : (bits(3))
mapping clause encdec = BIT_b_mHL(b)
  <-> 0b11001011 @ 0b01 @ b @ 0b110
mapping clause assembly = BIT_b_mHL(b)
  <-> "BIT" ^ spc() ^ b_name(b) ^ sep() ^ "(HL)"

// BIT b, (id): Test Bit
union clause instruction = BIT_b_mid : (bits(1), bits(8), bits(3))
mapping clause encdec = BIT_b_mid(i, d, b)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b01 @ b @ 0b110
mapping clause assembly = BIT_b_mid(i, d, b)
  <-> "BIT" ^ spc() ^ b_name(b) ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// RES b, r: Reset Bit
union clause instruction = RES_b_r : (bits(3), bits(3))
mapping clause encdec = RES_b_r(b, r)
  <-> 0b11001011 @ 0b10 @ b @ r
  when r != 0b110
mapping clause assembly = RES_b_r(b, r)
  <-> "RES" ^ spc() ^ b_name(b) ^ sep() ^ r_name(r)

// RES b, (HL): Reset Bit
union clause instruction = RES_b_mHL : (bits(3))
mapping clause encdec = RES_b_mHL(b)
  <-> 0b11001011 @ 0b10 @ b @ 0b110
mapping clause assembly = RES_b_mHL(b)
  <-> "RES" ^ spc() ^ b_name(b) ^ sep() ^ "(HL)"

// RES b, (id): Reset Bit
union clause instruction = RES_b_mid : (bits(1), bits(8), bits(3))
mapping clause encdec = RES_b_mid(i, d, b)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b10 @ b @ 0b110
mapping clause assembly = RES_b_mid(i, d, b)
  <-> "RES" ^ spc() ^ b_name(b) ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// SET b, r: Set Bit
union clause instruction = SET_b_r : (bits(3), bits(3))
mapping clause encdec = SET_b_r(b, r)
  <-> 0b11001011 @ 0b11 @ b @ r
  when r != 0b110
mapping clause assembly = SET_b_r(b, r)
  <-> "SET" ^ spc() ^ b_name(b) ^ sep() ^ r_name(r)

// SET b, (HL): Set Bit
union clause instruction = SET_b_mHL : (bits(3))
mapping clause encdec = SET_b_mHL(b)
  <-> 0b11001011 @ 0b11 @ b @ 0b110
mapping clause assembly = SET_b_mHL(b)
  <-> "SET" ^ spc() ^ b_name(b) ^ sep() ^ "(HL)"

// SET b, (id): Set Bit
union clause instruction = SET_b_mid : (bits(1), bits(8), bits(3))
mapping clause encdec = SET_b_mid(i, d, b)
  <-> 0b11 @ i @ 0b11101 @ 0b11001011 @ d @ 0b11 @ b @ 0b110
mapping clause assembly = SET_b_mid(i, d, b)
  <-> "SET" ^ spc() ^ b_name(b) ^ sep() ^ "(" ^ i_name(i) ^ hex_bits_signed_8(d) ^ ")"

// JP nn: Jump
union clause instruction = JP_nn : (bits(16))
mapping clause encdec = JP_nn(nn)
  <-> 0b11000011 @ nn[7..0] @ nn[15..8]
mapping clause assembly = JP_nn(nn)
  <-> "JP" ^ spc() ^ hex_bits_16(nn)

// JP cc, nn: Jump if
union clause instruction = JP_cc_nn : (bits(3), bits(16))
mapping clause encdec = JP_cc_nn(cc, nn)
  <-> 0b11 @ cc @ 0b010 @ nn[7..0] @ nn[15..8]
mapping clause assembly = JP_cc_nn(cc, nn)
  <-> "JP" ^ spc() ^ cc_name(cc) ^ sep() ^ hex_bits_16(nn)

// JR e: Jump Relative
union clause instruction = JR_e : (bits(8))
mapping clause encdec = JR_e(e)
  <-> 0b00011000 @ e
mapping clause assembly = JR_e(e)
  <-> "JR" ^ spc() ^ hex_bits_signed_8(e)

// JR jc, e: Jump Relative if
union clause instruction = JR_jc_e : (bits(2), bits(8))
mapping clause encdec = JR_jc_e(jc, e)
  <-> 0b001 @ jc @ 0b000 @ e
mapping clause assembly = JR_jc_e(jc, e)
  <-> "JR" ^ spc() ^ jc_name(jc) ^ sep() ^ hex_bits_signed_8(e)

// DJNZ e: Decrement B, Jump if Not Zero
union clause instruction = DJNZ_e : (bits(8))
mapping clause encdec = DJNZ_e(e)
  <-> 0b00010000 @ e
mapping clause assembly = DJNZ_e(e)
  <-> "DJNZ" ^ spc() ^ hex_bits_signed_8(e)

// JP (HL): Jump to HL
union clause instruction = JP_mHL : unit
mapping clause encdec = JP_mHL()
  <-> 0b11101001
mapping clause assembly = JP_mHL()
  <-> "JP" ^ spc() ^ "(HL)"

// JP (i): Jump to IX / IY
union clause instruction = JP_mi : (bits(1))
mapping clause encdec = JP_mi(i)
  <-> 0b11 @ i @ 0b11101 @ 0b11101001
mapping clause assembly = JP_mi(i)
  <-> "JP" ^ spc() ^ "(" ^ i_name(i) ^ ")"

// CALL nn: Call
union clause instruction = CALL_nn : (bits(16))
mapping clause encdec = CALL_nn(nn)
  <-> 0b11001101 @ nn[7..0] @ nn[15..8]
mapping clause assembly = CALL_nn(nn)
  <-> "CALL" ^ spc() ^ hex_bits_16(nn)

// CALL cc, nn: Call if
union clause instruction = CALL_cc_nn : (bits(3), bits(16))
mapping clause encdec = CALL_cc_nn(cc, nn)
  <-> 0b11 @ cc @ 0b100 @ nn[7..0] @ nn[15..8]
mapping clause assembly = CALL_cc_nn(cc, nn)
  <-> "CALL" ^ spc() ^ cc_name(cc) ^ sep() ^ hex_bits_16(nn)

// RET: Return
union clause instruction = RET : unit
mapping clause encdec = RET()
  <-> 0b11001001
mapping clause assembly = RET()
  <-> "RET"

// RET cc: Return if
union clause instruction = RET_cc : (bits(3))
mapping clause encdec = RET_cc(cc)
  <-> 0b11 @ cc @ 0b000
mapping clause assembly = RET_cc(cc)
  <-> "RET" ^ spc() ^ cc_name(cc)

// RST t: Restart
union clause instruction = RST_t : (bits(3))
mapping clause encdec = RST_t(t)
  <-> 0b11 @ t @ 0b111
mapping clause assembly = RST_t(t)
  <-> "RST" ^ spc() ^ t_name(t)

// RETI: Return from Interrupt
union clause instruction = RETI : unit
mapping clause encdec = RETI()
  <-> 0b11101101 @ 0b01001101
mapping clause assembly = RETI()
  <-> "RETI"

// RETN: Return from Non-Maskable Interrupt
union clause instruction = RETN : unit
mapping clause encdec = RETN()
  <-> 0b11101101 @ 0b01000101
mapping clause assembly = RETN()
  <-> "RETN"

// IN A, (n): Input from Port
union clause instruction = IN_A_mn : (bits(8))
mapping clause encdec = IN_A_mn(n)
  <-> 0b11011011 @ n
mapping clause assembly = IN_A_mn(n)
  <-> "IN" ^ spc() ^ "A" ^ sep() ^ "(" ^ hex_bits_8(n) ^ ")"

// OUT (n), A: Output to Port
union clause instruction = OUT_mn_A : (bits(8))
mapping clause encdec = OUT_mn_A(n)
  <-> 0b11010011 @ n
mapping clause assembly = OUT_mn_A(n)
  <-> "OUT" ^ spc() ^ "(" ^ hex_bits_8(n) ^ ")" ^ sep() ^ "A"

// IN r, (C): Input from Port C
union clause instruction = IN_r_mC : (bits(3))
mapping clause encdec = IN_r_mC(r)
  <-> 0b11101101 @ 0b01 @ r @ 0b000
  when r != 0b110
mapping clause assembly = IN_r_mC(r)
  <-> "IN" ^ spc() ^ r_name(r) ^ sep() ^ "(C)"

// OUT (C), r2: Output to Port C
union clause instruction = OUT_mC_r2 : (bits(3))
mapping clause encdec = OUT_mC_r2(r2)
  <-> 0b11101101 @ 0b01 @ r2 @ 0b001
  when r2 != 0b110
mapping clause assembly = OUT_mC_r2(r2)
  <-> "OUT" ^ spc() ^ "(C)" ^ sep() ^ r2_name(r2)

// NOP: No Operation
union clause instruction = NOP : unit
mapping clause encdec = NOP()
  <-> 0b00000000
mapping clause assembly = NOP()
  <-> "NOP"

// HALT: Halt
union clause instruction = HALT : unit
mapping clause encdec = HALT()
  <-> 0b01110110
mapping clause assembly = HALT()
  <-> "HALT"

// DI: Disable Interrupts
union clause instruction = DI : unit
mapping clause encdec = DI()
  <-> 0b11110011
mapping clause assembly = DI()
  <-> "DI"

// EI: Enable Interrupts
union clause instruction = EI : unit
mapping clause encdec = EI()
  <-> 0b11111011
mapping clause assembly = EI()
  <-> "EI"

// DAA: Decimal Adjust Accumulator
union clause instruction = DAA : unit
mapping clause encdec = DAA()
  <-> 0b00100111
mapping clause assembly = DAA()
  <-> "DAA"

// CPL: Complement Accumulator
union clause instruction = CPL : unit
mapping clause encdec = CPL()
  <-> 0b00101111
mapping clause assembly = CPL()
  <-> "CPL"

// CCF: Complement Carry
union clause instruction = CCF : unit
mapping clause encdec = CCF()
  <-> 0b00111111
mapping clause assembly = CCF()
  <-> "CCF"

// SCF: Set Carry
union clause instruction = SCF : unit
mapping clause encdec = SCF()
  <-> 0b00110111
mapping clause assembly = SCF()
  <-> "SCF"

// NEG: Negate Accumulator
union clause instruction = NEG : unit
mapping clause encdec = NEG()
  <-> 0b11101101 @ 0b01000100
mapping clause assembly = NEG()
  <-> "NEG"

// IM 0: Interrupt Mode 0
union clause instruction = IM_0 : unit
mapping clause encdec = IM_0()
  <-> 0b11101101 @ 0b01000110
mapping clause assembly = IM_0()
  <-> "IM" ^ spc() ^ "0"

// IM 1: Interrupt Mode 1
union clause instruction = IM_1 : unit
mapping clause encdec = IM_1()
  <-> 0b11101101 @ 0b01010110
mapping clause assembly = IM_1()
  <-> "IM" ^ spc() ^ "1"

// IM 2: Interrupt Mode 2
union clause instruction = IM_2 : unit
mapping clause encdec = IM_2()
  <-> 0b11101101 @ 0b01011110
mapping clause assembly = IM_2()
  <-> "IM" ^ spc() ^ "2"

end instruction
