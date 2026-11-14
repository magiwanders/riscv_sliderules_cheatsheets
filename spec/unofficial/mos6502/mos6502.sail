// MOS 6502 (NMOS, official opcodes): encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// opcode table of MOS Technology's MCS6500 Microcomputer Family Programming Manual. There is no official Sail model of
// the 6502; the sheets take its encodings from llvm-mos's TableGen and check this file against it bit by bit.
// Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model, not checked by the Sail compiler. An instruction is its bytes in memory
// order, the opcode first, 16 bit addresses low byte first (addr[7..0] @ addr[15..8]). Constructors are named as
// llvm-mos names its instructions (MNEMONIC_Mode).

scattered union instruction

// LDA #imm: Load Accumulator
union clause instruction = LDA_Immediate : (bits(8))
mapping clause encdec = LDA_Immediate(imm)
  <-> 0b10101001 @ imm
mapping clause assembly = LDA_Immediate(imm)
  <-> "LDA" ^ spc() ^ "#" ^ hex_bits_8(imm)

// LDA zp: Load Accumulator
union clause instruction = LDA_ZeroPage : (bits(8))
mapping clause encdec = LDA_ZeroPage(zp)
  <-> 0b10100101 @ zp
mapping clause assembly = LDA_ZeroPage(zp)
  <-> "LDA" ^ spc() ^ hex_bits_8(zp)

// LDA zp,X: Load Accumulator
union clause instruction = LDA_ZeroPageX : (bits(8))
mapping clause encdec = LDA_ZeroPageX(zp)
  <-> 0b10110101 @ zp
mapping clause assembly = LDA_ZeroPageX(zp)
  <-> "LDA" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// LDA addr: Load Accumulator
union clause instruction = LDA_Absolute : (bits(16))
mapping clause encdec = LDA_Absolute(addr)
  <-> 0b10101101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDA_Absolute(addr)
  <-> "LDA" ^ spc() ^ hex_bits_16(addr)

// LDA addr,X: Load Accumulator
union clause instruction = LDA_AbsoluteX : (bits(16))
mapping clause encdec = LDA_AbsoluteX(addr)
  <-> 0b10111101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDA_AbsoluteX(addr)
  <-> "LDA" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// LDA addr,Y: Load Accumulator
union clause instruction = LDA_AbsoluteY : (bits(16))
mapping clause encdec = LDA_AbsoluteY(addr)
  <-> 0b10111001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDA_AbsoluteY(addr)
  <-> "LDA" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// LDA (zp,X): Load Accumulator
union clause instruction = LDA_IndexedIndirect : (bits(8))
mapping clause encdec = LDA_IndexedIndirect(zp)
  <-> 0b10100001 @ zp
mapping clause assembly = LDA_IndexedIndirect(zp)
  <-> "LDA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// LDA (zp),Y: Load Accumulator
union clause instruction = LDA_IndirectIndexed : (bits(8))
mapping clause encdec = LDA_IndirectIndexed(zp)
  <-> 0b10110001 @ zp
mapping clause assembly = LDA_IndirectIndexed(zp)
  <-> "LDA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// LDX #imm: Load X
union clause instruction = LDX_Immediate : (bits(8))
mapping clause encdec = LDX_Immediate(imm)
  <-> 0b10100010 @ imm
mapping clause assembly = LDX_Immediate(imm)
  <-> "LDX" ^ spc() ^ "#" ^ hex_bits_8(imm)

// LDX zp: Load X
union clause instruction = LDX_ZeroPage : (bits(8))
mapping clause encdec = LDX_ZeroPage(zp)
  <-> 0b10100110 @ zp
mapping clause assembly = LDX_ZeroPage(zp)
  <-> "LDX" ^ spc() ^ hex_bits_8(zp)

// LDX zp,Y: Load X
union clause instruction = LDX_ZeroPageY : (bits(8))
mapping clause encdec = LDX_ZeroPageY(zp)
  <-> 0b10110110 @ zp
mapping clause assembly = LDX_ZeroPageY(zp)
  <-> "LDX" ^ spc() ^ hex_bits_8(zp) ^ ",Y"

// LDX addr: Load X
union clause instruction = LDX_Absolute : (bits(16))
mapping clause encdec = LDX_Absolute(addr)
  <-> 0b10101110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDX_Absolute(addr)
  <-> "LDX" ^ spc() ^ hex_bits_16(addr)

// LDX addr,Y: Load X
union clause instruction = LDX_AbsoluteY : (bits(16))
mapping clause encdec = LDX_AbsoluteY(addr)
  <-> 0b10111110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDX_AbsoluteY(addr)
  <-> "LDX" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// LDY #imm: Load Y
union clause instruction = LDY_Immediate : (bits(8))
mapping clause encdec = LDY_Immediate(imm)
  <-> 0b10100000 @ imm
mapping clause assembly = LDY_Immediate(imm)
  <-> "LDY" ^ spc() ^ "#" ^ hex_bits_8(imm)

// LDY zp: Load Y
union clause instruction = LDY_ZeroPage : (bits(8))
mapping clause encdec = LDY_ZeroPage(zp)
  <-> 0b10100100 @ zp
mapping clause assembly = LDY_ZeroPage(zp)
  <-> "LDY" ^ spc() ^ hex_bits_8(zp)

// LDY zp,X: Load Y
union clause instruction = LDY_ZeroPageX : (bits(8))
mapping clause encdec = LDY_ZeroPageX(zp)
  <-> 0b10110100 @ zp
mapping clause assembly = LDY_ZeroPageX(zp)
  <-> "LDY" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// LDY addr: Load Y
