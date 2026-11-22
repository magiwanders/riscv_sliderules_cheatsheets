// A32 (ARMv7-A, the ARM instruction set): the integer, load / store, branch, coprocessor and system instructions;
// encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) by hand
// from the encodings of the Arm Architecture Reference Manual, ARMv7-A and ARMv7-R edition (chapter A5, the
// instruction descriptions of chapters A8 and B9); nothing in it is taken from Arm's machine-readable specification.
// There is no Sail model of A32 written as encodings: this one is checked bit by bit against LLVM's ARM TableGen (clause
// names are LLVM's instruction names, NAME_i / NAME_r where one LLVM record is an immediate and a register form) and by
// assembling every instruction with GNU as and llvm-mc (npm test). Licensed CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses and encdec mappings, no execute clauses, and not checked by
// the Sail compiler. Fields are named by what they hold, as the sheets' operands: cond the condition, sflag the S bit,
// mimm a modified immediate (rotation : imm8), sign the U bit (add or subtract the offset), label the branch offset
// from PC + 8 in bytes, rtd an even register whose pair (rtd2) the instruction also transfers.

scattered union instruction

// and rd, rn, #mimm
union clause instruction = ANDri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = ANDri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0000 @ sflag @ rn @ rd @ mimm

// and rd, rn, rm{?, shiftamount}
union clause instruction = ANDrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = ANDrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0000 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// and rd, rn, rm, shiftr rs
union clause instruction = ANDrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = ANDrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0000 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// eor rd, rn, #mimm
union clause instruction = EORri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = EORri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0001 @ sflag @ rn @ rd @ mimm

// eor rd, rn, rm{?, shiftamount}
union clause instruction = EORrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = EORrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0001 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// eor rd, rn, rm, shiftr rs
union clause instruction = EORrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = EORrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0001 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// sub rd, rn, #mimm
union clause instruction = SUBri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = SUBri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0010 @ sflag @ rn @ rd @ mimm

// sub rd, rn, rm{?, shiftamount}
union clause instruction = SUBrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = SUBrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0010 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// sub rd, rn, rm, shiftr rs
union clause instruction = SUBrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SUBrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0010 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// rsb rd, rn, #mimm
union clause instruction = RSBri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = RSBri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0011 @ sflag @ rn @ rd @ mimm

// rsb rd, rn, rm{?, shiftamount}
union clause instruction = RSBrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = RSBrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0011 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// rsb rd, rn, rm, shiftr rs
union clause instruction = RSBrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = RSBrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0011 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// add rd, rn, #mimm
union clause instruction = ADDri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = ADDri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0100 @ sflag @ rn @ rd @ mimm

// add rd, rn, rm{?, shiftamount}
union clause instruction = ADDrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = ADDrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0100 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// add rd, rn, rm, shiftr rs
union clause instruction = ADDrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = ADDrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0100 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// adc rd, rn, #mimm
union clause instruction = ADCri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = ADCri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0101 @ sflag @ rn @ rd @ mimm

// adc rd, rn, rm{?, shiftamount}
union clause instruction = ADCrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = ADCrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0101 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// adc rd, rn, rm, shiftr rs
union clause instruction = ADCrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = ADCrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0101 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// sbc rd, rn, #mimm
union clause instruction = SBCri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = SBCri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0110 @ sflag @ rn @ rd @ mimm

// sbc rd, rn, rm{?, shiftamount}
union clause instruction = SBCrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = SBCrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0110 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// sbc rd, rn, rm, shiftr rs
union clause instruction = SBCrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SBCrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0110 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// rsc rd, rn, #mimm
union clause instruction = RSCri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = RSCri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b0111 @ sflag @ rn @ rd @ mimm

// rsc rd, rn, rm{?, shiftamount}
union clause instruction = RSCrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = RSCrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b0111 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// rsc rd, rn, rm, shiftr rs
union clause instruction = RSCrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = RSCrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b0111 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// tst rn, #mimm
union clause instruction = TSTri : (bits(4), bits(4), bits(12))
mapping clause encdec = TSTri(cond, rn, mimm)
  <-> cond @ 0b001 @ 0b1000 @ 0b1 @ rn @ 0b0000 @ mimm

