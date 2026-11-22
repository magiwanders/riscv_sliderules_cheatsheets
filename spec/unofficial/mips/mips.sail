// MIPS32 and MIPS64 (Release 2), the CPU instructions: encodings and assembly syntax.
//
// UNOFFICIAL. Written for the RISC-V Sliderules (https://github.com/magiwanders/riscv_sliderules_cheatsheets) from the
// instruction descriptions of MIPS Technologies' MIPS32 and MIPS64 Architecture For Programmers, Volume II-A (Release 2).
// There is no Sail model of these: this one is checked bit by bit against LLVM's Mips TableGen description (clause names
// are LLVM's instruction names) and by assembling every instruction with GNU as and llvm-mc (npm test). Licensed
// CC BY-SA 4.0 like the sheets.
//
// Only the decode / encode side of a model: union clauses, encdec and assembly mappings, no execute clauses, and not
// checked by the Sail compiler. Fields keep the manual's names but where one name means different things: creg for a
// coprocessor register (the manual's rd of MFC0, rt of LWC2), hwr for RDHWR's hardware register, code20 for the 20 bit
// code of SYSCALL and SDBBP, imm / uimm for signed / unsigned immediates. Branch offsets and jump targets are numbered
// as the byte values they stand for (offset[17..2], target[27..2]). Instructions only MIPS64 has are marked // MIPS64.

scattered union instruction

