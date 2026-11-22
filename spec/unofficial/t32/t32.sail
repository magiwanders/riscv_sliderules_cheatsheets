// Thumb (T32, ARMv7-A): the 16 bit Thumb and 32 bit Thumb-2 integer, load / store, branch, coprocessor and system
// instructions; encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by hand
// from the Thumb encodings of the Arm Architecture Reference Manual, ARMv7-A and ARMv7-R edition (chapters A6, A8, B9);
// nothing in it is taken from Arm's machine-readable specification. It is checked bit by bit against LLVM's ARM TableGen
// (clause names are LLVM's instruction names) and by assembling every instruction with GNU as and llvm-mc (npm test).
// Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses and encdec mappings, no execute clauses, and not checked by
// the Sail compiler. A 32 bit instruction is its two halfwords, the first one (hw1) the high bits, as the Arm ARM draws
// them. Fields are named by what they hold: rdl a low register (r0-r7), rdn[3] @ ... @ rdn[2..0] a register split over
// the instruction, tmimm a modified immediate (i:imm3:imm8), bllabel the 24 bits S:J1:J2:imm10:imm11 of a long branch.

scattered union instruction

// lsls rdl, rml, #imm5l
union clause instruction = tLSLri : (bits(5), bits(3), bits(3))
mapping clause encdec = tLSLri(imm5l, rml, rdl)
  <-> 0b000 @ 0b00 @ imm5l @ rml @ rdl

// lsrs rdl, rml, #imm5r
union clause instruction = tLSRri : (bits(5), bits(3), bits(3))
mapping clause encdec = tLSRri(imm5r, rml, rdl)
  <-> 0b000 @ 0b01 @ imm5r @ rml @ rdl

// asrs rdl, rml, #imm5r
union clause instruction = tASRri : (bits(5), bits(3), bits(3))
mapping clause encdec = tASRri(imm5r, rml, rdl)
  <-> 0b000 @ 0b10 @ imm5r @ rml @ rdl

// movs rdl, rml
union clause instruction = tMOVSr : (bits(3), bits(3))
mapping clause encdec = tMOVSr(rml, rdl)
  <-> 0b0000000000 @ rml @ rdl

// adds rdl, rnl, rml
union clause instruction = tADDrr : (bits(3), bits(3), bits(3))
mapping clause encdec = tADDrr(rml, rnl, rdl)
  <-> 0b0001100 @ rml @ rnl @ rdl

// subs rdl, rnl, rml
union clause instruction = tSUBrr : (bits(3), bits(3), bits(3))
mapping clause encdec = tSUBrr(rml, rnl, rdl)
  <-> 0b0001101 @ rml @ rnl @ rdl

// adds rdl, rnl, #imm
union clause instruction = tADDi3 : (bits(3), bits(3), bits(3))
mapping clause encdec = tADDi3(rnl, rdl, imm)
  <-> 0b0001110 @ imm[2..0] @ rnl @ rdl

// subs rdl, rnl, #imm
union clause instruction = tSUBi3 : (bits(3), bits(3), bits(3))
mapping clause encdec = tSUBi3(rnl, rdl, imm)
  <-> 0b0001111 @ imm[2..0] @ rnl @ rdl

// movs rdl, #imm
union clause instruction = tMOVi8 : (bits(3), bits(8))
mapping clause encdec = tMOVi8(rdl, imm)
  <-> 0b00100 @ rdl @ imm[7..0]

// cmp rnl, #imm
union clause instruction = tCMPi8 : (bits(3), bits(8))
mapping clause encdec = tCMPi8(rnl, imm)
  <-> 0b00101 @ rnl @ imm[7..0]

// adds rdl, #imm
union clause instruction = tADDi8 : (bits(3), bits(8))
mapping clause encdec = tADDi8(rdl, imm)
  <-> 0b00110 @ rdl @ imm[7..0]

// subs rdl, #imm
union clause instruction = tSUBi8 : (bits(3), bits(8))
mapping clause encdec = tSUBi8(rdl, imm)
  <-> 0b00111 @ rdl @ imm[7..0]

// ands rdl, rml
union clause instruction = tAND : (bits(3), bits(3))
mapping clause encdec = tAND(rml, rdl)
  <-> 0b010000 @ 0b0000 @ rml @ rdl

// eors rdl, rml
union clause instruction = tEOR : (bits(3), bits(3))
mapping clause encdec = tEOR(rml, rdl)
  <-> 0b010000 @ 0b0001 @ rml @ rdl

// lsls rdl, rml
union clause instruction = tLSLrr : (bits(3), bits(3))
mapping clause encdec = tLSLrr(rml, rdl)
  <-> 0b010000 @ 0b0010 @ rml @ rdl

// lsrs rdl, rml
union clause instruction = tLSRrr : (bits(3), bits(3))
mapping clause encdec = tLSRrr(rml, rdl)
  <-> 0b010000 @ 0b0011 @ rml @ rdl

// asrs rdl, rml
union clause instruction = tASRrr : (bits(3), bits(3))
mapping clause encdec = tASRrr(rml, rdl)
  <-> 0b010000 @ 0b0100 @ rml @ rdl

// adcs rdl, rml
union clause instruction = tADC : (bits(3), bits(3))
mapping clause encdec = tADC(rml, rdl)
  <-> 0b010000 @ 0b0101 @ rml @ rdl

// sbcs rdl, rml
union clause instruction = tSBC : (bits(3), bits(3))
mapping clause encdec = tSBC(rml, rdl)
  <-> 0b010000 @ 0b0110 @ rml @ rdl

// rors rdl, rml
union clause instruction = tROR : (bits(3), bits(3))
mapping clause encdec = tROR(rml, rdl)
  <-> 0b010000 @ 0b0111 @ rml @ rdl

// tst rdl, rml
union clause instruction = tTST : (bits(3), bits(3))
mapping clause encdec = tTST(rml, rdl)
  <-> 0b010000 @ 0b1000 @ rml @ rdl

// cmp rdl, rml
union clause instruction = tCMPr : (bits(3), bits(3))
mapping clause encdec = tCMPr(rml, rdl)
  <-> 0b010000 @ 0b1010 @ rml @ rdl

// cmn rdl, rml
union clause instruction = tCMN : (bits(3), bits(3))
mapping clause encdec = tCMN(rml, rdl)
  <-> 0b010000 @ 0b1011 @ rml @ rdl

// orrs rdl, rml
union clause instruction = tORR : (bits(3), bits(3))
mapping clause encdec = tORR(rml, rdl)
  <-> 0b010000 @ 0b1100 @ rml @ rdl

// bics rdl, rml
union clause instruction = tBIC : (bits(3), bits(3))
mapping clause encdec = tBIC(rml, rdl)
  <-> 0b010000 @ 0b1110 @ rml @ rdl

// mvns rdl, rml
union clause instruction = tMVN : (bits(3), bits(3))
mapping clause encdec = tMVN(rml, rdl)
  <-> 0b010000 @ 0b1111 @ rml @ rdl

// rsbs rdl, rnl, #0
union clause instruction = tRSB : (bits(3), bits(3))
mapping clause encdec = tRSB(rnl, rdl)
  <-> 0b0100001001 @ rnl @ rdl

// muls rdl, rnl, rdl2
union clause instruction = tMUL : (bits(3), bits(3))
mapping clause encdec = tMUL(rnl, rdl)
  <-> 0b0100001101 @ rnl @ rdl

// add rdn, rm
union clause instruction = tADDhirr : (bits(4), bits(4))
mapping clause encdec = tADDhirr(rdn, rm)
  <-> 0b01000100 @ rdn[3] @ rm @ rdn[2..0]

// add rdn, SP, rdn2
union clause instruction = tADDrSP : (bits(4))
mapping clause encdec = tADDrSP(rdn)
  <-> 0b01000100 @ rdn[3] @ 0b1101 @ rdn[2..0]

// add SP, rm
union clause instruction = tADDspr : (bits(4))
mapping clause encdec = tADDspr(rm)
  <-> 0b01000100 @ 0b1 @ rm @ 0b101

// cmp rn, rm
union clause instruction = tCMPhir : (bits(4), bits(4))
mapping clause encdec = tCMPhir(rn, rm)
  <-> 0b01000101 @ rn[3] @ rm @ rn[2..0]

// mov rd, rm
union clause instruction = tMOVr : (bits(4), bits(4))
mapping clause encdec = tMOVr(rd, rm)
  <-> 0b01000110 @ rd[3] @ rm @ rd[2..0]

// bx rm
union clause instruction = tBX : (bits(4))
mapping clause encdec = tBX(rm)
  <-> 0b010001110 @ rm @ 0b000

// blx rm
union clause instruction = tBLXr : (bits(4))
mapping clause encdec = tBLXr(rm)
  <-> 0b010001111 @ rm @ 0b000

// ldr rtl, [PC, #uoff]
union clause instruction = tLDRpci : (bits(3), bits(10))
mapping clause encdec = tLDRpci(rtl, uoff)
  <-> 0b01001 @ rtl @ uoff[9..2]

// str rtl, [rnl, rml]
union clause instruction = tSTRr : (bits(3), bits(3), bits(3))
mapping clause encdec = tSTRr(rml, rnl, rtl)
  <-> 0b0101 @ 0b000 @ rml @ rnl @ rtl

// strh rtl, [rnl, rml]
union clause instruction = tSTRHr : (bits(3), bits(3), bits(3))
mapping clause encdec = tSTRHr(rml, rnl, rtl)
  <-> 0b0101 @ 0b001 @ rml @ rnl @ rtl

// strb rtl, [rnl, rml]
union clause instruction = tSTRBr : (bits(3), bits(3), bits(3))
mapping clause encdec = tSTRBr(rml, rnl, rtl)
  <-> 0b0101 @ 0b010 @ rml @ rnl @ rtl

