// Intel 8086: encodings, a clause per instruction and operand size.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by
// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's opcode table notation), each
// line of which is checked against LLVM's X86 records (opcode, map, form, operand size, prefixes, immediate). Only the
// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; values little-endian.
// modrm(rm, reg) is a ModRM byte and what follows it (SIB, displacement) in 16 bit addressing; the sheet shows a
// row per form of it. 
// Licensed CC BY-SA 4.0 like the sheets.

scattered union instruction
// add r/m8, r8
mapping clause encdec = ADD_0
  <-> 0x00 @ modrm(rm, reg)

// add r/m16, r16
mapping clause encdec = ADD_1
  <-> 0x01 @ modrm(rm, reg)

// add r8, r/m8
mapping clause encdec = ADD_2
  <-> 0x02 @ modrm(rm, reg)

// add r16, r/m16
mapping clause encdec = ADD_3
  <-> 0x03 @ modrm(rm, reg)

// add AL, imm8
mapping clause encdec = ADD_4
  <-> 0x04 @ imm8

// add AX, imm16
mapping clause encdec = ADD_5
  <-> 0x05 @ imm16_le

// add r/m8, imm8
mapping clause encdec = ADD_6
  <-> 0x80 @ modrm(rm, 0b000) @ imm8

// add r/m16, imm16
mapping clause encdec = ADD_7
  <-> 0x81 @ modrm(rm, 0b000) @ imm16_le

// add r/m16, simm8
mapping clause encdec = ADD_8
  <-> 0x83 @ modrm(rm, 0b000) @ imm8

// or r/m8, r8
mapping clause encdec = OR_9
  <-> 0x08 @ modrm(rm, reg)

// or r/m16, r16
mapping clause encdec = OR_10
  <-> 0x09 @ modrm(rm, reg)

// or r8, r/m8
mapping clause encdec = OR_11
  <-> 0x0a @ modrm(rm, reg)

// or r16, r/m16
mapping clause encdec = OR_12
  <-> 0x0b @ modrm(rm, reg)

// or AL, imm8
mapping clause encdec = OR_13
  <-> 0x0c @ imm8

// or AX, imm16
mapping clause encdec = OR_14
  <-> 0x0d @ imm16_le

// or r/m8, imm8
mapping clause encdec = OR_15
  <-> 0x80 @ modrm(rm, 0b001) @ imm8

// or r/m16, imm16
mapping clause encdec = OR_16
  <-> 0x81 @ modrm(rm, 0b001) @ imm16_le

// or r/m16, simm8
mapping clause encdec = OR_17
  <-> 0x83 @ modrm(rm, 0b001) @ imm8

// adc r/m8, r8
mapping clause encdec = ADC_18
  <-> 0x10 @ modrm(rm, reg)

// adc r/m16, r16
mapping clause encdec = ADC_19
  <-> 0x11 @ modrm(rm, reg)

// adc r8, r/m8
mapping clause encdec = ADC_20
  <-> 0x12 @ modrm(rm, reg)

// adc r16, r/m16
mapping clause encdec = ADC_21
  <-> 0x13 @ modrm(rm, reg)

// adc AL, imm8
mapping clause encdec = ADC_22
  <-> 0x14 @ imm8

// adc AX, imm16
mapping clause encdec = ADC_23
  <-> 0x15 @ imm16_le

// adc r/m8, imm8
mapping clause encdec = ADC_24
  <-> 0x80 @ modrm(rm, 0b010) @ imm8

// adc r/m16, imm16
mapping clause encdec = ADC_25
  <-> 0x81 @ modrm(rm, 0b010) @ imm16_le

// adc r/m16, simm8
mapping clause encdec = ADC_26
  <-> 0x83 @ modrm(rm, 0b010) @ imm8

// sbb r/m8, r8
mapping clause encdec = SBB_27
  <-> 0x18 @ modrm(rm, reg)

// sbb r/m16, r16
mapping clause encdec = SBB_28
  <-> 0x19 @ modrm(rm, reg)

// sbb r8, r/m8
mapping clause encdec = SBB_29
  <-> 0x1a @ modrm(rm, reg)

// sbb r16, r/m16
mapping clause encdec = SBB_30
  <-> 0x1b @ modrm(rm, reg)

