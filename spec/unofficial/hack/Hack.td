// The Hack computer of nand2tetris (Nisan and Schocken, The Elements of Computing Systems): its machine language.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from
// chapter 4 of the book (the A- and C-instruction tables). nand2tetris publishes no Sail or TableGen description.
// Licensed CC BY-SA 4.0 like the sheets.
//
// llvm-tblgen reads it (with LLVM's include directory) like a target's description: one record per instruction, the
// word in Inst, the assembly in AsmString (dest=comp;jump; "|" is escaped as AsmString requires).

include "llvm/Target/Target.td"

def HackInstrInfo : InstrInfo;
def Hack : Target { let InstructionSet = HackInstrInfo; }

def dest_op : Operand<i8>; // null M D MD A AM AD AMD
def jump_op : Operand<i8>; // null JGT JEQ JGE JLT JNE JLE JMP
def addr15 : Operand<i16>;

class HackInst<dag ins, string asm> : Instruction {
  let Namespace = "Hack";
  let DecoderNamespace = "Hack";
  let Size = 2;
  let OutOperandList = (outs);
  let InOperandList = ins;
  let AsmString = asm;
  field bits<16> Inst;
  field bits<16> SoftFail = 0;
}

def A_INSTR : HackInst<(ins addr15:$imm), "@$imm"> { // Load Address
  bits<15> imm;
  let Inst{15} = 0b0;
  let Inst{14-0} = imm{14-0};
}
def C_0 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=0;$jump"> { // Zero
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110101010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=1;$jump"> { // One
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110111111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_MINUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=-1;$jump"> { // Minus One
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110111010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D;$jump"> { // D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110001100;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=A;$jump"> { // A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110110000;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_NOT_D : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=!D;$jump"> { // Not D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110001101;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_NOT_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=!A;$jump"> { // Not A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110110001;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_MINUS_D : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=-D;$jump"> { // Negate D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110001111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_MINUS_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=-A;$jump"> { // Negate A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110110011;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_PLUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D+1;$jump"> { // Increment D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110011111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_A_PLUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=A+1;$jump"> { // Increment A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110110111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_MINUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D-1;$jump"> { // Decrement D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110001110;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_A_MINUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=A-1;$jump"> { // Decrement A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110110010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_PLUS_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D+A;$jump"> { // Add
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110000010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_MINUS_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D-A;$jump"> { // Subtract A from D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110010011;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_A_MINUS_D : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=A-D;$jump"> { // Subtract D from A
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110000111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_AND_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D&A;$jump"> { // Bitwise And
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110000000;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_OR_A : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D\\|A;$jump"> { // Bitwise Or
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1110010101;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=M;$jump"> { // M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111110000;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_NOT_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=!M;$jump"> { // Not M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111110001;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_MINUS_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=-M;$jump"> { // Negate M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111110011;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_M_PLUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=M+1;$jump"> { // Increment M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111110111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_M_MINUS_1 : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=M-1;$jump"> { // Decrement M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111110010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_PLUS_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D+M;$jump"> { // Add
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111000010;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_MINUS_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D-M;$jump"> { // Subtract M from D
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111010011;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_M_MINUS_D : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=M-D;$jump"> { // Subtract D from M
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111000111;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_AND_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D&M;$jump"> { // Bitwise And
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111000000;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
def C_D_OR_M : HackInst<(ins dest_op:$dest, jump_op:$jump), "$dest=D\\|M;$jump"> { // Bitwise Or
  bits<3> dest;
  bits<3> jump;
  let Inst{15-6} = 0b1111010101;
  let Inst{5-3} = dest{2-0};
  let Inst{2-0} = jump{2-0};
}
