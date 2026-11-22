// A64 (ARMv8.0-A): the integer, load / store, branch and system, and scalar floating-point instructions; encodings and
// assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// encoding diagrams of the Arm Architecture Reference Manual for A-profile architecture (chapter C4 and the instruction
// descriptions of chapters C6 and C7), by hand: nothing in it is taken from Arm's machine-readable specification. Arm's
// Sail model (rems-project/sail-arm) describes decoding differently; this one, like the sheets' other unofficial
// descriptions, is checked bit by bit against LLVM's AArch64 TableGen (clause names are LLVM's instruction names) and by
// assembling every instruction with GNU as and llvm-mc (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses and encdec mappings, no execute clauses, and not checked by
// the Sail compiler. Fields are named by what they hold, as the sheets' operands: wd / xd a W / X register where 31 is
// the zero register, wd_sp / xd_sp where it is the stack pointer, st / dt / qt ... floating-point registers; label,
// page, uoff, simm the offsets in bytes (label[27..2]: the low bits are zero), bimm64 / bimm32 a bitmask immediate
// (N:immr:imms).

scattered union instruction

// adr xd, label
union clause instruction = ADR : (bits(5), bits(21))
mapping clause encdec = ADR(xd, label)
  <-> 0b0 @ label[1..0] @ 0b10000 @ label[20..2] @ xd

// adrp xd, page
union clause instruction = ADRP : (bits(5), bits(33))
mapping clause encdec = ADRP(xd, page)
  <-> 0b1 @ page[13..12] @ 0b10000 @ page[32..14] @ xd

// add wd_sp, wn_sp, #imm{?, sh}
union clause instruction = ADDWri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = ADDWri(sh, wn_sp, wd_sp, imm)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b100010 @ sh @ imm[11..0] @ wn_sp @ wd_sp

// adds wd, wn_sp, #imm{?, sh}
union clause instruction = ADDSWri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = ADDSWri(sh, wn_sp, wd, imm)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b100010 @ sh @ imm[11..0] @ wn_sp @ wd

// sub wd_sp, wn_sp, #imm{?, sh}
union clause instruction = SUBWri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = SUBWri(sh, wn_sp, wd_sp, imm)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b100010 @ sh @ imm[11..0] @ wn_sp @ wd_sp

// subs wd, wn_sp, #imm{?, sh}
union clause instruction = SUBSWri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = SUBSWri(sh, wn_sp, wd, imm)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b100010 @ sh @ imm[11..0] @ wn_sp @ wd

// and wd_sp, wn, #bimm32
union clause instruction = ANDWri : (bits(12), bits(5), bits(5))
mapping clause encdec = ANDWri(bimm32, wn, wd_sp)
  <-> 0b0 @ 0b00 @ 0b100100 @ 0b0 @ bimm32 @ wn @ wd_sp

// orr wd_sp, wn, #bimm32
union clause instruction = ORRWri : (bits(12), bits(5), bits(5))
mapping clause encdec = ORRWri(bimm32, wn, wd_sp)
  <-> 0b0 @ 0b01 @ 0b100100 @ 0b0 @ bimm32 @ wn @ wd_sp

// eor wd_sp, wn, #bimm32
union clause instruction = EORWri : (bits(12), bits(5), bits(5))
mapping clause encdec = EORWri(bimm32, wn, wd_sp)
  <-> 0b0 @ 0b10 @ 0b100100 @ 0b0 @ bimm32 @ wn @ wd_sp

// ands wd, wn, #bimm32
union clause instruction = ANDSWri : (bits(12), bits(5), bits(5))
mapping clause encdec = ANDSWri(bimm32, wn, wd)
  <-> 0b0 @ 0b11 @ 0b100100 @ 0b0 @ bimm32 @ wn @ wd

// movn wd, #imm{?, hw32}
union clause instruction = MOVNWi : (bits(1), bits(5), bits(16))
mapping clause encdec = MOVNWi(hw32, wd, imm)
  <-> 0b0 @ 0b00 @ 0b100101 @ 0b0 @ hw32 @ imm[15..0] @ wd

// movz wd, #imm{?, hw32}
union clause instruction = MOVZWi : (bits(1), bits(5), bits(16))
mapping clause encdec = MOVZWi(hw32, wd, imm)
  <-> 0b0 @ 0b10 @ 0b100101 @ 0b0 @ hw32 @ imm[15..0] @ wd

// movk wd, #imm{?, hw32}
union clause instruction = MOVKWi : (bits(1), bits(5), bits(16))
mapping clause encdec = MOVKWi(hw32, wd, imm)
  <-> 0b0 @ 0b11 @ 0b100101 @ 0b0 @ hw32 @ imm[15..0] @ wd

// sbfm wd, wn, #wimmr, #wimms
union clause instruction = SBFMWri : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = SBFMWri(wimmr, wimms, wn, wd)
  <-> 0b0 @ 0b00 @ 0b100110 @ 0b0 @ 0b0 @ wimmr @ 0b0 @ wimms @ wn @ wd

// bfm wd, wn, #wimmr, #wimms
union clause instruction = BFMWri : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = BFMWri(wimmr, wimms, wn, wd)
  <-> 0b0 @ 0b01 @ 0b100110 @ 0b0 @ 0b0 @ wimmr @ 0b0 @ wimms @ wn @ wd

// ubfm wd, wn, #wimmr, #wimms
union clause instruction = UBFMWri : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = UBFMWri(wimmr, wimms, wn, wd)
  <-> 0b0 @ 0b10 @ 0b100110 @ 0b0 @ 0b0 @ wimmr @ 0b0 @ wimms @ wn @ wd

// extr wd, wn, wm, #wlsb
union clause instruction = EXTRWrri : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = EXTRWrri(wm, wlsb, wn, wd)
  <-> 0b0 @ 0b00 @ 0b100111 @ 0b0 @ 0b0 @ wm @ 0b0 @ wlsb @ wn @ wd

// add xd_sp, xn_sp, #imm{?, sh}
union clause instruction = ADDXri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = ADDXri(sh, xn_sp, xd_sp, imm)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b100010 @ sh @ imm[11..0] @ xn_sp @ xd_sp

// adds xd, xn_sp, #imm{?, sh}
union clause instruction = ADDSXri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = ADDSXri(sh, xn_sp, xd, imm)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b100010 @ sh @ imm[11..0] @ xn_sp @ xd

// sub xd_sp, xn_sp, #imm{?, sh}
union clause instruction = SUBXri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = SUBXri(sh, xn_sp, xd_sp, imm)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b100010 @ sh @ imm[11..0] @ xn_sp @ xd_sp

// subs xd, xn_sp, #imm{?, sh}
union clause instruction = SUBSXri : (bits(1), bits(5), bits(5), bits(12))
mapping clause encdec = SUBSXri(sh, xn_sp, xd, imm)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b100010 @ sh @ imm[11..0] @ xn_sp @ xd

// and xd_sp, xn, #bimm64
union clause instruction = ANDXri : (bits(13), bits(5), bits(5))
mapping clause encdec = ANDXri(bimm64, xn, xd_sp)
  <-> 0b1 @ 0b00 @ 0b100100 @ bimm64 @ xn @ xd_sp

// orr xd_sp, xn, #bimm64
union clause instruction = ORRXri : (bits(13), bits(5), bits(5))
mapping clause encdec = ORRXri(bimm64, xn, xd_sp)
  <-> 0b1 @ 0b01 @ 0b100100 @ bimm64 @ xn @ xd_sp

// eor xd_sp, xn, #bimm64
union clause instruction = EORXri : (bits(13), bits(5), bits(5))
mapping clause encdec = EORXri(bimm64, xn, xd_sp)
  <-> 0b1 @ 0b10 @ 0b100100 @ bimm64 @ xn @ xd_sp

// ands xd, xn, #bimm64
union clause instruction = ANDSXri : (bits(13), bits(5), bits(5))
mapping clause encdec = ANDSXri(bimm64, xn, xd)
  <-> 0b1 @ 0b11 @ 0b100100 @ bimm64 @ xn @ xd

// movn xd, #imm{?, hw}
union clause instruction = MOVNXi : (bits(2), bits(5), bits(16))
mapping clause encdec = MOVNXi(hw, xd, imm)
  <-> 0b1 @ 0b00 @ 0b100101 @ hw @ imm[15..0] @ xd

// movz xd, #imm{?, hw}
union clause instruction = MOVZXi : (bits(2), bits(5), bits(16))
mapping clause encdec = MOVZXi(hw, xd, imm)
  <-> 0b1 @ 0b10 @ 0b100101 @ hw @ imm[15..0] @ xd

// movk xd, #imm{?, hw}
union clause instruction = MOVKXi : (bits(2), bits(5), bits(16))
mapping clause encdec = MOVKXi(hw, xd, imm)
  <-> 0b1 @ 0b11 @ 0b100101 @ hw @ imm[15..0] @ xd

// sbfm xd, xn, #immr, #imms
union clause instruction = SBFMXri : (bits(6), bits(6), bits(5), bits(5))
mapping clause encdec = SBFMXri(immr, imms, xn, xd)
  <-> 0b1 @ 0b00 @ 0b100110 @ 0b1 @ immr @ imms @ xn @ xd

// bfm xd, xn, #immr, #imms
union clause instruction = BFMXri : (bits(6), bits(6), bits(5), bits(5))
mapping clause encdec = BFMXri(immr, imms, xn, xd)
  <-> 0b1 @ 0b01 @ 0b100110 @ 0b1 @ immr @ imms @ xn @ xd

// ubfm xd, xn, #immr, #imms
union clause instruction = UBFMXri : (bits(6), bits(6), bits(5), bits(5))
mapping clause encdec = UBFMXri(immr, imms, xn, xd)
  <-> 0b1 @ 0b10 @ 0b100110 @ 0b1 @ immr @ imms @ xn @ xd