// sbb AL, imm8
mapping clause encdec = SBB_31
  <-> 0x1c @ imm8

// sbb AX, imm16
mapping clause encdec = SBB_32
  <-> 0x1d @ imm16_le

// sbb r/m8, imm8
mapping clause encdec = SBB_33
  <-> 0x80 @ modrm(rm, 0b011) @ imm8

// sbb r/m16, imm16
mapping clause encdec = SBB_34
  <-> 0x81 @ modrm(rm, 0b011) @ imm16_le

// sbb r/m16, simm8
mapping clause encdec = SBB_35
  <-> 0x83 @ modrm(rm, 0b011) @ imm8

// and r/m8, r8
mapping clause encdec = AND_36
  <-> 0x20 @ modrm(rm, reg)

// and r/m16, r16
mapping clause encdec = AND_37
  <-> 0x21 @ modrm(rm, reg)

// and r8, r/m8
mapping clause encdec = AND_38
  <-> 0x22 @ modrm(rm, reg)

// and r16, r/m16
mapping clause encdec = AND_39
  <-> 0x23 @ modrm(rm, reg)

// and AL, imm8
mapping clause encdec = AND_40
  <-> 0x24 @ imm8

// and AX, imm16
mapping clause encdec = AND_41
  <-> 0x25 @ imm16_le

// and r/m8, imm8
mapping clause encdec = AND_42
  <-> 0x80 @ modrm(rm, 0b100) @ imm8

// and r/m16, imm16
mapping clause encdec = AND_43
  <-> 0x81 @ modrm(rm, 0b100) @ imm16_le

// and r/m16, simm8
mapping clause encdec = AND_44
  <-> 0x83 @ modrm(rm, 0b100) @ imm8

// sub r/m8, r8
mapping clause encdec = SUB_45
  <-> 0x28 @ modrm(rm, reg)

// sub r/m16, r16
mapping clause encdec = SUB_46
  <-> 0x29 @ modrm(rm, reg)

// sub r8, r/m8
mapping clause encdec = SUB_47
  <-> 0x2a @ modrm(rm, reg)

// sub r16, r/m16
mapping clause encdec = SUB_48
  <-> 0x2b @ modrm(rm, reg)

// sub AL, imm8
mapping clause encdec = SUB_49
  <-> 0x2c @ imm8

// sub AX, imm16
mapping clause encdec = SUB_50
  <-> 0x2d @ imm16_le

// sub r/m8, imm8
mapping clause encdec = SUB_51
  <-> 0x80 @ modrm(rm, 0b101) @ imm8

// sub r/m16, imm16
mapping clause encdec = SUB_52
  <-> 0x81 @ modrm(rm, 0b101) @ imm16_le

// sub r/m16, simm8
mapping clause encdec = SUB_53
  <-> 0x83 @ modrm(rm, 0b101) @ imm8

// xor r/m8, r8
mapping clause encdec = XOR_54
  <-> 0x30 @ modrm(rm, reg)

// xor r/m16, r16
mapping clause encdec = XOR_55
  <-> 0x31 @ modrm(rm, reg)

// xor r8, r/m8
mapping clause encdec = XOR_56
  <-> 0x32 @ modrm(rm, reg)

// xor r16, r/m16
mapping clause encdec = XOR_57
  <-> 0x33 @ modrm(rm, reg)

// xor AL, imm8
mapping clause encdec = XOR_58
  <-> 0x34 @ imm8

// xor AX, imm16
mapping clause encdec = XOR_59
  <-> 0x35 @ imm16_le

// xor r/m8, imm8
mapping clause encdec = XOR_60
  <-> 0x80 @ modrm(rm, 0b110) @ imm8

// xor r/m16, imm16
mapping clause encdec = XOR_61
  <-> 0x81 @ modrm(rm, 0b110) @ imm16_le

// xor r/m16, simm8
mapping clause encdec = XOR_62
  <-> 0x83 @ modrm(rm, 0b110) @ imm8

// cmp r/m8, r8
mapping clause encdec = CMP_63
  <-> 0x38 @ modrm(rm, reg)

// cmp r/m16, r16
mapping clause encdec = CMP_64
  <-> 0x39 @ modrm(rm, reg)