// sll rd, rt, sa
union clause instruction = SLL : (bits(5), bits(5), bits(5))
mapping clause encdec = SLL(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b000000
mapping clause assembly = SLL(rt, rd, sa)
  <-> "sll" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// srl rd, rt, sa
union clause instruction = SRL : (bits(5), bits(5), bits(5))
mapping clause encdec = SRL(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b000010
mapping clause assembly = SRL(rt, rd, sa)
  <-> "srl" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// rotr rd, rt, sa
union clause instruction = ROTR : (bits(5), bits(5), bits(5))
mapping clause encdec = ROTR(rt, rd, sa)
  <-> 0b000000 @ 0b00001 @ rt @ rd @ sa @ 0b000010
mapping clause assembly = ROTR(rt, rd, sa)
  <-> "rotr" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// sra rd, rt, sa
union clause instruction = SRA : (bits(5), bits(5), bits(5))
mapping clause encdec = SRA(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b000011
mapping clause assembly = SRA(rt, rd, sa)
  <-> "sra" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// sllv rd, rt, rs
union clause instruction = SLLV : (bits(5), bits(5), bits(5))
mapping clause encdec = SLLV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b000100
mapping clause assembly = SLLV(rs, rt, rd)
  <-> "sllv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// srlv rd, rt, rs
union clause instruction = SRLV : (bits(5), bits(5), bits(5))
mapping clause encdec = SRLV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b000110
mapping clause assembly = SRLV(rs, rt, rd)
  <-> "srlv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// rotrv rd, rt, rs
union clause instruction = ROTRV : (bits(5), bits(5), bits(5))
mapping clause encdec = ROTRV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00001 @ 0b000110
mapping clause assembly = ROTRV(rs, rt, rd)
  <-> "rotrv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// srav rd, rt, rs
union clause instruction = SRAV : (bits(5), bits(5), bits(5))
mapping clause encdec = SRAV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b000111
mapping clause assembly = SRAV(rs, rt, rd)
  <-> "srav" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// jr rs
union clause instruction = JR : (bits(5))
mapping clause encdec = JR(rs)
  <-> 0b000000 @ rs @ 0b0000000000 @ 0b00000 @ 0b001000
mapping clause assembly = JR(rs)
  <-> "jr" ^ spc() ^ reg_name(rs)

// jr.hb rs
union clause instruction = JR_HB : (bits(5))
mapping clause encdec = JR_HB(rs)
  <-> 0b000000 @ rs @ 0b0000000000 @ 0b10000 @ 0b001000
mapping clause assembly = JR_HB(rs)
  <-> "jr.hb" ^ spc() ^ reg_name(rs)

// jalr rd, rs
union clause instruction = JALR : (bits(5), bits(5))
mapping clause encdec = JALR(rs, rd)
  <-> 0b000000 @ rs @ 0b00000 @ rd @ 0b00000 @ 0b001001
mapping clause assembly = JALR(rs, rd)
  <-> "jalr" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// jalr.hb rd, rs
union clause instruction = JALR_HB : (bits(5), bits(5))
mapping clause encdec = JALR_HB(rs, rd)
  <-> 0b000000 @ rs @ 0b00000 @ rd @ 0b10000 @ 0b001001
mapping clause assembly = JALR_HB(rs, rd)
  <-> "jalr.hb" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// movz rd, rs, rt
union clause instruction = MOVZ_I_I : (bits(5), bits(5), bits(5))
mapping clause encdec = MOVZ_I_I(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b001010
mapping clause assembly = MOVZ_I_I(rs, rt, rd)
  <-> "movz" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// movn rd, rs, rt
union clause instruction = MOVN_I_I : (bits(5), bits(5), bits(5))
mapping clause encdec = MOVN_I_I(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b001011
mapping clause assembly = MOVN_I_I(rs, rt, rd)
  <-> "movn" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// syscall code20
union clause instruction = SYSCALL : (bits(20))
mapping clause encdec = SYSCALL(code20)
  <-> 0b000000 @ code20 @ 0b001100
mapping clause assembly = SYSCALL(code20)
  <-> "syscall" ^ spc() ^ hex_bits(code20)

// break code, code2
union clause instruction = BREAK : (bits(10), bits(10))
mapping clause encdec = BREAK(code, code2)
  <-> 0b000000 @ code @ code2 @ 0b001101
mapping clause assembly = BREAK(code, code2)
  <-> "break" ^ spc() ^ hex_bits(code) ^ sep() ^ hex_bits(code2)

// sync stype
union clause instruction = SYNC : (bits(5))
mapping clause encdec = SYNC(stype)
  <-> 0b000000 @ 0b000000000000000 @ stype @ 0b001111
mapping clause assembly = SYNC(stype)
  <-> "sync" ^ spc() ^ hex_bits(stype)

// mfhi rd
union clause instruction = MFHI : (bits(5))
mapping clause encdec = MFHI(rd)
  <-> 0b000000 @ 0b0000000000 @ rd @ 0b00000 @ 0b010000
mapping clause assembly = MFHI(rd)
  <-> "mfhi" ^ spc() ^ reg_name(rd)

// mthi rs
union clause instruction = MTHI : (bits(5))
mapping clause encdec = MTHI(rs)
  <-> 0b000000 @ rs @ 0b000000000000000 @ 0b010001
mapping clause assembly = MTHI(rs)
  <-> "mthi" ^ spc() ^ reg_name(rs)

// mflo rd
union clause instruction = MFLO : (bits(5))
mapping clause encdec = MFLO(rd)
  <-> 0b000000 @ 0b0000000000 @ rd @ 0b00000 @ 0b010010
mapping clause assembly = MFLO(rd)
  <-> "mflo" ^ spc() ^ reg_name(rd)

// mtlo rs
union clause instruction = MTLO : (bits(5))
mapping clause encdec = MTLO(rs)
  <-> 0b000000 @ rs @ 0b000000000000000 @ 0b010011
mapping clause assembly = MTLO(rs)
  <-> "mtlo" ^ spc() ^ reg_name(rs)

// dsllv rd, rt, rs (MIPS64)
union clause instruction = DSLLV : (bits(5), bits(5), bits(5))
mapping clause encdec = DSLLV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b010100
mapping clause assembly = DSLLV(rs, rt, rd)
  <-> "dsllv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// dsrlv rd, rt, rs (MIPS64)
union clause instruction = DSRLV : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRLV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b010110
mapping clause assembly = DSRLV(rs, rt, rd)
  <-> "dsrlv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// drotrv rd, rt, rs (MIPS64)
union clause instruction = DROTRV : (bits(5), bits(5), bits(5))
mapping clause encdec = DROTRV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00001 @ 0b010110
mapping clause assembly = DROTRV(rs, rt, rd)
  <-> "drotrv" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// dsrav rd, rt, rs (MIPS64)
union clause instruction = DSRAV : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRAV(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b010111
mapping clause assembly = DSRAV(rs, rt, rd)
  <-> "dsrav" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ reg_name(rs)

// mult rs, rt
union clause instruction = MULT : (bits(5), bits(5))
mapping clause encdec = MULT(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011000
mapping clause assembly = MULT(rs, rt)
  <-> "mult" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// multu rs, rt
union clause instruction = MULTu : (bits(5), bits(5))
mapping clause encdec = MULTu(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011001
mapping clause assembly = MULTu(rs, rt)
  <-> "multu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// div rs, rt
union clause instruction = SDIV : (bits(5), bits(5))
mapping clause encdec = SDIV(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011010
mapping clause assembly = SDIV(rs, rt)
  <-> "div" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// divu rs, rt
union clause instruction = UDIV : (bits(5), bits(5))
mapping clause encdec = UDIV(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011011
mapping clause assembly = UDIV(rs, rt)
  <-> "divu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// dmult rs, rt (MIPS64)
union clause instruction = DMULT : (bits(5), bits(5))
mapping clause encdec = DMULT(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011100
mapping clause assembly = DMULT(rs, rt)
  <-> "dmult" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// dmultu rs, rt (MIPS64)
union clause instruction = DMULTu : (bits(5), bits(5))
mapping clause encdec = DMULTu(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011101
mapping clause assembly = DMULTu(rs, rt)
  <-> "dmultu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// ddiv rs, rt (MIPS64)
union clause instruction = DSDIV : (bits(5), bits(5))
mapping clause encdec = DSDIV(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011110
mapping clause assembly = DSDIV(rs, rt)
  <-> "ddiv" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// ddivu rs, rt (MIPS64)
union clause instruction = DUDIV : (bits(5), bits(5))
mapping clause encdec = DUDIV(rs, rt)
  <-> 0b000000 @ rs @ rt @ 0b0000000000 @ 0b011111
mapping clause assembly = DUDIV(rs, rt)
  <-> "ddivu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// add rd, rs, rt
union clause instruction = ADD : (bits(5), bits(5), bits(5))
mapping clause encdec = ADD(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100000
mapping clause assembly = ADD(rs, rt, rd)
  <-> "add" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// addu rd, rs, rt
union clause instruction = ADDu : (bits(5), bits(5), bits(5))
mapping clause encdec = ADDu(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100001
mapping clause assembly = ADDu(rs, rt, rd)
  <-> "addu" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// sub rd, rs, rt
union clause instruction = SUB : (bits(5), bits(5), bits(5))
mapping clause encdec = SUB(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100010
mapping clause assembly = SUB(rs, rt, rd)
  <-> "sub" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// subu rd, rs, rt
union clause instruction = SUBu : (bits(5), bits(5), bits(5))
mapping clause encdec = SUBu(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100011
mapping clause assembly = SUBu(rs, rt, rd)
  <-> "subu" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// and rd, rs, rt
union clause instruction = AND : (bits(5), bits(5), bits(5))
mapping clause encdec = AND(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100100
mapping clause assembly = AND(rs, rt, rd)
  <-> "and" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// or rd, rs, rt
union clause instruction = OR : (bits(5), bits(5), bits(5))
mapping clause encdec = OR(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100101
mapping clause assembly = OR(rs, rt, rd)
  <-> "or" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// xor rd, rs, rt
union clause instruction = XOR : (bits(5), bits(5), bits(5))
mapping clause encdec = XOR(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100110
mapping clause assembly = XOR(rs, rt, rd)
  <-> "xor" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// nor rd, rs, rt
union clause instruction = NOR : (bits(5), bits(5), bits(5))
mapping clause encdec = NOR(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b100111
mapping clause assembly = NOR(rs, rt, rd)
  <-> "nor" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// slt rd, rs, rt
union clause instruction = SLT : (bits(5), bits(5), bits(5))
mapping clause encdec = SLT(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101010
mapping clause assembly = SLT(rs, rt, rd)
  <-> "slt" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// sltu rd, rs, rt
union clause instruction = SLTu : (bits(5), bits(5), bits(5))
mapping clause encdec = SLTu(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101011
mapping clause assembly = SLTu(rs, rt, rd)
  <-> "sltu" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// dadd rd, rs, rt (MIPS64)
union clause instruction = DADD : (bits(5), bits(5), bits(5))
mapping clause encdec = DADD(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101100
mapping clause assembly = DADD(rs, rt, rd)
  <-> "dadd" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// daddu rd, rs, rt (MIPS64)
union clause instruction = DADDu : (bits(5), bits(5), bits(5))
mapping clause encdec = DADDu(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101101
mapping clause assembly = DADDu(rs, rt, rd)
  <-> "daddu" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// dsub rd, rs, rt (MIPS64)
union clause instruction = DSUB : (bits(5), bits(5), bits(5))
mapping clause encdec = DSUB(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101110
mapping clause assembly = DSUB(rs, rt, rd)
  <-> "dsub" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// dsubu rd, rs, rt (MIPS64)
union clause instruction = DSUBu : (bits(5), bits(5), bits(5))
mapping clause encdec = DSUBu(rs, rt, rd)
  <-> 0b000000 @ rs @ rt @ rd @ 0b00000 @ 0b101111
mapping clause assembly = DSUBu(rs, rt, rd)
  <-> "dsubu" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// tge rs, rt, code
union clause instruction = TGE : (bits(5), bits(5), bits(10))
mapping clause encdec = TGE(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110000
mapping clause assembly = TGE(rs, rt, code)
  <-> "tge" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// tgeu rs, rt, code
union clause instruction = TGEU : (bits(5), bits(5), bits(10))
mapping clause encdec = TGEU(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110001
mapping clause assembly = TGEU(rs, rt, code)
  <-> "tgeu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// tlt rs, rt, code
union clause instruction = TLT : (bits(5), bits(5), bits(10))
mapping clause encdec = TLT(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110010
mapping clause assembly = TLT(rs, rt, code)
  <-> "tlt" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// tltu rs, rt, code
union clause instruction = TLTU : (bits(5), bits(5), bits(10))
mapping clause encdec = TLTU(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110011
mapping clause assembly = TLTU(rs, rt, code)
  <-> "tltu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// teq rs, rt, code
union clause instruction = TEQ : (bits(5), bits(5), bits(10))
mapping clause encdec = TEQ(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110100
mapping clause assembly = TEQ(rs, rt, code)
  <-> "teq" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// tne rs, rt, code
union clause instruction = TNE : (bits(5), bits(5), bits(10))
mapping clause encdec = TNE(rs, rt, code)
  <-> 0b000000 @ rs @ rt @ code @ 0b110110
mapping clause assembly = TNE(rs, rt, code)
  <-> "tne" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(code)

// dsll rd, rt, sa (MIPS64)
union clause instruction = DSLL : (bits(5), bits(5), bits(5))
mapping clause encdec = DSLL(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111000
mapping clause assembly = DSLL(rt, rd, sa)
  <-> "dsll" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// dsrl rd, rt, sa (MIPS64)
union clause instruction = DSRL : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRL(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111010
mapping clause assembly = DSRL(rt, rd, sa)
  <-> "dsrl" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// drotr rd, rt, sa (MIPS64)
union clause instruction = DROTR : (bits(5), bits(5), bits(5))
mapping clause encdec = DROTR(rt, rd, sa)
  <-> 0b000000 @ 0b00001 @ rt @ rd @ sa @ 0b111010
mapping clause assembly = DROTR(rt, rd, sa)
  <-> "drotr" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// dsra rd, rt, sa (MIPS64)
union clause instruction = DSRA : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRA(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111011
mapping clause assembly = DSRA(rt, rd, sa)
  <-> "dsra" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// dsll32 rd, rt, sa (MIPS64)
union clause instruction = DSLL32 : (bits(5), bits(5), bits(5))
mapping clause encdec = DSLL32(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111100
mapping clause assembly = DSLL32(rt, rd, sa)
  <-> "dsll32" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// dsrl32 rd, rt, sa (MIPS64)
union clause instruction = DSRL32 : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRL32(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111110
mapping clause assembly = DSRL32(rt, rd, sa)
  <-> "dsrl32" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// drotr32 rd, rt, sa (MIPS64)
union clause instruction = DROTR32 : (bits(5), bits(5), bits(5))
mapping clause encdec = DROTR32(rt, rd, sa)
  <-> 0b000000 @ 0b00001 @ rt @ rd @ sa @ 0b111110
mapping clause assembly = DROTR32(rt, rd, sa)
  <-> "drotr32" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// dsra32 rd, rt, sa (MIPS64)
union clause instruction = DSRA32 : (bits(5), bits(5), bits(5))
mapping clause encdec = DSRA32(rt, rd, sa)
  <-> 0b000000 @ 0b00000 @ rt @ rd @ sa @ 0b111111
mapping clause assembly = DSRA32(rt, rd, sa)
  <-> "dsra32" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(sa)

// ssnop
union clause instruction = SSNOP : unit
mapping clause encdec = SSNOP()
  <-> 0b000000 @ 0b00000 @ 0b00000 @ 0b00000 @ 0b00001 @ 0b000000
mapping clause assembly = SSNOP()
  <-> "ssnop"

// ehb
union clause instruction = EHB : unit
mapping clause encdec = EHB()
  <-> 0b000000 @ 0b00000 @ 0b00000 @ 0b00000 @ 0b00011 @ 0b000000
mapping clause assembly = EHB()
  <-> "ehb"

// pause
union clause instruction = PAUSE : unit
mapping clause encdec = PAUSE()
  <-> 0b000000 @ 0b00000 @ 0b00000 @ 0b00000 @ 0b00101 @ 0b000000
mapping clause assembly = PAUSE()
  <-> "pause"

// bltz rs, offset
union clause instruction = BLTZ : (bits(5), bits(18))
mapping clause encdec = BLTZ(rs, offset)
  <-> 0b000001 @ rs @ 0b00000 @ offset[17..2]
mapping clause assembly = BLTZ(rs, offset)
  <-> "bltz" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgez rs, offset
union clause instruction = BGEZ : (bits(5), bits(18))
mapping clause encdec = BGEZ(rs, offset)
  <-> 0b000001 @ rs @ 0b00001 @ offset[17..2]
mapping clause assembly = BGEZ(rs, offset)
  <-> "bgez" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bltzl rs, offset
union clause instruction = BLTZL : (bits(5), bits(18))
mapping clause encdec = BLTZL(rs, offset)
  <-> 0b000001 @ rs @ 0b00010 @ offset[17..2]
mapping clause assembly = BLTZL(rs, offset)
  <-> "bltzl" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgezl rs, offset
union clause instruction = BGEZL : (bits(5), bits(18))
mapping clause encdec = BGEZL(rs, offset)
  <-> 0b000001 @ rs @ 0b00011 @ offset[17..2]
mapping clause assembly = BGEZL(rs, offset)
  <-> "bgezl" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bltzal rs, offset
union clause instruction = BLTZAL : (bits(5), bits(18))
mapping clause encdec = BLTZAL(rs, offset)
  <-> 0b000001 @ rs @ 0b10000 @ offset[17..2]
mapping clause assembly = BLTZAL(rs, offset)
  <-> "bltzal" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgezal rs, offset
union clause instruction = BGEZAL : (bits(5), bits(18))
mapping clause encdec = BGEZAL(rs, offset)
  <-> 0b000001 @ rs @ 0b10001 @ offset[17..2]
mapping clause assembly = BGEZAL(rs, offset)
  <-> "bgezal" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bltzall rs, offset
union clause instruction = BLTZALL : (bits(5), bits(18))
mapping clause encdec = BLTZALL(rs, offset)
  <-> 0b000001 @ rs @ 0b10010 @ offset[17..2]
mapping clause assembly = BLTZALL(rs, offset)
  <-> "bltzall" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgezall rs, offset
union clause instruction = BGEZALL : (bits(5), bits(18))
mapping clause encdec = BGEZALL(rs, offset)
  <-> 0b000001 @ rs @ 0b10011 @ offset[17..2]
mapping clause assembly = BGEZALL(rs, offset)
  <-> "bgezall" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// tgei rs, imm
union clause instruction = TGEI : (bits(5), bits(16))
mapping clause encdec = TGEI(rs, imm)
  <-> 0b000001 @ rs @ 0b01000 @ imm
mapping clause assembly = TGEI(rs, imm)
  <-> "tgei" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// tgeiu rs, imm
union clause instruction = TGEIU : (bits(5), bits(16))
mapping clause encdec = TGEIU(rs, imm)
  <-> 0b000001 @ rs @ 0b01001 @ imm
mapping clause assembly = TGEIU(rs, imm)
  <-> "tgeiu" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// tlti rs, imm
union clause instruction = TLTI : (bits(5), bits(16))
mapping clause encdec = TLTI(rs, imm)
  <-> 0b000001 @ rs @ 0b01010 @ imm
mapping clause assembly = TLTI(rs, imm)
  <-> "tlti" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// tltiu rs, imm
union clause instruction = TTLTIU : (bits(5), bits(16))
mapping clause encdec = TTLTIU(rs, imm)
  <-> 0b000001 @ rs @ 0b01011 @ imm
mapping clause assembly = TTLTIU(rs, imm)
  <-> "tltiu" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// teqi rs, imm
union clause instruction = TEQI : (bits(5), bits(16))
mapping clause encdec = TEQI(rs, imm)
  <-> 0b000001 @ rs @ 0b01100 @ imm
mapping clause assembly = TEQI(rs, imm)
  <-> "teqi" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// tnei rs, imm
union clause instruction = TNEI : (bits(5), bits(16))
mapping clause encdec = TNEI(rs, imm)
  <-> 0b000001 @ rs @ 0b01110 @ imm
mapping clause assembly = TNEI(rs, imm)
  <-> "tnei" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// synci offset(base)
union clause instruction = SYNCI : (bits(5), bits(16))
mapping clause encdec = SYNCI(base, offset)
  <-> 0b000001 @ base @ 0b11111 @ offset
mapping clause assembly = SYNCI(base, offset)
  <-> "synci" ^ spc() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// j target
union clause instruction = J : (bits(28))
mapping clause encdec = J(target)
  <-> 0b000010 @ target[27..2]
mapping clause assembly = J(target)
  <-> "j" ^ spc() ^ hex_bits(target)

// jal target
union clause instruction = JAL : (bits(28))
mapping clause encdec = JAL(target)
  <-> 0b000011 @ target[27..2]
mapping clause assembly = JAL(target)
  <-> "jal" ^ spc() ^ hex_bits(target)

// jalx target
union clause instruction = JALX : (bits(28))
mapping clause encdec = JALX(target)
  <-> 0b011101 @ target[27..2]
mapping clause assembly = JALX(target)
  <-> "jalx" ^ spc() ^ hex_bits(target)

// beq rs, rt, offset
union clause instruction = BEQ : (bits(5), bits(5), bits(18))
mapping clause encdec = BEQ(rs, rt, offset)
  <-> 0b000100 @ rs @ rt @ offset[17..2]
mapping clause assembly = BEQ(rs, rt, offset)
  <-> "beq" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(offset)

// bne rs, rt, offset
union clause instruction = BNE : (bits(5), bits(5), bits(18))
mapping clause encdec = BNE(rs, rt, offset)
  <-> 0b000101 @ rs @ rt @ offset[17..2]
mapping clause assembly = BNE(rs, rt, offset)
  <-> "bne" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(offset)

// beql rs, rt, offset
union clause instruction = BEQL : (bits(5), bits(5), bits(18))
mapping clause encdec = BEQL(rs, rt, offset)
  <-> 0b010100 @ rs @ rt @ offset[17..2]
mapping clause assembly = BEQL(rs, rt, offset)
  <-> "beql" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(offset)

// bnel rs, rt, offset
union clause instruction = BNEL : (bits(5), bits(5), bits(18))
mapping clause encdec = BNEL(rs, rt, offset)
  <-> 0b010101 @ rs @ rt @ offset[17..2]
mapping clause assembly = BNEL(rs, rt, offset)
  <-> "bnel" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt) ^ sep() ^ hex_bits(offset)

// blez rs, offset
union clause instruction = BLEZ : (bits(5), bits(18))
mapping clause encdec = BLEZ(rs, offset)
  <-> 0b000110 @ rs @ 0b00000 @ offset[17..2]
mapping clause assembly = BLEZ(rs, offset)
  <-> "blez" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgtz rs, offset
union clause instruction = BGTZ : (bits(5), bits(18))
mapping clause encdec = BGTZ(rs, offset)
  <-> 0b000111 @ rs @ 0b00000 @ offset[17..2]
mapping clause assembly = BGTZ(rs, offset)
  <-> "bgtz" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// blezl rs, offset
union clause instruction = BLEZL : (bits(5), bits(18))
mapping clause encdec = BLEZL(rs, offset)
  <-> 0b010110 @ rs @ 0b00000 @ offset[17..2]
mapping clause assembly = BLEZL(rs, offset)
  <-> "blezl" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// bgtzl rs, offset
union clause instruction = BGTZL : (bits(5), bits(18))
mapping clause encdec = BGTZL(rs, offset)
  <-> 0b010111 @ rs @ 0b00000 @ offset[17..2]
mapping clause assembly = BGTZL(rs, offset)
  <-> "bgtzl" ^ spc() ^ reg_name(rs) ^ sep() ^ hex_bits(offset)

// addi rt, rs, imm
union clause instruction = ADDi : (bits(5), bits(5), bits(16))
mapping clause encdec = ADDi(rs, rt, imm)
  <-> 0b001000 @ rs @ rt @ imm
mapping clause assembly = ADDi(rs, rt, imm)
  <-> "addi" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// addiu rt, rs, imm
union clause instruction = ADDiu : (bits(5), bits(5), bits(16))
mapping clause encdec = ADDiu(rs, rt, imm)
  <-> 0b001001 @ rs @ rt @ imm
mapping clause assembly = ADDiu(rs, rt, imm)
  <-> "addiu" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// slti rt, rs, imm
union clause instruction = SLTi : (bits(5), bits(5), bits(16))
mapping clause encdec = SLTi(rs, rt, imm)
  <-> 0b001010 @ rs @ rt @ imm
mapping clause assembly = SLTi(rs, rt, imm)
  <-> "slti" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// sltiu rt, rs, imm
union clause instruction = SLTiu : (bits(5), bits(5), bits(16))
mapping clause encdec = SLTiu(rs, rt, imm)
  <-> 0b001011 @ rs @ rt @ imm
mapping clause assembly = SLTiu(rs, rt, imm)
  <-> "sltiu" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// andi rt, rs, uimm
union clause instruction = ANDi : (bits(5), bits(5), bits(16))
mapping clause encdec = ANDi(rs, rt, uimm)
  <-> 0b001100 @ rs @ rt @ uimm
mapping clause assembly = ANDi(rs, rt, uimm)
  <-> "andi" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(uimm)

// ori rt, rs, uimm
union clause instruction = ORi : (bits(5), bits(5), bits(16))
mapping clause encdec = ORi(rs, rt, uimm)
  <-> 0b001101 @ rs @ rt @ uimm
mapping clause assembly = ORi(rs, rt, uimm)
  <-> "ori" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(uimm)

// xori rt, rs, uimm
union clause instruction = XORi : (bits(5), bits(5), bits(16))
mapping clause encdec = XORi(rs, rt, uimm)
  <-> 0b001110 @ rs @ rt @ uimm
mapping clause assembly = XORi(rs, rt, uimm)
  <-> "xori" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(uimm)

// daddi rt, rs, imm (MIPS64)
union clause instruction = DADDi : (bits(5), bits(5), bits(16))
mapping clause encdec = DADDi(rs, rt, imm)
  <-> 0b011000 @ rs @ rt @ imm
mapping clause assembly = DADDi(rs, rt, imm)
  <-> "daddi" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// daddiu rt, rs, imm (MIPS64)
union clause instruction = DADDiu : (bits(5), bits(5), bits(16))
mapping clause encdec = DADDiu(rs, rt, imm)
  <-> 0b011001 @ rs @ rt @ imm
mapping clause assembly = DADDiu(rs, rt, imm)
  <-> "daddiu" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(imm)

// lui rt, uimm
union clause instruction = LUi : (bits(5), bits(16))
mapping clause encdec = LUi(rt, uimm)
  <-> 0b001111 @ 0b00000 @ rt @ uimm
mapping clause assembly = LUi(rt, uimm)
  <-> "lui" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(uimm)

// lb rt, offset(base)
union clause instruction = LB : (bits(5), bits(5), bits(16))
mapping clause encdec = LB(base, rt, offset)
  <-> 0b100000 @ base @ rt @ offset
mapping clause assembly = LB(base, rt, offset)
  <-> "lb" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lh rt, offset(base)
union clause instruction = LH : (bits(5), bits(5), bits(16))
mapping clause encdec = LH(base, rt, offset)
  <-> 0b100001 @ base @ rt @ offset
mapping clause assembly = LH(base, rt, offset)
  <-> "lh" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lwl rt, offset(base)
union clause instruction = LWL : (bits(5), bits(5), bits(16))
mapping clause encdec = LWL(base, rt, offset)
  <-> 0b100010 @ base @ rt @ offset
mapping clause assembly = LWL(base, rt, offset)
  <-> "lwl" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lw rt, offset(base)
union clause instruction = LW : (bits(5), bits(5), bits(16))
mapping clause encdec = LW(base, rt, offset)
  <-> 0b100011 @ base @ rt @ offset
mapping clause assembly = LW(base, rt, offset)
  <-> "lw" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lbu rt, offset(base)
union clause instruction = LBu : (bits(5), bits(5), bits(16))
mapping clause encdec = LBu(base, rt, offset)
  <-> 0b100100 @ base @ rt @ offset
mapping clause assembly = LBu(base, rt, offset)
  <-> "lbu" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lhu rt, offset(base)
union clause instruction = LHu : (bits(5), bits(5), bits(16))
mapping clause encdec = LHu(base, rt, offset)
  <-> 0b100101 @ base @ rt @ offset
mapping clause assembly = LHu(base, rt, offset)
  <-> "lhu" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lwr rt, offset(base)
union clause instruction = LWR : (bits(5), bits(5), bits(16))
mapping clause encdec = LWR(base, rt, offset)
  <-> 0b100110 @ base @ rt @ offset
mapping clause assembly = LWR(base, rt, offset)
  <-> "lwr" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lwu rt, offset(base) (MIPS64)
union clause instruction = LWu : (bits(5), bits(5), bits(16))
mapping clause encdec = LWu(base, rt, offset)
  <-> 0b100111 @ base @ rt @ offset
mapping clause assembly = LWu(base, rt, offset)
  <-> "lwu" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sb rt, offset(base)
union clause instruction = SB : (bits(5), bits(5), bits(16))
mapping clause encdec = SB(base, rt, offset)
  <-> 0b101000 @ base @ rt @ offset
mapping clause assembly = SB(base, rt, offset)
  <-> "sb" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sh rt, offset(base)
union clause instruction = SH : (bits(5), bits(5), bits(16))
mapping clause encdec = SH(base, rt, offset)
  <-> 0b101001 @ base @ rt @ offset
mapping clause assembly = SH(base, rt, offset)
  <-> "sh" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// swl rt, offset(base)
union clause instruction = SWL : (bits(5), bits(5), bits(16))
mapping clause encdec = SWL(base, rt, offset)
  <-> 0b101010 @ base @ rt @ offset
mapping clause assembly = SWL(base, rt, offset)
  <-> "swl" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sw rt, offset(base)
union clause instruction = SW : (bits(5), bits(5), bits(16))
mapping clause encdec = SW(base, rt, offset)
  <-> 0b101011 @ base @ rt @ offset
mapping clause assembly = SW(base, rt, offset)
  <-> "sw" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sdl rt, offset(base) (MIPS64)
union clause instruction = SDL : (bits(5), bits(5), bits(16))
mapping clause encdec = SDL(base, rt, offset)
  <-> 0b101100 @ base @ rt @ offset
mapping clause assembly = SDL(base, rt, offset)
  <-> "sdl" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sdr rt, offset(base) (MIPS64)
union clause instruction = SDR : (bits(5), bits(5), bits(16))
mapping clause encdec = SDR(base, rt, offset)
  <-> 0b101101 @ base @ rt @ offset
mapping clause assembly = SDR(base, rt, offset)
  <-> "sdr" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// swr rt, offset(base)
union clause instruction = SWR : (bits(5), bits(5), bits(16))
mapping clause encdec = SWR(base, rt, offset)
  <-> 0b101110 @ base @ rt @ offset
mapping clause assembly = SWR(base, rt, offset)
  <-> "swr" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// ll rt, offset(base)
union clause instruction = LL : (bits(5), bits(5), bits(16))
mapping clause encdec = LL(base, rt, offset)
  <-> 0b110000 @ base @ rt @ offset
mapping clause assembly = LL(base, rt, offset)
  <-> "ll" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lld rt, offset(base) (MIPS64)
union clause instruction = LLD : (bits(5), bits(5), bits(16))
mapping clause encdec = LLD(base, rt, offset)
  <-> 0b110100 @ base @ rt @ offset
mapping clause assembly = LLD(base, rt, offset)
  <-> "lld" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// ld rt, offset(base) (MIPS64)
union clause instruction = LD : (bits(5), bits(5), bits(16))
mapping clause encdec = LD(base, rt, offset)
  <-> 0b110111 @ base @ rt @ offset
mapping clause assembly = LD(base, rt, offset)
  <-> "ld" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sc rt, offset(base)
union clause instruction = SC : (bits(5), bits(5), bits(16))
mapping clause encdec = SC(base, rt, offset)
  <-> 0b111000 @ base @ rt @ offset
mapping clause assembly = SC(base, rt, offset)
  <-> "sc" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// scd rt, offset(base) (MIPS64)
union clause instruction = SCD : (bits(5), bits(5), bits(16))
mapping clause encdec = SCD(base, rt, offset)
  <-> 0b111100 @ base @ rt @ offset
mapping clause assembly = SCD(base, rt, offset)
  <-> "scd" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sd rt, offset(base) (MIPS64)
union clause instruction = SD : (bits(5), bits(5), bits(16))
mapping clause encdec = SD(base, rt, offset)
  <-> 0b111111 @ base @ rt @ offset
mapping clause assembly = SD(base, rt, offset)
  <-> "sd" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// ldl rt, offset(base) (MIPS64)
union clause instruction = LDL : (bits(5), bits(5), bits(16))
mapping clause encdec = LDL(base, rt, offset)
  <-> 0b011010 @ base @ rt @ offset
mapping clause assembly = LDL(base, rt, offset)
  <-> "ldl" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// ldr rt, offset(base) (MIPS64)
union clause instruction = LDR : (bits(5), bits(5), bits(16))
mapping clause encdec = LDR(base, rt, offset)
  <-> 0b011011 @ base @ rt @ offset
mapping clause assembly = LDR(base, rt, offset)
  <-> "ldr" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// lwc2 creg, offset(base)
union clause instruction = LWC2 : (bits(5), bits(5), bits(16))
mapping clause encdec = LWC2(base, creg, offset)
  <-> 0b110010 @ base @ creg @ offset
mapping clause assembly = LWC2(base, creg, offset)
  <-> "lwc2" ^ spc() ^ hex_bits(creg) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// ldc2 creg, offset(base)
union clause instruction = LDC2 : (bits(5), bits(5), bits(16))
mapping clause encdec = LDC2(base, creg, offset)
  <-> 0b110110 @ base @ creg @ offset
mapping clause assembly = LDC2(base, creg, offset)
  <-> "ldc2" ^ spc() ^ hex_bits(creg) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// swc2 creg, offset(base)
union clause instruction = SWC2 : (bits(5), bits(5), bits(16))
mapping clause encdec = SWC2(base, creg, offset)
  <-> 0b111010 @ base @ creg @ offset
mapping clause assembly = SWC2(base, creg, offset)
  <-> "swc2" ^ spc() ^ hex_bits(creg) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// sdc2 creg, offset(base)
union clause instruction = SDC2 : (bits(5), bits(5), bits(16))
mapping clause encdec = SDC2(base, creg, offset)
  <-> 0b111110 @ base @ creg @ offset
mapping clause assembly = SDC2(base, creg, offset)
  <-> "sdc2" ^ spc() ^ hex_bits(creg) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// cache hint, offset(base)
union clause instruction = CACHE : (bits(5), bits(5), bits(16))
mapping clause encdec = CACHE(base, hint, offset)
  <-> 0b101111 @ base @ hint @ offset
mapping clause assembly = CACHE(base, hint, offset)
  <-> "cache" ^ spc() ^ hex_bits(hint) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// pref hint, offset(base)
union clause instruction = PREF : (bits(5), bits(5), bits(16))
mapping clause encdec = PREF(base, hint, offset)
  <-> 0b110011 @ base @ hint @ offset
mapping clause assembly = PREF(base, hint, offset)
  <-> "pref" ^ spc() ^ hex_bits(hint) ^ sep() ^ hex_bits(offset) ^ "(" ^ reg_name(base) ^ ")"

// mfc0 rt, creg, sel
union clause instruction = MFC0 : (bits(5), bits(5), bits(3))
mapping clause encdec = MFC0(rt, creg, sel)
  <-> 0b010000 @ 0b00000 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = MFC0(rt, creg, sel)
  <-> "mfc0" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// dmfc0 rt, creg, sel (MIPS64)
union clause instruction = DMFC0 : (bits(5), bits(5), bits(3))
mapping clause encdec = DMFC0(rt, creg, sel)
  <-> 0b010000 @ 0b00001 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = DMFC0(rt, creg, sel)
  <-> "dmfc0" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// mtc0 rt, creg, sel
union clause instruction = MTC0 : (bits(5), bits(5), bits(3))
mapping clause encdec = MTC0(rt, creg, sel)
  <-> 0b010000 @ 0b00100 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = MTC0(rt, creg, sel)
  <-> "mtc0" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// dmtc0 rt, creg, sel (MIPS64)
union clause instruction = DMTC0 : (bits(5), bits(5), bits(3))
mapping clause encdec = DMTC0(rt, creg, sel)
  <-> 0b010000 @ 0b00101 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = DMTC0(rt, creg, sel)
  <-> "dmtc0" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// di rt
union clause instruction = DI : (bits(5))
mapping clause encdec = DI(rt)
  <-> 0b010000 @ 0b01011 @ rt @ 0b01100 @ 0b00000 @ 0b0 @ 0b00 @ 0b000
mapping clause assembly = DI(rt)
  <-> "di" ^ spc() ^ reg_name(rt)

// ei rt
union clause instruction = EI : (bits(5))
mapping clause encdec = EI(rt)
  <-> 0b010000 @ 0b01011 @ rt @ 0b01100 @ 0b00000 @ 0b1 @ 0b00 @ 0b000
mapping clause assembly = EI(rt)
  <-> "ei" ^ spc() ^ reg_name(rt)

// tlbr
union clause instruction = TLBR : unit
mapping clause encdec = TLBR()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b000001
mapping clause assembly = TLBR()
  <-> "tlbr"

// tlbwi
union clause instruction = TLBWI : unit
mapping clause encdec = TLBWI()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b000010
mapping clause assembly = TLBWI()
  <-> "tlbwi"

// tlbwr
union clause instruction = TLBWR : unit
mapping clause encdec = TLBWR()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b000110
mapping clause assembly = TLBWR()
  <-> "tlbwr"

// tlbp
union clause instruction = TLBP : unit
mapping clause encdec = TLBP()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b001000
mapping clause assembly = TLBP()
  <-> "tlbp"

// eret
union clause instruction = ERET : unit
mapping clause encdec = ERET()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b011000
mapping clause assembly = ERET()
  <-> "eret"

// deret
union clause instruction = DERET : unit
mapping clause encdec = DERET()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b011111
mapping clause assembly = DERET()
  <-> "deret"

// wait
union clause instruction = WAIT : unit
mapping clause encdec = WAIT()
  <-> 0b010000 @ 0b1 @ 0b0000000000000000000 @ 0b100000
mapping clause assembly = WAIT()
  <-> "wait"

// mfc2 rt, creg, sel
union clause instruction = MFC2 : (bits(5), bits(5), bits(3))
mapping clause encdec = MFC2(rt, creg, sel)
  <-> 0b010010 @ 0b00000 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = MFC2(rt, creg, sel)
  <-> "mfc2" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// dmfc2 rt, creg, sel (MIPS64)
union clause instruction = DMFC2 : (bits(5), bits(5), bits(3))
mapping clause encdec = DMFC2(rt, creg, sel)
  <-> 0b010010 @ 0b00001 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = DMFC2(rt, creg, sel)
  <-> "dmfc2" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// mtc2 rt, creg, sel
union clause instruction = MTC2 : (bits(5), bits(5), bits(3))
mapping clause encdec = MTC2(rt, creg, sel)
  <-> 0b010010 @ 0b00100 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = MTC2(rt, creg, sel)
  <-> "mtc2" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// dmtc2 rt, creg, sel (MIPS64)
union clause instruction = DMTC2 : (bits(5), bits(5), bits(3))
mapping clause encdec = DMTC2(rt, creg, sel)
  <-> 0b010010 @ 0b00101 @ rt @ creg @ 0b00000000 @ sel
mapping clause assembly = DMTC2(rt, creg, sel)
  <-> "dmtc2" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(creg) ^ sep() ^ hex_bits(sel)

// madd rs, rt
union clause instruction = MADD : (bits(5), bits(5))
mapping clause encdec = MADD(rs, rt)
  <-> 0b011100 @ rs @ rt @ 0b00000 @ 0b00000 @ 0b000000
mapping clause assembly = MADD(rs, rt)
  <-> "madd" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// maddu rs, rt
union clause instruction = MADDU : (bits(5), bits(5))
mapping clause encdec = MADDU(rs, rt)
  <-> 0b011100 @ rs @ rt @ 0b00000 @ 0b00000 @ 0b000001
mapping clause assembly = MADDU(rs, rt)
  <-> "maddu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// msub rs, rt
union clause instruction = MSUB : (bits(5), bits(5))
mapping clause encdec = MSUB(rs, rt)
  <-> 0b011100 @ rs @ rt @ 0b00000 @ 0b00000 @ 0b000100
mapping clause assembly = MSUB(rs, rt)
  <-> "msub" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// msubu rs, rt
union clause instruction = MSUBU : (bits(5), bits(5))
mapping clause encdec = MSUBU(rs, rt)
  <-> 0b011100 @ rs @ rt @ 0b00000 @ 0b00000 @ 0b000101
mapping clause assembly = MSUBU(rs, rt)
  <-> "msubu" ^ spc() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// mul rd, rs, rt
union clause instruction = MUL : (bits(5), bits(5), bits(5))
mapping clause encdec = MUL(rs, rt, rd)
  <-> 0b011100 @ rs @ rt @ rd @ 0b00000 @ 0b000010
mapping clause assembly = MUL(rs, rt, rd)
  <-> "mul" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs) ^ sep() ^ reg_name(rt)

// clz rd, rs
union clause instruction = CLZ : (bits(5), bits(5))
mapping clause encdec = CLZ(rs, rd)
  <-> 0b011100 @ rs @ rd @ rd @ 0b00000 @ 0b100000
mapping clause assembly = CLZ(rs, rd)
  <-> "clz" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// clo rd, rs
union clause instruction = CLO : (bits(5), bits(5))
mapping clause encdec = CLO(rs, rd)
  <-> 0b011100 @ rs @ rd @ rd @ 0b00000 @ 0b100001
mapping clause assembly = CLO(rs, rd)
  <-> "clo" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// dclz rd, rs (MIPS64)
union clause instruction = DCLZ : (bits(5), bits(5))
mapping clause encdec = DCLZ(rs, rd)
  <-> 0b011100 @ rs @ rd @ rd @ 0b00000 @ 0b100100
mapping clause assembly = DCLZ(rs, rd)
  <-> "dclz" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// dclo rd, rs (MIPS64)
union clause instruction = DCLO : (bits(5), bits(5))
mapping clause encdec = DCLO(rs, rd)
  <-> 0b011100 @ rs @ rd @ rd @ 0b00000 @ 0b100101
mapping clause assembly = DCLO(rs, rd)
  <-> "dclo" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rs)

// sdbbp code20
union clause instruction = SDBBP : (bits(20))
mapping clause encdec = SDBBP(code20)
  <-> 0b011100 @ code20 @ 0b111111
mapping clause assembly = SDBBP(code20)
  <-> "sdbbp" ^ spc() ^ hex_bits(code20)

// ext rt, rs, lsb, msbd
union clause instruction = EXT : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = EXT(rs, rt, msbd, lsb)
  <-> 0b011111 @ rs @ rt @ msbd @ lsb @ 0b000000
mapping clause assembly = EXT(rs, rt, msbd, lsb)
  <-> "ext" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msbd)

// dextm rt, rs, lsb, msbd (MIPS64)
union clause instruction = DEXTM : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DEXTM(rs, rt, msbd, lsb)
  <-> 0b011111 @ rs @ rt @ msbd @ lsb @ 0b000001
mapping clause assembly = DEXTM(rs, rt, msbd, lsb)
  <-> "dextm" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msbd)

// dextu rt, rs, lsb, msbd (MIPS64)
union clause instruction = DEXTU : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DEXTU(rs, rt, msbd, lsb)
  <-> 0b011111 @ rs @ rt @ msbd @ lsb @ 0b000010
mapping clause assembly = DEXTU(rs, rt, msbd, lsb)
  <-> "dextu" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msbd)

// dext rt, rs, lsb, msbd (MIPS64)
union clause instruction = DEXT : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DEXT(rs, rt, msbd, lsb)
  <-> 0b011111 @ rs @ rt @ msbd @ lsb @ 0b000011
mapping clause assembly = DEXT(rs, rt, msbd, lsb)
  <-> "dext" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msbd)

// ins rt, rs, lsb, msb
union clause instruction = INS : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = INS(rs, rt, msb, lsb)
  <-> 0b011111 @ rs @ rt @ msb @ lsb @ 0b000100
mapping clause assembly = INS(rs, rt, msb, lsb)
  <-> "ins" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msb)

// dinsm rt, rs, lsb, msb (MIPS64)
union clause instruction = DINSM : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DINSM(rs, rt, msb, lsb)
  <-> 0b011111 @ rs @ rt @ msb @ lsb @ 0b000101
mapping clause assembly = DINSM(rs, rt, msb, lsb)
  <-> "dinsm" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msb)

// dinsu rt, rs, lsb, msb (MIPS64)
union clause instruction = DINSU : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DINSU(rs, rt, msb, lsb)
  <-> 0b011111 @ rs @ rt @ msb @ lsb @ 0b000110
mapping clause assembly = DINSU(rs, rt, msb, lsb)
  <-> "dinsu" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msb)

// dins rt, rs, lsb, msb (MIPS64)
union clause instruction = DINS : (bits(5), bits(5), bits(5), bits(5))
mapping clause encdec = DINS(rs, rt, msb, lsb)
  <-> 0b011111 @ rs @ rt @ msb @ lsb @ 0b000111
mapping clause assembly = DINS(rs, rt, msb, lsb)
  <-> "dins" ^ spc() ^ reg_name(rt) ^ sep() ^ reg_name(rs) ^ sep() ^ hex_bits(lsb) ^ sep() ^ hex_bits(msb)

// wsbh rd, rt
union clause instruction = WSBH : (bits(5), bits(5))
mapping clause encdec = WSBH(rt, rd)
  <-> 0b011111 @ 0b00000 @ rt @ rd @ 0b00010 @ 0b100000
mapping clause assembly = WSBH(rt, rd)
  <-> "wsbh" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt)

// seb rd, rt
union clause instruction = SEB : (bits(5), bits(5))
mapping clause encdec = SEB(rt, rd)
  <-> 0b011111 @ 0b00000 @ rt @ rd @ 0b10000 @ 0b100000
mapping clause assembly = SEB(rt, rd)
  <-> "seb" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt)

// seh rd, rt
union clause instruction = SEH : (bits(5), bits(5))
mapping clause encdec = SEH(rt, rd)
  <-> 0b011111 @ 0b00000 @ rt @ rd @ 0b11000 @ 0b100000
mapping clause assembly = SEH(rt, rd)
  <-> "seh" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt)

// dsbh rd, rt (MIPS64)
union clause instruction = DSBH : (bits(5), bits(5))
mapping clause encdec = DSBH(rt, rd)
  <-> 0b011111 @ 0b00000 @ rt @ rd @ 0b00010 @ 0b100100
mapping clause assembly = DSBH(rt, rd)
  <-> "dsbh" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt)

// dshd rd, rt (MIPS64)
union clause instruction = DSHD : (bits(5), bits(5))
mapping clause encdec = DSHD(rt, rd)
  <-> 0b011111 @ 0b00000 @ rt @ rd @ 0b00101 @ 0b100100
mapping clause assembly = DSHD(rt, rd)
  <-> "dshd" ^ spc() ^ reg_name(rd) ^ sep() ^ reg_name(rt)

// rdhwr rt, hwr
union clause instruction = RDHWR : (bits(5), bits(5))
mapping clause encdec = RDHWR(rt, hwr)
  <-> 0b011111 @ 0b00000 @ rt @ hwr @ 0b00000 @ 0b111011
mapping clause assembly = RDHWR(rt, hwr)
  <-> "rdhwr" ^ spc() ^ reg_name(rt) ^ sep() ^ hex_bits(hwr)

end instruction
