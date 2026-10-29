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
		enc: "100 0 00 rd'/rs1' shamt[4:0] 01",
		asm: "rd', imm",
		expands: "srli rd', rd', shamt",
		description: "Shift Right Logical Immediate",
		pseudocode: "rd' = rd' >> shamt (zero extends)"
	},
	{
		group: "c.cb-alu",
		name: "c.srai",
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
function ee({ format: t = "R", bit: n = 0 }) {
	let r = e[t].layout.find(([, e, t]) => n <= e && n >= t);
	return r ? r[3] : "funct";
}
function te({ spec: e = "" }) {
	return e.split("|").map((e) => {
		let [t, n = t] = e.split(":").map(Number), r = [];
		for (let e = t; e >= n; e--) r.push(e);
		return r;
	});
}
function ne({ enc: e = "", format: t = "R" }) {
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
			te({ spec: r[2] }).forEach((e, t) => n.push({
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
	for (let e of n) e.hi = r - 1, e.lo = r - e.width, r = e.lo, e.kind === "lit" && (e.role = ee({
		format: t,
		bit: e.hi
	}));
	return {
		width: i,
		segments: n
	};
}
function _({ word: e = 0, hi: t = 0, lo: n = 0 }) {
	return e >>> n & 2 ** (t - n + 1) - 1;
}
function v({ value: e = 0, width: t = 1 }) {
	return (e >>> 0 & 2 ** t - 1).toString(2).padStart(t, "0");
}
var y = i.map((t, r) => {
	let i = n[t.group], { width: a, segments: o } = ne({
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
		immNonZero: l.length > 0 && l[0].name.startsWith("nz")
	};
}), re = [...y].sort((e, t) => t.literalCount - e.literalCount);
function b({ inst: e = {}, word: t = 0 }) {
	let n = 0;
	for (let r of e.segments.filter((e) => e.kind === "imm")) r.immBits.forEach((e, i) => {
		n += (t >>> r.hi - i & 1) * 2 ** e;
	});
	return e.immSigned && n >= 2 ** e.immMsb && (n -= 2 ** (e.immMsb + 1)), n;
}
function ie({ inst: e = {} }) {
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
function ae({ inst: e = {}, word: t = 0 }) {
	for (let n of e.segments) if (n.kind === "reg" && n.exclude.includes(_({
		word: t,
		hi: n.hi,
		lo: n.lo
	}))) return !1;
	return !(e.immNonZero && b({
		inst: e,
		word: t
	}) === 0);
}
function oe({ inst: e = {}, constraints: t = [] }) {
	let n = 0, r = 0;
	for (let i = 0; i < e.width; i++) {
		let e = t[31 - i];
		e !== "-" && (n |= 1 << i, r |= Number(e) << i);
	}
	if (n >>>= 0, r >>>= 0, ((r ^ e.match) & e.mask & n) >>> 0) return !1;
	for (let t of e.segments) {
		let e = (2 ** t.width - 1) * 2 ** t.lo >>> 0;
		if (t.kind === "reg" && (n & e) >>> 0 === e && t.exclude.includes(_({
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
function se({ number: e = 0, fp: t = !1 }) {
	return (t ? p : f)[e];
}
function x({ value: e = 0 }) {
	return [
		"i",
		"o",
		"r",
		"w"
	].filter((t, n) => e >> 3 - n & 1).join("") || "0";
}
function ce({ value: e = 0 }) {
	return Object.keys(h).find((t) => h[t] === e) || `0x${e.toString(16)}`;
}
function le({ inst: e = {}, key: t = "rd" }) {
	return (e.fregs || []).includes(t);
}
function ue({ inst: e = {}, word: t = 0 }) {
	let n = {};
	for (let r of e.segments) r.kind === "reg" ? n[r.key] = _({
		word: t,
		hi: r.hi,
		lo: r.lo
	}) + (r.compressed ? 8 : 0) : r.kind === "field" && (n[r.key] = _({
		word: t,
		hi: r.hi,
		lo: r.lo
	}));
	return e.immName && (n.imm = b({
		inst: e,
		word: t
	})), n;
}
function S({ inst: e = {}, fields: t = {} }) {
	let n = e.name;
	(t.aq || t.rl) && (n += "." + (t.aq ? "aq" : "") + (t.rl ? "rl" : ""));
	let r = (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== "").filter((e) => e !== "rm" || t.rm !== 7).map((n) => n.replace(d, (n) => {
		let r = n.replace("'", "");
		return r === "sp" ? "sp" : r === "imm" ? String(e.asmShift ? `0x${(t.imm >>> e.asmShift & 2 ** (32 - e.asmShift) - 1).toString(16)}` : t.imm) : r === "csr" ? ce({ value: t.csr }) : r === "rm" ? m[t.rm] || `rm${t.rm}` : r === "pred" || r === "succ" ? x({ value: t[r] }) : se({
			number: t[r],
			fp: le({
				inst: e,
				key: r
			})
		});
	}));
	return `${n}${r.length ? " " + r.join(", ") : ""}`;
}
function de({ word: e = 0 }) {
	e >>>= 0;
	let t = (e & 3) != 3;
	t && (e &= 65535);
	for (let n of re) {
		if (n.width === 16 !== t || (e & n.mask) >>> 0 !== n.match || !ae({
			inst: n,
			word: e
		})) continue;
		let r = ue({
			inst: n,
			word: e
		});
		if (n.reserved || n.hint) return {
			inst: n,
			word: e,
			fields: r,
			assembly: n.description
		};
		let i = [he({
			inst: n,
			fields: r,
			word: e
		}), ge({ fields: r })].filter(Boolean).join(" ; ");
		return {
			inst: n,
			word: e,
			fields: r,
			assembly: S({
				inst: n,
				fields: r
			}),
			note: i
		};
	}
	return null;
}
var fe = [
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
], pe = [
	"slti",
	"sltiu",
	"slli",
	"srli",
	"srai",
	"slt",
	"sltu"
], me = {
	2: "ntl.p1",
	3: "ntl.pall",
	4: "ntl.s1",
	5: "ntl.all"
};
function he({ inst: e = {}, fields: t = {}, word: n = 0 }) {
	return e.name === "fence" ? t.pred === 0 || t.succ === 0 ? "HINT (empty predecessor or successor set): standard use, executes as a no-op" : "" : t.rd !== 0 || n === 19 ? "" : e.name === "add" && t.rs1 === 0 && me[t.rs2] ? `HINT: ${me[t.rs2]} (Zihintntl non-temporal locality)` : e.name === "slli" && t.rs1 === 0 && t.imm === 31 ? "HINT: semihosting entry marker" : e.name === "srai" && t.rs1 === 0 && t.imm === 7 ? "HINT: semihosting exit marker" : fe.includes(e.name) ? "HINT (rd = x0): standard use, executes as a no-op" : pe.includes(e.name) ? "HINT (rd = x0): custom use, executes as a no-op" : "";
}
function ge({ fields: e = {} }) {
	return e.rm === 5 || e.rm === 6 ? `rm = ${v({
		value: e.rm,
		width: 3
	})} is reserved: illegal instruction` : "";
}
var _e = a.map((e) => {
	let t = parseInt(e.opcode, 2);
	return {
		...e,
		match: t,
		mask: 127,
		width: 32,
		sortKey: g[32].map((e) => e < 7 ? t >>> e & 1 : 2).join("")
	};
});
function ve({ word: e = 0 }) {
	return _e.find((t) => (e >>> 0 & 127) === t.match) || null;
}
function ye({ value: e = 0 }) {
	return e + 2048 >> 12 & 1048575;
}
function C({ value: e = 0 }) {
	return e - (e + 2048 >> 12 << 12) | 0;
}
function be({ base: e = {}, mapping: t = {} }) {
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
			bits: v({
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
function xe({ base: e = {}, mapping: t = {} }) {
	let n = (e.asm || "").replace(d, (e) => {
		let n = e.replace("'", ""), r = t[n];
		return r === "hi" ? "imm[31:12]" : r === "lo" ? "imm[11:0]" : typeof r == "string" ? r : typeof r == "number" ? n === "imm" ? String(r) : n === "csr" ? ce({ value: r }) : n === "pred" || n === "succ" ? x({ value: r }) : `x${r}` : e;
	});
	return `${e.name} ${n}`.trim();
}
function w({ expands: e = [] }) {
	return e.map(([e, t]) => {
		let n = y.find((t) => t.name === e && !t.reserved && !t.hint);
		return {
			base: n,
			mapping: t,
			segments: be({
				base: n,
				mapping: t
			}),
			text: xe({
				base: n,
				mapping: t
			})
		};
	});
}
var Se = o.map((e, t) => {
	let n = w({ expands: e.expands });
	return {
		...e,
		id: `${e.name}#pseudo${t}`,
		pseudo: !0,
		extension: "PSEUDO",
		width: 32,
		expansions: n,
		shortExpansions: e.short ? w({ expands: e.short }) : null,
		format: n.length === 1 ? n[0].base.format : "/"
	};
}), T = [...y.filter((e) => !e.reserved && !e.hint), ...Se].sort((e, t) => e.name.localeCompare(t.name) || Number(!!e.pseudo) - Number(!!t.pseudo));
function E({ entry: e = {}, token: t = "rd" }) {
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
		range: ie({ inst: r })
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
		fp: le({
			inst: r,
			key: i
		}),
		compressed: !!(o && o.compressed),
		exclude: o ? o.exclude : []
	};
}
function Ce({ op: e = "" }) {
	let t = [], n = 0;
	for (let r of e.matchAll(d)) r.index > n && t.push({ text: e.slice(n, r.index) }), t.push({ token: r[0] }), n = r.index + r[0].length;
	return n < e.length && t.push({ text: e.slice(n) }), t;
}
function D({ text: e = "" }) {
	let t = e.trim().toLowerCase(), n = t.startsWith("-"), r = n ? t.slice(1) : t;
	if (!/^(0x[0-9a-f]+|0b[01]+|\d+)$/.test(r)) throw Error(`"${e}" is not a number`);
	let i = r.startsWith("0b") ? parseInt(r.slice(2), 2) : Number(r);
	return n ? -i : i;
}
function O({ text: e = "", fp: t = !1 }) {
	let n = e.trim().toLowerCase(), r = n.match(t ? /^f(\d+)$/ : /^x(\d+)$/);
	if (r && Number(r[1]) < 32) return Number(r[1]);
	if (!t && n === "fp") return 8;
	let i = (t ? p : f).indexOf(n);
	if (i < 0) throw Error(`"${e}" is not a${t ? " floating-point" : "n integer"} register`);
	return i;
}
function we({ text: e = "" }) {
	let t = e.trim().toLowerCase();
	return /^[iorw]+$/.test(t) ? [
		"i",
		"o",
		"r",
		"w"
	].reduce((e, n, r) => e | (t.includes(n) ? 1 << 3 - r : 0), 0) : D({ text: t });
}
function Te({ inst: e = {}, key: t = "rd", value: n = 0, word: r = 0 }) {
	if (t === "imm") {
		let t = e.asmShift ? n * 2 ** e.asmShift | 0 : n, { min: i, max: a } = ie({ inst: e });
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
function k({ inst: e = {}, fields: t = {} }) {
	let n = e.match, r = [...new Set(e.segments.map((e) => e.key).filter(Boolean))];
	for (let i of r) {
		if (t[i] === void 0) throw Error(`${e.name}: missing ${i}`);
		n = Te({
			inst: e,
			key: i,
			value: t[i],
			word: n
		});
	}
	n >>>= 0;
	let i = ue({
		inst: e,
		word: n
	});
	return {
		inst: e,
		word: n,
		fields: i,
		assembly: S({
			inst: e,
			fields: i
		})
	};
}
function Ee({ entry: e = {}, text: t = "" }) {
	let n = (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== ""), r = t.split(",").map((e) => e.trim()).filter((e) => e !== ""), i = +(n[n.length - 1] === "rm");
	if (r.length > n.length || r.length < n.length - i) throw Error(`${e.name} expects: ${e.name} ${e.asm}`);
	let a = {};
	return n.slice(0, r.length).forEach((t, n) => {
		let i = t.match(d) || [], o = RegExp("^" + t.replace(/[()]/g, "\\$&").replace(d, "(.+?)") + "$"), s = r[n].match(o);
		if (!s) throw Error(`operand "${r[n]}" does not match "${t}"`);
		i.forEach((t, n) => {
			let r = t.replace("'", ""), i = s[n + 1], o = E({
				entry: e,
				token: r
			});
			if (o.kind === "sp") {
				if (O({ text: i }) !== 2) throw Error(`${e.name} only works with sp`);
			} else if (o.kind === "imm") a[r] = D({ text: i });
			else if (o.kind === "csr") a[r] = i.toLowerCase() in h ? h[i.toLowerCase()] : D({ text: i });
			else if (o.kind === "rm") {
				if (a[r] = m.indexOf(i.toLowerCase()), a[r] < 0 || i === "") throw Error(`"${i}" is not a rounding mode`);
			} else o.kind === "fence" ? a[r] = we({ text: i }) : a[r] = O({
				text: i,
				fp: o.fp
			});
		});
	}), a;
}
function De({ entry: e = {}, operands: t = "", ordering: n = "" }) {
	let r = Ee({
		entry: e,
		text: t
	}), i = {
		aq: +!!n.includes("aq"),
		rl: +!!n.includes("rl"),
		rm: 7
	};
	if (!e.pseudo) return {
		entry: e,
		words: [k({
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
		words: (a ? e.shortExpansions : e.expansions).filter(({ mapping: t }) => !(e.dropZeroLo && t.imm === "lo" && C({ value: r.imm | 0 }) === 0)).map(({ base: e, mapping: t }) => {
			let n = {
				...i,
				rm: e.rmDefault ?? 7
			};
			for (let i of new Set(e.segments.map((e) => e.key).filter(Boolean))) {
				let e = t[i];
				typeof e == "number" ? n[i] = e : e === "hi" ? n[i] = ye({ value: r.imm | 0 }) : e === "lo" ? n[i] = C({ value: r.imm | 0 }) : typeof e == "string" ? n[i] = r[e] : r[i] !== void 0 && (n[i] = r[i]);
			}
			return k({
				inst: e,
				fields: n
			});
		})
	};
}
function Oe({ inst: e = {} }) {
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
var ke = "0.0.1";
// src/cells.mjs
function A({ width: e = 1, rowspan: t = 1, classes: n = "", text: r = "", title: i = "" }) {
	let a = { class: n };
	return e > 1 && (a.colspan = String(e)), t > 1 && (a.rowspan = String(t)), i && (a.title = i), _td(a, r);
}
function j({ width: e = 32 }) {
	return e === 16 ? [A({
		width: 16,
		classes: "bit unused"
	})] : [];
}
function M({ segment: e = {} }) {
	return `inst[${e.hi}${e.width > 1 ? ":" + e.lo : ""}]`;
}
function N({ segments: e = [], width: t = 32, fields: n = null, inst: r = {} }) {
	let i = j({ width: t });
	for (let t of e) if (t.kind === "lit") for (let e of t.bits) i.push(A({
		classes: `bit lit-${t.role}`,
		text: e
	}));
	else if (t.kind === "any") i.push(A({
		width: t.width,
		classes: "bit any",
		text: t.width > 1 ? "– any –" : "–",
		title: `${M({ segment: t })} = don't care`
	}));
	else if (t.kind === "imm") i.push(A({
		width: t.width,
		classes: `bit imm imm-${t.part % 4}`,
		text: t.width > 1 ? `${t.name}[${t.label}]` : t.label,
		title: `${M({ segment: t })} = ${t.name}[${t.immBits.join("|")}]`
	}));
	else if (n && t.kind === "reg") {
		let e = se({
			number: n[t.key],
			fp: (r.fregs || []).includes(t.key)
		});
		i.push(A({
			width: t.width,
			classes: "bit field-reg",
			text: t.width > 3 ? `${t.key} = ${e}` : e
		}));
	} else n && (t.key === "pred" || t.key === "succ") ? i.push(A({
		width: t.width,
		classes: "bit field-field",
		text: x({ value: n[t.key] })
	})) : i.push(A({
		width: t.width,
		classes: `bit field-${t.kind}`,
		text: t.label
	}));
	return i;
}
function Ae({ inst: e = {}, word: t = 0 }) {
	let n = j({ width: e.width });
	for (let r of e.segments) {
		let e = r.kind === "lit" ? `lit-${r.role}` : r.kind === "imm" ? `imm imm-${r.part % 4}` : `field-${r.kind}`;
		for (let i = r.hi; i >= r.lo; i--) n.push(A({
			classes: `bit value ${e}`,
			text: String(t >>> i & 1),
			title: r.kind === "lit" ? "" : r.label
		}));
	}
	return n;
}
function P({ inst: e = {} }) {
	return Oe({ inst: e }).map((e) => {
		if (e.kind === "zero") return A({
			width: e.width,
			classes: "bit imm-zero",
			text: e.width > 1 ? "– 0 –" : "0"
		});
		let t = e.kind === "sext" ? `– ${e.segment.immBits[0]} –` : e.segment.label;
		return A({
			width: e.width,
			classes: `bit imm imm-${e.segment.part % 4}${e.kind === "sext" ? " sext" : ""}`,
			text: t,
			title: e.kind === "sext" ? `sign extension of inst[${e.segment.hi}]` : `from ${M({ segment: e.segment })}`
		});
	});
}
function F({ format: t = "R", rowspan: n = 1 }) {
	return e[t] ? _td({
		class: "text type",
		rowspan: String(n)
	}, [
		_b({}, `${t} - Type`),
		_br(),
		`"${e[t].title}"`
	]) : A({
		rowspan: n,
		classes: "text type",
		text: t
	});
}
function I() {
	let e = [];
	for (let t = 31; t >= 0; t--) e.push(_th({ class: "bit-number spine" }, String(t)));
	return e;
}
function L({ name: e = "Decoder", colspan: t = 1, button: n = null, side: r = "left" }) {
	let i = _div({ class: `title-corner ${r}` }, [n]), a = _div({ class: `title-corner ${r === "left" ? "right" : "left"} title-info` }, [
		`v${ke}`,
		_br(),
		"Designed to be printed on A3"
	]), o = _div({ class: "title-main" }, [
		_div({ class: "title-isa" }, "RV32GC"),
		_div({ class: "title-name" }, `Instruction Set "Sliderule" ${e}`),
		_div({ class: "title-credits" }, "Contributors: Simone Shawn Cazzaniga (magiwanders@github | www.magiwanders.com)")
	]);
	return _tr({ class: "title-row" }, [_th({
		colspan: String(t),
		class: "title-cell"
	}, [_div({ class: "title-bar" }, r === "left" ? [
		i,
		o,
		a
	] : [
		a,
		o,
		i
	])])]);
}
function R({ widths: e = [] }) {
	return _colgroup({}, e.map((e) => _col({ style: `width: ${e}px` }, "")));
}
function z({ widths: e = [] }) {
	return `width: ${e.reduce((e, t) => e + t, 0)}px`;
}
function B({ word: e = 0, width: t = 32 }) {
	return `0x${(e >>> 0).toString(16).padStart(t / 4, "0")}`;
}
// src/tristate.mjs
function je({ editable: e = !0, onChange: t = () => {} }) {
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
		let r = (e.clipboardData || window.clipboardData).getData("text").trim().toLowerCase().replace(/[_\s]/g, ""), i = null;
		if (/^0x[0-9a-f]{1,8}$/.test(r)) {
			let e = parseInt(r.slice(2), 16) >>> 0, t = (e & 3) == 3 ? 32 : 16;
			i = n.map((n, r) => 31 - r < t ? String(e >>> 31 - r & 1) : "-");
		} else /^(0b)?[01x-]{1,32}$/.test(r) && (i = [...r.replace(/^0b/, "").replace(/x/g, "-").padStart(32, "-")]);
		i && (e.preventDefault(), i.forEach((e, t) => {
			n[t].dataset.state = e;
		}), t());
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
		dimUpper: ({ dim: e = !1 }) => n.forEach((t, n) => t.classList.toggle("tri-off", e && n < 16))
	};
}
// src/selector.mjs
var V = [
	"Instruction",
	"Mnemonic",
	"Operands",
	"Expansion",
	"Pseudocode",
	"Type",
	"Ext"
], Me = [
	170,
	90,
	150,
	150,
	230,
	120,
	60
], H = 32 + V.length, U = null;
function Ne({ inst: e = {}, bit: t = 0 }) {
	return e.mask >>> t & 1 ? String(e.match >>> t & 1) : null;
}
function Pe({ title: e = "" }) {
	return _tr({ class: "section-row" }, [A({
		width: H,
		text: e
	})]);
}
function Fe({ group: t = {}, members: n = [], rowspan: r = 1 }) {
	let i = e[t.format], a = [];
	i.width === 16 && a.push(A({
		width: 16,
		classes: "bit unused"
	}));
	for (let [e, t, r, o] of i.layout) {
		let i = [];
		for (let e = t; e >= r; e--) {
			let t = Ne({
				inst: n[0],
				bit: e
			});
			i.push(t !== null && n.every((n) => Ne({
				inst: n,
				bit: e
			}) === t) ? t : null);
		}
		i.every((e) => e !== null) ? i.forEach((e) => a.push(A({
			classes: `bit lit-${o}`,
			text: e
		}))) : a.push(A({
			width: t - r + 1,
			classes: `bit field-${o}`,
			text: e
		}));
	}
	return a.push(A({
		width: 4,
		classes: "text group-title",
		text: t.title
	}), A({
		classes: "text group-pseudo",
		text: t.pseudocode
	}), F({
		format: t.format,
		rowspan: r
	}), A({
		rowspan: r,
		classes: "text ext",
		text: `'${t.extension}'`
	})), _tr({ class: `group-row fmt-${t.format}` }, a);
}
function Ie({ inst: e = {}, decoded: t = null, onPattern: n = () => {} }) {
	let r = t && t.inst === e ? t.fields : null, i = N({
		segments: e.segments,
		width: e.width,
		fields: r,
		inst: e
	});
	if (e.reserved || e.hint) {
		let t = e.reserved ? "reserved" : "hint";
		return i.push(A({
			width: 5,
			classes: `text ${t}`,
			text: e.hint ? `${e.description} : PC += ${e.width / 8}, no other effect` : e.description
		})), _tr({ class: `instruction-row ${t}-row fmt-${e.format}` + (r ? " decoded" : "") }, i);
	}
	let a = _td({
		class: "text mnemonic",
		title: "Show this encoding in the bit selector"
	}, e.name);
	return a.addEventListener("click", () => n({ inst: e })), i.push(A({
		classes: "text description",
		text: e.description
	}), a, A({
		classes: "text operands",
		text: r ? S({
			inst: e,
			fields: r
		}).slice(e.name.length).trim() || "—" : e.asm || "—"
	}), A({
		classes: "text expansion",
		text: e.expands || ""
	}), A({
		classes: "text pseudocode",
		text: e.pseudocode
	})), _tr({ class: `instruction-row fmt-${e.format}` + (r ? " decoded" : "") }, i);
}
function Le({ inst: e = {}, decoded: t = null }) {
	let n = P({ inst: e });
	return n.push(A({
		width: 4,
		classes: "text imm-name",
		text: t && t.inst === e ? `${e.immName} = ${t.fields.imm}` : e.immName
	}), A({
		classes: "text imm-desc",
		text: `${e.format} ${e.immSigned ? "sign-extended" : "zero-extended"} immediate`
	})), _tr({ class: `immediate-row fmt-${e.format}` }, n);
}
function Re({ inst: e = {} }) {
	return e.segments.filter((e) => e.kind === "imm").map((e) => `${e.hi}:${e.immBits}`).join(" ");
}
function ze({ unused: e = {} }) {
	let t = [A({
		width: 25,
		classes: "bit any",
		text: "– not used in RV32GC –"
	})];
	for (let n of e.opcode) t.push(A({
		classes: "bit lit-opcode",
		text: n
	}));
	return t.push(A({
		width: 4,
		classes: "text unused-name",
		text: e.name
	}), A({
		classes: "text unused-note",
		text: e.note
	}), A({
		classes: "text unused-note",
		text: "—"
	}), A({
		classes: "text unused-note",
		text: "—"
	})), _tr({ class: "unused-row" }, t);
}
function Be({ unused: e = {}, constraints: t = [] }) {
	return [...e.opcode].every((e, n) => [e, "-"].includes(t[25 + n]));
}
function Ve({ section: e = "q3" }) {
	let t = (e) => y.filter((t) => t.groupKey === e).map((e) => e.sortKey).sort()[0], r = Object.keys(n).filter((t) => n[t].section === e).map((e) => ({
		groupKey: e,
		sortKey: t(e)
	}));
	return e === "q3" && r.push(..._e.map((e) => ({
		unused: e,
		sortKey: e.sortKey
	}))), r.sort((e, t) => e.sortKey.localeCompare(t.sortKey));
}
function He({ constraints: e = [], decoded: r = null, onPattern: i = () => {} }) {
	let a = [];
	for (let o of Object.keys(t)) {
		let s = [];
		for (let { groupKey: t, unused: a } of Ve({ section: o })) {
			if (a) {
				Be({
					unused: a,
					constraints: e
				}) && s.push(ze({ unused: a }));
				continue;
			}
			let o = y.filter((n) => n.groupKey === t && oe({
				inst: n,
				constraints: e
			})).sort((e, t) => e.sortKey.localeCompare(t.sortKey));
			if (!o.length) continue;
			let c = o.filter((e) => e.immName), l = c.length > 0 && c.every((e) => Re({ inst: e }) === Re({ inst: c[0] })), u = [];
			l && u.push(Le({
				inst: r && c.includes(r.inst) ? r.inst : c[0],
				decoded: r
			}));
			for (let e of o) u.push(Ie({
				inst: e,
				decoded: r,
				onPattern: i
			})), e.immName && !l && u.push(Le({
				inst: e,
				decoded: r
			}));
			s.push(Fe({
				group: n[t],
				members: o,
				rowspan: u.length + 1
			}), ...u);
		}
		s.length && a.push(Pe({ title: t[o] }), ...s);
	}
	return a.length || a.push(_tr({}, [A({
		width: H,
		classes: "text empty",
		text: "No instruction matches the selected bits."
	})])), a;
}
function Ue() {
	return U.read();
}
function We({ value: e = 0, mask: t = 4294967295, width: n = 32 }) {
	U.write({
		value: e,
		mask: t,
		width: n
	});
}
function Ge({ dim: e = !1 }) {
	U.dimUpper({ dim: e });
}
function Ke({ constraints: e = [] }) {
	let t = (t) => e[31 - t];
	if (t(0) === "-" || t(1) === "-") return null;
	let n = t(0) === "1" && t(1) === "1" ? 32 : 16, r = 0;
	for (let e = 0; e < n; e++) {
		if (t(e) === "-") return null;
		r += Number(t(e)) * 2 ** e;
	}
	return r;
}
function qe({ onBits: e = () => {}, toggle: t = null, io: n = null }) {
	U = je({
		editable: !0,
		onChange: e
	});
	let r = [...Array(32).fill(24), ...Me];
	return _table({
		class: "sliderule",
		id: "decoder",
		style: z({ widths: r })
	}, [
		R({ widths: r }),
		_thead({}, [
			L({
				name: "Decoder",
				colspan: H,
				button: t,
				side: "left"
			}),
			_tr({ class: "label-row" }, [_th({ colspan: "32" }, "Bitwise Breakdown — inst[31:0]"), _th({ colspan: String(V.length) }, "Meaning")]),
			_tr({ class: "number-row" }, [...I(), ...V.map((e) => _th({ class: "text-head" }, e))]),
			_tr({ class: "input-row" }, [...U.cells, _td({
				class: "io-cell",
				colspan: String(V.length)
			}, [n])])
		]),
		_tbody({}, "")
	]);
}
// src/encoder.mjs
var W = [
	"Ext",
	"Type",
	"Description",
	"Explanation",
	"Mnemonic",
	"Operands"
], Je = [
	70,
	110,
	220,
	240,
	90,
	140
], G = null;
function Ye({ entry: e = {} }) {
	return e.expands && !e.pseudo ? [
		e.expands,
		_br(),
		e.pseudocode
	] : e.pseudocode || "";
}
function Xe({ entry: e = {}, rowspan: t = 1, explanation: n = "", onPick: r = () => {} }) {
	let i = _td({
		class: "text mnemonic" + (e.pseudo ? " pseudo" : ""),
		rowspan: String(t),
		title: "Build this instruction"
	}, e.name);
	return i.addEventListener("click", () => r({ entry: e })), [
		A({
			rowspan: t,
			classes: "text ext" + (e.pseudo ? " pseudo" : ""),
			text: e.extension
		}),
		F({
			format: e.format,
			rowspan: t
		}),
		A({
			rowspan: t,
			classes: "text description",
			text: e.description
		}),
		_td({ class: "text explanation" }, n),
		i,
		A({
			rowspan: t,
			classes: "text operands",
			text: e.asm || "—"
		})
	];
}
function Ze({ entry: e = {}, onPick: t = () => {} }) {
	if (e.pseudo && e.expansions.length > 1) return e.expansions.map(({ base: n, segments: r, text: i }, a) => {
		let o = a === 0 ? Xe({
			entry: e,
			rowspan: e.expansions.length,
			explanation: i,
			onPick: t
		}) : [_td({ class: "text explanation" }, i)];
		return _tr({ class: `instruction-row fmt-${n.format}` }, [...o, ...N({
			segments: r,
			width: n.width
		})]);
	});
	let { base: n, segments: r, text: i } = e.pseudo ? e.expansions[0] : {
		base: e,
		segments: e.segments,
		text: Ye({ entry: e })
	}, a = r.some((e) => e.kind === "imm"), o = [_tr({ class: `instruction-row fmt-${n.format}` }, [...Xe({
		entry: e,
		rowspan: a ? 2 : 1,
		explanation: i,
		onPick: t
	}), ...N({
		segments: r,
		width: n.width
	})])];
	return a && o.push(_tr({ class: `immediate-row fmt-${n.format}` }, [_td({ class: "text imm-name" }, n.immName), ...P({ inst: n })])), o;
}
function Qe({ encoded: e = {} }) {
	return e.words.map(({ inst: e, word: t, assembly: n }) => _tr({ class: `encoded-row fmt-${e.format}` }, [
		A({
			width: 4,
			classes: "text encoded-asm",
			text: n
		}),
		A({
			width: 2,
			classes: "text encoded-hex",
			text: B({
				word: t,
				width: e.width
			})
		}),
		...Ae({
			inst: e,
			word: t
		})
	]));
}
function $e({ entry: e = null, encoded: t = null, onPick: n = () => {} }) {
	let r = [];
	for (let i of e ? [e] : T) r.push(...Ze({
		entry: i,
		onPick: n
	})), t && t.entry === i && r.push(...Qe({ encoded: t }));
	return r;
}
function et({ entry: e = null, encoded: t = null }) {
	if (t) {
		let { word: e, inst: n } = t.words[0];
		G.write({
			value: e,
			width: n.width,
			off: n.width === 16
		});
		return;
	}
	if (!e) {
		G.write({ mask: 0 });
		return;
	}
	let { base: n, segments: r } = e.pseudo ? e.expansions[0] : {
		base: e,
		segments: e.segments
	}, i = 0, a = 0;
	for (let e of r.filter((e) => e.kind === "lit")) i |= 2 ** e.width - 1 << e.lo, a |= parseInt(e.bits, 2) << e.lo;
	G.write({
		value: a,
		mask: i >>> 0,
		width: n.width,
		off: n.width === 16
	});
}
function tt({ toggle: e = null, io: t = null }) {
	G = je({ editable: !1 });
	let n = W.length + 32, r = [...Je, ...Array(32).fill(24)];
	return _table({
		class: "sliderule",
		id: "encoder",
		style: z({ widths: r })
	}, [
		R({ widths: r }),
		_thead({}, [
			L({
				name: "Encoder",
				colspan: n,
				button: e,
				side: "right"
			}),
			_tr({ class: "label-row" }, [
				_th({ colspan: "4" }, "Meaning"),
				_th({ colspan: "2" }, "Assembly"),
				_th({ colspan: "32" }, "Bitwise Encoding — inst[31:0]")
			]),
			_tr({ class: "number-row" }, [...W.map((e) => _th({ class: "text-head" }, e)), ...I()]),
			_tr({ class: "input-row" }, [_td({
				class: "io-cell",
				colspan: String(W.length)
			}, [t]), ...G.cells])
		]),
		_tbody({}, "")
	]);
}
// src/builders.mjs
var nt = [
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
];
function K({ value: e = "", label: t = "", selected: n = !1 }) {
	let r = _option({ value: e }, t);
	return n && (r.selected = !0), r;
}
function rt({ token: e = "rd", info: t = {} }) {
	let n = [K({
		value: "",
		label: e
	})];
	for (let e = 0; e < 32; e++) {
		if (t.compressed && (e < 8 || e > 15) || t.exclude.includes(e)) continue;
		let r = t.fp ? `f${e}` : `x${e}`;
		n.push(K({
			value: r,
			label: `${r} · ${(t.fp ? p : f)[e]}`
		}));
	}
	return _select({
		class: "operand",
		title: e
	}, n);
}
function it({ token: e = "imm", info: t = {} }) {
	let { min: n, max: r, step: i, nonZero: a } = t.range, o = `${n} … ${r}` + (i > 1 ? `, multiple of ${i}` : "") + (a ? ", ≠ 0" : "");
	return _input({
		class: "operand imm-input",
		type: "text",
		inputmode: "numeric",
		placeholder: e,
		title: `${e}: ${o}`,
		size: "10"
	});
}
function at({ token: e = "rd", entry: t = {} }) {
	let n = E({
		entry: t,
		token: e
	});
	if (n.kind === "sp") return _span({ class: "operand-text" }, "sp");
	if (n.kind === "reg") return rt({
		token: e,
		info: n
	});
	if (n.kind === "imm") return it({
		token: e,
		info: n
	});
	if (n.kind === "csr") return _select({
		class: "operand",
		title: "csr"
	}, [K({
		value: "",
		label: "csr"
	}), ...Object.keys(h).map((e) => K({
		value: e,
		label: `${e} · 0x${h[e].toString(16).padStart(3, "0")}`
	}))]);
	if (n.kind === "rm") return _select({
		class: "operand",
		title: "rounding mode"
	}, m.filter((e) => e).map((e) => K({
		value: e,
		label: e === "dyn" ? "dyn (default)" : e,
		selected: e === "dyn"
	})));
	let r = [];
	for (let e = 15; e >= 1; e--) r.push(K({
		value: x({ value: e }),
		label: x({ value: e })
	}));
	return _select({
		class: "operand",
		title: e
	}, [K({
		value: "",
		label: e
	}), ...r]);
}
function ot() {
	let e = {};
	for (let t of T) (e[t.extension] = e[t.extension] || []).push(t);
	let t = Object.keys(e).sort((e, t) => nt.indexOf(e) - nt.indexOf(t));
	return _select({
		id: "mnemonic",
		class: "mnemonic-select"
	}, [K({
		value: "",
		label: "— instruction —"
	}), ...t.map((t) => _optgroup({ label: t === "PSEUDO" ? "Pseudo-instructions" : `'${t}'` }, e[t].map((e) => K({
		value: e.id,
		label: `${e.name}  ${e.asm || ""}`
	}))))]);
}
function st({ container: e = null }) {
	let t = "";
	for (let n of e.children) if (n.classList.contains("operand")) {
		if (n.value.trim() === "") return null;
		t += n.value.trim();
	} else t += n.textContent;
	return t;
}
function ct({ onChange: e = () => {} }) {
	let t = ot(), n = _select({
		class: "ordering",
		title: "memory ordering"
	}, [
		"",
		"aq",
		"rl",
		"aqrl"
	].map((e) => K({
		value: e,
		label: e ? `.${e}` : "(no ordering)"
	}))), r = _span({ class: "operands" }, ""), i = () => {
		let i = T.find((e) => e.id === t.value) || null;
		e({
			entry: i,
			operands: i ? st({ container: r }) : null,
			ordering: n.value
		});
	};
	t.addEventListener("change", () => {
		let e = T.find((e) => e.id === t.value), a = [];
		(e ? (e.asm || "").split(",").map((e) => e.trim()).filter((e) => e !== "") : []).forEach((t, n) => {
			n > 0 && a.push(_span({ class: "operand-text" }, ", "));
			for (let n of Ce({ op: t })) a.push(n.token ? at({
				token: n.token,
				entry: e
			}) : _span({ class: "operand-text" }, n.text));
		}), r.replaceChildren(...a), n.value = "", n.hidden = !(e && !e.pseudo && e.segments.some((e) => e.key === "aq")), i();
	}), r.addEventListener("input", i), r.addEventListener("change", i), n.addEventListener("change", i), n.hidden = !0;
	let a = _div({
		id: "builder",
		class: "builder"
	}, [
		t,
		n,
		r
	]);
	return a.select = ({ entry: e = null }) => {
		t.value = e ? e.id : "", t.dispatchEvent(new Event("change"));
	}, a;
}
// src/sliderule.mjs
var lt = 220, ut = 560, q = {
	mode: "decoder",
	entry: null,
	encoded: null,
	switching: !1
}, J = null;
function Y({ target: e = null, content: t = "", error: n = !1 }) {
	e.className = "io-result" + (n ? " error" : ""), e.replaceChildren(...Array.isArray(t) ? t : [t]);
}
function dt({ assembly: e = "", word: t = 0, width: n = 32 }) {
	return _div({ class: "io-line" }, [
		_b({ class: "io-asm" }, e),
		_span({ class: "io-hex" }, B({
			word: t,
			width: n
		})),
		_span({ class: "io-bin" }, `0b${(t >>> 0).toString(2).padStart(n, "0")}`)
	]);
}
function ft() {
	let e = Ue(), t = Ke({ constraints: e }), n = t === null ? null : de({ word: t }), r = J.decoderResult;
	if (Ge({ dim: e[31] !== "-" && e[30] !== "-" && (e[31] !== "1" || e[30] !== "1") }), t === null) Y({
		target: r,
		content: "Set bits from inst[0] upwards (click 1 / 0, type, or paste a hex word): the table narrows down as you go."
	});
	else if (n) {
		let e = [dt({
			assembly: n.assembly,
			word: n.word,
			width: n.inst.width
		})];
		n.note && e.push(_div({ class: "io-note" }, n.note)), Y({
			target: r,
			content: e
		});
	} else {
		let e = (t & 3) == 3 ? ve({ word: t }) : null;
		Y({
			target: r,
			error: !0,
			content: `${B({
				word: t,
				width: (t & 3) == 3 ? 32 : 16
			})} is not a valid RV32GC instruction` + (e ? ` (${e.name} opcode: ${e.note})` : "")
		});
	}
	J.decoder.querySelector("tbody").replaceChildren(...He({
		constraints: e,
		decoded: n,
		onPattern: ({ inst: e }) => {
			We({
				value: e.match,
				mask: e.mask,
				width: e.width
			}), X();
		}
	}));
}
function pt() {
	let e = J.encoderResult, t = q.encoded && !q.encoded.error ? q.encoded : null;
	q.encoded && q.encoded.error ? Y({
		target: e,
		content: q.encoded.error,
		error: !0
	}) : t ? Y({
		target: e,
		content: t.words.map(({ assembly: e, word: t, inst: n }) => dt({
			assembly: e,
			word: t,
			width: n.width
		}))
	}) : q.entry ? Y({
		target: e,
		content: `Choose the operands of ${q.entry.name}.`
	}) : Y({
		target: e,
		content: "Choose an instruction (or click a mnemonic below) to build it."
	}), et({
		entry: q.entry,
		encoded: t
	}), J.encoder.querySelector("tbody").replaceChildren(...$e({
		entry: q.entry,
		encoded: t,
		onPick: ({ entry: e }) => J.builder.select({ entry: e })
	}));
}
function X() {
	q.mode === "encoder" ? pt() : ft();
}
function mt({ entry: e = null, operands: t = null, ordering: n = "" }) {
	if (q.entry = e, q.encoded = null, e && t !== null) try {
		q.encoded = De({
			entry: e,
			operands: t,
			ordering: n
		});
	} catch (e) {
		q.encoded = { error: e.message };
	}
	X();
}
function ht({ table: e = null }) {
	let t = [".number-row", ".input-row"].map((t) => _tr({}, [...e.querySelectorAll(`${t} > .spine`)].map((e) => e.cloneNode(!0)))), n = Array(32).fill(24), r = _table({
		class: "sliderule ghost",
		"aria-hidden": "true",
		style: z({ widths: n })
	}, [R({ widths: n }), _thead({}, t)]);
	J.stage.append(r);
	let i = e.querySelector(".bit-number").getBoundingClientRect(), a = r.querySelector(".bit-number").getBoundingClientRect();
	return r.style.left = `${i.left - a.left}px`, r.style.top = `${i.top - a.top}px`, r;
}
function Z({ element: e = null, keyframes: t = [], duration: n = lt, easing: r = "ease-in-out" }) {
	return e.animate(t, {
		duration: n,
		easing: r,
		fill: "forwards"
	}).finished;
}
function gt({ table: e = null }) {
	return e.querySelector(".bit-number").offsetLeft;
}
function _t({ table: e = null }) {
	let t = e.querySelectorAll(".bit-number"), n = t[0].getBoundingClientRect().left + window.scrollX - 16, r = t[t.length - 1].getBoundingClientRect().right + window.scrollX + 16;
	return r > window.scrollX + window.innerWidth ? Math.min(n, r - window.innerWidth) : n < window.scrollX ? n : window.scrollX;
}
function Q({ mode: e = "decoder" }) {
	J.decoder.parentElement.classList.toggle("active", e === "decoder"), J.encoder.parentElement.classList.toggle("active", e === "encoder");
}
async function vt({ mode: e = "decoder" }) {
	if (e === q.mode || q.switching) return;
	q.switching = !0;
	let t = q.mode === "encoder" ? J.encoder : J.decoder, n = e === "encoder" ? J.encoder : J.decoder;
	if (q.mode = e, window.matchMedia("(prefers-reduced-motion: reduce)").matches) Q({ mode: e });
	else {
		let r = ht({ table: t });
		await Z({
			element: t,
			keyframes: [{ opacity: 1 }, { opacity: 0 }]
		});
		let i = gt({ table: n }) - gt({ table: t });
		window.scrollTo({
			left: _t({ table: n }),
			behavior: "smooth"
		}), await Z({
			element: r,
			keyframes: [{ transform: "translateX(0)" }, { transform: `translateX(${i}px)` }],
			duration: ut,
			easing: "cubic-bezier(0.65, 0, 0.35, 1)"
		}), Q({ mode: e }), t.getAnimations().forEach((e) => e.cancel()), await Promise.all([Z({
			element: n,
			keyframes: [{ opacity: 0 }, { opacity: 1 }]
		}), Z({
			element: r,
			keyframes: [{ opacity: 1 }, { opacity: 0 }]
		})]), n.getAnimations().forEach((e) => e.cancel()), r.remove();
	}
	try {
		history.replaceState(null, "", `#${e}`);
	} catch {}
	window.scrollTo({ left: _t({ table: n }) }), q.switching = !1;
}
function $({ mode: e = "encoder", label: t = "" }) {
	let n = _button({
		class: "mode-button",
		type: "button",
		title: `Switch to the ${t}`
	}, e === "encoder" ? `◀ ${t}` : `${t} ▶`);
	return n.addEventListener("click", () => vt({ mode: e })), n;
}
function yt({ onClick: e = () => {} }) {
	let t = _button({
		class: "clear-button",
		type: "button"
	}, "Clear");
	return t.addEventListener("click", e), t;
}
function bt() {
	let e = ct({ onChange: mt }), t = _div({ class: "io-result" }, ""), n = _div({ class: "io-result" }, ""), r = qe({
		onBits: X,
		toggle: $({
			mode: "encoder",
			label: "a2b · Encoder"
		}),
		io: _div({ class: "io" }, [t, yt({ onClick: () => {
			We({
				value: 0,
				mask: 0
			}), X();
		} })])
	}), i = tt({
		toggle: $({
			mode: "decoder",
			label: "b2a · Decoder"
		}),
		io: _div({ class: "io" }, [_div({ class: "io-build" }, [e, n]), yt({ onClick: () => e.select({ entry: null }) })])
	}), a = _div({
		id: "sliderule",
		class: "stage"
	}, [_div({ class: "view" }, [r]), _div({ class: "view" }, [i])]);
	return J = {
		builder: e,
		decoder: r,
		encoder: i,
		decoderResult: t,
		encoderResult: n,
		stage: a
	}, q.mode = location.hash === "#encoder" ? "encoder" : "decoder", Q({ mode: q.mode }), ft(), pt(), a;
}
// src/main.mjs
var xt = {
	loadInto: (e) => {
		document.getElementById(e).append(bt());
	},
	refresh: X
};
window.sliderules = xt;
export { xt as default };
