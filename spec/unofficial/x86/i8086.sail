// Intel 8086: encodings, one clause per addressing form.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by
// tools/isa/gen-x86.mjs from the typed opcode table of src/isa/overlay/x86.json (Intel's 8086 Family User's Manual
// notation), each line of which is checked against LLVM's X86 records (opcode, form, prefixes, immediate). Only the
// decode / encode side of a model, not checked by the Sail compiler. Bytes in memory order; 16 bit values low byte
// first. Licensed CC BY-SA 4.0 like the sheets.

scattered union instruction
// add rm8, r8
mapping clause encdec = ADD_0
  <-> 0b00000000 @ 0b11 @ r8 @ rm8

// add [b16], r8
mapping clause encdec = ADD_1
  <-> 0b00000000 @ 0b00 @ r8 @ b16

// add [a16], r8
mapping clause encdec = ADD_2
  <-> 0b00000000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// add [b16xd8], r8
mapping clause encdec = ADD_3
  <-> 0b00000000 @ 0b01 @ r8 @ b16x @ d8

// add [b16xd16], r8
mapping clause encdec = ADD_4
  <-> 0b00000000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// add rm16, r16
mapping clause encdec = ADD_5
  <-> 0b00000001 @ 0b11 @ r16 @ rm16

// add [b16], r16
mapping clause encdec = ADD_6
  <-> 0b00000001 @ 0b00 @ r16 @ b16

// add [a16], r16
mapping clause encdec = ADD_7
  <-> 0b00000001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// add [b16xd8], r16
mapping clause encdec = ADD_8
  <-> 0b00000001 @ 0b01 @ r16 @ b16x @ d8

// add [b16xd16], r16
mapping clause encdec = ADD_9
  <-> 0b00000001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// add r8, rm8
mapping clause encdec = ADD_10
  <-> 0b00000010 @ 0b11 @ r8 @ rm8

// add r8, [b16]
mapping clause encdec = ADD_11
  <-> 0b00000010 @ 0b00 @ r8 @ b16

// add r8, [a16]
mapping clause encdec = ADD_12
  <-> 0b00000010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// add r8, [b16xd8]
mapping clause encdec = ADD_13
  <-> 0b00000010 @ 0b01 @ r8 @ b16x @ d8

// add r8, [b16xd16]
mapping clause encdec = ADD_14
  <-> 0b00000010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// add r16, rm16
mapping clause encdec = ADD_15
  <-> 0b00000011 @ 0b11 @ r16 @ rm16

// add r16, [b16]
mapping clause encdec = ADD_16
  <-> 0b00000011 @ 0b00 @ r16 @ b16

// add r16, [a16]
mapping clause encdec = ADD_17
  <-> 0b00000011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// add r16, [b16xd8]
mapping clause encdec = ADD_18
  <-> 0b00000011 @ 0b01 @ r16 @ b16x @ d8

// add r16, [b16xd16]
mapping clause encdec = ADD_19
  <-> 0b00000011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// add AL, imm
mapping clause encdec = ADD_20
  <-> 0b00000100 @ imm[7..0]

// add AX, imm
mapping clause encdec = ADD_21
  <-> 0b00000101 @ imm[7..0] @ 15..8

// add rm8, imm
mapping clause encdec = ADD_22
  <-> 0b10000000 @ 0b11 @ 0b000 @ rm8 @ imm[7..0]

// add BYTE [b16], imm
mapping clause encdec = ADD_23
  <-> 0b10000000 @ 0b00 @ 0b000 @ b16 @ imm[7..0]

// add BYTE [a16], imm
mapping clause encdec = ADD_24
  <-> 0b10000000 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// add BYTE [b16xd8], imm
mapping clause encdec = ADD_25
  <-> 0b10000000 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0]

// add BYTE [b16xd16], imm
mapping clause encdec = ADD_26
  <-> 0b10000000 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// add rm16, imm
mapping clause encdec = ADD_27
  <-> 0b10000001 @ 0b11 @ 0b000 @ rm16 @ imm[7..0] @ 15..8

// add WORD [b16], imm
mapping clause encdec = ADD_28
  <-> 0b10000001 @ 0b00 @ 0b000 @ b16 @ imm[7..0] @ 15..8

// add WORD [a16], imm
mapping clause encdec = ADD_29
  <-> 0b10000001 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// add WORD [b16xd8], imm
mapping clause encdec = ADD_30
  <-> 0b10000001 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0] @ 15..8

// add WORD [b16xd16], imm
mapping clause encdec = ADD_31
  <-> 0b10000001 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// add rm16, simm
mapping clause encdec = ADD_32
  <-> 0b10000011 @ 0b11 @ 0b000 @ rm16 @ simm[7..0]

// add WORD [b16], simm
mapping clause encdec = ADD_33
  <-> 0b10000011 @ 0b00 @ 0b000 @ b16 @ simm[7..0]

// add WORD [a16], simm
mapping clause encdec = ADD_34
  <-> 0b10000011 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// add WORD [b16xd8], simm
mapping clause encdec = ADD_35
  <-> 0b10000011 @ 0b01 @ 0b000 @ b16x @ d8 @ simm[7..0]

// add WORD [b16xd16], simm
mapping clause encdec = ADD_36
  <-> 0b10000011 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// or rm8, r8
mapping clause encdec = OR_37
  <-> 0b00001000 @ 0b11 @ r8 @ rm8

// or [b16], r8
mapping clause encdec = OR_38
  <-> 0b00001000 @ 0b00 @ r8 @ b16

// or [a16], r8
mapping clause encdec = OR_39
  <-> 0b00001000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// or [b16xd8], r8
mapping clause encdec = OR_40
  <-> 0b00001000 @ 0b01 @ r8 @ b16x @ d8

// or [b16xd16], r8
mapping clause encdec = OR_41
  <-> 0b00001000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// or rm16, r16
mapping clause encdec = OR_42
  <-> 0b00001001 @ 0b11 @ r16 @ rm16

// or [b16], r16
mapping clause encdec = OR_43
  <-> 0b00001001 @ 0b00 @ r16 @ b16

// or [a16], r16
mapping clause encdec = OR_44
  <-> 0b00001001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// or [b16xd8], r16
mapping clause encdec = OR_45
  <-> 0b00001001 @ 0b01 @ r16 @ b16x @ d8

// or [b16xd16], r16
mapping clause encdec = OR_46
  <-> 0b00001001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// or r8, rm8
mapping clause encdec = OR_47
  <-> 0b00001010 @ 0b11 @ r8 @ rm8

// or r8, [b16]
mapping clause encdec = OR_48
  <-> 0b00001010 @ 0b00 @ r8 @ b16

// or r8, [a16]
mapping clause encdec = OR_49
  <-> 0b00001010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// or r8, [b16xd8]
mapping clause encdec = OR_50
  <-> 0b00001010 @ 0b01 @ r8 @ b16x @ d8

// or r8, [b16xd16]
mapping clause encdec = OR_51
  <-> 0b00001010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// or r16, rm16
mapping clause encdec = OR_52
  <-> 0b00001011 @ 0b11 @ r16 @ rm16

// or r16, [b16]
mapping clause encdec = OR_53
  <-> 0b00001011 @ 0b00 @ r16 @ b16

// or r16, [a16]
mapping clause encdec = OR_54
  <-> 0b00001011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// or r16, [b16xd8]
mapping clause encdec = OR_55
  <-> 0b00001011 @ 0b01 @ r16 @ b16x @ d8

// or r16, [b16xd16]
mapping clause encdec = OR_56
  <-> 0b00001011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// or AL, imm
mapping clause encdec = OR_57
  <-> 0b00001100 @ imm[7..0]

// or AX, imm
mapping clause encdec = OR_58
  <-> 0b00001101 @ imm[7..0] @ 15..8

// or rm8, imm
mapping clause encdec = OR_59
  <-> 0b10000000 @ 0b11 @ 0b001 @ rm8 @ imm[7..0]

// or BYTE [b16], imm
mapping clause encdec = OR_60
  <-> 0b10000000 @ 0b00 @ 0b001 @ b16 @ imm[7..0]

// or BYTE [a16], imm
mapping clause encdec = OR_61
  <-> 0b10000000 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// or BYTE [b16xd8], imm
mapping clause encdec = OR_62
  <-> 0b10000000 @ 0b01 @ 0b001 @ b16x @ d8 @ imm[7..0]

// or BYTE [b16xd16], imm
mapping clause encdec = OR_63
  <-> 0b10000000 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// or rm16, imm
mapping clause encdec = OR_64
  <-> 0b10000001 @ 0b11 @ 0b001 @ rm16 @ imm[7..0] @ 15..8

// or WORD [b16], imm
mapping clause encdec = OR_65
  <-> 0b10000001 @ 0b00 @ 0b001 @ b16 @ imm[7..0] @ 15..8

// or WORD [a16], imm
mapping clause encdec = OR_66
  <-> 0b10000001 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// or WORD [b16xd8], imm
mapping clause encdec = OR_67
  <-> 0b10000001 @ 0b01 @ 0b001 @ b16x @ d8 @ imm[7..0] @ 15..8

// or WORD [b16xd16], imm
mapping clause encdec = OR_68
  <-> 0b10000001 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// or rm16, simm
mapping clause encdec = OR_69
  <-> 0b10000011 @ 0b11 @ 0b001 @ rm16 @ simm[7..0]

// or WORD [b16], simm
mapping clause encdec = OR_70
  <-> 0b10000011 @ 0b00 @ 0b001 @ b16 @ simm[7..0]

// or WORD [a16], simm
mapping clause encdec = OR_71
  <-> 0b10000011 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// or WORD [b16xd8], simm
mapping clause encdec = OR_72
  <-> 0b10000011 @ 0b01 @ 0b001 @ b16x @ d8 @ simm[7..0]

// or WORD [b16xd16], simm
mapping clause encdec = OR_73
  <-> 0b10000011 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// adc rm8, r8
mapping clause encdec = ADC_74
  <-> 0b00010000 @ 0b11 @ r8 @ rm8

// adc [b16], r8
mapping clause encdec = ADC_75
  <-> 0b00010000 @ 0b00 @ r8 @ b16

// adc [a16], r8
mapping clause encdec = ADC_76
  <-> 0b00010000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// adc [b16xd8], r8
mapping clause encdec = ADC_77
  <-> 0b00010000 @ 0b01 @ r8 @ b16x @ d8

// adc [b16xd16], r8
mapping clause encdec = ADC_78
  <-> 0b00010000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// adc rm16, r16
mapping clause encdec = ADC_79
  <-> 0b00010001 @ 0b11 @ r16 @ rm16

// adc [b16], r16
mapping clause encdec = ADC_80
  <-> 0b00010001 @ 0b00 @ r16 @ b16

// adc [a16], r16
mapping clause encdec = ADC_81
  <-> 0b00010001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// adc [b16xd8], r16
mapping clause encdec = ADC_82
  <-> 0b00010001 @ 0b01 @ r16 @ b16x @ d8

// adc [b16xd16], r16
mapping clause encdec = ADC_83
  <-> 0b00010001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// adc r8, rm8
mapping clause encdec = ADC_84
  <-> 0b00010010 @ 0b11 @ r8 @ rm8

// adc r8, [b16]
mapping clause encdec = ADC_85
  <-> 0b00010010 @ 0b00 @ r8 @ b16

// adc r8, [a16]
mapping clause encdec = ADC_86
  <-> 0b00010010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// adc r8, [b16xd8]
