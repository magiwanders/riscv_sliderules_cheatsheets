// Zilog Z80 (documented instructions): encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// opcode tables of Zilog's Z80 CPU User Manual (UM0080). Neither Zilog, the Sail project nor LLVM publish a Z80
// description; this one is checked by assembling every instruction with skoolkit and sjasmplus (npm test).
// Licensed CC BY-SA 4.0 like the sheets.
//
// llvm-tblgen reads it (with LLVM's include directory) like a target's description: one record per instruction, its
// encoding in Inst with LLVM's byte order (the first byte in memory is Inst{7-0}), its assembly in AsmString.

include "llvm/Target/Target.td"

def Z80InstrInfo : InstrInfo;
def Z80 : Target { let InstructionSet = Z80InstrInfo; }

// Operand fields (named as in the manual) and immediates
def r_op : Operand<i8>; // B C D E H L (HL) A
def r2_op : Operand<i8>; // B C D E H L (HL) A
def dd_op : Operand<i8>; // BC DE HL SP
def ss_op : Operand<i8>; // BC DE HL SP
def qq_op : Operand<i8>; // BC DE HL AF
def pp_op : Operand<i8>; // BC DE IX SP
def rr_op : Operand<i8>; // BC DE IY SP
def cc_op : Operand<i8>; // NZ Z NC C PO PE P M
def jc_op : Operand<i8>; // NZ Z NC C
def b_op : Operand<i8>; // 0 1 2 3 4 5 6 7
def t_op : Operand<i8>; // $00 $08 $10 $18 $20 $28 $30 $38
def i_op : Operand<i8>; // IX IY
def d_op : Operand<i8>;
def imm8 : Operand<i8>;
def imm16 : Operand<i16>;
def pcrel8 : Operand<i8>; // offset from the next instruction

class Z80Inst<int size, dag ins, string asm> : Instruction {
  let Namespace = "Z80";
  let DecoderNamespace = "Z80";
  let Size = size;
  let OutOperandList = (outs);
  let InOperandList = ins;
  let AsmString = asm;
  field bits<32> Inst;
  field bits<32> SoftFail = 0;
}

