// IA-32 (the integer and system instructions up to the Pentium Pro): encodings, a clause per instruction and operand size.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by
// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's opcode table notation), each
// line of which is checked against LLVM's X86 records (opcode, map, form, operand size, prefixes, immediate). Only the
// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; values little-endian.
// modrm(rm, reg) is a ModRM byte and what follows it (SIB, displacement) in 32 bit addressing; the sheet shows a
// row per form of it. 
// Licensed CC BY-SA 4.0 like the sheets.

scattered union instruction
// add r/m8, r8
mapping clause encdec = ADD_0
  <-> 0x00 @ modrm(rm, reg)

// add r/m32, r32
mapping clause encdec = ADD_1
  <-> 0x01 @ modrm(rm, reg)

// add r/m16, r16
mapping clause encdec = ADD_2
  <-> 0x66 @ 0x01 @ modrm(rm, reg)

// add r8, r/m8
mapping clause encdec = ADD_3
  <-> 0x02 @ modrm(rm, reg)

// add r32, r/m32
mapping clause encdec = ADD_4
  <-> 0x03 @ modrm(rm, reg)

// add r16, r/m16
mapping clause encdec = ADD_5
  <-> 0x66 @ 0x03 @ modrm(rm, reg)

// add AL, imm8
mapping clause encdec = ADD_6
  <-> 0x04 @ imm8

// add EAX, imm32
mapping clause encdec = ADD_7
  <-> 0x05 @ imm32_le

// add AX, imm16
mapping clause encdec = ADD_8
  <-> 0x66 @ 0x05 @ imm16_le

// add r/m8, imm8
mapping clause encdec = ADD_9
  <-> 0x80 @ modrm(rm, 0b000) @ imm8

// add r/m32, imm32
mapping clause encdec = ADD_10
  <-> 0x81 @ modrm(rm, 0b000) @ imm32_le

// add r/m16, imm16
mapping clause encdec = ADD_11
  <-> 0x66 @ 0x81 @ modrm(rm, 0b000) @ imm16_le

// add r/m32, simm8
mapping clause encdec = ADD_12
  <-> 0x83 @ modrm(rm, 0b000) @ imm8

// add r/m16, simm8
mapping clause encdec = ADD_13
  <-> 0x66 @ 0x83 @ modrm(rm, 0b000) @ imm8

// or r/m8, r8
mapping clause encdec = OR_14
  <-> 0x08 @ modrm(rm, reg)

// or r/m32, r32
mapping clause encdec = OR_15
  <-> 0x09 @ modrm(rm, reg)

// or r/m16, r16
mapping clause encdec = OR_16
  <-> 0x66 @ 0x09 @ modrm(rm, reg)

// or r8, r/m8
mapping clause encdec = OR_17
  <-> 0x0a @ modrm(rm, reg)

// or r32, r/m32
mapping clause encdec = OR_18
  <-> 0x0b @ modrm(rm, reg)

// or r16, r/m16
mapping clause encdec = OR_19
  <-> 0x66 @ 0x0b @ modrm(rm, reg)

// or AL, imm8
mapping clause encdec = OR_20
  <-> 0x0c @ imm8

// or EAX, imm32
mapping clause encdec = OR_21
  <-> 0x0d @ imm32_le

// or AX, imm16
mapping clause encdec = OR_22
  <-> 0x66 @ 0x0d @ imm16_le

// or r/m8, imm8
mapping clause encdec = OR_23
  <-> 0x80 @ modrm(rm, 0b001) @ imm8

// or r/m32, imm32
mapping clause encdec = OR_24
  <-> 0x81 @ modrm(rm, 0b001) @ imm32_le

// or r/m16, imm16
mapping clause encdec = OR_25
  <-> 0x66 @ 0x81 @ modrm(rm, 0b001) @ imm16_le

// or r/m32, simm8
mapping clause encdec = OR_26
  <-> 0x83 @ modrm(rm, 0b001) @ imm8

// or r/m16, simm8
mapping clause encdec = OR_27
  <-> 0x66 @ 0x83 @ modrm(rm, 0b001) @ imm8

// adc r/m8, r8
mapping clause encdec = ADC_28
  <-> 0x10 @ modrm(rm, reg)

// adc r/m32, r32
mapping clause encdec = ADC_29
  <-> 0x11 @ modrm(rm, reg)

// adc r/m16, r16
mapping clause encdec = ADC_30
  <-> 0x66 @ 0x11 @ modrm(rm, reg)

// adc r8, r/m8
mapping clause encdec = ADC_31
  <-> 0x12 @ modrm(rm, reg)

// adc r32, r/m32
mapping clause encdec = ADC_32
  <-> 0x13 @ modrm(rm, reg)

// adc r16, r/m16
mapping clause encdec = ADC_33
  <-> 0x66 @ 0x13 @ modrm(rm, reg)

// adc AL, imm8
mapping clause encdec = ADC_34
  <-> 0x14 @ imm8

// adc EAX, imm32
mapping clause encdec = ADC_35
  <-> 0x15 @ imm32_le

// adc AX, imm16
mapping clause encdec = ADC_36
  <-> 0x66 @ 0x15 @ imm16_le

// adc r/m8, imm8
mapping clause encdec = ADC_37
  <-> 0x80 @ modrm(rm, 0b010) @ imm8

// adc r/m32, imm32
mapping clause encdec = ADC_38
  <-> 0x81 @ modrm(rm, 0b010) @ imm32_le

// adc r/m16, imm16
mapping clause encdec = ADC_39
  <-> 0x66 @ 0x81 @ modrm(rm, 0b010) @ imm16_le

// adc r/m32, simm8
mapping clause encdec = ADC_40
  <-> 0x83 @ modrm(rm, 0b010) @ imm8

// adc r/m16, simm8
mapping clause encdec = ADC_41
  <-> 0x66 @ 0x83 @ modrm(rm, 0b010) @ imm8

// sbb r/m8, r8
mapping clause encdec = SBB_42
  <-> 0x18 @ modrm(rm, reg)

// sbb r/m32, r32
mapping clause encdec = SBB_43
  <-> 0x19 @ modrm(rm, reg)

// sbb r/m16, r16
mapping clause encdec = SBB_44
  <-> 0x66 @ 0x19 @ modrm(rm, reg)

// sbb r8, r/m8
mapping clause encdec = SBB_45
  <-> 0x1a @ modrm(rm, reg)

// sbb r32, r/m32
mapping clause encdec = SBB_46
  <-> 0x1b @ modrm(rm, reg)

// sbb r16, r/m16
mapping clause encdec = SBB_47
  <-> 0x66 @ 0x1b @ modrm(rm, reg)

// sbb AL, imm8
mapping clause encdec = SBB_48
  <-> 0x1c @ imm8

// sbb EAX, imm32
mapping clause encdec = SBB_49
  <-> 0x1d @ imm32_le

// sbb AX, imm16
mapping clause encdec = SBB_50
  <-> 0x66 @ 0x1d @ imm16_le

// sbb r/m8, imm8
mapping clause encdec = SBB_51
  <-> 0x80 @ modrm(rm, 0b011) @ imm8