mapping clause encdec = ADC_87
  <-> 0b00010010 @ 0b01 @ r8 @ b16x @ d8

// adc r8, [b16xd16]
mapping clause encdec = ADC_88
  <-> 0b00010010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// adc r16, rm16
mapping clause encdec = ADC_89
  <-> 0b00010011 @ 0b11 @ r16 @ rm16

// adc r16, [b16]
mapping clause encdec = ADC_90
  <-> 0b00010011 @ 0b00 @ r16 @ b16

// adc r16, [a16]
mapping clause encdec = ADC_91
  <-> 0b00010011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// adc r16, [b16xd8]
mapping clause encdec = ADC_92
  <-> 0b00010011 @ 0b01 @ r16 @ b16x @ d8

// adc r16, [b16xd16]
mapping clause encdec = ADC_93
  <-> 0b00010011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// adc AL, imm
mapping clause encdec = ADC_94
  <-> 0b00010100 @ imm[7..0]

// adc AX, imm
mapping clause encdec = ADC_95
  <-> 0b00010101 @ imm[7..0] @ 15..8

// adc rm8, imm
mapping clause encdec = ADC_96
  <-> 0b10000000 @ 0b11 @ 0b010 @ rm8 @ imm[7..0]

// adc BYTE [b16], imm
mapping clause encdec = ADC_97
  <-> 0b10000000 @ 0b00 @ 0b010 @ b16 @ imm[7..0]

// adc BYTE [a16], imm
mapping clause encdec = ADC_98
  <-> 0b10000000 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// adc BYTE [b16xd8], imm
mapping clause encdec = ADC_99
  <-> 0b10000000 @ 0b01 @ 0b010 @ b16x @ d8 @ imm[7..0]

// adc BYTE [b16xd16], imm
mapping clause encdec = ADC_100
  <-> 0b10000000 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// adc rm16, imm
mapping clause encdec = ADC_101
  <-> 0b10000001 @ 0b11 @ 0b010 @ rm16 @ imm[7..0] @ 15..8

// adc WORD [b16], imm
mapping clause encdec = ADC_102
  <-> 0b10000001 @ 0b00 @ 0b010 @ b16 @ imm[7..0] @ 15..8

// adc WORD [a16], imm
mapping clause encdec = ADC_103
  <-> 0b10000001 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// adc WORD [b16xd8], imm
mapping clause encdec = ADC_104
  <-> 0b10000001 @ 0b01 @ 0b010 @ b16x @ d8 @ imm[7..0] @ 15..8

// adc WORD [b16xd16], imm
mapping clause encdec = ADC_105
  <-> 0b10000001 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// adc rm16, simm
mapping clause encdec = ADC_106
  <-> 0b10000011 @ 0b11 @ 0b010 @ rm16 @ simm[7..0]

// adc WORD [b16], simm
mapping clause encdec = ADC_107
  <-> 0b10000011 @ 0b00 @ 0b010 @ b16 @ simm[7..0]

// adc WORD [a16], simm
mapping clause encdec = ADC_108
  <-> 0b10000011 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// adc WORD [b16xd8], simm
mapping clause encdec = ADC_109
  <-> 0b10000011 @ 0b01 @ 0b010 @ b16x @ d8 @ simm[7..0]

// adc WORD [b16xd16], simm
mapping clause encdec = ADC_110
  <-> 0b10000011 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// sbb rm8, r8
mapping clause encdec = SBB_111
  <-> 0b00011000 @ 0b11 @ r8 @ rm8

// sbb [b16], r8
mapping clause encdec = SBB_112
  <-> 0b00011000 @ 0b00 @ r8 @ b16

// sbb [a16], r8
mapping clause encdec = SBB_113
  <-> 0b00011000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// sbb [b16xd8], r8
mapping clause encdec = SBB_114
  <-> 0b00011000 @ 0b01 @ r8 @ b16x @ d8

// sbb [b16xd16], r8
mapping clause encdec = SBB_115
  <-> 0b00011000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// sbb rm16, r16
mapping clause encdec = SBB_116
  <-> 0b00011001 @ 0b11 @ r16 @ rm16

// sbb [b16], r16
mapping clause encdec = SBB_117
  <-> 0b00011001 @ 0b00 @ r16 @ b16

// sbb [a16], r16
mapping clause encdec = SBB_118
  <-> 0b00011001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// sbb [b16xd8], r16
mapping clause encdec = SBB_119
  <-> 0b00011001 @ 0b01 @ r16 @ b16x @ d8

// sbb [b16xd16], r16
mapping clause encdec = SBB_120
  <-> 0b00011001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// sbb r8, rm8
mapping clause encdec = SBB_121
  <-> 0b00011010 @ 0b11 @ r8 @ rm8

// sbb r8, [b16]
mapping clause encdec = SBB_122
  <-> 0b00011010 @ 0b00 @ r8 @ b16

// sbb r8, [a16]
mapping clause encdec = SBB_123
  <-> 0b00011010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// sbb r8, [b16xd8]
mapping clause encdec = SBB_124
  <-> 0b00011010 @ 0b01 @ r8 @ b16x @ d8

// sbb r8, [b16xd16]
mapping clause encdec = SBB_125
  <-> 0b00011010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// sbb r16, rm16
mapping clause encdec = SBB_126
  <-> 0b00011011 @ 0b11 @ r16 @ rm16

// sbb r16, [b16]
mapping clause encdec = SBB_127
  <-> 0b00011011 @ 0b00 @ r16 @ b16

// sbb r16, [a16]
mapping clause encdec = SBB_128
  <-> 0b00011011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// sbb r16, [b16xd8]
mapping clause encdec = SBB_129
  <-> 0b00011011 @ 0b01 @ r16 @ b16x @ d8

// sbb r16, [b16xd16]
mapping clause encdec = SBB_130
  <-> 0b00011011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// sbb AL, imm
mapping clause encdec = SBB_131
  <-> 0b00011100 @ imm[7..0]

// sbb AX, imm
mapping clause encdec = SBB_132
  <-> 0b00011101 @ imm[7..0] @ 15..8

// sbb rm8, imm
mapping clause encdec = SBB_133
  <-> 0b10000000 @ 0b11 @ 0b011 @ rm8 @ imm[7..0]

// sbb BYTE [b16], imm
mapping clause encdec = SBB_134
  <-> 0b10000000 @ 0b00 @ 0b011 @ b16 @ imm[7..0]

// sbb BYTE [a16], imm
mapping clause encdec = SBB_135
  <-> 0b10000000 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// sbb BYTE [b16xd8], imm
mapping clause encdec = SBB_136
  <-> 0b10000000 @ 0b01 @ 0b011 @ b16x @ d8 @ imm[7..0]

// sbb BYTE [b16xd16], imm
mapping clause encdec = SBB_137
  <-> 0b10000000 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// sbb rm16, imm
mapping clause encdec = SBB_138
  <-> 0b10000001 @ 0b11 @ 0b011 @ rm16 @ imm[7..0] @ 15..8

// sbb WORD [b16], imm
mapping clause encdec = SBB_139
  <-> 0b10000001 @ 0b00 @ 0b011 @ b16 @ imm[7..0] @ 15..8

// sbb WORD [a16], imm
mapping clause encdec = SBB_140
  <-> 0b10000001 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// sbb WORD [b16xd8], imm
mapping clause encdec = SBB_141
  <-> 0b10000001 @ 0b01 @ 0b011 @ b16x @ d8 @ imm[7..0] @ 15..8

// sbb WORD [b16xd16], imm
mapping clause encdec = SBB_142
  <-> 0b10000001 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// sbb rm16, simm
mapping clause encdec = SBB_143
  <-> 0b10000011 @ 0b11 @ 0b011 @ rm16 @ simm[7..0]

// sbb WORD [b16], simm
mapping clause encdec = SBB_144
  <-> 0b10000011 @ 0b00 @ 0b011 @ b16 @ simm[7..0]

// sbb WORD [a16], simm
mapping clause encdec = SBB_145
  <-> 0b10000011 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// sbb WORD [b16xd8], simm
mapping clause encdec = SBB_146
  <-> 0b10000011 @ 0b01 @ 0b011 @ b16x @ d8 @ simm[7..0]

// sbb WORD [b16xd16], simm
mapping clause encdec = SBB_147
  <-> 0b10000011 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// and rm8, r8
mapping clause encdec = AND_148
  <-> 0b00100000 @ 0b11 @ r8 @ rm8

// and [b16], r8
mapping clause encdec = AND_149
  <-> 0b00100000 @ 0b00 @ r8 @ b16

// and [a16], r8
mapping clause encdec = AND_150
  <-> 0b00100000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// and [b16xd8], r8
mapping clause encdec = AND_151
  <-> 0b00100000 @ 0b01 @ r8 @ b16x @ d8

// and [b16xd16], r8
mapping clause encdec = AND_152
  <-> 0b00100000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// and rm16, r16
mapping clause encdec = AND_153
  <-> 0b00100001 @ 0b11 @ r16 @ rm16

// and [b16], r16
mapping clause encdec = AND_154
  <-> 0b00100001 @ 0b00 @ r16 @ b16

// and [a16], r16
mapping clause encdec = AND_155
  <-> 0b00100001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// and [b16xd8], r16
mapping clause encdec = AND_156
  <-> 0b00100001 @ 0b01 @ r16 @ b16x @ d8

// and [b16xd16], r16
mapping clause encdec = AND_157
  <-> 0b00100001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// and r8, rm8
mapping clause encdec = AND_158
  <-> 0b00100010 @ 0b11 @ r8 @ rm8

// and r8, [b16]
mapping clause encdec = AND_159
  <-> 0b00100010 @ 0b00 @ r8 @ b16

// and r8, [a16]
mapping clause encdec = AND_160
  <-> 0b00100010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// and r8, [b16xd8]
mapping clause encdec = AND_161
  <-> 0b00100010 @ 0b01 @ r8 @ b16x @ d8

// and r8, [b16xd16]
mapping clause encdec = AND_162
  <-> 0b00100010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// and r16, rm16
mapping clause encdec = AND_163
  <-> 0b00100011 @ 0b11 @ r16 @ rm16

// and r16, [b16]
mapping clause encdec = AND_164
  <-> 0b00100011 @ 0b00 @ r16 @ b16

// and r16, [a16]
mapping clause encdec = AND_165
  <-> 0b00100011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// and r16, [b16xd8]
mapping clause encdec = AND_166
  <-> 0b00100011 @ 0b01 @ r16 @ b16x @ d8

// and r16, [b16xd16]
mapping clause encdec = AND_167
  <-> 0b00100011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// and AL, imm
mapping clause encdec = AND_168
  <-> 0b00100100 @ imm[7..0]

// and AX, imm
mapping clause encdec = AND_169
  <-> 0b00100101 @ imm[7..0] @ 15..8

// and rm8, imm
mapping clause encdec = AND_170
  <-> 0b10000000 @ 0b11 @ 0b100 @ rm8 @ imm[7..0]

// and BYTE [b16], imm
mapping clause encdec = AND_171
  <-> 0b10000000 @ 0b00 @ 0b100 @ b16 @ imm[7..0]

// and BYTE [a16], imm
mapping clause encdec = AND_172
  <-> 0b10000000 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// and BYTE [b16xd8], imm
mapping clause encdec = AND_173
  <-> 0b10000000 @ 0b01 @ 0b100 @ b16x @ d8 @ imm[7..0]

// and BYTE [b16xd16], imm
mapping clause encdec = AND_174
  <-> 0b10000000 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// and rm16, imm
