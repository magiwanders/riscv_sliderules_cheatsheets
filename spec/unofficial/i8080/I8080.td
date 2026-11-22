// Intel 8080: encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// instruction codes of Intel's 8080 Assembly Language Programming Manual. Neither Intel nor LLVM publish an 8080
// description; this one is checked by assembling every instruction with the Macro Assembler AS and ASxxxx's as8085
// (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// llvm-tblgen reads it (with LLVM's include directory) like a target's description: one record per instruction, its
// encoding in Inst with LLVM's byte order (the first byte in memory is Inst{7-0}), its assembly in AsmString.

include "llvm/Target/Target.td"

def I8080InstrInfo : InstrInfo;
def I8080 : Target { let InstructionSet = I8080InstrInfo; }

// Operand fields (named as in the manual) and immediates
def reg_op : Operand<i8>; // B C D E H L M A
def rp_op : Operand<i8>; // B D H SP
def rs_op : Operand<i8>; // B D H PSW
def rst_op : Operand<i8>; // 0 1 2 3 4 5 6 7
def imm8 : Operand<i8>;
def imm16 : Operand<i16>;

class I8080Inst<int size, dag ins, string asm> : Instruction {
  let Namespace = "I8080";
  let DecoderNamespace = "I8080";
  let Size = size;
  let OutOperandList = (outs);
  let InOperandList = ins;
  let AsmString = asm;
  field bits<24> Inst;
  field bits<24> SoftFail = 0;
}