// extr xd, xn, xm, #lsb
union clause instruction = EXTRXrri : (bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = EXTRXrri(xm, lsb, xn, xd)
  <-> 0b1 @ 0b00 @ 0b100111 @ 0b1 @ 0b0 @ xm @ lsb @ xn @ xd

// b label
union clause instruction = B : (bits(28))
mapping clause encdec = B(label)
  <-> 0b0 @ 0b00101 @ label[27..2]

// bl label
union clause instruction = BL : (bits(28))
mapping clause encdec = BL(label)
  <-> 0b1 @ 0b00101 @ label[27..2]

// b.cond label
union clause instruction = Bcc : (bits(4), bits(21))
mapping clause encdec = Bcc(cond, label)
  <-> 0b01010100 @ label[20..2] @ 0b0 @ cond

// cbz wt, label
union clause instruction = CBZW : (bits(5), bits(21))
mapping clause encdec = CBZW(wt, label)
  <-> 0b0 @ 0b011010 @ 0b0 @ label[20..2] @ wt

// cbnz wt, label
union clause instruction = CBNZW : (bits(5), bits(21))
mapping clause encdec = CBNZW(wt, label)
  <-> 0b0 @ 0b011010 @ 0b1 @ label[20..2] @ wt

// tbz wt, #bitw, label
union clause instruction = TBZW : (bits(5), bits(5), bits(16))
mapping clause encdec = TBZW(bitw, wt, label)
  <-> 0b0 @ 0b011011 @ 0b0 @ bitw @ label[15..2] @ wt

// tbnz wt, #bitw, label
union clause instruction = TBNZW : (bits(5), bits(5), bits(16))
mapping clause encdec = TBNZW(bitw, wt, label)
  <-> 0b0 @ 0b011011 @ 0b1 @ bitw @ label[15..2] @ wt

// cbz xt, label
union clause instruction = CBZX : (bits(5), bits(21))
mapping clause encdec = CBZX(xt, label)
  <-> 0b1 @ 0b011010 @ 0b0 @ label[20..2] @ xt

// cbnz xt, label
union clause instruction = CBNZX : (bits(5), bits(21))
mapping clause encdec = CBNZX(xt, label)
  <-> 0b1 @ 0b011010 @ 0b1 @ label[20..2] @ xt

// tbz xt, #bitx, label
union clause instruction = TBZX : (bits(5), bits(5), bits(16))
mapping clause encdec = TBZX(bitx, xt, label)
  <-> 0b1 @ 0b011011 @ 0b0 @ bitx @ label[15..2] @ xt

// tbnz xt, #bitx, label
union clause instruction = TBNZX : (bits(5), bits(5), bits(16))
mapping clause encdec = TBNZX(bitx, xt, label)
  <-> 0b1 @ 0b011011 @ 0b1 @ bitx @ label[15..2] @ xt

// svc #imm
union clause instruction = SVC : (bits(16))
mapping clause encdec = SVC(imm)
  <-> 0b11010100 @ 0b000 @ imm[15..0] @ 0b000 @ 0b01

// hvc #imm
union clause instruction = HVC : (bits(16))
mapping clause encdec = HVC(imm)
  <-> 0b11010100 @ 0b000 @ imm[15..0] @ 0b000 @ 0b10

// smc #imm
union clause instruction = SMC : (bits(16))
mapping clause encdec = SMC(imm)
  <-> 0b11010100 @ 0b000 @ imm[15..0] @ 0b000 @ 0b11

// brk #imm
union clause instruction = BRK : (bits(16))
mapping clause encdec = BRK(imm)
  <-> 0b11010100 @ 0b001 @ imm[15..0] @ 0b000 @ 0b00

// hlt #imm
union clause instruction = HLT : (bits(16))
mapping clause encdec = HLT(imm)
  <-> 0b11010100 @ 0b010 @ imm[15..0] @ 0b000 @ 0b00

// dcps1 #imm
union clause instruction = DCPS1 : (bits(16))
mapping clause encdec = DCPS1(imm)
  <-> 0b11010100 @ 0b101 @ imm[15..0] @ 0b000 @ 0b01

// dcps2 #imm
union clause instruction = DCPS2 : (bits(16))
mapping clause encdec = DCPS2(imm)
  <-> 0b11010100 @ 0b101 @ imm[15..0] @ 0b000 @ 0b10

// dcps3 #imm
union clause instruction = DCPS3 : (bits(16))
mapping clause encdec = DCPS3(imm)
  <-> 0b11010100 @ 0b101 @ imm[15..0] @ 0b000 @ 0b11

// udf #imm
union clause instruction = UDF : (bits(16))
mapping clause encdec = UDF(imm)
  <-> 0b0000000000000000 @ imm[15..0]

// nop
union clause instruction = NOP : unit
mapping clause encdec = NOP()
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0010 @ 0b0000 @ 0b000 @ 0b11111

// hint #imm
union clause instruction = HINT : (bits(7))
mapping clause encdec = HINT(imm)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0010 @ imm[6..0] @ 0b11111

// clrex {?crm}
union clause instruction = CLREX : (bits(4))
mapping clause encdec = CLREX(crm)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0011 @ crm @ 0b010 @ 0b11111

// dsb barrier
union clause instruction = DSB : (bits(4))
mapping clause encdec = DSB(barrier)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0011 @ barrier @ 0b100 @ 0b11111

// dmb barrier
union clause instruction = DMB : (bits(4))
mapping clause encdec = DMB(barrier)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0011 @ barrier @ 0b101 @ 0b11111

// isb {?crm}
union clause instruction = ISB : (bits(4))
mapping clause encdec = ISB(crm)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ 0b011 @ 0b0011 @ crm @ 0b110 @ 0b11111

// msr SPSEL, #imm
union clause instruction = MSRpstateImm4 : (bits(3), bits(3), bits(4))
mapping clause encdec = MSRpstateImm4(op1, op2, imm)
  <-> 0b1101010100 @ 0b0 @ 0b00 @ op1 @ 0b0100 @ imm[3..0] @ op2 @ 0b11111

// sys #op1, cn, cm, #op2, xt
union clause instruction = SYSxt : (bits(3), bits(4), bits(4), bits(3), bits(5))
mapping clause encdec = SYSxt(op1, cn, cm, op2, xt)
  <-> 0b1101010100 @ 0b0 @ 0b01 @ op1 @ cn @ cm @ op2 @ xt

// sysl xt, #op1, cn, cm, #op2
union clause instruction = SYSLxt : (bits(3), bits(4), bits(4), bits(3), bits(5))
mapping clause encdec = SYSLxt(op1, cn, cm, op2, xt)
  <-> 0b1101010100 @ 0b1 @ 0b01 @ op1 @ cn @ cm @ op2 @ xt

// msr sysreg, xt
union clause instruction = MSR : (bits(15), bits(5))
mapping clause encdec = MSR(sysreg, xt)
  <-> 0b1101010100 @ 0b0 @ 0b1 @ sysreg @ xt

// mrs xt, sysreg
union clause instruction = MRS : (bits(15), bits(5))
mapping clause encdec = MRS(sysreg, xt)
  <-> 0b1101010100 @ 0b1 @ 0b1 @ sysreg @ xt

// br xn
union clause instruction = BR : (bits(5))
mapping clause encdec = BR(xn)
  <-> 0b1101011 @ 0b0000 @ 0b11111 @ 0b000000 @ xn @ 0b00000

// blr xn
union clause instruction = BLR : (bits(5))
mapping clause encdec = BLR(xn)
  <-> 0b1101011 @ 0b0001 @ 0b11111 @ 0b000000 @ xn @ 0b00000

// ret {?xr}
union clause instruction = RET : (bits(5))
mapping clause encdec = RET(xr)
  <-> 0b1101011 @ 0b0010 @ 0b11111 @ 0b000000 @ xr @ 0b00000

// eret
union clause instruction = ERET : unit
mapping clause encdec = ERET()
  <-> 0b1101011 @ 0b0100 @ 0b11111 @ 0b000000 @ 0b11111 @ 0b00000

// drps
union clause instruction = DRPS : unit
mapping clause encdec = DRPS()
  <-> 0b1101011 @ 0b0101 @ 0b11111 @ 0b000000 @ 0b11111 @ 0b00000

// stxrb ws, wt, [xn_sp]
union clause instruction = STXRB : (bits(5), bits(5), bits(5))
mapping clause encdec = STXRB(ws, xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b0 @ 0b11111 @ xn_sp @ wt

// stlxrb ws, wt, [xn_sp]
union clause instruction = STLXRB : (bits(5), bits(5), bits(5))
mapping clause encdec = STLXRB(ws, xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldxrb wt, [xn_sp]
union clause instruction = LDXRB : (bits(5), bits(5))
mapping clause encdec = LDXRB(xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b0 @ 0b11111 @ xn_sp @ wt

// ldaxrb wt, [xn_sp]
union clause instruction = LDAXRB : (bits(5), bits(5))
mapping clause encdec = LDAXRB(xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stlrb wt, [xn_sp]
union clause instruction = STLRB : (bits(5), bits(5))
mapping clause encdec = STLRB(xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b1 @ 0b0 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldarb wt, [xn_sp]
union clause instruction = LDARB : (bits(5), bits(5))
mapping clause encdec = LDARB(xn_sp, wt)
  <-> 0b00 @ 0b001000 @ 0b1 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stxrh ws, wt, [xn_sp]
union clause instruction = STXRH : (bits(5), bits(5), bits(5))
mapping clause encdec = STXRH(ws, xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b0 @ 0b11111 @ xn_sp @ wt

// stlxrh ws, wt, [xn_sp]
union clause instruction = STLXRH : (bits(5), bits(5), bits(5))
mapping clause encdec = STLXRH(ws, xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldxrh wt, [xn_sp]
union clause instruction = LDXRH : (bits(5), bits(5))
mapping clause encdec = LDXRH(xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b0 @ 0b11111 @ xn_sp @ wt

// ldaxrh wt, [xn_sp]
union clause instruction = LDAXRH : (bits(5), bits(5))
mapping clause encdec = LDAXRH(xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stlrh wt, [xn_sp]
union clause instruction = STLRH : (bits(5), bits(5))
mapping clause encdec = STLRH(xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b1 @ 0b0 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldarh wt, [xn_sp]
union clause instruction = LDARH : (bits(5), bits(5))
mapping clause encdec = LDARH(xn_sp, wt)
  <-> 0b01 @ 0b001000 @ 0b1 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stxr ws, wt, [xn_sp]
union clause instruction = STXRW : (bits(5), bits(5), bits(5))
mapping clause encdec = STXRW(ws, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b0 @ 0b11111 @ xn_sp @ wt

// stlxr ws, wt, [xn_sp]
union clause instruction = STLXRW : (bits(5), bits(5), bits(5))
mapping clause encdec = STLXRW(ws, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldxr wt, [xn_sp]
union clause instruction = LDXRW : (bits(5), bits(5))
mapping clause encdec = LDXRW(xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b0 @ 0b11111 @ xn_sp @ wt

// ldaxr wt, [xn_sp]
union clause instruction = LDAXRW : (bits(5), bits(5))
mapping clause encdec = LDAXRW(xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stlr wt, [xn_sp]
union clause instruction = STLRW : (bits(5), bits(5))
mapping clause encdec = STLRW(xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b1 @ 0b0 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// ldar wt, [xn_sp]
union clause instruction = LDARW : (bits(5), bits(5))
mapping clause encdec = LDARW(xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b1 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ wt

// stxr ws, xt, [xn_sp]
union clause instruction = STXRX : (bits(5), bits(5), bits(5))
mapping clause encdec = STXRX(ws, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b0 @ 0b11111 @ xn_sp @ xt

// stlxr ws, xt, [xn_sp]
union clause instruction = STLXRX : (bits(5), bits(5), bits(5))
mapping clause encdec = STLXRX(ws, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b0 @ 0b0 @ ws @ 0b1 @ 0b11111 @ xn_sp @ xt

// ldxr xt, [xn_sp]
union clause instruction = LDXRX : (bits(5), bits(5))
mapping clause encdec = LDXRX(xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b0 @ 0b11111 @ xn_sp @ xt

// ldaxr xt, [xn_sp]
union clause instruction = LDAXRX : (bits(5), bits(5))
mapping clause encdec = LDAXRX(xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ xt

// stlr xt, [xn_sp]
union clause instruction = STLRX : (bits(5), bits(5))
mapping clause encdec = STLRX(xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b1 @ 0b0 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ xt

// ldar xt, [xn_sp]
union clause instruction = LDARX : (bits(5), bits(5))
mapping clause encdec = LDARX(xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b1 @ 0b1 @ 0b0 @ 0b11111 @ 0b1 @ 0b11111 @ xn_sp @ xt

// stxp ws, wt, wt2, [xn_sp]
union clause instruction = STXPW : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = STXPW(ws, wt2, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b0 @ 0b1 @ ws @ 0b0 @ wt2 @ xn_sp @ wt

// stlxp ws, wt, wt2, [xn_sp]
union clause instruction = STLXPW : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = STLXPW(ws, wt2, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b0 @ 0b1 @ ws @ 0b1 @ wt2 @ xn_sp @ wt

// ldxp wt, wt2, [xn_sp]
union clause instruction = LDXPW : (bits(5), bits(5), bits(5))
mapping clause encdec = LDXPW(wt2, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b1 @ 0b1 @ 0b11111 @ 0b0 @ wt2 @ xn_sp @ wt

// ldaxp wt, wt2, [xn_sp]
union clause instruction = LDAXPW : (bits(5), bits(5), bits(5))
mapping clause encdec = LDAXPW(wt2, xn_sp, wt)
  <-> 0b10 @ 0b001000 @ 0b0 @ 0b1 @ 0b1 @ 0b11111 @ 0b1 @ wt2 @ xn_sp @ wt

// stxp ws, xt, xt2, [xn_sp]
union clause instruction = STXPX : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = STXPX(ws, xt2, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b0 @ 0b1 @ ws @ 0b0 @ xt2 @ xn_sp @ xt

// stlxp ws, xt, xt2, [xn_sp]
union clause instruction = STLXPX : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = STLXPX(ws, xt2, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b0 @ 0b1 @ ws @ 0b1 @ xt2 @ xn_sp @ xt

// ldxp xt, xt2, [xn_sp]
union clause instruction = LDXPX : (bits(5), bits(5), bits(5))
mapping clause encdec = LDXPX(xt2, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b1 @ 0b1 @ 0b11111 @ 0b0 @ xt2 @ xn_sp @ xt

// ldaxp xt, xt2, [xn_sp]
union clause instruction = LDAXPX : (bits(5), bits(5), bits(5))
mapping clause encdec = LDAXPX(xt2, xn_sp, xt)
  <-> 0b11 @ 0b001000 @ 0b0 @ 0b1 @ 0b1 @ 0b11111 @ 0b1 @ xt2 @ xn_sp @ xt

// ldr wt, label
union clause instruction = LDRWl : (bits(5), bits(21))
mapping clause encdec = LDRWl(wt, label)
  <-> 0b00 @ 0b011 @ 0b0 @ 0b00 @ label[20..2] @ wt

// ldr xt, label
union clause instruction = LDRXl : (bits(5), bits(21))
mapping clause encdec = LDRXl(xt, label)
  <-> 0b01 @ 0b011 @ 0b0 @ 0b00 @ label[20..2] @ xt

// ldrsw xt, label
union clause instruction = LDRSWl : (bits(5), bits(21))
mapping clause encdec = LDRSWl(xt, label)
  <-> 0b10 @ 0b011 @ 0b0 @ 0b00 @ label[20..2] @ xt

// prfm prfop, label
union clause instruction = PRFMl : (bits(5), bits(21))
mapping clause encdec = PRFMl(prfop, label)
  <-> 0b11 @ 0b011 @ 0b0 @ 0b00 @ label[20..2] @ prfop

// ldr st, label
union clause instruction = LDRSl : (bits(5), bits(21))
mapping clause encdec = LDRSl(st, label)
  <-> 0b00 @ 0b011 @ 0b1 @ 0b00 @ label[20..2] @ st

// ldr dt, label
union clause instruction = LDRDl : (bits(5), bits(21))
mapping clause encdec = LDRDl(dt, label)
  <-> 0b01 @ 0b011 @ 0b1 @ 0b00 @ label[20..2] @ dt

// ldr qt, label
union clause instruction = LDRQl : (bits(5), bits(21))
mapping clause encdec = LDRQl(qt, label)
  <-> 0b10 @ 0b011 @ 0b1 @ 0b00 @ label[20..2] @ qt

// stp wt, wt2, [xn_sp, #simm]
union clause instruction = STPWi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPWi(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b010 @ 0b0 @ simm[8..2] @ wt2 @ xn_sp @ wt

// stp wt, wt2, [xn_sp, #simm]!
union clause instruction = STPWpre : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPWpre(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b011 @ 0b0 @ simm[8..2] @ wt2 @ xn_sp @ wt

// stp wt, wt2, [xn_sp], #simm
union clause instruction = STPWpost : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPWpost(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b001 @ 0b0 @ simm[8..2] @ wt2 @ xn_sp @ wt

// stnp wt, wt2, [xn_sp, #simm]
union clause instruction = STNPWi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STNPWi(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b000 @ 0b0 @ simm[8..2] @ wt2 @ xn_sp @ wt

// ldp wt, wt2, [xn_sp, #simm]
union clause instruction = LDPWi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPWi(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b010 @ 0b1 @ simm[8..2] @ wt2 @ xn_sp @ wt

// ldp wt, wt2, [xn_sp, #simm]!
union clause instruction = LDPWpre : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPWpre(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b011 @ 0b1 @ simm[8..2] @ wt2 @ xn_sp @ wt

// ldp wt, wt2, [xn_sp], #simm
union clause instruction = LDPWpost : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPWpost(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b001 @ 0b1 @ simm[8..2] @ wt2 @ xn_sp @ wt

// ldnp wt, wt2, [xn_sp, #simm]
union clause instruction = LDNPWi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDNPWi(wt2, xn_sp, wt, simm)
  <-> 0b00 @ 0b101 @ 0b0 @ 0b000 @ 0b1 @ simm[8..2] @ wt2 @ xn_sp @ wt

// stp xt, xt2, [xn_sp, #simm]
union clause instruction = STPXi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPXi(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b010 @ 0b0 @ simm[9..3] @ xt2 @ xn_sp @ xt

// stp xt, xt2, [xn_sp, #simm]!
union clause instruction = STPXpre : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPXpre(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b011 @ 0b0 @ simm[9..3] @ xt2 @ xn_sp @ xt

// stp xt, xt2, [xn_sp], #simm
union clause instruction = STPXpost : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPXpost(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b001 @ 0b0 @ simm[9..3] @ xt2 @ xn_sp @ xt

// stnp xt, xt2, [xn_sp, #simm]
union clause instruction = STNPXi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STNPXi(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b000 @ 0b0 @ simm[9..3] @ xt2 @ xn_sp @ xt

// ldp xt, xt2, [xn_sp, #simm]
union clause instruction = LDPXi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPXi(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b010 @ 0b1 @ simm[9..3] @ xt2 @ xn_sp @ xt

// ldp xt, xt2, [xn_sp, #simm]!
union clause instruction = LDPXpre : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPXpre(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b011 @ 0b1 @ simm[9..3] @ xt2 @ xn_sp @ xt

// ldp xt, xt2, [xn_sp], #simm
union clause instruction = LDPXpost : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPXpost(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b001 @ 0b1 @ simm[9..3] @ xt2 @ xn_sp @ xt

// ldnp xt, xt2, [xn_sp, #simm]
union clause instruction = LDNPXi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDNPXi(xt2, xn_sp, xt, simm)
  <-> 0b10 @ 0b101 @ 0b0 @ 0b000 @ 0b1 @ simm[9..3] @ xt2 @ xn_sp @ xt

// stp st, st2, [xn_sp, #simm]
union clause instruction = STPSi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPSi(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b010 @ 0b0 @ simm[8..2] @ st2 @ xn_sp @ st

// stp st, st2, [xn_sp, #simm]!
union clause instruction = STPSpre : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPSpre(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b011 @ 0b0 @ simm[8..2] @ st2 @ xn_sp @ st

// stp st, st2, [xn_sp], #simm
union clause instruction = STPSpost : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STPSpost(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b001 @ 0b0 @ simm[8..2] @ st2 @ xn_sp @ st

// stnp st, st2, [xn_sp, #simm]
union clause instruction = STNPSi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = STNPSi(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b000 @ 0b0 @ simm[8..2] @ st2 @ xn_sp @ st

// ldp st, st2, [xn_sp, #simm]
union clause instruction = LDPSi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSi(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b010 @ 0b1 @ simm[8..2] @ st2 @ xn_sp @ st

// ldp st, st2, [xn_sp, #simm]!
union clause instruction = LDPSpre : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSpre(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b011 @ 0b1 @ simm[8..2] @ st2 @ xn_sp @ st

// ldp st, st2, [xn_sp], #simm
union clause instruction = LDPSpost : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSpost(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b001 @ 0b1 @ simm[8..2] @ st2 @ xn_sp @ st

// ldnp st, st2, [xn_sp, #simm]
union clause instruction = LDNPSi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDNPSi(st2, xn_sp, st, simm)
  <-> 0b00 @ 0b101 @ 0b1 @ 0b000 @ 0b1 @ simm[8..2] @ st2 @ xn_sp @ st

// stp dt, dt2, [xn_sp, #simm]
union clause instruction = STPDi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPDi(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b010 @ 0b0 @ simm[9..3] @ dt2 @ xn_sp @ dt

// stp dt, dt2, [xn_sp, #simm]!
union clause instruction = STPDpre : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPDpre(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b011 @ 0b0 @ simm[9..3] @ dt2 @ xn_sp @ dt

// stp dt, dt2, [xn_sp], #simm
union clause instruction = STPDpost : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STPDpost(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b001 @ 0b0 @ simm[9..3] @ dt2 @ xn_sp @ dt

// stnp dt, dt2, [xn_sp, #simm]
union clause instruction = STNPDi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = STNPDi(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b000 @ 0b0 @ simm[9..3] @ dt2 @ xn_sp @ dt

// ldp dt, dt2, [xn_sp, #simm]
union clause instruction = LDPDi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPDi(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b010 @ 0b1 @ simm[9..3] @ dt2 @ xn_sp @ dt

// ldp dt, dt2, [xn_sp, #simm]!
union clause instruction = LDPDpre : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPDpre(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b011 @ 0b1 @ simm[9..3] @ dt2 @ xn_sp @ dt

// ldp dt, dt2, [xn_sp], #simm
union clause instruction = LDPDpost : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDPDpost(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b001 @ 0b1 @ simm[9..3] @ dt2 @ xn_sp @ dt

// ldnp dt, dt2, [xn_sp, #simm]
union clause instruction = LDNPDi : (bits(5), bits(5), bits(5), bits(10))
mapping clause encdec = LDNPDi(dt2, xn_sp, dt, simm)
  <-> 0b01 @ 0b101 @ 0b1 @ 0b000 @ 0b1 @ simm[9..3] @ dt2 @ xn_sp @ dt

// stp qt, qt2, [xn_sp, #simm]
union clause instruction = STPQi : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = STPQi(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b010 @ 0b0 @ simm[10..4] @ qt2 @ xn_sp @ qt

// stp qt, qt2, [xn_sp, #simm]!
union clause instruction = STPQpre : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = STPQpre(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b011 @ 0b0 @ simm[10..4] @ qt2 @ xn_sp @ qt

// stp qt, qt2, [xn_sp], #simm
union clause instruction = STPQpost : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = STPQpost(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b001 @ 0b0 @ simm[10..4] @ qt2 @ xn_sp @ qt

// stnp qt, qt2, [xn_sp, #simm]
union clause instruction = STNPQi : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = STNPQi(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b000 @ 0b0 @ simm[10..4] @ qt2 @ xn_sp @ qt

// ldp qt, qt2, [xn_sp, #simm]
union clause instruction = LDPQi : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = LDPQi(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b010 @ 0b1 @ simm[10..4] @ qt2 @ xn_sp @ qt

// ldp qt, qt2, [xn_sp, #simm]!
union clause instruction = LDPQpre : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = LDPQpre(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b011 @ 0b1 @ simm[10..4] @ qt2 @ xn_sp @ qt

// ldp qt, qt2, [xn_sp], #simm
union clause instruction = LDPQpost : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = LDPQpost(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b001 @ 0b1 @ simm[10..4] @ qt2 @ xn_sp @ qt

// ldnp qt, qt2, [xn_sp, #simm]
union clause instruction = LDNPQi : (bits(5), bits(5), bits(5), bits(11))
mapping clause encdec = LDNPQi(qt2, xn_sp, qt, simm)
  <-> 0b10 @ 0b101 @ 0b1 @ 0b000 @ 0b1 @ simm[10..4] @ qt2 @ xn_sp @ qt

// ldpsw xt, xt2, [xn_sp, #simm]
union clause instruction = LDPSWi : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSWi(xt2, xn_sp, xt, simm)
  <-> 0b01 @ 0b101 @ 0b0 @ 0b010 @ 0b1 @ simm[8..2] @ xt2 @ xn_sp @ xt

// ldpsw xt, xt2, [xn_sp, #simm]!
union clause instruction = LDPSWpre : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSWpre(xt2, xn_sp, xt, simm)
  <-> 0b01 @ 0b101 @ 0b0 @ 0b011 @ 0b1 @ simm[8..2] @ xt2 @ xn_sp @ xt

// ldpsw xt, xt2, [xn_sp], #simm
union clause instruction = LDPSWpost : (bits(5), bits(5), bits(5), bits(9))
mapping clause encdec = LDPSWpost(xt2, xn_sp, xt, simm)
  <-> 0b01 @ 0b101 @ 0b0 @ 0b001 @ 0b1 @ simm[8..2] @ xt2 @ xn_sp @ xt

// strb wt, [xn_sp, #uoff]
union clause instruction = STRBBui : (bits(5), bits(5), bits(12))
mapping clause encdec = STRBBui(xn_sp, wt, uoff)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b01 @ 0b00 @ uoff[11..0] @ xn_sp @ wt

// strb wt, [xn_sp, wm, wext{?ro0}]
union clause instruction = STRBBroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRBBroW(wm, wext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ wt

// strb wt, [xn_sp, xm{?, xextro0}]
union clause instruction = STRBBroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRBBroX(xm, xext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ wt

// sturb wt, [xn_sp, #simm]
union clause instruction = STURBBi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURBBi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// strb wt, [xn_sp, #simm]!
union clause instruction = STRBBpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRBBpre(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// strb wt, [xn_sp], #simm
union clause instruction = STRBBpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRBBpost(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// sttrb wt, [xn_sp, #simm]
union clause instruction = STTRBi : (bits(5), bits(5), bits(9))
mapping clause encdec = STTRBi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldrb wt, [xn_sp, #uoff]
union clause instruction = LDRBBui : (bits(5), bits(5), bits(12))
mapping clause encdec = LDRBBui(xn_sp, wt, uoff)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b01 @ 0b01 @ uoff[11..0] @ xn_sp @ wt

// ldrb wt, [xn_sp, wm, wext{?ro0}]
union clause instruction = LDRBBroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRBBroW(wm, wext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ wt

// ldrb wt, [xn_sp, xm{?, xextro0}]
union clause instruction = LDRBBroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRBBroX(xm, xext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ wt

// ldurb wt, [xn_sp, #simm]
union clause instruction = LDURBBi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURBBi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// ldrb wt, [xn_sp, #simm]!
union clause instruction = LDRBBpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRBBpre(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// ldrb wt, [xn_sp], #simm
union clause instruction = LDRBBpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRBBpost(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// ldtrb wt, [xn_sp, #simm]
union clause instruction = LDTRBi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRBi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldrsb xt, [xn_sp, #uoff]
union clause instruction = LDRSBXui : (bits(5), bits(5), bits(12))
mapping clause encdec = LDRSBXui(xn_sp, xt, uoff)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b01 @ 0b10 @ uoff[11..0] @ xn_sp @ xt

// ldrsb xt, [xn_sp, wm, wext{?ro0}]
union clause instruction = LDRSBXroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSBXroW(wm, wext, ro0, xn_sp, xt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ xt

// ldrsb xt, [xn_sp, xm{?, xextro0}]
union clause instruction = LDRSBXroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSBXroX(xm, xext, ro0, xn_sp, xt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ xt

// ldursb xt, [xn_sp, #simm]
union clause instruction = LDURSBXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSBXi(xn_sp, xt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ xt

// ldrsb xt, [xn_sp, #simm]!
union clause instruction = LDRSBXpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSBXpre(xn_sp, xt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ xt

// ldrsb xt, [xn_sp], #simm
union clause instruction = LDRSBXpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSBXpost(xn_sp, xt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ xt

// ldtrsb xt, [xn_sp, #simm]
union clause instruction = LDTRSBXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRSBXi(xn_sp, xt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ xt

// ldrsb wt, [xn_sp, #uoff]
union clause instruction = LDRSBWui : (bits(5), bits(5), bits(12))
mapping clause encdec = LDRSBWui(xn_sp, wt, uoff)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b01 @ 0b11 @ uoff[11..0] @ xn_sp @ wt

// ldrsb wt, [xn_sp, wm, wext{?ro0}]
union clause instruction = LDRSBWroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSBWroW(wm, wext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ wt

// ldrsb wt, [xn_sp, xm{?, xextro0}]
union clause instruction = LDRSBWroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSBWroX(xm, xext, ro0, xn_sp, wt)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ wt

// ldursb wt, [xn_sp, #simm]
union clause instruction = LDURSBWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSBWi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// ldrsb wt, [xn_sp, #simm]!
union clause instruction = LDRSBWpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSBWpre(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// ldrsb wt, [xn_sp], #simm
union clause instruction = LDRSBWpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSBWpost(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// ldtrsb wt, [xn_sp, #simm]
union clause instruction = LDTRSBWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRSBWi(xn_sp, wt, simm)
  <-> 0b00 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// strh wt, [xn_sp, #uoff]
union clause instruction = STRHHui : (bits(5), bits(5), bits(13))
mapping clause encdec = STRHHui(xn_sp, wt, uoff)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b01 @ 0b00 @ uoff[12..1] @ xn_sp @ wt

// strh wt, [xn_sp, wm, wext{?ro1}]
union clause instruction = STRHHroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRHHroW(wm, wext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ wt

// strh wt, [xn_sp, xm{?, xextro1}]
union clause instruction = STRHHroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRHHroX(xm, xext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ wt

// sturh wt, [xn_sp, #simm]
union clause instruction = STURHHi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURHHi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// strh wt, [xn_sp, #simm]!
union clause instruction = STRHHpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRHHpre(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// strh wt, [xn_sp], #simm
union clause instruction = STRHHpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRHHpost(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// sttrh wt, [xn_sp, #simm]
union clause instruction = STTRHi : (bits(5), bits(5), bits(9))
mapping clause encdec = STTRHi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldrh wt, [xn_sp, #uoff]
union clause instruction = LDRHHui : (bits(5), bits(5), bits(13))
mapping clause encdec = LDRHHui(xn_sp, wt, uoff)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b01 @ 0b01 @ uoff[12..1] @ xn_sp @ wt

// ldrh wt, [xn_sp, wm, wext{?ro1}]
union clause instruction = LDRHHroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRHHroW(wm, wext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ wt

// ldrh wt, [xn_sp, xm{?, xextro1}]
union clause instruction = LDRHHroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRHHroX(xm, xext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ wt

// ldurh wt, [xn_sp, #simm]
union clause instruction = LDURHHi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURHHi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// ldrh wt, [xn_sp, #simm]!
union clause instruction = LDRHHpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRHHpre(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// ldrh wt, [xn_sp], #simm
union clause instruction = LDRHHpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRHHpost(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// ldtrh wt, [xn_sp, #simm]
union clause instruction = LDTRHi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRHi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldrsh xt, [xn_sp, #uoff]
union clause instruction = LDRSHXui : (bits(5), bits(5), bits(13))
mapping clause encdec = LDRSHXui(xn_sp, xt, uoff)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b01 @ 0b10 @ uoff[12..1] @ xn_sp @ xt

// ldrsh xt, [xn_sp, wm, wext{?ro1}]
union clause instruction = LDRSHXroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSHXroW(wm, wext, ro1, xn_sp, xt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ xt

// ldrsh xt, [xn_sp, xm{?, xextro1}]
union clause instruction = LDRSHXroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSHXroX(xm, xext, ro1, xn_sp, xt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ xt

// ldursh xt, [xn_sp, #simm]
union clause instruction = LDURSHXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSHXi(xn_sp, xt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ xt

// ldrsh xt, [xn_sp, #simm]!
union clause instruction = LDRSHXpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSHXpre(xn_sp, xt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ xt

// ldrsh xt, [xn_sp], #simm
union clause instruction = LDRSHXpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSHXpost(xn_sp, xt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ xt

// ldtrsh xt, [xn_sp, #simm]
union clause instruction = LDTRSHXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRSHXi(xn_sp, xt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ xt

// ldrsh wt, [xn_sp, #uoff]
union clause instruction = LDRSHWui : (bits(5), bits(5), bits(13))
mapping clause encdec = LDRSHWui(xn_sp, wt, uoff)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b01 @ 0b11 @ uoff[12..1] @ xn_sp @ wt

// ldrsh wt, [xn_sp, wm, wext{?ro1}]
union clause instruction = LDRSHWroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSHWroW(wm, wext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ wt

// ldrsh wt, [xn_sp, xm{?, xextro1}]
union clause instruction = LDRSHWroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSHWroX(xm, xext, ro1, xn_sp, wt)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ wt

// ldursh wt, [xn_sp, #simm]
union clause instruction = LDURSHWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSHWi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// ldrsh wt, [xn_sp, #simm]!
union clause instruction = LDRSHWpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSHWpre(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// ldrsh wt, [xn_sp], #simm
union clause instruction = LDRSHWpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSHWpost(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// ldtrsh wt, [xn_sp, #simm]
union clause instruction = LDTRSHWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRSHWi(xn_sp, wt, simm)
  <-> 0b01 @ 0b111 @ 0b0 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// str wt, [xn_sp, #uoff]
union clause instruction = STRWui : (bits(5), bits(5), bits(14))
mapping clause encdec = STRWui(xn_sp, wt, uoff)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b01 @ 0b00 @ uoff[13..2] @ xn_sp @ wt

// str wt, [xn_sp, wm, wext{?ro2}]
union clause instruction = STRWroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRWroW(wm, wext, ro2, xn_sp, wt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro2 @ 0b10 @ xn_sp @ wt

// str wt, [xn_sp, xm{?, xextro2}]
union clause instruction = STRWroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRWroX(xm, xext, ro2, xn_sp, wt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro2 @ 0b10 @ xn_sp @ wt

// stur wt, [xn_sp, #simm]
union clause instruction = STURWi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURWi(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// str wt, [xn_sp, #simm]!
union clause instruction = STRWpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRWpre(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// str wt, [xn_sp], #simm
union clause instruction = STRWpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRWpost(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// sttr wt, [xn_sp, #simm]
union clause instruction = STTRWi : (bits(5), bits(5), bits(9))
mapping clause encdec = STTRWi(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldr wt, [xn_sp, #uoff]
union clause instruction = LDRWui : (bits(5), bits(5), bits(14))
mapping clause encdec = LDRWui(xn_sp, wt, uoff)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b01 @ 0b01 @ uoff[13..2] @ xn_sp @ wt

// ldr wt, [xn_sp, wm, wext{?ro2}]
union clause instruction = LDRWroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRWroW(wm, wext, ro2, xn_sp, wt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro2 @ 0b10 @ xn_sp @ wt

// ldr wt, [xn_sp, xm{?, xextro2}]
union clause instruction = LDRWroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRWroX(xm, xext, ro2, xn_sp, wt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro2 @ 0b10 @ xn_sp @ wt

// ldur wt, [xn_sp, #simm]
union clause instruction = LDURWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURWi(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ wt

// ldr wt, [xn_sp, #simm]!
union clause instruction = LDRWpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRWpre(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ wt

// ldr wt, [xn_sp], #simm
union clause instruction = LDRWpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRWpost(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ wt

// ldtr wt, [xn_sp, #simm]
union clause instruction = LDTRWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRWi(xn_sp, wt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ wt

// ldrsw xt, [xn_sp, #uoff]
union clause instruction = LDRSWui : (bits(5), bits(5), bits(14))
mapping clause encdec = LDRSWui(xn_sp, xt, uoff)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b01 @ 0b10 @ uoff[13..2] @ xn_sp @ xt

// ldrsw xt, [xn_sp, wm, wext{?ro2}]
union clause instruction = LDRSWroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSWroW(wm, wext, ro2, xn_sp, xt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ wm @ wext @ 0b10 @ ro2 @ 0b10 @ xn_sp @ xt

// ldrsw xt, [xn_sp, xm{?, xextro2}]
union clause instruction = LDRSWroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSWroX(xm, xext, ro2, xn_sp, xt)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ xm @ xext @ 0b11 @ ro2 @ 0b10 @ xn_sp @ xt

// ldursw xt, [xn_sp, #simm]
union clause instruction = LDURSWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSWi(xn_sp, xt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ xt

// ldrsw xt, [xn_sp, #simm]!
union clause instruction = LDRSWpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSWpre(xn_sp, xt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ xt

// ldrsw xt, [xn_sp], #simm
union clause instruction = LDRSWpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSWpost(xn_sp, xt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ xt

// ldtrsw xt, [xn_sp, #simm]
union clause instruction = LDTRSWi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRSWi(xn_sp, xt, simm)
  <-> 0b10 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ xt

// str xt, [xn_sp, #uoff]
union clause instruction = STRXui : (bits(5), bits(5), bits(15))
mapping clause encdec = STRXui(xn_sp, xt, uoff)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b01 @ 0b00 @ uoff[14..3] @ xn_sp @ xt

// str xt, [xn_sp, wm, wext{?ro3}]
union clause instruction = STRXroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRXroW(wm, wext, ro3, xn_sp, xt)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro3 @ 0b10 @ xn_sp @ xt

// str xt, [xn_sp, xm{?, xextro3}]
union clause instruction = STRXroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRXroX(xm, xext, ro3, xn_sp, xt)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro3 @ 0b10 @ xn_sp @ xt

// stur xt, [xn_sp, #simm]
union clause instruction = STURXi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURXi(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ xt

// str xt, [xn_sp, #simm]!
union clause instruction = STRXpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRXpre(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ xt

// str xt, [xn_sp], #simm
union clause instruction = STRXpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRXpost(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ xt

// sttr xt, [xn_sp, #simm]
union clause instruction = STTRXi : (bits(5), bits(5), bits(9))
mapping clause encdec = STTRXi(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ xt

// ldr xt, [xn_sp, #uoff]
union clause instruction = LDRXui : (bits(5), bits(5), bits(15))
mapping clause encdec = LDRXui(xn_sp, xt, uoff)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b01 @ 0b01 @ uoff[14..3] @ xn_sp @ xt

// ldr xt, [xn_sp, wm, wext{?ro3}]
union clause instruction = LDRXroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRXroW(wm, wext, ro3, xn_sp, xt)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro3 @ 0b10 @ xn_sp @ xt

// ldr xt, [xn_sp, xm{?, xextro3}]
union clause instruction = LDRXroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRXroX(xm, xext, ro3, xn_sp, xt)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro3 @ 0b10 @ xn_sp @ xt

// ldur xt, [xn_sp, #simm]
union clause instruction = LDURXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURXi(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ xt

// ldr xt, [xn_sp, #simm]!
union clause instruction = LDRXpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRXpre(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ xt

// ldr xt, [xn_sp], #simm
union clause instruction = LDRXpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRXpost(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ xt

// ldtr xt, [xn_sp, #simm]
union clause instruction = LDTRXi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDTRXi(xn_sp, xt, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b10 @ xn_sp @ xt

// prfm prfop, [xn_sp, #uoff]
union clause instruction = PRFMui : (bits(5), bits(5), bits(15))
mapping clause encdec = PRFMui(xn_sp, prfop, uoff)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b01 @ 0b10 @ uoff[14..3] @ xn_sp @ prfop

// prfm prfopr, [xn_sp, wm, wext{?ro3}]
union clause instruction = PRFMroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = PRFMroW(wm, wext, ro3, xn_sp, prfopr)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ wm @ wext @ 0b10 @ ro3 @ 0b10 @ xn_sp @ prfopr

// prfm prfopr, [xn_sp, xm{?, xextro3}]
union clause instruction = PRFMroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = PRFMroX(xm, xext, ro3, xn_sp, prfopr)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b1 @ xm @ xext @ 0b11 @ ro3 @ 0b10 @ xn_sp @ prfopr

// prfum prfop, [xn_sp, #simm]
union clause instruction = PRFUMi : (bits(5), bits(5), bits(9))
mapping clause encdec = PRFUMi(xn_sp, prfop, simm)
  <-> 0b11 @ 0b111 @ 0b0 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ prfop

// str bt, [xn_sp, #uoff]
union clause instruction = STRBui : (bits(5), bits(5), bits(12))
mapping clause encdec = STRBui(xn_sp, bt, uoff)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b01 @ 0b00 @ uoff[11..0] @ xn_sp @ bt

// str bt, [xn_sp, wm, wext{?ro0}]
union clause instruction = STRBroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRBroW(wm, wext, ro0, xn_sp, bt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ bt

// str bt, [xn_sp, xm{?, xextro0}]
union clause instruction = STRBroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRBroX(xm, xext, ro0, xn_sp, bt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ bt

// stur bt, [xn_sp, #simm]
union clause instruction = STURBi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURBi(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ bt

// str bt, [xn_sp, #simm]!
union clause instruction = STRBpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRBpre(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ bt

// str bt, [xn_sp], #simm
union clause instruction = STRBpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRBpost(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ bt

// ldr bt, [xn_sp, #uoff]
union clause instruction = LDRBui : (bits(5), bits(5), bits(12))
mapping clause encdec = LDRBui(xn_sp, bt, uoff)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b01 @ 0b01 @ uoff[11..0] @ xn_sp @ bt

// ldr bt, [xn_sp, wm, wext{?ro0}]
union clause instruction = LDRBroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRBroW(wm, wext, ro0, xn_sp, bt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro0 @ 0b10 @ xn_sp @ bt

// ldr bt, [xn_sp, xm{?, xextro0}]
union clause instruction = LDRBroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRBroX(xm, xext, ro0, xn_sp, bt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro0 @ 0b10 @ xn_sp @ bt

// ldur bt, [xn_sp, #simm]
union clause instruction = LDURBi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURBi(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ bt

// ldr bt, [xn_sp, #simm]!
union clause instruction = LDRBpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRBpre(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ bt

// ldr bt, [xn_sp], #simm
union clause instruction = LDRBpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRBpost(xn_sp, bt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ bt

// str ht, [xn_sp, #uoff]
union clause instruction = STRHui : (bits(5), bits(5), bits(13))
mapping clause encdec = STRHui(xn_sp, ht, uoff)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b01 @ 0b00 @ uoff[12..1] @ xn_sp @ ht

// str ht, [xn_sp, wm, wext{?ro1}]
union clause instruction = STRHroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRHroW(wm, wext, ro1, xn_sp, ht)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ ht

// str ht, [xn_sp, xm{?, xextro1}]
union clause instruction = STRHroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRHroX(xm, xext, ro1, xn_sp, ht)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ ht

// stur ht, [xn_sp, #simm]
union clause instruction = STURHi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURHi(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ ht

// str ht, [xn_sp, #simm]!
union clause instruction = STRHpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRHpre(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ ht

// str ht, [xn_sp], #simm
union clause instruction = STRHpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRHpost(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ ht

// ldr ht, [xn_sp, #uoff]
union clause instruction = LDRHui : (bits(5), bits(5), bits(13))
mapping clause encdec = LDRHui(xn_sp, ht, uoff)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b01 @ 0b01 @ uoff[12..1] @ xn_sp @ ht

// ldr ht, [xn_sp, wm, wext{?ro1}]
union clause instruction = LDRHroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRHroW(wm, wext, ro1, xn_sp, ht)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro1 @ 0b10 @ xn_sp @ ht

// ldr ht, [xn_sp, xm{?, xextro1}]
union clause instruction = LDRHroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRHroX(xm, xext, ro1, xn_sp, ht)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro1 @ 0b10 @ xn_sp @ ht

// ldur ht, [xn_sp, #simm]
union clause instruction = LDURHi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURHi(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ ht

// ldr ht, [xn_sp, #simm]!
union clause instruction = LDRHpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRHpre(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ ht

// ldr ht, [xn_sp], #simm
union clause instruction = LDRHpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRHpost(xn_sp, ht, simm)
  <-> 0b01 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ ht

// str st, [xn_sp, #uoff]
union clause instruction = STRSui : (bits(5), bits(5), bits(14))
mapping clause encdec = STRSui(xn_sp, st, uoff)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b01 @ 0b00 @ uoff[13..2] @ xn_sp @ st

// str st, [xn_sp, wm, wext{?ro2}]
union clause instruction = STRSroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRSroW(wm, wext, ro2, xn_sp, st)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro2 @ 0b10 @ xn_sp @ st

// str st, [xn_sp, xm{?, xextro2}]
union clause instruction = STRSroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRSroX(xm, xext, ro2, xn_sp, st)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro2 @ 0b10 @ xn_sp @ st

// stur st, [xn_sp, #simm]
union clause instruction = STURSi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURSi(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ st

// str st, [xn_sp, #simm]!
union clause instruction = STRSpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRSpre(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ st

// str st, [xn_sp], #simm
union clause instruction = STRSpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRSpost(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ st

// ldr st, [xn_sp, #uoff]
union clause instruction = LDRSui : (bits(5), bits(5), bits(14))
mapping clause encdec = LDRSui(xn_sp, st, uoff)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b01 @ 0b01 @ uoff[13..2] @ xn_sp @ st

// ldr st, [xn_sp, wm, wext{?ro2}]
union clause instruction = LDRSroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSroW(wm, wext, ro2, xn_sp, st)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro2 @ 0b10 @ xn_sp @ st

// ldr st, [xn_sp, xm{?, xextro2}]
union clause instruction = LDRSroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRSroX(xm, xext, ro2, xn_sp, st)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro2 @ 0b10 @ xn_sp @ st

// ldur st, [xn_sp, #simm]
union clause instruction = LDURSi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURSi(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ st

// ldr st, [xn_sp, #simm]!
union clause instruction = LDRSpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSpre(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ st

// ldr st, [xn_sp], #simm
union clause instruction = LDRSpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRSpost(xn_sp, st, simm)
  <-> 0b10 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ st

// str dt, [xn_sp, #uoff]
union clause instruction = STRDui : (bits(5), bits(5), bits(15))
mapping clause encdec = STRDui(xn_sp, dt, uoff)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b01 @ 0b00 @ uoff[14..3] @ xn_sp @ dt

// str dt, [xn_sp, wm, wext{?ro3}]
union clause instruction = STRDroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRDroW(wm, wext, ro3, xn_sp, dt)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ wm @ wext @ 0b10 @ ro3 @ 0b10 @ xn_sp @ dt

// str dt, [xn_sp, xm{?, xextro3}]
union clause instruction = STRDroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRDroX(xm, xext, ro3, xn_sp, dt)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b1 @ xm @ xext @ 0b11 @ ro3 @ 0b10 @ xn_sp @ dt

// stur dt, [xn_sp, #simm]
union clause instruction = STURDi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURDi(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ dt

// str dt, [xn_sp, #simm]!
union clause instruction = STRDpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRDpre(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ dt

// str dt, [xn_sp], #simm
union clause instruction = STRDpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRDpost(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b00 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ dt

// ldr dt, [xn_sp, #uoff]
union clause instruction = LDRDui : (bits(5), bits(5), bits(15))
mapping clause encdec = LDRDui(xn_sp, dt, uoff)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b01 @ 0b01 @ uoff[14..3] @ xn_sp @ dt

// ldr dt, [xn_sp, wm, wext{?ro3}]
union clause instruction = LDRDroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRDroW(wm, wext, ro3, xn_sp, dt)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ wm @ wext @ 0b10 @ ro3 @ 0b10 @ xn_sp @ dt

// ldr dt, [xn_sp, xm{?, xextro3}]
union clause instruction = LDRDroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRDroX(xm, xext, ro3, xn_sp, dt)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b1 @ xm @ xext @ 0b11 @ ro3 @ 0b10 @ xn_sp @ dt

// ldur dt, [xn_sp, #simm]
union clause instruction = LDURDi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURDi(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ dt

// ldr dt, [xn_sp, #simm]!
union clause instruction = LDRDpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRDpre(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ dt

// ldr dt, [xn_sp], #simm
union clause instruction = LDRDpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRDpost(xn_sp, dt, simm)
  <-> 0b11 @ 0b111 @ 0b1 @ 0b00 @ 0b01 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ dt

// str qt, [xn_sp, #uoff]
union clause instruction = STRQui : (bits(5), bits(5), bits(16))
mapping clause encdec = STRQui(xn_sp, qt, uoff)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b01 @ 0b10 @ uoff[15..4] @ xn_sp @ qt

// str qt, [xn_sp, wm, wext{?ro4}]
union clause instruction = STRQroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRQroW(wm, wext, ro4, xn_sp, qt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b10 @ 0b1 @ wm @ wext @ 0b10 @ ro4 @ 0b10 @ xn_sp @ qt

// str qt, [xn_sp, xm{?, xextro4}]
union clause instruction = STRQroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = STRQroX(xm, xext, ro4, xn_sp, qt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b10 @ 0b1 @ xm @ xext @ 0b11 @ ro4 @ 0b10 @ xn_sp @ qt

// stur qt, [xn_sp, #simm]
union clause instruction = STURQi : (bits(5), bits(5), bits(9))
mapping clause encdec = STURQi(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ qt

// str qt, [xn_sp, #simm]!
union clause instruction = STRQpre : (bits(5), bits(5), bits(9))
mapping clause encdec = STRQpre(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ qt

// str qt, [xn_sp], #simm
union clause instruction = STRQpost : (bits(5), bits(5), bits(9))
mapping clause encdec = STRQpost(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b10 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ qt

// ldr qt, [xn_sp, #uoff]
union clause instruction = LDRQui : (bits(5), bits(5), bits(16))
mapping clause encdec = LDRQui(xn_sp, qt, uoff)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b01 @ 0b11 @ uoff[15..4] @ xn_sp @ qt

// ldr qt, [xn_sp, wm, wext{?ro4}]
union clause instruction = LDRQroW : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRQroW(wm, wext, ro4, xn_sp, qt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b11 @ 0b1 @ wm @ wext @ 0b10 @ ro4 @ 0b10 @ xn_sp @ qt

// ldr qt, [xn_sp, xm{?, xextro4}]
union clause instruction = LDRQroX : (bits(5), bits(1), bits(1), bits(5), bits(5))
mapping clause encdec = LDRQroX(xm, xext, ro4, xn_sp, qt)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b11 @ 0b1 @ xm @ xext @ 0b11 @ ro4 @ 0b10 @ xn_sp @ qt

// ldur qt, [xn_sp, #simm]
union clause instruction = LDURQi : (bits(5), bits(5), bits(9))
mapping clause encdec = LDURQi(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b00 @ xn_sp @ qt

// ldr qt, [xn_sp, #simm]!
union clause instruction = LDRQpre : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRQpre(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b11 @ xn_sp @ qt

// ldr qt, [xn_sp], #simm
union clause instruction = LDRQpost : (bits(5), bits(5), bits(9))
mapping clause encdec = LDRQpost(xn_sp, qt, simm)
  <-> 0b00 @ 0b111 @ 0b1 @ 0b00 @ 0b11 @ 0b0 @ simm[8..0] @ 0b01 @ xn_sp @ qt

// and wd, wn, wm{?, shift #wamount}
union clause instruction = ANDWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ANDWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b00 @ 0b01010 @ shift @ 0b0 @ wm @ wamount @ wn @ wd

// bic wd, wn, wm{?, shift #wamount}
union clause instruction = BICWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = BICWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b00 @ 0b01010 @ shift @ 0b1 @ wm @ wamount @ wn @ wd

// orr wd, wn, wm{?, shift #wamount}
union clause instruction = ORRWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ORRWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b01 @ 0b01010 @ shift @ 0b0 @ wm @ wamount @ wn @ wd

// orn wd, wn, wm{?, shift #wamount}
union clause instruction = ORNWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ORNWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b01 @ 0b01010 @ shift @ 0b1 @ wm @ wamount @ wn @ wd

// eor wd, wn, wm{?, shift #wamount}
union clause instruction = EORWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = EORWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b10 @ 0b01010 @ shift @ 0b0 @ wm @ wamount @ wn @ wd

// eon wd, wn, wm{?, shift #wamount}
union clause instruction = EONWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = EONWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b10 @ 0b01010 @ shift @ 0b1 @ wm @ wamount @ wn @ wd

// ands wd, wn, wm{?, shift #wamount}
union clause instruction = ANDSWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ANDSWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b11 @ 0b01010 @ shift @ 0b0 @ wm @ wamount @ wn @ wd

// bics wd, wn, wm{?, shift #wamount}
union clause instruction = BICSWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = BICSWrs(shift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b11 @ 0b01010 @ shift @ 0b1 @ wm @ wamount @ wn @ wd

// add wd, wn, wm{?, ashift #wamount}
union clause instruction = ADDWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ADDWrs(ashift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b01011 @ ashift @ 0b0 @ wm @ wamount @ wn @ wd

// add wd_sp, wn_sp, wm, ext #eamt
union clause instruction = ADDWrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = ADDWrx(wm, ext, eamt, wn_sp, wd_sp)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext @ eamt @ wn_sp @ wd_sp

// adds wd, wn, wm{?, ashift #wamount}
union clause instruction = ADDSWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ADDSWrs(ashift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b01011 @ ashift @ 0b0 @ wm @ wamount @ wn @ wd

// adds wd, wn_sp, wm, ext #eamt
union clause instruction = ADDSWrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = ADDSWrx(wm, ext, eamt, wn_sp, wd)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext @ eamt @ wn_sp @ wd

// sub wd, wn, wm{?, ashift #wamount}
union clause instruction = SUBWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = SUBWrs(ashift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b01011 @ ashift @ 0b0 @ wm @ wamount @ wn @ wd

// sub wd_sp, wn_sp, wm, ext #eamt
union clause instruction = SUBWrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = SUBWrx(wm, ext, eamt, wn_sp, wd_sp)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext @ eamt @ wn_sp @ wd_sp

// subs wd, wn, wm{?, ashift #wamount}
union clause instruction = SUBSWrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = SUBSWrs(ashift, wm, wamount, wn, wd)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b01011 @ ashift @ 0b0 @ wm @ wamount @ wn @ wd

// subs wd, wn_sp, wm, ext #eamt
union clause instruction = SUBSWrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = SUBSWrx(wm, ext, eamt, wn_sp, wd)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext @ eamt @ wn_sp @ wd

// adc wd, wn, wm
union clause instruction = ADCWr : (bits(5), bits(5), bits(5))
mapping clause encdec = ADCWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010000 @ wm @ 0b000000 @ wn @ wd

// adcs wd, wn, wm
union clause instruction = ADCSWr : (bits(5), bits(5), bits(5))
mapping clause encdec = ADCSWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b11010000 @ wm @ 0b000000 @ wn @ wd

// sbc wd, wn, wm
union clause instruction = SBCWr : (bits(5), bits(5), bits(5))
mapping clause encdec = SBCWr(wm, wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010000 @ wm @ 0b000000 @ wn @ wd

// sbcs wd, wn, wm
union clause instruction = SBCSWr : (bits(5), bits(5), bits(5))
mapping clause encdec = SBCSWr(wm, wn, wd)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b11010000 @ wm @ 0b000000 @ wn @ wd

// ccmn wn, wm, #nzcv, cond
union clause instruction = CCMNWr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = CCMNWr(wm, cond, wn, nzcv)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b11010010 @ wm @ cond @ 0b0 @ 0b0 @ wn @ 0b0 @ nzcv

// ccmn wn, #imm, #nzcv, cond
union clause instruction = CCMNWi : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = CCMNWi(cond, wn, nzcv, imm)
  <-> 0b0 @ 0b0 @ 0b1 @ 0b11010010 @ imm[4..0] @ cond @ 0b1 @ 0b0 @ wn @ 0b0 @ nzcv

// ccmp wn, wm, #nzcv, cond
union clause instruction = CCMPWr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = CCMPWr(wm, cond, wn, nzcv)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b11010010 @ wm @ cond @ 0b0 @ 0b0 @ wn @ 0b0 @ nzcv

// ccmp wn, #imm, #nzcv, cond
union clause instruction = CCMPWi : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = CCMPWi(cond, wn, nzcv, imm)
  <-> 0b0 @ 0b1 @ 0b1 @ 0b11010010 @ imm[4..0] @ cond @ 0b1 @ 0b0 @ wn @ 0b0 @ nzcv

// csel wd, wn, wm, cond
union clause instruction = CSELWr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSELWr(wm, cond, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010100 @ wm @ cond @ 0b0 @ 0b0 @ wn @ wd

// csinc wd, wn, wm, cond
union clause instruction = CSINCWr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSINCWr(wm, cond, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010100 @ wm @ cond @ 0b0 @ 0b1 @ wn @ wd

// csinv wd, wn, wm, cond
union clause instruction = CSINVWr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSINVWr(wm, cond, wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010100 @ wm @ cond @ 0b0 @ 0b0 @ wn @ wd

// csneg wd, wn, wm, cond
union clause instruction = CSNEGWr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSNEGWr(wm, cond, wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010100 @ wm @ cond @ 0b0 @ 0b1 @ wn @ wd

// madd wd, wn, wm, wa
union clause instruction = MADDWrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = MADDWrrr(wm, wa, wn, wd)
  <-> 0b0 @ 0b00 @ 0b11011 @ 0b000 @ wm @ 0b0 @ wa @ wn @ wd

// msub wd, wn, wm, wa
union clause instruction = MSUBWrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = MSUBWrrr(wm, wa, wn, wd)
  <-> 0b0 @ 0b00 @ 0b11011 @ 0b000 @ wm @ 0b1 @ wa @ wn @ wd

// udiv wd, wn, wm
union clause instruction = UDIVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = UDIVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b000010 @ wn @ wd

// sdiv wd, wn, wm
union clause instruction = SDIVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = SDIVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b000011 @ wn @ wd

// lslv wd, wn, wm
union clause instruction = LSLVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = LSLVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b001000 @ wn @ wd

// lsrv wd, wn, wm
union clause instruction = LSRVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = LSRVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b001001 @ wn @ wd

// asrv wd, wn, wm
union clause instruction = ASRVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = ASRVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b001010 @ wn @ wd

// rorv wd, wn, wm
union clause instruction = RORVWr : (bits(5), bits(5), bits(5))
mapping clause encdec = RORVWr(wm, wn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11010110 @ wm @ 0b001011 @ wn @ wd

// rbit wd, wn
union clause instruction = RBITWr : (bits(5), bits(5))
mapping clause encdec = RBITWr(wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000000 @ wn @ wd

// rev16 wd, wn
union clause instruction = REV16Wr : (bits(5), bits(5))
mapping clause encdec = REV16Wr(wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000001 @ wn @ wd

// rev wd, wn
union clause instruction = REVWr : (bits(5), bits(5))
mapping clause encdec = REVWr(wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000010 @ wn @ wd

// clz wd, wn
union clause instruction = CLZWr : (bits(5), bits(5))
mapping clause encdec = CLZWr(wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000100 @ wn @ wd

// cls wd, wn
union clause instruction = CLSWr : (bits(5), bits(5))
mapping clause encdec = CLSWr(wn, wd)
  <-> 0b0 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000101 @ wn @ wd

// and xd, xn, xm{?, shift #amount}
union clause instruction = ANDXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ANDXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b00 @ 0b01010 @ shift @ 0b0 @ xm @ amount @ xn @ xd

// bic xd, xn, xm{?, shift #amount}
union clause instruction = BICXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = BICXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b00 @ 0b01010 @ shift @ 0b1 @ xm @ amount @ xn @ xd

// orr xd, xn, xm{?, shift #amount}
union clause instruction = ORRXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ORRXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b01 @ 0b01010 @ shift @ 0b0 @ xm @ amount @ xn @ xd

// orn xd, xn, xm{?, shift #amount}
union clause instruction = ORNXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ORNXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b01 @ 0b01010 @ shift @ 0b1 @ xm @ amount @ xn @ xd

// eor xd, xn, xm{?, shift #amount}
union clause instruction = EORXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = EORXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b10 @ 0b01010 @ shift @ 0b0 @ xm @ amount @ xn @ xd

// eon xd, xn, xm{?, shift #amount}
union clause instruction = EONXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = EONXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b10 @ 0b01010 @ shift @ 0b1 @ xm @ amount @ xn @ xd

// ands xd, xn, xm{?, shift #amount}
union clause instruction = ANDSXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ANDSXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b11 @ 0b01010 @ shift @ 0b0 @ xm @ amount @ xn @ xd

// bics xd, xn, xm{?, shift #amount}
union clause instruction = BICSXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = BICSXrs(shift, xm, amount, xn, xd)
  <-> 0b1 @ 0b11 @ 0b01010 @ shift @ 0b1 @ xm @ amount @ xn @ xd

// add xd, xn, xm{?, ashift #amount}
union clause instruction = ADDXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ADDXrs(ashift, xm, amount, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b01011 @ ashift @ 0b0 @ xm @ amount @ xn @ xd

// add xd_sp, xn_sp, wm, ext64 #eamt
union clause instruction = ADDXrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = ADDXrx(wm, ext64, eamt, xn_sp, xd_sp)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext64 @ eamt @ xn_sp @ xd_sp

// add xd_sp, xn_sp, xm, xext1 #eamt
union clause instruction = ADDXrx64 : (bits(5), bits(1), bits(3), bits(5), bits(5))
mapping clause encdec = ADDXrx64(xm, xext1, eamt, xn_sp, xd_sp)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ xm @ xext1 @ 0b11 @ eamt @ xn_sp @ xd_sp

// adds xd, xn, xm{?, ashift #amount}
union clause instruction = ADDSXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = ADDSXrs(ashift, xm, amount, xn, xd)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b01011 @ ashift @ 0b0 @ xm @ amount @ xn @ xd

// adds xd, xn_sp, wm, ext64 #eamt
union clause instruction = ADDSXrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = ADDSXrx(wm, ext64, eamt, xn_sp, xd)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext64 @ eamt @ xn_sp @ xd

// adds xd, xn_sp, xm, xext1 #eamt
union clause instruction = ADDSXrx64 : (bits(5), bits(1), bits(3), bits(5), bits(5))
mapping clause encdec = ADDSXrx64(xm, xext1, eamt, xn_sp, xd)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ xm @ xext1 @ 0b11 @ eamt @ xn_sp @ xd

// sub xd, xn, xm{?, ashift #amount}
union clause instruction = SUBXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = SUBXrs(ashift, xm, amount, xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b01011 @ ashift @ 0b0 @ xm @ amount @ xn @ xd

// sub xd_sp, xn_sp, wm, ext64 #eamt
union clause instruction = SUBXrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = SUBXrx(wm, ext64, eamt, xn_sp, xd_sp)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext64 @ eamt @ xn_sp @ xd_sp

// sub xd_sp, xn_sp, xm, xext1 #eamt
union clause instruction = SUBXrx64 : (bits(5), bits(1), bits(3), bits(5), bits(5))
mapping clause encdec = SUBXrx64(xm, xext1, eamt, xn_sp, xd_sp)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b01011 @ 0b00 @ 0b1 @ xm @ xext1 @ 0b11 @ eamt @ xn_sp @ xd_sp

// subs xd, xn, xm{?, ashift #amount}
union clause instruction = SUBSXrs : (bits(2), bits(5), bits(6), bits(5), bits(5))
mapping clause encdec = SUBSXrs(ashift, xm, amount, xn, xd)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b01011 @ ashift @ 0b0 @ xm @ amount @ xn @ xd

// subs xd, xn_sp, wm, ext64 #eamt
union clause instruction = SUBSXrx : (bits(5), bits(3), bits(3), bits(5), bits(5))
mapping clause encdec = SUBSXrx(wm, ext64, eamt, xn_sp, xd)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ wm @ ext64 @ eamt @ xn_sp @ xd

// subs xd, xn_sp, xm, xext1 #eamt
union clause instruction = SUBSXrx64 : (bits(5), bits(1), bits(3), bits(5), bits(5))
mapping clause encdec = SUBSXrx64(xm, xext1, eamt, xn_sp, xd)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b01011 @ 0b00 @ 0b1 @ xm @ xext1 @ 0b11 @ eamt @ xn_sp @ xd

// adc xd, xn, xm
union clause instruction = ADCXr : (bits(5), bits(5), bits(5))
mapping clause encdec = ADCXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010000 @ xm @ 0b000000 @ xn @ xd

// adcs xd, xn, xm
union clause instruction = ADCSXr : (bits(5), bits(5), bits(5))
mapping clause encdec = ADCSXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b11010000 @ xm @ 0b000000 @ xn @ xd

// sbc xd, xn, xm
union clause instruction = SBCXr : (bits(5), bits(5), bits(5))
mapping clause encdec = SBCXr(xm, xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010000 @ xm @ 0b000000 @ xn @ xd

// sbcs xd, xn, xm
union clause instruction = SBCSXr : (bits(5), bits(5), bits(5))
mapping clause encdec = SBCSXr(xm, xn, xd)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b11010000 @ xm @ 0b000000 @ xn @ xd

// ccmn xn, xm, #nzcv, cond
union clause instruction = CCMNXr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = CCMNXr(xm, cond, xn, nzcv)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b11010010 @ xm @ cond @ 0b0 @ 0b0 @ xn @ 0b0 @ nzcv

// ccmn xn, #imm, #nzcv, cond
union clause instruction = CCMNXi : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = CCMNXi(cond, xn, nzcv, imm)
  <-> 0b1 @ 0b0 @ 0b1 @ 0b11010010 @ imm[4..0] @ cond @ 0b1 @ 0b0 @ xn @ 0b0 @ nzcv

// ccmp xn, xm, #nzcv, cond
union clause instruction = CCMPXr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = CCMPXr(xm, cond, xn, nzcv)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b11010010 @ xm @ cond @ 0b0 @ 0b0 @ xn @ 0b0 @ nzcv

// ccmp xn, #imm, #nzcv, cond
union clause instruction = CCMPXi : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = CCMPXi(cond, xn, nzcv, imm)
  <-> 0b1 @ 0b1 @ 0b1 @ 0b11010010 @ imm[4..0] @ cond @ 0b1 @ 0b0 @ xn @ 0b0 @ nzcv

// csel xd, xn, xm, cond
union clause instruction = CSELXr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSELXr(xm, cond, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010100 @ xm @ cond @ 0b0 @ 0b0 @ xn @ xd

// csinc xd, xn, xm, cond
union clause instruction = CSINCXr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSINCXr(xm, cond, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010100 @ xm @ cond @ 0b0 @ 0b1 @ xn @ xd

// csinv xd, xn, xm, cond
union clause instruction = CSINVXr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSINVXr(xm, cond, xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010100 @ xm @ cond @ 0b0 @ 0b0 @ xn @ xd

// csneg xd, xn, xm, cond
union clause instruction = CSNEGXr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = CSNEGXr(xm, cond, xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010100 @ xm @ cond @ 0b0 @ 0b1 @ xn @ xd

// madd xd, xn, xm, xa
union clause instruction = MADDXrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = MADDXrrr(xm, xa, xn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b000 @ xm @ 0b0 @ xa @ xn @ xd

// msub xd, xn, xm, xa
union clause instruction = MSUBXrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = MSUBXrrr(xm, xa, xn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b000 @ xm @ 0b1 @ xa @ xn @ xd

// udiv xd, xn, xm
union clause instruction = UDIVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = UDIVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b000010 @ xn @ xd

// sdiv xd, xn, xm
union clause instruction = SDIVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = SDIVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b000011 @ xn @ xd

// lslv xd, xn, xm
union clause instruction = LSLVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = LSLVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b001000 @ xn @ xd

// lsrv xd, xn, xm
union clause instruction = LSRVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = LSRVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b001001 @ xn @ xd

// asrv xd, xn, xm
union clause instruction = ASRVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = ASRVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b001010 @ xn @ xd

// rorv xd, xn, xm
union clause instruction = RORVXr : (bits(5), bits(5), bits(5))
mapping clause encdec = RORVXr(xm, xn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11010110 @ xm @ 0b001011 @ xn @ xd

// rbit xd, xn
union clause instruction = RBITXr : (bits(5), bits(5))
mapping clause encdec = RBITXr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000000 @ xn @ xd

// rev16 xd, xn
union clause instruction = REV16Xr : (bits(5), bits(5))
mapping clause encdec = REV16Xr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000001 @ xn @ xd

// rev xd, xn
union clause instruction = REVXr : (bits(5), bits(5))
mapping clause encdec = REVXr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000011 @ xn @ xd

// clz xd, xn
union clause instruction = CLZXr : (bits(5), bits(5))
mapping clause encdec = CLZXr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000100 @ xn @ xd

// cls xd, xn
union clause instruction = CLSXr : (bits(5), bits(5))
mapping clause encdec = CLSXr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000101 @ xn @ xd

// rev32 xd, xn
union clause instruction = REV32Xr : (bits(5), bits(5))
mapping clause encdec = REV32Xr(xn, xd)
  <-> 0b1 @ 0b1 @ 0b0 @ 0b11010110 @ 0b00000 @ 0b000010 @ xn @ xd

// smaddl xd, wn, wm, xa
union clause instruction = SMADDLrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = SMADDLrrr(wm, xa, wn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b001 @ wm @ 0b0 @ xa @ wn @ xd

// smsubl xd, wn, wm, xa
union clause instruction = SMSUBLrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = SMSUBLrrr(wm, xa, wn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b001 @ wm @ 0b1 @ xa @ wn @ xd

// umaddl xd, wn, wm, xa
union clause instruction = UMADDLrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = UMADDLrrr(wm, xa, wn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b101 @ wm @ 0b0 @ xa @ wn @ xd

// umsubl xd, wn, wm, xa
union clause instruction = UMSUBLrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = UMSUBLrrr(wm, xa, wn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b101 @ wm @ 0b1 @ xa @ wn @ xd

// smulh xd, xn, xm
union clause instruction = SMULHrr : (bits(5), bits(5), bits(5))
mapping clause encdec = SMULHrr(xm, xn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b010 @ xm @ 0b0 @ 0b11111 @ xn @ xd

// umulh xd, xn, xm
union clause instruction = UMULHrr : (bits(5), bits(5), bits(5))
mapping clause encdec = UMULHrr(xm, xn, xd)
  <-> 0b1 @ 0b00 @ 0b11011 @ 0b110 @ xm @ 0b0 @ 0b11111 @ xn @ xd

// fmov sd, sn
union clause instruction = FMOVSr : (bits(5), bits(5))
mapping clause encdec = FMOVSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b000000 @ 0b10000 @ sn @ sd

// fabs sd, sn
union clause instruction = FABSSr : (bits(5), bits(5))
mapping clause encdec = FABSSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b000001 @ 0b10000 @ sn @ sd

// fneg sd, sn
union clause instruction = FNEGSr : (bits(5), bits(5))
mapping clause encdec = FNEGSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b000010 @ 0b10000 @ sn @ sd

// fsqrt sd, sn
union clause instruction = FSQRTSr : (bits(5), bits(5))
mapping clause encdec = FSQRTSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b000011 @ 0b10000 @ sn @ sd

// frintn sd, sn
union clause instruction = FRINTNSr : (bits(5), bits(5))
mapping clause encdec = FRINTNSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001000 @ 0b10000 @ sn @ sd

// frintp sd, sn
union clause instruction = FRINTPSr : (bits(5), bits(5))
mapping clause encdec = FRINTPSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001001 @ 0b10000 @ sn @ sd

// frintm sd, sn
union clause instruction = FRINTMSr : (bits(5), bits(5))
mapping clause encdec = FRINTMSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001010 @ 0b10000 @ sn @ sd

// frintz sd, sn
union clause instruction = FRINTZSr : (bits(5), bits(5))
mapping clause encdec = FRINTZSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001011 @ 0b10000 @ sn @ sd

// frinta sd, sn
union clause instruction = FRINTASr : (bits(5), bits(5))
mapping clause encdec = FRINTASr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001100 @ 0b10000 @ sn @ sd

// frintx sd, sn
union clause instruction = FRINTXSr : (bits(5), bits(5))
mapping clause encdec = FRINTXSr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001110 @ 0b10000 @ sn @ sd

// frinti sd, sn
union clause instruction = FRINTISr : (bits(5), bits(5))
mapping clause encdec = FRINTISr(sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b001111 @ 0b10000 @ sn @ sd

// fmul sd, sn, sm
union clause instruction = FMULSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMULSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0000 @ 0b10 @ sn @ sd

// fdiv sd, sn, sm
union clause instruction = FDIVSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FDIVSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0001 @ 0b10 @ sn @ sd

// fadd sd, sn, sm
union clause instruction = FADDSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FADDSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0010 @ 0b10 @ sn @ sd

// fsub sd, sn, sm
union clause instruction = FSUBSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FSUBSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0011 @ 0b10 @ sn @ sd

// fmax sd, sn, sm
union clause instruction = FMAXSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMAXSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0100 @ 0b10 @ sn @ sd

// fmin sd, sn, sm
union clause instruction = FMINSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMINSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0101 @ 0b10 @ sn @ sd

// fmaxnm sd, sn, sm
union clause instruction = FMAXNMSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMAXNMSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0110 @ 0b10 @ sn @ sd

// fminnm sd, sn, sm
union clause instruction = FMINNMSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMINNMSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b0111 @ 0b10 @ sn @ sd

// fnmul sd, sn, sm
union clause instruction = FNMULSrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FNMULSrr(sm, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b1000 @ 0b10 @ sn @ sd

// fmadd sd, sn, sm, sa
union clause instruction = FMADDSrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FMADDSrrr(sm, sa, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b00 @ 0b0 @ sm @ 0b0 @ sa @ sn @ sd

// fmsub sd, sn, sm, sa
union clause instruction = FMSUBSrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FMSUBSrrr(sm, sa, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b00 @ 0b0 @ sm @ 0b1 @ sa @ sn @ sd

// fnmadd sd, sn, sm, sa
union clause instruction = FNMADDSrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FNMADDSrrr(sm, sa, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b00 @ 0b1 @ sm @ 0b0 @ sa @ sn @ sd

// fnmsub sd, sn, sm, sa
union clause instruction = FNMSUBSrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FNMSUBSrrr(sm, sa, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b00 @ 0b1 @ sm @ 0b1 @ sa @ sn @ sd

// fcmp sn, sm
union clause instruction = FCMPSrr : (bits(5), bits(5))
mapping clause encdec = FCMPSrr(sm, sn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b00 @ 0b1000 @ sn @ 0b00 @ 0b000

// fcmp sn, #0.0
union clause instruction = FCMPSri : (bits(5))
mapping clause encdec = FCMPSri(sn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00000 @ 0b00 @ 0b1000 @ sn @ 0b01 @ 0b000

// fcmpe sn, sm
union clause instruction = FCMPESrr : (bits(5), bits(5))
mapping clause encdec = FCMPESrr(sm, sn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ 0b00 @ 0b1000 @ sn @ 0b10 @ 0b000

// fcmpe sn, #0.0
union clause instruction = FCMPESri : (bits(5))
mapping clause encdec = FCMPESri(sn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00000 @ 0b00 @ 0b1000 @ sn @ 0b11 @ 0b000

// fccmp sn, sm, #nzcv, cond
union clause instruction = FCCMPSrr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = FCCMPSrr(sm, cond, sn, nzcv)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ cond @ 0b01 @ sn @ 0b0 @ nzcv

// fccmpe sn, sm, #nzcv, cond
union clause instruction = FCCMPESrr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = FCCMPESrr(sm, cond, sn, nzcv)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ cond @ 0b01 @ sn @ 0b1 @ nzcv

// fcsel sd, sn, sm, cond
union clause instruction = FCSELSrrr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = FCSELSrrr(sm, cond, sn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ sm @ cond @ 0b11 @ sn @ sd

// fmov sd, #fpimm
union clause instruction = FMOVSi : (bits(8), bits(5))
mapping clause encdec = FMOVSi(fpimm, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ fpimm @ 0b100 @ 0b00000 @ sd

// fcvtns wd, sn
union clause instruction = FCVTNSUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTNSUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b000 @ 0b000000 @ sn @ wd

// fcvtnu wd, sn
union clause instruction = FCVTNUUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTNUUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b001 @ 0b000000 @ sn @ wd

// fcvtas wd, sn
union clause instruction = FCVTASUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTASUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b100 @ 0b000000 @ sn @ wd

// fcvtau wd, sn
union clause instruction = FCVTAUUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTAUUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b101 @ 0b000000 @ sn @ wd

// fcvtps wd, sn
union clause instruction = FCVTPSUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTPSUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b01 @ 0b000 @ 0b000000 @ sn @ wd

// fcvtpu wd, sn
union clause instruction = FCVTPUUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTPUUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b01 @ 0b001 @ 0b000000 @ sn @ wd

// fcvtms wd, sn
union clause instruction = FCVTMSUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTMSUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b10 @ 0b000 @ 0b000000 @ sn @ wd

// fcvtmu wd, sn
union clause instruction = FCVTMUUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTMUUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b10 @ 0b001 @ 0b000000 @ sn @ wd

// fcvtzs wd, sn
union clause instruction = FCVTZSUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTZSUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b11 @ 0b000 @ 0b000000 @ sn @ wd

// fcvtzu wd, sn
union clause instruction = FCVTZUUWSr : (bits(5), bits(5))
mapping clause encdec = FCVTZUUWSr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b11 @ 0b001 @ 0b000000 @ sn @ wd

// scvtf sd, wn
union clause instruction = SCVTFUWSri : (bits(5), bits(5))
mapping clause encdec = SCVTFUWSri(wn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b010 @ 0b000000 @ wn @ sd

// ucvtf sd, wn
union clause instruction = UCVTFUWSri : (bits(5), bits(5))
mapping clause encdec = UCVTFUWSri(wn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b011 @ 0b000000 @ wn @ sd

// fcvtzs wd, sn, #wfbits
union clause instruction = FCVTZSSWSri : (bits(5), bits(5), bits(5))
mapping clause encdec = FCVTZSSWSri(wfbits, sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b11 @ 0b000 @ 0b1 @ wfbits @ sn @ wd

// fcvtzu wd, sn, #wfbits
union clause instruction = FCVTZUSWSri : (bits(5), bits(5), bits(5))
mapping clause encdec = FCVTZUSWSri(wfbits, sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b11 @ 0b001 @ 0b1 @ wfbits @ sn @ wd

// scvtf sd, wn, #wfbits
union clause instruction = SCVTFSWSri : (bits(5), bits(5), bits(5))
mapping clause encdec = SCVTFSWSri(wfbits, wn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b00 @ 0b010 @ 0b1 @ wfbits @ wn @ sd

// ucvtf sd, wn, #wfbits
union clause instruction = UCVTFSWSri : (bits(5), bits(5), bits(5))
mapping clause encdec = UCVTFSWSri(wfbits, wn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b00 @ 0b011 @ 0b1 @ wfbits @ wn @ sd

// fcvtns xd, sn
union clause instruction = FCVTNSUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTNSUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b000 @ 0b000000 @ sn @ xd

// fcvtnu xd, sn
union clause instruction = FCVTNUUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTNUUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b001 @ 0b000000 @ sn @ xd

// fcvtas xd, sn
union clause instruction = FCVTASUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTASUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b100 @ 0b000000 @ sn @ xd

// fcvtau xd, sn
union clause instruction = FCVTAUUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTAUUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b101 @ 0b000000 @ sn @ xd

// fcvtps xd, sn
union clause instruction = FCVTPSUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTPSUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b01 @ 0b000 @ 0b000000 @ sn @ xd

// fcvtpu xd, sn
union clause instruction = FCVTPUUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTPUUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b01 @ 0b001 @ 0b000000 @ sn @ xd

// fcvtms xd, sn
union clause instruction = FCVTMSUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTMSUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b10 @ 0b000 @ 0b000000 @ sn @ xd

// fcvtmu xd, sn
union clause instruction = FCVTMUUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTMUUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b10 @ 0b001 @ 0b000000 @ sn @ xd

// fcvtzs xd, sn
union clause instruction = FCVTZSUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTZSUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b11 @ 0b000 @ 0b000000 @ sn @ xd

// fcvtzu xd, sn
union clause instruction = FCVTZUUXSr : (bits(5), bits(5))
mapping clause encdec = FCVTZUUXSr(sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b11 @ 0b001 @ 0b000000 @ sn @ xd

// scvtf sd, xn
union clause instruction = SCVTFUXSri : (bits(5), bits(5))
mapping clause encdec = SCVTFUXSri(xn, sd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b010 @ 0b000000 @ xn @ sd

// ucvtf sd, xn
union clause instruction = UCVTFUXSri : (bits(5), bits(5))
mapping clause encdec = UCVTFUXSri(xn, sd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b011 @ 0b000000 @ xn @ sd

// fcvtzs xd, sn, #fbits
union clause instruction = FCVTZSSXSri : (bits(6), bits(5), bits(5))
mapping clause encdec = FCVTZSSXSri(fbits, sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b11 @ 0b000 @ fbits @ sn @ xd

// fcvtzu xd, sn, #fbits
union clause instruction = FCVTZUSXSri : (bits(6), bits(5), bits(5))
mapping clause encdec = FCVTZUSXSri(fbits, sn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b11 @ 0b001 @ fbits @ sn @ xd

// scvtf sd, xn, #fbits
union clause instruction = SCVTFSXSri : (bits(6), bits(5), bits(5))
mapping clause encdec = SCVTFSXSri(fbits, xn, sd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b00 @ 0b010 @ fbits @ xn @ sd

// ucvtf sd, xn, #fbits
union clause instruction = UCVTFSXSri : (bits(6), bits(5), bits(5))
mapping clause encdec = UCVTFSXSri(fbits, xn, sd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b0 @ 0b00 @ 0b011 @ fbits @ xn @ sd

// fmov dd, dn
union clause instruction = FMOVDr : (bits(5), bits(5))
mapping clause encdec = FMOVDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b000000 @ 0b10000 @ dn @ dd

// fabs dd, dn
union clause instruction = FABSDr : (bits(5), bits(5))
mapping clause encdec = FABSDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b000001 @ 0b10000 @ dn @ dd

// fneg dd, dn
union clause instruction = FNEGDr : (bits(5), bits(5))
mapping clause encdec = FNEGDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b000010 @ 0b10000 @ dn @ dd

// fsqrt dd, dn
union clause instruction = FSQRTDr : (bits(5), bits(5))
mapping clause encdec = FSQRTDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b000011 @ 0b10000 @ dn @ dd

// frintn dd, dn
union clause instruction = FRINTNDr : (bits(5), bits(5))
mapping clause encdec = FRINTNDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001000 @ 0b10000 @ dn @ dd

// frintp dd, dn
union clause instruction = FRINTPDr : (bits(5), bits(5))
mapping clause encdec = FRINTPDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001001 @ 0b10000 @ dn @ dd

// frintm dd, dn
union clause instruction = FRINTMDr : (bits(5), bits(5))
mapping clause encdec = FRINTMDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001010 @ 0b10000 @ dn @ dd

// frintz dd, dn
union clause instruction = FRINTZDr : (bits(5), bits(5))
mapping clause encdec = FRINTZDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001011 @ 0b10000 @ dn @ dd

// frinta dd, dn
union clause instruction = FRINTADr : (bits(5), bits(5))
mapping clause encdec = FRINTADr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001100 @ 0b10000 @ dn @ dd

// frintx dd, dn
union clause instruction = FRINTXDr : (bits(5), bits(5))
mapping clause encdec = FRINTXDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001110 @ 0b10000 @ dn @ dd

// frinti dd, dn
union clause instruction = FRINTIDr : (bits(5), bits(5))
mapping clause encdec = FRINTIDr(dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b001111 @ 0b10000 @ dn @ dd

// fmul dd, dn, dm
union clause instruction = FMULDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMULDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0000 @ 0b10 @ dn @ dd

// fdiv dd, dn, dm
union clause instruction = FDIVDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FDIVDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0001 @ 0b10 @ dn @ dd

// fadd dd, dn, dm
union clause instruction = FADDDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FADDDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0010 @ 0b10 @ dn @ dd

// fsub dd, dn, dm
union clause instruction = FSUBDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FSUBDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0011 @ 0b10 @ dn @ dd

// fmax dd, dn, dm
union clause instruction = FMAXDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMAXDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0100 @ 0b10 @ dn @ dd

// fmin dd, dn, dm
union clause instruction = FMINDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMINDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0101 @ 0b10 @ dn @ dd

// fmaxnm dd, dn, dm
union clause instruction = FMAXNMDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMAXNMDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0110 @ 0b10 @ dn @ dd

// fminnm dd, dn, dm
union clause instruction = FMINNMDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FMINNMDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b0111 @ 0b10 @ dn @ dd

// fnmul dd, dn, dm
union clause instruction = FNMULDrr : (bits(5), bits(5), bits(5))
mapping clause encdec = FNMULDrr(dm, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b1000 @ 0b10 @ dn @ dd

// fmadd dd, dn, dm, da
union clause instruction = FMADDDrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FMADDDrrr(dm, da, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b01 @ 0b0 @ dm @ 0b0 @ da @ dn @ dd

// fmsub dd, dn, dm, da
union clause instruction = FMSUBDrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FMSUBDrrr(dm, da, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b01 @ 0b0 @ dm @ 0b1 @ da @ dn @ dd

// fnmadd dd, dn, dm, da
union clause instruction = FNMADDDrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FNMADDDrrr(dm, da, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b01 @ 0b1 @ dm @ 0b0 @ da @ dn @ dd

// fnmsub dd, dn, dm, da
union clause instruction = FNMSUBDrrr : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = FNMSUBDrrr(dm, da, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11111 @ 0b01 @ 0b1 @ dm @ 0b1 @ da @ dn @ dd

// fcmp dn, dm
union clause instruction = FCMPDrr : (bits(5), bits(5))
mapping clause encdec = FCMPDrr(dm, dn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b00 @ 0b1000 @ dn @ 0b00 @ 0b000

// fcmp dn, #0.0
union clause instruction = FCMPDri : (bits(5))
mapping clause encdec = FCMPDri(dn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00000 @ 0b00 @ 0b1000 @ dn @ 0b01 @ 0b000

// fcmpe dn, dm
union clause instruction = FCMPEDrr : (bits(5), bits(5))
mapping clause encdec = FCMPEDrr(dm, dn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ 0b00 @ 0b1000 @ dn @ 0b10 @ 0b000

// fcmpe dn, #0.0
union clause instruction = FCMPEDri : (bits(5))
mapping clause encdec = FCMPEDri(dn)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00000 @ 0b00 @ 0b1000 @ dn @ 0b11 @ 0b000

// fccmp dn, dm, #nzcv, cond
union clause instruction = FCCMPDrr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = FCCMPDrr(dm, cond, dn, nzcv)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ cond @ 0b01 @ dn @ 0b0 @ nzcv

// fccmpe dn, dm, #nzcv, cond
union clause instruction = FCCMPEDrr : (bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = FCCMPEDrr(dm, cond, dn, nzcv)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ cond @ 0b01 @ dn @ 0b1 @ nzcv

// fcsel dd, dn, dm, cond
union clause instruction = FCSELDrrr : (bits(5), bits(4), bits(5), bits(5))
mapping clause encdec = FCSELDrrr(dm, cond, dn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ dm @ cond @ 0b11 @ dn @ dd

// fmov dd, #fpimm
union clause instruction = FMOVDi : (bits(8), bits(5))
mapping clause encdec = FMOVDi(fpimm, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ fpimm @ 0b100 @ 0b00000 @ dd

// fcvtns wd, dn
union clause instruction = FCVTNSUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTNSUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b000 @ 0b000000 @ dn @ wd

// fcvtnu wd, dn
union clause instruction = FCVTNUUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTNUUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b001 @ 0b000000 @ dn @ wd

// fcvtas wd, dn
union clause instruction = FCVTASUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTASUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b100 @ 0b000000 @ dn @ wd

// fcvtau wd, dn
union clause instruction = FCVTAUUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTAUUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b101 @ 0b000000 @ dn @ wd

// fcvtps wd, dn
union clause instruction = FCVTPSUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTPSUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b01 @ 0b000 @ 0b000000 @ dn @ wd

// fcvtpu wd, dn
union clause instruction = FCVTPUUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTPUUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b01 @ 0b001 @ 0b000000 @ dn @ wd

// fcvtms wd, dn
union clause instruction = FCVTMSUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTMSUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b10 @ 0b000 @ 0b000000 @ dn @ wd

// fcvtmu wd, dn
union clause instruction = FCVTMUUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTMUUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b10 @ 0b001 @ 0b000000 @ dn @ wd

// fcvtzs wd, dn
union clause instruction = FCVTZSUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTZSUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b11 @ 0b000 @ 0b000000 @ dn @ wd

// fcvtzu wd, dn
union clause instruction = FCVTZUUWDr : (bits(5), bits(5))
mapping clause encdec = FCVTZUUWDr(dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b11 @ 0b001 @ 0b000000 @ dn @ wd

// scvtf dd, wn
union clause instruction = SCVTFUWDri : (bits(5), bits(5))
mapping clause encdec = SCVTFUWDri(wn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b010 @ 0b000000 @ wn @ dd

// ucvtf dd, wn
union clause instruction = UCVTFUWDri : (bits(5), bits(5))
mapping clause encdec = UCVTFUWDri(wn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b011 @ 0b000000 @ wn @ dd

// fcvtzs wd, dn, #wfbits
union clause instruction = FCVTZSSWDri : (bits(5), bits(5), bits(5))
mapping clause encdec = FCVTZSSWDri(wfbits, dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b11 @ 0b000 @ 0b1 @ wfbits @ dn @ wd

// fcvtzu wd, dn, #wfbits
union clause instruction = FCVTZUSWDri : (bits(5), bits(5), bits(5))
mapping clause encdec = FCVTZUSWDri(wfbits, dn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b11 @ 0b001 @ 0b1 @ wfbits @ dn @ wd

// scvtf dd, wn, #wfbits
union clause instruction = SCVTFSWDri : (bits(5), bits(5), bits(5))
mapping clause encdec = SCVTFSWDri(wfbits, wn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b00 @ 0b010 @ 0b1 @ wfbits @ wn @ dd

// ucvtf dd, wn, #wfbits
union clause instruction = UCVTFSWDri : (bits(5), bits(5), bits(5))
mapping clause encdec = UCVTFSWDri(wfbits, wn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b00 @ 0b011 @ 0b1 @ wfbits @ wn @ dd

// fcvtns xd, dn
union clause instruction = FCVTNSUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTNSUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b000 @ 0b000000 @ dn @ xd

// fcvtnu xd, dn
union clause instruction = FCVTNUUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTNUUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b001 @ 0b000000 @ dn @ xd

// fcvtas xd, dn
union clause instruction = FCVTASUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTASUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b100 @ 0b000000 @ dn @ xd

// fcvtau xd, dn
union clause instruction = FCVTAUUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTAUUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b101 @ 0b000000 @ dn @ xd

// fcvtps xd, dn
union clause instruction = FCVTPSUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTPSUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b01 @ 0b000 @ 0b000000 @ dn @ xd

// fcvtpu xd, dn
union clause instruction = FCVTPUUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTPUUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b01 @ 0b001 @ 0b000000 @ dn @ xd

// fcvtms xd, dn
union clause instruction = FCVTMSUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTMSUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b10 @ 0b000 @ 0b000000 @ dn @ xd

// fcvtmu xd, dn
union clause instruction = FCVTMUUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTMUUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b10 @ 0b001 @ 0b000000 @ dn @ xd

// fcvtzs xd, dn
union clause instruction = FCVTZSUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTZSUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b11 @ 0b000 @ 0b000000 @ dn @ xd

// fcvtzu xd, dn
union clause instruction = FCVTZUUXDr : (bits(5), bits(5))
mapping clause encdec = FCVTZUUXDr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b11 @ 0b001 @ 0b000000 @ dn @ xd

// scvtf dd, xn
union clause instruction = SCVTFUXDri : (bits(5), bits(5))
mapping clause encdec = SCVTFUXDri(xn, dd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b010 @ 0b000000 @ xn @ dd

// ucvtf dd, xn
union clause instruction = UCVTFUXDri : (bits(5), bits(5))
mapping clause encdec = UCVTFUXDri(xn, dd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b011 @ 0b000000 @ xn @ dd

// fcvtzs xd, dn, #fbits
union clause instruction = FCVTZSSXDri : (bits(6), bits(5), bits(5))
mapping clause encdec = FCVTZSSXDri(fbits, dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b11 @ 0b000 @ fbits @ dn @ xd

// fcvtzu xd, dn, #fbits
union clause instruction = FCVTZUSXDri : (bits(6), bits(5), bits(5))
mapping clause encdec = FCVTZUSXDri(fbits, dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b11 @ 0b001 @ fbits @ dn @ xd

// scvtf dd, xn, #fbits
union clause instruction = SCVTFSXDri : (bits(6), bits(5), bits(5))
mapping clause encdec = SCVTFSXDri(fbits, xn, dd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b00 @ 0b010 @ fbits @ xn @ dd

// ucvtf dd, xn, #fbits
union clause instruction = UCVTFSXDri : (bits(6), bits(5), bits(5))
mapping clause encdec = UCVTFSXDri(fbits, xn, dd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b0 @ 0b00 @ 0b011 @ fbits @ xn @ dd

// fcvt dd, sn
union clause instruction = FCVTDSr : (bits(5), bits(5))
mapping clause encdec = FCVTDSr(sn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b0001 @ 0b01 @ 0b10000 @ sn @ dd

// fcvt hd, sn
union clause instruction = FCVTHSr : (bits(5), bits(5))
mapping clause encdec = FCVTHSr(sn, hd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b0001 @ 0b11 @ 0b10000 @ sn @ hd

// fcvt sd, dn
union clause instruction = FCVTSDr : (bits(5), bits(5))
mapping clause encdec = FCVTSDr(dn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b0001 @ 0b00 @ 0b10000 @ dn @ sd

// fcvt hd, dn
union clause instruction = FCVTHDr : (bits(5), bits(5))
mapping clause encdec = FCVTHDr(dn, hd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b0001 @ 0b11 @ 0b10000 @ dn @ hd

// fcvt sd, hn
union clause instruction = FCVTSHr : (bits(5), bits(5))
mapping clause encdec = FCVTSHr(hn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b11 @ 0b1 @ 0b0001 @ 0b00 @ 0b10000 @ hn @ sd

// fcvt dd, hn
union clause instruction = FCVTDHr : (bits(5), bits(5))
mapping clause encdec = FCVTDHr(hn, dd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b11 @ 0b1 @ 0b0001 @ 0b01 @ 0b10000 @ hn @ dd

// fmov wd, sn
union clause instruction = FMOVSWr : (bits(5), bits(5))
mapping clause encdec = FMOVSWr(sn, wd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b110 @ 0b000000 @ sn @ wd

// fmov sd, wn
union clause instruction = FMOVWSr : (bits(5), bits(5))
mapping clause encdec = FMOVWSr(wn, sd)
  <-> 0b0 @ 0b0 @ 0b0 @ 0b11110 @ 0b00 @ 0b1 @ 0b00 @ 0b111 @ 0b000000 @ wn @ sd

// fmov xd, dn
union clause instruction = FMOVDXr : (bits(5), bits(5))
mapping clause encdec = FMOVDXr(dn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b110 @ 0b000000 @ dn @ xd

// fmov dd, xn
union clause instruction = FMOVXDr : (bits(5), bits(5))
mapping clause encdec = FMOVXDr(xn, dd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b01 @ 0b1 @ 0b00 @ 0b111 @ 0b000000 @ xn @ dd

// fmov xd, vn.d[1]
union clause instruction = FMOVDXHighr : (bits(5), bits(5))
mapping clause encdec = FMOVDXHighr(vn, xd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b10 @ 0b1 @ 0b01 @ 0b110 @ 0b000000 @ vn @ xd

// fmov vd.d[1], xn
union clause instruction = FMOVXDHighr : (bits(5), bits(5))
mapping clause encdec = FMOVXDHighr(xn, vd)
  <-> 0b1 @ 0b0 @ 0b0 @ 0b11110 @ 0b10 @ 0b1 @ 0b01 @ 0b111 @ 0b000000 @ xn @ vd

end instruction