mapping clause encdec = AND_175
  <-> 0b10000001 @ 0b11 @ 0b100 @ rm16 @ imm[7..0] @ 15..8

// and WORD [b16], imm
mapping clause encdec = AND_176
  <-> 0b10000001 @ 0b00 @ 0b100 @ b16 @ imm[7..0] @ 15..8

// and WORD [a16], imm
mapping clause encdec = AND_177
  <-> 0b10000001 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// and WORD [b16xd8], imm
mapping clause encdec = AND_178
  <-> 0b10000001 @ 0b01 @ 0b100 @ b16x @ d8 @ imm[7..0] @ 15..8

// and WORD [b16xd16], imm
mapping clause encdec = AND_179
  <-> 0b10000001 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// and rm16, simm
mapping clause encdec = AND_180
  <-> 0b10000011 @ 0b11 @ 0b100 @ rm16 @ simm[7..0]

// and WORD [b16], simm
mapping clause encdec = AND_181
  <-> 0b10000011 @ 0b00 @ 0b100 @ b16 @ simm[7..0]

// and WORD [a16], simm
mapping clause encdec = AND_182
  <-> 0b10000011 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// and WORD [b16xd8], simm
mapping clause encdec = AND_183
  <-> 0b10000011 @ 0b01 @ 0b100 @ b16x @ d8 @ simm[7..0]

// and WORD [b16xd16], simm
mapping clause encdec = AND_184
  <-> 0b10000011 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// sub rm8, r8
mapping clause encdec = SUB_185
  <-> 0b00101000 @ 0b11 @ r8 @ rm8

// sub [b16], r8
mapping clause encdec = SUB_186
  <-> 0b00101000 @ 0b00 @ r8 @ b16

// sub [a16], r8
mapping clause encdec = SUB_187
  <-> 0b00101000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// sub [b16xd8], r8
mapping clause encdec = SUB_188
  <-> 0b00101000 @ 0b01 @ r8 @ b16x @ d8

// sub [b16xd16], r8
mapping clause encdec = SUB_189
  <-> 0b00101000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// sub rm16, r16
mapping clause encdec = SUB_190
  <-> 0b00101001 @ 0b11 @ r16 @ rm16

// sub [b16], r16
mapping clause encdec = SUB_191
  <-> 0b00101001 @ 0b00 @ r16 @ b16

// sub [a16], r16
mapping clause encdec = SUB_192
  <-> 0b00101001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// sub [b16xd8], r16
mapping clause encdec = SUB_193
  <-> 0b00101001 @ 0b01 @ r16 @ b16x @ d8

// sub [b16xd16], r16
mapping clause encdec = SUB_194
  <-> 0b00101001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// sub r8, rm8
mapping clause encdec = SUB_195
  <-> 0b00101010 @ 0b11 @ r8 @ rm8

// sub r8, [b16]
mapping clause encdec = SUB_196
  <-> 0b00101010 @ 0b00 @ r8 @ b16

// sub r8, [a16]
mapping clause encdec = SUB_197
  <-> 0b00101010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// sub r8, [b16xd8]
mapping clause encdec = SUB_198
  <-> 0b00101010 @ 0b01 @ r8 @ b16x @ d8

// sub r8, [b16xd16]
mapping clause encdec = SUB_199
  <-> 0b00101010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// sub r16, rm16
mapping clause encdec = SUB_200
  <-> 0b00101011 @ 0b11 @ r16 @ rm16

// sub r16, [b16]
mapping clause encdec = SUB_201
  <-> 0b00101011 @ 0b00 @ r16 @ b16

// sub r16, [a16]
mapping clause encdec = SUB_202
  <-> 0b00101011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// sub r16, [b16xd8]
mapping clause encdec = SUB_203
  <-> 0b00101011 @ 0b01 @ r16 @ b16x @ d8

// sub r16, [b16xd16]
mapping clause encdec = SUB_204
  <-> 0b00101011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// sub AL, imm
mapping clause encdec = SUB_205
  <-> 0b00101100 @ imm[7..0]

// sub AX, imm
mapping clause encdec = SUB_206
  <-> 0b00101101 @ imm[7..0] @ 15..8

// sub rm8, imm
mapping clause encdec = SUB_207
  <-> 0b10000000 @ 0b11 @ 0b101 @ rm8 @ imm[7..0]

// sub BYTE [b16], imm
mapping clause encdec = SUB_208
  <-> 0b10000000 @ 0b00 @ 0b101 @ b16 @ imm[7..0]

// sub BYTE [a16], imm
mapping clause encdec = SUB_209
  <-> 0b10000000 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// sub BYTE [b16xd8], imm
mapping clause encdec = SUB_210
  <-> 0b10000000 @ 0b01 @ 0b101 @ b16x @ d8 @ imm[7..0]

// sub BYTE [b16xd16], imm
mapping clause encdec = SUB_211
  <-> 0b10000000 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// sub rm16, imm
mapping clause encdec = SUB_212
  <-> 0b10000001 @ 0b11 @ 0b101 @ rm16 @ imm[7..0] @ 15..8

// sub WORD [b16], imm
mapping clause encdec = SUB_213
  <-> 0b10000001 @ 0b00 @ 0b101 @ b16 @ imm[7..0] @ 15..8

// sub WORD [a16], imm
mapping clause encdec = SUB_214
  <-> 0b10000001 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// sub WORD [b16xd8], imm
mapping clause encdec = SUB_215
  <-> 0b10000001 @ 0b01 @ 0b101 @ b16x @ d8 @ imm[7..0] @ 15..8

// sub WORD [b16xd16], imm
mapping clause encdec = SUB_216
  <-> 0b10000001 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// sub rm16, simm
mapping clause encdec = SUB_217
  <-> 0b10000011 @ 0b11 @ 0b101 @ rm16 @ simm[7..0]

// sub WORD [b16], simm
mapping clause encdec = SUB_218
  <-> 0b10000011 @ 0b00 @ 0b101 @ b16 @ simm[7..0]

// sub WORD [a16], simm
mapping clause encdec = SUB_219
  <-> 0b10000011 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// sub WORD [b16xd8], simm
mapping clause encdec = SUB_220
  <-> 0b10000011 @ 0b01 @ 0b101 @ b16x @ d8 @ simm[7..0]

// sub WORD [b16xd16], simm
mapping clause encdec = SUB_221
  <-> 0b10000011 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// xor rm8, r8
mapping clause encdec = XOR_222
  <-> 0b00110000 @ 0b11 @ r8 @ rm8

// xor [b16], r8
mapping clause encdec = XOR_223
  <-> 0b00110000 @ 0b00 @ r8 @ b16

// xor [a16], r8
mapping clause encdec = XOR_224
  <-> 0b00110000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// xor [b16xd8], r8
mapping clause encdec = XOR_225
  <-> 0b00110000 @ 0b01 @ r8 @ b16x @ d8

// xor [b16xd16], r8
mapping clause encdec = XOR_226
  <-> 0b00110000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// xor rm16, r16
mapping clause encdec = XOR_227
  <-> 0b00110001 @ 0b11 @ r16 @ rm16

// xor [b16], r16
mapping clause encdec = XOR_228
  <-> 0b00110001 @ 0b00 @ r16 @ b16

// xor [a16], r16
mapping clause encdec = XOR_229
  <-> 0b00110001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// xor [b16xd8], r16
mapping clause encdec = XOR_230
  <-> 0b00110001 @ 0b01 @ r16 @ b16x @ d8

// xor [b16xd16], r16
mapping clause encdec = XOR_231
  <-> 0b00110001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// xor r8, rm8
mapping clause encdec = XOR_232
  <-> 0b00110010 @ 0b11 @ r8 @ rm8

// xor r8, [b16]
mapping clause encdec = XOR_233
  <-> 0b00110010 @ 0b00 @ r8 @ b16

// xor r8, [a16]
mapping clause encdec = XOR_234
  <-> 0b00110010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// xor r8, [b16xd8]
mapping clause encdec = XOR_235
  <-> 0b00110010 @ 0b01 @ r8 @ b16x @ d8

// xor r8, [b16xd16]
mapping clause encdec = XOR_236
  <-> 0b00110010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// xor r16, rm16
mapping clause encdec = XOR_237
  <-> 0b00110011 @ 0b11 @ r16 @ rm16

// xor r16, [b16]
mapping clause encdec = XOR_238
  <-> 0b00110011 @ 0b00 @ r16 @ b16

// xor r16, [a16]
mapping clause encdec = XOR_239
  <-> 0b00110011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// xor r16, [b16xd8]
mapping clause encdec = XOR_240
  <-> 0b00110011 @ 0b01 @ r16 @ b16x @ d8

// xor r16, [b16xd16]
mapping clause encdec = XOR_241
  <-> 0b00110011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// xor AL, imm
mapping clause encdec = XOR_242
  <-> 0b00110100 @ imm[7..0]

// xor AX, imm
mapping clause encdec = XOR_243
  <-> 0b00110101 @ imm[7..0] @ 15..8

// xor rm8, imm
mapping clause encdec = XOR_244
  <-> 0b10000000 @ 0b11 @ 0b110 @ rm8 @ imm[7..0]

// xor BYTE [b16], imm
mapping clause encdec = XOR_245
  <-> 0b10000000 @ 0b00 @ 0b110 @ b16 @ imm[7..0]

// xor BYTE [a16], imm
mapping clause encdec = XOR_246
  <-> 0b10000000 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// xor BYTE [b16xd8], imm
mapping clause encdec = XOR_247
  <-> 0b10000000 @ 0b01 @ 0b110 @ b16x @ d8 @ imm[7..0]

// xor BYTE [b16xd16], imm
mapping clause encdec = XOR_248
  <-> 0b10000000 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// xor rm16, imm
mapping clause encdec = XOR_249
  <-> 0b10000001 @ 0b11 @ 0b110 @ rm16 @ imm[7..0] @ 15..8

// xor WORD [b16], imm
mapping clause encdec = XOR_250
  <-> 0b10000001 @ 0b00 @ 0b110 @ b16 @ imm[7..0] @ 15..8

// xor WORD [a16], imm
mapping clause encdec = XOR_251
  <-> 0b10000001 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// xor WORD [b16xd8], imm
mapping clause encdec = XOR_252
  <-> 0b10000001 @ 0b01 @ 0b110 @ b16x @ d8 @ imm[7..0] @ 15..8

// xor WORD [b16xd16], imm
mapping clause encdec = XOR_253
  <-> 0b10000001 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// xor rm16, simm
mapping clause encdec = XOR_254
  <-> 0b10000011 @ 0b11 @ 0b110 @ rm16 @ simm[7..0]

// xor WORD [b16], simm
mapping clause encdec = XOR_255
  <-> 0b10000011 @ 0b00 @ 0b110 @ b16 @ simm[7..0]

// xor WORD [a16], simm
mapping clause encdec = XOR_256
  <-> 0b10000011 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// xor WORD [b16xd8], simm
mapping clause encdec = XOR_257
  <-> 0b10000011 @ 0b01 @ 0b110 @ b16x @ d8 @ simm[7..0]

// xor WORD [b16xd16], simm
mapping clause encdec = XOR_258
  <-> 0b10000011 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// cmp rm8, r8
mapping clause encdec = CMP_259
  <-> 0b00111000 @ 0b11 @ r8 @ rm8

// cmp [b16], r8
mapping clause encdec = CMP_260
  <-> 0b00111000 @ 0b00 @ r8 @ b16