union clause instruction = LDY_Absolute : (bits(16))
mapping clause encdec = LDY_Absolute(addr)
  <-> 0b10101100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDY_Absolute(addr)
  <-> "LDY" ^ spc() ^ hex_bits_16(addr)

// LDY addr,X: Load Y
union clause instruction = LDY_AbsoluteX : (bits(16))
mapping clause encdec = LDY_AbsoluteX(addr)
  <-> 0b10111100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LDY_AbsoluteX(addr)
  <-> "LDY" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// STA zp: Store Accumulator
union clause instruction = STA_ZeroPage : (bits(8))
mapping clause encdec = STA_ZeroPage(zp)
  <-> 0b10000101 @ zp
mapping clause assembly = STA_ZeroPage(zp)
  <-> "STA" ^ spc() ^ hex_bits_8(zp)

// STA zp,X: Store Accumulator
union clause instruction = STA_ZeroPageX : (bits(8))
mapping clause encdec = STA_ZeroPageX(zp)
  <-> 0b10010101 @ zp
mapping clause assembly = STA_ZeroPageX(zp)
  <-> "STA" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// STA addr: Store Accumulator
union clause instruction = STA_Absolute : (bits(16))
mapping clause encdec = STA_Absolute(addr)
  <-> 0b10001101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STA_Absolute(addr)
  <-> "STA" ^ spc() ^ hex_bits_16(addr)

// STA addr,X: Store Accumulator
union clause instruction = STA_AbsoluteX : (bits(16))
mapping clause encdec = STA_AbsoluteX(addr)
  <-> 0b10011101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STA_AbsoluteX(addr)
  <-> "STA" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// STA addr,Y: Store Accumulator
union clause instruction = STA_AbsoluteY : (bits(16))
mapping clause encdec = STA_AbsoluteY(addr)
  <-> 0b10011001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STA_AbsoluteY(addr)
  <-> "STA" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// STA (zp,X): Store Accumulator
union clause instruction = STA_IndexedIndirect : (bits(8))
mapping clause encdec = STA_IndexedIndirect(zp)
  <-> 0b10000001 @ zp
mapping clause assembly = STA_IndexedIndirect(zp)
  <-> "STA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// STA (zp),Y: Store Accumulator
union clause instruction = STA_IndirectIndexed : (bits(8))
mapping clause encdec = STA_IndirectIndexed(zp)
  <-> 0b10010001 @ zp
mapping clause assembly = STA_IndirectIndexed(zp)
  <-> "STA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// STX zp: Store X
union clause instruction = STX_ZeroPage : (bits(8))
mapping clause encdec = STX_ZeroPage(zp)
  <-> 0b10000110 @ zp
mapping clause assembly = STX_ZeroPage(zp)
  <-> "STX" ^ spc() ^ hex_bits_8(zp)

// STX zp,Y: Store X
union clause instruction = STX_ZeroPageY : (bits(8))
mapping clause encdec = STX_ZeroPageY(zp)
  <-> 0b10010110 @ zp
mapping clause assembly = STX_ZeroPageY(zp)
  <-> "STX" ^ spc() ^ hex_bits_8(zp) ^ ",Y"

// STX addr: Store X
union clause instruction = STX_Absolute : (bits(16))
mapping clause encdec = STX_Absolute(addr)
  <-> 0b10001110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STX_Absolute(addr)
  <-> "STX" ^ spc() ^ hex_bits_16(addr)

// STY zp: Store Y
union clause instruction = STY_ZeroPage : (bits(8))
mapping clause encdec = STY_ZeroPage(zp)
  <-> 0b10000100 @ zp
mapping clause assembly = STY_ZeroPage(zp)
  <-> "STY" ^ spc() ^ hex_bits_8(zp)

// STY zp,X: Store Y
union clause instruction = STY_ZeroPageX : (bits(8))
mapping clause encdec = STY_ZeroPageX(zp)
  <-> 0b10010100 @ zp
mapping clause assembly = STY_ZeroPageX(zp)
  <-> "STY" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// STY addr: Store Y
union clause instruction = STY_Absolute : (bits(16))
mapping clause encdec = STY_Absolute(addr)
  <-> 0b10001100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = STY_Absolute(addr)
  <-> "STY" ^ spc() ^ hex_bits_16(addr)

// TAX: Transfer A to X
union clause instruction = TAX_Implied : unit
mapping clause encdec = TAX_Implied()
  <-> 0b10101010
mapping clause assembly = TAX_Implied()
  <-> "TAX"

// TAY: Transfer A to Y
union clause instruction = TAY_Implied : unit
mapping clause encdec = TAY_Implied()
  <-> 0b10101000
mapping clause assembly = TAY_Implied()
  <-> "TAY"

// TXA: Transfer X to A
union clause instruction = TXA_Implied : unit
mapping clause encdec = TXA_Implied()
  <-> 0b10001010
mapping clause assembly = TXA_Implied()
  <-> "TXA"

// TYA: Transfer Y to A
union clause instruction = TYA_Implied : unit
mapping clause encdec = TYA_Implied()
  <-> 0b10011000
mapping clause assembly = TYA_Implied()
  <-> "TYA"

// TSX: Transfer SP to X
union clause instruction = TSX_Implied : unit
mapping clause encdec = TSX_Implied()
  <-> 0b10111010
mapping clause assembly = TSX_Implied()
  <-> "TSX"

// TXS: Transfer X to SP
union clause instruction = TXS_Implied : unit
mapping clause encdec = TXS_Implied()
  <-> 0b10011010