// sbb r/m32, imm32
mapping clause encdec = SBB_52
  <-> 0x81 @ modrm(rm, 0b011) @ imm32_le

// sbb r/m16, imm16
mapping clause encdec = SBB_53
  <-> 0x66 @ 0x81 @ modrm(rm, 0b011) @ imm16_le

// sbb r/m32, simm8
mapping clause encdec = SBB_54
  <-> 0x83 @ modrm(rm, 0b011) @ imm8

// sbb r/m16, simm8
mapping clause encdec = SBB_55
  <-> 0x66 @ 0x83 @ modrm(rm, 0b011) @ imm8

// and r/m8, r8
mapping clause encdec = AND_56
  <-> 0x20 @ modrm(rm, reg)

// and r/m32, r32
mapping clause encdec = AND_57
  <-> 0x21 @ modrm(rm, reg)

// and r/m16, r16
mapping clause encdec = AND_58
  <-> 0x66 @ 0x21 @ modrm(rm, reg)

// and r8, r/m8
mapping clause encdec = AND_59
  <-> 0x22 @ modrm(rm, reg)

// and r32, r/m32
mapping clause encdec = AND_60
  <-> 0x23 @ modrm(rm, reg)

// and r16, r/m16
mapping clause encdec = AND_61
  <-> 0x66 @ 0x23 @ modrm(rm, reg)

// and AL, imm8
mapping clause encdec = AND_62
  <-> 0x24 @ imm8

// and EAX, imm32
mapping clause encdec = AND_63
  <-> 0x25 @ imm32_le

// and AX, imm16
mapping clause encdec = AND_64
  <-> 0x66 @ 0x25 @ imm16_le

// and r/m8, imm8
mapping clause encdec = AND_65
  <-> 0x80 @ modrm(rm, 0b100) @ imm8

// and r/m32, imm32
mapping clause encdec = AND_66
  <-> 0x81 @ modrm(rm, 0b100) @ imm32_le

// and r/m16, imm16
mapping clause encdec = AND_67
  <-> 0x66 @ 0x81 @ modrm(rm, 0b100) @ imm16_le

// and r/m32, simm8
mapping clause encdec = AND_68
  <-> 0x83 @ modrm(rm, 0b100) @ imm8

// and r/m16, simm8
mapping clause encdec = AND_69
  <-> 0x66 @ 0x83 @ modrm(rm, 0b100) @ imm8

// sub r/m8, r8
mapping clause encdec = SUB_70
  <-> 0x28 @ modrm(rm, reg)

// sub r/m32, r32
mapping clause encdec = SUB_71
  <-> 0x29 @ modrm(rm, reg)

// sub r/m16, r16
mapping clause encdec = SUB_72
  <-> 0x66 @ 0x29 @ modrm(rm, reg)

// sub r8, r/m8
mapping clause encdec = SUB_73
  <-> 0x2a @ modrm(rm, reg)

// sub r32, r/m32
mapping clause encdec = SUB_74
  <-> 0x2b @ modrm(rm, reg)

// sub r16, r/m16
mapping clause encdec = SUB_75
  <-> 0x66 @ 0x2b @ modrm(rm, reg)

// sub AL, imm8
mapping clause encdec = SUB_76
  <-> 0x2c @ imm8

// sub EAX, imm32
mapping clause encdec = SUB_77
  <-> 0x2d @ imm32_le

// sub AX, imm16
mapping clause encdec = SUB_78
  <-> 0x66 @ 0x2d @ imm16_le

// sub r/m8, imm8
mapping clause encdec = SUB_79
  <-> 0x80 @ modrm(rm, 0b101) @ imm8

// sub r/m32, imm32
mapping clause encdec = SUB_80
  <-> 0x81 @ modrm(rm, 0b101) @ imm32_le

// sub r/m16, imm16
mapping clause encdec = SUB_81
  <-> 0x66 @ 0x81 @ modrm(rm, 0b101) @ imm16_le

// sub r/m32, simm8
mapping clause encdec = SUB_82
  <-> 0x83 @ modrm(rm, 0b101) @ imm8

// sub r/m16, simm8
mapping clause encdec = SUB_83
  <-> 0x66 @ 0x83 @ modrm(rm, 0b101) @ imm8

// xor r/m8, r8
mapping clause encdec = XOR_84
  <-> 0x30 @ modrm(rm, reg)

// xor r/m32, r32
mapping clause encdec = XOR_85
  <-> 0x31 @ modrm(rm, reg)

// xor r/m16, r16
mapping clause encdec = XOR_86
  <-> 0x66 @ 0x31 @ modrm(rm, reg)

// xor r8, r/m8
mapping clause encdec = XOR_87
  <-> 0x32 @ modrm(rm, reg)

// xor r32, r/m32
mapping clause encdec = XOR_88
  <-> 0x33 @ modrm(rm, reg)

// xor r16, r/m16
mapping clause encdec = XOR_89
  <-> 0x66 @ 0x33 @ modrm(rm, reg)

// xor AL, imm8
mapping clause encdec = XOR_90
  <-> 0x34 @ imm8

// xor EAX, imm32
mapping clause encdec = XOR_91
  <-> 0x35 @ imm32_le

// xor AX, imm16
mapping clause encdec = XOR_92
  <-> 0x66 @ 0x35 @ imm16_le

// xor r/m8, imm8
mapping clause encdec = XOR_93
  <-> 0x80 @ modrm(rm, 0b110) @ imm8

// xor r/m32, imm32
mapping clause encdec = XOR_94
  <-> 0x81 @ modrm(rm, 0b110) @ imm32_le

// xor r/m16, imm16
mapping clause encdec = XOR_95
  <-> 0x66 @ 0x81 @ modrm(rm, 0b110) @ imm16_le

// xor r/m32, simm8
mapping clause encdec = XOR_96
  <-> 0x83 @ modrm(rm, 0b110) @ imm8

// xor r/m16, simm8
mapping clause encdec = XOR_97
  <-> 0x66 @ 0x83 @ modrm(rm, 0b110) @ imm8

// cmp r/m8, r8
mapping clause encdec = CMP_98
  <-> 0x38 @ modrm(rm, reg)

// cmp r/m32, r32
mapping clause encdec = CMP_99
  <-> 0x39 @ modrm(rm, reg)

// cmp r/m16, r16
mapping clause encdec = CMP_100
  <-> 0x66 @ 0x39 @ modrm(rm, reg)

// cmp r8, r/m8
mapping clause encdec = CMP_101
  <-> 0x3a @ modrm(rm, reg)

// cmp r32, r/m32
mapping clause encdec = CMP_102
  <-> 0x3b @ modrm(rm, reg)

// cmp r16, r/m16
mapping clause encdec = CMP_103
  <-> 0x66 @ 0x3b @ modrm(rm, reg)

// cmp AL, imm8
mapping clause encdec = CMP_104
  <-> 0x3c @ imm8

// cmp EAX, imm32
mapping clause encdec = CMP_105
  <-> 0x3d @ imm32_le