// cmp [a16], r8
mapping clause encdec = CMP_261
  <-> 0b00111000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// cmp [b16xd8], r8
mapping clause encdec = CMP_262
  <-> 0b00111000 @ 0b01 @ r8 @ b16x @ d8

// cmp [b16xd16], r8
mapping clause encdec = CMP_263
  <-> 0b00111000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// cmp rm16, r16
mapping clause encdec = CMP_264
  <-> 0b00111001 @ 0b11 @ r16 @ rm16

// cmp [b16], r16
mapping clause encdec = CMP_265
  <-> 0b00111001 @ 0b00 @ r16 @ b16

// cmp [a16], r16
mapping clause encdec = CMP_266
  <-> 0b00111001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// cmp [b16xd8], r16
mapping clause encdec = CMP_267
  <-> 0b00111001 @ 0b01 @ r16 @ b16x @ d8

// cmp [b16xd16], r16
mapping clause encdec = CMP_268
  <-> 0b00111001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// cmp r8, rm8
mapping clause encdec = CMP_269
  <-> 0b00111010 @ 0b11 @ r8 @ rm8

// cmp r8, [b16]
mapping clause encdec = CMP_270
  <-> 0b00111010 @ 0b00 @ r8 @ b16

// cmp r8, [a16]
mapping clause encdec = CMP_271
  <-> 0b00111010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// cmp r8, [b16xd8]
mapping clause encdec = CMP_272
  <-> 0b00111010 @ 0b01 @ r8 @ b16x @ d8

// cmp r8, [b16xd16]
mapping clause encdec = CMP_273
  <-> 0b00111010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// cmp r16, rm16
mapping clause encdec = CMP_274
  <-> 0b00111011 @ 0b11 @ r16 @ rm16

// cmp r16, [b16]
mapping clause encdec = CMP_275
  <-> 0b00111011 @ 0b00 @ r16 @ b16

// cmp r16, [a16]
mapping clause encdec = CMP_276
  <-> 0b00111011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// cmp r16, [b16xd8]
mapping clause encdec = CMP_277
  <-> 0b00111011 @ 0b01 @ r16 @ b16x @ d8

// cmp r16, [b16xd16]
mapping clause encdec = CMP_278
  <-> 0b00111011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// cmp AL, imm
mapping clause encdec = CMP_279
  <-> 0b00111100 @ imm[7..0]

// cmp AX, imm
mapping clause encdec = CMP_280
  <-> 0b00111101 @ imm[7..0] @ 15..8

// cmp rm8, imm
mapping clause encdec = CMP_281
  <-> 0b10000000 @ 0b11 @ 0b111 @ rm8 @ imm[7..0]

// cmp BYTE [b16], imm
mapping clause encdec = CMP_282
  <-> 0b10000000 @ 0b00 @ 0b111 @ b16 @ imm[7..0]

// cmp BYTE [a16], imm
mapping clause encdec = CMP_283
  <-> 0b10000000 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// cmp BYTE [b16xd8], imm
mapping clause encdec = CMP_284
  <-> 0b10000000 @ 0b01 @ 0b111 @ b16x @ d8 @ imm[7..0]

// cmp BYTE [b16xd16], imm
mapping clause encdec = CMP_285
  <-> 0b10000000 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// cmp rm16, imm
mapping clause encdec = CMP_286
  <-> 0b10000001 @ 0b11 @ 0b111 @ rm16 @ imm[7..0] @ 15..8

// cmp WORD [b16], imm
mapping clause encdec = CMP_287
  <-> 0b10000001 @ 0b00 @ 0b111 @ b16 @ imm[7..0] @ 15..8

// cmp WORD [a16], imm
mapping clause encdec = CMP_288
  <-> 0b10000001 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// cmp WORD [b16xd8], imm
mapping clause encdec = CMP_289
  <-> 0b10000001 @ 0b01 @ 0b111 @ b16x @ d8 @ imm[7..0] @ 15..8

// cmp WORD [b16xd16], imm
mapping clause encdec = CMP_290
  <-> 0b10000001 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// cmp rm16, simm
mapping clause encdec = CMP_291
  <-> 0b10000011 @ 0b11 @ 0b111 @ rm16 @ simm[7..0]

// cmp WORD [b16], simm
mapping clause encdec = CMP_292
  <-> 0b10000011 @ 0b00 @ 0b111 @ b16 @ simm[7..0]

// cmp WORD [a16], simm
mapping clause encdec = CMP_293
  <-> 0b10000011 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8] @ simm[7..0]

// cmp WORD [b16xd8], simm
mapping clause encdec = CMP_294
  <-> 0b10000011 @ 0b01 @ 0b111 @ b16x @ d8 @ simm[7..0]

// cmp WORD [b16xd16], simm
mapping clause encdec = CMP_295
  <-> 0b10000011 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8] @ simm[7..0]

// inc rm8
mapping clause encdec = INC_296
  <-> 0b11111110 @ 0b11 @ 0b000 @ rm8

// inc BYTE [b16]
mapping clause encdec = INC_297
  <-> 0b11111110 @ 0b00 @ 0b000 @ b16

// inc BYTE [a16]
mapping clause encdec = INC_298
  <-> 0b11111110 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// inc BYTE [b16xd8]
mapping clause encdec = INC_299
  <-> 0b11111110 @ 0b01 @ 0b000 @ b16x @ d8

// inc BYTE [b16xd16]
mapping clause encdec = INC_300
  <-> 0b11111110 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// inc rm16
mapping clause encdec = INC_301
  <-> 0b11111111 @ 0b11 @ 0b000 @ rm16

// inc WORD [b16]
mapping clause encdec = INC_302
  <-> 0b11111111 @ 0b00 @ 0b000 @ b16

// inc WORD [a16]
mapping clause encdec = INC_303
  <-> 0b11111111 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// inc WORD [b16xd8]
mapping clause encdec = INC_304
  <-> 0b11111111 @ 0b01 @ 0b000 @ b16x @ d8

// inc WORD [b16xd16]
mapping clause encdec = INC_305
  <-> 0b11111111 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// inc r16
mapping clause encdec = INC_306
  <-> 0b01000 @ r16

// dec rm8
mapping clause encdec = DEC_307
  <-> 0b11111110 @ 0b11 @ 0b001 @ rm8

// dec BYTE [b16]
mapping clause encdec = DEC_308
  <-> 0b11111110 @ 0b00 @ 0b001 @ b16

// dec BYTE [a16]
mapping clause encdec = DEC_309
  <-> 0b11111110 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// dec BYTE [b16xd8]
mapping clause encdec = DEC_310
  <-> 0b11111110 @ 0b01 @ 0b001 @ b16x @ d8

// dec BYTE [b16xd16]
mapping clause encdec = DEC_311
  <-> 0b11111110 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// dec rm16
mapping clause encdec = DEC_312
  <-> 0b11111111 @ 0b11 @ 0b001 @ rm16

// dec WORD [b16]
mapping clause encdec = DEC_313
  <-> 0b11111111 @ 0b00 @ 0b001 @ b16

// dec WORD [a16]
mapping clause encdec = DEC_314
  <-> 0b11111111 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// dec WORD [b16xd8]
mapping clause encdec = DEC_315
  <-> 0b11111111 @ 0b01 @ 0b001 @ b16x @ d8

// dec WORD [b16xd16]
mapping clause encdec = DEC_316
  <-> 0b11111111 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// dec r16
mapping clause encdec = DEC_317
  <-> 0b01001 @ r16

// not rm8
mapping clause encdec = NOT_318
  <-> 0b11110110 @ 0b11 @ 0b010 @ rm8

// not BYTE [b16]
mapping clause encdec = NOT_319
  <-> 0b11110110 @ 0b00 @ 0b010 @ b16

// not BYTE [a16]
mapping clause encdec = NOT_320
  <-> 0b11110110 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// not BYTE [b16xd8]
mapping clause encdec = NOT_321
  <-> 0b11110110 @ 0b01 @ 0b010 @ b16x @ d8

// not BYTE [b16xd16]
mapping clause encdec = NOT_322
  <-> 0b11110110 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// not rm16
mapping clause encdec = NOT_323
  <-> 0b11110111 @ 0b11 @ 0b010 @ rm16

// not WORD [b16]
mapping clause encdec = NOT_324
  <-> 0b11110111 @ 0b00 @ 0b010 @ b16

// not WORD [a16]
mapping clause encdec = NOT_325
  <-> 0b11110111 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// not WORD [b16xd8]
mapping clause encdec = NOT_326
  <-> 0b11110111 @ 0b01 @ 0b010 @ b16x @ d8

// not WORD [b16xd16]
mapping clause encdec = NOT_327
  <-> 0b11110111 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// neg rm8
mapping clause encdec = NEG_328
  <-> 0b11110110 @ 0b11 @ 0b011 @ rm8

// neg BYTE [b16]
mapping clause encdec = NEG_329
  <-> 0b11110110 @ 0b00 @ 0b011 @ b16

// neg BYTE [a16]
mapping clause encdec = NEG_330
  <-> 0b11110110 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// neg BYTE [b16xd8]
mapping clause encdec = NEG_331
  <-> 0b11110110 @ 0b01 @ 0b011 @ b16x @ d8

// neg BYTE [b16xd16]
mapping clause encdec = NEG_332
  <-> 0b11110110 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// neg rm16
mapping clause encdec = NEG_333
  <-> 0b11110111 @ 0b11 @ 0b011 @ rm16

// neg WORD [b16]
mapping clause encdec = NEG_334
  <-> 0b11110111 @ 0b00 @ 0b011 @ b16

// neg WORD [a16]
mapping clause encdec = NEG_335
  <-> 0b11110111 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// neg WORD [b16xd8]
mapping clause encdec = NEG_336
  <-> 0b11110111 @ 0b01 @ 0b011 @ b16x @ d8

// neg WORD [b16xd16]
mapping clause encdec = NEG_337
  <-> 0b11110111 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// mul rm8
mapping clause encdec = MUL_338
  <-> 0b11110110 @ 0b11 @ 0b100 @ rm8

// mul BYTE [b16]
mapping clause encdec = MUL_339
  <-> 0b11110110 @ 0b00 @ 0b100 @ b16

// mul BYTE [a16]
mapping clause encdec = MUL_340
  <-> 0b11110110 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// mul BYTE [b16xd8]
mapping clause encdec = MUL_341
  <-> 0b11110110 @ 0b01 @ 0b100 @ b16x @ d8

// mul BYTE [b16xd16]
mapping clause encdec = MUL_342
  <-> 0b11110110 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// mul rm16
mapping clause encdec = MUL_343
  <-> 0b11110111 @ 0b11 @ 0b100 @ rm16

// mul WORD [b16]
mapping clause encdec = MUL_344
  <-> 0b11110111 @ 0b00 @ 0b100 @ b16

// mul WORD [a16]
mapping clause encdec = MUL_345
  <-> 0b11110111 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// mul WORD [b16xd8]
mapping clause encdec = MUL_346
  <-> 0b11110111 @ 0b01 @ 0b100 @ b16x @ d8

// mul WORD [b16xd16]
mapping clause encdec = MUL_347
  <-> 0b11110111 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// imul rm8
mapping clause encdec = IMUL_348
  <-> 0b11110110 @ 0b11 @ 0b101 @ rm8

// imul BYTE [b16]
mapping clause encdec = IMUL_349
  <-> 0b11110110 @ 0b00 @ 0b101 @ b16