// cmp r8, r/m8
mapping clause encdec = CMP_65
  <-> 0x3a @ modrm(rm, reg)

// cmp r16, r/m16
mapping clause encdec = CMP_66
  <-> 0x3b @ modrm(rm, reg)

// cmp AL, imm8
mapping clause encdec = CMP_67
  <-> 0x3c @ imm8

// cmp AX, imm16
mapping clause encdec = CMP_68
  <-> 0x3d @ imm16_le

// cmp r/m8, imm8
mapping clause encdec = CMP_69
  <-> 0x80 @ modrm(rm, 0b111) @ imm8

// cmp r/m16, imm16
mapping clause encdec = CMP_70
  <-> 0x81 @ modrm(rm, 0b111) @ imm16_le

// cmp r/m16, simm8
mapping clause encdec = CMP_71
  <-> 0x83 @ modrm(rm, 0b111) @ imm8

// inc r/m8
mapping clause encdec = INC_72
  <-> 0xfe @ modrm(rm, 0b000)

// inc r/m16
mapping clause encdec = INC_73
  <-> 0xff @ modrm(rm, 0b000)

// inc r16
mapping clause encdec = INC_74
  <-> 0b01000 @ reg

// dec r/m8
mapping clause encdec = DEC_75
  <-> 0xfe @ modrm(rm, 0b001)

// dec r/m16
mapping clause encdec = DEC_76
  <-> 0xff @ modrm(rm, 0b001)

// dec r16
mapping clause encdec = DEC_77
  <-> 0b01001 @ reg

// not r/m8
mapping clause encdec = NOT_78
  <-> 0xf6 @ modrm(rm, 0b010)

// not r/m16
mapping clause encdec = NOT_79
  <-> 0xf7 @ modrm(rm, 0b010)

// neg r/m8
mapping clause encdec = NEG_80
  <-> 0xf6 @ modrm(rm, 0b011)

// neg r/m16
mapping clause encdec = NEG_81
  <-> 0xf7 @ modrm(rm, 0b011)

// mul r/m8
mapping clause encdec = MUL_82
  <-> 0xf6 @ modrm(rm, 0b100)

// mul r/m16
mapping clause encdec = MUL_83
  <-> 0xf7 @ modrm(rm, 0b100)

// imul r/m8
mapping clause encdec = IMUL_84
  <-> 0xf6 @ modrm(rm, 0b101)

// imul r/m16
mapping clause encdec = IMUL_85
  <-> 0xf7 @ modrm(rm, 0b101)

// div r/m8
mapping clause encdec = DIV_86
  <-> 0xf6 @ modrm(rm, 0b110)

// div r/m16
mapping clause encdec = DIV_87
  <-> 0xf7 @ modrm(rm, 0b110)

// idiv r/m8
mapping clause encdec = IDIV_88
  <-> 0xf6 @ modrm(rm, 0b111)

// idiv r/m16
mapping clause encdec = IDIV_89
  <-> 0xf7 @ modrm(rm, 0b111)

// test r/m8, r8
mapping clause encdec = TEST_90
  <-> 0x84 @ modrm(rm, reg)

// test r/m16, r16
mapping clause encdec = TEST_91
  <-> 0x85 @ modrm(rm, reg)

// test AL, imm8
mapping clause encdec = TEST_92
  <-> 0xa8 @ imm8

// test AX, imm16
mapping clause encdec = TEST_93
  <-> 0xa9 @ imm16_le

// test r/m8, imm8
mapping clause encdec = TEST_94
  <-> 0xf6 @ modrm(rm, 0b000) @ imm8

// test r/m16, imm16
mapping clause encdec = TEST_95
  <-> 0xf7 @ modrm(rm, 0b000) @ imm16_le

// mov r/m8, r8
mapping clause encdec = MOV_96
  <-> 0x88 @ modrm(rm, reg)

// mov r/m16, r16
mapping clause encdec = MOV_97
  <-> 0x89 @ modrm(rm, reg)

// mov r8, r/m8
mapping clause encdec = MOV_98
  <-> 0x8a @ modrm(rm, reg)

// mov r16, r/m16
mapping clause encdec = MOV_99
  <-> 0x8b @ modrm(rm, reg)

