// x86-64 (the integer and system instructions of 64 bit mode): encodings, a clause per instruction and operand size.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by
// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's opcode table notation), each
// line of which is checked against LLVM's X86 records (opcode, map, form, operand size, prefixes, immediate). Only the
// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; values little-endian.
// modrm(rm, reg) is a ModRM byte and what follows it (SIB, displacement) in 64 bit addressing; the sheet shows a
// row per form of it. rex(W, R, X, B) is the REX prefix, left out when it is 0100 0000 and no byte register needs it.
// Licensed CC BY-SA 4.0 like the sheets.

scattered union instruction
// add r/m8, r8
mapping clause encdec = ADD_0
  <-> rex(0b0, R, X, B)? @ 0x00 @ modrm(rm, reg)

// add r/m32, r32
mapping clause encdec = ADD_1
  <-> rex(0b0, R, X, B)? @ 0x01 @ modrm(rm, reg)

// add r/m16, r16
mapping clause encdec = ADD_2
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x01 @ modrm(rm, reg)

// add r/m64, r64
mapping clause encdec = ADD_3
  <-> rex(0b1, R, X, B) @ 0x01 @ modrm(rm, reg)

// add r8, r/m8
mapping clause encdec = ADD_4
  <-> rex(0b0, R, X, B)? @ 0x02 @ modrm(rm, reg)

// add r32, r/m32
mapping clause encdec = ADD_5
  <-> rex(0b0, R, X, B)? @ 0x03 @ modrm(rm, reg)

// add r16, r/m16
mapping clause encdec = ADD_6
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x03 @ modrm(rm, reg)

// add r64, r/m64
mapping clause encdec = ADD_7
  <-> rex(0b1, R, X, B) @ 0x03 @ modrm(rm, reg)

// add AL, imm8
mapping clause encdec = ADD_8
  <-> 0x04 @ imm8

// add EAX, imm32
mapping clause encdec = ADD_9
  <-> 0x05 @ imm32_le

// add AX, imm16
mapping clause encdec = ADD_10
  <-> 0x66 @ 0x05 @ imm16_le

// add RAX, simm32
mapping clause encdec = ADD_11
  <-> rex(0b1, R, X, B) @ 0x05 @ imm32_le

// add r/m8, imm8
mapping clause encdec = ADD_12
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b000) @ imm8

// add r/m32, imm32
mapping clause encdec = ADD_13
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b000) @ imm32_le

// add r/m16, imm16
mapping clause encdec = ADD_14
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b000) @ imm16_le

// add r/m64, simm32
mapping clause encdec = ADD_15
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b000) @ imm32_le

// add r/m32, simm8
mapping clause encdec = ADD_16
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b000) @ imm8

// add r/m16, simm8
mapping clause encdec = ADD_17
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b000) @ imm8

// add r/m64, simm8
mapping clause encdec = ADD_18
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b000) @ imm8

// or r/m8, r8
mapping clause encdec = OR_19
  <-> rex(0b0, R, X, B)? @ 0x08 @ modrm(rm, reg)

// or r/m32, r32
mapping clause encdec = OR_20
  <-> rex(0b0, R, X, B)? @ 0x09 @ modrm(rm, reg)

// or r/m16, r16
mapping clause encdec = OR_21
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x09 @ modrm(rm, reg)

// or r/m64, r64
mapping clause encdec = OR_22
  <-> rex(0b1, R, X, B) @ 0x09 @ modrm(rm, reg)

// or r8, r/m8
mapping clause encdec = OR_23
  <-> rex(0b0, R, X, B)? @ 0x0a @ modrm(rm, reg)

// or r32, r/m32
mapping clause encdec = OR_24
  <-> rex(0b0, R, X, B)? @ 0x0b @ modrm(rm, reg)

// or r16, r/m16
mapping clause encdec = OR_25
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0b @ modrm(rm, reg)

// or r64, r/m64
mapping clause encdec = OR_26
  <-> rex(0b1, R, X, B) @ 0x0b @ modrm(rm, reg)

// or AL, imm8
mapping clause encdec = OR_27
  <-> 0x0c @ imm8

// or EAX, imm32
mapping clause encdec = OR_28
  <-> 0x0d @ imm32_le

// or AX, imm16
mapping clause encdec = OR_29
  <-> 0x66 @ 0x0d @ imm16_le

// or RAX, simm32
mapping clause encdec = OR_30
  <-> rex(0b1, R, X, B) @ 0x0d @ imm32_le

// or r/m8, imm8
mapping clause encdec = OR_31
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b001) @ imm8

// or r/m32, imm32
mapping clause encdec = OR_32
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b001) @ imm32_le

// or r/m16, imm16
mapping clause encdec = OR_33
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b001) @ imm16_le

// or r/m64, simm32
mapping clause encdec = OR_34
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b001) @ imm32_le

// or r/m32, simm8
mapping clause encdec = OR_35
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b001) @ imm8

// or r/m16, simm8
mapping clause encdec = OR_36
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b001) @ imm8

// or r/m64, simm8
mapping clause encdec = OR_37
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b001) @ imm8

// adc r/m8, r8
mapping clause encdec = ADC_38
  <-> rex(0b0, R, X, B)? @ 0x10 @ modrm(rm, reg)

// adc r/m32, r32
mapping clause encdec = ADC_39
  <-> rex(0b0, R, X, B)? @ 0x11 @ modrm(rm, reg)

// adc r/m16, r16
mapping clause encdec = ADC_40
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x11 @ modrm(rm, reg)

// adc r/m64, r64
mapping clause encdec = ADC_41
  <-> rex(0b1, R, X, B) @ 0x11 @ modrm(rm, reg)

// adc r8, r/m8
mapping clause encdec = ADC_42
  <-> rex(0b0, R, X, B)? @ 0x12 @ modrm(rm, reg)

// adc r32, r/m32
mapping clause encdec = ADC_43
  <-> rex(0b0, R, X, B)? @ 0x13 @ modrm(rm, reg)

// adc r16, r/m16
mapping clause encdec = ADC_44
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x13 @ modrm(rm, reg)

// adc r64, r/m64
mapping clause encdec = ADC_45
  <-> rex(0b1, R, X, B) @ 0x13 @ modrm(rm, reg)

// adc AL, imm8
mapping clause encdec = ADC_46
  <-> 0x14 @ imm8

// adc EAX, imm32
mapping clause encdec = ADC_47
  <-> 0x15 @ imm32_le

// adc AX, imm16
mapping clause encdec = ADC_48
  <-> 0x66 @ 0x15 @ imm16_le

// adc RAX, simm32
mapping clause encdec = ADC_49
  <-> rex(0b1, R, X, B) @ 0x15 @ imm32_le

// adc r/m8, imm8
mapping clause encdec = ADC_50
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b010) @ imm8

// adc r/m32, imm32
mapping clause encdec = ADC_51
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b010) @ imm32_le

// adc r/m16, imm16
mapping clause encdec = ADC_52
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b010) @ imm16_le

// adc r/m64, simm32
mapping clause encdec = ADC_53
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b010) @ imm32_le

// adc r/m32, simm8
mapping clause encdec = ADC_54
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b010) @ imm8

// adc r/m16, simm8
mapping clause encdec = ADC_55
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b010) @ imm8

// adc r/m64, simm8
mapping clause encdec = ADC_56
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b010) @ imm8

// sbb r/m8, r8
mapping clause encdec = SBB_57
  <-> rex(0b0, R, X, B)? @ 0x18 @ modrm(rm, reg)

// sbb r/m32, r32
mapping clause encdec = SBB_58
  <-> rex(0b0, R, X, B)? @ 0x19 @ modrm(rm, reg)

// sbb r/m16, r16
mapping clause encdec = SBB_59
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x19 @ modrm(rm, reg)

// sbb r/m64, r64
mapping clause encdec = SBB_60
  <-> rex(0b1, R, X, B) @ 0x19 @ modrm(rm, reg)