// imul BYTE [a16]
mapping clause encdec = IMUL_350
  <-> 0b11110110 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// imul BYTE [b16xd8]
mapping clause encdec = IMUL_351
  <-> 0b11110110 @ 0b01 @ 0b101 @ b16x @ d8

// imul BYTE [b16xd16]
mapping clause encdec = IMUL_352
  <-> 0b11110110 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// imul rm16
mapping clause encdec = IMUL_353
  <-> 0b11110111 @ 0b11 @ 0b101 @ rm16

// imul WORD [b16]
mapping clause encdec = IMUL_354
  <-> 0b11110111 @ 0b00 @ 0b101 @ b16

// imul WORD [a16]
mapping clause encdec = IMUL_355
  <-> 0b11110111 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// imul WORD [b16xd8]
mapping clause encdec = IMUL_356
  <-> 0b11110111 @ 0b01 @ 0b101 @ b16x @ d8

// imul WORD [b16xd16]
mapping clause encdec = IMUL_357
  <-> 0b11110111 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// div rm8
mapping clause encdec = DIV_358
  <-> 0b11110110 @ 0b11 @ 0b110 @ rm8

// div BYTE [b16]
mapping clause encdec = DIV_359
  <-> 0b11110110 @ 0b00 @ 0b110 @ b16

// div BYTE [a16]
mapping clause encdec = DIV_360
  <-> 0b11110110 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8]

// div BYTE [b16xd8]
mapping clause encdec = DIV_361
  <-> 0b11110110 @ 0b01 @ 0b110 @ b16x @ d8

// div BYTE [b16xd16]
mapping clause encdec = DIV_362
  <-> 0b11110110 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8]

// div rm16
mapping clause encdec = DIV_363
  <-> 0b11110111 @ 0b11 @ 0b110 @ rm16

// div WORD [b16]
mapping clause encdec = DIV_364
  <-> 0b11110111 @ 0b00 @ 0b110 @ b16

// div WORD [a16]
mapping clause encdec = DIV_365
  <-> 0b11110111 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8]

// div WORD [b16xd8]
mapping clause encdec = DIV_366
  <-> 0b11110111 @ 0b01 @ 0b110 @ b16x @ d8

// div WORD [b16xd16]
mapping clause encdec = DIV_367
  <-> 0b11110111 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8]

// idiv rm8
mapping clause encdec = IDIV_368
  <-> 0b11110110 @ 0b11 @ 0b111 @ rm8

// idiv BYTE [b16]
mapping clause encdec = IDIV_369
  <-> 0b11110110 @ 0b00 @ 0b111 @ b16

// idiv BYTE [a16]
mapping clause encdec = IDIV_370
  <-> 0b11110110 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// idiv BYTE [b16xd8]
mapping clause encdec = IDIV_371
  <-> 0b11110110 @ 0b01 @ 0b111 @ b16x @ d8

// idiv BYTE [b16xd16]
mapping clause encdec = IDIV_372
  <-> 0b11110110 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// idiv rm16
mapping clause encdec = IDIV_373
  <-> 0b11110111 @ 0b11 @ 0b111 @ rm16

// idiv WORD [b16]
mapping clause encdec = IDIV_374
  <-> 0b11110111 @ 0b00 @ 0b111 @ b16

// idiv WORD [a16]
mapping clause encdec = IDIV_375
  <-> 0b11110111 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// idiv WORD [b16xd8]
mapping clause encdec = IDIV_376
  <-> 0b11110111 @ 0b01 @ 0b111 @ b16x @ d8

// idiv WORD [b16xd16]
mapping clause encdec = IDIV_377
  <-> 0b11110111 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// test rm8, r8
mapping clause encdec = TEST_378
  <-> 0b10000100 @ 0b11 @ r8 @ rm8

// test [b16], r8
mapping clause encdec = TEST_379
  <-> 0b10000100 @ 0b00 @ r8 @ b16

// test [a16], r8
mapping clause encdec = TEST_380
  <-> 0b10000100 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// test [b16xd8], r8
mapping clause encdec = TEST_381
  <-> 0b10000100 @ 0b01 @ r8 @ b16x @ d8

// test [b16xd16], r8
mapping clause encdec = TEST_382
  <-> 0b10000100 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// test rm16, r16
mapping clause encdec = TEST_383
  <-> 0b10000101 @ 0b11 @ r16 @ rm16

// test [b16], r16
mapping clause encdec = TEST_384
  <-> 0b10000101 @ 0b00 @ r16 @ b16

// test [a16], r16
mapping clause encdec = TEST_385
  <-> 0b10000101 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// test [b16xd8], r16
mapping clause encdec = TEST_386
  <-> 0b10000101 @ 0b01 @ r16 @ b16x @ d8

// test [b16xd16], r16
mapping clause encdec = TEST_387
  <-> 0b10000101 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// test AL, imm
mapping clause encdec = TEST_388
  <-> 0b10101000 @ imm[7..0]

// test AX, imm
mapping clause encdec = TEST_389
  <-> 0b10101001 @ imm[7..0] @ 15..8

// test rm8, imm
mapping clause encdec = TEST_390
  <-> 0b11110110 @ 0b11 @ 0b000 @ rm8 @ imm[7..0]

// test BYTE [b16], imm
mapping clause encdec = TEST_391
  <-> 0b11110110 @ 0b00 @ 0b000 @ b16 @ imm[7..0]

// test BYTE [a16], imm
mapping clause encdec = TEST_392
  <-> 0b11110110 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// test BYTE [b16xd8], imm
mapping clause encdec = TEST_393
  <-> 0b11110110 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0]

// test BYTE [b16xd16], imm
mapping clause encdec = TEST_394
  <-> 0b11110110 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// test rm16, imm
mapping clause encdec = TEST_395
  <-> 0b11110111 @ 0b11 @ 0b000 @ rm16 @ imm[7..0] @ 15..8

// test WORD [b16], imm
mapping clause encdec = TEST_396
  <-> 0b11110111 @ 0b00 @ 0b000 @ b16 @ imm[7..0] @ 15..8

// test WORD [a16], imm
mapping clause encdec = TEST_397
  <-> 0b11110111 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// test WORD [b16xd8], imm
mapping clause encdec = TEST_398
  <-> 0b11110111 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0] @ 15..8

// test WORD [b16xd16], imm
mapping clause encdec = TEST_399
  <-> 0b11110111 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// mov rm8, r8
mapping clause encdec = MOV_400
  <-> 0b10001000 @ 0b11 @ r8 @ rm8

// mov [b16], r8
mapping clause encdec = MOV_401
  <-> 0b10001000 @ 0b00 @ r8 @ b16

// mov [a16], r8
mapping clause encdec = MOV_402
  <-> 0b10001000 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// mov [b16xd8], r8
mapping clause encdec = MOV_403
  <-> 0b10001000 @ 0b01 @ r8 @ b16x @ d8

// mov [b16xd16], r8
mapping clause encdec = MOV_404
  <-> 0b10001000 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// mov rm16, r16
mapping clause encdec = MOV_405
  <-> 0b10001001 @ 0b11 @ r16 @ rm16

// mov [b16], r16
mapping clause encdec = MOV_406
  <-> 0b10001001 @ 0b00 @ r16 @ b16

// mov [a16], r16
mapping clause encdec = MOV_407
  <-> 0b10001001 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// mov [b16xd8], r16
mapping clause encdec = MOV_408
  <-> 0b10001001 @ 0b01 @ r16 @ b16x @ d8

// mov [b16xd16], r16
mapping clause encdec = MOV_409
  <-> 0b10001001 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// mov r8, rm8
mapping clause encdec = MOV_410
  <-> 0b10001010 @ 0b11 @ r8 @ rm8

// mov r8, [b16]
mapping clause encdec = MOV_411
  <-> 0b10001010 @ 0b00 @ r8 @ b16

// mov r8, [a16]
mapping clause encdec = MOV_412
  <-> 0b10001010 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// mov r8, [b16xd8]
mapping clause encdec = MOV_413
  <-> 0b10001010 @ 0b01 @ r8 @ b16x @ d8

// mov r8, [b16xd16]
mapping clause encdec = MOV_414
  <-> 0b10001010 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// mov r16, rm16
mapping clause encdec = MOV_415
  <-> 0b10001011 @ 0b11 @ r16 @ rm16

// mov r16, [b16]
mapping clause encdec = MOV_416
  <-> 0b10001011 @ 0b00 @ r16 @ b16

// mov r16, [a16]
mapping clause encdec = MOV_417
  <-> 0b10001011 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// mov r16, [b16xd8]
mapping clause encdec = MOV_418
  <-> 0b10001011 @ 0b01 @ r16 @ b16x @ d8

// mov r16, [b16xd16]
mapping clause encdec = MOV_419
  <-> 0b10001011 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// mov rm16, sreg
mapping clause encdec = MOV_420
  <-> 0b10001100 @ 0b11 @ 0b0 @ sreg @ rm16

// mov [b16], sreg
mapping clause encdec = MOV_421
  <-> 0b10001100 @ 0b00 @ 0b0 @ sreg @ b16

// mov [a16], sreg
mapping clause encdec = MOV_422
  <-> 0b10001100 @ 0b00 @ 0b0 @ sreg @ 0b110 @ a16[7..0] @ a16[15..8]

// mov [b16xd8], sreg
mapping clause encdec = MOV_423
  <-> 0b10001100 @ 0b01 @ 0b0 @ sreg @ b16x @ d8

// mov [b16xd16], sreg
mapping clause encdec = MOV_424
  <-> 0b10001100 @ 0b10 @ 0b0 @ sreg @ b16x @ d16[7..0] @ d16[15..8]

// mov sreg, rm16
mapping clause encdec = MOV_425
  <-> 0b10001110 @ 0b11 @ 0b0 @ sreg @ rm16

// mov sreg, [b16]
mapping clause encdec = MOV_426
  <-> 0b10001110 @ 0b00 @ 0b0 @ sreg @ b16

// mov sreg, [a16]
mapping clause encdec = MOV_427
  <-> 0b10001110 @ 0b00 @ 0b0 @ sreg @ 0b110 @ a16[7..0] @ a16[15..8]

// mov sreg, [b16xd8]
mapping clause encdec = MOV_428
  <-> 0b10001110 @ 0b01 @ 0b0 @ sreg @ b16x @ d8

// mov sreg, [b16xd16]
mapping clause encdec = MOV_429
  <-> 0b10001110 @ 0b10 @ 0b0 @ sreg @ b16x @ d16[7..0] @ d16[15..8]

// mov AL, [imm]
mapping clause encdec = MOV_430
  <-> 0b10100000 @ imm[7..0] @ 15..8

// mov AX, [imm]
mapping clause encdec = MOV_431
  <-> 0b10100001 @ imm[7..0] @ 15..8

// mov [imm], AL
mapping clause encdec = MOV_432
  <-> 0b10100010 @ imm[7..0] @ 15..8

// mov [imm], AX
mapping clause encdec = MOV_433
  <-> 0b10100011 @ imm[7..0] @ 15..8

// mov r8, imm
mapping clause encdec = MOV_434
  <-> 0b10110 @ r8 @ imm[7..0]

// mov r16, imm
mapping clause encdec = MOV_435
  <-> 0b10111 @ r16 @ imm[7..0] @ 15..8

// mov rm8, imm
mapping clause encdec = MOV_436
  <-> 0b11000110 @ 0b11 @ 0b000 @ rm8 @ imm[7..0]