mapping clause assembly = TXS_Implied()
  <-> "TXS"

// PHA: Push Accumulator
union clause instruction = PHA_Implied : unit
mapping clause encdec = PHA_Implied()
  <-> 0b01001000
mapping clause assembly = PHA_Implied()
  <-> "PHA"

// PHP: Push Processor Status
union clause instruction = PHP_Implied : unit
mapping clause encdec = PHP_Implied()
  <-> 0b00001000
mapping clause assembly = PHP_Implied()
  <-> "PHP"

// PLA: Pull Accumulator
union clause instruction = PLA_Implied : unit
mapping clause encdec = PLA_Implied()
  <-> 0b01101000
mapping clause assembly = PLA_Implied()
  <-> "PLA"

// PLP: Pull Processor Status
union clause instruction = PLP_Implied : unit
mapping clause encdec = PLP_Implied()
  <-> 0b00101000
mapping clause assembly = PLP_Implied()
  <-> "PLP"

// ADC #imm: Add with Carry
union clause instruction = ADC_Immediate : (bits(8))
mapping clause encdec = ADC_Immediate(imm)
  <-> 0b01101001 @ imm
mapping clause assembly = ADC_Immediate(imm)
  <-> "ADC" ^ spc() ^ "#" ^ hex_bits_8(imm)

// ADC zp: Add with Carry
union clause instruction = ADC_ZeroPage : (bits(8))
mapping clause encdec = ADC_ZeroPage(zp)
  <-> 0b01100101 @ zp
mapping clause assembly = ADC_ZeroPage(zp)
  <-> "ADC" ^ spc() ^ hex_bits_8(zp)

// ADC zp,X: Add with Carry
union clause instruction = ADC_ZeroPageX : (bits(8))
mapping clause encdec = ADC_ZeroPageX(zp)
  <-> 0b01110101 @ zp
mapping clause assembly = ADC_ZeroPageX(zp)
  <-> "ADC" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// ADC addr: Add with Carry
union clause instruction = ADC_Absolute : (bits(16))
mapping clause encdec = ADC_Absolute(addr)
  <-> 0b01101101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ADC_Absolute(addr)
  <-> "ADC" ^ spc() ^ hex_bits_16(addr)

// ADC addr,X: Add with Carry
union clause instruction = ADC_AbsoluteX : (bits(16))
mapping clause encdec = ADC_AbsoluteX(addr)
  <-> 0b01111101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ADC_AbsoluteX(addr)
  <-> "ADC" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// ADC addr,Y: Add with Carry
union clause instruction = ADC_AbsoluteY : (bits(16))
mapping clause encdec = ADC_AbsoluteY(addr)
  <-> 0b01111001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ADC_AbsoluteY(addr)
  <-> "ADC" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// ADC (zp,X): Add with Carry
union clause instruction = ADC_IndexedIndirect : (bits(8))
mapping clause encdec = ADC_IndexedIndirect(zp)
  <-> 0b01100001 @ zp
mapping clause assembly = ADC_IndexedIndirect(zp)
  <-> "ADC" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// ADC (zp),Y: Add with Carry
union clause instruction = ADC_IndirectIndexed : (bits(8))
mapping clause encdec = ADC_IndirectIndexed(zp)
  <-> 0b01110001 @ zp
mapping clause assembly = ADC_IndirectIndexed(zp)
  <-> "ADC" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// SBC #imm: Subtract with Borrow
union clause instruction = SBC_Immediate : (bits(8))
mapping clause encdec = SBC_Immediate(imm)
  <-> 0b11101001 @ imm
mapping clause assembly = SBC_Immediate(imm)
  <-> "SBC" ^ spc() ^ "#" ^ hex_bits_8(imm)

// SBC zp: Subtract with Borrow
union clause instruction = SBC_ZeroPage : (bits(8))
mapping clause encdec = SBC_ZeroPage(zp)
  <-> 0b11100101 @ zp
mapping clause assembly = SBC_ZeroPage(zp)
  <-> "SBC" ^ spc() ^ hex_bits_8(zp)

// SBC zp,X: Subtract with Borrow
union clause instruction = SBC_ZeroPageX : (bits(8))
mapping clause encdec = SBC_ZeroPageX(zp)
  <-> 0b11110101 @ zp
mapping clause assembly = SBC_ZeroPageX(zp)
  <-> "SBC" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// SBC addr: Subtract with Borrow
union clause instruction = SBC_Absolute : (bits(16))
mapping clause encdec = SBC_Absolute(addr)
  <-> 0b11101101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = SBC_Absolute(addr)
  <-> "SBC" ^ spc() ^ hex_bits_16(addr)

// SBC addr,X: Subtract with Borrow
union clause instruction = SBC_AbsoluteX : (bits(16))
mapping clause encdec = SBC_AbsoluteX(addr)
  <-> 0b11111101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = SBC_AbsoluteX(addr)
  <-> "SBC" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// SBC addr,Y: Subtract with Borrow
union clause instruction = SBC_AbsoluteY : (bits(16))
mapping clause encdec = SBC_AbsoluteY(addr)
  <-> 0b11111001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = SBC_AbsoluteY(addr)
  <-> "SBC" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// SBC (zp,X): Subtract with Borrow
union clause instruction = SBC_IndexedIndirect : (bits(8))
mapping clause encdec = SBC_IndexedIndirect(zp)
  <-> 0b11100001 @ zp
mapping clause assembly = SBC_IndexedIndirect(zp)
  <-> "SBC" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// SBC (zp),Y: Subtract with Borrow