// ldrsb rtl, [rnl, rml]
union clause instruction = tLDRSB : (bits(3), bits(3), bits(3))
mapping clause encdec = tLDRSB(rml, rnl, rtl)
  <-> 0b0101 @ 0b011 @ rml @ rnl @ rtl

// ldr rtl, [rnl, rml]
union clause instruction = tLDRr : (bits(3), bits(3), bits(3))
mapping clause encdec = tLDRr(rml, rnl, rtl)
  <-> 0b0101 @ 0b100 @ rml @ rnl @ rtl

// ldrh rtl, [rnl, rml]
union clause instruction = tLDRHr : (bits(3), bits(3), bits(3))
mapping clause encdec = tLDRHr(rml, rnl, rtl)
  <-> 0b0101 @ 0b101 @ rml @ rnl @ rtl

// ldrb rtl, [rnl, rml]
union clause instruction = tLDRBr : (bits(3), bits(3), bits(3))
mapping clause encdec = tLDRBr(rml, rnl, rtl)
  <-> 0b0101 @ 0b110 @ rml @ rnl @ rtl

// ldrsh rtl, [rnl, rml]
union clause instruction = tLDRSH : (bits(3), bits(3), bits(3))
mapping clause encdec = tLDRSH(rml, rnl, rtl)
  <-> 0b0101 @ 0b111 @ rml @ rnl @ rtl

// str rtl, [rnl, #uoff]
union clause instruction = tSTRi : (bits(3), bits(3), bits(7))
mapping clause encdec = tSTRi(rnl, rtl, uoff)
  <-> 0b01100 @ uoff[6..2] @ rnl @ rtl

// ldr rtl, [rnl, #uoff]
union clause instruction = tLDRi : (bits(3), bits(3), bits(7))
mapping clause encdec = tLDRi(rnl, rtl, uoff)
  <-> 0b01101 @ uoff[6..2] @ rnl @ rtl

// strb rtl, [rnl, #uoff]
union clause instruction = tSTRBi : (bits(3), bits(3), bits(5))
mapping clause encdec = tSTRBi(rnl, rtl, uoff)
  <-> 0b01110 @ uoff[4..0] @ rnl @ rtl

// ldrb rtl, [rnl, #uoff]
union clause instruction = tLDRBi : (bits(3), bits(3), bits(5))
mapping clause encdec = tLDRBi(rnl, rtl, uoff)
  <-> 0b01111 @ uoff[4..0] @ rnl @ rtl

// strh rtl, [rnl, #uoff]
union clause instruction = tSTRHi : (bits(3), bits(3), bits(6))
mapping clause encdec = tSTRHi(rnl, rtl, uoff)
  <-> 0b10000 @ uoff[5..1] @ rnl @ rtl

// ldrh rtl, [rnl, #uoff]
union clause instruction = tLDRHi : (bits(3), bits(3), bits(6))
mapping clause encdec = tLDRHi(rnl, rtl, uoff)
  <-> 0b10001 @ uoff[5..1] @ rnl @ rtl

// str rtl, [SP, #uoff]
union clause instruction = tSTRspi : (bits(3), bits(10))
mapping clause encdec = tSTRspi(rtl, uoff)
  <-> 0b10010 @ rtl @ uoff[9..2]

// ldr rtl, [SP, #uoff]
union clause instruction = tLDRspi : (bits(3), bits(10))
mapping clause encdec = tLDRspi(rtl, uoff)
  <-> 0b10011 @ rtl @ uoff[9..2]

// adr rdl, #uoff
union clause instruction = tADR : (bits(3), bits(10))
mapping clause encdec = tADR(rdl, uoff)
  <-> 0b10100 @ rdl @ uoff[9..2]

// add rdl, SP, #uoff
union clause instruction = tADDrSPi : (bits(3), bits(10))
mapping clause encdec = tADDrSPi(rdl, uoff)
  <-> 0b10101 @ rdl @ uoff[9..2]

// add SP, SP, #uoff
union clause instruction = tADDspi : (bits(9))
mapping clause encdec = tADDspi(uoff)
  <-> 0b101100000 @ uoff[8..2]

// sub SP, SP, #uoff
union clause instruction = tSUBspi : (bits(9))
mapping clause encdec = tSUBspi(uoff)
  <-> 0b101100001 @ uoff[8..2]

// cbz rnl, cbl
union clause instruction = tCBZ : (bits(3), bits(7))
mapping clause encdec = tCBZ(rnl, cbl)
  <-> 0b101100 @ cbl[6] @ 0b1 @ cbl[5..1] @ rnl

// cbnz rnl, cbl
union clause instruction = tCBNZ : (bits(3), bits(7))
mapping clause encdec = tCBNZ(rnl, cbl)
  <-> 0b101110 @ cbl[6] @ 0b1 @ cbl[5..1] @ rnl

// sxth rdl, rml
union clause instruction = tSXTH : (bits(3), bits(3))
mapping clause encdec = tSXTH(rml, rdl)
  <-> 0b10110010 @ 0b00 @ rml @ rdl

// sxtb rdl, rml
union clause instruction = tSXTB : (bits(3), bits(3))
mapping clause encdec = tSXTB(rml, rdl)
  <-> 0b10110010 @ 0b01 @ rml @ rdl

// uxth rdl, rml
union clause instruction = tUXTH : (bits(3), bits(3))
mapping clause encdec = tUXTH(rml, rdl)
  <-> 0b10110010 @ 0b10 @ rml @ rdl

// uxtb rdl, rml
union clause instruction = tUXTB : (bits(3), bits(3))
mapping clause encdec = tUXTB(rml, rdl)
  <-> 0b10110010 @ 0b11 @ rml @ rdl

// push reglist
union clause instruction = tPUSH : (bits(16))
mapping clause encdec = tPUSH(reglist)
  <-> 0b1011010 @ reglist[14] @ reglist[7..0]

// pop reglist
union clause instruction = tPOP : (bits(16))
mapping clause encdec = tPOP(reglist)
  <-> 0b1011110 @ reglist[15] @ reglist[7..0]

// setend endian
union clause instruction = tSETEND : (bits(1))
mapping clause encdec = tSETEND(endian)
  <-> 0b10110110010 @ 0b1 @ endian @ 0b000

// cpsie iflags
union clause instruction = tCPS : (bits(1), bits(3))
mapping clause encdec = tCPS(imod1, iflags)
  <-> 0b10110110011 @ imod1 @ 0b0 @ iflags

// rev rdl, rml
union clause instruction = tREV : (bits(3), bits(3))
mapping clause encdec = tREV(rml, rdl)
  <-> 0b10111010 @ 0b00 @ rml @ rdl

// rev16 rdl, rml
union clause instruction = tREV16 : (bits(3), bits(3))
mapping clause encdec = tREV16(rml, rdl)
  <-> 0b10111010 @ 0b01 @ rml @ rdl

// revsh rdl, rml
union clause instruction = tREVSH : (bits(3), bits(3))
mapping clause encdec = tREVSH(rml, rdl)
  <-> 0b10111010 @ 0b11 @ rml @ rdl

// bkpt #imm
union clause instruction = tBKPT : (bits(8))
mapping clause encdec = tBKPT(imm)
  <-> 0b10111110 @ imm[7..0]

// hint #imm
union clause instruction = tHINT : (bits(4))
mapping clause encdec = tHINT(imm)
  <-> 0b10111111 @ imm[3..0] @ 0b0000

// stm rnl!, reglist8
union clause instruction = tSTMIA_UPD : (bits(3), bits(8))
mapping clause encdec = tSTMIA_UPD(rnl, reglist8)
  <-> 0b11000 @ rnl @ reglist8

// ldm rnlwbang, reglist8
union clause instruction = tLDMIA : (bits(3), bits(8))
mapping clause encdec = tLDMIA(rnl, reglist8)
  <-> 0b11001 @ rnl @ reglist8

// b label
union clause instruction = tBcc : (bits(4), bits(9))
mapping clause encdec = tBcc(cond, label)
  <-> 0b1101 @ cond @ label[8..1]

// udf #imm
union clause instruction = tUDF : (bits(8))
mapping clause encdec = tUDF(imm)
  <-> 0b11011110 @ imm[7..0]

// svc #imm
union clause instruction = tSVC : (bits(8))
mapping clause encdec = tSVC(imm)
  <-> 0b11011111 @ imm[7..0]

// b label
union clause instruction = tB : (bits(12))
mapping clause encdec = tB(label)
  <-> 0b11100 @ label[11..1]

// bl bllabel
union clause instruction = tBL : (bits(24))
mapping clause encdec = tBL(bllabel)
  <-> 0b11110 @ bllabel[23] @ bllabel[20..11] @ 0b11 @ bllabel[22] @ 0b1 @ bllabel[21] @ bllabel[10..0]

// blx blxlabel
union clause instruction = tBLXi : (bits(24))
mapping clause encdec = tBLXi(blxlabel)
  <-> 0b11110 @ blxlabel[23] @ blxlabel[20..11] @ 0b11 @ blxlabel[22] @ 0b0 @ blxlabel[21] @ blxlabel[10..1] @ 0b0