// tst rn, rm{?, shiftamount}
union clause instruction = TSTrsi : (bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = TSTrsi(cond, rn, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1000 @ 0b1 @ rn @ 0b0000 @ amount @ shift @ 0b0 @ rm

// tst rn, rm, shiftr rs
union clause instruction = TSTrsr : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = TSTrsr(cond, rn, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1000 @ 0b1 @ rn @ 0b0000 @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// teq rn, #mimm
union clause instruction = TEQri : (bits(4), bits(4), bits(12))
mapping clause encdec = TEQri(cond, rn, mimm)
  <-> cond @ 0b001 @ 0b1001 @ 0b1 @ rn @ 0b0000 @ mimm

// teq rn, rm{?, shiftamount}
union clause instruction = TEQrsi : (bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = TEQrsi(cond, rn, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1001 @ 0b1 @ rn @ 0b0000 @ amount @ shift @ 0b0 @ rm

// teq rn, rm, shiftr rs
union clause instruction = TEQrsr : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = TEQrsr(cond, rn, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1001 @ 0b1 @ rn @ 0b0000 @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// cmp rn, #mimm
union clause instruction = CMPri : (bits(4), bits(4), bits(12))
mapping clause encdec = CMPri(cond, rn, mimm)
  <-> cond @ 0b001 @ 0b1010 @ 0b1 @ rn @ 0b0000 @ mimm

// cmp rn, rm{?, shiftamount}
union clause instruction = CMPrsi : (bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = CMPrsi(cond, rn, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1010 @ 0b1 @ rn @ 0b0000 @ amount @ shift @ 0b0 @ rm

// cmp rn, rm, shiftr rs
union clause instruction = CMPrsr : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = CMPrsr(cond, rn, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1010 @ 0b1 @ rn @ 0b0000 @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// cmn rn, #mimm
union clause instruction = CMNri : (bits(4), bits(4), bits(12))
mapping clause encdec = CMNri(cond, rn, mimm)
  <-> cond @ 0b001 @ 0b1011 @ 0b1 @ rn @ 0b0000 @ mimm

// cmn rn, rm{?, shiftamount}
union clause instruction = CMNrsi : (bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = CMNrsi(cond, rn, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1011 @ 0b1 @ rn @ 0b0000 @ amount @ shift @ 0b0 @ rm

// cmn rn, rm, shiftr rs
union clause instruction = CMNrsr : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = CMNrsr(cond, rn, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1011 @ 0b1 @ rn @ 0b0000 @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// orr rd, rn, #mimm
union clause instruction = ORRri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = ORRri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b1100 @ sflag @ rn @ rd @ mimm

// orr rd, rn, rm{?, shiftamount}
union clause instruction = ORRrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = ORRrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1100 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// orr rd, rn, rm, shiftr rs
union clause instruction = ORRrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = ORRrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1100 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// mov rd, #mimm
union clause instruction = MOVi : (bits(4), bits(1), bits(4), bits(12))
mapping clause encdec = MOVi(cond, sflag, rd, mimm)
  <-> cond @ 0b001 @ 0b1101 @ sflag @ 0b0000 @ rd @ mimm

// mov rd, rm{?, shiftamount}
union clause instruction = MOVsi : (bits(4), bits(1), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = MOVsi(cond, sflag, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1101 @ sflag @ 0b0000 @ rd @ amount @ shift @ 0b0 @ rm

// mov rd, rm, shiftr rs
union clause instruction = MOVsr : (bits(4), bits(1), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = MOVsr(cond, sflag, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1101 @ sflag @ 0b0000 @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// bic rd, rn, #mimm
union clause instruction = BICri : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = BICri(cond, sflag, rn, rd, mimm)
  <-> cond @ 0b001 @ 0b1110 @ sflag @ rn @ rd @ mimm

// bic rd, rn, rm{?, shiftamount}
union clause instruction = BICrsi : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = BICrsi(cond, sflag, rn, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1110 @ sflag @ rn @ rd @ amount @ shift @ 0b0 @ rm

// bic rd, rn, rm, shiftr rs
union clause instruction = BICrsr : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = BICrsr(cond, sflag, rn, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1110 @ sflag @ rn @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// mvn rd, #mimm
union clause instruction = MVNi : (bits(4), bits(1), bits(4), bits(12))
mapping clause encdec = MVNi(cond, sflag, rd, mimm)
  <-> cond @ 0b001 @ 0b1111 @ sflag @ 0b0000 @ rd @ mimm

// mvn rd, rm{?, shiftamount}
union clause instruction = MVNsi : (bits(4), bits(1), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = MVNsi(cond, sflag, rd, amount, shift, rm)
  <-> cond @ 0b000 @ 0b1111 @ sflag @ 0b0000 @ rd @ amount @ shift @ 0b0 @ rm

// mvn rd, rm, shiftr rs
union clause instruction = MVNsr : (bits(4), bits(1), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = MVNsr(cond, sflag, rd, rs, shiftr, rm)
  <-> cond @ 0b000 @ 0b1111 @ sflag @ 0b0000 @ rd @ rs @ 0b0 @ shiftr @ 0b1 @ rm

// mul rd, rn, rm
union clause instruction = MUL : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = MUL(cond, sflag, rd, rm, rn)
  <-> cond @ 0b0000000 @ sflag @ rd @ 0b0000 @ rm @ 0b1001 @ rn

// mla rd, rn, rm, ra
union clause instruction = MLA : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MLA(cond, sflag, rd, ra, rm, rn)
  <-> cond @ 0b0000001 @ sflag @ rd @ ra @ rm @ 0b1001 @ rn

// umaal rdlo, rdhi, rn, rm
union clause instruction = UMAAL : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UMAAL(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b00000100 @ rdhi @ rdlo @ rm @ 0b1001 @ rn

// mls rd, rn, rm, ra
union clause instruction = MLS : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MLS(cond, rd, ra, rm, rn)
  <-> cond @ 0b00000110 @ rd @ ra @ rm @ 0b1001 @ rn

// umull rdlo, rdhi, rn, rm
union clause instruction = UMULL : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UMULL(cond, sflag, rdhi, rdlo, rm, rn)
  <-> cond @ 0b0000 @ 0b100 @ sflag @ rdhi @ rdlo @ rm @ 0b1001 @ rn

// umlal rdlo, rdhi, rn, rm
union clause instruction = UMLAL : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UMLAL(cond, sflag, rdhi, rdlo, rm, rn)
  <-> cond @ 0b0000 @ 0b101 @ sflag @ rdhi @ rdlo @ rm @ 0b1001 @ rn

// smull rdlo, rdhi, rn, rm
union clause instruction = SMULL : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULL(cond, sflag, rdhi, rdlo, rm, rn)
  <-> cond @ 0b0000 @ 0b110 @ sflag @ rdhi @ rdlo @ rm @ 0b1001 @ rn

// smlal rdlo, rdhi, rn, rm
union clause instruction = SMLAL : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLAL(cond, sflag, rdhi, rdlo, rm, rn)
  <-> cond @ 0b0000 @ 0b111 @ sflag @ rdhi @ rdlo @ rm @ 0b1001 @ rn

// smlabb rd, rn, rm, ra
union clause instruction = SMLABB : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLABB(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010000 @ rd @ ra @ rm @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn

// smlalbb rdlo, rdhi, rn, rm
union clause instruction = SMLALBB : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALBB(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b00010100 @ rdhi @ rdlo @ rm @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn

// smulbb rd, rn, rm
union clause instruction = SMULBB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULBB(cond, rd, rm, rn)
  <-> cond @ 0b00010110 @ rd @ 0b0000 @ rm @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn

// smlawb rd, rn, rm, ra
union clause instruction = SMLAWB : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLAWB(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010010 @ rd @ ra @ rm @ 0b1 @ 0b0 @ 0b00 @ rn

// smulwb rd, rn, rm
union clause instruction = SMULWB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULWB(cond, rd, rm, rn)
  <-> cond @ 0b00010010 @ rd @ 0b0000 @ rm @ 0b1 @ 0b0 @ 0b10 @ rn

// smlabt rd, rn, rm, ra
union clause instruction = SMLABT : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLABT(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010000 @ rd @ ra @ rm @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn

// smlalbt rdlo, rdhi, rn, rm
union clause instruction = SMLALBT : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALBT(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b00010100 @ rdhi @ rdlo @ rm @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn

// smulbt rd, rn, rm
union clause instruction = SMULBT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULBT(cond, rd, rm, rn)
  <-> cond @ 0b00010110 @ rd @ 0b0000 @ rm @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn

// smlawt rd, rn, rm, ra
union clause instruction = SMLAWT : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLAWT(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010010 @ rd @ ra @ rm @ 0b1 @ 0b1 @ 0b00 @ rn

// smulwt rd, rn, rm
union clause instruction = SMULWT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULWT(cond, rd, rm, rn)
  <-> cond @ 0b00010010 @ rd @ 0b0000 @ rm @ 0b1 @ 0b1 @ 0b10 @ rn

// smlatb rd, rn, rm, ra
union clause instruction = SMLATB : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLATB(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010000 @ rd @ ra @ rm @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ rn

// smlaltb rdlo, rdhi, rn, rm
union clause instruction = SMLALTB : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALTB(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b00010100 @ rdhi @ rdlo @ rm @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ rn

// smultb rd, rn, rm
union clause instruction = SMULTB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULTB(cond, rd, rm, rn)
  <-> cond @ 0b00010110 @ rd @ 0b0000 @ rm @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ rn

// smlatt rd, rn, rm, ra
union clause instruction = SMLATT : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLATT(cond, rd, ra, rm, rn)
  <-> cond @ 0b00010000 @ rd @ ra @ rm @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ rn

// smlaltt rdlo, rdhi, rn, rm
union clause instruction = SMLALTT : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALTT(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b00010100 @ rdhi @ rdlo @ rm @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ rn

// smultt rd, rn, rm
union clause instruction = SMULTT : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMULTT(cond, rd, rm, rn)
  <-> cond @ 0b00010110 @ rd @ 0b0000 @ rm @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ rn

// smlad rd, rn, rm, ra
union clause instruction = SMLAD : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLAD(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ ra @ rm @ 0b000 @ 0b1 @ rn

// smladx rd, rn, rm, ra
union clause instruction = SMLADX : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLADX(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ ra @ rm @ 0b001 @ 0b1 @ rn

// smlsd rd, rn, rm, ra
union clause instruction = SMLSD : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLSD(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ ra @ rm @ 0b010 @ 0b1 @ rn

// smlsdx rd, rn, rm, ra
union clause instruction = SMLSDX : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLSDX(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ ra @ rm @ 0b011 @ 0b1 @ rn

// smuad rd, rn, rm
union clause instruction = SMUAD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMUAD(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ 0b1111 @ rm @ 0b000 @ 0b1 @ rn

// smuadx rd, rn, rm
union clause instruction = SMUADX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMUADX(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ 0b1111 @ rm @ 0b001 @ 0b1 @ rn

// smusd rd, rn, rm
union clause instruction = SMUSD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMUSD(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ 0b1111 @ rm @ 0b010 @ 0b1 @ rn

// smusdx rd, rn, rm
union clause instruction = SMUSDX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMUSDX(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b000 @ rd @ 0b1111 @ rm @ 0b011 @ 0b1 @ rn

// smlald rdlo, rdhi, rn, rm
union clause instruction = SMLALD : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALD(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b01110 @ 0b100 @ rdhi @ rdlo @ rm @ 0b000 @ 0b1 @ rn

// smlaldx rdlo, rdhi, rn, rm
union clause instruction = SMLALDX : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLALDX(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b01110 @ 0b100 @ rdhi @ rdlo @ rm @ 0b001 @ 0b1 @ rn

// smlsld rdlo, rdhi, rn, rm
union clause instruction = SMLSLD : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLSLD(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b01110 @ 0b100 @ rdhi @ rdlo @ rm @ 0b010 @ 0b1 @ rn

// smlsldx rdlo, rdhi, rn, rm
union clause instruction = SMLSLDX : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMLSLDX(cond, rdhi, rdlo, rm, rn)
  <-> cond @ 0b01110 @ 0b100 @ rdhi @ rdlo @ rm @ 0b011 @ 0b1 @ rn

// smmla rd, rn, rm, ra
union clause instruction = SMMLA : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMLA(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ ra @ rm @ 0b000 @ 0b1 @ rn

// smmlar rd, rn, rm, ra
union clause instruction = SMMLAR : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMLAR(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ ra @ rm @ 0b001 @ 0b1 @ rn

// smmul rd, rn, rm
union clause instruction = SMMUL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMUL(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ 0b1111 @ rm @ 0b000 @ 0b1 @ rn

// smmulr rd, rn, rm
union clause instruction = SMMULR : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMULR(cond, rd, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ 0b1111 @ rm @ 0b001 @ 0b1 @ rn

// smmls rd, rn, rm, ra
union clause instruction = SMMLS : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMLS(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ ra @ rm @ 0b110 @ 0b1 @ rn

// smmlsr rd, rn, rm, ra
union clause instruction = SMMLSR : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SMMLSR(cond, rd, ra, rm, rn)
  <-> cond @ 0b01110 @ 0b101 @ rd @ ra @ rm @ 0b111 @ 0b1 @ rn

// sdiv rd, rn, rm
union clause instruction = SDIV : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SDIV(cond, rd, rm, rn)
  <-> cond @ 0b01110001 @ rd @ 0b1111 @ rm @ 0b0001 @ rn

// udiv rd, rn, rm
union clause instruction = UDIV : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UDIV(cond, rd, rm, rn)
  <-> cond @ 0b01110011 @ rd @ 0b1111 @ rm @ 0b0001 @ rn

// qadd rd, rm, rn
union clause instruction = QADD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QADD(cond, rn, rd, rm)
  <-> cond @ 0b00010 @ 0b00 @ 0b0 @ rn @ rd @ 0b0000 @ 0b0101 @ rm

// qsub rd, rm, rn
union clause instruction = QSUB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QSUB(cond, rn, rd, rm)
  <-> cond @ 0b00010 @ 0b01 @ 0b0 @ rn @ rd @ 0b0000 @ 0b0101 @ rm

// qdadd rd, rm, rn
union clause instruction = QDADD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QDADD(cond, rn, rd, rm)
  <-> cond @ 0b00010 @ 0b10 @ 0b0 @ rn @ rd @ 0b0000 @ 0b0101 @ rm

// qdsub rd, rm, rn
union clause instruction = QDSUB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QDSUB(cond, rn, rd, rm)
  <-> cond @ 0b00010 @ 0b11 @ 0b0 @ rn @ rd @ 0b0000 @ 0b0101 @ rm

// sadd16 rd, rn, rm
union clause instruction = SADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// sasx rd, rn, rm
union clause instruction = SASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// ssax rd, rn, rm
union clause instruction = SSAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SSAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// ssub16 rd, rn, rm
union clause instruction = SSUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SSUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// sadd8 rd, rn, rm
union clause instruction = SADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// ssub8 rd, rn, rm
union clause instruction = SSUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SSUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b001 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// qadd16 rd, rn, rm
union clause instruction = QADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// qasx rd, rn, rm
union clause instruction = QASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// qsax rd, rn, rm
union clause instruction = QSAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QSAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// qsub16 rd, rn, rm
union clause instruction = QSUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QSUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// qadd8 rd, rn, rm
union clause instruction = QADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// qsub8 rd, rn, rm
union clause instruction = QSUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = QSUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b010 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// shadd16 rd, rn, rm
union clause instruction = SHADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// shasx rd, rn, rm
union clause instruction = SHASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// shsax rd, rn, rm
union clause instruction = SHSAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHSAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// shsub16 rd, rn, rm
union clause instruction = SHSUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHSUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// shadd8 rd, rn, rm
union clause instruction = SHADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// shsub8 rd, rn, rm
union clause instruction = SHSUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SHSUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b011 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// uadd16 rd, rn, rm
union clause instruction = UADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// uasx rd, rn, rm
union clause instruction = UASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// usax rd, rn, rm
union clause instruction = USAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// usub16 rd, rn, rm
union clause instruction = USUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// uadd8 rd, rn, rm
union clause instruction = UADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// usub8 rd, rn, rm
union clause instruction = USUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b101 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// uqadd16 rd, rn, rm
union clause instruction = UQADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// uqasx rd, rn, rm
union clause instruction = UQASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// uqsax rd, rn, rm
union clause instruction = UQSAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQSAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// uqsub16 rd, rn, rm
union clause instruction = UQSUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQSUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// uqadd8 rd, rn, rm
union clause instruction = UQADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// uqsub8 rd, rn, rm
union clause instruction = UQSUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UQSUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b110 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// uhadd16 rd, rn, rm
union clause instruction = UHADD16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHADD16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b000 @ 0b1 @ rm

// uhasx rd, rn, rm
union clause instruction = UHASX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHASX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b001 @ 0b1 @ rm

// uhsax rd, rn, rm
union clause instruction = UHSAX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHSAX(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b010 @ 0b1 @ rm

// uhsub16 rd, rn, rm
union clause instruction = UHSUB16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHSUB16(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b011 @ 0b1 @ rm

// uhadd8 rd, rn, rm
union clause instruction = UHADD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHADD8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b100 @ 0b1 @ rm

// uhsub8 rd, rn, rm
union clause instruction = UHSUB8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = UHSUB8(cond, rn, rd, rm)
  <-> cond @ 0b01100 @ 0b111 @ rn @ rd @ 0b1111 @ 0b111 @ 0b1 @ rm

// pkhbt rd, rn, rm{?, lsl #pkhsh}
union clause instruction = PKHBT : (bits(4), bits(4), bits(4), bits(5), bits(4))
mapping clause encdec = PKHBT(cond, rn, rd, pkhsh, rm)
  <-> cond @ 0b01101000 @ rn @ rd @ pkhsh @ 0b001 @ rm

// pkhtb rd, rn, rm, asr #pkha
union clause instruction = PKHTB : (bits(4), bits(4), bits(4), bits(5), bits(4))
mapping clause encdec = PKHTB(cond, rn, rd, pkha, rm)
  <-> cond @ 0b01101000 @ rn @ rd @ pkha @ 0b101 @ rm

// ssat rd, #ssat, rn{?, shsat #samt}
union clause instruction = SSAT : (bits(4), bits(5), bits(4), bits(5), bits(1), bits(4))
mapping clause encdec = SSAT(cond, ssat, rd, samt, shsat, rn)
  <-> cond @ 0b0110101 @ ssat @ rd @ samt @ shsat @ 0b01 @ rn

// usat rd, #usat, rn{?, shsat #samt}
union clause instruction = USAT : (bits(4), bits(5), bits(4), bits(5), bits(1), bits(4))
mapping clause encdec = USAT(cond, usat, rd, samt, shsat, rn)
  <-> cond @ 0b0110111 @ usat @ rd @ samt @ shsat @ 0b01 @ rn

// ssat16 rd, #ssat4, rn
union clause instruction = SSAT16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SSAT16(cond, ssat4, rd, rn)
  <-> cond @ 0b01101010 @ ssat4 @ rd @ 0b1111 @ 0b0011 @ rn

// usat16 rd, #usat4, rn
union clause instruction = USAT16 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USAT16(cond, usat4, rd, rn)
  <-> cond @ 0b01101110 @ usat4 @ rd @ 0b1111 @ 0b0011 @ rn

// sel rd, rn, rm
union clause instruction = SEL : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SEL(cond, rn, rd, rm)
  <-> cond @ 0b01101000 @ rn @ rd @ 0b1111 @ 0b1011 @ rm

// rev rd, rm
union clause instruction = REV : (bits(4), bits(4), bits(4))
mapping clause encdec = REV(cond, rd, rm)
  <-> cond @ 0b01101011 @ 0b1111 @ rd @ 0b1111 @ 0b0011 @ rm

// rev16 rd, rm
union clause instruction = REV16 : (bits(4), bits(4), bits(4))
mapping clause encdec = REV16(cond, rd, rm)
  <-> cond @ 0b01101011 @ 0b1111 @ rd @ 0b1111 @ 0b1011 @ rm

// rbit rd, rm
union clause instruction = RBIT : (bits(4), bits(4), bits(4))
mapping clause encdec = RBIT(cond, rd, rm)
  <-> cond @ 0b01101111 @ 0b1111 @ rd @ 0b1111 @ 0b0011 @ rm

// revsh rd, rm
union clause instruction = REVSH : (bits(4), bits(4), bits(4))
mapping clause encdec = REVSH(cond, rd, rm)
  <-> cond @ 0b01101111 @ 0b1111 @ rd @ 0b1111 @ 0b1011 @ rm

// clz rd, rm
union clause instruction = CLZ : (bits(4), bits(4), bits(4))
mapping clause encdec = CLZ(cond, rd, rm)
  <-> cond @ 0b00010110 @ 0b1111 @ rd @ 0b1111 @ 0b0001 @ rm

// sxtab16 rd, rn, rm{?, rot}
union clause instruction = SXTAB16 : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTAB16(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b000 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sxtb16 rd, rm{?, rot}
union clause instruction = SXTB16 : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTB16(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b000 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sxtab rd, rn, rm{?, rot}
union clause instruction = SXTAB : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTAB(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b010 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sxtb rd, rm{?, rot}
union clause instruction = SXTB : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTB(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b010 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sxtah rd, rn, rm{?, rot}
union clause instruction = SXTAH : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTAH(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b011 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sxth rd, rm{?, rot}
union clause instruction = SXTH : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = SXTH(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b011 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxtab16 rd, rn, rm{?, rot}
union clause instruction = UXTAB16 : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTAB16(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b100 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxtb16 rd, rm{?, rot}
union clause instruction = UXTB16 : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTB16(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b100 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxtab rd, rn, rm{?, rot}
union clause instruction = UXTAB : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTAB(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b110 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxtb rd, rm{?, rot}
union clause instruction = UXTB : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTB(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b110 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxtah rd, rn, rm{?, rot}
union clause instruction = UXTAH : (bits(4), bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTAH(cond, rn, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b111 @ rn @ rd @ rot @ 0b00 @ 0b0111 @ rm

// uxth rd, rm{?, rot}
union clause instruction = UXTH : (bits(4), bits(4), bits(2), bits(4))
mapping clause encdec = UXTH(cond, rd, rot, rm)
  <-> cond @ 0b01101 @ 0b111 @ 0b1111 @ rd @ rot @ 0b00 @ 0b0111 @ rm

// sbfx rd, rn, #lsb, #widthm1
union clause instruction = SBFX : (bits(4), bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = SBFX(cond, widthm1, rd, lsb, rn)
  <-> cond @ 0b0111101 @ widthm1 @ rd @ lsb @ 0b101 @ rn

// ubfx rd, rn, #lsb, #widthm1
union clause instruction = UBFX : (bits(4), bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = UBFX(cond, widthm1, rd, lsb, rn)
  <-> cond @ 0b0111111 @ widthm1 @ rd @ lsb @ 0b101 @ rn

// bfi rd, rn, #lsb, #msb
union clause instruction = BFI : (bits(4), bits(5), bits(4), bits(5), bits(4))
mapping clause encdec = BFI(cond, msb, rd, lsb, rn)
  <-> cond @ 0b0111110 @ msb @ rd @ lsb @ 0b001 @ rn

// bfc rd, #lsb, #msb
union clause instruction = BFC : (bits(4), bits(5), bits(4), bits(5))
mapping clause encdec = BFC(cond, msb, rd, lsb)
  <-> cond @ 0b0111110 @ msb @ rd @ lsb @ 0b001 @ 0b1111

// usad8 rd, rn, rm
union clause instruction = USAD8 : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USAD8(cond, rd, rm, rn)
  <-> cond @ 0b01111000 @ rd @ 0b1111 @ rm @ 0b0001 @ rn

// usada8 rd, rn, rm, ra
union clause instruction = USADA8 : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = USADA8(cond, rd, ra, rm, rn)
  <-> cond @ 0b01111000 @ rd @ ra @ rm @ 0b0001 @ rn

// movw rd, #imm
union clause instruction = MOVi16 : (bits(4), bits(4), bits(16))
mapping clause encdec = MOVi16(cond, rd, imm)
  <-> cond @ 0b00110000 @ imm[15..12] @ rd @ imm[11..0]

// movt rd, #imm
union clause instruction = MOVTi16 : (bits(4), bits(4), bits(16))
mapping clause encdec = MOVTi16(cond, rd, imm)
  <-> cond @ 0b00110100 @ imm[15..12] @ rd @ imm[11..0]

// b label
union clause instruction = Bcc : (bits(4), bits(26))
mapping clause encdec = Bcc(cond, label)
  <-> cond @ 0b1010 @ label[25..2]

// bl label
union clause instruction = BL_pred : (bits(4), bits(26))
mapping clause encdec = BL_pred(cond, label)
  <-> cond @ 0b1011 @ label[25..2]

// blx label
union clause instruction = BLXi : (bits(26))
mapping clause encdec = BLXi(label)
  <-> 0b1111101 @ label[1] @ label[25..2]

// bx rm
union clause instruction = BX_pred : (bits(4), bits(4))
mapping clause encdec = BX_pred(cond, rm)
  <-> cond @ 0b00010010 @ 0b111111111111 @ 0b0001 @ rm

// blx rm
union clause instruction = BLX_pred : (bits(4), bits(4))
mapping clause encdec = BLX_pred(cond, rm)
  <-> cond @ 0b00010010 @ 0b111111111111 @ 0b0011 @ rm

// bxj rm
union clause instruction = BXJ : (bits(4), bits(4))
mapping clause encdec = BXJ(cond, rm)
  <-> cond @ 0b00010010 @ 0b111111111111 @ 0b0010 @ rm

// svc #imm
union clause instruction = SVC : (bits(4), bits(24))
mapping clause encdec = SVC(cond, imm)
  <-> cond @ 0b1111 @ imm[23..0]

// bkpt #imm
union clause instruction = BKPT : (bits(16))
mapping clause encdec = BKPT(imm)
  <-> 0b1110 @ 0b00010010 @ imm[15..4] @ 0b0111 @ imm[3..0]

// udf #imm
union clause instruction = UDF : (bits(16))
mapping clause encdec = UDF(imm)
  <-> 0b1110 @ 0b01111111 @ imm[15..4] @ 0b1111 @ imm[3..0]

// hvc #imm
union clause instruction = HVC : (bits(16))
mapping clause encdec = HVC(imm)
  <-> 0b1110 @ 0b00010100 @ imm[15..4] @ 0b0111 @ imm[3..0]

// smc #imm
union clause instruction = SMC : (bits(4), bits(4))
mapping clause encdec = SMC(cond, imm)
  <-> cond @ 0b00010110 @ 0b000000000000 @ 0b0111 @ imm[3..0]

// eret
union clause instruction = ERET : (bits(4))
mapping clause encdec = ERET(cond)
  <-> cond @ 0b00010110 @ 0b000000000000 @ 0b0110 @ 0b1110

// str rt, [rn, #signimm]
union clause instruction = STRi12 : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRi12(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ imm[11..0]

// str rt, [rn, signrm{?, shiftamount}]
union clause instruction = STRrs : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRrs(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// str rt, [rn, #signimm]!
union clause instruction = STR_PRE_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STR_PRE_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ imm[11..0]

// str rt, [rn, signrm{?, shiftamount}]!
union clause instruction = STR_PRE_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STR_PRE_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// str rt, [rn], #signimm
union clause instruction = STR_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STR_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ imm[11..0]

// str rt, [rn], signrm{?, shiftamount}
union clause instruction = STR_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STR_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strt rt, [rn], #signimm
union clause instruction = STRT_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRT_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ imm[11..0]

// strt rt, [rn], signrm{?, shiftamount}
union clause instruction = STRT_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRT_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldr rt, [rn, #signimm]
union clause instruction = LDRi12 : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRi12(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ imm[11..0]

// ldr rt, [rn, signrm{?, shiftamount}]
union clause instruction = LDRrs : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRrs(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldr rt, [rn, #signimm]!
union clause instruction = LDR_PRE_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDR_PRE_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ imm[11..0]

// ldr rt, [rn, signrm{?, shiftamount}]!
union clause instruction = LDR_PRE_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDR_PRE_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldr rt, [rn], #signimm
union clause instruction = LDR_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDR_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ imm[11..0]

// ldr rt, [rn], signrm{?, shiftamount}
union clause instruction = LDR_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDR_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldrt rt, [rn], #signimm
union clause instruction = LDRT_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRT_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrt rt, [rn], signrm{?, shiftamount}
union clause instruction = LDRT_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRT_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strb rt, [rn, #signimm]
union clause instruction = STRBi12 : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRBi12(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ imm[11..0]

// strb rt, [rn, signrm{?, shiftamount}]
union clause instruction = STRBrs : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRBrs(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strb rt, [rn, #signimm]!
union clause instruction = STRB_PRE_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRB_PRE_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ imm[11..0]

// strb rt, [rn, signrm{?, shiftamount}]!
union clause instruction = STRB_PRE_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRB_PRE_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strb rt, [rn], #signimm
union clause instruction = STRB_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRB_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ imm[11..0]

// strb rt, [rn], signrm{?, shiftamount}
union clause instruction = STRB_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRB_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strbt rt, [rn], #signimm
union clause instruction = STRBT_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = STRBT_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ imm[11..0]

// strbt rt, [rn], signrm{?, shiftamount}
union clause instruction = STRBT_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = STRBT_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldrb rt, [rn, #signimm]
union clause instruction = LDRBi12 : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRBi12(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrb rt, [rn, signrm{?, shiftamount}]
union clause instruction = LDRBrs : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRBrs(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldrb rt, [rn, #signimm]!
union clause instruction = LDRB_PRE_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRB_PRE_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrb rt, [rn, signrm{?, shiftamount}]!
union clause instruction = LDRB_PRE_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRB_PRE_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldrb rt, [rn], #signimm
union clause instruction = LDRB_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRB_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrb rt, [rn], signrm{?, shiftamount}
union clause instruction = LDRB_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRB_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// ldrbt rt, [rn], #signimm
union clause instruction = LDRBT_POST_IMM : (bits(4), bits(1), bits(4), bits(4), bits(12))
mapping clause encdec = LDRBT_POST_IMM(cond, sign, rn, rt, imm)
  <-> cond @ 0b010 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[11..0]

// ldrbt rt, [rn], signrm{?, shiftamount}
union clause instruction = LDRBT_POST_REG : (bits(4), bits(1), bits(4), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = LDRBT_POST_REG(cond, sign, rn, rt, amount, shift, rm)
  <-> cond @ 0b011 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ amount @ shift @ 0b0 @ rm

// strh rt, [rn, #signimm]
union clause instruction = STRH_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRH_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// strh rt, [rn, signrm]
union clause instruction = STRH_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRH_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// strh rt, [rn, #signimm]!
union clause instruction = STRH_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRH_PRE_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// strh rt, [rn, signrm]!
union clause instruction = STRH_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRH_PRE_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// strh rt, [rn], #signimm
union clause instruction = STRH_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRH_POST_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// strh rt, [rn], signrm
union clause instruction = STRH_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRH_POST_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrh rt, [rn, #signimm]
union clause instruction = LDRH_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRH_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// ldrh rt, [rn, signrm]
union clause instruction = LDRH_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRH_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrh rt, [rn, #signimm]!
union clause instruction = LDRH_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRH_PRE_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// ldrh rt, [rn, signrm]!
union clause instruction = LDRH_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRH_PRE_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrh rt, [rn], #signimm
union clause instruction = LDRH_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRH_POST_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// ldrh rt, [rn], signrm
union clause instruction = LDRH_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRH_POST_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrsb rt, [rn, #signimm]
union clause instruction = LDRSB_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSB_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrsb rt, [rn, signrm]
union clause instruction = LDRSB_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSB_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1101 @ rm

// ldrsb rt, [rn, #signimm]!
union clause instruction = LDRSB_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSB_PRE_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrsb rt, [rn, signrm]!
union clause instruction = LDRSB_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSB_PRE_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1101 @ rm

// ldrsb rt, [rn], #signimm
union clause instruction = LDRSB_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSB_POST_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrsb rt, [rn], signrm
union clause instruction = LDRSB_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSB_POST_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1101 @ rm

// ldrsh rt, [rn, #signimm]
union clause instruction = LDRSH_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSH_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1111 @ imm[3..0]

// ldrsh rt, [rn, signrm]
union clause instruction = LDRSH_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSH_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1111 @ rm

// ldrsh rt, [rn, #signimm]!
union clause instruction = LDRSH_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSH_PRE_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1111 @ imm[3..0]

// ldrsh rt, [rn, signrm]!
union clause instruction = LDRSH_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSH_PRE_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1111 @ rm

// ldrsh rt, [rn], #signimm
union clause instruction = LDRSH_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSH_POST_i(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1111 @ imm[3..0]

// ldrsh rt, [rn], signrm
union clause instruction = LDRSH_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSH_POST_r(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1111 @ rm

// ldrd rtd, rtd2, [rn, #signimm]
union clause instruction = LDRD_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRD_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrd rtd, rtd2, [rn, signrm]
union clause instruction = LDRD_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRD_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1101 @ rm

// ldrd rtd, rtd2, [rn, #signimm]!
union clause instruction = LDRD_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRD_PRE_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrd rtd, rtd2, [rn, signrm]!
union clause instruction = LDRD_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRD_PRE_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1101 @ rm

// ldrd rtd, rtd2, [rn], #signimm
union clause instruction = LDRD_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRD_POST_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrd rtd, rtd2, [rn], signrm
union clause instruction = LDRD_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRD_POST_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1101 @ rm

// strd rtd, rtd2, [rn, #signimm]
union clause instruction = STRD_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRD_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1111 @ imm[3..0]

// strd rtd, rtd2, [rn, signrm]
union clause instruction = STRD_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRD_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1111 @ rm

// strd rtd, rtd2, [rn, #signimm]!
union clause instruction = STRD_PRE_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRD_PRE_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1111 @ imm[3..0]

// strd rtd, rtd2, [rn, signrm]!
union clause instruction = STRD_PRE_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRD_PRE_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1111 @ rm

// strd rtd, rtd2, [rn], #signimm
union clause instruction = STRD_POST_i : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRD_POST_i(cond, sign, rn, rtd, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ rtd @ imm[7..4] @ 0b1111 @ imm[3..0]

// strd rtd, rtd2, [rn], signrm
union clause instruction = STRD_POST_r : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRD_POST_r(cond, sign, rn, rtd, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ rtd @ 0b0000 @ 0b1111 @ rm

// strht rt, [rn], #signimm
union clause instruction = STRHTi : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = STRHTi(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// strht rt, [rn], signrm
union clause instruction = STRHTr : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = STRHTr(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrht rt, [rn], #signimm
union clause instruction = LDRHTi : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRHTi(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1011 @ imm[3..0]

// ldrht rt, [rn], signrm
union clause instruction = LDRHTr : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRHTr(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1011 @ rm

// ldrsbt rt, [rn], #signimm
union clause instruction = LDRSBTi : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSBTi(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1101 @ imm[3..0]

// ldrsbt rt, [rn], signrm
union clause instruction = LDRSBTr : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSBTr(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1101 @ rm

// ldrsht rt, [rn], #signimm
union clause instruction = LDRSHTi : (bits(4), bits(1), bits(4), bits(4), bits(8))
mapping clause encdec = LDRSHTi(cond, sign, rn, rt, imm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ rt @ imm[7..4] @ 0b1111 @ imm[3..0]

// ldrsht rt, [rn], signrm
union clause instruction = LDRSHTr : (bits(4), bits(1), bits(4), bits(4), bits(4))
mapping clause encdec = LDRSHTr(cond, sign, rn, rt, rm)
  <-> cond @ 0b000 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ rt @ 0b0000 @ 0b1111 @ rm

// ldrex rt, [rn]
union clause instruction = LDREX : (bits(4), bits(4), bits(4))
mapping clause encdec = LDREX(cond, rn, rt)
  <-> cond @ 0b000 @ 0b11001 @ rn @ rt @ 0b1111 @ 0b1001 @ 0b1111

// ldrexd rtd, rtd2, [rn]
union clause instruction = LDREXD : (bits(4), bits(4), bits(4))
mapping clause encdec = LDREXD(cond, rn, rtd)
  <-> cond @ 0b000 @ 0b11011 @ rn @ rtd @ 0b1111 @ 0b1001 @ 0b1111

// ldrexb rt, [rn]
union clause instruction = LDREXB : (bits(4), bits(4), bits(4))
mapping clause encdec = LDREXB(cond, rn, rt)
  <-> cond @ 0b000 @ 0b11101 @ rn @ rt @ 0b1111 @ 0b1001 @ 0b1111

// ldrexh rt, [rn]
union clause instruction = LDREXH : (bits(4), bits(4), bits(4))
mapping clause encdec = LDREXH(cond, rn, rt)
  <-> cond @ 0b000 @ 0b11111 @ rn @ rt @ 0b1111 @ 0b1001 @ 0b1111

// strex rd, rt, [rn]
union clause instruction = STREX : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = STREX(cond, rn, rd, rt)
  <-> cond @ 0b000 @ 0b11000 @ rn @ rd @ 0b1111 @ 0b1001 @ rt

// strexd rd, rtd, rtd2, [rn]
union clause instruction = STREXD : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = STREXD(cond, rn, rd, rtd)
  <-> cond @ 0b000 @ 0b11010 @ rn @ rd @ 0b1111 @ 0b1001 @ rtd

// strexb rd, rt, [rn]
union clause instruction = STREXB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = STREXB(cond, rn, rd, rt)
  <-> cond @ 0b000 @ 0b11100 @ rn @ rd @ 0b1111 @ 0b1001 @ rt

// strexh rd, rt, [rn]
union clause instruction = STREXH : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = STREXH(cond, rn, rd, rt)
  <-> cond @ 0b000 @ 0b11110 @ rn @ rd @ 0b1111 @ 0b1001 @ rt

// swp rt, rt2, [rn]
union clause instruction = SWP : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SWP(cond, rn, rt, rt2)
  <-> cond @ 0b00010000 @ rn @ rt @ 0b0000 @ 0b1001 @ rt2

// swpb rt, rt2, [rn]
union clause instruction = SWPB : (bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = SWPB(cond, rn, rt, rt2)
  <-> cond @ 0b00010100 @ rn @ rt @ 0b0000 @ 0b1001 @ rt2

// stmda rn, reglist
union clause instruction = STMDA : (bits(4), bits(4), bits(16))
mapping clause encdec = STMDA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ rn @ reglist

// stmda rn!, reglist
union clause instruction = STMDA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = STMDA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ 0b0 @ rn @ reglist

// stmda rn, reglist^
union clause instruction = sysSTMDA : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMDA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ rn @ reglist

// stmda rn!, reglist^
union clause instruction = sysSTMDA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMDA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ rn @ reglist

// ldmda rn, reglist
union clause instruction = LDMDA : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMDA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ reglist

// ldmda rn!, reglist
union clause instruction = LDMDA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMDA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ reglist

// ldmda rn, reglist^
union clause instruction = sysLDMDA : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMDA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ rn @ reglist

// ldmda rn!, reglist^
union clause instruction = sysLDMDA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMDA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ 0b1 @ rn @ reglist

// srsda sp, #mode
union clause instruction = SRSDA : (bits(5))
mapping clause encdec = SRSDA(mode)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// srsda sp!, #mode
union clause instruction = SRSDA_UPD : (bits(5))
mapping clause encdec = SRSDA_UPD(mode)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// rfeda rn
union clause instruction = RFEDA : (bits(4))
mapping clause encdec = RFEDA(rn)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// rfeda rn!
union clause instruction = RFEDA_UPD : (bits(4))
mapping clause encdec = RFEDA_UPD(rn)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// stm rn, reglist
union clause instruction = STMIA : (bits(4), bits(4), bits(16))
mapping clause encdec = STMIA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ reglist

// stm rn!, reglist
union clause instruction = STMIA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = STMIA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ rn @ reglist

// stm rn, reglist^
union clause instruction = sysSTMIA : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMIA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ reglist

// stm rn!, reglist^
union clause instruction = sysSTMIA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMIA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ rn @ reglist

// ldm rn, reglist
union clause instruction = LDMIA : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMIA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ reglist

// ldm rn!, reglist
union clause instruction = LDMIA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMIA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ rn @ reglist

// ldm rn, reglist^
union clause instruction = sysLDMIA : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMIA(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ reglist

// ldm rn!, reglist^
union clause instruction = sysLDMIA_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMIA_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b1 @ 0b1 @ rn @ reglist

// srsia sp, #mode
union clause instruction = SRSIA : (bits(5))
mapping clause encdec = SRSIA(mode)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// srsia sp!, #mode
union clause instruction = SRSIA_UPD : (bits(5))
mapping clause encdec = SRSIA_UPD(mode)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// rfeia rn
union clause instruction = RFEIA : (bits(4))
mapping clause encdec = RFEIA(rn)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// rfeia rn!
union clause instruction = RFEIA_UPD : (bits(4))
mapping clause encdec = RFEIA_UPD(rn)
  <-> 0b1111 @ 0b100 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// stmdb rn, reglist
union clause instruction = STMDB : (bits(4), bits(4), bits(16))
mapping clause encdec = STMDB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ 0b0 @ rn @ reglist

// stmdb rn!, reglist
union clause instruction = STMDB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = STMDB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ 0b0 @ rn @ reglist

// stmdb rn, reglist^
union clause instruction = sysSTMDB : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMDB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ rn @ reglist

// stmdb rn!, reglist^
union clause instruction = sysSTMDB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMDB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ rn @ reglist

// ldmdb rn, reglist
union clause instruction = LDMDB : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMDB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ reglist

// ldmdb rn!, reglist
union clause instruction = LDMDB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMDB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ reglist

// ldmdb rn, reglist^
union clause instruction = sysLDMDB : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMDB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ 0b1 @ rn @ reglist

// ldmdb rn!, reglist^
union clause instruction = sysLDMDB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMDB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ 0b1 @ rn @ reglist

// srsdb sp, #mode
union clause instruction = SRSDB : (bits(5))
mapping clause encdec = SRSDB(mode)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// srsdb sp!, #mode
union clause instruction = SRSDB_UPD : (bits(5))
mapping clause encdec = SRSDB_UPD(mode)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// rfedb rn
union clause instruction = RFEDB : (bits(4))
mapping clause encdec = RFEDB(rn)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// rfedb rn!
union clause instruction = RFEDB_UPD : (bits(4))
mapping clause encdec = RFEDB_UPD(rn)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// stmib rn, reglist
union clause instruction = STMIB : (bits(4), bits(4), bits(16))
mapping clause encdec = STMIB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ reglist

// stmib rn!, reglist
union clause instruction = STMIB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = STMIB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ 0b0 @ rn @ reglist

// stmib rn, reglist^
union clause instruction = sysSTMIB : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMIB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ reglist

// stmib rn!, reglist^
union clause instruction = sysSTMIB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysSTMIB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ rn @ reglist

// ldmib rn, reglist
union clause instruction = LDMIB : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMIB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ reglist

// ldmib rn!, reglist
union clause instruction = LDMIB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = LDMIB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ rn @ reglist

// ldmib rn, reglist^
union clause instruction = sysLDMIB : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMIB(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ reglist

// ldmib rn!, reglist^
union clause instruction = sysLDMIB_UPD : (bits(4), bits(4), bits(16))
mapping clause encdec = sysLDMIB_UPD(cond, rn, reglist)
  <-> cond @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b1 @ 0b1 @ rn @ reglist

// srsib sp, #mode
union clause instruction = SRSIB : (bits(5))
mapping clause encdec = SRSIB(mode)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// srsib sp!, #mode
union clause instruction = SRSIB_UPD : (bits(5))
mapping clause encdec = SRSIB_UPD(mode)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b1 @ 0b1 @ 0b1 @ 0b0 @ 0b1101 @ 0b0000 @ 0b0101 @ 0b000 @ mode

// rfeib rn
union clause instruction = RFEIB : (bits(4))
mapping clause encdec = RFEIB(rn)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// rfeib rn!
union clause instruction = RFEIB_UPD : (bits(4))
mapping clause encdec = RFEIB_UPD(rn)
  <-> 0b1111 @ 0b100 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ 0b1 @ rn @ 0b0000 @ 0b1010 @ 0b00000000

// cdp cp, #opc1, cd, cn, cm, #opc2
union clause instruction = CDP : (bits(4), bits(4), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = CDP(cond, opc1, cn, cd, cp, opc2, cm)
  <-> cond @ 0b1110 @ opc1 @ cn @ cd @ cp @ opc2 @ 0b0 @ cm

// mcr cp, #copc1, rt, cn, cm, #opc2
union clause instruction = MCR : (bits(4), bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = MCR(cond, copc1, cn, rt, cp, opc2, cm)
  <-> cond @ 0b1110 @ copc1 @ 0b0 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mrc cp, #copc1, rt, cn, cm, #opc2
union clause instruction = MRC : (bits(4), bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = MRC(cond, copc1, cn, rt, cp, opc2, cm)
  <-> cond @ 0b1110 @ copc1 @ 0b1 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mcrr cp, #opc4, rt, rt2, cm
union clause instruction = MCRR : (bits(4), bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MCRR(cond, rt2, rt, cp, opc4, cm)
  <-> cond @ 0b11000100 @ rt2 @ rt @ cp @ opc4 @ cm

// mrrc cp, #opc4, rt, rt2, cm
union clause instruction = MRRC : (bits(4), bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MRRC(cond, rt2, rt, cp, opc4, cm)
  <-> cond @ 0b11000101 @ rt2 @ rt @ cp @ opc4 @ cm

// stc cp, cd, [rn, #signcimm]
union clause instruction = STC_OFFSET : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC_OFFSET(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn, #signcimm]!
union clause instruction = STC_PRE : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC_PRE(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn], #signcimm
union clause instruction = STC_POST : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC_POST(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc cp, cd, [rn], {coption}
union clause instruction = STC_OPTION : (bits(4), bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = STC_OPTION(cond, rn, cd, cp, coption)
  <-> cond @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// stcl cp, cd, [rn, #signcimm]
union clause instruction = STCL_OFFSET : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STCL_OFFSET(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn, #signcimm]!
union clause instruction = STCL_PRE : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STCL_PRE(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn], #signcimm
union clause instruction = STCL_POST : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STCL_POST(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stcl cp, cd, [rn], {coption}
union clause instruction = STCL_OPTION : (bits(4), bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = STCL_OPTION(cond, rn, cd, cp, coption)
  <-> cond @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// ldc cp, cd, [rn, #signcimm]
union clause instruction = LDC_OFFSET : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC_OFFSET(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn, #signcimm]!
union clause instruction = LDC_PRE : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC_PRE(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn], #signcimm
union clause instruction = LDC_POST : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC_POST(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc cp, cd, [rn], {coption}
union clause instruction = LDC_OPTION : (bits(4), bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = LDC_OPTION(cond, rn, cd, cp, coption)
  <-> cond @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// ldcl cp, cd, [rn, #signcimm]
union clause instruction = LDCL_OFFSET : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDCL_OFFSET(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn, #signcimm]!
union clause instruction = LDCL_PRE : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDCL_PRE(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn], #signcimm
union clause instruction = LDCL_POST : (bits(4), bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDCL_POST(cond, sign, rn, cd, cp, cimm)
  <-> cond @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldcl cp, cd, [rn], {coption}
union clause instruction = LDCL_OPTION : (bits(4), bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = LDCL_OPTION(cond, rn, cd, cp, coption)
  <-> cond @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// cdp2 cp, #opc1, cd, cn, cm, #opc2
union clause instruction = CDP2 : (bits(4), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = CDP2(opc1, cn, cd, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ opc1 @ cn @ cd @ cp @ opc2 @ 0b0 @ cm

// mcr2 cp, #copc1, rt, cn, cm, #opc2
union clause instruction = MCR2 : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = MCR2(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ copc1 @ 0b0 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mrc2 cp, #copc1, rt, cn, cm, #opc2
union clause instruction = MRC2 : (bits(3), bits(4), bits(4), bits(4), bits(3), bits(4))
mapping clause encdec = MRC2(copc1, cn, rt, cp, opc2, cm)
  <-> 0b1111 @ 0b1110 @ copc1 @ 0b1 @ cn @ rt @ cp @ opc2 @ 0b1 @ cm

// mcrr2 cp, #opc4, rt, rt2, cm
union clause instruction = MCRR2 : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MCRR2(rt2, rt, cp, opc4, cm)
  <-> 0b1111 @ 0b11000100 @ rt2 @ rt @ cp @ opc4 @ cm

// mrrc2 cp, #opc4, rt, rt2, cm
union clause instruction = MRRC2 : (bits(4), bits(4), bits(4), bits(4), bits(4))
mapping clause encdec = MRRC2(rt2, rt, cp, opc4, cm)
  <-> 0b1111 @ 0b11000101 @ rt2 @ rt @ cp @ opc4 @ cm

// stc2 cp, cd, [rn, #signcimm]
union clause instruction = STC2_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn, #signcimm]!
union clause instruction = STC2_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn], #signcimm
union clause instruction = STC2_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2 cp, cd, [rn], {coption}
union clause instruction = STC2_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = STC2_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// stc2l cp, cd, [rn, #signcimm]
union clause instruction = STC2L_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2L_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn, #signcimm]!
union clause instruction = STC2L_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2L_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn], #signcimm
union clause instruction = STC2L_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = STC2L_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b0 @ rn @ cd @ cp @ cimm[9..2]

// stc2l cp, cd, [rn], {coption}
union clause instruction = STC2L_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = STC2L_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b0 @ rn @ cd @ cp @ coption

// ldc2 cp, cd, [rn, #signcimm]
union clause instruction = LDC2_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn, #signcimm]!
union clause instruction = LDC2_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn], #signcimm
union clause instruction = LDC2_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b0 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2 cp, cd, [rn], {coption}
union clause instruction = LDC2_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = LDC2_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b0 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// ldc2l cp, cd, [rn, #signcimm]
union clause instruction = LDC2L_OFFSET : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2L_OFFSET(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn, #signcimm]!
union clause instruction = LDC2L_PRE : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2L_PRE(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b1 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn], #signcimm
union clause instruction = LDC2L_POST : (bits(1), bits(4), bits(4), bits(4), bits(10))
mapping clause encdec = LDC2L_POST(sign, rn, cd, cp, cimm)
  <-> 0b1111 @ 0b110 @ 0b0 @ sign @ 0b1 @ 0b1 @ 0b1 @ rn @ cd @ cp @ cimm[9..2]

// ldc2l cp, cd, [rn], {coption}
union clause instruction = LDC2L_OPTION : (bits(4), bits(4), bits(4), bits(8))
mapping clause encdec = LDC2L_OPTION(rn, cd, cp, coption)
  <-> 0b1111 @ 0b110 @ 0b0 @ 0b1 @ 0b1 @ 0b0 @ 0b1 @ rn @ cd @ cp @ coption

// mrs rd, APSR
union clause instruction = MRS : (bits(4), bits(4))
mapping clause encdec = MRS(cond, rd)
  <-> cond @ 0b00010000 @ 0b1111 @ rd @ 0b000000000000

// mrs rd, SPSR
union clause instruction = MRSsys : (bits(4), bits(4))
mapping clause encdec = MRSsys(cond, rd)
  <-> cond @ 0b00010100 @ 0b1111 @ rd @ 0b000000000000

// msr psrmsk, rn
union clause instruction = MSR : (bits(4), bits(1), bits(4), bits(4))
mapping clause encdec = MSR(cond, psr, msk, rn)
  <-> cond @ 0b00010 @ psr @ 0b10 @ msk @ 0b1111 @ 0b00000000 @ rn

// msr psrmsk, #mimm
union clause instruction = MSRi : (bits(4), bits(1), bits(4), bits(12))
mapping clause encdec = MSRi(cond, psr, msk, mimm)
  <-> cond @ 0b00110 @ psr @ 0b10 @ msk @ 0b1111 @ mimm

// cpsie iflags
union clause instruction = CPS2p : (bits(2), bits(3))
mapping clause encdec = CPS2p(imod, iflags)
  <-> 0b1111 @ 0b00010000 @ imod @ 0b0 @ 0b0000000 @ 0b0 @ iflags @ 0b0 @ 0b00000

// cpsie iflags, #mode
union clause instruction = CPS3p : (bits(2), bits(3), bits(5))
mapping clause encdec = CPS3p(imod, iflags, mode)
  <-> 0b1111 @ 0b00010000 @ imod @ 0b1 @ 0b0000000 @ 0b0 @ iflags @ 0b0 @ mode

// cps #mode
union clause instruction = CPS1p : (bits(5))
mapping clause encdec = CPS1p(mode)
  <-> 0b1111 @ 0b00010000 @ 0b00 @ 0b1 @ 0b0000000 @ 0b0 @ 0b000 @ 0b0 @ mode

// setend endian
union clause instruction = SETEND : (bits(1))
mapping clause encdec = SETEND(endian)
  <-> 0b1111 @ 0b00010000 @ 0b0001 @ 0b000000 @ endian @ 0b0 @ 0b0000 @ 0b0000

// hint #imm
union clause instruction = HINT : (bits(4), bits(8))
mapping clause encdec = HINT(cond, imm)
  <-> cond @ 0b00110010 @ 0b0000 @ 0b1111 @ 0b0000 @ imm[7..0]

// dbg #imm
union clause instruction = DBG : (bits(4), bits(4))
mapping clause encdec = DBG(cond, imm)
  <-> cond @ 0b00110010 @ 0b0000 @ 0b1111 @ 0b0000 @ 0b1111 @ imm[3..0]

// clrex
union clause instruction = CLREX : unit
mapping clause encdec = CLREX()
  <-> 0b1111 @ 0b01010111 @ 0b1111 @ 0b1111 @ 0b0000 @ 0b0001 @ 0b1111

// dsb barrier
union clause instruction = DSB : (bits(4))
mapping clause encdec = DSB(barrier)
  <-> 0b1111 @ 0b01010111 @ 0b1111 @ 0b1111 @ 0b0000 @ 0b0100 @ barrier

// dmb barrier
union clause instruction = DMB : (bits(4))
mapping clause encdec = DMB(barrier)
  <-> 0b1111 @ 0b01010111 @ 0b1111 @ 0b1111 @ 0b0000 @ 0b0101 @ barrier

// isb {?isbopt}
union clause instruction = ISB : (bits(4))
mapping clause encdec = ISB(isbopt)
  <-> 0b1111 @ 0b01010111 @ 0b1111 @ 0b1111 @ 0b0000 @ 0b0110 @ isbopt

// pld [rn, #signimm]
union clause instruction = PLDi12 : (bits(1), bits(4), bits(12))
mapping clause encdec = PLDi12(sign, rn, imm)
  <-> 0b1111 @ 0b0101 @ sign @ 0b1 @ 0b01 @ rn @ 0b1111 @ imm[11..0]

// pld [rn, signrm{?, shiftamount}]
union clause instruction = PLDrs : (bits(1), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = PLDrs(sign, rn, amount, shift, rm)
  <-> 0b1111 @ 0b0111 @ sign @ 0b1 @ 0b01 @ rn @ 0b1111 @ amount @ shift @ 0b0 @ rm

// pldw [rn, #signimm]
union clause instruction = PLDWi12 : (bits(1), bits(4), bits(12))
mapping clause encdec = PLDWi12(sign, rn, imm)
  <-> 0b1111 @ 0b0101 @ sign @ 0b0 @ 0b01 @ rn @ 0b1111 @ imm[11..0]

// pldw [rn, signrm{?, shiftamount}]
union clause instruction = PLDWrs : (bits(1), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = PLDWrs(sign, rn, amount, shift, rm)
  <-> 0b1111 @ 0b0111 @ sign @ 0b0 @ 0b01 @ rn @ 0b1111 @ amount @ shift @ 0b0 @ rm

// pli [rn, #signimm]
union clause instruction = PLIi12 : (bits(1), bits(4), bits(12))
mapping clause encdec = PLIi12(sign, rn, imm)
  <-> 0b1111 @ 0b0100 @ sign @ 0b101 @ rn @ 0b1111 @ imm[11..0]

// pli [rn, signrm{?, shiftamount}]
union clause instruction = PLIrs : (bits(1), bits(4), bits(5), bits(2), bits(4))
mapping clause encdec = PLIrs(sign, rn, amount, shift, rm)
  <-> 0b1111 @ 0b0110 @ sign @ 0b101 @ rn @ 0b1111 @ amount @ shift @ 0b0 @ rm

end instruction