// cmp AX, imm16
mapping clause encdec = CMP_106
  <-> 0x66 @ 0x3d @ imm16_le

// cmp r/m8, imm8
mapping clause encdec = CMP_107
  <-> 0x80 @ modrm(rm, 0b111) @ imm8

// cmp r/m32, imm32
mapping clause encdec = CMP_108
  <-> 0x81 @ modrm(rm, 0b111) @ imm32_le

// cmp r/m16, imm16
mapping clause encdec = CMP_109
  <-> 0x66 @ 0x81 @ modrm(rm, 0b111) @ imm16_le

// cmp r/m32, simm8
mapping clause encdec = CMP_110
  <-> 0x83 @ modrm(rm, 0b111) @ imm8

// cmp r/m16, simm8
mapping clause encdec = CMP_111
  <-> 0x66 @ 0x83 @ modrm(rm, 0b111) @ imm8

// inc r/m8
mapping clause encdec = INC_112
  <-> 0xfe @ modrm(rm, 0b000)

// inc r/m32
mapping clause encdec = INC_113
  <-> 0xff @ modrm(rm, 0b000)

// inc r/m16
mapping clause encdec = INC_114
  <-> 0x66 @ 0xff @ modrm(rm, 0b000)

// inc r32
mapping clause encdec = INC_115
  <-> 0b01000 @ reg

// inc r16
mapping clause encdec = INC_116
  <-> 0x66 @ 0b01000 @ reg

// dec r/m8
mapping clause encdec = DEC_117
  <-> 0xfe @ modrm(rm, 0b001)

// dec r/m32
mapping clause encdec = DEC_118
  <-> 0xff @ modrm(rm, 0b001)

// dec r/m16
mapping clause encdec = DEC_119
  <-> 0x66 @ 0xff @ modrm(rm, 0b001)

// dec r32
mapping clause encdec = DEC_120
  <-> 0b01001 @ reg

// dec r16
mapping clause encdec = DEC_121
  <-> 0x66 @ 0b01001 @ reg

// not r/m8
mapping clause encdec = NOT_122
  <-> 0xf6 @ modrm(rm, 0b010)

// not r/m32
mapping clause encdec = NOT_123
  <-> 0xf7 @ modrm(rm, 0b010)

// not r/m16
mapping clause encdec = NOT_124
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b010)

// neg r/m8
mapping clause encdec = NEG_125
  <-> 0xf6 @ modrm(rm, 0b011)

// neg r/m32
mapping clause encdec = NEG_126
  <-> 0xf7 @ modrm(rm, 0b011)

// neg r/m16
mapping clause encdec = NEG_127
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b011)

// mul r/m8
mapping clause encdec = MUL_128
  <-> 0xf6 @ modrm(rm, 0b100)

// mul r/m32
mapping clause encdec = MUL_129
  <-> 0xf7 @ modrm(rm, 0b100)

// mul r/m16
mapping clause encdec = MUL_130
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b100)

// imul r/m8
mapping clause encdec = IMUL_131
  <-> 0xf6 @ modrm(rm, 0b101)

// imul r/m32
mapping clause encdec = IMUL_132
  <-> 0xf7 @ modrm(rm, 0b101)

// imul r/m16
mapping clause encdec = IMUL_133
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b101)

// div r/m8
mapping clause encdec = DIV_134
  <-> 0xf6 @ modrm(rm, 0b110)

// div r/m32
mapping clause encdec = DIV_135
  <-> 0xf7 @ modrm(rm, 0b110)

// div r/m16
mapping clause encdec = DIV_136
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b110)

// idiv r/m8
mapping clause encdec = IDIV_137
  <-> 0xf6 @ modrm(rm, 0b111)

// idiv r/m32
mapping clause encdec = IDIV_138
  <-> 0xf7 @ modrm(rm, 0b111)

// idiv r/m16
mapping clause encdec = IDIV_139
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b111)

// test r/m8, r8
mapping clause encdec = TEST_140
  <-> 0x84 @ modrm(rm, reg)

// test r/m32, r32
mapping clause encdec = TEST_141
  <-> 0x85 @ modrm(rm, reg)

// test r/m16, r16
mapping clause encdec = TEST_142
  <-> 0x66 @ 0x85 @ modrm(rm, reg)

// test AL, imm8
mapping clause encdec = TEST_143
  <-> 0xa8 @ imm8

// test EAX, imm32
mapping clause encdec = TEST_144
  <-> 0xa9 @ imm32_le

// test AX, imm16
mapping clause encdec = TEST_145
  <-> 0x66 @ 0xa9 @ imm16_le

// test r/m8, imm8
mapping clause encdec = TEST_146
  <-> 0xf6 @ modrm(rm, 0b000) @ imm8

// test r/m32, imm32
mapping clause encdec = TEST_147
  <-> 0xf7 @ modrm(rm, 0b000) @ imm32_le

// test r/m16, imm16
mapping clause encdec = TEST_148
  <-> 0x66 @ 0xf7 @ modrm(rm, 0b000) @ imm16_le

// imul r32, r/m32, imm32
mapping clause encdec = IMUL_149
  <-> 0x69 @ modrm(rm, reg) @ imm32_le

// imul r16, r/m16, imm16
mapping clause encdec = IMUL_150
  <-> 0x66 @ 0x69 @ modrm(rm, reg) @ imm16_le

// imul r32, r/m32, simm8
mapping clause encdec = IMUL_151
  <-> 0x6b @ modrm(rm, reg) @ imm8

// imul r16, r/m16, simm8
mapping clause encdec = IMUL_152
  <-> 0x66 @ 0x6b @ modrm(rm, reg) @ imm8

// imul r32, r/m32
mapping clause encdec = IMUL_153
  <-> 0x0f @ 0xaf @ modrm(rm, reg)

// imul r16, r/m16
mapping clause encdec = IMUL_154
  <-> 0x66 @ 0x0f @ 0xaf @ modrm(rm, reg)

// mov r/m8, r8
mapping clause encdec = MOV_155
  <-> 0x88 @ modrm(rm, reg)

// mov r/m32, r32
mapping clause encdec = MOV_156
  <-> 0x89 @ modrm(rm, reg)

// mov r/m16, r16
mapping clause encdec = MOV_157
  <-> 0x66 @ 0x89 @ modrm(rm, reg)

// mov r8, r/m8
mapping clause encdec = MOV_158
  <-> 0x8a @ modrm(rm, reg)

// mov r32, r/m32
mapping clause encdec = MOV_159
  <-> 0x8b @ modrm(rm, reg)

// mov r16, r/m16
mapping clause encdec = MOV_160
  <-> 0x66 @ 0x8b @ modrm(rm, reg)

// mov r/m32, Sreg (register form only)
mapping clause encdec = MOV_161
  <-> 0x8c @ modrm(rm, reg)

// mov r/m16, Sreg (register form only)
mapping clause encdec = MOV_162
  <-> 0x66 @ 0x8c @ modrm(rm, reg)

// mov m16, Sreg
mapping clause encdec = MOV_163
  <-> 0x8c @ modrm(rm, reg)