// sbb r8, r/m8
mapping clause encdec = SBB_61
  <-> rex(0b0, R, X, B)? @ 0x1a @ modrm(rm, reg)

// sbb r32, r/m32
mapping clause encdec = SBB_62
  <-> rex(0b0, R, X, B)? @ 0x1b @ modrm(rm, reg)

// sbb r16, r/m16
mapping clause encdec = SBB_63
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x1b @ modrm(rm, reg)

// sbb r64, r/m64
mapping clause encdec = SBB_64
  <-> rex(0b1, R, X, B) @ 0x1b @ modrm(rm, reg)

// sbb AL, imm8
mapping clause encdec = SBB_65
  <-> 0x1c @ imm8

// sbb EAX, imm32
mapping clause encdec = SBB_66
  <-> 0x1d @ imm32_le

// sbb AX, imm16
mapping clause encdec = SBB_67
  <-> 0x66 @ 0x1d @ imm16_le

// sbb RAX, simm32
mapping clause encdec = SBB_68
  <-> rex(0b1, R, X, B) @ 0x1d @ imm32_le

// sbb r/m8, imm8
mapping clause encdec = SBB_69
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b011) @ imm8

// sbb r/m32, imm32
mapping clause encdec = SBB_70
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b011) @ imm32_le

// sbb r/m16, imm16
mapping clause encdec = SBB_71
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b011) @ imm16_le

// sbb r/m64, simm32
mapping clause encdec = SBB_72
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b011) @ imm32_le

// sbb r/m32, simm8
mapping clause encdec = SBB_73
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b011) @ imm8

// sbb r/m16, simm8
mapping clause encdec = SBB_74
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b011) @ imm8

// sbb r/m64, simm8
mapping clause encdec = SBB_75
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b011) @ imm8

// and r/m8, r8
mapping clause encdec = AND_76
  <-> rex(0b0, R, X, B)? @ 0x20 @ modrm(rm, reg)

// and r/m32, r32
mapping clause encdec = AND_77
  <-> rex(0b0, R, X, B)? @ 0x21 @ modrm(rm, reg)

// and r/m16, r16
mapping clause encdec = AND_78
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x21 @ modrm(rm, reg)

// and r/m64, r64
mapping clause encdec = AND_79
  <-> rex(0b1, R, X, B) @ 0x21 @ modrm(rm, reg)

// and r8, r/m8
mapping clause encdec = AND_80
  <-> rex(0b0, R, X, B)? @ 0x22 @ modrm(rm, reg)

// and r32, r/m32
mapping clause encdec = AND_81
  <-> rex(0b0, R, X, B)? @ 0x23 @ modrm(rm, reg)

// and r16, r/m16
mapping clause encdec = AND_82
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x23 @ modrm(rm, reg)

// and r64, r/m64
mapping clause encdec = AND_83
  <-> rex(0b1, R, X, B) @ 0x23 @ modrm(rm, reg)

// and AL, imm8
mapping clause encdec = AND_84
  <-> 0x24 @ imm8

// and EAX, imm32
mapping clause encdec = AND_85
  <-> 0x25 @ imm32_le

// and AX, imm16
mapping clause encdec = AND_86
  <-> 0x66 @ 0x25 @ imm16_le

// and RAX, simm32
mapping clause encdec = AND_87
  <-> rex(0b1, R, X, B) @ 0x25 @ imm32_le

// and r/m8, imm8
mapping clause encdec = AND_88
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b100) @ imm8

// and r/m32, imm32
mapping clause encdec = AND_89
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b100) @ imm32_le

// and r/m16, imm16
mapping clause encdec = AND_90
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b100) @ imm16_le

// and r/m64, simm32
mapping clause encdec = AND_91
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b100) @ imm32_le

// and r/m32, simm8
mapping clause encdec = AND_92
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b100) @ imm8

// and r/m16, simm8
mapping clause encdec = AND_93
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b100) @ imm8

// and r/m64, simm8
mapping clause encdec = AND_94
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b100) @ imm8

// sub r/m8, r8
mapping clause encdec = SUB_95
  <-> rex(0b0, R, X, B)? @ 0x28 @ modrm(rm, reg)

// sub r/m32, r32
mapping clause encdec = SUB_96
  <-> rex(0b0, R, X, B)? @ 0x29 @ modrm(rm, reg)

// sub r/m16, r16
mapping clause encdec = SUB_97
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x29 @ modrm(rm, reg)

// sub r/m64, r64
mapping clause encdec = SUB_98
  <-> rex(0b1, R, X, B) @ 0x29 @ modrm(rm, reg)

// sub r8, r/m8
mapping clause encdec = SUB_99
  <-> rex(0b0, R, X, B)? @ 0x2a @ modrm(rm, reg)

// sub r32, r/m32
mapping clause encdec = SUB_100
  <-> rex(0b0, R, X, B)? @ 0x2b @ modrm(rm, reg)

// sub r16, r/m16
mapping clause encdec = SUB_101
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x2b @ modrm(rm, reg)

// sub r64, r/m64
mapping clause encdec = SUB_102
  <-> rex(0b1, R, X, B) @ 0x2b @ modrm(rm, reg)

// sub AL, imm8
mapping clause encdec = SUB_103
  <-> 0x2c @ imm8

// sub EAX, imm32
mapping clause encdec = SUB_104
  <-> 0x2d @ imm32_le

// sub AX, imm16
mapping clause encdec = SUB_105
  <-> 0x66 @ 0x2d @ imm16_le

// sub RAX, simm32
mapping clause encdec = SUB_106
  <-> rex(0b1, R, X, B) @ 0x2d @ imm32_le

// sub r/m8, imm8
mapping clause encdec = SUB_107
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b101) @ imm8

// sub r/m32, imm32
mapping clause encdec = SUB_108
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b101) @ imm32_le

// sub r/m16, imm16
mapping clause encdec = SUB_109
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b101) @ imm16_le

// sub r/m64, simm32
mapping clause encdec = SUB_110
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b101) @ imm32_le

// sub r/m32, simm8
mapping clause encdec = SUB_111
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b101) @ imm8

// sub r/m16, simm8
mapping clause encdec = SUB_112
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b101) @ imm8

// sub r/m64, simm8
mapping clause encdec = SUB_113
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b101) @ imm8

// xor r/m8, r8
mapping clause encdec = XOR_114
  <-> rex(0b0, R, X, B)? @ 0x30 @ modrm(rm, reg)

// xor r/m32, r32
mapping clause encdec = XOR_115
  <-> rex(0b0, R, X, B)? @ 0x31 @ modrm(rm, reg)

// xor r/m16, r16
mapping clause encdec = XOR_116
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x31 @ modrm(rm, reg)

// xor r/m64, r64
mapping clause encdec = XOR_117
  <-> rex(0b1, R, X, B) @ 0x31 @ modrm(rm, reg)

// xor r8, r/m8
mapping clause encdec = XOR_118
  <-> rex(0b0, R, X, B)? @ 0x32 @ modrm(rm, reg)

// xor r32, r/m32
mapping clause encdec = XOR_119
  <-> rex(0b0, R, X, B)? @ 0x33 @ modrm(rm, reg)

// xor r16, r/m16
mapping clause encdec = XOR_120
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x33 @ modrm(rm, reg)

// xor r64, r/m64
mapping clause encdec = XOR_121
  <-> rex(0b1, R, X, B) @ 0x33 @ modrm(rm, reg)

// xor AL, imm8
mapping clause encdec = XOR_122
  <-> 0x34 @ imm8

// xor EAX, imm32
mapping clause encdec = XOR_123
  <-> 0x35 @ imm32_le

// xor AX, imm16
mapping clause encdec = XOR_124
  <-> 0x66 @ 0x35 @ imm16_le

// xor RAX, simm32
mapping clause encdec = XOR_125
  <-> rex(0b1, R, X, B) @ 0x35 @ imm32_le

// xor r/m8, imm8
mapping clause encdec = XOR_126
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b110) @ imm8