union clause instruction = SBC_IndirectIndexed : (bits(8))
mapping clause encdec = SBC_IndirectIndexed(zp)
  <-> 0b11110001 @ zp
mapping clause assembly = SBC_IndirectIndexed(zp)
  <-> "SBC" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// AND #imm: Bitwise And
union clause instruction = AND_Immediate : (bits(8))
mapping clause encdec = AND_Immediate(imm)
  <-> 0b00101001 @ imm
mapping clause assembly = AND_Immediate(imm)
  <-> "AND" ^ spc() ^ "#" ^ hex_bits_8(imm)

// AND zp: Bitwise And
union clause instruction = AND_ZeroPage : (bits(8))
mapping clause encdec = AND_ZeroPage(zp)
  <-> 0b00100101 @ zp
mapping clause assembly = AND_ZeroPage(zp)
  <-> "AND" ^ spc() ^ hex_bits_8(zp)

// AND zp,X: Bitwise And
union clause instruction = AND_ZeroPageX : (bits(8))
mapping clause encdec = AND_ZeroPageX(zp)
  <-> 0b00110101 @ zp
mapping clause assembly = AND_ZeroPageX(zp)
  <-> "AND" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// AND addr: Bitwise And
union clause instruction = AND_Absolute : (bits(16))
mapping clause encdec = AND_Absolute(addr)
  <-> 0b00101101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = AND_Absolute(addr)
  <-> "AND" ^ spc() ^ hex_bits_16(addr)

// AND addr,X: Bitwise And
union clause instruction = AND_AbsoluteX : (bits(16))
mapping clause encdec = AND_AbsoluteX(addr)
  <-> 0b00111101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = AND_AbsoluteX(addr)
  <-> "AND" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// AND addr,Y: Bitwise And
union clause instruction = AND_AbsoluteY : (bits(16))
mapping clause encdec = AND_AbsoluteY(addr)
  <-> 0b00111001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = AND_AbsoluteY(addr)
  <-> "AND" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// AND (zp,X): Bitwise And
union clause instruction = AND_IndexedIndirect : (bits(8))
mapping clause encdec = AND_IndexedIndirect(zp)
  <-> 0b00100001 @ zp
mapping clause assembly = AND_IndexedIndirect(zp)
  <-> "AND" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// AND (zp),Y: Bitwise And
union clause instruction = AND_IndirectIndexed : (bits(8))
mapping clause encdec = AND_IndirectIndexed(zp)
  <-> 0b00110001 @ zp
mapping clause assembly = AND_IndirectIndexed(zp)
  <-> "AND" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// ORA #imm: Bitwise Or
union clause instruction = ORA_Immediate : (bits(8))
mapping clause encdec = ORA_Immediate(imm)
  <-> 0b00001001 @ imm
mapping clause assembly = ORA_Immediate(imm)
  <-> "ORA" ^ spc() ^ "#" ^ hex_bits_8(imm)

// ORA zp: Bitwise Or
union clause instruction = ORA_ZeroPage : (bits(8))
mapping clause encdec = ORA_ZeroPage(zp)
  <-> 0b00000101 @ zp
mapping clause assembly = ORA_ZeroPage(zp)
  <-> "ORA" ^ spc() ^ hex_bits_8(zp)

// ORA zp,X: Bitwise Or
union clause instruction = ORA_ZeroPageX : (bits(8))
mapping clause encdec = ORA_ZeroPageX(zp)
  <-> 0b00010101 @ zp
mapping clause assembly = ORA_ZeroPageX(zp)
  <-> "ORA" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// ORA addr: Bitwise Or
union clause instruction = ORA_Absolute : (bits(16))
mapping clause encdec = ORA_Absolute(addr)
  <-> 0b00001101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ORA_Absolute(addr)
  <-> "ORA" ^ spc() ^ hex_bits_16(addr)

// ORA addr,X: Bitwise Or
union clause instruction = ORA_AbsoluteX : (bits(16))
mapping clause encdec = ORA_AbsoluteX(addr)
  <-> 0b00011101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ORA_AbsoluteX(addr)
  <-> "ORA" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// ORA addr,Y: Bitwise Or
union clause instruction = ORA_AbsoluteY : (bits(16))
mapping clause encdec = ORA_AbsoluteY(addr)
  <-> 0b00011001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ORA_AbsoluteY(addr)
  <-> "ORA" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// ORA (zp,X): Bitwise Or
union clause instruction = ORA_IndexedIndirect : (bits(8))
mapping clause encdec = ORA_IndexedIndirect(zp)
  <-> 0b00000001 @ zp
mapping clause assembly = ORA_IndexedIndirect(zp)
  <-> "ORA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// ORA (zp),Y: Bitwise Or
union clause instruction = ORA_IndirectIndexed : (bits(8))
mapping clause encdec = ORA_IndirectIndexed(zp)
  <-> 0b00010001 @ zp
mapping clause assembly = ORA_IndirectIndexed(zp)
  <-> "ORA" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// EOR #imm: Bitwise Exclusive Or
union clause instruction = EOR_Immediate : (bits(8))
mapping clause encdec = EOR_Immediate(imm)
  <-> 0b01001001 @ imm
mapping clause assembly = EOR_Immediate(imm)
  <-> "EOR" ^ spc() ^ "#" ^ hex_bits_8(imm)

// EOR zp: Bitwise Exclusive Or
union clause instruction = EOR_ZeroPage : (bits(8))
mapping clause encdec = EOR_ZeroPage(zp)
  <-> 0b01000101 @ zp
mapping clause assembly = EOR_ZeroPage(zp)
  <-> "EOR" ^ spc() ^ hex_bits_8(zp)