// mov Sreg, r/m32 (register form only)
mapping clause encdec = MOV_164
  <-> 0x8e @ modrm(rm, reg)

// mov Sreg, m16
mapping clause encdec = MOV_165
  <-> 0x8e @ modrm(rm, reg)

// mov AL, [moffs8]
mapping clause encdec = MOV_166
  <-> 0xa0 @ addr32_le

// mov EAX, [moffs32]
mapping clause encdec = MOV_167
  <-> 0xa1 @ addr32_le

// mov AX, [moffs16]
mapping clause encdec = MOV_168
  <-> 0x66 @ 0xa1 @ addr32_le

// mov [moffs8], AL
mapping clause encdec = MOV_169
  <-> 0xa2 @ addr32_le

// mov [moffs32], EAX
mapping clause encdec = MOV_170
  <-> 0xa3 @ addr32_le

// mov [moffs16], AX
mapping clause encdec = MOV_171
  <-> 0x66 @ 0xa3 @ addr32_le

// mov r8, imm8
mapping clause encdec = MOV_172
  <-> 0b10110 @ reg @ imm8

// mov r32, imm32
mapping clause encdec = MOV_173
  <-> 0b10111 @ reg @ imm32_le

// mov r16, imm16
mapping clause encdec = MOV_174
  <-> 0x66 @ 0b10111 @ reg @ imm16_le

// mov r/m8, imm8
mapping clause encdec = MOV_175
  <-> 0xc6 @ modrm(rm, 0b000) @ imm8

// mov r/m32, imm32
mapping clause encdec = MOV_176
  <-> 0xc7 @ modrm(rm, 0b000) @ imm32_le

// mov r/m16, imm16
mapping clause encdec = MOV_177
  <-> 0x66 @ 0xc7 @ modrm(rm, 0b000) @ imm16_le

// xchg r/m8, r8
mapping clause encdec = XCHG_178
  <-> 0x86 @ modrm(rm, reg)

// xchg r/m32, r32
mapping clause encdec = XCHG_179
  <-> 0x87 @ modrm(rm, reg)

// xchg r/m16, r16
mapping clause encdec = XCHG_180
  <-> 0x66 @ 0x87 @ modrm(rm, reg)

// xchg EAX, r32
mapping clause encdec = XCHG_181
  <-> 0b10010 @ reg

// xchg AX, r16
mapping clause encdec = XCHG_182
  <-> 0x66 @ 0b10010 @ reg

// lea r32, m
mapping clause encdec = LEA_183
  <-> 0x8d @ modrm(rm, reg)

// lea r16, m
mapping clause encdec = LEA_184
  <-> 0x66 @ 0x8d @ modrm(rm, reg)

// lds r32, m16:32
mapping clause encdec = LDS_185
  <-> 0xc5 @ modrm(rm, reg)

// lds r16, m16:16
mapping clause encdec = LDS_186
  <-> 0x66 @ 0xc5 @ modrm(rm, reg)

// les r32, m16:32
mapping clause encdec = LES_187
  <-> 0xc4 @ modrm(rm, reg)

// les r16, m16:16
mapping clause encdec = LES_188
  <-> 0x66 @ 0xc4 @ modrm(rm, reg)

// lss r32, m16:32
mapping clause encdec = LSS_189
  <-> 0x0f @ 0xb2 @ modrm(rm, reg)

// lss r16, m16:16
mapping clause encdec = LSS_190
  <-> 0x66 @ 0x0f @ 0xb2 @ modrm(rm, reg)

// lfs r32, m16:32
mapping clause encdec = LFS_191
  <-> 0x0f @ 0xb4 @ modrm(rm, reg)

// lfs r16, m16:16
mapping clause encdec = LFS_192
  <-> 0x66 @ 0x0f @ 0xb4 @ modrm(rm, reg)

// lgs r32, m16:32
mapping clause encdec = LGS_193
  <-> 0x0f @ 0xb5 @ modrm(rm, reg)

// lgs r16, m16:16
mapping clause encdec = LGS_194
  <-> 0x66 @ 0x0f @ 0xb5 @ modrm(rm, reg)

// movzx r32, r/m8
mapping clause encdec = MOVZX_195
  <-> 0x0f @ 0xb6 @ modrm(rm, reg)

// movzx r16, r/m8
mapping clause encdec = MOVZX_196
  <-> 0x66 @ 0x0f @ 0xb6 @ modrm(rm, reg)

// movzx r32, r/m16
mapping clause encdec = MOVZX_197
  <-> 0x0f @ 0xb7 @ modrm(rm, reg)

// movsx r32, r/m8
mapping clause encdec = MOVSX_198
  <-> 0x0f @ 0xbe @ modrm(rm, reg)

// movsx r16, r/m8
mapping clause encdec = MOVSX_199
  <-> 0x66 @ 0x0f @ 0xbe @ modrm(rm, reg)

// movsx r32, r/m16
mapping clause encdec = MOVSX_200
  <-> 0x0f @ 0xbf @ modrm(rm, reg)

// push r32
mapping clause encdec = PUSH_201
  <-> 0b01010 @ reg

// push r16
mapping clause encdec = PUSH_202
  <-> 0x66 @ 0b01010 @ reg

// pop r32
mapping clause encdec = POP_203
  <-> 0b01011 @ reg

// pop r16
mapping clause encdec = POP_204
  <-> 0x66 @ 0b01011 @ reg

// push r/m32
mapping clause encdec = PUSH_205
  <-> 0xff @ modrm(rm, 0b110)

// push r/m16
mapping clause encdec = PUSH_206
  <-> 0x66 @ 0xff @ modrm(rm, 0b110)

// pop r/m32
mapping clause encdec = POP_207
  <-> 0x8f @ modrm(rm, 0b000)

// pop r/m16
mapping clause encdec = POP_208
  <-> 0x66 @ 0x8f @ modrm(rm, 0b000)

// push imm32
mapping clause encdec = PUSH_209
  <-> 0x68 @ imm32_le

// push simm8
mapping clause encdec = PUSH_210
  <-> 0x6a @ imm8

// push ES
mapping clause encdec = PUSH_211
  <-> 0x06

// pop ES
mapping clause encdec = POP_212
  <-> 0x07

// push CS
mapping clause encdec = PUSH_213
  <-> 0x0e

// push SS
mapping clause encdec = PUSH_214
  <-> 0x16

// pop SS
mapping clause encdec = POP_215
  <-> 0x17

// push DS
mapping clause encdec = PUSH_216
  <-> 0x1e

// pop DS
mapping clause encdec = POP_217
  <-> 0x1f

// push FS
mapping clause encdec = PUSH_218
  <-> 0x0f @ 0xa0

// pop FS
mapping clause encdec = POP_219
  <-> 0x0f @ 0xa1

// push GS
mapping clause encdec = PUSH_220
  <-> 0x0f @ 0xa8

// pop GS
mapping clause encdec = POP_221
  <-> 0x0f @ 0xa9

// pushad
mapping clause encdec = PUSHAD_222
  <-> 0x60

// pushaw
mapping clause encdec = PUSHAW_223
  <-> 0x66 @ 0x60