// mov r/m16, Sreg (register form only)
mapping clause encdec = MOV_100
  <-> 0x8c @ modrm(rm, reg)

// mov m16, Sreg
mapping clause encdec = MOV_101
  <-> 0x8c @ modrm(rm, reg)

// mov Sreg, r/m16 (register form only)
mapping clause encdec = MOV_102
  <-> 0x8e @ modrm(rm, reg)

// mov Sreg, m16
mapping clause encdec = MOV_103
  <-> 0x8e @ modrm(rm, reg)

// mov AL, [moffs8]
mapping clause encdec = MOV_104
  <-> 0xa0 @ addr16_le

// mov AX, [moffs16]
mapping clause encdec = MOV_105
  <-> 0xa1 @ addr16_le

// mov [moffs8], AL
mapping clause encdec = MOV_106
  <-> 0xa2 @ addr16_le

// mov [moffs16], AX
mapping clause encdec = MOV_107
  <-> 0xa3 @ addr16_le

// mov r8, imm8
mapping clause encdec = MOV_108
  <-> 0b10110 @ reg @ imm8

// mov r16, imm16
mapping clause encdec = MOV_109
  <-> 0b10111 @ reg @ imm16_le

// mov r/m8, imm8
mapping clause encdec = MOV_110
  <-> 0xc6 @ modrm(rm, 0b000) @ imm8

// mov r/m16, imm16
mapping clause encdec = MOV_111
  <-> 0xc7 @ modrm(rm, 0b000) @ imm16_le

// xchg r/m8, r8
mapping clause encdec = XCHG_112
  <-> 0x86 @ modrm(rm, reg)

// xchg r/m16, r16
mapping clause encdec = XCHG_113
  <-> 0x87 @ modrm(rm, reg)

// xchg AX, r16
mapping clause encdec = XCHG_114
  <-> 0b10010 @ reg

// lea r16, m
mapping clause encdec = LEA_115
  <-> 0x8d @ modrm(rm, reg)

// lds r16, m16:16
mapping clause encdec = LDS_116
  <-> 0xc5 @ modrm(rm, reg)

// les r16, m16:16
mapping clause encdec = LES_117
  <-> 0xc4 @ modrm(rm, reg)

// push r16
mapping clause encdec = PUSH_118
  <-> 0b01010 @ reg

// pop r16
mapping clause encdec = POP_119
  <-> 0b01011 @ reg

// push r/m16
mapping clause encdec = PUSH_120
  <-> 0xff @ modrm(rm, 0b110)

// pop r/m16
mapping clause encdec = POP_121
  <-> 0x8f @ modrm(rm, 0b000)

// push ES
mapping clause encdec = PUSH_122
  <-> 0x06

// pop ES
mapping clause encdec = POP_123
  <-> 0x07

// push CS
mapping clause encdec = PUSH_124
  <-> 0x0e

// push SS
mapping clause encdec = PUSH_125
  <-> 0x16

// pop SS
mapping clause encdec = POP_126
  <-> 0x17

// push DS
mapping clause encdec = PUSH_127
  <-> 0x1e

// pop DS
mapping clause encdec = POP_128
  <-> 0x1f

// pushf
mapping clause encdec = PUSHF_129
  <-> 0x9c

// popf
mapping clause encdec = POPF_130
  <-> 0x9d

// lahf
mapping clause encdec = LAHF_131
  <-> 0x9f

// sahf
mapping clause encdec = SAHF_132
  <-> 0x9e

// in AL, imm8
mapping clause encdec = IN_133
  <-> 0xe4 @ imm8

// in AX, imm8
mapping clause encdec = IN_134
  <-> 0xe5 @ imm8

// out imm8, AL
mapping clause encdec = OUT_135
  <-> 0xe6 @ imm8

// out imm8, AX
mapping clause encdec = OUT_136
  <-> 0xe7 @ imm8

// in AL, DX
mapping clause encdec = IN_137
  <-> 0xec

// in AX, DX
mapping clause encdec = IN_138
  <-> 0xed

// out DX, AL
mapping clause encdec = OUT_139
  <-> 0xee

// out DX, AX
mapping clause encdec = OUT_140
  <-> 0xef

// xlatb
mapping clause encdec = XLATB_141
  <-> 0xd7