// mov BYTE [b16], imm
mapping clause encdec = MOV_437
  <-> 0b11000110 @ 0b00 @ 0b000 @ b16 @ imm[7..0]

// mov BYTE [a16], imm
mapping clause encdec = MOV_438
  <-> 0b11000110 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0]

// mov BYTE [b16xd8], imm
mapping clause encdec = MOV_439
  <-> 0b11000110 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0]

// mov BYTE [b16xd16], imm
mapping clause encdec = MOV_440
  <-> 0b11000110 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0]

// mov rm16, imm
mapping clause encdec = MOV_441
  <-> 0b11000111 @ 0b11 @ 0b000 @ rm16 @ imm[7..0] @ 15..8

// mov WORD [b16], imm
mapping clause encdec = MOV_442
  <-> 0b11000111 @ 0b00 @ 0b000 @ b16 @ imm[7..0] @ 15..8

// mov WORD [a16], imm
mapping clause encdec = MOV_443
  <-> 0b11000111 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8] @ imm[7..0] @ 15..8

// mov WORD [b16xd8], imm
mapping clause encdec = MOV_444
  <-> 0b11000111 @ 0b01 @ 0b000 @ b16x @ d8 @ imm[7..0] @ 15..8

// mov WORD [b16xd16], imm
mapping clause encdec = MOV_445
  <-> 0b11000111 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8] @ imm[7..0] @ 15..8

// xchg rm8, r8
mapping clause encdec = XCHG_446
  <-> 0b10000110 @ 0b11 @ r8 @ rm8

// xchg [b16], r8
mapping clause encdec = XCHG_447
  <-> 0b10000110 @ 0b00 @ r8 @ b16

// xchg [a16], r8
mapping clause encdec = XCHG_448
  <-> 0b10000110 @ 0b00 @ r8 @ 0b110 @ a16[7..0] @ a16[15..8]

// xchg [b16xd8], r8
mapping clause encdec = XCHG_449
  <-> 0b10000110 @ 0b01 @ r8 @ b16x @ d8

// xchg [b16xd16], r8
mapping clause encdec = XCHG_450
  <-> 0b10000110 @ 0b10 @ r8 @ b16x @ d16[7..0] @ d16[15..8]

// xchg rm16, r16
mapping clause encdec = XCHG_451
  <-> 0b10000111 @ 0b11 @ r16 @ rm16

// xchg [b16], r16
mapping clause encdec = XCHG_452
  <-> 0b10000111 @ 0b00 @ r16 @ b16

// xchg [a16], r16
mapping clause encdec = XCHG_453
  <-> 0b10000111 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// xchg [b16xd8], r16
mapping clause encdec = XCHG_454
  <-> 0b10000111 @ 0b01 @ r16 @ b16x @ d8

// xchg [b16xd16], r16
mapping clause encdec = XCHG_455
  <-> 0b10000111 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// xchg AX, r16
mapping clause encdec = XCHG_456
  <-> 0b10010 @ r16

// lea r16, [b16]
mapping clause encdec = LEA_457
  <-> 0b10001101 @ 0b00 @ r16 @ b16

// lea r16, [a16]
mapping clause encdec = LEA_458
  <-> 0b10001101 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// lea r16, [b16xd8]
mapping clause encdec = LEA_459
  <-> 0b10001101 @ 0b01 @ r16 @ b16x @ d8

// lea r16, [b16xd16]
mapping clause encdec = LEA_460
  <-> 0b10001101 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// lds r16, [b16]
mapping clause encdec = LDS_461
  <-> 0b11000101 @ 0b00 @ r16 @ b16

// lds r16, [a16]
mapping clause encdec = LDS_462
  <-> 0b11000101 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// lds r16, [b16xd8]
mapping clause encdec = LDS_463
  <-> 0b11000101 @ 0b01 @ r16 @ b16x @ d8

// lds r16, [b16xd16]
mapping clause encdec = LDS_464
  <-> 0b11000101 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// les r16, [b16]
mapping clause encdec = LES_465
  <-> 0b11000100 @ 0b00 @ r16 @ b16

// les r16, [a16]
mapping clause encdec = LES_466
  <-> 0b11000100 @ 0b00 @ r16 @ 0b110 @ a16[7..0] @ a16[15..8]

// les r16, [b16xd8]
mapping clause encdec = LES_467
  <-> 0b11000100 @ 0b01 @ r16 @ b16x @ d8

// les r16, [b16xd16]
mapping clause encdec = LES_468
  <-> 0b11000100 @ 0b10 @ r16 @ b16x @ d16[7..0] @ d16[15..8]

// push r16
mapping clause encdec = PUSH_469
  <-> 0b01010 @ r16

// pop r16
mapping clause encdec = POP_470
  <-> 0b01011 @ r16

// push rm16
mapping clause encdec = PUSH_471
  <-> 0b11111111 @ 0b11 @ 0b110 @ rm16

// push WORD [b16]
mapping clause encdec = PUSH_472
  <-> 0b11111111 @ 0b00 @ 0b110 @ b16

// push WORD [a16]
mapping clause encdec = PUSH_473
  <-> 0b11111111 @ 0b00 @ 0b110 @ 0b110 @ a16[7..0] @ a16[15..8]

// push WORD [b16xd8]
mapping clause encdec = PUSH_474
  <-> 0b11111111 @ 0b01 @ 0b110 @ b16x @ d8

// push WORD [b16xd16]
mapping clause encdec = PUSH_475
  <-> 0b11111111 @ 0b10 @ 0b110 @ b16x @ d16[7..0] @ d16[15..8]

// pop rm16
mapping clause encdec = POP_476
  <-> 0b10001111 @ 0b11 @ 0b000 @ rm16

// pop WORD [b16]
mapping clause encdec = POP_477
  <-> 0b10001111 @ 0b00 @ 0b000 @ b16

// pop WORD [a16]
mapping clause encdec = POP_478
  <-> 0b10001111 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// pop WORD [b16xd8]
mapping clause encdec = POP_479
  <-> 0b10001111 @ 0b01 @ 0b000 @ b16x @ d8

// pop WORD [b16xd16]
mapping clause encdec = POP_480
  <-> 0b10001111 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// push ES
mapping clause encdec = PUSH_481
  <-> 0b00000110

// pop ES
mapping clause encdec = POP_482
  <-> 0b00000111

// push CS
mapping clause encdec = PUSH_483
  <-> 0b00001110

// push SS
mapping clause encdec = PUSH_484
  <-> 0b00010110

// pop SS
mapping clause encdec = POP_485
  <-> 0b00010111

// push DS
mapping clause encdec = PUSH_486
  <-> 0b00011110

// pop DS
mapping clause encdec = POP_487
  <-> 0b00011111

// pushf 
mapping clause encdec = PUSHF_488
  <-> 0b10011100

// popf 
mapping clause encdec = POPF_489
  <-> 0b10011101

// lahf 
mapping clause encdec = LAHF_490
  <-> 0b10011111

// sahf 
mapping clause encdec = SAHF_491
  <-> 0b10011110

// in AL, imm
mapping clause encdec = IN_492
  <-> 0b11100100 @ imm[7..0]

// in AX, imm
mapping clause encdec = IN_493
  <-> 0b11100101 @ imm[7..0]

// out imm, AL
mapping clause encdec = OUT_494
  <-> 0b11100110 @ imm[7..0]

// out imm, AX
mapping clause encdec = OUT_495
  <-> 0b11100111 @ imm[7..0]

// in AL, DX
mapping clause encdec = IN_496
  <-> 0b11101100

// in AX, DX
mapping clause encdec = IN_497
  <-> 0b11101101

// out DX, AL
mapping clause encdec = OUT_498
  <-> 0b11101110

// out DX, AX
mapping clause encdec = OUT_499
  <-> 0b11101111

// xlatb 
mapping clause encdec = XLATB_500
  <-> 0b11010111

// cbw 
mapping clause encdec = CBW_501
  <-> 0b10011000

// cwd 
mapping clause encdec = CWD_502
  <-> 0b10011001

// aaa 
mapping clause encdec = AAA_503
  <-> 0b00110111

// aas 
mapping clause encdec = AAS_504
  <-> 0b00111111

// daa 
mapping clause encdec = DAA_505
  <-> 0b00100111

// das 
mapping clause encdec = DAS_506
  <-> 0b00101111

// aam imm
mapping clause encdec = AAM_507
  <-> 0b11010100 @ imm[7..0]

// aad imm
mapping clause encdec = AAD_508
  <-> 0b11010101 @ imm[7..0]

// rol rm8, 1
mapping clause encdec = ROL_509
  <-> 0b11010000 @ 0b11 @ 0b000 @ rm8

// rol BYTE [b16], 1
mapping clause encdec = ROL_510
  <-> 0b11010000 @ 0b00 @ 0b000 @ b16

// rol BYTE [a16], 1
mapping clause encdec = ROL_511
  <-> 0b11010000 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// rol BYTE [b16xd8], 1
mapping clause encdec = ROL_512
  <-> 0b11010000 @ 0b01 @ 0b000 @ b16x @ d8

// rol BYTE [b16xd16], 1
mapping clause encdec = ROL_513
  <-> 0b11010000 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// rol rm16, 1
mapping clause encdec = ROL_514
  <-> 0b11010001 @ 0b11 @ 0b000 @ rm16

// rol WORD [b16], 1
mapping clause encdec = ROL_515
  <-> 0b11010001 @ 0b00 @ 0b000 @ b16

// rol WORD [a16], 1
mapping clause encdec = ROL_516
  <-> 0b11010001 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// rol WORD [b16xd8], 1
mapping clause encdec = ROL_517
  <-> 0b11010001 @ 0b01 @ 0b000 @ b16x @ d8

// rol WORD [b16xd16], 1
mapping clause encdec = ROL_518
  <-> 0b11010001 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// rol rm8, CL
mapping clause encdec = ROL_519
  <-> 0b11010010 @ 0b11 @ 0b000 @ rm8

// rol BYTE [b16], CL
mapping clause encdec = ROL_520
  <-> 0b11010010 @ 0b00 @ 0b000 @ b16

// rol BYTE [a16], CL
mapping clause encdec = ROL_521
  <-> 0b11010010 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// rol BYTE [b16xd8], CL
mapping clause encdec = ROL_522
  <-> 0b11010010 @ 0b01 @ 0b000 @ b16x @ d8

// rol BYTE [b16xd16], CL
mapping clause encdec = ROL_523
  <-> 0b11010010 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// rol rm16, CL
mapping clause encdec = ROL_524
  <-> 0b11010011 @ 0b11 @ 0b000 @ rm16

// rol WORD [b16], CL
mapping clause encdec = ROL_525
  <-> 0b11010011 @ 0b00 @ 0b000 @ b16

// rol WORD [a16], CL
mapping clause encdec = ROL_526
  <-> 0b11010011 @ 0b00 @ 0b000 @ 0b110 @ a16[7..0] @ a16[15..8]

// rol WORD [b16xd8], CL
mapping clause encdec = ROL_527
  <-> 0b11010011 @ 0b01 @ 0b000 @ b16x @ d8

// rol WORD [b16xd16], CL
mapping clause encdec = ROL_528
  <-> 0b11010011 @ 0b10 @ 0b000 @ b16x @ d16[7..0] @ d16[15..8]

// ror rm8, 1
mapping clause encdec = ROR_529
  <-> 0b11010000 @ 0b11 @ 0b001 @ rm8

// ror BYTE [b16], 1
mapping clause encdec = ROR_530
  <-> 0b11010000 @ 0b00 @ 0b001 @ b16