// popad
mapping clause encdec = POPAD_224
  <-> 0x61

// popaw
mapping clause encdec = POPAW_225
  <-> 0x66 @ 0x61

// pushfd
mapping clause encdec = PUSHFD_226
  <-> 0x9c

// pushfw
mapping clause encdec = PUSHFW_227
  <-> 0x66 @ 0x9c

// popfd
mapping clause encdec = POPFD_228
  <-> 0x9d

// popfw
mapping clause encdec = POPFW_229
  <-> 0x66 @ 0x9d

// lahf
mapping clause encdec = LAHF_230
  <-> 0x9f

// sahf
mapping clause encdec = SAHF_231
  <-> 0x9e

// enter imm16, lvl8
mapping clause encdec = ENTER_232
  <-> 0xc8 @ imm16_le @ imm8

// leave
mapping clause encdec = LEAVE_233
  <-> 0xc9

// in AL, imm8
mapping clause encdec = IN_234
  <-> 0xe4 @ imm8

// in EAX, imm8
mapping clause encdec = IN_235
  <-> 0xe5 @ imm8

// in AX, imm8
mapping clause encdec = IN_236
  <-> 0x66 @ 0xe5 @ imm8

// out imm8, AL
mapping clause encdec = OUT_237
  <-> 0xe6 @ imm8

// out imm8, EAX
mapping clause encdec = OUT_238
  <-> 0xe7 @ imm8

// out imm8, AX
mapping clause encdec = OUT_239
  <-> 0x66 @ 0xe7 @ imm8

// in AL, DX
mapping clause encdec = IN_240
  <-> 0xec

// in EAX, DX
mapping clause encdec = IN_241
  <-> 0xed

// in AX, DX
mapping clause encdec = IN_242
  <-> 0x66 @ 0xed

// out DX, AL
mapping clause encdec = OUT_243
  <-> 0xee

// out DX, EAX
mapping clause encdec = OUT_244
  <-> 0xef

// out DX, AX
mapping clause encdec = OUT_245
  <-> 0x66 @ 0xef

// xlatb
mapping clause encdec = XLATB_246
  <-> 0xd7

// cwde
mapping clause encdec = CWDE_247
  <-> 0x98

// cbw
mapping clause encdec = CBW_248
  <-> 0x66 @ 0x98

// cdq
mapping clause encdec = CDQ_249
  <-> 0x99

// cwd
mapping clause encdec = CWD_250
  <-> 0x66 @ 0x99

// aaa
mapping clause encdec = AAA_251
  <-> 0x37

// aas
mapping clause encdec = AAS_252
  <-> 0x3f

// daa
mapping clause encdec = DAA_253
  <-> 0x27

// das
mapping clause encdec = DAS_254
  <-> 0x2f

// aam imm8
mapping clause encdec = AAM_255
  <-> 0xd4 @ imm8

// aad imm8
mapping clause encdec = AAD_256
  <-> 0xd5 @ imm8

// rol r/m8, 1
mapping clause encdec = ROL_257
  <-> 0xd0 @ modrm(rm, 0b000)

// rol r/m32, 1
mapping clause encdec = ROL_258
  <-> 0xd1 @ modrm(rm, 0b000)

// rol r/m16, 1
mapping clause encdec = ROL_259
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b000)

// rol r/m8, CL
mapping clause encdec = ROL_260
  <-> 0xd2 @ modrm(rm, 0b000)

// rol r/m32, CL
mapping clause encdec = ROL_261
  <-> 0xd3 @ modrm(rm, 0b000)

// rol r/m16, CL
mapping clause encdec = ROL_262
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b000)

// rol r/m8, imm8
mapping clause encdec = ROL_263
  <-> 0xc0 @ modrm(rm, 0b000) @ imm8

// rol r/m32, imm8
mapping clause encdec = ROL_264
  <-> 0xc1 @ modrm(rm, 0b000) @ imm8

// rol r/m16, imm8
mapping clause encdec = ROL_265
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b000) @ imm8

// ror r/m8, 1
mapping clause encdec = ROR_266
  <-> 0xd0 @ modrm(rm, 0b001)

// ror r/m32, 1
mapping clause encdec = ROR_267
  <-> 0xd1 @ modrm(rm, 0b001)

// ror r/m16, 1
mapping clause encdec = ROR_268
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b001)

// ror r/m8, CL
mapping clause encdec = ROR_269
  <-> 0xd2 @ modrm(rm, 0b001)

// ror r/m32, CL
mapping clause encdec = ROR_270
  <-> 0xd3 @ modrm(rm, 0b001)

// ror r/m16, CL
mapping clause encdec = ROR_271
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b001)

// ror r/m8, imm8
mapping clause encdec = ROR_272
  <-> 0xc0 @ modrm(rm, 0b001) @ imm8

// ror r/m32, imm8
mapping clause encdec = ROR_273
  <-> 0xc1 @ modrm(rm, 0b001) @ imm8

// ror r/m16, imm8
mapping clause encdec = ROR_274
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b001) @ imm8

// rcl r/m8, 1
mapping clause encdec = RCL_275
  <-> 0xd0 @ modrm(rm, 0b010)

// rcl r/m32, 1
mapping clause encdec = RCL_276
  <-> 0xd1 @ modrm(rm, 0b010)

// rcl r/m16, 1
mapping clause encdec = RCL_277
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b010)

// rcl r/m8, CL
mapping clause encdec = RCL_278
  <-> 0xd2 @ modrm(rm, 0b010)

// rcl r/m32, CL
mapping clause encdec = RCL_279
  <-> 0xd3 @ modrm(rm, 0b010)

// rcl r/m16, CL
mapping clause encdec = RCL_280
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b010)

// rcl r/m8, imm8
mapping clause encdec = RCL_281
  <-> 0xc0 @ modrm(rm, 0b010) @ imm8

// rcl r/m32, imm8
mapping clause encdec = RCL_282
  <-> 0xc1 @ modrm(rm, 0b010) @ imm8

// rcl r/m16, imm8
mapping clause encdec = RCL_283
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b010) @ imm8

// rcr r/m8, 1
mapping clause encdec = RCR_284
  <-> 0xd0 @ modrm(rm, 0b011)

// rcr r/m32, 1
mapping clause encdec = RCR_285
  <-> 0xd1 @ modrm(rm, 0b011)

// rcr r/m16, 1
mapping clause encdec = RCR_286
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b011)

// rcr r/m8, CL
mapping clause encdec = RCR_287
  <-> 0xd2 @ modrm(rm, 0b011)

// rcr r/m32, CL
mapping clause encdec = RCR_288
  <-> 0xd3 @ modrm(rm, 0b011)

// rcr r/m16, CL
mapping clause encdec = RCR_289
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b011)

// rcr r/m8, imm8
mapping clause encdec = RCR_290
  <-> 0xc0 @ modrm(rm, 0b011) @ imm8

// rcr r/m32, imm8
mapping clause encdec = RCR_291
  <-> 0xc1 @ modrm(rm, 0b011) @ imm8

// rcr r/m16, imm8
mapping clause encdec = RCR_292
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b011) @ imm8