// xor r/m32, imm32
mapping clause encdec = XOR_127
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b110) @ imm32_le

// xor r/m16, imm16
mapping clause encdec = XOR_128
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b110) @ imm16_le

// xor r/m64, simm32
mapping clause encdec = XOR_129
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b110) @ imm32_le

// xor r/m32, simm8
mapping clause encdec = XOR_130
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b110) @ imm8

// xor r/m16, simm8
mapping clause encdec = XOR_131
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b110) @ imm8

// xor r/m64, simm8
mapping clause encdec = XOR_132
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b110) @ imm8

// cmp r/m8, r8
mapping clause encdec = CMP_133
  <-> rex(0b0, R, X, B)? @ 0x38 @ modrm(rm, reg)

// cmp r/m32, r32
mapping clause encdec = CMP_134
  <-> rex(0b0, R, X, B)? @ 0x39 @ modrm(rm, reg)

// cmp r/m16, r16
mapping clause encdec = CMP_135
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x39 @ modrm(rm, reg)

// cmp r/m64, r64
mapping clause encdec = CMP_136
  <-> rex(0b1, R, X, B) @ 0x39 @ modrm(rm, reg)

// cmp r8, r/m8
mapping clause encdec = CMP_137
  <-> rex(0b0, R, X, B)? @ 0x3a @ modrm(rm, reg)

// cmp r32, r/m32
mapping clause encdec = CMP_138
  <-> rex(0b0, R, X, B)? @ 0x3b @ modrm(rm, reg)

// cmp r16, r/m16
mapping clause encdec = CMP_139
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x3b @ modrm(rm, reg)

// cmp r64, r/m64
mapping clause encdec = CMP_140
  <-> rex(0b1, R, X, B) @ 0x3b @ modrm(rm, reg)

// cmp AL, imm8
mapping clause encdec = CMP_141
  <-> 0x3c @ imm8

// cmp EAX, imm32
mapping clause encdec = CMP_142
  <-> 0x3d @ imm32_le

// cmp AX, imm16
mapping clause encdec = CMP_143
  <-> 0x66 @ 0x3d @ imm16_le

// cmp RAX, simm32
mapping clause encdec = CMP_144
  <-> rex(0b1, R, X, B) @ 0x3d @ imm32_le

// cmp r/m8, imm8
mapping clause encdec = CMP_145
  <-> rex(0b0, R, X, B)? @ 0x80 @ modrm(rm, 0b111) @ imm8

// cmp r/m32, imm32
mapping clause encdec = CMP_146
  <-> rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b111) @ imm32_le

// cmp r/m16, imm16
mapping clause encdec = CMP_147
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x81 @ modrm(rm, 0b111) @ imm16_le

// cmp r/m64, simm32
mapping clause encdec = CMP_148
  <-> rex(0b1, R, X, B) @ 0x81 @ modrm(rm, 0b111) @ imm32_le

// cmp r/m32, simm8
mapping clause encdec = CMP_149
  <-> rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b111) @ imm8

// cmp r/m16, simm8
mapping clause encdec = CMP_150
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x83 @ modrm(rm, 0b111) @ imm8

// cmp r/m64, simm8
mapping clause encdec = CMP_151
  <-> rex(0b1, R, X, B) @ 0x83 @ modrm(rm, 0b111) @ imm8

// inc r/m8
mapping clause encdec = INC_152
  <-> rex(0b0, R, X, B)? @ 0xfe @ modrm(rm, 0b000)

// inc r/m32
mapping clause encdec = INC_153
  <-> rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b000)

// inc r/m16
mapping clause encdec = INC_154
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b000)

// inc r/m64
mapping clause encdec = INC_155
  <-> rex(0b1, R, X, B) @ 0xff @ modrm(rm, 0b000)

// dec r/m8
mapping clause encdec = DEC_156
  <-> rex(0b0, R, X, B)? @ 0xfe @ modrm(rm, 0b001)

// dec r/m32
mapping clause encdec = DEC_157
  <-> rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b001)

// dec r/m16
mapping clause encdec = DEC_158
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b001)

// dec r/m64
mapping clause encdec = DEC_159
  <-> rex(0b1, R, X, B) @ 0xff @ modrm(rm, 0b001)

// not r/m8
mapping clause encdec = NOT_160
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b010)

// not r/m32
mapping clause encdec = NOT_161
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b010)

// not r/m16
mapping clause encdec = NOT_162
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b010)

// not r/m64
mapping clause encdec = NOT_163
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b010)

// neg r/m8
mapping clause encdec = NEG_164
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b011)

// neg r/m32
mapping clause encdec = NEG_165
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b011)

// neg r/m16
mapping clause encdec = NEG_166
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b011)

// neg r/m64
mapping clause encdec = NEG_167
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b011)

// mul r/m8
mapping clause encdec = MUL_168
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b100)

// mul r/m32
mapping clause encdec = MUL_169
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b100)

// mul r/m16
mapping clause encdec = MUL_170
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b100)

// mul r/m64
mapping clause encdec = MUL_171
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b100)

// imul r/m8
mapping clause encdec = IMUL_172
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b101)

// imul r/m32
mapping clause encdec = IMUL_173
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b101)

// imul r/m16
mapping clause encdec = IMUL_174
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b101)

// imul r/m64
mapping clause encdec = IMUL_175
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b101)

// div r/m8
mapping clause encdec = DIV_176
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b110)

// div r/m32
mapping clause encdec = DIV_177
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b110)

// div r/m16
mapping clause encdec = DIV_178
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b110)

// div r/m64
mapping clause encdec = DIV_179
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b110)

// idiv r/m8
mapping clause encdec = IDIV_180
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b111)

// idiv r/m32
mapping clause encdec = IDIV_181
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b111)

// idiv r/m16
mapping clause encdec = IDIV_182
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b111)

// idiv r/m64
mapping clause encdec = IDIV_183
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b111)

// test r/m8, r8
mapping clause encdec = TEST_184
  <-> rex(0b0, R, X, B)? @ 0x84 @ modrm(rm, reg)

// test r/m32, r32
mapping clause encdec = TEST_185
  <-> rex(0b0, R, X, B)? @ 0x85 @ modrm(rm, reg)

// test r/m16, r16
mapping clause encdec = TEST_186
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x85 @ modrm(rm, reg)

// test r/m64, r64
mapping clause encdec = TEST_187
  <-> rex(0b1, R, X, B) @ 0x85 @ modrm(rm, reg)

// test AL, imm8
mapping clause encdec = TEST_188
  <-> 0xa8 @ imm8

// test EAX, imm32
mapping clause encdec = TEST_189
  <-> 0xa9 @ imm32_le

// test AX, imm16
mapping clause encdec = TEST_190
  <-> 0x66 @ 0xa9 @ imm16_le

// test RAX, simm32
mapping clause encdec = TEST_191
  <-> rex(0b1, R, X, B) @ 0xa9 @ imm32_le

// test r/m8, imm8
mapping clause encdec = TEST_192
  <-> rex(0b0, R, X, B)? @ 0xf6 @ modrm(rm, 0b000) @ imm8

// test r/m32, imm32
mapping clause encdec = TEST_193
  <-> rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b000) @ imm32_le

// test r/m16, imm16
mapping clause encdec = TEST_194
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xf7 @ modrm(rm, 0b000) @ imm16_le

// test r/m64, simm32
mapping clause encdec = TEST_195
  <-> rex(0b1, R, X, B) @ 0xf7 @ modrm(rm, 0b000) @ imm32_le

// imul r32, r/m32, imm32
mapping clause encdec = IMUL_196
  <-> rex(0b0, R, X, B)? @ 0x69 @ modrm(rm, reg) @ imm32_le

// imul r16, r/m16, imm16
mapping clause encdec = IMUL_197
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x69 @ modrm(rm, reg) @ imm16_le

// imul r64, r/m64, simm32
mapping clause encdec = IMUL_198
  <-> rex(0b1, R, X, B) @ 0x69 @ modrm(rm, reg) @ imm32_le

