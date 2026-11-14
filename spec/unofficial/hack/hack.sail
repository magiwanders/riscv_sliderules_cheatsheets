// The Hack computer of nand2tetris (Nisan and Schocken, The Elements of Computing Systems): its machine language.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from
// chapter 4 of the book (the A- and C-instruction tables). nand2tetris publishes no Sail or TableGen description.
// Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model, not checked by the Sail compiler. A C-instruction is written
// dest=comp;jump: comp, with its a bit, is the enum below; dest and jump are fields.

mapping dest_name : bits(3) <-> string = {
  0b000 <-> "null",
  0b001 <-> "M",
  0b010 <-> "D",
  0b011 <-> "MD",
  0b100 <-> "A",
  0b101 <-> "AM",
  0b110 <-> "AD",
  0b111 <-> "AMD",
}

mapping jump_name : bits(3) <-> string = {
  0b000 <-> "null",
  0b001 <-> "JGT",
  0b010 <-> "JEQ",
  0b011 <-> "JGE",
  0b100 <-> "JLT",
  0b101 <-> "JNE",
  0b110 <-> "JLE",
  0b111 <-> "JMP",
}

scattered union instruction

// @value: load the A register
union clause instruction = A_INSTR : bits(15)
mapping clause encdec = A_INSTR(imm)
  <-> 0b0 @ imm
mapping clause assembly = A_INSTR(imm)
  <-> "@" ^ dec_bits_15(imm)

enum comp = { C_0, C_1, C_MINUS_1, C_D, C_A, C_NOT_D, C_NOT_A, C_MINUS_D, C_MINUS_A, C_D_PLUS_1, C_A_PLUS_1, C_D_MINUS_1, C_A_MINUS_1, C_D_PLUS_A, C_D_MINUS_A, C_A_MINUS_D, C_D_AND_A, C_D_OR_A, C_M, C_NOT_M, C_MINUS_M, C_M_PLUS_1, C_M_MINUS_1, C_D_PLUS_M, C_D_MINUS_M, C_M_MINUS_D, C_D_AND_M, C_D_OR_M }

union clause instruction = C_INSTR : (comp, bits(3), bits(3))

// 0: Zero
mapping clause encdec = C_INSTR(C_0, dest, jump)
  <-> 0b111 @ 0b0 @ 0b101010 @ dest @ jump