// shl r/m8, 1
mapping clause encdec = SHL_293
  <-> 0xd0 @ modrm(rm, 0b100)

// shl r/m32, 1
mapping clause encdec = SHL_294
  <-> 0xd1 @ modrm(rm, 0b100)

// shl r/m16, 1
mapping clause encdec = SHL_295
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b100)

// shl r/m8, CL
mapping clause encdec = SHL_296
  <-> 0xd2 @ modrm(rm, 0b100)

// shl r/m32, CL
mapping clause encdec = SHL_297
  <-> 0xd3 @ modrm(rm, 0b100)

// shl r/m16, CL
mapping clause encdec = SHL_298
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b100)

// shl r/m8, imm8
mapping clause encdec = SHL_299
  <-> 0xc0 @ modrm(rm, 0b100) @ imm8

// shl r/m32, imm8
mapping clause encdec = SHL_300
  <-> 0xc1 @ modrm(rm, 0b100) @ imm8

// shl r/m16, imm8
mapping clause encdec = SHL_301
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b100) @ imm8

// shr r/m8, 1
mapping clause encdec = SHR_302
  <-> 0xd0 @ modrm(rm, 0b101)

// shr r/m32, 1
mapping clause encdec = SHR_303
  <-> 0xd1 @ modrm(rm, 0b101)

// shr r/m16, 1
mapping clause encdec = SHR_304
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b101)

// shr r/m8, CL
mapping clause encdec = SHR_305
  <-> 0xd2 @ modrm(rm, 0b101)

// shr r/m32, CL
mapping clause encdec = SHR_306
  <-> 0xd3 @ modrm(rm, 0b101)

// shr r/m16, CL
mapping clause encdec = SHR_307
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b101)

// shr r/m8, imm8
mapping clause encdec = SHR_308
  <-> 0xc0 @ modrm(rm, 0b101) @ imm8

// shr r/m32, imm8
mapping clause encdec = SHR_309
  <-> 0xc1 @ modrm(rm, 0b101) @ imm8

// shr r/m16, imm8
mapping clause encdec = SHR_310
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b101) @ imm8

// sar r/m8, 1
mapping clause encdec = SAR_311
  <-> 0xd0 @ modrm(rm, 0b111)

// sar r/m32, 1
mapping clause encdec = SAR_312
  <-> 0xd1 @ modrm(rm, 0b111)

// sar r/m16, 1
mapping clause encdec = SAR_313
  <-> 0x66 @ 0xd1 @ modrm(rm, 0b111)

// sar r/m8, CL
mapping clause encdec = SAR_314
  <-> 0xd2 @ modrm(rm, 0b111)

// sar r/m32, CL
mapping clause encdec = SAR_315
  <-> 0xd3 @ modrm(rm, 0b111)

// sar r/m16, CL
mapping clause encdec = SAR_316
  <-> 0x66 @ 0xd3 @ modrm(rm, 0b111)

// sar r/m8, imm8
mapping clause encdec = SAR_317
  <-> 0xc0 @ modrm(rm, 0b111) @ imm8

// sar r/m32, imm8
mapping clause encdec = SAR_318
  <-> 0xc1 @ modrm(rm, 0b111) @ imm8

// sar r/m16, imm8
mapping clause encdec = SAR_319
  <-> 0x66 @ 0xc1 @ modrm(rm, 0b111) @ imm8

// shld r/m32, r32, imm8
mapping clause encdec = SHLD_320
  <-> 0x0f @ 0xa4 @ modrm(rm, reg) @ imm8

// shld r/m16, r16, imm8
mapping clause encdec = SHLD_321
  <-> 0x66 @ 0x0f @ 0xa4 @ modrm(rm, reg) @ imm8

// shld r/m32, r32, CL
mapping clause encdec = SHLD_322
  <-> 0x0f @ 0xa5 @ modrm(rm, reg)

// shld r/m16, r16, CL
mapping clause encdec = SHLD_323
  <-> 0x66 @ 0x0f @ 0xa5 @ modrm(rm, reg)

// shrd r/m32, r32, imm8
mapping clause encdec = SHRD_324
  <-> 0x0f @ 0xac @ modrm(rm, reg) @ imm8

// shrd r/m16, r16, imm8
mapping clause encdec = SHRD_325
  <-> 0x66 @ 0x0f @ 0xac @ modrm(rm, reg) @ imm8

// shrd r/m32, r32, CL
mapping clause encdec = SHRD_326
  <-> 0x0f @ 0xad @ modrm(rm, reg)

// shrd r/m16, r16, CL
mapping clause encdec = SHRD_327
  <-> 0x66 @ 0x0f @ 0xad @ modrm(rm, reg)

// bt r/m32, r32
mapping clause encdec = BT_328
  <-> 0x0f @ 0xa3 @ modrm(rm, reg)

// bt r/m16, r16
mapping clause encdec = BT_329
  <-> 0x66 @ 0x0f @ 0xa3 @ modrm(rm, reg)

// bt r/m32, imm8
mapping clause encdec = BT_330
  <-> 0x0f @ 0xba @ modrm(rm, 0b100) @ imm8

// bt r/m16, imm8
mapping clause encdec = BT_331
  <-> 0x66 @ 0x0f @ 0xba @ modrm(rm, 0b100) @ imm8

// bts r/m32, r32
mapping clause encdec = BTS_332
  <-> 0x0f @ 0xab @ modrm(rm, reg)

// bts r/m16, r16
mapping clause encdec = BTS_333
  <-> 0x66 @ 0x0f @ 0xab @ modrm(rm, reg)

// bts r/m32, imm8
mapping clause encdec = BTS_334
  <-> 0x0f @ 0xba @ modrm(rm, 0b101) @ imm8

// bts r/m16, imm8
mapping clause encdec = BTS_335
  <-> 0x66 @ 0x0f @ 0xba @ modrm(rm, 0b101) @ imm8

// btr r/m32, r32
mapping clause encdec = BTR_336
  <-> 0x0f @ 0xb3 @ modrm(rm, reg)

// btr r/m16, r16
mapping clause encdec = BTR_337
  <-> 0x66 @ 0x0f @ 0xb3 @ modrm(rm, reg)

// btr r/m32, imm8
mapping clause encdec = BTR_338
  <-> 0x0f @ 0xba @ modrm(rm, 0b110) @ imm8

// btr r/m16, imm8
mapping clause encdec = BTR_339
  <-> 0x66 @ 0x0f @ 0xba @ modrm(rm, 0b110) @ imm8

// btc r/m32, r32
mapping clause encdec = BTC_340
  <-> 0x0f @ 0xbb @ modrm(rm, reg)

// btc r/m16, r16
mapping clause encdec = BTC_341
  <-> 0x66 @ 0x0f @ 0xbb @ modrm(rm, reg)

// btc r/m32, imm8
mapping clause encdec = BTC_342
  <-> 0x0f @ 0xba @ modrm(rm, 0b111) @ imm8

// btc r/m16, imm8
mapping clause encdec = BTC_343
  <-> 0x66 @ 0x0f @ 0xba @ modrm(rm, 0b111) @ imm8