// imul r32, r/m32, simm8
mapping clause encdec = IMUL_199
  <-> rex(0b0, R, X, B)? @ 0x6b @ modrm(rm, reg) @ imm8

// imul r16, r/m16, simm8
mapping clause encdec = IMUL_200
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x6b @ modrm(rm, reg) @ imm8

// imul r64, r/m64, simm8
mapping clause encdec = IMUL_201
  <-> rex(0b1, R, X, B) @ 0x6b @ modrm(rm, reg) @ imm8

// imul r32, r/m32
mapping clause encdec = IMUL_202
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xaf @ modrm(rm, reg)

// imul r16, r/m16
mapping clause encdec = IMUL_203
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xaf @ modrm(rm, reg)

// imul r64, r/m64
mapping clause encdec = IMUL_204
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xaf @ modrm(rm, reg)

// mov r/m8, r8
mapping clause encdec = MOV_205
  <-> rex(0b0, R, X, B)? @ 0x88 @ modrm(rm, reg)

// mov r/m32, r32
mapping clause encdec = MOV_206
  <-> rex(0b0, R, X, B)? @ 0x89 @ modrm(rm, reg)

// mov r/m16, r16
mapping clause encdec = MOV_207
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x89 @ modrm(rm, reg)

// mov r/m64, r64
mapping clause encdec = MOV_208
  <-> rex(0b1, R, X, B) @ 0x89 @ modrm(rm, reg)

// mov r8, r/m8
mapping clause encdec = MOV_209
  <-> rex(0b0, R, X, B)? @ 0x8a @ modrm(rm, reg)

// mov r32, r/m32
mapping clause encdec = MOV_210
  <-> rex(0b0, R, X, B)? @ 0x8b @ modrm(rm, reg)

// mov r16, r/m16
mapping clause encdec = MOV_211
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x8b @ modrm(rm, reg)

// mov r64, r/m64
mapping clause encdec = MOV_212
  <-> rex(0b1, R, X, B) @ 0x8b @ modrm(rm, reg)

// mov r/m32, Sreg (register form only)
mapping clause encdec = MOV_213
  <-> rex(0b0, R, X, B)? @ 0x8c @ modrm(rm, reg)

// mov r/m16, Sreg (register form only)
mapping clause encdec = MOV_214
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x8c @ modrm(rm, reg)

// mov r/m64, Sreg (register form only)
mapping clause encdec = MOV_215
  <-> rex(0b1, R, X, B) @ 0x8c @ modrm(rm, reg)

// mov m16, Sreg
mapping clause encdec = MOV_216
  <-> 0x8c @ modrm(rm, reg)

// mov Sreg, r/m32 (register form only)
mapping clause encdec = MOV_217
  <-> rex(0b0, R, X, B)? @ 0x8e @ modrm(rm, reg)

// mov Sreg, m16
mapping clause encdec = MOV_218
  <-> 0x8e @ modrm(rm, reg)

// movabs AL, [moffs8]
mapping clause encdec = MOVABS_219
  <-> 0xa0 @ addr64_le

// movabs EAX, [moffs32]
mapping clause encdec = MOVABS_220
  <-> 0xa1 @ addr64_le

// movabs AX, [moffs16]
mapping clause encdec = MOVABS_221
  <-> 0x66 @ 0xa1 @ addr64_le

// movabs RAX, [moffs64]
mapping clause encdec = MOVABS_222
  <-> rex(0b1, R, X, B) @ 0xa1 @ addr64_le

// movabs [moffs8], AL
mapping clause encdec = MOVABS_223
  <-> 0xa2 @ addr64_le

// movabs [moffs32], EAX
mapping clause encdec = MOVABS_224
  <-> 0xa3 @ addr64_le

// movabs [moffs16], AX
mapping clause encdec = MOVABS_225
  <-> 0x66 @ 0xa3 @ addr64_le

// movabs [moffs64], RAX
mapping clause encdec = MOVABS_226
  <-> rex(0b1, R, X, B) @ 0xa3 @ addr64_le

// mov r8, imm8
mapping clause encdec = MOV_227
  <-> rex(0b0, R, X, B)? @ 0b10110 @ reg @ imm8

// mov r32, imm32
mapping clause encdec = MOV_228
  <-> rex(0b0, R, X, B)? @ 0b10111 @ reg @ imm32_le

// mov r16, imm16
mapping clause encdec = MOV_229
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0b10111 @ reg @ imm16_le

// mov r64, imm64
mapping clause encdec = MOV_230
  <-> rex(0b1, R, X, B) @ 0b10111 @ reg @ imm64_le

// mov r/m8, imm8
mapping clause encdec = MOV_231
  <-> rex(0b0, R, X, B)? @ 0xc6 @ modrm(rm, 0b000) @ imm8

// mov r/m32, imm32
mapping clause encdec = MOV_232
  <-> rex(0b0, R, X, B)? @ 0xc7 @ modrm(rm, 0b000) @ imm32_le

// mov r/m16, imm16
mapping clause encdec = MOV_233
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc7 @ modrm(rm, 0b000) @ imm16_le

// mov r/m64, simm32
mapping clause encdec = MOV_234
  <-> rex(0b1, R, X, B) @ 0xc7 @ modrm(rm, 0b000) @ imm32_le

// xchg r/m8, r8
mapping clause encdec = XCHG_235
  <-> rex(0b0, R, X, B)? @ 0x86 @ modrm(rm, reg)

// xchg r/m32, r32
mapping clause encdec = XCHG_236
  <-> rex(0b0, R, X, B)? @ 0x87 @ modrm(rm, reg)

// xchg r/m16, r16
mapping clause encdec = XCHG_237
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x87 @ modrm(rm, reg)

// xchg r/m64, r64
mapping clause encdec = XCHG_238
  <-> rex(0b1, R, X, B) @ 0x87 @ modrm(rm, reg)

// xchg EAX, r32
mapping clause encdec = XCHG_239
  <-> rex(0b0, R, X, B)? @ 0b10010 @ reg

// xchg AX, r16
mapping clause encdec = XCHG_240
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0b10010 @ reg

// xchg RAX, r64
mapping clause encdec = XCHG_241
  <-> rex(0b1, R, X, B) @ 0b10010 @ reg

// lea r32, m
mapping clause encdec = LEA_242
  <-> rex(0b0, R, X, B)? @ 0x8d @ modrm(rm, reg)

// lea r16, m
mapping clause encdec = LEA_243
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x8d @ modrm(rm, reg)

// lea r64, m
mapping clause encdec = LEA_244
  <-> rex(0b1, R, X, B) @ 0x8d @ modrm(rm, reg)

// lss r32, m16:32
mapping clause encdec = LSS_245
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb2 @ modrm(rm, reg)

// lss r16, m16:16
mapping clause encdec = LSS_246
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb2 @ modrm(rm, reg)

// lss r64, m16:64
mapping clause encdec = LSS_247
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb2 @ modrm(rm, reg)

// lfs r32, m16:32
mapping clause encdec = LFS_248
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb4 @ modrm(rm, reg)

// lfs r16, m16:16
mapping clause encdec = LFS_249
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb4 @ modrm(rm, reg)

// lfs r64, m16:64
mapping clause encdec = LFS_250
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb4 @ modrm(rm, reg)

// lgs r32, m16:32
mapping clause encdec = LGS_251
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb5 @ modrm(rm, reg)

// lgs r16, m16:16
mapping clause encdec = LGS_252
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb5 @ modrm(rm, reg)

// lgs r64, m16:64
mapping clause encdec = LGS_253
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb5 @ modrm(rm, reg)

// movzx r32, r/m8
mapping clause encdec = MOVZX_254
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb6 @ modrm(rm, reg)

// movzx r16, r/m8
mapping clause encdec = MOVZX_255
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb6 @ modrm(rm, reg)

// movzx r64, r/m8
mapping clause encdec = MOVZX_256
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb6 @ modrm(rm, reg)

