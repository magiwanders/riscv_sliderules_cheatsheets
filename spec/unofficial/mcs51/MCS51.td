// Intel MCS-51 (8051): encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// opcode map of Intel's MCS-51 Microcontroller Family User's Manual. Neither Intel nor LLVM publish an 8051
// description; this one is checked by assembling every instruction with the Macro Assembler AS and ASxxxx's as8051
// (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// llvm-tblgen reads it (with LLVM's include directory) like a target's description: one record per instruction, its
// encoding in Inst with LLVM's byte order (the first byte in memory is Inst{7-0}), its assembly in AsmString.

include "llvm/Target/Target.td"

def MCS51InstrInfo : InstrInfo;
def MCS51 : Target { let InstructionSet = MCS51InstrInfo; }

// Operand fields (named as in the manual) and immediates
def reg_op : Operand<i8>; // R0-R7
def ireg_op : Operand<i8>; // @R0 @R1
def direct_op : Operand<i8>; // internal RAM or SFR address
def bit_op : Operand<i8>; // bitaddr address
def pcrel8 : Operand<i8>; // offset from the next instruction
def imm8 : Operand<i8>;
def imm16 : Operand<i16>;
def addr11_op : Operand<i16>; // address in the 2 KB block of the next instruction

class MCS51Inst<int size, dag ins, string asm> : Instruction {
  let Namespace = "MCS51";
  let DecoderNamespace = "MCS51";
  let Size = size;
  let OutOperandList = (outs);
  let InOperandList = ins;
  let AsmString = asm;
  field bits<24> Inst;
  field bits<24> SoftFail = 0;
}