// ror BYTE [a16], 1
mapping clause encdec = ROR_531
  <-> 0b11010000 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// ror BYTE [b16xd8], 1
mapping clause encdec = ROR_532
  <-> 0b11010000 @ 0b01 @ 0b001 @ b16x @ d8

// ror BYTE [b16xd16], 1
mapping clause encdec = ROR_533
  <-> 0b11010000 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// ror rm16, 1
mapping clause encdec = ROR_534
  <-> 0b11010001 @ 0b11 @ 0b001 @ rm16

// ror WORD [b16], 1
mapping clause encdec = ROR_535
  <-> 0b11010001 @ 0b00 @ 0b001 @ b16

// ror WORD [a16], 1
mapping clause encdec = ROR_536
  <-> 0b11010001 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// ror WORD [b16xd8], 1
mapping clause encdec = ROR_537
  <-> 0b11010001 @ 0b01 @ 0b001 @ b16x @ d8

// ror WORD [b16xd16], 1
mapping clause encdec = ROR_538
  <-> 0b11010001 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// ror rm8, CL
mapping clause encdec = ROR_539
  <-> 0b11010010 @ 0b11 @ 0b001 @ rm8

// ror BYTE [b16], CL
mapping clause encdec = ROR_540
  <-> 0b11010010 @ 0b00 @ 0b001 @ b16

// ror BYTE [a16], CL
mapping clause encdec = ROR_541
  <-> 0b11010010 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// ror BYTE [b16xd8], CL
mapping clause encdec = ROR_542
  <-> 0b11010010 @ 0b01 @ 0b001 @ b16x @ d8

// ror BYTE [b16xd16], CL
mapping clause encdec = ROR_543
  <-> 0b11010010 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// ror rm16, CL
mapping clause encdec = ROR_544
  <-> 0b11010011 @ 0b11 @ 0b001 @ rm16

// ror WORD [b16], CL
mapping clause encdec = ROR_545
  <-> 0b11010011 @ 0b00 @ 0b001 @ b16

// ror WORD [a16], CL
mapping clause encdec = ROR_546
  <-> 0b11010011 @ 0b00 @ 0b001 @ 0b110 @ a16[7..0] @ a16[15..8]

// ror WORD [b16xd8], CL
mapping clause encdec = ROR_547
  <-> 0b11010011 @ 0b01 @ 0b001 @ b16x @ d8

// ror WORD [b16xd16], CL
mapping clause encdec = ROR_548
  <-> 0b11010011 @ 0b10 @ 0b001 @ b16x @ d16[7..0] @ d16[15..8]

// rcl rm8, 1
mapping clause encdec = RCL_549
  <-> 0b11010000 @ 0b11 @ 0b010 @ rm8

// rcl BYTE [b16], 1
mapping clause encdec = RCL_550
  <-> 0b11010000 @ 0b00 @ 0b010 @ b16

// rcl BYTE [a16], 1
mapping clause encdec = RCL_551
  <-> 0b11010000 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcl BYTE [b16xd8], 1
mapping clause encdec = RCL_552
  <-> 0b11010000 @ 0b01 @ 0b010 @ b16x @ d8

// rcl BYTE [b16xd16], 1
mapping clause encdec = RCL_553
  <-> 0b11010000 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// rcl rm16, 1
mapping clause encdec = RCL_554
  <-> 0b11010001 @ 0b11 @ 0b010 @ rm16

// rcl WORD [b16], 1
mapping clause encdec = RCL_555
  <-> 0b11010001 @ 0b00 @ 0b010 @ b16

// rcl WORD [a16], 1
mapping clause encdec = RCL_556
  <-> 0b11010001 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcl WORD [b16xd8], 1
mapping clause encdec = RCL_557
  <-> 0b11010001 @ 0b01 @ 0b010 @ b16x @ d8

// rcl WORD [b16xd16], 1
mapping clause encdec = RCL_558
  <-> 0b11010001 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// rcl rm8, CL
mapping clause encdec = RCL_559
  <-> 0b11010010 @ 0b11 @ 0b010 @ rm8

// rcl BYTE [b16], CL
mapping clause encdec = RCL_560
  <-> 0b11010010 @ 0b00 @ 0b010 @ b16

// rcl BYTE [a16], CL
mapping clause encdec = RCL_561
  <-> 0b11010010 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcl BYTE [b16xd8], CL
mapping clause encdec = RCL_562
  <-> 0b11010010 @ 0b01 @ 0b010 @ b16x @ d8

// rcl BYTE [b16xd16], CL
mapping clause encdec = RCL_563
  <-> 0b11010010 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// rcl rm16, CL
mapping clause encdec = RCL_564
  <-> 0b11010011 @ 0b11 @ 0b010 @ rm16

// rcl WORD [b16], CL
mapping clause encdec = RCL_565
  <-> 0b11010011 @ 0b00 @ 0b010 @ b16

// rcl WORD [a16], CL
mapping clause encdec = RCL_566
  <-> 0b11010011 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcl WORD [b16xd8], CL
mapping clause encdec = RCL_567
  <-> 0b11010011 @ 0b01 @ 0b010 @ b16x @ d8

// rcl WORD [b16xd16], CL
mapping clause encdec = RCL_568
  <-> 0b11010011 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// rcr rm8, 1
mapping clause encdec = RCR_569
  <-> 0b11010000 @ 0b11 @ 0b011 @ rm8

// rcr BYTE [b16], 1
mapping clause encdec = RCR_570
  <-> 0b11010000 @ 0b00 @ 0b011 @ b16

// rcr BYTE [a16], 1
mapping clause encdec = RCR_571
  <-> 0b11010000 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcr BYTE [b16xd8], 1
mapping clause encdec = RCR_572
  <-> 0b11010000 @ 0b01 @ 0b011 @ b16x @ d8

// rcr BYTE [b16xd16], 1
mapping clause encdec = RCR_573
  <-> 0b11010000 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// rcr rm16, 1
mapping clause encdec = RCR_574
  <-> 0b11010001 @ 0b11 @ 0b011 @ rm16

// rcr WORD [b16], 1
mapping clause encdec = RCR_575
  <-> 0b11010001 @ 0b00 @ 0b011 @ b16

// rcr WORD [a16], 1
mapping clause encdec = RCR_576
  <-> 0b11010001 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcr WORD [b16xd8], 1
mapping clause encdec = RCR_577
  <-> 0b11010001 @ 0b01 @ 0b011 @ b16x @ d8

// rcr WORD [b16xd16], 1
mapping clause encdec = RCR_578
  <-> 0b11010001 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// rcr rm8, CL
mapping clause encdec = RCR_579
  <-> 0b11010010 @ 0b11 @ 0b011 @ rm8

// rcr BYTE [b16], CL
mapping clause encdec = RCR_580
  <-> 0b11010010 @ 0b00 @ 0b011 @ b16

// rcr BYTE [a16], CL
mapping clause encdec = RCR_581
  <-> 0b11010010 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcr BYTE [b16xd8], CL
mapping clause encdec = RCR_582
  <-> 0b11010010 @ 0b01 @ 0b011 @ b16x @ d8

// rcr BYTE [b16xd16], CL
mapping clause encdec = RCR_583
  <-> 0b11010010 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// rcr rm16, CL
mapping clause encdec = RCR_584
  <-> 0b11010011 @ 0b11 @ 0b011 @ rm16

// rcr WORD [b16], CL
mapping clause encdec = RCR_585
  <-> 0b11010011 @ 0b00 @ 0b011 @ b16

// rcr WORD [a16], CL
mapping clause encdec = RCR_586
  <-> 0b11010011 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// rcr WORD [b16xd8], CL
mapping clause encdec = RCR_587
  <-> 0b11010011 @ 0b01 @ 0b011 @ b16x @ d8

// rcr WORD [b16xd16], CL
mapping clause encdec = RCR_588
  <-> 0b11010011 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// shl rm8, 1
mapping clause encdec = SHL_589
  <-> 0b11010000 @ 0b11 @ 0b100 @ rm8

// shl BYTE [b16], 1
mapping clause encdec = SHL_590
  <-> 0b11010000 @ 0b00 @ 0b100 @ b16

// shl BYTE [a16], 1
mapping clause encdec = SHL_591
  <-> 0b11010000 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// shl BYTE [b16xd8], 1
mapping clause encdec = SHL_592
  <-> 0b11010000 @ 0b01 @ 0b100 @ b16x @ d8

// shl BYTE [b16xd16], 1
mapping clause encdec = SHL_593
  <-> 0b11010000 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// shl rm16, 1
mapping clause encdec = SHL_594
  <-> 0b11010001 @ 0b11 @ 0b100 @ rm16

// shl WORD [b16], 1
mapping clause encdec = SHL_595
  <-> 0b11010001 @ 0b00 @ 0b100 @ b16

// shl WORD [a16], 1
mapping clause encdec = SHL_596
  <-> 0b11010001 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// shl WORD [b16xd8], 1
mapping clause encdec = SHL_597
  <-> 0b11010001 @ 0b01 @ 0b100 @ b16x @ d8

// shl WORD [b16xd16], 1
mapping clause encdec = SHL_598
  <-> 0b11010001 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// shl rm8, CL
mapping clause encdec = SHL_599
  <-> 0b11010010 @ 0b11 @ 0b100 @ rm8

// shl BYTE [b16], CL
mapping clause encdec = SHL_600
  <-> 0b11010010 @ 0b00 @ 0b100 @ b16

// shl BYTE [a16], CL
mapping clause encdec = SHL_601
  <-> 0b11010010 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// shl BYTE [b16xd8], CL
mapping clause encdec = SHL_602
  <-> 0b11010010 @ 0b01 @ 0b100 @ b16x @ d8

// shl BYTE [b16xd16], CL
mapping clause encdec = SHL_603
  <-> 0b11010010 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// shl rm16, CL
mapping clause encdec = SHL_604
  <-> 0b11010011 @ 0b11 @ 0b100 @ rm16

// shl WORD [b16], CL
mapping clause encdec = SHL_605
  <-> 0b11010011 @ 0b00 @ 0b100 @ b16

// shl WORD [a16], CL
mapping clause encdec = SHL_606
  <-> 0b11010011 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// shl WORD [b16xd8], CL
mapping clause encdec = SHL_607
  <-> 0b11010011 @ 0b01 @ 0b100 @ b16x @ d8

// shl WORD [b16xd16], CL
mapping clause encdec = SHL_608
  <-> 0b11010011 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// shr rm8, 1
mapping clause encdec = SHR_609
  <-> 0b11010000 @ 0b11 @ 0b101 @ rm8

// shr BYTE [b16], 1
mapping clause encdec = SHR_610
  <-> 0b11010000 @ 0b00 @ 0b101 @ b16

// shr BYTE [a16], 1
mapping clause encdec = SHR_611
  <-> 0b11010000 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// shr BYTE [b16xd8], 1
mapping clause encdec = SHR_612
  <-> 0b11010000 @ 0b01 @ 0b101 @ b16x @ d8

// shr BYTE [b16xd16], 1
mapping clause encdec = SHR_613
  <-> 0b11010000 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// shr rm16, 1
mapping clause encdec = SHR_614
  <-> 0b11010001 @ 0b11 @ 0b101 @ rm16

// shr WORD [b16], 1
mapping clause encdec = SHR_615
  <-> 0b11010001 @ 0b00 @ 0b101 @ b16

// shr WORD [a16], 1
mapping clause encdec = SHR_616
  <-> 0b11010001 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// shr WORD [b16xd8], 1