// EOR zp,X: Bitwise Exclusive Or
union clause instruction = EOR_ZeroPageX : (bits(8))
mapping clause encdec = EOR_ZeroPageX(zp)
  <-> 0b01010101 @ zp
mapping clause assembly = EOR_ZeroPageX(zp)
  <-> "EOR" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// EOR addr: Bitwise Exclusive Or
union clause instruction = EOR_Absolute : (bits(16))
mapping clause encdec = EOR_Absolute(addr)
  <-> 0b01001101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = EOR_Absolute(addr)
  <-> "EOR" ^ spc() ^ hex_bits_16(addr)

// EOR addr,X: Bitwise Exclusive Or
union clause instruction = EOR_AbsoluteX : (bits(16))
mapping clause encdec = EOR_AbsoluteX(addr)
  <-> 0b01011101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = EOR_AbsoluteX(addr)
  <-> "EOR" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// EOR addr,Y: Bitwise Exclusive Or
union clause instruction = EOR_AbsoluteY : (bits(16))
mapping clause encdec = EOR_AbsoluteY(addr)
  <-> 0b01011001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = EOR_AbsoluteY(addr)
  <-> "EOR" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// EOR (zp,X): Bitwise Exclusive Or
union clause instruction = EOR_IndexedIndirect : (bits(8))
mapping clause encdec = EOR_IndexedIndirect(zp)
  <-> 0b01000001 @ zp
mapping clause assembly = EOR_IndexedIndirect(zp)
  <-> "EOR" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// EOR (zp),Y: Bitwise Exclusive Or
union clause instruction = EOR_IndirectIndexed : (bits(8))
mapping clause encdec = EOR_IndirectIndexed(zp)
  <-> 0b01010001 @ zp
mapping clause assembly = EOR_IndirectIndexed(zp)
  <-> "EOR" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// BIT zp: Bit Test
union clause instruction = BIT_ZeroPage : (bits(8))
mapping clause encdec = BIT_ZeroPage(zp)
  <-> 0b00100100 @ zp
mapping clause assembly = BIT_ZeroPage(zp)
  <-> "BIT" ^ spc() ^ hex_bits_8(zp)

// BIT addr: Bit Test
union clause instruction = BIT_Absolute : (bits(16))
mapping clause encdec = BIT_Absolute(addr)
  <-> 0b00101100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = BIT_Absolute(addr)
  <-> "BIT" ^ spc() ^ hex_bits_16(addr)

// ASL A: Arithmetic Shift Left
union clause instruction = ASL_Accumulator : unit
mapping clause encdec = ASL_Accumulator()
  <-> 0b00001010
mapping clause assembly = ASL_Accumulator()
  <-> "ASL" ^ spc() ^ "A"

// ASL zp: Arithmetic Shift Left
union clause instruction = ASL_ZeroPage : (bits(8))
mapping clause encdec = ASL_ZeroPage(zp)
  <-> 0b00000110 @ zp
mapping clause assembly = ASL_ZeroPage(zp)
  <-> "ASL" ^ spc() ^ hex_bits_8(zp)

// ASL zp,X: Arithmetic Shift Left
union clause instruction = ASL_ZeroPageX : (bits(8))
mapping clause encdec = ASL_ZeroPageX(zp)
  <-> 0b00010110 @ zp
mapping clause assembly = ASL_ZeroPageX(zp)
  <-> "ASL" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// ASL addr: Arithmetic Shift Left
union clause instruction = ASL_Absolute : (bits(16))
mapping clause encdec = ASL_Absolute(addr)
  <-> 0b00001110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ASL_Absolute(addr)
  <-> "ASL" ^ spc() ^ hex_bits_16(addr)

// ASL addr,X: Arithmetic Shift Left
union clause instruction = ASL_AbsoluteX : (bits(16))
mapping clause encdec = ASL_AbsoluteX(addr)
  <-> 0b00011110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ASL_AbsoluteX(addr)
  <-> "ASL" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// LSR A: Logical Shift Right
union clause instruction = LSR_Accumulator : unit
mapping clause encdec = LSR_Accumulator()
  <-> 0b01001010
mapping clause assembly = LSR_Accumulator()
  <-> "LSR" ^ spc() ^ "A"

// LSR zp: Logical Shift Right
union clause instruction = LSR_ZeroPage : (bits(8))
mapping clause encdec = LSR_ZeroPage(zp)
  <-> 0b01000110 @ zp
mapping clause assembly = LSR_ZeroPage(zp)
  <-> "LSR" ^ spc() ^ hex_bits_8(zp)

// LSR zp,X: Logical Shift Right
union clause instruction = LSR_ZeroPageX : (bits(8))
mapping clause encdec = LSR_ZeroPageX(zp)
  <-> 0b01010110 @ zp
mapping clause assembly = LSR_ZeroPageX(zp)
  <-> "LSR" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// LSR addr: Logical Shift Right
union clause instruction = LSR_Absolute : (bits(16))
mapping clause encdec = LSR_Absolute(addr)
  <-> 0b01001110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LSR_Absolute(addr)
  <-> "LSR" ^ spc() ^ hex_bits_16(addr)

// LSR addr,X: Logical Shift Right
union clause instruction = LSR_AbsoluteX : (bits(16))
mapping clause encdec = LSR_AbsoluteX(addr)
  <-> 0b01011110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = LSR_AbsoluteX(addr)
  <-> "LSR" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// ROL A: Rotate Left through Carry
union clause instruction = ROL_Accumulator : unit
mapping clause encdec = ROL_Accumulator()
  <-> 0b00101010