// movzx r32, r/m16
mapping clause encdec = MOVZX_257
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb7 @ modrm(rm, reg)

// movzx r64, r/m16
mapping clause encdec = MOVZX_258
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb7 @ modrm(rm, reg)

// movsx r32, r/m8
mapping clause encdec = MOVSX_259
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xbe @ modrm(rm, reg)

// movsx r16, r/m8
mapping clause encdec = MOVSX_260
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xbe @ modrm(rm, reg)

// movsx r64, r/m8
mapping clause encdec = MOVSX_261
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xbe @ modrm(rm, reg)

// movsx r32, r/m16
mapping clause encdec = MOVSX_262
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xbf @ modrm(rm, reg)

// movsx r64, r/m16
mapping clause encdec = MOVSX_263
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xbf @ modrm(rm, reg)

// movsxd r64, r/m32
mapping clause encdec = MOVSXD_264
  <-> rex(0b1, R, X, B) @ 0x63 @ modrm(rm, reg)

// push r64
mapping clause encdec = PUSH_265
  <-> rex(0b0, R, X, B)? @ 0b01010 @ reg

// push r16
mapping clause encdec = PUSH_266
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0b01010 @ reg

// pop r64
mapping clause encdec = POP_267
  <-> rex(0b0, R, X, B)? @ 0b01011 @ reg

// pop r16
mapping clause encdec = POP_268
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0b01011 @ reg

// push r/m64
mapping clause encdec = PUSH_269
  <-> rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b110)

// push r/m16
mapping clause encdec = PUSH_270
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b110)

// pop r/m64
mapping clause encdec = POP_271
  <-> rex(0b0, R, X, B)? @ 0x8f @ modrm(rm, 0b000)

// pop r/m16
mapping clause encdec = POP_272
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x8f @ modrm(rm, 0b000)

// push simm32
mapping clause encdec = PUSH_273
  <-> 0x68 @ imm32_le

// push simm8
mapping clause encdec = PUSH_274
  <-> 0x6a @ imm8

// push FS
mapping clause encdec = PUSH_275
  <-> 0x0f @ 0xa0

// pop FS
mapping clause encdec = POP_276
  <-> 0x0f @ 0xa1

// push GS
mapping clause encdec = PUSH_277
  <-> 0x0f @ 0xa8

// pop GS
mapping clause encdec = POP_278
  <-> 0x0f @ 0xa9

// pushfq
mapping clause encdec = PUSHFQ_279
  <-> 0x9c

// pushfw
mapping clause encdec = PUSHFW_280
  <-> 0x66 @ 0x9c

// popfq
mapping clause encdec = POPFQ_281
  <-> 0x9d

// popfw
mapping clause encdec = POPFW_282
  <-> 0x66 @ 0x9d

// lahf
mapping clause encdec = LAHF_283
  <-> 0x9f

// sahf
mapping clause encdec = SAHF_284
  <-> 0x9e

// enter imm16, lvl8
mapping clause encdec = ENTER_285
  <-> 0xc8 @ imm16_le @ imm8

// leave
mapping clause encdec = LEAVE_286
  <-> 0xc9

// in AL, imm8
mapping clause encdec = IN_287
  <-> 0xe4 @ imm8

// in EAX, imm8
mapping clause encdec = IN_288
  <-> 0xe5 @ imm8

// in AX, imm8
mapping clause encdec = IN_289
  <-> 0x66 @ 0xe5 @ imm8

// out imm8, AL
mapping clause encdec = OUT_290
  <-> 0xe6 @ imm8

// out imm8, EAX
mapping clause encdec = OUT_291
  <-> 0xe7 @ imm8

// out imm8, AX
mapping clause encdec = OUT_292
  <-> 0x66 @ 0xe7 @ imm8

// in AL, DX
mapping clause encdec = IN_293
  <-> 0xec

// in EAX, DX
mapping clause encdec = IN_294
  <-> 0xed

// in AX, DX
mapping clause encdec = IN_295
  <-> 0x66 @ 0xed

// out DX, AL
mapping clause encdec = OUT_296
  <-> 0xee

// out DX, EAX
mapping clause encdec = OUT_297
  <-> 0xef

// out DX, AX
mapping clause encdec = OUT_298
  <-> 0x66 @ 0xef

// xlatb
mapping clause encdec = XLATB_299
  <-> 0xd7

// cwde
mapping clause encdec = CWDE_300
  <-> 0x98

// cbw
mapping clause encdec = CBW_301
  <-> 0x66 @ 0x98

// cdqe
mapping clause encdec = CDQE_302
  <-> rex(0b1, R, X, B) @ 0x98

// cdq
mapping clause encdec = CDQ_303
  <-> 0x99

// cwd
mapping clause encdec = CWD_304
  <-> 0x66 @ 0x99

// cqo
mapping clause encdec = CQO_305
  <-> rex(0b1, R, X, B) @ 0x99

// rol r/m8, 1
mapping clause encdec = ROL_306
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b000)

// rol r/m32, 1
mapping clause encdec = ROL_307
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b000)

// rol r/m16, 1
mapping clause encdec = ROL_308
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b000)

// rol r/m64, 1
mapping clause encdec = ROL_309
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b000)

// rol r/m8, CL
mapping clause encdec = ROL_310
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b000)

// rol r/m32, CL
mapping clause encdec = ROL_311
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b000)

// rol r/m16, CL
mapping clause encdec = ROL_312
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b000)

// rol r/m64, CL
mapping clause encdec = ROL_313
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b000)

// rol r/m8, imm8
mapping clause encdec = ROL_314
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b000) @ imm8

// rol r/m32, imm8
mapping clause encdec = ROL_315
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b000) @ imm8

// rol r/m16, imm8
mapping clause encdec = ROL_316
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b000) @ imm8

// rol r/m64, imm8
mapping clause encdec = ROL_317
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b000) @ imm8

// ror r/m8, 1
mapping clause encdec = ROR_318
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b001)

// ror r/m32, 1
mapping clause encdec = ROR_319
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b001)

// ror r/m16, 1
mapping clause encdec = ROR_320
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b001)

// ror r/m64, 1
mapping clause encdec = ROR_321
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b001)

// ror r/m8, CL
mapping clause encdec = ROR_322
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b001)

// ror r/m32, CL
mapping clause encdec = ROR_323
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b001)

// ror r/m16, CL
mapping clause encdec = ROR_324
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b001)

// ror r/m64, CL
mapping clause encdec = ROR_325
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b001)

// ror r/m8, imm8
mapping clause encdec = ROR_326
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b001) @ imm8

// ror r/m32, imm8
mapping clause encdec = ROR_327
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b001) @ imm8

// ror r/m16, imm8
mapping clause encdec = ROR_328
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b001) @ imm8

// ror r/m64, imm8
mapping clause encdec = ROR_329
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b001) @ imm8

// rcl r/m8, 1
mapping clause encdec = RCL_330
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b010)

// rcl r/m32, 1
mapping clause encdec = RCL_331
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b010)

// rcl r/m16, 1
mapping clause encdec = RCL_332
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b010)

// rcl r/m64, 1
mapping clause encdec = RCL_333
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b010)

// rcl r/m8, CL
mapping clause encdec = RCL_334
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b010)

// rcl r/m32, CL
mapping clause encdec = RCL_335
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b010)

// rcl r/m16, CL
mapping clause encdec = RCL_336
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b010)

// rcl r/m64, CL
mapping clause encdec = RCL_337
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b010)

// rcl r/m8, imm8
mapping clause encdec = RCL_338
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b010) @ imm8

// rcl r/m32, imm8
mapping clause encdec = RCL_339
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b010) @ imm8

// rcl r/m16, imm8
mapping clause encdec = RCL_340
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b010) @ imm8

// rcl r/m64, imm8
mapping clause encdec = RCL_341
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b010) @ imm8

// rcr r/m8, 1
mapping clause encdec = RCR_342
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b011)

// rcr r/m32, 1
mapping clause encdec = RCR_343
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b011)