def MOV_r1_r2 : I8080Inst<1, (ins reg_op:$r1, reg_op:$r2), "MOV	$r1,$r2"> {
  bits<3> r1;
  bits<3> r2;
  let Inst{7-6} = 0b01;
  let Inst{5-3} = r1{2-0};
  let Inst{2-0} = r2{2-0};
}
def MOV_r_M : I8080Inst<1, (ins reg_op:$r), "MOV	$r,M"> {
  bits<3> r;
  let Inst{7-6} = 0b01;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b110;
}
def MOV_M_r : I8080Inst<1, (ins reg_op:$r), "MOV	M,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b01110;
  let Inst{2-0} = r{2-0};
}
def MVI_r : I8080Inst<2, (ins reg_op:$r, imm8:$data), "MVI	$r,$data"> {
  bits<3> r;
  bits<8> data;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b110;
  let Inst{15-8} = data{7-0};
}
def MVI_M : I8080Inst<2, (ins imm8:$data), "MVI	M,$data"> {
  bits<8> data;
  let Inst{7-0} = 0b00110110;
  let Inst{15-8} = data{7-0};
}
def LXI : I8080Inst<3, (ins rp_op:$rp, imm16:$data16), "LXI	$rp,$data16"> {
  bits<2> rp;
  bits<16> data16;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = rp{1-0};
  let Inst{3-0} = 0b0001;
  let Inst{15-8} = data16{7-0};
  let Inst{23-16} = data16{15-8};
}
def LDA : I8080Inst<3, (ins imm16:$addr), "LDA	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b00111010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def STA : I8080Inst<3, (ins imm16:$addr), "STA	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b00110010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def LHLD : I8080Inst<3, (ins imm16:$addr), "LHLD	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b00101010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def SHLD : I8080Inst<3, (ins imm16:$addr), "SHLD	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b00100010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def LDAX_B : I8080Inst<1, (ins), "LDAX	B"> {
  let Inst{7-0} = 0b00001010;
}
def LDAX_D : I8080Inst<1, (ins), "LDAX	D"> {
  let Inst{7-0} = 0b00011010;
}
def STAX_B : I8080Inst<1, (ins), "STAX	B"> {
  let Inst{7-0} = 0b00000010;
}
def STAX_D : I8080Inst<1, (ins), "STAX	D"> {
  let Inst{7-0} = 0b00010010;
}
def XCHG : I8080Inst<1, (ins), "XCHG"> {
  let Inst{7-0} = 0b11101011;
}
def ADD_r : I8080Inst<1, (ins reg_op:$r), "ADD	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10000;
  let Inst{2-0} = r{2-0};
}
def ADD_M : I8080Inst<1, (ins), "ADD	M"> {
  let Inst{7-0} = 0b10000110;
}
def ADC_r : I8080Inst<1, (ins reg_op:$r), "ADC	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10001;
  let Inst{2-0} = r{2-0};
}
def ADC_M : I8080Inst<1, (ins), "ADC	M"> {
  let Inst{7-0} = 0b10001110;
}
def SUB_r : I8080Inst<1, (ins reg_op:$r), "SUB	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10010;
  let Inst{2-0} = r{2-0};
}
def SUB_M : I8080Inst<1, (ins), "SUB	M"> {
  let Inst{7-0} = 0b10010110;
}
def SBB_r : I8080Inst<1, (ins reg_op:$r), "SBB	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10011;
  let Inst{2-0} = r{2-0};
}
def SBB_M : I8080Inst<1, (ins), "SBB	M"> {
  let Inst{7-0} = 0b10011110;
}
def ANA_r : I8080Inst<1, (ins reg_op:$r), "ANA	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10100;
  let Inst{2-0} = r{2-0};
}
def ANA_M : I8080Inst<1, (ins), "ANA	M"> {
  let Inst{7-0} = 0b10100110;
}
def XRA_r : I8080Inst<1, (ins reg_op:$r), "XRA	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10101;
  let Inst{2-0} = r{2-0};
}
def XRA_M : I8080Inst<1, (ins), "XRA	M"> {
  let Inst{7-0} = 0b10101110;
}
def ORA_r : I8080Inst<1, (ins reg_op:$r), "ORA	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10110;
  let Inst{2-0} = r{2-0};
}
def ORA_M : I8080Inst<1, (ins), "ORA	M"> {
  let Inst{7-0} = 0b10110110;
}
def CMP_r : I8080Inst<1, (ins reg_op:$r), "CMP	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10111;
  let Inst{2-0} = r{2-0};
}
def CMP_M : I8080Inst<1, (ins), "CMP	M"> {
  let Inst{7-0} = 0b10111110;
}
def ADI : I8080Inst<2, (ins imm8:$data), "ADI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11000110;
  let Inst{15-8} = data{7-0};
}
def ACI : I8080Inst<2, (ins imm8:$data), "ACI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11001110;
  let Inst{15-8} = data{7-0};
}
def SUI : I8080Inst<2, (ins imm8:$data), "SUI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11010110;
  let Inst{15-8} = data{7-0};
}
def SBI : I8080Inst<2, (ins imm8:$data), "SBI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11011110;
  let Inst{15-8} = data{7-0};
}
def ANI : I8080Inst<2, (ins imm8:$data), "ANI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11100110;
  let Inst{15-8} = data{7-0};
}
def XRI : I8080Inst<2, (ins imm8:$data), "XRI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11101110;
  let Inst{15-8} = data{7-0};
}
def ORI : I8080Inst<2, (ins imm8:$data), "ORI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11110110;
  let Inst{15-8} = data{7-0};
}
def CPI : I8080Inst<2, (ins imm8:$data), "CPI	$data"> {
  bits<8> data;
  let Inst{7-0} = 0b11111110;
  let Inst{15-8} = data{7-0};
}
def INR_r : I8080Inst<1, (ins reg_op:$r), "INR	$r"> {
  bits<3> r;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b100;
}
def INR_M : I8080Inst<1, (ins), "INR	M"> {
  let Inst{7-0} = 0b00110100;
}
def DCR_r : I8080Inst<1, (ins reg_op:$r), "DCR	$r"> {
  bits<3> r;
  let Inst{7-6} = 0b00;
  let Inst{5-3} = r{2-0};
  let Inst{2-0} = 0b101;
}
def DCR_M : I8080Inst<1, (ins), "DCR	M"> {
  let Inst{7-0} = 0b00110101;
}
def INX : I8080Inst<1, (ins rp_op:$rp), "INX	$rp"> {
  bits<2> rp;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = rp{1-0};
  let Inst{3-0} = 0b0011;
}
def DCX : I8080Inst<1, (ins rp_op:$rp), "DCX	$rp"> {
  bits<2> rp;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = rp{1-0};
  let Inst{3-0} = 0b1011;
}
def DAD : I8080Inst<1, (ins rp_op:$rp), "DAD	$rp"> {
  bits<2> rp;
  let Inst{7-6} = 0b00;
  let Inst{5-4} = rp{1-0};
  let Inst{3-0} = 0b1001;
}
def DAA : I8080Inst<1, (ins), "DAA"> {
  let Inst{7-0} = 0b00100111;
}
def RLC : I8080Inst<1, (ins), "RLC"> {
  let Inst{7-0} = 0b00000111;
}
def RRC : I8080Inst<1, (ins), "RRC"> {
  let Inst{7-0} = 0b00001111;
}
def RAL : I8080Inst<1, (ins), "RAL"> {
  let Inst{7-0} = 0b00010111;
}
def RAR : I8080Inst<1, (ins), "RAR"> {
  let Inst{7-0} = 0b00011111;
}
def CMA : I8080Inst<1, (ins), "CMA"> {
  let Inst{7-0} = 0b00101111;
}
def CMC : I8080Inst<1, (ins), "CMC"> {
  let Inst{7-0} = 0b00111111;
}
def STC : I8080Inst<1, (ins), "STC"> {
  let Inst{7-0} = 0b00110111;
}
def JMP : I8080Inst<3, (ins imm16:$addr), "JMP	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11000011;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def JNZ : I8080Inst<3, (ins imm16:$addr), "JNZ	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11000010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CNZ : I8080Inst<3, (ins imm16:$addr), "CNZ	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11000100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RNZ : I8080Inst<1, (ins), "RNZ"> {
  let Inst{7-0} = 0b11000000;
}
def JZ : I8080Inst<3, (ins imm16:$addr), "JZ	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11001010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CZ : I8080Inst<3, (ins imm16:$addr), "CZ	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11001100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RZ : I8080Inst<1, (ins), "RZ"> {
  let Inst{7-0} = 0b11001000;
}
def JNC : I8080Inst<3, (ins imm16:$addr), "JNC	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11010010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CNC : I8080Inst<3, (ins imm16:$addr), "CNC	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11010100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RNC : I8080Inst<1, (ins), "RNC"> {
  let Inst{7-0} = 0b11010000;
}
def JC : I8080Inst<3, (ins imm16:$addr), "JC	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11011010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CC : I8080Inst<3, (ins imm16:$addr), "CC	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11011100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RC : I8080Inst<1, (ins), "RC"> {
  let Inst{7-0} = 0b11011000;
}
def JPO : I8080Inst<3, (ins imm16:$addr), "JPO	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11100010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CPO : I8080Inst<3, (ins imm16:$addr), "CPO	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11100100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RPO : I8080Inst<1, (ins), "RPO"> {
  let Inst{7-0} = 0b11100000;
}
def JPE : I8080Inst<3, (ins imm16:$addr), "JPE	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11101010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CPE : I8080Inst<3, (ins imm16:$addr), "CPE	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11101100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RPE : I8080Inst<1, (ins), "RPE"> {
  let Inst{7-0} = 0b11101000;
}
def JP : I8080Inst<3, (ins imm16:$addr), "JP	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11110010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CP : I8080Inst<3, (ins imm16:$addr), "CP	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11110100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RP : I8080Inst<1, (ins), "RP"> {
  let Inst{7-0} = 0b11110000;
}
def JM : I8080Inst<3, (ins imm16:$addr), "JM	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11111010;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def CM : I8080Inst<3, (ins imm16:$addr), "CM	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11111100;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RM : I8080Inst<1, (ins), "RM"> {
  let Inst{7-0} = 0b11111000;
}
def CALL : I8080Inst<3, (ins imm16:$addr), "CALL	$addr"> {
  bits<16> addr;
  let Inst{7-0} = 0b11001101;
  let Inst{15-8} = addr{7-0};
  let Inst{23-16} = addr{15-8};
}
def RET : I8080Inst<1, (ins), "RET"> {
  let Inst{7-0} = 0b11001001;
}
def RST : I8080Inst<1, (ins rst_op:$n), "RST	$n"> {
  bits<3> n;
  let Inst{7-6} = 0b11;
  let Inst{5-3} = n{2-0};
  let Inst{2-0} = 0b111;
}
def PCHL : I8080Inst<1, (ins), "PCHL"> {
  let Inst{7-0} = 0b11101001;
}
def PUSH : I8080Inst<1, (ins rs_op:$rs), "PUSH	$rs"> {
  bits<2> rs;
  let Inst{7-6} = 0b11;
  let Inst{5-4} = rs{1-0};
  let Inst{3-0} = 0b0101;
}
def POP : I8080Inst<1, (ins rs_op:$rs), "POP	$rs"> {
  bits<2> rs;
  let Inst{7-6} = 0b11;
  let Inst{5-4} = rs{1-0};
  let Inst{3-0} = 0b0001;
}
def XTHL : I8080Inst<1, (ins), "XTHL"> {
  let Inst{7-0} = 0b11100011;
}
def SPHL : I8080Inst<1, (ins), "SPHL"> {
  let Inst{7-0} = 0b11111001;
}
def IN : I8080Inst<2, (ins imm8:$port), "IN	$port"> {
  bits<8> port;
  let Inst{7-0} = 0b11011011;
  let Inst{15-8} = port{7-0};
}
def OUT : I8080Inst<2, (ins imm8:$port), "OUT	$port"> {
  bits<8> port;
  let Inst{7-0} = 0b11010011;
  let Inst{15-8} = port{7-0};
}
def EI : I8080Inst<1, (ins), "EI"> {
  let Inst{7-0} = 0b11111011;
}
def DI : I8080Inst<1, (ins), "DI"> {
  let Inst{7-0} = 0b11110011;
}
def HLT : I8080Inst<1, (ins), "HLT"> {
  let Inst{7-0} = 0b01110110;
}
def NOP : I8080Inst<1, (ins), "NOP"> {
  let Inst{7-0} = 0b00000000;
}