mapping clause encdec = SHR_617
  <-> 0b11010001 @ 0b01 @ 0b101 @ b16x @ d8

// shr WORD [b16xd16], 1
mapping clause encdec = SHR_618
  <-> 0b11010001 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// shr rm8, CL
mapping clause encdec = SHR_619
  <-> 0b11010010 @ 0b11 @ 0b101 @ rm8

// shr BYTE [b16], CL
mapping clause encdec = SHR_620
  <-> 0b11010010 @ 0b00 @ 0b101 @ b16

// shr BYTE [a16], CL
mapping clause encdec = SHR_621
  <-> 0b11010010 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// shr BYTE [b16xd8], CL
mapping clause encdec = SHR_622
  <-> 0b11010010 @ 0b01 @ 0b101 @ b16x @ d8

// shr BYTE [b16xd16], CL
mapping clause encdec = SHR_623
  <-> 0b11010010 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// shr rm16, CL
mapping clause encdec = SHR_624
  <-> 0b11010011 @ 0b11 @ 0b101 @ rm16

// shr WORD [b16], CL
mapping clause encdec = SHR_625
  <-> 0b11010011 @ 0b00 @ 0b101 @ b16

// shr WORD [a16], CL
mapping clause encdec = SHR_626
  <-> 0b11010011 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// shr WORD [b16xd8], CL
mapping clause encdec = SHR_627
  <-> 0b11010011 @ 0b01 @ 0b101 @ b16x @ d8

// shr WORD [b16xd16], CL
mapping clause encdec = SHR_628
  <-> 0b11010011 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// sar rm8, 1
mapping clause encdec = SAR_629
  <-> 0b11010000 @ 0b11 @ 0b111 @ rm8

// sar BYTE [b16], 1
mapping clause encdec = SAR_630
  <-> 0b11010000 @ 0b00 @ 0b111 @ b16

// sar BYTE [a16], 1
mapping clause encdec = SAR_631
  <-> 0b11010000 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// sar BYTE [b16xd8], 1
mapping clause encdec = SAR_632
  <-> 0b11010000 @ 0b01 @ 0b111 @ b16x @ d8

// sar BYTE [b16xd16], 1
mapping clause encdec = SAR_633
  <-> 0b11010000 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// sar rm16, 1
mapping clause encdec = SAR_634
  <-> 0b11010001 @ 0b11 @ 0b111 @ rm16

// sar WORD [b16], 1
mapping clause encdec = SAR_635
  <-> 0b11010001 @ 0b00 @ 0b111 @ b16

// sar WORD [a16], 1
mapping clause encdec = SAR_636
  <-> 0b11010001 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// sar WORD [b16xd8], 1
mapping clause encdec = SAR_637
  <-> 0b11010001 @ 0b01 @ 0b111 @ b16x @ d8

// sar WORD [b16xd16], 1
mapping clause encdec = SAR_638
  <-> 0b11010001 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// sar rm8, CL
mapping clause encdec = SAR_639
  <-> 0b11010010 @ 0b11 @ 0b111 @ rm8

// sar BYTE [b16], CL
mapping clause encdec = SAR_640
  <-> 0b11010010 @ 0b00 @ 0b111 @ b16

// sar BYTE [a16], CL
mapping clause encdec = SAR_641
  <-> 0b11010010 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// sar BYTE [b16xd8], CL
mapping clause encdec = SAR_642
  <-> 0b11010010 @ 0b01 @ 0b111 @ b16x @ d8

// sar BYTE [b16xd16], CL
mapping clause encdec = SAR_643
  <-> 0b11010010 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// sar rm16, CL
mapping clause encdec = SAR_644
  <-> 0b11010011 @ 0b11 @ 0b111 @ rm16

// sar WORD [b16], CL
mapping clause encdec = SAR_645
  <-> 0b11010011 @ 0b00 @ 0b111 @ b16

// sar WORD [a16], CL
mapping clause encdec = SAR_646
  <-> 0b11010011 @ 0b00 @ 0b111 @ 0b110 @ a16[7..0] @ a16[15..8]

// sar WORD [b16xd8], CL
mapping clause encdec = SAR_647
  <-> 0b11010011 @ 0b01 @ 0b111 @ b16x @ d8

// sar WORD [b16xd16], CL
mapping clause encdec = SAR_648
  <-> 0b11010011 @ 0b10 @ 0b111 @ b16x @ d16[7..0] @ d16[15..8]

// movsb 
mapping clause encdec = MOVSB_649
  <-> 0b10100100

// movsw 
mapping clause encdec = MOVSW_650
  <-> 0b10100101

// cmpsb 
mapping clause encdec = CMPSB_651
  <-> 0b10100110

// cmpsw 
mapping clause encdec = CMPSW_652
  <-> 0b10100111

// stosb 
mapping clause encdec = STOSB_653
  <-> 0b10101010

// stosw 
mapping clause encdec = STOSW_654
  <-> 0b10101011

// lodsb 
mapping clause encdec = LODSB_655
  <-> 0b10101100

// lodsw 
mapping clause encdec = LODSW_656
  <-> 0b10101101

// scasb 
mapping clause encdec = SCASB_657
  <-> 0b10101110

// scasw 
mapping clause encdec = SCASW_658
  <-> 0b10101111

// call rel
mapping clause encdec = CALL_659
  <-> 0b11101000 @ rel[7..0] @ 15..8

// call rm16
mapping clause encdec = CALL_660
  <-> 0b11111111 @ 0b11 @ 0b010 @ rm16

// call WORD [b16]
mapping clause encdec = CALL_661
  <-> 0b11111111 @ 0b00 @ 0b010 @ b16

// call WORD [a16]
mapping clause encdec = CALL_662
  <-> 0b11111111 @ 0b00 @ 0b010 @ 0b110 @ a16[7..0] @ a16[15..8]

// call WORD [b16xd8]
mapping clause encdec = CALL_663
  <-> 0b11111111 @ 0b01 @ 0b010 @ b16x @ d8

// call WORD [b16xd16]
mapping clause encdec = CALL_664
  <-> 0b11111111 @ 0b10 @ 0b010 @ b16x @ d16[7..0] @ d16[15..8]

// call seg:imm
mapping clause encdec = CALL_665
  <-> 0b10011010 @ imm[7..0] @ 15..8 @ seg[7..0] @ seg[15..8]

// call FAR [b16]
mapping clause encdec = CALL_666
  <-> 0b11111111 @ 0b00 @ 0b011 @ b16

// call FAR [a16]
mapping clause encdec = CALL_667
  <-> 0b11111111 @ 0b00 @ 0b011 @ 0b110 @ a16[7..0] @ a16[15..8]

// call FAR [b16xd8]
mapping clause encdec = CALL_668
  <-> 0b11111111 @ 0b01 @ 0b011 @ b16x @ d8

// call FAR [b16xd16]
mapping clause encdec = CALL_669
  <-> 0b11111111 @ 0b10 @ 0b011 @ b16x @ d16[7..0] @ d16[15..8]

// jmp rel
mapping clause encdec = JMP_670
  <-> 0b11101001 @ rel[7..0] @ 15..8

// jmp rel
mapping clause encdec = JMP_671
  <-> 0b11101011 @ rel[7..0]

// jmp rm16
mapping clause encdec = JMP_672
  <-> 0b11111111 @ 0b11 @ 0b100 @ rm16

// jmp WORD [b16]
mapping clause encdec = JMP_673
  <-> 0b11111111 @ 0b00 @ 0b100 @ b16

// jmp WORD [a16]
mapping clause encdec = JMP_674
  <-> 0b11111111 @ 0b00 @ 0b100 @ 0b110 @ a16[7..0] @ a16[15..8]

// jmp WORD [b16xd8]
mapping clause encdec = JMP_675
  <-> 0b11111111 @ 0b01 @ 0b100 @ b16x @ d8

// jmp WORD [b16xd16]
mapping clause encdec = JMP_676
  <-> 0b11111111 @ 0b10 @ 0b100 @ b16x @ d16[7..0] @ d16[15..8]

// jmp seg:imm
mapping clause encdec = JMP_677
  <-> 0b11101010 @ imm[7..0] @ 15..8 @ seg[7..0] @ seg[15..8]

// jmp FAR [b16]
mapping clause encdec = JMP_678
  <-> 0b11111111 @ 0b00 @ 0b101 @ b16

// jmp FAR [a16]
mapping clause encdec = JMP_679
  <-> 0b11111111 @ 0b00 @ 0b101 @ 0b110 @ a16[7..0] @ a16[15..8]

// jmp FAR [b16xd8]
mapping clause encdec = JMP_680
  <-> 0b11111111 @ 0b01 @ 0b101 @ b16x @ d8

// jmp FAR [b16xd16]
mapping clause encdec = JMP_681
  <-> 0b11111111 @ 0b10 @ 0b101 @ b16x @ d16[7..0] @ d16[15..8]

// j ~cc rel
mapping clause encdec = J_682
  <-> 0b0111 @ cc @ rel[7..0]

// loop rel
mapping clause encdec = LOOP_683
  <-> 0b11100010 @ rel[7..0]

// loope rel
mapping clause encdec = LOOPE_684
  <-> 0b11100001 @ rel[7..0]

// loopne rel
mapping clause encdec = LOOPNE_685
  <-> 0b11100000 @ rel[7..0]

// jcxz rel
mapping clause encdec = JCXZ_686
  <-> 0b11100011 @ rel[7..0]

// ret 
mapping clause encdec = RET_687
  <-> 0b11000011

// ret imm
mapping clause encdec = RET_688
  <-> 0b11000010 @ imm[7..0] @ 15..8

// retf 
mapping clause encdec = RETF_689
  <-> 0b11001011

// retf imm
mapping clause encdec = RETF_690
  <-> 0b11001010 @ imm[7..0] @ 15..8

// int imm
mapping clause encdec = INT_691
  <-> 0b11001101 @ imm[7..0]

// int3 
mapping clause encdec = INT3_692
  <-> 0b11001100

// into 
mapping clause encdec = INTO_693
  <-> 0b11001110

// iret 
mapping clause encdec = IRET_694
  <-> 0b11001111

// clc 
mapping clause encdec = CLC_695
  <-> 0b11111000

// stc 
mapping clause encdec = STC_696
  <-> 0b11111001

// cmc 
mapping clause encdec = CMC_697
  <-> 0b11110101

// cld 
mapping clause encdec = CLD_698
  <-> 0b11111100

// std 
mapping clause encdec = STD_699
  <-> 0b11111101

// cli 
mapping clause encdec = CLI_700
  <-> 0b11111010

// sti 
mapping clause encdec = STI_701
  <-> 0b11111011

// hlt 
mapping clause encdec = HLT_702
  <-> 0b11110100

// wait 
mapping clause encdec = WAIT_703
  <-> 0b10011011

// nop 
mapping clause encdec = NOP_704
  <-> 0b10010000

// lock 
mapping clause encdec = LOCK_705
  <-> 0b11110000

// rep 
mapping clause encdec = REP_706
  <-> 0b11110011

// repne 
mapping clause encdec = REPNE_707
  <-> 0b11110010

// es 
mapping clause encdec = ES_708
  <-> 0b00100110

// cs 
mapping clause encdec = CS_709
  <-> 0b00101110

// ss 
mapping clause encdec = SS_710
  <-> 0b00110110

// ds 
mapping clause encdec = DS_711
  <-> 0b00111110

end instruction