// bsf r32, r/m32
mapping clause encdec = BSF_344
  <-> 0x0f @ 0xbc @ modrm(rm, reg)

// bsf r16, r/m16
mapping clause encdec = BSF_345
  <-> 0x66 @ 0x0f @ 0xbc @ modrm(rm, reg)

// bsr r32, r/m32
mapping clause encdec = BSR_346
  <-> 0x0f @ 0xbd @ modrm(rm, reg)

// bsr r16, r/m16
mapping clause encdec = BSR_347
  <-> 0x66 @ 0x0f @ 0xbd @ modrm(rm, reg)

// set~cc r/m8
mapping clause encdec = SETCC_348
  <-> 0x0f @ 0b1001 @ cc @ modrm(rm, 0b000)

// cmov~cc r32, r/m32
mapping clause encdec = CMOVCC_349
  <-> 0x0f @ 0b0100 @ cc @ modrm(rm, reg)

// cmov~cc r16, r/m16
mapping clause encdec = CMOVCC_350
  <-> 0x66 @ 0x0f @ 0b0100 @ cc @ modrm(rm, reg)

// bswap r32
mapping clause encdec = BSWAP_351
  <-> 0x0f @ 0b11001 @ reg

// cmpxchg r/m8, r8
mapping clause encdec = CMPXCHG_352
  <-> 0x0f @ 0xb0 @ modrm(rm, reg)

// cmpxchg r/m32, r32
mapping clause encdec = CMPXCHG_353
  <-> 0x0f @ 0xb1 @ modrm(rm, reg)

// cmpxchg r/m16, r16
mapping clause encdec = CMPXCHG_354
  <-> 0x66 @ 0x0f @ 0xb1 @ modrm(rm, reg)

// xadd r/m8, r8
mapping clause encdec = XADD_355
  <-> 0x0f @ 0xc0 @ modrm(rm, reg)

// xadd r/m32, r32
mapping clause encdec = XADD_356
  <-> 0x0f @ 0xc1 @ modrm(rm, reg)

// xadd r/m16, r16
mapping clause encdec = XADD_357
  <-> 0x66 @ 0x0f @ 0xc1 @ modrm(rm, reg)

// cmpxchg8b m64
mapping clause encdec = CMPXCHG8B_358
  <-> 0x0f @ 0xc7 @ modrm(rm, 0b001)

// movsb
mapping clause encdec = MOVSB_359
  <-> 0xa4

// movsd
mapping clause encdec = MOVSD_360
  <-> 0xa5

// movsw
mapping clause encdec = MOVSW_361
  <-> 0x66 @ 0xa5

// cmpsb
mapping clause encdec = CMPSB_362
  <-> 0xa6

// cmpsd
mapping clause encdec = CMPSD_363
  <-> 0xa7

// cmpsw
mapping clause encdec = CMPSW_364
  <-> 0x66 @ 0xa7

// stosb
mapping clause encdec = STOSB_365
  <-> 0xaa

// stosd
mapping clause encdec = STOSD_366
  <-> 0xab

// stosw
mapping clause encdec = STOSW_367
  <-> 0x66 @ 0xab

// lodsb
mapping clause encdec = LODSB_368
  <-> 0xac

// lodsd
mapping clause encdec = LODSD_369
  <-> 0xad

// lodsw
mapping clause encdec = LODSW_370
  <-> 0x66 @ 0xad

// scasb
mapping clause encdec = SCASB_371
  <-> 0xae

// scasd
mapping clause encdec = SCASD_372
  <-> 0xaf

// scasw
mapping clause encdec = SCASW_373
  <-> 0x66 @ 0xaf

// insb
mapping clause encdec = INSB_374
  <-> 0x6c

// insd
mapping clause encdec = INSD_375
  <-> 0x6d

// insw
mapping clause encdec = INSW_376
  <-> 0x66 @ 0x6d

// outsb
mapping clause encdec = OUTSB_377
  <-> 0x6e

// outsd
mapping clause encdec = OUTSD_378
  <-> 0x6f

// outsw
mapping clause encdec = OUTSW_379
  <-> 0x66 @ 0x6f

// call rel32
mapping clause encdec = CALL_380
  <-> 0xe8 @ rel32_le

// call r/m32
mapping clause encdec = CALL_381
  <-> 0xff @ modrm(rm, 0b010)

// call ptr16:32
mapping clause encdec = CALL_382
  <-> 0x9a @ offset_le @ seg16_le

// call FAR m16:32
mapping clause encdec = CALL_383
  <-> 0xff @ modrm(rm, 0b011)

// jmp rel32
mapping clause encdec = JMP_384
  <-> 0xe9 @ rel32_le

// jmp rel8
mapping clause encdec = JMP_385
  <-> 0xeb @ rel8

// jmp r/m32
mapping clause encdec = JMP_386
  <-> 0xff @ modrm(rm, 0b100)

// jmp ptr16:32
mapping clause encdec = JMP_387
  <-> 0xea @ offset_le @ seg16_le

// jmp FAR m16:32
mapping clause encdec = JMP_388
  <-> 0xff @ modrm(rm, 0b101)

// j~cc rel8
mapping clause encdec = JCC_389
  <-> 0b0111 @ cc @ rel8

// j~cc rel32
mapping clause encdec = JCC_390
  <-> 0x0f @ 0b1000 @ cc @ rel32_le

// loop rel8
mapping clause encdec = LOOP_391
  <-> 0xe2 @ rel8

// loope rel8
mapping clause encdec = LOOPE_392
  <-> 0xe1 @ rel8

// loopne rel8
mapping clause encdec = LOOPNE_393
  <-> 0xe0 @ rel8

// jecxz rel8
mapping clause encdec = JECXZ_394
  <-> 0xe3 @ rel8

// ret
mapping clause encdec = RET_395
  <-> 0xc3

// retw
mapping clause encdec = RETW_396
  <-> 0x66 @ 0xc3

// ret imm16
mapping clause encdec = RET_397
  <-> 0xc2 @ imm16_le

// retw imm16
mapping clause encdec = RETW_398
  <-> 0x66 @ 0xc2 @ imm16_le

// retf
mapping clause encdec = RETF_399
  <-> 0xcb

// retfw
mapping clause encdec = RETFW_400
  <-> 0x66 @ 0xcb

// retf imm16
mapping clause encdec = RETF_401
  <-> 0xca @ imm16_le

// retfw imm16
mapping clause encdec = RETFW_402
  <-> 0x66 @ 0xca @ imm16_le

// int imm8
mapping clause encdec = INT_403
  <-> 0xcd @ imm8

// int3
mapping clause encdec = INT3_404
  <-> 0xcc

// into
mapping clause encdec = INTO_405
  <-> 0xce

// iretd
mapping clause encdec = IRETD_406
  <-> 0xcf

// iretw
mapping clause encdec = IRETW_407
  <-> 0x66 @ 0xcf

// bound r32, m
mapping clause encdec = BOUND_408
  <-> 0x62 @ modrm(rm, reg)