// and rd, rn, #tmimm
union clause instruction = t2ANDri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2ANDri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0000 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// and rd, rn, rm{?, shiftamount}
union clause instruction = t2ANDrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2ANDrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0000 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// bic rd, rn, #tmimm
union clause instruction = t2BICri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2BICri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0001 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// bic rd, rn, rm{?, shiftamount}
union clause instruction = t2BICrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2BICrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0001 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// orr rd, rn, #tmimm
union clause instruction = t2ORRri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2ORRri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0010 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// orr rd, rn, rm{?, shiftamount}
union clause instruction = t2ORRrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2ORRrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// orn rd, rn, #tmimm
union clause instruction = t2ORNri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2ORNri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0011 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// orn rd, rn, rm{?, shiftamount}
union clause instruction = t2ORNrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2ORNrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0011 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// eor rd, rn, #tmimm
union clause instruction = t2EORri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2EORri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0100 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// eor rd, rn, rm{?, shiftamount}
union clause instruction = t2EORrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2EORrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0100 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// add rd, rn, #tmimm
union clause instruction = t2ADDri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2ADDri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1000 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// add rd, rn, rm{?, shiftamount}
union clause instruction = t2ADDrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2ADDrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b1000 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// adc rd, rn, #tmimm
union clause instruction = t2ADCri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2ADCri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1010 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// adc rd, rn, rm{?, shiftamount}
union clause instruction = t2ADCrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2ADCrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b1010 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// sbc rd, rn, #tmimm
union clause instruction = t2SBCri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2SBCri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1011 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// sbc rd, rn, rm{?, shiftamount}
union clause instruction = t2SBCrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2SBCrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b1011 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// sub rd, rn, #tmimm
union clause instruction = t2SUBri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2SUBri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1101 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// sub rd, rn, rm{?, shiftamount}
union clause instruction = t2SUBrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2SUBrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b1101 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// rsb rd, rn, #tmimm
union clause instruction = t2RSBri : (bits(12), bits(1), bits(4), bits(4))
mapping clause encdec = t2RSBri(tmimm, sflag, rn, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1110 @ sflag @ rn @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// rsb rd, rn, rm{?, shiftamount}
union clause instruction = t2RSBrs : (bits(1), bits(4), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2RSBrs(sflag, rn, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b1110 @ sflag @ rn @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// tst.w rn, #tmimm
union clause instruction = t2TSTri : (bits(12), bits(4))
mapping clause encdec = t2TSTri(tmimm, rn)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0000 @ 0b1 @ rn @ 0b0 @ tmimm[10..8] @ 0b1111 @ tmimm[7..0]

// tst.w rn, rm{?, shiftamount}
union clause instruction = t2TSTrs : (bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = t2TSTrs(rn, amount, shift, rm)
  <-> 0b1110101 @ 0b0000 @ 0b1 @ rn @ 0b0 @ amount[4..2] @ 0b1111 @ amount[1..0] @ shift @ rm

// teq.w rn, #tmimm
union clause instruction = t2TEQri : (bits(12), bits(4))
mapping clause encdec = t2TEQri(tmimm, rn)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0100 @ 0b1 @ rn @ 0b0 @ tmimm[10..8] @ 0b1111 @ tmimm[7..0]

// teq.w rn, rm{?, shiftamount}
union clause instruction = t2TEQrs : (bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = t2TEQrs(rn, amount, shift, rm)
  <-> 0b1110101 @ 0b0100 @ 0b1 @ rn @ 0b0 @ amount[4..2] @ 0b1111 @ amount[1..0] @ shift @ rm

// cmn.w rn, #tmimm
union clause instruction = t2CMNri : (bits(12), bits(4))
mapping clause encdec = t2CMNri(tmimm, rn)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1000 @ 0b1 @ rn @ 0b0 @ tmimm[10..8] @ 0b1111 @ tmimm[7..0]

// cmn.w rn, rm{?, shiftamount}
union clause instruction = t2CMNrs : (bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = t2CMNrs(rn, amount, shift, rm)
  <-> 0b1110101 @ 0b1000 @ 0b1 @ rn @ 0b0 @ amount[4..2] @ 0b1111 @ amount[1..0] @ shift @ rm

// cmp.w rn, #tmimm
union clause instruction = t2CMPri : (bits(12), bits(4))
mapping clause encdec = t2CMPri(tmimm, rn)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1101 @ 0b1 @ rn @ 0b0 @ tmimm[10..8] @ 0b1111 @ tmimm[7..0]

// cmp.w rn, rm{?, shiftamount}
union clause instruction = t2CMPrs : (bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = t2CMPrs(rn, amount, shift, rm)
  <-> 0b1110101 @ 0b1101 @ 0b1 @ rn @ 0b0 @ amount[4..2] @ 0b1111 @ amount[1..0] @ shift @ rm

// mov rd, #tmimm
union clause instruction = t2MOVi : (bits(12), bits(1), bits(4))
mapping clause encdec = t2MOVi(tmimm, sflag, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// mvn rd, #tmimm
union clause instruction = t2MVNi : (bits(12), bits(1), bits(4))
mapping clause encdec = t2MVNi(tmimm, sflag, rd)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b0011 @ sflag @ 0b1111 @ 0b0 @ tmimm[10..8] @ rd @ tmimm[7..0]

// mvn rd, rm{?, shiftamount}
union clause instruction = t2MVNs : (bits(1), bits(5), bits(4), bits(2), bits(4))
mapping clause encdec = t2MVNs(sflag, amount, rd, shift, rm)
  <-> 0b1110101 @ 0b0011 @ sflag @ 0b1111 @ 0b0 @ amount[4..2] @ rd @ amount[1..0] @ shift @ rm

// mov rd, rm
union clause instruction = t2MOVr : (bits(1), bits(4), bits(4))
mapping clause encdec = t2MOVr(sflag, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ 0b000 @ rd @ 0b00 @ 0b00 @ rm

// lsl rd, rm, #tlsli
union clause instruction = t2LSLri : (bits(1), bits(5), bits(4), bits(4))
mapping clause encdec = t2LSLri(sflag, tlsli, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ tlsli[4..2] @ rd @ tlsli[1..0] @ 0b00 @ rm

// lsr rd, rm, #tshr
union clause instruction = t2LSRri : (bits(1), bits(5), bits(4), bits(4))
mapping clause encdec = t2LSRri(sflag, tshr, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ tshr[4..2] @ rd @ tshr[1..0] @ 0b01 @ rm

// asr rd, rm, #tshr
union clause instruction = t2ASRri : (bits(1), bits(5), bits(4), bits(4))
mapping clause encdec = t2ASRri(sflag, tshr, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ tshr[4..2] @ rd @ tshr[1..0] @ 0b10 @ rm

// ror rd, rm, #tlsli
union clause instruction = t2RORri : (bits(1), bits(5), bits(4), bits(4))
mapping clause encdec = t2RORri(sflag, tlsli, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ tlsli[4..2] @ rd @ tlsli[1..0] @ 0b11 @ rm

// rrx rd, rm
union clause instruction = t2RRX : (bits(1), bits(4), bits(4))
mapping clause encdec = t2RRX(sflag, rd, rm)
  <-> 0b1110101 @ 0b0010 @ sflag @ 0b1111 @ 0b0 @ 0b000 @ rd @ 0b00 @ 0b11 @ rm

// lsl rd, rn, rm
union clause instruction = t2LSLrr : (bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = t2LSLrr(sflag, rn, rd, rm)
  <-> 0b11111010 @ 0b0 @ 0b00 @ sflag @ rn @ 0b1111 @ rd @ 0b0000 @ rm

// lsr rd, rn, rm
union clause instruction = t2LSRrr : (bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = t2LSRrr(sflag, rn, rd, rm)
  <-> 0b11111010 @ 0b0 @ 0b01 @ sflag @ rn @ 0b1111 @ rd @ 0b0000 @ rm

// asr rd, rn, rm
union clause instruction = t2ASRrr : (bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = t2ASRrr(sflag, rn, rd, rm)
  <-> 0b11111010 @ 0b0 @ 0b10 @ sflag @ rn @ 0b1111 @ rd @ 0b0000 @ rm

// ror rd, rn, rm
union clause instruction = t2RORrr : (bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = t2RORrr(sflag, rn, rd, rm)
  <-> 0b11111010 @ 0b0 @ 0b11 @ sflag @ rn @ 0b1111 @ rd @ 0b0000 @ rm

// add SP, SP, #tmimm
union clause instruction = t2ADDspImm : (bits(12), bits(1))
mapping clause encdec = t2ADDspImm(tmimm, sflag)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1000 @ sflag @ 0b1101 @ 0b0 @ tmimm[10..8] @ 0b1101 @ tmimm[7..0]

// addw rd, rn, #imm
union clause instruction = t2ADDri12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2ADDri12(rn, rd, imm)
  <-> 0b11110 @ imm[11] @ 0b1 @ 0b0000 @ 0b0 @ rn @ 0b0 @ imm[10..8] @ rd @ imm[7..0]

// addw SP, SP, #imm
union clause instruction = t2ADDspImm12 : (bits(12))
mapping clause encdec = t2ADDspImm12(imm)
  <-> 0b11110 @ imm[11] @ 0b1 @ 0b0000 @ 0b0 @ 0b1101 @ 0b0 @ imm[10..8] @ 0b1101 @ imm[7..0]

// sub SP, SP, #tmimm
union clause instruction = t2SUBspImm : (bits(12), bits(1))
mapping clause encdec = t2SUBspImm(tmimm, sflag)
  <-> 0b11110 @ tmimm[11] @ 0b0 @ 0b1101 @ sflag @ 0b1101 @ 0b0 @ tmimm[10..8] @ 0b1101 @ tmimm[7..0]

// subw rd, rn, #imm
union clause instruction = t2SUBri12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2SUBri12(rn, rd, imm)
  <-> 0b11110 @ imm[11] @ 0b1 @ 0b0101 @ 0b0 @ rn @ 0b0 @ imm[10..8] @ rd @ imm[7..0]

// subw SP, SP, #imm
union clause instruction = t2SUBspImm12 : (bits(12))
mapping clause encdec = t2SUBspImm12(imm)
  <-> 0b11110 @ imm[11] @ 0b1 @ 0b0101 @ 0b0 @ 0b1101 @ 0b0 @ imm[10..8] @ 0b1101 @ imm[7..0]

// addw rd, PC, #imm
union clause instruction = t2ADR : (bits(1), bits(4), bits(12))
mapping clause encdec = t2ADR(adrsub, rd, imm)
  <-> 0b11110 @ imm[11] @ 0b10 @ adrsub @ 0b0 @ adrsub @ 0b0 @ 0b1111 @ 0b0 @ imm[10..8] @ rd @ imm[7..0]

// movw rd, #imm
union clause instruction = t2MOVi16 : (bits(4), bits(16))
mapping clause encdec = t2MOVi16(rd, imm)
  <-> 0b11110 @ imm[11] @ 0b10 @ 0b0100 @ imm[15..12] @ 0b0 @ imm[10..8] @ rd @ imm[7..0]

// movt rd, #imm
union clause instruction = t2MOVTi16 : (bits(4), bits(16))
mapping clause encdec = t2MOVTi16(rd, imm)
  <-> 0b11110 @ imm[11] @ 0b10 @ 0b1100 @ imm[15..12] @ 0b0 @ imm[10..8] @ rd @ imm[7..0]

// ssat rd, #ssat, rn{?, shsat #samt}
union clause instruction = t2SSAT : (bits(1), bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = t2SSAT(shsat, rn, samt, rd, ssat)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b00 @ shsat @ 0b0 @ rn @ 0b0 @ samt[4..2] @ rd @ samt[1..0] @ 0b0 @ ssat

// usat rd, #usat, rn{?, shsat #samt}
union clause instruction = t2USAT : (bits(1), bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = t2USAT(shsat, rn, samt, rd, usat)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b10 @ shsat @ 0b0 @ rn @ 0b0 @ samt[4..2] @ rd @ samt[1..0] @ 0b0 @ usat

// ssat16 rd, #ssat4, rn
union clause instruction = t2SSAT16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SSAT16(rn, rd, ssat4)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b00 @ 0b1 @ 0b0 @ rn @ 0b0000 @ rd @ 0b0000 @ ssat4

// usat16 rd, #usat4, rn
union clause instruction = t2USAT16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2USAT16(rn, rd, usat4)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b10 @ 0b1 @ 0b0 @ rn @ 0b0000 @ rd @ 0b0000 @ usat4

// sbfx rd, rn, #lsb, #widthm1
union clause instruction = t2SBFX : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = t2SBFX(rn, lsb, rd, widthm1)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b0100 @ rn @ 0b0 @ lsb[4..2] @ rd @ lsb[1..0] @ 0b0 @ widthm1

// ubfx rd, rn, #lsb, #widthm1
union clause instruction = t2UBFX : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = t2UBFX(rn, lsb, rd, widthm1)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b1100 @ rn @ 0b0 @ lsb[4..2] @ rd @ lsb[1..0] @ 0b0 @ widthm1

// bfi rd, rn, #lsb, #msb
union clause instruction = t2BFI : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = t2BFI(rn, lsb, rd, msb)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b0110 @ rn @ 0b0 @ lsb[4..2] @ rd @ lsb[1..0] @ 0b0 @ msb

// bfc rd, #lsb, #msb
union clause instruction = t2BFC : (bits(5), bits(4), bits(5))
mapping clause encdec = t2BFC(lsb, rd, msb)
  <-> 0b11110 @ 0b0 @ 0b11 @ 0b0110 @ 0b1111 @ 0b0 @ lsb[4..2] @ rd @ lsb[1..0] @ 0b0 @ msb

// pkhbt rd, rn, rm{?, lsl #pkhsh}
union clause instruction = t2PKHBT : (bits(4), bits(5), bits(4), bits(4))
mapping clause encdec = t2PKHBT(rn, pkhsh, rd, rm)
  <-> 0b1110101 @ 0b0110 @ 0b0 @ rn @ 0b0 @ pkhsh[4..2] @ rd @ pkhsh[1..0] @ 0b00 @ rm

// pkhtb rd, rn, rm, asr #pkha
union clause instruction = t2PKHTB : (bits(4), bits(5), bits(4), bits(4))
mapping clause encdec = t2PKHTB(rn, pkha, rd, rm)
  <-> 0b1110101 @ 0b0110 @ 0b0 @ rn @ 0b0 @ pkha[4..2] @ rd @ pkha[1..0] @ 0b10 @ rm

// sxtah rd, rn, rm{?, rot}
union clause instruction = t2SXTAH : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTAH(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b000 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sxth.w rd, rm{?, rot}
union clause instruction = t2SXTH : (bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTH(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b000 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxtah rd, rn, rm{?, rot}
union clause instruction = t2UXTAH : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTAH(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b001 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxth.w rd, rm{?, rot}
union clause instruction = t2UXTH : (bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTH(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b001 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sxtab16 rd, rn, rm{?, rot}
union clause instruction = t2SXTAB16 : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTAB16(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b010 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sxtb16 rd, rm{?, rot}
union clause instruction = t2SXTB16 : (bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTB16(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b010 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxtab16 rd, rn, rm{?, rot}
union clause instruction = t2UXTAB16 : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTAB16(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b011 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxtb16 rd, rm{?, rot}
union clause instruction = t2UXTB16 : (bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTB16(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b011 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sxtab rd, rn, rm{?, rot}
union clause instruction = t2SXTAB : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTAB(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b100 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sxtb.w rd, rm{?, rot}
union clause instruction = t2SXTB : (bits(4), bits(2), bits(4))
mapping clause encdec = t2SXTB(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b100 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxtab rd, rn, rm{?, rot}
union clause instruction = t2UXTAB : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTAB(rn, rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b101 @ rn @ 0b1111 @ rd @ 0b10 @ rot @ rm

// uxtb.w rd, rm{?, rot}
union clause instruction = t2UXTB : (bits(4), bits(2), bits(4))
mapping clause encdec = t2UXTB(rd, rot, rm)
  <-> 0b11111010 @ 0b0 @ 0b101 @ 0b1111 @ 0b1111 @ rd @ 0b10 @ rot @ rm

// sadd8 rd, rn, rm
union clause instruction = t2SADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// sadd16 rd, rn, rm
union clause instruction = t2SADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// sasx rd, rn, rm
union clause instruction = t2SASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// ssub8 rd, rn, rm
union clause instruction = t2SSUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SSUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// ssub16 rd, rn, rm
union clause instruction = t2SSUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SSUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// ssax rd, rn, rm
union clause instruction = t2SSAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SSAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b000 @ rm

// qadd8 rd, rn, rm
union clause instruction = t2QADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// qadd16 rd, rn, rm
union clause instruction = t2QADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// qasx rd, rn, rm
union clause instruction = t2QASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// qsub8 rd, rn, rm
union clause instruction = t2QSUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QSUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// qsub16 rd, rn, rm
union clause instruction = t2QSUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QSUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// qsax rd, rn, rm
union clause instruction = t2QSAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QSAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b001 @ rm

// shadd8 rd, rn, rm
union clause instruction = t2SHADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// shadd16 rd, rn, rm
union clause instruction = t2SHADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// shasx rd, rn, rm
union clause instruction = t2SHASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// shsub8 rd, rn, rm
union clause instruction = t2SHSUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHSUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// shsub16 rd, rn, rm
union clause instruction = t2SHSUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHSUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// shsax rd, rn, rm
union clause instruction = t2SHSAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SHSAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b010 @ rm

// uadd8 rd, rn, rm
union clause instruction = t2UADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// uadd16 rd, rn, rm
union clause instruction = t2UADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// uasx rd, rn, rm
union clause instruction = t2UASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// usub8 rd, rn, rm
union clause instruction = t2USUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2USUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// usub16 rd, rn, rm
union clause instruction = t2USUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2USUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// usax rd, rn, rm
union clause instruction = t2USAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2USAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b100 @ rm

// uqadd8 rd, rn, rm
union clause instruction = t2UQADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uqadd16 rd, rn, rm
union clause instruction = t2UQADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uqasx rd, rn, rm
union clause instruction = t2UQASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uqsub8 rd, rn, rm
union clause instruction = t2UQSUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQSUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uqsub16 rd, rn, rm
union clause instruction = t2UQSUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQSUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uqsax rd, rn, rm
union clause instruction = t2UQSAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UQSAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b101 @ rm

// uhadd8 rd, rn, rm
union clause instruction = t2UHADD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHADD8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// uhadd16 rd, rn, rm
union clause instruction = t2UHADD16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHADD16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// uhasx rd, rn, rm
union clause instruction = t2UHASX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHASX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b010 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// uhsub8 rd, rn, rm
union clause instruction = t2UHSUB8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHSUB8(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b100 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// uhsub16 rd, rn, rm
union clause instruction = t2UHSUB16 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHSUB16(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b101 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// uhsax rd, rn, rm
union clause instruction = t2UHSAX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UHSAX(rn, rd, rm)
  <-> 0b11111010 @ 0b1 @ 0b110 @ rn @ 0b1111 @ rd @ 0b0 @ 0b110 @ rm

// qadd rd, rm, rn
union clause instruction = t2QADD : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QADD(rn, rd, rm)
  <-> 0b11111010 @ 0b1000 @ rn @ 0b1111 @ rd @ 0b10 @ 0b00 @ rm

// qdadd rd, rm, rn
union clause instruction = t2QDADD : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QDADD(rn, rd, rm)
  <-> 0b11111010 @ 0b1000 @ rn @ 0b1111 @ rd @ 0b10 @ 0b01 @ rm

// qsub rd, rm, rn
union clause instruction = t2QSUB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QSUB(rn, rd, rm)
  <-> 0b11111010 @ 0b1000 @ rn @ 0b1111 @ rd @ 0b10 @ 0b10 @ rm

// qdsub rd, rm, rn
union clause instruction = t2QDSUB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2QDSUB(rn, rd, rm)
  <-> 0b11111010 @ 0b1000 @ rn @ 0b1111 @ rd @ 0b10 @ 0b11 @ rm

// rev.w rd, rm
union clause instruction = t2REV : (bits(4), bits(4))
mapping clause encdec = t2REV(rm, rd)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rm @ 0b1111 @ rd @ 0b10 @ 0b00 @ rm

// rev16.w rd, rm
union clause instruction = t2REV16 : (bits(4), bits(4))
mapping clause encdec = t2REV16(rm, rd)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rm @ 0b1111 @ rd @ 0b10 @ 0b01 @ rm

// rbit rd, rm
union clause instruction = t2RBIT : (bits(4), bits(4))
mapping clause encdec = t2RBIT(rm, rd)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rm @ 0b1111 @ rd @ 0b10 @ 0b10 @ rm

// revsh.w rd, rm
union clause instruction = t2REVSH : (bits(4), bits(4))
mapping clause encdec = t2REVSH(rm, rd)
  <-> 0b11111010 @ 0b1 @ 0b001 @ rm @ 0b1111 @ rd @ 0b10 @ 0b11 @ rm

// clz rd, rm
union clause instruction = t2CLZ : (bits(4), bits(4))
mapping clause encdec = t2CLZ(rm, rd)
  <-> 0b11111010 @ 0b1 @ 0b011 @ rm @ 0b1111 @ rd @ 0b10 @ 0b00 @ rm

// sel rd, rn, rm
union clause instruction = t2SEL : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SEL(rn, rd, rm)
  <-> 0b11111010 @ 0b1010 @ rn @ 0b1111 @ rd @ 0b1000 @ rm

// mul rd, rn, rm
union clause instruction = t2MUL : (bits(4), bits(4), bits(4))
mapping clause encdec = t2MUL(rn, rd, rm)
  <-> 0b111110110 @ 0b000 @ rn @ 0b1111 @ rd @ 0b0000 @ rm

// mla rd, rn, rm, ra
union clause instruction = t2MLA : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MLA(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b000 @ rn @ ra @ rd @ 0b0000 @ rm

// mls rd, rn, rm, ra
union clause instruction = t2MLS : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MLS(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b000 @ rn @ ra @ rd @ 0b0001 @ rm

// smlabb rd, rn, rm, ra
union clause instruction = t2SMLABB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLABB(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ ra @ rd @ 0b00 @ 0b0 @ 0b0 @ rm

// smulbb rd, rn, rm
union clause instruction = t2SMULBB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULBB(rn, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ 0b1111 @ rd @ 0b00 @ 0b0 @ 0b0 @ rm

// smlalbb rdlo, rdhi, rn, rm
union clause instruction = t2SMLALBB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALBB(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b10 @ 0b0 @ 0b0 @ rm

// smlabt rd, rn, rm, ra
union clause instruction = t2SMLABT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLABT(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ ra @ rd @ 0b00 @ 0b0 @ 0b1 @ rm

// smulbt rd, rn, rm
union clause instruction = t2SMULBT : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULBT(rn, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ 0b1111 @ rd @ 0b00 @ 0b0 @ 0b1 @ rm

// smlalbt rdlo, rdhi, rn, rm
union clause instruction = t2SMLALBT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALBT(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b10 @ 0b0 @ 0b1 @ rm

// smlatb rd, rn, rm, ra
union clause instruction = t2SMLATB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLATB(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ ra @ rd @ 0b00 @ 0b1 @ 0b0 @ rm

// smultb rd, rn, rm
union clause instruction = t2SMULTB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULTB(rn, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ 0b1111 @ rd @ 0b00 @ 0b1 @ 0b0 @ rm

// smlaltb rdlo, rdhi, rn, rm
union clause instruction = t2SMLALTB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALTB(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b10 @ 0b1 @ 0b0 @ rm

// smlatt rd, rn, rm, ra
union clause instruction = t2SMLATT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLATT(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ ra @ rd @ 0b00 @ 0b1 @ 0b1 @ rm

// smultt rd, rn, rm
union clause instruction = t2SMULTT : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULTT(rn, rd, rm)
  <-> 0b111110110 @ 0b001 @ rn @ 0b1111 @ rd @ 0b00 @ 0b1 @ 0b1 @ rm

// smlaltt rdlo, rdhi, rn, rm
union clause instruction = t2SMLALTT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALTT(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b10 @ 0b1 @ 0b1 @ rm

// smlad rd, rn, rm, ra
union clause instruction = t2SMLAD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLAD(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b010 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smladx rd, rn, rm, ra
union clause instruction = t2SMLADX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLADX(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b010 @ rn @ ra @ rd @ 0b000 @ 0b1 @ rm

// smuad rd, rn, rm
union clause instruction = t2SMUAD : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMUAD(rn, rd, rm)
  <-> 0b111110110 @ 0b010 @ rn @ 0b1111 @ rd @ 0b000 @ 0b0 @ rm

// smuadx rd, rn, rm
union clause instruction = t2SMUADX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMUADX(rn, rd, rm)
  <-> 0b111110110 @ 0b010 @ rn @ 0b1111 @ rd @ 0b000 @ 0b1 @ rm

// smlawb rd, rn, rm, ra
union clause instruction = t2SMLAWB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLAWB(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b011 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smlawt rd, rn, rm, ra
union clause instruction = t2SMLAWT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLAWT(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b011 @ rn @ ra @ rd @ 0b000 @ 0b1 @ rm

// smulwb rd, rn, rm
union clause instruction = t2SMULWB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULWB(rn, rd, rm)
  <-> 0b111110110 @ 0b011 @ rn @ 0b1111 @ rd @ 0b000 @ 0b0 @ rm

// smulwt rd, rn, rm
union clause instruction = t2SMULWT : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULWT(rn, rd, rm)
  <-> 0b111110110 @ 0b011 @ rn @ 0b1111 @ rd @ 0b000 @ 0b1 @ rm

// smlsd rd, rn, rm, ra
union clause instruction = t2SMLSD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLSD(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b100 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smlsdx rd, rn, rm, ra
union clause instruction = t2SMLSDX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLSDX(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b100 @ rn @ ra @ rd @ 0b000 @ 0b1 @ rm

// smusd rd, rn, rm
union clause instruction = t2SMUSD : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMUSD(rn, rd, rm)
  <-> 0b111110110 @ 0b100 @ rn @ 0b1111 @ rd @ 0b000 @ 0b0 @ rm

// smusdx rd, rn, rm
union clause instruction = t2SMUSDX : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMUSDX(rn, rd, rm)
  <-> 0b111110110 @ 0b100 @ rn @ 0b1111 @ rd @ 0b000 @ 0b1 @ rm

// smmla rd, rn, rm, ra
union clause instruction = t2SMMLA : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMLA(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b101 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smmlar rd, rn, rm, ra
union clause instruction = t2SMMLAR : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMLAR(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b101 @ rn @ ra @ rd @ 0b000 @ 0b1 @ rm

// smmul rd, rn, rm
union clause instruction = t2SMMUL : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMUL(rn, rd, rm)
  <-> 0b111110110 @ 0b101 @ rn @ 0b1111 @ rd @ 0b000 @ 0b0 @ rm

// smmulr rd, rn, rm
union clause instruction = t2SMMULR : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMULR(rn, rd, rm)
  <-> 0b111110110 @ 0b101 @ rn @ 0b1111 @ rd @ 0b000 @ 0b1 @ rm

// smmls rd, rn, rm, ra
union clause instruction = t2SMMLS : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMLS(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b110 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smmlsr rd, rn, rm, ra
union clause instruction = t2SMMLSR : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMMLSR(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b110 @ rn @ ra @ rd @ 0b000 @ 0b1 @ rm

// usad8 rd, rn, rm
union clause instruction = t2USAD8 : (bits(4), bits(4), bits(4))
mapping clause encdec = t2USAD8(rn, rd, rm)
  <-> 0b111110110 @ 0b111 @ rn @ 0b1111 @ rd @ 0b000 @ 0b0 @ rm

// usada8 rd, rn, rm, ra
union clause instruction = t2USADA8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2USADA8(rn, ra, rd, rm)
  <-> 0b111110110 @ 0b111 @ rn @ ra @ rd @ 0b000 @ 0b0 @ rm

// smull rdlo, rdhi, rn, rm
union clause instruction = t2SMULL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMULL(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b000 @ rn @ rdlo @ rdhi @ 0b0000 @ rm

// umull rdlo, rdhi, rn, rm
union clause instruction = t2UMULL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2UMULL(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b010 @ rn @ rdlo @ rdhi @ 0b0000 @ rm

// smlal rdlo, rdhi, rn, rm
union clause instruction = t2SMLAL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLAL(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b0000 @ rm

// umlal rdlo, rdhi, rn, rm
union clause instruction = t2UMLAL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2UMLAL(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b110 @ rn @ rdlo @ rdhi @ 0b0000 @ rm

// umaal rdlo, rdhi, rn, rm
union clause instruction = t2UMAAL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2UMAAL(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b110 @ rn @ rdlo @ rdhi @ 0b0110 @ rm

// smlald rdlo, rdhi, rn, rm
union clause instruction = t2SMLALD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALD(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b1100 @ rm

// smlaldx rdlo, rdhi, rn, rm
union clause instruction = t2SMLALDX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLALDX(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b100 @ rn @ rdlo @ rdhi @ 0b1101 @ rm

// smlsld rdlo, rdhi, rn, rm
union clause instruction = t2SMLSLD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLSLD(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b101 @ rn @ rdlo @ rdhi @ 0b1100 @ rm

// smlsldx rdlo, rdhi, rn, rm
union clause instruction = t2SMLSLDX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2SMLSLDX(rn, rdlo, rdhi, rm)
  <-> 0b111110111 @ 0b101 @ rn @ rdlo @ rdhi @ 0b1101 @ rm

// sdiv rd, rn, rm
union clause instruction = t2SDIV : (bits(4), bits(4), bits(4))
mapping clause encdec = t2SDIV(rn, rd, rm)
  <-> 0b111110111 @ 0b001 @ rn @ 0b1111 @ rd @ 0b1111 @ rm

// udiv rd, rn, rm
union clause instruction = t2UDIV : (bits(4), bits(4), bits(4))
mapping clause encdec = t2UDIV(rn, rd, rm)
  <-> 0b111110111 @ 0b011 @ rn @ 0b1111 @ rd @ 0b1111 @ rm

// b.w bllabel
union clause instruction = t2B : (bits(24))
mapping clause encdec = t2B(bllabel)
  <-> 0b11110 @ bllabel[23] @ bllabel[20..11] @ 0b10 @ bllabel[22] @ 0b1 @ bllabel[21] @ bllabel[10..0]

// b label
union clause instruction = t2Bcc : (bits(4), bits(21))
mapping clause encdec = t2Bcc(cond, label)
  <-> 0b11110 @ label[20] @ cond @ label[17..12] @ 0b10 @ label[18] @ 0b0 @ label[19] @ label[11..1]

// msr psrmsk, rn
union clause instruction = t2MSR_AR : (bits(1), bits(4), bits(4))
mapping clause encdec = t2MSR_AR(psr, rn, msk)
  <-> 0b11110 @ 0b0111 @ 0b00 @ psr @ rn @ 0b10 @ 0b0 @ 0b0 @ msk @ 0b00000000

// mrs rd, APSR
union clause instruction = t2MRS_AR : (bits(4))
mapping clause encdec = t2MRS_AR(rd)
  <-> 0b11110011111 @ 0b0 @ 0b1111 @ 0b10 @ 0b0 @ 0b0 @ rd @ 0b00000000

// mrs rd, SPSR
union clause instruction = t2MRSsys_AR : (bits(4))
mapping clause encdec = t2MRSsys_AR(rd)
  <-> 0b11110011111 @ 0b1 @ 0b1111 @ 0b10 @ 0b0 @ 0b0 @ rd @ 0b00000000

// cpsie.w iflags
union clause instruction = t2CPS2p : (bits(2), bits(3))
mapping clause encdec = t2CPS2p(imod, iflags)
  <-> 0b11110 @ 0b0111 @ 0b0101111 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ imod @ 0b0 @ iflags @ 0b00000

// cpsie.w iflags, #mode
union clause instruction = t2CPS3p : (bits(2), bits(3), bits(5))
mapping clause encdec = t2CPS3p(imod, iflags, mode)
  <-> 0b11110 @ 0b0111 @ 0b0101111 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ imod @ 0b1 @ iflags @ mode

// cps #mode
union clause instruction = t2CPS1p : (bits(5))
mapping clause encdec = t2CPS1p(mode)
  <-> 0b11110 @ 0b0111 @ 0b0101111 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ 0b000 @ mode

// hint.w #imm
union clause instruction = t2HINT : (bits(8))
mapping clause encdec = t2HINT(imm)
  <-> 0b11110 @ 0b0111 @ 0b0101111 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ 0b000 @ imm[7..0]

// dbg #imm
union clause instruction = t2DBG : (bits(4))
mapping clause encdec = t2DBG(imm)
  <-> 0b11110 @ 0b0111 @ 0b0101111 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ 0b000 @ 0b1111 @ imm[3..0]

// clrex
union clause instruction = t2CLREX : unit
mapping clause encdec = t2CLREX()
  <-> 0b11110 @ 0b0111 @ 0b0111111 @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ 0b0010 @ 0b1111

// dsb barrier
union clause instruction = t2DSB : (bits(4))
mapping clause encdec = t2DSB(barrier)
  <-> 0b11110 @ 0b0111 @ 0b0111111 @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ 0b0100 @ barrier

// dmb barrier
union clause instruction = t2DMB : (bits(4))
mapping clause encdec = t2DMB(barrier)
  <-> 0b11110 @ 0b0111 @ 0b0111111 @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ 0b0101 @ barrier

// isb {?isbopt}
union clause instruction = t2ISB : (bits(4))
mapping clause encdec = t2ISB(isbopt)
  <-> 0b11110 @ 0b0111 @ 0b0111111 @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ 0b0110 @ isbopt

// bxj rm
union clause instruction = t2BXJ : (bits(4))
mapping clause encdec = t2BXJ(rm)
  <-> 0b11110 @ 0b0111 @ 0b100 @ rm @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ 0b00000000

// subs PC, LR, #imm
union clause instruction = t2SUBS_PC_LR : (bits(8))
mapping clause encdec = t2SUBS_PC_LR(imm)
  <-> 0b11110 @ 0b0111 @ 0b1011110 @ 0b10 @ 0b0 @ 0b0 @ 0b1111 @ imm[7..0]

// smc #imm
union clause instruction = t2SMC : (bits(4))
mapping clause encdec = t2SMC(imm)
  <-> 0b11110 @ 0b1111111 @ imm[3..0] @ 0b1000 @ 0b000000000000

// hvc #imm
union clause instruction = t2HVC : (bits(16))
mapping clause encdec = t2HVC(imm)
  <-> 0b11110 @ 0b1111110 @ imm[15..12] @ 0b1000 @ imm[11..0]

// udf.w #imm
union clause instruction = t2UDF : (bits(16))
mapping clause encdec = t2UDF(imm)
  <-> 0b11110 @ 0b1111111 @ imm[15..12] @ 0b1010 @ imm[11..0]

// it firstcond
union clause instruction = t2IT : (bits(4), bits(4))
mapping clause encdec = t2IT(firstcond, itmask)
  <-> 0b10111111 @ firstcond @ itmask

// ldr.w rt, [rn, #imm]
union clause instruction = t2LDRi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2LDRi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b10 @ 0b1 @ rn @ rt @ imm[11..0]

// ldr rt, [rn, #-imm]
union clause instruction = t2LDRi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// ldr rt, [rn, #signimm]!
union clause instruction = t2LDR_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDR_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// ldr rt, [rn], #signimm
union clause instruction = t2LDR_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDR_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b1 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// ldrt rt, [rn, #imm]
union clause instruction = t2LDRT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b1 @ rn @ rt @ 0b1110 @ imm[7..0]

// ldr.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2LDRs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2LDRs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b1 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldr.w rt, [PC, #signimm]
union clause instruction = t2LDRpci : (bits(1), bits(4), bits(12))
mapping clause encdec = t2LDRpci(sign, rt, imm)
  <-> 0b1111100 @ 0b0 @ sign @ 0b10 @ 0b1 @ 0b1111 @ rt @ imm[11..0]

// str.w rt, [rn, #imm]
union clause instruction = t2STRi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2STRi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b10 @ 0b0 @ rn @ rt @ imm[11..0]

// str rt, [rn, #-imm]
union clause instruction = t2STRi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// str rt, [rn, #signimm]!
union clause instruction = t2STR_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STR_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// str rt, [rn], #signimm
union clause instruction = t2STR_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STR_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b0 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// strt rt, [rn, #imm]
union clause instruction = t2STRT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b0 @ rn @ rt @ 0b1110 @ imm[7..0]

// str.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2STRs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2STRs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b10 @ 0b0 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrb.w rt, [rn, #imm]
union clause instruction = t2LDRBi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2LDRBi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b00 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrb rt, [rn, #-imm]
union clause instruction = t2LDRBi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRBi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// ldrb rt, [rn, #signimm]!
union clause instruction = t2LDRB_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRB_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// ldrb rt, [rn], #signimm
union clause instruction = t2LDRB_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRB_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// ldrbt rt, [rn, #imm]
union clause instruction = t2LDRBT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRBT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1110 @ imm[7..0]

// ldrb.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2LDRBs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2LDRBs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrb.w rt, [PC, #signimm]
union clause instruction = t2LDRBpci : (bits(1), bits(4), bits(12))
mapping clause encdec = t2LDRBpci(sign, rt, imm)
  <-> 0b1111100 @ 0b0 @ sign @ 0b00 @ 0b1 @ 0b1111 @ rt @ imm[11..0]

// strb.w rt, [rn, #imm]
union clause instruction = t2STRBi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2STRBi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b00 @ 0b0 @ rn @ rt @ imm[11..0]

// strb rt, [rn, #-imm]
union clause instruction = t2STRBi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRBi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// strb rt, [rn, #signimm]!
union clause instruction = t2STRB_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STRB_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// strb rt, [rn], #signimm
union clause instruction = t2STRB_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STRB_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b0 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// strbt rt, [rn, #imm]
union clause instruction = t2STRBT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRBT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b0 @ rn @ rt @ 0b1110 @ imm[7..0]

// strb.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2STRBs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2STRBs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b00 @ 0b0 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrsb.w rt, [rn, #imm]
union clause instruction = t2LDRSBi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2LDRSBi12(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b1 @ 0b00 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrsb rt, [rn, #-imm]
union clause instruction = t2LDRSBi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRSBi8(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// ldrsb rt, [rn, #signimm]!
union clause instruction = t2LDRSB_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRSB_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// ldrsb rt, [rn], #signimm
union clause instruction = t2LDRSB_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRSB_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// ldrsbt rt, [rn, #imm]
union clause instruction = t2LDRSBT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRSBT(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b1110 @ imm[7..0]

// ldrsb.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2LDRSBs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2LDRSBs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b00 @ 0b1 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrsb.w rt, [PC, #signimm]
union clause instruction = t2LDRSBpci : (bits(1), bits(4), bits(12))
mapping clause encdec = t2LDRSBpci(sign, rt, imm)
  <-> 0b1111100 @ 0b1 @ sign @ 0b00 @ 0b1 @ 0b1111 @ rt @ imm[11..0]

// ldrh.w rt, [rn, #imm]
union clause instruction = t2LDRHi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2LDRHi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b01 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrh rt, [rn, #-imm]
union clause instruction = t2LDRHi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRHi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// ldrh rt, [rn, #signimm]!
union clause instruction = t2LDRH_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRH_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// ldrh rt, [rn], #signimm
union clause instruction = t2LDRH_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRH_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// ldrht rt, [rn, #imm]
union clause instruction = t2LDRHT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRHT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1110 @ imm[7..0]

// ldrh.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2LDRHs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2LDRHs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrh.w rt, [PC, #signimm]
union clause instruction = t2LDRHpci : (bits(1), bits(4), bits(12))
mapping clause encdec = t2LDRHpci(sign, rt, imm)
  <-> 0b1111100 @ 0b0 @ sign @ 0b01 @ 0b1 @ 0b1111 @ rt @ imm[11..0]

// strh.w rt, [rn, #imm]
union clause instruction = t2STRHi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2STRHi12(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b01 @ 0b0 @ rn @ rt @ imm[11..0]

// strh rt, [rn, #-imm]
union clause instruction = t2STRHi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRHi8(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// strh rt, [rn, #signimm]!
union clause instruction = t2STRH_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STRH_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b0 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// strh rt, [rn], #signimm
union clause instruction = t2STRH_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2STRH_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b0 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// strht rt, [rn, #imm]
union clause instruction = t2STRHT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2STRHT(rn, rt, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b0 @ rn @ rt @ 0b1110 @ imm[7..0]

// strh.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2STRHs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2STRHs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b01 @ 0b0 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrsh.w rt, [rn, #imm]
union clause instruction = t2LDRSHi12 : (bits(4), bits(4), bits(12))
mapping clause encdec = t2LDRSHi12(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b1 @ 0b01 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrsh rt, [rn, #-imm]
union clause instruction = t2LDRSHi8 : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRSHi8(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ imm[7..0]

// ldrsh rt, [rn, #signimm]!
union clause instruction = t2LDRSH_PRE : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRSH_PRE(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b1 @ sign @ 0b1 @ imm[7..0]

// ldrsh rt, [rn], #signimm
union clause instruction = t2LDRSH_POST : (bits(4), bits(4), bits(1), bits(8))
mapping clause encdec = t2LDRSH_POST(rn, rt, sign, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1 @ 0b0 @ sign @ 0b1 @ imm[7..0]

// ldrsht rt, [rn, #imm]
union clause instruction = t2LDRSHT : (bits(4), bits(4), bits(8))
mapping clause encdec = t2LDRSHT(rn, rt, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b1110 @ imm[7..0]

// ldrsh.w rt, [rn, rm{?, LSL #lsl2}]
union clause instruction = t2LDRSHs : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = t2LDRSHs(rn, rt, lsl2, rm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b01 @ 0b1 @ rn @ rt @ 0b000000 @ lsl2 @ rm

// ldrsh.w rt, [PC, #signimm]
union clause instruction = t2LDRSHpci : (bits(1), bits(4), bits(12))
mapping clause encdec = t2LDRSHpci(sign, rt, imm)
  <-> 0b1111100 @ 0b1 @ sign @ 0b01 @ 0b1 @ 0b1111 @ rt @ imm[11..0]

// ldrd rt, rt2, [rn, #signdoff]
union clause instruction = t2LDRDi8 : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDRDi8(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ rt2 @ doff[9..2]

// strd rt, rt2, [rn, #signdoff]
union clause instruction = t2STRDi8 : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STRDi8(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ rt2 @ doff[9..2]

// ldrd rt, rt2, [rn, #signdoff]!
union clause instruction = t2LDRD_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDRD_PRE(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ rt2 @ doff[9..2]

// strd rt, rt2, [rn, #signdoff]!
union clause instruction = t2STRD_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STRD_PRE(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ rt2 @ doff[9..2]

// ldrd rt, rt2, [rn], #signdoff
union clause instruction = t2LDRD_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDRD_POST(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ rt2 @ doff[9..2]

// strd rt, rt2, [rn], #signdoff
union clause instruction = t2STRD_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STRD_POST(sign, rn, rt, rt2, doff)
  <-> 0b1110100 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ rt2 @ doff[9..2]

// ldrex rt, [rn, #doff]
union clause instruction = t2LDREX : (bits(4), bits(4), bits(10))
mapping clause encdec = t2LDREX(rn, rt, doff)
  <-> 0b111010000101 @ rn @ rt @ 0b1111 @ doff[9..2]

// strex rd, rt, [rn, #doff]
union clause instruction = t2STREX : (bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STREX(rn, rt, rd, doff)
  <-> 0b111010000100 @ rn @ rt @ rd @ doff[9..2]

// ldrexb rt, [rn]
union clause instruction = t2LDREXB : (bits(4), bits(4))
mapping clause encdec = t2LDREXB(rn, rt)
  <-> 0b111010001101 @ rn @ rt @ 0b1111 @ 0b01 @ 0b00 @ 0b1111

// ldrexh rt, [rn]
union clause instruction = t2LDREXH : (bits(4), bits(4))
mapping clause encdec = t2LDREXH(rn, rt)
  <-> 0b111010001101 @ rn @ rt @ 0b1111 @ 0b01 @ 0b01 @ 0b1111

// ldrexd rt, rt2, [rn]
union clause instruction = t2LDREXD : (bits(4), bits(4), bits(4))
mapping clause encdec = t2LDREXD(rn, rt, rt2)
  <-> 0b111010001101 @ rn @ rt @ rt2 @ 0b01 @ 0b11 @ 0b1111

// strexb rd, rt, [rn]
union clause instruction = t2STREXB : (bits(4), bits(4), bits(4))
mapping clause encdec = t2STREXB(rn, rt, rd)
  <-> 0b111010001100 @ rn @ rt @ 0b1111 @ 0b01 @ 0b00 @ rd

// strexh rd, rt, [rn]
union clause instruction = t2STREXH : (bits(4), bits(4), bits(4))
mapping clause encdec = t2STREXH(rn, rt, rd)
  <-> 0b111010001100 @ rn @ rt @ 0b1111 @ 0b01 @ 0b01 @ rd

// strexd rd, rt, rt2, [rn]
union clause instruction = t2STREXD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2STREXD(rn, rt, rt2, rd)
  <-> 0b111010001100 @ rn @ rt @ rt2 @ 0b01 @ 0b11 @ rd

// tbb [rn, rm]
union clause instruction = t2TBB : (bits(4), bits(4))
mapping clause encdec = t2TBB(rn, rm)
  <-> 0b111010001101 @ rn @ 0b1111 @ 0b0000 @ 0b000 @ 0b0 @ rm

// tbh [rn, rm, LSL #1]
union clause instruction = t2TBH : (bits(4), bits(4))
mapping clause encdec = t2TBH(rn, rm)
  <-> 0b111010001101 @ rn @ 0b1111 @ 0b0000 @ 0b000 @ 0b1 @ rm

// stm.w rn, tlists
union clause instruction = t2STMIA : (bits(4), bits(16))
mapping clause encdec = t2STMIA(rn, tlists)
  <-> 0b1110100 @ 0b01 @ 0b0 @ 0b0 @ 0b0 @ rn @ 0b0 @ tlists[14] @ 0b0 @ tlists[12..0]

// stm.w rn!, tlists
union clause instruction = t2STMIA_UPD : (bits(4), bits(16))
mapping clause encdec = t2STMIA_UPD(rn, tlists)
  <-> 0b1110100 @ 0b01 @ 0b0 @ 0b1 @ 0b0 @ rn @ 0b0 @ tlists[14] @ 0b0 @ tlists[12..0]

// ldm.w rn, tlistl
union clause instruction = t2LDMIA : (bits(4), bits(16))
mapping clause encdec = t2LDMIA(rn, tlistl)
  <-> 0b1110100 @ 0b01 @ 0b0 @ 0b0 @ 0b1 @ rn @ tlistl[15..14] @ 0b0 @ tlistl[12..0]

// ldm.w rn!, tlistl
union clause instruction = t2LDMIA_UPD : (bits(4), bits(16))
mapping clause encdec = t2LDMIA_UPD(rn, tlistl)
  <-> 0b1110100 @ 0b01 @ 0b0 @ 0b1 @ 0b1 @ rn @ tlistl[15..14] @ 0b0 @ tlistl[12..0]

// stmdb rn, tlists
union clause instruction = t2STMDB : (bits(4), bits(16))
mapping clause encdec = t2STMDB(rn, tlists)
  <-> 0b1110100 @ 0b10 @ 0b0 @ 0b0 @ 0b0 @ rn @ 0b0 @ tlists[14] @ 0b0 @ tlists[12..0]

// stmdb rn!, tlists
union clause instruction = t2STMDB_UPD : (bits(4), bits(16))
mapping clause encdec = t2STMDB_UPD(rn, tlists)
  <-> 0b1110100 @ 0b10 @ 0b0 @ 0b1 @ 0b0 @ rn @ 0b0 @ tlists[14] @ 0b0 @ tlists[12..0]

// ldmdb rn, tlistl
union clause instruction = t2LDMDB : (bits(4), bits(16))
mapping clause encdec = t2LDMDB(rn, tlistl)
  <-> 0b1110100 @ 0b10 @ 0b0 @ 0b0 @ 0b1 @ rn @ tlistl[15..14] @ 0b0 @ tlistl[12..0]

// ldmdb rn!, tlistl
union clause instruction = t2LDMDB_UPD : (bits(4), bits(16))
mapping clause encdec = t2LDMDB_UPD(rn, tlistl)
  <-> 0b1110100 @ 0b10 @ 0b0 @ 0b1 @ 0b1 @ rn @ tlistl[15..14] @ 0b0 @ tlistl[12..0]

// srsdb SP, #mode
union clause instruction = t2SRSDB : (bits(5))
mapping clause encdec = t2SRSDB(mode)
  <-> 0b1110100 @ 0b00 @ 0b0 @ 0b0 @ 0b0 @ 0b1101 @ 0b11 @ 0b000000000 @ mode

// srsdb SP!, #mode
union clause instruction = t2SRSDB_UPD : (bits(5))
mapping clause encdec = t2SRSDB_UPD(mode)
  <-> 0b1110100 @ 0b00 @ 0b0 @ 0b1 @ 0b0 @ 0b1101 @ 0b11 @ 0b000000000 @ mode

// srsia SP, #mode
union clause instruction = t2SRSIA : (bits(5))
mapping clause encdec = t2SRSIA(mode)
  <-> 0b1110100 @ 0b11 @ 0b0 @ 0b0 @ 0b0 @ 0b1101 @ 0b11 @ 0b000000000 @ mode

// srsia SP!, #mode
union clause instruction = t2SRSIA_UPD : (bits(5))
mapping clause encdec = t2SRSIA_UPD(mode)
  <-> 0b1110100 @ 0b11 @ 0b0 @ 0b1 @ 0b0 @ 0b1101 @ 0b11 @ 0b000000000 @ mode

// rfedb rn
union clause instruction = t2RFEDB : (bits(4))
mapping clause encdec = t2RFEDB(rn)
  <-> 0b1110100 @ 0b00 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1100000000000000

// rfedb rn!
union clause instruction = t2RFEDBW : (bits(4))
mapping clause encdec = t2RFEDBW(rn)
  <-> 0b1110100 @ 0b00 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b1100000000000000

// rfeia rn
union clause instruction = t2RFEIA : (bits(4))
mapping clause encdec = t2RFEIA(rn)
  <-> 0b1110100 @ 0b11 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1100000000000000

// rfeia rn!
union clause instruction = t2RFEIAW : (bits(4))
mapping clause encdec = t2RFEIAW(rn)
  <-> 0b1110100 @ 0b11 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b1100000000000000

// pld [rn, #imm]
union clause instruction = t2PLDi12 : (bits(4), bits(12))
mapping clause encdec = t2PLDi12(rn, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ imm[11..0]

// pld [rn, #-imm]
union clause instruction = t2PLDi8 : (bits(4), bits(8))
mapping clause encdec = t2PLDi8(rn, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ 0b1100 @ imm[7..0]

// pld [rn, rm{?, LSL #lsl2}]
union clause instruction = t2PLDs : (bits(4), bits(2), bits(4))
mapping clause encdec = t2PLDs(rn, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ 0b000000 @ lsl2 @ rm

// pld [PC, #signimm]
union clause instruction = t2PLDpci : (bits(1), bits(12))
mapping clause encdec = t2PLDpci(sign, imm)
  <-> 0b1111100 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ 0b1111 @ 0b1111 @ imm[11..0]

// pldw [rn, #imm]
union clause instruction = t2PLDWi12 : (bits(4), bits(12))
mapping clause encdec = t2PLDWi12(rn, imm)
  <-> 0b1111100 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b1111 @ imm[11..0]

// pldw [rn, #-imm]
union clause instruction = t2PLDWi8 : (bits(4), bits(8))
mapping clause encdec = t2PLDWi8(rn, imm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b1111 @ 0b1100 @ imm[7..0]

// pldw [rn, rm{?, LSL #lsl2}]
union clause instruction = t2PLDWs : (bits(4), bits(2), bits(4))
mapping clause encdec = t2PLDWs(rn, lsl2, rm)
  <-> 0b1111100 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b1111 @ 0b000000 @ lsl2 @ rm

// pli [rn, #imm]
union clause instruction = t2PLIi12 : (bits(4), bits(12))
mapping clause encdec = t2PLIi12(rn, imm)
  <-> 0b1111100 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ imm[11..0]

// pli [rn, #-imm]
union clause instruction = t2PLIi8 : (bits(4), bits(8))
mapping clause encdec = t2PLIi8(rn, imm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ 0b1100 @ imm[7..0]

// pli [rn, rm{?, LSL #lsl2}]
union clause instruction = t2PLIs : (bits(4), bits(2), bits(4))
mapping clause encdec = t2PLIs(rn, lsl2, rm)
  <-> 0b1111100 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b1111 @ 0b000000 @ lsl2 @ rm

// pli [PC, #signimm]
union clause instruction = t2PLIpci : (bits(1), bits(12))
mapping clause encdec = t2PLIpci(sign, imm)
  <-> 0b1111100 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ 0b1111 @ 0b1111 @ imm[11..0]

// cdp cp, #opc1, cd, cn, cm, #opc2
union clause instruction = t2CDP : (bits(4), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2CDP(opc1, cn, cd, cp, opc2, cm)
  <-> 0b1110 @ 0b1110 @ opc1 @ cn @ cd @ cp @ opc2 @ 0b0 @ cm

// mcr cp, #copc1, rt, cn, cm, #opc2
union clause instruction = t2MCR : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2MCR(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1110 @ 0b1110 @ copc1 @ 0b0 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mrc cp, #copc1, rt, cn, cm, #opc2
union clause instruction = t2MRC : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2MRC(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1110 @ 0b1110 @ copc1 @ 0b1 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mcrr cp, #opc4, rt, rt2, cm
union clause instruction = t2MCRR : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MCRR(rt2, rt, cp, opc4, cm)
  <-> 0b1110 @ 0b11000100 @ rt2 @ rt @ cp @ opc4 @ cm

// mrrc cp, #opc4, rt, rt2, cm
union clause instruction = t2MRRC : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MRRC(rt2, rt, cp, opc4, cm)
  <-> 0b1110 @ 0b11000101 @ rt2 @ rt @ cp @ opc4 @ cm

// stc cp, cd, [rn, #signcimm]
union clause instruction = t2STC_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn, #signcimm]!
union clause instruction = t2STC_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn], #signcimm
union clause instruction = t2STC_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC_POST(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn], {coption}
union clause instruction = t2STC_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2STC_OPTION(rn, cd, cp, coption)
  <-> 0b1110 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// stcl cp, cd, [rn, #signcimm]
union clause instruction = t2STCL_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STCL_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn, #signcimm]!
union clause instruction = t2STCL_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STCL_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn], #signcimm
union clause instruction = t2STCL_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STCL_POST(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn], {coption}
union clause instruction = t2STCL_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2STCL_OPTION(rn, cd, cp, coption)
  <-> 0b1110 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// ldc cp, cd, [rn, #signcimm]
union clause instruction = t2LDC_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn, #signcimm]!
union clause instruction = t2LDC_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn], #signcimm
union clause instruction = t2LDC_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC_POST(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn], {coption}
union clause instruction = t2LDC_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2LDC_OPTION(rn, cd, cp, coption)
  <-> 0b1110 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// ldcl cp, cd, [rn, #signcimm]
union clause instruction = t2LDCL_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDCL_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn, #signcimm]!
union clause instruction = t2LDCL_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDCL_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn], #signcimm
union clause instruction = t2LDCL_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDCL_POST(sign, rn, cd, cp, cimm)
  <-> 0b1110 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn], {coption}
union clause instruction = t2LDCL_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2LDCL_OPTION(rn, cd, cp, coption)
  <-> 0b1110 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// cdp2 cp, #opc1, cd, cn, cm, #opc2
union clause instruction = t2CDP2 : (bits(4), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2CDP2(opc1, cn, cd, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ opc1 @ cn @ cd @ cp @ opc2 @ 0b0 @ cm

// mcr2 cp, #copc1, rt, cn, cm, #opc2
union clause instruction = t2MCR2 : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2MCR2(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ copc1 @ 0b0 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mrc2 cp, #copc1, rt, cn, cm, #opc2
union clause instruction = t2MRC2 : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = t2MRC2(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ copc1 @ 0b1 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mcrr2 cp, #opc4, rt, rt2, cm
union clause instruction = t2MCRR2 : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MCRR2(rt2, rt, cp, opc4, cm)
  <-> 0b1111 @ 0b11000100 @ rt2 @ rt @ cp @ opc4 @ cm

// mrrc2 cp, #opc4, rt, rt2, cm
union clause instruction = t2MRRC2 : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = t2MRRC2(rt2, rt, cp, opc4, cm)
  <-> 0b1111 @ 0b11000101 @ rt2 @ rt @ cp @ opc4 @ cm

// stc2 cp, cd, [rn, #signcimm]
union clause instruction = t2STC2_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn, #signcimm]!
union clause instruction = t2STC2_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn], #signcimm
union clause instruction = t2STC2_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn], {coption}
union clause instruction = t2STC2_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2STC2_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// stc2l cp, cd, [rn, #signcimm]
union clause instruction = t2STC2L_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2L_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn, #signcimm]!
union clause instruction = t2STC2L_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2L_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn], #signcimm
union clause instruction = t2STC2L_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2STC2L_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn], {coption}
union clause instruction = t2STC2L_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2STC2L_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// ldc2 cp, cd, [rn, #signcimm]
union clause instruction = t2LDC2_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn, #signcimm]!
union clause instruction = t2LDC2_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn], #signcimm
union clause instruction = t2LDC2_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn], {coption}
union clause instruction = t2LDC2_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2LDC2_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// ldc2l cp, cd, [rn, #signcimm]
union clause instruction = t2LDC2L_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2L_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn, #signcimm]!
union clause instruction = t2LDC2L_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2L_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn], #signcimm
union clause instruction = t2LDC2L_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = t2LDC2L_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn], {coption}
union clause instruction = t2LDC2L_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = t2LDC2L_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

end instruction