def LD_r_r2 : Z80Inst<1, (ins r_op:$r, r2_op:$r2), "LD\t$r, $r2"> { // Load Register
  bits<3> r;
  bits<3> r2;
  let Inst{7-6} = 0b01;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = r2{2-0};
}
def LD_r_n : Z80Inst<2, (ins r_op:$r, imm8:$n), "LD\t$r, $n"> { // Load Immediate
  bits<3> r;
  bits<8> n;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b110;
  let Inst{15-8} = n{7-0};
}
def LD_r_mHL : Z80Inst<1, (ins r_op:$r), "LD\t$r, (HL)"> { // Load from Memory
  bits<3> r;
  let Inst{7-6} = 0b01;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b110;
}
def LD_mHL_r2 : Z80Inst<1, (ins r2_op:$r2), "LD\t(HL), $r2"> { // Store to Memory
  bits<3> r2;
  let Inst{7-3} = 0b01110;
  let Inst{2-0} = r2{2-0};
}
def LD_mHL_n : Z80Inst<2, (ins imm8:$n), "LD\t(HL), $n"> { // Store Immediate
  bits<8> n;
  let Inst{7-0} = 0b00110110;
  let Inst{15-8} = n{7-0};
}
def LD_A_mBC : Z80Inst<1, (ins), "LD\tA, (BC)"> { // Load A
  let Inst{7-0} = 0b00001010;
}
def LD_A_mDE : Z80Inst<1, (ins), "LD\tA, (DE)"> { // Load A
  let Inst{7-0} = 0b00011010;
}
def LD_mBC_A : Z80Inst<1, (ins), "LD\t(BC), A"> { // Store A
  let Inst{7-0} = 0b00000010;
}
def LD_mDE_A : Z80Inst<1, (ins), "LD\t(DE), A"> { // Store A
  let Inst{7-0} = 0b00010010;
}
def LD_A_mnn : Z80Inst<3, (ins imm16:$nn), "LD\tA, ($nn)"> { // Load A
  bits<16> nn;
  let Inst{7-0} = 0b00111010;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def LD_mnn_A : Z80Inst<3, (ins imm16:$nn), "LD\t($nn), A"> { // Store A
  bits<16> nn;
  let Inst{7-0} = 0b00110010;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def LD_r_mid : Z80Inst<3, (ins i_op:$i, r_op:$r, d_op:$d), "LD\t$r, ($i$d)"> { // Load Indexed
  bits<1> i;
  bits<3> r;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-14} = 0b01;
  let Inst{13-11} = r{2-0};
  let Inst{10-8} = 0b110;
  let Inst{23-16} = d{7-0};
}
def LD_mid_r2 : Z80Inst<3, (ins i_op:$i, r2_op:$r2, d_op:$d), "LD\t($i$d), $r2"> { // Store Indexed
  bits<1> i;
  bits<3> r2;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-11} = 0b01110;
  let Inst{10-8} = r2{2-0};
  let Inst{23-16} = d{7-0};
}
def LD_mid_n : Z80Inst<4, (ins i_op:$i, d_op:$d, imm8:$n), "LD\t($i$d), $n"> { // Store Immediate Indexed
  bits<1> i;
  bits<8> d;
  bits<8> n;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00110110;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = n{7-0};
}
def LD_A_I : Z80Inst<2, (ins), "LD\tA, I"> { // Load Interrupt Vector
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01010111;
}
def LD_A_R : Z80Inst<2, (ins), "LD\tA, R"> { // Load Refresh Register
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01011111;
}
def LD_I_A : Z80Inst<2, (ins), "LD\tI, A"> { // Set Interrupt Vector
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01000111;
}
def LD_R_A : Z80Inst<2, (ins), "LD\tR, A"> { // Set Refresh Register
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01001111;
}
def LD_dd_nn : Z80Inst<3, (ins dd_op:$dd, imm16:$nn), "LD\t$dd, $nn"> { // Load Immediate
  bits<2> dd;
  bits<16> nn;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = dd{1-0};
  let Inst{3-0} = 0b0001;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def LD_HL_mnn : Z80Inst<3, (ins imm16:$nn), "LD\tHL, ($nn)"> { // Load HL
  bits<16> nn;
  let Inst{7-0} = 0b00101010;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def LD_mnn_HL : Z80Inst<3, (ins imm16:$nn), "LD\t($nn), HL"> { // Store HL
  bits<16> nn;
  let Inst{7-0} = 0b00100010;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def LD_dd_mnn : Z80Inst<4, (ins dd_op:$dd, imm16:$nn), "LD\t$dd, ($nn)"> { // Load Pair
  bits<2> dd;
  bits<16> nn;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-12} = dd{1-0};
  let Inst{11-8} = 0b1011;
  let Inst{23-16} = nn{7-0};
  let Inst{31-24} = nn{15-8};
}
def LD_mnn_dd : Z80Inst<4, (ins dd_op:$dd, imm16:$nn), "LD\t($nn), $dd"> { // Store Pair
  bits<2> dd;
  bits<16> nn;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-12} = dd{1-0};
  let Inst{11-8} = 0b0011;
  let Inst{23-16} = nn{7-0};
  let Inst{31-24} = nn{15-8};
}
def LD_i_nn : Z80Inst<4, (ins i_op:$i, imm16:$nn), "LD\t$i, $nn"> { // Load Immediate
  bits<1> i;
  bits<16> nn;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00100001;
  let Inst{23-16} = nn{7-0};
  let Inst{31-24} = nn{15-8};
}
def LD_i_mnn : Z80Inst<4, (ins i_op:$i, imm16:$nn), "LD\t$i, ($nn)"> { // Load Index
  bits<1> i;
  bits<16> nn;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00101010;
  let Inst{23-16} = nn{7-0};
  let Inst{31-24} = nn{15-8};
}
def LD_mnn_i : Z80Inst<4, (ins i_op:$i, imm16:$nn), "LD\t($nn), $i"> { // Store Index
  bits<1> i;
  bits<16> nn;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00100010;
  let Inst{23-16} = nn{7-0};
  let Inst{31-24} = nn{15-8};
}
def LD_SP_HL : Z80Inst<1, (ins), "LD\tSP, HL"> { // Load Stack Pointer
  let Inst{7-0} = 0b11111001;
}
def LD_SP_i : Z80Inst<2, (ins i_op:$i), "LD\tSP, $i"> { // Load Stack Pointer
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11111001;
}
def PUSH_qq : Z80Inst<1, (ins qq_op:$qq), "PUSH\t$qq"> { // Push Pair
  bits<2> qq;
  let Inst{7-6} = 0b11;
  let Inst{5-4} = qq{1-0};
  let Inst{3-0} = 0b0101;
}
def POP_qq : Z80Inst<1, (ins qq_op:$qq), "POP\t$qq"> { // Pop Pair
  bits<2> qq;
  let Inst{7-6} = 0b11;
  let Inst{5-4} = qq{1-0};
  let Inst{3-0} = 0b0001;
}
def PUSH_i : Z80Inst<2, (ins i_op:$i), "PUSH\t$i"> { // Push Index
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11100101;
}
def POP_i : Z80Inst<2, (ins i_op:$i), "POP\t$i"> { // Pop Index
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11100001;
}
def EX_DE_HL : Z80Inst<1, (ins), "EX\tDE, HL"> { // Exchange DE and HL
  let Inst{7-0} = 0b11101011;
}
def EX_AF_AFx : Z80Inst<1, (ins), "EX\tAF, AF'"> { // Exchange with Shadow AF
  let Inst{7-0} = 0b00001000;
}
def EXX : Z80Inst<1, (ins), "EXX"> { // Exchange Pairs with Shadows
  let Inst{7-0} = 0b11011001;
}
def EX_mSP_HL : Z80Inst<1, (ins), "EX\t(SP), HL"> { // Exchange with Stack Top
  let Inst{7-0} = 0b11100011;
}
def EX_mSP_i : Z80Inst<2, (ins i_op:$i), "EX\t(SP), $i"> { // Exchange with Stack Top
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11100011;
}
def LDI : Z80Inst<2, (ins), "LDI"> { // Load and Increment
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10100000;
}
def LDIR : Z80Inst<2, (ins), "LDIR"> { // Load, Increment, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10110000;
}
def LDD : Z80Inst<2, (ins), "LDD"> { // Load and Decrement
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10101000;
}
def LDDR : Z80Inst<2, (ins), "LDDR"> { // Load, Decrement, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10111000;
}
def CPI : Z80Inst<2, (ins), "CPI"> { // Compare and Increment
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10100001;
}
def CPIR : Z80Inst<2, (ins), "CPIR"> { // Compare, Increment, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10110001;
}
def CPD : Z80Inst<2, (ins), "CPD"> { // Compare and Decrement
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10101001;
}
def CPDR : Z80Inst<2, (ins), "CPDR"> { // Compare, Decrement, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10111001;
}
def INI : Z80Inst<2, (ins), "INI"> { // Input and Increment
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10100010;
}
def INIR : Z80Inst<2, (ins), "INIR"> { // Input, Increment, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10110010;
}
def IND : Z80Inst<2, (ins), "IND"> { // Input and Decrement
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10101010;
}
def INDR : Z80Inst<2, (ins), "INDR"> { // Input, Decrement, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10111010;
}
def OUTI : Z80Inst<2, (ins), "OUTI"> { // Output and Increment
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10100011;
}
def OTIR : Z80Inst<2, (ins), "OTIR"> { // Output, Increment, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10110011;
}
def OUTD : Z80Inst<2, (ins), "OUTD"> { // Output and Decrement
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10101011;
}
def OTDR : Z80Inst<2, (ins), "OTDR"> { // Output, Decrement, Repeat
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b10111011;
}
def ADD_A_r : Z80Inst<1, (ins r_op:$r), "ADD\tA, $r"> { // Add
  bits<3> r;
  let Inst{7-3} = 0b10000;
  let Inst{2-0} = r{2-0};
}
def ADD_A_mHL : Z80Inst<1, (ins), "ADD\tA, (HL)"> { // Add
  let Inst{7-0} = 0b10000110;
}
def ADD_A_n : Z80Inst<2, (ins imm8:$n), "ADD\tA, $n"> { // Add
  bits<8> n;
  let Inst{7-0} = 0b11000110;
  let Inst{15-8} = n{7-0};
}
def ADD_A_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "ADD\tA, ($i$d)"> { // Add
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10000110;
  let Inst{23-16} = d{7-0};
}
def ADC_A_r : Z80Inst<1, (ins r_op:$r), "ADC\tA, $r"> { // Add with Carry
  bits<3> r;
  let Inst{7-3} = 0b10001;
  let Inst{2-0} = r{2-0};
}
def ADC_A_mHL : Z80Inst<1, (ins), "ADC\tA, (HL)"> { // Add with Carry
  let Inst{7-0} = 0b10001110;
}
def ADC_A_n : Z80Inst<2, (ins imm8:$n), "ADC\tA, $n"> { // Add with Carry
  bits<8> n;
  let Inst{7-0} = 0b11001110;
  let Inst{15-8} = n{7-0};
}
def ADC_A_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "ADC\tA, ($i$d)"> { // Add with Carry
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10001110;
  let Inst{23-16} = d{7-0};
}
def SUB_r : Z80Inst<1, (ins r_op:$r), "SUB\t$r"> { // Subtract
  bits<3> r;
  let Inst{7-3} = 0b10010;
  let Inst{2-0} = r{2-0};
}
def SUB_mHL : Z80Inst<1, (ins), "SUB\t(HL)"> { // Subtract
  let Inst{7-0} = 0b10010110;
}
def SUB_n : Z80Inst<2, (ins imm8:$n), "SUB\t$n"> { // Subtract
  bits<8> n;
  let Inst{7-0} = 0b11010110;
  let Inst{15-8} = n{7-0};
}
def SUB_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "SUB\t($i$d)"> { // Subtract
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10010110;
  let Inst{23-16} = d{7-0};
}
def SBC_A_r : Z80Inst<1, (ins r_op:$r), "SBC\tA, $r"> { // Subtract with Carry
  bits<3> r;
  let Inst{7-3} = 0b10011;
  let Inst{2-0} = r{2-0};
}
def SBC_A_mHL : Z80Inst<1, (ins), "SBC\tA, (HL)"> { // Subtract with Carry
  let Inst{7-0} = 0b10011110;
}
def SBC_A_n : Z80Inst<2, (ins imm8:$n), "SBC\tA, $n"> { // Subtract with Carry
  bits<8> n;
  let Inst{7-0} = 0b11011110;
  let Inst{15-8} = n{7-0};
}
def SBC_A_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "SBC\tA, ($i$d)"> { // Subtract with Carry
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10011110;
  let Inst{23-16} = d{7-0};
}
def AND_r : Z80Inst<1, (ins r_op:$r), "AND\t$r"> { // Bitwise And
  bits<3> r;
  let Inst{7-3} = 0b10100;
  let Inst{2-0} = r{2-0};
}
def AND_mHL : Z80Inst<1, (ins), "AND\t(HL)"> { // Bitwise And
  let Inst{7-0} = 0b10100110;
}
def AND_n : Z80Inst<2, (ins imm8:$n), "AND\t$n"> { // Bitwise And
  bits<8> n;
  let Inst{7-0} = 0b11100110;
  let Inst{15-8} = n{7-0};
}
def AND_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "AND\t($i$d)"> { // Bitwise And
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10100110;
  let Inst{23-16} = d{7-0};
}
def XOR_r : Z80Inst<1, (ins r_op:$r), "XOR\t$r"> { // Bitwise Exclusive Or
  bits<3> r;
  let Inst{7-3} = 0b10101;
  let Inst{2-0} = r{2-0};
}
def XOR_mHL : Z80Inst<1, (ins), "XOR\t(HL)"> { // Bitwise Exclusive Or
  let Inst{7-0} = 0b10101110;
}
def XOR_n : Z80Inst<2, (ins imm8:$n), "XOR\t$n"> { // Bitwise Exclusive Or
  bits<8> n;
  let Inst{7-0} = 0b11101110;
  let Inst{15-8} = n{7-0};
}
def XOR_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "XOR\t($i$d)"> { // Bitwise Exclusive Or
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10101110;
  let Inst{23-16} = d{7-0};
}
def OR_r : Z80Inst<1, (ins r_op:$r), "OR\t$r"> { // Bitwise Or
  bits<3> r;
  let Inst{7-3} = 0b10110;
  let Inst{2-0} = r{2-0};
}
def OR_mHL : Z80Inst<1, (ins), "OR\t(HL)"> { // Bitwise Or
  let Inst{7-0} = 0b10110110;
}
def OR_n : Z80Inst<2, (ins imm8:$n), "OR\t$n"> { // Bitwise Or
  bits<8> n;
  let Inst{7-0} = 0b11110110;
  let Inst{15-8} = n{7-0};
}
def OR_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "OR\t($i$d)"> { // Bitwise Or
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10110110;
  let Inst{23-16} = d{7-0};
}
def CP_r : Z80Inst<1, (ins r_op:$r), "CP\t$r"> { // Compare
  bits<3> r;
  let Inst{7-3} = 0b10111;
  let Inst{2-0} = r{2-0};
}
def CP_mHL : Z80Inst<1, (ins), "CP\t(HL)"> { // Compare
  let Inst{7-0} = 0b10111110;
}
def CP_n : Z80Inst<2, (ins imm8:$n), "CP\t$n"> { // Compare
  bits<8> n;
  let Inst{7-0} = 0b11111110;
  let Inst{15-8} = n{7-0};
}
def CP_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "CP\t($i$d)"> { // Compare
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b10111110;
  let Inst{23-16} = d{7-0};
}
def INC_r : Z80Inst<1, (ins r_op:$r), "INC\t$r"> { // Increment
  bits<3> r;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b100;
}
def INC_mHL : Z80Inst<1, (ins), "INC\t(HL)"> { // Increment
  let Inst{7-0} = 0b00110100;
}
def INC_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "INC\t($i$d)"> { // Increment
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00110100;
  let Inst{23-16} = d{7-0};
}
def DEC_r : Z80Inst<1, (ins r_op:$r), "DEC\t$r"> { // Decrement
  bits<3> r;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b101;
}
def DEC_mHL : Z80Inst<1, (ins), "DEC\t(HL)"> { // Decrement
  let Inst{7-0} = 0b00110101;
}
def DEC_mid : Z80Inst<3, (ins i_op:$i, d_op:$d), "DEC\t($i$d)"> { // Decrement
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00110101;
  let Inst{23-16} = d{7-0};
}
def ADD_HL_ss : Z80Inst<1, (ins ss_op:$ss), "ADD\tHL, $ss"> { // Add Pair
  bits<2> ss;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = ss{1-0};
  let Inst{3-0} = 0b1001;
}
def ADC_HL_ss : Z80Inst<2, (ins ss_op:$ss), "ADC\tHL, $ss"> { // Add Pair with Carry
  bits<2> ss;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-12} = ss{1-0};
  let Inst{11-8} = 0b1010;
}
def SBC_HL_ss : Z80Inst<2, (ins ss_op:$ss), "SBC\tHL, $ss"> { // Subtract Pair with Carry
  bits<2> ss;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-12} = ss{1-0};
  let Inst{11-8} = 0b0010;
}
def ADD_IX_pp : Z80Inst<2, (ins pp_op:$pp), "ADD\tIX, $pp"> { // Add to IX
  bits<2> pp;
  let Inst{7-0} = 0b11011101;
  let Inst{15-14} = 0b00;
  let Inst{13-12} = pp{1-0};
  let Inst{11-8} = 0b1001;
}
def ADD_IY_rr : Z80Inst<2, (ins rr_op:$rr), "ADD\tIY, $rr"> { // Add to IY
  bits<2> rr;
  let Inst{7-0} = 0b11111101;
  let Inst{15-14} = 0b00;
  let Inst{13-12} = rr{1-0};
  let Inst{11-8} = 0b1001;
}
def INC_ss : Z80Inst<1, (ins ss_op:$ss), "INC\t$ss"> { // Increment Pair
  bits<2> ss;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = ss{1-0};
  let Inst{3-0} = 0b0011;
}
def DEC_ss : Z80Inst<1, (ins ss_op:$ss), "DEC\t$ss"> { // Decrement Pair
  bits<2> ss;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = ss{1-0};
  let Inst{3-0} = 0b1011;
}
def INC_i : Z80Inst<2, (ins i_op:$i), "INC\t$i"> { // Increment Index
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00100011;
}
def DEC_i : Z80Inst<2, (ins i_op:$i), "DEC\t$i"> { // Decrement Index
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b00101011;
}
def RLCA : Z80Inst<1, (ins), "RLCA"> { // Rotate A Left Circular
  let Inst{7-0} = 0b00000111;
}
def RRCA : Z80Inst<1, (ins), "RRCA"> { // Rotate A Right Circular
  let Inst{7-0} = 0b00001111;
}
def RLA : Z80Inst<1, (ins), "RLA"> { // Rotate A Left through Carry
  let Inst{7-0} = 0b00010111;
}
def RRA : Z80Inst<1, (ins), "RRA"> { // Rotate A Right through Carry
  let Inst{7-0} = 0b00011111;
}
def RLC_r : Z80Inst<2, (ins r_op:$r), "RLC\t$r"> { // Rotate Left Circular
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00000;
  let Inst{10-8} = r{2-0};
}
def RLC_mHL : Z80Inst<2, (ins), "RLC\t(HL)"> { // Rotate Left Circular
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00000110;
}
def RLC_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "RLC\t($i$d)"> { // Rotate Left Circular
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00000110;
}
def RRC_r : Z80Inst<2, (ins r_op:$r), "RRC\t$r"> { // Rotate Right Circular
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00001;
  let Inst{10-8} = r{2-0};
}
def RRC_mHL : Z80Inst<2, (ins), "RRC\t(HL)"> { // Rotate Right Circular
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00001110;
}
def RRC_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "RRC\t($i$d)"> { // Rotate Right Circular
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00001110;
}
def RL_r : Z80Inst<2, (ins r_op:$r), "RL\t$r"> { // Rotate Left through Carry
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00010;
  let Inst{10-8} = r{2-0};
}
def RL_mHL : Z80Inst<2, (ins), "RL\t(HL)"> { // Rotate Left through Carry
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00010110;
}
def RL_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "RL\t($i$d)"> { // Rotate Left through Carry
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00010110;
}
def RR_r : Z80Inst<2, (ins r_op:$r), "RR\t$r"> { // Rotate Right through Carry
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00011;
  let Inst{10-8} = r{2-0};
}
def RR_mHL : Z80Inst<2, (ins), "RR\t(HL)"> { // Rotate Right through Carry
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00011110;
}
def RR_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "RR\t($i$d)"> { // Rotate Right through Carry
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00011110;
}
def SLA_r : Z80Inst<2, (ins r_op:$r), "SLA\t$r"> { // Shift Left Arithmetic
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00100;
  let Inst{10-8} = r{2-0};
}
def SLA_mHL : Z80Inst<2, (ins), "SLA\t(HL)"> { // Shift Left Arithmetic
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00100110;
}
def SLA_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "SLA\t($i$d)"> { // Shift Left Arithmetic
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00100110;
}
def SRA_r : Z80Inst<2, (ins r_op:$r), "SRA\t$r"> { // Shift Right Arithmetic
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00101;
  let Inst{10-8} = r{2-0};
}
def SRA_mHL : Z80Inst<2, (ins), "SRA\t(HL)"> { // Shift Right Arithmetic
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00101110;
}
def SRA_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "SRA\t($i$d)"> { // Shift Right Arithmetic
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00101110;
}
def SRL_r : Z80Inst<2, (ins r_op:$r), "SRL\t$r"> { // Shift Right Logical
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-11} = 0b00111;
  let Inst{10-8} = r{2-0};
}
def SRL_mHL : Z80Inst<2, (ins), "SRL\t(HL)"> { // Shift Right Logical
  let Inst{7-0} = 0b11001011;
  let Inst{15-8} = 0b00111110;
}
def SRL_mid : Z80Inst<4, (ins i_op:$i, d_op:$d), "SRL\t($i$d)"> { // Shift Right Logical
  bits<1> i;
  bits<8> d;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-24} = 0b00111110;
}
def RLD : Z80Inst<2, (ins), "RLD"> { // Rotate Digit Left
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01101111;
}
def RRD : Z80Inst<2, (ins), "RRD"> { // Rotate Digit Right
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01100111;
}
def BIT_b_r : Z80Inst<2, (ins b_op:$b, r_op:$r), "BIT\t$b, $r"> { // Test Bit
  bits<3> b;
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b01;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = r{2-0};
}
def BIT_b_mHL : Z80Inst<2, (ins b_op:$b), "BIT\t$b, (HL)"> { // Test Bit
  bits<3> b;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b01;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = 0b110;
}
def BIT_b_mid : Z80Inst<4, (ins i_op:$i, d_op:$d, b_op:$b), "BIT\t$b, ($i$d)"> { // Test Bit
  bits<1> i;
  bits<8> d;
  bits<3> b;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-30} = 0b01;
  let Inst{29-27} = b{2-0};
  let Inst{26-24} = 0b110;
}
def RES_b_r : Z80Inst<2, (ins b_op:$b, r_op:$r), "RES\t$b, $r"> { // Reset Bit
  bits<3> b;
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b10;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = r{2-0};
}
def RES_b_mHL : Z80Inst<2, (ins b_op:$b), "RES\t$b, (HL)"> { // Reset Bit
  bits<3> b;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b10;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = 0b110;
}
def RES_b_mid : Z80Inst<4, (ins i_op:$i, d_op:$d, b_op:$b), "RES\t$b, ($i$d)"> { // Reset Bit
  bits<1> i;
  bits<8> d;
  bits<3> b;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-30} = 0b10;
  let Inst{29-27} = b{2-0};
  let Inst{26-24} = 0b110;
}
def SET_b_r : Z80Inst<2, (ins b_op:$b, r_op:$r), "SET\t$b, $r"> { // Set Bit
  bits<3> b;
  bits<3> r;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b11;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = r{2-0};
}
def SET_b_mHL : Z80Inst<2, (ins b_op:$b), "SET\t$b, (HL)"> { // Set Bit
  bits<3> b;
  let Inst{7-0} = 0b11001011;
  let Inst{15-14} = 0b11;
  let Inst{13-11} = b{2-0};
  let Inst{10-8} = 0b110;
}
def SET_b_mid : Z80Inst<4, (ins i_op:$i, d_op:$d, b_op:$b), "SET\t$b, ($i$d)"> { // Set Bit
  bits<1> i;
  bits<8> d;
  bits<3> b;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11001011;
  let Inst{23-16} = d{7-0};
  let Inst{31-30} = 0b11;
  let Inst{29-27} = b{2-0};
  let Inst{26-24} = 0b110;
}
def JP_nn : Z80Inst<3, (ins imm16:$nn), "JP\t$nn"> { // Jump
  bits<16> nn;
  let Inst{7-0} = 0b11000011;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def JP_cc_nn : Z80Inst<3, (ins cc_op:$cc, imm16:$nn), "JP\t$cc, $nn"> { // Jump if
  bits<3> cc;
  bits<16> nn;
  let Inst{7-6} = 0b11;
  let Inst{5-3} = cc{2-0};
  let Inst{2-0} = 0b010;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def JR_e : Z80Inst<2, (ins pcrel8:$e), "JR\t$e"> { // Jump Relative
  bits<8> e;
  let Inst{7-0} = 0b00011000;
  let Inst{15-8} = e{7-0};
}
def JR_jc_e : Z80Inst<2, (ins jc_op:$jc, pcrel8:$e), "JR\t$jc, $e"> { // Jump Relative if
  bits<2> jc;
  bits<8> e;
  let Inst{7-5} = 0b001;
  let Inst{4-3} = jc{1-0};
  let Inst{2-0} = 0b000;
  let Inst{15-8} = e{7-0};
}
def DJNZ_e : Z80Inst<2, (ins pcrel8:$e), "DJNZ\t$e"> { // Decrement B, Jump if Not Zero
  bits<8> e;
  let Inst{7-0} = 0b00010000;
  let Inst{15-8} = e{7-0};
}
def JP_mHL : Z80Inst<1, (ins), "JP\t(HL)"> { // Jump to HL
  let Inst{7-0} = 0b11101001;
}
def JP_mi : Z80Inst<2, (ins i_op:$i), "JP\t($i)"> { // Jump to IX / IY
  bits<1> i;
  let Inst{7-6} = 0b11;
  let Inst{5} = i{0};
  let Inst{4-0} = 0b11101;
  let Inst{15-8} = 0b11101001;
}
def CALL_nn : Z80Inst<3, (ins imm16:$nn), "CALL\t$nn"> { // Call
  bits<16> nn;
  let Inst{7-0} = 0b11001101;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def CALL_cc_nn : Z80Inst<3, (ins cc_op:$cc, imm16:$nn), "CALL\t$cc, $nn"> { // Call if
  bits<3> cc;
  bits<16> nn;
  let Inst{7-6} = 0b11;
  let Inst{5-3} = cc{2-0};
  let Inst{2-0} = 0b100;
  let Inst{15-8} = nn{7-0};
  let Inst{23-16} = nn{15-8};
}
def RET : Z80Inst<1, (ins), "RET"> { // Return
  let Inst{7-0} = 0b11001001;
}
def RET_cc : Z80Inst<1, (ins cc_op:$cc), "RET\t$cc"> { // Return if
  bits<3> cc;
  let Inst{7-6} = 0b11;
  let Inst{5-3} = cc{2-0};
  let Inst{2-0} = 0b000;
}
def RST_t : Z80Inst<1, (ins t_op:$t), "RST\t$t"> { // Restart
  bits<3> t;
  let Inst{7-6} = 0b11;
  let Inst{5-3} = t{2-0};
  let Inst{2-0} = 0b111;
}
def RETI : Z80Inst<2, (ins), "RETI"> { // Return from Interrupt
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01001101;
}
def RETN : Z80Inst<2, (ins), "RETN"> { // Return from Non-Maskable Interrupt
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01000101;
}
def IN_A_mn : Z80Inst<2, (ins imm8:$n), "IN\tA, ($n)"> { // Input from Port
  bits<8> n;
  let Inst{7-0} = 0b11011011;
  let Inst{15-8} = n{7-0};
}
def OUT_mn_A : Z80Inst<2, (ins imm8:$n), "OUT\t($n), A"> { // Output to Port
  bits<8> n;
  let Inst{7-0} = 0b11010011;
  let Inst{15-8} = n{7-0};
}
def IN_r_mC : Z80Inst<2, (ins r_op:$r), "IN\t$r, (C)"> { // Input from Port C
  bits<3> r;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-11} = r{2-0};
  let Inst{10-8} = 0b000;
}
def OUT_mC_r2 : Z80Inst<2, (ins r2_op:$r2), "OUT\t(C), $r2"> { // Output to Port C
  bits<3> r2;
  let Inst{7-0} = 0b11101101;
  let Inst{15-14} = 0b01;
  let Inst{13-11} = r2{2-0};
  let Inst{10-8} = 0b001;
}
def NOP : Z80Inst<1, (ins), "NOP"> { // No Operation
  let Inst{7-0} = 0b00000000;
}
def HALT : Z80Inst<1, (ins), "HALT"> { // Halt
  let Inst{7-0} = 0b01110110;
}
def DI : Z80Inst<1, (ins), "DI"> { // Disable Interrupts
  let Inst{7-0} = 0b11110011;
}
def EI : Z80Inst<1, (ins), "EI"> { // Enable Interrupts
  let Inst{7-0} = 0b11111011;
}
def DAA : Z80Inst<1, (ins), "DAA"> { // Decimal Adjust Accumulator
  let Inst{7-0} = 0b00100111;
}
def CPL : Z80Inst<1, (ins), "CPL"> { // Complement Accumulator
  let Inst{7-0} = 0b00101111;
}
def CCF : Z80Inst<1, (ins), "CCF"> { // Complement Carry
  let Inst{7-0} = 0b00111111;
}
def SCF : Z80Inst<1, (ins), "SCF"> { // Set Carry
  let Inst{7-0} = 0b00110111;
}
def NEG : Z80Inst<2, (ins), "NEG"> { // Negate Accumulator
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01000100;
}
def IM_0 : Z80Inst<2, (ins), "IM\t0"> { // Interrupt Mode 0
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01000110;
}
def IM_1 : Z80Inst<2, (ins), "IM\t1"> { // Interrupt Mode 1
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01010110;
}
def IM_2 : Z80Inst<2, (ins), "IM\t2"> { // Interrupt Mode 2
  let Inst{7-0} = 0b11101101;
  let Inst{15-8} = 0b01011110;
}