def ADD_A_Rn : MCS51Inst<1, (ins reg_op:$r), "ADD	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b00101;
  let Inst{2-0} = r{2-0};
}
def ADD_A_dir : MCS51Inst<2, (ins direct_op:$direct), "ADD	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b00100101;
  let Inst{15-8} = direct{7-0};
}
def ADD_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "ADD	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0010011;
  let Inst{0} = i{0};
}
def ADD_A_imm : MCS51Inst<2, (ins imm8:$data), "ADD	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b00100100;
  let Inst{15-8} = data{7-0};
}
def ADDC_A_Rn : MCS51Inst<1, (ins reg_op:$r), "ADDC	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b00111;
  let Inst{2-0} = r{2-0};
}
def ADDC_A_dir : MCS51Inst<2, (ins direct_op:$direct), "ADDC	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b00110101;
  let Inst{15-8} = direct{7-0};
}
def ADDC_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "ADDC	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0011011;
  let Inst{0} = i{0};
}
def ADDC_A_imm : MCS51Inst<2, (ins imm8:$data), "ADDC	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b00110100;
  let Inst{15-8} = data{7-0};
}
def SUBB_A_Rn : MCS51Inst<1, (ins reg_op:$r), "SUBB	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b10011;
  let Inst{2-0} = r{2-0};
}
def SUBB_A_dir : MCS51Inst<2, (ins direct_op:$direct), "SUBB	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b10010101;
  let Inst{15-8} = direct{7-0};
}
def SUBB_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "SUBB	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b1001011;
  let Inst{0} = i{0};
}
def SUBB_A_imm : MCS51Inst<2, (ins imm8:$data), "SUBB	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b10010100;
  let Inst{15-8} = data{7-0};
}
def ANL_A_Rn : MCS51Inst<1, (ins reg_op:$r), "ANL	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b01011;
  let Inst{2-0} = r{2-0};
}
def ANL_A_dir : MCS51Inst<2, (ins direct_op:$direct), "ANL	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b01010101;
  let Inst{15-8} = direct{7-0};
}
def ANL_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "ANL	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0101011;
  let Inst{0} = i{0};
}
def ANL_A_imm : MCS51Inst<2, (ins imm8:$data), "ANL	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b01010100;
  let Inst{15-8} = data{7-0};
}
def ORL_A_Rn : MCS51Inst<1, (ins reg_op:$r), "ORL	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b01001;
  let Inst{2-0} = r{2-0};
}
def ORL_A_dir : MCS51Inst<2, (ins direct_op:$direct), "ORL	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b01000101;
  let Inst{15-8} = direct{7-0};
}
def ORL_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "ORL	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0100011;
  let Inst{0} = i{0};
}
def ORL_A_imm : MCS51Inst<2, (ins imm8:$data), "ORL	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b01000100;
  let Inst{15-8} = data{7-0};
}
def XRL_A_Rn : MCS51Inst<1, (ins reg_op:$r), "XRL	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b01101;
  let Inst{2-0} = r{2-0};
}
def XRL_A_dir : MCS51Inst<2, (ins direct_op:$direct), "XRL	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b01100101;
  let Inst{15-8} = direct{7-0};
}
def XRL_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "XRL	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0110011;
  let Inst{0} = i{0};
}
def XRL_A_imm : MCS51Inst<2, (ins imm8:$data), "XRL	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b01100100;
  let Inst{15-8} = data{7-0};
}
def ANL_dir_A : MCS51Inst<2, (ins direct_op:$direct), "ANL	$direct,A"> {
  bits<8> direct;
  let Inst{7-0} = 0b01010010;
  let Inst{15-8} = direct{7-0};
}
def ANL_dir_imm : MCS51Inst<3, (ins direct_op:$direct, imm8:$data), "ANL	$direct,#$data"> {
  bits<8> direct;
  bits<8> data;
  let Inst{7-0} = 0b01010011;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = data{7-0};
}
def ORL_dir_A : MCS51Inst<2, (ins direct_op:$direct), "ORL	$direct,A"> {
  bits<8> direct;
  let Inst{7-0} = 0b01000010;
  let Inst{15-8} = direct{7-0};
}
def ORL_dir_imm : MCS51Inst<3, (ins direct_op:$direct, imm8:$data), "ORL	$direct,#$data"> {
  bits<8> direct;
  bits<8> data;
  let Inst{7-0} = 0b01000011;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = data{7-0};
}
def XRL_dir_A : MCS51Inst<2, (ins direct_op:$direct), "XRL	$direct,A"> {
  bits<8> direct;
  let Inst{7-0} = 0b01100010;
  let Inst{15-8} = direct{7-0};
}
def XRL_dir_imm : MCS51Inst<3, (ins direct_op:$direct, imm8:$data), "XRL	$direct,#$data"> {
  bits<8> direct;
  bits<8> data;
  let Inst{7-0} = 0b01100011;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = data{7-0};
}
def INC_A : MCS51Inst<1, (ins), "INC	A"> {
  let Inst{7-0} = 0b00000100;
}
def INC_Rn : MCS51Inst<1, (ins reg_op:$r), "INC	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b00001;
  let Inst{2-0} = r{2-0};
}
def INC_dir : MCS51Inst<2, (ins direct_op:$direct), "INC	$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b00000101;
  let Inst{15-8} = direct{7-0};
}
def INC_iRi : MCS51Inst<1, (ins ireg_op:$i), "INC	@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0000011;
  let Inst{0} = i{0};
}
def DEC_A : MCS51Inst<1, (ins), "DEC	A"> {
  let Inst{7-0} = 0b00010100;
}
def DEC_Rn : MCS51Inst<1, (ins reg_op:$r), "DEC	$r"> {
  bits<3> r;
  let Inst{7-3} = 0b00011;
  let Inst{2-0} = r{2-0};
}
def DEC_dir : MCS51Inst<2, (ins direct_op:$direct), "DEC	$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b00010101;
  let Inst{15-8} = direct{7-0};
}
def DEC_iRi : MCS51Inst<1, (ins ireg_op:$i), "DEC	@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b0001011;
  let Inst{0} = i{0};
}
def INC_DPTR : MCS51Inst<1, (ins), "INC	DPTR"> {
  let Inst{7-0} = 0b10100011;
}
def MUL_AB : MCS51Inst<1, (ins), "MUL	AB"> {
  let Inst{7-0} = 0b10100100;
}
def DIV_AB : MCS51Inst<1, (ins), "DIV	AB"> {
  let Inst{7-0} = 0b10000100;
}
def DA_A : MCS51Inst<1, (ins), "DA	A"> {
  let Inst{7-0} = 0b11010100;
}
def CLR_A : MCS51Inst<1, (ins), "CLR	A"> {
  let Inst{7-0} = 0b11100100;
}
def CPL_A : MCS51Inst<1, (ins), "CPL	A"> {
  let Inst{7-0} = 0b11110100;
}
def RL_A : MCS51Inst<1, (ins), "RL	A"> {
  let Inst{7-0} = 0b00100011;
}
def RLC_A : MCS51Inst<1, (ins), "RLC	A"> {
  let Inst{7-0} = 0b00110011;
}
def RR_A : MCS51Inst<1, (ins), "RR	A"> {
  let Inst{7-0} = 0b00000011;
}
def RRC_A : MCS51Inst<1, (ins), "RRC	A"> {
  let Inst{7-0} = 0b00010011;
}
def SWAP_A : MCS51Inst<1, (ins), "SWAP	A"> {
  let Inst{7-0} = 0b11000100;
}
def MOV_A_Rn : MCS51Inst<1, (ins reg_op:$r), "MOV	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b11101;
  let Inst{2-0} = r{2-0};
}
def MOV_A_dir : MCS51Inst<2, (ins direct_op:$direct), "MOV	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b11100101;
  let Inst{15-8} = direct{7-0};
}
def MOV_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "MOV	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b1110011;
  let Inst{0} = i{0};
}
def MOV_A_imm : MCS51Inst<2, (ins imm8:$data), "MOV	A,#$data"> {
  bits<8> data;
  let Inst{7-0} = 0b01110100;
  let Inst{15-8} = data{7-0};
}
def MOV_Rn_A : MCS51Inst<1, (ins reg_op:$r), "MOV	$r,A"> {
  bits<3> r;
  let Inst{7-3} = 0b11111;
  let Inst{2-0} = r{2-0};
}
def MOV_Rn_dir : MCS51Inst<2, (ins reg_op:$r, direct_op:$direct), "MOV	$r,$direct"> {
  bits<3> r;
  bits<8> direct;
  let Inst{7-3} = 0b10101;
  let Inst{2-0} = r{2-0};
  let Inst{15-8} = direct{7-0};
}
def MOV_Rn_imm : MCS51Inst<2, (ins reg_op:$r, imm8:$data), "MOV	$r,#$data"> {
  bits<3> r;
  bits<8> data;
  let Inst{7-3} = 0b01111;
  let Inst{2-0} = r{2-0};
  let Inst{15-8} = data{7-0};
}
def MOV_dir_A : MCS51Inst<2, (ins direct_op:$direct), "MOV	$direct,A"> {
  bits<8> direct;
  let Inst{7-0} = 0b11110101;
  let Inst{15-8} = direct{7-0};
}
def MOV_dir_Rn : MCS51Inst<2, (ins direct_op:$direct, reg_op:$r), "MOV	$direct,$r"> {
  bits<8> direct;
  bits<3> r;
  let Inst{7-3} = 0b10001;
  let Inst{2-0} = r{2-0};
  let Inst{15-8} = direct{7-0};
}
def MOV_dir_dir : MCS51Inst<3, (ins direct_op:$direct, direct_op:$direct2), "MOV	$direct,$direct2"> {
  bits<8> direct;
  bits<8> direct2;
  let Inst{7-0} = 0b10000101;
  let Inst{15-8} = direct2{7-0};
  let Inst{23-16} = direct{7-0};
}
def MOV_dir_iRi : MCS51Inst<2, (ins direct_op:$direct, ireg_op:$i), "MOV	$direct,@$i"> {
  bits<8> direct;
  bits<1> i;
  let Inst{7-1} = 0b1000011;
  let Inst{0} = i{0};
  let Inst{15-8} = direct{7-0};
}
def MOV_dir_imm : MCS51Inst<3, (ins direct_op:$direct, imm8:$data), "MOV	$direct,#$data"> {
  bits<8> direct;
  bits<8> data;
  let Inst{7-0} = 0b01110101;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = data{7-0};
}
def MOV_iRi_A : MCS51Inst<1, (ins ireg_op:$i), "MOV	@$i,A"> {
  bits<1> i;
  let Inst{7-1} = 0b1111011;
  let Inst{0} = i{0};
}
def MOV_iRi_dir : MCS51Inst<2, (ins ireg_op:$i, direct_op:$direct), "MOV	@$i,$direct"> {
  bits<1> i;
  bits<8> direct;
  let Inst{7-1} = 0b1010011;
  let Inst{0} = i{0};
  let Inst{15-8} = direct{7-0};
}
def MOV_iRi_imm : MCS51Inst<2, (ins ireg_op:$i, imm8:$data), "MOV	@$i,#$data"> {
  bits<1> i;
  bits<8> data;
  let Inst{7-1} = 0b0111011;
  let Inst{0} = i{0};
  let Inst{15-8} = data{7-0};
}
def MOV_DPTR_imm : MCS51Inst<3, (ins imm16:$data16), "MOV	DPTR,#$data16"> {
  bits<16> data16;
  let Inst{7-0} = 0b10010000;
  let Inst{15-8} = data16{15-8};
  let Inst{23-16} = data16{7-0};
}
def MOVC_A_iA_DPTR : MCS51Inst<1, (ins), "MOVC	A,@A+DPTR"> {
  let Inst{7-0} = 0b10010011;
}
def MOVC_A_iA_PC : MCS51Inst<1, (ins), "MOVC	A,@A+PC"> {
  let Inst{7-0} = 0b10000011;
}
def MOVX_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "MOVX	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b1110001;
  let Inst{0} = i{0};
}
def MOVX_A_iDPTR : MCS51Inst<1, (ins), "MOVX	A,@DPTR"> {
  let Inst{7-0} = 0b11100000;
}
def MOVX_iRi_A : MCS51Inst<1, (ins ireg_op:$i), "MOVX	@$i,A"> {
  bits<1> i;
  let Inst{7-1} = 0b1111001;
  let Inst{0} = i{0};
}
def MOVX_iDPTR_A : MCS51Inst<1, (ins), "MOVX	@DPTR,A"> {
  let Inst{7-0} = 0b11110000;
}
def PUSH : MCS51Inst<2, (ins direct_op:$direct), "PUSH	$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b11000000;
  let Inst{15-8} = direct{7-0};
}
def POP : MCS51Inst<2, (ins direct_op:$direct), "POP	$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b11010000;
  let Inst{15-8} = direct{7-0};
}
def XCH_A_Rn : MCS51Inst<1, (ins reg_op:$r), "XCH	A,$r"> {
  bits<3> r;
  let Inst{7-3} = 0b11001;
  let Inst{2-0} = r{2-0};
}
def XCH_A_dir : MCS51Inst<2, (ins direct_op:$direct), "XCH	A,$direct"> {
  bits<8> direct;
  let Inst{7-0} = 0b11000101;
  let Inst{15-8} = direct{7-0};
}
def XCH_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "XCH	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b1100011;
  let Inst{0} = i{0};
}
def XCHD_A_iRi : MCS51Inst<1, (ins ireg_op:$i), "XCHD	A,@$i"> {
  bits<1> i;
  let Inst{7-1} = 0b1101011;
  let Inst{0} = i{0};
}
def CLR_C : MCS51Inst<1, (ins), "CLR	C"> {
  let Inst{7-0} = 0b11000011;
}
def CLR_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "CLR	$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b11000010;
  let Inst{15-8} = bitaddr{7-0};
}
def SETB_C : MCS51Inst<1, (ins), "SETB	C"> {
  let Inst{7-0} = 0b11010011;
}
def SETB_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "SETB	$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b11010010;
  let Inst{15-8} = bitaddr{7-0};
}
def CPL_C : MCS51Inst<1, (ins), "CPL	C"> {
  let Inst{7-0} = 0b10110011;
}
def CPL_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "CPL	$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10110010;
  let Inst{15-8} = bitaddr{7-0};
}
def ANL_C_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "ANL	C,$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10000010;
  let Inst{15-8} = bitaddr{7-0};
}
def ANL_C_nbit : MCS51Inst<2, (ins bit_op:$bitaddr), "ANL	C,/$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10110000;
  let Inst{15-8} = bitaddr{7-0};
}
def ORL_C_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "ORL	C,$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b01110010;
  let Inst{15-8} = bitaddr{7-0};
}
def ORL_C_nbit : MCS51Inst<2, (ins bit_op:$bitaddr), "ORL	C,/$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10100000;
  let Inst{15-8} = bitaddr{7-0};
}
def MOV_C_bit : MCS51Inst<2, (ins bit_op:$bitaddr), "MOV	C,$bitaddr"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10100010;
  let Inst{15-8} = bitaddr{7-0};
}
def MOV_bit_C : MCS51Inst<2, (ins bit_op:$bitaddr), "MOV	$bitaddr,C"> {
  bits<8> bitaddr;
  let Inst{7-0} = 0b10010010;
  let Inst{15-8} = bitaddr{7-0};
}
def JC : MCS51Inst<2, (ins pcrel8:$rel), "JC	$rel"> {
  bits<8> rel;
  let Inst{7-0} = 0b01000000;
  let Inst{15-8} = rel{7-0};
}
def JNC : MCS51Inst<2, (ins pcrel8:$rel), "JNC	$rel"> {
  bits<8> rel;
  let Inst{7-0} = 0b01010000;
  let Inst{15-8} = rel{7-0};
}
def JB : MCS51Inst<3, (ins bit_op:$bitaddr, pcrel8:$rel), "JB	$bitaddr,$rel"> {
  bits<8> bitaddr;
  bits<8> rel;
  let Inst{7-0} = 0b00100000;
  let Inst{15-8} = bitaddr{7-0};
  let Inst{23-16} = rel{7-0};
}
def JNB : MCS51Inst<3, (ins bit_op:$bitaddr, pcrel8:$rel), "JNB	$bitaddr,$rel"> {
  bits<8> bitaddr;
  bits<8> rel;
  let Inst{7-0} = 0b00110000;
  let Inst{15-8} = bitaddr{7-0};
  let Inst{23-16} = rel{7-0};
}
def JBC : MCS51Inst<3, (ins bit_op:$bitaddr, pcrel8:$rel), "JBC	$bitaddr,$rel"> {
  bits<8> bitaddr;
  bits<8> rel;
  let Inst{7-0} = 0b00010000;
  let Inst{15-8} = bitaddr{7-0};
  let Inst{23-16} = rel{7-0};
}
def ACALL : MCS51Inst<2, (ins addr11_op:$addr11), "ACALL	$addr11"> {
  bits<11> addr11;
  let Inst{7-5} = addr11{10-8};
  let Inst{4-0} = 0b10001;
  let Inst{15-8} = addr11{7-0};
}
def LCALL : MCS51Inst<3, (ins imm16:$addr16), "LCALL	$addr16"> {
  bits<16> addr16;
  let Inst{7-0} = 0b00010010;
  let Inst{15-8} = addr16{15-8};
  let Inst{23-16} = addr16{7-0};
}
def RET : MCS51Inst<1, (ins), "RET"> {
  let Inst{7-0} = 0b00100010;
}
def RETI : MCS51Inst<1, (ins), "RETI"> {
  let Inst{7-0} = 0b00110010;
}
def AJMP : MCS51Inst<2, (ins addr11_op:$addr11), "AJMP	$addr11"> {
  bits<11> addr11;
  let Inst{7-5} = addr11{10-8};
  let Inst{4-0} = 0b00001;
  let Inst{15-8} = addr11{7-0};
}
def LJMP : MCS51Inst<3, (ins imm16:$addr16), "LJMP	$addr16"> {
  bits<16> addr16;
  let Inst{7-0} = 0b00000010;
  let Inst{15-8} = addr16{15-8};
  let Inst{23-16} = addr16{7-0};
}
def SJMP : MCS51Inst<2, (ins pcrel8:$rel), "SJMP	$rel"> {
  bits<8> rel;
  let Inst{7-0} = 0b10000000;
  let Inst{15-8} = rel{7-0};
}
def JMP_iA_DPTR : MCS51Inst<1, (ins), "JMP	@A+DPTR"> {
  let Inst{7-0} = 0b01110011;
}
def JZ : MCS51Inst<2, (ins pcrel8:$rel), "JZ	$rel"> {
  bits<8> rel;
  let Inst{7-0} = 0b01100000;
  let Inst{15-8} = rel{7-0};
}
def JNZ : MCS51Inst<2, (ins pcrel8:$rel), "JNZ	$rel"> {
  bits<8> rel;
  let Inst{7-0} = 0b01110000;
  let Inst{15-8} = rel{7-0};
}
def CJNE_A_dir : MCS51Inst<3, (ins direct_op:$direct, pcrel8:$rel), "CJNE	A,$direct,$rel"> {
  bits<8> direct;
  bits<8> rel;
  let Inst{7-0} = 0b10110101;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = rel{7-0};
}
def CJNE_A_imm : MCS51Inst<3, (ins imm8:$data, pcrel8:$rel), "CJNE	A,#$data,$rel"> {
  bits<8> data;
  bits<8> rel;
  let Inst{7-0} = 0b10110100;
  let Inst{15-8} = data{7-0};
  let Inst{23-16} = rel{7-0};
}
def CJNE_Rn_imm : MCS51Inst<3, (ins reg_op:$r, imm8:$data, pcrel8:$rel), "CJNE	$r,#$data,$rel"> {
  bits<3> r;
  bits<8> data;
  bits<8> rel;
  let Inst{7-3} = 0b10111;
  let Inst{2-0} = r{2-0};
  let Inst{15-8} = data{7-0};
  let Inst{23-16} = rel{7-0};
}
def CJNE_iRi_imm : MCS51Inst<3, (ins ireg_op:$i, imm8:$data, pcrel8:$rel), "CJNE	@$i,#$data,$rel"> {
  bits<1> i;
  bits<8> data;
  bits<8> rel;
  let Inst{7-1} = 0b1011011;
  let Inst{0} = i{0};
  let Inst{15-8} = data{7-0};
  let Inst{23-16} = rel{7-0};
}
def DJNZ_Rn : MCS51Inst<2, (ins reg_op:$r, pcrel8:$rel), "DJNZ	$r,$rel"> {
  bits<3> r;
  bits<8> rel;
  let Inst{7-3} = 0b11011;
  let Inst{2-0} = r{2-0};
  let Inst{15-8} = rel{7-0};
}
def DJNZ_dir : MCS51Inst<3, (ins direct_op:$direct, pcrel8:$rel), "DJNZ	$direct,$rel"> {
  bits<8> direct;
  bits<8> rel;
  let Inst{7-0} = 0b11010101;
  let Inst{15-8} = direct{7-0};
  let Inst{23-16} = rel{7-0};
}
def NOP : MCS51Inst<1, (ins), "NOP"> {
  let Inst{7-0} = 0b00000000;
}