mapping clause assembly = ROL_Accumulator()
  <-> "ROL" ^ spc() ^ "A"

// ROL zp: Rotate Left through Carry
union clause instruction = ROL_ZeroPage : (bits(8))
mapping clause encdec = ROL_ZeroPage(zp)
  <-> 0b00100110 @ zp
mapping clause assembly = ROL_ZeroPage(zp)
  <-> "ROL" ^ spc() ^ hex_bits_8(zp)

// ROL zp,X: Rotate Left through Carry
union clause instruction = ROL_ZeroPageX : (bits(8))
mapping clause encdec = ROL_ZeroPageX(zp)
  <-> 0b00110110 @ zp
mapping clause assembly = ROL_ZeroPageX(zp)
  <-> "ROL" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// ROL addr: Rotate Left through Carry
union clause instruction = ROL_Absolute : (bits(16))
mapping clause encdec = ROL_Absolute(addr)
  <-> 0b00101110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ROL_Absolute(addr)
  <-> "ROL" ^ spc() ^ hex_bits_16(addr)

// ROL addr,X: Rotate Left through Carry
union clause instruction = ROL_AbsoluteX : (bits(16))
mapping clause encdec = ROL_AbsoluteX(addr)
  <-> 0b00111110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ROL_AbsoluteX(addr)
  <-> "ROL" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// ROR A: Rotate Right through Carry
union clause instruction = ROR_Accumulator : unit
mapping clause encdec = ROR_Accumulator()
  <-> 0b01101010
mapping clause assembly = ROR_Accumulator()
  <-> "ROR" ^ spc() ^ "A"

// ROR zp: Rotate Right through Carry
union clause instruction = ROR_ZeroPage : (bits(8))
mapping clause encdec = ROR_ZeroPage(zp)
  <-> 0b01100110 @ zp
mapping clause assembly = ROR_ZeroPage(zp)
  <-> "ROR" ^ spc() ^ hex_bits_8(zp)

// ROR zp,X: Rotate Right through Carry
union clause instruction = ROR_ZeroPageX : (bits(8))
mapping clause encdec = ROR_ZeroPageX(zp)
  <-> 0b01110110 @ zp
mapping clause assembly = ROR_ZeroPageX(zp)
  <-> "ROR" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// ROR addr: Rotate Right through Carry
union clause instruction = ROR_Absolute : (bits(16))
mapping clause encdec = ROR_Absolute(addr)
  <-> 0b01101110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ROR_Absolute(addr)
  <-> "ROR" ^ spc() ^ hex_bits_16(addr)

// ROR addr,X: Rotate Right through Carry
union clause instruction = ROR_AbsoluteX : (bits(16))
mapping clause encdec = ROR_AbsoluteX(addr)
  <-> 0b01111110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = ROR_AbsoluteX(addr)
  <-> "ROR" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// CMP #imm: Compare Accumulator
union clause instruction = CMP_Immediate : (bits(8))
mapping clause encdec = CMP_Immediate(imm)
  <-> 0b11001001 @ imm
mapping clause assembly = CMP_Immediate(imm)
  <-> "CMP" ^ spc() ^ "#" ^ hex_bits_8(imm)

// CMP zp: Compare Accumulator
union clause instruction = CMP_ZeroPage : (bits(8))
mapping clause encdec = CMP_ZeroPage(zp)
  <-> 0b11000101 @ zp
mapping clause assembly = CMP_ZeroPage(zp)
  <-> "CMP" ^ spc() ^ hex_bits_8(zp)

// CMP zp,X: Compare Accumulator
union clause instruction = CMP_ZeroPageX : (bits(8))
mapping clause encdec = CMP_ZeroPageX(zp)
  <-> 0b11010101 @ zp
mapping clause assembly = CMP_ZeroPageX(zp)
  <-> "CMP" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// CMP addr: Compare Accumulator
union clause instruction = CMP_Absolute : (bits(16))
mapping clause encdec = CMP_Absolute(addr)
  <-> 0b11001101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CMP_Absolute(addr)
  <-> "CMP" ^ spc() ^ hex_bits_16(addr)

// CMP addr,X: Compare Accumulator
union clause instruction = CMP_AbsoluteX : (bits(16))
mapping clause encdec = CMP_AbsoluteX(addr)
  <-> 0b11011101 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CMP_AbsoluteX(addr)
  <-> "CMP" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// CMP addr,Y: Compare Accumulator
union clause instruction = CMP_AbsoluteY : (bits(16))
mapping clause encdec = CMP_AbsoluteY(addr)
  <-> 0b11011001 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CMP_AbsoluteY(addr)
  <-> "CMP" ^ spc() ^ hex_bits_16(addr) ^ ",Y"

// CMP (zp,X): Compare Accumulator
union clause instruction = CMP_IndexedIndirect : (bits(8))
mapping clause encdec = CMP_IndexedIndirect(zp)
  <-> 0b11000001 @ zp
mapping clause assembly = CMP_IndexedIndirect(zp)
  <-> "CMP" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ ",X)"

// CMP (zp),Y: Compare Accumulator
union clause instruction = CMP_IndirectIndexed : (bits(8))
mapping clause encdec = CMP_IndirectIndexed(zp)
  <-> 0b11010001 @ zp
mapping clause assembly = CMP_IndirectIndexed(zp)
  <-> "CMP" ^ spc() ^ "(" ^ hex_bits_8(zp) ^ "),Y"

// CPX #imm: Compare X
union clause instruction = CPX_Immediate : (bits(8))
mapping clause encdec = CPX_Immediate(imm)
  <-> 0b11100000 @ imm