// cbw
mapping clause encdec = CBW_142
  <-> 0x98

// cwd
mapping clause encdec = CWD_143
  <-> 0x99

// aaa
mapping clause encdec = AAA_144
  <-> 0x37

// aas
mapping clause encdec = AAS_145
  <-> 0x3f

// daa
mapping clause encdec = DAA_146
  <-> 0x27

// das
mapping clause encdec = DAS_147
  <-> 0x2f

// aam imm8
mapping clause encdec = AAM_148
  <-> 0xd4 @ imm8

// aad imm8
mapping clause encdec = AAD_149
  <-> 0xd5 @ imm8

// rol r/m8, 1
mapping clause encdec = ROL_150
  <-> 0xd0 @ modrm(rm, 0b000)

// rol r/m16, 1
mapping clause encdec = ROL_151
  <-> 0xd1 @ modrm(rm, 0b000)

// rol r/m8, CL
mapping clause encdec = ROL_152
  <-> 0xd2 @ modrm(rm, 0b000)

// rol r/m16, CL
mapping clause encdec = ROL_153
  <-> 0xd3 @ modrm(rm, 0b000)

// ror r/m8, 1
mapping clause encdec = ROR_154
  <-> 0xd0 @ modrm(rm, 0b001)

// ror r/m16, 1
mapping clause encdec = ROR_155
  <-> 0xd1 @ modrm(rm, 0b001)

// ror r/m8, CL
mapping clause encdec = ROR_156
  <-> 0xd2 @ modrm(rm, 0b001)

// ror r/m16, CL
mapping clause encdec = ROR_157
  <-> 0xd3 @ modrm(rm, 0b001)

// rcl r/m8, 1
mapping clause encdec = RCL_158
  <-> 0xd0 @ modrm(rm, 0b010)

// rcl r/m16, 1
mapping clause encdec = RCL_159
  <-> 0xd1 @ modrm(rm, 0b010)

// rcl r/m8, CL
mapping clause encdec = RCL_160
  <-> 0xd2 @ modrm(rm, 0b010)

// rcl r/m16, CL
mapping clause encdec = RCL_161
  <-> 0xd3 @ modrm(rm, 0b010)

// rcr r/m8, 1
mapping clause encdec = RCR_162
  <-> 0xd0 @ modrm(rm, 0b011)

// rcr r/m16, 1
mapping clause encdec = RCR_163
  <-> 0xd1 @ modrm(rm, 0b011)

// rcr r/m8, CL
mapping clause encdec = RCR_164
  <-> 0xd2 @ modrm(rm, 0b011)

// rcr r/m16, CL
mapping clause encdec = RCR_165
  <-> 0xd3 @ modrm(rm, 0b011)

// shl r/m8, 1
mapping clause encdec = SHL_166
  <-> 0xd0 @ modrm(rm, 0b100)

// shl r/m16, 1
mapping clause encdec = SHL_167
  <-> 0xd1 @ modrm(rm, 0b100)

// shl r/m8, CL
mapping clause encdec = SHL_168
  <-> 0xd2 @ modrm(rm, 0b100)

// shl r/m16, CL
mapping clause encdec = SHL_169
  <-> 0xd3 @ modrm(rm, 0b100)

// shr r/m8, 1
mapping clause encdec = SHR_170
  <-> 0xd0 @ modrm(rm, 0b101)

// shr r/m16, 1
mapping clause encdec = SHR_171
  <-> 0xd1 @ modrm(rm, 0b101)

// shr r/m8, CL
mapping clause encdec = SHR_172
  <-> 0xd2 @ modrm(rm, 0b101)

// shr r/m16, CL
mapping clause encdec = SHR_173
  <-> 0xd3 @ modrm(rm, 0b101)

// sar r/m8, 1
mapping clause encdec = SAR_174
  <-> 0xd0 @ modrm(rm, 0b111)

// sar r/m16, 1
mapping clause encdec = SAR_175
  <-> 0xd1 @ modrm(rm, 0b111)

// sar r/m8, CL
mapping clause encdec = SAR_176
  <-> 0xd2 @ modrm(rm, 0b111)

// sar r/m16, CL
mapping clause encdec = SAR_177
  <-> 0xd3 @ modrm(rm, 0b111)