// rcr r/m16, 1
mapping clause encdec = RCR_344
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b011)

// rcr r/m64, 1
mapping clause encdec = RCR_345
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b011)

// rcr r/m8, CL
mapping clause encdec = RCR_346
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b011)

// rcr r/m32, CL
mapping clause encdec = RCR_347
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b011)

// rcr r/m16, CL
mapping clause encdec = RCR_348
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b011)

// rcr r/m64, CL
mapping clause encdec = RCR_349
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b011)

// rcr r/m8, imm8
mapping clause encdec = RCR_350
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b011) @ imm8

// rcr r/m32, imm8
mapping clause encdec = RCR_351
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b011) @ imm8

// rcr r/m16, imm8
mapping clause encdec = RCR_352
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b011) @ imm8

// rcr r/m64, imm8
mapping clause encdec = RCR_353
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b011) @ imm8

// shl r/m8, 1
mapping clause encdec = SHL_354
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b100)

// shl r/m32, 1
mapping clause encdec = SHL_355
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b100)

// shl r/m16, 1
mapping clause encdec = SHL_356
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b100)

// shl r/m64, 1
mapping clause encdec = SHL_357
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b100)

// shl r/m8, CL
mapping clause encdec = SHL_358
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b100)

// shl r/m32, CL
mapping clause encdec = SHL_359
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b100)

// shl r/m16, CL
mapping clause encdec = SHL_360
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b100)

// shl r/m64, CL
mapping clause encdec = SHL_361
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b100)

// shl r/m8, imm8
mapping clause encdec = SHL_362
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b100) @ imm8

// shl r/m32, imm8
mapping clause encdec = SHL_363
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b100) @ imm8

// shl r/m16, imm8
mapping clause encdec = SHL_364
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b100) @ imm8

// shl r/m64, imm8
mapping clause encdec = SHL_365
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b100) @ imm8

// shr r/m8, 1
mapping clause encdec = SHR_366
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b101)

// shr r/m32, 1
mapping clause encdec = SHR_367
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b101)

// shr r/m16, 1
mapping clause encdec = SHR_368
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b101)

// shr r/m64, 1
mapping clause encdec = SHR_369
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b101)

// shr r/m8, CL
mapping clause encdec = SHR_370
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b101)

// shr r/m32, CL
mapping clause encdec = SHR_371
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b101)

// shr r/m16, CL
mapping clause encdec = SHR_372
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b101)

// shr r/m64, CL
mapping clause encdec = SHR_373
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b101)

// shr r/m8, imm8
mapping clause encdec = SHR_374
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b101) @ imm8

// shr r/m32, imm8
mapping clause encdec = SHR_375
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b101) @ imm8

// shr r/m16, imm8
mapping clause encdec = SHR_376
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b101) @ imm8

// shr r/m64, imm8
mapping clause encdec = SHR_377
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b101) @ imm8

// sar r/m8, 1
mapping clause encdec = SAR_378
  <-> rex(0b0, R, X, B)? @ 0xd0 @ modrm(rm, 0b111)

// sar r/m32, 1
mapping clause encdec = SAR_379
  <-> rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b111)

// sar r/m16, 1
mapping clause encdec = SAR_380
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd1 @ modrm(rm, 0b111)

// sar r/m64, 1
mapping clause encdec = SAR_381
  <-> rex(0b1, R, X, B) @ 0xd1 @ modrm(rm, 0b111)

// sar r/m8, CL
mapping clause encdec = SAR_382
  <-> rex(0b0, R, X, B)? @ 0xd2 @ modrm(rm, 0b111)

// sar r/m32, CL
mapping clause encdec = SAR_383
  <-> rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b111)

// sar r/m16, CL
mapping clause encdec = SAR_384
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xd3 @ modrm(rm, 0b111)

// sar r/m64, CL
mapping clause encdec = SAR_385
  <-> rex(0b1, R, X, B) @ 0xd3 @ modrm(rm, 0b111)

// sar r/m8, imm8
mapping clause encdec = SAR_386
  <-> rex(0b0, R, X, B)? @ 0xc0 @ modrm(rm, 0b111) @ imm8

// sar r/m32, imm8
mapping clause encdec = SAR_387
  <-> rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b111) @ imm8

// sar r/m16, imm8
mapping clause encdec = SAR_388
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0xc1 @ modrm(rm, 0b111) @ imm8

// sar r/m64, imm8
mapping clause encdec = SAR_389
  <-> rex(0b1, R, X, B) @ 0xc1 @ modrm(rm, 0b111) @ imm8

// shld r/m32, r32, imm8
mapping clause encdec = SHLD_390
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xa4 @ modrm(rm, reg) @ imm8

// shld r/m16, r16, imm8
mapping clause encdec = SHLD_391
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xa4 @ modrm(rm, reg) @ imm8

// shld r/m64, r64, imm8
mapping clause encdec = SHLD_392
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xa4 @ modrm(rm, reg) @ imm8

// shld r/m32, r32, CL
mapping clause encdec = SHLD_393
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xa5 @ modrm(rm, reg)

// shld r/m16, r16, CL
mapping clause encdec = SHLD_394
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xa5 @ modrm(rm, reg)

// shld r/m64, r64, CL
mapping clause encdec = SHLD_395
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xa5 @ modrm(rm, reg)

// shrd r/m32, r32, imm8
mapping clause encdec = SHRD_396
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xac @ modrm(rm, reg) @ imm8

// shrd r/m16, r16, imm8
mapping clause encdec = SHRD_397
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xac @ modrm(rm, reg) @ imm8

// shrd r/m64, r64, imm8
mapping clause encdec = SHRD_398
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xac @ modrm(rm, reg) @ imm8

// shrd r/m32, r32, CL
mapping clause encdec = SHRD_399
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xad @ modrm(rm, reg)

// shrd r/m16, r16, CL
mapping clause encdec = SHRD_400
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xad @ modrm(rm, reg)

// shrd r/m64, r64, CL
mapping clause encdec = SHRD_401
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xad @ modrm(rm, reg)

// bt r/m32, r32
mapping clause encdec = BT_402
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xa3 @ modrm(rm, reg)

// bt r/m16, r16
mapping clause encdec = BT_403
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xa3 @ modrm(rm, reg)

// bt r/m64, r64
mapping clause encdec = BT_404
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xa3 @ modrm(rm, reg)

// bt r/m32, imm8
mapping clause encdec = BT_405
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b100) @ imm8

// bt r/m16, imm8
mapping clause encdec = BT_406
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b100) @ imm8

// bt r/m64, imm8
mapping clause encdec = BT_407
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xba @ modrm(rm, 0b100) @ imm8

// bts r/m32, r32
mapping clause encdec = BTS_408
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xab @ modrm(rm, reg)

// bts r/m16, r16
mapping clause encdec = BTS_409
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xab @ modrm(rm, reg)

// bts r/m64, r64
mapping clause encdec = BTS_410
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xab @ modrm(rm, reg)

// bts r/m32, imm8
mapping clause encdec = BTS_411
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b101) @ imm8

// bts r/m16, imm8
mapping clause encdec = BTS_412
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b101) @ imm8

// bts r/m64, imm8
mapping clause encdec = BTS_413
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xba @ modrm(rm, 0b101) @ imm8

// btr r/m32, r32
mapping clause encdec = BTR_414
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb3 @ modrm(rm, reg)

// btr r/m16, r16
mapping clause encdec = BTR_415
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb3 @ modrm(rm, reg)

// btr r/m64, r64
mapping clause encdec = BTR_416
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb3 @ modrm(rm, reg)

// btr r/m32, imm8
mapping clause encdec = BTR_417
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b110) @ imm8

// btr r/m16, imm8
mapping clause encdec = BTR_418
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b110) @ imm8

// btr r/m64, imm8
mapping clause encdec = BTR_419
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xba @ modrm(rm, 0b110) @ imm8

// btc r/m32, r32
mapping clause encdec = BTC_420
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xbb @ modrm(rm, reg)