mapping clause assembly = CPX_Immediate(imm)
  <-> "CPX" ^ spc() ^ "#" ^ hex_bits_8(imm)

// CPX zp: Compare X
union clause instruction = CPX_ZeroPage : (bits(8))
mapping clause encdec = CPX_ZeroPage(zp)
  <-> 0b11100100 @ zp
mapping clause assembly = CPX_ZeroPage(zp)
  <-> "CPX" ^ spc() ^ hex_bits_8(zp)

// CPX addr: Compare X
union clause instruction = CPX_Absolute : (bits(16))
mapping clause encdec = CPX_Absolute(addr)
  <-> 0b11101100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CPX_Absolute(addr)
  <-> "CPX" ^ spc() ^ hex_bits_16(addr)

// CPY #imm: Compare Y
union clause instruction = CPY_Immediate : (bits(8))
mapping clause encdec = CPY_Immediate(imm)
  <-> 0b11000000 @ imm
mapping clause assembly = CPY_Immediate(imm)
  <-> "CPY" ^ spc() ^ "#" ^ hex_bits_8(imm)

// CPY zp: Compare Y
union clause instruction = CPY_ZeroPage : (bits(8))
mapping clause encdec = CPY_ZeroPage(zp)
  <-> 0b11000100 @ zp
mapping clause assembly = CPY_ZeroPage(zp)
  <-> "CPY" ^ spc() ^ hex_bits_8(zp)

// CPY addr: Compare Y
union clause instruction = CPY_Absolute : (bits(16))
mapping clause encdec = CPY_Absolute(addr)
  <-> 0b11001100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = CPY_Absolute(addr)
  <-> "CPY" ^ spc() ^ hex_bits_16(addr)

// INC zp: Increment Memory
union clause instruction = INC_ZeroPage : (bits(8))
mapping clause encdec = INC_ZeroPage(zp)
  <-> 0b11100110 @ zp
mapping clause assembly = INC_ZeroPage(zp)
  <-> "INC" ^ spc() ^ hex_bits_8(zp)

// INC zp,X: Increment Memory
union clause instruction = INC_ZeroPageX : (bits(8))
mapping clause encdec = INC_ZeroPageX(zp)
  <-> 0b11110110 @ zp
mapping clause assembly = INC_ZeroPageX(zp)
  <-> "INC" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// INC addr: Increment Memory
union clause instruction = INC_Absolute : (bits(16))
mapping clause encdec = INC_Absolute(addr)
  <-> 0b11101110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = INC_Absolute(addr)
  <-> "INC" ^ spc() ^ hex_bits_16(addr)

// INC addr,X: Increment Memory
union clause instruction = INC_AbsoluteX : (bits(16))
mapping clause encdec = INC_AbsoluteX(addr)
  <-> 0b11111110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = INC_AbsoluteX(addr)
  <-> "INC" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// DEC zp: Decrement Memory
union clause instruction = DEC_ZeroPage : (bits(8))
mapping clause encdec = DEC_ZeroPage(zp)
  <-> 0b11000110 @ zp
mapping clause assembly = DEC_ZeroPage(zp)
  <-> "DEC" ^ spc() ^ hex_bits_8(zp)

// DEC zp,X: Decrement Memory
union clause instruction = DEC_ZeroPageX : (bits(8))
mapping clause encdec = DEC_ZeroPageX(zp)
  <-> 0b11010110 @ zp
mapping clause assembly = DEC_ZeroPageX(zp)
  <-> "DEC" ^ spc() ^ hex_bits_8(zp) ^ ",X"

// DEC addr: Decrement Memory
union clause instruction = DEC_Absolute : (bits(16))
mapping clause encdec = DEC_Absolute(addr)
  <-> 0b11001110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = DEC_Absolute(addr)
  <-> "DEC" ^ spc() ^ hex_bits_16(addr)

// DEC addr,X: Decrement Memory
union clause instruction = DEC_AbsoluteX : (bits(16))
mapping clause encdec = DEC_AbsoluteX(addr)
  <-> 0b11011110 @ addr[7..0] @ addr[15..8]
mapping clause assembly = DEC_AbsoluteX(addr)
  <-> "DEC" ^ spc() ^ hex_bits_16(addr) ^ ",X"

// INX: Increment X
union clause instruction = INX_Implied : unit
mapping clause encdec = INX_Implied()
  <-> 0b11101000
mapping clause assembly = INX_Implied()
  <-> "INX"

// INY: Increment Y
union clause instruction = INY_Implied : unit
mapping clause encdec = INY_Implied()
  <-> 0b11001000
mapping clause assembly = INY_Implied()
  <-> "INY"

// DEX: Decrement X
union clause instruction = DEX_Implied : unit
mapping clause encdec = DEX_Implied()
  <-> 0b11001010
mapping clause assembly = DEX_Implied()
  <-> "DEX"

// DEY: Decrement Y
union clause instruction = DEY_Implied : unit
mapping clause encdec = DEY_Implied()
  <-> 0b10001000
mapping clause assembly = DEY_Implied()
  <-> "DEY"

// JMP addr: Jump
union clause instruction = JMP_Absolute : (bits(16))
mapping clause encdec = JMP_Absolute(addr)
  <-> 0b01001100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JMP_Absolute(addr)
  <-> "JMP" ^ spc() ^ hex_bits_16(addr)

// JMP (addr): Jump
union clause instruction = JMP_Indirect16 : (bits(16))
mapping clause encdec = JMP_Indirect16(addr)
  <-> 0b01101100 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JMP_Indirect16(addr)
  <-> "JMP" ^ spc() ^ "(" ^ hex_bits_16(addr) ^ ")"