// movsb
mapping clause encdec = MOVSB_178
  <-> 0xa4

// movsw
mapping clause encdec = MOVSW_179
  <-> 0xa5

// cmpsb
mapping clause encdec = CMPSB_180
  <-> 0xa6

// cmpsw
mapping clause encdec = CMPSW_181
  <-> 0xa7

// stosb
mapping clause encdec = STOSB_182
  <-> 0xaa

// stosw
mapping clause encdec = STOSW_183
  <-> 0xab

// lodsb
mapping clause encdec = LODSB_184
  <-> 0xac

// lodsw
mapping clause encdec = LODSW_185
  <-> 0xad

// scasb
mapping clause encdec = SCASB_186
  <-> 0xae

// scasw
mapping clause encdec = SCASW_187
  <-> 0xaf

// call rel16
mapping clause encdec = CALL_188
  <-> 0xe8 @ rel16_le

// call r/m16
mapping clause encdec = CALL_189
  <-> 0xff @ modrm(rm, 0b010)

// call ptr16:16
mapping clause encdec = CALL_190
  <-> 0x9a @ offset_le @ seg16_le

// call FAR m16:16
mapping clause encdec = CALL_191
  <-> 0xff @ modrm(rm, 0b011)

// jmp rel16
mapping clause encdec = JMP_192
  <-> 0xe9 @ rel16_le

// jmp rel8
mapping clause encdec = JMP_193
  <-> 0xeb @ rel8

// jmp r/m16
mapping clause encdec = JMP_194
  <-> 0xff @ modrm(rm, 0b100)

// jmp ptr16:16
mapping clause encdec = JMP_195
  <-> 0xea @ offset_le @ seg16_le

// jmp FAR m16:16
mapping clause encdec = JMP_196
  <-> 0xff @ modrm(rm, 0b101)

// j~cc rel8
mapping clause encdec = JCC_197
  <-> 0b0111 @ cc @ rel8

// loop rel8
mapping clause encdec = LOOP_198
  <-> 0xe2 @ rel8

// loope rel8
mapping clause encdec = LOOPE_199
  <-> 0xe1 @ rel8

// loopne rel8
mapping clause encdec = LOOPNE_200
  <-> 0xe0 @ rel8

// jcxz rel8
mapping clause encdec = JCXZ_201
  <-> 0xe3 @ rel8

// ret
mapping clause encdec = RET_202
  <-> 0xc3

// ret imm16
mapping clause encdec = RET_203
  <-> 0xc2 @ imm16_le

// retf
mapping clause encdec = RETF_204
  <-> 0xcb

// retf imm16
mapping clause encdec = RETF_205
  <-> 0xca @ imm16_le

// int imm8
mapping clause encdec = INT_206
  <-> 0xcd @ imm8

// int3
mapping clause encdec = INT3_207
  <-> 0xcc

// into
mapping clause encdec = INTO_208
  <-> 0xce

// iret
mapping clause encdec = IRET_209
  <-> 0xcf

// clc
mapping clause encdec = CLC_210
  <-> 0xf8

// stc
mapping clause encdec = STC_211
  <-> 0xf9

// cmc
mapping clause encdec = CMC_212
  <-> 0xf5

// cld
mapping clause encdec = CLD_213
  <-> 0xfc

// std
mapping clause encdec = STD_214
  <-> 0xfd

// cli
mapping clause encdec = CLI_215
  <-> 0xfa

// sti
mapping clause encdec = STI_216
  <-> 0xfb

// hlt
mapping clause encdec = HLT_217
  <-> 0xf4

// wait
mapping clause encdec = WAIT_218
  <-> 0x9b

// nop
mapping clause encdec = NOP_219
  <-> 0x90

// lock
mapping clause encdec = LOCK_220
  <-> 0xf0

// rep
mapping clause encdec = REP_221
  <-> 0xf3

// repne
mapping clause encdec = REPNE_222
  <-> 0xf2

// es
mapping clause encdec = ES_223
  <-> 0x26

// cs
mapping clause encdec = CS_224
  <-> 0x2e

// ss
mapping clause encdec = SS_225
  <-> 0x36

// ds
mapping clause encdec = DS_226
  <-> 0x3e

end instruction