// btc r/m16, r16
mapping clause encdec = BTC_421
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xbb @ modrm(rm, reg)

// btc r/m64, r64
mapping clause encdec = BTC_422
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xbb @ modrm(rm, reg)

// btc r/m32, imm8
mapping clause encdec = BTC_423
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b111) @ imm8

// btc r/m16, imm8
mapping clause encdec = BTC_424
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xba @ modrm(rm, 0b111) @ imm8

// btc r/m64, imm8
mapping clause encdec = BTC_425
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xba @ modrm(rm, 0b111) @ imm8

// bsf r32, r/m32
mapping clause encdec = BSF_426
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xbc @ modrm(rm, reg)

// bsf r16, r/m16
mapping clause encdec = BSF_427
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xbc @ modrm(rm, reg)

// bsf r64, r/m64
mapping clause encdec = BSF_428
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xbc @ modrm(rm, reg)

// bsr r32, r/m32
mapping clause encdec = BSR_429
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xbd @ modrm(rm, reg)

// bsr r16, r/m16
mapping clause encdec = BSR_430
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xbd @ modrm(rm, reg)

// bsr r64, r/m64
mapping clause encdec = BSR_431
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xbd @ modrm(rm, reg)

// set~cc r/m8
mapping clause encdec = SETCC_432
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0b1001 @ cc @ modrm(rm, 0b000)

// cmov~cc r32, r/m32
mapping clause encdec = CMOVCC_433
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0b0100 @ cc @ modrm(rm, reg)

// cmov~cc r16, r/m16
mapping clause encdec = CMOVCC_434
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0b0100 @ cc @ modrm(rm, reg)

// cmov~cc r64, r/m64
mapping clause encdec = CMOVCC_435
  <-> rex(0b1, R, X, B) @ 0x0f @ 0b0100 @ cc @ modrm(rm, reg)

// bswap r32
mapping clause encdec = BSWAP_436
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0b11001 @ reg

// bswap r64
mapping clause encdec = BSWAP_437
  <-> rex(0b1, R, X, B) @ 0x0f @ 0b11001 @ reg

// cmpxchg r/m8, r8
mapping clause encdec = CMPXCHG_438
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb0 @ modrm(rm, reg)

// cmpxchg r/m32, r32
mapping clause encdec = CMPXCHG_439
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xb1 @ modrm(rm, reg)

// cmpxchg r/m16, r16
mapping clause encdec = CMPXCHG_440
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xb1 @ modrm(rm, reg)

// cmpxchg r/m64, r64
mapping clause encdec = CMPXCHG_441
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xb1 @ modrm(rm, reg)

// xadd r/m8, r8
mapping clause encdec = XADD_442
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xc0 @ modrm(rm, reg)

// xadd r/m32, r32
mapping clause encdec = XADD_443
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0xc1 @ modrm(rm, reg)

// xadd r/m16, r16
mapping clause encdec = XADD_444
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0xc1 @ modrm(rm, reg)

// xadd r/m64, r64
mapping clause encdec = XADD_445
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xc1 @ modrm(rm, reg)

// cmpxchg8b m64
mapping clause encdec = CMPXCHG8B_446
  <-> 0x0f @ 0xc7 @ modrm(rm, 0b001)

// cmpxchg16b m128
mapping clause encdec = CMPXCHG16B_447
  <-> rex(0b1, R, X, B) @ 0x0f @ 0xc7 @ modrm(rm, 0b001)

// movsb
mapping clause encdec = MOVSB_448
  <-> 0xa4

// movsd
mapping clause encdec = MOVSD_449
  <-> 0xa5

// movsw
mapping clause encdec = MOVSW_450
  <-> 0x66 @ 0xa5

// movsq
mapping clause encdec = MOVSQ_451
  <-> rex(0b1, R, X, B) @ 0xa5

// cmpsb
mapping clause encdec = CMPSB_452
  <-> 0xa6

// cmpsd
mapping clause encdec = CMPSD_453
  <-> 0xa7

// cmpsw
mapping clause encdec = CMPSW_454
  <-> 0x66 @ 0xa7

// cmpsq
mapping clause encdec = CMPSQ_455
  <-> rex(0b1, R, X, B) @ 0xa7

// stosb
mapping clause encdec = STOSB_456
  <-> 0xaa

// stosd
mapping clause encdec = STOSD_457
  <-> 0xab

// stosw
mapping clause encdec = STOSW_458
  <-> 0x66 @ 0xab

// stosq
mapping clause encdec = STOSQ_459
  <-> rex(0b1, R, X, B) @ 0xab

// lodsb
mapping clause encdec = LODSB_460
  <-> 0xac

// lodsd
mapping clause encdec = LODSD_461
  <-> 0xad

// lodsw
mapping clause encdec = LODSW_462
  <-> 0x66 @ 0xad

// lodsq
mapping clause encdec = LODSQ_463
  <-> rex(0b1, R, X, B) @ 0xad

// scasb
mapping clause encdec = SCASB_464
  <-> 0xae

// scasd
mapping clause encdec = SCASD_465
  <-> 0xaf

// scasw
mapping clause encdec = SCASW_466
  <-> 0x66 @ 0xaf

// scasq
mapping clause encdec = SCASQ_467
  <-> rex(0b1, R, X, B) @ 0xaf

// insb
mapping clause encdec = INSB_468
  <-> 0x6c

// insd
mapping clause encdec = INSD_469
  <-> 0x6d

// insw
mapping clause encdec = INSW_470
  <-> 0x66 @ 0x6d

// outsb
mapping clause encdec = OUTSB_471
  <-> 0x6e

// outsd
mapping clause encdec = OUTSD_472
  <-> 0x6f

// outsw
mapping clause encdec = OUTSW_473
  <-> 0x66 @ 0x6f

// call rel32
mapping clause encdec = CALL_474
  <-> 0xe8 @ rel32_le

// call r/m64
mapping clause encdec = CALL_475
  <-> rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b010)

// call FAR m16:32
mapping clause encdec = CALL_476
  <-> 0xff @ modrm(rm, 0b011)

// call FAR m16:64
mapping clause encdec = CALL_477
  <-> rex(0b1, R, X, B) @ 0xff @ modrm(rm, 0b011)

// jmp rel32
mapping clause encdec = JMP_478
  <-> 0xe9 @ rel32_le

// jmp rel8
mapping clause encdec = JMP_479
  <-> 0xeb @ rel8

// jmp r/m64
mapping clause encdec = JMP_480
  <-> rex(0b0, R, X, B)? @ 0xff @ modrm(rm, 0b100)

// jmp FAR m16:32
mapping clause encdec = JMP_481
  <-> 0xff @ modrm(rm, 0b101)

// jmp FAR m16:64
mapping clause encdec = JMP_482
  <-> rex(0b1, R, X, B) @ 0xff @ modrm(rm, 0b101)

// j~cc rel8
mapping clause encdec = JCC_483
  <-> 0b0111 @ cc @ rel8

// j~cc rel32
mapping clause encdec = JCC_484
  <-> 0x0f @ 0b1000 @ cc @ rel32_le

// loop rel8
mapping clause encdec = LOOP_485
  <-> 0xe2 @ rel8

// loope rel8
mapping clause encdec = LOOPE_486
  <-> 0xe1 @ rel8

// loopne rel8
mapping clause encdec = LOOPNE_487
  <-> 0xe0 @ rel8

// jrcxz rel8
mapping clause encdec = JRCXZ_488
  <-> 0xe3 @ rel8

// ret
mapping clause encdec = RET_489
  <-> 0xc3

// retw
mapping clause encdec = RETW_490
  <-> 0x66 @ 0xc3

// ret imm16
mapping clause encdec = RET_491
  <-> 0xc2 @ imm16_le

// retw imm16
mapping clause encdec = RETW_492
  <-> 0x66 @ 0xc2 @ imm16_le

// retf
mapping clause encdec = RETF_493
  <-> 0xcb

// retfw
mapping clause encdec = RETFW_494
  <-> 0x66 @ 0xcb