// JSR addr: Jump to Subroutine
union clause instruction = JSR_Absolute : (bits(16))
mapping clause encdec = JSR_Absolute(addr)
  <-> 0b00100000 @ addr[7..0] @ addr[15..8]
mapping clause assembly = JSR_Absolute(addr)
  <-> "JSR" ^ spc() ^ hex_bits_16(addr)

// RTS: Return from Subroutine
union clause instruction = RTS_Implied : unit
mapping clause encdec = RTS_Implied()
  <-> 0b01100000
mapping clause assembly = RTS_Implied()
  <-> "RTS"

// RTI: Return from Interrupt
union clause instruction = RTI_Implied : unit
mapping clause encdec = RTI_Implied()
  <-> 0b01000000
mapping clause assembly = RTI_Implied()
  <-> "RTI"

// BPL rel: Branch on Plus
union clause instruction = BPL_Relative : (bits(8))
mapping clause encdec = BPL_Relative(rel)
  <-> 0b00010000 @ rel
mapping clause assembly = BPL_Relative(rel)
  <-> "BPL" ^ spc() ^ hex_bits_signed_8(rel)

// BMI rel: Branch on Minus
union clause instruction = BMI_Relative : (bits(8))
mapping clause encdec = BMI_Relative(rel)
  <-> 0b00110000 @ rel
mapping clause assembly = BMI_Relative(rel)
  <-> "BMI" ^ spc() ^ hex_bits_signed_8(rel)

// BVC rel: Branch on Overflow Clear
union clause instruction = BVC_Relative : (bits(8))
mapping clause encdec = BVC_Relative(rel)
  <-> 0b01010000 @ rel
mapping clause assembly = BVC_Relative(rel)
  <-> "BVC" ^ spc() ^ hex_bits_signed_8(rel)

// BVS rel: Branch on Overflow Set
union clause instruction = BVS_Relative : (bits(8))
mapping clause encdec = BVS_Relative(rel)
  <-> 0b01110000 @ rel
mapping clause assembly = BVS_Relative(rel)
  <-> "BVS" ^ spc() ^ hex_bits_signed_8(rel)

// BCC rel: Branch on Carry Clear
union clause instruction = BCC_Relative : (bits(8))
mapping clause encdec = BCC_Relative(rel)
  <-> 0b10010000 @ rel
mapping clause assembly = BCC_Relative(rel)
  <-> "BCC" ^ spc() ^ hex_bits_signed_8(rel)

// BCS rel: Branch on Carry Set
union clause instruction = BCS_Relative : (bits(8))
mapping clause encdec = BCS_Relative(rel)
  <-> 0b10110000 @ rel
mapping clause assembly = BCS_Relative(rel)
  <-> "BCS" ^ spc() ^ hex_bits_signed_8(rel)

// BNE rel: Branch on Not Equal
union clause instruction = BNE_Relative : (bits(8))
mapping clause encdec = BNE_Relative(rel)
  <-> 0b11010000 @ rel
mapping clause assembly = BNE_Relative(rel)
  <-> "BNE" ^ spc() ^ hex_bits_signed_8(rel)

// BEQ rel: Branch on Equal
union clause instruction = BEQ_Relative : (bits(8))
mapping clause encdec = BEQ_Relative(rel)
  <-> 0b11110000 @ rel
mapping clause assembly = BEQ_Relative(rel)
  <-> "BEQ" ^ spc() ^ hex_bits_signed_8(rel)

// CLC: Clear Carry
union clause instruction = CLC_Implied : unit
mapping clause encdec = CLC_Implied()
  <-> 0b00011000
mapping clause assembly = CLC_Implied()
  <-> "CLC"

// SEC: Set Carry
union clause instruction = SEC_Implied : unit
mapping clause encdec = SEC_Implied()
  <-> 0b00111000
mapping clause assembly = SEC_Implied()
  <-> "SEC"

// CLI: Clear Interrupt Disable
union clause instruction = CLI_Implied : unit
mapping clause encdec = CLI_Implied()
  <-> 0b01011000
mapping clause assembly = CLI_Implied()
  <-> "CLI"

// SEI: Set Interrupt Disable
union clause instruction = SEI_Implied : unit
mapping clause encdec = SEI_Implied()
  <-> 0b01111000
mapping clause assembly = SEI_Implied()
  <-> "SEI"

// CLV: Clear Overflow
union clause instruction = CLV_Implied : unit
mapping clause encdec = CLV_Implied()
  <-> 0b10111000
mapping clause assembly = CLV_Implied()
  <-> "CLV"

// CLD: Clear Decimal Mode
union clause instruction = CLD_Implied : unit
mapping clause encdec = CLD_Implied()
  <-> 0b11011000
mapping clause assembly = CLD_Implied()
  <-> "CLD"

// SED: Set Decimal Mode
union clause instruction = SED_Implied : unit
mapping clause encdec = SED_Implied()
  <-> 0b11111000
mapping clause assembly = SED_Implied()
  <-> "SED"

// NOP: No Operation
union clause instruction = NOP_Implied : unit
mapping clause encdec = NOP_Implied()
  <-> 0b11101010
mapping clause assembly = NOP_Implied()
  <-> "NOP"

// BRK: Break
union clause instruction = BRK_Implied : unit
mapping clause encdec = BRK_Implied()
  <-> 0b00000000
mapping clause assembly = BRK_Implied()
  <-> "BRK"

end instruction