// bound r16, m
mapping clause encdec = BOUND_409
  <-> 0x66 @ 0x62 @ modrm(rm, reg)

// clc
mapping clause encdec = CLC_410
  <-> 0xf8

// stc
mapping clause encdec = STC_411
  <-> 0xf9

// cmc
mapping clause encdec = CMC_412
  <-> 0xf5

// cld
mapping clause encdec = CLD_413
  <-> 0xfc

// std
mapping clause encdec = STD_414
  <-> 0xfd

// cli
mapping clause encdec = CLI_415
  <-> 0xfa

// sti
mapping clause encdec = STI_416
  <-> 0xfb

// hlt
mapping clause encdec = HLT_417
  <-> 0xf4

// wait
mapping clause encdec = WAIT_418
  <-> 0x9b

// nop
mapping clause encdec = NOP_419
  <-> 0x90

// nop r/m32
mapping clause encdec = NOP_420
  <-> 0x0f @ 0x1f @ modrm(rm, 0b000)

// nop r/m16
mapping clause encdec = NOP_421
  <-> 0x66 @ 0x0f @ 0x1f @ modrm(rm, 0b000)

// cpuid
mapping clause encdec = CPUID_422
  <-> 0x0f @ 0xa2

// rdtsc
mapping clause encdec = RDTSC_423
  <-> 0x0f @ 0x31

// rdpmc
mapping clause encdec = RDPMC_424
  <-> 0x0f @ 0x33

// ud2
mapping clause encdec = UD2_425
  <-> 0x0f @ 0x0b

// lock
mapping clause encdec = LOCK_426
  <-> 0xf0

// rep
mapping clause encdec = REP_427
  <-> 0xf3

// repne
mapping clause encdec = REPNE_428
  <-> 0xf2

// es
mapping clause encdec = ES_429
  <-> 0x26

// cs
mapping clause encdec = CS_430
  <-> 0x2e

// ss
mapping clause encdec = SS_431
  <-> 0x36

// ds
mapping clause encdec = DS_432
  <-> 0x3e

// fs
mapping clause encdec = FS_433
  <-> 0x64

// gs
mapping clause encdec = GS_434
  <-> 0x65

// data16
mapping clause encdec = DATA16_435
  <-> 0x66

// addr16
mapping clause encdec = ADDR16_436
  <-> 0x67

// lgdt m
mapping clause encdec = LGDT_437
  <-> 0x0f @ 0x01 @ modrm(rm, 0b010)

// lidt m
mapping clause encdec = LIDT_438
  <-> 0x0f @ 0x01 @ modrm(rm, 0b011)

// sgdt m
mapping clause encdec = SGDT_439
  <-> 0x0f @ 0x01 @ modrm(rm, 0b000)

// sidt m
mapping clause encdec = SIDT_440
  <-> 0x0f @ 0x01 @ modrm(rm, 0b001)

// invlpg m
mapping clause encdec = INVLPG_441
  <-> 0x0f @ 0x01 @ modrm(rm, 0b111)

// lmsw r/m16
mapping clause encdec = LMSW_442
  <-> 0x0f @ 0x01 @ modrm(rm, 0b110)

// smsw r/m32 (register form only)
mapping clause encdec = SMSW_443
  <-> 0x0f @ 0x01 @ modrm(rm, 0b100)

// smsw r/m16 (register form only)
mapping clause encdec = SMSW_444
  <-> 0x66 @ 0x0f @ 0x01 @ modrm(rm, 0b100)

// smsw m16
mapping clause encdec = SMSW_445
  <-> 0x0f @ 0x01 @ modrm(rm, 0b100)

// lldt r/m16
mapping clause encdec = LLDT_446
  <-> 0x0f @ 0x00 @ modrm(rm, 0b010)

// ltr r/m16
mapping clause encdec = LTR_447
  <-> 0x0f @ 0x00 @ modrm(rm, 0b011)

// sldt r/m32 (register form only)
mapping clause encdec = SLDT_448
  <-> 0x0f @ 0x00 @ modrm(rm, 0b000)

// sldt r/m16 (register form only)
mapping clause encdec = SLDT_449
  <-> 0x66 @ 0x0f @ 0x00 @ modrm(rm, 0b000)

// sldt m16
mapping clause encdec = SLDT_450
  <-> 0x0f @ 0x00 @ modrm(rm, 0b000)

// str r/m32 (register form only)
mapping clause encdec = STR_451
  <-> 0x0f @ 0x00 @ modrm(rm, 0b001)

// str r/m16 (register form only)
mapping clause encdec = STR_452
  <-> 0x66 @ 0x0f @ 0x00 @ modrm(rm, 0b001)

// str m16
mapping clause encdec = STR_453
  <-> 0x0f @ 0x00 @ modrm(rm, 0b001)

// verr r/m16
mapping clause encdec = VERR_454
  <-> 0x0f @ 0x00 @ modrm(rm, 0b100)

// verw r/m16
mapping clause encdec = VERW_455
  <-> 0x0f @ 0x00 @ modrm(rm, 0b101)

// lar r32, r/m16
mapping clause encdec = LAR_456
  <-> 0x0f @ 0x02 @ modrm(rm, reg)

// lar r16, r/m16
mapping clause encdec = LAR_457
  <-> 0x66 @ 0x0f @ 0x02 @ modrm(rm, reg)

// lsl r32, r/m16
mapping clause encdec = LSL_458
  <-> 0x0f @ 0x03 @ modrm(rm, reg)

// lsl r16, r/m16
mapping clause encdec = LSL_459
  <-> 0x66 @ 0x0f @ 0x03 @ modrm(rm, reg)

// arpl r/m16, r16
mapping clause encdec = ARPL_460
  <-> 0x63 @ modrm(rm, reg)

// clts
mapping clause encdec = CLTS_461
  <-> 0x0f @ 0x06

// mov r/m32, CRn (register form only)
mapping clause encdec = MOV_462
  <-> 0x0f @ 0x20 @ modrm(rm, reg)

// mov CRn, r/m32 (register form only)
mapping clause encdec = MOV_463
  <-> 0x0f @ 0x22 @ modrm(rm, reg)

// mov r/m32, DRn (register form only)
mapping clause encdec = MOV_464
  <-> 0x0f @ 0x21 @ modrm(rm, reg)

// mov DRn, r/m32 (register form only)
mapping clause encdec = MOV_465
  <-> 0x0f @ 0x23 @ modrm(rm, reg)

// invd
mapping clause encdec = INVD_466
  <-> 0x0f @ 0x08

// wbinvd
mapping clause encdec = WBINVD_467
  <-> 0x0f @ 0x09

// rdmsr
mapping clause encdec = RDMSR_468
  <-> 0x0f @ 0x32

// wrmsr
mapping clause encdec = WRMSR_469
  <-> 0x0f @ 0x30

// rsm
mapping clause encdec = RSM_470
  <-> 0x0f @ 0xaa

// sysenter
mapping clause encdec = SYSENTER_471
  <-> 0x0f @ 0x34

// sysexit
mapping clause encdec = SYSEXIT_472
  <-> 0x0f @ 0x35

end instruction