// retfq
mapping clause encdec = RETFQ_495
  <-> rex(0b1, R, X, B) @ 0xcb

// retf imm16
mapping clause encdec = RETF_496
  <-> 0xca @ imm16_le

// retfw imm16
mapping clause encdec = RETFW_497
  <-> 0x66 @ 0xca @ imm16_le

// retfq imm16
mapping clause encdec = RETFQ_498
  <-> rex(0b1, R, X, B) @ 0xca @ imm16_le

// int imm8
mapping clause encdec = INT_499
  <-> 0xcd @ imm8

// int3
mapping clause encdec = INT3_500
  <-> 0xcc

// iretd
mapping clause encdec = IRETD_501
  <-> 0xcf

// iretw
mapping clause encdec = IRETW_502
  <-> 0x66 @ 0xcf

// iretq
mapping clause encdec = IRETQ_503
  <-> rex(0b1, R, X, B) @ 0xcf

// clc
mapping clause encdec = CLC_504
  <-> 0xf8

// stc
mapping clause encdec = STC_505
  <-> 0xf9

// cmc
mapping clause encdec = CMC_506
  <-> 0xf5

// cld
mapping clause encdec = CLD_507
  <-> 0xfc

// std
mapping clause encdec = STD_508
  <-> 0xfd

// cli
mapping clause encdec = CLI_509
  <-> 0xfa

// sti
mapping clause encdec = STI_510
  <-> 0xfb

// hlt
mapping clause encdec = HLT_511
  <-> 0xf4

// wait
mapping clause encdec = WAIT_512
  <-> 0x9b

// nop
mapping clause encdec = NOP_513
  <-> 0x90

// nop r/m32
mapping clause encdec = NOP_514
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x1f @ modrm(rm, 0b000)

// nop r/m16
mapping clause encdec = NOP_515
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x1f @ modrm(rm, 0b000)

// nop r/m64
mapping clause encdec = NOP_516
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x1f @ modrm(rm, 0b000)

// cpuid
mapping clause encdec = CPUID_517
  <-> 0x0f @ 0xa2

// rdtsc
mapping clause encdec = RDTSC_518
  <-> 0x0f @ 0x31

// rdpmc
mapping clause encdec = RDPMC_519
  <-> 0x0f @ 0x33

// ud2
mapping clause encdec = UD2_520
  <-> 0x0f @ 0x0b

// lock
mapping clause encdec = LOCK_521
  <-> 0xf0

// rep
mapping clause encdec = REP_522
  <-> 0xf3

// repne
mapping clause encdec = REPNE_523
  <-> 0xf2

// fs
mapping clause encdec = FS_524
  <-> 0x64

// gs
mapping clause encdec = GS_525
  <-> 0x65

// data16
mapping clause encdec = DATA16_526
  <-> 0x66

// addr32
mapping clause encdec = ADDR32_527
  <-> rex(0b0, R, X, B)? @ 0x67

// lgdt m
mapping clause encdec = LGDT_528
  <-> 0x0f @ 0x01 @ modrm(rm, 0b010)

// lidt m
mapping clause encdec = LIDT_529
  <-> 0x0f @ 0x01 @ modrm(rm, 0b011)

// sgdt m
mapping clause encdec = SGDT_530
  <-> 0x0f @ 0x01 @ modrm(rm, 0b000)

// sidt m
mapping clause encdec = SIDT_531
  <-> 0x0f @ 0x01 @ modrm(rm, 0b001)

// invlpg m
mapping clause encdec = INVLPG_532
  <-> 0x0f @ 0x01 @ modrm(rm, 0b111)

// lmsw r/m16
mapping clause encdec = LMSW_533
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x01 @ modrm(rm, 0b110)

// smsw r/m32 (register form only)
mapping clause encdec = SMSW_534
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x01 @ modrm(rm, 0b100)

// smsw r/m16 (register form only)
mapping clause encdec = SMSW_535
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x01 @ modrm(rm, 0b100)

// smsw r/m64 (register form only)
mapping clause encdec = SMSW_536
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x01 @ modrm(rm, 0b100)

// smsw m16
mapping clause encdec = SMSW_537
  <-> 0x0f @ 0x01 @ modrm(rm, 0b100)

// lldt r/m16
mapping clause encdec = LLDT_538
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b010)

// ltr r/m16
mapping clause encdec = LTR_539
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b011)

// sldt r/m32 (register form only)
mapping clause encdec = SLDT_540
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b000)

// sldt r/m16 (register form only)
mapping clause encdec = SLDT_541
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b000)

// sldt r/m64 (register form only)
mapping clause encdec = SLDT_542
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x00 @ modrm(rm, 0b000)

// sldt m16
mapping clause encdec = SLDT_543
  <-> 0x0f @ 0x00 @ modrm(rm, 0b000)

// str r/m32 (register form only)
mapping clause encdec = STR_544
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b001)

// str r/m16 (register form only)
mapping clause encdec = STR_545
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b001)

// str r/m64 (register form only)
mapping clause encdec = STR_546
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x00 @ modrm(rm, 0b001)

// str m16
mapping clause encdec = STR_547
  <-> 0x0f @ 0x00 @ modrm(rm, 0b001)

// verr r/m16
mapping clause encdec = VERR_548
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b100)

// verw r/m16
mapping clause encdec = VERW_549
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x00 @ modrm(rm, 0b101)

// lar r32, r/m16
mapping clause encdec = LAR_550
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x02 @ modrm(rm, reg)

// lar r16, r/m16
mapping clause encdec = LAR_551
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x02 @ modrm(rm, reg)

// lar r64, r/m16
mapping clause encdec = LAR_552
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x02 @ modrm(rm, reg)

// lsl r32, r/m16
mapping clause encdec = LSL_553
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x03 @ modrm(rm, reg)

// lsl r16, r/m16
mapping clause encdec = LSL_554
  <-> 0x66 @ rex(0b0, R, X, B)? @ 0x0f @ 0x03 @ modrm(rm, reg)

// lsl r64, r/m16
mapping clause encdec = LSL_555
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x03 @ modrm(rm, reg)

// clts
mapping clause encdec = CLTS_556
  <-> 0x0f @ 0x06

// mov r/m64, CRn (register form only)
mapping clause encdec = MOV_557
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x20 @ modrm(rm, reg)

// mov CRn, r/m64 (register form only)
mapping clause encdec = MOV_558
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x22 @ modrm(rm, reg)

// mov r/m64, DRn (register form only)
mapping clause encdec = MOV_559
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x21 @ modrm(rm, reg)

// mov DRn, r/m64 (register form only)
mapping clause encdec = MOV_560
  <-> rex(0b0, R, X, B)? @ 0x0f @ 0x23 @ modrm(rm, reg)

// invd
mapping clause encdec = INVD_561
  <-> 0x0f @ 0x08

// wbinvd
mapping clause encdec = WBINVD_562
  <-> 0x0f @ 0x09

// rdmsr
mapping clause encdec = RDMSR_563
  <-> 0x0f @ 0x32

// wrmsr
mapping clause encdec = WRMSR_564
  <-> 0x0f @ 0x30

// rsm
mapping clause encdec = RSM_565
  <-> 0x0f @ 0xaa

// sysenter
mapping clause encdec = SYSENTER_566
  <-> 0x0f @ 0x34

// sysexit
mapping clause encdec = SYSEXIT_567
  <-> 0x0f @ 0x35

// syscall
mapping clause encdec = SYSCALL_568
  <-> 0x0f @ 0x05

// sysret
mapping clause encdec = SYSRET_569
  <-> 0x0f @ 0x07

// swapgs
mapping clause encdec = SWAPGS_570
  <-> 0x0f @ 0x01 @ 0xf8

// sysretq
mapping clause encdec = SYSRETQ_571
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x07

// sysexitq
mapping clause encdec = SYSEXITQ_572
  <-> rex(0b1, R, X, B) @ 0x0f @ 0x35

end instruction