mapping clause assembly = C_INSTR(C_0, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "0" ^ ";" ^ jump_name(jump)

// 1: One
mapping clause encdec = C_INSTR(C_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b111111 @ dest @ jump
mapping clause assembly = C_INSTR(C_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "1" ^ ";" ^ jump_name(jump)

// -1: Minus One
mapping clause encdec = C_INSTR(C_MINUS_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b111010 @ dest @ jump
mapping clause assembly = C_INSTR(C_MINUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "-1" ^ ";" ^ jump_name(jump)

// D: D
mapping clause encdec = C_INSTR(C_D, dest, jump)
  <-> 0b111 @ 0b0 @ 0b001100 @ dest @ jump
mapping clause assembly = C_INSTR(C_D, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D" ^ ";" ^ jump_name(jump)

// A: A
mapping clause encdec = C_INSTR(C_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b110000 @ dest @ jump
mapping clause assembly = C_INSTR(C_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "A" ^ ";" ^ jump_name(jump)

// !D: Not D
mapping clause encdec = C_INSTR(C_NOT_D, dest, jump)
  <-> 0b111 @ 0b0 @ 0b001101 @ dest @ jump
mapping clause assembly = C_INSTR(C_NOT_D, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "!D" ^ ";" ^ jump_name(jump)

// !A: Not A
mapping clause encdec = C_INSTR(C_NOT_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b110001 @ dest @ jump
mapping clause assembly = C_INSTR(C_NOT_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "!A" ^ ";" ^ jump_name(jump)

// -D: Negate D
mapping clause encdec = C_INSTR(C_MINUS_D, dest, jump)
  <-> 0b111 @ 0b0 @ 0b001111 @ dest @ jump
mapping clause assembly = C_INSTR(C_MINUS_D, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "-D" ^ ";" ^ jump_name(jump)

// -A: Negate A
mapping clause encdec = C_INSTR(C_MINUS_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b110011 @ dest @ jump
mapping clause assembly = C_INSTR(C_MINUS_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "-A" ^ ";" ^ jump_name(jump)

// D+1: Increment D
mapping clause encdec = C_INSTR(C_D_PLUS_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b011111 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_PLUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D+1" ^ ";" ^ jump_name(jump)

// A+1: Increment A
mapping clause encdec = C_INSTR(C_A_PLUS_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b110111 @ dest @ jump
mapping clause assembly = C_INSTR(C_A_PLUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "A+1" ^ ";" ^ jump_name(jump)

// D-1: Decrement D
mapping clause encdec = C_INSTR(C_D_MINUS_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b001110 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_MINUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D-1" ^ ";" ^ jump_name(jump)

// A-1: Decrement A
mapping clause encdec = C_INSTR(C_A_MINUS_1, dest, jump)
  <-> 0b111 @ 0b0 @ 0b110010 @ dest @ jump
mapping clause assembly = C_INSTR(C_A_MINUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "A-1" ^ ";" ^ jump_name(jump)

// D+A: Add
mapping clause encdec = C_INSTR(C_D_PLUS_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b000010 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_PLUS_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D+A" ^ ";" ^ jump_name(jump)

// D-A: Subtract A from D
mapping clause encdec = C_INSTR(C_D_MINUS_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b010011 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_MINUS_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D-A" ^ ";" ^ jump_name(jump)

// A-D: Subtract D from A
mapping clause encdec = C_INSTR(C_A_MINUS_D, dest, jump)
  <-> 0b111 @ 0b0 @ 0b000111 @ dest @ jump
mapping clause assembly = C_INSTR(C_A_MINUS_D, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "A-D" ^ ";" ^ jump_name(jump)

// D&A: Bitwise And
mapping clause encdec = C_INSTR(C_D_AND_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b000000 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_AND_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D&A" ^ ";" ^ jump_name(jump)

// D|A: Bitwise Or
mapping clause encdec = C_INSTR(C_D_OR_A, dest, jump)
  <-> 0b111 @ 0b0 @ 0b010101 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_OR_A, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D|A" ^ ";" ^ jump_name(jump)

// M: M
mapping clause encdec = C_INSTR(C_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b110000 @ dest @ jump
mapping clause assembly = C_INSTR(C_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "M" ^ ";" ^ jump_name(jump)

// !M: Not M
mapping clause encdec = C_INSTR(C_NOT_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b110001 @ dest @ jump
mapping clause assembly = C_INSTR(C_NOT_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "!M" ^ ";" ^ jump_name(jump)

// -M: Negate M
mapping clause encdec = C_INSTR(C_MINUS_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b110011 @ dest @ jump
mapping clause assembly = C_INSTR(C_MINUS_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "-M" ^ ";" ^ jump_name(jump)

// M+1: Increment M
mapping clause encdec = C_INSTR(C_M_PLUS_1, dest, jump)
  <-> 0b111 @ 0b1 @ 0b110111 @ dest @ jump
mapping clause assembly = C_INSTR(C_M_PLUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "M+1" ^ ";" ^ jump_name(jump)

// M-1: Decrement M
mapping clause encdec = C_INSTR(C_M_MINUS_1, dest, jump)
  <-> 0b111 @ 0b1 @ 0b110010 @ dest @ jump
mapping clause assembly = C_INSTR(C_M_MINUS_1, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "M-1" ^ ";" ^ jump_name(jump)

// D+M: Add
mapping clause encdec = C_INSTR(C_D_PLUS_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b000010 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_PLUS_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D+M" ^ ";" ^ jump_name(jump)

// D-M: Subtract M from D
mapping clause encdec = C_INSTR(C_D_MINUS_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b010011 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_MINUS_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D-M" ^ ";" ^ jump_name(jump)

// M-D: Subtract D from M
mapping clause encdec = C_INSTR(C_M_MINUS_D, dest, jump)
  <-> 0b111 @ 0b1 @ 0b000111 @ dest @ jump
mapping clause assembly = C_INSTR(C_M_MINUS_D, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "M-D" ^ ";" ^ jump_name(jump)

// D&M: Bitwise And
mapping clause encdec = C_INSTR(C_D_AND_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b000000 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_AND_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D&M" ^ ";" ^ jump_name(jump)

// D|M: Bitwise Or
mapping clause encdec = C_INSTR(C_D_OR_M, dest, jump)
  <-> 0b111 @ 0b1 @ 0b010101 @ dest @ jump
mapping clause assembly = C_INSTR(C_D_OR_M, dest, jump)
  <-> dest_name(dest) ^ "=" ^ "D|M" ^ ";" ^ jump_name(jump)

end instruction
