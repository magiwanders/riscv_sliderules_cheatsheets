// src/isa/rv32gc.mjs
var e = {
	R: {
		title: "Register",
		width: 32,
		layout: [
			[
				"funct7",
				31,
				25,
				"funct"
			],
			[
				"rs2",
				24,
				20,
				"reg"
			],
			[
				"rs1",
				19,
				15,
				"reg"
			],
			[
				"funct3",
				14,
				12,
				"funct"
			],
			[
				"rd",
				11,
				7,
				"reg"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	R4: {
		title: "Register (4 operands)",
		width: 32,
		layout: [
			[
				"rs3",
				31,
				27,
				"reg"
			],
			[
				"funct2",
				26,
				25,
				"funct"
			],
			[
				"rs2",
				24,
				20,
				"reg"
			],
			[
				"rs1",
				19,
				15,
				"reg"
			],
			[
				"funct3",
				14,
				12,
				"funct"
			],
			[
				"rd",
				11,
				7,
				"reg"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	I: {
		title: "Immediate",
		width: 32,
		layout: [
			[
				"imm[11:0]",
				31,
				20,
				"imm"
			],
			[
				"rs1",
				19,
				15,
				"reg"
			],
			[
				"funct3",
				14,
				12,
				"funct"
			],
			[
				"rd",
				11,
				7,
				"reg"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	S: {
		title: "Store",
		width: 32,
		layout: [
			[
				"imm[11:5]",
				31,
				25,
				"imm"
			],
			[
				"rs2",
				24,
				20,
				"reg"
			],
			[
				"rs1",
				19,
				15,
				"reg"
			],
			[
				"funct3",
				14,
				12,
				"funct"
			],
			[
				"imm[4:0]",
				11,
				7,
				"imm"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	B: {
		title: "Branch",
		width: 32,
		layout: [
			[
				"imm[12|10:5]",
				31,
				25,
				"imm"
			],
			[
				"rs2",
				24,
				20,
				"reg"
			],
			[
				"rs1",
				19,
				15,
				"reg"
			],
			[
				"funct3",
				14,
				12,
				"funct"
			],
			[
				"imm[4:1|11]",
				11,
				7,
				"imm"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	U: {
		title: "Upper Immediate",
		width: 32,
		layout: [
			[
				"imm[31:12]",
				31,
				12,
				"imm"
			],
			[
				"rd",
				11,
				7,
				"reg"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	J: {
		title: "Jump",
		width: 32,
		layout: [
			[
				"imm[20|10:1|11|19:12]",
				31,
				12,
				"imm"
			],
			[
				"rd",
				11,
				7,
				"reg"
			],
			[
				"opcode",
				6,
				0,
				"opcode"
			]
		]
	},
	CR: {
		title: "Register",
		width: 16,
		layout: [
			[
				"funct4",
				15,
				12,
				"funct"
			],
			[
				"rd/rs1",
				11,
				7,
				"reg"
			],
			[
				"rs2",
				6,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CI: {
		title: "Immediate",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"imm",
				12,
				12,
				"imm"
			],
			[
				"rd/rs1",
				11,
				7,
				"reg"
			],
			[
				"imm",
				6,
				2,
				"imm"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CSS: {
		title: "Stack-relative Store",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"imm",
				12,
				7,
				"imm"
			],
			[
				"rs2",
				6,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CIW: {
		title: "Wide Immediate",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"imm",
				12,
				5,
				"imm"
			],
			[
				"rd'",
				4,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CL: {
		title: "Load",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"imm",
				12,
				10,
				"imm"
			],
			[
				"rs1'",
				9,
				7,
				"reg"
			],
			[
				"imm",
				6,
				5,
				"imm"
			],
			[
				"rd'",
				4,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CS: {
		title: "Store",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"imm",
				12,
				10,
				"imm"
			],
			[
				"rs1'",
				9,
				7,
				"reg"
			],
			[
				"imm",
				6,
				5,
				"imm"
			],
			[
				"rs2'",
				4,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CA: {
		title: "Arithmetic",
		width: 16,
		layout: [
			[
				"funct6",
				15,
				10,
				"funct"
			],
			[
				"rd'/rs1'",
				9,
				7,
				"reg"
			],
			[
				"funct2",
				6,
				5,
				"funct"
			],
			[
				"rs2'",
				4,
				2,
				"reg"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CB: {
		title: "Branch / Arithmetic",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"offset",
				12,
				10,
				"imm"
			],
			[
				"rs1'",
				9,
				7,
				"reg"
			],
			[
				"offset",
				6,
				2,
				"imm"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	},
	CJ: {
		title: "Jump",
		width: 16,
		layout: [
			[
				"funct3",
				15,
				13,
				"funct"
			],
			[
				"jump target",
				12,
				2,
				"imm"
			],
			[
				"op",
				1,
				0,
				"opcode"
			]
		]
	}
}, t = {
	q0: "Quadrant 0 — Compressed Instructions (inst[1:0] = 00)",
	q2: "Quadrant 2 — Compressed Instructions (inst[1:0] = 10)",
	q1: "Quadrant 1 — Compressed Instructions (inst[1:0] = 01)",
	q3: "Quadrant 3 — Non-Compressed Instructions (inst[1:0] = 11)"
}, n = {
	"c.addi4spn": {
		section: "q0",
		format: "CIW",
		extension: "C",
		title: "Put SP + nzuimm in rd'",
		pseudocode: "rd' = sp + nzuimm"
	},
	"c.fld": {
		section: "q0",
		format: "CL",
		extension: "C + D",
		title: "Load Double (FP)",
		pseudocode: "rd' ← M[ rs1' + uimm ][63:0]"
	},
	"c.lw": {
		section: "q0",
		format: "CL",
		extension: "C",
		title: "Load Word",
		pseudocode: "rd' ← M[ rs1' + uimm ][31:0]"
	},
	"c.flw": {
		section: "q0",
		format: "CL",
		extension: "C + F",
		title: "Load Float (FP)",
		pseudocode: "rd' ← M[ rs1' + uimm ][31:0]"
	},
	"c.q0-100": {
		section: "q0",
		format: "CL",
		extension: "C",
		title: "Reserved",
		pseudocode: ""
	},
	"c.fsd": {
		section: "q0",
		format: "CS",
		extension: "C + D",
		title: "Store Double (FP)",
		pseudocode: "rs2' → M[ rs1' + uimm ][63:0]"
	},
	"c.sw": {
		section: "q0",
		format: "CS",
		extension: "C",
		title: "Store Word",
		pseudocode: "rs2' → M[ rs1' + uimm ][31:0]"
	},
	"c.fsw": {
		section: "q0",
		format: "CS",
		extension: "C + F",
		title: "Store Float (FP)",
		pseudocode: "rs2' → M[ rs1' + uimm ][31:0]"
	},
	"c.addi": {
		section: "q1",
		format: "CI",
		extension: "C",
		title: "Add Immediate / No Operation",
		pseudocode: "rd += nzimm"
	},
	"c.jal": {
		section: "q1",
		format: "CJ",
		extension: "C",
		title: "Jump and Link",
		pseudocode: "ra = PC + 2 ; PC += offset"
	},
	"c.li": {
		section: "q1",
		format: "CI",
		extension: "C",
		title: "Load Immediate",
		pseudocode: "rd = imm"
	},
	"c.lui": {
		section: "q1",
		format: "CI",
		extension: "C",
		title: "Load Upper Immediate / Add to SP",
		pseudocode: "rd = nzimm  |  sp += nzimm"
	},
	"c.cb-alu": {
		section: "q1",
		format: "CB",
		extension: "C",
		title: "Shift Right / And Immediate",
		pseudocode: "rd' = rd' (funct2) imm"
	},
	"c.ca": {
		section: "q1",
		format: "CA",
		extension: "C",
		title: "CA Register Operations",
		pseudocode: "rd' = rd' (funct2) rs2'"
	},
	"c.j": {
		section: "q1",
		format: "CJ",
		extension: "C",
		title: "Jump",
		pseudocode: "PC += offset"
	},
	"c.branch": {
		section: "q1",
		format: "CB",
		extension: "C",
		title: "Branch",
		pseudocode: "if ( rs1' (funct3) x0 ) PC += offset"
	},
	"c.slli": {
		section: "q2",
		format: "CI",
		extension: "C",
		title: "Shift Left Logical Immediate",
		pseudocode: "rd <<= shamt"
	},
	"c.fldsp": {
		section: "q2",
		format: "CI",
		extension: "C + D",
		title: "Load Double from SP (FP)",
		pseudocode: "rd ← M[ sp + uimm ][63:0]"
	},
	"c.lwsp": {
		section: "q2",
		format: "CI",
		extension: "C",
		title: "Load Word from SP",
		pseudocode: "rd ← M[ sp + uimm ][31:0]"
	},
	"c.flwsp": {
		section: "q2",
		format: "CI",
		extension: "C + F",
		title: "Load Float from SP (FP)",
		pseudocode: "rd ← M[ sp + uimm ][31:0]"
	},
	"c.cr": {
		section: "q2",
		format: "CR",
		extension: "C",
		title: "CR Control Transfer / Register Operations",
		pseudocode: "( ra = PC + 2 ; ) PC = rs1  |  rd = rd (funct4) rs2"
	},
	"c.fsdsp": {
		section: "q2",
		format: "CSS",
		extension: "C + D",
		title: "Store Double to SP (FP)",
		pseudocode: "rs2 → M[ sp + uimm ][63:0]"
	},
	"c.swsp": {
		section: "q2",
		format: "CSS",
		extension: "C",
		title: "Store Word to SP",
		pseudocode: "rs2 → M[ sp + uimm ][31:0]"
	},
	"c.fswsp": {
		section: "q2",
		format: "CSS",
		extension: "C + F",
		title: "Store Float to SP (FP)",
		pseudocode: "rs2 → M[ sp + uimm ][31:0]"
	},
	load: {
		section: "q3",
		format: "I",
		extension: "I",
		title: "Load",
		pseudocode: "rd = M[ rs1 + imm ] [funct3]"
	},
	"load-fp": {
		section: "q3",
		format: "I",
		extension: "F / D",
		title: "Floating-Point Load",
		pseudocode: "rd = M[ rs1 + imm ] [funct3]"
	},
	"misc-mem": {
		section: "q3",
		format: "I",
		extension: "I",
		title: "Memory Ordering",
		pseudocode: "order memory accesses"
	},
	fencei: {
		section: "q3",
		format: "I",
		extension: "Zifencei",
		title: "Instruction Fence",
		pseudocode: "sync instruction and data streams"
	},
	"op-imm": {
		section: "q3",
		format: "I",
		extension: "I",
		title: "Operations with Immediate",
		pseudocode: "rd = rs1 (funct3) imm"
	},
	auipc: {
		section: "q3",
		format: "U",
		extension: "I",
		title: "Add Upper Immediate to PC",
		pseudocode: "rd = PC + imm"
	},
	store: {
		section: "q3",
		format: "S",
		extension: "I",
		title: "Store",
		pseudocode: "rs2 [funct3] → M[ rs1 + imm ]"
	},
	"store-fp": {
		section: "q3",
		format: "S",
		extension: "F / D",
		title: "Floating-Point Store",
		pseudocode: "rs2 [funct3] → M[ rs1 + imm ]"
	},
	amo: {
		section: "q3",
		format: "R",
		extension: "A",
		title: "Atomic Operations",
		pseudocode: "t = M[rs1] ; M[rs1] = t (funct5) rs2 ; rd = t"
	},
	op: {
		section: "q3",
		format: "R",
		extension: "I",
		title: "Operations with Registers",
		pseudocode: "rd = rs1 (funct) rs2"
	},
	"op-m": {
		section: "q3",
		format: "R",
		extension: "M",
		title: "Multiplication and Division",
		pseudocode: "rd = rs1 (funct3) rs2"
	},
	lui: {
		section: "q3",
		format: "U",
		extension: "I",
		title: "Load Upper Immediate",
		pseudocode: "rd = imm"
	},
	madd: {
		section: "q3",
		format: "R4",
		extension: "F / D",
		title: "Fused Multiply-Add",
		pseudocode: "rd = rs1 × rs2 + rs3"
	},
	msub: {
		section: "q3",
		format: "R4",
		extension: "F / D",
		title: "Fused Multiply-Subtract",
		pseudocode: "rd = rs1 × rs2 − rs3"
	},
	nmsub: {
		section: "q3",
		format: "R4",
		extension: "F / D",
		title: "Fused Negated Multiply-Subtract",
		pseudocode: "rd = −(rs1 × rs2) + rs3"
	},
	nmadd: {
		section: "q3",
		format: "R4",
		extension: "F / D",
		title: "Fused Negated Multiply-Add",
		pseudocode: "rd = −(rs1 × rs2) − rs3"
	},
	"op-fp": {
		section: "q3",
		format: "R",
		extension: "F",
		title: "Single-Precision Operations",
		pseudocode: "rd = rs1 (funct7) rs2"
	},
	"op-fp-d": {
		section: "q3",
		format: "R",
		extension: "D",
		title: "Double-Precision Operations",
		pseudocode: "rd = rs1 (funct7) rs2"
	},
	branch: {
		section: "q3",
		format: "B",
		extension: "I",
		title: "Branch",
		pseudocode: "if ( rs1 (funct3) rs2 ) PC += imm"
	},
	jalr: {
		section: "q3",
		format: "I",
		extension: "I",
		title: "Jump and Link Register",
		pseudocode: "rd = PC + 4 ; PC = rs1 + imm"
	},
	jal: {
		section: "q3",
		format: "J",
		extension: "I",
		title: "Jump and Link",
		pseudocode: "rd = PC + 4 ; PC += imm"
	},
	system: {
		section: "q3",
		format: "I",
		extension: "I",
		title: "Environment",
		pseudocode: "control to debug / OS"
	},
	csr: {
		section: "q3",
		format: "I",
		extension: "Zicsr",
		title: "Control and Status Registers",
		pseudocode: "rd = CSR ; CSR = f( CSR, rs1 | zimm )"
	}
}, r = [
	"rd",
	"rs1",
	"rs2",
	"rs3"
], i = [
	{
		group: "c.addi4spn",
		name: "reserved",
		reserved: !0,
		enc: "000 00000000 --- 00",
		description: "RESERVED (nzuimm = 0) — 0x0000 is the defined illegal instruction"
	},
	{
		group: "c.addi4spn",
		name: "c.addi4spn",
		enc: "000 nzuimm[5:4|9:6|2|3] rd' 00",
		asm: "rd', sp, imm",
		expands: "addi rd', sp, nzuimm",
		description: "Add Immediate (×4) to SP into rd'",
		pseudocode: "rd' = sp + nzuimm"
	},
	{
		group: "c.fld",
		name: "c.fld",
		enc: "001 uimm[5:3] rs1' uimm[7:6] rd' 00",
		asm: "rd', imm(rs1')",
		fregs: ["rd"],
		expands: "fld rd', uimm(rs1')",
		description: "Load Double (FP)",
		pseudocode: "rd' ← M[ rs1' + uimm ][63:0]"
	},
	{
		group: "c.lw",
		name: "c.lw",
		enc: "010 uimm[5:3] rs1' uimm[2|6] rd' 00",
		asm: "rd', imm(rs1')",
		expands: "lw rd', uimm(rs1')",
		description: "Load Word",
		pseudocode: "rd' ← M[ rs1' + uimm ][31:0]"
	},
	{
		group: "c.flw",
		name: "c.flw",
		enc: "011 uimm[5:3] rs1' uimm[2|6] rd' 00",
		asm: "rd', imm(rs1')",
		fregs: ["rd"],
		expands: "flw rd', uimm(rs1')",
		description: "Load Float (FP)",
		pseudocode: "rd' ← M[ rs1' + uimm ][31:0]"
	},
	{
		group: "c.q0-100",
		name: "reserved",
		reserved: !0,
		enc: "100 ----------- 00",
		description: "RESERVED"
	},
	{
		group: "c.fsd",
		name: "c.fsd",
		enc: "101 uimm[5:3] rs1' uimm[7:6] rs2' 00",
		asm: "rs2', imm(rs1')",
		fregs: ["rs2"],
		expands: "fsd rs2', uimm(rs1')",
		description: "Store Double (FP)",
		pseudocode: "rs2' → M[ rs1' + uimm ][63:0]"
	},
	{
		group: "c.sw",
		name: "c.sw",
		enc: "110 uimm[5:3] rs1' uimm[2|6] rs2' 00",
		asm: "rs2', imm(rs1')",
		expands: "sw rs2', uimm(rs1')",
		description: "Store Word",
		pseudocode: "rs2' → M[ rs1' + uimm ][31:0]"
	},
	{
		group: "c.fsw",
		name: "c.fsw",
		enc: "111 uimm[5:3] rs1' uimm[2|6] rs2' 00",
		asm: "rs2', imm(rs1')",
		fregs: ["rs2"],
		expands: "fsw rs2', uimm(rs1')",
		description: "Store Float (FP)",
		pseudocode: "rs2' → M[ rs1' + uimm ][31:0]"
	},
	{
		group: "c.addi",
		name: "c.nop",
		enc: "000 0 00000 00000 01",
		asm: "",
		expands: "addi x0, x0, 0",
		description: "No Operation",
		pseudocode: "literally do nothing"
	},
	{
		group: "c.addi",
		name: "c.addi",
		enc: "000 nzimm[5] rd/rs1!=0 nzimm[4:0] 01",
		asm: "rd, imm",
		expands: "addi rd, rd, nzimm",
		description: "Add Immediate",
		pseudocode: "rd += nzimm"
	},
	{
		group: "c.addi",
		name: "hint",
		hint: !0,
		enc: "000 nzimm[5] 00000 nzimm[4:0] 01",
		description: "HINT — c.nop with nzimm ≠ 0 (standard use)"
	},
	{
		group: "c.addi",
		name: "hint",
		hint: !0,
		enc: "000 0 rd/rs1!=0 00000 01",
		description: "HINT — c.addi with nzimm = 0 (standard use)"
	},
	{
		group: "c.jal",
		name: "c.jal",
		enc: "001 imm[11|4|9:8|10|6|7|3:1|5] 01",
		asm: "imm",
		expands: "jal x1, offset",
		description: "Jump and Link",
		pseudocode: "ra = PC + 2 ; PC += offset"
	},
	{
		group: "c.li",
		name: "c.li",
		enc: "010 imm[5] rd!=0 imm[4:0] 01",
		asm: "rd, imm",
		expands: "addi rd, x0, imm",
		description: "Load Immediate",
		pseudocode: "rd = imm"
	},
	{
		group: "c.li",
		name: "hint",
		hint: !0,
		enc: "010 imm[5] 00000 imm[4:0] 01",
		description: "HINT — c.li with rd = x0 (standard use)"
	},
	{
		group: "c.lui",
		name: "reserved",
		reserved: !0,
		enc: "011 0 ----- 00000 01",
		description: "RESERVED (nzimm = 0)"
	},
	{
		group: "c.lui",
		name: "c.addi16sp",
		enc: "011 nzimm[9] 00010 nzimm[4|6|8:7|5] 01",
		asm: "sp, imm",
		expands: "addi x2, x2, nzimm",
		description: "Add Immediate (×16) to SP",
		pseudocode: "sp += nzimm"
	},
	{
		group: "c.lui",
		name: "c.lui",
		enc: "011 nzimm[17] rd!={0,2} nzimm[16:12] 01",
		asm: "rd, imm",
		asmShift: 12,
		expands: "lui rd, nzimm",
		description: "Load Upper Immediate",
		pseudocode: "rd = nzimm (sign-extended)"
	},
	{
		group: "c.lui",
		name: "hint",
		hint: !0,
		enc: "011 nzimm[17] 00000 nzimm[16:12] 01",
		description: "HINT — c.lui with rd = x0 (standard use)"
	},
	{
		group: "c.cb-alu",
		name: "c.srli",
		nonZeroImm: !0,
		enc: "100 0 00 rd'/rs1' shamt[4:0] 01",
		asm: "rd', imm",
		expands: "srli rd', rd', shamt",
		description: "Shift Right Logical Immediate",
		pseudocode: "rd' = rd' >> shamt (zero extends)"
	},
	{
		group: "c.cb-alu",
		name: "c.srai",
		nonZeroImm: !0,
		enc: "100 0 01 rd'/rs1' shamt[4:0] 01",
		asm: "rd', imm",
		expands: "srai rd', rd', shamt",
		description: "Shift Right Arithmetic Immediate",
		pseudocode: "rd' = rd' >> shamt (msb extends)"
	},
	{
		group: "c.cb-alu",
		name: "hint",
		hint: !0,
		enc: "100 0 00 rd'/rs1' 00000 01",
		description: "HINT — c.srli with shamt = 0 (custom use)"
	},
	{
		group: "c.cb-alu",
		name: "hint",
		hint: !0,
		enc: "100 0 01 rd'/rs1' 00000 01",
		description: "HINT — c.srai with shamt = 0 (custom use)"
	},
	{
		group: "c.cb-alu",
		name: "reserved",
		reserved: !0,
		enc: "100 1 0 - --- ----- 01",
		description: "CUSTOM — c.srli / c.srai with shamt[5] = 1: designated for custom extensions (RV32)"
	},
	{
		group: "c.cb-alu",
		name: "c.andi",
		enc: "100 imm[5] 10 rd'/rs1' imm[4:0] 01",
		asm: "rd', imm",
		expands: "andi rd', rd', imm",
		description: "And Immediate",
		pseudocode: "rd' &= imm"
	},
	{
		group: "c.ca",
		name: "c.sub",
		enc: "100011 rd'/rs1' 00 rs2' 01",
		asm: "rd', rs2'",
		expands: "sub rd', rd', rs2'",
		description: "Subtract",
		pseudocode: "rd' -= rs2'"
	},
	{
		group: "c.ca",
		name: "c.xor",
		enc: "100011 rd'/rs1' 01 rs2' 01",
		asm: "rd', rs2'",
		expands: "xor rd', rd', rs2'",
		description: "Xor",
		pseudocode: "rd' ^= rs2'"
	},
	{
		group: "c.ca",
		name: "c.or",
		enc: "100011 rd'/rs1' 10 rs2' 01",
		asm: "rd', rs2'",
		expands: "or rd', rd', rs2'",
		description: "Or",
		pseudocode: "rd' |= rs2'"
	},
	{
		group: "c.ca",
		name: "c.and",
		enc: "100011 rd'/rs1' 11 rs2' 01",
		asm: "rd', rs2'",
		expands: "and rd', rd', rs2'",
		description: "And",
		pseudocode: "rd' &= rs2'"
	},
	{
		group: "c.ca",
		name: "reserved",
		reserved: !0,
		enc: "100111 --- -- --- 01",
		description: "RESERVED on RV32 (c.subw / c.addw on RV64)"
	},
	{
		group: "c.j",
		name: "c.j",
		enc: "101 imm[11|4|9:8|10|6|7|3:1|5] 01",
		asm: "imm",
		expands: "jal x0, offset",
		description: "Jump",
		pseudocode: "PC += offset"
	},
	{
		group: "c.branch",
		name: "c.beqz",
		enc: "110 imm[8|4:3] rs1' imm[7:6|2:1|5] 01",
		asm: "rs1', imm",
		expands: "beq rs1', x0, offset",
		description: "Branch if EQual to Zero",
		pseudocode: "if ( rs1' == 0 ) PC += offset"
	},
	{
		group: "c.branch",
		name: "c.bnez",
		enc: "111 imm[8|4:3] rs1' imm[7:6|2:1|5] 01",
		asm: "rs1', imm",
		expands: "bne rs1', x0, offset",
		description: "Branch if Not Equal to Zero",
		pseudocode: "if ( rs1' != 0 ) PC += offset"
	},
	{
		group: "c.slli",
		name: "c.slli",
		nonZeroImm: !0,
		enc: "000 0 rd/rs1!=0 shamt[4:0] 10",
		asm: "rd, imm",
		expands: "slli rd, rd, shamt",
		description: "Shift Left Logical Immediate",
		pseudocode: "rd <<= shamt"
	},
	{
		group: "c.slli",
		name: "hint",
		hint: !0,
		enc: "000 0 rd/rs1!=0 00000 10",
		description: "HINT — c.slli with shamt = 0 (custom use)"
	},
	{
		group: "c.slli",
		name: "hint",
		hint: !0,
		enc: "000 0 00000 shamt[4:0] 10",
		description: "HINT — c.slli with rd = x0 (custom use)"
	},
	{
		group: "c.slli",
		name: "reserved",
		reserved: !0,
		enc: "000 1 ----- ----- 10",
		description: "CUSTOM — c.slli with shamt[5] = 1: designated for custom extensions (RV32)"
	},
	{
		group: "c.fldsp",
		name: "c.fldsp",
		enc: "001 uimm[5] rd uimm[4:3|8:6] 10",
		asm: "rd, imm(sp)",
		fregs: ["rd"],
		expands: "fld rd, uimm(sp)",
		description: "Load Double from SP (FP)",
		pseudocode: "rd ← M[ sp + uimm ][63:0]"
	},
	{
		group: "c.lwsp",
		name: "reserved",
		reserved: !0,
		enc: "010 - 00000 ----- 10",
		description: "RESERVED (rd = 0)"
	},
	{
		group: "c.lwsp",
		name: "c.lwsp",
		enc: "010 uimm[5] rd!=0 uimm[4:2|7:6] 10",
		asm: "rd, imm(sp)",
		expands: "lw rd, uimm(sp)",
		description: "Load Word from SP",
		pseudocode: "rd ← M[ sp + uimm ][31:0]"
	},
	{
		group: "c.flwsp",
		name: "c.flwsp",
		enc: "011 uimm[5] rd uimm[4:2|7:6] 10",
		asm: "rd, imm(sp)",
		fregs: ["rd"],
		expands: "flw rd, uimm(sp)",
		description: "Load Float from SP (FP)",
		pseudocode: "rd ← M[ sp + uimm ][31:0]"
	},
	{
		group: "c.cr",
		name: "reserved",
		reserved: !0,
		enc: "1000 00000 00000 10",
		description: "RESERVED (rs1 = 0)"
	},
	{
		group: "c.cr",
		name: "c.jr",
		enc: "1000 rs1!=0 00000 10",
		asm: "rs1",
		expands: "jalr x0, 0(rs1)",
		description: "Jump Register",
		pseudocode: "PC = rs1"
	},
	{
		group: "c.cr",
		name: "c.mv",
		enc: "1000 rd!=0 rs2!=0 10",
		asm: "rd, rs2",
		expands: "add rd, x0, rs2",
		description: "Move Register",
		pseudocode: "rd = rs2"
	},
	{
		group: "c.cr",
		name: "hint",
		hint: !0,
		enc: "1000 00000 rs2!=0 10",
		description: "HINT — c.mv with rd = x0 (standard use)"
	},
	{
		group: "c.cr",
		name: "c.ebreak",
		enc: "1001 00000 00000 10",
		asm: "",
		expands: "ebreak",
		description: "Environment Break",
		pseudocode: "control back to debug environment"
	},
	{
		group: "c.cr",
		name: "c.jalr",
		enc: "1001 rs1!=0 00000 10",
		asm: "rs1",
		expands: "jalr x1, 0(rs1)",
		description: "Jump and Link Register",
		pseudocode: "ra = PC + 2 ; PC = rs1"
	},
	{
		group: "c.cr",
		name: "c.add",
		enc: "1001 rd/rs1!=0 rs2!=0 10",
		asm: "rd, rs2",
		expands: "add rd, rd, rs2",
		description: "Add",
		pseudocode: "rd += rs2"
	},
	{
		group: "c.cr",
		name: "hint",
		hint: !0,
		enc: "1001 00000 rs2!=0 10",
		description: "HINT — c.add with rd = x0 (standard use; rs2 = x2–x5 are c.ntl.p1 / pall / s1 / all)"
	},
	{
		group: "c.fsdsp",
		name: "c.fsdsp",
		enc: "101 uimm[5:3|8:6] rs2 10",
		asm: "rs2, imm(sp)",
		fregs: ["rs2"],
		expands: "fsd rs2, uimm(sp)",
		description: "Store Double to SP (FP)",
		pseudocode: "rs2 → M[ sp + uimm ][63:0]"
	},
	{
		group: "c.swsp",
		name: "c.swsp",
		enc: "110 uimm[5:2|7:6] rs2 10",
		asm: "rs2, imm(sp)",
		expands: "sw rs2, uimm(sp)",
		description: "Store Word to SP",
		pseudocode: "rs2 → M[ sp + uimm ][31:0]"
	},
	{
		group: "c.fswsp",
		name: "c.fswsp",
		enc: "111 uimm[5:2|7:6] rs2 10",
		asm: "rs2, imm(sp)",
		fregs: ["rs2"],
		expands: "fsw rs2, uimm(sp)",
		description: "Store Float to SP (FP)",
		pseudocode: "rs2 → M[ sp + uimm ][31:0]"
	},
	{
		group: "load",
		name: "lb",
		enc: "imm[11:0] rs1 000 rd 0000011",
		asm: "rd, imm(rs1)",
		description: "Load Byte",
		pseudocode: "rd ← sext( M[ rs1 + imm ][7:0] )"
	},
	{
		group: "load",
		name: "lh",
		enc: "imm[11:0] rs1 001 rd 0000011",
		asm: "rd, imm(rs1)",
		description: "Load Half-Word",
		pseudocode: "rd ← sext( M[ rs1 + imm ][15:0] )"
	},
	{
		group: "load",
		name: "lw",
		enc: "imm[11:0] rs1 010 rd 0000011",
		asm: "rd, imm(rs1)",
		description: "Load Word",
		pseudocode: "rd ← M[ rs1 + imm ][31:0]"
	},
	{
		group: "load",
		name: "lbu",
		enc: "imm[11:0] rs1 100 rd 0000011",
		asm: "rd, imm(rs1)",
		description: "Load Byte Unsigned",
		pseudocode: "rd ← zext( M[ rs1 + imm ][7:0] )"
	},
	{
		group: "load",
		name: "lhu",
		enc: "imm[11:0] rs1 101 rd 0000011",
		asm: "rd, imm(rs1)",
		description: "Load Half-Word Unsigned",
		pseudocode: "rd ← zext( M[ rs1 + imm ][15:0] )"
	},
	{
		group: "misc-mem",
		name: "fence",
		enc: "0000 pred succ ----- 000 ----- 0001111",
		asm: "pred, succ",
		description: "Fence",
		pseudocode: "order pred accesses before succ accesses"
	},
	{
		group: "misc-mem",
		name: "hint",
		hint: !0,
		enc: "0000 0001 0000 00000 000 00000 0001111",
		description: "PAUSE (Zihintpause) — fence w, 0: briefly pause instruction retirement"
	},
	{
		group: "misc-mem",
		name: "fence.tso",
		enc: "1000 0011 0011 ----- 000 ----- 0001111",
		asm: "",
		description: "Fence (Total Store Order)",
		pseudocode: "order rw → rw, except w → r"
	},
	{
		group: "misc-mem",
		name: "reserved",
		reserved: !0,
		enc: "---- ---- ---- ----- 000 ----- 0001111",
		description: "RESERVED fm / pred / succ — executes as a normal fence"
	},
	{
		group: "fencei",
		name: "fence.i",
		enc: "------------ ----- 001 ----- 0001111",
		asm: "",
		description: "Instruction Fence",
		pseudocode: "sync instruction and data streams"
	},
	{
		group: "op-imm",
		name: "addi",
		enc: "imm[11:0] rs1 000 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Add Immediate",
		pseudocode: "rd = rs1 + imm"
	},
	{
		group: "op-imm",
		name: "slli",
		enc: "0000000 shamt[4:0] rs1 001 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Shift Left Logical Immediate",
		pseudocode: "rd = rs1 << shamt"
	},
	{
		group: "op-imm",
		name: "slti",
		enc: "imm[11:0] rs1 010 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Set Less Than Immediate",
		pseudocode: "rd = ( rs1 < imm ) ? 1 : 0 (signed)"
	},
	{
		group: "op-imm",
		name: "sltiu",
		enc: "imm[11:0] rs1 011 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Set Less Than Immediate Unsigned",
		pseudocode: "rd = ( rs1 < imm ) ? 1 : 0 (unsigned)"
	},
	{
		group: "op-imm",
		name: "xori",
		enc: "imm[11:0] rs1 100 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Xor Immediate",
		pseudocode: "rd = rs1 ^ imm"
	},
	{
		group: "op-imm",
		name: "srli",
		enc: "0000000 shamt[4:0] rs1 101 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Shift Right Logical Immediate",
		pseudocode: "rd = rs1 >> shamt (zero extends)"
	},
	{
		group: "op-imm",
		name: "srai",
		enc: "0100000 shamt[4:0] rs1 101 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Shift Right Arithmetic Immediate",
		pseudocode: "rd = rs1 >> shamt (msb extends)"
	},
	{
		group: "op-imm",
		name: "ori",
		enc: "imm[11:0] rs1 110 rd 0010011",
		asm: "rd, rs1, imm",
		description: "Or Immediate",
		pseudocode: "rd = rs1 | imm"
	},
	{
		group: "op-imm",
		name: "andi",
		enc: "imm[11:0] rs1 111 rd 0010011",
		asm: "rd, rs1, imm",
		description: "And Immediate",
		pseudocode: "rd = rs1 & imm"
	},
	{
		group: "auipc",
		name: "auipc",
		enc: "imm[31:12] rd 0010111",
		asm: "rd, imm",
		asmShift: 12,
		description: "Add Upper Immediate to PC",
		pseudocode: "rd = PC + ( imm << 12 )"
	},
	{
		group: "store",
		name: "sb",
		enc: "imm[11:5] rs2 rs1 000 imm[4:0] 0100011",
		asm: "rs2, imm(rs1)",
		description: "Store Byte",
		pseudocode: "rs2[7:0] → M[ rs1 + imm ]"
	},
	{
		group: "store",
		name: "sh",
		enc: "imm[11:5] rs2 rs1 001 imm[4:0] 0100011",
		asm: "rs2, imm(rs1)",
		description: "Store Half-Word",
		pseudocode: "rs2[15:0] → M[ rs1 + imm ]"
	},
	{
		group: "store",
		name: "sw",
		enc: "imm[11:5] rs2 rs1 010 imm[4:0] 0100011",
		asm: "rs2, imm(rs1)",
		description: "Store Word",
		pseudocode: "rs2[31:0] → M[ rs1 + imm ]"
	},
	{
		group: "op",
		name: "add",
		enc: "0000000 rs2 rs1 000 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Add",
		pseudocode: "rd = rs1 + rs2"
	},
	{
		group: "op",
		name: "sub",
		enc: "0100000 rs2 rs1 000 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Subtract",
		pseudocode: "rd = rs1 - rs2"
	},
	{
		group: "op",
		name: "sll",
		enc: "0000000 rs2 rs1 001 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Shift Left Logical",
		pseudocode: "rd = rs1 << rs2[4:0]"
	},
	{
		group: "op",
		name: "slt",
		enc: "0000000 rs2 rs1 010 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Set Less Than",
		pseudocode: "rd = ( rs1 < rs2 ) ? 1 : 0 (signed)"
	},
	{
		group: "op",
		name: "sltu",
		enc: "0000000 rs2 rs1 011 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Set Less Than Unsigned",
		pseudocode: "rd = ( rs1 < rs2 ) ? 1 : 0 (unsigned)"
	},
	{
		group: "op",
		name: "xor",
		enc: "0000000 rs2 rs1 100 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Xor",
		pseudocode: "rd = rs1 ^ rs2"
	},
	{
		group: "op",
		name: "srl",
		enc: "0000000 rs2 rs1 101 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Shift Right Logical",
		pseudocode: "rd = rs1 >> rs2[4:0] (zero extends)"
	},
	{
		group: "op",
		name: "sra",
		enc: "0100000 rs2 rs1 101 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Shift Right Arithmetic",
		pseudocode: "rd = rs1 >> rs2[4:0] (msb extends)"
	},
	{
		group: "op",
		name: "or",
		enc: "0000000 rs2 rs1 110 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Or",
		pseudocode: "rd = rs1 | rs2"
	},
	{
		group: "op",
		name: "and",
		enc: "0000000 rs2 rs1 111 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "And",
		pseudocode: "rd = rs1 & rs2"
	},
	{
		group: "lui",
		name: "lui",
		enc: "imm[31:12] rd 0110111",
		asm: "rd, imm",
		asmShift: 12,
		description: "Load Upper Immediate",
		pseudocode: "rd = imm << 12"
	},
	{
		group: "branch",
		name: "beq",
		enc: "imm[12|10:5] rs2 rs1 000 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if EQual",
		pseudocode: "if ( rs1 == rs2 ) PC += imm"
	},
	{
		group: "branch",
		name: "bne",
		enc: "imm[12|10:5] rs2 rs1 001 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if Not Equal",
		pseudocode: "if ( rs1 != rs2 ) PC += imm"
	},
	{
		group: "branch",
		name: "blt",
		enc: "imm[12|10:5] rs2 rs1 100 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if Less Than",
		pseudocode: "if ( rs1 < rs2 ) PC += imm (signed)"
	},
	{
		group: "branch",
		name: "bge",
		enc: "imm[12|10:5] rs2 rs1 101 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if Greater or Equal",
		pseudocode: "if ( rs1 >= rs2 ) PC += imm (signed)"
	},
	{
		group: "branch",
		name: "bltu",
		enc: "imm[12|10:5] rs2 rs1 110 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if Less Than Unsigned",
		pseudocode: "if ( rs1 < rs2 ) PC += imm (unsigned)"
	},
	{
		group: "branch",
		name: "bgeu",
		enc: "imm[12|10:5] rs2 rs1 111 imm[4:1|11] 1100011",
		asm: "rs1, rs2, imm",
		description: "Branch if Greater or Equal Unsigned",
		pseudocode: "if ( rs1 >= rs2 ) PC += imm (unsigned)"
	},
	{
		group: "jalr",
		name: "jalr",
		enc: "imm[11:0] rs1 000 rd 1100111",
		asm: "rd, imm(rs1)",
		description: "Jump and Link Register",
		pseudocode: "rd = PC + 4 ; PC = ( rs1 + imm ) & ~1"
	},
	{
		group: "jal",
		name: "jal",
		enc: "imm[20|10:1|11|19:12] rd 1101111",
		asm: "rd, imm",
		description: "Jump and Link",
		pseudocode: "rd = PC + 4 ; PC += imm"
	},
	{
		group: "system",
		name: "ecall",
		enc: "000000000000 00000 000 00000 1110011",
		asm: "",
		description: "Environment Call",
		pseudocode: "transfer control to execution environment"
	},
	{
		group: "system",
		name: "ebreak",
		enc: "000000000001 00000 000 00000 1110011",
		asm: "",
		description: "Environment Break",
		pseudocode: "transfer control back to debug environment"
	},
	{
		group: "csr",
		name: "csrrw",
		enc: "csr[11:0] rs1 001 rd 1110011",
		asm: "rd, csr, rs1",
		description: "CSR Read and Write",
		pseudocode: "rd = CSR ; CSR = rs1"
	},
	{
		group: "csr",
		name: "csrrs",
		enc: "csr[11:0] rs1 010 rd 1110011",
		asm: "rd, csr, rs1",
		description: "CSR Read and Set",
		pseudocode: "rd = CSR ; CSR |= rs1"
	},
	{
		group: "csr",
		name: "csrrc",
		enc: "csr[11:0] rs1 011 rd 1110011",
		asm: "rd, csr, rs1",
		description: "CSR Read and Clear",
		pseudocode: "rd = CSR ; CSR &= ~rs1"
	},
	{
		group: "csr",
		name: "csrrwi",
		enc: "csr[11:0] zimm[4:0] 101 rd 1110011",
		asm: "rd, csr, imm",
		description: "CSR Read and Write Immediate",
		pseudocode: "rd = CSR ; CSR = zimm"
	},
	{
		group: "csr",
		name: "csrrsi",
		enc: "csr[11:0] zimm[4:0] 110 rd 1110011",
		asm: "rd, csr, imm",
		description: "CSR Read and Set Immediate",
		pseudocode: "rd = CSR ; CSR |= zimm"
	},
	{
		group: "csr",
		name: "csrrci",
		enc: "csr[11:0] zimm[4:0] 111 rd 1110011",
		asm: "rd, csr, imm",
		description: "CSR Read and Clear Immediate",
		pseudocode: "rd = CSR ; CSR &= ~zimm"
	},
	{
		group: "op-m",
		name: "mul",
		enc: "0000001 rs2 rs1 000 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Multiply",
		pseudocode: "rd = ( rs1 × rs2 )[31:0]"
	},
	{
		group: "op-m",
		name: "mulh",
		enc: "0000001 rs2 rs1 001 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Multiply High Signed × Signed",
		pseudocode: "rd = ( s rs1 × s rs2 )[63:32]"
	},
	{
		group: "op-m",
		name: "mulhsu",
		enc: "0000001 rs2 rs1 010 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Multiply High Signed × Unsigned",
		pseudocode: "rd = ( s rs1 × u rs2 )[63:32]"
	},
	{
		group: "op-m",
		name: "mulhu",
		enc: "0000001 rs2 rs1 011 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Multiply High Unsigned × Unsigned",
		pseudocode: "rd = ( u rs1 × u rs2 )[63:32]"
	},
	{
		group: "op-m",
		name: "div",
		enc: "0000001 rs2 rs1 100 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Divide",
		pseudocode: "rd = rs1 ÷ rs2 (signed)"
	},
	{
		group: "op-m",
		name: "divu",
		enc: "0000001 rs2 rs1 101 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Divide Unsigned",
		pseudocode: "rd = rs1 ÷ rs2 (unsigned)"
	},
	{
		group: "op-m",
		name: "rem",
		enc: "0000001 rs2 rs1 110 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Remainder",
		pseudocode: "rd = rs1 % rs2 (signed)"
	},
	{
		group: "op-m",
		name: "remu",
		enc: "0000001 rs2 rs1 111 rd 0110011",
		asm: "rd, rs1, rs2",
		description: "Remainder Unsigned",
		pseudocode: "rd = rs1 % rs2 (unsigned)"
	},
	{
		group: "amo",
		name: "lr.w",
		enc: "00010 aq rl 00000 rs1 010 rd 0101111",
		asm: "rd, (rs1)",
		description: "Load Reserved",
		pseudocode: "rd ← M[rs1] ; reserve M[rs1]"
	},
	{
		group: "amo",
		name: "sc.w",
		enc: "00011 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Store Conditional",
		pseudocode: "if reserved { M[rs1] = rs2 ; rd = 0 } else rd ≠ 0"
	},
	{
		group: "amo",
		name: "amoswap.w",
		enc: "00001 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Swap",
		pseudocode: "t = M[rs1] ; M[rs1] = rs2 ; rd = t"
	},
	{
		group: "amo",
		name: "amoadd.w",
		enc: "00000 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Add",
		pseudocode: "t = M[rs1] ; M[rs1] = t + rs2 ; rd = t"
	},
	{
		group: "amo",
		name: "amoxor.w",
		enc: "00100 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Xor",
		pseudocode: "t = M[rs1] ; M[rs1] = t ^ rs2 ; rd = t"
	},
	{
		group: "amo",
		name: "amoand.w",
		enc: "01100 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic And",
		pseudocode: "t = M[rs1] ; M[rs1] = t & rs2 ; rd = t"
	},
	{
		group: "amo",
		name: "amoor.w",
		enc: "01000 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Or",
		pseudocode: "t = M[rs1] ; M[rs1] = t | rs2 ; rd = t"
	},
	{
		group: "amo",
		name: "amomin.w",
		enc: "10000 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Min",
		pseudocode: "t = M[rs1] ; M[rs1] = min( t, rs2 ) (signed) ; rd = t"
	},
	{
		group: "amo",
		name: "amomax.w",
		enc: "10100 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Max",
		pseudocode: "t = M[rs1] ; M[rs1] = max( t, rs2 ) (signed) ; rd = t"
	},
	{
		group: "amo",
		name: "amominu.w",
		enc: "11000 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Min Unsigned",
		pseudocode: "t = M[rs1] ; M[rs1] = min( t, rs2 ) (unsigned) ; rd = t"
	},
	{
		group: "amo",
		name: "amomaxu.w",
		enc: "11100 aq rl rs2 rs1 010 rd 0101111",
		asm: "rd, rs2, (rs1)",
		description: "Atomic Max Unsigned",
		pseudocode: "t = M[rs1] ; M[rs1] = max( t, rs2 ) (unsigned) ; rd = t"
	},
	{
		group: "load-fp",
		extension: "F",
		name: "flw",
		enc: "imm[11:0] rs1 010 rd 0000111",
		asm: "rd, imm(rs1)",
		fregs: ["rd"],
		description: "Load Float",
		pseudocode: "rd ← M[ rs1 + imm ][31:0]"
	},
	{
		group: "store-fp",
		extension: "F",
		name: "fsw",
		enc: "imm[11:5] rs2 rs1 010 imm[4:0] 0100111",
		asm: "rs2, imm(rs1)",
		fregs: ["rs2"],
		description: "Store Float",
		pseudocode: "rs2[31:0] → M[ rs1 + imm ]"
	},
	{
		group: "madd",
		extension: "F",
		name: "fmadd.s",
		enc: "rs3 00 rs2 rs1 rm rd 1000011",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Multiply-Add",
		pseudocode: "rd = rs1 × rs2 + rs3"
	},
	{
		group: "msub",
		extension: "F",
		name: "fmsub.s",
		enc: "rs3 00 rs2 rs1 rm rd 1000111",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Multiply-Subtract",
		pseudocode: "rd = rs1 × rs2 − rs3"
	},
	{
		group: "nmsub",
		extension: "F",
		name: "fnmsub.s",
		enc: "rs3 00 rs2 rs1 rm rd 1001011",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Negated Multiply-Subtract",
		pseudocode: "rd = −(rs1 × rs2) + rs3"
	},
	{
		group: "nmadd",
		extension: "F",
		name: "fnmadd.s",
		enc: "rs3 00 rs2 rs1 rm rd 1001111",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Negated Multiply-Add",
		pseudocode: "rd = −(rs1 × rs2) − rs3"
	},
	{
		group: "op-fp",
		name: "fadd.s",
		enc: "0000000 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Add",
		pseudocode: "rd = rs1 + rs2"
	},
	{
		group: "op-fp",
		name: "fsub.s",
		enc: "0000100 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Subtract",
		pseudocode: "rd = rs1 − rs2"
	},
	{
		group: "op-fp",
		name: "fmul.s",
		enc: "0001000 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Multiply",
		pseudocode: "rd = rs1 × rs2"
	},
	{
		group: "op-fp",
		name: "fdiv.s",
		enc: "0001100 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Divide",
		pseudocode: "rd = rs1 ÷ rs2"
	},
	{
		group: "op-fp",
		name: "fsqrt.s",
		enc: "0101100 00000 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: r,
		description: "Square Root",
		pseudocode: "rd = √rs1"
	},
	{
		group: "op-fp",
		name: "fsgnj.s",
		enc: "0010000 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject",
		pseudocode: "rd = { rs2[31], rs1[30:0] }"
	},
	{
		group: "op-fp",
		name: "fsgnjn.s",
		enc: "0010000 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject Negated",
		pseudocode: "rd = { ~rs2[31], rs1[30:0] }"
	},
	{
		group: "op-fp",
		name: "fsgnjx.s",
		enc: "0010000 rs2 rs1 010 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject Xor",
		pseudocode: "rd = { rs1[31] ^ rs2[31], rs1[30:0] }"
	},
	{
		group: "op-fp",
		name: "fmin.s",
		enc: "0010100 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Minimum",
		pseudocode: "rd = min( rs1, rs2 )"
	},
	{
		group: "op-fp",
		name: "fmax.s",
		enc: "0010100 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Maximum",
		pseudocode: "rd = max( rs1, rs2 )"
	},
	{
		group: "op-fp",
		name: "fcvt.w.s",
		enc: "1100000 00000 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rs1"],
		description: "Convert Float to Word",
		pseudocode: "x[rd] = (int32) f[rs1]"
	},
	{
		group: "op-fp",
		name: "fcvt.wu.s",
		enc: "1100000 00001 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rs1"],
		description: "Convert Float to Unsigned Word",
		pseudocode: "x[rd] = (uint32) f[rs1]"
	},
	{
		group: "op-fp",
		name: "fmv.x.w",
		enc: "1110000 00000 rs1 000 rd 1010011",
		asm: "rd, rs1",
		fregs: ["rs1"],
		description: "Move Float bits to Integer",
		pseudocode: "x[rd] = f[rs1][31:0]"
	},
	{
		group: "op-fp",
		name: "feq.s",
		enc: "1010000 rs2 rs1 010 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Equal",
		pseudocode: "x[rd] = ( rs1 == rs2 )"
	},
	{
		group: "op-fp",
		name: "flt.s",
		enc: "1010000 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Less Than",
		pseudocode: "x[rd] = ( rs1 < rs2 )"
	},
	{
		group: "op-fp",
		name: "fle.s",
		enc: "1010000 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Less or Equal",
		pseudocode: "x[rd] = ( rs1 <= rs2 )"
	},
	{
		group: "op-fp",
		name: "fclass.s",
		enc: "1110000 00000 rs1 001 rd 1010011",
		asm: "rd, rs1",
		fregs: ["rs1"],
		description: "Classify",
		pseudocode: "x[rd] = class mask of f[rs1]"
	},
	{
		group: "op-fp",
		name: "fcvt.s.w",
		enc: "1101000 00000 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rd"],
		description: "Convert Word to Float",
		pseudocode: "f[rd] = (float) (int32) x[rs1]"
	},
	{
		group: "op-fp",
		name: "fcvt.s.wu",
		enc: "1101000 00001 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rd"],
		description: "Convert Unsigned Word to Float",
		pseudocode: "f[rd] = (float) (uint32) x[rs1]"
	},
	{
		group: "op-fp",
		name: "fmv.w.x",
		enc: "1111000 00000 rs1 000 rd 1010011",
		asm: "rd, rs1",
		fregs: ["rd"],
		description: "Move Integer bits to Float",
		pseudocode: "f[rd] = x[rs1][31:0]"
	},
	{
		group: "load-fp",
		extension: "D",
		name: "fld",
		enc: "imm[11:0] rs1 011 rd 0000111",
		asm: "rd, imm(rs1)",
		fregs: ["rd"],
		description: "Load Double",
		pseudocode: "rd ← M[ rs1 + imm ][63:0]"
	},
	{
		group: "store-fp",
		extension: "D",
		name: "fsd",
		enc: "imm[11:5] rs2 rs1 011 imm[4:0] 0100111",
		asm: "rs2, imm(rs1)",
		fregs: ["rs2"],
		description: "Store Double",
		pseudocode: "rs2[63:0] → M[ rs1 + imm ]"
	},
	{
		group: "madd",
		extension: "D",
		name: "fmadd.d",
		enc: "rs3 01 rs2 rs1 rm rd 1000011",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Multiply-Add",
		pseudocode: "rd = rs1 × rs2 + rs3"
	},
	{
		group: "msub",
		extension: "D",
		name: "fmsub.d",
		enc: "rs3 01 rs2 rs1 rm rd 1000111",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Multiply-Subtract",
		pseudocode: "rd = rs1 × rs2 − rs3"
	},
	{
		group: "nmsub",
		extension: "D",
		name: "fnmsub.d",
		enc: "rs3 01 rs2 rs1 rm rd 1001011",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Negated Multiply-Subtract",
		pseudocode: "rd = −(rs1 × rs2) + rs3"
	},
	{
		group: "nmadd",
		extension: "D",
		name: "fnmadd.d",
		enc: "rs3 01 rs2 rs1 rm rd 1001111",
		asm: "rd, rs1, rs2, rs3, rm",
		fregs: r,
		description: "Fused Negated Multiply-Add",
		pseudocode: "rd = −(rs1 × rs2) − rs3"
	},
	{
		group: "op-fp-d",
		name: "fadd.d",
		enc: "0000001 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Add",
		pseudocode: "rd = rs1 + rs2"
	},
	{
		group: "op-fp-d",
		name: "fsub.d",
		enc: "0000101 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Subtract",
		pseudocode: "rd = rs1 − rs2"
	},
	{
		group: "op-fp-d",
		name: "fmul.d",
		enc: "0001001 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Multiply",
		pseudocode: "rd = rs1 × rs2"
	},
	{
		group: "op-fp-d",
		name: "fdiv.d",
		enc: "0001101 rs2 rs1 rm rd 1010011",
		asm: "rd, rs1, rs2, rm",
		fregs: r,
		description: "Divide",
		pseudocode: "rd = rs1 ÷ rs2"
	},
	{
		group: "op-fp-d",
		name: "fsqrt.d",
		enc: "0101101 00000 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: r,
		description: "Square Root",
		pseudocode: "rd = √rs1"
	},
	{
		group: "op-fp-d",
		name: "fsgnj.d",
		enc: "0010001 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject",
		pseudocode: "rd = { rs2[63], rs1[62:0] }"
	},
	{
		group: "op-fp-d",
		name: "fsgnjn.d",
		enc: "0010001 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject Negated",
		pseudocode: "rd = { ~rs2[63], rs1[62:0] }"
	},
	{
		group: "op-fp-d",
		name: "fsgnjx.d",
		enc: "0010001 rs2 rs1 010 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Sign Inject Xor",
		pseudocode: "rd = { rs1[63] ^ rs2[63], rs1[62:0] }"
	},
	{
		group: "op-fp-d",
		name: "fmin.d",
		enc: "0010101 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Minimum",
		pseudocode: "rd = min( rs1, rs2 )"
	},
	{
		group: "op-fp-d",
		name: "fmax.d",
		enc: "0010101 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: r,
		description: "Maximum",
		pseudocode: "rd = max( rs1, rs2 )"
	},
	{
		group: "op-fp-d",
		name: "fcvt.s.d",
		enc: "0100000 00001 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: r,
		description: "Convert Double to Float",
		pseudocode: "f[rd] = (float) f[rs1]"
	},
	{
		group: "op-fp-d",
		name: "fcvt.d.s",
		enc: "0100001 00000 rs1 rm rd 1010011",
		asm: "rd, rs1",
		rmDefault: 0,
		fregs: r,
		description: "Convert Float to Double",
		pseudocode: "f[rd] = (double) f[rs1]"
	},
	{
		group: "op-fp-d",
		name: "feq.d",
		enc: "1010001 rs2 rs1 010 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Equal",
		pseudocode: "x[rd] = ( rs1 == rs2 )"
	},
	{
		group: "op-fp-d",
		name: "flt.d",
		enc: "1010001 rs2 rs1 001 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Less Than",
		pseudocode: "x[rd] = ( rs1 < rs2 )"
	},
	{
		group: "op-fp-d",
		name: "fle.d",
		enc: "1010001 rs2 rs1 000 rd 1010011",
		asm: "rd, rs1, rs2",
		fregs: ["rs1", "rs2"],
		description: "Less or Equal",
		pseudocode: "x[rd] = ( rs1 <= rs2 )"
	},
	{
		group: "op-fp-d",
		name: "fclass.d",
		enc: "1110001 00000 rs1 001 rd 1010011",
		asm: "rd, rs1",
		fregs: ["rs1"],
		description: "Classify",
		pseudocode: "x[rd] = class mask of f[rs1]"
	},
	{
		group: "op-fp-d",
		name: "fcvt.w.d",
		enc: "1100001 00000 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rs1"],
		description: "Convert Double to Word",
		pseudocode: "x[rd] = (int32) f[rs1]"
	},
	{
		group: "op-fp-d",
		name: "fcvt.wu.d",
		enc: "1100001 00001 rs1 rm rd 1010011",
		asm: "rd, rs1, rm",
		fregs: ["rs1"],
		description: "Convert Double to Unsigned Word",
		pseudocode: "x[rd] = (uint32) f[rs1]"
	},
	{
		group: "op-fp-d",
		name: "fcvt.d.w",
		enc: "1101001 00000 rs1 rm rd 1010011",
		asm: "rd, rs1",
		rmDefault: 0,
		fregs: ["rd"],
		description: "Convert Word to Double",
		pseudocode: "f[rd] = (double) (int32) x[rs1]"
	},
	{
		group: "op-fp-d",
		name: "fcvt.d.wu",
		enc: "1101001 00001 rs1 rm rd 1010011",
		asm: "rd, rs1",
		rmDefault: 0,
		fregs: ["rd"],
		description: "Convert Unsigned Word to Double",
		pseudocode: "f[rd] = (double) (uint32) x[rs1]"
	}
], a = [
	{
		opcode: "0001011",
		name: "custom-0",
		note: "designated for custom extensions"
	},
	{
		opcode: "0011011",
		name: "OP-IMM-32",
		note: "RV64 only (addiw, slliw, …)"
	},
	{
		opcode: "0011111",
		name: "reserved (>32b)",
		note: "reserved for instructions longer than 32 bit"
	},
	{
		opcode: "0101011",
		name: "custom-1",
		note: "designated for custom extensions"
	},
	{
		opcode: "0111011",
		name: "OP-32",
		note: "RV64 only (addw, subw, …)"
	},
	{
		opcode: "0111111",
		name: "reserved (>32b)",
		note: "reserved for instructions longer than 32 bit"
	},
	{
		opcode: "1010111",
		name: "OP-V",
		note: "'V' vector extension"
	},
	{
		opcode: "1011011",
		name: "custom-2",
		note: "designated for custom extensions"
	},
	{
		opcode: "1011111",
		name: "reserved (>32b)",
		note: "reserved for instructions longer than 32 bit"
	},
	{
		opcode: "1101011",
		name: "reserved",
		note: "reserved for future standard extensions"
	},
	{
		opcode: "1110111",
		name: "OP-VE",
		note: "vector crypto extensions (Zvk*)"
	},
	{
		opcode: "1111011",
		name: "custom-3",
		note: "designated for custom extensions"
	},
	{
		opcode: "1111111",
		name: "reserved (>32b)",
		note: "reserved for instructions longer than 32 bit"
	}
], o = [
	{
		name: "nop",
		asm: "",
		expands: [["addi", {
			rd: 0,
			rs1: 0,
			imm: 0
		}]],
		description: "No Operation"
	},
	{
		name: "li",
		asm: "rd, imm",
		expands: [["lui", { imm: "hi" }], ["addi", {
			rs1: "rd",
			imm: "lo"
		}]],
		short: [["addi", { rs1: 0 }]],
		dropZeroLo: !0,
		description: "Load Immediate (just addi rd, x0, imm when imm fits in 12 bits; just lui when imm[11:0] = 0)"
	},
	{
		name: "mv",
		asm: "rd, rs",
		expands: [["addi", {
			rs1: "rs",
			imm: 0
		}]],
		description: "Move Register"
	},
	{
		name: "not",
		asm: "rd, rs",
		expands: [["xori", {
			rs1: "rs",
			imm: -1
		}]],
		description: "1's Complement"
	},
	{
		name: "neg",
		asm: "rd, rs",
		expands: [["sub", {
			rs1: 0,
			rs2: "rs"
		}]],
		description: "2's Complement"
	},
	{
		name: "seqz",
		asm: "rd, rs",
		expands: [["sltiu", {
			rs1: "rs",
			imm: 1
		}]],
		description: "Set if = Zero"
	},
	{
		name: "snez",
		asm: "rd, rs",
		expands: [["sltu", {
			rs1: 0,
			rs2: "rs"
		}]],
		description: "Set if ≠ Zero"
	},
	{
		name: "sltz",
		asm: "rd, rs",
		expands: [["slt", {
			rs1: "rs",
			rs2: 0
		}]],
		description: "Set if < Zero"
	},
	{
		name: "sgtz",
		asm: "rd, rs",
		expands: [["slt", {
			rs1: 0,
			rs2: "rs"
		}]],
		description: "Set if > Zero"
	},
	{
		name: "beqz",
		asm: "rs, imm",
		expands: [["beq", {
			rs1: "rs",
			rs2: 0
		}]],
		description: "Branch if = Zero"
	},
	{
		name: "bnez",
		asm: "rs, imm",
		expands: [["bne", {
			rs1: "rs",
			rs2: 0
		}]],
		description: "Branch if ≠ Zero"
	},
	{
		name: "blez",
		asm: "rs, imm",
		expands: [["bge", {
			rs1: 0,
			rs2: "rs"
		}]],
		description: "Branch if ≤ Zero"
	},
	{
		name: "bgez",
		asm: "rs, imm",
		expands: [["bge", {
			rs1: "rs",
			rs2: 0
		}]],
		description: "Branch if ≥ Zero"
	},
	{
		name: "bltz",
		asm: "rs, imm",
		expands: [["blt", {
			rs1: "rs",
			rs2: 0
		}]],
		description: "Branch if < Zero"
	},
	{
		name: "bgtz",
		asm: "rs, imm",
		expands: [["blt", {
			rs1: 0,
			rs2: "rs"
		}]],
		description: "Branch if > Zero"
	},
	{
		name: "bgt",
		asm: "rs, rt, imm",
		expands: [["blt", {
			rs1: "rt",
			rs2: "rs"
		}]],
		description: "Branch if Greater"
	},
	{
		name: "ble",
		asm: "rs, rt, imm",
		expands: [["bge", {
			rs1: "rt",
			rs2: "rs"
		}]],
		description: "Branch if Less or Equal"
	},
	{
		name: "bgtu",
		asm: "rs, rt, imm",
		expands: [["bltu", {
			rs1: "rt",
			rs2: "rs"
		}]],
		description: "Branch if Greater Unsigned"
	},
	{
		name: "bleu",
		asm: "rs, rt, imm",
		expands: [["bgeu", {
			rs1: "rt",
			rs2: "rs"
		}]],
		description: "Branch if Less or Equal Unsigned"
	},
	{
		name: "j",
		asm: "imm",
		expands: [["jal", { rd: 0 }]],
		description: "Jump"
	},
	{
		name: "jal",
		asm: "imm",
		expands: [["jal", { rd: 1 }]],
		description: "Jump and Link (to ra)"
	},
	{
		name: "jr",
		asm: "rs",
		expands: [["jalr", {
			rd: 0,
			rs1: "rs",
			imm: 0
		}]],
		description: "Jump Register"
	},
	{
		name: "jalr",
		asm: "rs",
		expands: [["jalr", {
			rd: 1,
			rs1: "rs",
			imm: 0
		}]],
		description: "Jump and Link Register (to ra)"
	},
	{
		name: "ret",
		asm: "",
		expands: [["jalr", {
			rd: 0,
			rs1: 1,
			imm: 0
		}]],
		description: "Return from Subroutine"
	},
	{
		name: "call",
		asm: "imm",
		expands: [["auipc", {
			rd: 1,
			imm: "hi"
		}], ["jalr", {
			rd: 1,
			rs1: 1,
			imm: "lo"
		}]],
		description: "Call Far-Away Subroutine"
	},
	{
		name: "tail",
		asm: "imm",
		expands: [["auipc", {
			rd: 6,
			imm: "hi"
		}], ["jalr", {
			rd: 0,
			rs1: 6,
			imm: "lo"
		}]],
		description: "Tail Call Far-Away Subroutine"
	},
	{
		name: "la",
		asm: "rd, imm",
		expands: [["auipc", { imm: "hi" }], ["addi", {
			rs1: "rd",
			imm: "lo"
		}]],
		description: "Load Address (PC-relative)"
	},
	{
		name: "lla",
		asm: "rd, imm",
		expands: [["auipc", { imm: "hi" }], ["addi", {
			rs1: "rd",
			imm: "lo"
		}]],
		description: "Load Local Address (always PC-relative)"
	},
	{
		name: "lb",
		asm: "rd, imm",
		expands: [["auipc", { imm: "hi" }], ["lb", {
			rs1: "rd",
			imm: "lo"
		}]],
		description: "Load Global Byte"
	},
	{
		name: "lh",
		asm: "rd, imm",
		expands: [["auipc", { imm: "hi" }], ["lh", {
			rs1: "rd",
			imm: "lo"
		}]],
		description: "Load Global Half-Word"
	},
	{
		name: "lw",
		asm: "rd, imm",
		expands: [["auipc", { imm: "hi" }], ["lw", {
			rs1: "rd",
			imm: "lo"
		}]],
		description: "Load Global Word"
	},
	{
		name: "sb",
		asm: "rs2, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["sb", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Store Global Byte"
	},
	{
		name: "sh",
		asm: "rs2, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["sh", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Store Global Half-Word"
	},
	{
		name: "sw",
		asm: "rs2, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["sw", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Store Global Word"
	},
	{
		name: "flw",
		asm: "rd, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["flw", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Load Global Float"
	},
	{
		name: "fld",
		asm: "rd, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["fld", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Load Global Double"
	},
	{
		name: "fsw",
		asm: "rs2, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["fsw", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Store Global Float"
	},
	{
		name: "fsd",
		asm: "rs2, imm, rt",
		expands: [["auipc", {
			rd: "rt",
			imm: "hi"
		}], ["fsd", {
			rs1: "rt",
			imm: "lo"
		}]],
		description: "Store Global Double"
	},
	{
		name: "fence",
		asm: "",
		expands: [["fence", {
			pred: 15,
			succ: 15
		}]],
		description: "Fence (all accesses)"
	},
	{
		name: "pause",
		asm: "",
		expands: [["fence", {
			pred: 1,
			succ: 0
		}]],
		description: "Pause Hint (Zihintpause)"
	},
	{
		name: "csrr",
		asm: "rd, csr",
		expands: [["csrrs", { rs1: 0 }]],
		description: "CSR Read"
	},
	{
		name: "csrw",
		asm: "csr, rs",
		expands: [["csrrw", {
			rd: 0,
			rs1: "rs"
		}]],
		description: "CSR Write"
	},
	{
		name: "csrs",
		asm: "csr, rs",
		expands: [["csrrs", {
			rd: 0,
			rs1: "rs"
		}]],
		description: "CSR Set bits"
	},
	{
		name: "csrc",
		asm: "csr, rs",
		expands: [["csrrc", {
			rd: 0,
			rs1: "rs"
		}]],
		description: "CSR Clear bits"
	},
	{
		name: "csrwi",
		asm: "csr, imm",
		expands: [["csrrwi", { rd: 0 }]],
		description: "CSR Write Immediate"
	},
	{
		name: "csrsi",
		asm: "csr, imm",
		expands: [["csrrsi", { rd: 0 }]],
		description: "CSR Set bits Immediate"
	},
	{
		name: "csrci",
		asm: "csr, imm",
		expands: [["csrrci", { rd: 0 }]],
		description: "CSR Clear bits Immediate"
	},
	{
		name: "rdcycle",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3072,
			rs1: 0
		}]],
		description: "Read Cycle Counter"
	},
	{
		name: "rdtime",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3073,
			rs1: 0
		}]],
		description: "Read Real-Time Clock"
	},
	{
		name: "rdinstret",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3074,
			rs1: 0
		}]],
		description: "Read Instructions-Retired Counter"
	},
	{
		name: "rdcycleh",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3200,
			rs1: 0
		}]],
		description: "Read Cycle Counter, upper 32 bits"
	},
	{
		name: "rdtimeh",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3201,
			rs1: 0
		}]],
		description: "Read Real-Time Clock, upper 32 bits"
	},
	{
		name: "rdinstreth",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3202,
			rs1: 0
		}]],
		description: "Read Instructions-Retired Counter, upper 32 bits"
	},
	{
		name: "frcsr",
		asm: "rd",
		expands: [["csrrs", {
			csr: 3,
			rs1: 0
		}]],
		description: "Read FP Control/Status Register"
	},
	{
		name: "fscsr",
		asm: "rd, rs",
		expands: [["csrrw", {
			csr: 3,
			rs1: "rs"
		}]],
		description: "Swap FP Control/Status Register"
	},
	{
		name: "fscsr",
		asm: "rs",
		expands: [["csrrw", {
			rd: 0,
			csr: 3,
			rs1: "rs"
		}]],
		description: "Write FP Control/Status Register"
	},
	{
		name: "frrm",
		asm: "rd",
		expands: [["csrrs", {
			csr: 2,
			rs1: 0
		}]],
		description: "Read FP Rounding Mode"
	},
	{
		name: "fsrm",
		asm: "rd, rs",
		expands: [["csrrw", {
			csr: 2,
			rs1: "rs"
		}]],
		description: "Swap FP Rounding Mode"
	},
	{
		name: "fsrm",
		asm: "rs",
		expands: [["csrrw", {
			rd: 0,
			csr: 2,
			rs1: "rs"
		}]],
		description: "Write FP Rounding Mode"
	},
	{
		name: "fsrmi",
		asm: "rd, imm",
		expands: [["csrrwi", { csr: 2 }]],
		description: "Swap FP Rounding Mode, Immediate"
	},
	{
		name: "fsrmi",
		asm: "imm",
		expands: [["csrrwi", {
			rd: 0,
			csr: 2
		}]],
		description: "Write FP Rounding Mode, Immediate"
	},
	{
		name: "frflags",
		asm: "rd",
		expands: [["csrrs", {
			csr: 1,
			rs1: 0
		}]],
		description: "Read FP Exception Flags"
	},
	{
		name: "fsflags",
		asm: "rd, rs",
		expands: [["csrrw", {
			csr: 1,
			rs1: "rs"
		}]],
		description: "Swap FP Exception Flags"
	},
	{
		name: "fsflags",
		asm: "rs",
		expands: [["csrrw", {
			rd: 0,
			csr: 1,
			rs1: "rs"
		}]],
		description: "Write FP Exception Flags"
	},
	{
		name: "fsflagsi",
		asm: "rd, imm",
		expands: [["csrrwi", { csr: 1 }]],
		description: "Swap FP Exception Flags, Immediate"
	},
	{
		name: "fsflagsi",
		asm: "imm",
		expands: [["csrrwi", {
			rd: 0,
			csr: 1
		}]],
		description: "Write FP Exception Flags, Immediate"
	},
	{
		name: "fmv.s",
		asm: "rd, rs",
		expands: [["fsgnj.s", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Copy Float Register"
	},
	{
		name: "fabs.s",
		asm: "rd, rs",
		expands: [["fsgnjx.s", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Float Absolute Value"
	},
	{
		name: "fneg.s",
		asm: "rd, rs",
		expands: [["fsgnjn.s", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Float Negate"
	},
	{
		name: "fmv.d",
		asm: "rd, rs",
		expands: [["fsgnj.d", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Copy Double Register"
	},
	{
		name: "fabs.d",
		asm: "rd, rs",
		expands: [["fsgnjx.d", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Double Absolute Value"
	},
	{
		name: "fneg.d",
		asm: "rd, rs",
		expands: [["fsgnjn.d", {
			rs1: "rs",
			rs2: "rs"
		}]],
		description: "Double Negate"
	}
], s = /^(rd|rs1|rs2|rs3)('?)(?:\/(?:rd|rs1|rs2)'?)?(?:!=(\d+|\{[\d,]+\}))?$/, c = /^(imm|uimm|nzimm|nzuimm|offset|shamt|zimm|csr)\[([\d:|]+)\]$/, l = {
	aq: 1,
	rl: 1,
	rm: 3,
	pred: 4,
	succ: 4
}, u = [
	"imm",
	"nzimm",
	"offset"
], d = /(?:rd|rs1|rs2|rs3|rs|rt)'?|imm|csr|rm|pred|succ|sp/g, f = /* @__PURE__ */ "zero.ra.sp.gp.tp.t0.t1.t2.s0.s1.a0.a1.a2.a3.a4.a5.a6.a7.s2.s3.s4.s5.s6.s7.s8.s9.s10.s11.t3.t4.t5.t6".split("."), p = /* @__PURE__ */ "ft0.ft1.ft2.ft3.ft4.ft5.ft6.ft7.fs0.fs1.fa0.fa1.fa2.fa3.fa4.fa5.fa6.fa7.fs2.fs3.fs4.fs5.fs6.fs7.fs8.fs9.fs10.fs11.ft8.ft9.ft10.ft11".split("."), m = [
	"rne",
	"rtz",
	"rdn",
	"rup",
	"rmm",
	"",
	"",
	"dyn"
], h = {
	fflags: 1,
	frm: 2,
	fcsr: 3,
	cycle: 3072,
	time: 3073,
	instret: 3074,
	cycleh: 3200,
	timeh: 3201,
	instreth: 3202,
	sstatus: 256,
	sie: 260,
	stvec: 261,
	scounteren: 262,
	sscratch: 320,
	sepc: 321,
	scause: 322,
	stval: 323,
	sip: 324,
	satp: 384,
	mvendorid: 3857,
	marchid: 3858,
	mimpid: 3859,
	mhartid: 3860,
	mstatus: 768,
	misa: 769,
	medeleg: 770,
	mideleg: 771,
	mie: 772,
	mtvec: 773,
	mcounteren: 774,
	mstatush: 784,
	mscratch: 832,
	mepc: 833,
	mcause: 834,
	mtval: 835,
	mip: 836,
	mcycle: 2816,
	minstret: 2818,
	mcycleh: 2944,
	minstreth: 2946
}, g = {
	32: [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		12,
		13,
		14,
		25,
		26,
		27,
		28,
		29,
		30,
		31,
		20,
		21,
		22,
		23,
		24,
		15,
		16,
		17,
		18,
		19,
		7,
		8,
		9,
		10,
		11
	],
	16: [
		0,
		1,
		13,
		14,
		15,
		12,
		10,
		11,
		5,
		6,
		2,
		3,
		4,
		7,
		8,
		9
	]
};
function _({ format: t = "R", bit: n = 0 }) {
	let r = e[t].layout.find(([, e, t]) => n <= e && n >= t);
	return r ? r[3] : "funct";
}
function ee({ spec: e = "" }) {
	return e.split("|").map((e) => {
		let [t, n = t] = e.split(":").map(Number), r = [];
		for (let e = t; e >= n; e--) r.push(e);
		return r;
	});
}
function te({ enc: e = "", format: t = "R" }) {
	let n = [];
	for (let t of e.trim().split(/\s+/)) {
		let r;
		if (/^[01]+$/.test(t)) n.push({
			kind: "lit",
			label: t,
			width: t.length,
			bits: t
		});
		else if (/^-+$/.test(t)) n.push({
			kind: "any",
			label: "–",
			width: t.length
		});
		else if (r = t.match(s)) {
			let e = r[3] ? r[3].replace(/[{}]/g, "").split(",").map(Number) : [], i = t.replace(/!=\{?([\d,]+)\}?/, " ≠ $1").replace(/,/g, ", ");
			n.push({
				kind: "reg",
				key: r[1],
				compressed: r[2] === "'",
				width: r[2] ? 3 : 5,
				exclude: e,
				label: i
			});
		} else if (r = t.match(c)) {
			if (r[1] === "csr") {
				n.push({
					kind: "field",
					key: "csr",
					label: t,
					width: 12
				});
				continue;
			}
			ee({ spec: r[2] }).forEach((e, t) => n.push({
				kind: "imm",
				key: "imm",
				name: r[1],
				part: t,
				immBits: e,
				width: e.length,
				label: e.length === 1 ? `${e[0]}` : `${e[0]}:${e[e.length - 1]}`
			}));
		} else if (l[t]) n.push({
			kind: "field",
			key: t,
			label: t,
			width: l[t]
		});
		else throw Error(`Unknown encoding token "${t}" in "${e}"`);
	}
	let r = n.reduce((e, t) => e + t.width, 0), i = r;
	for (let e of n) e.hi = r - 1, e.lo = r - e.width, r = e.lo, e.kind === "lit" && (e.role = _({
		format: t,
		bit: e.hi
	}));
	return {
		width: i,
		segments: n
	};
}
function v({ word: e = 0, hi: t = 0, lo: n = 0 }) {
	return e >>> n & 2 ** (t - n + 1) - 1;
}
function ne({ value: e = 0, width: t = 1 }) {
	return (e >>> 0 & 2 ** t - 1).toString(2).padStart(t, "0");
}
var y = i.map((t, r) => {
	let i = n[t.group], { width: a, segments: o } = te({
		enc: t.enc,
		format: i.format
	});
	if (a !== e[i.format].width) throw Error(`${t.name}: encoding is ${a} bits`);
	let s = 0, c = 0;
	for (let e of o.filter((e) => e.kind === "lit")) s |= 2 ** e.width - 1 << e.lo, c |= parseInt(e.bits, 2) << e.lo;
	s >>>= 0, c >>>= 0;
	let l = o.filter((e) => e.kind === "imm"), d = l.length ? Math.max(...l.flatMap((e) => e.immBits)) : -1, f = g[a].map((e) => s >>> e & 1 ? c >>> e & 1 : 2).join("");
	return {
		...i,
		...t,
		id: t.reserved || t.hint ? `${t.name}@${t.group}#${r}` : t.name,
		groupKey: t.group,
		width: a,
		segments: o,
		mask: s,
		match: c,
		sortKey: f,
		literalCount: o.filter((e) => e.kind === "lit").reduce((e, t) => e + t.width, 0),
		immName: l.length ? l[0].name : null,
		immMsb: d,
		immSigned: l.length > 0 && u.includes(l[0].name),
		immNonZero: l.length > 0 && (l[0].name.startsWith("nz") || !!t.nonZeroImm)
	};
}), re = [...y].sort((e, t) => t.literalCount - e.literalCount);
function ie({ inst: e = {}, word: t = 0 }) {
	let n = 0;
	for (let r of e.segments.filter((e) => e.kind === "imm")) r.immBits.forEach((e, i) => {
		n += (t >>> r.hi - i & 1) * 2 ** e;
	});
	return e.immSigned && n >= 2 ** e.immMsb && (n -= 2 ** (e.immMsb + 1)), n;
}
function ae({ inst: e = {} }) {
	let t = e.segments.filter((e) => e.kind === "imm").flatMap((e) => e.immBits), n = 2 ** Math.min(...t), r = e.immMsb;
	if (e.asmShift) {
		if (r === 31) return {
			min: 0,
			max: 1048575,
			step: 1,
			nonZero: !1
		};
		let t = r - e.asmShift;
		return {
			min: -(2 ** t),
			max: 2 ** t - 1,
			step: 1,
			nonZero: e.immNonZero
		};
	}
	return e.immSigned ? {
		min: -(2 ** r),
		max: 2 ** r - n,
		step: n,
		nonZero: e.immNonZero
	} : {
		min: 0,
		max: 2 ** (r + 1) - n,
		step: n,
		nonZero: e.immNonZero
	};
}
function oe({ inst: e = {}, word: t = 0 }) {
	for (let n of e.segments) if (n.kind === "reg" && n.exclude.includes(v({
		word: t,
		hi: n.hi,
		lo: n.lo
	}))) return !1;
	return !(e.immNonZero && ie({
		inst: e,
		word: t
	}) === 0);
}
function se({ inst: e = {}, constraints: t = [] }) {
	let n = 0, r = 0;
	for (let i = 0; i < e.width; i++) {
		let e = t[31 - i];
		e !== "-" && (n |= 1 << i, r |= Number(e) << i);
	}
	if (n >>>= 0, r >>>= 0, ((r ^ e.match) & e.mask & n) >>> 0) return !1;
	for (let t of e.segments) {
		let e = (2 ** t.width - 1) * 2 ** t.lo >>> 0;
		if (t.kind === "reg" && (n & e) >>> 0 === e && t.exclude.includes(v({
			word: r,
			hi: t.hi,
			lo: t.lo
		}))) return !1;
	}
	if (e.immNonZero) {
		let t = e.segments.filter((e) => e.kind === "imm").reduce((e, t) => e | 2 ** t.width - 1 << t.lo, 0) >>> 0;
		if ((n & t) >>> 0 === t && (r & t) === 0) return !1;
	}
	return !0;
}
function ce({ number: e = 0, fp: t = !1 }) {
	return (t ? p : f)[e];
}
function b({ value: e = 0 }) {
	return [
		"i",
		"o",
		"r",
		"w"
	].filter((t, n) => e >> 3 - n & 1).join("") || "0";
}
function le({ value: e = 0 }) {
	return Object.keys(h).find((t) => h[t] === e) || `0x${e.toString(16)}`;
}
function ue({ inst: e = {}, key: t = "rd" }) {
	return (e.fregs || []).includes(t);
}
function de({ inst: e = {}, word: t = 0 }) {
	let n = {};
	for (let r of e.segments) r.kind === "reg" ? n[r.key] = v({
		word: t,
		hi: r.hi,
		lo: r.lo
	}) + (r.compressed ? 8 : 0) : r.kind === "field" && (n[r.key] = v({
		word: t,
		hi: r.hi,
		lo: r.lo
	}));
	return e.immName && (n.imm = ie({
		inst: e,
		word: t
	})), n;
}
function x({ inst: e = {}, fields: t = {} }) {
	let n = e.name;
	(t.aq || t.rl) && (n += "." + (t.aq ? "aq" : "") + (t.rl ? "rl" : ""));
	let r = [{
		kind: "mnemonic",
		text: n,
		known: !0
	}];
	return (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== "").filter((e) => e !== "rm" || t.rm !== 7).forEach((n, i) => {
		r.push({
			kind: "punct",
			text: i === 0 ? " " : ", "
		});
		for (let i of w({ op: n })) {
			if (!i.token) {
				r.push({
					kind: "punct",
					text: i.text
				});
				continue;
			}
			let n = i.token.replace("'", "");
			if (n === "sp") {
				r.push({
					kind: "reg",
					key: n,
					text: "sp",
					known: !0
				});
				continue;
			}
			let a = t[n];
			if (a == null) {
				r.push({
					kind: fe({ key: n }),
					key: n,
					text: i.token,
					known: !1
				});
				continue;
			}
			let o;
			o = n === "imm" ? String(e.asmShift ? `0x${(a >>> e.asmShift & 2 ** (32 - e.asmShift) - 1).toString(16)}` : a) : n === "csr" ? le({ value: a }) : n === "rm" ? m[a] || `rm${a}` : n === "pred" || n === "succ" ? b({ value: a }) : ce({
				number: a,
				fp: ue({
					inst: e,
					key: n
				})
			}), r.push({
				kind: fe({ key: n }),
				key: n,
				text: o,
				known: !0
			});
		}
	}), r;
}
function fe({ key: e = "rd" }) {
	return e === "imm" ? "imm" : [
		"csr",
		"rm",
		"pred",
		"succ"
	].includes(e) ? "field" : "reg";
}
function pe({ inst: e = {}, fields: t = {} }) {
	return x({
		inst: e,
		fields: t
	}).map((e) => e.text).join("");
}
function me({ inst: e = {}, key: t = "rd" }) {
	return e.segments.filter((e) => e.key === t).reduce((e, t) => (e | (2 ** t.width - 1) * 2 ** t.lo) >>> 0, 0);
}
function he({ constraints: e = [] }) {
	let t = y.filter((t) => !t.reserved && !t.hint && se({
		inst: t,
		constraints: e
	})), n = [...new Set(t.map((e) => e.name))];
	if (t.length !== 1) return {
		candidates: t,
		names: n,
		inst: null,
		fields: null
	};
	let r = t[0], i = 0, a = 0;
	for (let t = 0; t < r.width; t++) {
		let n = e[31 - t];
		n !== "-" && (i = (i | 2 ** t) >>> 0, a = (a | Number(n) * 2 ** t) >>> 0);
	}
	let o = de({
		inst: r,
		word: a
	}), s = {};
	for (let e of Object.keys(o)) {
		let t = me({
			inst: r,
			key: e
		});
		s[e] = (i & t) >>> 0 === t ? o[e] : null;
	}
	return {
		candidates: t,
		names: n,
		inst: r,
		fields: s
	};
}
function ge({ word: e = 0 }) {
	e >>>= 0;
	let t = (e & 3) != 3;
	t && (e &= 65535);
	for (let n of re) {
		if (n.width === 16 !== t || (e & n.mask) >>> 0 !== n.match || !oe({
			inst: n,
			word: e
		})) continue;
		let r = de({
			inst: n,
			word: e
		});
		if (n.reserved || n.hint) return {
			inst: n,
			word: e,
			fields: r,
			assembly: n.description
		};
		let i = [be({
			inst: n,
			fields: r,
			word: e
		}), xe({ fields: r })].filter(Boolean).join(" ; ");
		return {
			inst: n,
			word: e,
			fields: r,
			assembly: pe({
				inst: n,
				fields: r
			}),
			note: i
		};
	}
	return null;
}
var _e = [
	"lui",
	"auipc",
	"addi",
	"andi",
	"ori",
	"xori",
	"add",
	"sub",
	"and",
	"or",
	"xor",
	"sll",
	"srl",
	"sra"
], ve = [
	"slti",
	"sltiu",
	"slli",
	"srli",
	"srai",
	"slt",
	"sltu"
], ye = {
	2: "ntl.p1",
	3: "ntl.pall",
	4: "ntl.s1",
	5: "ntl.all"
};
function be({ inst: e = {}, fields: t = {}, word: n = 0 }) {
	return e.name === "fence" ? t.pred === 0 || t.succ === 0 ? "HINT (empty predecessor or successor set): standard use, executes as a no-op" : "" : t.rd !== 0 || n === 19 ? "" : e.name === "add" && t.rs1 === 0 && ye[t.rs2] ? `HINT: ${ye[t.rs2]} (Zihintntl non-temporal locality)` : e.name === "slli" && t.rs1 === 0 && t.imm === 31 ? "HINT: semihosting entry marker" : e.name === "srai" && t.rs1 === 0 && t.imm === 7 ? "HINT: semihosting exit marker" : _e.includes(e.name) ? "HINT (rd = x0): standard use, executes as a no-op" : ve.includes(e.name) ? "HINT (rd = x0): custom use, executes as a no-op" : "";
}
function xe({ fields: e = {} }) {
	return e.rm === 5 || e.rm === 6 ? `rm = ${ne({
		value: e.rm,
		width: 3
	})} is reserved: illegal instruction` : "";
}
var Se = a.map((e) => {
	let t = parseInt(e.opcode, 2);
	return {
		...e,
		match: t,
		mask: 127,
		width: 32,
		sortKey: g[32].map((e) => e < 7 ? t >>> e & 1 : 2).join("")
	};
});
function Ce({ word: e = 0 }) {
	return Se.find((t) => (e >>> 0 & 127) === t.match) || null;
}
function we({ value: e = 0 }) {
	return e + 2048 >> 12 & 1048575;
}
function Te({ value: e = 0 }) {
	return e - (e + 2048 >> 12 << 12) | 0;
}
function Ee({ base: e = {}, mapping: t = {} }) {
	return e.segments.map((e) => {
		let n = t[e.key];
		if (typeof n == "number" && e.kind === "imm") {
			let t = e.immBits.map((e) => n >> e & 1).join("");
			return {
				...e,
				kind: "lit",
				bits: t,
				role: "fixed"
			};
		}
		return typeof n == "number" && (e.kind === "reg" || e.kind === "field") ? {
			...e,
			kind: "lit",
			bits: ne({
				value: e.compressed ? n - 8 : n,
				width: e.width
			}),
			role: "fixed"
		} : typeof n == "string" && e.kind === "reg" ? {
			...e,
			label: n
		} : e;
	});
}
function De({ base: e = {}, mapping: t = {} }) {
	let n = (e.asm || "").replace(d, (e) => {
		let n = e.replace("'", ""), r = t[n];
		return r === "hi" ? "imm[31:12]" : r === "lo" ? "imm[11:0]" : typeof r == "string" ? r : typeof r == "number" ? n === "imm" ? String(r) : n === "csr" ? le({ value: r }) : n === "pred" || n === "succ" ? b({ value: r }) : `x${r}` : e;
	});
	return `${e.name} ${n}`.trim();
}
function Oe({ expands: e = [] }) {
	return e.map(([e, t]) => {
		let n = y.find((t) => t.name === e && !t.reserved && !t.hint);
		return {
			base: n,
			mapping: t,
			segments: Ee({
				base: n,
				mapping: t
			}),
			text: De({
				base: n,
				mapping: t
			})
		};
	});
}
var ke = o.map((e, t) => {
	let n = Oe({ expands: e.expands });
	return {
		...e,
		id: `${e.name}#pseudo${t}`,
		pseudo: !0,
		extension: "PSEUDO",
		width: 32,
		expansions: n,
		shortExpansions: e.short ? Oe({ expands: e.short }) : null,
		format: n.length === 1 ? n[0].base.format : "/"
	};
}), S = [...y.filter((e) => !e.reserved && !e.hint), ...ke].sort((e, t) => e.name.localeCompare(t.name) || Number(!!e.pseudo) - Number(!!t.pseudo));
function C({ entry: e = {}, token: t = "rd" }) {
	let n = t.replace("'", "");
	if (n === "sp") return { kind: "sp" };
	let { inst: r, k: i, split: a } = (e.pseudo ? e.expansions.flatMap(({ base: e, mapping: t }) => [...new Set(e.segments.map((e) => e.key).filter(Boolean))].filter((e) => t[e] === n || t[e] === void 0 && e === n || n === "imm" && e === "imm" && ["hi", "lo"].includes(t.imm)).map((n) => ({
		inst: e,
		k: n,
		split: n === "imm" && ["hi", "lo"].includes(t.imm)
	}))) : [{
		inst: e,
		k: n,
		split: !1
	}])[0] || {
		inst: e,
		k: n,
		split: !1
	};
	if (i === "imm") return a ? {
		kind: "imm",
		range: {
			min: -(2 ** 31),
			max: 2 ** 31 - 1,
			step: 1,
			nonZero: !1
		}
	} : {
		kind: "imm",
		range: ae({ inst: r })
	};
	if (i === "csr") return { kind: "csr" };
	if (i === "rm") return {
		kind: "rm",
		optional: !0
	};
	if (i === "pred" || i === "succ") return { kind: "fence" };
	let o = r.segments.find((e) => e.kind === "reg" && e.key === i);
	return {
		kind: "reg",
		fp: ue({
			inst: r,
			key: i
		}),
		compressed: !!(o && o.compressed),
		exclude: o ? o.exclude : []
	};
}
function w({ op: e = "" }) {
	let t = [], n = 0;
	for (let r of e.matchAll(d)) r.index > n && t.push({ text: e.slice(n, r.index) }), t.push({ token: r[0] }), n = r.index + r[0].length;
	return n < e.length && t.push({ text: e.slice(n) }), t;
}
function T({ text: e = "" }) {
	let t = e.trim().toLowerCase(), n = t.startsWith("-"), r = n ? t.slice(1) : t;
	if (!/^(0x[0-9a-f]+|0b[01]+|\d+)$/.test(r)) throw Error(`"${e}" is not a number`);
	let i = r.startsWith("0b") ? parseInt(r.slice(2), 2) : Number(r);
	return n ? -i : i;
}
function Ae({ text: e = "", fp: t = !1 }) {
	let n = e.trim().toLowerCase(), r = n.match(t ? /^f(\d+)$/ : /^x(\d+)$/);
	if (r && Number(r[1]) < 32) return Number(r[1]);
	if (!t && n === "fp") return 8;
	let i = (t ? p : f).indexOf(n);
	if (i < 0) throw Error(`"${e}" is not a${t ? " floating-point" : "n integer"} register`);
	return i;
}
function je({ text: e = "" }) {
	let t = e.trim().toLowerCase();
	return /^[iorw]+$/.test(t) ? [
		"i",
		"o",
		"r",
		"w"
	].reduce((e, n, r) => e | (t.includes(n) ? 1 << 3 - r : 0), 0) : T({ text: t });
}
function Me({ inst: e = {}, key: t = "rd", value: n = 0, word: r = 0 }) {
	if (t === "imm") {
		e.asmShift && e.immMsb !== 31 && n >= 2 ** 20 - 2 ** (e.immMsb - e.asmShift) && n < 2 ** 20 && (n -= 2 ** 20);
		let t = e.asmShift ? n * 2 ** e.asmShift | 0 : n, { min: i, max: a } = ae({ inst: e });
		if (n < i || n > a) throw Error(`${e.name}: immediate ${n} out of range [${i}, ${a}]`);
		let o = new Set(e.segments.filter((e) => e.kind === "imm").flatMap((e) => e.immBits));
		for (let r = 0; r < e.immMsb; r++) if (!o.has(r) && t >> r & 1) throw Error(`${e.name}: immediate ${n} must be a multiple of ${2 ** Math.min(...o)}`);
		if (e.immNonZero && t === 0) throw Error(`${e.name}: immediate must be non-zero`);
		for (let n of e.segments.filter((e) => e.kind === "imm")) n.immBits.forEach((e, i) => {
			r |= (t >> e & 1) << n.hi - i;
		});
		return r;
	}
	for (let i of e.segments.filter((e) => e.key === t)) {
		let a = n;
		if (i.kind === "reg" && i.compressed) {
			if (n < 8 || n > 15) throw Error(`${e.name}: ${t}' must be one of x8-x15 (s0, s1, a0-a5)`);
			a = n - 8;
		}
		if (i.kind === "reg" && i.exclude.includes(n)) throw Error(`${e.name}: ${t} cannot be x${n}`);
		if (a < 0 || a >= 2 ** i.width) throw Error(`${e.name}: ${t} = ${n} does not fit in ${i.width} bits`);
		r |= a << i.lo;
	}
	return r;
}
function Ne({ inst: e = {}, fields: t = {} }) {
	let n = e.match, r = [...new Set(e.segments.map((e) => e.key).filter(Boolean))];
	for (let i of r) {
		if (t[i] === void 0) throw Error(`${e.name}: missing ${i}`);
		n = Me({
			inst: e,
			key: i,
			value: t[i],
			word: n
		});
	}
	n >>>= 0;
	let i = de({
		inst: e,
		word: n
	});
	return {
		inst: e,
		word: n,
		fields: i,
		assembly: pe({
			inst: e,
			fields: i
		})
	};
}
function Pe({ entry: e = {}, text: t = "" }) {
	let n = (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== ""), r = t.split(",").map((e) => e.trim()).filter((e) => e !== ""), i = +(n[n.length - 1] === "rm");
	if (r.length > n.length || r.length < n.length - i) throw Error(`${e.name} expects: ${e.name} ${e.asm}`);
	let a = {};
	return n.slice(0, r.length).forEach((t, n) => {
		let i = t.match(d) || [], o = RegExp("^" + t.replace(/[()]/g, "\\$&").replace(d, "(.+?)") + "$"), s = r[n].match(o);
		if (!s) throw Error(`operand "${r[n]}" does not match "${t}"`);
		i.forEach((t, n) => {
			let r = t.replace("'", ""), i = s[n + 1], o = C({
				entry: e,
				token: r
			});
			if (o.kind === "sp") {
				if (Ae({ text: i }) !== 2) throw Error(`${e.name} only works with sp`);
			} else if (o.kind === "imm") a[r] = T({ text: i });
			else if (o.kind === "csr") a[r] = i.toLowerCase() in h ? h[i.toLowerCase()] : T({ text: i });
			else if (o.kind === "rm") {
				if (a[r] = m.indexOf(i.toLowerCase()), a[r] < 0 || i === "") throw Error(`"${i}" is not a rounding mode`);
			} else o.kind === "fence" ? a[r] = je({ text: i }) : a[r] = Ae({
				text: i,
				fp: o.fp
			});
		});
	}), a;
}
function Fe({ entry: e = {}, operands: t = "", ordering: n = "" }) {
	let r = Pe({
		entry: e,
		text: t
	}), i = {
		aq: +!!n.includes("aq"),
		rl: +!!n.includes("rl"),
		rm: 7
	};
	if (!e.pseudo) return {
		entry: e,
		words: [Ne({
			inst: e,
			fields: {
				...i,
				rm: e.rmDefault ?? 7,
				...r
			}
		})]
	};
	let a = e.shortExpansions && (r.imm | 0) >= -2048 && (r.imm | 0) <= 2047;
	return a && (r.imm |= 0), {
		entry: e,
		words: (a ? e.shortExpansions : e.expansions).filter(({ mapping: t }) => !(e.dropZeroLo && t.imm === "lo" && Te({ value: r.imm | 0 }) === 0)).map((e) => {
			let { base: t, mapping: n } = e, a = {
				...i,
				rm: t.rmDefault ?? 7
			};
			for (let e of new Set(t.segments.map((e) => e.key).filter(Boolean))) {
				let t = n[e];
				typeof t == "number" ? a[e] = t : t === "hi" ? a[e] = we({ value: r.imm | 0 }) : t === "lo" ? a[e] = Te({ value: r.imm | 0 }) : typeof t == "string" ? a[e] = r[t] : r[e] !== void 0 && (a[e] = r[e]);
			}
			return {
				...Ne({
					inst: t,
					fields: a
				}),
				expansion: e
			};
		})
	};
}
function Ie({ inst: e = {} }) {
	if (!e.immName) return null;
	let t = {};
	e.segments.filter((e) => e.kind === "imm").forEach((e) => e.immBits.forEach((n) => {
		t[n] = e;
	}));
	let n = t[e.immMsb], r = [];
	for (let i = 31; i >= 0; i--) {
		let a;
		a = i > e.immMsb ? e.immSigned ? {
			kind: "sext",
			segment: n
		} : { kind: "zero" } : t[i] ? {
			kind: "imm",
			segment: t[i]
		} : { kind: "zero" };
		let o = r[r.length - 1];
		o && o.kind === a.kind && o.segment === a.segment ? o.width++ : r.push({
			...a,
			width: 1,
			hi: i
		});
	}
	return r;
}
// package.json
var Le = "0.0.1";
// src/cells.mjs
function E({ width: e = 1, rowspan: t = 1, classes: n = "", text: r = "", title: i = "" }) {
	let a = { class: n };
	return e > 1 && (a.colspan = String(e)), t > 1 && (a.rowspan = String(t)), i && (a.title = i), _td(a, r);
}
function Re({ width: e = 32 }) {
	return e === 16 ? [E({
		width: 16,
		classes: "bit unused"
	})] : [];
}
function D({ segment: e = {} }) {
	return `inst[${e.hi}${e.width > 1 ? ":" + e.lo : ""}]`;
}
function ze({ key: e = "rm", value: t = 0 }) {
	return e === "pred" || e === "succ" ? b({ value: t }) : e === "rm" ? `rm = ${m[t] || t}` : e === "csr" ? `csr = ${Object.keys(h).find((e) => h[e] === t) || `0x${t.toString(16)}`}` : String(t);
}
function Be({ segments: e = [], width: t = 32, fields: n = null, inst: r = {} }) {
	let i = Re({ width: t });
	for (let t of e) if (t.kind === "lit") for (let e of t.bits) i.push(E({
		classes: `bit lit-${t.role}`,
		text: e
	}));
	else if (t.kind === "any") i.push(E({
		width: t.width,
		classes: "bit any",
		text: t.width > 1 ? "– any –" : "–",
		title: `${D({ segment: t })} = don't care`
	}));
	else if (t.kind === "imm") i.push(E({
		width: t.width,
		classes: `bit imm imm-${t.part % 4}`,
		text: t.width > 1 ? `${t.name}[${t.label}]` : t.label,
		title: `${D({ segment: t })} = ${t.name}[${t.immBits.join("|")}]`
	}));
	else if (n && t.kind === "reg") {
		let e = ce({
			number: n[t.key],
			fp: (r.fregs || []).includes(t.key)
		});
		i.push(E({
			width: t.width,
			classes: "bit field-reg",
			text: t.width > 3 ? `${t.key} = ${e}` : e
		}));
	} else n && t.kind === "field" ? i.push(E({
		width: t.width,
		classes: "bit field-field",
		text: ze({
			key: t.key,
			value: n[t.key]
		})
	})) : i.push(E({
		width: t.width,
		classes: `bit field-${t.kind}`,
		text: t.label
	}));
	return i;
}
function Ve({ inst: e = {}, word: t = 0 }) {
	let n = Re({ width: e.width });
	for (let r of e.segments) {
		let e = r.kind === "lit" ? `lit-${r.role}` : r.kind === "imm" ? `imm imm-${r.part % 4}` : `field-${r.kind}`;
		for (let i = r.hi; i >= r.lo; i--) n.push(E({
			classes: `bit value ${e}`,
			text: String(t >>> i & 1),
			title: r.kind === "lit" ? "" : r.label
		}));
	}
	return n;
}
function He({ inst: e = {} }) {
	return Ie({ inst: e }).map((e) => {
		if (e.kind === "zero") return E({
			width: e.width,
			classes: "bit imm-zero",
			text: e.width > 1 ? "– 0 –" : "0"
		});
		let t = e.kind === "sext" ? `– ${e.segment.immBits[0]} –` : e.segment.label;
		return E({
			width: e.width,
			classes: `bit imm imm-${e.segment.part % 4}${e.kind === "sext" ? " sext" : ""}`,
			text: t,
			title: e.kind === "sext" ? `sign extension of inst[${e.segment.hi}]` : `from ${D({ segment: e.segment })}`
		});
	});
}
function Ue({ format: t = "R", rowspan: n = 1 }) {
	return e[t] ? _td({
		class: "text type",
		rowspan: String(n)
	}, [
		_b({}, `${t} - Type`),
		_br(),
		`"${e[t].title}"`
	]) : E({
		rowspan: n,
		classes: "text type",
		text: t
	});
}
function We() {
	let e = [];
	for (let t = 31; t >= 0; t--) e.push(_th({ class: "bit-number spine" }, String(t)));
	return e;
}
var O = "RV32GC-Sliderules.pdf", Ge = [
	"localhost",
	"127.0.0.1",
	"sliderules.magiwanders.com"
].includes(location.hostname) ? O : `https://sliderules.magiwanders.com/${O}`;
function Ke() {
	return _a({
		class: "pdf-button",
		href: Ge,
		download: O,
		title: `Download both sheets as an A3 PDF (v${Le})`
	}, [_span({
		class: "pdf-icon",
		"aria-hidden": "true"
	}, "⤓"), " PDF"]);
}
function qe({ name: e = "Decoder", button: t = null, side: n = "left" }) {
	let r = _div({ class: `title-corner ${n}` }, [t]), i = _div({ class: `title-corner ${n === "left" ? "right" : "left"}` }, [Ke()]), a = _div({ class: "title-main" }, [
		_div({ class: "title-isa" }, "RV32GC"),
		_div({ class: "title-name" }, `Sliderule ${e}`),
		_div({ class: "title-credits" }, `Instruction Set "Sliderule" ${e} by Simone Shawn Cazzaniga (magiwanders@github | www.magiwanders.com | shawn@magiwanders.com)`)
	]);
	return _caption({ class: "title-cell" }, [_div({ class: "title-bar" }, n === "left" ? [
		r,
		a,
		i
	] : [
		i,
		a,
		r
	])]);
}
function Je({ widths: e = [] }) {
	return _colgroup({}, e.map((e) => _col({ style: `width: ${e}px` }, "")));
}
function k({ widths: e = [] }) {
	return `width: ${e.reduce((e, t) => e + t, 0)}px`;
}
function A({ word: e = 0, width: t = 32 }) {
	return `0x${(e >>> 0).toString(16).padStart(t / 4, "0")}`;
}
// src/tristate.mjs
function Ye({ text: e = "" }) {
	let t = e.trim().toLowerCase().replace(/[_\s]/g, "");
	if (/^0x[0-9a-f]{1,8}$/.test(t)) {
		let e = parseInt(t.slice(2), 16) >>> 0, n = (e & 3) == 3 ? 32 : 16;
		return Array.from({ length: 32 }, (t, r) => 31 - r < n ? String(e >>> 31 - r & 1) : "-");
	}
	return /^(0b)?[01x-]{1,32}$/.test(t) ? [...t.replace(/^0b/, "").replace(/x/g, "-").padStart(32, "-")] : null;
}
function Xe({ editable: e = !0, onChange: t = () => {} }) {
	let n = [], r = [];
	for (let t = 31; t >= 0; t--) {
		let a = _button({
			class: "tri-half tri-1",
			type: "button",
			tabindex: "-1",
			"aria-label": `inst[${t}] = 1`
		}, "1"), c = _button({
			class: "tri-half tri-0",
			type: "button",
			tabindex: "-1",
			"aria-label": `inst[${t}] = 0`
		}, "0"), l = {
			class: "tri",
			"data-state": "-",
			role: "group",
			"aria-label": `inst[${t}]`
		};
		e ? (l.tabindex = t === 31 ? "0" : "-1", l.title = `inst[${t}]: click 1 or 0, click again for x`) : (a.disabled = !0, c.disabled = !0);
		let u = _div(l, [a, c]);
		e && (a.addEventListener("click", () => i({
			sw: u,
			value: "1"
		})), c.addEventListener("click", () => i({
			sw: u,
			value: "0"
		})), u.addEventListener("keydown", (e) => o({
			event: e,
			index: n.indexOf(u)
		})), u.addEventListener("paste", s)), n.push(u), r.push(_th({ class: "bit-head spine" }, [u]));
	}
	function i({ sw: e = null, value: r = "1" }) {
		e.dataset.state = e.dataset.state === r ? "-" : r, a({ index: n.indexOf(e) }), t();
	}
	function a({ index: e = 0 }) {
		let t = Math.max(0, Math.min(31, e));
		n.forEach((e, n) => e.setAttribute("tabindex", n === t ? "0" : "-1")), n[t].focus();
	}
	function o({ event: e = null, index: r = 0 }) {
		let i = (e, i, o = r) => {
			n[o].dataset.state = e, t(), a({ index: o + i });
		}, o = {
			0: () => i("0", 1),
			1: () => i("1", 1),
			x: () => i("-", 0),
			X: () => i("-", 0),
			Delete: () => i("-", 0),
			Backspace: () => n[r].dataset.state !== "-" || r === 0 ? i("-", 0) : i("-", 0, r - 1),
			ArrowLeft: () => a({ index: r - 1 }),
			ArrowRight: () => a({ index: r + 1 }),
			Home: () => a({ index: 0 }),
			End: () => a({ index: 31 })
		};
		!o[e.key] || e.ctrlKey || e.metaKey || e.altKey || (e.preventDefault(), o[e.key]());
	}
	function s(e) {
		let t = Ye({ text: (e.clipboardData || window.clipboardData).getData("text") });
		t && (e.preventDefault(), c({ states: t }));
	}
	function c({ states: e = [] }) {
		e.forEach((e, t) => {
			n[t].dataset.state = e;
		}), t();
	}
	return {
		cells: r,
		read: () => n.map((e) => e.dataset.state),
		write: ({ value: e = 0, mask: t = 4294967295, width: r = 32, off: i = !1 }) => {
			n.forEach((n, a) => {
				let o = 31 - a;
				n.dataset.state = o < r && t >>> o & 1 ? String(e >>> o & 1) : "-", n.classList.toggle("tri-off", i && o >= r);
			});
		},
		paste: ({ text: e = "" }) => {
			let t = Ye({ text: e });
			return t && c({ states: t }), !!t;
		},
		highlight: ({ mask: e = 0 }) => n.forEach((t, n) => t.classList.toggle("tri-mark", !!(e >>> 31 - n & 1))),
		dimUpper: ({ dim: e = !1 }) => n.forEach((t, n) => t.classList.toggle("tri-off", e && n < 16))
	};
}
// src/selector.mjs
var j = [
	"Instruction",
	"Mnemonic",
	"Operands",
	"Expansion",
	"Pseudocode",
	"Type",
	"Ext"
], Ze = [
	170,
	90,
	150,
	150,
	230,
	120,
	60
], Qe = 32 + j.length, M = null;
function $e({ inst: e = {}, bit: t = 0 }) {
	return e.mask >>> t & 1 ? String(e.match >>> t & 1) : null;
}
function et({ title: e = "" }) {
	return _tr({ class: "section-row" }, [E({
		width: Qe,
		text: e
	})]);
}
function tt({ group: t = {}, members: n = [], rowspan: r = 1 }) {
	let i = e[t.format], a = [];
	i.width === 16 && a.push(E({
		width: 16,
		classes: "bit unused"
	}));
	for (let [e, t, r, o] of i.layout) {
		let i = [];
		for (let e = t; e >= r; e--) {
			let t = $e({
				inst: n[0],
				bit: e
			});
			i.push(t !== null && n.every((n) => $e({
				inst: n,
				bit: e
			}) === t) ? t : null);
		}
		i.every((e) => e !== null) ? i.forEach((e) => a.push(E({
			classes: `bit lit-${o}`,
			text: e
		}))) : a.push(E({
			width: t - r + 1,
			classes: `bit field-${o}`,
			text: e
		}));
	}
	return a.push(E({
		width: 4,
		classes: "text group-title",
		text: t.title
	}), E({
		classes: "text group-pseudo",
		text: t.pseudocode
	}), Ue({
		format: t.format,
		rowspan: r
	}), E({
		rowspan: r,
		classes: "text ext",
		text: `'${t.extension}'`
	})), _tr({ class: `group-row fmt-${t.format}` }, a);
}
function nt({ inst: e = {}, decoded: t = null, onPattern: n = () => {} }) {
	let r = t && t.inst === e ? t.fields : null, i = Be({
		segments: e.segments,
		width: e.width,
		fields: r,
		inst: e
	});
	if (e.reserved || e.hint) {
		let t = e.reserved ? "reserved" : "hint";
		return i.push(E({
			width: 5,
			classes: `text ${t}`,
			text: e.hint ? `${e.description} : PC += ${e.width / 8}, no other effect` : e.description
		})), _tr({ class: `instruction-row ${t}-row fmt-${e.format}` + (r ? " decoded" : "") }, i);
	}
	let a = _td({
		class: "text mnemonic",
		title: "Show this encoding in the bit selector"
	}, e.name);
	return a.addEventListener("click", () => n({ inst: e })), i.push(E({
		classes: "text description",
		text: e.description
	}), a, E({
		classes: "text operands",
		text: r ? x({
			inst: e,
			fields: r
		}).slice(1).map((e) => e.text).join("").trim() || "—" : e.asm || "—"
	}), E({
		classes: "text expansion",
		text: e.expands || ""
	}), E({
		classes: "text pseudocode",
		text: e.pseudocode
	})), _tr({ class: `instruction-row fmt-${e.format}` + (r ? " decoded" : "") }, i);
}
function rt({ inst: e = {}, decoded: t = null }) {
	let n = He({ inst: e });
	return n.push(E({
		width: 4,
		classes: "text imm-name",
		text: t && t.inst === e ? `${e.immName} = ${t.fields.imm}` : e.immName
	}), E({
		classes: "text imm-desc",
		text: `${e.format} ${e.immSigned ? "sign-extended" : "zero-extended"} immediate`
	})), _tr({ class: `immediate-row fmt-${e.format}` }, n);
}
function it({ inst: e = {} }) {
	return e.segments.filter((e) => e.kind === "imm").map((e) => `${e.hi}:${e.immBits}`).join(" ");
}
function at({ unused: e = {} }) {
	let t = [E({
		width: 25,
		classes: "bit any",
		text: "– not used in RV32GC –"
	})];
	for (let n of e.opcode) t.push(E({
		classes: "bit lit-opcode",
		text: n
	}));
	return t.push(E({
		width: 4,
		classes: "text unused-name",
		text: e.name
	}), E({
		classes: "text unused-note",
		text: e.note
	}), E({
		classes: "text unused-note",
		text: "—"
	}), E({
		classes: "text unused-note",
		text: "—"
	})), _tr({ class: "unused-row" }, t);
}
function ot({ unused: e = {}, constraints: t = [] }) {
	return [...e.opcode].every((e, n) => [e, "-"].includes(t[25 + n]));
}
function st({ section: e = "q3" }) {
	let t = (e) => y.filter((t) => t.groupKey === e).map((e) => e.sortKey).sort()[0], r = Object.keys(n).filter((t) => n[t].section === e).map((e) => ({
		groupKey: e,
		sortKey: t(e)
	}));
	return e === "q3" && r.push(...Se.map((e) => ({
		unused: e,
		sortKey: e.sortKey
	}))), r.sort((e, t) => e.sortKey.localeCompare(t.sortKey));
}
function ct({ constraints: e = [], decoded: r = null, onPattern: i = () => {} }) {
	let a = [];
	for (let o of Object.keys(t)) {
		let s = [];
		for (let { groupKey: t, unused: a } of st({ section: o })) {
			if (a) {
				ot({
					unused: a,
					constraints: e
				}) && s.push(at({ unused: a }));
				continue;
			}
			let o = y.filter((n) => n.groupKey === t && se({
				inst: n,
				constraints: e
			})).sort((e, t) => e.sortKey.localeCompare(t.sortKey));
			if (!o.length) continue;
			let c = o.filter((e) => e.immName), l = c.length > 0 && c.every((e) => it({ inst: e }) === it({ inst: c[0] })), u = [];
			l && u.push(rt({
				inst: r && c.includes(r.inst) ? r.inst : c[0],
				decoded: r
			}));
			for (let e of o) u.push(nt({
				inst: e,
				decoded: r,
				onPattern: i
			})), e.immName && !l && u.push(rt({
				inst: e,
				decoded: r
			}));
			s.push(tt({
				group: n[t],
				members: o,
				rowspan: u.length + 1
			}), ...u);
		}
		s.length && a.push(et({ title: t[o] }), ...s);
	}
	return a.length || a.push(_tr({}, [E({
		width: Qe,
		classes: "text empty",
		text: "No instruction matches the selected bits."
	})])), a;
}
function lt() {
	return M.read();
}
function ut({ value: e = 0, mask: t = 4294967295, width: n = 32 }) {
	M.write({
		value: e,
		mask: t,
		width: n
	});
}
function dt({ dim: e = !1 }) {
	M.dimUpper({ dim: e });
}
function ft({ text: e = "" }) {
	return M.paste({ text: e });
}
function N({ mask: e = 0 }) {
	M.highlight({ mask: e });
}
function pt({ constraints: e = [] }) {
	let t = (t) => e[31 - t];
	if (t(0) === "-" || t(1) === "-") return null;
	let n = t(0) === "1" && t(1) === "1" ? 32 : 16, r = 0;
	for (let e = 0; e < n; e++) {
		if (t(e) === "-") return null;
		r += Number(t(e)) * 2 ** e;
	}
	return r;
}
function mt({ onBits: e = () => {}, toggle: t = null, io: n = null }) {
	M = Xe({
		editable: !0,
		onChange: e
	});
	let r = [...Array(32).fill(24), ...Ze];
	return _table({
		class: "sliderule",
		id: "decoder",
		style: k({ widths: r })
	}, [
		qe({
			name: "Decoder",
			button: t,
			side: "left"
		}),
		Je({ widths: r }),
		_thead({}, [
			_tr({ class: "label-row" }, [_th({ colspan: "32" }, "Bitwise Breakdown — inst[31:0]"), _th({ colspan: String(j.length) }, "Meaning")]),
			_tr({ class: "number-row" }, [...We(), ...j.map((e) => _th({ class: "text-head" }, e))]),
			_tr({ class: "input-row" }, [...M.cells, _td({
				class: "io-cell",
				colspan: String(j.length)
			}, [n])])
		]),
		_tbody({}, "")
	]);
}
// src/encoder.mjs
var P = [
	{
		key: "ext",
		title: "Ext",
		width: 92
	},
	{
		key: "type",
		title: "Type",
		width: 120
	},
	{
		key: "description",
		title: "Description",
		width: 220,
		collapsible: !0
	},
	{
		key: "explanation",
		title: "Explanation",
		width: 240,
		collapsible: !0
	},
	{
		key: "mnemonic",
		title: "Mnemonic",
		width: 150
	},
	{
		key: "operands",
		title: "Operands",
		width: 300
	}
], ht = 26, gt = 24, F = {
	description: !0,
	explanation: !0
}, I = null, L = null;
function _t({ entry: e = {} }) {
	return e.expands && !e.pseudo ? [
		e.expands,
		_br(),
		e.pseudocode
	] : e.pseudocode || "";
}
function vt({ explanation: e = "" }) {
	return (Array.isArray(e) ? e : [e]).map((e) => typeof e == "string" ? e : "\n").join("");
}
function yt({ entry: e = {}, rowspan: t = 1, explanation: n = "", operands: r = null, onPick: i = () => {} }) {
	let a = _td({
		class: "text mnemonic" + (e.pseudo ? " pseudo" : ""),
		rowspan: String(t),
		title: "Build this instruction"
	}, e.name);
	return a.addEventListener("click", () => i({ entry: e })), [
		E({
			rowspan: t,
			classes: "text ext" + (e.pseudo ? " pseudo" : ""),
			text: e.extension
		}),
		Ue({
			format: e.format,
			rowspan: t
		}),
		E({
			rowspan: t,
			classes: "text description",
			text: e.description,
			title: e.description
		}),
		_td({
			class: "text explanation",
			title: vt({ explanation: n })
		}, n),
		a,
		E({
			rowspan: t,
			classes: "text operands" + (r ? " chosen" : ""),
			text: r ?? (e.asm || "—")
		})
	];
}
function bt({ entry: e = {}, encoded: t = null, operands: n = null, onPick: r = () => {} }) {
	let i = t ? t.words.map((t) => t.expansion ? {
		...t.expansion,
		word: t
	} : {
		base: e,
		segments: e.segments,
		text: _t({ entry: e }),
		word: t
	}) : e.pseudo ? e.expansions.map((e) => ({
		...e,
		word: null
	})) : [{
		base: e,
		segments: e.segments,
		text: _t({ entry: e }),
		word: null
	}], a = i.length === 1 && i[0].segments.some((e) => e.kind === "imm"), o = i.length + +!!a, s = i.map(({ base: i, segments: a, text: s, word: c }, l) => {
		let u = l === 0 ? yt({
			entry: e,
			rowspan: o,
			explanation: s,
			operands: n,
			onPick: r
		}) : [_td({
			class: "text explanation",
			title: vt({ explanation: s })
		}, s)];
		return _tr({ class: `instruction-row fmt-${i.format}` + (t ? " chosen" : "") }, [...u, ...Be({
			segments: a,
			width: i.width,
			fields: c ? c.fields : null,
			inst: i
		})]);
	});
	if (a) {
		let { base: e, word: t } = i[0];
		s.push(_tr({ class: `immediate-row fmt-${e.format}` }, [_td({ class: "text imm-name explanation" }, t ? `${e.immName} = ${t.fields.imm}` : e.immName), ...He({ inst: e })]));
	}
	if (t) for (let { inst: e, word: n, assembly: r } of t.words) s.push(_tr({ class: `encoded-row fmt-${e.format}` }, [
		E({
			width: 4,
			classes: "text encoded-asm",
			text: r
		}),
		E({
			width: 2,
			classes: "text encoded-hex",
			text: A({
				word: n,
				width: e.width
			})
		}),
		...Ve({
			inst: e,
			word: n
		})
	]));
	return s;
}
function xt({ entries: e = S, entry: t = null, encoded: n = null, operands: r = null, onPick: i = () => {} }) {
	if (t) return bt({
		entry: t,
		encoded: n,
		operands: r,
		onPick: i
	});
	let a = e.flatMap((e) => bt({
		entry: e,
		onPick: i
	}));
	return a.length || a.push(_tr({}, [E({
		width: P.length + 32,
		classes: "text empty",
		text: "No instruction has this extension and type."
	})])), a;
}
function St({ entry: e = null, encoded: t = null }) {
	if (t) {
		let { word: e, inst: n } = t.words[0];
		I.write({
			value: e,
			width: n.width,
			off: n.width === 16
		});
		return;
	}
	if (!e) {
		I.write({ mask: 0 });
		return;
	}
	let { base: n, segments: r } = e.pseudo ? e.expansions[0] : {
		base: e,
		segments: e.segments
	}, i = 0, a = 0;
	for (let e of r.filter((e) => e.kind === "lit")) i |= 2 ** e.width - 1 << e.lo, a |= parseInt(e.bits, 2) << e.lo;
	I.write({
		value: a,
		mask: i >>> 0,
		width: n.width,
		off: n.width === 16
	});
}
function Ct() {
	return [...P.map((e) => e.collapsible && F[e.key] ? ht : e.width), ...Array(32).fill(gt)];
}
function R() {
	let e = Ct();
	L.querySelectorAll(":scope > colgroup > col").forEach((t, n) => {
		t.style.width = `${e[n]}px`;
	}), L.style.cssText = k({ widths: e });
	for (let e of P.filter((e) => e.collapsible)) {
		L.classList.toggle(`collapsed-${e.key}`, F[e.key]);
		let t = L.querySelector(`th.text-head.${e.key}`);
		t.setAttribute("aria-expanded", String(!F[e.key])), t.title = `${F[e.key] ? "Show" : "Hide"} the ${e.title.toLowerCase()} column`;
	}
}
function wt({ expand: e = !0 }) {
	for (let t of P.filter((e) => e.collapsible)) F[t.key] = !e;
	R();
}
function Tt({ column: e = {}, rowspan: t = 1 }) {
	let n = { class: `text-head ${e.key}` };
	if (t > 1 && (n.rowspan = String(t)), !e.collapsible) return _th(n, e.title);
	n.class += " collapsible", n.tabindex = "0", n.role = "button";
	let r = _th(n, [_span({
		class: "collapse-icon",
		"aria-hidden": "true"
	}), _span({ class: "collapse-title" }, e.title)]), i = () => {
		F[e.key] = !F[e.key], R();
	};
	return r.addEventListener("click", i), r.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), i());
	}), r;
}
function Et({ toggle: e = null, controls: t = {}, status: n = null, output: r = null }) {
	I = Xe({ editable: !1 });
	let i = Ct(), a = P.filter((e) => !e.collapsible).map((e) => _td({ class: `selector-cell ${e.key}` }, [t[e.key]]));
	return L = _table({
		class: "sliderule",
		id: "encoder",
		style: k({ widths: i })
	}, [
		qe({
			name: "Encoder",
			button: e,
			side: "right"
		}),
		_colgroup({}, i.map((e) => _col({ style: `width: ${e}px` }, ""))),
		_thead({}, [
			_tr({ class: "label-row" }, [
				_th({ colspan: "4" }, "Meaning"),
				_th({ colspan: "2" }, "Assembly"),
				_th({ colspan: "32" }, "Bitwise Encoding — inst[31:0]")
			]),
			_tr({ class: "number-row" }, [...P.map((e) => Tt({
				column: e,
				rowspan: e.collapsible ? 2 : 1
			})), ...We()]),
			_tr({ class: "input-row" }, [...a, ...I.cells]),
			_tr({ class: "output-row" }, [_td({
				class: "io-cell",
				colspan: String(P.length)
			}, [n]), _td({
				class: "io-cell output-cell",
				colspan: "32"
			}, [r])])
		]),
		_tbody({}, "")
	]), R(), L;
}
// src/carousel.mjs
var Dt = 40, z = null;
function B() {
	if (!z) return;
	let { popup: e, owner: t } = z;
	z = null, e.remove(), t.classList.remove("open"), document.removeEventListener("pointerdown", Ot, !0), window.removeEventListener("resize", B), window.removeEventListener("scroll", kt, !0);
}
function Ot(e) {
	z && !z.popup.contains(e.target) && !z.owner.contains(e.target) && B();
}
function kt(e) {
	z && !z.popup.contains(e.target) && B();
}
function V({ options: e = [], value: t = null, onChange: n = () => {}, label: r = "", searchable: i = !1, searchAll: a = null, classes: o = "" }) {
	let s = e, c = t ?? (e[0] ? e[0].value : null), l = 0, u = _button({
		class: "carousel-step",
		type: "button",
		tabindex: "-1",
		"aria-label": `Previous ${r}`
	}, "‹"), d = _button({
		class: "carousel-step",
		type: "button",
		tabindex: "-1",
		"aria-label": `Next ${r}`
	}, "›"), f = _button({
		class: "carousel-value",
		type: "button",
		"aria-haspopup": "listbox",
		title: `${r}: scroll or use the arrow keys to cycle, click for the list`
	}, ""), p = _div({
		class: `carousel ${o}`.trim(),
		role: "group",
		"aria-label": r
	}, [
		u,
		f,
		d
	]), m = () => s.findIndex((e) => e.value === c);
	function h() {
		let e = s[m()];
		f.replaceChildren(e ? e.short ?? e.label : "—"), f.className = "carousel-value" + (e && e.classes ? ` ${e.classes}` : "");
		let t = s.length < 2;
		u.disabled = t, d.disabled = t;
	}
	function g(e) {
		e !== c && (c = e, h(), n(c));
	}
	function _(e) {
		if (!s.length) return;
		let t = m(), n = s.length;
		g(s[((t < 0 ? 0 : t + e) % n + n) % n].value);
	}
	function ee() {
		if (z && z.owner === p) {
			B();
			return;
		}
		B();
		let e = _div({
			class: "carousel-list",
			role: "listbox",
			"aria-label": r
		}, ""), t = i ? _input({
			class: "carousel-filter",
			type: "search",
			placeholder: `Filter ${r}…`,
			"aria-label": `Filter ${r}`
		}) : null, n = _div({ class: "carousel-popup" }, t ? [t, e] : [e]), o = [], l = 0, u = (e) => {
			o.length && (l = (e + o.length) % o.length, o.forEach((e, t) => e.el.classList.toggle("active", t === l)), o[l].el.scrollIntoView({ block: "nearest" }));
		}, d = (e) => {
			B(), g(e.value), f.focus();
		}, m = () => {
			let n = t ? t.value.trim().toLowerCase() : "", r = n && a ? a() : s, i = (e) => {
				let t = String(e.label).toLowerCase();
				return t === n ? 0 : t.startsWith(n) ? 1 : t.includes(n) ? 2 : `${e.hint || ""} ${e.group || ""}`.toLowerCase().includes(n) ? 3 : -1;
			}, l = n ? r.map((e) => ({
				o: e,
				rank: i(e)
			})).filter(({ rank: e }) => e >= 0).sort((e, t) => e.rank - t.rank).map(({ o: e }) => e) : r, f = [];
			o = [];
			let p = null;
			for (let e of l) {
				!n && e.group && e.group !== p && (p = e.group, f.push(_div({ class: "carousel-group" }, p)));
				let t = _div({
					class: "carousel-option" + (e.value === c ? " selected" : "") + (e.classes ? ` ${e.classes}` : ""),
					role: "option",
					"aria-selected": String(e.value === c)
				}, [_span({ class: "carousel-option-label" }, e.label), ...e.hint || n && e.group ? [_span({ class: "carousel-option-hint" }, [e.hint || "", n && e.group ? `  ${e.group}` : ""].join(""))] : []]);
				t.addEventListener("pointerdown", (e) => e.preventDefault()), t.addEventListener("click", () => d(e)), o.push({
					el: t,
					option: e
				}), f.push(t);
			}
			f.length || f.push(_div({ class: "carousel-empty" }, "No match")), e.replaceChildren(...f);
			let m = o.findIndex((e) => e.option.value === c);
			u(n || m < 0 ? 0 : m);
		};
		n.addEventListener("keydown", (e) => {
			let t = {
				ArrowDown: () => u(l + 1),
				ArrowUp: () => u(l - 1),
				Enter: () => o[l] && d(o[l].option),
				Escape: () => {
					B(), f.focus();
				},
				Tab: () => B()
			};
			t[e.key] && (e.key !== "Tab" && e.preventDefault(), t[e.key]());
		}), t && t.addEventListener("input", m), document.body.append(n);
		let h = p.getBoundingClientRect();
		n.style.minWidth = `${Math.max(h.width, 140)}px`, n.style.left = `${Math.min(h.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - n.offsetWidth - 8)}px`;
		let _ = window.innerHeight - h.bottom;
		n.style.maxHeight = `${Math.max(_, h.top) - 16}px`, n.style.top = _ >= Math.min(n.offsetHeight, 240) || _ >= h.top ? `${h.bottom + window.scrollY + 2}px` : `${h.top + window.scrollY - Math.min(n.offsetHeight, h.top - 16) - 2}px`, p.classList.add("open"), z = {
			popup: n,
			owner: p
		}, m(), n.tabIndex = -1, (t || n).focus(), document.addEventListener("pointerdown", Ot, !0), window.addEventListener("resize", B), window.addEventListener("scroll", kt, !0);
	}
	return u.addEventListener("click", () => _(-1)), d.addEventListener("click", () => _(1)), f.addEventListener("click", ee), f.addEventListener("keydown", (e) => {
		let t = {
			ArrowUp: -1,
			ArrowLeft: -1,
			ArrowDown: 1,
			ArrowRight: 1
		};
		t[e.key] === void 0 || e.altKey || e.ctrlKey || e.metaKey || (e.preventDefault(), _(t[e.key]));
	}), p.addEventListener("wheel", (e) => {
		if (s.length < 2) return;
		e.preventDefault();
		let t = e.deltaY || e.deltaX;
		e.deltaMode !== 0 || Math.abs(t) >= Dt ? (l = 0, _(Math.sign(t))) : (l += t, Math.abs(l) >= Dt && (_(Math.sign(l)), l = 0));
	}, { passive: !1 }), p.setOptions = ({ options: e = [], value: t = c }) => {
		s = e, c = e.some((e) => e.value === t) ? t : e[0] ? e[0].value : null, h();
	}, p.setValue = (e) => {
		c = e, h();
	}, Object.defineProperty(p, "value", { get: () => c }), h(), p;
}
// src/builders.mjs
var At = {
	rd: 10,
	rs1: 11,
	rs2: 12,
	rs3: 13,
	rs: 11,
	rt: 12
};
function jt({ info: e = {} }) {
	let t = [];
	for (let n = 0; n < 32; n++) {
		if (e.compressed && (n < 8 || n > 15) || e.exclude.includes(n)) continue;
		let r = (e.fp ? p : f)[n];
		t.push({
			value: n,
			label: r,
			hint: `${e.fp ? "f" : "x"}${n}`
		});
	}
	return t;
}
function Mt({ text: e = "" }) {
	let t = e.trim().toLowerCase().replace(/_/g, "").match(/^(-?)(0x[0-9a-f]+|0b[01]+|\d+)$/);
	if (!t) return null;
	let n = t[2], r = n.startsWith("0b") ? parseInt(n.slice(2), 2) : Number(n);
	return t[1] ? -r : r;
}
function H({ value: e = 0, range: t = {} }) {
	return e < t.min || e > t.max ? `must be between ${t.min} and ${t.max}` : t.step > 1 && e % t.step !== 0 ? `must be a multiple of ${t.step}` : t.nonZero && e === 0 ? "cannot be 0" : null;
}
function Nt({ range: e = {} }) {
	return e.nonZero ? e.step <= e.max ? e.step : e.min : Math.min(Math.max(0, e.min), e.max);
}
function Pt({ value: e = 0 }) {
	return e >= 0 ? `0x${e.toString(16)}` : `-0x${(-e).toString(16)}`;
}
function Ft({ token: e = "imm", range: t = {}, value: n = 0, onChange: r = () => {} }) {
	let i = n, a = `${t.min} … ${t.max}` + (t.step > 1 ? `, multiple of ${t.step}` : "") + (t.nonZero ? ", ≠ 0" : ""), o = _input({
		class: "imm-slider",
		type: "range",
		min: String(t.min),
		max: String(t.max),
		step: String(t.step),
		"aria-label": `${e} slider`,
		title: `${e}: ${a}`
	}), s = _input({
		class: "imm-field",
		type: "text",
		inputmode: "numeric",
		spellcheck: "false",
		"aria-label": e,
		title: `${e}: ${a} (decimal, 0x… or 0b…; scroll to step)`
	}), c = _span({ class: "imm-readout" }, ""), l = ({ newValue: e = 0, from: t = null }) => {
		i = e, t !== o && (o.value = String(i)), t !== s && (s.value = String(i)), s.classList.remove("invalid"), c.textContent = Pt({ value: i }), c.classList.remove("error"), r(i);
	};
	return o.addEventListener("input", () => {
		let e = Number(o.value);
		t.nonZero && e === 0 && (e = t.step <= t.max ? t.step : -t.step), l({
			newValue: e,
			from: e === Number(o.value) ? o : null
		});
	}), s.addEventListener("input", () => {
		let n = Mt({ text: s.value }), r = n === null ? "is not a number" : H({
			value: n,
			range: t
		});
		r ? (s.classList.add("invalid"), c.textContent = `${e} ${r}`, c.classList.add("error")) : l({
			newValue: n,
			from: s
		});
	}), s.addEventListener("blur", () => l({ newValue: i })), s.addEventListener("wheel", (e) => {
		e.preventDefault();
		let n = Math.min(t.max, Math.max(t.min, i - Math.sign(e.deltaY) * t.step));
		t.nonZero && n === 0 && (n -= Math.sign(e.deltaY) * t.step), H({
			value: n,
			range: t
		}) || l({ newValue: n });
	}, { passive: !1 }), o.value = String(i), s.value = String(i), c.textContent = Pt({ value: i }), _div({ class: "imm-control" }, [
		o,
		s,
		c
	]);
}
function It({ token: e = "rd", info: t = {}, memory: n = {}, onChange: r = () => {} }) {
	let i = e.replace("'", "");
	if (t.kind === "reg") {
		let a = jt({ info: t }), o = n[i], s = At[i] ?? 10, c = a.some((e) => e.value === o) ? o : a.some((e) => e.value === s) ? s : a[0].value;
		return n[i] = c, V({
			options: a,
			value: c,
			label: e,
			searchable: !0,
			onChange: (e) => {
				n[i] = e, r();
			}
		});
	}
	if (t.kind === "imm") {
		let i = n.imm !== void 0 && !H({
			value: n.imm,
			range: t.range
		}) ? n.imm : Nt({ range: t.range });
		return n.imm = i, Ft({
			token: e,
			range: t.range,
			value: i,
			onChange: (e) => {
				n.imm = e, r();
			}
		});
	}
	if (t.kind === "csr") {
		let e = Object.keys(h).map((e) => ({
			value: e,
			label: e,
			hint: `0x${h[e].toString(16).padStart(3, "0")}`
		})), t = n.csr in h ? n.csr : "mstatus";
		return n.csr = t, V({
			options: e,
			value: t,
			label: "csr",
			searchable: !0,
			onChange: (e) => {
				n.csr = e, r();
			}
		});
	}
	if (t.kind === "rm") {
		let e = [
			7,
			0,
			1,
			2,
			3,
			4
		].map((e) => ({
			value: m[e],
			label: m[e],
			hint: e === 7 ? "default (frm)" : `rm = ${e}`
		})), t = n.rm || "dyn";
		return n.rm = t, V({
			options: e,
			value: t,
			label: "rounding mode",
			onChange: (e) => {
				n.rm = e, r();
			}
		});
	}
	let a = [];
	for (let e = 15; e >= 1; e--) a.push({
		value: b({ value: e }),
		label: b({ value: e })
	});
	let o = n[i] || "rw";
	return n[i] = o, V({
		options: a,
		value: o,
		label: e,
		onChange: (e) => {
			n[i] = e, r();
		}
	});
}
function Lt({ token: e = "rd", info: t = {}, memory: n = {} }) {
	let r = e.replace("'", "");
	return t.kind === "sp" ? "sp" : t.kind === "reg" ? (t.fp ? p : f)[n[r]] : t.kind === "imm" ? String(n.imm) : String(n[r]);
}
var Rt = [
	{
		value: "",
		label: "—",
		hint: "no ordering"
	},
	{
		value: "aq",
		label: ".aq",
		hint: "acquire"
	},
	{
		value: "rl",
		label: ".rl",
		hint: "release"
	},
	{
		value: "aqrl",
		label: ".aqrl",
		hint: "sequentially consistent"
	}
];
function zt({ entry: e = null }) {
	return !!(e && !e.pseudo && e.segments.some((e) => e.key === "aq"));
}
function Bt({ onChange: e = () => {} }) {
	let t = {}, n = null, r = [], i = _div({ class: "operand-panel" }, ""), a = () => e(i.read());
	return i.show = ({ entry: e = null }) => {
		n = e, r = e ? (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== "") : [];
		let o = [];
		for (let n of r) for (let r of w({ op: n })) {
			if (!r.token) continue;
			let n = C({
				entry: e,
				token: r.token
			});
			n.kind !== "sp" && o.push(_div({ class: `operand-row operand-${n.kind}` }, [_span({ class: "operand-name" }, r.token), It({
				token: r.token,
				info: n,
				memory: t,
				onChange: a
			})]));
		}
		zt({ entry: e }) && (t.ordering = t.ordering || "", o.push(_div({ class: "operand-row operand-field" }, [_span({ class: "operand-name" }, "order"), V({
			options: Rt,
			value: t.ordering,
			label: "memory ordering",
			onChange: (e) => {
				t.ordering = e, a();
			}
		})]))), e && !o.length && o.push(_div({ class: "operand-none" }, "no operands")), e || o.push(_div({ class: "operand-none" }, "choose a mnemonic")), i.replaceChildren(...o), a();
	}, i.read = () => {
		if (!n) return {
			entry: null,
			operands: null,
			ordering: ""
		};
		let e = r.map((e) => w({ op: e }).map((e) => e.token ? Lt({
			token: e.token,
			info: C({
				entry: n,
				token: e.token
			}),
			memory: t
		}) : e.text).join("")).join(", ");
		return {
			entry: n,
			operands: e,
			ordering: zt({ entry: n }) && t.ordering || ""
		};
	}, i;
}
// src/sliderule.mjs
var Vt = 220, Ht = 560, Ut = 1200, Wt = [
	"I",
	"M",
	"A",
	"F",
	"D",
	"Zicsr",
	"Zifencei",
	"C",
	"C + F",
	"C + D",
	"PSEUDO"
], U = {
	mode: "decoder",
	ext: "*",
	type: "*",
	entry: null,
	encoded: null,
	operands: null,
	switching: !1
}, W = null;
function Gt({ inst: e = {}, part: t = {}, fields: n = {} }) {
	if (!t.known) return `${t.text}: bits not set yet`;
	if (t.kind === "imm") {
		let t = n.imm;
		return `${e.immName} = ${t} = ${t < 0 ? "-" : ""}0x${Math.abs(t).toString(16)}` + (e.asmShift ? ` (written as imm >> ${e.asmShift})` : "");
	}
	return t.kind === "reg" && t.key !== "sp" ? `${t.key} = ${(e.fregs || []).includes(t.key) ? "f" : "x"}${n[t.key]}` : t.key ? `${t.key} = ${n[t.key]}` : "";
}
function G({ inst: e = {}, fields: t = {}, onHover: n = null }) {
	let r = x({
		inst: e,
		fields: t
	});
	return _span({ class: `asm-line fmt-${e.format}` }, r.map((r) => {
		if (r.kind === "punct") return _span({ class: "asm-punct" }, r.text);
		let i = _span({
			class: `asm-token asm-${r.kind}` + (r.known ? "" : " unknown"),
			title: Gt({
				inst: e,
				part: r,
				fields: t
			})
		}, r.text);
		if (n) {
			let t = r.kind === "mnemonic" ? e.mask : r.key === "sp" ? 0 : me({
				inst: e,
				key: r.key
			});
			i.addEventListener("mouseenter", () => n({ mask: t })), i.addEventListener("mouseleave", () => n({ mask: 0 }));
		}
		return i;
	}));
}
function K({ target: e = null, content: t = "", error: n = !1 }) {
	e.classList.toggle("error", n), e.replaceChildren(...Array.isArray(t) ? t : [t]);
}
function q({ label: e = "", title: t = "", classes: n = "tool-button", onClick: r = () => {} }) {
	let i = window._button({
		class: n,
		type: "button",
		title: t
	}, e);
	return i.addEventListener("click", r), i;
}
function J({ label: e = "Copy", title: t = "", text: n = () => "" }) {
	let r = q({
		label: e,
		title: t
	});
	return r.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(n()), r.textContent = "Copied ✓";
		} catch {
			r.textContent = "Copy failed";
		}
		setTimeout(() => {
			r.textContent = e;
		}, Ut);
	}), r;
}
function Kt() {
	let e = lt(), t = pt({ constraints: e }), n = t === null ? null : ge({ word: t }), r = W.decoderResult;
	if (dt({ dim: e[31] !== "-" && e[30] !== "-" && (e[31] !== "1" || e[30] !== "1") }), N({ mask: 0 }), t === null) {
		let t = he({ constraints: e });
		if (e.every((e) => e === "-")) K({
			target: r,
			content: "Click 1 / 0 on the bits, type 0s and 1s (each one moves to the next bit), or paste a word: the instruction builds up here."
		});
		else if (t.inst) {
			let n = e.slice(32 - t.inst.width).filter((e) => e === "-").length;
			K({
				target: r,
				content: [_div({ class: "io-line" }, [G({
					inst: t.inst,
					fields: t.fields,
					onHover: N
				})]), _div({ class: "io-note" }, `${n} bit${n === 1 ? "" : "s"} still unset`)]
			});
		} else if (!t.names.length) K({
			target: r,
			error: !0,
			content: "No RV32GC instruction starts with these bits."
		});
		else {
			let e = t.names.slice(0, 8).join(", ") + (t.names.length > 8 ? ", …" : "");
			K({
				target: r,
				content: `${t.names.length} candidates: ${e}`
			});
		}
	} else if (!n) {
		let e = (t & 3) == 3 ? Ce({ word: t }) : null;
		K({
			target: r,
			error: !0,
			content: `${A({
				word: t,
				width: (t & 3) == 3 ? 32 : 16
			})} is not a valid RV32GC instruction` + (e ? ` (${e.name} opcode: ${e.note})` : "")
		});
	} else if (n.inst.reserved || n.inst.hint) K({
		target: r,
		content: [_div({ class: "io-line" }, [_b({ class: "io-asm" }, n.assembly), _span({ class: "io-hex" }, A({
			word: t,
			width: n.inst.width
		}))])]
	});
	else {
		let { inst: e, fields: t } = n, i = [_div({ class: "io-line" }, [
			G({
				inst: e,
				fields: t,
				onHover: N
			}),
			_span({ class: "io-hex" }, A({
				word: n.word,
				width: e.width
			})),
			J({
				label: "Copy",
				title: "Copy the assembly",
				text: () => n.assembly
			})
		])];
		if (e.immName) {
			let n = t.imm;
			i.push(_div({ class: "io-note" }, `${e.immName} = ${n} = ${n < 0 ? "-" : ""}0x${Math.abs(n).toString(16)} (${e.immSigned ? "sign" : "zero"}-extended)`));
		}
		n.note && i.push(_div({ class: "io-note" }, n.note)), K({
			target: r,
			content: i
		});
	}
	W.decoder.querySelector("tbody").replaceChildren(...ct({
		constraints: e,
		decoded: n,
		onPattern: ({ inst: e }) => {
			ut({
				value: e.match,
				mask: e.mask,
				width: e.width
			}), Z();
		}
	}));
}
async function qt() {
	let e = "";
	try {
		e = await navigator.clipboard.readText();
	} catch {
		K({
			target: W.decoderResult,
			error: !0,
			content: "The browser did not allow reading the clipboard: click a bit and press Ctrl+V instead."
		});
		return;
	}
	ft({ text: e }) || K({
		target: W.decoderResult,
		error: !0,
		content: `"${e.trim().slice(0, 40)}" is not a hex word (0x…) or a bit pattern.`
	});
}
function Y() {
	return S.filter((e) => (U.ext === "*" || e.extension === U.ext) && (U.type === "*" || e.format === U.type));
}
function Jt() {
	let e = new Set(S.map((e) => e.extension));
	return [{
		value: "*",
		label: "All",
		hint: "every extension"
	}, ...Wt.filter((t) => e.has(t)).map((e) => ({
		value: e,
		label: e === "PSEUDO" ? "Pseudo" : e,
		classes: e === "PSEUDO" ? "pseudo" : ""
	}))];
}
function Yt() {
	let t = new Set(S.filter((e) => U.ext === "*" || e.extension === U.ext).map((e) => e.format));
	return [{
		value: "*",
		label: "All",
		hint: "every format"
	}, ...[...Object.keys(e), "/"].filter((e) => t.has(e)).map((t) => ({
		value: t,
		label: t === "/" ? "Multiple" : `${t}-Type`,
		hint: t === "/" ? "expands to several instructions" : e[t].title,
		classes: `fmt-${t}`
	}))];
}
function X({ entries: e = Y() } = {}) {
	let t = (e) => Wt.indexOf(e.extension);
	return e = [...e].sort((e, n) => t(e) - t(n) || e.name.localeCompare(n.name)), [{
		value: "",
		label: "—",
		hint: "any instruction"
	}, ...e.map((e) => ({
		value: e.id,
		label: e.name,
		hint: e.asm || "",
		group: e.pseudo ? "Pseudo-instructions" : `'${e.extension}'`,
		classes: e.pseudo ? "pseudo" : `fmt-${e.format}`
	}))];
}
function Xt() {
	let { ext: e, type: t, mnemonic: n } = W.selectors;
	e.setOptions({
		options: Jt(),
		value: U.ext
	}), t.setOptions({
		options: Yt(),
		value: U.type
	}), U.type = t.value, n.setOptions({
		options: X(),
		value: U.entry ? U.entry.id : ""
	});
}
function Zt({ entry: e = null }) {
	U.entry = e, e && (U.ext = e.extension, U.type = e.format), Xt(), W.operands.show({ entry: e });
}
function Qt() {
	U.entry && !Y().includes(U.entry) ? (Xt(), W.operands.show({ entry: null })) : (Xt(), tn());
}
function $t({ entry: e = null, operands: t = null, ordering: n = "" }) {
	if (U.entry = e, U.operands = t, U.encoded = null, e && t !== null) try {
		U.encoded = Fe({
			entry: e,
			operands: t,
			ordering: n
		});
	} catch (e) {
		U.encoded = { error: e.message };
	}
	Z();
}
function en({ format: e = "hex" }) {
	let t = U.encoded && !U.encoded.error ? U.encoded : null;
	return t ? t.words.map(({ word: t, inst: n }) => e === "hex" ? A({
		word: t,
		width: n.width
	}) : (t >>> 0).toString(2).padStart(n.width, "0")).join("\n") : "";
}
function tn() {
	let e = U.encoded && !U.encoded.error ? U.encoded : null, { encoderStatus: t, encoderWords: n, copyButtons: r } = W;
	if (U.encoded && U.encoded.error) K({
		target: t,
		content: U.encoded.error,
		error: !0
	});
	else if (e) K({
		target: t,
		content: e.words.map(({ inst: e, fields: t }) => _div({ class: "io-line" }, [G({
			inst: e,
			fields: t
		})]))
	});
	else {
		let e = Y().length;
		K({
			target: t,
			content: `${e} instruction${e === 1 ? "" : "s"}: scroll the selectors (or click to pick from a list), or click a mnemonic below.`
		});
	}
	n.replaceChildren(...e ? e.words.map(({ word: e, inst: t }) => _span({ class: "io-word" }, [_b({ class: "io-hex-big" }, A({
		word: e,
		width: t.width
	})), _span({ class: "io-bin" }, (e >>> 0).toString(2).padStart(t.width, "0"))])) : [_span({ class: "io-placeholder" }, "The encoding appears here once an instruction is chosen.")]), r.forEach((t) => {
		t.disabled = !e;
	}), St({
		entry: U.entry,
		encoded: e
	}), W.encoder.querySelector("tbody").replaceChildren(...xt({
		entries: Y(),
		entry: U.entry,
		encoded: e,
		operands: e ? U.operands : null,
		onPick: Zt
	}));
}
function Z() {
	(U.mode === "encoder" || U.print) && tn(), (U.mode === "decoder" || U.print) && Kt();
}
function nn({ table: e = null }) {
	let t = [".number-row", ".input-row"].map((t) => _tr({}, [...e.querySelectorAll(`${t} > .spine`)].map((e) => e.cloneNode(!0)))), n = Array(32).fill(24), r = _table({
		class: "sliderule ghost",
		"aria-hidden": "true",
		style: k({ widths: n })
	}, [Je({ widths: n }), _thead({}, t)]);
	W.stage.append(r);
	let i = e.querySelector(".bit-number").getBoundingClientRect(), a = r.querySelector(".bit-number").getBoundingClientRect();
	return r.style.left = `${i.left - a.left}px`, r.style.top = `${i.top - a.top}px`, r;
}
function Q({ element: e = null, keyframes: t = [], duration: n = Vt, easing: r = "ease-in-out" }) {
	return e.animate(t, {
		duration: n,
		easing: r,
		fill: "forwards"
	}).finished;
}
function rn({ table: e = null }) {
	return e.querySelector(".bit-number").offsetLeft;
}
function an({ table: e = null }) {
	let t = e.querySelectorAll(".bit-number"), n = t[0].getBoundingClientRect().left + window.scrollX - 16, r = t[t.length - 1].getBoundingClientRect().right + window.scrollX + 16;
	return r > window.scrollX + window.innerWidth ? Math.min(n, r - window.innerWidth) : n < window.scrollX ? n : window.scrollX;
}
function $({ mode: e = "decoder" }) {
	W.decoder.parentElement.classList.toggle("active", e === "decoder"), W.encoder.parentElement.classList.toggle("active", e === "encoder");
}
async function on({ mode: e = "decoder" }) {
	if (e === U.mode || U.switching) return;
	U.switching = !0;
	let t = U.mode === "encoder" ? W.encoder : W.decoder, n = e === "encoder" ? W.encoder : W.decoder;
	if (U.mode = e, Z(), window.matchMedia("(prefers-reduced-motion: reduce)").matches) $({ mode: e });
	else {
		let r = nn({ table: t });
		await Q({
			element: t,
			keyframes: [{ opacity: 1 }, { opacity: 0 }]
		});
		let i = rn({ table: n }) - rn({ table: t });
		window.scrollTo({
			left: an({ table: n }),
			behavior: "smooth"
		}), await Q({
			element: r,
			keyframes: [{ transform: "translateX(0)" }, { transform: `translateX(${i}px)` }],
			duration: Ht,
			easing: "cubic-bezier(0.65, 0, 0.35, 1)"
		}), $({ mode: e }), t.getAnimations().forEach((e) => e.cancel()), await Promise.all([Q({
			element: n,
			keyframes: [{ opacity: 0 }, { opacity: 1 }]
		}), Q({
			element: r,
			keyframes: [{ opacity: 1 }, { opacity: 0 }]
		})]), n.getAnimations().forEach((e) => e.cancel()), r.remove();
	}
	try {
		history.replaceState(null, "", `#${e}`);
	} catch {}
	window.scrollTo({ left: an({ table: n }) }), U.switching = !1;
}
function sn({ mode: e = "encoder", label: t = "" }) {
	return q({
		classes: "mode-button",
		title: `Switch to the ${t}`,
		label: e === "encoder" ? `◀ ${t}` : `${t} ▶`,
		onClick: () => on({ mode: e })
	});
}
function cn({ table: e = null }) {
	let t = [
		".number-row",
		".input-row",
		".output-row"
	].map((t) => e.querySelector(`thead > ${t}`)).filter(Boolean), n = () => {
		let e = 0;
		for (let n of t) {
			for (let t of n.children) t.style.top = `${e}px`;
			e += n.getBoundingClientRect().height;
		}
	};
	new ResizeObserver(n).observe(e.tHead), n();
}
function ln() {
	return {
		ext: V({
			label: "extension",
			options: Jt(),
			value: "*",
			onChange: (e) => {
				U.ext = e, Qt();
			}
		}),
		type: V({
			label: "format type",
			options: Yt(),
			value: "*",
			onChange: (e) => {
				U.type = e, Qt();
			}
		}),
		mnemonic: V({
			label: "mnemonic",
			options: X(),
			value: "",
			searchable: !0,
			classes: "mnemonic-carousel",
			searchAll: () => X({ entries: S }),
			onChange: (e) => Zt({ entry: S.find((t) => t.id === e) || null })
		}),
		operands: Bt({ onChange: $t })
	};
}
function un() {
	let e = new URLSearchParams(location.search).has("print"), t = _div({ class: "io-result" }, ""), n = mt({
		onBits: Z,
		toggle: sn({
			mode: "encoder",
			label: "a2b · Encoder"
		}),
		io: _div({ class: "io" }, [t, _div({ class: "io-tools" }, [q({
			label: "Paste",
			title: "Fill the bits from the clipboard (a hex word or a bit pattern)",
			onClick: qt
		}), q({
			label: "Clear",
			title: "Set every bit back to x",
			onClick: () => {
				ut({
					value: 0,
					mask: 0
				}), Z();
			}
		})])])
	}), r = ln(), i = _div({ class: "io-result" }, ""), a = _div({ class: "io-words" }, ""), o = [J({
		label: "Copy hex",
		title: "Copy the encoding as hex (one word per line)",
		text: () => en({ format: "hex" })
	}), J({
		label: "Copy bin",
		title: "Copy the encoding as binary (one word per line)",
		text: () => en({ format: "bin" })
	})], s = Et({
		toggle: sn({
			mode: "decoder",
			label: "b2a · Decoder"
		}),
		controls: {
			ext: r.ext,
			type: r.type,
			mnemonic: r.mnemonic,
			operands: r.operands
		},
		status: _div({ class: "io" }, [i, _div({ class: "io-tools" }, [q({
			label: "Clear",
			title: "Back to every instruction",
			onClick: () => {
				U.ext = "*", U.type = "*", Zt({ entry: null });
			}
		})])]),
		output: _div({ class: "io io-output" }, [a, _div({ class: "io-tools" }, o)])
	}), c = _div({
		id: "sliderule",
		class: "stage" + (e ? " print" : "")
	}, [_div({ class: "view" }, [n]), _div({ class: "view" }, [s])]);
	return W = {
		decoder: n,
		encoder: s,
		decoderResult: t,
		encoderStatus: i,
		encoderWords: a,
		copyButtons: o,
		selectors: r,
		operands: r.operands,
		stage: c
	}, U.print = e, U.mode = location.hash === "#encoder" ? "encoder" : "decoder", $({ mode: U.mode }), e && wt({ expand: !0 }), Kt(), r.operands.show({ entry: null }), requestAnimationFrame(() => [n, s].forEach((e) => cn({ table: e }))), c;
}
// src/main.mjs
var dn = {
	loadInto: (e) => {
		document.getElementById(e).append(un());
	},
	refresh: Z
};
window.sliderules = dn;
export { dn as default };
