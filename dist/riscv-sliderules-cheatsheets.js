function Encoder() {
  return _div(
    {
      class: "input-wrapper",
      id: "encoder"
    },
    [
      _input({
        id: "assemblyString",
        type: "text",
        placeholder: "Assembly string"
      }),
      _br(),
      _button({ onclick: "sliderules.updateEncode()" }, "Encode"),
      _br()
    ]
  );
}
function Decoder() {
  return _div(
    {
      id: "decoder"
    },
    [
      _div(
        { class: "input-wrapper" },
        [
          _input({
            id: "encodedvalue",
            type: "text",
            placeholder: "Enter 32 bit binary value to decode, like: 00000000001000001000000000110011"
          })
        ]
      ),
      _br(),
      _button({ onclick: "sliderules.updateDecode()" }, "Decode"),
      _br()
    ]
  );
}
function Pruner() {
  var n = 32, m = [], s = ["", "0", "1"];
  function d(z) {
    var B = z.target, g = s.indexOf(B.textContent), o = (g + 1) % s.length;
    B.textContent = s[o], sliderules.updatePruned();
  }
  for (var k = 0; k < n; k++) {
    var j = _button({ class: "bit-button", textContent: "" });
    j.addEventListener("click", d), m.push(j);
  }
  return _div(
    {
      id: "pruner"
    },
    m
  );
}
const immediates = {
  // R: Does not have any immediate values,
  I: {
    [2047 << 20]: 2047,
    [1 << 31]: -2048
  },
  S: {
    3968: 31,
    [63 << 25]: 2016,
    [1 << 31]: -2048
  },
  B: {
    // Has value zero in the first position
    3840: 30,
    128: 2048,
    [63 << 25]: 2016,
    [1 << 31]: -4096
  },
  U: {
    // Has value zero from 0 to 11 positions
    [-4096]: -4096
  },
  J: {
    // Has value zero in the first position
    1044480: 1044480,
    [1 << 20]: 2048,
    [1023 << 21]: 2046,
    [1 << 31]: -1048576
  }
}, instructions = {
  // RV32I Base Instruction Set
  add: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 + rs2",
    description: "Addition",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sub: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 - rs2",
    description: "Subtraction",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  xor: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 ^ rs2",
    description: "Bitwise XOR",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  slt: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = { 31'b0, ( rs1[31] == rs2[31] ) ? (rs1<rs2) : (rs1[31])}",
    description: "Set Less Than",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  or: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 | rs2",
    description: "Bitwise OR",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sll: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 <<(zero extends) rs2",
    description: "Shift Left Logical",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  srl: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 (zero extends)>> rs2",
    description: "Shift Right Logical",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sra: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 (msb extends)>> rs2",
    description: "Shift Right Arithmetic",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sltu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = { 31'b0, rs1 < rs2 }",
    description: "Set Less Than Unsigned",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  and: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 & rs2",
    description: "Bitwise AND",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  addi: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = rs1 + imm",
    description: "Add Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  slti: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = (rs1 < imm) ? 1 : 0",
    description: "Set Less Than Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  sltiu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = (rs1 < imm) ? 1 : 0",
    description: "Set Less Than Immediate Unsigned",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  xori: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = rs1 ^ imm",
    description: "Bitwise XOR Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  ori: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = rs1 | imm",
    description: "Bitwise OR Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  andi: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = rs1 & imm",
    description: "Bitwise AND Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lb: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Byte",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lh: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Halfword",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Word",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lbu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Byte Unsigned",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lhu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Halfword Unsigned",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  jalr: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = PC + 4; PC = (rs1 + imm) & ~1",
    description: "Jump and Link Register",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 103, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  lui: {
    ISA: "RV",
    assembly: ["rd", "imm"],
    pseudocode: "rd = imm << 12",
    description: "Load Upper Immediate",
    type: "U",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 55, mask: 127 },
      rd: { mask: 3968 }
    }
  },
  auipc: {
    ISA: "RV",
    assembly: ["rd", "imm"],
    pseudocode: "rd = PC + imm",
    description: "Add Upper Immediate to PC",
    type: "U",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 23, mask: 127 },
      rd: { mask: 3968 }
    }
  },
  jal: {
    ISA: "RV",
    assembly: ["rd", "imm"],
    pseudocode: "rd = PC + 4; PC = PC + imm",
    description: "Jump and Link",
    type: "J",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 111, mask: 127 },
      rd: { mask: 3968 }
    }
  },
  beq: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 == rs2) PC = PC + imm",
    description: "Branch Equal",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  bne: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 != rs2) PC = PC + imm",
    description: "Branch Not Equal",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  blt: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 < rs2) PC = PC + imm",
    description: "Branch Less Than",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  bge: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 >= rs2) PC = PC + imm",
    description: "Branch Greater Than or Equal",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  bltu: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 < rs2) PC = PC + imm",
    description: "Branch Less Than Unsigned",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  bgeu: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "if(rs1 >= rs2) PC = PC + imm",
    description: "Branch Greater Than or Equal Unsigned",
    type: "B",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 99, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  sb: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "Memory[rs1 + imm] = rs2[0:7]",
    description: "Store Byte",
    type: "S",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 35, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  sh: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "Memory[rs1 + imm] = rs2[0:15]",
    description: "Store Halfword",
    type: "S",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 35, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  sw: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "Memory[rs1 + imm] = rs2",
    description: "Store Word",
    type: "S",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 35, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  slli: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 << shamt",
    description: "Shift Left Logical Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  srli: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >>> shamt",
    description: "Shift Right Logical Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  srai: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >> shamt",
    description: "Shift Right Arithmetic Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fence: {
    ISA: "RV",
    assembly: ["pred", "succ"],
    pseudocode: "Fence(pred, succ)",
    description: "Synchronize",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 15, mask: 127 },
      rd: { mask: 3968 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      succ: { mask: 15 << 20 },
      pred: { mask: 15 << 24 },
      fm: { mask: 15 << 28 }
    }
  },
  ecall: {
    ISA: "RV",
    assembly: ["ecall"],
    pseudocode: "ECALL",
    description: "Environment Call",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rd: { value: 0, mask: 3968 },
      rs1: { value: 0, mask: 31 << 15 },
      funct12: { value: 0, mask: -1048576 }
    }
  },
  ebreak: {
    ISA: "RV",
    assembly: ["ebreak"],
    pseudocode: "EBREAK",
    description: "Environment Breakpoint",
    type: "I",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rd: { value: 0, mask: 3968 },
      rs1: { value: 0, mask: 31 << 15 },
      funct12: { value: 1, mask: -1048576 }
    }
  },
  // RV64I Base Instruction Set (in addition to RV32I)
  lwu: {
    ISA: "RV",
    assembly: ["rd", "imm(rs1)"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Word Unsigned",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  ld: {
    ISA: "RV",
    assembly: ["rd", "imm(rs1)"],
    pseudocode: "rd = M[rs1 + imm]",
    description: "Load Doubleword",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 3, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  sd: {
    ISA: "RV",
    assembly: ["rs2", "imm(rs1)"],
    pseudocode: "M[rs1 + imm] = rs2",
    description: "Store Doubleword",
    type: "S",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 35, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  slli64: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 << shamt",
    description: "Shift Left Logical Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      imm: { value: 0, mask: 127 << 26 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 63 << 20 },
      rd: { mask: 3968 }
    }
  },
  srli64: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >> shamt (logical)",
    description: "Shift Right Logical Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      imm: { value: 0, mask: 127 << 26 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 63 << 20 },
      rd: { mask: 3968 }
    }
  },
  srai64: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >> shamt (arithmetic)",
    description: "Shift Right Arithmetic Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 19, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      imm: { value: 16, mask: 127 << 26 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 63 << 20 },
      rd: { mask: 3968 }
    }
  },
  addiw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = rs1 + imm (signed immediate)",
    description: "Add Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 27, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  slliw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 << shamt (64-bit)",
    description: "Shift Left Logical Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 27, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  srliw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >> shamt (logical, 64-bit)",
    description: "Shift Right Logical Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 27, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sraiw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "shamt"],
    pseudocode: "rd = rs1 >> shamt (arithmetic, 64-bit)",
    description: "Shift Right Arithmetic Immediate (64-bit)",
    type: "I",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 27, mask: 127 },
      funct3: { value: 5, mask: 20480 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      shamt: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  addw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 + rs2 (64-bit)",
    description: "Add (64-bit)",
    type: "R",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  subw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 - rs2 (64-bit)",
    description: "Subtract (64-bit)",
    type: "R",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sllw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 << rs2 (64-bit)",
    description: "Shift Left Logical (64-bit)",
    type: "R",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  srlw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 >> rs2 (logical, 64-bit)",
    description: "Shift Right Logical (64-bit)",
    type: "R",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 0, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  sraw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 >> rs2 (arithmetic, 64-bit)",
    description: "Shift Right Arithmetic (64-bit)",
    type: "R",
    arch_width: [64],
    extension: "I",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 5, mask: 20480 },
      funct7: { value: 32, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  // RV32/RV64 Zifencei Standard Extension
  fence_i: {
    ISA: "RV",
    assembly: ["imm", "rs1"],
    pseudocode: "fence",
    description: "Fence for instruction stream",
    type: "I",
    arch_width: [32, 64],
    extension: "Zifencei",
    fields: {
      opcode: { value: 15, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  // RV32/RV64 Zicsr Standard Extension
  csrrw: {
    ISA: "RV",
    assembly: ["csr", "rd", "rs1"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = rs1",
    description: "Atomic Read and Write of CSR",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      csr: { mask: -1048576 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  csrrs: {
    ISA: "RV",
    assembly: ["csr", "rd", "rs1"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = CSRs[csr] | rs1",
    description: "Atomic Read and Set of CSR Bits",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      csr: { mask: -1048576 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  csrrc: {
    ISA: "RV",
    assembly: ["csr", "rd", "rs1"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = CSRs[csr] & (~rs1)",
    description: "Atomic Read and Clear of CSR Bits",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      csr: { mask: -1048576 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  csrrwi: {
    ISA: "RV",
    assembly: ["uimm", "rd", "csr"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = uimm",
    description: "Atomic Read and Write of CSR with Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      csr: { mask: -1048576 },
      uimm: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  csrrsi: {
    ISA: "RV",
    assembly: ["uimm", "rd", "csr"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = CSRs[csr] | uimm",
    description: "Atomic Read and Set of CSR Bits with Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      csr: { mask: -1048576 },
      uimm: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  csrrci: {
    ISA: "RV",
    assembly: ["uimm", "rd", "csr"],
    pseudocode: "rd = CSRs[csr]; CSRs[csr] = CSRs[csr] & (~uimm)",
    description: "Atomic Read and Clear of CSR Bits with Immediate",
    type: "I",
    arch_width: [32, 64],
    extension: "Zicsr",
    fields: {
      opcode: { value: 115, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      csr: { mask: -1048576 },
      uimm: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  //RV32M Standard Extension
  mul: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 * rs2",
    description: "Multiply",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  mulh: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (rs1 * rs2) >> XLEN",
    description: "Multiply High",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 1, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  mulhsu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (rs1 * rs2) >> XLEN",
    description: "Multiply High Signed Unsigned",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  mulhu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (rs1 * rs2) >> XLEN",
    description: "Multiply High Unsigned",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  div: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 / rs2",
    description: "Divide",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  divu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 / rs2",
    description: "Divide Unsigned",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  rem: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 % rs2",
    description: "Remainder",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  remu: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 % rs2",
    description: "Remainder Unsigned",
    type: "R",
    arch_width: [32, 64],
    extension: "M",
    fields: {
      opcode: { value: 51, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  // RV64M Standard Extension (in addition to RV32M)
  mulw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 * rs2 (signed 64x64-bit multiplication, result stored in 64-bit rd)",
    description: "Multiply Word",
    type: "R",
    arch_width: [64],
    extension: "M",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 0, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  divw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 / rs2 (signed 64/64-bit division, quotient stored in 64-bit rd)",
    description: "Divide Word",
    type: "R",
    arch_width: [64],
    extension: "M",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 4, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  divuw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 / rs2 (unsigned 64/64-bit division, quotient stored in 64-bit rd)",
    description: "Divide Unsigned Word",
    type: "R",
    arch_width: [64],
    extension: "M",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 5, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  remw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 % rs2 (signed 64/64-bit remainder, result stored in 64-bit rd)",
    description: "Remainder Word",
    type: "R",
    arch_width: [64],
    extension: "M",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 6, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  remuw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = rs1 % rs2 (unsigned 64/64-bit remainder, result stored in 64-bit rd)",
    description: "Remainder Unsigned Word",
    type: "R",
    arch_width: [64],
    extension: "M",
    fields: {
      opcode: { value: 59, mask: 127 },
      funct3: { value: 7, mask: 28672 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  // RV32A Standard Extension
  lr_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "aq", "rl"],
    pseudocode: "rd = M[rs1]; if aq then aq = 0; if rl then rl = 0;",
    description: "Load Reserved (Word)",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 2, mask: 31 << 27 },
      rs2: { value: 0, mask: 31 << 20 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  sc_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "aq", "rl", "rs2"],
    pseudocode: "rd = M[rs1]; if aq then aq = 0; if rl then rl = 0; if successful SC, rd = 0; else rd = 1;",
    description: "Store Conditional (Word)",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 3, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoswap_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = M[rs1]; if aq then aq = 0; if rl then rl = 0; M[rs1] = rs2;",
    description: "Atomic Swap (Word)",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 1, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoadd_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd + rs2;",
    description: "Atomic Add Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 0, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoxor_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd ^ rs2;",
    description: "Atomic XOR Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 4, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoand_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd & rs2;",
    description: "Atomic AND Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 12, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoor_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd | rs2;",
    description: "Atomic OR Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 8, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomin_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = min(rd, rs2);",
    description: "Atomic Minimum Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 16, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomax_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = max(rd, rs2);",
    description: "Atomic Maximum Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 20, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amominu_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = minu(rd, rs2);",
    description: "Atomic Minimum Unsigned Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 24, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomaxu_w: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = maxu(rd, rs2);",
    description: "Atomic Maximum Unsigned Word",
    type: "R",
    arch_width: [32, 64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      funct5: { value: 28, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  // RV64A Standard Extension (in addition to RV32A)
  lr_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1];",
    description: "Load Reserved Doubleword",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 2, mask: 31 << 27 },
      rs2: { value: 0, mask: 31 << 20 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  sc_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "if (Memory[rs1] == rd) { Memory[rs1] = rs2; rd = 1; } else rd = 0;",
    description: "Store Conditional Doubleword",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 3, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoswap_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rs2;",
    description: "Atomic Swap Doubleword",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 1, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoadd_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd + rs2;",
    description: "Atomic Add Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 1, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoxor_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd ^ rs2;",
    description: "Atomic XOR Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 4, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoand_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd & rs2;",
    description: "Atomic AND Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 12, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amoor_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = rd | rs2;",
    description: "Atomic OR Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 8, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomin_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = min(rd, rs2);",
    description: "Atomic Minimum Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 16, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomax_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = max(rd, rs2);",
    description: "Atomic Maximum Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 20, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amominu_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = min(rd, rs2);",
    description: "Atomic Minimum Unsigned Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 24, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  amomaxu_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = Memory[rs1]; Memory[rs1] = max(rd, rs2);",
    description: "Atomic Maximum Unsigned Double",
    type: "R",
    arch_width: [64],
    extension: "A",
    fields: {
      opcode: { value: 47, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      funct5: { value: 28, mask: 31 << 27 },
      aq: { mask: 1 << 26 },
      rl: { mask: 1 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  // RV32F Standard Extension
  flw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "f(rd) = Memory[rs1 + imm];",
    description: "Load Floating-Point Word",
    type: "I",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 7, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  fsw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "imm"],
    pseudocode: "Memory[rs1 + imm] = f(rs2);",
    description: "Store Floating-Point Word",
    type: "S",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 39, mask: 127 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  fmadd_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "f(rd) = f(rs1) * f(rs2) + f(rs3);",
    description: "Floating-Point Multiply-Add Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 67, mask: 127 },
      funct2: { value: 0, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmsub_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "f(rd) = f(rs1) * f(rs2) - f(rs3);",
    description: "Floating-Point Multiply-Subtract Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 71, mask: 127 },
      funct2: { value: 0, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fnmsub_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "f(rd) = -f(rs1) * f(rs2) - f(rs3);",
    description: "Floating-Point Negate-Multiply-Subtract Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 75, mask: 127 },
      funct2: { value: 0, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fnmadd_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "f(rd) = -f(rs1) * f(rs2) + f(rs3);",
    description: "Floating-Point Negate-Multiply-Add Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 79, mask: 127 },
      funct2: { value: 0, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fadd_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) + f(rs2);",
    description: "Floating-Point Add Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 0, mask: 127 << 25 },
      rm: { mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fsub_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) - f(rs2);",
    description: "Floating-Point Subtract Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 4, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmul_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) * f(rs2);",
    description: "Floating-Point Multiply Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 8, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fdiv_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) / f(rs2);",
    description: "Floating-Point Divide Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 12, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fsqrt_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "f(rd) = sqrt(f(rs1));",
    description: "Floating-Point Square Root Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 44, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fsgnj_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) with sign of f(rs2);",
    description: "Floating-Point Sign Inject Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 16, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fsgnjn_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) with sign of -f(rs2);",
    description: "Floating-Point Sign Inject Negate Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 16, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fsgnjx_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = f(rs1) with sign of f(rs2), and value of abs(f(rs1));",
    description: "Floating-Point Sign Inject with Exchange Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 16, mask: 127 << 25 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fmin_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = min(f(rs1), f(rs2));",
    description: "Floating-Point Minimum Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 20, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fmax_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "f(rd) = max(f(rs1), f(rs2));",
    description: "Floating-Point Maximum Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 20, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fcvt_w_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = (int32_t)f(rs1);",
    description: "Floating-Point Convert to Signed Word Single Precision",
    type: "R4",
    arch_width: [32],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 96, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_wu_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = (uint32_t)f(rs1);",
    description: "Floating-Point Convert to Unsigned Word Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 96, mask: 127 << 25 },
      rs2: { value: 1, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmv_x_w: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = rs1;",
    description: "Floating-Point Move to Integer Register Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 112, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  feq_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (f(rs1) == f(rs2)) ? 1 : 0;",
    description: "Floating-Point Equal Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 80, mask: 127 << 25 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  flt_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (f(rs1) < f(rs2)) ? 1 : 0;",
    description: "Floating-Point Less Than Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 80, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fle_s: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = (f(rs1) <= f(rs2)) ? 1 : 0;",
    description: "Floating-Point Less Than or Equal Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 80, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fclass_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = fclass_s(rs1);",
    description: "Floating-Point Classify Single Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 112, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  fcvt_s_w: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f32_to_i32(rs1, RM, true);",
    description: "Floating-Point Convert to Signed Word Single Precision",
    type: "R4",
    arch_width: [32],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 104, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_s_wu: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f32_to_ui32(rs1, RM, true);",
    description: "Floating-Point Convert to Unsigned Word Single Precision",
    type: "R4",
    arch_width: [32],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 104, mask: 127 << 25 },
      rs2: { value: 1, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmv_w_x: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = rs1;",
    description: "Floating-Point Move to Integer Register Single Precision",
    type: "R4",
    arch_width: [32],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 120, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  // RV64F Standard Extension (in addition to RV32F)
  fcvt_l_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_i64(rs1, RM, true);",
    description: "Floating-Point Convert to Signed Long Double Precision",
    type: "R4",
    arch_width: [64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 96, mask: 127 << 25 },
      rs2: { value: 2, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_lu_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_ui64(rs1, RM, true);",
    description: "Floating-Point Convert to Unsigned Long Double Precision",
    type: "R4",
    arch_width: [64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 96, mask: 127 << 25 },
      rs2: { value: 3, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_s_l: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_f32(rs1, RM);",
    description: "Floating-Point Convert to Single Precision from Long Double Precision",
    type: "R4",
    arch_width: [64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 104, mask: 127 << 25 },
      rs2: { value: 2, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_s_lu: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_f32(rs1, RM);",
    description: "Floating-Point Convert to Single Precision from Unsigned Long Double Precision",
    type: "R4",
    arch_width: [64],
    extension: "F",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 104, mask: 127 << 25 },
      rs2: { value: 3, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  // RV32D Standard Extension
  fld: {
    ISA: "RV",
    assembly: ["rd", "rs1", "imm"],
    pseudocode: "rd = Memory[rs1 + imm];",
    description: "Floating-Point Load Double Precision",
    type: "I",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 7, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  fsd: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "imm"],
    pseudocode: "Memory[rs1 + imm] = rs2;",
    description: "Floating-Point Store Double Precision",
    type: "S",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 39, mask: 127 },
      funct3: { value: 3, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 }
    }
  },
  fmadd_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "rd = f64_mulAdd(rs1, rs2, rs3, RM);",
    description: "Floating-Point Multiply-Add Double Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 67, mask: 127 },
      funct2: { value: 1, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmsub_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "rd = f64_mulAdd(rs1, rs2, rs3, RM);",
    description: "Floating-Point Multiply-Subtract Double Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 71, mask: 127 },
      funct2: { value: 1, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fnmsub_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "rd = -f64_mulAdd(rs1, rs2, rs3, RM);",
    description: "Floating-Point Negate-Multiply-Subtract Double Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 75, mask: 127 },
      funct2: { value: 1, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fnmadd_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2", "rs3"],
    pseudocode: "rd = -f64_mulAdd(rs1, rs2, rs3, RM);",
    description: "Floating-Point Negate-Multiply-Add Double Precision",
    type: "R4",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 79, mask: 127 },
      funct2: { value: 1, mask: 3 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rs3: { mask: 31 << 27 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fadd_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_add(rs1, rs2, RM);",
    description: "Floating-Point Add Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 1, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fsub_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_sub(rs1, rs2, RM);",
    description: "Floating-Point Subtract Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 5, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmul_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_mul(rs1, rs2, RM);",
    description: "Floating-Point Multiply Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 9, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fdiv_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_div(rs1, rs2, RM);",
    description: "Floating-Point Divide Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 13, mask: 127 << 25 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fsqrt_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = sqrt(f(rs1));",
    description: "Floating-Point Divide Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 45, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fsgnj_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_gnj(rs1, rs2, false);",
    description: "Floating-Point Sign Injection Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 17, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fsgnjn_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_gnj(rs1, rs2, true);",
    description: "Floating-Point Sign Injection (Negate) Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 17, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fsgnjx_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_gnjn(rs1, rs2);",
    description: "Floating-Point Sign Injection (XOR) Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 17, mask: 127 << 25 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fmin_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_min(rs1, rs2);",
    description: "Floating-Point Minimum Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 21, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fmax_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_max(rs1, rs2);",
    description: "Floating-Point Maximum Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 21, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fcvt_s_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f32_to_f64(rs1, RM);",
    description: "Floating-Point Convert to Single Precision from Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 32, mask: 127 << 25 },
      rs2: { value: 1, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_d_s: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_f32(rs1, RM);",
    description: "Floating-Point Convert to Double Precision from Single Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 33, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  feq_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_eq(rs1, rs2);",
    description: "Floating-Point Equality Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 81, mask: 127 << 25 },
      funct3: { value: 2, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  flt_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_lt(rs1, rs2);",
    description: "Floating-Point Less Than Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 81, mask: 127 << 25 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fle_d: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: "rd = f64_le(rs1, rs2);",
    description: "Floating-Point Less Than or Equal Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 81, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rs2: { mask: 31 << 20 },
      rd: { mask: 3968 }
    }
  },
  fclass_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_classify(rs1);",
    description: "Floating-Point Classify Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 113, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      funct3: { value: 1, mask: 28672 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  fcvt_w_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_i32(rs1, RM, true);",
    description: "Floating-Point Convert to Signed Word Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 97, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_wu_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_ui32(rs1, RM, true);",
    description: "Floating-Point Convert to Unsigned Word Double Precision",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 97, mask: 127 << 25 },
      rs2: { value: 1, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_d_w: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = i32_to_f64(rs1, RM);",
    description: "Floating-Point Convert to Double Precision from Signed Word",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 105, mask: 127 << 25 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_d_wu: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = ui32_to_f64(rs1, RM);",
    description: "Floating-Point Convert to Double Precision from Unsigned Word",
    type: "R",
    arch_width: [32, 64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 105, mask: 127 << 25 },
      rs2: { value: 1, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  // RV64D Standard Extension (in addition to RV32D)
  fcvt_l_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_i64(rs1, RM, true);",
    description: "Floating-Point Convert to Signed Long Double Precision",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 97, mask: 127 << 25 },
      rs2: { value: 2, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_lu_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = f64_to_ui64(rs1, RM, true);",
    description: "Floating-Point Convert to Unsigned Long Double Precision",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 97, mask: 127 << 25 },
      rs2: { value: 3, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmv_x_d: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = rs1;",
    description: "Floating-Point Move Double Precision",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 113, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  fcvt_d_l: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = i64_to_f64(rs1, RM);",
    description: "Floating-Point Convert to Double Precision from Signed Long",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 105, mask: 127 << 25 },
      rs2: { value: 2, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fcvt_d_lu: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = ui64_to_f64(rs1, RM);",
    description: "Floating-Point Convert to Double Precision from Unsigned Long",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 105, mask: 127 << 25 },
      rs2: { value: 3, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 },
      rm: { mask: 28672 }
    }
  },
  fmv_d_x: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "rd = rs1;",
    description: "Floating-Point Move Double Precision",
    type: "R",
    arch_width: [64],
    extension: "D",
    fields: {
      opcode: { value: 83, mask: 127 },
      funct7: { value: 121, mask: 127 << 25 },
      funct3: { value: 0, mask: 28672 },
      rs2: { value: 0, mask: 31 << 20 },
      rs1: { mask: 31 << 15 },
      rd: { mask: 3968 }
    }
  },
  //RV32C Standard Extension
  illegal_instruction: {
    ISA: "RV",
    assembly: ["imm"],
    pseudocode: "Raise an illegal instruction exception;",
    description: "Illegal Instruction",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 0, mask: !0 },
      imm_value: { value: 0, mask: 8160 },
      rd: { value: 0, mask: 28 }
    }
  },
  c_addi4spn: {
    ISA: "RV",
    assembly: ["rd", "nzuimm"],
    pseudocode: "addi rd' = sp + nzuimm = sp + 4*imm",
    description: "Compressed Add imm*4 to SP",
    type: "CIW",
    arch_width: ["RES"],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 0, mask: !0 },
      nzuimm: { mask: 8160 },
      rd: { mask: 28 }
    }
  },
  c_fld: {
    ISA: "RV",
    assembly: ["rd", "rs1", "uimm"],
    pseudocode: "rd = M64[rs1 + uimm];",
    description: "Compressed Load Double Floating-Point",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rd: { mask: 28 }
    }
  },
  c_lq: {
    ISA: "RV",
    assembly: ["rd", "rs1", "uimm"],
    pseudocode: "rd = M128[rs1 + uimm];",
    description: "Compressed Load Quadruple Floating-Point",
    type: "CIW",
    arch_width: [128],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      uimm1: { mask: 6144 },
      m1: { mask: 1024 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rd: { mask: 28 }
    }
  },
  c_lw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "uimm"],
    pseudocode: "rd' <- M[ rs1' + offset ];",
    description: "Compressed Load Word",
    type: "CL",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 2, mask: 57344 },
      uimm: { mask: 7168 },
      m2: { mask: 64 },
      m1: { mask: 32 },
      rs1: { mask: 896 },
      rd: { mask: 28 }
    }
  },
  c_flw: {
    ISA: "RV",
    assembly: ["rd", "rs1", "uimm"],
    pseudocode: "rd = M32[rs1 + uimm];",
    description: "Compressed Load Float",
    type: "CIW",
    arch_width: [32],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      uimm: { mask: 7168 },
      m2: { mask: 64 },
      m1: { mask: 32 },
      rs1: { mask: 896 },
      rd: { mask: 28 }
    }
  },
  c_ld: {
    ISA: "RV",
    assembly: ["rd", "rs1", "uimm"],
    pseudocode: "rd = M64[rs1 + uimm];",
    description: "Compressed Load Double",
    type: "CI",
    arch_width: [64, 128],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rd: { mask: 28 }
    }
  },
  c_fsd: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "uimm"],
    pseudocode: "M64[rs1 + uimm] = rs2;",
    description: "Compressed Store Double Floating-Point",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 5, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rs2: { mask: 28 }
    }
  },
  c_sq: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "uimm"],
    pseudocode: "M128[rs1 + uimm] = rs2;",
    description: "Compressed Store Quadruple Floating-Point",
    type: "CI",
    arch_width: [128],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 5, mask: 57344 },
      uimm1: { mask: 6144 },
      m1: { mask: 1024 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rs2: { mask: 28 }
    }
  },
  c_sw: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "uimm"],
    pseudocode: "M32[rs1 + uimm] = rs2;",
    description: "Compressed Store Word",
    type: "CS",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 6, mask: 57344 },
      uimm: { mask: 7168 },
      m2: { mask: 64 },
      m1: { mask: 32 },
      rs1: { mask: 896 },
      rs2: { mask: 28 }
    }
  },
  c_fsw: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "uimm"],
    pseudocode: "M32[rs1 + uimm] = rs2;",
    description: "Compressed Store Float",
    type: "CIW",
    arch_width: [32],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 7, mask: 57344 },
      uimm: { mask: 7168 },
      m2: { mask: 64 },
      m1: { mask: 32 },
      rs1: { mask: 896 },
      rs2: { mask: 28 }
    }
  },
  c_sd: {
    ISA: "RV",
    assembly: ["rs1", "rs2", "uimm"],
    pseudocode: "M64[rs1 + uimm] = rs2;",
    description: "Compressed Store Double",
    type: "CI",
    arch_width: [64, 128],
    extension: "C",
    fields: {
      quadrant: { value: 0, mask: 3 },
      funct3: { value: 7, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 96 },
      rs1: { mask: 896 },
      rs2: { mask: 28 }
    }
  },
  c_nop: {
    ISA: "RV",
    assembly: [],
    pseudocode: "",
    description: "Compressed No OPeration",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 0, mask: 57344 },
      op_val: { value: 0 }
    }
  },
  c_addi: {
    ISA: "RV",
    assembly: ["rd", "nzimm"],
    pseudocode: "rd = rd + sext(nzimm);",
    description: "Compressed Add Immediate",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 0, mask: 57344 },
      m1: { mask: 4096 },
      imm1: { mask: 124 },
      rd: { mask: 3968 }
    }
  },
  c_jal: {
    ISA: "RV",
    assembly: ["imm", "rd"],
    pseudocode: "rd = PC + sext(imm);",
    description: "Compressed Jump and Link",
    type: "CJ",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      m1: { mask: 4096 },
      m2: { mask: 2048 },
      imm2: { mask: 1536 },
      m3: { mask: 256 },
      m4: { mask: 128 },
      m5: { mask: 64 },
      imm1: { mask: 56 },
      m6: { mask: 4 }
    }
  },
  c_addiw: {
    ISA: "RV",
    assembly: ["rd", "nzimm"],
    pseudocode: "rd = rd + sext(nzimm);",
    description: "Compressed Add Immediate Word",
    type: "CW",
    arch_width: [64, 128],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      m1: { mask: 4096 },
      imm1: { mask: 124 },
      rd: { mask: 3968 }
    }
  },
  c_li: {
    ISA: "RV",
    assembly: ["rd", "imm"],
    pseudocode: "rd = sext(imm);",
    description: "Compressed Load Immediate",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 2, mask: 57344 },
      m1: { mask: 4096 },
      imm1: { mask: 124 },
      rd: { mask: 3968 }
    }
  },
  c_addi16sp: {
    ISA: "RV",
    assembly: ["nzuimm"],
    pseudocode: "sp = sp + sext(nzuimm);",
    description: "Compressed Add Immediate to SP",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      nzuimm5: { mask: 4096 },
      nzuimm2: { mask: 24 },
      nzuimm1: { mask: 4 },
      nzuimm3: { mask: 32 },
      nzuimm4: { mask: 64 },
      rd: { value: 2, mask: 3968 }
    }
  },
  c_lui: {
    ISA: "RV",
    assembly: ["rd", "nzimm"],
    pseudocode: "rd = imm << 12 (zero extends);",
    description: "Compressed Load Upper Immediate",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      imm1: { mask: 124 },
      m1: { mask: 4096 },
      rd: { mask: 3968 }
    }
  },
  c_srli: {
    ISA: "RV",
    assembly: ["rd", "nzuimm", "rs1"],
    pseudocode: "rd = rd (zero)>> shamt;",
    description: "Compressed Shift Right Logical Immediate",
    type: "CB",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 32, mask: 64512 },
      nzuimm: { mask: 124 },
      rd: { mask: 896 }
    }
  },
  // SRLI64
  c_srai: {
    ISA: "RV",
    assembly: ["rd", "nzuimm", "rs1"],
    pseudocode: "rd = rd (msb)>> nzuimm;",
    description: "Compressed Shift Right Arithmetic Immediate",
    type: "CB",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 33, mask: 64512 },
      nzuimm: { mask: 124 },
      rd: { mask: 896 }
    }
  },
  // SRAI64
  c_andi: {
    ISA: "RV",
    assembly: ["rd", "imm"],
    pseudocode: "rd &= imm;",
    description: "Compressed AND Immediate",
    type: "CB",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 4, mask: 57344 },
      funct2: { value: 2, mask: 3072 },
      m1: { mask: 4096 },
      imm1: { mask: 124 },
      rd: { mask: 896 }
    }
  },
  c_sub: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd' -= rs';",
    description: "Compressed Subtract",
    type: "CA",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 35, mask: 64512 },
      funct2: { value: 0, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_xor: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd' ^= rs';",
    description: "Compressed XOR",
    type: "CA",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 35, mask: 64512 },
      funct2: { value: 1, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_or: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd' |= rs';",
    description: "Compressed OR",
    type: "CA",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 35, mask: 64512 },
      funct2: { value: 2, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_and: {
    ISA: "RV",
    assembly: ["rd", "rs2", "rs1"],
    pseudocode: "rd = rd & rs;",
    description: "Compressed AND",
    type: "CA",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 35, mask: 64512 },
      funct2: { value: 3, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_subw: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd = rd - rs2;",
    description: "Compressed Subtract Word",
    type: "CA",
    arch_width: [64, 128, "RES"],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 39, mask: 64512 },
      funct2: { value: 0, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_addw: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd = rd + rs2;",
    description: "Compressed Add Word",
    type: "CA",
    arch_width: [64, 128, "RES"],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 39, mask: 64512 },
      funct2: { value: 1, mask: 96 },
      rs2: { mask: 28 },
      rd: { mask: 896 }
    }
  },
  c_reserved1: {
    ISA: "RV",
    assembly: [],
    pseudocode: "",
    description: "Reserved",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 39, mask: 64512 },
      funct2: { value: 2, mask: 96 }
    }
  },
  c_reserved2: {
    ISA: "RV",
    assembly: [],
    pseudocode: "",
    description: "Reserved",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct6: { value: 39, mask: 64512 },
      funct2: { value: 3, mask: 96 }
    }
  },
  c_j: {
    ISA: "RV",
    assembly: ["imm"],
    pseudocode: "PC += sext(imm);",
    description: "Compressed Jump",
    type: "CJ",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 5, mask: 57344 },
      m1: { mask: 4096 },
      m2: { mask: 2048 },
      imm2: { mask: 1536 },
      m3: { mask: 256 },
      m4: { mask: 128 },
      m5: { mask: 64 },
      imm1: { mask: 56 },
      m6: { mask: 4 }
    }
  },
  c_beqz: {
    ISA: "RV",
    assembly: ["rs1", "imm"],
    pseudocode: "if (rs1 == 0) PC += sext(imm);",
    description: "Compressed Branch if Equal to Zero",
    type: "CB",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 6, mask: 57344 },
      imm1: { mask: 24 },
      imm2: { mask: 96 },
      imm3: { mask: 3072 },
      m1: { mask: 4096 },
      m2: { mask: 4 },
      rs1: { mask: 896 }
    }
  },
  c_bnez: {
    ISA: "RV",
    assembly: ["rs1", "imm"],
    pseudocode: "if (rs1 != 0) PC += sext(imm);",
    description: "Compressed Branch if Not Equal to Zero",
    type: "CB",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 1, mask: 3 },
      funct3: { value: 7, mask: 57344 },
      imm1: { mask: 24 },
      imm2: { mask: 96 },
      imm3: { mask: 3072 },
      m1: { mask: 4096 },
      m2: { mask: 4 },
      rs1: { mask: 896 }
    }
  },
  c_slli: {
    ISA: "RV",
    assembly: ["rd", "nzuimm"],
    pseudocode: "rd = rs1 << nzuimm;",
    description: "Compressed Shift Left Logical Immediate",
    type: "CI",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 0, mask: 57344 },
      nzuimm: { mask: 124 },
      m1: { mask: 4096 },
      rs1: { mask: 3968 }
    }
  },
  // SLLI64
  c_fldsp: {
    ISA: "RV",
    assembly: ["rd", "uimm"],
    pseudocode: "rd = M[sp + uimm];",
    description: "Compressed Load Doubleword from SP",
    type: "CL",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      m1: { mask: 4096 },
      uimm2: { mask: 28 },
      uimm1: { mask: 96 },
      rd: { mask: 3968 }
    }
  },
  c_lqsp: {
    ISA: "RV",
    assembly: ["rd", "uimm"],
    pseudocode: "rd = M[sp + uimm];",
    description: "Compressed Load Quadrupleword from SP",
    type: "CL",
    arch_width: [128, "RES"],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 1, mask: 57344 },
      uimm1: { mask: 60 },
      m1: { mask: 4096 },
      m2: { mask: 64 },
      rd: { mask: 3968 }
    }
  },
  c_lwsp: {
    ISA: "RV",
    assembly: ["rd", "uimm"],
    pseudocode: "rd = M[sp + uimm];",
    description: "Compressed Load Word from SP",
    type: "CL",
    arch_width: ["RES"],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 2, mask: 57344 },
      m1: { mask: 4096 },
      uimm2: { mask: 28 },
      uimm1: { mask: 96 },
      rd: { mask: 3968 }
    }
  },
  c_flwsp: {
    ISA: "RV",
    assembly: ["rd", "uimm"],
    pseudocode: "rd = M[sp + uimm];",
    description: "Compressed Load Float from SP",
    type: "CL",
    arch_width: [32],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      m1: { mask: 4096 },
      uimm2: { mask: 28 },
      uimm1: { mask: 96 },
      rd: { mask: 3968 }
    }
  },
  c_ldsp: {
    ISA: "RV",
    assembly: ["rd", "uimm"],
    pseudocode: "rd = M[sp + uimm];",
    description: "Compressed Load Double from SP",
    type: "CL",
    arch_width: [64, 128],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 3, mask: 57344 },
      m1: { mask: 4096 },
      uimm2: { mask: 28 },
      uimm1: { mask: 96 },
      rd: { mask: 3968 }
    }
  },
  c_jr: {
    ISA: "RV",
    assembly: ["rd", "rs1"],
    pseudocode: "PC = rs1;",
    description: "Compressed Jump Register",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct4: { value: 8, mask: 61440 },
      rs2: { value: 0, mask: 124 },
      rs1: { mask: 3968 }
    }
  },
  c_mv: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd = rs2;",
    description: "Compressed Move",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct4: { value: 8, mask: 61440 },
      rs2: { mask: 124 },
      rd: { mask: 3968 }
    }
  },
  c_ebreak: {
    ISA: "RV",
    assembly: [],
    pseudocode: "Breakpoint",
    description: "Compressed EBREAK",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct4: { value: 9, mask: 61440 },
      rs2: { value: 0, mask: 124 },
      rd: { value: 0, mask: 3968 }
    }
  },
  c_jalr: {
    ISA: "RV",
    assembly: ["rs1"],
    pseudocode: "rd = PC + 2; PC = rs;",
    description: "Compressed Jump and Link Register",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct4: { value: 9, mask: 61440 },
      rs2: { value: 0, mask: 124 },
      rs1: { mask: 3968 }
    }
  },
  c_add: {
    ISA: "RV",
    assembly: ["rd", "rs2"],
    pseudocode: "rd += rs;",
    description: "Compressed Add",
    type: "CR",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct4: { value: 9, mask: 61440 },
      rs2: { mask: 124 },
      rd: { mask: 3968 }
    }
  },
  c_fsdsp: {
    ISA: "RV",
    assembly: ["rs2", "uimm"],
    pseudocode: "M[sp + uimm] = rs2;",
    description: "Compressed Store Double from SP",
    type: "CS",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 5, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 896 },
      rs2: { mask: 124 }
    }
  },
  c_sqsp: {
    ISA: "RV",
    assembly: ["rs2", "uimm"],
    pseudocode: "M[sp + uimm] = rs2;",
    description: "Compressed Store Quadruple from SP",
    type: "CS",
    arch_width: [128],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 5, mask: 57344 },
      uimm1: { mask: 6144 },
      uimm2: { mask: 1920 },
      rs2: { mask: 124 }
    }
  },
  c_swsp: {
    ISA: "RV",
    assembly: ["rs2", "uimm"],
    pseudocode: "M[sp + uimm] = rs2;",
    description: "Compressed Store Word from SP",
    type: "CSS",
    arch_width: [32, 64],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 6, mask: 57344 },
      uimm2: { mask: 7680 },
      uimm1: { mask: 384 },
      rs2: { mask: 124 }
    }
  },
  c_fswsp: {
    ISA: "RV",
    assembly: ["rs2", "uimm"],
    pseudocode: "M[sp + uimm] = rs2;",
    description: "Compressed Store Float from SP",
    type: "CSS",
    arch_width: [32],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 7, mask: 57344 },
      uimm2: { mask: 7680 },
      uimm1: { mask: 384 },
      rs2: { mask: 124 }
    }
  },
  c_sdsp: {
    ISA: "RV",
    assembly: ["rs2", "uimm"],
    pseudocode: "M[sp + uimm] = rs2;",
    description: "Compressed Store Double from SP",
    type: "CSS",
    arch_width: [64, 128],
    extension: "C",
    fields: {
      quadrant: { value: 2, mask: 3 },
      funct3: { value: 7, mask: 57344 },
      uimm1: { mask: 7168 },
      uimm2: { mask: 896 },
      rs2: { mask: 124 }
    }
  }
};
function _extractRegisterNumber({ register: n = "x0" }) {
  return parseInt(n.slice(1));
}
function _assembleInstruction({ mnemonic: n = "mnemonic", operands: m = {} }) {
  const d = instructions[n].assembly.map((k) => m[k]).join(" ");
  return `${n} ${d}`;
}
function _parseAssemblyInstruction({
  assemblyString: n = "mnemonic op1 op2 op3"
}) {
  const [m, ...s] = n.split(" "), d = instructions[m].assembly, k = instructions[m].type;
  var j = {};
  return k == "I" || k == "R" ? d.forEach((z, B) => {
    j[z] = s[B];
  }) : k == "S" && (j = {
    rs1: s[0],
    rs2: s[1].split("(")[1].replace(/[()]/g, ""),
    imm: s[1].split("(")[0]
  }), { mnemonic: m, operands: j, instructionType: k };
}
function _binaryHexString({ value: n = 0 }) {
  const m = `0b${(n >>> 0).toString(2).padStart(32, "0")}`, s = `0x${(n >>> 0).toString(16).padStart(8, "0").toUpperCase()}`;
  return { binary: m, hex: s };
}
function _extractValues({ binaryvalue: n = 0, binaryMask: m = 0 }) {
  let s = 0, d = 0;
  for (let k = 0; k < 32; k++)
    if ((m >> k & 1) === 1) {
      const z = n >> k & 1;
      s |= z << d, d++;
    }
  return s;
}
function _matchesConstraints({ instruction: n = {}, constraints: m = [] }) {
  const s = _getInstructionBinary({ instruction: n });
  for (let d = 0; d < s.length; d++) {
    const k = m[d];
    if (k !== "-" && s[d] !== "n" && k !== s[d])
      return !1;
  }
  return !0;
}
function _getInstructionBinary({ instruction: n = {} }) {
  const m = n.fields, s = new Array(32).fill("n");
  for (const d in m)
    if (m[d].hasOwnProperty("value")) {
      const k = _calculateShift({ mask: m[d].mask }), j = m[d].value.toString(2).padStart(maskWidth({ mask: m[d].mask }), "0");
      for (let z = 0; z < j.length; z++)
        s[31 - (k + z)] = j[j.length - 1 - z];
    } else {
      const k = _calculateShift({ mask: m[d].mask }), j = maskWidth({ mask: m[d].mask });
      for (let z = 0; z < j; z++)
        s[31 - (k + z)] = "n";
    }
  return s;
}
function _calculateShift({ mask: n = 0 }) {
  return 31 - n.toString(2).padStart(32, "0").lastIndexOf("1");
}
function _encodeImmediate({ instructionType: n = "I", operands: m = {} }) {
  const s = immediates[n];
  let d = 0;
  if (n === "I") {
    const z = m.imm;
    for (const [B, g] of Object.entries(s)) {
      let o = 0, b = _binaryHexString({ value: B }).binary, D = _binaryHexString({ value: g }).binary;
      if (b.toString(2).replace(/0/g, "").length === D.toString(2).replace(/0/g, "").length)
        o = z & D, d |= o << _calculateShift({ mask: b }) + 2;
      else {
        var k = _calculateShift({ mask: D }) + 2, j = _binaryHexString({ value: z }).binary >> k & 1;
        d |= j << _calculateShift({ mask: b }) + 2;
      }
    }
    return d;
  } else if (n === "S") {
    const z = m.imm;
    for (const [B, g] of Object.entries(s)) {
      let o = 0, b = _binaryHexString({ value: B }).binary, D = _binaryHexString({ value: g }).binary;
      if (b.toString(2).replace(/0/g, "").length === D.toString(2).replace(/0/g, "").length)
        o = z & D, d |= o << _calculateShift({ mask: b }) + 2;
      else {
        var k = _calculateShift({ mask: D }) + 2, j = _binaryHexString({ value: z }).binary >> k & 1;
        d |= j << _calculateShift({ mask: b }) + 2;
      }
    }
    return d;
  } else if (
    //instructionType === "S" ||
    n === "B" || n === "U" || n === "J"
  )
    for (const z in s) {
      const B = s[z];
      if (m.imm === B) {
        d |= (z & s[z].value_mask) >> _calculateShift({ mask: z });
        break;
      }
    }
  return d;
}
function encodeInstruction({ assemblyString: n = "mnemonic op1 op2 op3" }) {
  const { mnemonic: m, operands: s, instructionType: d } = _parseAssemblyInstruction({
    assemblyString: n
  }), j = instructions[m].fields;
  let z = 0;
  for (const B in j)
    j[B].hasOwnProperty("value") ? z |= j[B].value << _calculateShift({ mask: j[B].mask }) : ["rd", "rs1", "rs2", "rs3"].includes(B) && (z |= _extractRegisterNumber({ register: s[B] }) << _calculateShift({ mask: j[B].mask }));
  if (["I", "S", "B", "U", "J"].includes(d)) {
    let B = 0;
    B = _encodeImmediate({
      instructionType: d,
      operands: s
    }), z |= B;
  }
  return _binaryHexString({ value: z });
}
function decodeInstruction({ value: n = 0 }) {
  let m = null, s = null;
  for (const d in instructions) {
    const k = instructions[d];
    let j = !0;
    for (const z in k.fields) {
      const B = k.fields[z], g = _extractValues({
        binaryvalue: n,
        binaryMask: B.mask
      });
      if (B.hasOwnProperty("value")) {
        const o = B.value;
        if (g !== o) {
          j = !1;
          break;
        }
      } else {
        const b = `x${_extractValues({
          binaryvalue: n,
          binaryMask: B.mask
        })}`;
        s = s || {}, s[z] = b;
      }
    }
    if (j) {
      m = d;
      break;
    }
  }
  return _assembleInstruction({ mnemonic: m, operands: s });
}
function pruneInstructions({ constraints: n = {} }) {
  const m = {};
  for (const s in instructions) {
    const d = instructions[s];
    _matchesConstraints({
      instruction: d,
      constraints: n
    }) && (m[s] = d);
  }
  return m;
}
function maskWidth({ mask: n = 0 }) {
  return n = n >>> 0, n.toString(2).split("").filter((s) => s === "1").length;
}
function tableEncoder({ prunedInstructions: n }) {
  var m = {}, s = [];
  return m = Object.values(n), m = m.map((d) => {
    var k = Object.keys(d.fields || {}), j = k.join(", ");
    return { ...d, fields: j };
  }), s = [
    { title: "ISA", width: 25 },
    { title: "Mnemonic", width: 100 },
    { title: "Pseudocode", width: 350 },
    { title: "Description", width: 350 },
    { title: "Type", width: 50 },
    { title: "Architecture", width: 120 },
    { title: "Extension", width: 50 },
    { title: "Fields", width: 300 }
  ], { tabulatedData: m, generatedColumns: s };
}
function getDefaultExportFromCjs(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function commonjsRequire(n) {
  throw new Error('Could not dynamically require "' + n + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var dist$3 = { exports: {} }, jsuites$1 = { exports: {} }, jsuites = jsuites$1.exports, hasRequiredJsuites;
function requireJsuites() {
  return hasRequiredJsuites || (hasRequiredJsuites = 1, (function(n, m) {
    (function(s, d) {
      n.exports = d();
    })(jsuites, (function() {
      var s;
      return (function() {
        var d = {
          /***/
          195: (
            /***/
            (function(B) {
              (function(g, o) {
                B.exports = o();
              })(this, (function() {
                return (function(Ie) {
                  function o(Se, Ce) {
                    this.highOrder = Se, this.lowOrder = Ce;
                  }
                  var b = [
                    new o(1779033703, 4089235720),
                    new o(3144134277, 2227873595),
                    new o(1013904242, 4271175723),
                    new o(2773480762, 1595750129),
                    new o(1359893119, 2917565137),
                    new o(2600822924, 725511199),
                    new o(528734635, 4215389547),
                    new o(1541459225, 327033209)
                  ], D = [
                    new o(1116352408, 3609767458),
                    new o(1899447441, 602891725),
                    new o(3049323471, 3964484399),
                    new o(3921009573, 2173295548),
                    new o(961987163, 4081628472),
                    new o(1508970993, 3053834265),
                    new o(2453635748, 2937671579),
                    new o(2870763221, 3664609560),
                    new o(3624381080, 2734883394),
                    new o(310598401, 1164996542),
                    new o(607225278, 1323610764),
                    new o(1426881987, 3590304994),
                    new o(1925078388, 4068182383),
                    new o(2162078206, 991336113),
                    new o(2614888103, 633803317),
                    new o(3248222580, 3479774868),
                    new o(3835390401, 2666613458),
                    new o(4022224774, 944711139),
                    new o(264347078, 2341262773),
                    new o(604807628, 2007800933),
                    new o(770255983, 1495990901),
                    new o(1249150122, 1856431235),
                    new o(1555081692, 3175218132),
                    new o(1996064986, 2198950837),
                    new o(2554220882, 3999719339),
                    new o(2821834349, 766784016),
                    new o(2952996808, 2566594879),
                    new o(3210313671, 3203337956),
                    new o(3336571891, 1034457026),
                    new o(3584528711, 2466948901),
                    new o(113926993, 3758326383),
                    new o(338241895, 168717936),
                    new o(666307205, 1188179964),
                    new o(773529912, 1546045734),
                    new o(1294757372, 1522805485),
                    new o(1396182291, 2643833823),
                    new o(1695183700, 2343527390),
                    new o(1986661051, 1014477480),
                    new o(2177026350, 1206759142),
                    new o(2456956037, 344077627),
                    new o(2730485921, 1290863460),
                    new o(2820302411, 3158454273),
                    new o(3259730800, 3505952657),
                    new o(3345764771, 106217008),
                    new o(3516065817, 3606008344),
                    new o(3600352804, 1432725776),
                    new o(4094571909, 1467031594),
                    new o(275423344, 851169720),
                    new o(430227734, 3100823752),
                    new o(506948616, 1363258195),
                    new o(659060556, 3750685593),
                    new o(883997877, 3785050280),
                    new o(958139571, 3318307427),
                    new o(1322822218, 3812723403),
                    new o(1537002063, 2003034995),
                    new o(1747873779, 3602036899),
                    new o(1955562222, 1575990012),
                    new o(2024104815, 1125592928),
                    new o(2227730452, 2716904306),
                    new o(2361852424, 442776044),
                    new o(2428436474, 593698344),
                    new o(2756734187, 3733110249),
                    new o(3204031479, 2999351573),
                    new o(3329325298, 3815920427),
                    new o(3391569614, 3928383900),
                    new o(3515267271, 566280711),
                    new o(3940187606, 3454069534),
                    new o(4118630271, 4000239992),
                    new o(116418474, 1914138554),
                    new o(174292421, 2731055270),
                    new o(289380356, 3203993006),
                    new o(460393269, 320620315),
                    new o(685471733, 587496836),
                    new o(852142971, 1086792851),
                    new o(1017036298, 365543100),
                    new o(1126000580, 2618297676),
                    new o(1288033470, 3409855158),
                    new o(1501505948, 4234509866),
                    new o(1607167915, 987167468),
                    new o(1816402316, 1246189591)
                  ], _ = new Array(64), l, a, h, p, u, v, A, M, N, T, I, O, Y = 8;
                  function U(Se) {
                    return unescape(encodeURIComponent(Se));
                  }
                  function ue(Se) {
                    for (var Ce = [], Me = (1 << Y) - 1, Pe = Se.length * Y, He = 0; He < Pe; He += Y)
                      Ce[He >> 5] |= (Se.charCodeAt(He / Y) & Me) << 32 - Y - He % 32;
                    return Ce;
                  }
                  function be(Se) {
                    for (var Ce = "0123456789abcdef", Me = "", Pe = Se.length * 4, He, Ye = 0; Ye < Pe; Ye += 1)
                      He = Se[Ye >> 2] >> (3 - Ye % 4) * 8, Me += Ce.charAt(He >> 4 & 15) + Ce.charAt(He & 15);
                    return Me;
                  }
                  function G(Se, Ce) {
                    var Me, Pe, He, Ye;
                    return Me = (Se.lowOrder & 65535) + (Ce.lowOrder & 65535), Pe = (Se.lowOrder >>> 16) + (Ce.lowOrder >>> 16) + (Me >>> 16), He = (Pe & 65535) << 16 | Me & 65535, Me = (Se.highOrder & 65535) + (Ce.highOrder & 65535) + (Pe >>> 16), Pe = (Se.highOrder >>> 16) + (Ce.highOrder >>> 16) + (Me >>> 16), Ye = (Pe & 65535) << 16 | Me & 65535, new o(Ye, He);
                  }
                  function ie(Se, Ce, Me, Pe) {
                    var He, Ye, et, tt;
                    return He = (Se.lowOrder & 65535) + (Ce.lowOrder & 65535) + (Me.lowOrder & 65535) + (Pe.lowOrder & 65535), Ye = (Se.lowOrder >>> 16) + (Ce.lowOrder >>> 16) + (Me.lowOrder >>> 16) + (Pe.lowOrder >>> 16) + (He >>> 16), et = (Ye & 65535) << 16 | He & 65535, He = (Se.highOrder & 65535) + (Ce.highOrder & 65535) + (Me.highOrder & 65535) + (Pe.highOrder & 65535) + (Ye >>> 16), Ye = (Se.highOrder >>> 16) + (Ce.highOrder >>> 16) + (Me.highOrder >>> 16) + (Pe.highOrder >>> 16) + (He >>> 16), tt = (Ye & 65535) << 16 | He & 65535, new o(tt, et);
                  }
                  function ge(Se, Ce, Me, Pe, He) {
                    var Ye, et, tt, at;
                    return Ye = (Se.lowOrder & 65535) + (Ce.lowOrder & 65535) + (Me.lowOrder & 65535) + (Pe.lowOrder & 65535) + (He.lowOrder & 65535), et = (Se.lowOrder >>> 16) + (Ce.lowOrder >>> 16) + (Me.lowOrder >>> 16) + (Pe.lowOrder >>> 16) + (He.lowOrder >>> 16) + (Ye >>> 16), tt = (et & 65535) << 16 | Ye & 65535, Ye = (Se.highOrder & 65535) + (Ce.highOrder & 65535) + (Me.highOrder & 65535) + (Pe.highOrder & 65535) + (He.highOrder & 65535) + (et >>> 16), et = (Se.highOrder >>> 16) + (Ce.highOrder >>> 16) + (Me.highOrder >>> 16) + (Pe.highOrder >>> 16) + (He.highOrder >>> 16) + (Ye >>> 16), at = (et & 65535) << 16 | Ye & 65535, new o(at, tt);
                  }
                  function de(Se, Ce, Me) {
                    return new o(
                      Se.highOrder & Ce.highOrder ^ Se.highOrder & Me.highOrder ^ Ce.highOrder & Me.highOrder,
                      Se.lowOrder & Ce.lowOrder ^ Se.lowOrder & Me.lowOrder ^ Ce.lowOrder & Me.lowOrder
                    );
                  }
                  function oe(Se, Ce, Me) {
                    return new o(
                      Se.highOrder & Ce.highOrder ^ ~Se.highOrder & Me.highOrder,
                      Se.lowOrder & Ce.lowOrder ^ ~Se.lowOrder & Me.lowOrder
                    );
                  }
                  function xe(Se, Ce) {
                    return Ce <= 32 ? new o(
                      Se.highOrder >>> Ce | Se.lowOrder << 32 - Ce,
                      Se.lowOrder >>> Ce | Se.highOrder << 32 - Ce
                    ) : new o(
                      Se.lowOrder >>> Ce | Se.highOrder << 32 - Ce,
                      Se.highOrder >>> Ce | Se.lowOrder << 32 - Ce
                    );
                  }
                  function Oe(Se) {
                    var Ce = xe(Se, 28), Me = xe(Se, 34), Pe = xe(Se, 39);
                    return new o(
                      Ce.highOrder ^ Me.highOrder ^ Pe.highOrder,
                      Ce.lowOrder ^ Me.lowOrder ^ Pe.lowOrder
                    );
                  }
                  function Be(Se) {
                    var Ce = xe(Se, 14), Me = xe(Se, 18), Pe = xe(Se, 41);
                    return new o(
                      Ce.highOrder ^ Me.highOrder ^ Pe.highOrder,
                      Ce.lowOrder ^ Me.lowOrder ^ Pe.lowOrder
                    );
                  }
                  function Re(Se) {
                    var Ce = xe(Se, 1), Me = xe(Se, 8), Pe = W(Se, 7);
                    return new o(
                      Ce.highOrder ^ Me.highOrder ^ Pe.highOrder,
                      Ce.lowOrder ^ Me.lowOrder ^ Pe.lowOrder
                    );
                  }
                  function $e(Se) {
                    var Ce = xe(Se, 19), Me = xe(Se, 61), Pe = W(Se, 6);
                    return new o(
                      Ce.highOrder ^ Me.highOrder ^ Pe.highOrder,
                      Ce.lowOrder ^ Me.lowOrder ^ Pe.lowOrder
                    );
                  }
                  function W(Se, Ce) {
                    return Ce <= 32 ? new o(
                      Se.highOrder >>> Ce,
                      Se.lowOrder >>> Ce | Se.highOrder << 32 - Ce
                    ) : new o(
                      0,
                      Se.highOrder << 32 - Ce
                    );
                  }
                  var Ie = U(Ie), Ve = Ie.length * Y;
                  Ie = ue(Ie), Ie[Ve >> 5] |= 128 << 24 - Ve % 32, Ie[(Ve + 128 >> 10 << 5) + 31] = Ve;
                  for (var N = 0; N < Ie.length; N += 32) {
                    l = b[0], a = b[1], h = b[2], p = b[3], u = b[4], v = b[5], A = b[6], M = b[7];
                    for (var T = 0; T < 80; T++)
                      T < 16 ? _[T] = new o(Ie[T * 2 + N], Ie[T * 2 + N + 1]) : _[T] = ie($e(_[T - 2]), _[T - 7], Re(_[T - 15]), _[T - 16]), I = ge(M, Be(u), oe(u, v, A), D[T], _[T]), O = G(Oe(l), de(l, a, h)), M = A, A = v, v = u, u = G(p, I), p = h, h = a, a = l, l = G(I, O);
                    b[0] = G(l, b[0]), b[1] = G(a, b[1]), b[2] = G(h, b[2]), b[3] = G(p, b[3]), b[4] = G(u, b[4]), b[5] = G(v, b[5]), b[6] = G(A, b[6]), b[7] = G(M, b[7]);
                  }
                  for (var st = [], N = 0; N < b.length; N++)
                    st.push(b[N].highOrder), st.push(b[N].lowOrder);
                  return be(st);
                });
              }));
            })
          )
          /******/
        }, k = {};
        function j(B) {
          var g = k[B];
          if (g !== void 0)
            return g.exports;
          var o = k[B] = {
            /******/
            // no module.id needed
            /******/
            // no module.loaded needed
            /******/
            exports: {}
            /******/
          };
          return d[B].call(o.exports, o, o.exports, j), o.exports;
        }
        (function() {
          j.n = function(B) {
            var g = B && B.__esModule ? (
              /******/
              function() {
                return B.default;
              }
            ) : (
              /******/
              function() {
                return B;
              }
            );
            return j.d(g, { a: g }), g;
          };
        })(), (function() {
          j.d = function(B, g) {
            for (var o in g)
              j.o(g, o) && !j.o(B, o) && Object.defineProperty(B, o, { enumerable: !0, get: g[o] });
          };
        })(), (function() {
          j.o = function(B, g) {
            return Object.prototype.hasOwnProperty.call(B, g);
          };
        })();
        var z = {};
        (function() {
          j.d(z, {
            default: function() {
              return (
                /* binding */
                gt
              );
            }
          });
          var B = function(E) {
            document.dictionary || (document.dictionary = {});
            var S = null, f = Object.keys(E);
            for (S = 0; S < f.length; S++)
              document.dictionary[f[S]] = E[f[S]];
          }, g = function(E) {
            return typeof document < "u" && document.dictionary && document.dictionary[E] || E;
          }, o = { setDictionary: B, translate: g }, D = function(E, S) {
            if (S === !0)
              window.jSuitesStateControl = window.jSuitesStateControl.filter(function(r) {
                return r !== null;
              }), setTimeout(function() {
                window.jSuitesStateControl.push(E);
              }, 0);
            else {
              var f = window.jSuitesStateControl.indexOf(E);
              f >= 0 && window.jSuitesStateControl.splice(f, 1);
            }
          }, _ = {};
          _.two = function(E) {
            return E = "" + E, E.length == 1 && (E = "0" + E), E;
          }, _.focus = function(E) {
            if (E.textContent.length) {
              const S = document.createRange(), f = window.getSelection();
              let r = E;
              for (; r.lastChild; ) r = r.lastChild;
              r.nodeType === Node.TEXT_NODE ? S.setStart(r, r.length) : S.setStart(r, r.childNodes.length), S.collapse(!0), f.removeAllRanges(), f.addRange(S), E.scrollLeft = E.scrollWidth;
            }
          }, _.isNumeric = (function(E) {
            return typeof E == "string" && (E = E.trim()), !isNaN(E) && E !== null && E !== "";
          }), _.guid = function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(E) {
              var S = Math.random() * 16 | 0, f = E == "x" ? S : S & 3 | 8;
              return f.toString(16);
            });
          }, _.getNode = function() {
            var E = document.getSelection().anchorNode;
            return E ? E.nodeType == 3 ? E.parentNode : E : null;
          }, _.hash = function(E) {
            var S = 0, f, r;
            if (E.length === 0)
              return S;
            for (f = 0; f < E.length; f++)
              r = E.charCodeAt(f), r > 32 && (S = (S << 5) - S + r, S |= 0);
            return S;
          }, _.randomColor = function(E) {
            var S = -0.25, f = ("#" + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, "");
            f.length < 6 && (f = f[0] + f[0] + f[1] + f[1] + f[2] + f[2]);
            var r = [], H, re;
            for (re = 0; re < 3; re++)
              H = parseInt(f.substr(re * 2, 2), 16), H = Math.round(Math.min(Math.max(0, H + H * S), 255)).toString(16), r.push(("00" + H).substr(H.length));
            return E == !0 ? "#" + _.two(r[0].toString(16)) + _.two(r[1].toString(16)) + _.two(r[2].toString(16)) : r;
          }, _.getWindowWidth = function() {
            var E = window, S = document, f = S.documentElement, r = S.getElementsByTagName("body")[0], H = E.innerWidth || f.clientWidth || r.clientWidth;
            return H;
          }, _.getWindowHeight = function() {
            var E = window, S = document, f = S.documentElement, r = S.getElementsByTagName("body")[0], H = E.innerHeight || f.clientHeight || r.clientHeight;
            return H;
          }, _.getPosition = function(E) {
            if (E.changedTouches && E.changedTouches[0])
              var S = E.changedTouches[0].pageX, f = E.changedTouches[0].pageY;
            else
              var S = window.Event ? E.pageX : E.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft), f = window.Event ? E.pageY : E.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            return [S, f];
          }, _.click = function(E) {
            if (E.click)
              E.click();
            else {
              var S = new MouseEvent("click", {
                bubbles: !0,
                cancelable: !0,
                view: window
              });
              E.dispatchEvent(S);
            }
          }, _.findElement = function(E, S) {
            var f = !1;
            function r(H) {
              H && !f && (typeof S == "function" ? f = S(H) : typeof S == "string" && H.classList && H.classList.contains(S) && (f = H)), H.parentNode && !f && r(H.parentNode);
            }
            return r(E), f;
          };
          var l = _;
          const a = function(E) {
            return typeof E == "object" || typeof E == "function";
          };
          function h(E, S, f) {
            if (typeof E != "string" || E.length === 0)
              return;
            const r = E.split(".");
            if (r.length === 0)
              return;
            let H = this;
            if (typeof S > "u" && typeof f > "u") {
              for (let te = 0; te < r.length; te++) {
                const P = r[te];
                if (H != null && a(H) && Object.prototype.hasOwnProperty.call(H, P))
                  H = H[P];
                else
                  return;
              }
              return H;
            }
            for (let te = 0; te < r.length - 1; te++) {
              const P = r[te];
              if (H == null || !a(H))
                return console.warn(`Cannot set value: path '${E}' blocked by invalid object at '${P}'`), !1;
              Object.prototype.hasOwnProperty.call(H, P) && (H[P] == null || !a(H[P])) ? H[P] = {} : Object.prototype.hasOwnProperty.call(H, P) || (H[P] = {}), H = H[P];
            }
            const re = r[r.length - 1];
            return H == null || !a(H) ? !1 : f === !0 ? Object.prototype.hasOwnProperty.call(H, re) ? (delete H[re], !0) : !1 : (H[re] = S, !0);
          }
          function p(E, S) {
            var f = {};
            f.options = {};
            var r = {
              pointer: null,
              direction: null,
              ondragstart: null,
              ondragend: null,
              ondrop: null
            }, H = null;
            for (var re in r)
              S && S.hasOwnProperty(re) ? f.options[re] = S[re] : f.options[re] = r[re];
            E.classList.add("jsorting"), E.addEventListener("dragstart", function(L) {
              let q = L.target;
              if (q.nodeType === 3)
                if (q.parentNode.getAttribute("draggable") === "true")
                  q = q.parentNode;
                else {
                  L.preventDefault(), L.stopPropagation();
                  return;
                }
              if (q.getAttribute("draggable") === "true") {
                let Q = Array.prototype.indexOf.call(q.parentNode.children, q);
                H = {
                  element: q,
                  o: Q,
                  d: Q
                }, q.style.opacity = "0.25", typeof f.options.ondragstart == "function" && f.options.ondragstart(E, q, L), L.dataTransfer.setDragImage(q, 0, 0);
              }
            }), E.addEventListener("dragover", function(L) {
              if (L.preventDefault(), H && te(L.target) && L.target.getAttribute("draggable") == "true" && H.element != L.target) {
                if (f.options.direction)
                  var q = L.target.clientWidth / 2 > L.offsetX;
                else
                  var q = L.target.clientHeight / 2 > L.offsetY;
                q ? L.target.parentNode.insertBefore(H.element, L.target) : L.target.parentNode.insertBefore(H.element, L.target.nextSibling), H.d = Array.prototype.indexOf.call(L.target.parentNode.children, H.element);
              }
            }), E.addEventListener("dragleave", function(L) {
              L.preventDefault();
            }), E.addEventListener("dragend", function(L) {
              L.preventDefault(), H && (typeof f.options.ondragend == "function" && f.options.ondragend(E, H.element, L), H.o < H.d ? L.target.parentNode.insertBefore(H.element, L.target.parentNode.children[H.o]) : L.target.parentNode.insertBefore(H.element, L.target.parentNode.children[H.o].nextSibling), H.element.style.opacity = "", H = null);
            }), E.addEventListener("drop", function(L) {
              L.preventDefault(), H && (H.o !== H.d && typeof f.options.ondrop == "function" && f.options.ondrop(E, H.o, H.d, H.element, L.target, L), H.element.style.opacity = "", H = null);
            });
            for (var te = function(L) {
              var q = !1;
              function Q(le) {
                le.className && le.classList.contains("jsorting") && (q = !0), q || Q(le.parentNode);
              }
              return Q(L), q;
            }, P = 0; P < E.children.length; P++)
              E.children[P].hasAttribute("draggable") || E.children[P].setAttribute("draggable", "true");
            return E.val = function() {
              for (var L = null, q = [], Q = 0; Q < E.children.length; Q++)
                (L = E.children[Q].getAttribute("data-id")) && q.push(L);
              return q;
            }, E;
          }
          function u(E, S) {
            var f = {};
            (!S.loadUp || typeof S.loadUp != "function") && (S.loadUp = function() {
              return !1;
            }), (!S.loadDown || typeof S.loadDown != "function") && (S.loadDown = function() {
              return !1;
            }), S.timer || (S.timer = 100);
            var r = null, H = function(re) {
              if (r == null) {
                var te = !1, P = E.scrollTop;
                E.scrollTop + E.clientHeight * 2 >= E.scrollHeight ? S.loadDown() && (P == E.scrollTop && (E.scrollTop = E.scrollTop - E.clientHeight), te = !0) : E.scrollTop <= E.clientHeight && S.loadUp() && (P == E.scrollTop && (E.scrollTop = E.scrollTop + E.clientHeight), te = !0), r = setTimeout(function() {
                  r = null;
                }, S.timer), te && typeof S.onupdate == "function" && S.onupdate();
              }
            };
            return E.onscroll = function(re) {
              H();
            }, E.onwheel = function(re) {
              H();
            }, f;
          }
          function v() {
            var E = (function(S, f) {
              if (Array.isArray(S)) {
                var r = {
                  instance: [],
                  complete: f
                };
                if (S.length > 0)
                  for (var H = 0; H < S.length; H++)
                    S[H].multiple = r, r.instance.push(E(S[H]));
                return r;
              }
              if (S.data || (S.data = {}), S.type && (S.method = S.type), S.method || (S.method = "GET"), S.dataType || (S.dataType = "json"), S.data) {
                var re = function(le, he) {
                  var me = [];
                  if (le) {
                    var we = Object.keys(le);
                    if (we.length)
                      for (var Le = 0; Le < we.length; Le++) {
                        if (he)
                          var De = he + "[" + we[Le] + "]";
                        else
                          var De = we[Le];
                        if (le[De] instanceof FileList)
                          me[De] = le[we[Le]];
                        else if (le[we[Le]] === null || le[we[Le]] === void 0)
                          me[De] = "";
                        else if (typeof le[we[Le]] == "object")
                          for (var Te = re(le[we[Le]], De), Xe = Object.keys(Te), qe = 0; qe < Xe.length; qe++)
                            me[Xe[qe]] = Te[Xe[qe]];
                        else
                          me[De] = le[we[Le]];
                      }
                  }
                  return me;
                }, te = re(S.data), P = Object.keys(te);
                if (S.method == "GET") {
                  if (P.length) {
                    for (var L = [], H = 0; H < P.length; H++)
                      L.push(P[H] + "=" + encodeURIComponent(te[P[H]]));
                    S.url.indexOf("?") < 0 && (S.url += "?"), S.url += L.join("&");
                  }
                } else
                  for (var L = new FormData(), H = 0; H < P.length; H++)
                    if (te[P[H]] instanceof FileList) {
                      if (te[P[H]].length)
                        for (var q = 0; q < te[P[H]].length; q++)
                          L.append(P[H], te[P[H]][q], te[P[H]][q].name);
                    } else
                      L.append(P[H], te[P[H]]);
              }
              var Q = new XMLHttpRequest();
              return Q.open(S.method, S.url, !0), S.requestedWith ? Q.setRequestHeader("X-Requested-With", S.requestedWith) : S.requestedWith !== !1 && Q.setRequestHeader("X-Requested-With", "XMLHttpRequest"), S.contentType && Q.setRequestHeader("Content-Type", S.contentType), S.method === "POST" ? Q.setRequestHeader("Accept", "application/json") : S.dataType === "blob" ? Q.responseType = "blob" : S.contentType || (S.dataType === "json" ? Q.setRequestHeader("Content-Type", "text/json") : S.dataType === "html" && Q.setRequestHeader("Content-Type", "text/html")), S.cache !== !0 && (Q.setRequestHeader("pragma", "no-cache"), Q.setRequestHeader("cache-control", "no-cache")), S.withCredentials === !0 && (Q.withCredentials = !0), typeof S.beforeSend == "function" && S.beforeSend(Q), typeof E.beforeSend == "function" && E.beforeSend(Q), document.ajax && typeof document.ajax.beforeSend == "function" && document.ajax.beforeSend(Q), Q.onerror = function() {
                S.error && typeof S.error == "function" && S.error({
                  message: "Network error: Unable to reach the server.",
                  status: 0
                });
              }, Q.ontimeout = function() {
                S.error && typeof S.error == "function" && S.error({
                  message: "Request timed out after " + Q.timeout + "ms.",
                  status: 0
                });
              }, Q.onload = function() {
                if (Q.status >= 200 && Q.status < 300)
                  if (S.dataType === "json")
                    try {
                      var le = JSON.parse(Q.responseText);
                      S.success && typeof S.success == "function" && S.success(le);
                    } catch (me) {
                      S.error && typeof S.error == "function" && S.error(me, le);
                    }
                  else {
                    if (S.dataType === "blob")
                      var le = Q.response;
                    else
                      var le = Q.responseText;
                    S.success && typeof S.success == "function" && S.success(le);
                  }
                else
                  S.error && typeof S.error == "function" && S.error(Q.responseText, Q.status);
                if (E.queue && E.queue.length > 0 && E.send(E.queue.shift()), E.requests && E.requests.length) {
                  var he = E.requests.indexOf(Q);
                  if (E.requests.splice(he, 1), E.requests.length || S.complete && typeof S.complete == "function" && S.complete(le), S.group && E.oncomplete && typeof E.oncomplete[S.group] == "function" && (E.pending(S.group) || (E.oncomplete[S.group](), E.oncomplete[S.group] = null)), S.multiple && S.multiple.instance) {
                    var he = S.multiple.instance.indexOf(Q);
                    S.multiple.instance.splice(he, 1), S.multiple.instance.length || S.multiple.complete && typeof S.multiple.complete == "function" && S.multiple.complete(le);
                  }
                }
              }, Q.options = S, Q.data = L, S.queue === !0 && E.requests.length > 0 ? E.queue.push(Q) : E.send(Q), Q;
            });
            return E.send = function(S) {
              S.data ? Array.isArray(S.data) ? S.send(S.data.join("&")) : S.send(S.data) : S.send(), E.requests.push(S);
            }, E.exists = function(S, f) {
              var r = new XMLHttpRequest();
              r.open("HEAD", S, !1), r.send(), r.status && f(r.status);
            }, E.pending = function(S) {
              var f = 0, r = E.requests;
              if (r && r.length)
                for (var H = 0; H < r.length; H++)
                  (!S || S == r[H].options.group) && f++;
              return f;
            }, E.oncomplete = {}, E.requests = [], E.queue = [], E;
          }
          var A = v();
          function M() {
            const E = {
              loading: {}
            };
            return E.loading.show = function(S) {
              E.loading.element || (E.loading.element = document.createElement("div"), E.loading.element.className = "jloading"), document.body.appendChild(E.loading.element), S > 0 && setTimeout(function() {
                E.loading.hide();
              }, S * 1e3);
            }, E.loading.hide = function() {
              E.loading.element && E.loading.element.parentNode && document.body.removeChild(E.loading.element);
            }, E.slideLeft = function(S, f, r) {
              f == !0 ? (S.classList.add("jslide-left-in"), setTimeout(function() {
                S.classList.remove("jslide-left-in"), typeof r == "function" && r();
              }, 400)) : (S.classList.add("jslide-left-out"), setTimeout(function() {
                S.classList.remove("jslide-left-out"), typeof r == "function" && r();
              }, 400));
            }, E.slideRight = function(S, f, r) {
              f === !0 ? (S.classList.add("jslide-right-in"), setTimeout(function() {
                S.classList.remove("jslide-right-in"), typeof r == "function" && r();
              }, 400)) : (S.classList.add("jslide-right-out"), setTimeout(function() {
                S.classList.remove("jslide-right-out"), typeof r == "function" && r();
              }, 400));
            }, E.slideTop = function(S, f, r) {
              f === !0 ? (S.classList.add("jslide-top-in"), setTimeout(function() {
                S.classList.remove("jslide-top-in"), typeof r == "function" && r();
              }, 400)) : (S.classList.add("jslide-top-out"), setTimeout(function() {
                S.classList.remove("jslide-top-out"), typeof r == "function" && r();
              }, 400));
            }, E.slideBottom = function(S, f, r) {
              f === !0 ? (S.classList.add("jslide-bottom-in"), setTimeout(function() {
                S.classList.remove("jslide-bottom-in"), typeof r == "function" && r();
              }, 400)) : (S.classList.add("jslide-bottom-out"), setTimeout(function() {
                S.classList.remove("jslide-bottom-out"), typeof r == "function" && r();
              }, 100));
            }, E.fadeIn = function(S, f) {
              S.style.display = "", S.classList.add("jfade-in"), setTimeout(function() {
                S.classList.remove("jfade-in"), typeof f == "function" && f();
              }, 2e3);
            }, E.fadeOut = function(S, f) {
              S.classList.add("jfade-out"), setTimeout(function() {
                S.style.display = "none", S.classList.remove("jfade-out"), typeof f == "function" && f();
              }, 1e3);
            }, E;
          }
          var N = M();
          function T() {
            var E = {};
            E.now = function(te, P) {
              var L = null, q = null, Q = null, le = null, he = null, me = null;
              return Array.isArray(te) ? (L = te[0], q = te[1], Q = te[2], le = te[3], he = te[4], me = te[5]) : (te || (te = /* @__PURE__ */ new Date()), L = te.getFullYear(), q = te.getMonth() + 1, Q = te.getDate(), le = te.getHours(), he = te.getMinutes(), me = te.getSeconds()), P == !0 ? l.two(L) + "-" + l.two(q) + "-" + l.two(Q) : l.two(L) + "-" + l.two(q) + "-" + l.two(Q) + " " + l.two(le) + ":" + l.two(he) + ":" + l.two(me);
            }, E.toArray = function(te) {
              var L = te.split(te.indexOf("T") !== -1 ? "T" : " "), P = L[1], L = L[0].split("-"), q = parseInt(L[0]), Q = parseInt(L[1]), le = parseInt(L[2]), he = 0, me = 0;
              return P && (P = P.split(":"), he = parseInt(P[0]), me = parseInt(P[1])), [q, Q, le, he, me, 0];
            };
            var S = Date.UTC(1900, 0, 0), f = Date.UTC(1900, 1, 29), r = 864e5;
            E.dateToNum = function(te) {
              typeof te == "string" && (te = /* @__PURE__ */ new Date(te + "  GMT+0"));
              var P = te.getTime();
              return P >= f && (P += r), P -= S, P / r;
            }, E.numToDate = function(te) {
              var P = S + te * r;
              P >= f && (P -= r);
              const L = new Date(P);
              var q = [
                L.getUTCFullYear(),
                L.getUTCMonth() + 1,
                L.getUTCDate(),
                L.getUTCHours(),
                L.getUTCMinutes(),
                L.getUTCSeconds()
              ];
              return E.now(q);
            };
            let H = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], re = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return Object.defineProperty(E, "weekdays", {
              get: function() {
                return H.map(function(te) {
                  return o.translate(te);
                });
              }
            }), Object.defineProperty(E, "weekdaysShort", {
              get: function() {
                return H.map(function(te) {
                  return o.translate(te).substring(0, 3);
                });
              }
            }), Object.defineProperty(E, "months", {
              get: function() {
                return re.map(function(te) {
                  return o.translate(te);
                });
              }
            }), Object.defineProperty(E, "monthsShort", {
              get: function() {
                return re.map(function(te) {
                  return o.translate(te).substring(0, 3);
                });
              }
            }), E;
          }
          var I = T();
          function O() {
            var E = {
              // Text
              text: ["@"],
              // Currency tokens
              currency: ["#(.{1})##0?(.{1}0+)?( ?;(.*)?)?", "#"],
              // Scientific
              scientific: ["0{1}(.{1}0+)?E{1}\\+0+"],
              // Percentage
              percentage: ["0{1}(.{1}0+)?%"],
              // Number
              numeric: ["0{1}(.{1}0+)?"],
              // Data tokens
              datetime: ["YYYY", "YYY", "YY", "MMMMM", "MMMM", "MMM", "MM", "DDDDD", "DDDD", "DDD", "DD", "DY", "DAY", "WD", "D", "Q", "MONTH", "MON", "HH24", "HH12", "HH", "\\[H\\]", "H", "AM/PM", "MI", "SS", "MS", "Y", "M"],
              // Other
              general: ["A", "0", "[0-9a-zA-Z$]+", "."]
            }, S = function() {
              if (this.mask.toLowerCase().indexOf("[h]") !== -1) {
                var C = 0;
                this.date[4] && (C = parseFloat(this.date[4] / 60));
                var F = parseInt(this.date[3]) + C;
                F /= 24;
              } else !(this.date[0] && this.date[1] && this.date[2]) && (this.date[3] || this.date[4]) ? F = l.two(this.date[3]) + ":" + l.two(this.date[4]) + ":" + l.two(this.date[5]) : (this.date[0] && this.date[1] && !this.date[2] && (this.date[2] = 1), F = l.two(this.date[0]) + "-" + l.two(this.date[1]) + "-" + l.two(this.date[2]), (this.date[3] || this.date[4] || this.date[5]) && (F += " " + l.two(this.date[3]) + ":" + l.two(this.date[4]) + ":" + l.two(this.date[5])));
              return F;
            }, f = function() {
              var C = "";
              if (!(this.date[0] && this.date[1] && this.date[2]) && (this.date[3] || this.date[4])) {
                if (this.mask.toLowerCase().indexOf("[h]") !== -1)
                  C = parseInt(this.date[3]);
                else {
                  let Z = parseInt(this.date[3]);
                  Z < 13 && this.values.indexOf("PM") !== -1 ? C = (Z + 12) % 24 : C = Z % 24;
                }
                this.date[4] && (C += parseFloat(this.date[4] / 60)), this.date[5] && (C += parseFloat(this.date[5] / 3600)), C /= 24;
              } else if (this.date[0] || this.date[1] || this.date[2] || this.date[3] || this.date[4] || this.date[5]) {
                this.date[0] && this.date[1] && !this.date[2] && (this.date[2] = 1);
                var F = I.now(this.date);
                C = I.dateToNum(F);
              }
              return isNaN(C) && (C = ""), C;
            }, r = function(C) {
              return C === null || C === "" || C === void 0;
            }, H = function(C) {
              var F = ("" + C)[0];
              return F == "=";
            }, re = function(C) {
              return C === "currency" || C === "percentage" || C === "scientific" || C === "numeric";
            }, te = function(C) {
              if (C && Number(C) == C)
                return ".";
              if (this.options.decimal)
                return this.options.decimal;
              if (this.locale) {
                var F = Intl.NumberFormat(this.locale).format(1.1);
                return this.options.decimal = F[1];
              } else {
                C || (C = this.mask);
                var Z = new RegExp("0{1}(.{1})0+", "ig"), F = Z.exec(C);
                if (F && F[1] && F[1].length == 1)
                  return this.options.decimal = F[1], F[1];
                var Z = new RegExp("#{1}(.{1})#+", "ig"), F = Z.exec(C);
                F && F[1] && F[1].length == 1 ? F[1] === "," ? this.options.decimal = "." : this.options.decimal = "," : this.options.decimal = "1.1".toLocaleString().substring(1, 2);
              }
              return this.options.decimal ? this.options.decimal : null;
            }, P = function(C, F) {
              if (C == "")
                return "";
              F || (F = te.call(this)), C = ("" + C).split(F);
              var Z = C[0].match(/[-]+/g);
              if (Z && Z.length ? Z = !0 : Z = !1, C[0] = C[0].match(/[0-9]+/g), C[0] ? (Z && C[0].unshift("-"), C[0] = C[0].join("")) : Z && (C[0] = "-"), C[0] || C[1])
                C[1] !== void 0 && (C[1] = C[1].match(/[0-9]+/g), C[1] ? C[1] = C[1].join("") : C[1] = "");
              else
                return "";
              return C;
            }, L = function(C, F) {
              if (C === "")
                return "";
              var Z = te.call(this), fe = this.options;
              if (C = P.call(this, C), C === "")
                return "";
              var J = null;
              if (C[0] && (fe.style === "percent" ? J = parseFloat(C[0]) / 100 : J = parseFloat(C[0] + ".1")), (C[0] === "-" || C[0] === "-00") && !C[1] && F && F.inputType == "deleteContentBackward")
                return "";
              var pe = new Intl.NumberFormat(this.locale, fe).format(J);
              if (pe = pe.split(Z), fe.style === "percent" && pe[0].indexOf("%") !== -1 && (pe[0] = pe[0].replace("%", ""), pe[2] = "%"), typeof pe[1] < "u") {
                var Ee = pe[1].replace(/[0-9]*/g, "");
                Ee && (pe[2] = Ee);
              }
              return C[1] !== void 0 ? pe[1] = Z + C[1] : pe[1] = "", pe.join("");
            }, q = function(C, F) {
              var Z = he.call(C);
              if (Z) {
                var fe = L.call(this, Z, F), J = fe.length - Z.length, pe = le.call(C) + J;
                he.call(C, fe, pe, !0);
              }
            }, Q = function(C) {
              var F = P.call(this, C);
              return F ? (F[0] === "-" && (F[0] = "-0"), parseFloat(F.join("."))) : null;
            }, le = function(C, F) {
              if (C === void 0)
                if (this.tagName == "DIV") {
                  var Z = 0, fe = window.getSelection();
                  if (fe && fe.rangeCount !== 0) {
                    var J = fe.getRangeAt(0), pe = J.cloneRange();
                    pe.selectNodeContents(this), pe.setEnd(J.endContainer, J.endOffset), Z = pe.toString().length;
                  }
                  return Z;
                } else
                  return this.selectionStart;
              else {
                var Ee = he.call(this);
                if (F) {
                  for (var pe = null, ne = 0; ne < Ee.length; ne++)
                    (Ee[ne].match(/[\-0-9]/g) || Ee[ne] === "." || Ee[ne] === ",") && (pe = ne);
                  pe === null && (pe = Ee.indexOf(" ")), C >= pe && (C = pe + 1);
                }
                if (C > Ee.length && (C = Ee.length), C)
                  if (this.tagName == "DIV") {
                    var fe = window.getSelection(), J = document.createRange();
                    this.childNodes[0] && (J.setStart(this.childNodes[0], C), fe.removeAllRanges(), fe.addRange(J));
                  } else
                    this.selectionStart = C, this.selectionEnd = C;
              }
            }, he = function(C, F, Z) {
              if (this.tagName == "DIV")
                if (C === void 0) {
                  var C = this.innerText;
                  return this.value && this.value.length > C.length && (C = this.value), C;
                } else
                  this.innerText !== C && (this.innerText = C, F && le.call(this, F, Z));
              else {
                if (C === void 0)
                  return this.value;
                this.value !== C && (this.value = C, F && le.call(this, F, Z));
              }
            }, me = I.weekdays, we = I.weekdaysShort, Le = I.months, De = I.monthsShort, Te = {
              YEAR: function(C, F) {
                var Z = "" + (/* @__PURE__ */ new Date()).getFullYear();
                if (typeof this.values[this.index] > "u" && (this.values[this.index] = ""), parseInt(C) >= 0 && parseInt(C) <= 10 && this.values[this.index].length < F && (this.values[this.index] += C), this.values[this.index].length == F) {
                  if (F == 2)
                    var Z = Z.substr(0, 2) + this.values[this.index];
                  else if (F == 3)
                    var Z = Z.substr(0, 1) + this.values[this.index];
                  else if (F == 4)
                    var Z = this.values[this.index];
                  this.date[0] = Z, this.index++;
                }
              },
              YYYY: function(C) {
                Te.YEAR.call(this, C, 4);
              },
              YYY: function(C) {
                Te.YEAR.call(this, C, 3);
              },
              YY: function(C) {
                Te.YEAR.call(this, C, 2);
              },
              FIND: function(C, F) {
                if (r(this.values[this.index]) && (this.values[this.index] = ""), this.event && this.event.inputType && this.event.inputType.indexOf("delete") > -1) {
                  this.values[this.index] += C;
                  return;
                }
                for (var Z = 0, fe = 0, J = (this.values[this.index] + C).toLowerCase(), pe = 0; pe < F.length; pe++)
                  F[pe].toLowerCase().indexOf(J) == 0 && (Z = pe, fe++);
                if (fe > 1)
                  this.values[this.index] += C;
                else if (fe == 1) {
                  var Ee = F[Z].length - this.values[this.index].length - 1;
                  return this.position += Ee, this.values[this.index] = F[Z], this.index++, Z;
                }
              },
              MMM: function(C) {
                var F = Te.FIND.call(this, C, De);
                F !== void 0 && (this.date[1] = F + 1);
              },
              MON: function(C) {
                Te.MMM.call(this, C);
              },
              MMMM: function(C) {
                var F = Te.FIND.call(this, C, Le);
                F !== void 0 && (this.date[1] = F + 1);
              },
              MONTH: function(C) {
                Te.MMMM.call(this, C);
              },
              MMMMM: function(C) {
                r(this.values[this.index]) && (this.values[this.index] = "");
                for (var F = (this.values[this.index] + C).toLowerCase(), Z = 0; Z < Le.length; Z++)
                  if (Le[Z][0].toLowerCase().indexOf(F) == 0) {
                    this.values[this.index] = Le[Z][0], this.date[1] = Z + 1, this.index++;
                    break;
                  }
              },
              MM: function(C) {
                r(this.values[this.index]) ? parseInt(C) > 1 && parseInt(C) < 10 ? (this.date[1] = this.values[this.index] = "0" + C, this.index++) : parseInt(C) < 2 && (this.values[this.index] = C) : this.values[this.index] == 1 && parseInt(C) < 3 ? (this.date[1] = this.values[this.index] += C, this.index++) : this.values[this.index] == 0 && parseInt(C) > 0 && parseInt(C) < 10 && (this.date[1] = this.values[this.index] += C, this.index++);
              },
              M: function(C) {
                var F = !1;
                if (parseInt(C) >= 0 && parseInt(C) < 10)
                  if (r(this.values[this.index]))
                    this.values[this.index] = C, C > 1 && (this.date[1] = this.values[this.index], this.index++);
                  else if (this.values[this.index] == 1 && parseInt(C) < 3)
                    this.date[1] = this.values[this.index] += C, this.index++;
                  else if (this.values[this.index] == 0 && parseInt(C) > 0)
                    this.date[1] = this.values[this.index] += C, this.index++;
                  else
                    var F = !0;
                else
                  var F = !0;
                if (F == !0) {
                  var Z = parseInt(this.values[this.index]);
                  Z > 0 && Z < 12 && (this.date[1] = this.values[this.index], this.index++, this.position--);
                }
              },
              D: function(C) {
                var F = !1;
                if (parseInt(C) >= 0 && parseInt(C) < 10)
                  if (r(this.values[this.index]))
                    this.values[this.index] = C, parseInt(C) > 3 && (this.date[2] = this.values[this.index], this.index++);
                  else if (this.values[this.index] == 3 && parseInt(C) < 2)
                    this.date[2] = this.values[this.index] += C, this.index++;
                  else if (this.values[this.index] == 1 || this.values[this.index] == 2)
                    this.date[2] = this.values[this.index] += C, this.index++;
                  else if (this.values[this.index] == 0 && parseInt(C) > 0)
                    this.date[2] = this.values[this.index] += C, this.index++;
                  else
                    var F = !0;
                else
                  var F = !0;
                if (F == !0) {
                  var Z = parseInt(this.values[this.index]);
                  Z > 0 && Z < 32 && (this.date[2] = this.values[this.index], this.index++, this.position--);
                }
              },
              DD: function(C) {
                r(this.values[this.index]) ? parseInt(C) > 3 && parseInt(C) < 10 ? (this.date[2] = this.values[this.index] = "0" + C, this.index++) : parseInt(C) < 10 && (this.values[this.index] = C) : this.values[this.index] == 3 && parseInt(C) < 2 ? (this.date[2] = this.values[this.index] += C, this.index++) : (this.values[this.index] == 1 || this.values[this.index] == 2) && parseInt(C) < 10 ? (this.date[2] = this.values[this.index] += C, this.index++) : this.values[this.index] == 0 && parseInt(C) > 0 && parseInt(C) < 10 && (this.date[2] = this.values[this.index] += C, this.index++);
              },
              DDD: function(C) {
                Te.FIND.call(this, C, we);
              },
              DY: function(C) {
                Te.DDD.call(this, C);
              },
              DDDD: function(C) {
                Te.FIND.call(this, C, me);
              },
              DAY: function(C) {
                Te.DDDD.call(this, C);
              },
              HH12: function(C, F) {
                var Z = !1;
                if (parseInt(C) >= 0 && parseInt(C) < 10)
                  if (r(this.values[this.index]))
                    parseInt(C) > 1 && parseInt(C) < 10 ? (F && (C = 0 + C), this.date[3] = this.values[this.index] = C, this.index++) : parseInt(C) < 10 && (this.values[this.index] = C);
                  else if (this.values[this.index] == 1 && parseInt(C) < 3)
                    this.date[3] = this.values[this.index] += C, this.index++;
                  else if (this.values[this.index] < 1 && parseInt(C) < 10)
                    this.date[3] = this.values[this.index] += C, this.index++;
                  else
                    var Z = !0;
                else
                  var Z = !0;
                if (Z == !0) {
                  var fe = parseInt(this.values[this.index]);
                  fe >= 0 && fe <= 12 && (this.date[3] = this.values[this.index], this.index++, this.position--);
                }
              },
              HH24: function(C, F) {
                var Z = !1;
                if (parseInt(C) >= 0 && parseInt(C) < 10)
                  if (this.values[this.index] == null || this.values[this.index] == "")
                    parseInt(C) > 2 && parseInt(C) < 10 ? (F && (C = 0 + C), this.date[3] = this.values[this.index] = C, this.index++) : parseInt(C) < 10 && (this.values[this.index] = C);
                  else if (this.values[this.index] == 2 && parseInt(C) < 4)
                    !F && this.values[this.index] === "0" && (this.values[this.index] = ""), this.date[3] = this.values[this.index] += C, this.index++;
                  else if (this.values[this.index] < 2 && parseInt(C) < 10)
                    !F && this.values[this.index] === "0" && (this.values[this.index] = ""), this.date[3] = this.values[this.index] += C, this.index++;
                  else
                    var Z = !0;
                else
                  var Z = !0;
                if (Z == !0) {
                  var fe = parseInt(this.values[this.index]);
                  fe >= 0 && fe < 24 && (this.date[3] = this.values[this.index], this.index++, this.position--);
                }
              },
              HH: function(C) {
                Te.HH24.call(this, C, 1);
              },
              H: function(C) {
                Te.HH24.call(this, C, 0);
              },
              "\\[H\\]": function(C) {
                this.values[this.index] == null && (this.values[this.index] = ""), C.match(/[0-9]/g) ? this.date[3] = this.values[this.index] += C : this.values[this.index].match(/[0-9]/g) && (this.date[3] = this.values[this.index], this.index++, this.position--);
              },
              N60: function(C, F) {
                this.values[this.index] == null || this.values[this.index] == "" ? parseInt(C) > 5 && parseInt(C) < 10 ? (this.date[F] = this.values[this.index] = "0" + C, this.index++) : parseInt(C) < 10 && (this.values[this.index] = C) : parseInt(C) < 10 && (this.date[F] = this.values[this.index] += C, this.index++);
              },
              MI: function(C) {
                Te.N60.call(this, C, 4);
              },
              SS: function(C) {
                Te.N60.call(this, C, 5);
              },
              "AM/PM": function(C) {
                typeof this.values[this.index] > "u" && (this.values[this.index] = ""), this.values[this.index] === "" ? C.match(/a/i) && this.date[3] < 13 ? this.values[this.index] += "A" : C.match(/p/i) && (this.values[this.index] += "P") : (this.values[this.index] === "A" || this.values[this.index] === "P") && (this.values[this.index] += "M", this.index++);
              },
              WD: function(C) {
                typeof this.values[this.index] > "u" && (this.values[this.index] = ""), parseInt(C) >= 0 && parseInt(C) < 7 && (this.values[this.index] = C), this.values[this.index].length == 1 && this.index++;
              },
              "0{1}(.{1}0+)?": function(C) {
                var F = te.call(this), Z = !1;
                r(this.values[this.index]) ? this.values[this.index] = "" : this.values[this.index] == "-" && (Z = !0);
                var fe = P.call(this, this.values[this.index], F);
                fe && (this.values[this.index] = fe.join(F)), parseInt(C) >= 0 && parseInt(C) < 10 ? (this.values[this.index] == "0" && C > 0 ? this.values[this.index] = "" : this.values[this.index] == "-0" && C > 0 && (this.values[this.index] = "-"), (this.values[this.index] != "0" && this.values[this.index] != "-0" || C == F) && (this.values[this.index] += C)) : F && C == F ? this.values[this.index].indexOf(F) == -1 && (this.values[this.index] || (this.values[this.index] = "0"), this.values[this.index] += C) : C == "-" && (Z = !0), Z === !0 && this.values[this.index][0] !== "-" && (this.values[this.index] = "-" + this.values[this.index]);
              },
              "0{1}(.{1}0+)?E{1}\\+0+": function(C) {
                Te["0{1}(.{1}0+)?"].call(this, C);
              },
              "0{1}(.{1}0+)?%": function(C) {
                Te["0{1}(.{1}0+)?"].call(this, C), this.values[this.index].match(/[\-0-9]/g) ? this.values[this.index] && this.values[this.index].indexOf("%") == -1 && (this.values[this.index] += "%") : this.values[this.index] = "";
              },
              "#(.{1})##0?(.{1}0+)?( ?;(.*)?)?": function(C) {
                Te["0{1}(.{1}0+)?"].call(this, C);
                var F = te.call(this), Z = this.tokens[this.index].substr(1, 1), fe = this.values[this.index][0] === "-", J = P.call(this, this.values[this.index], F);
                if (J !== "") {
                  var pe = J[0].match(/[0-9]/g);
                  if (pe) {
                    pe = pe.join("");
                    for (var Ee = [], ne = 0, ce = pe.length - 1; ce >= 0; ce--)
                      Ee.push(pe[ce]), ne++, ne % 3 || Ee.push(Z);
                    Ee = Ee.reverse(), J[0] = Ee.join(""), J[0].substr(0, 1) == Z && (J[0] = J[0].substr(1));
                  } else
                    J[0] = "";
                  this.values[this.index] = J.join(F), fe && (this.values[this.index] = "-" + this.values[this.index]);
                }
              },
              0: function(C) {
                C.match(/[0-9]/g) && (this.values[this.index] = C, this.index++);
              },
              "[0-9a-zA-Z$]+": function(C) {
                r(this.values[this.index]) && (this.values[this.index] = "");
                var F = this.tokens[this.index], Z = this.values[this.index], fe = Z.length;
                F[fe] == C ? (this.values[this.index] += C, this.values[this.index] == F && this.index++) : (this.values[this.index] = F, this.index++, C.match(/[\-0-9]/g) && this.position--);
              },
              A: function(C) {
                C.match(/[a-zA-Z]/gi) && (this.values[this.index] = C, this.index++);
              },
              ".": function(C) {
                Te["[0-9a-zA-Z$]+"].call(this, C);
              },
              "@": function(C) {
                r(this.values[this.index]) && (this.values[this.index] = ""), this.values[this.index] += C;
              }
            }, Xe = function(C) {
              if (this.type == "general")
                var F = [].concat(E.general);
              else
                var F = [].concat(E.currency, E.datetime, E.percentage, E.scientific, E.numeric, E.text, E.general);
              var Z = new RegExp(F.join("|"), "gi");
              return C.match(Z);
            }, qe = function(C) {
              if (this.type)
                if (this.type == "text")
                  var F = ["text"];
                else if (this.type == "general")
                  var F = ["general"];
                else if (this.type == "datetime")
                  var F = ["numeric", "datetime", "general"];
                else
                  var F = ["currency", "percentage", "scientific", "numeric", "general"];
              else var F = Object.keys(E);
              for (var Z = 0; Z < F.length; Z++)
                for (var fe = F[Z], J = 0; J < E[fe].length; J++) {
                  var pe = new RegExp(E[fe][J], "gi"), Ee = C.match(pe);
                  if (Ee)
                    return { type: fe, method: E[fe][J] };
                }
            }, se = function(C) {
              for (var F = [], Z = 0; Z < C.length; Z++) {
                var fe = qe.call(this, C[Z]);
                fe ? F.push(fe.method) : F.push(null);
              }
              for (var Z = 0; Z < F.length; Z++)
                F[Z] == "MM" && (F[Z - 1] && F[Z - 1].indexOf("H") >= 0 || F[Z - 2] && F[Z - 2].indexOf("H") >= 0 || F[Z + 1] && F[Z + 1].indexOf("S") >= 0 || F[Z + 2] && F[Z + 2].indexOf("S") >= 0) && (F[Z] = "MI");
              return F;
            }, ve = function(C) {
              var F = qe.call(this, C);
              if (F)
                var Z = F.type;
              if (Z) {
                for (var fe = 0, J = Xe.call(this, C), pe = 0; pe < J.length; pe++)
                  F = qe.call(this, J[pe]), F && re(F.type) && fe++;
                fe > 1 && (Z = "general");
              }
              return Z;
            }, je = function() {
              typeof Te[this.methods[this.index]] == "function" ? (Te[this.methods[this.index]].call(this, this.value[this.position]), this.position++) : (this.values[this.index] = this.tokens[this.index], this.index++);
            }, X = function(C) {
              return ("" + +C).replace(
                /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
                function(F, Z, fe, J, pe) {
                  return pe < 0 ? Z + "0." + Array(1 - pe - fe.length).join(0) + fe + J : Z + fe + J + Array(pe - J.length + 1).join(0);
                }
              );
            }, ee = function(C, F, Z) {
              var fe = null, J = {
                // Element
                input: null,
                // Current value
                value: null,
                // Mask options
                options: {},
                // New values for each token found
                values: [],
                // Token position
                index: 0,
                // Character position
                position: 0,
                // Date raw values
                date: [0, 0, 0, 0, 0, 0],
                // Raw number for the numeric values
                number: 0
              };
              if (typeof C == "object") {
                if (J.input = C.target, J.value = he.call(C.target), J.caret = le.call(C.target), (fe = C.target.getAttribute("data-mask")) && (J.mask = fe), (fe = C.target.getAttribute("data-type")) && (J.type = fe), C.target.mask ? (C.target.mask.options && (J.options = C.target.mask.options), C.target.mask.locale && (J.locale = C.target.mask.locale)) : (fe = C.target.getAttribute("data-locale")) && (J.locale = fe, J.mask && (J.options.style = J.mask)), C.target.attributes && C.target.attributes.length)
                  for (var pe = 0; pe < C.target.attributes.length; pe++) {
                    var Ee = C.target.attributes[pe].name, ne = C.target.attributes[pe].value;
                    Ee.substr(0, 4) == "data" && (J.options[Ee.substr(5)] = ne);
                  }
              } else {
                if (typeof F == "string")
                  J.mask = F;
                else
                  for (var Ee = Object.keys(F), pe = 0; pe < Ee.length; pe++)
                    J[Ee[pe]] = F[Ee[pe]];
                typeof C == "number" && (te.call(J, J.mask), C = ("" + C).replace(".", J.options.decimal)), J.value = C, J.input && (he.call(J.input, C), l.focus(J.input), J.caret = le.call(J.input));
              }
              if (!H(J.value) && (J.mask || J.locale)) {
                if (J.mask) {
                  if (J.mask = J.mask.replace(new RegExp(/\[h]/), "|h|"), J.mask = J.mask.replace(new RegExp(/\[.*?\]/), ""), J.mask = J.mask.replace(new RegExp(/\|h\|/), "[h]"), J.mask.indexOf(";") !== -1) {
                    var fe = J.mask.split(";");
                    J.mask = fe[0];
                  }
                  if (J.mask.indexOf("##") !== -1) {
                    var ce = J.mask.split(";");
                    ce[0] && (typeof C == "object" && (ce[0] = ce[0].replace(new RegExp(/_\)/g), ""), ce[0] = ce[0].replace(new RegExp(/_\(/g), "")), ce[0] = ce[0].replace("*", "	"), ce[0] = ce[0].replace(new RegExp(/_-/g), ""), ce[0] = ce[0].replace(new RegExp(/_/g), ""), ce[0] = ce[0].replace(new RegExp(/"/g), ""), ce[0] = ce[0].replace("##0.###", "##0.000"), ce[0] = ce[0].replace("##0.##", "##0.00"), ce[0] = ce[0].replace("##0.#", "##0.0"), ce[0] = ce[0].replace("##0,###", "##0,000"), ce[0] = ce[0].replace("##0,##", "##0,00"), ce[0] = ce[0].replace("##0,#", "##0,0")), J.mask = ce[0];
                  }
                  if (J.mask.indexOf("\\") !== -1) {
                    var ce = J.mask.split(";");
                    ce[0] = ce[0].replace(new RegExp(/\\/g), ""), J.mask = ce[0];
                  }
                  J.type || (J.type = ve.call(J, J.mask)), J.tokens = Xe.call(J, J.mask);
                }
                if (typeof C != "object" || !C.inputType || !C.inputType.indexOf("insert") || !C.inputType.indexOf("delete"))
                  if (J.locale)
                    if (J.input)
                      q.call(J, J.input, C);
                    else
                      var ke = L.call(J, J.value);
                  else {
                    for (J.methods = se.call(J, J.tokens), J.event = C; J.position < J.value.length && typeof J.tokens[J.index] < "u"; )
                      je.call(J);
                    var ke = J.values.join("");
                    if (re(J.type) && ke !== "") {
                      for (; typeof J.tokens[J.index] < "u"; ) {
                        var fe = qe.call(J, J.tokens[J.index]);
                        fe && fe.type == "general" && (J.values[J.index] = J.tokens[J.index]), J.index++;
                      }
                      var Ae = !0;
                    } else
                      var Ae = !1;
                    if (ke = J.values.join(""), J.input) {
                      if (fe = ke.length - J.value.length, fe > 0)
                        var ze = J.caret + fe;
                      else
                        var ze = J.caret;
                      he.call(J.input, ke, ze, Ae);
                    }
                  }
                if (J.input) {
                  var We = null;
                  if (re(J.type)) {
                    let Ze = he.call(J.input);
                    J.number = Q.call(J, Ze), J.type == "percentage" && ("" + Ze).indexOf("%") !== -1 ? We = ee.adjustPrecision(J.number / 100) : We = J.number;
                  } else J.type == "datetime" && (We = S.call(J), J.date[0] && J.date[1] && J.date[2] && J.input.setAttribute("data-completed", !0));
                  We && J.input.setAttribute("data-value", We);
                }
                if (ke !== void 0)
                  return Z ? J : ke;
              }
            };
            return ee.adjustPrecision = function(C) {
              if (typeof C == "number" && !Number.isInteger(C)) {
                const F = C.toString().split(".");
                if (F[1] && F[1].length > 10) {
                  let Z = 0;
                  const fe = F[1][F[1].length - 2];
                  if (fe == 0 || fe == 9) {
                    for (let J = F[1].length - 2; J > 0; J--)
                      if (Z >= 0 && F[1][J] == fe) {
                        if (Z++, Z > 6)
                          break;
                      } else {
                        Z = 0;
                        break;
                      }
                    if (Z)
                      return parseFloat(parseFloat(C).toFixed(F[1].length - 1));
                  }
                }
              }
              return C;
            }, ee.getType = ve, ee.prepare = function(C, F) {
              return F || (F = {}), Xe.call(F, C);
            }, ee.apply = function(C) {
              var F = he.call(C.target);
              C.key.length == 1 && (F += C.key), he.call(C.target, ee(F, C.target.getAttribute("data-mask")));
            }, ee.run = function(C, F, Z) {
              return ee(C, { mask: F, decimal: Z });
            }, ee.extract = function(C, F, Z) {
              if (r(C) || typeof F != "object")
                return C;
              if (F = Object.assign({}, F), F.options || (F.options = {}), !F.mask && F.format && (F.mask = F.format), F.mask) {
                if (F.mask.indexOf(";") !== -1) {
                  var fe = F.mask.split(";");
                  F.mask = fe[0];
                }
                F.mask = F.mask.replace(new RegExp(/\[h]/), "|h|"), F.mask = F.mask.replace(new RegExp(/\[.*?\]/), ""), F.mask = F.mask.replace(new RegExp(/\|h\|/), "[h]");
              }
              te.call(F, F.mask);
              var J = null, pe = null;
              if (F.type == "percent" || F.options.style == "percent" ? J = "percentage" : F.mask && (J = ve.call(F, F.mask)), J === "text") {
                var Ee = {};
                pe = C;
              } else if (J === "general") {
                var Ee = ee(C, F, !0);
                pe = C;
              } else if (J === "datetime") {
                C instanceof Date && (C = ee.getDateString(C, F.mask));
                var Ee = ee(C, F, !0);
                l.isNumeric(C) ? pe = C : pe = f.call(Ee);
              } else if (J === "scientific") {
                pe = C, typeof C == "string" && (pe = Number(pe));
                var Ee = F;
              } else {
                pe = Q.call(F, C), J === "percentage" && ("" + C).indexOf("%") !== -1 && (pe /= 100);
                var Ee = F;
              }
              return Ee.value = pe, !Ee.type && J && (Ee.type = J), Z ? Ee : pe;
            }, ee.render = function(C, F, Z, fe) {
              if (r(C) || typeof F != "object")
                return C;
              if (F = Object.assign({}, F), F.options || (F.options = {}), !F.mask && F.format && (F.mask = F.format), F.mask) {
                if (F.mask.indexOf(";") !== -1) {
                  var J = F.mask.split(";");
                  Z || (J[0] = J[0].replace(new RegExp(/_\)/g), ""), J[0] = J[0].replace(new RegExp(/_\(/g), "")), F.mask = J[0];
                }
                F.mask = F.mask.replace(new RegExp(/\[h]/), "|h|"), F.mask = F.mask.replace(new RegExp(/\[.*?\]/), ""), F.mask = F.mask.replace(new RegExp(/\|h\|/), "[h]");
              }
              var pe = null;
              F.type == "percent" || F.options.style == "percent" ? pe = "percentage" : F.mask ? pe = ve.call(F, F.mask) : C instanceof Date && (pe = "datetime");
              var Ee = !1;
              if (pe == "datetime" || F.type == "calendar") {
                var J = ee.getDateString(C, F.mask);
                J && (C = J), F.mask && Z && (Ee = !0);
              } else if (pe === "text")
                typeof C == "number" && (C = C.toString());
              else if (typeof C == "string" && s.isNumeric(C) && (C = Number(C)), pe === "percentage" && (C = ee.adjustPrecision(C * 100)), typeof C == "number") {
                var J = null;
                if (F.mask && Z) {
                  var ne = te.call(F, F.mask);
                  if (pe === "scientific")
                    if (F.mask.indexOf(ne) !== -1) {
                      let Ke = F.mask.split("E");
                      Ke = Ke[0].split(ne), Ke = "" + Ke[1].match(/[0-9]+/g), Ke = Ke.length, J = C.toExponential(Ke);
                    } else
                      J = C.toExponential(0);
                  else {
                    if (F.mask.indexOf(ne) !== -1) {
                      ne = F.mask.split(ne), ne = "" + ne[1].match(/[0-9]+/g), ne = ne.length, J = C.toFixed(ne);
                      let Ke = C.toString().split("."), nt = Ke[1];
                      nt && nt.length > ne && nt[nt.length - 1] === "5" && (J = parseFloat(Ke[0] + "." + nt + "1").toFixed(ne));
                    } else
                      J = C.toFixed(0);
                    ("" + J).indexOf("e") !== -1 && (J = X(J));
                  }
                } else if (F.locale && Z) {
                  var ne = ("" + C).split(".");
                  if (F.options) {
                    typeof ne[1] > "u" && (ne[1] = "");
                    var ke = ne[1].length;
                    if (F.options.minimumFractionDigits > ke)
                      for (var ce = 0; ce < F.options.minimumFractionDigits - ke; ce++)
                        ne[1] += "0";
                  }
                  ne[1].length ? J = ne.join(".") : J = ne[0];
                  var ke = ne[1].length;
                  F.options && F.options.maximumFractionDigits < ke && (J = parseFloat(J).toFixed(F.options.maximumFractionDigits));
                } else
                  J = X(C);
                J !== null && (C = J, te.call(F, F.mask), F.options.decimal && (C = C.replace(".", F.options.decimal)));
              } else
                F.mask && Z && (Ee = !0);
              if (Ee) {
                var Ae = F.mask.length - C.length;
                if (Ae > 0)
                  for (var ce = 0; ce < Ae; ce++)
                    C += " ";
              }
              if (pe === "scientific")
                if (!Z)
                  C = X(C);
                else
                  return C;
              if (pe === "numeric" && fe === !1 && typeof C == "string")
                return C;
              if (C = ee(C, F), Z && pe === "numeric") {
                var ze = F.mask.match(new RegExp(/^[0]+$/gm));
                if (ze && ze.length === 1) {
                  var We = ze[0].length;
                  if (We > 3)
                    for (C = "" + C; C.length < We; )
                      C = "0" + C;
                }
              }
              return C;
            }, ee.set = function(C, F) {
              if (F) {
                C.setAttribute("data-mask", F);
                var Z = new Event("input", {
                  bubbles: !0,
                  cancelable: !0
                });
                C.dispatchEvent(Z);
              }
            }, ee.extractDateFromString = function(C, F) {
              var Z = ee(C, { mask: F }, !0);
              if (C > 0 && Number(C) == C && (Z.values.join("") !== Z.value || Z.type == "numeric")) {
                var fe = new Date(Math.round((C - 25569) * 86400 * 1e3));
                return fe.getFullYear() + "-" + l.two(fe.getMonth()) + "-" + l.two(fe.getDate()) + " 00:00:00";
              }
              var J = !1;
              return Z.values && Z.values.length === Z.tokens.length && Z.values[Z.values.length - 1].length >= Z.tokens[Z.tokens.length - 1].length && (J = !0), Z.date[0] && Z.date[1] && (Z.date[2] || J) ? (Z.date[2] || (Z.date[2] = 1), Z.date[0] + "-" + l.two(Z.date[1]) + "-" + l.two(Z.date[2]) + " " + l.two(Z.date[3]) + ":" + l.two(Z.date[4]) + ":" + l.two(Z.date[5])) : "";
            }, ee.getDateString = function(C, F) {
              if (!F)
                var F = {};
              if (F && typeof F == "object") {
                if (F.format)
                  var Z = F.format;
                else if (F.mask)
                  var Z = F.mask;
              } else
                var Z = F;
              if (Z || (Z = "YYYY-MM-DD"), Z.indexOf("[h]") >= 0) {
                var fe = 0;
                if (C && l.isNumeric(C) && (fe = parseFloat(24 * Number(C)), Z.indexOf("mm") >= 0)) {
                  var J = ("" + fe).split(".");
                  if (J[1]) {
                    var pe = 60 * parseFloat("0." + J[1]);
                    pe = parseFloat(pe.toFixed(2));
                  } else
                    var pe = 0;
                  fe = parseInt(J[0]) + ":" + l.two(pe);
                }
                return fe;
              }
              C instanceof Date ? C = I.now(C) : C && l.isNumeric(C) && (C = I.numToDate(C));
              for (var Ee = ["DAY", "WD", "DDDD", "DDD", "DD", "D", "Q", "HH24", "HH12", "HH", "H", "AM/PM", "MI", "SS", "MS", "YYYY", "YYY", "YY", "Y", "MONTH", "MON", "MMMMM", "MMMM", "MMM", "MM", "M", "."], ne = new RegExp(Ee.join("|"), "gi"), ce = Z.match(ne), ke = 0; ke < ce.length; ke++)
                ce[ke].toUpperCase() == "MM" && (ce[ke - 1] && ce[ke - 1].toUpperCase().indexOf("H") >= 0 || ce[ke - 2] && ce[ke - 2].toUpperCase().indexOf("H") >= 0 || ce[ke + 1] && ce[ke + 1].toUpperCase().indexOf("S") >= 0 || ce[ke + 2] && ce[ke + 2].toUpperCase().indexOf("S") >= 0) && (ce[ke] = "mi");
              var Ae = {
                tokens: ce
              };
              if (C) {
                var pe = "" + C, ze = pe.indexOf("T") !== -1 ? "T" : " ";
                pe = pe.split(ze);
                var J = 0, We = 0, Ze = 0;
                pe[1] && (J = pe[1].split(":"), We = J[1] ? J[1] : 0, Ze = J[2] ? J[2] : 0, J = J[0] ? J[0] : 0), pe = pe[0].split("-");
                let bt = new Date(pe[0], pe[1], 0).getDate();
                if (pe[0] && pe[1] && pe[2] && pe[0] > 0 && pe[1] > 0 && pe[1] < 13 && pe[2] > 0 && pe[2] <= bt) {
                  Ae.data = [pe[0], pe[1], pe[2], J, We, Ze], Ae.value = [];
                  for (var Ke = new Date(Ae.data[0], Ae.data[1] - 1, Ae.data[2], Ae.data[3], Ae.data[4], Ae.data[5]), nt = function(vt) {
                    var yt = this.tokens[vt], lt = yt.toUpperCase(), Je = null;
                    lt === "YYYY" ? Je = this.data[0] : lt === "YYY" ? Je = this.data[0].substring(1, 4) : lt === "YY" ? Je = this.data[0].substring(2, 4) : lt === "Y" ? Je = this.data[0].substring(3, 4) : yt === "MON" ? Je = I.months[Ke.getMonth()].substr(0, 3).toUpperCase() : yt === "mon" ? Je = I.months[Ke.getMonth()].substr(0, 3).toLowerCase() : yt === "MONTH" ? Je = I.months[Ke.getMonth()].toUpperCase() : yt === "month" ? Je = I.months[Ke.getMonth()].toLowerCase() : lt === "MMMMM" ? Je = I.months[Ke.getMonth()].substr(0, 1) : lt === "MMMM" || yt === "Month" ? Je = I.months[Ke.getMonth()] : lt === "MMM" || yt == "Mon" ? Je = I.months[Ke.getMonth()].substr(0, 3) : lt === "MM" ? Je = l.two(this.data[1]) : lt === "M" ? Je = Ke.getMonth() + 1 : yt === "DAY" ? Je = I.weekdays[Ke.getDay()].toUpperCase() : yt === "day" ? Je = I.weekdays[Ke.getDay()].toLowerCase() : lt === "DDDD" || yt == "Day" ? Je = I.weekdays[Ke.getDay()] : lt === "DDD" ? Je = I.weekdays[Ke.getDay()].substr(0, 3) : lt === "DD" ? Je = l.two(this.data[2]) : lt === "D" ? Je = parseInt(this.data[2]) : lt === "Q" ? Je = Math.floor((Ke.getMonth() + 3) / 3) : lt === "HH24" || lt === "HH" ? (Je = this.data[3], Je > 12 && this.tokens.indexOf("am/pm") !== -1 && (Je -= 12), Je = l.two(Je)) : lt === "HH12" ? this.data[3] > 12 ? Je = l.two(this.data[3] - 12) : Je = l.two(this.data[3]) : lt === "H" ? (Je = this.data[3], Je > 12 && this.tokens.indexOf("am/pm") !== -1 && (Je -= 12, Je = l.two(Je))) : lt === "MI" ? Je = l.two(this.data[4]) : lt === "SS" ? Je = l.two(this.data[5]) : lt === "MS" ? Je = Ke.getMilliseconds() : lt === "AM/PM" ? this.data[3] >= 12 ? Je = "PM" : Je = "AM" : lt === "WD" && (Je = I.weekdays[Ke.getDay()]), Je === null ? this.value[vt] = this.tokens[vt] : this.value[vt] = Je;
                  }, ke = 0; ke < Ae.tokens.length; ke++)
                    nt.call(Ae, ke);
                  C = Ae.value.join("");
                } else
                  C = "";
              }
              return C;
            }, ee;
          }
          var Y = O();
          function U() {
            var E = (function(S, f) {
              if (S.calendar)
                return S.calendar.setOptions(f, !0);
              var r = { type: "calendar" };
              r.options = {}, r.date = null, r.setOptions = function(X, ee) {
                var C = {
                  // Render type: [ default | year-month-picker ]
                  type: "default",
                  // Restrictions
                  validRange: null,
                  // Starting weekday - 0 for sunday, 6 for saturday
                  startingDay: null,
                  // Date format
                  format: "DD/MM/YYYY",
                  // Allow keyboard date entry
                  readonly: !0,
                  // Today is default
                  today: !1,
                  // Show timepicker
                  time: !1,
                  // Show the reset button
                  resetButton: !0,
                  // Placeholder
                  placeholder: "",
                  // Translations can be done here
                  months: I.monthsShort,
                  monthsFull: I.months,
                  weekdays: I.weekdays,
                  textDone: o.translate("Done"),
                  textReset: o.translate("Reset"),
                  textUpdate: o.translate("Update"),
                  // Value
                  value: null,
                  // Fullscreen (this is automatic set for screensize < 800)
                  fullscreen: !1,
                  // Create the calendar closed as default
                  opened: !1,
                  // Events
                  onopen: null,
                  onclose: null,
                  onchange: null,
                  onupdate: null,
                  // Internal mode controller
                  mode: null,
                  position: null,
                  // Data type
                  dataType: null,
                  // Controls
                  controls: !0,
                  // Auto select
                  autoSelect: !0
                };
                for (var F in C)
                  X && X.hasOwnProperty(F) ? r.options[F] = X[F] : (typeof r.options[F] > "u" || ee === !0) && (r.options[F] = C[F]);
                if (r.options.resetButton == !1 ? L.style.display = "none" : L.style.display = "", r.options.readonly ? S.setAttribute("readonly", "readonly") : S.removeAttribute("readonly"), r.options.placeholder ? S.setAttribute("placeholder", r.options.placeholder) : S.removeAttribute("placeholder"), l.isNumeric(r.options.value) && r.options.value > 0 && (r.options.value = E.numToDate(r.options.value), r.options.dataType = "numeric"), L.innerHTML = r.options.textReset, q.innerHTML = r.options.textDone, qe.innerHTML = r.options.textUpdate, r.options.format && S.setAttribute("data-mask", r.options.format.toLowerCase()), !r.options.value && r.options.today)
                  var Z = E.now();
                else
                  var Z = r.options.value;
                return Z && (r.options.value = null, r.setValue(Z)), r;
              }, r.open = function(X) {
                if (!P.classList.contains("jcalendar-focus") && !P.classList.contains("jcalendar-inline")) {
                  if (E.current = r, D(r, !0), r.getDays(), r.options.type == "year-month-picker" && r.getMonths(), r.options.time && (se.value = r.date[3], ve.value = r.date[4]), P.classList.add("jcalendar-focus"), l.getWindowWidth() < 800 || r.options.fullscreen)
                    P.classList.add("jcalendar-fullsize"), N.slideBottom(le, 1);
                  else {
                    P.classList.remove("jcalendar-fullsize");
                    var ee = S.getBoundingClientRect(), C = le.getBoundingClientRect();
                    if (r.options.position)
                      Q.style.position = "fixed", window.innerHeight < ee.bottom + C.height ? Q.style.top = ee.top - (C.height + 2) + "px" : Q.style.top = ee.top + ee.height + 2 + "px", Q.style.left = ee.left + "px";
                    else {
                      if (window.innerHeight < ee.bottom + C.height) {
                        var F = -1 * (ee.height + C.height + 2);
                        F + ee.top < 0 && (F = -1 * (ee.top + ee.height)), Q.style.top = F + "px";
                      } else
                        Q.style.top = "2px";
                      if (window.innerWidth < ee.left + C.width) {
                        var F = window.innerWidth - (ee.left + C.width + 20);
                        Q.style.left = F + "px";
                      } else
                        Q.style.left = "0px";
                    }
                  }
                  typeof r.options.onopen == "function" && r.options.onopen(S);
                }
              }, r.close = function(X, ee) {
                if (r.options.autoSelect !== !0 && typeof ee > "u" && (ee = !1), P.classList.contains("jcalendar-focus")) {
                  if (ee !== !1) {
                    var C = P.querySelector(".jcalendar-selected");
                    if (typeof ee == "string")
                      var F = ee;
                    else if (!C || C.classList.contains("jcalendar-disabled"))
                      var F = r.options.value;
                    else
                      var F = r.getValue();
                    r.setValue(F);
                  } else {
                    let Z = r.options.value || "";
                    r.options.value = null, r.setValue(Z);
                  }
                  !X && typeof r.options.onclose == "function" && r.options.onclose(S), P.classList.remove("jcalendar-focus"), D(r, !1), E.current = null;
                }
                return r.options.value;
              }, r.prev = function() {
                r.options.mode == "years" ? (r.date[0] = r.date[0] - 12, r.getYears()) : r.options.mode == "months" ? (r.date[0] = parseInt(r.date[0]) - 1, r.getMonths()) : (r.date[1] < 2 ? (r.date[0] = r.date[0] - 1, r.date[1] = 12) : r.date[1] = r.date[1] - 1, r.getDays());
              }, r.next = function() {
                r.options.mode == "years" ? (r.date[0] = parseInt(r.date[0]) + 12, r.getYears()) : r.options.mode == "months" ? (r.date[0] = parseInt(r.date[0]) + 1, r.getMonths()) : (r.date[1] > 11 ? (r.date[0] = parseInt(r.date[0]) + 1, r.date[1] = 1) : r.date[1] = parseInt(r.date[1]) + 1, r.getDays());
              }, r.setToday = function() {
                var X = (/* @__PURE__ */ new Date()).toISOString().substr(0, 10);
                return r.setValue(X), X;
              }, r.setValue = function(X) {
                X || (X = "" + X);
                var ee = X, C = r.options.value;
                if (C != ee) {
                  if (ee) {
                    r.setLabel(ee, r.options);
                    var Z = ee.split(" ");
                    Z[1] || (Z[1] = "00:00:00");
                    var F = Z[1].split(":"), Z = Z[0].split("-"), fe = parseInt(Z[0]), J = parseInt(Z[1]), pe = parseInt(Z[2]), Ee = parseInt(F[0]), ne = parseInt(F[1]);
                    r.date = [fe, J, pe, Ee, ne, 0];
                    var X = r.setLabel(ee, r.options), ce = E.now(new Date(fe, J - 1, pe), !0);
                    if (r.options.validRange) {
                      if (!r.options.validRange[0] || ce >= r.options.validRange[0])
                        var ke = !0;
                      else
                        var ke = !1;
                      if (!r.options.validRange[1] || ce <= r.options.validRange[1])
                        var Ae = !0;
                      else
                        var Ae = !1;
                      ke && Ae ? (S.classList.remove("jcalendar_warning"), S.title = "") : (S.classList.add("jcalendar_warning"), S.title = o.translate("Date outside the valid range"));
                    } else
                      S.classList.remove("jcalendar_warning"), S.title = "";
                  } else {
                    r.date = null;
                    var X = "";
                    S.classList.remove("jcalendar_warning"), S.title = "";
                  }
                  r.options.value = ee, typeof r.options.onchange == "function" && r.options.onchange(S, ee, C), S.value != X && (S.value = X, typeof S.oninput == "function" && S.oninput({
                    type: "input",
                    target: S,
                    value: S.value
                  }));
                }
                r.date && (r.getDays(), r.options.type == "year-month-picker" && r.getMonths());
              }, r.getValue = function() {
                return r.date ? r.options.time ? l.two(r.date[0]) + "-" + l.two(r.date[1]) + "-" + l.two(r.date[2]) + " " + l.two(r.date[3]) + ":" + l.two(r.date[4]) + ":" + l.two(0) : l.two(r.date[0]) + "-" + l.two(r.date[1]) + "-" + l.two(r.date[2]) + " " + l.two(0) + ":" + l.two(0) + ":" + l.two(0) : "";
              }, r.update = function(X, ee) {
                if (!X.classList.contains("jcalendar-disabled")) {
                  var C = P.querySelector(".jcalendar-selected");
                  C && C.classList.remove("jcalendar-selected"), X.classList.add("jcalendar-selected"), X.classList.contains("jcalendar-set-month") ? (r.date[1] = ee, r.date[2] = 1) : r.date[2] = X.innerText, r.options.time ? (r.date[3] = se.value, r.date[4] = ve.value) : r.close(null, !0);
                }
                te();
              }, r.reset = function() {
                r.setValue(""), r.date = null, r.close(!1, !1);
              }, r.getDays = function() {
                r.options.mode = "days";
                var Ee = /* @__PURE__ */ new Date(), X = r.date && l.isNumeric(r.date[0]) ? r.date[0] : parseInt(Ee.getFullYear()), ee = r.date && l.isNumeric(r.date[1]) ? r.date[1] : parseInt(Ee.getMonth()) + 1, C = r.date && l.isNumeric(r.date[2]) ? r.date[2] : parseInt(Ee.getDate()), F = r.date && l.isNumeric(r.date[3]) ? r.date[3] : parseInt(Ee.getHours()), Z = r.date && l.isNumeric(r.date[4]) ? r.date[4] : parseInt(Ee.getMinutes());
                r.date = [X, ee, C, F, Z, 0], he.innerHTML = X, me.innerHTML = r.options.months[ee - 1];
                var fe = Ee.getMonth() == ee - 1 && Ee.getFullYear() == X, J = Ee.getDate(), Ee = new Date(X, ee, 0, 0, 0), pe = Ee.getDate(), Ee = new Date(X, ee - 1, 0, 0, 0), ne = Ee.getDay() + 1, ze = r.options.startingDay || 0;
                ne = ne - ze, Le.innerHTML = "";
                var ce = document.createElement("tr");
                ce.setAttribute("align", "center"), Le.appendChild(ce);
                for (var ke = 0; ke < 7; ke++) {
                  var Ae = document.createElement("td");
                  Ae.classList.add("jcalendar-weekday"), Ae.innerHTML = r.options.weekdays[ze].substr(0, 1), ce.appendChild(Ae), ze++, ze > 6 && (ze = 0);
                }
                for (var ze = 0, We = 0, Ze = 0; Ze < 6; Ze++) {
                  var ce = document.createElement("tr");
                  ce.setAttribute("align", "center"), ce.style.height = "34px";
                  for (var ke = 0; ke < 7; ke++) {
                    var Ae = document.createElement("td");
                    if (Ae.classList.add("jcalendar-set-day"), ze >= ne && ze < ne + pe) {
                      We++, Ae.innerHTML = We, We == C && Ae.classList.add("jcalendar-selected"), fe && J == We && (Ae.style.fontWeight = "bold");
                      var Ke = E.now(new Date(X, ee - 1, We), !0);
                      if (r.options.validRange) {
                        if (!r.options.validRange[0] || Ke >= r.options.validRange[0])
                          var nt = !0;
                        else
                          var nt = !1;
                        if (!r.options.validRange[1] || Ke <= r.options.validRange[1])
                          var Dt = !0;
                        else
                          var Dt = !1;
                        nt && Dt || Ae.classList.add("jcalendar-disabled");
                      }
                    }
                    ce.appendChild(Ae), ze++;
                  }
                  Le.appendChild(ce);
                }
                r.options.time ? Te.style.display = "" : Te.style.display = "none", te();
              }, r.getMonths = function() {
                r.options.mode = "months";
                var X = r.options.months;
                r.options.value;
                var ee = /* @__PURE__ */ new Date(), C = parseInt(ee.getFullYear()), F = parseInt(ee.getMonth()) + 1, Z = r.date && l.isNumeric(r.date[0]) ? r.date[0] : C, fe = r.date && l.isNumeric(r.date[1]) ? r.date[1] : F;
                he.innerHTML = r.date[0], me.innerHTML = X[fe - 1];
                var J = document.createElement("table");
                J.setAttribute("width", "100%");
                for (var pe = null, Ee = 0; Ee < 12; Ee++) {
                  if (!(Ee % 4)) {
                    var pe = document.createElement("tr");
                    pe.setAttribute("align", "center"), J.appendChild(pe);
                  }
                  var ne = document.createElement("td");
                  if (ne.classList.add("jcalendar-set-month"), ne.setAttribute("data-value", Ee + 1), ne.innerText = X[Ee], r.options.validRange) {
                    var ce = Z + "-" + l.two(Ee + 1);
                    if (!r.options.validRange[0] || ce >= r.options.validRange[0].substr(0, 7))
                      var ke = !0;
                    else
                      var ke = !1;
                    if (!r.options.validRange[1] || ce <= r.options.validRange[1].substr(0, 7))
                      var Ae = !0;
                    else
                      var Ae = !1;
                    ke && Ae || ne.classList.add("jcalendar-disabled");
                  }
                  Ee + 1 == fe && ne.classList.add("jcalendar-selected"), C == Z && Ee + 1 == F && (ne.style.fontWeight = "bold"), pe.appendChild(ne);
                }
                Le.innerHTML = '<tr><td colspan="7"></td></tr>', Le.children[0].children[0].appendChild(J), te();
              }, r.getYears = function() {
                r.options.mode = "years";
                for (var X = /* @__PURE__ */ new Date(), ee = X.getFullYear(), C = r.date && l.isNumeric(r.date[0]) ? r.date[0] : parseInt(X.getFullYear()), F = [], Z = 0; Z < 25; Z++)
                  F[Z] = parseInt(r.date[0]) + (Z - 12);
                var fe = document.createElement("table");
                fe.setAttribute("width", "100%");
                for (var Z = 0; Z < 25; Z++) {
                  if (!(Z % 5)) {
                    var J = document.createElement("tr");
                    J.setAttribute("align", "center"), fe.appendChild(J);
                  }
                  var pe = document.createElement("td");
                  pe.classList.add("jcalendar-set-year"), pe.innerText = F[Z], C == F[Z] && pe.classList.add("jcalendar-selected"), ee == F[Z] && (pe.style.fontWeight = "bold"), J.appendChild(pe);
                }
                Le.innerHTML = '<tr><td colspan="7"></td></tr>', Le.firstChild.firstChild.appendChild(fe), te();
              }, r.setLabel = function(X, ee) {
                return E.getDateString(X, ee);
              }, r.fromFormatted = function(X, ee) {
                return E.extractDateFromString(X, ee);
              };
              var H = function(X) {
                var ee = l.findElement(X.target, "jcalendar-container");
                if (ee) {
                  var C = X.target.className;
                  if (C == "jcalendar-prev")
                    r.prev();
                  else if (C == "jcalendar-next")
                    r.next();
                  else if (C == "jcalendar-month")
                    r.getMonths();
                  else if (C == "jcalendar-year")
                    r.getYears();
                  else if (C == "jcalendar-set-year")
                    r.date[0] = X.target.innerText, r.options.type == "year-month-picker" ? r.getMonths() : r.getDays();
                  else if (X.target.classList.contains("jcalendar-set-month")) {
                    var F = parseInt(X.target.getAttribute("data-value"));
                    r.options.type == "year-month-picker" ? r.update(X.target, F) : (r.date[1] = F, r.getDays());
                  } else C == "jcalendar-confirm" || C == "jcalendar-update" || C == "jcalendar-close" ? r.close(null, !0) : C == "jcalendar-backdrop" ? r.close(!1, !1) : C == "jcalendar-reset" ? r.reset() : X.target.classList.contains("jcalendar-set-day") && X.target.innerText && r.update(X.target);
                } else
                  r.close(!1, !1);
              }, re = function(X) {
                if (X.target.value && X.target.value.length > 3) {
                  var ee = E.extractDateFromString(X.target.value, r.options.format);
                  ee && r.setValue(ee);
                }
              }, te = function() {
                var X = P.querySelector(".jcalendar-selected");
                X && X.classList.contains("jcalendar-disabled") ? (qe.setAttribute("disabled", "disabled"), se.setAttribute("disabled", "disabled"), ve.setAttribute("disabled", "disabled")) : (qe.removeAttribute("disabled"), se.removeAttribute("disabled"), ve.removeAttribute("disabled")), typeof r.options.onupdate == "function" && r.options.onupdate(S, r.getValue());
              }, P = null, L = null, q = null, Q = null, le = null, he = null, me = null, we = null, Le = null, De = null, Te = null, Xe = null, qe = null, se = null, ve = null, je = function() {
                S.tagName == "INPUT" && S.value && (f.value = S.value), L = document.createElement("div"), L.className = "jcalendar-reset", q = document.createElement("div"), q.className = "jcalendar-confirm", De = document.createElement("div"), De.className = "jcalendar-controls", De.style.borderBottom = "1px solid #ddd", De.appendChild(L), De.appendChild(q), Q = document.createElement("div"), Q.className = "jcalendar-container", le = document.createElement("div"), le.className = "jcalendar-content", Q.appendChild(le), S.tagName == "DIV" ? (P = S, P.classList.add("jcalendar-inline")) : (le.appendChild(De), P = document.createElement("div"), P.className = "jcalendar"), P.classList.add("jcalendar-container"), P.appendChild(Q);
                var X = document.createElement("div");
                X.className = "jcalendar-table", le.appendChild(X);
                var ee = document.createElement("td");
                ee.setAttribute("colspan", "2"), ee.className = "jcalendar-prev", he = document.createElement("span"), he.className = "jcalendar-year", me = document.createElement("span"), me.className = "jcalendar-month";
                var C = document.createElement("td");
                C.className = "jcalendar-header", C.setAttribute("colspan", "3"), C.appendChild(me), C.appendChild(he);
                var F = document.createElement("td");
                F.setAttribute("colspan", "2"), F.className = "jcalendar-next";
                var Z = document.createElement("thead"), fe = document.createElement("tr");
                fe.appendChild(ee), fe.appendChild(C), fe.appendChild(F), Z.appendChild(fe), we = document.createElement("table"), Le = document.createElement("tbody"), we.setAttribute("cellpadding", "0"), we.setAttribute("cellspacing", "0"), we.appendChild(Z), we.appendChild(Le), X.appendChild(we), se = document.createElement("select"), se.className = "jcalendar-select", se.onchange = function() {
                  r.date[3] = this.value, typeof r.options.onupdate == "function" && r.options.onupdate(S, r.getValue());
                };
                for (var J = 0; J < 24; J++) {
                  var pe = document.createElement("option");
                  pe.value = J, pe.innerHTML = l.two(J), se.appendChild(pe);
                }
                ve = document.createElement("select"), ve.className = "jcalendar-select", ve.onchange = function() {
                  r.date[4] = this.value, typeof r.options.onupdate == "function" && r.options.onupdate(S, r.getValue());
                };
                for (var J = 0; J < 60; J++) {
                  var pe = document.createElement("option");
                  pe.value = J, pe.innerHTML = l.two(J), ve.appendChild(pe);
                }
                var Ee = document.createElement("div");
                Ee.className = "jcalendar-controls", Te = document.createElement("div"), Te.className = "jcalendar-time", Te.style.maxWidth = "140px", Te.appendChild(se), Te.appendChild(ve), qe = document.createElement("button"), qe.setAttribute("type", "button"), qe.className = "jcalendar-update", Xe = document.createElement("div"), Xe.style.flexGrow = "10", Xe.appendChild(qe), Ee.appendChild(Te), S.tagName == "INPUT" && Ee.appendChild(Xe), le.appendChild(Ee);
                var ne = document.createElement("div");
                ne.className = "jcalendar-backdrop", P.appendChild(ne), S.addEventListener("keyup", re), P.addEventListener("swipeleft", function(ce) {
                  N.slideLeft(we, 0, function() {
                    r.next(), N.slideRight(we, 1);
                  }), ce.preventDefault(), ce.stopPropagation();
                }), P.addEventListener("swiperight", function(ce) {
                  N.slideRight(we, 0, function() {
                    r.prev(), N.slideLeft(we, 1);
                  }), ce.preventDefault(), ce.stopPropagation();
                }), "ontouchend" in document.documentElement ? (P.addEventListener("touchend", H), S.addEventListener("touchend", r.open)) : (P.addEventListener("mouseup", H), S.addEventListener("mouseup", r.open)), E.hasEvents || (E.hasEvents = !0, document.addEventListener("keydown", E.keydown)), r.setOptions(f), S.tagName == "INPUT" ? (S.parentNode.insertBefore(P, S.nextSibling), S.setAttribute("autocomplete", "off"), S.classList.add("jcalendar-input"), S.value = r.setLabel(r.getValue(), r.options)) : (r.getDays(), r.options.time && (se.value = r.date[3], ve.value = r.date[4])), r.options.opened == !0 && r.open(), r.options.controls == !1 && Q.classList.add("jcalendar-hide-controls"), S.change = r.setValue, S.val = function(ce) {
                  if (ce === void 0)
                    return r.getValue();
                  r.setValue(ce);
                }, S.calendar = P.calendar = r;
              };
              return je(), r;
            });
            return E.keydown = function(S) {
              var f = null;
              (f = E.current) && (S.which == 13 ? f.close(!1, !0) : S.which == 27 && f.close(!1, !1));
            }, E.prettify = function(S, f) {
              if (!f)
                var f = {
                  justNow: "Just now",
                  xMinutesAgo: "{0}m ago",
                  xHoursAgo: "{0}h ago",
                  xDaysAgo: "{0}d ago",
                  xWeeksAgo: "{0}w ago",
                  xMonthsAgo: "{0} mon ago",
                  xYearsAgo: "{0}y ago"
                };
              S.indexOf("GMT") === -1 && S.indexOf("Z") === -1 && (S += " GMT");
              var r = /* @__PURE__ */ new Date(), H = new Date(S), re = parseInt((r - H) / 1e3 / 60);
              if (String.prototype.format = function(P) {
                return this.replace("{0}", P);
              }, re == 0)
                var te = f.justNow;
              else if (re < 90)
                var te = f.xMinutesAgo.format(re);
              else if (re < 1440)
                var te = f.xHoursAgo.format(Math.round(re / 60));
              else if (re < 20160)
                var te = f.xDaysAgo.format(Math.round(re / 1440));
              else if (re < 43200)
                var te = f.xWeeksAgo.format(Math.round(re / 10080));
              else if (re < 1036800)
                var te = f.xMonthsAgo.format(Math.round(re / 43200));
              else
                var te = f.xYearsAgo.format(Math.round(re / 525600));
              return te;
            }, E.prettifyAll = function() {
              for (var S = document.querySelectorAll(".prettydate"), f = 0; f < S.length; f++)
                S[f].getAttribute("data-date") ? S[f].innerHTML = E.prettify(S[f].getAttribute("data-date")) : S[f].innerHTML && (S[f].setAttribute("title", S[f].innerHTML), S[f].setAttribute("data-date", S[f].innerHTML), S[f].innerHTML = E.prettify(S[f].innerHTML));
            }, E.now = I.now, E.toArray = I.toArray, E.dateToNum = I.dateToNum, E.numToDate = I.numToDate, E.weekdays = I.weekdays, E.months = I.months, E.weekdaysShort = I.weekdaysShort, E.monthsShort = I.monthsShort, E.extractDateFromString = Y.extractDateFromString, E.getDateString = Y.getDateString, E;
          }
          var ue = U();
          function be() {
            var E = {
              material: [
                ["#ffebee", "#fce4ec", "#f3e5f5", "#e8eaf6", "#e3f2fd", "#e0f7fa", "#e0f2f1", "#e8f5e9", "#f1f8e9", "#f9fbe7", "#fffde7", "#fff8e1", "#fff3e0", "#fbe9e7", "#efebe9", "#fafafa", "#eceff1"],
                ["#ffcdd2", "#f8bbd0", "#e1bee7", "#c5cae9", "#bbdefb", "#b2ebf2", "#b2dfdb", "#c8e6c9", "#dcedc8", "#f0f4c3", "#fff9c4", "#ffecb3", "#ffe0b2", "#ffccbc", "#d7ccc8", "#f5f5f5", "#cfd8dc"],
                ["#ef9a9a", "#f48fb1", "#ce93d8", "#9fa8da", "#90caf9", "#80deea", "#80cbc4", "#a5d6a7", "#c5e1a5", "#e6ee9c", "#fff59d", "#ffe082", "#ffcc80", "#ffab91", "#bcaaa4", "#eeeeee", "#b0bec5"],
                ["#e57373", "#f06292", "#ba68c8", "#7986cb", "#64b5f6", "#4dd0e1", "#4db6ac", "#81c784", "#aed581", "#dce775", "#fff176", "#ffd54f", "#ffb74d", "#ff8a65", "#a1887f", "#e0e0e0", "#90a4ae"],
                ["#ef5350", "#ec407a", "#ab47bc", "#5c6bc0", "#42a5f5", "#26c6da", "#26a69a", "#66bb6a", "#9ccc65", "#d4e157", "#ffee58", "#ffca28", "#ffa726", "#ff7043", "#8d6e63", "#bdbdbd", "#78909c"],
                ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"],
                ["#e53935", "#d81b60", "#8e24aa", "#3949ab", "#1e88e5", "#00acc1", "#00897b", "#43a047", "#7cb342", "#c0ca33", "#fdd835", "#ffb300", "#fb8c00", "#f4511e", "#6d4c41", "#757575", "#546e7a"],
                ["#d32f2f", "#c2185b", "#7b1fa2", "#303f9f", "#1976d2", "#0097a7", "#00796b", "#388e3c", "#689f38", "#afb42b", "#fbc02d", "#ffa000", "#f57c00", "#e64a19", "#5d4037", "#616161", "#455a64"],
                ["#c62828", "#ad1457", "#6a1b9a", "#283593", "#1565c0", "#00838f", "#00695c", "#2e7d32", "#558b2f", "#9e9d24", "#f9a825", "#ff8f00", "#ef6c00", "#d84315", "#4e342e", "#424242", "#37474f"],
                ["#b71c1c", "#880e4f", "#4a148c", "#1a237e", "#0d47a1", "#006064", "#004d40", "#1b5e20", "#33691e", "#827717", "#f57f17", "#ff6f00", "#e65100", "#bf360c", "#3e2723", "#212121", "#263238"]
              ],
              fire: [
                ["0b1a6d", "840f38", "b60718", "de030b", "ff0c0c", "fd491c", "fc7521", "faa331", "fbb535", "ffc73a"],
                ["071147", "5f0b28", "930513", "be0309", "ef0000", "fa3403", "fb670b", "f9991b", "faad1e", "ffc123"],
                ["03071e", "370617", "6a040f", "9d0208", "d00000", "dc2f02", "e85d04", "f48c06", "faa307", "ffba08"],
                ["020619", "320615", "61040d", "8c0207", "bc0000", "c82a02", "d05203", "db7f06", "e19405", "efab00"],
                ["020515", "2d0513", "58040c", "7f0206", "aa0000", "b62602", "b94903", "c57205", "ca8504", "d89b00"]
              ],
              baby: [
                ["eddcd2", "fff1e6", "fde2e4", "fad2e1", "c5dedd", "dbe7e4", "f0efeb", "d6e2e9", "bcd4e6", "99c1de"],
                ["e1c4b3", "ffd5b5", "fab6ba", "f5a8c4", "aacecd", "bfd5cf", "dbd9d0", "baceda", "9dc0db", "7eb1d5"],
                ["daa990", "ffb787", "f88e95", "f282a9", "8fc4c3", "a3c8be", "cec9b3", "9dbcce", "82acd2", "649dcb"],
                ["d69070", "ff9c5e", "f66770", "f05f8f", "74bbb9", "87bfae", "c5b993", "83aac3", "699bca", "4d89c2"],
                ["c97d5d", "f58443", "eb4d57", "e54a7b", "66a9a7", "78ae9c", "b5a67e", "7599b1", "5c88b7", "4978aa"]
              ],
              chart: [
                ["#C1D37F", "#4C5454", "#FFD275", "#66586F", "#D05D5B", "#C96480", "#95BF8F", "#6EA240", "#0F0F0E", "#EB8258", "#95A3B3", "#995D81"]
              ]
            }, S = function(f) {
              return E[f] ? E[f] : E.material;
            };
            return S.get = function(f) {
              return E[f] ? E[f] : E;
            }, S.set = function(f, r) {
              E[f] = r;
            }, S;
          }
          var G = be();
          function ie(E, S) {
            var f = {};
            f.options = {};
            var r = {
              data: [],
              position: null,
              allowCreate: !1,
              allowChangePosition: !1,
              onclick: null,
              onload: null,
              onchange: null,
              oncreate: null,
              ondelete: null,
              onbeforecreate: null,
              onchangeposition: null,
              animation: !1,
              hideHeaders: !1,
              padding: null,
              palette: null,
              maxWidth: null
            };
            for (var H in r)
              S && S.hasOwnProperty(H) ? f.options[H] = S[H] : f.options[H] = r[H];
            E.classList.add("jtabs");
            var re = null, te = null, P = null;
            const L = function(me) {
              f.options.animation && setTimeout(function() {
                let we = f.headers.children[me].getBoundingClientRect();
                f.options.palette === "modern" ? (P.style.width = we.width - 4 + "px", P.style.left = f.headers.children[me].offsetLeft + 2 + "px") : (P.style.width = we.width + "px", P.style.left = f.headers.children[me].offsetLeft + "px"), f.options.position === "bottom" ? P.style.top = "0px" : P.style.bottom = "0px";
              }, 50);
            };
            var q = function(me) {
              typeof f.headers.scrollTo == "function" ? f.headers.scrollTo({
                left: me,
                behavior: "smooth"
              }) : f.headers.scrollLeft = me, me <= 1 ? re.classList.add("disabled") : re.classList.remove("disabled"), me >= f.headers.scrollWidth - f.headers.offsetWidth ? te.classList.add("disabled") : te.classList.remove("disabled"), f.headers.scrollWidth <= f.headers.offsetWidth ? (re.style.display = "none", te.style.display = "none") : (re.style.display = "", te.style.display = "");
            };
            if (f.setBorder = L, f.open = function(me) {
              if (Array.from(f.content.children), !!f.content.children[me]) {
                for (var we = null, Le = 0; Le < f.headers.children.length; Le++)
                  f.headers.children[Le].classList.contains("jtabs-selected") && (we = Le), f.headers.children[Le].classList.remove("jtabs-selected"), f.headers.children[Le].removeAttribute("aria-selected"), f.content.children[Le] && f.content.children[Le].classList.remove("jtabs-selected");
                if (f.headers.children[me].classList.add("jtabs-selected"), f.headers.children[me].setAttribute("aria-selected", "true"), f.content.children[me] && f.content.children[me].classList.add("jtabs-selected"), we != me && typeof f.options.onchange == "function" && f.content.children[me] && f.options.onchange(E, f, me, f.headers.children[me], f.content.children[me]), f.options.hideHeaders == !0 && f.headers.children.length < 3 && f.options.allowCreate == !1)
                  f.headers.parentNode.style.display = "none";
                else {
                  f.headers.parentNode.style.display = "";
                  var De = f.headers.children[me].offsetLeft, Te = De + f.headers.children[me].offsetWidth, Xe = f.headers.scrollLeft, qe = Xe + f.headers.offsetWidth;
                  Xe <= De && qe >= Te || q(De - 1), L(me);
                }
              }
            }, f.selectIndex = function(me) {
              var we = Array.prototype.indexOf.call(f.headers.children, me);
              return we >= 0 && f.open(we), we;
            }, f.rename = function(me, we) {
              we || (we = prompt("New title", f.headers.children[me].innerText)), f.headers.children[me].innerText = we, L(f.getActive());
            }, f.create = function(me, we) {
              if (typeof f.options.onbeforecreate == "function") {
                var Le = f.options.onbeforecreate(E, me);
                if (Le === !1)
                  return !1;
                me = Le;
              }
              var De = f.appendElement(me);
              return typeof f.options.oncreate == "function" && f.options.oncreate(E, De), L(f.getActive()), De;
            }, f.remove = function(me) {
              return f.deleteElement(me);
            }, f.nextNumber = function() {
              for (var me = 0, we = 0; we < f.headers.children.length; we++) {
                var Le = f.headers.children[we].innerText.match(/[0-9].*/);
                Le > me && (me = parseInt(Le));
              }
              return me ? me++ : me = 1, me;
            }, f.deleteElement = function(me) {
              let we = f.getActive();
              if (f.headers.children[me])
                f.headers.removeChild(f.headers.children[me]), f.content.removeChild(f.content.children[me]);
              else
                return !1;
              if (we === me)
                f.open(0);
              else {
                let Le = f.getActive() || 0;
                L(Le);
              }
              typeof f.options.ondelete == "function" && f.options.ondelete(E, me);
            }, f.appendElement = function(me, we, Le, De) {
              if (!me)
                var me = prompt("Title?", "");
              if (me) {
                let qe = l.guid(), se = l.guid();
                var Te = document.createElement("div");
                Te.setAttribute("id", se), Te.setAttribute("role", "tabpanel"), Te.setAttribute("aria-labelledby", qe);
                var Xe = document.createElement("div");
                if (Xe.setAttribute("id", qe), Xe.setAttribute("role", "tab"), Xe.setAttribute("aria-controls", se), Xe.textContent = me, Xe.content = Te, typeof De > "u")
                  f.content.appendChild(Te), f.headers.insertBefore(Xe, f.headers.lastChild);
                else {
                  let ve = f.content.children[De];
                  ve ? f.content.insertBefore(Te, ve) : f.content.appendChild(Te), ve = f.headers.children[De] || f.headers.lastChild, f.headers.insertBefore(Xe, ve);
                }
                return f.options.allowChangePosition && Xe.setAttribute("draggable", "true"), Le !== !1 && f.selectIndex(Xe), typeof we == "function" && we(Te, Xe), Te;
              }
            }, f.getActive = function() {
              for (var me = 0; me < f.headers.children.length; me++)
                if (f.headers.children[me].classList.contains("jtabs-selected"))
                  return me;
              return !1;
            }, f.updateContent = function(me, we) {
              if (typeof we != "string")
                var Le = we;
              else {
                var Le = document.createElement("div");
                Le.innerHTML = we;
              }
              f.content.children[me].classList.contains("jtabs-selected") && we.classList.add("jtabs-selected"), f.content.replaceChild(we, f.content.children[me]), L();
            }, f.updatePosition = function(me, we, Le, De) {
              if (me > we ? f.content.insertBefore(f.content.children[me], f.content.children[we]) : f.content.insertBefore(f.content.children[me], f.content.children[we].nextSibling), De !== !1)
                f.open(we);
              else {
                const Te = f.getActive();
                we < Te && f.setBorder(Te);
              }
              !Le && typeof f.options.onchangeposition == "function" && f.options.onchangeposition(f.headers, me, we);
            }, f.move = function(me, we, Le, De) {
              me > we ? f.headers.insertBefore(f.headers.children[me], f.headers.children[we]) : f.headers.insertBefore(f.headers.children[me], f.headers.children[we].nextSibling), f.updatePosition(me, we, Le, De);
            }, f.setBorder = L, f.init = function() {
              E.textContent = "", f.headers = document.createElement("div"), f.content = document.createElement("div"), f.headers.classList.add("jtabs-headers"), f.headers.setAttribute("role", "tablist"), f.content.classList.add("jtabs-content"), f.content.setAttribute("role", "region"), f.content.setAttribute("aria-label", "Tab Panels"), f.options.palette ? E.classList.add("jtabs-modern") : E.classList.remove("jtabs-modern"), f.options.padding && (f.content.style.padding = parseInt(f.options.padding) + "px");
              var me = document.createElement("div");
              me.className = "jtabs-headers-container", me.appendChild(f.headers), f.options.maxWidth && (me.style.maxWidth = parseInt(f.options.maxWidth) + "px");
              var we = document.createElement("div");
              if (we.className = "jtabs-controls", we.setAttribute("draggable", "false"), me.appendChild(we), f.options.position == "bottom" ? (E.appendChild(f.content), E.appendChild(me)) : (E.appendChild(me), E.appendChild(f.content)), f.options.allowCreate == !0) {
                var Le = document.createElement("div");
                Le.className = "jtabs-add", Le.onclick = function() {
                  f.create();
                }, we.appendChild(Le);
              }
              re = document.createElement("div"), re.className = "jtabs-prev", re.onclick = function() {
                q(f.headers.scrollLeft - f.headers.offsetWidth);
              }, we.appendChild(re), te = document.createElement("div"), te.className = "jtabs-next", te.onclick = function() {
                q(f.headers.scrollLeft + f.headers.offsetWidth);
              }, we.appendChild(te);
              for (var De = 0; De < f.options.data.length; De++) {
                if (f.options.data[De].titleElement)
                  var Te = f.options.data[De].titleElement;
                else
                  var Te = document.createElement("div");
                if (f.options.data[De].icon) {
                  var Xe = document.createElement("div"), qe = document.createElement("i");
                  qe.classList.add("material-icons"), qe.textContent = f.options.data[De].icon, Xe.appendChild(qe), Te.appendChild(Xe);
                }
                if (f.options.data[De].title) {
                  var se = document.createTextNode(f.options.data[De].title);
                  Te.appendChild(se);
                }
                if (f.options.data[De].width && (Te.style.width = f.options.data[De].width), f.options.data[De].contentElement)
                  var ve = f.options.data[De].contentElement;
                else {
                  var ve = document.createElement("div");
                  ve.innerHTML = f.options.data[De].content;
                }
                f.headers.appendChild(Te), f.content.appendChild(ve);
              }
              P = document.createElement("div"), P.className = "jtabs-border", f.headers.appendChild(P), f.options.animation && E.classList.add("jtabs-animation"), f.headers.addEventListener("click", function(je) {
                if (je.target.parentNode.classList.contains("jtabs-headers"))
                  var X = je.target;
                else if (je.target.tagName == "I")
                  var X = je.target.parentNode.parentNode;
                else
                  var X = je.target.parentNode;
                var ee = f.selectIndex(X);
                typeof f.options.onclick == "function" && f.options.onclick(E, f, ee, f.headers.children[ee], f.content.children[ee]);
              }), f.headers.addEventListener("contextmenu", function(je) {
                f.selectIndex(je.target);
              }), f.headers.children.length && f.open(0), q(0), f.options.allowChangePosition == !0 && p(f.headers, {
                direction: 1,
                ondrop: function(je, X, ee) {
                  f.updatePosition(X, ee);
                }
              }), typeof f.options.onload == "function" && f.options.onload(E, f);
            }, E.children[0] && E.children[0].children.length)
              for (var Q = 0; Q < E.children[0].children.length; Q++) {
                var le = f.options.data && f.options.data[Q] ? f.options.data[Q] : {};
                E.children[1] && E.children[1].children[Q] ? (le.titleElement = E.children[0].children[Q], le.contentElement = E.children[1].children[Q]) : le.contentElement = E.children[0].children[Q], f.options.data[Q] = le;
              }
            var he = !1;
            if (f.options.data)
              for (var Q = 0; Q < f.options.data.length; Q++)
                f.options.data[Q].url && (A({
                  url: f.options.data[Q].url,
                  type: "GET",
                  dataType: "text/html",
                  index: Q,
                  success: function(we) {
                    f.options.data[this.index].content = we;
                  },
                  complete: function() {
                    f.init();
                  }
                }), he = !0);
            return he || f.init(), E.tabs = f, f;
          }
          function ge(E, S) {
            if (E.color)
              return E.color.setOptions(S, !0);
            var f = { type: "color" };
            f.options = {};
            var r = null, H = null, re = null, te = null, P = null, L = null, q = null;
            f.setOptions = function(C, F) {
              var Z = {
                placeholder: "",
                value: null,
                onopen: null,
                onclose: null,
                onchange: null,
                closeOnChange: !0,
                palette: null,
                position: null,
                doneLabel: "Done",
                resetLabel: "Reset",
                fullscreen: !1,
                opened: !1
              };
              C || (C = {}), C && !C.palette && (C.palette = G());
              for (var fe in Z)
                C && C.hasOwnProperty(fe) ? f.options[fe] = C[fe] : (typeof f.options[fe] > "u" || F === !0) && (f.options[fe] = Z[fe]);
              return te && (te.innerHTML = f.options.resetLabel), P && (P.innerHTML = f.options.doneLabel), f.options.palette && q && q.updateContent(0, we()), typeof f.options.value == "string" && (E.value = f.options.value, E.tagName === "INPUT" && (E.style.color = E.value, E.style.backgroundColor = E.value)), f.options.placeholder ? E.setAttribute("placeholder", f.options.placeholder) : E.getAttribute("placeholder") && E.removeAttribute("placeholder"), f;
            }, f.select = function(C) {
              var F = r.querySelector(".jcolor-selected");
              F && F.classList.remove("jcolor-selected"), f.values[C] && f.values[C].classList.add("jcolor-selected"), f.options.value = C;
            }, f.open = function() {
              if (!r.classList.contains("jcolor-focus")) {
                D(f, !0), r.classList.add("jcolor-focus"), f.options.value && f.select(f.options.value), re.style.marginTop = "", re.style.marginLeft = "";
                var C = re.getBoundingClientRect(), F = l.getWindowWidth(), Z = l.getWindowHeight();
                if (F < 800 || f.options.fullscreen == !0 ? (re.classList.add("jcolor-fullscreen"), N.slideBottom(re, 1), H.style.display = "block") : (re.classList.contains("jcolor-fullscreen") && (re.classList.remove("jcolor-fullscreen"), H.style.display = ""), f.options.position ? re.style.position = "fixed" : re.style.position = "", C.left + C.width > F && (re.style.marginLeft = -1 * (C.left + C.width - (F - 20)) + "px"), C.top + C.height > Z && (re.style.marginTop = -1 * (C.top + C.height - (Z - 20)) + "px")), typeof f.options.onopen == "function" && f.options.onopen(E, f), q.setBorder(q.getActive()), f.options.value) {
                  var fe = me(f.options.value);
                  ve.forEach(function(J, pe) {
                    J.value = fe[pe], J.dispatchEvent(new Event("input"));
                  });
                }
              }
            }, f.close = function(C) {
              return r.classList.contains("jcolor-focus") && (r.classList.remove("jcolor-focus"), H.style.display = "", !C && typeof f.options.onclose == "function" && f.options.onclose(E, f), D(f, !1)), f.options.value;
            }, f.setValue = function(C) {
              C || (C = ""), C != f.options.value && (f.options.value = C, se = C, f.select(C), typeof f.options.onchange == "function" && f.options.onchange(E, C, f), E.value != f.options.value && (E.value = f.options.value, E.tagName === "INPUT" && (E.style.color = E.value, E.style.backgroundColor = E.value), typeof E.oninput == "function" && E.oninput({
                type: "input",
                target: E,
                value: E.value
              })), f.options.closeOnChange == !0 && f.close());
            }, f.getValue = function() {
              return f.options.value;
            };
            var Q = function(C) {
              var F = C.toString(16);
              return F.length === 1 ? "0" + F : F;
            }, le = function(C, F, Z) {
              return "#" + Q(C) + Q(F) + Q(Z);
            }, he = function(C) {
              return parseInt("0x" + C);
            }, me = function(C) {
              return [he(C.substr(1, 2)), he(C.substr(3, 2)), he(C.substr(5, 2))];
            }, we = function() {
              var C = document.createElement("div");
              C.className = "jcolor-grid", f.values = [];
              var F = document.createElement("table");
              F.setAttribute("cellpadding", "7"), F.setAttribute("cellspacing", "0");
              for (var Z = 0; Z < f.options.palette.length; Z++) {
                for (var fe = document.createElement("tr"), J = 0; J < f.options.palette[Z].length; J++) {
                  var pe = document.createElement("td"), Ee = f.options.palette[Z][J];
                  Ee.length < 7 && Ee.substr(0, 1) !== "#" && (Ee = "#" + Ee), pe.style.backgroundColor = Ee, pe.setAttribute("data-value", Ee), pe.innerHTML = "", fe.appendChild(pe), f.options.value == Ee && pe.classList.add("jcolor-selected"), f.values[Ee] = pe;
                }
                F.appendChild(fe);
              }
              return C.appendChild(F), C;
            }, Le = document.createElement("canvas");
            Le.width = 200, Le.height = 160;
            var De = Le.getContext("2d"), Te = function() {
              var C = L.firstChild.getBoundingClientRect();
              Le.width = C.width - 14, Xe();
            }, Xe = function() {
              var C = De.createLinearGradient(0, 0, Le.width, 0);
              C.addColorStop(0, "rgb(255,0,0)"), C.addColorStop(0.15, "rgb(255,0,255)"), C.addColorStop(0.33, "rgb(0,0,255)"), C.addColorStop(0.49, "rgb(0,255,255)"), C.addColorStop(0.67, "rgb(0,255,0)"), C.addColorStop(0.84, "rgb(255,255,0)"), C.addColorStop(1, "rgb(255,0,0)"), De.fillStyle = C, De.fillRect(0, 0, Le.width, Le.height), C = De.createLinearGradient(0, 0, 0, Le.height), C.addColorStop(0, "rgba(255,255,255,1)"), C.addColorStop(0.5, "rgba(255,255,255,0)"), C.addColorStop(0.5, "rgba(0,0,0,0)"), C.addColorStop(1, "rgba(0,0,0,1)"), De.fillStyle = C, De.fillRect(0, 0, Le.width, Le.height);
            }, qe = function() {
              var C = document.createElement("div");
              C.className = "jcolor-hsl";
              var F = document.createElement("div");
              F.className = "jcolor-point";
              var Z = document.createElement("div");
              Z.appendChild(Le), Z.appendChild(F), C.appendChild(Z);
              var fe = function(J, pe, Ee) {
                if (J === 1) {
                  var ne = C.getBoundingClientRect(), ce = pe - ne.left, ke = Ee - ne.top;
                  ce < 0 && (ce = 0), ke < 0 && (ke = 0), ce > ne.width && (ce = ne.width), ke > ne.height && (ke = ne.height), F.style.left = ce + "px", F.style.top = ke + "px";
                  var Ae = De.getImageData(ce, ke, 1, 1).data;
                  se = le(Ae[0], Ae[1], Ae[2]);
                }
              };
              return C.addEventListener("mousedown", function(J) {
                fe(J.buttons, J.clientX, J.clientY);
              }), C.addEventListener("mousemove", function(J) {
                fe(J.buttons, J.clientX, J.clientY);
              }), C.addEventListener("touchmove", function(J) {
                fe(1, J.changedTouches[0].clientX, J.changedTouches[0].clientY);
              }), C;
            }, se = "", ve = [], je = function() {
              if (se !== "")
                for (var C = 0; C < ve.length; C++) {
                  var F = me(se);
                  F[C] = 0;
                  var Z = "linear-gradient(90deg, rgb(";
                  Z += F.join(", "), Z += "), rgb(", F[C] = 255, Z += F.join(", "), Z += "))", ve[C].style.backgroundImage = Z;
                }
            }, X = function() {
              var C = document.createElement("div");
              C.className = "jcolor-sliders";
              var F = document.createElement("div"), Z = function(Ee) {
                var ne = document.createElement("div");
                ne.className = "jcolor-sliders-input-container";
                var ce = document.createElement("label");
                ce.innerText = Ee;
                var ke = document.createElement("div");
                ke.className = "jcolor-sliders-input-subcontainer";
                var Ae = document.createElement("input");
                Ae.type = "range", Ae.min = 0, Ae.max = 255, Ae.value = 0, Ae.setAttribute("aria-label", "Color value"), Ae.setAttribute("aria-valuemin", "0"), Ae.setAttribute("aria-valuemax", "255"), Ae.setAttribute("aria-valuenow", "0"), ne.appendChild(ce), ke.appendChild(Ae);
                var ze = document.createElement("div");
                return ze.innerText = Ae.value, Ae.addEventListener("input", function() {
                  ze.innerText = Ae.value;
                }), ke.appendChild(ze), ne.appendChild(ke), F.appendChild(ne), Ae;
              };
              ve = [
                Z("Red"),
                Z("Green"),
                Z("Blue")
              ], C.appendChild(F);
              var fe = document.createElement("div");
              fe.className = "jcolor-sliders-final-color";
              var J = document.createElement("div");
              J.style.visibility = "hidden", J.innerText = "a", fe.appendChild(J);
              var pe = function() {
                var Ee = le(parseInt(ve[0].value), parseInt(ve[1].value), parseInt(ve[2].value));
                J.innerText = Ee, J.style.color = Ee, J.style.removeProperty("visibility"), se = Ee;
              };
              return ve.forEach(function(Ee) {
                Ee.addEventListener("input", function() {
                  pe(), je();
                });
              }), C.appendChild(fe), C;
            }, ee = function() {
              f.setOptions(S), E.tagName == "INPUT" && (E.classList.add("jcolor-input"), E.readOnly = !0), r = document.createElement("div"), r.className = "jcolor", H = document.createElement("div"), H.className = "jcolor-backdrop", r.appendChild(H), re = document.createElement("div"), re.className = "jcolor-content";
              var C = document.createElement("div");
              C.className = "jcolor-controls", re.appendChild(C), te = document.createElement("div"), te.className = "jcolor-reset", te.innerHTML = f.options.resetLabel, C.appendChild(te), P = document.createElement("div"), P.className = "jcolor-close", P.innerHTML = f.options.doneLabel, C.appendChild(P), L = document.createElement("div"), re.appendChild(L), q = ie(L, {
                animation: !0,
                data: [
                  {
                    title: "Grid",
                    contentElement: we()
                  },
                  {
                    title: "Spectrum",
                    contentElement: qe()
                  },
                  {
                    title: "Sliders",
                    contentElement: X()
                  }
                ],
                onchange: function(F, Z, fe) {
                  if (fe === 1)
                    Te();
                  else {
                    var J = se !== "" ? se : f.getValue();
                    if (fe === 2 && J) {
                      var pe = me(J);
                      ve.forEach(function(Ee, ne) {
                        Ee.value = pe[ne], Ee.dispatchEvent(new Event("input"));
                      });
                    }
                  }
                },
                palette: "modern"
              }), r.appendChild(re), E.tagName == "INPUT" ? E.parentNode.insertBefore(r, E.nextSibling) : E.appendChild(r), r.addEventListener("click", function(F) {
                if (F.target.tagName == "TD") {
                  var Z = F.target.getAttribute("data-value");
                  Z && f.setValue(Z);
                } else F.target.classList.contains("jcolor-reset") ? (f.setValue(""), f.close()) : F.target.classList.contains("jcolor-close") ? (q.getActive() > 0 && f.setValue(se), f.close()) : F.target.classList.contains("jcolor-backdrop") ? f.close() : f.open();
              }), E.addEventListener("mouseup", function(F) {
                f.open();
              }), window.addEventListener("resize", function() {
                r.classList.contains("jcolor-focus") && q.getActive() == 1 && Te();
              }), f.options.opened == !0 && f.open(), E.change = f.setValue, E.val = function(F) {
                if (F === void 0)
                  return f.getValue();
                f.setValue(F);
              }, E.color = f, r.color = f;
            };
            return f.toHex = function(C) {
              var F = function(Z) {
                return ("0" + parseInt(Z).toString(16)).slice(-2);
              };
              if (C)
                return /^#[0-9A-F]{6}$/i.test(C) ? C : (C = C.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), C && C.length ? "#" + F(C[1]) + F(C[2]) + F(C[3]) : "");
            }, ee(), f;
          }
          function de() {
            var E = function(S, f) {
              var r = { type: "contextmenu" };
              r.options = {};
              var H = {
                items: null,
                onclick: null
              };
              for (var re in H)
                f && f.hasOwnProperty(re) ? r.options[re] = f[re] : r.options[re] = H[re];
              S.classList.add("jcontextmenu"), r.open = function(L, q) {
                if (q && (r.options.items = q, r.create(q)), E.current && E.current.close(), D(r, !0), S.classList.add("jcontextmenu-focus"), E.current = r, r.options.items && r.options.items.length > 0 || S.children.length) {
                  if (L.target)
                    if (L.changedTouches && L.changedTouches[0])
                      Q = L.changedTouches[0].clientX, le = L.changedTouches[0].clientY;
                    else
                      var Q = L.clientX, le = L.clientY;
                  else
                    var Q = L.x, le = L.y;
                  var he = S.getBoundingClientRect();
                  if (window.innerHeight < le + he.height) {
                    var me = le - he.height;
                    me < 0 && (me = 0), S.style.top = me + "px";
                  } else
                    S.style.top = le + "px";
                  window.innerWidth < Q + he.width ? Q - he.width > 0 ? S.style.left = Q - he.width + "px" : S.style.left = "10px" : S.style.left = Q + "px";
                }
              }, r.isOpened = function() {
                return !!S.classList.contains("jcontextmenu-focus");
              }, r.close = function() {
                S.classList.contains("jcontextmenu-focus") && S.classList.remove("jcontextmenu-focus"), D(r, !1);
              }, r.create = function(L) {
                S.innerHTML = "";
                var q = te();
                S.appendChild(q);
                for (var Q = 0; Q < L.length; Q++) {
                  var le = P(L[Q]);
                  S.appendChild(le);
                }
              };
              function te() {
                var L = document.createElement("div");
                L.classList.add("header"), L.addEventListener("click", function(le) {
                  le.preventDefault(), le.stopPropagation();
                });
                var q = document.createElement("a");
                q.classList.add("title"), q.innerHTML = o.translate("Menu"), L.appendChild(q);
                var Q = document.createElement("a");
                return Q.classList.add("close"), Q.innerHTML = o.translate("close"), Q.addEventListener("click", function(le) {
                  r.close();
                }), L.appendChild(Q), L;
              }
              function P(L) {
                if (L.type && (L.type == "line" || L.type == "divisor"))
                  var q = document.createElement("hr");
                else {
                  var q = document.createElement("div"), Q = document.createElement("a");
                  if (Q.innerHTML = L.title, L.tooltip && q.setAttribute("title", L.tooltip), L.icon && q.setAttribute("data-icon", L.icon), L.id && (q.id = L.id), L.disabled)
                    q.className = "jcontextmenu-disabled";
                  else if (L.onclick) {
                    let Xe = L.onclick;
                    q.addEventListener("mousedown", function(qe) {
                      qe.preventDefault();
                    }), q.addEventListener("mouseup", function(qe) {
                      Xe(this, qe);
                    });
                  }
                  if (q.appendChild(Q), L.submenu) {
                    var le = document.createElement("span");
                    le.innerHTML = "&#9658;", q.appendChild(le), q.classList.add("jcontexthassubmenu");
                    var he = document.createElement("div");
                    he.classList.add("jcontextmenu"), he.setAttribute("tabindex", "900");
                    for (var me = L.submenu, we = 0; we < me.length; we++) {
                      var Le = P(me[we]);
                      he.appendChild(Le);
                    }
                    q.appendChild(he), q.addEventListener("mouseenter", function() {
                      he.style.left = "", he.style.right = "", he.style.minWidth = q.offsetWidth + "px", he.style.display = "block", he.style.opacity = "0", he.style.pointerEvents = "none";
                      var Xe = q.getBoundingClientRect(), qe = he.getBoundingClientRect(), se = window.innerWidth || document.documentElement.clientWidth, ve = Xe.right + qe.width, je = Xe.left - qe.width;
                      ve > se && je >= 0 ? (he.style.left = "auto", he.style.right = "99%") : ve > se && je < 0 ? (he.style.left = "32px", he.style.right = "auto", he.style.top = "100%") : (he.style.left = "99%", he.style.right = "auto"), he.style.opacity = "", he.style.pointerEvents = "", he.style.display = "";
                    }), q.addEventListener("mouseleave", function() {
                      he.style.left = "", he.style.right = "", he.style.minWidth = "";
                    });
                  } else if (L.shortcut) {
                    var De = document.createElement("span");
                    De.innerHTML = L.shortcut, q.appendChild(De);
                  }
                }
                return q;
              }
              return typeof r.options.onclick == "function" && S.addEventListener("click", function(L) {
                r.options.onclick(r, L);
              }), r.options.items && r.create(r.options.items), window.addEventListener("mousewheel", function() {
                r.close();
              }), S.contextmenu = r, r;
            };
            return E;
          }
          var oe = de();
          function xe() {
            var E = (function(S, f) {
              if (S.dropdown)
                return S.dropdown.setOptions(f, !0);
              var r = { type: "dropdown" };
              r.options = {};
              var H = function(X, ee) {
                X && X.length && (r.options.sortResults !== !1 && (typeof r.options.sortResults == "function" ? X.sort(r.options.sortResults) : X.sort(re)), r.setData(X)), typeof r.options.onload == "function" && r.options.onload(S, r, X, ee), ee && P(ee), ee == null && (r.options.value = ""), S.value = r.options.value, r.options.opened == !0 && r.open();
              }, re = function(X, ee) {
                var C, F;
                return typeof X == "string" ? C = X : X.text ? C = X.text : X.name && (C = X.name), typeof ee == "string" ? F = ee : ee.text ? F = ee.text : ee.name && (F = ee.name), typeof C == "string" || typeof F == "string" ? (typeof C != "string" && (C = "" + C), typeof F != "string" && (F = "" + F), C.localeCompare(F)) : C - F;
              }, te = function() {
                r.value = {};
                for (var X = 0; X < r.items.length; X++)
                  r.items[X].selected == !0 && (r.items[X].element && r.items[X].element.classList.remove("jdropdown-selected"), r.items[X].selected = null);
                r.options.value = "", S.value = "";
              }, P = function(X) {
                if (te(), X !== null)
                  if (!X)
                    typeof r.value[""] < "u" && (r.value[""] = "");
                  else {
                    Array.isArray(X) || (X = ("" + X).split(";"));
                    for (var ee = 0; ee < X.length; ee++)
                      r.value[X[ee]] = "";
                  }
                for (var ee = 0; ee < r.items.length; ee++)
                  typeof r.value[L(ee)] < "u" && (r.items[ee].element && r.items[ee].element.classList.add("jdropdown-selected"), r.items[ee].selected = !0, r.value[L(ee)] = q(ee));
                r.options.value = Object.keys(r.value).join(";"), r.header.value = r.getText();
              }, L = function(X, ee) {
                if (r.options.format)
                  var C = "id";
                else
                  var C = "value";
                return r.items[X] ? r.items[X].data[C] : "";
              }, q = function(X, ee) {
                if (r.options.format)
                  var C = "name";
                else
                  var C = "text";
                return r.items[X] ? r.items[X].data[C] : "";
              }, Q = function() {
                return Object.keys(r.value);
              }, le = function() {
                for (var X = [], ee = Object.keys(r.value), C = 0; C < ee.length; C++)
                  X.push(r.value[ee[C]]);
                return X;
              };
              r.setOptions = function(X, ee) {
                X || (X = {});
                var C = {
                  url: null,
                  data: [],
                  format: 0,
                  multiple: !1,
                  autocomplete: !1,
                  remoteSearch: !1,
                  lazyLoading: !1,
                  type: null,
                  width: null,
                  maxWidth: null,
                  opened: !1,
                  value: null,
                  placeholder: "",
                  newOptions: !1,
                  position: !1,
                  onchange: null,
                  onload: null,
                  onopen: null,
                  onclose: null,
                  onfocus: null,
                  onblur: null,
                  oninsert: null,
                  onbeforeinsert: null,
                  onsearch: null,
                  onbeforesearch: null,
                  sortResults: !1,
                  autofocus: !1,
                  prompt: null,
                  allowEmpty: !0
                };
                for (var F in C)
                  X && X.hasOwnProperty(F) ? r.options[F] = X[F] : (typeof r.options[F] > "u" || ee === !0) && (r.options[F] = C[F]);
                return (r.options.remoteSearch == !0 || r.options.type === "searchbar") && (r.options.autocomplete = !0), r.options.newOptions == !0 ? r.header.classList.add("jdropdown-add") : r.header.classList.remove("jdropdown-add"), r.options.autocomplete == !0 ? r.header.removeAttribute("readonly") : r.header.setAttribute("readonly", "readonly"), r.options.placeholder ? r.header.setAttribute("placeholder", r.options.placeholder) : r.header.removeAttribute("placeholder"), S.classList.remove("jdropdown-searchbar"), S.classList.remove("jdropdown-picker"), S.classList.remove("jdropdown-list"), r.options.type == "searchbar" ? S.classList.add("jdropdown-searchbar") : r.options.type == "list" ? S.classList.add("jdropdown-list") : r.options.type == "picker" ? S.classList.add("jdropdown-picker") : l.getWindowWidth() < 800 ? r.options.autocomplete ? (S.classList.add("jdropdown-searchbar"), r.options.type = "searchbar") : (S.classList.add("jdropdown-picker"), r.options.type = "picker") : (r.options.width ? (S.style.width = r.options.width, S.style.minWidth = r.options.width) : (S.style.removeProperty("width"), S.style.removeProperty("min-width")), S.classList.add("jdropdown-default"), r.options.type = "default"), r.options.type == "searchbar" ? he.appendChild(Le) : me.insertBefore(Le, me.firstChild), r.options.url && !X.data ? A({
                  url: r.options.url,
                  method: "GET",
                  dataType: "json",
                  success: function(Z) {
                    Z && H(Z, r.options.value);
                  }
                }) : H(r.options.data, r.options.value), r;
              };
              var he = null, me = null, we = null, Le = null, De = null, Te = null, Xe = null, qe = function() {
                if (f || (f = {}), S.tagName == "SELECT") {
                  var X = E.extractFromDom(S, f);
                  S = X.el, f = X.options;
                }
                !f.placeholder && S.getAttribute("placeholder") && (f.placeholder = S.getAttribute("placeholder")), r.value = {}, r.items = [], r.groups = [], r.search = "", r.results = null, S.classList.add("jdropdown"), he = document.createElement("div"), he.className = "jdropdown-container-header", r.header = document.createElement("input"), r.header.className = "jdropdown-header jss_object", r.header.type = "text", r.header.setAttribute("autocomplete", "off"), r.header.onfocus = function() {
                  typeof r.options.onfocus == "function" && r.options.onfocus(S);
                }, r.header.onblur = function() {
                  typeof r.options.onblur == "function" && r.options.onblur(S);
                }, r.header.onkeyup = function(ee) {
                  r.options.autocomplete == !0 && !Xe ? (r.search != r.header.value.trim() && (Xe = setTimeout(function() {
                    r.find(r.header.value.trim()), Xe = null;
                  }, 400)), S.classList.contains("jdropdown-focus") || r.open()) : r.options.autocomplete || r.next(ee.key);
                }, E.hasEvents || (E.hasEvents = !0, document.addEventListener("keydown", E.keydown)), me = document.createElement("div"), me.className = "jdropdown-container", we = document.createElement("div"), we.className = "jdropdown-content", Le = document.createElement("div"), Le.className = "jdropdown-close", Le.textContent = "Done", De = document.createElement("div"), De.className = "jdropdown-reset", De.textContent = "x", De.onclick = function() {
                  r.reset(), r.close();
                }, Te = document.createElement("div"), Te.className = "jdropdown-backdrop", he.appendChild(r.header), me.appendChild(we), S.appendChild(he), S.appendChild(me), S.appendChild(Te), r.setOptions(f), "ontouchsend" in document.documentElement ? S.addEventListener("touchsend", E.mouseup) : S.addEventListener("mouseup", E.mouseup), r.options.lazyLoading == !0 && u(we, {
                  loadUp: r.loadUp,
                  loadDown: r.loadDown
                }), we.onwheel = function(ee) {
                  ee.stopPropagation();
                }, S.change = r.setValue, S.val = function(ee) {
                  if (ee === void 0)
                    return r.getValue(!!r.options.multiple);
                  r.setValue(ee);
                }, S.dropdown = r;
              };
              r.getUrl = function() {
                return r.options.url;
              }, r.setUrl = function(X, ee) {
                r.options.url = X, A({
                  url: r.options.url,
                  method: "GET",
                  dataType: "json",
                  success: function(C) {
                    r.setData(C), typeof ee == "function" && ee(r);
                  }
                });
              }, r.setId = function(X, ee) {
                if (r.options.format)
                  var C = "id";
                else
                  var C = "value";
                typeof X == "object" ? X[C] = ee : r.items[X].data[C] = ee;
              };
              const se = function(X, ee) {
                if (!X) {
                  let Z = r.options.autocomplete == !0 ? r.header.value : "";
                  if (X = prompt(o.translate("Add A New Option"), Z), !X)
                    return !1;
                }
                if (ee || (ee = l.guid()), r.options.format)
                  var C = {
                    id: ee,
                    name: X
                  };
                else
                  var C = {
                    value: ee,
                    text: X
                  };
                if (typeof r.options.onbeforeinsert == "function") {
                  let Z = r.options.onbeforeinsert(r, C);
                  if (Z === !1)
                    return !1;
                  Z && (C = Z);
                }
                r.options.data.push(C);
                var F = r.createItem(C);
                return we.appendChild(F.element), typeof r.options.oninsert == "function" && r.options.oninsert(r, C, F), we.style.display == "none" && (we.style.display = ""), r.results && r.results.push(F), C;
              };
              r.add = function(X, ee) {
                return typeof r.options.prompt == "function" ? r.options.prompt.call(r, se) : se(X, ee);
              }, r.createItem = function(X, ee, C) {
                r.options.format ? (!X.id && X.value !== void 0 && (X.id = X.value), !X.name && X.text !== void 0 && (X.name = X.text)) : (!X.value && X.id !== void 0 && (X.value = X.id), !X.text && X.name !== void 0 && (X.text = X.name));
                var F = {};
                if (F.element = document.createElement("div"), F.element.className = "jdropdown-item", F.element.indexValue = r.items.length, F.data = X, ee && (F.group = ee), X.id && F.element.setAttribute("id", X.id), X.disabled == !0 && F.element.setAttribute("data-disabled", !0), X.tooltip && F.element.setAttribute("title", X.tooltip), X.image) {
                  var Z = document.createElement("img");
                  Z.className = "jdropdown-image", Z.src = X.image, X.title || Z.classList.add("jdropdown-image-small"), F.element.appendChild(Z);
                } else if (X.icon) {
                  var fe = document.createElement("span");
                  fe.className = "jdropdown-icon material-icons", fe.innerText = X.icon, X.title || fe.classList.add("jdropdown-icon-small"), X.color && (fe.style.color = X.color), F.element.appendChild(fe);
                } else if (X.color) {
                  var J = document.createElement("div");
                  J.className = "jdropdown-color", J.style.backgroundColor = X.color, F.element.appendChild(J);
                }
                if (r.options.format)
                  var pe = X.name;
                else
                  var pe = X.text;
                var Ee = document.createElement("div");
                if (Ee.className = "jdropdown-description", Ee.textContent = pe || "&nbsp;", X.title) {
                  var ne = document.createElement("div");
                  ne.className = "jdropdown-title", ne.innerText = X.title, Ee.appendChild(ne);
                }
                if (r.options.format)
                  var ce = X.id;
                else
                  var ce = X.value;
                return r.value[ce] && (F.element.classList.add("jdropdown-selected"), F.selected = !0), r.items.push(F), F.element.appendChild(Ee), F;
              }, r.appendData = function(X) {
                if (X.length) {
                  for (var ee = [], C = [], F = 0; F < X.length; F++)
                    X[F].group ? (C[X[F].group] || (C[X[F].group] = []), C[X[F].group].push(F)) : ee.push(F);
                  var Z = 0, fe = Object.keys(C);
                  if (fe.length > 0)
                    for (var F = 0; F < fe.length; F++) {
                      var J = document.createElement("div");
                      J.className = "jdropdown-group";
                      var pe = document.createElement("div");
                      pe.className = "jdropdown-group-name", pe.textContent = fe[F];
                      var Ee = document.createElement("i");
                      Ee.className = "jdropdown-group-arrow jdropdown-group-arrow-down", pe.appendChild(Ee);
                      var ne = document.createElement("div");
                      ne.className = "jdropdown-group-items";
                      for (var ce = 0; ce < C[fe[F]].length; ce++) {
                        var ke = r.createItem(X[C[fe[F]][ce]], J, fe[F]);
                        (r.options.lazyLoading == !1 || Z < 200) && (ne.appendChild(ke.element), Z++);
                      }
                      J.appendChild(pe), J.appendChild(ne), r.groups.push(J), ne.children.length > 0 && we.appendChild(J);
                    }
                  if (ee.length)
                    for (var F = 0; F < ee.length; F++) {
                      var ke = r.createItem(X[ee[F]]);
                      (r.options.lazyLoading == !1 || Z < 200) && (we.appendChild(ke.element), Z++);
                    }
                }
              }, r.setData = function(X) {
                if (te(), we.textContent = "", r.header.value = "", r.items = [], X && X.length) {
                  for (var ee = 0; ee < X.length; ee++)
                    typeof X[ee] != "object" && (r.options.format ? X[ee] = {
                      id: X[ee],
                      name: X[ee]
                    } : X[ee] = {
                      value: X[ee],
                      text: X[ee]
                    });
                  r.appendData(X), r.options.data = X;
                } else
                  r.options.data = [];
                r.close();
              }, r.getData = function() {
                return r.options.data;
              }, r.getPosition = function(X) {
                for (var ee = 0; ee < r.items.length; ee++)
                  if (L(ee) == X)
                    return ee;
                return !1;
              }, r.getText = function(X) {
                var ee = le();
                return X ? ee : ee.join("; ");
              }, r.getValue = function(X) {
                var ee = Q();
                return X ? ee : ee.join(";");
              };
              var ve = function(X) {
                S.value != r.options.value && (S.value = r.options.value, typeof S.oninput == "function" && S.oninput({
                  type: "input",
                  target: S,
                  value: S.value
                })), typeof r.options.onchange == "function" && r.options.onchange(S, r, X, r.options.value);
              };
              r.setValue = function(X) {
                var ee = r.getValue();
                Array.isArray(X) && (X = X.join(";")), ee !== X && (P(X), ve(ee));
              }, r.resetSelected = function() {
                r.setValue(null);
              }, r.selectIndex = function(C, ee) {
                var C = parseInt(C);
                if (r.items && r.items[C] && (ee === !0 || r.items[C].data.disabled !== !0))
                  if (r.setCursor(C, !1), !r.options.multiple)
                    r.items[C].selected ? r.options.allowEmpty !== !1 && r.setValue(null) : r.setValue(L(C)), r.close();
                  else {
                    var F = r.options.value;
                    r.items[C].selected ? (r.items[C].element.classList.remove("jdropdown-selected"), r.items[C].selected = !1, delete r.value[L(C)]) : (r.items[C].element.classList.add("jdropdown-selected"), r.items[C].selected = !0, r.value[L(C)] = q(C)), r.options.value = Object.keys(r.value).join(";"), r.options.autocomplete == !1 && (r.header.value = le().join("; ")), ve(F);
                  }
              }, r.selectItem = function(X) {
                r.selectIndex(X.indexValue);
              };
              var je = function(X, ee) {
                for (var C = 0; C < ee.length; C++)
                  if (r.options.format) {
                    if (ee[C].id == X)
                      return !0;
                  } else if (ee[C].value == X)
                    return !0;
                return !1;
              };
              return r.find = function(X) {
                if (r.search == X.trim())
                  return !1;
                if (r.search = X, r.setCursor(), r.groups.length)
                  for (var ee = 0; ee < r.groups.length; ee++)
                    r.groups[ee].lastChild.textContent = "";
                if (we.textContent = "", r.options.remoteSearch == !0) {
                  r.results = null;
                  var C = r.options.url;
                  let ne = {
                    url: C,
                    method: "GET",
                    data: { q: X },
                    dataType: "json",
                    success: function(ce) {
                      r.items = [];
                      var ke = Object.keys(r.value);
                      if (ke.length)
                        for (var Ae = 0; Ae < ke.length; Ae++)
                          je(ke[Ae], ce) || (r.options.format ? ce.unshift({ id: ke[Ae], name: r.value[ke[Ae]] }) : ce.unshift({ value: ke[Ae], text: r.value[ke[Ae]] }));
                      r.appendData(ce), ce.length ? we.style.display = "" : we.style.display = "none", typeof r.options.onsearch == "function" && r.options.onsearch(r, ce);
                    }
                  };
                  if (typeof r.options.onbeforesearch == "function") {
                    let ce = r.options.onbeforesearch(r, ne);
                    if (ce === !1)
                      return;
                    typeof ce == "object" && (ne = ce);
                  }
                  A(ne);
                } else {
                  X = new RegExp(X, "gi");
                  for (var F = [], ee = 0; ee < r.items.length; ee++) {
                    var Z = q(ee), fe = r.items[ee].data.title || "", J = r.items[ee].data.group || "", pe = r.items[ee].data.synonym || "";
                    pe && (pe = pe.join(" ")), (X == null || r.items[ee].selected == !0 || Z.toString().match(X) || fe.match(X) || J.match(X) || pe.match(X)) && F.push(r.items[ee]);
                  }
                  if (!F.length)
                    we.style.display = "none", r.results = null;
                  else {
                    we.style.display = "", r.results = F;
                    var Ee = F.length || 0;
                    r.options.lazyLoading == !0 && Ee > 200 && (Ee = 200);
                    for (var ee = 0; ee < Ee; ee++)
                      r.results[ee].group ? (r.results[ee].group.parentNode || we.appendChild(r.results[ee].group), r.results[ee].group.lastChild.appendChild(r.results[ee].element)) : we.appendChild(r.results[ee].element);
                  }
                }
                r.options.autofocus == !0 && r.first();
              }, r.open = function() {
                if (!S.classList.contains("jdropdown-focus")) {
                  E.current = r, D(r, !0), S.classList.add("jdropdown-focus"), l.getWindowWidth() < 800 && (r.options.type == null || r.options.type == "picker") && N.slideBottom(me, 1), r.options.autocomplete == !0 && (r.header.value = r.search, r.header.focus());
                  var X = Q();
                  if (X[0]) {
                    var ee = r.getPosition(X[0]);
                    ee !== !1 && r.setCursor(ee);
                  }
                  if (!r.options.type || r.options.type == "default") {
                    var C = S.getBoundingClientRect(), F = me.getBoundingClientRect();
                    r.options.position ? (me.style.position = "fixed", window.innerHeight < C.bottom + F.height ? (me.style.top = "", me.style.bottom = window.innerHeight - C.top + 1 + "px") : (me.style.top = C.bottom + "px", me.style.bottom = ""), me.style.left = C.left + "px") : window.innerHeight < C.bottom + F.height ? (me.style.top = "", me.style.bottom = C.height + 1 + "px") : (me.style.top = "", me.style.bottom = ""), me.style.minWidth = C.width + "px", r.options.maxWidth && (me.style.maxWidth = r.options.maxWidth), !r.items.length && r.options.autocomplete == !0 ? we.style.display = "none" : we.style.display = "";
                  }
                }
                typeof r.options.onopen == "function" && r.options.onopen(S);
              }, r.close = function(X) {
                return S.classList.contains("jdropdown-focus") && (r.header.value = r.getText(), r.setCursor(), !X && typeof r.options.onclose == "function" && r.options.onclose(S), r.header.blur && r.header.blur(), S.classList.remove("jdropdown-focus"), D(r, !1), E.current = null), r.getValue();
              }, r.setCursor = function(X, ee) {
                if (r.currentIndex != null && r.items && r.items[r.currentIndex] && r.items[r.currentIndex].element.classList.remove("jdropdown-cursor"), X == null)
                  r.currentIndex = null;
                else if (X = parseInt(X), r.items[X].element.parentNode && (r.items[X].element.classList.add("jdropdown-cursor"), r.currentIndex = X, ee !== !1 && r.items[r.currentIndex].element)) {
                  we.scrollTop;
                  var C = r.items[r.currentIndex].element;
                  we.scrollTop = C.offsetTop - C.scrollTop + C.clientTop - 95;
                }
              }, r.resetCursor = r.setCursor, r.updateCursor = r.setCursor, r.reset = function() {
                r.setCursor(), r.setValue(null);
              }, r.first = function() {
                r.options.lazyLoading === !0 && r.loadFirst();
                var X = we.querySelectorAll(".jdropdown-item");
                if (X.length) {
                  var ee = X[0].indexValue;
                  r.setCursor(ee);
                }
              }, r.last = function() {
                r.options.lazyLoading === !0 && r.loadLast();
                var X = we.querySelectorAll(".jdropdown-item");
                if (X.length) {
                  var ee = X[X.length - 1].indexValue;
                  r.setCursor(ee);
                }
              }, r.next = function(X) {
                var ee = null;
                if (X) {
                  if (X.length == 1) {
                    var C = r.currentIndex || -1;
                    X = X.toLowerCase();
                    var F = null, Z = null, fe = we.querySelectorAll(".jdropdown-item");
                    if (fe.length) {
                      for (var J = 0; J < fe.length; J++)
                        if (fe[J].indexValue > C && (F = r.items[fe[J].indexValue]) && (Z = F.element.innerText[0]) && (Z = Z.toLowerCase(), X == Z)) {
                          ee = fe[J].indexValue;
                          break;
                        }
                      r.setCursor(ee);
                    }
                  }
                } else if (r.currentIndex == null || r.currentIndex == null)
                  r.first();
                else {
                  var pe = r.items[r.currentIndex].element, Ee = pe.nextElementSibling;
                  Ee ? (Ee.classList.contains("jdropdown-group") && (Ee = Ee.lastChild.firstChild), ee = Ee.indexValue) : pe.parentNode.classList.contains("jdropdown-group-items") && ((Ee = pe.parentNode.parentNode.nextElementSibling) && (Ee.classList.contains("jdropdown-group") ? Ee = Ee.lastChild.firstChild : Ee.classList.contains("jdropdown-item") ? ee = Ee.indexValue : Ee = null), Ee && (ee = Ee.indexValue)), ee !== null && r.setCursor(ee);
                }
              }, r.prev = function() {
                var X = null;
                if (r.currentIndex === null)
                  r.first();
                else {
                  var ee = r.items[r.currentIndex].element, C = ee.previousElementSibling;
                  C ? (C.classList.contains("jdropdown-group") && (C = C.lastChild.lastChild), X = C.indexValue) : ee.parentNode.classList.contains("jdropdown-group-items") && ((C = ee.parentNode.parentNode.previousElementSibling) && (C.classList.contains("jdropdown-group") ? C = C.lastChild.lastChild : C.classList.contains("jdropdown-item") ? X = C.indexValue : C = null), C && (X = C.indexValue));
                }
                X !== null && r.setCursor(X);
              }, r.loadFirst = function() {
                if (r.results)
                  var X = r.results;
                else
                  var X = r.items;
                var ee = X.length || 0;
                r.options.lazyLoading == !0 && ee > 200 && (ee = 200), we.textContent = "";
                for (var C = 0; C < ee; C++)
                  X[C].group ? (X[C].group.parentNode || we.appendChild(X[C].group), X[C].group.lastChild.appendChild(X[C].element)) : we.appendChild(X[C].element);
                we.scrollTop = 0;
              }, r.loadLast = function() {
                if (r.results)
                  var X = r.results;
                else
                  var X = r.items;
                var ee = X.length;
                if (ee > 200) {
                  ee = ee - 200, we.textContent = "";
                  for (var C = ee; C < X.length; C++)
                    X[C].group ? (X[C].group.parentNode || we.appendChild(X[C].group), X[C].group.lastChild.appendChild(X[C].element)) : we.appendChild(X[C].element);
                  we.scrollTop = we.scrollHeight;
                }
              }, r.loadUp = function() {
                var X = !1;
                if (r.results)
                  var ee = r.results;
                else
                  var ee = r.items;
                var C = we.querySelectorAll(".jdropdown-item"), F = C[0].indexValue;
                F = r.items[F];
                var Z = ee.indexOf(F) - 1;
                if (Z > 0) {
                  for (var fe = 0; Z > 0 && ee[Z] && fe < 200; )
                    ee[Z].group ? (ee[Z].group.parentNode || we.insertBefore(ee[Z].group, we.firstChild), ee[Z].group.lastChild.insertBefore(ee[Z].element, ee[Z].group.lastChild.firstChild)) : we.insertBefore(ee[Z].element, we.firstChild), Z--, fe++;
                  X = !0;
                }
                return X;
              }, r.loadDown = function() {
                var X = !1;
                if (r.results)
                  var ee = r.results;
                else
                  var ee = r.items;
                var C = we.querySelectorAll(".jdropdown-item"), F = C[C.length - 1].indexValue;
                F = r.items[F];
                var Z = ee.indexOf(F) + 1;
                if (Z < ee.length) {
                  for (var fe = 0; Z < ee.length && ee[Z] && fe < 200; )
                    ee[Z].group ? (ee[Z].group.parentNode || we.appendChild(ee[Z].group), ee[Z].group.lastChild.appendChild(ee[Z].element)) : we.appendChild(ee[Z].element), Z++, fe++;
                  X = !0;
                }
                return X;
              }, qe(), r;
            });
            return E.keydown = function(S) {
              var f = null;
              if (f = E.current) {
                if (S.which == 13 || S.which == 9)
                  f.header.value && f.currentIndex == null && f.options.newOptions ? f.add() : (f.currentIndex == null && f.options.autocomplete == !0 && f.header.value != "" && f.find(f.header.value), f.selectIndex(f.currentIndex));
                else if (S.which == 38)
                  f.currentIndex == null ? f.first() : f.currentIndex > 0 && f.prev(), S.preventDefault();
                else if (S.which == 40)
                  f.currentIndex == null ? f.first() : f.currentIndex + 1 < f.items.length && f.next(), S.preventDefault();
                else if (S.which == 36)
                  f.first(), S.target.classList.contains("jdropdown-header") || S.preventDefault();
                else if (S.which == 35)
                  f.last(), S.target.classList.contains("jdropdown-header") || S.preventDefault();
                else if (S.which == 27)
                  f.close();
                else if (S.which == 33) {
                  if (f.currentIndex == null)
                    f.first();
                  else if (f.currentIndex > 0)
                    for (var r = 0; r < 7; r++)
                      f.prev();
                  S.preventDefault();
                } else if (S.which == 34) {
                  if (f.currentIndex == null)
                    f.first();
                  else if (f.currentIndex + 1 < f.items.length)
                    for (var r = 0; r < 7; r++)
                      f.next();
                  S.preventDefault();
                }
              }
            }, E.mouseup = function(S) {
              var f = l.findElement(S.target, "jdropdown");
              if (f) {
                var r = f.dropdown;
                if (S.target.classList.contains("jdropdown-header"))
                  if (f.classList.contains("jdropdown-focus") && f.classList.contains("jdropdown-default")) {
                    var H = f.getBoundingClientRect();
                    if (S.changedTouches && S.changedTouches[0]) {
                      var re = S.changedTouches[0].clientX;
                      S.changedTouches[0].clientY;
                    } else {
                      var re = S.clientX;
                      S.clientY;
                    }
                    H.width - (re - H.left) < 30 ? S.target.classList.contains("jdropdown-add") ? r.add() : r.close() : r.options.autocomplete == !1 && r.close();
                  } else
                    r.open();
                else if (S.target.classList.contains("jdropdown-group-name")) {
                  var te = S.target.nextSibling.children;
                  if (S.target.nextSibling.style.display != "none")
                    for (var P = 0; P < te.length; P++)
                      te[P].style.display != "none" && r.selectItem(te[P]);
                } else S.target.classList.contains("jdropdown-group-arrow") ? S.target.classList.contains("jdropdown-group-arrow-down") ? (S.target.classList.remove("jdropdown-group-arrow-down"), S.target.classList.add("jdropdown-group-arrow-up"), S.target.parentNode.nextSibling.style.display = "none") : (S.target.classList.remove("jdropdown-group-arrow-up"), S.target.classList.add("jdropdown-group-arrow-down"), S.target.parentNode.nextSibling.style.display = "") : S.target.classList.contains("jdropdown-item") ? r.selectItem(S.target) : S.target.classList.contains("jdropdown-image") || S.target.classList.contains("jdropdown-description") ? r.selectItem(S.target.parentNode) : S.target.classList.contains("jdropdown-title") ? r.selectItem(S.target.parentNode.parentNode) : (S.target.classList.contains("jdropdown-close") || S.target.classList.contains("jdropdown-backdrop")) && r.close();
              }
            }, E.extractFromDom = function(S, f) {
              var r = S;
              if (f || (f = {}), S.getAttribute("multiple") && (!f || f.multiple == null) && (f.multiple = !0), S.getAttribute("placeholder") && (!f || f.placeholder == null) && (f.placeholder = S.getAttribute("placeholder")), S.getAttribute("data-autocomplete") && (!f || f.autocomplete == null) && (f.autocomplete = !0), (!f || f.width == null) && (f.width = S.offsetWidth), S.value && (!f || f.value == null) && (f.value = S.value), !f || f.data == null) {
                f.data = [];
                for (var H = 0; H < S.children.length; H++)
                  if (S.children[H].tagName == "OPTGROUP")
                    for (var re = 0; re < S.children[H].children.length; re++)
                      f.data.push({
                        value: S.children[H].children[re].value,
                        text: S.children[H].children[re].textContent,
                        group: S.children[H].getAttribute("label")
                      });
                  else
                    f.data.push({
                      value: S.children[H].value,
                      text: S.children[H].textContent
                    });
              }
              (!f || f.onchange == null) && (f.onchange = function(P, L, q, Q) {
                f.multiple == !0 ? obj.items[L].classList.contains("jdropdown-selected") ? r.options[L].setAttribute("selected", "selected") : r.options[L].removeAttribute("selected") : r.value = Q;
              });
              var te = document.createElement("div");
              return S.parentNode.insertBefore(te, S), S.style.display = "none", S = te, { el: S, options: f };
            }, E;
          }
          var Oe = xe();
          function Be(E, S) {
            if (E.picker)
              return E.picker.setOptions(S, !0);
            var f = { type: "picker" };
            f.options = {};
            var r = null, H = null, re = function(L) {
              return L instanceof Element || L instanceof HTMLDocument;
            }, te = function() {
              H.innerHTML = "";
              for (var L = Object.keys(f.options.data), q = 0; q < L.length; q++) {
                var Q = document.createElement("div");
                Q.classList.add("jpicker-item"), Q.setAttribute("role", "option"), Q.k = L[q], Q.v = f.options.data[L[q]];
                var le = f.getLabel(L[q], Q);
                re(le) ? Q.appendChild(le) : Q.innerHTML = le, H.appendChild(Q);
              }
            };
            f.setOptions = function(L, q) {
              var Q = {
                value: 0,
                data: null,
                render: null,
                onchange: null,
                onmouseover: null,
                onselect: null,
                onopen: null,
                onclose: null,
                onload: null,
                width: null,
                header: !0,
                right: !1,
                bottom: !1,
                content: !1,
                columns: null,
                grid: null,
                height: null
              };
              L && L.options && (L.data = L.options);
              for (var le in Q)
                L && L.hasOwnProperty(le) ? f.options[le] = L[le] : (typeof f.options[le] > "u" || q === !0) && (f.options[le] = Q[le]);
              return f.options.header === !1 ? r.style.display = "none" : r.style.display = "", f.options.width ? r.style.width = parseInt(f.options.width) + "px" : r.style.width = "", f.options.height ? (H.style.maxHeight = f.options.height + "px", H.style.overflow = "scroll") : H.style.overflow = "", f.options.columns > 0 && (f.options.grid ? (H.classList.add("jpicker-grid"), H.style.gridTemplateColumns = "repeat(" + f.options.grid + ", 1fr)") : (H.classList.add("jpicker-columns"), H.style.width = f.options.width ? f.options.width : 36 * f.options.columns + "px")), isNaN(parseInt(f.options.value)) && (f.options.value = 0), te(), f.setValue(f.options.value), f;
            }, f.getValue = function() {
              return f.options.value;
            }, f.setValue = function(L, q) {
              if (f.setLabel(L), f.options.value = String(L), E.value != f.options.value && (E.value = f.options.value, typeof E.oninput == "function" && E.oninput({
                type: "input",
                target: E,
                value: E.value
              })), H.children[L] && H.children[L].getAttribute("type") !== "generic" && f.close(), q && typeof f.options.onchange == "function") {
                var Q = f.options.data[L];
                f.options.onchange(E, f, Q, Q, L, q);
              }
            }, f.getLabel = function(L, q) {
              var Q = f.options.data[L] || null;
              return typeof f.options.render == "function" && (Q = f.options.render(Q, q)), Q;
            }, f.setLabel = function(L) {
              var q;
              f.options.content ? (q = document.createElement("i"), q.textContent = f.options.content, q.classList.add("material-icons")) : q = f.getLabel(L, null), re(q) ? (r.textContent = "", r.appendChild(q)) : r.innerHTML = q;
            }, f.open = function() {
              if (!E.classList.contains("jpicker-focus")) {
                D(f, !0), E.classList.add("jpicker-focus"), E.focus();
                var L = 0, q = 0;
                H.style.marginLeft = "";
                var Q = r.getBoundingClientRect(), le = H.getBoundingClientRect();
                window.innerHeight < Q.bottom + le.height || f.options.bottom ? L = -1 * (le.height + 4) : L = Q.height + 4, f.options.right === !0 && (q = -1 * le.width + Q.width), le.left + q < 0 && (q = q + le.left + 10), le.left + le.width > window.innerWidth && (q = -1 * (10 + le.left + le.width - window.innerWidth)), H.style.marginTop = parseInt(L) + "px", H.style.marginLeft = parseInt(q) + "px", typeof f.options.onopen == "function" && f.options.onopen(E, f);
              }
            }, f.close = function() {
              E.classList.contains("jpicker-focus") && (E.classList.remove("jpicker-focus"), D(f, !1), typeof f.options.onclose == "function" && f.options.onclose(E, f));
            };
            var P = function() {
              let L = l.guid();
              E.classList.add("jpicker"), E.setAttribute("role", "combobox"), E.setAttribute("aria-haspopup", "listbox"), E.setAttribute("aria-expanded", "false"), E.setAttribute("aria-controls", L), E.setAttribute("tabindex", "0"), E.onmousedown = function(q) {
                E.classList.contains("jpicker-focus") || f.open();
              }, r = document.createElement("div"), r.classList.add("jpicker-header"), H = document.createElement("div"), H.setAttribute("id", L), H.setAttribute("role", "listbox"), H.classList.add("jpicker-content"), H.onclick = function(q) {
                var Q = l.findElement(q.target, "jpicker-item");
                Q && Q.parentNode === H && f.setValue(Q.k, q);
              }, E.appendChild(r), E.appendChild(H), E.value = S.value || 0, f.setOptions(S), typeof f.options.onload == "function" && f.options.onload(E, f), E.change = f.setValue, E.val = function(q) {
                if (q === void 0)
                  return f.getValue();
                f.setValue(q);
              }, E.picker = f;
            };
            return P(), f;
          }
          function Re(E, S) {
            var f = { type: "toolbar" };
            f.options = {};
            var r = {
              app: null,
              container: !1,
              badge: !1,
              title: !1,
              responsive: !1,
              maxWidth: null,
              bottom: !0,
              items: []
            };
            for (var H in r)
              S && S.hasOwnProperty(H) ? f.options[H] = S[H] : f.options[H] = r[H];
            !E && S.app && S.app.el && (E = document.createElement("div"), S.app.el.appendChild(E));
            var re = document.createElement("div");
            re.classList.add("jtoolbar-item"), re.classList.add("jtoolbar-arrow");
            var te = document.createElement("div");
            te.classList.add("jtoolbar-floating"), re.appendChild(te), f.selectItem = function(L) {
              for (var q = P.children, Q = 0; Q < q.length; Q++)
                L != q[Q] && q[Q].classList.remove("jtoolbar-selected");
              L.classList.add("jtoolbar-selected");
            }, f.hide = function() {
              N.slideBottom(E, 0, function() {
                E.style.display = "none";
              });
            }, f.show = function() {
              E.style.display = "", N.slideBottom(E, 1);
            }, f.get = function() {
              return E;
            }, f.setBadge = function(L, q) {
              P.children[L].children[1].firstChild.innerHTML = q;
            }, f.destroy = function() {
              toolbar.remove(), E.innerHTML = "";
            }, f.update = function(L, q) {
              for (var Q = 0; Q < P.children.length; Q++) {
                var le = P.children[Q];
                typeof le.updateState == "function" && le.updateState(E, f, le, L, q);
              }
              for (var Q = 0; Q < te.children.length; Q++) {
                var le = te.children[Q];
                typeof le.updateState == "function" && le.updateState(E, f, le, L, q);
              }
            }, f.create = function(L) {
              P.innerHTML = "";
              for (var q = 0; q < L.length; q++) {
                var Q = document.createElement("div");
                if (Q.classList.add("jtoolbar-item"), L[q].width && (Q.style.width = parseInt(L[q].width) + "px"), L[q].k && (Q.k = L[q].k), L[q].tooltip && (Q.setAttribute("title", L[q].tooltip), Q.setAttribute("aria-label", L[q].tooltip)), L[q].id && Q.setAttribute("id", L[q].id), L[q].updateState && (Q.updateState = L[q].updateState), L[q].active && Q.classList.add("jtoolbar-active"), L[q].disabled && Q.classList.add("jtoolbar-disabled"), L[q].type == "select" || L[q].type == "dropdown")
                  Be(Q, L[q]);
                else if (L[q].type == "divisor")
                  Q.classList.add("jtoolbar-divisor");
                else if (L[q].type == "label")
                  Q.classList.add("jtoolbar-label"), Q.innerHTML = L[q].content;
                else {
                  var le = document.createElement("i");
                  if (typeof L[q].class > "u")
                    le.classList.add("material-icons");
                  else
                    for (var he = L[q].class.split(" "), me = 0; me < he.length; me++)
                      le.classList.add(he[me]);
                  if (le.innerHTML = L[q].content ? L[q].content : "", Q.setAttribute("role", "button"), Q.appendChild(le), f.options.badge == !0) {
                    var we = document.createElement("div");
                    we.classList.add("jbadge");
                    var Le = document.createElement("div");
                    Le.innerHTML = L[q].badge ? L[q].badge : "", we.appendChild(Le), Q.appendChild(we);
                  }
                  if (L[q].title)
                    if (f.options.title == !0) {
                      var De = document.createElement("span");
                      De.innerHTML = L[q].title, Q.appendChild(De);
                    } else
                      Q.setAttribute("title", L[q].title);
                  f.options.app && L[q].route && (Q.route = L[q].route, Q.onclick = function() {
                    f.options.app.pages(this.route);
                  }, f.options.app.pages(L[q].route, {
                    toolbarItem: Q,
                    closed: !0
                  })), typeof L[q].render == "function" && L[q].render(Q, L[q]);
                }
                L[q].onclick && (Q.onclick = L[q].onclick.bind(L[q], E, f, Q)), P.appendChild(Q);
              }
              setTimeout(function() {
                f.refresh();
              }, 0);
            }, f.open = function() {
              re.classList.add("jtoolbar-arrow-selected"), E.getBoundingClientRect();
              var L = te.getBoundingClientRect();
              L.bottom > window.innerHeight || f.options.bottom ? te.style.bottom = "0" : te.style.removeProperty("bottom"), te.style.right = "0", re.children[0].focus(), D(f, !0);
            }, f.close = function() {
              re.classList.remove("jtoolbar-arrow-selected"), D(f, !1);
            }, f.refresh = function() {
              if (f.options.responsive == !0) {
                var L = E.parentNode.getBoundingClientRect();
                f.options.maxWidth || (f.options.maxWidth = L.width);
                var q = parseInt(f.options.maxWidth);
                for (re.parentNode && re.parentNode.removeChild(re); te.firstChild; )
                  P.appendChild(te.firstChild);
                if (q < P.offsetWidth)
                  for (q -= 50; P.lastChild && q < P.offsetWidth; )
                    te.insertBefore(P.lastChild, te.firstChild);
                te.children.length > 0 && P.appendChild(re);
              }
            }, f.setReadonly = function(L) {
              L = L ? "add" : "remove", E.classList[L]("jtoolbar-disabled");
            }, E.onclick = function(L) {
              var q = l.findElement(L.target, "jtoolbar-item");
              q && f.selectItem(q), L.target.classList.contains("jtoolbar-arrow") && f.open();
            }, window.addEventListener("resize", function() {
              f.refresh();
            }), E.classList.add("jtoolbar"), E.innerHTML = "", f.options.container == !0 && E.classList.add("jtoolbar-container");
            var P = document.createElement("div");
            return E.appendChild(P), f.options.app && E.classList.add("jtoolbar-mobile"), f.create(f.options.items), E.toolbar = f, f;
          }
          const $e = [
            "html",
            "body",
            "address",
            "span",
            "div",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "b",
            "i",
            "blockquote",
            "strong",
            "em",
            "ul",
            "ol",
            "li",
            "a",
            "code",
            "pre",
            "hr",
            "br",
            "img",
            "figure",
            "picture",
            "figcaption",
            "iframe",
            "table",
            "thead",
            "tbody",
            "tfoot",
            "tr",
            "th",
            "td",
            "caption",
            "u",
            "del",
            "ins",
            "sub",
            "sup",
            "small",
            "mark",
            "input",
            "textarea",
            "select",
            "option",
            "button",
            "label",
            "fieldset",
            "legend",
            "audio",
            "video",
            "abbr",
            "cite",
            "kbd",
            "section",
            "article",
            "nav",
            "aside",
            "header",
            "footer",
            "main",
            "details",
            "summary",
            "svg",
            "line",
            "source"
          ], W = ["width", "height", "align", "border", "src", "tabindex"], Ie = ["color", "font-weight", "font-size", "background", "background-color", "margin"], Ve = function(E, S) {
            if (E.tagName && $e.indexOf(E.tagName.toLowerCase()) === -1 && E.innerText && (E.innerHTML = E.innerText), E.attributes && E.attributes.length) {
              let f = null, r = E.getAttribute("style");
              if (r) {
                f = [];
                let re = r.split(";");
                for (let te = 0; te < re.length; te++) {
                  let P = re[te].trim().split(":");
                  if (Ie.indexOf(P[0].trim()) >= 0) {
                    let L = P.shift();
                    P = P.join(":"), f.push(L + ":" + P);
                  }
                }
              }
              E.tagName.toUpperCase() === "IMG" && (E.src ? (E.setAttribute("tabindex", "900"), S.push(E.src)) : E.parentNode.removeChild(E));
              let H = [];
              for (let re = 0; re < E.attributes.length; re++)
                H.push(E.attributes[re].name);
              H.length && H.forEach(function(re) {
                if (W.indexOf(re) === -1)
                  E.removeAttribute(re);
                else {
                  let te = E.getAttribute(re);
                  te.indexOf("<") !== -1 && E.setAttribute(re, te.replace("<", "&#60;"));
                }
              }), E.style = "", f && f.length && E.setAttribute("style", f.join(";"));
            }
            if (E.children.length)
              for (let f = E.children.length; f > 0; f--)
                Ve(E.children[f - 1], S);
          };
          var Se = function(E, S) {
            E && (E = E.replace(new RegExp("<!--(.*?)-->", "gsi"), ""));
            let r = new DOMParser().parseFromString(E, "text/html");
            Ve(r, S);
            let H = document.createElement("div");
            return H.innerHTML = r.firstChild.innerHTML, H;
          };
          function Ce() {
            var E = (function(S, f) {
              var r = { type: "editor" };
              r.options = {};
              var H = {
                // Load data from a remove location
                url: null,
                // Initial HTML content
                value: "",
                // Initial snippet
                snippet: null,
                // Add toolbar
                toolbar: !0,
                toolbarOnTop: !1,
                // Website parser is to read websites and images from cross domain
                remoteParser: null,
                // Placeholder
                placeholder: null,
                // Parse URL
                filterPaste: !0,
                // Accept drop files
                dropZone: !0,
                dropAsSnippet: !1,
                acceptImages: !0,
                acceptFiles: !1,
                maxFileSize: 5e6,
                allowImageResize: !0,
                // Style
                maxHeight: null,
                height: null,
                focus: !1,
                // Events
                onclick: null,
                onfocus: null,
                onblur: null,
                onload: null,
                onkeyup: null,
                onkeydown: null,
                onchange: null,
                extensions: null,
                type: null
              };
              for (var re in H)
                f && f.hasOwnProperty(re) ? r.options[re] = f[re] : r.options[re] = H[re];
              var te = null, P = null, L = [];
              r.el = S, typeof r.options.onclick == "function" && (S.onclick = function(ne) {
                r.options.onclick(S, r, ne);
              }), S.classList.add("jeditor-container");
              var q = document.createElement("div");
              q.className = "jsnippet", q.setAttribute("contenteditable", !1);
              var Q = document.createElement("div");
              if (Q.className = "jeditor-toolbar", r.editor = document.createElement("div"), r.editor.setAttribute("contenteditable", !0), r.editor.setAttribute("spellcheck", !1), r.editor.classList.add("jeditor"), r.options.placeholder && r.editor.setAttribute("data-placeholder", r.options.placeholder), (r.options.maxHeight || r.options.height) && (r.editor.style.overflowY = "auto", r.options.maxHeight && (r.editor.style.maxHeight = r.options.maxHeight), r.options.height && (r.editor.style.height = r.options.height)), r.options.url)
                A({
                  url: r.options.url,
                  dataType: "html",
                  success: function(ne) {
                    r.editor.innerHTML = ne, E.setCursor(r.editor, r.options.focus == "initial");
                  }
                });
              else if (r.options.value)
                r.editor.innerHTML = r.options.value;
              else
                for (var le = 0; le < S.children.length; le++)
                  r.editor.appendChild(S.children[le]);
              S.innerHTML = "";
              var he = function(ne) {
                typeof r.options.onchange == "function" && r.options.onchange(S, r, ne), r.options.value = r.getData(), S.value != r.options.value && (S.value = r.options.value, typeof S.oninput == "function" && S.oninput({
                  type: "input",
                  target: S,
                  value: S.value
                }));
              }, me = function(ne) {
                let ce = [];
                if (document.createElement("div"), Se(ne, ce), ce.length)
                  for (var ke = 0; ke < ce.length; ke++)
                    r.addImage(ce[ke]);
              }, we = function() {
                var ne = null;
                if (ne = q.children[0]) {
                  ne.classList.contains("jslider-grid") || ne.classList.add("jslider-grid");
                  var ce = ne.children.length;
                  ne.setAttribute("data-number", ce > 4 ? 4 : ce), ce > 4 ? ne.setAttribute("data-total", ce - 4) : ne.removeAttribute("data-total");
                }
              }, Le = function(ne) {
                q.innerHTML || r.appendSnippet({}), q.children[0].appendChild(ne), we();
              };
              r.appendSnippet = function(ne) {
                q.innerHTML = "";
                for (var ce = ["image", "title", "description", "host", "url"], ke = 0; ke < ce.length; ke++) {
                  var Ae = document.createElement("div");
                  if (Ae.className = "jsnippet-" + ce[ke], Ae.setAttribute("data-k", ce[ke]), q.appendChild(Ae), ne[ce[ke]])
                    if (ce[ke] == "image") {
                      Array.isArray(ne.image) || (ne.image = [ne.image]);
                      for (var ze = 0; ze < ne.image.length; ze++) {
                        var We = document.createElement("img");
                        We.src = ne.image[ze], Ae.appendChild(We);
                      }
                    } else
                      Ae.innerHTML = ne[ce[ke]];
                }
                r.editor.appendChild(document.createElement("br")), r.editor.appendChild(q);
              }, r.setData = function(ne) {
                typeof ne == "object" ? r.editor.innerHTML = ne.content : r.editor.innerHTML = ne, r.options.focus && E.setCursor(r.editor, !0), L = [];
              }, r.getFiles = function() {
                for (var ne = r.editor.querySelectorAll(".jfile"), ce = [], ke = 0; ke < ne.length; ke++)
                  L[ne[ke].src] && ce.push(L[ne[ke].src]);
                return ce;
              }, r.getText = function() {
                return r.editor.innerText;
              }, r.getData = function(ne) {
                if (ne) {
                  var ce = {
                    content: ""
                  };
                  if (q.innerHTML) {
                    ce.snippet = {};
                    for (var ke = 0; ke < q.children.length; ke++) {
                      var Ae = q.children[ke].getAttribute("data-k");
                      if (Ae)
                        if (Ae == "image") {
                          ce.snippet.image || (ce.snippet.image = []);
                          for (var ze = 0; ze < q.children[ke].children.length; ze++)
                            ce.snippet.image.push(q.children[ke].children[ze].getAttribute("src"));
                        } else
                          ce.snippet[Ae] = q.children[ke].innerHTML;
                    }
                  }
                  var We = Object.keys(L);
                  if (We.length) {
                    ce.files = [];
                    for (var ke = 0; ke < We.length; ke++)
                      ce.files.push(L[We[ke]]);
                  }
                  var Ze = document.createElement("div");
                  Ze.innerHTML = r.editor.innerHTML;
                  var Ke = Ze.querySelector(".jsnippet");
                  Ke && Ke.remove();
                  var nt = Ze.innerHTML;
                  nt = nt.replace(/<br>/g, `
`), nt = nt.replace(/<\/div>/g, `</div>
`), nt = nt.replace(/<(?:.|\n)*?>/gm, ""), ce.content = nt.trim(), J("getData", ce);
                } else
                  var ce = r.editor.innerHTML;
                return ce;
              }, r.reset = function() {
                r.editor.innerHTML = "", q.innerHTML = "", L = [];
              }, r.addPdf = function(ne) {
                if (ne.result.substr(0, 4) != "data")
                  console.error("Invalid source");
                else {
                  var ce = document.createElement("canvas");
                  ce.width = 60, ce.height = 60;
                  var ke = new Image(), Ae = ce.getContext("2d");
                  Ae.drawImage(ke, 0, 0, ce.width, ce.height), ce.toBlob(function(ze) {
                    var We = document.createElement("img");
                    We.src = window.URL.createObjectURL(ze), We.title = ne.name, We.className = "jfile pdf", L[We.src] = {
                      file: We.src,
                      extension: "pdf",
                      content: ne.result
                    }, document.execCommand("insertHtml", !1, We.outerHTML);
                  });
                }
              }, r.addImage = function(ne, ce) {
                if (r.options.acceptImages)
                  if (ne || (ne = ""), ne.substr(0, 4) != "data" && !r.options.remoteParser)
                    console.error("remoteParser not defined in your initialization");
                  else {
                    if (ne.substr(0, 4) == "data") {
                      var ke = ne.split(";");
                      ke = ke[0].split("/"), ke = ke[1];
                    } else {
                      var ke = ne.substr(ne.lastIndexOf(".") + 1);
                      ne = r.options.remoteParser + ne;
                    }
                    var Ae = new Image();
                    Ae.onload = function() {
                      var We = document.createElement("canvas");
                      We.width = Ae.width, We.height = Ae.height;
                      var Ze = We.getContext("2d");
                      Ze.drawImage(Ae, 0, 0, We.width, We.height), We.toBlob(function(Ke) {
                        var nt = document.createElement("img");
                        nt.src = window.URL.createObjectURL(Ke), nt.classList.add("jfile"), nt.setAttribute("tabindex", "900"), nt.setAttribute("width", Ae.width), nt.setAttribute("height", Ae.height), L[nt.src] = {
                          file: nt.src,
                          extension: ke,
                          content: We.toDataURL()
                        }, r.options.dropAsSnippet || ce ? (Le(nt), L[nt.src].snippet = !0) : document.execCommand("insertHtml", !1, nt.outerHTML), he();
                      });
                    }, Ae.src = ne;
                  }
              }, r.addFile = function(ne) {
                for (var ce = [], ke = 0; ke < ne.length; ke++)
                  if (ne[ke].size > r.options.maxFileSize)
                    alert("The file is too big");
                  else {
                    var Ae = ne[ke].type.split("/");
                    Ae[0] == "image" ? Ae = 1 : Ae[1] == "pdf" ? Ae = 2 : Ae = 0, Ae ? (ce[ke] = new FileReader(), ce[ke].index = ke, ce[ke].type = Ae, ce[ke].name = ne[ke].name, ce[ke].date = ne[ke].lastModified, ce[ke].size = ne[ke].size, ce[ke].addEventListener("load", function(ze) {
                      ze.target.type == 2 ? r.options.acceptFiles == !0 && r.addPdf(ze.target) : r.addImage(ze.target.result);
                    }, !1), ce[ke].readAsDataURL(ne[ke])) : alert("The extension is not allowed");
                  }
              }, r.destroy = function() {
                r.editor.removeEventListener("mouseup", F), r.editor.removeEventListener("mousedown", Z), r.editor.removeEventListener("mousemove", fe), r.editor.removeEventListener("keyup", ee), r.editor.removeEventListener("keydown", C), r.editor.removeEventListener("dragstart", Xe), r.editor.removeEventListener("dragenter", qe), r.editor.removeEventListener("dragover", se), r.editor.removeEventListener("drop", ve), r.editor.removeEventListener("paste", Te), r.editor.removeEventListener("blur", je), r.editor.removeEventListener("focus", X), S.editor = null, S.classList.remove("jeditor-container"), Q.remove(), q.remove(), r.editor.remove();
              }, r.upload = function() {
                l.click(r.file);
              };
              var De = function(ne) {
                var ce = window.getSelection(), ke = document.createRange();
                ke.selectNode(ne), ce.addRange(ke);
              }, Te = function(ne) {
                if (r.options.filterPaste == !0) {
                  if (ne.clipboardData || ne.originalEvent.clipboardData)
                    var ce = (ne.originalEvent || ne).clipboardData.getData("text/html"), ke = (ne.originalEvent || ne).clipboardData.getData("text/plain"), Ae = (ne.originalEvent || ne).clipboardData.files;
                  else if (window.clipboardData)
                    var ce = window.clipboardData.getData("Html"), ke = window.clipboardData.getData("Text"), Ae = window.clipboardData.files;
                  if (Ae.length)
                    r.addFile(Ae);
                  else if (!ce)
                    ce = ke.split(`\r
`), ne.target.innerText ? (ce = ce.map(function(Ze) {
                      return "<div>" + Ze + "</div>";
                    }), document.execCommand("insertText", !1, ce.join(""))) : ce.map(function(Ze) {
                      var Ke = document.createElement("div");
                      Ke.innerText = Ze, r.editor.appendChild(Ke);
                    });
                  else {
                    let Ze = [];
                    var ze = Se(ce, Ze);
                    if (Ze.length)
                      for (var We = 0; We < Ze.length; We++)
                        r.addImage(Ze[We]);
                    document.execCommand("insertHtml", !1, ze.innerHTML);
                  }
                  ne.preventDefault();
                }
              }, Xe = function(ne) {
                P && P.e && ne.preventDefault();
              }, qe = function(ne) {
                P || r.options.dropZone == !1 || (S.classList.add("jeditor-dragging"), ne.preventDefault());
              }, se = function(ne) {
                P || r.options.dropZone == !1 || (te && clearTimeout(te), te = setTimeout(function() {
                  S.classList.remove("jeditor-dragging");
                }, 100), ne.preventDefault());
              }, ve = function(ne) {
                if (!(P || r.options.dropZone === !1)) {
                  let ce = null;
                  document.caretRangeFromPoint ? ce = document.caretRangeFromPoint(ne.clientX, ne.clientY) : ne.rangeParent && (ce = document.createRange(), ce.setStart(ne.rangeParent, ne.rangeOffset));
                  let ke = window.getSelection();
                  ke.removeAllRanges(), ke.addRange(ce), ke.anchorNode.parentNode.focus();
                  let Ae = (ne.originalEvent || ne).dataTransfer.getData("text/html"), ze = (ne.originalEvent || ne).dataTransfer.getData("text/plain"), We = (ne.originalEvent || ne).dataTransfer.files;
                  We.length ? r.addFile(We) : ze && me(Ae), S.classList.remove("jeditor-dragging"), ne.preventDefault();
                }
              }, je = function(ne) {
                J("onevent", ne), he(ne), typeof r.options.onblur == "function" && r.options.onblur(S, r, ne);
              }, X = function(ne) {
                typeof r.options.onfocus == "function" && r.options.onfocus(S, r, ne);
              }, ee = function(ne) {
                r.editor.innerHTML || (r.editor.innerHTML = "<div><br></div>"), typeof r.options.onkeyup == "function" && r.options.onkeyup(S, r, ne);
              }, C = function(ne) {
                if (J("onevent", ne), ne.key == "Delete" && ne.target.tagName == "IMG") {
                  var ce = ne.target.parentNode;
                  De(ne.target), ce.classList.contains("jsnippet-image") && we();
                }
                typeof r.options.onkeydown == "function" && r.options.onkeydown(S, r, ne);
              }, F = function(ne) {
                if (P && P.e && (P.e.classList.remove("resizing"), P.e.changed == !0)) {
                  var ce = P.e.cloneNode();
                  ce.width = parseInt(P.e.style.width) || P.e.getAttribute("width"), ce.height = parseInt(P.e.style.height) || P.e.getAttribute("height"), P.e.style.width = "", P.e.style.height = "", De(P.e), document.execCommand("insertHtml", !1, ce.outerHTML);
                }
                P = !1;
              }, Z = function(ne) {
                var ce = function(We) {
                  var Ze = We.getBoundingClientRect();
                  Ze.width - (ne.clientX - Ze.left) < 40 && ne.clientY - Ze.top < 40 && (We.innerHTML = "", We.remove());
                };
                if (ne.target.tagName == "IMG")
                  if (ne.target.style.cursor) {
                    var ke = ne.target.getBoundingClientRect();
                    P = {
                      e: ne.target,
                      x: ne.clientX,
                      y: ne.clientY,
                      w: ke.width,
                      h: ke.height,
                      d: ne.target.style.cursor
                    }, ne.target.getAttribute("width") || ne.target.setAttribute("width", ke.width), ne.target.getAttribute("height") || ne.target.setAttribute("height", ke.height);
                    var Ae = window.getSelection();
                    if (Ae.rangeCount)
                      for (var ze = 0; ze < Ae.rangeCount; ze++)
                        Ae.removeRange(Ae.getRangeAt(ze));
                    ne.target.classList.add("resizing");
                  } else
                    P = !0;
                else
                  ne.target.classList.contains("jsnippet") ? ce(ne.target) : ne.target.parentNode.classList.contains("jsnippet") && ce(ne.target.parentNode), P = !0;
              }, fe = function(ne) {
                if (ne.target.tagName == "IMG" && !ne.target.parentNode.classList.contains("jsnippet-image") && r.options.allowImageResize == !0 && ne.target.getAttribute("tabindex")) {
                  var ce = ne.target.getBoundingClientRect();
                  ne.clientY - ce.top < 5 ? ce.width - (ne.clientX - ce.left) < 5 ? ne.target.style.cursor = "ne-resize" : ne.clientX - ce.left < 5 ? ne.target.style.cursor = "nw-resize" : ne.target.style.cursor = "n-resize" : ce.height - (ne.clientY - ce.top) < 5 ? ce.width - (ne.clientX - ce.left) < 5 ? ne.target.style.cursor = "se-resize" : ne.clientX - ce.left < 5 ? ne.target.style.cursor = "sw-resize" : ne.target.style.cursor = "s-resize" : ce.width - (ne.clientX - ce.left) < 5 ? ne.target.style.cursor = "e-resize" : ne.clientX - ce.left < 5 ? ne.target.style.cursor = "w-resize" : ne.target.style.cursor = "";
                }
                if (ne.which == 1 && P && P.d) {
                  if (P.d == "e-resize" || P.d == "ne-resize" || P.d == "se-resize")
                    if (P.e.style.width = P.w + (ne.clientX - P.x), ne.shiftKey) {
                      var ke = (ne.clientX - P.x) * (P.h / P.w);
                      P.e.style.height = P.h + ke;
                    } else
                      var ke = null;
                  ke || (P.d == "s-resize" || P.d == "se-resize" || P.d == "sw-resize") && (ne.shiftKey || (P.e.style.height = P.h + (ne.clientY - P.y))), P.e.changed = !0;
                }
              }, J = function(ne, ce) {
                if (r.options.extensions) {
                  var ke = Object.keys(r.options.extensions);
                  if (ke.length)
                    for (var Ae = 0; Ae < ke.length; Ae++)
                      r.options.extensions[ke[Ae]] && typeof r.options.extensions[ke[Ae]][ne] == "function" && r.options.extensions[ke[Ae]][ne].call(r, ce);
                }
              }, pe = function() {
                if (r.options.extensions) {
                  var ne = Object.keys(r.options.extensions);
                  if (ne.length)
                    for (var ce = 0; ce < ne.length; ce++)
                      r.options.extensions[ne[ce]] && typeof r.options.extensions[ne[ce]] == "function" && (r.options.extensions[ne[ce]] = r.options.extensions[ne[ce]](S, r));
                }
              };
              if (document.addEventListener("mouseup", F), document.addEventListener("mousemove", fe), r.editor.addEventListener("mousedown", Z), r.editor.addEventListener("keyup", ee), r.editor.addEventListener("keydown", C), r.editor.addEventListener("dragstart", Xe), r.editor.addEventListener("dragenter", qe), r.editor.addEventListener("dragover", se), r.editor.addEventListener("drop", ve), r.editor.addEventListener("paste", Te), r.editor.addEventListener("focus", X), r.editor.addEventListener("blur", je), S.appendChild(r.editor), r.options.snippet && r.appendSnippet(r.options.snippet), r.options.toolbar) {
                if (Array.isArray(r.options.toolbar))
                  var Ee = {
                    container: !0,
                    responsive: !0,
                    items: r.options.toolbar
                  };
                else if (r.options.toolbar === !0)
                  var Ee = {
                    container: !0,
                    responsive: !0,
                    items: []
                  };
                else
                  var Ee = r.options.toolbar;
                Ee.items && Ee.items.length || (Ee.items = E.getDefaultToolbar(r)), r.options.toolbarOnTop ? (S.classList.add("toolbar-on-top"), S.insertBefore(Q, S.firstChild)) : (r.editor.style.padding = "15px", S.appendChild(Q)), Re(Q, Ee), Q.addEventListener("click", function() {
                  r.editor.focus();
                });
              }
              return r.file = document.createElement("input"), r.file.style.display = "none", r.file.type = "file", r.file.setAttribute("accept", "image/*"), r.file.onchange = function() {
                r.addFile(this.files);
              }, S.appendChild(r.file), r.options.focus && E.setCursor(r.editor, r.options.focus == "initial"), S.change = r.setData, S.val = function(ne) {
                if (ne === void 0) {
                  var ce = S.getAttribute("data-html") !== "true";
                  return r.getData(ce);
                } else
                  r.setData(ne);
              }, pe(), S.editor = r, typeof r.options.onload == "function" && r.options.onload(S, r, r.editor), r;
            });
            return E.setCursor = function(S, f) {
              S.focus(), document.execCommand("selectAll");
              var r = window.getSelection(), H = r.getRangeAt(0);
              if (f == !0)
                var re = H.startContainer, te = 0;
              else
                var re = H.endContainer, te = re.length;
              H.setStart(re, te), H.setEnd(re, te), r.removeAllRanges(), r.addRange(H);
            }, E.getDefaultToolbar = function(S) {
              var f = function(H, re, te) {
                te.color || (ge(te, {
                  onchange: function(P, L) {
                    te.k === "color" ? document.execCommand("foreColor", !1, L) : document.execCommand("backColor", !1, L);
                  }
                }), te.color.open());
              }, r = [];
              return r.push({
                content: "undo",
                onclick: function() {
                  document.execCommand("undo");
                }
              }), r.push({
                content: "redo",
                onclick: function() {
                  document.execCommand("redo");
                }
              }), r.push({
                type: "divisor"
              }), S.options.toolbarOnTop && (r.push({
                type: "select",
                width: "140px",
                options: ["Default", "Verdana", "Arial", "Courier New"],
                render: function(H) {
                  return '<span style="font-family:' + H + '">' + H + "</span>";
                },
                onchange: function(H, re, te, P, L) {
                  document.execCommand("fontName", !1, P);
                }
              }), r.push({
                type: "select",
                content: "format_size",
                options: ["x-small", "small", "medium", "large", "x-large"],
                render: function(H) {
                  return '<span style="font-size:' + H + '">' + H + "</span>";
                },
                onchange: function(H, re, te, P, L) {
                  document.execCommand("fontSize", !1, parseInt(L) + 1);
                }
              }), r.push({
                type: "select",
                options: ["format_align_left", "format_align_center", "format_align_right", "format_align_justify"],
                render: function(H) {
                  return '<i class="material-icons">' + H + "</i>";
                },
                onchange: function(H, re, te, P, L) {
                  var q = ["JustifyLeft", "justifyCenter", "justifyRight", "justifyFull"];
                  document.execCommand(q[L]);
                }
              }), r.push({
                type: "divisor"
              }), r.push({
                content: "format_color_text",
                k: "color",
                onclick: f
              }), r.push({
                content: "format_color_fill",
                k: "background-color",
                onclick: f
              })), r.push({
                content: "format_bold",
                onclick: function(H, re, te) {
                  document.execCommand("bold"), document.queryCommandState("bold") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                content: "format_italic",
                onclick: function(H, re, te) {
                  document.execCommand("italic"), document.queryCommandState("italic") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                content: "format_underline",
                onclick: function(H, re, te) {
                  document.execCommand("underline"), document.queryCommandState("underline") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                type: "divisor"
              }), r.push({
                content: "format_list_bulleted",
                onclick: function(H, re, te) {
                  document.execCommand("insertUnorderedList"), document.queryCommandState("insertUnorderedList") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                content: "format_list_numbered",
                onclick: function(H, re, te) {
                  document.execCommand("insertOrderedList"), document.queryCommandState("insertOrderedList") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                content: "format_indent_increase",
                onclick: function(H, re, te) {
                  document.execCommand("indent", !0, null), document.queryCommandState("indent") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), r.push({
                content: "format_indent_decrease",
                onclick: function(H, re, te) {
                  document.execCommand("outdent"), document.queryCommandState("outdent") ? te.classList.add("selected") : te.classList.remove("selected");
                }
              }), S.options.toolbarOnTop && (r.push({
                type: "divisor"
              }), r.push({
                content: "photo",
                onclick: function() {
                  S.upload();
                }
              }), r.push({
                type: "select",
                content: "table_view",
                columns: 8,
                grid: 8,
                right: !0,
                options: [
                  "0x0",
                  "1x0",
                  "2x0",
                  "3x0",
                  "4x0",
                  "5x0",
                  "6x0",
                  "7x0",
                  "0x1",
                  "1x1",
                  "2x1",
                  "3x1",
                  "4x1",
                  "5x1",
                  "6x1",
                  "7x1",
                  "0x2",
                  "1x2",
                  "2x2",
                  "3x2",
                  "4x2",
                  "5x2",
                  "6x2",
                  "7x2",
                  "0x3",
                  "1x3",
                  "2x3",
                  "3x3",
                  "4x3",
                  "5x3",
                  "6x3",
                  "7x3",
                  "0x4",
                  "1x4",
                  "2x4",
                  "3x4",
                  "4x4",
                  "5x4",
                  "6x4",
                  "7x4",
                  "0x5",
                  "1x5",
                  "2x5",
                  "3x5",
                  "4x5",
                  "5x5",
                  "6x5",
                  "7x5",
                  "0x6",
                  "1x6",
                  "2x6",
                  "3x6",
                  "4x6",
                  "5x6",
                  "6x6",
                  "7x6",
                  "0x7",
                  "1x7",
                  "2x7",
                  "3x7",
                  "4x7",
                  "5x7",
                  "6x7",
                  "7x7"
                ],
                render: function(H, re) {
                  re && (re.onmouseover = this.onmouseover, H = H.split("x"), re.setAttribute("data-x", H[0]), re.setAttribute("data-y", H[1]));
                  var te = document.createElement("div");
                  return re.style.margin = "1px", re.style.border = "1px solid #ddd", te;
                },
                onmouseover: function(H) {
                  for (var re = parseInt(H.target.getAttribute("data-x")), te = parseInt(H.target.getAttribute("data-y")), P = 0; P < H.target.parentNode.children.length; P++) {
                    var L = H.target.parentNode.children[P], q = parseInt(L.getAttribute("data-x")), Q = parseInt(L.getAttribute("data-y"));
                    q <= re && Q <= te ? (L.style.backgroundColor = "#cae1fc", L.style.borderColor = "#2977ff") : (L.style.backgroundColor = "", L.style.borderColor = "#ddd");
                  }
                },
                onchange: function(H, re, te) {
                  te = te.split("x");
                  for (var P = document.createElement("table"), L = document.createElement("tbody"), q = 0; q <= te[1]; q++) {
                    for (var Q = document.createElement("tr"), le = 0; le <= te[0]; le++) {
                      var he = document.createElement("td");
                      he.innerHTML = "", Q.appendChild(he);
                    }
                    L.appendChild(Q);
                  }
                  P.appendChild(L), P.setAttribute("width", "100%"), P.setAttribute("cellpadding", "6"), P.setAttribute("cellspacing", "0"), document.execCommand("insertHTML", !1, P.outerHTML);
                }
              })), r;
            }, E;
          }
          var Me = Ce();
          function Pe() {
            var E = (function(S, f) {
              var r = {};
              r.options = {};
              var H = {
                type: "big",
                title: "Untitled",
                width: 510,
                height: 472
              };
              for (var re in H)
                f && f.hasOwnProperty(re) ? r.options[re] = f[re] : r.options[re] = H[re];
              var te = function() {
                for (var q = document.createElement("div"); S.children[0]; )
                  q.appendChild(S.children[0]);
                for (r.content = document.createElement("div"), r.content.className = "jfloating_content", r.content.innerHTML = S.innerHTML; q.children[0]; )
                  r.content.appendChild(q.children[0]);
                r.container = document.createElement("div"), r.container.className = "jfloating", r.container.appendChild(r.content), r.options.title ? r.container.setAttribute("title", r.options.title) : r.container.classList.add("no-title"), r.options.width && (r.container.style.width = parseInt(r.options.width) + "px"), r.options.height && (r.container.style.height = parseInt(r.options.height) + "px"), S.innerHTML = "", S.appendChild(r.container);
              }, P = function() {
                r.container && r.container.addEventListener("click", function(q) {
                  var Q = q.target.getBoundingClientRect();
                  if (q.target.classList.contains("jfloating")) {
                    if (q.changedTouches && q.changedTouches[0])
                      var le = q.changedTouches[0].clientX, he = q.changedTouches[0].clientY;
                    else
                      var le = q.clientX, he = q.clientY;
                    Q.width - (le - Q.left) < 50 && he - Q.top < 50 ? setTimeout(function() {
                      r.close();
                    }, 100) : r.setState();
                  }
                });
              }, L = function() {
                r.container.classList.add("jfloating-" + r.options.type);
              };
              return r.state = {
                isMinized: !1
              }, r.setState = function() {
                r.state.isMinized ? r.container.classList.remove("jfloating-minimized") : r.container.classList.add("jfloating-minimized"), r.state.isMinized = !r.state.isMinized;
              }, r.close = function() {
                Components.elements.splice(E.elements.indexOf(r.container), 1), r.updatePosition(), S.remove();
              }, r.updatePosition = function() {
                for (var q = 0; q < E.elements.length; q++) {
                  var Q = E.elements[q], le = E.elements[q - 1];
                  Q.style.right = q * (le ? le.offsetWidth : Q.offsetWidth) * 1.01 + "px";
                }
              }, r.init = function() {
                te(), P(), L(), E.elements.push(r.container), r.updatePosition(), S.floating = r;
              }, r.init(), r;
            });
            return E.elements = [], E;
          }
          var He = Pe();
          function Ye() {
            const E = function(P) {
              return !isNaN(P) && P !== null && (typeof P != "string" || P.trim() !== "");
            }, S = {
              between: function(P, L) {
                return P >= L[0] && P <= L[1];
              },
              "not between": function(P, L) {
                return P < L[0] || P > L[1];
              },
              "<": function(P, L) {
                return P < L[0];
              },
              "<=": function(P, L) {
                return P <= L[0];
              },
              ">": function(P, L) {
                return P > L[0];
              },
              ">=": function(P, L) {
                return P >= L[0];
              },
              "=": function(P, L) {
                return P == L[0];
              },
              "!=": function(P, L) {
                return P != L[0];
              }
            }, f = {
              "valid date": function() {
                return !0;
              },
              "=": function(P, L) {
                return P === L[0];
              },
              "!=": function(P, L) {
                return P !== L[0];
              },
              "<": function(P, L) {
                return P < L[0];
              },
              "<=": function(P, L) {
                return P <= L[0];
              },
              ">": function(P, L) {
                return P > L[0];
              },
              ">=": function(P, L) {
                return P >= L[0];
              },
              between: function(P, L) {
                return P >= L[0] && P <= L[1];
              },
              "not between": function(P, L) {
                return P < L[0] || P > L[1];
              }
            }, r = {
              contains: function(P, L) {
                return P.includes(L[0]);
              },
              "not contains": function(P, L) {
                return !P.includes(L[0]);
              },
              "begins with": function(P, L) {
                return P.startsWith(L[0]);
              },
              "ends with": function(P, L) {
                return P.endsWith(L[0]);
              },
              "=": function(P, L) {
                return P === L[0];
              },
              "!=": function(P, L) {
                return P !== L[0];
              },
              "valid email": function(P) {
                var L = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
                return L.test(P);
              },
              "valid url": function(P) {
                var L = new RegExp(/(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig);
                return L.test(P);
              }
            }, H = function(P, L) {
              return typeof H[L.type] == "function" ? L.allowBlank && (typeof P > "u" || P === "" || P === null) ? !0 : H[L.type].call(this, P, L) : null;
            };
            H.url = function(P) {
              var L = new RegExp(/(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig);
              return !!L.test(P);
            }, H.email = function(P) {
              var L = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
              return !!(P && L.test(P));
            }, H.required = function(P) {
              return !!(P && P.trim());
            }, H.empty = function(P) {
              return typeof P > "u" || P === null || typeof P == "string" && !P.toString().trim();
            }, H["not exist"] = H.empty, H.notEmpty = function(P) {
              return !H.empty(P);
            }, H.exist = H.notEmpty, H.number = function(P, L) {
              if (!E(P))
                return !1;
              if (!L || !L.criteria)
                return !0;
              if (!S[L.criteria])
                return !1;
              let q = L.value.map(function(Q) {
                return parseFloat(Q);
              });
              return S[L.criteria](P, q);
            }, H.login = function(P) {
              let L = new RegExp(/^[a-zA-Z0-9._-]+$/);
              return !!(P && L.test(P));
            }, H.list = function(P, L) {
              let q = typeof P;
              if (q !== "string" && q !== "number")
                return !1;
              let Q;
              return typeof L.value[0] == "string" ? L.source ? Q = L.source : Q = L.value[0].split(",") : Q = L.value[0], Array.isArray(Q) ? Q.findIndex(function(he) {
                return he == P;
              }) > -1 : !1;
            };
            const re = function() {
              let P = /* @__PURE__ */ new Date();
              return P.setHours(0, 0, 0, 0), P;
            }, te = {
              "one year ago": function() {
                let P = re();
                return P.setFullYear(P.getFullYear() - 1), P;
              },
              "one month ago": function() {
                let P = re();
                return P.setMonth(P.getMonth() - 1), P;
              },
              "one week ago": function() {
                let P = re();
                return P.setDate(P.getDate() - 7), P;
              },
              yesterday: function() {
                let P = re();
                return P.setDate(P.getDate() - 1), P;
              },
              today: re,
              tomorrow: function() {
                let P = re();
                return P.setDate(P.getDate() + 1), P;
              }
            };
            return H.date = function(P, L) {
              if (E(P) && P > 0 && P < 1e6 && (P = I.numToDate(P)), new Date(P) == "Invalid Date")
                return !1;
              if (!L || !L.criteria)
                return !0;
              if (!f[L.criteria])
                return !1;
              let q = L.value.map(function(Q) {
                return typeof Q == "string" && te[Q] ? te[Q]().getTime() : new Date(Q).getTime();
              });
              return f[L.criteria](new Date(P).getTime(), q);
            }, H.text = function(P, L) {
              if (typeof P > "u" || P === null)
                P = "";
              else if (typeof P != "string")
                return !1;
              return !L || !L.criteria ? !0 : r[L.criteria] ? r[L.criteria](P, L.value) : !1;
            }, H.textLength = function(P, L) {
              let q;
              return typeof P == "string" ? q = P.length : typeof P < "u" && P !== null && typeof P.toString == "function" ? q = P.toString().length : q = 0, H.number(q, L);
            }, H.time = function(P, L) {
              if (!E(P))
                return !1;
              if (!L || !L.criteria)
                return !0;
              if (!S[L.criteria])
                return !1;
              let q = L.value.map(function(Q) {
                return parseInt(parseFloat(Q) * 10 ** 17) / 10 ** 17;
              });
              return S[L.criteria](parseInt(parseFloat(P) * 10 ** 17) / 10 ** 17, q);
            }, H;
          }
          var et = Ye();
          function tt() {
            var E = (function(S, f) {
              var r = {};
              r.options = {};
              var H = {
                url: null,
                message: "Are you sure? There are unsaved information in your form",
                ignore: !1,
                currentHash: null,
                submitButton: null,
                validations: null,
                onbeforeload: null,
                onload: null,
                onbeforesave: null,
                onsave: null,
                onbeforeremove: null,
                onremove: null,
                onerror: function(L, q) {
                  alert(q);
                }
              };
              for (var re in H)
                f && f.hasOwnProperty(re) ? r.options[re] = f[re] : r.options[re] = H[re];
              r.options.validations || (r.options.validations = {}), r.options.submitButton || (r.options.submitButton = S.querySelector("input[type=submit]")), r.options.submitButton && r.options.url && (r.options.submitButton.onclick = function() {
                r.save();
              }), r.options.validations.email || (r.options.validations.email = et.email), r.options.validations.length || (r.options.validations.length = et.length), r.options.validations.required || (r.options.validations.required = et.required), r.setUrl = function(L) {
                r.options.url = L;
              }, r.load = function() {
                A({
                  url: r.options.url,
                  method: "GET",
                  dataType: "json",
                  queue: !0,
                  success: function(L) {
                    if (typeof r.options.onbeforeload == "function") {
                      var q = r.options.onbeforeload(S, L);
                      q && (L = q);
                    }
                    E.setElements(S, L), typeof r.options.onload == "function" && r.options.onload(S, L);
                  }
                });
              }, r.save = function() {
                var L = r.validate();
                if (L)
                  r.options.onerror(S, L);
                else {
                  var q = E.getElements(S, !0);
                  if (typeof r.options.onbeforesave == "function") {
                    var q = r.options.onbeforesave(S, q);
                    if (q === !1)
                      return;
                  }
                  A({
                    url: r.options.url,
                    method: "POST",
                    dataType: "json",
                    data: q,
                    success: function(Q) {
                      typeof r.options.onsave == "function" && r.options.onsave(S, q, Q);
                    }
                  });
                }
              }, r.remove = function() {
                if (typeof r.options.onbeforeremove == "function") {
                  var L = r.options.onbeforeremove(S, r);
                  if (L === !1)
                    return !1;
                }
                A({
                  url: r.options.url,
                  method: "DELETE",
                  dataType: "json",
                  success: function(q) {
                    typeof r.options.onremove == "function" && r.options.onremove(S, r, q), r.reset();
                  }
                });
              };
              var te = function(L) {
                L.classList.add("error"), r.options.submitButton && r.options.submitButton.setAttribute("disabled", !0);
                var q = L.getAttribute("data-error") || "There is an error in the form";
                return L.setAttribute("title", q), q;
              }, P = function(L) {
                var q = !1;
                L.classList.remove("error"), L.removeAttribute("title");
                for (var Q = S.querySelectorAll("input, select, textarea, div[name]"), le = 0; le < Q.length; le++)
                  Q[le].getAttribute("data-validation") && Q[le].classList.contains("error") && (q = !0);
                r.options.submitButton && (q ? r.options.submitButton.setAttribute("disabled", !0) : r.options.submitButton.removeAttribute("disabled"));
              };
              return r.validateElement = function(L) {
                var q = !1, Q = E.getValue(L), le = L.getAttribute("data-validation");
                return typeof r.options.validations[le] == "function" && !r.options.validations[le](Q, L) ? q = te(L) : L.classList.contains("error") && P(L), q;
              }, r.reset = function() {
                for (var L = S.querySelectorAll("input, select, textarea, div[name]"), q = 0; q < L.length; q++)
                  L[q].getAttribute("name") && (L[q].type == "checkbox" || L[q].type == "radio" ? L[q].checked = !1 : typeof L[q].val == "function" ? L[q].val("") : L[q].value = "");
              }, r.validate = function() {
                for (var L = [], q = S.querySelectorAll("input, select, textarea, div[name]"), Q = 0; Q < q.length; Q++)
                  if (q[Q].getAttribute("data-validation")) {
                    var le = r.validateElement(q[Q]);
                    le && L.push(le);
                  }
                return L.length > 0 ? L.join("<br>") : !1;
              }, r.getError = function() {
                return !!r.validation();
              }, r.setHash = function() {
                return r.getHash(E.getElements(S));
              }, r.getHash = function(L) {
                var q = 0, Q, le;
                if (L.length === 0)
                  return q;
                for (Q = 0; Q < L.length; Q++)
                  le = L.charCodeAt(Q), q = (q << 5) - q + le, q |= 0;
                return q;
              }, r.isChanged = function() {
                var L = r.setHash();
                return r.options.currentHash != L;
              }, r.resetTracker = function() {
                r.options.currentHash = r.setHash(), r.options.ignore = !1;
              }, r.setIgnore = function(L) {
                r.options.ignore = !!L;
              }, setTimeout(function() {
                r.options.currentHash = r.setHash();
              }, 1e3), S.addEventListener("keyup", function(L) {
                L.target.getAttribute("data-validation") && r.validateElement(L.target);
              }), E.hasEvents || (window.addEventListener("beforeunload", function(L) {
                if (r.isChanged() && r.options.ignore == !1) {
                  var q = r.options.message ? r.options.message : "o/";
                  return q ? (typeof L > "u" && (L = window.event), L && (L.returnValue = q), q) : void 0;
                }
              }), E.hasEvents = !0), S.form = r, r;
            });
            return E.getValue = function(S) {
              var f = null;
              if (S.type == "checkbox")
                S.checked == !0 && (f = S.value || !0);
              else if (S.type == "radio")
                S.checked == !0 && (f = S.value);
              else if (S.type == "file")
                f = S.files;
              else if (S.tagName == "select" && S.multiple == !0) {
                f = [];
                for (var r = S.querySelectorAll("options[selected]"), H = 0; H < r.length; H++)
                  f.push(r[H].value);
              } else typeof S.val == "function" ? f = S.val() : f = S.value || "";
              return f;
            }, E.getElements = function(S, f) {
              for (var r = {}, H = null, re = S.querySelectorAll("input, select, textarea, div[name]"), te = 0; te < re.length; te++)
                (H = re[te].getAttribute("name")) && (r[H] = E.getValue(re[te]) || "");
              return f == !0 ? r : JSON.stringify(r);
            }, E.setElements = function(S, f) {
              for (var r = null, H = null, re = S.querySelectorAll("input, select, textarea, div[name]"), te = 0; te < re.length; te++) {
                var P = re[te].getAttribute("type");
                if (r = re[te].getAttribute("name")) {
                  if (r = r.replace(new RegExp(/\[(.*?)\]/ig), ".$1"), H = null, r.match(/\./)) {
                    var L = h.call(f, r) || "";
                    typeof L < "u" && (H = L);
                  } else
                    typeof f[r] < "u" && (H = f[r]);
                  H !== null && (P == "checkbox" || P == "radio" ? re[te].checked = !!H : P == "file" || (typeof re[te].val == "function" ? re[te].val(H) : re[te].value = H));
                }
              }
            }, E;
          }
          var at = tt();
          function ft() {
            var E = function() {
              var f = null, r = function(P) {
                if (P.which == 27)
                  for (var L = document.querySelectorAll(".jmodal"), q = 0; q < L.length; q++)
                    L[q].parentNode.modal.close();
              }, H = function(P) {
                let L = P.composedPath();
                var q = l.findElement(L[0], "jmodal");
                if (q) {
                  var Q = q.getBoundingClientRect();
                  if (P.changedTouches && P.changedTouches[0])
                    var le = P.changedTouches[0].clientX, he = P.changedTouches[0].clientY;
                  else
                    var le = P.clientX, he = P.clientY;
                  Q.width - (le - Q.left) < 50 && he - Q.top < 50 && q.parentNode.modal.close();
                }
                f && (f.element.style.cursor = "auto", f = null);
              }, re = function(P) {
                let L = P.composedPath();
                var q = l.findElement(L[0], "jmodal");
                if (q) {
                  var Q = q.getBoundingClientRect();
                  if (P.changedTouches && P.changedTouches[0])
                    var le = P.changedTouches[0].clientX, he = P.changedTouches[0].clientY;
                  else
                    var le = P.clientX, he = P.clientY;
                  Q.width - (le - Q.left) < 50 && he - Q.top < 50 || he - Q.top < 50 && (document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges(), f = {
                    left: Q.left,
                    top: Q.top,
                    x: P.clientX,
                    y: P.clientY,
                    width: Q.width,
                    height: Q.height,
                    element: q
                  });
                }
              }, te = function(P) {
                if (f) {
                  if (P = P || window.event, P.buttons)
                    var L = P.buttons;
                  else if (P.button)
                    var L = P.button;
                  else
                    var L = P.which;
                  L ? (f.element.style.top = f.top + (P.clientY - f.y) + f.height / 2 + "px", f.element.style.left = f.left + (P.clientX - f.x) + f.width / 2 + "px", f.element.style.cursor = "move") : f.element.style.cursor = "auto";
                }
              };
              document.addEventListener("keydown", r), document.addEventListener("mouseup", H), document.addEventListener("mousedown", re), document.addEventListener("mousemove", te);
            }, S = (function(f, r) {
              var H = {};
              H.options = {};
              var re = {
                url: null,
                onopen: null,
                onclose: null,
                onload: null,
                closed: !1,
                width: null,
                height: null,
                title: null,
                padding: null,
                backdrop: !0,
                icon: null
              };
              for (var te in re)
                r && r.hasOwnProperty(te) ? H.options[te] = r[te] : H.options[te] = re[te];
              !H.options.title && f.getAttribute("title") && (H.options.title = f.getAttribute("title"));
              for (var P = document.createElement("div"); f.children[0]; )
                P.appendChild(f.children[0]);
              for (H.title = document.createElement("div"), H.title.className = "jmodal_title", H.options.icon && H.title.setAttribute("data-icon", H.options.icon), H.content = document.createElement("div"), H.content.className = "jmodal_content", H.content.innerHTML = f.innerHTML; P.children[0]; )
                H.content.appendChild(P.children[0]);
              if (H.container = document.createElement("div"), H.container.className = "jmodal", H.container.appendChild(H.title), H.container.appendChild(H.content), H.options.padding && (H.content.style.padding = H.options.padding), H.options.width && (H.container.style.width = H.options.width), H.options.height && (H.container.style.height = H.options.height), H.options.title) {
                var L = document.createElement("h4");
                L.innerText = H.options.title, H.title.appendChild(L);
              }
              if (f.innerHTML = "", f.style.display = "none", f.appendChild(H.container), H.options.backdrop) {
                var q = document.createElement("div");
                q.className = "jmodal_backdrop", q.onclick = function() {
                  H.close();
                }, f.appendChild(q);
              }
              return H.open = function() {
                f.style.display = "block";
                var Q = H.container.getBoundingClientRect();
                l.getWindowWidth() < Q.width ? (H.container.style.top = "", H.container.style.left = "", H.container.classList.add("jmodal_fullscreen"), N.slideBottom(H.container, 1)) : H.options.backdrop && (q.style.display = "block"), typeof H.options.onopen == "function" && H.options.onopen(f, H);
              }, H.resetPosition = function() {
                H.container.style.top = "", H.container.style.left = "";
              }, H.isOpen = function() {
                return f.style.display != "none";
              }, H.close = function() {
                H.isOpen() && (f.style.display = "none", H.options.backdrop && (q.style.display = ""), H.container.classList.remove("jmodal_fullscreen"), typeof H.options.onclose == "function" && H.options.onclose(f, H));
              }, H.options.url ? A({
                url: H.options.url,
                method: "GET",
                dataType: "text/html",
                success: function(Q) {
                  H.content.innerHTML = Q, H.options.closed || H.open(), typeof H.options.onload == "function" && H.options.onload(H);
                }
              }) : (H.options.closed || H.open(), typeof H.options.onload == "function" && H.options.onload(H)), f.modal = H, E(), E = function() {
              }, H;
            });
            return S;
          }
          var pt = ft();
          function Ot() {
            var E = function(S) {
              var f = {};
              f.options = {};
              var r = {
                icon: null,
                name: "Notification",
                date: null,
                error: null,
                title: null,
                message: null,
                timeout: 4e3,
                autoHide: !0,
                closeable: !0
              };
              for (var H in r)
                S && S.hasOwnProperty(H) ? f.options[H] = S[H] : f.options[H] = r[H];
              var re = document.createElement("div");
              re.className = "jnotification", f.options.error && re.classList.add("jnotification-error");
              var te = document.createElement("div");
              te.className = "jnotification-container", re.appendChild(te);
              var P = document.createElement("div");
              P.className = "jnotification-header", te.appendChild(P);
              var L = document.createElement("div");
              if (L.className = "jnotification-image", P.appendChild(L), f.options.icon) {
                var q = document.createElement("img");
                q.src = f.options.icon, L.appendChild(q);
              }
              var Q = document.createElement("div");
              if (Q.className = "jnotification-name", Q.innerHTML = f.options.name, P.appendChild(Q), f.options.closeable == !0) {
                var le = document.createElement("div");
                le.className = "jnotification-close", le.onclick = function() {
                  f.hide();
                }, P.appendChild(le);
              }
              var he = document.createElement("div");
              he.className = "jnotification-date", P.appendChild(he);
              var me = document.createElement("div");
              if (me.className = "jnotification-content", te.appendChild(me), f.options.title) {
                var we = document.createElement("div");
                we.className = "jnotification-title", we.innerHTML = f.options.title, me.appendChild(we);
              }
              var Le = document.createElement("div");
              if (Le.className = "jnotification-message", Le.innerHTML = f.options.message, me.appendChild(Le), f.show = function() {
                document.body.appendChild(re), l.getWindowWidth() > 800 ? N.fadeIn(re) : N.slideTop(re, 1);
              }, f.hide = function() {
                l.getWindowWidth() > 800 ? N.fadeOut(re, function() {
                  re.parentNode && (re.parentNode.removeChild(re), De && clearTimeout(De));
                }) : N.slideTop(re, 0, function() {
                  re.parentNode && (re.parentNode.removeChild(re), De && clearTimeout(De));
                });
              }, f.show(), f.options.autoHide == !0)
                var De = setTimeout(function() {
                  f.hide();
                }, f.options.timeout);
              return l.getWindowWidth() < 800 && re.addEventListener("swipeup", function(Te) {
                f.hide(), Te.preventDefault(), Te.stopPropagation();
              }), f;
            };
            return E.isVisible = function() {
              var S = document.querySelector(".jnotification");
              return !!(S && S.parentNode);
            }, E;
          }
          var Bt = Ot();
          function _t(E, S) {
            var f = {};
            f.options = {};
            var r = {
              value: 0,
              onchange: null,
              width: null
            };
            for (var H in r)
              S && S.hasOwnProperty(H) ? f.options[H] = S[H] : f.options[H] = r[H];
            E.classList.add("jprogressbar"), E.setAttribute("tabindex", 1), E.setAttribute("data-value", f.options.value);
            var re = document.createElement("div");
            re.style.width = f.options.value + "%", re.style.color = "#fff", E.appendChild(re), f.options.width && (E.style.width = f.options.width), f.setValue = function(P) {
              P = parseInt(P), f.options.value = P, re.style.width = P + "%", E.setAttribute("data-value", P + "%"), P < 6 ? E.style.color = "#000" : E.style.color = "#fff", f.options.value = P, typeof f.options.onchange == "function" && f.options.onchange(E, P), E.value != f.options.value && (E.value = f.options.value, typeof E.oninput == "function" && E.oninput({
                type: "input",
                target: E,
                value: E.value
              }));
            }, f.getValue = function() {
              return f.options.value;
            };
            var te = function(P) {
              if (P.which) {
                var L = E.getBoundingClientRect();
                if (P.changedTouches && P.changedTouches[0]) {
                  var q = P.changedTouches[0].clientX;
                  P.changedTouches[0].clientY;
                } else {
                  var q = P.clientX;
                  P.clientY;
                }
                f.setValue(Math.round((q - L.left) / L.width * 100));
              }
            };
            return "touchstart" in document.documentElement ? (E.addEventListener("touchstart", te), E.addEventListener("touchend", te)) : (E.addEventListener("mousedown", te), E.addEventListener("mousemove", te)), E.change = f.setValue, E.val = function(P) {
              if (P === void 0)
                return f.getValue();
              f.setValue(P);
            }, E.progressbar = f, f;
          }
          function Pt(E, S) {
            if (E.rating)
              return E.rating.setOptions(S, !0);
            var f = {};
            f.options = {}, f.setOptions = function(H, re) {
              var te = {
                number: 5,
                value: 0,
                tooltip: ["Very bad", "Bad", "Average", "Good", "Very good"],
                onchange: null
              };
              for (var P in te)
                H && H.hasOwnProperty(P) ? f.options[P] = H[P] : (typeof f.options[P] > "u" || re === !0) && (f.options[P] = te[P]);
              E.innerHTML = "";
              for (var L = 0; L < f.options.number; L++) {
                var q = document.createElement("div");
                q.setAttribute("data-index", L + 1), q.setAttribute("title", f.options.tooltip[L]), E.appendChild(q);
              }
              if (f.options.value)
                for (var L = 0; L < f.options.number; L++)
                  L < f.options.value && E.children[L].classList.add("jrating-selected");
              return f;
            }, f.setValue = function(H) {
              for (var re = 0; re < f.options.number; re++)
                re < H ? E.children[re].classList.add("jrating-selected") : (E.children[re].classList.remove("jrating-over"), E.children[re].classList.remove("jrating-selected"));
              f.options.value = H, typeof f.options.onchange == "function" && f.options.onchange(E, H), E.value != f.options.value && (E.value = f.options.value, typeof E.oninput == "function" && E.oninput({
                type: "input",
                target: E,
                value: E.value
              }));
            }, f.getValue = function() {
              return f.options.value;
            };
            var r = function() {
              f.setOptions(S), E.classList.add("jrating"), E.addEventListener("click", function(H) {
                var re = H.target.getAttribute("data-index");
                re != null && (re == f.options.value ? f.setValue(0) : f.setValue(re));
              }), E.addEventListener("mouseover", function(H) {
                for (var re = H.target.getAttribute("data-index"), te = 0; te < f.options.number; te++)
                  te < re ? E.children[te].classList.add("jrating-over") : E.children[te].classList.remove("jrating-over");
              }), E.addEventListener("mouseout", function(H) {
                for (var re = 0; re < f.options.number; re++)
                  E.children[re].classList.remove("jrating-over");
              }), E.change = f.setValue, E.val = function(H) {
                if (H === void 0)
                  return f.getValue();
                f.setValue(H);
              }, E.rating = f;
            };
            return r(), f;
          }
          function Et(E, S) {
            if (E.search)
              return E.search;
            var f = null, r = function(q) {
              if (q.target.classList.contains("jsearch_item"))
                var Q = q.target;
              else
                var Q = q.target.parentNode;
              P.selectIndex(Q), q.preventDefault();
            }, H = function(q) {
              if (typeof P.options.onsearch == "function") {
                var Q = P.options.onsearch(P, q);
                Q && (q = Q);
              }
              if (L.innerHTML = "", !q.length)
                E.style.display = "";
              else {
                E.style.display = "block";
                for (var le = q.length < 11 ? q.length : 10, he = 0; he < le; he++) {
                  if (typeof q[he] == "string")
                    var me = q[he], we = q[he];
                  else {
                    var me = q[he].text;
                    !me && q[he].name && (me = q[he].name);
                    var we = q[he].value;
                    !we && q[he].id && (we = q[he].id);
                  }
                  var Le = document.createElement("div");
                  Le.setAttribute("data-value", we), Le.setAttribute("data-text", me), Le.className = "jsearch_item", q[he].id && Le.setAttribute("id", q[he].id), P.options.forceSelect && he == 0 && Le.classList.add("selected");
                  var De = document.createElement("img");
                  q[he].image ? De.src = q[he].image : De.style.display = "none", Le.appendChild(De);
                  var Te = document.createElement("div");
                  Te.innerHTML = me, Le.appendChild(Te), L.appendChild(Le);
                }
              }
            }, re = function(q) {
              if (q != P.terms)
                if (P.terms = q, P.options.forceSelect ? f = 0 : f = null, Array.isArray(P.options.data)) {
                  var Q = function(he) {
                    if (typeof he == "string") {
                      if (("" + he).toLowerCase().search(q.toLowerCase()) >= 0)
                        return !0;
                    } else
                      for (var me in he) {
                        var we = he[me];
                        if (("" + we).toLowerCase().search(q.toLowerCase()) >= 0)
                          return !0;
                      }
                    return !1;
                  }, le = P.options.data.filter(function(he) {
                    return Q(he);
                  });
                  H(le);
                } else
                  A({
                    url: P.options.data + q,
                    method: "GET",
                    dataType: "json",
                    success: function(he) {
                      H(he);
                    }
                  });
            }, te = null, P = function(q) {
              te && clearTimeout(te), te = setTimeout(function() {
                re(q);
              }, 500);
            };
            S.forceSelect === null && (S.forceSelect = !0), P.options = {
              data: S.data || null,
              input: S.input || null,
              searchByNode: S.searchByNode || null,
              onselect: S.onselect || null,
              forceSelect: S.forceSelect,
              onsearch: S.onsearch || null,
              onbeforesearch: S.onbeforesearch || null
            }, P.selectIndex = function(q) {
              var Q = q.getAttribute("id"), le = q.getAttribute("data-text"), he = q.getAttribute("data-value"), me = q.children[0].src || "";
              typeof P.options.onselect == "function" && P.options.onselect(P, le, he, Q, me), P.close();
            }, P.open = function() {
              E.style.display = "block";
            }, P.close = function() {
              te && clearTimeout(te), P.terms = "", L.innerHTML = "", E.style.display = "";
            }, P.isOpened = function() {
              return !!E.style.display;
            }, P.keydown = function(q) {
              P.isOpened() && (q.key == "Enter" ? f !== null && L.children[f] ? (P.selectIndex(L.children[f]), q.preventDefault()) : P.close() : q.key === "ArrowUp" ? (f !== null && L.children[0] && (L.children[f].classList.remove("selected"), !P.options.forceSelect && f === 0 ? f = null : (f = Math.max(0, f - 1), L.children[f].classList.add("selected"))), q.preventDefault()) : q.key === "ArrowDown" && (f == null ? f = -1 : L.children[f].classList.remove("selected"), f < 9 && L.children[f + 1] && f++, L.children[f].classList.add("selected"), q.preventDefault()));
            }, P.keyup = function(q) {
              if (!P.options.searchByNode && P.options.input)
                if (P.options.input.tagName === "DIV")
                  var Q = P.options.input.innerText;
                else
                  var Q = P.options.input.value;
              else {
                var le = l.getNode();
                if (le)
                  var Q = le.innerText;
              }
              if (typeof P.options.onbeforesearch == "function") {
                var he = P.options.onbeforesearch(P, Q);
                if (he)
                  Q = he;
                else if (he === !1)
                  return;
              }
              P(Q);
            }, P.blur = function(q) {
              P.close();
            }, P.options.input && (P.options.input.addEventListener("keyup", P.keyup), P.options.input.addEventListener("keydown", P.keydown), P.options.input.addEventListener("blur", P.blur));
            var L = document.createElement("div");
            return L.classList.add("jsearch_container"), L.onmousedown = r, E.appendChild(L), E.classList.add("jsearch"), E.search = P, P;
          }
          function Ft(E, S) {
            var f = {};
            if (f.options = {}, f.currentImage = null, S && (f.options = S), E.setAttribute("tabindex", "900"), f.options.items = [], !E.classList.contains("jslider")) {
              if (E.classList.add("jslider"), E.classList.add("unselectable"), f.options.height && (E.style.minHeight = parseInt(f.options.height) + "px"), f.options.width && (E.style.width = parseInt(f.options.width) + "px"), f.options.grid) {
                E.classList.add("jslider-grid");
                var r = E.children.length;
                r > 4 && E.setAttribute("data-total", r - 4), E.setAttribute("data-number", r > 4 ? 4 : r);
              }
              var H = document.createElement("div");
              if (H.classList.add("jslider-counter"), E.children.length > 0)
                for (var re = 0; re < E.children.length; re++) {
                  f.options.items.push(E.children[re]);
                  var te = document.createElement("div");
                  te.onclick = function() {
                    var le = Array.prototype.slice.call(H.children).indexOf(this);
                    f.show(f.currentImage = f.options.items[le]);
                  }, H.appendChild(te);
                }
              var P = document.createElement("div");
              P.className = "jslider-caption";
              var L = document.createElement("div"), q = document.createElement("div");
              q.className = "jslider-close", q.innerHTML = "", q.onclick = function() {
                f.close();
              }, L.appendChild(P), L.appendChild(q);
            }
            f.updateCounter = function(le) {
              for (var he = 0; he < H.children.length; he++)
                if (H.children[he].classList.contains("jslider-counter-focus")) {
                  H.children[he].classList.remove("jslider-counter-focus");
                  break;
                }
              H.children[le].classList.add("jslider-counter-focus");
            }, f.show = function(le) {
              if (!le)
                var le = E.children[0];
              E.classList.add("jslider-focus"), E.classList.remove("jslider-grid"), E.appendChild(L), E.appendChild(H);
              var he = f.options.items.indexOf(le);
              f.updateCounter(he);
              for (var me = 0; me < E.children.length; me++)
                E.children[me].style.display = "";
              le.style.display = "block", le.previousElementSibling ? E.classList.add("jslider-left") : E.classList.remove("jslider-left"), le.nextElementSibling && le.nextElementSibling.tagName == "IMG" ? E.classList.add("jslider-right") : E.classList.remove("jslider-right"), f.currentImage = le, f.currentImage.offsetHeight > f.currentImage.offsetWidth && f.currentImage.classList.add("jslider-vertical"), L.children[0].innerText = f.currentImage.getAttribute("title");
            }, f.open = function() {
              f.show(), typeof f.options.onopen == "function" && f.options.onopen(E);
            }, f.close = function() {
              E.classList.remove("jslider-focus"), E.classList.remove("jslider-left"), E.classList.remove("jslider-right"), f.options.grid && E.classList.add("jslider-grid");
              for (var le = 0; le < E.children.length; le++)
                E.children[le].style.display = "";
              H.remove(), L.remove(), f.currentImage = null, typeof f.options.onclose == "function" && f.options.onclose(E);
            }, f.reset = function() {
              E.innerHTML = "";
            }, f.next = function() {
              var le = f.currentImage.nextElementSibling;
              le && le.tagName === "IMG" && f.show(f.currentImage.nextElementSibling);
            }, f.prev = function() {
              f.currentImage.previousElementSibling && f.show(f.currentImage.previousElementSibling);
            };
            var Q = function(le) {
              if (le.target.tagName == "IMG")
                f.show(le.target);
              else if (!le.target.classList.contains("jslider-close") && !(le.target.parentNode.classList.contains("jslider-counter") || le.target.classList.contains("jslider-counter"))) {
                var he = le.offsetX || le.changedTouches[0].clientX;
                le.target.clientWidth - he < 40 ? f.next() : he < 40 && f.prev();
              }
            };
            return "ontouchend" in document.documentElement ? E.addEventListener("touchend", Q) : E.addEventListener("mouseup", Q), E.addEventListener("swipeleft", function(le) {
              f.next(), le.preventDefault(), le.stopPropagation();
            }), E.addEventListener("swiperight", function(le) {
              f.prev(), le.preventDefault(), le.stopPropagation();
            }), E.addEventListener("keydown", function(le) {
              le.which == 27 && f.close();
            }), E.slider = f, f;
          }
          function Mt(E, S) {
            if (E.tags)
              return E.tags.setOptions(S, !0);
            var f = { type: "tags" };
            f.options = {};
            var r = function() {
              return !!(f.options.limit && E.children.length >= f.options.limit);
            }, H = null, re = null;
            f.setOptions = function(se, ve) {
              var je = {
                value: "",
                limit: null,
                search: null,
                placeholder: null,
                validation: null,
                onbeforepaste: null,
                onbeforechange: null,
                onremoveitem: null,
                onlimit: null,
                onchange: null,
                onfocus: null,
                onblur: null,
                onload: null
              };
              for (var X in je)
                se && se.hasOwnProperty(X) ? f.options[X] = se[X] : (typeof f.options[X] > "u" || ve === !0) && (f.options[X] = je[X]);
              return f.options.placeholder ? E.setAttribute("data-placeholder", f.options.placeholder) : E.removeAttribute("data-placeholder"), E.placeholder = f.options.placeholder, f.setValue(f.options.value), q(), f.options.search ? re || (re = document.createElement("div"), E.parentNode.insertBefore(re, E.nextSibling), H = Et(re, {
                data: f.options.search,
                onselect: function(ee, C, F) {
                  f.selectIndex(C, F);
                }
              })) : re && (H = null, re.remove(), re = null), f;
            }, f.add = function(se, ve) {
              if (typeof f.options.onbeforechange == "function") {
                var je = f.options.onbeforechange(E, f, f.options.value, se);
                if (je === !1)
                  return !1;
                je != null && (se = je);
              }
              if (H && H.close(), r())
                typeof f.options.onlimit == "function" ? f.options.onlimit(f, f.options.limit) : alert(o.translate("You reach the limit number of entries") + " " + f.options.limit);
              else {
                var X = l.getNode();
                if (X && X.parentNode && X.parentNode.classList.contains("jtags") && X.nextSibling && !(X.nextSibling.innerText && X.nextSibling.innerText.trim()))
                  ee = X.nextSibling;
                else {
                  if (E.lastChild && (E.lastChild.innerText.trim() || E.removeChild(E.lastChild)), !se || typeof se == "string")
                    var ee = P(se, se, X);
                  else
                    for (var C = 0; C <= se.length; C++)
                      if (!r()) {
                        if (!se[C] || typeof se[C] == "string")
                          var F = se[C] || "", Z = null;
                        else
                          var F = se[C].text, Z = se[C].value;
                        var ee = P(F, Z);
                      }
                  L();
                }
                ve && te(ee);
              }
            }, f.setLimit = function(se) {
              for (f.options.limit = se, E.children.length - se; E.children.length > se; )
                E.removeChild(E.lastChild);
            }, f.remove = function(se) {
              se.parentNode.removeChild(se), E.children.length ? L() : f.add("", !0), typeof f.options.onremoveitem == "function" && f.options.onremoveitem(E, f, se);
            }, f.getData = function() {
              for (var se = [], ve = 0; ve < E.children.length; ve++) {
                var je = E.children[ve].innerText.replace(`
`, ""), X = E.children[ve].getAttribute("data-value");
                X || (X = je), (je || X) && se.push({ text: je, value: X });
              }
              return se;
            }, f.getValue = function(se) {
              var ve = null;
              if (se != null)
                ve = E.children[se].getAttribute("data-value"), ve || (ve = E.children[se].innerText.replace(`
`, ""));
              else {
                for (var je = [], X = 0; X < E.children.length; X++)
                  ve = E.children[X].innerText.replace(`
`, ""), ve && je.push(f.getValue(X));
                ve = je.join(",");
              }
              return ve;
            }, f.setValue = function(se) {
              if (!se)
                f.reset();
              else if (E.value != se)
                if (Array.isArray(se))
                  f.add(se);
                else {
                  var ve = ("" + se).trim(), je = le(ve);
                  E.innerHTML = "", f.add(je);
                }
            }, f.reset = function() {
              E.classList.add("jtags-empty"), E.innerHTML = "<div></div>", L();
            }, f.isValid = function() {
              for (var se = 0, ve = 0; ve < E.children.length; ve++)
                E.children[ve].classList.contains("jtags_error") && se++;
              return se == 0;
            }, f.selectIndex = function(se, ve) {
              var je = l.getNode();
              je && (je.innerText = se, ve && je.setAttribute("data-value", ve), je.classList.remove("jtags_error"), r() || f.add("", !0));
            }, f.search = function(se) {
              se.innerText;
            }, f.destroy = function() {
              E.removeEventListener("mouseup", De), E.removeEventListener("keydown", me), E.removeEventListener("keyup", we), E.removeEventListener("paste", Le), E.removeEventListener("focus", Te), E.removeEventListener("blur", Xe), E.parentNode.removeChild(E);
            };
            var te = function(se) {
              if (E.children.length) {
                var ve = document.createRange(), je = window.getSelection();
                if (!se)
                  var se = E.childNodes[E.childNodes.length - 1];
                ve.setStart(se, se.length), ve.collapse(!0), je.removeAllRanges(), je.addRange(ve), E.scrollLeft = E.scrollWidth;
              }
            }, P = function(se, ve, je) {
              var X = document.createElement("div");
              return X.textContent = se || "", ve && X.setAttribute("data-value", ve), je && je.parentNode.classList.contains("jtags") ? E.insertBefore(X, je.nextSibling) : E.appendChild(X), X;
            }, L = function() {
              var se = f.getValue();
              se != f.options.value && (f.options.value = se, typeof f.options.onchange == "function" && f.options.onchange(E, f, f.options.value), E.value != f.options.value && (E.value = f.options.value, typeof E.oninput == "function" && E.oninput({
                type: "input",
                target: E,
                value: E.value
              }))), q();
            }, q = function() {
              for (var se = 0; se < E.children.length; se++)
                E.children[se].tagName === "DIV" && (f.getValue(se) ? (E.children[se].classList.add("jtags_label"), typeof f.options.validation == "function" && f.getValue(se) ? f.options.validation(E.children[se], E.children[se].innerText, E.children[se].getAttribute("data-value")) ? E.children[se].classList.remove("jtags_error") : E.children[se].classList.add("jtags_error") : E.children[se].classList.remove("jtags_error")) : E.children[se].classList.remove("jtags_label"));
              Q();
            }, Q = function() {
              E.innerText.trim() ? E.classList.remove("jtags-empty") : (!E.children.length || E.children[0].tagName === "BR") && (E.innerHTML = "", te(P()));
            }, le = function(se) {
              var ve = [], je = "";
              if (se = se.trim(), se) {
                for (var X = 0; X < se.length; X++)
                  se[X] == "," || se[X] == ";" || se[X] == `
` ? je && (ve.push(je.trim()), je = "") : je += se[X];
                je && ve.push(je);
              }
              return ve;
            }, he = 0, me = function(se) {
              if (he = window.getSelection().anchorOffset, Q(), se.key === "Tab" || se.key === ";" || se.key === ",") {
                var ve = window.getSelection().anchorOffset;
                ve > 1 && (r() ? typeof f.options.onlimit == "function" && f.options.onlimit(f, f.options.limit) : f.add("", !0)), se.preventDefault();
              } else if (se.key == "Enter") {
                if (!H || !H.isOpened()) {
                  var ve = window.getSelection().anchorOffset;
                  ve > 1 && (r() || f.add("", !0)), se.preventDefault();
                }
              } else se.key == "Backspace" && E.children.length == 1 && window.getSelection().anchorOffset < 1 && se.preventDefault();
              H && H.keydown(se), Q();
            }, we = function(se) {
              if (se.which == 39) {
                var ve = window.getSelection().anchorOffset;
                ve > 1 && ve == he && f.add("", !0);
              } else se.which == 13 || se.which == 38 || se.which == 40 ? se.preventDefault() : H && H.keyup(se);
              q();
            }, Le = function(se) {
              if (se.clipboardData || se.originalEvent.clipboardData)
                var ve = (se.originalEvent || se).clipboardData.getData("text/plain");
              else if (window.clipboardData)
                var ve = window.clipboardData.getData("Text");
              var je = le(ve);
              if (typeof f.options.onbeforepaste == "function") {
                var X = f.options.onbeforepaste(E, f, je);
                if (X === !1)
                  return se.preventDefault(), !1;
                X && (je = X);
              }
              je.length > 1 ? (f.add(je, !0), se.preventDefault()) : je[0] && (document.execCommand("insertText", !1, je[0]), se.preventDefault());
            }, De = function(se) {
              if (se.target.parentNode && se.target.parentNode.classList.contains("jtags") && (se.target.classList.contains("jtags_label") || se.target.classList.contains("jtags_error"))) {
                var ve = se.target.getBoundingClientRect();
                ve.width - (se.clientX - ve.left) < 16 && f.remove(se.target);
              }
              se.target == E && te();
            }, Te = function() {
              E.classList.contains("jtags-focus") || ((!E.children.length || f.getValue(E.children.length - 1)) && (r() || P("")), typeof f.options.onfocus == "function" && f.options.onfocus(E, f, f.getValue()), E.classList.add("jtags-focus"));
            }, Xe = function() {
              if (E.classList.contains("jtags-focus")) {
                H && H.close();
                for (var se = 0; se < E.children.length - 1; se++)
                  f.getValue(se) || E.removeChild(E.children[se]);
                L(), E.classList.remove("jtags-focus"), typeof f.options.onblur == "function" && f.options.onblur(E, f, f.getValue());
              }
            }, qe = function() {
              "touchend" in document.documentElement ? E.addEventListener("touchend", De) : E.addEventListener("mouseup", De), E.addEventListener("keydown", me), E.addEventListener("keyup", we), E.addEventListener("paste", Le), E.addEventListener("focus", Te), E.addEventListener("blur", Xe), E.setAttribute("contenteditable", !0), E.classList.add("jtags"), f.setOptions(S), typeof f.options.onload == "function" && f.options.onload(E, f), E.change = f.setValue, E.val = function(se) {
                if (se === void 0)
                  return f.getValue();
                f.setValue(se);
              }, E.tags = f;
            };
            return qe(), f;
          }
          function Lt(E, S) {
            var f = {};
            f.options = {};
            var r = {
              type: "image",
              extension: "*",
              input: !1,
              minWidth: !1,
              maxWidth: null,
              maxHeight: null,
              maxJpegSizeBytes: null,
              // For example, 350Kb would be 350000
              onchange: null,
              multiple: !1,
              remoteParser: null
            };
            for (var H in r)
              S && S.hasOwnProperty(H) ? f.options[H] = S[H] : f.options[H] = r[H];
            f.options.multiple == !0 && E.setAttribute("data-multiple", !0), E.content = [], E.classList.add("jupload"), f.options.input == !0 && E.classList.add("input"), f.add = function(L) {
              if (f.options.multiple == !1 && (E.content = [], E.innerText = ""), f.options.type == "image") {
                var q = document.createElement("img");
                q.setAttribute("src", L.file), q.setAttribute("tabindex", -1), E.getAttribute("name") || (q.className = "jfile", q.content = L), E.appendChild(q);
              } else {
                if (L.name)
                  var Q = L.name;
                else
                  var Q = L.file;
                var le = document.createElement("div");
                le.innerText = Q || f.options.type, le.classList.add("jupload-item"), le.setAttribute("tabindex", -1), E.appendChild(le);
              }
              L.content && (L.file = l.guid()), E.content.push(L), typeof f.options.onchange == "function" && f.options.onchange(E, L);
            }, f.addFromFile = function(L) {
              var q = L.type.split("/");
              if (q[0] == f.options.type) {
                var Q = new FileReader();
                Q.addEventListener("load", function(le) {
                  var he = {
                    file: le.srcElement.result,
                    extension: L.name.substr(L.name.lastIndexOf(".") + 1),
                    name: L.name,
                    size: L.size,
                    lastmodified: L.lastModified,
                    content: le.srcElement.result
                  };
                  f.add(he);
                }), Q.readAsDataURL(L);
              } else
                alert(o.translate("This extension is not allowed"));
            }, f.addFromUrl = function(L) {
              if (L.substr(0, 4) != "data" && !f.options.remoteParser)
                console.error("remoteParser not defined in your initialization");
              else if (L.substr(0, 4) == "data") {
                var q = L.split(";");
                q = q[0].split("/");
                var Q = q[0].replace("data:", "");
                if (Q == f.options.type) {
                  var le = {
                    file: L,
                    name: "",
                    extension: q[1],
                    content: L
                  };
                  f.add(le);
                } else
                  alert(f.options.text.extensionNotAllowed);
              } else {
                var q = L.substr(L.lastIndexOf(".") + 1);
                L = f.options.remoteParser + L, A({
                  url: L,
                  type: "GET",
                  dataType: "blob",
                  success: function(me) {
                  }
                });
              }
            };
            var re = f.options.type + "/" + f.options.extension, te = document.createElement("input");
            te.type = "file", te.setAttribute("accept", re), te.onchange = function() {
              for (var L = 0; L < this.files.length; L++)
                f.addFromFile(this.files[L]);
            }, f.options.multiple == !0 && te.setAttribute("multiple", !0);
            var P = null;
            return E.addEventListener("click", function(L) {
              P = null, !E.children.length || L.target === E ? l.click(te) : L.target.parentNode == E && (P = L.target);
            }), E.addEventListener("dblclick", function(L) {
              l.click(te);
            }), E.addEventListener("dragenter", function(L) {
              E.style.border = "1px dashed #000";
            }), E.addEventListener("dragleave", function(L) {
              E.style.border = "1px solid #eee";
            }), E.addEventListener("dragstop", function(L) {
              E.style.border = "1px solid #eee";
            }), E.addEventListener("dragover", function(L) {
              L.preventDefault();
            }), E.addEventListener("keydown", function(L) {
              if (P && L.which == 46) {
                var q = Array.prototype.indexOf.call(E.children, P);
                q >= 0 && (E.content.splice(q, 1), P.remove(), P = null);
              }
            }), E.addEventListener("drop", function(L) {
              L.preventDefault(), L.stopPropagation();
              var q = (L.originalEvent || L).dataTransfer.getData("text/html"), Q = (L.originalEvent || L).dataTransfer.files;
              if (Q.length)
                for (var le = 0; le < L.dataTransfer.files.length; le++)
                  f.addFromFile(L.dataTransfer.files[le]);
              else if (q) {
                f.options.multiple == !1 && (E.innerText = "");
                let he = [];
                if (Se(q, he), he.length)
                  for (var le = 0; le < he.length; le++)
                    f.addFromUrl(he[le]);
              }
              return E.style.border = "1px solid #eee", !1;
            }), E.val = function(L) {
              if (L === void 0)
                return E.content && E.content.length ? E.content : null;
              if (E.innerText = "", E.content = [], L)
                if (Array.isArray(L))
                  for (var q = 0; q < L.length; q++)
                    typeof L[q] == "string" ? f.add({ file: L[q] }) : f.add(L[q]);
                else typeof L == "string" && f.add({ file: L });
            }, E.upload = E.image = f, f;
          }
          var kt = j(195), Rt = /* @__PURE__ */ j.n(kt), ut = {
            // Helpers
            ...o,
            ...l,
            /** Current version */
            version: "5.13.3",
            /** Bind new extensions to Jsuites */
            setExtensions: function(E) {
              if (typeof E == "object")
                for (var S = Object.keys(E), f = 0; f < S.length; f++)
                  ut[S[f]] = E[S[f]];
            },
            tracking: D,
            path: h,
            sorting: p,
            lazyLoading: u,
            // Plugins
            ajax: A,
            animation: N,
            calendar: ue,
            color: ge,
            contextmenu: oe,
            dropdown: Oe,
            editor: Me,
            floating: He,
            form: at,
            mask: Y,
            modal: pt,
            notification: Bt,
            palette: G,
            picker: Be,
            progressbar: _t,
            rating: Pt,
            search: Et,
            slider: Ft,
            tabs: ie,
            tags: Mt,
            toolbar: Re,
            upload: Lt,
            validations: et
          };
          ut.image = Lt, ut.image.create = function(E) {
            var S = document.createElement("img");
            return S.setAttribute("src", E.file), S.className = "jfile", S.setAttribute("tabindex", -1), S.content = E, S;
          }, ut.tracker = at, ut.loading = N.loading, ut.sha512 = Rt(), typeof document < "u" && function() {
            if (typeof window.jSuitesStateControl > "u")
              window.jSuitesStateControl = [];
            else
              return;
            const E = function(se, ve) {
              return se[ve.type] && se[ve.type] == ve || se.component && se.component == ve ? !0 : se.parentNode ? E(se.parentNode, ve) : !1;
            }, S = function(se) {
              let ve = window.jSuitesStateControl;
              if (ve && ve.length > 0)
                for (let je = 0; je < ve.length; je++)
                  ve[je] && !E(se, ve[je]) && ve[je].close();
            };
            let f = 15, r = !1, H = {
              x: null,
              y: null
            }, re = document.createElement("div");
            re.classList.add("jtooltip");
            const te = function(se) {
              return se && (se.shadowRoot || se.tagName && se.tagName.includes("-"));
            }, P = function(se) {
              let ve, je, X = se.path || se.composedPath && se.composedPath();
              return X ? (je = X[0], je && te(je) && !je.shadowRoot && se.toElement && (je = se.toElement)) : (se.target && te(se.target) ? ve = se.target.shadowRoot : ve = document, je = ve.elementFromPoint(x, y)), je;
            }, L = function(se) {
              if (se.changedTouches && se.changedTouches[0])
                var ve = se.changedTouches[0].clientX, je = se.changedTouches[0].clientY;
              else
                var ve = se.clientX, je = se.clientY;
              let X = P(se), ee = X && X.tagName === "DIV" && X.getAttribute("contentEditable"), C = ut.findElement(X, "jpanel");
              if (C && !C.classList.contains("readonly") && !ee) {
                let F = C.getBoundingClientRect(), Z = 0;
                C.style.rotate && (Z = parseFloat(C.style.rotate));
                let fe = "move";
                X.getAttribute("data-action") ? fe = X.getAttribute("data-action") : C.style.cursor ? fe = "resize" : C.style.cursor = "move", r = {
                  action: fe,
                  a: Z,
                  e: C,
                  x: ve,
                  y: je,
                  l: F.left,
                  t: F.top,
                  b: F.bottom,
                  r: F.right,
                  w: F.width,
                  h: F.height,
                  d: C.style.cursor,
                  actioned: !1
                }, C.style.width || (C.style.width = F.width + "px"), C.style.height || (C.style.height = F.height + "px");
              } else
                r = !1;
              S(X), we(se);
            }, q = function(se, ve, je, X, ee, C) {
              const F = je - se, Z = X - ve, fe = ee - se, J = C - ve;
              let pe = Math.atan2(Z, F), ne = Math.atan2(J, fe) - pe;
              return ne = ne * (180 / Math.PI), ne < 0 && (ne += 360), ne;
            }, Q = function(se) {
              r && r.e && (typeof r.e.refresh == "function" && H.actioned && r.e.refresh(), r.e.style.cursor = ""), H = {
                x: null,
                y: null
              }, r = !1;
            }, le = function(se) {
              if (r) {
                let C = se.clientX || se.pageX, F = se.clientY || se.pageY;
                if (H.x == null && H.y == null && (H.x = C, H.y = F), r.action === "move") {
                  var ve = C - H.x, je = F - H.y, X = r.e.offsetTop + je, ee = r.e.offsetLeft + ve;
                  r.e.style.top = X + "px", r.e.style.left = ee + "px", typeof r.e.refresh == "function" && (H.actioned = !0, r.e.refresh("position", X, ee));
                } else if (r.action === "rotate") {
                  let Z = r.l + r.w / 2, fe = r.t + r.h / 2, J = q(Z, fe, r.x, r.y, C, F);
                  J = J + r.a % 360, J = Math.round(J / 2) * 2, r.e.style.rotate = `${J}deg`, typeof r.e.refresh == "function" && (H.actioned = !0, r.e.refresh("rotate", J));
                } else if (r.action === "resize") {
                  let Z = null, fe = null, J = null, pe = null;
                  r.d == "e-resize" || r.d == "ne-resize" || r.d == "se-resize" ? (J = r.e.offsetWidth + (C - H.x), se.shiftKey && (pe = r.e.offsetHeight + (C - H.x) * (r.e.offsetHeight / r.e.offsetWidth))) : (r.d === "w-resize" || r.d == "nw-resize" || r.d == "sw-resize") && (fe = r.e.offsetLeft + (C - H.x), J = r.e.offsetLeft + r.e.offsetWidth - fe, se.shiftKey && (pe = r.e.offsetHeight - (C - H.x) * (r.e.offsetHeight / r.e.offsetWidth))), r.d == "s-resize" || r.d == "se-resize" || r.d == "sw-resize" ? pe || (pe = r.e.offsetHeight + (F - H.y)) : (r.d === "n-resize" || r.d == "ne-resize" || r.d == "nw-resize") && (Z = r.e.offsetTop + (F - H.y), pe = r.e.offsetTop + r.e.offsetHeight - Z), Z && (r.e.style.top = Z + "px"), fe && (r.e.style.left = fe + "px"), J && (r.e.style.width = J + "px"), pe && (r.e.style.height = pe + "px"), typeof r.e.refresh == "function" && (H.actioned = !0, r.e.refresh("dimensions", J, pe));
                }
                H.x = C, H.y = F;
              } else {
                let C = P(se), F = ut.findElement(C, "jpanel");
                if (F) {
                  if (F.classList.contains("jpanel-controls")) {
                    let fe = C.getAttribute("data-position");
                    fe ? F.style.cursor = fe : F.style.cursor = "";
                  } else if (F.getAttribute("tabindex")) {
                    let fe = F.getBoundingClientRect();
                    se.clientY - fe.top < f ? fe.width - (se.clientX - fe.left) < f ? F.style.cursor = "ne-resize" : se.clientX - fe.left < f ? F.style.cursor = "nw-resize" : F.style.cursor = "n-resize" : fe.height - (se.clientY - fe.top) < f ? fe.width - (se.clientX - fe.left) < f ? F.style.cursor = "se-resize" : se.clientX - fe.left < f ? F.style.cursor = "sw-resize" : F.style.cursor = "s-resize" : fe.width - (se.clientX - fe.left) < f ? F.style.cursor = "e-resize" : se.clientX - fe.left < f ? F.style.cursor = "w-resize" : F.style.cursor = "";
                  }
                }
              }
            };
            let he = ["n", "ne", "e", "se", "s", "sw", "w", "nw", "rotate"];
            he.forEach(function(se, ve) {
              he[ve] = document.createElement("div"), he[ve].classList.add("jpanel-action"), se === "rotate" ? he[ve].setAttribute("data-action", "rotate") : (he[ve].setAttribute("data-action", "resize"), he[ve].setAttribute("data-position", se + "-resize"));
            });
            let me;
            const we = function(se) {
              let ve = P(se), je = ut.findElement(ve, "jpanel");
              je && !je.classList.contains("readonly") && je.classList.contains("jpanel-controls") ? (je.append(...he), je.classList.contains("jpanel-rotate") || he[he.length - 1].remove(), me = je) : Le();
            }, Le = function(se) {
              me && (he.forEach(function(ve) {
                ve.remove();
              }), me = null);
            }, De = function(se) {
              var je = P(se).getAttribute("data-tooltip");
              if (je) {
                if (re.innerText = je, se.changedTouches && se.changedTouches[0])
                  var X = se.changedTouches[0].clientX, ee = se.changedTouches[0].clientY;
                else
                  var X = se.clientX, ee = se.clientY;
                re.style.top = ee + "px", re.style.left = X + "px", document.body.appendChild(re);
              } else re.innerText && (re.innerText = "", document.body.removeChild(re));
            }, Te = function(se) {
              var ve = document.activeElement;
              if (ve && typeof ve.contextmenu == "function")
                ve.contextmenu(se), se.preventDefault(), se.stopImmediatePropagation();
              else if (ve = ut.findElement(se.target, function(X) {
                return X.tagName && X.getAttribute("aria-contextmenu-id");
              }), ve) {
                var je = document.querySelector("#" + ve);
                je ? (je.contextmenu.open(se), se.preventDefault(), se.stopImmediatePropagation()) : console.error("JSUITES: contextmenu id not found: " + ve);
              }
            }, Xe = function(se) {
              let ve = document.activeElement;
              ve && se.key === "Delete" && typeof ve.delete == "function" && (ve.delete(), se.preventDefault(), se.stopImmediatePropagation());
              let je = window.jSuitesStateControl;
              je && je.length > 0 && (ve = je[je.length - 1], ve && se.key === "Escape" && typeof ve.isOpened == "function" && typeof ve.close == "function" && ve.isOpened() && (ve.close(), se.preventDefault(), se.stopImmediatePropagation()));
            }, qe = function(se) {
              (se.target.getAttribute("data-mask") || se.target.mask) && ut.mask(se);
            };
            document.addEventListener("focusin", we), document.addEventListener("mouseup", Q), document.addEventListener("mousedown", L), document.addEventListener("mousemove", le), document.addEventListener("mouseover", De), document.addEventListener("keydown", Xe), document.addEventListener("contextmenu", Te), document.addEventListener("input", qe);
          }();
          var gt = ut;
        })(), s = z.default;
      })(), s;
    }));
  })(jsuites$1)), jsuites$1.exports;
}
var dist$2 = { exports: {} }, dist$1 = dist$2.exports, hasRequiredDist$1;
function requireDist$1() {
  return hasRequiredDist$1 || (hasRequiredDist$1 = 1, (function(n, m) {
    (function(s, d) {
      n.exports = d();
    })(dist$1, (function() {
      var s;
      return (function() {
        var d = { 765: function(B, g) {
          var o;
          o = function(b) {
            b.version = "1.0.2";
            var D = Math;
            function _(de, oe) {
              for (var xe = 0, Oe = 0; xe < de.length; ++xe) Oe = oe * Oe + de[xe];
              return Oe;
            }
            function l(de, oe, xe, Oe, Be) {
              if (oe === 0) return xe;
              if (oe === 1) return Oe;
              for (var Re = 2 / de, $e = Oe, W = 1; W < oe; ++W) $e = Oe * W * Re + Be * xe, xe = Oe, Oe = $e;
              return $e;
            }
            function a(de, oe, xe, Oe, Be) {
              return function(Re, $e) {
                if (Oe) {
                  if (Re === 0) return Oe == 1 ? -1 / 0 : 1 / 0;
                  if (Re < 0) return NaN;
                }
                return $e === 0 ? de(Re) : $e === 1 ? oe(Re) : $e < 0 ? NaN : l(Re, $e |= 0, de(Re), oe(Re), Be);
              };
            }
            var h, p, u, v, A, M, N, T, I, O, Y, U, ue, be = (function() {
              var de = 0.636619772, oe = [57568490574, -13362590354, 6516196407e-1, -1121442418e-2, 77392.33017, -184.9052456].reverse(), xe = [57568490411, 1029532985, 9494680718e-3, 59272.64853, 267.8532712, 1].reverse(), Oe = [1, -0.001098628627, 2734510407e-14, -2073370639e-15, 2093887211e-16].reverse(), Be = [-0.01562499995, 1430488765e-13, -6911147651e-15, 7621095161e-16, -934935152e-16].reverse();
              function Re(Se) {
                var Ce = 0, Me = 0, Pe = 0, He = Se * Se;
                if (Se < 8) Ce = (Me = _(oe, He)) / (Pe = _(xe, He));
                else {
                  var Ye = Se - 0.785398164;
                  Me = _(Oe, He = 64 / He), Pe = _(Be, He), Ce = D.sqrt(de / Se) * (D.cos(Ye) * Me - D.sin(Ye) * Pe * 8 / Se);
                }
                return Ce;
              }
              var $e = [72362614232, -7895059235, 2423968531e-1, -2972611439e-3, 15704.4826, -30.16036606].reverse(), W = [144725228442, 2300535178, 1858330474e-2, 99447.43394, 376.9991397, 1].reverse(), Ie = [1, 183105e-8, -3516396496e-14, 2457520174e-15, -240337019e-15].reverse(), Ve = [0.04687499995, -2002690873e-13, 8449199096e-15, -88228987e-14, 105787412e-15].reverse();
              function st(Se) {
                var Ce = 0, Me = 0, Pe = 0, He = Se * Se, Ye = D.abs(Se) - 2.356194491;
                return Math.abs(Se) < 8 ? Ce = (Me = Se * _($e, He)) / (Pe = _(W, He)) : (Me = _(Ie, He = 64 / He), Pe = _(Ve, He), Ce = D.sqrt(de / D.abs(Se)) * (D.cos(Ye) * Me - D.sin(Ye) * Pe * 8 / D.abs(Se)), Se < 0 && (Ce = -Ce)), Ce;
              }
              return function Se(Ce, Me) {
                if (Me = Math.round(Me), !isFinite(Ce)) return isNaN(Ce) ? Ce : 0;
                if (Me < 0) return (Me % 2 ? -1 : 1) * Se(Ce, -Me);
                if (Ce < 0) return (Me % 2 ? -1 : 1) * Se(-Ce, Me);
                if (Me === 0) return Re(Ce);
                if (Me === 1) return st(Ce);
                if (Ce === 0) return 0;
                var Pe = 0;
                if (Ce > Me) Pe = l(Ce, Me, Re(Ce), st(Ce), -1);
                else {
                  for (var He = !1, Ye = 0, et = 0, tt = 1, at = 0, ft = 2 / Ce, pt = 2 * D.floor((Me + D.floor(D.sqrt(40 * Me))) / 2); pt > 0; pt--) at = pt * ft * tt - Ye, Ye = tt, tt = at, D.abs(tt) > 1e10 && (tt *= 1e-10, Ye *= 1e-10, Pe *= 1e-10, et *= 1e-10), He && (et += tt), He = !He, pt == Me && (Pe = Ye);
                  Pe /= et = 2 * et - tt;
                }
                return Pe;
              };
            })(), G = (h = 0.636619772, p = [-2957821389, 7062834065, -5123598036e-1, 1087988129e-2, -86327.92757, 228.4622733].reverse(), u = [40076544269, 7452499648e-1, 7189466438e-3, 47447.2647, 226.1030244, 1].reverse(), v = [1, -0.001098628627, 2734510407e-14, -2073370639e-15, 2093887211e-16].reverse(), A = [-0.01562499995, 1430488765e-13, -6911147651e-15, 7621095161e-16, -934945152e-16].reverse(), M = [-4900604943e3, 127527439e4, -51534381390, 7349264551e-1, -4237922726e-3, 8511.937935].reverse(), N = [249958057e5, 424441966400, 3733650367, 2245904002e-2, 102042.605, 354.9632885, 1].reverse(), T = [1, 183105e-8, -3516396496e-14, 2457520174e-15, -240337019e-15].reverse(), I = [0.04687499995, -2002690873e-13, 8449199096e-15, -88228987e-14, 105787412e-15].reverse(), a((function(de) {
              var oe = 0, xe = 0, Oe = 0, Be = de * de, Re = de - 0.785398164;
              return de < 8 ? oe = (xe = _(p, Be)) / (Oe = _(u, Be)) + h * be(de, 0) * D.log(de) : (xe = _(v, Be = 64 / Be), Oe = _(A, Be), oe = D.sqrt(h / de) * (D.sin(Re) * xe + D.cos(Re) * Oe * 8 / de)), oe;
            }), (function(de) {
              var oe = 0, xe = 0, Oe = 0, Be = de * de, Re = de - 2.356194491;
              return de < 8 ? oe = (xe = de * _(M, Be)) / (Oe = _(N, Be)) + h * (be(de, 1) * D.log(de) - 1 / de) : (xe = _(T, Be = 64 / Be), Oe = _(I, Be), oe = D.sqrt(h / de) * (D.sin(Re) * xe + D.cos(Re) * Oe * 8 / de)), oe;
            }), 0, 1, -1)), ie = (O = [1, 3.5156229, 3.0899424, 1.2067492, 0.2659732, 0.0360768, 45813e-7].reverse(), Y = [0.39894228, 0.01328592, 225319e-8, -157565e-8, 916281e-8, -0.02057706, 0.02635537, -0.01647633, 392377e-8].reverse(), U = [0.5, 0.87890594, 0.51498869, 0.15084934, 0.02658733, 301532e-8, 32411e-8].reverse(), ue = [0.39894228, -0.03988024, -362018e-8, 163801e-8, -0.01031555, 0.02282967, -0.02895312, 0.01787654, -420059e-8].reverse(), function de(oe, xe) {
              if ((xe = Math.round(xe)) === 0) return (function(Ve) {
                return Ve <= 3.75 ? _(O, Ve * Ve / 14.0625) : D.exp(D.abs(Ve)) / D.sqrt(D.abs(Ve)) * _(Y, 3.75 / D.abs(Ve));
              })(oe);
              if (xe === 1) return (function(Ve) {
                return Ve < 3.75 ? Ve * _(U, Ve * Ve / 14.0625) : (Ve < 0 ? -1 : 1) * D.exp(D.abs(Ve)) / D.sqrt(D.abs(Ve)) * _(ue, 3.75 / D.abs(Ve));
              })(oe);
              if (xe < 0) return NaN;
              if (D.abs(oe) === 0) return 0;
              if (oe == 1 / 0) return 1 / 0;
              var Oe, Be = 0, Re = 2 / D.abs(oe), $e = 0, W = 1, Ie = 0;
              for (Oe = 2 * D.round((xe + D.round(D.sqrt(40 * xe))) / 2); Oe > 0; Oe--) Ie = Oe * Re * W + $e, $e = W, W = Ie, D.abs(W) > 1e10 && (W *= 1e-10, $e *= 1e-10, Be *= 1e-10), Oe == xe && (Be = $e);
              return Be *= de(oe, 0) / W, oe < 0 && xe % 2 ? -Be : Be;
            }), ge = (function() {
              var de = [-0.57721566, 0.4227842, 0.23069756, 0.0348859, 262698e-8, 1075e-7, 74e-7].reverse(), oe = [1.25331414, -0.07832358, 0.02189568, -0.01062446, 587872e-8, -25154e-7, 53208e-8].reverse(), xe = [1, 0.15443144, -0.67278579, -0.18156897, -0.01919402, -110404e-8, -4686e-8].reverse(), Oe = [1.25331414, 0.23498619, -0.0365562, 0.01504268, -780353e-8, 325614e-8, -68245e-8].reverse();
              return a((function(Be) {
                return Be <= 2 ? -D.log(Be / 2) * ie(Be, 0) + _(de, Be * Be / 4) : D.exp(-Be) / D.sqrt(Be) * _(oe, 2 / Be);
              }), (function(Be) {
                return Be <= 2 ? D.log(Be / 2) * ie(Be, 1) + 1 / Be * _(xe, Be * Be / 4) : D.exp(-Be) / D.sqrt(Be) * _(Oe, 2 / Be);
              }), 0, 2, 1);
            })();
            b.besselj = be, b.bessely = G, b.besseli = ie, b.besselk = ge;
          }, o(typeof DO_NOT_EXPORT_BESSEL > "u" ? g : {});
        }, 162: function(B) {
          var g;
          B.exports = (g = (function(o, b) {
            var D = Array.prototype.concat, _ = Array.prototype.slice, l = Object.prototype.toString;
            function a(I, O) {
              var Y = I > O ? I : O;
              return o.pow(10, 17 - ~~(o.log(Y > 0 ? Y : -Y) * o.LOG10E));
            }
            var h = Array.isArray || function(I) {
              return l.call(I) === "[object Array]";
            };
            function p(I) {
              return l.call(I) === "[object Function]";
            }
            function u(I) {
              return typeof I == "number" && I - I == 0;
            }
            function v() {
              return new v._init(arguments);
            }
            function A() {
              return 0;
            }
            function M() {
              return 1;
            }
            function N(I, O) {
              return I === O ? 1 : 0;
            }
            v.fn = v.prototype, v._init = function(I) {
              if (h(I[0])) if (h(I[0][0])) {
                p(I[1]) && (I[0] = v.map(I[0], I[1]));
                for (var O = 0; O < I[0].length; O++) this[O] = I[0][O];
                this.length = I[0].length;
              } else this[0] = p(I[1]) ? v.map(I[0], I[1]) : I[0], this.length = 1;
              else if (u(I[0])) this[0] = v.seq.apply(null, I), this.length = 1;
              else {
                if (I[0] instanceof v) return v(I[0].toArray());
                this[0] = [], this.length = 1;
              }
              return this;
            }, v._init.prototype = v.prototype, v._init.constructor = v, v.utils = { calcRdx: a, isArray: h, isFunction: p, isNumber: u, toVector: function(I) {
              return D.apply([], I);
            } }, v._random_fn = o.random, v.setRandom = function(I) {
              if (typeof I != "function") throw new TypeError("fn is not a function");
              v._random_fn = I;
            }, v.extend = function(I) {
              var O, Y;
              if (arguments.length === 1) {
                for (Y in I) v[Y] = I[Y];
                return this;
              }
              for (O = 1; O < arguments.length; O++) for (Y in arguments[O]) I[Y] = arguments[O][Y];
              return I;
            }, v.rows = function(I) {
              return I.length || 1;
            }, v.cols = function(I) {
              return I[0].length || 1;
            }, v.dimensions = function(I) {
              return { rows: v.rows(I), cols: v.cols(I) };
            }, v.row = function(I, O) {
              return h(O) ? O.map((function(Y) {
                return v.row(I, Y);
              })) : I[O];
            }, v.rowa = function(I, O) {
              return v.row(I, O);
            }, v.col = function(I, O) {
              if (h(O)) {
                var Y = v.arange(I.length).map((function() {
                  return new Array(O.length);
                }));
                return O.forEach((function(be, G) {
                  v.arange(I.length).forEach((function(ie) {
                    Y[ie][G] = I[ie][be];
                  }));
                })), Y;
              }
              for (var U = new Array(I.length), ue = 0; ue < I.length; ue++) U[ue] = [I[ue][O]];
              return U;
            }, v.cola = function(I, O) {
              return v.col(I, O).map((function(Y) {
                return Y[0];
              }));
            }, v.diag = function(I) {
              for (var O = v.rows(I), Y = new Array(O), U = 0; U < O; U++) Y[U] = [I[U][U]];
              return Y;
            }, v.antidiag = function(I) {
              for (var O = v.rows(I) - 1, Y = new Array(O), U = 0; O >= 0; O--, U++) Y[U] = [I[U][O]];
              return Y;
            }, v.transpose = function(I) {
              var O, Y, U, ue, be, G = [];
              for (h(I[0]) || (I = [I]), Y = I.length, U = I[0].length, be = 0; be < U; be++) {
                for (O = new Array(Y), ue = 0; ue < Y; ue++) O[ue] = I[ue][be];
                G.push(O);
              }
              return G.length === 1 ? G[0] : G;
            }, v.map = function(I, O, Y) {
              var U, ue, be, G, ie;
              for (h(I[0]) || (I = [I]), ue = I.length, be = I[0].length, G = Y ? I : new Array(ue), U = 0; U < ue; U++) for (G[U] || (G[U] = new Array(be)), ie = 0; ie < be; ie++) G[U][ie] = O(I[U][ie], U, ie);
              return G.length === 1 ? G[0] : G;
            }, v.cumreduce = function(I, O, Y) {
              var U, ue, be, G, ie;
              for (h(I[0]) || (I = [I]), ue = I.length, be = I[0].length, G = Y ? I : new Array(ue), U = 0; U < ue; U++) for (G[U] || (G[U] = new Array(be)), be > 0 && (G[U][0] = I[U][0]), ie = 1; ie < be; ie++) G[U][ie] = O(G[U][ie - 1], I[U][ie]);
              return G.length === 1 ? G[0] : G;
            }, v.alter = function(I, O) {
              return v.map(I, O, !0);
            }, v.create = function(I, O, Y) {
              var U, ue, be = new Array(I);
              for (p(O) && (Y = O, O = I), U = 0; U < I; U++) for (be[U] = new Array(O), ue = 0; ue < O; ue++) be[U][ue] = Y(U, ue);
              return be;
            }, v.zeros = function(I, O) {
              return u(O) || (O = I), v.create(I, O, A);
            }, v.ones = function(I, O) {
              return u(O) || (O = I), v.create(I, O, M);
            }, v.rand = function(I, O) {
              return u(O) || (O = I), v.create(I, O, v._random_fn);
            }, v.identity = function(I, O) {
              return u(O) || (O = I), v.create(I, O, N);
            }, v.symmetric = function(I) {
              var O, Y, U = I.length;
              if (I.length !== I[0].length) return !1;
              for (O = 0; O < U; O++) for (Y = 0; Y < U; Y++) if (I[Y][O] !== I[O][Y]) return !1;
              return !0;
            }, v.clear = function(I) {
              return v.alter(I, A);
            }, v.seq = function(I, O, Y, U) {
              p(U) || (U = !1);
              var ue, be = [], G = a(I, O), ie = (O * G - I * G) / ((Y - 1) * G), ge = I;
              for (ue = 0; ge <= O && ue < Y; ge = (I * G + ie * G * ++ue) / G) be.push(U ? U(ge, ue) : ge);
              return be;
            }, v.arange = function(I, O, Y) {
              var U, ue = [];
              if (Y = Y || 1, O === b && (O = I, I = 0), I === O || Y === 0) return [];
              if (I < O && Y < 0) return [];
              if (I > O && Y > 0) return [];
              if (Y > 0) for (U = I; U < O; U += Y) ue.push(U);
              else for (U = I; U > O; U += Y) ue.push(U);
              return ue;
            }, v.slice = /* @__PURE__ */ (function() {
              function I(O, Y, U, ue) {
                var be, G = [], ie = O.length;
                if (Y === b && U === b && ue === b) return v.copy(O);
                if (ue = ue || 1, (Y = (Y = Y || 0) >= 0 ? Y : ie + Y) === (U = (U = U || O.length) >= 0 ? U : ie + U) || ue === 0) return [];
                if (Y < U && ue < 0) return [];
                if (Y > U && ue > 0) return [];
                if (ue > 0) for (be = Y; be < U; be += ue) G.push(O[be]);
                else for (be = Y; be > U; be += ue) G.push(O[be]);
                return G;
              }
              return function(O, Y) {
                var U, ue;
                return u((Y = Y || {}).row) ? u(Y.col) ? O[Y.row][Y.col] : I(v.rowa(O, Y.row), (U = Y.col || {}).start, U.end, U.step) : u(Y.col) ? I(v.cola(O, Y.col), (ue = Y.row || {}).start, ue.end, ue.step) : (ue = Y.row || {}, U = Y.col || {}, I(O, ue.start, ue.end, ue.step).map((function(be) {
                  return I(be, U.start, U.end, U.step);
                })));
              };
            })(), v.sliceAssign = function(I, O, Y) {
              var U, ue;
              if (u(O.row)) {
                if (u(O.col)) return I[O.row][O.col] = Y;
                O.col = O.col || {}, O.col.start = O.col.start || 0, O.col.end = O.col.end || I[0].length, O.col.step = O.col.step || 1, U = v.arange(O.col.start, o.min(I.length, O.col.end), O.col.step);
                var be = O.row;
                return U.forEach((function(ie, ge) {
                  I[be][ie] = Y[ge];
                })), I;
              }
              if (u(O.col)) {
                O.row = O.row || {}, O.row.start = O.row.start || 0, O.row.end = O.row.end || I.length, O.row.step = O.row.step || 1, ue = v.arange(O.row.start, o.min(I[0].length, O.row.end), O.row.step);
                var G = O.col;
                return ue.forEach((function(ie, ge) {
                  I[ie][G] = Y[ge];
                })), I;
              }
              return Y[0].length === b && (Y = [Y]), O.row.start = O.row.start || 0, O.row.end = O.row.end || I.length, O.row.step = O.row.step || 1, O.col.start = O.col.start || 0, O.col.end = O.col.end || I[0].length, O.col.step = O.col.step || 1, ue = v.arange(O.row.start, o.min(I.length, O.row.end), O.row.step), U = v.arange(O.col.start, o.min(I[0].length, O.col.end), O.col.step), ue.forEach((function(ie, ge) {
                U.forEach((function(de, oe) {
                  I[ie][de] = Y[ge][oe];
                }));
              })), I;
            }, v.diagonal = function(I) {
              var O = v.zeros(I.length, I.length);
              return I.forEach((function(Y, U) {
                O[U][U] = Y;
              })), O;
            }, v.copy = function(I) {
              return I.map((function(O) {
                return u(O) ? O : O.map((function(Y) {
                  return Y;
                }));
              }));
            };
            var T = v.prototype;
            return T.length = 0, T.push = Array.prototype.push, T.sort = Array.prototype.sort, T.splice = Array.prototype.splice, T.slice = Array.prototype.slice, T.toArray = function() {
              return this.length > 1 ? _.call(this) : _.call(this)[0];
            }, T.map = function(I, O) {
              return v(v.map(this, I, O));
            }, T.cumreduce = function(I, O) {
              return v(v.cumreduce(this, I, O));
            }, T.alter = function(I) {
              return v.alter(this, I), this;
            }, (function(I) {
              for (var O = 0; O < I.length; O++) (function(Y) {
                T[Y] = function(U) {
                  var ue, be = this;
                  return U ? (setTimeout((function() {
                    U.call(be, T[Y].call(be));
                  })), this) : (ue = v[Y](this), h(ue) ? v(ue) : ue);
                };
              })(I[O]);
            })("transpose clear symmetric rows cols dimensions diag antidiag".split(" ")), (function(I) {
              for (var O = 0; O < I.length; O++) (function(Y) {
                T[Y] = function(U, ue) {
                  var be = this;
                  return ue ? (setTimeout((function() {
                    ue.call(be, T[Y].call(be, U));
                  })), this) : v(v[Y](this, U));
                };
              })(I[O]);
            })("row col".split(" ")), (function(I) {
              for (var O = 0; O < I.length; O++) (function(Y) {
                T[Y] = function() {
                  return v(v[Y].apply(null, arguments));
                };
              })(I[O]);
            })("create zeros ones rand identity".split(" ")), v;
          })(Math), (function(o, b) {
            var D = o.utils.isFunction;
            function _(h, p) {
              return h - p;
            }
            function l(h, p, u) {
              return b.max(p, b.min(h, u));
            }
            o.sum = function(h) {
              for (var p = 0, u = h.length; --u >= 0; ) p += h[u];
              return p;
            }, o.sumsqrd = function(h) {
              for (var p = 0, u = h.length; --u >= 0; ) p += h[u] * h[u];
              return p;
            }, o.sumsqerr = function(h) {
              for (var p, u = o.mean(h), v = 0, A = h.length; --A >= 0; ) v += (p = h[A] - u) * p;
              return v;
            }, o.sumrow = function(h) {
              for (var p = 0, u = h.length; --u >= 0; ) p += h[u];
              return p;
            }, o.product = function(h) {
              for (var p = 1, u = h.length; --u >= 0; ) p *= h[u];
              return p;
            }, o.min = function(h) {
              for (var p = h[0], u = 0; ++u < h.length; ) h[u] < p && (p = h[u]);
              return p;
            }, o.max = function(h) {
              for (var p = h[0], u = 0; ++u < h.length; ) h[u] > p && (p = h[u]);
              return p;
            }, o.unique = function(h) {
              for (var p = {}, u = [], v = 0; v < h.length; v++) p[h[v]] || (p[h[v]] = !0, u.push(h[v]));
              return u;
            }, o.mean = function(h) {
              return o.sum(h) / h.length;
            }, o.meansqerr = function(h) {
              return o.sumsqerr(h) / h.length;
            }, o.geomean = function(h) {
              var p = h.map(b.log), u = o.mean(p);
              return b.exp(u);
            }, o.median = function(h) {
              var p = h.length, u = h.slice().sort(_);
              return 1 & p ? u[p / 2 | 0] : (u[p / 2 - 1] + u[p / 2]) / 2;
            }, o.cumsum = function(h) {
              return o.cumreduce(h, (function(p, u) {
                return p + u;
              }));
            }, o.cumprod = function(h) {
              return o.cumreduce(h, (function(p, u) {
                return p * u;
              }));
            }, o.diff = function(h) {
              var p, u = [], v = h.length;
              for (p = 1; p < v; p++) u.push(h[p] - h[p - 1]);
              return u;
            }, o.rank = function(h) {
              var p, u = [], v = {};
              for (p = 0; p < h.length; p++) v[T = h[p]] ? v[T]++ : (v[T] = 1, u.push(T));
              var A = u.sort(_), M = {}, N = 1;
              for (p = 0; p < A.length; p++) {
                var T, I = v[T = A[p]], O = (N + (N + I - 1)) / 2;
                M[T] = O, N += I;
              }
              return h.map((function(Y) {
                return M[Y];
              }));
            }, o.mode = function(h) {
              var p, u = h.length, v = h.slice().sort(_), A = 1, M = 0, N = 0, T = [];
              for (p = 0; p < u; p++) v[p] === v[p + 1] ? A++ : (A > M ? (T = [v[p]], M = A, N = 0) : A === M && (T.push(v[p]), N++), A = 1);
              return N === 0 ? T[0] : T;
            }, o.range = function(h) {
              return o.max(h) - o.min(h);
            }, o.variance = function(h, p) {
              return o.sumsqerr(h) / (h.length - (p ? 1 : 0));
            }, o.pooledvariance = function(h) {
              return h.reduce((function(p, u) {
                return p + o.sumsqerr(u);
              }), 0) / (h.reduce((function(p, u) {
                return p + u.length;
              }), 0) - h.length);
            }, o.deviation = function(h) {
              for (var p = o.mean(h), u = h.length, v = new Array(u), A = 0; A < u; A++) v[A] = h[A] - p;
              return v;
            }, o.stdev = function(h, p) {
              return b.sqrt(o.variance(h, p));
            }, o.pooledstdev = function(h) {
              return b.sqrt(o.pooledvariance(h));
            }, o.meandev = function(h) {
              for (var p = o.mean(h), u = [], v = h.length - 1; v >= 0; v--) u.push(b.abs(h[v] - p));
              return o.mean(u);
            }, o.meddev = function(h) {
              for (var p = o.median(h), u = [], v = h.length - 1; v >= 0; v--) u.push(b.abs(h[v] - p));
              return o.median(u);
            }, o.coeffvar = function(h) {
              return o.stdev(h) / o.mean(h);
            }, o.quartiles = function(h) {
              var p = h.length, u = h.slice().sort(_);
              return [u[b.round(p / 4) - 1], u[b.round(p / 2) - 1], u[b.round(3 * p / 4) - 1]];
            }, o.quantiles = function(h, p, u, v) {
              var A, M, N, T, I, O = h.slice().sort(_), Y = [p.length], U = h.length;
              for (u === void 0 && (u = 0.375), v === void 0 && (v = 0.375), A = 0; A < p.length; A++) N = U * (M = p[A]) + (u + M * (1 - u - v)), T = b.floor(l(N, 1, U - 1)), I = l(N - T, 0, 1), Y[A] = (1 - I) * O[T - 1] + I * O[T];
              return Y;
            }, o.percentile = function(h, p, u) {
              var v = h.slice().sort(_), A = p * (v.length + (u ? 1 : -1)) + (u ? 0 : 1), M = parseInt(A), N = A - M;
              return M + 1 < v.length ? v[M - 1] + N * (v[M] - v[M - 1]) : v[M - 1];
            }, o.percentileOfScore = function(h, p, u) {
              var v, A, M = 0, N = h.length, T = !1;
              for (u === "strict" && (T = !0), A = 0; A < N; A++) v = h[A], (T && v < p || !T && v <= p) && M++;
              return M / N;
            }, o.histogram = function(h, p) {
              p = p || 4;
              var u, v = o.min(h), A = (o.max(h) - v) / p, M = h.length, N = [];
              for (u = 0; u < p; u++) N[u] = 0;
              for (u = 0; u < M; u++) N[b.min(b.floor((h[u] - v) / A), p - 1)] += 1;
              return N;
            }, o.covariance = function(h, p) {
              var u, v = o.mean(h), A = o.mean(p), M = h.length, N = new Array(M);
              for (u = 0; u < M; u++) N[u] = (h[u] - v) * (p[u] - A);
              return o.sum(N) / (M - 1);
            }, o.corrcoeff = function(h, p) {
              return o.covariance(h, p) / o.stdev(h, 1) / o.stdev(p, 1);
            }, o.spearmancoeff = function(h, p) {
              return h = o.rank(h), p = o.rank(p), o.corrcoeff(h, p);
            }, o.stanMoment = function(h, p) {
              for (var u = o.mean(h), v = o.stdev(h), A = h.length, M = 0, N = 0; N < A; N++) M += b.pow((h[N] - u) / v, p);
              return M / h.length;
            }, o.skewness = function(h) {
              return o.stanMoment(h, 3);
            }, o.kurtosis = function(h) {
              return o.stanMoment(h, 4) - 3;
            };
            var a = o.prototype;
            (function(h) {
              for (var p = 0; p < h.length; p++) (function(u) {
                a[u] = function(v, A) {
                  var M = [], N = 0, T = this;
                  if (D(v) && (A = v, v = !1), A) return setTimeout((function() {
                    A.call(T, a[u].call(T, v));
                  })), this;
                  if (this.length > 1) {
                    for (T = v === !0 ? this : this.transpose(); N < T.length; N++) M[N] = o[u](T[N]);
                    return M;
                  }
                  return o[u](this[0], v);
                };
              })(h[p]);
            })("cumsum cumprod".split(" ")), (function(h) {
              for (var p = 0; p < h.length; p++) (function(u) {
                a[u] = function(v, A) {
                  var M = [], N = 0, T = this;
                  if (D(v) && (A = v, v = !1), A) return setTimeout((function() {
                    A.call(T, a[u].call(T, v));
                  })), this;
                  if (this.length > 1) {
                    for (u !== "sumrow" && (T = v === !0 ? this : this.transpose()); N < T.length; N++) M[N] = o[u](T[N]);
                    return v === !0 ? o[u](o.utils.toVector(M)) : M;
                  }
                  return o[u](this[0], v);
                };
              })(h[p]);
            })("sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr geomean median diff rank mode range variance deviation stdev meandev meddev coeffvar quartiles histogram skewness kurtosis".split(" ")), (function(h) {
              for (var p = 0; p < h.length; p++) (function(u) {
                a[u] = function() {
                  var v, A = [], M = 0, N = this, T = Array.prototype.slice.call(arguments);
                  if (D(T[T.length - 1])) {
                    v = T[T.length - 1];
                    var I = T.slice(0, T.length - 1);
                    return setTimeout((function() {
                      v.call(N, a[u].apply(N, I));
                    })), this;
                  }
                  v = void 0;
                  var O = function(Y) {
                    return o[u].apply(N, [Y].concat(T));
                  };
                  if (this.length > 1) {
                    for (N = N.transpose(); M < N.length; M++) A[M] = O(N[M]);
                    return A;
                  }
                  return O(this[0]);
                };
              })(h[p]);
            })("quantiles percentileOfScore".split(" "));
          })(g, Math), (function(o, b) {
            o.gammaln = function(D) {
              var _, l, a, h = 0, p = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18], u = 1.000000000190015;
              for (a = (l = _ = D) + 5.5, a -= (_ + 0.5) * b.log(a); h < 6; h++) u += p[h] / ++l;
              return b.log(2.5066282746310007 * u / _) - a;
            }, o.loggam = function(D) {
              var _, l, a, h, p, u, v, A = [0.08333333333333333, -0.002777777777777778, 7936507936507937e-19, -5952380952380952e-19, 8417508417508418e-19, -0.001917526917526918, 0.00641025641025641, -0.02955065359477124, 0.1796443723688307, -1.3924322169059];
              if (_ = D, v = 0, D == 1 || D == 2) return 0;
              for (D <= 7 && (_ = D + (v = b.floor(7 - D))), l = 1 / (_ * _), a = 2 * b.PI, p = A[9], u = 8; u >= 0; u--) p *= l, p += A[u];
              if (h = p / _ + 0.5 * b.log(a) + (_ - 0.5) * b.log(_) - _, D <= 7) for (u = 1; u <= v; u++) h -= b.log(_ - 1), _ -= 1;
              return h;
            }, o.gammafn = function(D) {
              var _, l, a, h, p = [-1.716185138865495, 24.76565080557592, -379.80425647094563, 629.3311553128184, 866.9662027904133, -31451.272968848367, -36144.413418691176, 66456.14382024054], u = [-30.8402300119739, 315.35062697960416, -1015.1563674902192, -3107.771671572311, 22538.11842098015, 4755.846277527881, -134659.9598649693, -115132.2596755535], v = !1, A = 0, M = 0, N = 0, T = D;
              if (D > 171.6243769536076) return 1 / 0;
              if (T <= 0) {
                if (!(h = T % 1 + 36e-17)) return 1 / 0;
                v = (1 & T ? -1 : 1) * b.PI / b.sin(b.PI * h), T = 1 - T;
              }
              for (a = T, l = T < 1 ? T++ : (T -= A = (0 | T) - 1) - 1, _ = 0; _ < 8; ++_) N = (N + p[_]) * l, M = M * l + u[_];
              if (h = N / M + 1, a < T) h /= a;
              else if (a > T) for (_ = 0; _ < A; ++_) h *= T, T++;
              return v && (h = v / h), h;
            }, o.gammap = function(D, _) {
              return o.lowRegGamma(D, _) * o.gammafn(D);
            }, o.lowRegGamma = function(D, _) {
              var l, a = o.gammaln(D), h = D, p = 1 / D, u = p, v = _ + 1 - D, A = 1 / 1e-30, M = 1 / v, N = M, T = 1, I = -~(8.5 * b.log(D >= 1 ? D : 1 / D) + 0.4 * D + 17);
              if (_ < 0 || D <= 0) return NaN;
              if (_ < D + 1) {
                for (; T <= I; T++) p += u *= _ / ++h;
                return p * b.exp(-_ + D * b.log(_) - a);
              }
              for (; T <= I; T++) N *= (M = 1 / (M = (l = -T * (T - D)) * M + (v += 2))) * (A = v + l / A);
              return 1 - N * b.exp(-_ + D * b.log(_) - a);
            }, o.factorialln = function(D) {
              return D < 0 ? NaN : o.gammaln(D + 1);
            }, o.factorial = function(D) {
              return D < 0 ? NaN : o.gammafn(D + 1);
            }, o.combination = function(D, _) {
              return D > 170 || _ > 170 ? b.exp(o.combinationln(D, _)) : o.factorial(D) / o.factorial(_) / o.factorial(D - _);
            }, o.combinationln = function(D, _) {
              return o.factorialln(D) - o.factorialln(_) - o.factorialln(D - _);
            }, o.permutation = function(D, _) {
              return o.factorial(D) / o.factorial(D - _);
            }, o.betafn = function(D, _) {
              if (!(D <= 0 || _ <= 0)) return D + _ > 170 ? b.exp(o.betaln(D, _)) : o.gammafn(D) * o.gammafn(_) / o.gammafn(D + _);
            }, o.betaln = function(D, _) {
              return o.gammaln(D) + o.gammaln(_) - o.gammaln(D + _);
            }, o.betacf = function(D, _, l) {
              var a, h, p, u, v = 1e-30, A = 1, M = _ + l, N = _ + 1, T = _ - 1, I = 1, O = 1 - M * D / N;
              for (b.abs(O) < v && (O = v), u = O = 1 / O; A <= 100 && (O = 1 + (h = A * (l - A) * D / ((T + (a = 2 * A)) * (_ + a))) * O, b.abs(O) < v && (O = v), I = 1 + h / I, b.abs(I) < v && (I = v), u *= (O = 1 / O) * I, O = 1 + (h = -(_ + A) * (M + A) * D / ((_ + a) * (N + a))) * O, b.abs(O) < v && (O = v), I = 1 + h / I, b.abs(I) < v && (I = v), u *= p = (O = 1 / O) * I, !(b.abs(p - 1) < 3e-7)); A++) ;
              return u;
            }, o.gammapinv = function(D, _) {
              var l, a, h, p, u, v, A = 0, M = _ - 1, N = o.gammaln(_);
              if (D >= 1) return b.max(100, _ + 100 * b.sqrt(_));
              if (D <= 0) return 0;
              for (_ > 1 ? (u = b.log(M), v = b.exp(M * (u - 1) - N), p = D < 0.5 ? D : 1 - D, l = (2.30753 + 0.27061 * (a = b.sqrt(-2 * b.log(p)))) / (1 + a * (0.99229 + 0.04481 * a)) - a, D < 0.5 && (l = -l), l = b.max(1e-3, _ * b.pow(1 - 1 / (9 * _) - l / (3 * b.sqrt(_)), 3))) : l = D < (a = 1 - _ * (0.253 + 0.12 * _)) ? b.pow(D / a, 1 / _) : 1 - b.log(1 - (D - a) / (1 - a)); A < 12; A++) {
                if (l <= 0) return 0;
                if ((l -= a = (h = (o.lowRegGamma(_, l) - D) / (a = _ > 1 ? v * b.exp(-(l - M) + M * (b.log(l) - u)) : b.exp(-l + M * b.log(l) - N))) / (1 - 0.5 * b.min(1, h * ((_ - 1) / l - 1)))) <= 0 && (l = 0.5 * (l + a)), b.abs(a) < 1e-8 * l) break;
              }
              return l;
            }, o.erf = function(D) {
              var _, l, a, h, p = [-1.3026537197817094, 0.6419697923564902, 0.019476473204185836, -0.00956151478680863, -946595344482036e-18, 366839497852761e-18, 42523324806907e-18, -20278578112534e-18, -1624290004647e-18, 130365583558e-17, 15626441722e-18, -85238095915e-18, 6529054439e-18, 5059343495e-18, -991364156e-18, -227365122e-18, 96467911e-18, 2394038e-18, -6886027e-18, 894487e-18, 313092e-18, -112708e-18, 381e-18, 7106e-18, -1523e-18, -94e-18, 121e-18, -28e-18], u = p.length - 1, v = !1, A = 0, M = 0;
              for (D < 0 && (D = -D, v = !0), l = 4 * (_ = 2 / (2 + D)) - 2; u > 0; u--) a = A, A = l * A - M + p[u], M = a;
              return h = _ * b.exp(-D * D + 0.5 * (p[0] + l * A) - M), v ? h - 1 : 1 - h;
            }, o.erfc = function(D) {
              return 1 - o.erf(D);
            }, o.erfcinv = function(D) {
              var _, l, a, h, p = 0;
              if (D >= 2) return -100;
              if (D <= 0) return 100;
              for (h = D < 1 ? D : 2 - D, _ = -0.70711 * ((2.30753 + 0.27061 * (a = b.sqrt(-2 * b.log(h / 2)))) / (1 + a * (0.99229 + 0.04481 * a)) - a); p < 2; p++) _ += (l = o.erfc(_) - h) / (1.1283791670955126 * b.exp(-_ * _) - _ * l);
              return D < 1 ? _ : -_;
            }, o.ibetainv = function(D, _, l) {
              var a, h, p, u, v, A, M, N, T, I, O = _ - 1, Y = l - 1, U = 0;
              if (D <= 0) return 0;
              if (D >= 1) return 1;
              for (_ >= 1 && l >= 1 ? (p = D < 0.5 ? D : 1 - D, A = (2.30753 + 0.27061 * (u = b.sqrt(-2 * b.log(p)))) / (1 + u * (0.99229 + 0.04481 * u)) - u, D < 0.5 && (A = -A), M = (A * A - 3) / 6, N = 2 / (1 / (2 * _ - 1) + 1 / (2 * l - 1)), T = A * b.sqrt(M + N) / N - (1 / (2 * l - 1) - 1 / (2 * _ - 1)) * (M + 0.8333333333333334 - 2 / (3 * N)), A = _ / (_ + l * b.exp(2 * T))) : (a = b.log(_ / (_ + l)), h = b.log(l / (_ + l)), A = D < (u = b.exp(_ * a) / _) / (T = u + (v = b.exp(l * h) / l)) ? b.pow(_ * T * D, 1 / _) : 1 - b.pow(l * T * (1 - D), 1 / l)), I = -o.gammaln(_) - o.gammaln(l) + o.gammaln(_ + l); U < 10; U++) {
                if (A === 0 || A === 1) return A;
                if ((A -= u = (v = (o.ibeta(A, _, l) - D) / (u = b.exp(O * b.log(A) + Y * b.log(1 - A) + I))) / (1 - 0.5 * b.min(1, v * (O / A - Y / (1 - A))))) <= 0 && (A = 0.5 * (A + u)), A >= 1 && (A = 0.5 * (A + u + 1)), b.abs(u) < 1e-8 * A && U > 0) break;
              }
              return A;
            }, o.ibeta = function(D, _, l) {
              var a = D === 0 || D === 1 ? 0 : b.exp(o.gammaln(_ + l) - o.gammaln(_) - o.gammaln(l) + _ * b.log(D) + l * b.log(1 - D));
              return !(D < 0 || D > 1) && (D < (_ + 1) / (_ + l + 2) ? a * o.betacf(D, _, l) / _ : 1 - a * o.betacf(1 - D, l, _) / l);
            }, o.randn = function(D, _) {
              var l, a, h, p, u;
              if (_ || (_ = D), D) return o.create(D, _, (function() {
                return o.randn();
              }));
              do
                l = o._random_fn(), a = 1.7156 * (o._random_fn() - 0.5), u = (h = l - 0.449871) * h + (p = b.abs(a) + 0.386595) * (0.196 * p - 0.25472 * h);
              while (u > 0.27597 && (u > 0.27846 || a * a > -4 * b.log(l) * l * l));
              return a / l;
            }, o.randg = function(D, _, l) {
              var a, h, p, u, v, A, M = D;
              if (l || (l = _), D || (D = 1), _) return (A = o.zeros(_, l)).alter((function() {
                return o.randg(D);
              })), A;
              D < 1 && (D += 1), a = D - 0.3333333333333333, h = 1 / b.sqrt(9 * a);
              do {
                do
                  u = 1 + h * (v = o.randn());
                while (u <= 0);
                u *= u * u, p = o._random_fn();
              } while (p > 1 - 0.331 * b.pow(v, 4) && b.log(p) > 0.5 * v * v + a * (1 - u + b.log(u)));
              if (D == M) return a * u;
              do
                p = o._random_fn();
              while (p === 0);
              return b.pow(p, 1 / M) * a * u;
            }, (function(D) {
              for (var _ = 0; _ < D.length; _++) (function(l) {
                o.fn[l] = function() {
                  return o(o.map(this, (function(a) {
                    return o[l](a);
                  })));
                };
              })(D[_]);
            })("gammaln gammafn factorial factorialln".split(" ")), (function(D) {
              for (var _ = 0; _ < D.length; _++) (function(l) {
                o.fn[l] = function() {
                  return o(o[l].apply(null, arguments));
                };
              })(D[_]);
            })("randn".split(" "));
          })(g, Math), (function(o, b) {
            function D(l, a, h, p) {
              for (var u, v = 0, A = 1, M = 1, N = 1, T = 0, I = 0; b.abs((M - I) / M) > p; ) I = M, A = N + (u = -(a + T) * (a + h + T) * l / (a + 2 * T) / (a + 2 * T + 1)) * A, M = (v = M + u * v) + (u = (T += 1) * (h - T) * l / (a + 2 * T - 1) / (a + 2 * T)) * M, v /= N = A + u * N, A /= N, M /= N, N = 1;
              return M / a;
            }
            function _(l, a, h) {
              var p = [0.9815606342467192, 0.9041172563704749, 0.7699026741943047, 0.5873179542866175, 0.3678314989981802, 0.1252334085114689], u = [0.04717533638651183, 0.10693932599531843, 0.16007832854334622, 0.20316742672306592, 0.2334925365383548, 0.24914704581340277], v = 0.5 * l;
              if (v >= 8) return 1;
              var A, M = 2 * o.normal.cdf(v, 0, 1, 1, 0) - 1;
              M = M >= b.exp(-50 / h) ? b.pow(M, h) : 0;
              for (var N = v, T = (8 - v) / (A = l > 3 ? 2 : 3), I = N + T, O = 0, Y = h - 1, U = 1; U <= A; U++) {
                for (var ue = 0, be = 0.5 * (I + N), G = 0.5 * (I - N), ie = 1; ie <= 12; ie++) {
                  var ge, de = be + G * (6 < ie ? p[(ge = 12 - ie + 1) - 1] : -p[(ge = ie) - 1]), oe = de * de;
                  if (oe > 60) break;
                  var xe = 2 * o.normal.cdf(de, 0, 1, 1, 0) * 0.5 - 2 * o.normal.cdf(de, l, 1, 1, 0) * 0.5;
                  xe >= b.exp(-30 / Y) && (ue += xe = u[ge - 1] * b.exp(-0.5 * oe) * b.pow(xe, Y));
                }
                O += ue *= 2 * G * h / b.sqrt(2 * b.PI), N = I, I += T;
              }
              return (M += O) <= b.exp(-30 / a) ? 0 : (M = b.pow(M, a)) >= 1 ? 1 : M;
            }
            (function(l) {
              for (var a = 0; a < l.length; a++) (function(h) {
                o[h] = function p(u, v, A) {
                  return this instanceof p ? (this._a = u, this._b = v, this._c = A, this) : new p(u, v, A);
                }, o.fn[h] = function(p, u, v) {
                  var A = o[h](p, u, v);
                  return A.data = this, A;
                }, o[h].prototype.sample = function(p) {
                  var u = this._a, v = this._b, A = this._c;
                  return p ? o.alter(p, (function() {
                    return o[h].sample(u, v, A);
                  })) : o[h].sample(u, v, A);
                }, (function(p) {
                  for (var u = 0; u < p.length; u++) (function(v) {
                    o[h].prototype[v] = function(A) {
                      var M = this._a, N = this._b, T = this._c;
                      return A || A === 0 || (A = this.data), typeof A != "number" ? o.fn.map.call(A, (function(I) {
                        return o[h][v](I, M, N, T);
                      })) : o[h][v](A, M, N, T);
                    };
                  })(p[u]);
                })("pdf cdf inv".split(" ")), (function(p) {
                  for (var u = 0; u < p.length; u++) (function(v) {
                    o[h].prototype[v] = function() {
                      return o[h][v](this._a, this._b, this._c);
                    };
                  })(p[u]);
                })("mean median mode variance".split(" "));
              })(l[a]);
            })("beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy laplace lognormal noncentralt normal pareto studentt weibull uniform binomial negbin hypgeom poisson triangular tukey arcsine".split(" ")), o.extend(o.beta, { pdf: function(l, a, h) {
              return l > 1 || l < 0 ? 0 : a == 1 && h == 1 ? 1 : a < 512 && h < 512 ? b.pow(l, a - 1) * b.pow(1 - l, h - 1) / o.betafn(a, h) : b.exp((a - 1) * b.log(l) + (h - 1) * b.log(1 - l) - o.betaln(a, h));
            }, cdf: function(l, a, h) {
              return l > 1 || l < 0 ? 1 * (l > 1) : o.ibeta(l, a, h);
            }, inv: function(l, a, h) {
              return o.ibetainv(l, a, h);
            }, mean: function(l, a) {
              return l / (l + a);
            }, median: function(l, a) {
              return o.ibetainv(0.5, l, a);
            }, mode: function(l, a) {
              return (l - 1) / (l + a - 2);
            }, sample: function(l, a) {
              var h = o.randg(l);
              return h / (h + o.randg(a));
            }, variance: function(l, a) {
              return l * a / (b.pow(l + a, 2) * (l + a + 1));
            } }), o.extend(o.centralF, { pdf: function(l, a, h) {
              var p;
              return l < 0 ? 0 : a <= 2 ? l === 0 && a < 2 ? 1 / 0 : l === 0 && a === 2 ? 1 : 1 / o.betafn(a / 2, h / 2) * b.pow(a / h, a / 2) * b.pow(l, a / 2 - 1) * b.pow(1 + a / h * l, -(a + h) / 2) : (p = a * l / (h + l * a), a * (h / (h + l * a)) / 2 * o.binomial.pdf((a - 2) / 2, (a + h - 2) / 2, p));
            }, cdf: function(l, a, h) {
              return l < 0 ? 0 : o.ibeta(a * l / (a * l + h), a / 2, h / 2);
            }, inv: function(l, a, h) {
              return h / (a * (1 / o.ibetainv(l, a / 2, h / 2) - 1));
            }, mean: function(l, a) {
              return a > 2 ? a / (a - 2) : void 0;
            }, mode: function(l, a) {
              return l > 2 ? a * (l - 2) / (l * (a + 2)) : void 0;
            }, sample: function(l, a) {
              return 2 * o.randg(l / 2) / l / (2 * o.randg(a / 2) / a);
            }, variance: function(l, a) {
              if (!(a <= 4)) return 2 * a * a * (l + a - 2) / (l * (a - 2) * (a - 2) * (a - 4));
            } }), o.extend(o.cauchy, { pdf: function(l, a, h) {
              return h < 0 ? 0 : h / (b.pow(l - a, 2) + b.pow(h, 2)) / b.PI;
            }, cdf: function(l, a, h) {
              return b.atan((l - a) / h) / b.PI + 0.5;
            }, inv: function(l, a, h) {
              return a + h * b.tan(b.PI * (l - 0.5));
            }, median: function(l) {
              return l;
            }, mode: function(l) {
              return l;
            }, sample: function(l, a) {
              return o.randn() * b.sqrt(1 / (2 * o.randg(0.5))) * a + l;
            } }), o.extend(o.chisquare, { pdf: function(l, a) {
              return l < 0 ? 0 : l === 0 && a === 2 ? 0.5 : b.exp((a / 2 - 1) * b.log(l) - l / 2 - a / 2 * b.log(2) - o.gammaln(a / 2));
            }, cdf: function(l, a) {
              return l < 0 ? 0 : o.lowRegGamma(a / 2, l / 2);
            }, inv: function(l, a) {
              return 2 * o.gammapinv(l, 0.5 * a);
            }, mean: function(l) {
              return l;
            }, median: function(l) {
              return l * b.pow(1 - 2 / (9 * l), 3);
            }, mode: function(l) {
              return l - 2 > 0 ? l - 2 : 0;
            }, sample: function(l) {
              return 2 * o.randg(l / 2);
            }, variance: function(l) {
              return 2 * l;
            } }), o.extend(o.exponential, { pdf: function(l, a) {
              return l < 0 ? 0 : a * b.exp(-a * l);
            }, cdf: function(l, a) {
              return l < 0 ? 0 : 1 - b.exp(-a * l);
            }, inv: function(l, a) {
              return -b.log(1 - l) / a;
            }, mean: function(l) {
              return 1 / l;
            }, median: function(l) {
              return 1 / l * b.log(2);
            }, mode: function() {
              return 0;
            }, sample: function(l) {
              return -1 / l * b.log(o._random_fn());
            }, variance: function(l) {
              return b.pow(l, -2);
            } }), o.extend(o.gamma, { pdf: function(l, a, h) {
              return l < 0 ? 0 : l === 0 && a === 1 ? 1 / h : b.exp((a - 1) * b.log(l) - l / h - o.gammaln(a) - a * b.log(h));
            }, cdf: function(l, a, h) {
              return l < 0 ? 0 : o.lowRegGamma(a, l / h);
            }, inv: function(l, a, h) {
              return o.gammapinv(l, a) * h;
            }, mean: function(l, a) {
              return l * a;
            }, mode: function(l, a) {
              if (l > 1) return (l - 1) * a;
            }, sample: function(l, a) {
              return o.randg(l) * a;
            }, variance: function(l, a) {
              return l * a * a;
            } }), o.extend(o.invgamma, { pdf: function(l, a, h) {
              return l <= 0 ? 0 : b.exp(-(a + 1) * b.log(l) - h / l - o.gammaln(a) + a * b.log(h));
            }, cdf: function(l, a, h) {
              return l <= 0 ? 0 : 1 - o.lowRegGamma(a, h / l);
            }, inv: function(l, a, h) {
              return h / o.gammapinv(1 - l, a);
            }, mean: function(l, a) {
              return l > 1 ? a / (l - 1) : void 0;
            }, mode: function(l, a) {
              return a / (l + 1);
            }, sample: function(l, a) {
              return a / o.randg(l);
            }, variance: function(l, a) {
              if (!(l <= 2)) return a * a / ((l - 1) * (l - 1) * (l - 2));
            } }), o.extend(o.kumaraswamy, { pdf: function(l, a, h) {
              return l === 0 && a === 1 ? h : l === 1 && h === 1 ? a : b.exp(b.log(a) + b.log(h) + (a - 1) * b.log(l) + (h - 1) * b.log(1 - b.pow(l, a)));
            }, cdf: function(l, a, h) {
              return l < 0 ? 0 : l > 1 ? 1 : 1 - b.pow(1 - b.pow(l, a), h);
            }, inv: function(l, a, h) {
              return b.pow(1 - b.pow(1 - l, 1 / h), 1 / a);
            }, mean: function(l, a) {
              return a * o.gammafn(1 + 1 / l) * o.gammafn(a) / o.gammafn(1 + 1 / l + a);
            }, median: function(l, a) {
              return b.pow(1 - b.pow(2, -1 / a), 1 / l);
            }, mode: function(l, a) {
              if (l >= 1 && a >= 1 && l !== 1 && a !== 1) return b.pow((l - 1) / (l * a - 1), 1 / l);
            }, variance: function() {
              throw new Error("variance not yet implemented");
            } }), o.extend(o.lognormal, { pdf: function(l, a, h) {
              return l <= 0 ? 0 : b.exp(-b.log(l) - 0.5 * b.log(2 * b.PI) - b.log(h) - b.pow(b.log(l) - a, 2) / (2 * h * h));
            }, cdf: function(l, a, h) {
              return l < 0 ? 0 : 0.5 + 0.5 * o.erf((b.log(l) - a) / b.sqrt(2 * h * h));
            }, inv: function(l, a, h) {
              return b.exp(-1.4142135623730951 * h * o.erfcinv(2 * l) + a);
            }, mean: function(l, a) {
              return b.exp(l + a * a / 2);
            }, median: function(l) {
              return b.exp(l);
            }, mode: function(l, a) {
              return b.exp(l - a * a);
            }, sample: function(l, a) {
              return b.exp(o.randn() * a + l);
            }, variance: function(l, a) {
              return (b.exp(a * a) - 1) * b.exp(2 * l + a * a);
            } }), o.extend(o.noncentralt, { pdf: function(l, a, h) {
              return b.abs(h) < 1e-14 ? o.studentt.pdf(l, a) : b.abs(l) < 1e-14 ? b.exp(o.gammaln((a + 1) / 2) - h * h / 2 - 0.5 * b.log(b.PI * a) - o.gammaln(a / 2)) : a / l * (o.noncentralt.cdf(l * b.sqrt(1 + 2 / a), a + 2, h) - o.noncentralt.cdf(l, a, h));
            }, cdf: function(l, a, h) {
              var p = 1e-14;
              if (b.abs(h) < p) return o.studentt.cdf(l, a);
              var u = !1;
              l < 0 && (u = !0, h = -h);
              for (var v = o.normal.cdf(-h, 0, 1), A = p + 1, M = A, N = l * l / (l * l + a), T = 0, I = b.exp(-h * h / 2), O = b.exp(-h * h / 2 - 0.5 * b.log(2) - o.gammaln(1.5)) * h; T < 200 || M > p || A > p; ) M = A, T > 0 && (I *= h * h / (2 * T), O *= h * h / (2 * (T + 0.5))), v += 0.5 * (A = I * o.beta.cdf(N, T + 0.5, a / 2) + O * o.beta.cdf(N, T + 1, a / 2)), T++;
              return u ? 1 - v : v;
            } }), o.extend(o.normal, { pdf: function(l, a, h) {
              return b.exp(-0.5 * b.log(2 * b.PI) - b.log(h) - b.pow(l - a, 2) / (2 * h * h));
            }, cdf: function(l, a, h) {
              return 0.5 * (1 + o.erf((l - a) / b.sqrt(2 * h * h)));
            }, inv: function(l, a, h) {
              return -1.4142135623730951 * h * o.erfcinv(2 * l) + a;
            }, mean: function(l) {
              return l;
            }, median: function(l) {
              return l;
            }, mode: function(l) {
              return l;
            }, sample: function(l, a) {
              return o.randn() * a + l;
            }, variance: function(l, a) {
              return a * a;
            } }), o.extend(o.pareto, { pdf: function(l, a, h) {
              return l < a ? 0 : h * b.pow(a, h) / b.pow(l, h + 1);
            }, cdf: function(l, a, h) {
              return l < a ? 0 : 1 - b.pow(a / l, h);
            }, inv: function(l, a, h) {
              return a / b.pow(1 - l, 1 / h);
            }, mean: function(l, a) {
              if (!(a <= 1)) return a * b.pow(l, a) / (a - 1);
            }, median: function(l, a) {
              return l * (a * b.SQRT2);
            }, mode: function(l) {
              return l;
            }, variance: function(l, a) {
              if (!(a <= 2)) return l * l * a / (b.pow(a - 1, 2) * (a - 2));
            } }), o.extend(o.studentt, { pdf: function(l, a) {
              return a = a > 1e100 ? 1e100 : a, 1 / (b.sqrt(a) * o.betafn(0.5, a / 2)) * b.pow(1 + l * l / a, -(a + 1) / 2);
            }, cdf: function(l, a) {
              var h = a / 2;
              return o.ibeta((l + b.sqrt(l * l + a)) / (2 * b.sqrt(l * l + a)), h, h);
            }, inv: function(l, a) {
              var h = o.ibetainv(2 * b.min(l, 1 - l), 0.5 * a, 0.5);
              return h = b.sqrt(a * (1 - h) / h), l > 0.5 ? h : -h;
            }, mean: function(l) {
              return l > 1 ? 0 : void 0;
            }, median: function() {
              return 0;
            }, mode: function() {
              return 0;
            }, sample: function(l) {
              return o.randn() * b.sqrt(l / (2 * o.randg(l / 2)));
            }, variance: function(l) {
              return l > 2 ? l / (l - 2) : l > 1 ? 1 / 0 : void 0;
            } }), o.extend(o.weibull, { pdf: function(l, a, h) {
              return l < 0 || a < 0 || h < 0 ? 0 : h / a * b.pow(l / a, h - 1) * b.exp(-b.pow(l / a, h));
            }, cdf: function(l, a, h) {
              return l < 0 ? 0 : 1 - b.exp(-b.pow(l / a, h));
            }, inv: function(l, a, h) {
              return a * b.pow(-b.log(1 - l), 1 / h);
            }, mean: function(l, a) {
              return l * o.gammafn(1 + 1 / a);
            }, median: function(l, a) {
              return l * b.pow(b.log(2), 1 / a);
            }, mode: function(l, a) {
              return a <= 1 ? 0 : l * b.pow((a - 1) / a, 1 / a);
            }, sample: function(l, a) {
              return l * b.pow(-b.log(o._random_fn()), 1 / a);
            }, variance: function(l, a) {
              return l * l * o.gammafn(1 + 2 / a) - b.pow(o.weibull.mean(l, a), 2);
            } }), o.extend(o.uniform, { pdf: function(l, a, h) {
              return l < a || l > h ? 0 : 1 / (h - a);
            }, cdf: function(l, a, h) {
              return l < a ? 0 : l < h ? (l - a) / (h - a) : 1;
            }, inv: function(l, a, h) {
              return a + l * (h - a);
            }, mean: function(l, a) {
              return 0.5 * (l + a);
            }, median: function(l, a) {
              return o.mean(l, a);
            }, mode: function() {
              throw new Error("mode is not yet implemented");
            }, sample: function(l, a) {
              return l / 2 + a / 2 + (a / 2 - l / 2) * (2 * o._random_fn() - 1);
            }, variance: function(l, a) {
              return b.pow(a - l, 2) / 12;
            } }), o.extend(o.binomial, { pdf: function(l, a, h) {
              return h === 0 || h === 1 ? a * h === l ? 1 : 0 : o.combination(a, l) * b.pow(h, l) * b.pow(1 - h, a - l);
            }, cdf: function(l, a, h) {
              var p, u = 1e-10;
              if (l < 0) return 0;
              if (l >= a) return 1;
              if (h < 0 || h > 1 || a <= 0) return NaN;
              var v = h, A = (l = b.floor(l)) + 1, M = a - l, N = A + M, T = b.exp(o.gammaln(N) - o.gammaln(M) - o.gammaln(A) + A * b.log(v) + M * b.log(1 - v));
              return p = v < (A + 1) / (N + 2) ? T * D(v, A, M, u) : 1 - T * D(1 - v, M, A, u), b.round(1 / u * (1 - p)) / (1 / u);
            } }), o.extend(o.negbin, { pdf: function(l, a, h) {
              return l === l >>> 0 && (l < 0 ? 0 : o.combination(l + a - 1, a - 1) * b.pow(1 - h, l) * b.pow(h, a));
            }, cdf: function(l, a, h) {
              var p = 0, u = 0;
              if (l < 0) return 0;
              for (; u <= l; u++) p += o.negbin.pdf(u, a, h);
              return p;
            } }), o.extend(o.hypgeom, { pdf: function(l, a, h, p) {
              if (l != l | 0) return !1;
              if (l < 0 || l < h - (a - p) || l > p || l > h) return 0;
              if (2 * h > a) return 2 * p > a ? o.hypgeom.pdf(a - h - p + l, a, a - h, a - p) : o.hypgeom.pdf(p - l, a, a - h, p);
              if (2 * p > a) return o.hypgeom.pdf(h - l, a, h, a - p);
              if (h < p) return o.hypgeom.pdf(l, a, p, h);
              for (var u = 1, v = 0, A = 0; A < l; A++) {
                for (; u > 1 && v < p; ) u *= 1 - h / (a - v), v++;
                u *= (p - A) * (h - A) / ((A + 1) * (a - h - p + A + 1));
              }
              for (; v < p; v++) u *= 1 - h / (a - v);
              return b.min(1, b.max(0, u));
            }, cdf: function(l, a, h, p) {
              if (l < 0 || l < h - (a - p)) return 0;
              if (l >= p || l >= h) return 1;
              if (2 * h > a) return 2 * p > a ? o.hypgeom.cdf(a - h - p + l, a, a - h, a - p) : 1 - o.hypgeom.cdf(p - l - 1, a, a - h, p);
              if (2 * p > a) return 1 - o.hypgeom.cdf(h - l - 1, a, h, a - p);
              if (h < p) return o.hypgeom.cdf(l, a, p, h);
              for (var u = 1, v = 1, A = 0, M = 0; M < l; M++) {
                for (; u > 1 && A < p; ) {
                  var N = 1 - h / (a - A);
                  v *= N, u *= N, A++;
                }
                u += v *= (p - M) * (h - M) / ((M + 1) * (a - h - p + M + 1));
              }
              for (; A < p; A++) u *= 1 - h / (a - A);
              return b.min(1, b.max(0, u));
            } }), o.extend(o.poisson, { pdf: function(l, a) {
              return a < 0 || l % 1 != 0 || l < 0 ? 0 : b.pow(a, l) * b.exp(-a) / o.factorial(l);
            }, cdf: function(l, a) {
              var h = [], p = 0;
              if (l < 0) return 0;
              for (; p <= l; p++) h.push(o.poisson.pdf(p, a));
              return o.sum(h);
            }, mean: function(l) {
              return l;
            }, variance: function(l) {
              return l;
            }, sampleSmall: function(l) {
              var a = 1, h = 0, p = b.exp(-l);
              do
                h++, a *= o._random_fn();
              while (a > p);
              return h - 1;
            }, sampleLarge: function(l) {
              var a, h, p, u, v, A, M, N, T, I, O = l;
              for (u = b.sqrt(O), v = b.log(O), A = 0.02483 * (M = 0.931 + 2.53 * u) - 0.059, N = 1.1239 + 1.1328 / (M - 3.4), T = 0.9277 - 3.6224 / (M - 2); ; )
                if (h = b.random() - 0.5, p = b.random(), I = 0.5 - b.abs(h), a = b.floor((2 * A / I + M) * h + O + 0.43), I >= 0.07 && p <= T || !(a < 0 || I < 0.013 && p > I) && b.log(p) + b.log(N) - b.log(A / (I * I) + M) <= a * v - O - o.loggam(a + 1)) return a;
            }, sample: function(l) {
              return l < 10 ? this.sampleSmall(l) : this.sampleLarge(l);
            } }), o.extend(o.triangular, { pdf: function(l, a, h, p) {
              return h <= a || p < a || p > h ? NaN : l < a || l > h ? 0 : l < p ? 2 * (l - a) / ((h - a) * (p - a)) : l === p ? 2 / (h - a) : 2 * (h - l) / ((h - a) * (h - p));
            }, cdf: function(l, a, h, p) {
              return h <= a || p < a || p > h ? NaN : l <= a ? 0 : l >= h ? 1 : l <= p ? b.pow(l - a, 2) / ((h - a) * (p - a)) : 1 - b.pow(h - l, 2) / ((h - a) * (h - p));
            }, inv: function(l, a, h, p) {
              return h <= a || p < a || p > h ? NaN : l <= (p - a) / (h - a) ? a + (h - a) * b.sqrt(l * ((p - a) / (h - a))) : a + (h - a) * (1 - b.sqrt((1 - l) * (1 - (p - a) / (h - a))));
            }, mean: function(l, a, h) {
              return (l + a + h) / 3;
            }, median: function(l, a, h) {
              return h <= (l + a) / 2 ? a - b.sqrt((a - l) * (a - h)) / b.sqrt(2) : h > (l + a) / 2 ? l + b.sqrt((a - l) * (h - l)) / b.sqrt(2) : void 0;
            }, mode: function(l, a, h) {
              return h;
            }, sample: function(l, a, h) {
              var p = o._random_fn();
              return p < (h - l) / (a - l) ? l + b.sqrt(p * (a - l) * (h - l)) : a - b.sqrt((1 - p) * (a - l) * (a - h));
            }, variance: function(l, a, h) {
              return (l * l + a * a + h * h - l * a - l * h - a * h) / 18;
            } }), o.extend(o.arcsine, { pdf: function(l, a, h) {
              return h <= a ? NaN : l <= a || l >= h ? 0 : 2 / b.PI * b.pow(b.pow(h - a, 2) - b.pow(2 * l - a - h, 2), -0.5);
            }, cdf: function(l, a, h) {
              return l < a ? 0 : l < h ? 2 / b.PI * b.asin(b.sqrt((l - a) / (h - a))) : 1;
            }, inv: function(l, a, h) {
              return a + (0.5 - 0.5 * b.cos(b.PI * l)) * (h - a);
            }, mean: function(l, a) {
              return a <= l ? NaN : (l + a) / 2;
            }, median: function(l, a) {
              return a <= l ? NaN : (l + a) / 2;
            }, mode: function() {
              throw new Error("mode is not yet implemented");
            }, sample: function(l, a) {
              return (l + a) / 2 + (a - l) / 2 * b.sin(2 * b.PI * o.uniform.sample(0, 1));
            }, variance: function(l, a) {
              return a <= l ? NaN : b.pow(a - l, 2) / 8;
            } }), o.extend(o.laplace, { pdf: function(l, a, h) {
              return h <= 0 ? 0 : b.exp(-b.abs(l - a) / h) / (2 * h);
            }, cdf: function(l, a, h) {
              return h <= 0 ? 0 : l < a ? 0.5 * b.exp((l - a) / h) : 1 - 0.5 * b.exp(-(l - a) / h);
            }, mean: function(l) {
              return l;
            }, median: function(l) {
              return l;
            }, mode: function(l) {
              return l;
            }, variance: function(l, a) {
              return 2 * a * a;
            }, sample: function(l, a) {
              var h, p = o._random_fn() - 0.5;
              return l - a * ((h = p) / b.abs(h)) * b.log(1 - 2 * b.abs(p));
            } }), o.extend(o.tukey, { cdf: function(l, a, h) {
              var p = a, u = [0.9894009349916499, 0.9445750230732326, 0.8656312023878318, 0.755404408355003, 0.6178762444026438, 0.45801677765722737, 0.2816035507792589, 0.09501250983763744], v = [0.027152459411754096, 0.062253523938647894, 0.09515851168249279, 0.12462897125553388, 0.14959598881657674, 0.16915651939500254, 0.18260341504492358, 0.1894506104550685];
              if (l <= 0) return 0;
              if (h < 2 || p < 2) return NaN;
              if (!Number.isFinite(l)) return 1;
              if (h > 25e3) return _(l, 1, p);
              var A, M = 0.5 * h, N = M * b.log(h) - h * b.log(2) - o.gammaln(M), T = M - 1, I = 0.25 * h;
              A = h <= 100 ? 1 : h <= 800 ? 0.5 : h <= 5e3 ? 0.25 : 0.125, N += b.log(A);
              for (var O = 0, Y = 1; Y <= 50; Y++) {
                for (var U = 0, ue = (2 * Y - 1) * A, be = 1; be <= 16; be++) {
                  var G, ie;
                  8 < be ? (G = be - 8 - 1, ie = N + T * b.log(ue + u[G] * A) - (u[G] * A + ue) * I) : (G = be - 1, ie = N + T * b.log(ue - u[G] * A) + (u[G] * A - ue) * I), ie >= -30 && (U += _(8 < be ? l * b.sqrt(0.5 * (u[G] * A + ue)) : l * b.sqrt(0.5 * (-u[G] * A + ue)), 1, p) * v[G] * b.exp(ie));
                }
                if (Y * A >= 1 && U <= 1e-14) break;
                O += U;
              }
              if (U > 1e-14) throw new Error("tukey.cdf failed to converge");
              return O > 1 && (O = 1), O;
            }, inv: function(l, a, h) {
              if (h < 2 || a < 2) return NaN;
              if (l < 0 || l > 1) return NaN;
              if (l === 0) return 0;
              if (l === 1) return 1 / 0;
              var p, u = (function(T, I, O) {
                var Y = 0.5 - 0.5 * T, U = b.sqrt(b.log(1 / (Y * Y))), ue = U + ((((-453642210148e-16 * U - 0.204231210125) * U - 0.342242088547) * U - 1) * U + 0.322232421088) / ((((0.0038560700634 * U + 0.10353775285) * U + 0.531103462366) * U + 0.588581570495) * U + 0.099348462606);
                O < 120 && (ue += (ue * ue * ue + ue) / O / 4);
                var be = 0.8832 - 0.2368 * ue;
                return O < 120 && (be += -1.214 / O + 1.208 * ue / O), ue * (be * b.log(I - 1) + 1.4142);
              })(l, a, h), v = o.tukey.cdf(u, a, h) - l;
              p = v > 0 ? b.max(0, u - 1) : u + 1;
              for (var A, M = o.tukey.cdf(p, a, h) - l, N = 1; N < 50; N++) if (A = p - M * (p - u) / (M - v), v = M, u = p, A < 0 && (A = 0, M = -l), M = o.tukey.cdf(A, a, h) - l, p = A, b.abs(p - u) < 1e-4) return A;
              throw new Error("tukey.inv failed to converge");
            } });
          })(g, Math), (function(o, b) {
            var D, _, l = Array.prototype.push, a = o.utils.isArray;
            function h(p) {
              return a(p) || p instanceof o;
            }
            o.extend({ add: function(p, u) {
              return h(u) ? (h(u[0]) || (u = [u]), o.map(p, (function(v, A, M) {
                return v + u[A][M];
              }))) : o.map(p, (function(v) {
                return v + u;
              }));
            }, subtract: function(p, u) {
              return h(u) ? (h(u[0]) || (u = [u]), o.map(p, (function(v, A, M) {
                return v - u[A][M] || 0;
              }))) : o.map(p, (function(v) {
                return v - u;
              }));
            }, divide: function(p, u) {
              return h(u) ? (h(u[0]) || (u = [u]), o.multiply(p, o.inv(u))) : o.map(p, (function(v) {
                return v / u;
              }));
            }, multiply: function(p, u) {
              var v, A, M, N, T, I, O, Y;
              if (p.length === void 0 && u.length === void 0) return p * u;
              if (T = p.length, I = p[0].length, O = o.zeros(T, M = h(u) ? u[0].length : I), Y = 0, h(u)) {
                for (; Y < M; Y++) for (v = 0; v < T; v++) {
                  for (N = 0, A = 0; A < I; A++) N += p[v][A] * u[A][Y];
                  O[v][Y] = N;
                }
                return T === 1 && Y === 1 ? O[0][0] : O;
              }
              return o.map(p, (function(U) {
                return U * u;
              }));
            }, outer: function(p, u) {
              return o.multiply(p.map((function(v) {
                return [v];
              })), [u]);
            }, dot: function(p, u) {
              h(p[0]) || (p = [p]), h(u[0]) || (u = [u]);
              for (var v, A, M = p[0].length === 1 && p.length !== 1 ? o.transpose(p) : p, N = u[0].length === 1 && u.length !== 1 ? o.transpose(u) : u, T = [], I = 0, O = M.length, Y = M[0].length; I < O; I++) {
                for (T[I] = [], v = 0, A = 0; A < Y; A++) v += M[I][A] * N[I][A];
                T[I] = v;
              }
              return T.length === 1 ? T[0] : T;
            }, pow: function(p, u) {
              return o.map(p, (function(v) {
                return b.pow(v, u);
              }));
            }, exp: function(p) {
              return o.map(p, (function(u) {
                return b.exp(u);
              }));
            }, log: function(p) {
              return o.map(p, (function(u) {
                return b.log(u);
              }));
            }, abs: function(p) {
              return o.map(p, (function(u) {
                return b.abs(u);
              }));
            }, norm: function(p, u) {
              var v = 0, A = 0;
              for (isNaN(u) && (u = 2), h(p[0]) && (p = p[0]); A < p.length; A++) v += b.pow(b.abs(p[A]), u);
              return b.pow(v, 1 / u);
            }, angle: function(p, u) {
              return b.acos(o.dot(p, u) / (o.norm(p) * o.norm(u)));
            }, aug: function(p, u) {
              var v, A = [];
              for (v = 0; v < p.length; v++) A.push(p[v].slice());
              for (v = 0; v < A.length; v++) l.apply(A[v], u[v]);
              return A;
            }, inv: function(p) {
              for (var u, v = p.length, A = p[0].length, M = o.identity(v, A), N = o.gauss_jordan(p, M), T = [], I = 0; I < v; I++) for (T[I] = [], u = A; u < N[0].length; u++) T[I][u - A] = N[I][u];
              return T;
            }, det: function p(u) {
              if (u.length === 2) return u[0][0] * u[1][1] - u[0][1] * u[1][0];
              for (var v = 0, A = 0; A < u.length; A++) {
                for (var M = [], N = 1; N < u.length; N++) {
                  M[N - 1] = [];
                  for (var T = 0; T < u.length; T++) T < A ? M[N - 1][T] = u[N][T] : T > A && (M[N - 1][T - 1] = u[N][T]);
                }
                var I = A % 2 ? -1 : 1;
                v += p(M) * u[0][A] * I;
              }
              return v;
            }, gauss_elimination: function(p, u) {
              var v, A, M, N, T = 0, I = 0, O = p.length, Y = p[0].length, U = 1, ue = 0, be = [];
              for (v = (p = o.aug(p, u))[0].length, T = 0; T < O; T++) {
                for (A = p[T][T], I = T, N = T + 1; N < Y; N++) A < b.abs(p[N][T]) && (A = p[N][T], I = N);
                if (I != T) for (N = 0; N < v; N++) M = p[T][N], p[T][N] = p[I][N], p[I][N] = M;
                for (I = T + 1; I < O; I++) for (U = p[I][T] / p[T][T], N = T; N < v; N++) p[I][N] = p[I][N] - U * p[T][N];
              }
              for (T = O - 1; T >= 0; T--) {
                for (ue = 0, I = T + 1; I <= O - 1; I++) ue += be[I] * p[T][I];
                be[T] = (p[T][v - 1] - ue) / p[T][T];
              }
              return be;
            }, gauss_jordan: function(p, u) {
              var v, A, M, N = o.aug(p, u), T = N.length, I = N[0].length, O = 0;
              for (A = 0; A < T; A++) {
                var Y = A;
                for (M = A + 1; M < T; M++) b.abs(N[M][A]) > b.abs(N[Y][A]) && (Y = M);
                var U = N[A];
                for (N[A] = N[Y], N[Y] = U, M = A + 1; M < T; M++) for (O = N[M][A] / N[A][A], v = A; v < I; v++) N[M][v] -= N[A][v] * O;
              }
              for (A = T - 1; A >= 0; A--) {
                for (O = N[A][A], M = 0; M < A; M++) for (v = I - 1; v > A - 1; v--) N[M][v] -= N[A][v] * N[M][A] / O;
                for (N[A][A] /= O, v = T; v < I; v++) N[A][v] /= O;
              }
              return N;
            }, triaUpSolve: function(p, u) {
              var v, A = p[0].length, M = o.zeros(1, A)[0], N = !1;
              return u[0].length != null && (u = u.map((function(T) {
                return T[0];
              })), N = !0), o.arange(A - 1, -1, -1).forEach((function(T) {
                v = o.arange(T + 1, A).map((function(I) {
                  return M[I] * p[T][I];
                })), M[T] = (u[T] - o.sum(v)) / p[T][T];
              })), N ? M.map((function(T) {
                return [T];
              })) : M;
            }, triaLowSolve: function(p, u) {
              var v, A = p[0].length, M = o.zeros(1, A)[0], N = !1;
              return u[0].length != null && (u = u.map((function(T) {
                return T[0];
              })), N = !0), o.arange(A).forEach((function(T) {
                v = o.arange(T).map((function(I) {
                  return p[T][I] * M[I];
                })), M[T] = (u[T] - o.sum(v)) / p[T][T];
              })), N ? M.map((function(T) {
                return [T];
              })) : M;
            }, lu: function(p) {
              var u, v = p.length, A = o.identity(v), M = o.zeros(p.length, p[0].length);
              return o.arange(v).forEach((function(N) {
                M[0][N] = p[0][N];
              })), o.arange(1, v).forEach((function(N) {
                o.arange(N).forEach((function(T) {
                  u = o.arange(T).map((function(I) {
                    return A[N][I] * M[I][T];
                  })), A[N][T] = (p[N][T] - o.sum(u)) / M[T][T];
                })), o.arange(N, v).forEach((function(T) {
                  u = o.arange(N).map((function(I) {
                    return A[N][I] * M[I][T];
                  })), M[N][T] = p[u.length][T] - o.sum(u);
                }));
              })), [A, M];
            }, cholesky: function(p) {
              var u, v = p.length, A = o.zeros(p.length, p[0].length);
              return o.arange(v).forEach((function(M) {
                u = o.arange(M).map((function(N) {
                  return b.pow(A[M][N], 2);
                })), A[M][M] = b.sqrt(p[M][M] - o.sum(u)), o.arange(M + 1, v).forEach((function(N) {
                  u = o.arange(M).map((function(T) {
                    return A[M][T] * A[N][T];
                  })), A[N][M] = (p[M][N] - o.sum(u)) / A[M][M];
                }));
              })), A;
            }, gauss_jacobi: function(p, u, v, A) {
              for (var M, N, T, I, O = 0, Y = 0, U = p.length, ue = [], be = [], G = []; O < U; O++) for (ue[O] = [], be[O] = [], G[O] = [], Y = 0; Y < U; Y++) O > Y ? (ue[O][Y] = p[O][Y], be[O][Y] = G[O][Y] = 0) : O < Y ? (be[O][Y] = p[O][Y], ue[O][Y] = G[O][Y] = 0) : (G[O][Y] = p[O][Y], ue[O][Y] = be[O][Y] = 0);
              for (T = o.multiply(o.multiply(o.inv(G), o.add(ue, be)), -1), N = o.multiply(o.inv(G), u), M = v, I = o.add(o.multiply(T, v), N), O = 2; b.abs(o.norm(o.subtract(I, M))) > A; ) M = I, I = o.add(o.multiply(T, M), N), O++;
              return I;
            }, gauss_seidel: function(p, u, v, A) {
              for (var M, N, T, I, O, Y = 0, U = p.length, ue = [], be = [], G = []; Y < U; Y++) for (ue[Y] = [], be[Y] = [], G[Y] = [], M = 0; M < U; M++) Y > M ? (ue[Y][M] = p[Y][M], be[Y][M] = G[Y][M] = 0) : Y < M ? (be[Y][M] = p[Y][M], ue[Y][M] = G[Y][M] = 0) : (G[Y][M] = p[Y][M], ue[Y][M] = be[Y][M] = 0);
              for (I = o.multiply(o.multiply(o.inv(o.add(G, ue)), be), -1), T = o.multiply(o.inv(o.add(G, ue)), u), N = v, O = o.add(o.multiply(I, v), T), Y = 2; b.abs(o.norm(o.subtract(O, N))) > A; ) N = O, O = o.add(o.multiply(I, N), T), Y += 1;
              return O;
            }, SOR: function(p, u, v, A, M) {
              for (var N, T, I, O, Y, U = 0, ue = p.length, be = [], G = [], ie = []; U < ue; U++) for (be[U] = [], G[U] = [], ie[U] = [], N = 0; N < ue; N++) U > N ? (be[U][N] = p[U][N], G[U][N] = ie[U][N] = 0) : U < N ? (G[U][N] = p[U][N], be[U][N] = ie[U][N] = 0) : (ie[U][N] = p[U][N], be[U][N] = G[U][N] = 0);
              for (O = o.multiply(o.inv(o.add(ie, o.multiply(be, M))), o.subtract(o.multiply(ie, 1 - M), o.multiply(G, M))), I = o.multiply(o.multiply(o.inv(o.add(ie, o.multiply(be, M))), u), M), T = v, Y = o.add(o.multiply(O, v), I), U = 2; b.abs(o.norm(o.subtract(Y, T))) > A; ) T = Y, Y = o.add(o.multiply(O, T), I), U++;
              return Y;
            }, householder: function(p) {
              for (var u, v, A, M, N = p.length, T = p[0].length, I = 0, O = [], Y = []; I < N - 1; I++) {
                for (u = 0, M = I + 1; M < T; M++) u += p[M][I] * p[M][I];
                for (u = (p[I + 1][I] > 0 ? -1 : 1) * b.sqrt(u), v = b.sqrt((u * u - p[I + 1][I] * u) / 2), (O = o.zeros(N, 1))[I + 1][0] = (p[I + 1][I] - u) / (2 * v), A = I + 2; A < N; A++) O[A][0] = p[A][I] / (2 * v);
                Y = o.subtract(o.identity(N, T), o.multiply(o.multiply(O, o.transpose(O)), 2)), p = o.multiply(Y, o.multiply(p, Y));
              }
              return p;
            }, QR: (D = o.sum, _ = o.arange, function(p) {
              var u, v, A, M = p.length, N = p[0].length, T = o.zeros(N, N);
              for (p = o.copy(p), v = 0; v < N; v++) {
                for (T[v][v] = b.sqrt(D(_(M).map((function(I) {
                  return p[I][v] * p[I][v];
                })))), u = 0; u < M; u++) p[u][v] = p[u][v] / T[v][v];
                for (A = v + 1; A < N; A++) for (T[v][A] = D(_(M).map((function(I) {
                  return p[I][v] * p[I][A];
                }))), u = 0; u < M; u++) p[u][A] = p[u][A] - p[u][v] * T[v][A];
              }
              return [p, T];
            }), lstsq: function(p, u) {
              var v = !1;
              u[0].length === void 0 && (u = u.map((function(ue) {
                return [ue];
              })), v = !0);
              var A = o.QR(p), M = A[0], N = A[1], T = p[0].length, I = o.slice(M, { col: { end: T } }), O = (function(ue) {
                var be = (ue = o.copy(ue)).length, G = o.identity(be);
                return o.arange(be - 1, -1, -1).forEach((function(ie) {
                  o.sliceAssign(G, { row: ie }, o.divide(o.slice(G, { row: ie }), ue[ie][ie])), o.sliceAssign(ue, { row: ie }, o.divide(o.slice(ue, { row: ie }), ue[ie][ie])), o.arange(ie).forEach((function(ge) {
                    var de = o.multiply(ue[ge][ie], -1), oe = o.slice(ue, { row: ge }), xe = o.multiply(o.slice(ue, { row: ie }), de);
                    o.sliceAssign(ue, { row: ge }, o.add(oe, xe));
                    var Oe = o.slice(G, { row: ge }), Be = o.multiply(o.slice(G, { row: ie }), de);
                    o.sliceAssign(G, { row: ge }, o.add(Oe, Be));
                  }));
                })), G;
              })(o.slice(N, { row: { end: T } })), Y = o.transpose(I);
              Y[0].length === void 0 && (Y = [Y]);
              var U = o.multiply(o.multiply(O, Y), u);
              return U.length === void 0 && (U = [[U]]), v ? U.map((function(ue) {
                return ue[0];
              })) : U;
            }, jacobi: function(p) {
              for (var u, v, A, M, N, T, I, O = 1, Y = p.length, U = o.identity(Y, Y), ue = []; O === 1; ) {
                for (N = p[0][1], A = 0, M = 1, u = 0; u < Y; u++) for (v = 0; v < Y; v++) u != v && N < b.abs(p[u][v]) && (N = b.abs(p[u][v]), A = u, M = v);
                for (T = p[A][A] === p[M][M] ? p[A][M] > 0 ? b.PI / 4 : -b.PI / 4 : b.atan(2 * p[A][M] / (p[A][A] - p[M][M])) / 2, (I = o.identity(Y, Y))[A][A] = b.cos(T), I[A][M] = -b.sin(T), I[M][A] = b.sin(T), I[M][M] = b.cos(T), U = o.multiply(U, I), p = o.multiply(o.multiply(o.inv(I), p), I), O = 0, u = 1; u < Y; u++) for (v = 1; v < Y; v++) u != v && b.abs(p[u][v]) > 1e-3 && (O = 1);
              }
              for (u = 0; u < Y; u++) ue.push(p[u][u]);
              return [U, ue];
            }, rungekutta: function(p, u, v, A, M, N) {
              var T, I, O;
              if (N === 2) for (; A <= v; ) M += ((T = u * p(A, M)) + (I = u * p(A + u, M + T))) / 2, A += u;
              if (N === 4) for (; A <= v; ) M += ((T = u * p(A, M)) + 2 * (I = u * p(A + u / 2, M + T / 2)) + 2 * (O = u * p(A + u / 2, M + I / 2)) + u * p(A + u, M + O)) / 6, A += u;
              return M;
            }, romberg: function(p, u, v, A) {
              for (var M, N, T, I, O, Y = 0, U = (v - u) / 2, ue = [], be = [], G = []; Y < A / 2; ) {
                for (O = p(u), T = u, I = 0; T <= v; T += U, I++) ue[I] = T;
                for (M = ue.length, T = 1; T < M - 1; T++) O += (T % 2 != 0 ? 4 : 2) * p(ue[T]);
                O = U / 3 * (O + p(v)), G[Y] = O, U /= 2, Y++;
              }
              for (N = G.length, M = 1; N !== 1; ) {
                for (T = 0; T < N - 1; T++) be[T] = (b.pow(4, M) * G[T + 1] - G[T]) / (b.pow(4, M) - 1);
                N = be.length, G = be, be = [], M++;
              }
              return G;
            }, richardson: function(p, u, v, A) {
              function M(ie, ge) {
                for (var de, oe = 0, xe = ie.length; oe < xe; oe++) ie[oe] === ge && (de = oe);
                return de;
              }
              for (var N, T, I, O, Y, U = b.abs(v - p[M(p, v) + 1]), ue = 0, be = [], G = []; A >= U; ) N = M(p, v + A), T = M(p, v), be[ue] = (u[N] - 2 * u[T] + u[2 * T - N]) / (A * A), A /= 2, ue++;
              for (O = be.length, I = 1; O != 1; ) {
                for (Y = 0; Y < O - 1; Y++) G[Y] = (b.pow(4, I) * be[Y + 1] - be[Y]) / (b.pow(4, I) - 1);
                O = G.length, be = G, G = [], I++;
              }
              return be;
            }, simpson: function(p, u, v, A) {
              for (var M, N = (v - u) / A, T = p(u), I = [], O = u, Y = 0, U = 1; O <= v; O += N, Y++) I[Y] = O;
              for (M = I.length; U < M - 1; U++) T += (U % 2 != 0 ? 4 : 2) * p(I[U]);
              return N / 3 * (T + p(v));
            }, hermite: function(p, u, v, A) {
              for (var M, N = p.length, T = 0, I = 0, O = [], Y = [], U = [], ue = []; I < N; I++) {
                for (O[I] = 1, M = 0; M < N; M++) I != M && (O[I] *= (A - p[M]) / (p[I] - p[M]));
                for (Y[I] = 0, M = 0; M < N; M++) I != M && (Y[I] += 1 / (p[I] - p[M]));
                U[I] = (1 - 2 * (A - p[I]) * Y[I]) * (O[I] * O[I]), ue[I] = (A - p[I]) * (O[I] * O[I]), T += U[I] * u[I] + ue[I] * v[I];
              }
              return T;
            }, lagrange: function(p, u, v) {
              for (var A, M, N = 0, T = 0, I = p.length; T < I; T++) {
                for (M = u[T], A = 0; A < I; A++) T != A && (M *= (v - p[A]) / (p[T] - p[A]));
                N += M;
              }
              return N;
            }, cubic_spline: function(p, u, v) {
              for (var A, M, N = p.length, T = 0, I = [], O = [], Y = [], U = [], ue = [], be = []; T < N - 1; T++) U[T] = p[T + 1] - p[T];
              for (Y[0] = 0, T = 1; T < N - 1; T++) Y[T] = 3 / U[T] * (u[T + 1] - u[T]) - 3 / U[T - 1] * (u[T] - u[T - 1]);
              for (T = 1; T < N - 1; T++) I[T] = [], O[T] = [], I[T][T - 1] = U[T - 1], I[T][T] = 2 * (U[T - 1] + U[T]), I[T][T + 1] = U[T], O[T][0] = Y[T];
              for (M = o.multiply(o.inv(I), O), A = 0; A < N - 1; A++) ue[A] = (u[A + 1] - u[A]) / U[A] - U[A] * (M[A + 1][0] + 2 * M[A][0]) / 3, be[A] = (M[A + 1][0] - M[A][0]) / (3 * U[A]);
              for (A = 0; A < N && !(p[A] > v); A++) ;
              return u[A -= 1] + (v - p[A]) * ue[A] + o.sq(v - p[A]) * M[A] + (v - p[A]) * o.sq(v - p[A]) * be[A];
            }, gauss_quadrature: function() {
              throw new Error("gauss_quadrature not yet implemented");
            }, PCA: function(p) {
              var u, v, A, M, N, T = p.length, I = p[0].length, O = 0, Y = [], U = [], ue = [], be = [], G = [], ie = [], ge = [];
              for (O = 0; O < T; O++) Y[O] = o.sum(p[O]) / I;
              for (O = 0; O < I; O++) for (G[O] = [], u = 0; u < T; u++) G[O][u] = p[u][O] - Y[u];
              for (G = o.transpose(G), O = 0; O < T; O++) for (ie[O] = [], u = 0; u < T; u++) ie[O][u] = o.dot([G[O]], [G[u]]) / (I - 1);
              for (N = (A = o.jacobi(ie))[0], U = A[1], ge = o.transpose(N), O = 0; O < U.length; O++) for (u = O; u < U.length; u++) U[O] < U[u] && (v = U[O], U[O] = U[u], U[u] = v, ue = ge[O], ge[O] = ge[u], ge[u] = ue);
              for (M = o.transpose(G), O = 0; O < T; O++) for (be[O] = [], u = 0; u < M.length; u++) be[O][u] = o.dot([ge[O]], [M[u]]);
              return [p, U, ge, be];
            } }), (function(p) {
              for (var u = 0; u < p.length; u++) (function(v) {
                o.fn[v] = function(A, M) {
                  var N = this;
                  return M ? (setTimeout((function() {
                    M.call(N, o.fn[v].call(N, A));
                  }), 15), this) : typeof o[v](this, A) == "number" ? o[v](this, A) : o(o[v](this, A));
                };
              })(p[u]);
            })("add divide multiply subtract dot pow exp log abs norm angle".split(" "));
          })(g, Math), (function(o, b) {
            var D = [].slice, _ = o.utils.isNumber, l = o.utils.isArray;
            function a(h, p, u, v) {
              if (h > 1 || u > 1 || h <= 0 || u <= 0) throw new Error("Proportions should be greater than 0 and less than 1");
              var A = (h * p + u * v) / (p + v);
              return (h - u) / b.sqrt(A * (1 - A) * (1 / p + 1 / v));
            }
            o.extend({ zscore: function() {
              var h = D.call(arguments);
              return _(h[1]) ? (h[0] - h[1]) / h[2] : (h[0] - o.mean(h[1])) / o.stdev(h[1], h[2]);
            }, ztest: function() {
              var h, p = D.call(arguments);
              return l(p[1]) ? (h = o.zscore(p[0], p[1], p[3]), p[2] === 1 ? o.normal.cdf(-b.abs(h), 0, 1) : 2 * o.normal.cdf(-b.abs(h), 0, 1)) : p.length > 2 ? (h = o.zscore(p[0], p[1], p[2]), p[3] === 1 ? o.normal.cdf(-b.abs(h), 0, 1) : 2 * o.normal.cdf(-b.abs(h), 0, 1)) : (h = p[0], p[1] === 1 ? o.normal.cdf(-b.abs(h), 0, 1) : 2 * o.normal.cdf(-b.abs(h), 0, 1));
            } }), o.extend(o.fn, { zscore: function(h, p) {
              return (h - this.mean()) / this.stdev(p);
            }, ztest: function(h, p, u) {
              var v = b.abs(this.zscore(h, u));
              return p === 1 ? o.normal.cdf(-v, 0, 1) : 2 * o.normal.cdf(-v, 0, 1);
            } }), o.extend({ tscore: function() {
              var h = D.call(arguments);
              return h.length === 4 ? (h[0] - h[1]) / (h[2] / b.sqrt(h[3])) : (h[0] - o.mean(h[1])) / (o.stdev(h[1], !0) / b.sqrt(h[1].length));
            }, ttest: function() {
              var h, p = D.call(arguments);
              return p.length === 5 ? (h = b.abs(o.tscore(p[0], p[1], p[2], p[3])), p[4] === 1 ? o.studentt.cdf(-h, p[3] - 1) : 2 * o.studentt.cdf(-h, p[3] - 1)) : _(p[1]) ? (h = b.abs(p[0]), p[2] == 1 ? o.studentt.cdf(-h, p[1] - 1) : 2 * o.studentt.cdf(-h, p[1] - 1)) : (h = b.abs(o.tscore(p[0], p[1])), p[2] == 1 ? o.studentt.cdf(-h, p[1].length - 1) : 2 * o.studentt.cdf(-h, p[1].length - 1));
            } }), o.extend(o.fn, { tscore: function(h) {
              return (h - this.mean()) / (this.stdev(!0) / b.sqrt(this.cols()));
            }, ttest: function(h, p) {
              return p === 1 ? 1 - o.studentt.cdf(b.abs(this.tscore(h)), this.cols() - 1) : 2 * o.studentt.cdf(-b.abs(this.tscore(h)), this.cols() - 1);
            } }), o.extend({ anovafscore: function() {
              var h, p, u, v, A, M, N, T, I = D.call(arguments);
              if (I.length === 1) {
                for (A = new Array(I[0].length), N = 0; N < I[0].length; N++) A[N] = I[0][N];
                I = A;
              }
              for (p = new Array(), N = 0; N < I.length; N++) p = p.concat(I[N]);
              for (u = o.mean(p), h = 0, N = 0; N < I.length; N++) h += I[N].length * b.pow(o.mean(I[N]) - u, 2);
              for (h /= I.length - 1, M = 0, N = 0; N < I.length; N++) for (v = o.mean(I[N]), T = 0; T < I[N].length; T++) M += b.pow(I[N][T] - v, 2);
              return h / (M / (p.length - I.length));
            }, anovaftest: function() {
              var h, p, u, v, A = D.call(arguments);
              if (_(A[0])) return 1 - o.centralF.cdf(A[0], A[1], A[2]);
              var M = o.anovafscore(A);
              for (h = A.length - 1, u = 0, v = 0; v < A.length; v++) u += A[v].length;
              return p = u - h - 1, 1 - o.centralF.cdf(M, h, p);
            }, ftest: function(h, p, u) {
              return 1 - o.centralF.cdf(h, p, u);
            } }), o.extend(o.fn, { anovafscore: function() {
              return o.anovafscore(this.toArray());
            }, anovaftes: function() {
              var h, p = 0;
              for (h = 0; h < this.length; h++) p += this[h].length;
              return o.ftest(this.anovafscore(), this.length - 1, p - this.length);
            } }), o.extend({ qscore: function() {
              var h, p, u, v, A, M = D.call(arguments);
              return _(M[0]) ? (h = M[0], p = M[1], u = M[2], v = M[3], A = M[4]) : (h = o.mean(M[0]), p = o.mean(M[1]), u = M[0].length, v = M[1].length, A = M[2]), b.abs(h - p) / (A * b.sqrt((1 / u + 1 / v) / 2));
            }, qtest: function() {
              var h, p = D.call(arguments);
              p.length === 3 ? (h = p[0], p = p.slice(1)) : p.length === 7 ? (h = o.qscore(p[0], p[1], p[2], p[3], p[4]), p = p.slice(5)) : (h = o.qscore(p[0], p[1], p[2]), p = p.slice(3));
              var u = p[0], v = p[1];
              return 1 - o.tukey.cdf(h, v, u - v);
            }, tukeyhsd: function(h) {
              for (var p = o.pooledstdev(h), u = h.map((function(I) {
                return o.mean(I);
              })), v = h.reduce((function(I, O) {
                return I + O.length;
              }), 0), A = [], M = 0; M < h.length; ++M) for (var N = M + 1; N < h.length; ++N) {
                var T = o.qtest(u[M], u[N], h[M].length, h[N].length, p, v, h.length);
                A.push([[M, N], T]);
              }
              return A;
            } }), o.extend({ normalci: function() {
              var h, p = D.call(arguments), u = new Array(2);
              return h = p.length === 4 ? b.abs(o.normal.inv(p[1] / 2, 0, 1) * p[2] / b.sqrt(p[3])) : b.abs(o.normal.inv(p[1] / 2, 0, 1) * o.stdev(p[2]) / b.sqrt(p[2].length)), u[0] = p[0] - h, u[1] = p[0] + h, u;
            }, tci: function() {
              var h, p = D.call(arguments), u = new Array(2);
              return h = p.length === 4 ? b.abs(o.studentt.inv(p[1] / 2, p[3] - 1) * p[2] / b.sqrt(p[3])) : b.abs(o.studentt.inv(p[1] / 2, p[2].length - 1) * o.stdev(p[2], !0) / b.sqrt(p[2].length)), u[0] = p[0] - h, u[1] = p[0] + h, u;
            }, significant: function(h, p) {
              return h < p;
            } }), o.extend(o.fn, { normalci: function(h, p) {
              return o.normalci(h, p, this.toArray());
            }, tci: function(h, p) {
              return o.tci(h, p, this.toArray());
            } }), o.extend(o.fn, { oneSidedDifferenceOfProportions: function(h, p, u, v) {
              var A = a(h, p, u, v);
              return o.ztest(A, 1);
            }, twoSidedDifferenceOfProportions: function(h, p, u, v) {
              var A = a(h, p, u, v);
              return o.ztest(A, 2);
            } });
          })(g, Math), g.models = /* @__PURE__ */ (function() {
            function o(D, _) {
              var l = D.length, a = _[0].length - 1, h = l - a - 1, p = g.lstsq(_, D), u = g.multiply(_, p.map((function(I) {
                return [I];
              }))).map((function(I) {
                return I[0];
              })), v = g.subtract(D, u), A = g.mean(D), M = g.sum(u.map((function(I) {
                return Math.pow(I - A, 2);
              }))), N = g.sum(D.map((function(I, O) {
                return Math.pow(I - u[O], 2);
              }))), T = M + N;
              return { exog: _, endog: D, nobs: l, df_model: a, df_resid: h, coef: p, predict: u, resid: v, ybar: A, SST: T, SSE: M, SSR: N, R2: M / T };
            }
            function b(D) {
              var _, l, a = (_ = D.exog, l = _[0].length, g.arange(l).map((function(N) {
                var T = g.arange(l).filter((function(I) {
                  return I !== N;
                }));
                return o(g.col(_, N).map((function(I) {
                  return I[0];
                })), g.col(_, T));
              }))), h = Math.sqrt(D.SSR / D.df_resid), p = a.map((function(N) {
                var T = N.SST, I = N.R2;
                return h / Math.sqrt(T * (1 - I));
              })), u = D.coef.map((function(N, T) {
                return (N - 0) / p[T];
              })), v = u.map((function(N) {
                var T = g.studentt.cdf(N, D.df_resid);
                return 2 * (T > 0.5 ? 1 - T : T);
              })), A = g.studentt.inv(0.975, D.df_resid), M = D.coef.map((function(N, T) {
                var I = A * p[T];
                return [N - I, N + I];
              }));
              return { se: p, t: u, p: v, sigmaHat: h, interval95: M };
            }
            return { ols: function(D, _) {
              var l = o(D, _), a = b(l), h = (function(u) {
                var v, A, M, N = u.R2 / u.df_model / ((1 - u.R2) / u.df_resid);
                return { F_statistic: N, pvalue: 1 - (v = N, A = u.df_model, M = u.df_resid, g.beta.cdf(v / (M / A + v), A / 2, M / 2)) };
              })(l), p = 1 - (1 - l.R2) * ((l.nobs - 1) / l.df_resid);
              return l.t = a, l.f = h, l.adjust_R2 = p, l;
            } };
          })(), g.extend({ buildxmatrix: function() {
            for (var o = new Array(arguments.length), b = 0; b < arguments.length; b++)
              o[b] = [1].concat(arguments[b]);
            return g(o);
          }, builddxmatrix: function() {
            for (var o = new Array(arguments[0].length), b = 0; b < arguments[0].length; b++)
              o[b] = [1].concat(arguments[0][b]);
            return g(o);
          }, buildjxmatrix: function(o) {
            for (var b = new Array(o.length), D = 0; D < o.length; D++) b[D] = o[D];
            return g.builddxmatrix(b);
          }, buildymatrix: function(o) {
            return g(o).transpose();
          }, buildjymatrix: function(o) {
            return o.transpose();
          }, matrixmult: function(o, b) {
            var D, _, l, a, h;
            if (o.cols() == b.rows()) {
              if (b.rows() > 1) {
                for (a = [], D = 0; D < o.rows(); D++) for (a[D] = [], _ = 0; _ < b.cols(); _++) {
                  for (h = 0, l = 0; l < o.cols(); l++) h += o.toArray()[D][l] * b.toArray()[l][_];
                  a[D][_] = h;
                }
                return g(a);
              }
              for (a = [], D = 0; D < o.rows(); D++) for (a[D] = [], _ = 0; _ < b.cols(); _++) {
                for (h = 0, l = 0; l < o.cols(); l++) h += o.toArray()[D][l] * b.toArray()[_];
                a[D][_] = h;
              }
              return g(a);
            }
          }, regress: function(o, b) {
            var D = g.xtranspxinv(o), _ = o.transpose(), l = g.matrixmult(g(D), _);
            return g.matrixmult(l, b);
          }, regresst: function(o, b, D) {
            var _ = g.regress(o, b), l = { anova: {} }, a = g.jMatYBar(o, _);
            l.yBar = a;
            var h = b.mean();
            l.anova.residuals = g.residuals(b, a), l.anova.ssr = g.ssr(a, h), l.anova.msr = l.anova.ssr / (o[0].length - 1), l.anova.sse = g.sse(b, a), l.anova.mse = l.anova.sse / (b.length - (o[0].length - 1) - 1), l.anova.sst = g.sst(b, h), l.anova.mst = l.anova.sst / (b.length - 1), l.anova.r2 = 1 - l.anova.sse / l.anova.sst, l.anova.r2 < 0 && (l.anova.r2 = 0), l.anova.fratio = l.anova.msr / l.anova.mse, l.anova.pvalue = g.anovaftest(l.anova.fratio, o[0].length - 1, b.length - (o[0].length - 1) - 1), l.anova.rmse = Math.sqrt(l.anova.mse), l.anova.r2adj = 1 - l.anova.mse / l.anova.mst, l.anova.r2adj < 0 && (l.anova.r2adj = 0), l.stats = new Array(o[0].length);
            for (var p, u, v, A = g.xtranspxinv(o), M = 0; M < _.length; M++) p = Math.sqrt(l.anova.mse * Math.abs(A[M][M])), u = Math.abs(_[M] / p), v = g.ttest(u, b.length - o[0].length - 1, D), l.stats[M] = [_[M], p, u, v];
            return l.regress = _, l;
          }, xtranspx: function(o) {
            return g.matrixmult(o.transpose(), o);
          }, xtranspxinv: function(o) {
            var b = g.matrixmult(o.transpose(), o);
            return g.inv(b);
          }, jMatYBar: function(o, b) {
            var D = g.matrixmult(o, b);
            return new g(D);
          }, residuals: function(o, b) {
            return g.matrixsubtract(o, b);
          }, ssr: function(o, b) {
            for (var D = 0, _ = 0; _ < o.length; _++) D += Math.pow(o[_] - b, 2);
            return D;
          }, sse: function(o, b) {
            for (var D = 0, _ = 0; _ < o.length; _++) D += Math.pow(o[_] - b[_], 2);
            return D;
          }, sst: function(o, b) {
            for (var D = 0, _ = 0; _ < o.length; _++) D += Math.pow(o[_] - b, 2);
            return D;
          }, matrixsubtract: function(o, b) {
            for (var D = new Array(o.length), _ = 0; _ < o.length; _++) {
              D[_] = new Array(o[_].length);
              for (var l = 0; l < o[_].length; l++) D[_][l] = o[_][l] - b[_][l];
            }
            return g(D);
          } }), g.jStat = g, g);
        }, 960: function(B, g, o) {
          const b = o(592);
          B.exports = (function(D) {
            function _(M, N) {
              const T = N.split(".");
              let I = M;
              for (const O of T) {
                if (I == null) return;
                I = I[O];
              }
              return I;
            }
            for (let M = 0; M < Object.keys(b).length; M++) {
              let N, T = Object.keys(b)[M], I = [];
              if (typeof b[T] == "object") {
                I = Object.keys(b[T]), N = Object.values(b[T]);
                for (let O = 0; O < N.length; O++) if (typeof N[O] == "object") {
                  let Y = I[O];
                  b[T][Y] && (I = [...I, ...Object.keys(b[T][Y]).map(((U) => Y + "." + U))], I.splice(I.indexOf(Y), 1));
                }
              }
              if (I.length < 1) D[T] = b[T];
              else for (let O = 0; O < I.length; O++) typeof _(b[T], I[O]) == "function" && (D[T] = _(b[T], I[O]));
            }
            let l = function(M) {
              return typeof M == "number" && (M = parseInt(M)), M;
            }, a = null, h = null, p = null;
            D.TABLE = function() {
              return p;
            }, D.COLUMN = D.COL = function() {
              return p.tracking && p.tracking.push(A.getColumnNameFromCoords(l(a), l(h))), l(a) + 1;
            }, D.ROW = function() {
              return p.tracking && p.tracking.push(A.getColumnNameFromCoords(l(a), l(h))), l(h) + 1;
            }, D.CELL = function() {
              return A.getColumnNameFromCoords(a, h);
            }, D.VALUE = function(M, N, T) {
              return p.getValueFromCoords(l(M) - 1, l(N) - 1, T);
            }, D.THISROWCELL = function(M) {
              return p.getValueFromCoords(l(M) - 1, l(h));
            };
            const u = function(M, N) {
              for (let T = 0; T < M.length; T++) {
                let I = A.getTokensFromRange(M[T]);
                N = N.replace(M[T], "[" + I.join(",") + "]");
              }
              return N;
            }, v = function(M) {
              return typeof M == "string" && (M = M.trim()), !isNaN(M) && M !== null && M !== "";
            }, A = function(M, N, T, I, O) {
              p = O, a = T, h = I;
              let Y = "", U = {};
              if (N) if (N.size) {
                let G, ie = null;
                N.forEach((function(ge, de) {
                  G = de.replace(/!/g, "."), G.indexOf(".") !== -1 && (G = G.split("."), U[G[0]] = !0);
                })), G = Object.keys(U);
                for (let ge = 0; ge < G.length; ge++) Y += "var " + G[ge] + " = {};";
                N.forEach((function(ge, de) {
                  G = de.replace(/!/g, "."), ge === null || v(ge) || (ie = ge.match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g), ie && ie.length && (ge = updateRanges(ie, ge))), G.indexOf(".") > 0 ? Y += G + " = " + N.get(de) + `;
` : Y += "var " + G + " = " + ge + `;
`;
                }));
              } else {
                let G = Object.keys(N);
                if (G.length) {
                  let ie, ge = {};
                  for (let de = 0; de < G.length; de++) if (ie = G[de].replace(/\!/g, "."), ie.indexOf(".") > 0) {
                    let oe = oe.split(".");
                    ge[oe[0]] = {};
                  }
                  ie = Object.keys(ge);
                  for (let de = 0; de < ie.length; de++) Y += "var " + ie[de] + " = {};";
                  for (let de = 0; de < G.length; de++) {
                    if (ie = G[de].replace(/!/g, "."), N[G[de]] !== null && !v(N[G[de]])) {
                      let oe = N[G[de]].match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g);
                      oe && oe.length && (N[G[de]] = u(oe, N[G[de]]));
                    }
                    ie.indexOf(".") > 0 ? Y += ie + " = " + N[G[de]] + `;
` : Y += "var " + ie + " = " + N[G[de]] + `;
`;
                  }
                }
              }
              let ue = (M = (function(G, ie) {
                let ge = "", de = 0, oe = ["=", "!", ">", "<"];
                for (let xe = 0; xe < G.length; xe++) G[xe] === '"' && (de = de === 0 ? 1 : 0), de === 1 ? ge += G[xe] : (ge += G[xe].toUpperCase(), xe > 0 && G[xe] === "=" && oe.indexOf(G[xe - 1]) === -1 && oe.indexOf(G[xe + 1]) === -1 && (ge += "="));
                return ge = ge.replace(/\^/g, "**"), ge = ge.replace(/<>/g, "!="), ge = ge.replace(/&/g, "+"), ge = ge.replace(/\$/g, ""), ge;
              })(M = (M = M.replace(/\$/g, "")).replace(/!/g, "."))).match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g);
              ue && ue.length && (M = u(ue, M));
              let be = new Function(Y + "; return " + M)();
              return be === null && (be = 0), be;
            };
            return A.getColumnNameFromCoords = function(M, N) {
              return T = parseInt(M), I = "", T > 701 ? (I += String.fromCharCode(64 + parseInt(T / 676)), I += String.fromCharCode(64 + parseInt(T % 676 / 26))) : T > 25 && (I += String.fromCharCode(64 + parseInt(T / 26))), I + String.fromCharCode(65 + T % 26) + (parseInt(N) + 1);
              var T, I;
            }, A.getCoordsFromColumnName = function(M) {
              var N = /^[a-zA-Z]+/.exec(M);
              if (N) {
                for (var T = 0, I = 0; I < N[0].length; I++) T += parseInt(N[0].charCodeAt(I) - 64) * Math.pow(26, N[0].length - 1 - I);
                --T < 0 && (T = 0);
                var O = parseInt(/[0-9]+$/.exec(M)) || null;
                return O > 0 && O--, [T, O];
              }
            }, A.getRangeFromTokens = function(M) {
              M = M.filter((function(O) {
                return O != "#REF!";
              }));
              for (var N = "", T = "", I = 0; I < M.length; I++) M[I].indexOf(".") >= 0 ? N = "." : M[I].indexOf("!") >= 0 && (N = "!"), N && (T = M[I].split(N), M[I] = T[1], T = T[0] + N);
              return M.sort((function(O, Y) {
                var U = Helpers.getCoordsFromColumnName(O), ue = Helpers.getCoordsFromColumnName(Y);
                return U[1] > ue[1] ? 1 : U[1] < ue[1] ? -1 : U[0] > ue[0] ? 1 : U[0] < ue[0] ? -1 : 0;
              })), M.length ? T + (M[0] + ":") + M[M.length - 1] : "#REF!";
            }, A.getTokensFromRange = function(M) {
              if (M.indexOf(".") > 0) {
                var N = M.split(".");
                M = N[1], N = N[0] + ".";
              } else M.indexOf("!") > 0 ? (N = M.split("!"), M = N[1], N = N[0] + "!") : N = "";
              M = M.split(":");
              var T = A.getCoordsFromColumnName(M[0]), I = A.getCoordsFromColumnName(M[1]);
              if (T[0] <= I[0]) var O = T[0], Y = I[0];
              else O = I[0], Y = T[0];
              if (T[1] === null && I[1] == null) for (var U = null, ue = null, be = Object.keys(vars), G = 0; G < be.length; G++) {
                var ie = A.getCoordsFromColumnName(be[G]);
                ie[0] === T[0] && (U === null || ie[1] < U) && (U = ie[1]), ie[0] === I[0] && (ue === null || ie[1] > ue) && (ue = ie[1]);
              }
              else T[1] <= I[1] ? (U = T[1], ue = I[1]) : (U = I[1], ue = T[1]);
              for (var ge = [], de = U; de <= ue; de++) {
                var oe = [];
                for (G = O; G <= Y; G++) oe.push(N + A.getColumnNameFromCoords(G, de));
                ge.push(oe);
              }
              return ge;
            }, A.setFormula = function(M) {
              let N = Object.keys(M);
              for (let T = 0; T < N.length; T++) typeof M[N[T]] == "function" && (D[N[T]] = M[N[T]]);
            }, A.basic = !0, A;
          })(typeof window > "u" ? o.g : window);
        }, 592: function(B, g, o) {
          var b = o(162), D = o(765);
          const _ = new Error("#NULL!"), l = new Error("#DIV/0!"), a = new Error("#VALUE!"), h = new Error("#REF!"), p = new Error("#NAME?"), u = new Error("#NUM!"), v = new Error("#N/A"), A = new Error("#ERROR!"), M = new Error("#GETTING_DATA");
          var N = Object.freeze({ __proto__: null, data: M, div0: l, error: A, na: v, name: p, nil: _, num: u, ref: h, value: a });
          function T(e) {
            const t = [];
            return I(e, ((c) => {
              t.push(c);
            })), t;
          }
          function I(e, t) {
            let c = -1;
            const w = e.length;
            for (; ++c < w && t(e[c], c, e) !== !1; ) ;
            return e;
          }
          function O(e) {
            let t, c = e.length;
            for (; c--; ) if (t = e[c], typeof t != "number") if (t !== !0) if (t !== !1) {
              if (typeof t == "string") {
                const w = W(t);
                e[c] = w instanceof Error ? 0 : w;
              }
            } else e[c] = 0;
            else e[c] = 1;
            return e;
          }
          function Y(e, t) {
            if (!e) return a;
            e.every(((R) => Array.isArray(R))) && e.length !== 0 || (e = [[...e]]), e.map(((R, V) => {
              R.map(((K, ae) => {
                K || (e[V][ae] = 0);
              }));
            }));
            const c = e.reduce(((R, V, K) => V.length > e[R].length ? K : R), 0), w = e[c].length;
            return e.map(((R) => [...R, ...Array(w - R.length).fill(0)]));
          }
          function U() {
            let e;
            if (arguments.length === 1) {
              const c = arguments[0];
              e = (t = c) != null && typeof t.length == "number" && typeof t != "string" ? T.apply(null, arguments) : [c];
            } else e = Array.from(arguments);
            for (var t; !be(e); ) e = ue(e);
            return e;
          }
          function ue(e) {
            return e && e.reduce ? e.reduce(((t, c) => {
              const w = Array.isArray(t), R = Array.isArray(c);
              return w && R ? t.concat(c) : w ? (t.push(c), t) : R ? [t].concat(c) : [t, c];
            })) : [e];
          }
          function be(e) {
            if (!e) return !1;
            for (let t = 0; t < e.length; ++t) if (Array.isArray(e[t])) return !1;
            return !0;
          }
          function G(e, t) {
            return t = t || 1, e && typeof e.slice == "function" ? e.slice(t) : e;
          }
          function ie(e) {
            return e ? e[0].map(((t, c) => e.map(((w) => w[c])))) : a;
          }
          function ge(e, t) {
            let c = null;
            return I(e, ((w, R) => {
              if (w[0] === t) return c = R, !1;
            })), c ?? a;
          }
          function de() {
            for (let e = 0; e < arguments.length; e++) if (arguments[e] instanceof Error) return arguments[e];
          }
          function oe() {
            let e = arguments.length;
            for (; e--; ) if (arguments[e] instanceof Error) return !0;
            return !1;
          }
          function xe(e) {
            return Math.round(e * 1e14) / 1e14;
          }
          function Oe() {
            return U.apply(null, arguments).filter(((e) => typeof e == "number"));
          }
          function Be(e) {
            if (typeof e == "boolean" || e instanceof Error) return e;
            if (typeof e == "number") return e !== 0;
            if (typeof e == "string") {
              const t = e.toUpperCase();
              if (t === "TRUE") return !0;
              if (t === "FALSE") return !1;
            }
            return e instanceof Date && !isNaN(e) || a;
          }
          function Re(e) {
            if (!isNaN(e)) {
              if (e instanceof Date) return new Date(e);
              const t = parseFloat(e);
              return t < 0 || t >= 2958466 ? u : (function(c) {
                c < 60 && (c += 1);
                const w = Math.floor(c - 25569), R = new Date(86400 * w * 1e3), V = c - Math.floor(c) + 1e-7;
                let K = Math.floor(86400 * V);
                const ae = K % 60;
                K -= ae;
                const ye = Math.floor(K / 3600), _e = Math.floor(K / 60) % 60;
                let Ne = R.getUTCDate(), Ue = R.getUTCMonth();
                return c >= 60 && c < 61 && (Ne = 29, Ue = 1), new Date(R.getUTCFullYear(), Ue, Ne, ye, _e, ae);
              })(t);
            }
            return typeof e != "string" || (e = /(\d{4})-(\d\d?)-(\d\d?)$/.test(e) ? /* @__PURE__ */ new Date(e + "T00:00:00.000") : new Date(e), isNaN(e)) ? a : e;
          }
          function $e(e) {
            let t, c = e.length;
            for (; c--; ) {
              if (t = Re(e[c]), t === a) return t;
              e[c] = t;
            }
            return e;
          }
          function W(e) {
            return e instanceof Error ? e : e == null ? 0 : (typeof e == "boolean" && (e = +e), isNaN(e) || e === "" ? a : parseFloat(e));
          }
          function Ie(e) {
            let t, c;
            if (!e || (t = e.length) === 0) return a;
            for (; t--; ) {
              if (e[t] instanceof Error) return e[t];
              if (c = W(e[t]), c instanceof Error) return c;
              e[t] = c;
            }
            return e;
          }
          function Ve(e) {
            return e instanceof Error ? e : e == null ? "" : e.toString();
          }
          function st() {
            let e = arguments.length;
            for (; e--; ) if (typeof arguments[e] == "string") return !0;
            return !1;
          }
          function Se(e) {
            return e != null;
          }
          const Ce = "=", Me = [">", ">=", "<", "<=", "=", "<>"], Pe = "operator", He = "literal", Ye = [Pe, He], et = Pe, tt = He;
          function at(e, t) {
            if (Ye.indexOf(t) === -1) throw new Error("Unsupported token type: " + t);
            return { value: e, type: t };
          }
          function ft(e) {
            return (function(t) {
              let c = "";
              const w = [];
              for (let R = 0; R < t.length; R++) {
                const V = t[R];
                R === 0 && Me.indexOf(V) >= 0 ? w.push(at(V, et)) : c += V;
              }
              return c.length > 0 && w.push(at((function(R) {
                return typeof R != "string" || /^\d+(\.\d+)?$/.test(R) && (R = R.indexOf(".") === -1 ? parseInt(R, 10) : parseFloat(R)), R;
              })(c), tt)), w.length > 0 && w[0].type !== et && w.unshift(at(Ce, et)), w;
            })((function(t) {
              const c = t.length, w = [];
              let R = 0, V = "", K = "";
              for (; R < c; ) {
                const ae = t.charAt(R);
                switch (ae) {
                  case ">":
                  case "<":
                  case "=":
                    K += ae, V.length > 0 && (w.push(V), V = "");
                    break;
                  default:
                    K.length > 0 && (w.push(K), K = ""), V += ae;
                }
                R++;
              }
              return V.length > 0 && w.push(V), K.length > 0 && w.push(K), w;
            })(e));
          }
          const pt = function(e) {
            const t = [];
            let c;
            for (let w = 0; w < e.length; w++) {
              const R = e[w];
              switch (R.type) {
                case et:
                  c = R.value;
                  break;
                case tt:
                  t.push(R.value);
              }
            }
            return (function(w, R) {
              let V = !1;
              switch (R) {
                case ">":
                  V = w[0] > w[1];
                  break;
                case ">=":
                  V = w[0] >= w[1];
                  break;
                case "<":
                  V = w[0] < w[1];
                  break;
                case "<=":
                  V = w[0] <= w[1];
                  break;
                case "=":
                  V = w[0] == w[1];
                  break;
                case "<>":
                  V = w[0] != w[1];
              }
              return V;
            })(t, c);
          }, Ot = {};
          function Bt(e) {
            return [a, h, l, u, p, _].indexOf(e) >= 0 || typeof e == "number" && (isNaN(e) || !isFinite(e));
          }
          function _t(e) {
            return Bt(e) || e === v;
          }
          function Pt(e) {
            return e === !0 || e === !1;
          }
          function Et(e) {
            return typeof e == "number" && !isNaN(e) && isFinite(e);
          }
          function Ft(e) {
            return typeof e == "string";
          }
          function Mt() {
            const e = [];
            for (let t = 0; t < arguments.length; ++t) {
              let c = !1;
              const w = arguments[t];
              for (let R = 0; R < e.length && (c = e[R] === w, !c); ++R) ;
              c || e.push(w);
            }
            return e;
          }
          function Lt(e, t, c, w) {
            if (!t || !c) return v;
            w = !(w === 0 || w === !1);
            let R = v;
            const V = typeof e == "number";
            let K = !1;
            for (let ae = 0; ae < t.length; ae++) {
              const ye = t[ae];
              if (ye[0] === e) {
                R = c < ye.length + 1 ? ye[c - 1] : h;
                break;
              }
              !K && (V && w && ye[0] <= e || w && typeof ye[0] == "string" && ye[0].localeCompare(e) < 0) && (R = c < ye.length + 1 ? ye[c - 1] : h), V && ye[0] > e && (K = !0);
            }
            return R;
          }
          function kt() {
            const e = U(arguments).filter(Se);
            if (e.length === 0) return l;
            const t = de.apply(void 0, e);
            if (t) return t;
            const c = Oe(e), w = c.length;
            let R, V = 0, K = 0;
            for (let ae = 0; ae < w; ae++) V += c[ae], K += 1;
            return R = V / K, isNaN(R) && (R = u), R;
          }
          function Rt() {
            const e = U(arguments).filter(Se);
            if (e.length === 0) return l;
            const t = de.apply(void 0, e);
            if (t) return t;
            const c = e, w = c.length;
            let R, V = 0, K = 0;
            for (let ae = 0; ae < w; ae++) {
              const ye = c[ae];
              typeof ye == "number" && (V += ye), ye === !0 && V++, ye !== null && K++;
            }
            return R = V / K, isNaN(R) && (R = u), R;
          }
          Ot.TYPE = (e) => {
            switch (e) {
              case _:
                return 1;
              case l:
                return 2;
              case a:
                return 3;
              case h:
                return 4;
              case p:
                return 5;
              case u:
                return 6;
              case v:
                return 7;
              case M:
                return 8;
            }
            return v;
          };
          const ut = { DIST: function(e, t, c, w, R, V) {
            return arguments.length < 4 ? a : (R = R === void 0 ? 0 : R, V = V === void 0 ? 1 : V, oe(e = W(e), t = W(t), c = W(c), R = W(R), V = W(V)) ? a : (e = (e - R) / (V - R), w ? b.beta.cdf(e, t, c) : b.beta.pdf(e, t, c)));
          }, INV: (e, t, c, w, R) => (w = w === void 0 ? 0 : w, R = R === void 0 ? 1 : R, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R)) ? a : b.beta.inv(e, t, c) * (R - w) + w) }, St = { DIST: (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c), w = W(w)) ? a : w ? b.binomial.cdf(e, t, c) : b.binomial.pdf(e, t, c) };
          St.DIST.RANGE = (e, t, c, w) => {
            if (w = w === void 0 ? c : w, oe(e = W(e), t = W(t), c = W(c), w = W(w))) return a;
            let R = 0;
            for (let V = c; V <= w; V++) R += ze(e, V) * Math.pow(t, V) * Math.pow(1 - t, e - V);
            return R;
          }, St.INV = (e, t, c) => {
            if (oe(e = W(e), t = W(t), c = W(c))) return a;
            let w = 0;
            for (; w <= e; ) {
              if (b.binomial.cdf(w, e, t) >= c) return w;
              w++;
            }
          };
          const gt = { DIST: (e, t, c) => oe(e = W(e), t = W(t)) ? a : c ? b.chisquare.cdf(e, t) : b.chisquare.pdf(e, t) };
          gt.DIST.RT = (e, t) => !e | !t ? v : e < 1 || t > Math.pow(10, 10) ? u : typeof e != "number" || typeof t != "number" ? a : 1 - b.chisquare.cdf(e, t), gt.INV = (e, t) => oe(e = W(e), t = W(t)) ? a : b.chisquare.inv(e, t), gt.INV.RT = (e, t) => !e | !t ? v : e < 0 || e > 1 || t < 1 || t > Math.pow(10, 10) ? u : typeof e != "number" || typeof t != "number" ? a : b.chisquare.inv(1 - e, t), gt.TEST = function(e, t) {
            if (arguments.length !== 2) return v;
            if (!(e instanceof Array && t instanceof Array) || e.length !== t.length || e[0] && t[0] && e[0].length !== t[0].length) return a;
            const c = e.length;
            let w, R, V;
            for (R = 0; R < c; R++) e[R] instanceof Array || (w = e[R], e[R] = [], e[R].push(w)), t[R] instanceof Array || (w = t[R], t[R] = [], t[R].push(w));
            const K = e[0].length, ae = K === 1 ? c - 1 : (c - 1) * (K - 1);
            let ye = 0;
            const _e = Math.PI;
            for (R = 0; R < c; R++) for (V = 0; V < K; V++) ye += Math.pow(e[R][V] - t[R][V], 2) / t[R][V];
            return Math.round(1e6 * (function(Ne, Ue) {
              let Fe = Math.exp(-0.5 * Ne);
              Ue % 2 == 1 && (Fe *= Math.sqrt(2 * Ne / _e));
              let Ge = Ue;
              for (; Ge >= 2; ) Fe = Fe * Ne / Ge, Ge -= 2;
              let Qe = Fe, rt = Ue;
              for (; Qe > 1e-10 * Fe; ) rt += 2, Qe = Qe * Ne / rt, Fe += Qe;
              return 1 - Fe;
            })(ye, ae)) / 1e6;
          };
          const E = {};
          function S() {
            return Oe(U(arguments)).length;
          }
          function f() {
            const e = U(arguments);
            return e.length - r(e);
          }
          function r() {
            const e = U(arguments);
            let t, c = 0;
            for (let w = 0; w < e.length; w++) t = e[w], t != null && t !== "" || c++;
            return c;
          }
          E.NORM = (e, t, c) => oe(e = W(e), t = W(t), c = W(c)) ? a : b.normalci(1, e, t, c)[1] - 1, E.T = (e, t, c) => oe(e = W(e), t = W(t), c = W(c)) ? a : b.tci(1, e, t, c)[1] - 1;
          const H = { P: (e, t) => {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = b.mean(e), w = b.mean(t);
            let R = 0;
            const V = e.length;
            for (let K = 0; K < V; K++) R += (e[K] - c) * (t[K] - w);
            return R / V;
          }, S: (e, t) => oe(e = Ie(U(e)), t = Ie(U(t))) ? a : b.covariance(e, t) }, re = { DIST: (e, t, c) => oe(e = W(e), t = W(t)) ? a : c ? b.exponential.cdf(e, t) : b.exponential.pdf(e, t) }, te = {};
          function P(e, t, c) {
            if (oe(e = W(e), t = Ie(U(t)), c = Ie(U(c)))) return a;
            const w = b.mean(c), R = b.mean(t), V = c.length;
            let K = 0, ae = 0;
            for (let _e = 0; _e < V; _e++) K += (c[_e] - w) * (t[_e] - R), ae += Math.pow(c[_e] - w, 2);
            const ye = K / ae;
            return R - ye * w + ye * e;
          }
          function L(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 || parseInt(e, 10) === e && e < 0 ? u : b.gammafn(e);
          }
          function q(e) {
            return (e = W(e)) instanceof Error ? e : b.gammaln(e);
          }
          te.DIST = (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c)) ? a : w ? b.centralF.cdf(e, t, c) : b.centralF.pdf(e, t, c), te.DIST.RT = function(e, t, c) {
            return arguments.length !== 3 ? v : e < 0 || t < 1 || c < 1 ? u : typeof e != "number" || typeof t != "number" || typeof c != "number" ? a : 1 - b.centralF.cdf(e, t, c);
          }, te.INV = (e, t, c) => oe(e = W(e), t = W(t), c = W(c)) ? a : e <= 0 || e > 1 ? u : b.centralF.inv(e, t, c), te.INV.RT = function(e, t, c) {
            return arguments.length !== 3 ? v : e < 0 || e > 1 || t < 1 || t > Math.pow(10, 10) || c < 1 || c > Math.pow(10, 10) ? u : typeof e != "number" || typeof t != "number" || typeof c != "number" ? a : b.centralF.inv(1 - e, t, c);
          }, te.TEST = (e, t) => {
            if (!e || !t || !(e instanceof Array && t instanceof Array)) return v;
            if (e.length < 2 || t.length < 2) return l;
            const c = (V, K) => {
              let ae = 0;
              for (let ye = 0; ye < V.length; ye++) ae += Math.pow(V[ye] - K, 2);
              return ae;
            }, w = vt(e) / e.length, R = vt(t) / t.length;
            return c(e, w) / (e.length - 1) / (c(t, R) / (t.length - 1));
          }, L.DIST = function(e, t, c, w) {
            return arguments.length !== 4 ? v : e < 0 || t <= 0 || c <= 0 || typeof e != "number" || typeof t != "number" || typeof c != "number" ? a : w ? b.gamma.cdf(e, t, c, !0) : b.gamma.pdf(e, t, c, !1);
          }, L.INV = function(e, t, c) {
            return arguments.length !== 3 ? v : e < 0 || e > 1 || t <= 0 || c <= 0 ? u : typeof e != "number" || typeof t != "number" || typeof c != "number" ? a : b.gamma.inv(e, t, c);
          }, q.PRECISE = function(e) {
            return arguments.length !== 1 ? v : e <= 0 ? u : typeof e != "number" ? a : b.gammaln(e);
          };
          const Q = {};
          function le(e, t) {
            return oe(e = Ie(U(e)), t = W(t)) ? e : t < 0 || e.length < t ? a : e.sort(((c, w) => w - c))[t - 1];
          }
          function he(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = b.mean(e), w = b.mean(t), R = t.length;
            let V = 0, K = 0;
            for (let ye = 0; ye < R; ye++) V += (t[ye] - w) * (e[ye] - c), K += Math.pow(t[ye] - w, 2);
            const ae = V / K;
            return [ae, c - ae * w];
          }
          Q.DIST = (e, t, c, w, R) => {
            if (oe(e = W(e), t = W(t), c = W(c), w = W(w))) return a;
            function V(K, ae, ye, _e) {
              return ze(ye, K) * ze(_e - ye, ae - K) / ze(_e, ae);
            }
            return R ? (function(K, ae, ye, _e) {
              let Ne = 0;
              for (let Ue = 0; Ue <= K; Ue++) Ne += V(Ue, ae, ye, _e);
              return Ne;
            })(e, t, c, w) : V(e, t, c, w);
          };
          const me = {};
          function we() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            const c = Oe(e);
            return c.length === 0 ? 0 : Math.max.apply(Math, c);
          }
          function Le() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            const c = O(e);
            let w = b.median(c);
            return isNaN(w) && (w = u), w;
          }
          function De() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            const c = Oe(e);
            return c.length === 0 ? 0 : Math.min.apply(Math, c);
          }
          me.DIST = (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c)) ? a : w ? b.lognormal.cdf(e, t, c) : b.lognormal.pdf(e, t, c), me.INV = (e, t, c) => oe(e = W(e), t = W(t), c = W(c)) ? a : b.lognormal.inv(e, t, c);
          const Te = { MULT: function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = e.length, c = {};
            let w, R = [], V = 0;
            for (let K = 0; K < t; K++) w = e[K], c[w] = c[w] ? c[w] + 1 : 1, c[w] > V && (V = c[w], R = []), c[w] === V && (R[R.length] = w);
            return R;
          }, SNGL: function() {
            const e = Ie(U(arguments));
            return e instanceof Error ? e : Te.MULT(e).sort(((t, c) => t - c))[0];
          } }, Xe = { DIST: (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c)) ? a : w ? b.negbin.cdf(e, t, c) : b.negbin.pdf(e, t, c) }, qe = {};
          function se(e, t) {
            if (oe(t = Ie(U(t)), e = Ie(U(e)))) return a;
            const c = b.mean(e), w = b.mean(t), R = e.length;
            let V = 0, K = 0, ae = 0;
            for (let ye = 0; ye < R; ye++) V += (e[ye] - c) * (t[ye] - w), K += Math.pow(e[ye] - c, 2), ae += Math.pow(t[ye] - w, 2);
            return V / Math.sqrt(K * ae);
          }
          qe.DIST = (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c)) ? a : c <= 0 ? u : w ? b.normal.cdf(e, t, c) : b.normal.pdf(e, t, c), qe.INV = (e, t, c) => oe(e = W(e), t = W(t), c = W(c)) ? a : b.normal.inv(e, t, c), qe.S = {}, qe.S.DIST = (e, t) => (e = W(e)) instanceof Error ? a : t ? b.normal.cdf(e, 0, 1) : b.normal.pdf(e, 0, 1), qe.S.INV = (e) => (e = W(e)) instanceof Error ? a : b.normal.inv(e, 0, 1);
          const ve = { EXC: (e, t) => {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            const c = (e = e.sort(((V, K) => V - K))).length;
            if (t < 1 / (c + 1) || t > 1 - 1 / (c + 1)) return u;
            const w = t * (c + 1) - 1, R = Math.floor(w);
            return xe(w === R ? e[w] : e[R] + (w - R) * (e[R + 1] - e[R]));
          }, INC: (e, t) => {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            const c = t * ((e = e.sort(((R, V) => R - V))).length - 1), w = Math.floor(c);
            return xe(c === w ? e[c] : e[w] + (c - w) * (e[w + 1] - e[w]));
          } }, je = { EXC: (e, t, c) => {
            if (c = c === void 0 ? 3 : c, oe(e = Ie(U(e)), t = W(t), c = W(c))) return a;
            e = e.sort(((Ne, Ue) => Ne - Ue));
            const w = Mt.apply(null, e), R = e.length, V = w.length, K = Math.pow(10, c);
            let ae = 0, ye = !1, _e = 0;
            for (; !ye && _e < V; ) t === w[_e] ? (ae = (e.indexOf(w[_e]) + 1) / (R + 1), ye = !0) : t >= w[_e] && (t < w[_e + 1] || _e === V - 1) && (ae = (e.indexOf(w[_e]) + 1 + (t - w[_e]) / (w[_e + 1] - w[_e])) / (R + 1), ye = !0), _e++;
            return Math.floor(ae * K) / K;
          }, INC: (e, t, c) => {
            if (c = c === void 0 ? 3 : c, oe(e = Ie(U(e)), t = W(t), c = W(c))) return a;
            e = e.sort(((Ne, Ue) => Ne - Ue));
            const w = Mt.apply(null, e), R = e.length, V = w.length, K = Math.pow(10, c);
            let ae = 0, ye = !1, _e = 0;
            for (; !ye && _e < V; ) t === w[_e] ? (ae = e.indexOf(w[_e]) / (R - 1), ye = !0) : t >= w[_e] && (t < w[_e + 1] || _e === V - 1) && (ae = (e.indexOf(w[_e]) + (t - w[_e]) / (w[_e + 1] - w[_e])) / (R - 1), ye = !0), _e++;
            return Math.floor(ae * K) / K;
          } }, X = { DIST: (e, t, c) => oe(e = W(e), t = W(t)) ? a : c ? b.poisson.cdf(e, t) : b.poisson.pdf(e, t) }, ee = { EXC: (e, t) => {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            switch (t) {
              case 1:
                return ve.EXC(e, 0.25);
              case 2:
                return ve.EXC(e, 0.5);
              case 3:
                return ve.EXC(e, 0.75);
              default:
                return u;
            }
          }, INC: (e, t) => {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            switch (t) {
              case 1:
                return ve.INC(e, 0.25);
              case 2:
                return ve.INC(e, 0.5);
              case 3:
                return ve.INC(e, 0.75);
              default:
                return u;
            }
          } }, C = {};
          function F() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = b.mean(e), c = e.length;
            let w = 0;
            for (let R = 0; R < c; R++) w += Math.pow(e[R] - t, 3);
            return c * w / ((c - 1) * (c - 2) * Math.pow(b.stdev(e, !0), 3));
          }
          function Z(e, t) {
            return oe(e = Ie(U(e)), t = W(t)) ? e : e.sort(((c, w) => c - w))[t - 1];
          }
          C.AVG = (e, t, c) => {
            if (oe(e = W(e), t = Ie(U(t)))) return a;
            const w = (c = c || !1) ? (K, ae) => K - ae : (K, ae) => ae - K, R = (t = (t = U(t)).sort(w)).length;
            let V = 0;
            for (let K = 0; K < R; K++) t[K] === e && V++;
            return V > 1 ? (2 * t.indexOf(e) + V + 1) / 2 : t.indexOf(e) + 1;
          }, C.EQ = (e, t, c) => {
            if (oe(e = W(e), t = Ie(U(t)))) return a;
            const w = (c = c || !1) ? (R, V) => R - V : (R, V) => V - R;
            return (t = t.sort(w)).indexOf(e) + 1;
          }, F.P = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = b.mean(e), c = e.length;
            let w = 0, R = 0;
            for (let V = 0; V < c; V++) R += Math.pow(e[V] - t, 3), w += Math.pow(e[V] - t, 2);
            return R /= c, w /= c, R / Math.pow(w, 1.5);
          };
          const fe = { P: function() {
            const e = pe.P.apply(this, arguments);
            let t = Math.sqrt(e);
            return isNaN(t) && (t = u), t;
          }, S: function() {
            const e = pe.S.apply(this, arguments);
            return Math.sqrt(e);
          } }, J = { DIST: (e, t, c) => c !== 1 && c !== 2 ? u : c === 1 ? J.DIST.RT(e, t) : J.DIST["2T"](e, t) };
          J.DIST["2T"] = function(e, t) {
            return arguments.length !== 2 ? v : e < 0 || t < 1 ? u : typeof e != "number" || typeof t != "number" ? a : 2 * (1 - b.studentt.cdf(e, t));
          }, J.DIST.RT = function(e, t) {
            return arguments.length !== 2 ? v : e < 0 || t < 1 ? u : typeof e != "number" || typeof t != "number" ? a : 1 - b.studentt.cdf(e, t);
          }, J.INV = (e, t) => oe(e = W(e), t = W(t)) ? a : b.studentt.inv(e, t), J.INV["2T"] = (e, t) => (e = W(e), t = W(t), e <= 0 || e > 1 || t < 1 ? u : oe(e, t) ? a : Math.abs(b.studentt.inv(e / 2, t))), J.TEST = (e, t) => {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = b.mean(e), w = b.mean(t);
            let R, V = 0, K = 0;
            for (R = 0; R < e.length; R++) V += Math.pow(e[R] - c, 2);
            for (R = 0; R < t.length; R++) K += Math.pow(t[R] - w, 2);
            V /= e.length - 1, K /= t.length - 1;
            const ae = Math.abs(c - w) / Math.sqrt(V / e.length + K / t.length);
            return J.DIST["2T"](ae, e.length + t.length - 2);
          };
          const pe = {};
          function Ee() {
            const e = U(arguments), t = e.length;
            let c = 0, w = 0;
            const R = Rt(e);
            for (let V = 0; V < t; V++) {
              const K = e[V];
              c += Math.pow(typeof K == "number" ? K - R : K === !0 ? 1 - R : 0 - R, 2), K !== null && w++;
            }
            return c / (w - 1);
          }
          function ne() {
            const e = U(arguments), t = e.length;
            let c = 0, w = 0;
            const R = Rt(e);
            let V;
            for (let K = 0; K < t; K++) {
              const ae = e[K];
              c += Math.pow(typeof ae == "number" ? ae - R : ae === !0 ? 1 - R : 0 - R, 2), ae !== null && w++;
            }
            return V = c / w, isNaN(V) && (V = u), V;
          }
          pe.P = function() {
            const e = Oe(U(arguments)), t = e.length;
            let c = 0;
            const w = kt(e);
            let R;
            for (let V = 0; V < t; V++) c += Math.pow(e[V] - w, 2);
            return R = c / t, isNaN(R) && (R = u), R;
          }, pe.S = function() {
            const e = Oe(U(arguments)), t = e.length;
            let c = 0;
            const w = kt(e);
            for (let R = 0; R < t; R++) c += Math.pow(e[R] - w, 2);
            return c / (t - 1);
          };
          const ce = { DIST: (e, t, c, w) => oe(e = W(e), t = W(t), c = W(c)) ? a : w ? 1 - Math.exp(-Math.pow(e / c, t)) : Math.pow(e, t - 1) * Math.exp(-Math.pow(e / c, t)) * t / Math.pow(c, t) }, ke = {};
          function Ae(e, t, c) {
            const w = de(e = W(e), t = W(t), c = W(c));
            if (w) return w;
            if (t === 0) return 0;
            t = Math.abs(t);
            const R = -Math.floor(Math.log(t) / Math.log(10));
            return e >= 0 ? bt(Math.ceil(e / t) * t, R) : c === 0 ? -bt(Math.floor(Math.abs(e) / t) * t, R) : -bt(Math.ceil(Math.abs(e) / t) * t, R);
          }
          function ze(e, t) {
            return de(e = W(e), t = W(t)) || (e < t ? u : Ze(e) / (Ze(t) * Ze(e - t)));
          }
          ke.TEST = (e, t, c) => {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            c = c || fe.S(e);
            const w = e.length;
            return 1 - qe.S.DIST((kt(e) - t) / (c / Math.sqrt(w)), !0);
          }, Ae.MATH = Ae, Ae.PRECISE = Ae;
          const We = [];
          function Ze(e) {
            if ((e = W(e)) instanceof Error) return e;
            const t = Math.floor(e);
            return t === 0 || t === 1 ? 1 : (We[t] > 0 || (We[t] = Ze(t - 1) * t), We[t]);
          }
          function Ke(e, t) {
            const c = de(e = W(e), t = W(t));
            if (c) return c;
            if (t === 0) return 0;
            if (!(e >= 0 && t > 0 || e <= 0 && t < 0)) return u;
            t = Math.abs(t);
            const w = -Math.floor(Math.log(t) / Math.log(10));
            return e >= 0 ? bt(Math.floor(e / t) * t, w) : -bt(Math.ceil(Math.abs(e) / t), w);
          }
          Ke.MATH = (e, t, c) => {
            if (t instanceof Error) return t;
            t = t === void 0 ? 0 : t;
            const w = de(e = W(e), t = W(t), c = W(c));
            if (w) return w;
            if (t === 0) return 0;
            t = t ? Math.abs(t) : 1;
            const R = -Math.floor(Math.log(t) / Math.log(10));
            return e >= 0 ? bt(Math.floor(e / t) * t, R) : c === 0 || c === void 0 ? -bt(Math.ceil(Math.abs(e) / t) * t, R) : -bt(Math.floor(Math.abs(e) / t) * t, R);
          }, Ke.PRECISE = Ke.MATH;
          const nt = { CEILING: Ae };
          function Dt(e, t) {
            const c = de(e = W(e), t = W(t));
            if (c) return c;
            if (e === 0 && t === 0) return u;
            const w = Math.pow(e, t);
            return isNaN(w) ? u : w;
          }
          function Xt() {
            const e = U(arguments).filter(((w) => w != null));
            if (e.length === 0) return 0;
            const t = Ie(e);
            if (t instanceof Error) return t;
            let c = 1;
            for (let w = 0; w < t.length; w++) c *= t[w];
            return c;
          }
          function bt(e, t) {
            return de(e = W(e), t = W(t)) || +(Math.round(+(e + "e" + t)) + "e" + -1 * t);
          }
          function vt() {
            let e = 0;
            return I(T(arguments), ((t) => {
              if (e instanceof Error) return !1;
              if (t instanceof Error) e = t;
              else if (typeof t == "number") e += t;
              else if (typeof t == "string") {
                const c = parseFloat(t);
                !isNaN(c) && (e += c);
              } else if (Array.isArray(t)) {
                const c = vt.apply(null, t);
                c instanceof Error ? e = c : e += c;
              }
            })), e;
          }
          var yt = Object.freeze({ __proto__: null, ADD: function(e, t) {
            return arguments.length !== 2 ? v : de(e = W(e), t = W(t)) || e + t;
          }, DIVIDE: function(e, t) {
            return arguments.length !== 2 ? v : de(e = W(e), t = W(t)) || (t === 0 ? l : e / t);
          }, EQ: function(e, t) {
            return arguments.length !== 2 ? v : e instanceof Error ? e : t instanceof Error ? t : (e === null && (e = void 0), t === null && (t = void 0), e === t);
          }, GT: function(e, t) {
            return arguments.length !== 2 ? v : e instanceof Error ? e : t instanceof Error ? t : (st(e, t) ? (e = Ve(e), t = Ve(t)) : (e = W(e), t = W(t)), de(e, t) || e > t);
          }, GTE: function(e, t) {
            return arguments.length !== 2 ? v : (st(e, t) ? (e = Ve(e), t = Ve(t)) : (e = W(e), t = W(t)), de(e, t) || e >= t);
          }, LT: function(e, t) {
            return arguments.length !== 2 ? v : (st(e, t) ? (e = Ve(e), t = Ve(t)) : (e = W(e), t = W(t)), de(e, t) || e < t);
          }, LTE: function(e, t) {
            return arguments.length !== 2 ? v : (st(e, t) ? (e = Ve(e), t = Ve(t)) : (e = W(e), t = W(t)), de(e, t) || e <= t);
          }, MINUS: function(e, t) {
            return arguments.length !== 2 ? v : de(e = W(e), t = W(t)) || e - t;
          }, MULTIPLY: function(e, t) {
            return arguments.length !== 2 ? v : de(e = W(e), t = W(t)) || e * t;
          }, NE: function(e, t) {
            return arguments.length !== 2 ? v : e instanceof Error ? e : t instanceof Error ? t : (e === null && (e = void 0), t === null && (t = void 0), e !== t);
          }, POW: function(e, t) {
            return arguments.length !== 2 ? v : Dt(e, t);
          } });
          const lt = new Date(Date.UTC(1900, 0, 1)), Je = [void 0, 0, 1, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, 1, 2, 3, 4, 5, 6, 0], hn = [[], [1, 2, 3, 4, 5, 6, 7], [7, 1, 2, 3, 4, 5, 6], [6, 0, 1, 2, 3, 4, 5], [], [], [], [], [], [], [], [7, 1, 2, 3, 4, 5, 6], [6, 7, 1, 2, 3, 4, 5], [5, 6, 7, 1, 2, 3, 4], [4, 5, 6, 7, 1, 2, 3], [3, 4, 5, 6, 7, 1, 2], [2, 3, 4, 5, 6, 7, 1], [1, 2, 3, 4, 5, 6, 7]], Vt = [[], [6, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], void 0, void 0, void 0, [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]];
          function Tt(e, t, c) {
            c = c.toUpperCase(), e = Re(e), t = Re(t);
            const w = e.getFullYear(), R = e.getMonth(), V = e.getDate(), K = t.getFullYear(), ae = t.getMonth(), ye = t.getDate();
            let _e;
            switch (c) {
              case "Y":
                _e = Math.floor(Kt(e, t));
                break;
              case "D":
                _e = At(t, e);
                break;
              case "M":
                _e = ae - R + 12 * (K - w), ye < V && _e--;
                break;
              case "MD":
                V <= ye ? _e = ye - V : (ae === 0 ? (e.setFullYear(K - 1), e.setMonth(12)) : (e.setFullYear(K), e.setMonth(ae - 1)), _e = At(t, e));
                break;
              case "YM":
                _e = ae - R + 12 * (K - w), ye < V && _e--, _e %= 12;
                break;
              case "YD":
                ae > R || ae === R && ye < V ? e.setFullYear(K) : e.setFullYear(K - 1), _e = At(t, e);
            }
            return _e;
          }
          function Ht(e) {
            const t = new Date(e);
            return t.setHours(0, 0, 0, 0), t;
          }
          function At(e, t) {
            return e = Re(e), t = Re(t), e instanceof Error ? e : t instanceof Error ? t : an(Ht(e)) - an(Ht(t));
          }
          function xt(e, t, c) {
            if (c = Be(c || "false"), e = Re(e), t = Re(t), e instanceof Error) return e;
            if (t instanceof Error) return t;
            if (c instanceof Error) return c;
            const w = e.getMonth();
            let R, V, K = t.getMonth();
            if (c) R = e.getDate() === 31 ? 30 : e.getDate(), V = t.getDate() === 31 ? 30 : t.getDate();
            else {
              const ae = new Date(e.getFullYear(), w + 1, 0).getDate(), ye = new Date(t.getFullYear(), K + 1, 0).getDate();
              R = e.getDate() === ae ? 30 : e.getDate(), t.getDate() === ye ? R < 30 ? (K++, V = 1) : V = 30 : V = t.getDate();
            }
            return 360 * (t.getFullYear() - e.getFullYear()) + 30 * (K - w) + (V - R);
          }
          function on(e) {
            if ((e = Re(e)) instanceof Error) return e;
            (e = Ht(e)).setDate(e.getDate() + 4 - (e.getDay() || 7));
            const t = new Date(e.getFullYear(), 0, 1);
            return Math.ceil(((e - t) / 864e5 + 1) / 7);
          }
          function qt(e, t, c) {
            return qt.INTL(e, t, 1, c);
          }
          function Ut(e, t, c) {
            return Ut.INTL(e, t, 1, c);
          }
          function Gt(e) {
            return new Date(e, 1, 29).getMonth() === 1;
          }
          function Wt(e, t) {
            return Math.ceil((t - e) / 1e3 / 60 / 60 / 24);
          }
          function Kt(e, t, c) {
            if ((e = Re(e)) instanceof Error) return e;
            if ((t = Re(t)) instanceof Error) return t;
            c = c || 0;
            let w = e.getDate();
            const R = e.getMonth() + 1, V = e.getFullYear();
            let K = t.getDate();
            const ae = t.getMonth() + 1, ye = t.getFullYear();
            switch (c) {
              case 0:
                return w === 31 && K === 31 ? (w = 30, K = 30) : w === 31 ? w = 30 : w === 30 && K === 31 && (K = 30), (K + 30 * ae + 360 * ye - (w + 30 * R + 360 * V)) / 360;
              case 1: {
                const _e = (Ge, Qe) => {
                  const rt = Ge.getFullYear(), mt = new Date(rt, 2, 1);
                  if (Gt(rt) && Ge < mt && Qe >= mt) return !0;
                  const ct = Qe.getFullYear(), Ct = new Date(ct, 2, 1);
                  return Gt(ct) && Qe >= Ct && Ge < Ct;
                };
                let Ne = 365;
                if (V === ye || V + 1 === ye && (R > ae || R === ae && w >= K)) return (V === ye && Gt(V) || _e(e, t) || ae === 1 && K === 29) && (Ne = 366), Wt(e, t) / Ne;
                const Ue = ye - V + 1, Fe = (new Date(ye + 1, 0, 1) - new Date(V, 0, 1)) / 1e3 / 60 / 60 / 24 / Ue;
                return Wt(e, t) / Fe;
              }
              case 2:
                return Wt(e, t) / 360;
              case 3:
                return Wt(e, t) / 365;
              case 4:
                return (K + 30 * ae + 360 * ye - (w + 30 * R + 360 * V)) / 360;
            }
          }
          function an(e) {
            const t = e > -22038912e5 ? 2 : 1;
            return Math.ceil((e - lt) / 864e5) + t;
          }
          function ln(e) {
            return (e = W(e)) === 0 ? a : e instanceof Error ? e : String.fromCharCode(e);
          }
          function cn(e) {
            if (oe(e)) return e;
            let t = (e = e || "").charCodeAt(0);
            return isNaN(t) && (t = a), t;
          }
          function un() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            let c = 0;
            for (; (c = e.indexOf(!0)) > -1; ) e[c] = "TRUE";
            let w = 0;
            for (; (w = e.indexOf(!1)) > -1; ) e[w] = "FALSE";
            return e.join("");
          }
          qt.INTL = (e, t, c, w) => {
            if ((e = Re(e)) instanceof Error) return e;
            if ((t = Re(t)) instanceof Error) return t;
            let R = !1;
            const V = [], K = [1, 2, 3, 4, 5, 6, 0], ae = new RegExp("^[0|1]{7}$");
            if (c === void 0) c = Vt[1];
            else if (typeof c == "string" && ae.test(c)) {
              R = !0, c = c.split("");
              for (let Ue = 0; Ue < c.length; Ue++) c[Ue] === "1" && V.push(K[Ue]);
            } else c = Vt[c];
            if (!(c instanceof Array)) return a;
            w === void 0 ? w = [] : w instanceof Array || (w = [w]);
            for (let Ue = 0; Ue < w.length; Ue++) {
              const Fe = Re(w[Ue]);
              if (Fe instanceof Error) return Fe;
              w[Ue] = Fe;
            }
            const ye = Math.round((t - e) / 864e5) + 1;
            let _e = ye;
            const Ne = e;
            for (let Ue = 0; Ue < ye; Ue++) {
              const Fe = (/* @__PURE__ */ new Date()).getTimezoneOffset() > 0 ? Ne.getUTCDay() : Ne.getDay();
              let Ge = R ? V.includes(Fe) : Fe === c[0] || Fe === c[1];
              for (let Qe = 0; Qe < w.length; Qe++) {
                const rt = w[Qe];
                if (rt.getDate() === Ne.getDate() && rt.getMonth() === Ne.getMonth() && rt.getFullYear() === Ne.getFullYear()) {
                  Ge = !0;
                  break;
                }
              }
              Ge && _e--, Ne.setDate(Ne.getDate() + 1);
            }
            return _e;
          }, Ut.INTL = (e, t, c, w) => {
            if ((e = Re(e)) instanceof Error) return e;
            if ((t = W(t)) instanceof Error) return t;
            if (t < 0) return u;
            if (!((c = c === void 0 ? Vt[1] : Vt[c]) instanceof Array)) return a;
            w === void 0 ? w = [] : w instanceof Array || (w = [w]);
            for (let V = 0; V < w.length; V++) {
              const K = Re(w[V]);
              if (K instanceof Error) return K;
              w[V] = K;
            }
            let R = 0;
            for (; R < t; ) {
              e.setDate(e.getDate() + 1);
              const V = e.getDay();
              if (V !== c[0] && V !== c[1]) {
                for (let K = 0; K < w.length; K++) {
                  const ae = w[K];
                  if (ae.getDate() === e.getDate() && ae.getMonth() === e.getMonth() && ae.getFullYear() === e.getFullYear()) {
                    R--;
                    break;
                  }
                }
                R++;
              }
            }
            return e;
          };
          const gn = un;
          function dn(e, t = 2, c = !1) {
            if (e = W(e), isNaN(e) || (t = W(t), isNaN(t))) return a;
            if (t < 0) {
              const w = Math.pow(10, -t);
              e = Math.round(e / w) * w;
            } else e = e.toFixed(t);
            if (c) e = e.toString().replace(/,/g, "");
            else {
              const w = e.toString().split(".");
              w[0] = w[0].replace(/\B(?=(\d{3})+$)/g, ","), e = w.join(".");
            }
            return e;
          }
          function ht(e, t) {
            return de(e, t) || (e = Ve(e), (t = W(t)) instanceof Error ? t : new Array(t + 1).join(e));
          }
          const bn = ln, vn = cn;
          function $t(e) {
            return /^[01]{1,10}$/.test(e);
          }
          function dt(e, t, c) {
            if (oe(e = W(e), t = W(t))) return e;
            if ((c = c === void 0 ? "i" : c) !== "i" && c !== "j") return a;
            if (e === 0 && t === 0) return 0;
            if (e === 0) return t === 1 ? c : t.toString() + c;
            if (t === 0) return e.toString();
            {
              const w = t > 0 ? "+" : "";
              return e.toString() + w + (t === 1 ? c : t.toString() + c);
            }
          }
          function Jt(e, t) {
            return t = t === void 0 ? 0 : t, oe(e = W(e), t = W(t)) ? a : b.erf(e);
          }
          function Zt(e) {
            return isNaN(e) ? a : b.erfc(e);
          }
          function Qt(e) {
            const t = it(e), c = ot(e);
            return oe(t, c) ? a : Math.sqrt(Math.pow(t, 2) + Math.pow(c, 2));
          }
          function ot(e) {
            if (e === void 0 || e === !0 || e === !1) return a;
            if (e === 0 || e === "0") return 0;
            if (["i", "j"].indexOf(e) >= 0) return 1;
            let t = (e = (e += "").replace("+i", "+1i").replace("-i", "-1i").replace("+j", "+1j").replace("-j", "-1j")).indexOf("+"), c = e.indexOf("-");
            t === 0 && (t = e.indexOf("+", 1)), c === 0 && (c = e.indexOf("-", 1));
            const w = e.substring(e.length - 1, e.length), R = w === "i" || w === "j";
            return t >= 0 || c >= 0 ? R ? t >= 0 ? isNaN(e.substring(0, t)) || isNaN(e.substring(t + 1, e.length - 1)) ? u : Number(e.substring(t + 1, e.length - 1)) : isNaN(e.substring(0, c)) || isNaN(e.substring(c + 1, e.length - 1)) ? u : -Number(e.substring(c + 1, e.length - 1)) : u : R ? isNaN(e.substring(0, e.length - 1)) ? u : e.substring(0, e.length - 1) : isNaN(e) ? u : 0;
          }
          function en(e) {
            const t = it(e), c = ot(e);
            return oe(t, c) ? a : t === 0 && c === 0 ? l : t === 0 && c > 0 ? Math.PI / 2 : t === 0 && c < 0 ? -Math.PI / 2 : c === 0 && t > 0 ? 0 : c === 0 && t < 0 ? -Math.PI : t > 0 ? Math.atan(c / t) : t < 0 && c >= 0 ? Math.atan(c / t) + Math.PI : Math.atan(c / t) - Math.PI;
          }
          function zt(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.cos(t) * (Math.exp(c) + Math.exp(-c)) / 2, -Math.sin(t) * (Math.exp(c) - Math.exp(-c)) / 2, w);
          }
          function fn(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.cos(c) * (Math.exp(t) + Math.exp(-t)) / 2, Math.sin(c) * (Math.exp(t) - Math.exp(-t)) / 2, w);
          }
          function It(e, t) {
            const c = it(e), w = ot(e), R = it(t), V = ot(t);
            if (oe(c, w, R, V)) return a;
            const K = e.substring(e.length - 1), ae = t.substring(t.length - 1);
            let ye = "i";
            if ((K === "j" || ae === "j") && (ye = "j"), R === 0 && V === 0) return u;
            const _e = R * R + V * V;
            return dt((c * R + w * V) / _e, (w * R - c * V) / _e, ye);
          }
          function it(e) {
            if (e === void 0 || e === !0 || e === !1) return a;
            if (e === 0 || e === "0" || ["i", "+i", "1i", "+1i", "-i", "-1i", "j", "+j", "1j", "+1j", "-j", "-1j"].indexOf(e) >= 0) return 0;
            let t = (e += "").indexOf("+"), c = e.indexOf("-");
            t === 0 && (t = e.indexOf("+", 1)), c === 0 && (c = e.indexOf("-", 1));
            const w = e.substring(e.length - 1, e.length), R = w === "i" || w === "j";
            return t >= 0 || c >= 0 ? R ? t >= 0 ? isNaN(e.substring(0, t)) || isNaN(e.substring(t + 1, e.length - 1)) ? u : Number(e.substring(0, t)) : isNaN(e.substring(0, c)) || isNaN(e.substring(c + 1, e.length - 1)) ? u : Number(e.substring(0, c)) : u : R ? isNaN(e.substring(0, e.length - 1)) ? u : 0 : isNaN(e) ? u : e;
          }
          function Yt(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.sin(t) * (Math.exp(c) + Math.exp(-c)) / 2, Math.cos(t) * (Math.exp(c) - Math.exp(-c)) / 2, w);
          }
          function pn(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.cos(c) * (Math.exp(t) - Math.exp(-t)) / 2, Math.sin(c) * (Math.exp(t) + Math.exp(-t)) / 2, w);
          }
          Jt.PRECISE = () => {
            throw new Error("ERF.PRECISE is not implemented");
          }, Zt.PRECISE = () => {
            throw new Error("ERFC.PRECISE is not implemented");
          };
          const yn = ut.DIST, wn = ut.INV, kn = St.DIST, xn = Ae.MATH, Cn = Ae.PRECISE, En = gt.DIST, An = gt.DIST.RT, In = gt.INV, jn = gt.INV.RT, _n = gt.TEST, Sn = H.P, Mn = H.P, Ln = H.S, Rn = St.INV, Dn = Zt.PRECISE, Tn = Jt.PRECISE, Nn = re.DIST, On = te.DIST, Bn = te.DIST.RT, Pn = te.INV, Fn = te.INV.RT, Vn = Ke.MATH, Hn = Ke.PRECISE, qn = te.TEST, Un = L.DIST, Wn = L.INV, zn = q.PRECISE, Yn = Q.DIST, Xn = me.INV, Gn = me.DIST, Kn = me.INV, $n = Te.MULT, Jn = Te.SNGL, Zn = Xe.DIST, Qn = qt.INTL, er = qe.DIST, tr = qe.INV, nr = qe.S.DIST, rr = qe.S.INV, sr = ve.EXC, or = ve.INC, ir = je.EXC, ar = je.INC, lr = X.DIST, cr = ee.EXC, ur = ee.INC, dr = C.AVG, fr = C.EQ, pr = F.P, mr = fe.P, hr = fe.S, gr = J.DIST, br = J.DIST.RT, vr = J.INV, yr = J.TEST, wr = pe.P, kr = pe.S, xr = ce.DIST, Cr = Ut.INTL, Er = ke.TEST;
          function tn(e) {
            const t = [];
            return I(e, ((c) => {
              c && t.push(c);
            })), t;
          }
          function wt(e, t) {
            const c = {};
            for (let V = 1; V < e[0].length; ++V) c[V] = !0;
            let w = t[0].length;
            for (let V = 1; V < t.length; ++V) t[V].length > w && (w = t[V].length);
            for (let V = 1; V < e.length; ++V) for (let K = 1; K < e[V].length; ++K) {
              let ae = !1, ye = !1;
              for (let _e = 0; _e < t.length; ++_e) {
                const Ne = t[_e];
                if (Ne.length < w) continue;
                const Ue = Ne[0];
                if (e[V][0] === Ue) {
                  ye = !0;
                  for (let Fe = 1; Fe < Ne.length; ++Fe) if (!ae) if (Ne[Fe] === void 0 || Ne[Fe] === "*") ae = !0;
                  else {
                    const Ge = ft(Ne[Fe] + ""), Qe = [at(e[V][K], tt)].concat(Ge);
                    ae = pt(Qe);
                  }
                }
              }
              ye && (c[K] = c[K] && ae);
            }
            const R = [];
            for (let V = 0; V < e[0].length; ++V) c[V] && R.push(V - 1);
            return R;
          }
          function nn(e) {
            return e && e.getTime && !isNaN(e.getTime());
          }
          function rn(e) {
            return e instanceof Date ? e : new Date(e);
          }
          function jt(e, t, c, w, R) {
            if (w = w || 0, R = R || 0, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R))) return a;
            let V;
            if (e === 0) V = w + c * t;
            else {
              const K = Math.pow(1 + e, t);
              V = R === 1 ? w * K + c * (1 + e) * (K - 1) / e : w * K + c * (K - 1) / e;
            }
            return -V;
          }
          function mn(e, t, c, w, R, V) {
            if (R = R || 0, V = V || 0, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R), V = W(V))) return a;
            const K = Nt(e, c, w, R, V);
            return (t === 1 ? V === 1 ? 0 : -w : V === 1 ? jt(e, t - 2, K, w, 1) - K : jt(e, t - 1, K, w, 0)) * e;
          }
          function sn() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = e[0];
            let c = 0;
            for (let w = 1; w < e.length; w++) c += e[w] / Math.pow(1 + t, w);
            return c;
          }
          function Nt(e, t, c, w, R) {
            if (w = w || 0, R = R || 0, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R))) return a;
            let V;
            if (e === 0) V = (c + w) / t;
            else {
              const K = Math.pow(1 + e, t);
              V = R === 1 ? (w * e / (K - 1) + c * e / (1 - 1 / K)) / (1 + e) : w * e / (K - 1) + c * e / (1 - 1 / K);
            }
            return -V;
          }
          const Ar = { errors: N, symbols: yt };
          g.ABS = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.abs(e);
          }, g.ACCRINT = function(e, t, c, w, R, V, K) {
            return e = rn(e), t = rn(t), c = rn(c), nn(e) && nn(t) && nn(c) ? w <= 0 || R <= 0 || [1, 2, 4].indexOf(V) === -1 || [0, 1, 2, 3, 4].indexOf(K) === -1 || c <= e ? u : (R = R || 0) * w * Kt(e, c, K = K || 0) : a;
          }, g.ACCRINTM = function() {
            throw new Error("ACCRINTM is not implemented");
          }, g.ACOS = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = Math.acos(e);
            return isNaN(t) && (t = u), t;
          }, g.ACOSH = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = Math.log(e + Math.sqrt(e * e - 1));
            return isNaN(t) && (t = u), t;
          }, g.ACOT = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.atan(1 / e);
          }, g.ACOTH = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = 0.5 * Math.log((e + 1) / (e - 1));
            return isNaN(t) && (t = u), t;
          }, g.AGGREGATE = function(e, t, c, w) {
            if (oe(e = W(e), W(e))) return a;
            switch (e) {
              case 1:
                return kt(c);
              case 2:
                return S(c);
              case 3:
                return f(c);
              case 4:
                return we(c);
              case 5:
                return De(c);
              case 6:
                return Xt(c);
              case 7:
                return fe.S(c);
              case 8:
                return fe.P(c);
              case 9:
                return vt(c);
              case 10:
                return pe.S(c);
              case 11:
                return pe.P(c);
              case 12:
                return Le(c);
              case 13:
                return Te.SNGL(c);
              case 14:
                return le(c, w);
              case 15:
                return Z(c, w);
              case 16:
                return ve.INC(c, w);
              case 17:
                return ee.INC(c, w);
              case 18:
                return ve.EXC(c, w);
              case 19:
                return ee.EXC(c, w);
            }
          }, g.AMORDEGRC = function() {
            throw new Error("AMORDEGRC is not implemented");
          }, g.AMORLINC = function() {
            throw new Error("AMORLINC is not implemented");
          }, g.AND = function() {
            const e = U(arguments);
            let t = a;
            for (let c = 0; c < e.length; c++) {
              if (e[c] instanceof Error) return e[c];
              e[c] !== void 0 && e[c] !== null && typeof e[c] != "string" && (t === a && (t = !0), e[c] || (t = !1));
            }
            return t;
          }, g.ARABIC = function(e) {
            if (e == null) return 0;
            if (e instanceof Error) return e;
            if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(e)) return a;
            let t = 0;
            return e.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, ((c) => {
              t += { M: 1e3, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }[c];
            })), t;
          }, g.ASC = function() {
            throw new Error("ASC is not implemented");
          }, g.ASIN = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = Math.asin(e);
            return isNaN(t) && (t = u), t;
          }, g.ASINH = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.log(e + Math.sqrt(e * e + 1));
          }, g.ATAN = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.atan(e);
          }, g.ATAN2 = function(e, t) {
            return de(e = W(e), t = W(t)) || Math.atan2(e, t);
          }, g.ATANH = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = Math.log((1 + e) / (1 - e)) / 2;
            return isNaN(t) && (t = u), t;
          }, g.AVEDEV = function() {
            const e = U(arguments).filter(Se);
            if (e.length === 0) return u;
            const t = Ie(e);
            return t instanceof Error ? t : b.sum(b(t).subtract(b.mean(t)).abs()[0]) / t.length;
          }, g.AVERAGE = kt, g.AVERAGEA = Rt, g.AVERAGEIF = function(e, t, c) {
            if (arguments.length <= 1) return v;
            if (c = Ie(U(c = c || e).filter(Se)), e = U(e), c instanceof Error) return c;
            let w = 0, R = 0;
            const V = t === void 0 || t === "*", K = V ? null : ft(t + "");
            for (let ae = 0; ae < e.length; ae++) {
              const ye = e[ae];
              if (V) R += c[ae], w++;
              else {
                const _e = [at(ye, tt)].concat(K);
                pt(_e) && (R += c[ae], w++);
              }
            }
            return R / w;
          }, g.AVERAGEIFS = function() {
            const e = T(arguments), t = (e.length - 1) / 2, c = U(e[0]);
            let w = 0, R = 0;
            for (let K = 0; K < c.length; K++) {
              let ae = !1;
              for (let ye = 0; ye < t; ye++) {
                const _e = e[2 * ye + 1][K], Ne = e[2 * ye + 2];
                let Ue = !1;
                if (Ne === void 0 || Ne === "*") Ue = !0;
                else {
                  const Fe = ft(Ne + ""), Ge = [at(_e, tt)].concat(Fe);
                  Ue = pt(Ge);
                }
                if (!Ue) {
                  ae = !1;
                  break;
                }
                ae = !0;
              }
              ae && (R += c[K], w++);
            }
            const V = R / w;
            return isNaN(V) ? 0 : V;
          }, g.BAHTTEXT = function() {
            throw new Error("BAHTTEXT is not implemented");
          }, g.BASE = function(e, t, c) {
            const w = de(e = W(e), t = W(t), c = W(c));
            if (w) return w;
            if (t === 0) return u;
            const R = e.toString(t);
            return new Array(Math.max(c + 1 - R.length, 0)).join("0") + R;
          }, g.BESSELI = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : D.besseli(e, t);
          }, g.BESSELJ = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : D.besselj(e, t);
          }, g.BESSELK = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : D.besselk(e, t);
          }, g.BESSELY = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : D.bessely(e, t);
          }, g.BETA = ut, g.BETADIST = yn, g.BETAINV = wn, g.BIN2DEC = function(e) {
            if (!$t(e)) return u;
            const t = parseInt(e, 2), c = e.toString();
            return c.length === 10 && c.substring(0, 1) === "1" ? parseInt(c.substring(1), 2) - 512 : t;
          }, g.BIN2HEX = function(e, t) {
            if (!$t(e)) return u;
            const c = e.toString();
            if (c.length === 10 && c.substring(0, 1) === "1") return (1099511627264 + parseInt(c.substring(1), 2)).toString(16);
            const w = parseInt(e, 2).toString(16);
            return t === void 0 ? w : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= w.length ? ht("0", t - w.length) + w : u;
          }, g.BIN2OCT = function(e, t) {
            if (!$t(e)) return u;
            const c = e.toString();
            if (c.length === 10 && c.substring(0, 1) === "1") return (1073741312 + parseInt(c.substring(1), 2)).toString(8);
            const w = parseInt(e, 2).toString(8);
            return t === void 0 ? w : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= w.length ? ht("0", t - w.length) + w : u;
          }, g.BINOM = St, g.BINOMDIST = kn, g.BITAND = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 281474976710655 || t > 281474976710655 ? u : e & t;
          }, g.BITLSHIFT = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e < 0 || Math.floor(e) !== e || e > 281474976710655 || Math.abs(t) > 53 ? u : t >= 0 ? e << t : e >> -t;
          }, g.BITOR = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 281474976710655 || t > 281474976710655 ? u : e | t;
          }, g.BITRSHIFT = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e < 0 || Math.floor(e) !== e || e > 281474976710655 || Math.abs(t) > 53 ? u : t >= 0 ? e >> t : e << -t;
          }, g.BITXOR = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e < 0 || t < 0 || Math.floor(e) !== e || Math.floor(t) !== t || e > 281474976710655 || t > 281474976710655 ? u : e ^ t;
          }, g.CEILING = Ae, g.CEILINGMATH = xn, g.CEILINGPRECISE = Cn, g.CELL = function() {
            throw new Error("CELL is not implemented");
          }, g.CHAR = ln, g.CHIDIST = En, g.CHIDISTRT = An, g.CHIINV = In, g.CHIINVRT = jn, g.CHISQ = gt, g.CHITEST = _n, g.CHOOSE = function() {
            if (arguments.length < 2) return v;
            const e = arguments[0];
            return e < 1 || e > 254 || arguments.length < e + 1 ? a : arguments[e];
          }, g.CLEAN = function(e) {
            return oe(e) ? e : (e = e || "").replace(/[\0-\x1F]/g, "");
          }, g.CODE = cn, g.COLUMN = function(e, t) {
            return arguments.length !== 2 ? v : t < 0 ? u : e instanceof Array && typeof t == "number" ? e.length !== 0 ? b.col(e, t) : void 0 : a;
          }, g.COLUMNS = function(e) {
            return arguments.length !== 1 ? v : e instanceof Array ? e.length === 0 ? 0 : b.cols(e) : a;
          }, g.COMBIN = ze, g.COMBINA = function(e, t) {
            return de(e = W(e), t = W(t)) || (e < t ? u : e === 0 && t === 0 ? 1 : ze(e + t - 1, e - 1));
          }, g.COMPLEX = dt, g.CONCAT = gn, g.CONCATENATE = un, g.CONFIDENCE = E, g.CONVERT = function(e, t, c) {
            if ((e = W(e)) instanceof Error) return e;
            const w = [["a.u. of action", "?", null, "action", !1, !1, 105457168181818e-48], ["a.u. of charge", "e", null, "electric_charge", !1, !1, 160217653141414e-33], ["a.u. of energy", "Eh", null, "energy", !1, !1, 435974417757576e-32], ["a.u. of length", "a?", null, "length", !1, !1, 529177210818182e-25], ["a.u. of mass", "m?", null, "mass", !1, !1, 910938261616162e-45], ["a.u. of time", "?/Eh", null, "time", !1, !1, 241888432650516e-31], ["admiralty knot", "admkn", null, "speed", !1, !0, 0.514773333], ["ampere", "A", null, "electric_current", !0, !1, 1], ["ampere per meter", "A/m", null, "magnetic_field_intensity", !0, !1, 1], ["ångström", "Å", ["ang"], "length", !1, !0, 1e-10], ["are", "ar", null, "area", !1, !0, 100], ["astronomical unit", "ua", null, "length", !1, !1, 149597870691667e-25], ["bar", "bar", null, "pressure", !1, !1, 1e5], ["barn", "b", null, "area", !1, !1, 1e-28], ["becquerel", "Bq", null, "radioactivity", !0, !1, 1], ["bit", "bit", ["b"], "information", !1, !0, 1], ["btu", "BTU", ["btu"], "energy", !1, !0, 1055.05585262], ["byte", "byte", null, "information", !1, !0, 8], ["candela", "cd", null, "luminous_intensity", !0, !1, 1], ["candela per square metre", "cd/m?", null, "luminance", !0, !1, 1], ["coulomb", "C", null, "electric_charge", !0, !1, 1], ["cubic ångström", "ang3", ["ang^3"], "volume", !1, !0, 1e-30], ["cubic foot", "ft3", ["ft^3"], "volume", !1, !0, 0.028316846592], ["cubic inch", "in3", ["in^3"], "volume", !1, !0, 16387064e-12], ["cubic light-year", "ly3", ["ly^3"], "volume", !1, !0, 846786664623715e-61], ["cubic metre", "m?", null, "volume", !0, !0, 1], ["cubic mile", "mi3", ["mi^3"], "volume", !1, !0, 416818182544058e-5], ["cubic nautical mile", "Nmi3", ["Nmi^3"], "volume", !1, !0, 6352182208], ["cubic Pica", "Pica3", ["Picapt3", "Pica^3", "Picapt^3"], "volume", !1, !0, 758660370370369e-22], ["cubic yard", "yd3", ["yd^3"], "volume", !1, !0, 0.764554857984], ["cup", "cup", null, "volume", !1, !0, 2365882365e-13], ["dalton", "Da", ["u"], "mass", !1, !1, 166053886282828e-41], ["day", "d", ["day"], "time", !1, !0, 86400], ["degree", "°", null, "angle", !1, !1, 0.0174532925199433], ["degrees Rankine", "Rank", null, "temperature", !1, !0, 0.555555555555556], ["dyne", "dyn", ["dy"], "force", !1, !0, 1e-5], ["electronvolt", "eV", ["ev"], "energy", !1, !0, 1.60217656514141], ["ell", "ell", null, "length", !1, !0, 1.143], ["erg", "erg", ["e"], "energy", !1, !0, 1e-7], ["farad", "F", null, "electric_capacitance", !0, !1, 1], ["fluid ounce", "oz", null, "volume", !1, !0, 295735295625e-16], ["foot", "ft", null, "length", !1, !0, 0.3048], ["foot-pound", "flb", null, "energy", !1, !0, 1.3558179483314], ["gal", "Gal", null, "acceleration", !1, !1, 0.01], ["gallon", "gal", null, "volume", !1, !0, 0.003785411784], ["gauss", "G", ["ga"], "magnetic_flux_density", !1, !0, 1], ["grain", "grain", null, "mass", !1, !0, 647989e-10], ["gram", "g", null, "mass", !1, !0, 1e-3], ["gray", "Gy", null, "absorbed_dose", !0, !1, 1], ["gross registered ton", "GRT", ["regton"], "volume", !1, !0, 2.8316846592], ["hectare", "ha", null, "area", !1, !0, 1e4], ["henry", "H", null, "inductance", !0, !1, 1], ["hertz", "Hz", null, "frequency", !0, !1, 1], ["horsepower", "HP", ["h"], "power", !1, !0, 745.69987158227], ["horsepower-hour", "HPh", ["hh", "hph"], "energy", !1, !0, 2684519538e-3], ["hour", "h", ["hr"], "time", !1, !0, 3600], ["imperial gallon (U.K.)", "uk_gal", null, "volume", !1, !0, 454609e-8], ["imperial hundredweight", "lcwt", ["uk_cwt", "hweight"], "mass", !1, !0, 50.802345], ["imperial quart (U.K)", "uk_qt", null, "volume", !1, !0, 0.0011365225], ["imperial ton", "brton", ["uk_ton", "LTON"], "mass", !1, !0, 1016.046909], ["inch", "in", null, "length", !1, !0, 0.0254], ["international acre", "uk_acre", null, "area", !1, !0, 4046.8564224], ["IT calorie", "cal", null, "energy", !1, !0, 4.1868], ["joule", "J", null, "energy", !0, !0, 1], ["katal", "kat", null, "catalytic_activity", !0, !1, 1], ["kelvin", "K", ["kel"], "temperature", !0, !0, 1], ["kilogram", "kg", null, "mass", !0, !0, 1], ["knot", "kn", null, "speed", !1, !0, 0.514444444444444], ["light-year", "ly", null, "length", !1, !0, 9460730472580800], ["litre", "L", ["l", "lt"], "volume", !1, !0, 1e-3], ["lumen", "lm", null, "luminous_flux", !0, !1, 1], ["lux", "lx", null, "illuminance", !0, !1, 1], ["maxwell", "Mx", null, "magnetic_flux", !1, !1, 1e-18], ["measurement ton", "MTON", null, "volume", !1, !0, 1.13267386368], ["meter per hour", "m/h", ["m/hr"], "speed", !1, !0, 27777777777778e-17], ["meter per second", "m/s", ["m/sec"], "speed", !0, !0, 1], ["meter per second squared", "m?s??", null, "acceleration", !0, !1, 1], ["parsec", "pc", ["parsec"], "length", !1, !0, 30856775814671900], ["meter squared per second", "m?/s", null, "kinematic_viscosity", !0, !1, 1], ["metre", "m", null, "length", !0, !0, 1], ["miles per hour", "mph", null, "speed", !1, !0, 0.44704], ["millimetre of mercury", "mmHg", null, "pressure", !1, !1, 133.322], ["minute", "?", null, "angle", !1, !1, 290888208665722e-18], ["minute", "min", ["mn"], "time", !1, !0, 60], ["modern teaspoon", "tspm", null, "volume", !1, !0, 5e-6], ["mole", "mol", null, "amount_of_substance", !0, !1, 1], ["morgen", "Morgen", null, "area", !1, !0, 2500], ["n.u. of action", "?", null, "action", !1, !1, 105457168181818e-48], ["n.u. of mass", "m?", null, "mass", !1, !1, 910938261616162e-45], ["n.u. of speed", "c?", null, "speed", !1, !1, 299792458], ["n.u. of time", "?/(me?c??)", null, "time", !1, !1, 128808866778687e-35], ["nautical mile", "M", ["Nmi"], "length", !1, !0, 1852], ["newton", "N", null, "force", !0, !0, 1], ["œrsted", "Oe ", null, "magnetic_field_intensity", !1, !1, 79.5774715459477], ["ohm", "Ω", null, "electric_resistance", !0, !1, 1], ["ounce mass", "ozm", null, "mass", !1, !0, 0.028349523125], ["pascal", "Pa", null, "pressure", !0, !1, 1], ["pascal second", "Pa?s", null, "dynamic_viscosity", !0, !1, 1], ["pferdestärke", "PS", null, "power", !1, !0, 735.49875], ["phot", "ph", null, "illuminance", !1, !1, 1e-4], ["pica (1/6 inch)", "pica", null, "length", !1, !0, 35277777777778e-17], ["pica (1/72 inch)", "Pica", ["Picapt"], "length", !1, !0, 0.00423333333333333], ["poise", "P", null, "dynamic_viscosity", !1, !1, 0.1], ["pond", "pond", null, "force", !1, !0, 980665e-8], ["pound force", "lbf", null, "force", !1, !0, 4.4482216152605], ["pound mass", "lbm", null, "mass", !1, !0, 0.45359237], ["quart", "qt", null, "volume", !1, !0, 946352946e-12], ["radian", "rad", null, "angle", !0, !1, 1], ["second", "?", null, "angle", !1, !1, 484813681109536e-20], ["second", "s", ["sec"], "time", !0, !0, 1], ["short hundredweight", "cwt", ["shweight"], "mass", !1, !0, 45.359237], ["siemens", "S", null, "electrical_conductance", !0, !1, 1], ["sievert", "Sv", null, "equivalent_dose", !0, !1, 1], ["slug", "sg", null, "mass", !1, !0, 14.59390294], ["square ångström", "ang2", ["ang^2"], "area", !1, !0, 1e-20], ["square foot", "ft2", ["ft^2"], "area", !1, !0, 0.09290304], ["square inch", "in2", ["in^2"], "area", !1, !0, 64516e-8], ["square light-year", "ly2", ["ly^2"], "area", !1, !0, 895054210748189e17], ["square meter", "m?", null, "area", !0, !0, 1], ["square mile", "mi2", ["mi^2"], "area", !1, !0, 2589988110336e-6], ["square nautical mile", "Nmi2", ["Nmi^2"], "area", !1, !0, 3429904], ["square Pica", "Pica2", ["Picapt2", "Pica^2", "Picapt^2"], "area", !1, !0, 1792111111111e-17], ["square yard", "yd2", ["yd^2"], "area", !1, !0, 0.83612736], ["statute mile", "mi", null, "length", !1, !0, 1609.344], ["steradian", "sr", null, "solid_angle", !0, !1, 1], ["stilb", "sb", null, "luminance", !1, !1, 1e-4], ["stokes", "St", null, "kinematic_viscosity", !1, !1, 1e-4], ["stone", "stone", null, "mass", !1, !0, 6.35029318], ["tablespoon", "tbs", null, "volume", !1, !0, 147868e-10], ["teaspoon", "tsp", null, "volume", !1, !0, 492892e-11], ["tesla", "T", null, "magnetic_flux_density", !0, !0, 1], ["thermodynamic calorie", "c", null, "energy", !1, !0, 4.184], ["ton", "ton", null, "mass", !1, !0, 907.18474], ["tonne", "t", null, "mass", !1, !1, 1e3], ["U.K. pint", "uk_pt", null, "volume", !1, !0, 56826125e-11], ["U.S. bushel", "bushel", null, "volume", !1, !0, 0.03523907], ["U.S. oil barrel", "barrel", null, "volume", !1, !0, 0.158987295], ["U.S. pint", "pt", ["us_pt"], "volume", !1, !0, 473176473e-12], ["U.S. survey mile", "survey_mi", null, "length", !1, !0, 1609.347219], ["U.S. survey/statute acre", "us_acre", null, "area", !1, !0, 4046.87261], ["volt", "V", null, "voltage", !0, !1, 1], ["watt", "W", null, "power", !0, !0, 1], ["watt-hour", "Wh", ["wh"], "energy", !1, !0, 3600], ["weber", "Wb", null, "magnetic_flux", !0, !1, 1], ["yard", "yd", null, "length", !1, !0, 0.9144], ["year", "yr", null, "time", !1, !0, 31557600]], R = { Yi: ["yobi", 80, 12089258196146292e8, "Yi", "yotta"], Zi: ["zebi", 70, 11805916207174113e5, "Zi", "zetta"], Ei: ["exbi", 60, 1152921504606847e3, "Ei", "exa"], Pi: ["pebi", 50, 1125899906842624, "Pi", "peta"], Ti: ["tebi", 40, 1099511627776, "Ti", "tera"], Gi: ["gibi", 30, 1073741824, "Gi", "giga"], Mi: ["mebi", 20, 1048576, "Mi", "mega"], ki: ["kibi", 10, 1024, "ki", "kilo"] }, V = { Y: ["yotta", 1e24, "Y"], Z: ["zetta", 1e21, "Z"], E: ["exa", 1e18, "E"], P: ["peta", 1e15, "P"], T: ["tera", 1e12, "T"], G: ["giga", 1e9, "G"], M: ["mega", 1e6, "M"], k: ["kilo", 1e3, "k"], h: ["hecto", 100, "h"], e: ["dekao", 10, "e"], d: ["deci", 0.1, "d"], c: ["centi", 0.01, "c"], m: ["milli", 1e-3, "m"], u: ["micro", 1e-6, "u"], n: ["nano", 1e-9, "n"], p: ["pico", 1e-12, "p"], f: ["femto", 1e-15, "f"], a: ["atto", 1e-18, "a"], z: ["zepto", 1e-21, "z"], y: ["yocto", 1e-24, "y"] };
            let K, ae = null, ye = null, _e = t, Ne = c, Ue = 1, Fe = 1;
            for (let Ge = 0; Ge < w.length; Ge++) K = w[Ge][2] === null ? [] : w[Ge][2], (w[Ge][1] === _e || K.indexOf(_e) >= 0) && (ae = w[Ge]), (w[Ge][1] === Ne || K.indexOf(Ne) >= 0) && (ye = w[Ge]);
            if (ae === null) {
              const Ge = R[t.substring(0, 2)];
              let Qe = V[t.substring(0, 1)];
              t.substring(0, 2) === "da" && (Qe = ["dekao", 10, "da"]), Ge ? (Ue = Ge[2], _e = t.substring(2)) : Qe && (Ue = Qe[1], _e = t.substring(Qe[2].length));
              for (let rt = 0; rt < w.length; rt++) K = w[rt][2] === null ? [] : w[rt][2], (w[rt][1] === _e || K.indexOf(_e) >= 0) && (ae = w[rt]);
            }
            if (ye === null) {
              const Ge = R[c.substring(0, 2)];
              let Qe = V[c.substring(0, 1)];
              c.substring(0, 2) === "da" && (Qe = ["dekao", 10, "da"]), Ge ? (Fe = Ge[2], Ne = c.substring(2)) : Qe && (Fe = Qe[1], Ne = c.substring(Qe[2].length));
              for (let rt = 0; rt < w.length; rt++) K = w[rt][2] === null ? [] : w[rt][2], (w[rt][1] === Ne || K.indexOf(Ne) >= 0) && (ye = w[rt]);
            }
            return ae === null || ye === null || ae[3] !== ye[3] ? v : e * ae[6] * Ue / (ye[6] * Fe);
          }, g.CORREL = function(e, t) {
            return oe(e = Ie(U(e)), t = Ie(U(t))) ? a : b.corrcoeff(e, t);
          }, g.COS = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.cos(e);
          }, g.COSH = function(e) {
            return (e = W(e)) instanceof Error ? e : (Math.exp(e) + Math.exp(-e)) / 2;
          }, g.COT = function(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 ? l : 1 / Math.tan(e);
          }, g.COTH = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            if (e === 0) return l;
            const t = Math.exp(2 * e);
            return (t + 1) / (t - 1);
          }, g.COUNT = S, g.COUNTA = f, g.COUNTBLANK = r, g.COUNTIF = function(e, t) {
            if (e = U(e), t === void 0 || t === "*") return e.length;
            let c = 0;
            const w = ft(t + "");
            for (let R = 0; R < e.length; R++) {
              const V = [at(e[R], tt)].concat(w);
              pt(V) && c++;
            }
            return c;
          }, g.COUNTIFS = function() {
            const e = T(arguments), t = new Array(U(e[0]).length);
            for (let w = 0; w < t.length; w++) t[w] = !0;
            for (let w = 0; w < e.length; w += 2) {
              const R = U(e[w]), V = e[w + 1];
              if (V !== void 0 && V !== "*") {
                const K = ft(V + "");
                for (let ae = 0; ae < R.length; ae++) {
                  const ye = [at(R[ae], tt)].concat(K);
                  t[ae] = t[ae] && pt(ye);
                }
              }
            }
            let c = 0;
            for (let w = 0; w < t.length; w++) t[w] && c++;
            return c;
          }, g.COUPDAYBS = function() {
            throw new Error("COUPDAYBS is not implemented");
          }, g.COUPDAYS = function() {
            throw new Error("COUPDAYS is not implemented");
          }, g.COUPDAYSNC = function() {
            throw new Error("COUPDAYSNC is not implemented");
          }, g.COUPNCD = function() {
            throw new Error("COUPNCD is not implemented");
          }, g.COUPNUM = function() {
            throw new Error("COUPNUM is not implemented");
          }, g.COUPPCD = function() {
            throw new Error("COUPPCD is not implemented");
          }, g.COVAR = Sn, g.COVARIANCE = H, g.COVARIANCEP = Mn, g.COVARIANCES = Ln, g.CRITBINOM = Rn, g.CSC = function(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 ? l : 1 / Math.sin(e);
          }, g.CSCH = function(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 ? l : 2 / (Math.exp(e) - Math.exp(-e));
          }, g.CUMIPMT = function(e, t, c, w, R, V) {
            if (oe(e = W(e), t = W(t), c = W(c))) return a;
            if (e <= 0 || t <= 0 || c <= 0 || w < 1 || R < 1 || w > R || V !== 0 && V !== 1) return u;
            const K = Nt(e, t, c, 0, V);
            let ae = 0;
            w === 1 && (V === 0 && (ae = -c), w++);
            for (let ye = w; ye <= R; ye++) ae += V === 1 ? jt(e, ye - 2, K, c, 1) - K : jt(e, ye - 1, K, c, 0);
            return ae *= e, ae;
          }, g.CUMPRINC = function(e, t, c, w, R, V) {
            if (oe(e = W(e), t = W(t), c = W(c))) return a;
            if (e <= 0 || t <= 0 || c <= 0 || w < 1 || R < 1 || w > R || V !== 0 && V !== 1) return u;
            const K = Nt(e, t, c, 0, V);
            let ae = 0;
            w === 1 && (ae = V === 0 ? K + c * e : K, w++);
            for (let ye = w; ye <= R; ye++) ae += V > 0 ? K - (jt(e, ye - 2, K, c, 1) - K) * e : K - jt(e, ye - 1, K, c, 0) * e;
            return ae;
          }, g.DATE = function(e, t, c) {
            let w;
            return oe(e = W(e), t = W(t), c = W(c)) ? w = a : (w = new Date(e, t - 1, c), w.getFullYear() < 0 && (w = u)), w;
          }, g.DATEDIF = Tt, g.DATEVALUE = function(e) {
            if (typeof e != "string") return a;
            const t = Date.parse(e);
            return isNaN(t) ? a : new Date(e);
          }, g.DAVERAGE = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            let V = 0;
            return I(w, ((K) => {
              V += R[K];
            })), w.length === 0 ? l : V / w.length;
          }, g.DAY = function(e) {
            const t = Re(e);
            return t instanceof Error ? t : t.getDate();
          }, g.DAYS = At, g.DAYS360 = xt, g.DB = function(e, t, c, w, R) {
            if (R = R === void 0 ? 12 : R, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R))) return a;
            if (e < 0 || t < 0 || c < 0 || w < 0 || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(R) === -1 || w > c) return u;
            if (t >= e) return 0;
            const V = (1 - Math.pow(t / e, 1 / c)).toFixed(3), K = e * V * R / 12;
            let ae = K, ye = 0;
            const _e = w === c ? c - 1 : w;
            for (let Ne = 2; Ne <= _e; Ne++) ye = (e - ae) * V, ae += ye;
            return w === 1 ? K : w === c ? (e - ae) * V : ye;
          }, g.DBCS = function() {
            throw new Error("DBCS is not implemented");
          }, g.DCOUNT = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            const V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), S(V);
          }, g.DCOUNTA = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            const V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), f(V);
          }, g.DDB = function(e, t, c, w, R) {
            if (R = R === void 0 ? 2 : R, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R))) return a;
            if (e < 0 || t < 0 || c < 0 || w < 0 || R <= 0 || w > c) return u;
            if (t >= e) return 0;
            let V = 0, K = 0;
            for (let ae = 1; ae <= w; ae++) K = Math.min(R / c * (e - V), e - t - V), V += K;
            return K;
          }, g.DEC2BIN = function(e, t) {
            if ((e = W(e)) instanceof Error) return e;
            if (!/^-?[0-9]{1,3}$/.test(e) || e < -512 || e > 511) return u;
            if (e < 0) return "1" + ht("0", 9 - (512 + e).toString(2).length) + (512 + e).toString(2);
            const c = parseInt(e, 10).toString(2);
            return t === void 0 ? c : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= c.length ? ht("0", t - c.length) + c : u;
          }, g.DEC2HEX = function(e, t) {
            if ((e = W(e)) instanceof Error) return e;
            if (!/^-?[0-9]{1,12}$/.test(e) || e < -549755813888 || e > 549755813887) return u;
            if (e < 0) return (1099511627776 + e).toString(16);
            const c = parseInt(e, 10).toString(16);
            return t === void 0 ? c : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= c.length ? ht("0", t - c.length) + c : u;
          }, g.DEC2OCT = function(e, t) {
            if ((e = W(e)) instanceof Error) return e;
            if (!/^-?[0-9]{1,9}$/.test(e) || e < -536870912 || e > 536870911) return u;
            if (e < 0) return (1073741824 + e).toString(8);
            const c = parseInt(e, 10).toString(8);
            return t === void 0 ? c : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= c.length ? ht("0", t - c.length) + c : u;
          }, g.DECIMAL = function(e, t) {
            return arguments.length < 1 ? a : de(e = W(e), t = W(t)) || (t === 0 ? u : parseInt(e, t));
          }, g.DEGREES = function(e) {
            return (e = W(e)) instanceof Error ? e : 180 * e / Math.PI;
          }, g.DELTA = function(e, t) {
            return t = t === void 0 ? 0 : t, oe(e = W(e), t = W(t)) ? a : e === t ? 1 : 0;
          }, g.DEVSQ = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = b.mean(e);
            let c = 0;
            for (let w = 0; w < e.length; w++) c += Math.pow(e[w] - t, 2);
            return c;
          }, g.DGET = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            return R = G(typeof t == "string" ? e[ge(e, t)] : e[t]), w.length === 0 ? a : w.length > 1 ? u : R[w[0]];
          }, g.DISC = function(e, t, c, w, R) {
            if (oe(e = Re(e), t = Re(t), c = W(c), w = W(w), R = (R = W(R)) || 0)) return a;
            if (c <= 0 || w <= 0) return u;
            if (e >= t) return a;
            let V, K;
            switch (R) {
              case 0:
                V = 360, K = xt(e, t, !1);
                break;
              case 1:
              case 3:
                V = 365, K = Tt(e, t, "D");
                break;
              case 2:
                V = 360, K = Tt(e, t, "D");
                break;
              case 4:
                V = 360, K = xt(e, t, !0);
                break;
              default:
                return u;
            }
            return (w - c) / w * V / K;
          }, g.DMAX = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            let V = R[w[0]];
            return I(w, ((K) => {
              V < R[K] && (V = R[K]);
            })), V;
          }, g.DMIN = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            let V = R[w[0]];
            return I(w, ((K) => {
              V > R[K] && (V = R[K]);
            })), V;
          }, g.DOLLAR = function(e, t = 2) {
            if (e = W(e), isNaN(e)) return a;
            const c = { style: "currency", currency: "USD", minimumFractionDigits: t >= 0 ? t : 0, maximumFractionDigits: t >= 0 ? t : 0 }, w = (e = bt(e, t)).toLocaleString("en-US", c);
            return e < 0 ? "$(" + w.slice(2) + ")" : w;
          }, g.DOLLARDE = function(e, t) {
            if (oe(e = W(e), t = W(t))) return a;
            if (t < 0) return u;
            if (t >= 0 && t < 1) return l;
            t = parseInt(t, 10);
            let c = parseInt(e, 10);
            c += e % 1 * Math.pow(10, Math.ceil(Math.log(t) / Math.LN10)) / t;
            const w = Math.pow(10, Math.ceil(Math.log(t) / Math.LN2) + 1);
            return c = Math.round(c * w) / w, c;
          }, g.DOLLARFR = function(e, t) {
            if (oe(e = W(e), t = W(t))) return a;
            if (t < 0) return u;
            if (t >= 0 && t < 1) return l;
            t = parseInt(t, 10);
            let c = parseInt(e, 10);
            return c += e % 1 * Math.pow(10, -Math.ceil(Math.log(t) / Math.LN10)) * t, c;
          }, g.DPRODUCT = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const ae = ge(e, t);
              R = G(e[ae]);
            } else R = G(e[t]);
            let V = [];
            I(w, ((ae) => {
              V.push(R[ae]);
            })), V = tn(V);
            let K = 1;
            return I(V, ((ae) => {
              K *= ae;
            })), K;
          }, g.DSTDEV = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            let V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), V = tn(V), fe.S(V);
          }, g.DSTDEVP = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            let V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), V = tn(V), fe.P(V);
          }, g.DSUM = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            const V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), vt(V);
          }, g.DURATION = function() {
            throw new Error("DURATION is not implemented");
          }, g.DVAR = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            const V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), pe.S(V);
          }, g.DVARP = function(e, t, c) {
            if (isNaN(t) && typeof t != "string") return a;
            const w = wt(e, c);
            let R = [];
            if (typeof t == "string") {
              const K = ge(e, t);
              R = G(e[K]);
            } else R = G(e[t]);
            const V = [];
            return I(w, ((K) => {
              V.push(R[K]);
            })), pe.P(V);
          }, g.EDATE = function(e, t) {
            return (e = Re(e)) instanceof Error ? e : isNaN(t) ? a : (t = parseInt(t, 10), e.setMonth(e.getMonth() + t), e);
          }, g.EFFECT = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e <= 0 || t < 1 ? u : (t = parseInt(t, 10), Math.pow(1 + e / t, t) - 1);
          }, g.EOMONTH = function(e, t) {
            return (e = Re(e)) instanceof Error ? e : isNaN(t) ? a : (t = parseInt(t, 10), new Date(e.getFullYear(), e.getMonth() + t + 1, 0));
          }, g.ERF = Jt, g.ERFC = Zt, g.ERFCPRECISE = Dn, g.ERFPRECISE = Tn, g.ERROR = Ot, g.EVEN = function(e) {
            return (e = W(e)) instanceof Error ? e : Ae(e, -2, -1);
          }, g.EXACT = function(e, t) {
            return arguments.length !== 2 ? v : de(e, t) || (e = Ve(e)) === Ve(t);
          }, g.EXP = function(e) {
            return arguments.length < 1 ? v : arguments.length > 1 ? A : (e = W(e)) instanceof Error ? e : e = Math.exp(e);
          }, g.EXPON = re, g.EXPONDIST = Nn, g.F = te, g.FACT = Ze, g.FACTDOUBLE = function e(t) {
            if ((t = W(t)) instanceof Error) return t;
            const c = Math.floor(t);
            return c <= 0 ? 1 : c * e(c - 2);
          }, g.FALSE = function() {
            return !1;
          }, g.FDIST = On, g.FDISTRT = Bn, g.FIND = function(e, t, c) {
            if (arguments.length < 2) return v;
            e = Ve(e), c = c === void 0 ? 0 : c;
            const w = (t = Ve(t)).indexOf(e, c - 1);
            return w === -1 ? a : w + 1;
          }, g.FINV = Pn, g.FINVRT = Fn, g.FISHER = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.log((1 + e) / (1 - e)) / 2;
          }, g.FISHERINV = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            const t = Math.exp(2 * e);
            return (t - 1) / (t + 1);
          }, g.FIXED = dn, g.FLOOR = Ke, g.FLOORMATH = Vn, g.FLOORPRECISE = Hn, g.FORECAST = P, g.FREQUENCY = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = e.length, w = t.length, R = [];
            for (let V = 0; V <= w; V++) {
              R[V] = 0;
              for (let K = 0; K < c; K++) V === 0 ? e[K] <= t[0] && (R[0] += 1) : V < w ? e[K] > t[V - 1] && e[K] <= t[V] && (R[V] += 1) : V === w && e[K] > t[w - 1] && (R[w] += 1);
            }
            return R;
          }, g.FTEST = qn, g.FV = jt, g.FVSCHEDULE = function(e, t) {
            if (oe(e = W(e), t = Ie(U(t)))) return a;
            const c = t.length;
            let w = e;
            for (let R = 0; R < c; R++) w *= 1 + t[R];
            return w;
          }, g.GAMMA = L, g.GAMMADIST = Un, g.GAMMAINV = Wn, g.GAMMALN = q, g.GAMMALNPRECISE = zn, g.GAUSS = function(e) {
            return (e = W(e)) instanceof Error ? e : b.normal.cdf(e, 0, 1) - 0.5;
          }, g.GCD = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = e.length, c = e[0];
            let w = c < 0 ? -c : c;
            for (let R = 1; R < t; R++) {
              const V = e[R];
              let K = V < 0 ? -V : V;
              for (; w && K; ) w > K ? w %= K : K %= w;
              w += K;
            }
            return w;
          }, g.GEOMEAN = function() {
            const e = Ie(U(arguments));
            return e instanceof Error ? e : b.geomean(e);
          }, g.GESTEP = function(e, t) {
            return oe(t = t || 0, e = W(e)) ? e : e >= t ? 1 : 0;
          }, g.GROWTH = function(e, t, c, w) {
            if ((e = Ie(e)) instanceof Error) return e;
            let R;
            if (t === void 0) for (t = [], R = 1; R <= e.length; R++) t.push(R);
            if (c === void 0) for (c = [], R = 1; R <= e.length; R++) c.push(R);
            if (oe(t = Ie(t), c = Ie(c))) return a;
            w === void 0 && (w = !0);
            const V = e.length;
            let K, ae, ye = 0, _e = 0, Ne = 0, Ue = 0;
            for (R = 0; R < V; R++) {
              const Ge = t[R], Qe = Math.log(e[R]);
              ye += Ge, _e += Qe, Ne += Ge * Qe, Ue += Ge * Ge;
            }
            ye /= V, _e /= V, Ne /= V, Ue /= V, w ? (K = (Ne - ye * _e) / (Ue - ye * ye), ae = _e - K * ye) : (K = Ne / Ue, ae = 0);
            const Fe = [];
            for (R = 0; R < c.length; R++) Fe.push(Math.exp(ae + K * c[R]));
            return Fe;
          }, g.HARMEAN = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = e.length;
            let c = 0;
            for (let w = 0; w < t; w++) c += 1 / e[w];
            return t / c;
          }, g.HEX2BIN = function(e, t) {
            if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return u;
            const c = !(e.length !== 10 || e.substring(0, 1).toLowerCase() !== "f"), w = c ? parseInt(e, 16) - 1099511627776 : parseInt(e, 16);
            if (w < -512 || w > 511) return u;
            if (c) return "1" + ht("0", 9 - (512 + w).toString(2).length) + (512 + w).toString(2);
            const R = w.toString(2);
            return t === void 0 ? R : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= R.length ? ht("0", t - R.length) + R : u;
          }, g.HEX2DEC = function(e) {
            if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return u;
            const t = parseInt(e, 16);
            return t >= 549755813888 ? t - 1099511627776 : t;
          }, g.HEX2OCT = function(e, t) {
            if (!/^[0-9A-Fa-f]{1,10}$/.test(e)) return u;
            const c = parseInt(e, 16);
            if (c > 536870911 && c < 1098974756864) return u;
            if (c >= 1098974756864) return (c - 1098437885952).toString(8);
            const w = c.toString(8);
            return t === void 0 ? w : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= w.length ? ht("0", t - w.length) + w : u;
          }, g.HLOOKUP = function(e, t, c, w) {
            return Lt(e, ie(t), c, w);
          }, g.HOUR = function(e) {
            return (e = Re(e)) instanceof Error ? e : e.getHours();
          }, g.HYPGEOM = Q, g.HYPGEOMDIST = Yn, g.IF = function(e, t, c) {
            return e instanceof Error ? e : ((t = !(arguments.length >= 2) || t) == null && (t = 0), (c = arguments.length === 3 && c) == null && (c = 0), e ? t : c);
          }, g.IFERROR = function(e, t) {
            return _t(e) ? t : e;
          }, g.IFNA = function(e, t) {
            return e === v ? t : e;
          }, g.IFS = function() {
            for (let e = 0; e < arguments.length / 2; e++) if (arguments[2 * e]) return arguments[2 * e + 1];
            return v;
          }, g.IMABS = Qt, g.IMAGINARY = ot, g.IMARGUMENT = en, g.IMCONJUGATE = function(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", c !== 0 ? dt(t, -c, w) : e;
          }, g.IMCOS = zt, g.IMCOSH = fn, g.IMCOT = function(e) {
            return oe(it(e), ot(e)) ? a : It(zt(e), Yt(e));
          }, g.IMCSC = function(e) {
            return e === !0 || e === !1 ? a : oe(it(e), ot(e)) ? u : It("1", Yt(e));
          }, g.IMCSCH = function(e) {
            return e === !0 || e === !1 ? a : oe(it(e), ot(e)) ? u : It("1", pn(e));
          }, g.IMDIV = It, g.IMEXP = function(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            w = w === "i" || w === "j" ? w : "i";
            const R = Math.exp(t);
            return dt(R * Math.cos(c), R * Math.sin(c), w);
          }, g.IMLN = function(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.log(Math.sqrt(t * t + c * c)), Math.atan(c / t), w);
          }, g.IMLOG10 = function(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.log(Math.sqrt(t * t + c * c)) / Math.log(10), Math.atan(c / t) / Math.log(10), w);
          }, g.IMLOG2 = function(e) {
            const t = it(e), c = ot(e);
            if (oe(t, c)) return a;
            let w = e.substring(e.length - 1);
            return w = w === "i" || w === "j" ? w : "i", dt(Math.log(Math.sqrt(t * t + c * c)) / Math.log(2), Math.atan(c / t) / Math.log(2), w);
          }, g.IMPOWER = function(e, t) {
            if (oe(t = W(t), it(e), ot(e))) return a;
            let c = e.substring(e.length - 1);
            c = c === "i" || c === "j" ? c : "i";
            const w = Math.pow(Qt(e), t), R = en(e);
            return dt(w * Math.cos(t * R), w * Math.sin(t * R), c);
          }, g.IMPRODUCT = function() {
            let e = arguments[0];
            if (!arguments.length) return a;
            for (let t = 1; t < arguments.length; t++) {
              const c = it(e), w = ot(e), R = it(arguments[t]), V = ot(arguments[t]);
              if (oe(c, w, R, V)) return a;
              e = dt(c * R - w * V, c * V + w * R);
            }
            return e;
          }, g.IMREAL = it, g.IMSEC = function(e) {
            return e === !0 || e === !1 || oe(it(e), ot(e)) ? a : It("1", zt(e));
          }, g.IMSECH = function(e) {
            return oe(it(e), ot(e)) ? a : It("1", fn(e));
          }, g.IMSIN = Yt, g.IMSINH = pn, g.IMSQRT = function(e) {
            if (oe(it(e), ot(e))) return a;
            let t = e.substring(e.length - 1);
            t = t === "i" || t === "j" ? t : "i";
            const c = Math.sqrt(Qt(e)), w = en(e);
            return dt(c * Math.cos(w / 2), c * Math.sin(w / 2), t);
          }, g.IMSUB = function(e, t) {
            const c = it(e), w = ot(e), R = it(t), V = ot(t);
            if (oe(c, w, R, V)) return a;
            const K = e.substring(e.length - 1), ae = t.substring(t.length - 1);
            let ye = "i";
            return (K === "j" || ae === "j") && (ye = "j"), dt(c - R, w - V, ye);
          }, g.IMSUM = function() {
            if (!arguments.length) return a;
            const e = U(arguments);
            let t = e[0];
            for (let c = 1; c < e.length; c++) {
              const w = it(t), R = ot(t), V = it(e[c]), K = ot(e[c]);
              if (oe(w, R, V, K)) return a;
              t = dt(w + V, R + K);
            }
            return t;
          }, g.IMTAN = function(e) {
            return e === !0 || e === !1 || oe(it(e), ot(e)) ? a : It(Yt(e), zt(e));
          }, g.INDEX = function(e, t, c) {
            const w = de(e, t, c);
            if (w) return w;
            if (!Array.isArray(e)) return a;
            const R = e.length > 0 && !Array.isArray(e[0]);
            return R && !c ? (c = t, t = 1) : (c = c || 1, t = t || 1), c < 0 || t < 0 ? a : R && t === 1 && c <= e.length ? e[c - 1] : t <= e.length && c <= e[t - 1].length ? e[t - 1][c - 1] : h;
          }, g.INFO = function() {
            throw new Error("INFO is not implemented");
          }, g.INT = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.floor(e);
          }, g.INTERCEPT = function(e, t) {
            return oe(e = Ie(e), t = Ie(t)) ? a : e.length !== t.length ? v : P(0, e, t);
          }, g.INTRATE = function() {
            throw new Error("INTRATE is not implemented");
          }, g.IPMT = mn, g.IRR = function(e, t) {
            if (t = t || 0, oe(e = Ie(U(e)), t = W(t))) return a;
            const c = (Fe, Ge, Qe) => {
              const rt = Qe + 1;
              let mt = Fe[0];
              for (let ct = 1; ct < Fe.length; ct++) mt += Fe[ct] / Math.pow(rt, (Ge[ct] - Ge[0]) / 365);
              return mt;
            }, w = (Fe, Ge, Qe) => {
              const rt = Qe + 1;
              let mt = 0;
              for (let ct = 1; ct < Fe.length; ct++) {
                const Ct = (Ge[ct] - Ge[0]) / 365;
                mt -= Ct * Fe[ct] / Math.pow(rt, Ct + 1);
              }
              return mt;
            }, R = [];
            let V = !1, K = !1;
            for (let Fe = 0; Fe < e.length; Fe++) R[Fe] = Fe === 0 ? 0 : R[Fe - 1] + 365, e[Fe] > 0 && (V = !0), e[Fe] < 0 && (K = !0);
            if (!V || !K) return u;
            let ae, ye, _e, Ne = t = t === void 0 ? 0.1 : t, Ue = !0;
            do
              _e = c(e, R, Ne), ae = Ne - _e / w(e, R, Ne), ye = Math.abs(ae - Ne), Ne = ae, Ue = ye > 1e-10 && Math.abs(_e) > 1e-10;
            while (Ue);
            return Ne;
          }, g.ISBLANK = function(e) {
            return e === null;
          }, g.ISERR = Bt, g.ISERROR = _t, g.ISEVEN = function(e) {
            return !(1 & Math.floor(Math.abs(e)));
          }, g.ISFORMULA = function() {
            throw new Error("ISFORMULA is not implemented");
          }, g.ISLOGICAL = Pt, g.ISNA = function(e) {
            return e === v;
          }, g.ISNONTEXT = function(e) {
            return typeof e != "string";
          }, g.ISNUMBER = Et, g.ISO = nt, g.ISODD = function(e) {
            return !!(1 & Math.floor(Math.abs(e)));
          }, g.ISOWEEKNUM = on, g.ISPMT = function(e, t, c, w) {
            return oe(e = W(e), t = W(t), c = W(c), w = W(w)) ? a : w * e * (t / c - 1);
          }, g.ISREF = function() {
            throw new Error("ISREF is not implemented");
          }, g.ISTEXT = Ft, g.KURT = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            const t = b.mean(e), c = e.length;
            let w = 0;
            for (let R = 0; R < c; R++) w += Math.pow(e[R] - t, 4);
            return w /= Math.pow(b.stdev(e, !0), 4), c * (c + 1) / ((c - 1) * (c - 2) * (c - 3)) * w - 3 * (c - 1) * (c - 1) / ((c - 2) * (c - 3));
          }, g.LARGE = le, g.LCM = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            for (var t, c, w, R, V = 1; (w = e.pop()) !== void 0; ) {
              if (w === 0) return 0;
              for (; w > 1; ) {
                if (w % 2) {
                  for (t = 3, c = Math.floor(Math.sqrt(w)); t <= c && w % t; t += 2) ;
                  R = t <= c ? t : w;
                } else R = 2;
                for (w /= R, V *= R, t = e.length; t; e[--t] % R == 0 && (e[t] /= R) == 1 && e.splice(t, 1)) ;
              }
            }
            return V;
          }, g.LEFT = function(e, t) {
            return de(e, t) || (e = Ve(e), (t = W(t = t === void 0 ? 1 : t)) instanceof Error || typeof e != "string" ? a : e.substring(0, t));
          }, g.LEN = function(e) {
            return arguments.length === 0 ? A : e instanceof Error ? e : Array.isArray(e) ? a : Ve(e).length;
          }, g.LINEST = he, g.LN = function(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 ? u : Math.log(e);
          }, g.LOG = function(e, t) {
            return de(e = W(e), t = W(t)) || (e === 0 || t === 0 ? u : Math.log(e) / Math.log(t));
          }, g.LOG10 = function(e) {
            return (e = W(e)) instanceof Error ? e : e === 0 ? u : Math.log(e) / Math.log(10);
          }, g.LOGEST = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t))) || e.length !== t.length) return a;
            for (let w = 0; w < e.length; w++) e[w] = Math.log(e[w]);
            const c = he(e, t);
            return c[0] = Math.round(1e6 * Math.exp(c[0])) / 1e6, c[1] = Math.round(1e6 * Math.exp(c[1])) / 1e6, c;
          }, g.LOGINV = Xn, g.LOGNORM = me, g.LOGNORMDIST = Gn, g.LOGNORMINV = Kn, g.LOOKUP = function(e, t, c) {
            t = U(t), c = c ? U(c) : t;
            const w = typeof e == "number";
            let R = v;
            for (let V = 0; V < t.length; V++) {
              if (t[V] === e) return c[V];
              if (w && t[V] <= e || typeof t[V] == "string" && t[V].localeCompare(e) < 0) R = c[V];
              else if (w && t[V] > e) return R;
            }
            return R;
          }, g.LOWER = function(e) {
            return arguments.length !== 1 ? a : oe(e = Ve(e)) ? e : e.toLowerCase();
          }, g.MATCH = function(e, t, c) {
            if (!e || !t || (arguments.length === 2 && (c = 1), !((t = U(t)) instanceof Array)) || c !== -1 && c !== 0 && c !== 1) return v;
            let w, R;
            for (let V = 0; V < t.length; V++) if (c === 1) {
              if (t[V] === e) return V + 1;
              t[V] < e && (R ? t[V] > R && (w = V + 1, R = t[V]) : (w = V + 1, R = t[V]));
            } else if (c === 0) {
              if (typeof e == "string" && typeof t[V] == "string") {
                const K = e.toLowerCase().replace(/\?/g, ".").replace(/\*/g, ".*").replace(/~/g, "\\");
                if (new RegExp("^" + K + "$").test(t[V].toLowerCase())) return V + 1;
              } else if (t[V] === e) return V + 1;
            } else if (c === -1) {
              if (t[V] === e) return V + 1;
              t[V] > e && (R ? t[V] < R && (w = V + 1, R = t[V]) : (w = V + 1, R = t[V]));
            }
            return w || v;
          }, g.MAX = we, g.MAXA = function() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            let c = O(e);
            return c = c.map(((w) => w ?? 0)), c.length === 0 ? 0 : Math.max.apply(Math, c);
          }, g.MDURATION = function() {
            throw new Error("MDURATION is not implemented");
          }, g.MEDIAN = Le, g.MID = function(e, t, c) {
            if (t == null) return a;
            if (oe(t = W(t), c = W(c)) || typeof e != "string") return c;
            const w = t - 1, R = w + c;
            return e.substring(w, R);
          }, g.MIN = De, g.MINA = function() {
            const e = U(arguments), t = de.apply(void 0, e);
            if (t) return t;
            let c = O(e);
            return c = c.map(((w) => w ?? 0)), c.length === 0 ? 0 : Math.min.apply(Math, c);
          }, g.MINUTE = function(e) {
            return (e = Re(e)) instanceof Error ? e : e.getMinutes();
          }, g.MIRR = function(e, t, c) {
            if (oe(e = Ie(U(e)), t = W(t), c = W(c))) return a;
            const w = e.length, R = [], V = [];
            for (let ye = 0; ye < w; ye++) e[ye] < 0 ? R.push(e[ye]) : V.push(e[ye]);
            const K = -sn(c, V) * Math.pow(1 + c, w - 1), ae = sn(t, R) * (1 + t);
            return Math.pow(K / ae, 1 / (w - 1)) - 1;
          }, g.MMULT = function(e, t) {
            return !Array.isArray(e) || !Array.isArray(t) || e.some(((c) => !c.length)) || t.some(((c) => !c.length)) || ue(e).some(((c) => typeof c != "number")) || ue(t).some(((c) => typeof c != "number")) || e[0].length !== t.length ? a : Array(e.length).fill(0).map((() => Array(t[0].length).fill(0))).map(((c, w) => c.map(((R, V) => e[w].reduce(((K, ae, ye) => K + ae * t[ye][V]), 0)))));
          }, g.MOD = function(e, t) {
            const c = de(e = W(e), t = W(t));
            if (c) return c;
            if (t === 0) return l;
            let w = Math.abs(e % t);
            return w = e < 0 ? t - w : w, t > 0 ? w : -w;
          }, g.MODE = Te, g.MODEMULT = $n, g.MODESNGL = Jn, g.MONTH = function(e) {
            return (e = Re(e)) instanceof Error ? e : e.getMonth() + 1;
          }, g.MROUND = function(e, t) {
            return de(e = W(e), t = W(t)) || (e * t == 0 ? 0 : e * t < 0 ? u : Math.round(e / t) * t);
          }, g.MULTINOMIAL = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            let t = 0, c = 1;
            for (let w = 0; w < e.length; w++) t += e[w], c *= Ze(e[w]);
            return Ze(t) / c;
          }, g.MUNIT = function(e) {
            return arguments.length > 1 ? v : !(e = parseInt(e)) || e <= 0 ? a : Array(e).fill(0).map((() => Array(e).fill(0))).map(((t, c) => (t[c] = 1, t)));
          }, g.N = function(e) {
            return Et(e) ? e : e instanceof Date ? e.getTime() : e === !0 ? 1 : e === !1 ? 0 : _t(e) ? e : 0;
          }, g.NA = function() {
            return v;
          }, g.NEGBINOM = Xe, g.NEGBINOMDIST = Zn, g.NETWORKDAYS = qt, g.NETWORKDAYSINTL = Qn, g.NOMINAL = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : e <= 0 || t < 1 ? u : (t = parseInt(t, 10), (Math.pow(e + 1, 1 / t) - 1) * t);
          }, g.NORM = qe, g.NORMDIST = er, g.NORMINV = tr, g.NORMSDIST = nr, g.NORMSINV = rr, g.NOT = function(e) {
            return typeof e == "string" ? a : e instanceof Error ? e : !e;
          }, g.NOW = function() {
            return /* @__PURE__ */ new Date();
          }, g.NPER = function(e, t, c, w, R) {
            if (R = R === void 0 ? 0 : R, w = w === void 0 ? 0 : w, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R))) return a;
            if (e === 0) return -(c + w) / t;
            {
              const V = t * (1 + e * R) - w * e, K = c * e + t * (1 + e * R);
              return Math.log(V / K) / Math.log(1 + e);
            }
          }, g.NPV = sn, g.NUMBERVALUE = function(e, t, c) {
            return typeof (e = Se(e) ? e : "") == "number" ? e : typeof e != "string" ? v : (t = t === void 0 ? "." : t, c = c === void 0 ? "," : c, Number(e.replace(t, ".").replace(c, "")));
          }, g.OCT2BIN = function(e, t) {
            if (!/^[0-7]{1,10}$/.test(e)) return u;
            const c = !(e.length !== 10 || e.substring(0, 1) !== "7"), w = c ? parseInt(e, 8) - 1073741824 : parseInt(e, 8);
            if (w < -512 || w > 511) return u;
            if (c) return "1" + ht("0", 9 - (512 + w).toString(2).length) + (512 + w).toString(2);
            const R = w.toString(2);
            return t === void 0 ? R : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= R.length ? ht("0", t - R.length) + R : u;
          }, g.OCT2DEC = function(e) {
            if (!/^[0-7]{1,10}$/.test(e)) return u;
            const t = parseInt(e, 8);
            return t >= 536870912 ? t - 1073741824 : t;
          }, g.OCT2HEX = function(e, t) {
            if (!/^[0-7]{1,10}$/.test(e)) return u;
            const c = parseInt(e, 8);
            if (c >= 536870912) return "ff" + (c + 3221225472).toString(16);
            const w = c.toString(16);
            return t === void 0 ? w : isNaN(t) ? a : t < 0 ? u : (t = Math.floor(t)) >= w.length ? ht("0", t - w.length) + w : u;
          }, g.ODD = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            let t = Math.ceil(Math.abs(e));
            return t = 1 & t ? t : t + 1, e >= 0 ? t : -t;
          }, g.ODDFPRICE = function() {
            throw new Error("ODDFPRICE is not implemented");
          }, g.ODDFYIELD = function() {
            throw new Error("ODDFYIELD is not implemented");
          }, g.ODDLPRICE = function() {
            throw new Error("ODDLPRICE is not implemented");
          }, g.ODDLYIELD = function() {
            throw new Error("ODDLYIELD is not implemented");
          }, g.OR = function() {
            const e = U(arguments);
            let t = a;
            for (let c = 0; c < e.length; c++) {
              if (e[c] instanceof Error) return e[c];
              e[c] !== void 0 && e[c] !== null && typeof e[c] != "string" && (t === a && (t = !1), e[c] && (t = !0));
            }
            return t;
          }, g.PDURATION = function(e, t, c) {
            return oe(e = W(e), t = W(t), c = W(c)) ? a : e <= 0 ? u : (Math.log(c) - Math.log(t)) / Math.log(1 + e);
          }, g.PEARSON = se, g.PERCENTILE = ve, g.PERCENTILEEXC = sr, g.PERCENTILEINC = or, g.PERCENTRANK = je, g.PERCENTRANKEXC = ir, g.PERCENTRANKINC = ar, g.PERMUT = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : Ze(e) / Ze(e - t);
          }, g.PERMUTATIONA = function(e, t) {
            return oe(e = W(e), t = W(t)) ? a : Math.pow(e, t);
          }, g.PHI = function(e) {
            return (e = W(e)) instanceof Error ? a : Math.exp(-0.5 * e * e) / 2.5066282746310002;
          }, g.PI = function() {
            return Math.PI;
          }, g.PMT = Nt, g.POISSON = X, g.POISSONDIST = lr, g.POWER = Dt, g.PPMT = function(e, t, c, w, R, V) {
            return R = R || 0, V = V || 0, oe(e = W(e), c = W(c), w = W(w), R = W(R), V = W(V)) ? a : Nt(e, c, w, R, V) - mn(e, t, c, w, R, V);
          }, g.PRICE = function() {
            throw new Error("PRICE is not implemented");
          }, g.PRICEDISC = function(e, t, c, w, R) {
            if (oe(e = Re(e), t = Re(t), c = W(c), w = W(w), R = (R = W(R)) || 0)) return a;
            if (c <= 0 || w <= 0) return u;
            if (e >= t) return a;
            let V, K;
            switch (R) {
              case 0:
                V = 360, K = xt(e, t, !1);
                break;
              case 1:
              case 3:
                V = 365, K = Tt(e, t, "D");
                break;
              case 2:
                V = 360, K = Tt(e, t, "D");
                break;
              case 4:
                V = 360, K = xt(e, t, !0);
                break;
              default:
                return u;
            }
            return w - c * w * K / V;
          }, g.PRICEMAT = function() {
            throw new Error("PRICEMAT is not implemented");
          }, g.PROB = function(e, t, c, w) {
            if (c === void 0) return 0;
            if (w = w === void 0 ? c : w, oe(e = Ie(U(e)), t = Ie(U(t)), c = W(c), w = W(w))) return a;
            if (c === w) return e.indexOf(c) >= 0 ? t[e.indexOf(c)] : 0;
            const R = e.sort(((ae, ye) => ae - ye)), V = R.length;
            let K = 0;
            for (let ae = 0; ae < V; ae++) R[ae] >= c && R[ae] <= w && (K += t[e.indexOf(R[ae])]);
            return K;
          }, g.PRODUCT = Xt, g.PRONETIC = function() {
            throw new Error("PRONETIC is not implemented");
          }, g.PROPER = function(e) {
            return oe(e) ? e : isNaN(e) && typeof e == "number" ? a : (e = Ve(e)).replace(/\w\S*/g, ((t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()));
          }, g.PV = function(e, t, c, w, R) {
            return w = w || 0, R = R || 0, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R)) ? a : e === 0 ? -c * t - w : ((1 - Math.pow(1 + e, t)) / e * c * (1 + e * R) - w) / Math.pow(1 + e, t);
          }, g.QUARTILE = ee, g.QUARTILEEXC = cr, g.QUARTILEINC = ur, g.QUOTIENT = function(e, t) {
            return de(e = W(e), t = W(t)) || parseInt(e / t, 10);
          }, g.RADIANS = function(e) {
            return (e = W(e)) instanceof Error ? e : e * Math.PI / 180;
          }, g.RAND = function() {
            return Math.random();
          }, g.RANDBETWEEN = function(e, t) {
            return de(e = W(e), t = W(t)) || e + Math.ceil((t - e + 1) * Math.random()) - 1;
          }, g.RANK = C, g.RANKAVG = dr, g.RANKEQ = fr, g.RATE = function(e, t, c, w, R, V) {
            if (V = V === void 0 ? 0.01 : V, w = w === void 0 ? 0 : w, R = R === void 0 ? 0 : R, oe(e = W(e), t = W(t), c = W(c), w = W(w), R = W(R), V = W(V))) return a;
            const K = 1e-10;
            let ae = V;
            R = R ? 1 : 0;
            for (let ye = 0; ye < 20; ye++) {
              if (ae <= -1) return u;
              let _e, Ne, Ue;
              if (Math.abs(ae) < K ? _e = c * (1 + e * ae) + t * (1 + ae * R) * e + w : (Ne = Math.pow(1 + ae, e), _e = c * Ne + t * (1 / ae + R) * (Ne - 1) + w), Math.abs(_e) < K) return ae;
              if (Math.abs(ae) < K) Ue = c * e + t * R * e;
              else {
                Ne = Math.pow(1 + ae, e);
                const Fe = e * Math.pow(1 + ae, e - 1);
                Ue = c * Fe + t * (1 / ae + R) * Fe + t * (-1 / (ae * ae)) * (Ne - 1);
              }
              ae -= _e / Ue;
            }
            return ae;
          }, g.RECEIVED = function() {
            throw new Error("RECEIVED is not implemented");
          }, g.REPLACE = function(e, t, c, w) {
            return oe(t = W(t), c = W(c)) || typeof e != "string" || typeof w != "string" ? a : e.substr(0, t - 1) + w + e.substr(t - 1 + c);
          }, g.REPT = ht, g.RIGHT = function(e, t) {
            return de(e, t) || (e = Ve(e), (t = W(t = t === void 0 ? 1 : t)) instanceof Error ? t : e.substring(e.length - t));
          }, g.ROMAN = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            const t = String(e).split(""), c = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
            let w = "", R = 3;
            for (; R--; ) w = (c[+t.pop() + 10 * R] || "") + w;
            return new Array(+t.join("") + 1).join("M") + w;
          }, g.ROUND = bt, g.ROUNDDOWN = function(e, t) {
            return de(e = W(e), t = W(t)) || (e > 0 ? 1 : -1) * Math.floor(Math.abs(e) * Math.pow(10, t)) / Math.pow(10, t);
          }, g.ROUNDUP = function(e, t) {
            return de(e = W(e), t = W(t)) || (e > 0 ? 1 : -1) * Math.ceil(Math.abs(e) * Math.pow(10, t)) / Math.pow(10, t);
          }, g.ROW = function(e, t) {
            return arguments.length !== 2 ? v : t < 0 ? u : e instanceof Array && typeof t == "number" ? e.length !== 0 ? b.row(e, t) : void 0 : a;
          }, g.ROWS = function(e) {
            return arguments.length !== 1 ? v : e instanceof Array ? e.length === 0 ? 0 : b.rows(e) : a;
          }, g.RRI = function(e, t, c) {
            return oe(e = W(e), t = W(t), c = W(c)) ? a : e === 0 || t === 0 ? u : Math.pow(c / t, 1 / e) - 1;
          }, g.RSQ = function(e, t) {
            return oe(e = Ie(U(e)), t = Ie(U(t))) ? a : Math.pow(se(e, t), 2);
          }, g.SEARCH = function(e, t, c) {
            let w;
            return typeof e != "string" || typeof t != "string" ? a : (c = c === void 0 ? 0 : c, w = t.toLowerCase().indexOf(e.toLowerCase(), c - 1) + 1, w === 0 ? a : w);
          }, g.SEC = function(e) {
            return (e = W(e)) instanceof Error ? e : 1 / Math.cos(e);
          }, g.SECH = function(e) {
            return (e = W(e)) instanceof Error ? e : 2 / (Math.exp(e) + Math.exp(-e));
          }, g.SECOND = function(e) {
            return (e = Re(e)) instanceof Error ? e : e.getSeconds();
          }, g.SERIESSUM = function(e, t, c, w) {
            if (oe(e = W(e), t = W(t), c = W(c), w = Ie(w))) return a;
            let R = w[0] * Math.pow(e, t);
            for (let V = 1; V < w.length; V++) R += w[V] * Math.pow(e, t + V * c);
            return R;
          }, g.SHEET = function() {
            throw new Error("SHEET is not implemented");
          }, g.SHEETS = function() {
            throw new Error("SHEETS is not implemented");
          }, g.SIGN = function(e) {
            return (e = W(e)) instanceof Error ? e : e < 0 ? -1 : e === 0 ? 0 : 1;
          }, g.SIN = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.sin(e);
          }, g.SINH = function(e) {
            return (e = W(e)) instanceof Error ? e : (Math.exp(e) - Math.exp(-e)) / 2;
          }, g.SKEW = F, g.SKEWP = pr, g.SLN = function(e, t, c) {
            return oe(e = W(e), t = W(t), c = W(c)) ? a : c === 0 ? u : (e - t) / c;
          }, g.SLOPE = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = b.mean(t), w = b.mean(e), R = t.length;
            let V = 0, K = 0;
            for (let ae = 0; ae < R; ae++) V += (t[ae] - c) * (e[ae] - w), K += Math.pow(t[ae] - c, 2);
            return V / K;
          }, g.SMALL = Z, g.SORT = function(e, t = 1, c = 1, w = !1) {
            if (!e || !Array.isArray(e)) return v;
            if (e.length === 0) return 0;
            if (!(t = W(t)) || t < 1 || (c = W(c)) !== 1 && c !== -1) return a;
            if (typeof (w = Be(w)) != "boolean") return p;
            const R = (ae) => ae.sort(((ye, _e) => (ye = Ve(ye[t - 1]), _e = Ve(_e[t - 1]), c === 1 ? ye < _e ? -1 * c : c : ye > _e ? c : -1 * c))), V = Y(e), K = w ? ie(V) : V;
            return t >= 1 && t <= K[0].length ? w ? ie(R(K)) : R(K) : a;
          }, g.SQRT = function(e) {
            return (e = W(e)) instanceof Error ? e : e < 0 ? u : Math.sqrt(e);
          }, g.SQRTPI = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.sqrt(e * Math.PI);
          }, g.STANDARDIZE = function(e, t, c) {
            return oe(e = W(e), t = W(t), c = W(c)) ? a : (e - t) / c;
          }, g.STDEV = fe, g.STDEVA = function() {
            const e = Ee.apply(this, arguments);
            return Math.sqrt(e);
          }, g.STDEVP = mr, g.STDEVPA = function() {
            const e = ne.apply(this, arguments);
            let t = Math.sqrt(e);
            return isNaN(t) && (t = u), t;
          }, g.STDEVS = hr, g.STEYX = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            const c = b.mean(t), w = b.mean(e), R = t.length;
            let V = 0, K = 0, ae = 0;
            for (let ye = 0; ye < R; ye++) V += Math.pow(e[ye] - w, 2), K += (t[ye] - c) * (e[ye] - w), ae += Math.pow(t[ye] - c, 2);
            return Math.sqrt((V - K * K / ae) / (R - 2));
          }, g.SUBSTITUTE = function(e, t, c, w) {
            if (arguments.length < 3) return v;
            if (e && t) {
              if (w === void 0) return e.split(t).join(c);
              {
                if (w = Math.floor(Number(w)), Number.isNaN(w) || w <= 0) return a;
                let R = 0, V = 0;
                for (; R > -1 && e.indexOf(t, R) > -1; ) if (R = e.indexOf(t, R + 1), V++, R > -1 && V === w) return e.substring(0, R) + c + e.substring(R + t.length);
                return e;
              }
            }
            return e;
          }, g.SUBTOTAL = function(e, t) {
            if ((e = W(e)) instanceof Error) return e;
            switch (e) {
              case 1:
              case 101:
                return kt(t);
              case 2:
              case 102:
                return S(t);
              case 3:
              case 103:
                return f(t);
              case 4:
              case 104:
                return we(t);
              case 5:
              case 105:
                return De(t);
              case 6:
              case 106:
                return Xt(t);
              case 7:
              case 107:
                return fe.S(t);
              case 8:
              case 108:
                return fe.P(t);
              case 9:
              case 109:
                return vt(t);
              case 10:
              case 110:
                return pe.S(t);
              case 11:
              case 111:
                return pe.P(t);
            }
          }, g.SUM = vt, g.SUMIF = function(e, t, c) {
            if (e = U(e), c = c ? U(c) : e, e instanceof Error) return e;
            if (t == null || t instanceof Error) return 0;
            let w = 0;
            const R = t === "*", V = R ? null : ft(t + "");
            for (let K = 0; K < e.length; K++) {
              const ae = e[K], ye = c[K];
              if (R) w += ae;
              else {
                const _e = [at(ae, tt)].concat(V);
                w += pt(_e) ? ye : 0;
              }
            }
            return w;
          }, g.SUMIFS = function() {
            const e = T(arguments), t = Ie(U(e.shift()));
            if (t instanceof Error) return t;
            const c = e, w = c.length / 2;
            for (let V = 0; V < w; V++) c[2 * V] = U(c[2 * V]);
            let R = 0;
            for (let V = 0; V < t.length; V++) {
              let K = !1;
              for (let ae = 0; ae < w; ae++) {
                const ye = c[2 * ae][V], _e = c[2 * ae + 1];
                let Ne = !1;
                if (_e === void 0 || _e === "*") Ne = !0;
                else {
                  const Ue = ft(_e + ""), Fe = [at(ye, tt)].concat(Ue);
                  Ne = pt(Fe);
                }
                if (!Ne) {
                  K = !1;
                  break;
                }
                K = !0;
              }
              K && (R += t[V]);
            }
            return R;
          }, g.SUMPRODUCT = function() {
            if (!arguments || arguments.length === 0) return a;
            const e = arguments.length + 1;
            let t, c, w, R, V = 0;
            for (let K = 0; K < arguments[0].length; K++) if (arguments[0][K] instanceof Array) for (let ae = 0; ae < arguments[0][K].length; ae++) {
              for (t = 1, c = 1; c < e; c++) {
                const ye = arguments[c - 1][K][ae];
                if (ye instanceof Error) return ye;
                if (R = W(ye), R instanceof Error) return R;
                t *= R;
              }
              V += t;
            }
            else {
              for (t = 1, c = 1; c < e; c++) {
                const ae = arguments[c - 1][K];
                if (ae instanceof Error) return ae;
                if (w = W(ae), w instanceof Error) return w;
                t *= w;
              }
              V += t;
            }
            return V;
          }, g.SUMSQ = function() {
            const e = Ie(U(arguments));
            if (e instanceof Error) return e;
            let t = 0;
            const c = e.length;
            for (let w = 0; w < c; w++) t += Et(e[w]) ? e[w] * e[w] : 0;
            return t;
          }, g.SUMX2MY2 = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            let c = 0;
            for (let w = 0; w < e.length; w++) c += e[w] * e[w] - t[w] * t[w];
            return c;
          }, g.SUMX2PY2 = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            let c = 0;
            e = Ie(U(e)), t = Ie(U(t));
            for (let w = 0; w < e.length; w++) c += e[w] * e[w] + t[w] * t[w];
            return c;
          }, g.SUMXMY2 = function(e, t) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)))) return a;
            let c = 0;
            e = U(e), t = U(t);
            for (let w = 0; w < e.length; w++) c += Math.pow(e[w] - t[w], 2);
            return c;
          }, g.SWITCH = function() {
            let e;
            if (arguments.length > 0) {
              const t = arguments[0], c = arguments.length - 1, w = Math.floor(c / 2);
              let R = !1;
              const V = c % 2 != 0, K = c % 2 == 0 ? null : arguments[arguments.length - 1];
              if (w) {
                for (let ae = 0; ae < w; ae++) if (t === arguments[2 * ae + 1]) {
                  e = arguments[2 * ae + 2], R = !0;
                  break;
                }
              }
              R || (e = V ? K : v);
            } else e = a;
            return e;
          }, g.SYD = function(e, t, c, w) {
            return oe(e = W(e), t = W(t), c = W(c), w = W(w)) ? a : c === 0 || w < 1 || w > c ? u : (e - t) * (c - (w = parseInt(w, 10)) + 1) * 2 / (c * (c + 1));
          }, g.T = function(e) {
            return e instanceof Error || typeof e == "string" ? e : "";
          }, g.TAN = function(e) {
            return (e = W(e)) instanceof Error ? e : Math.tan(e);
          }, g.TANH = function(e) {
            if ((e = W(e)) instanceof Error) return e;
            const t = Math.exp(2 * e);
            return (t - 1) / (t + 1);
          }, g.TBILLEQ = function(e, t, c) {
            return oe(e = Re(e), t = Re(t), c = W(c)) ? a : c <= 0 || e > t || t - e > 31536e6 ? u : 365 * c / (360 - c * xt(e, t, !1));
          }, g.TBILLPRICE = function(e, t, c) {
            return oe(e = Re(e), t = Re(t), c = W(c)) ? a : c <= 0 || e > t || t - e > 31536e6 ? u : 100 * (1 - c * xt(e, t, !1) / 360);
          }, g.TBILLYIELD = function(e, t, c) {
            return oe(e = Re(e), t = Re(t), c = W(c)) ? a : c <= 0 || e > t || t - e > 31536e6 ? u : 360 * (100 - c) / (c * xt(e, t, !1));
          }, g.TDIST = gr, g.TDISTRT = br, g.TEXT = function(e, t) {
            if (e === void 0 || e instanceof Error || t instanceof Error) return v;
            if (t == null) return "";
            if (typeof t == "number") return String(t);
            if (typeof t != "string") return a;
            const c = t.startsWith("$") ? "$" : "", w = t.endsWith("%");
            return w && (e *= 100), e = (e = dn(e, (t = t.replace(/%/g, "").replace(/\$/g, "")).split(".")[1].match(/0/g).length, !t.includes(","))).startsWith("-") ? "-" + c + (e = e.replace("-", "")) : c + e, w && (e += "%"), e;
          }, g.TEXTJOIN = function(e, t, ...c) {
            if (typeof t != "boolean" && (t = Be(t)), arguments.length < 3) return v;
            e = e ?? "";
            let w = U(c), R = t ? w.filter(((V) => V)) : w;
            if (Array.isArray(e)) {
              e = U(e);
              let V = R.map(((ae) => [ae])), K = 0;
              for (let ae = 0; ae < V.length - 1; ae++) V[ae].push(e[K]), K++, K === e.length && (K = 0);
              return R = U(V), R.join("");
            }
            return R.join(e);
          }, g.TIME = function(e, t, c) {
            return oe(e = W(e), t = W(t), c = W(c)) ? a : e < 0 || t < 0 || c < 0 ? u : (3600 * e + 60 * t + c) / 86400;
          }, g.TIMEVALUE = function(e) {
            return (e = Re(e)) instanceof Error ? e : (3600 * e.getHours() + 60 * e.getMinutes() + e.getSeconds()) / 86400;
          }, g.TINV = vr, g.TODAY = function() {
            return Ht(/* @__PURE__ */ new Date());
          }, g.TRANSPOSE = function(e) {
            return e ? ie(Y(e)) : v;
          }, g.TREND = function(e, t, c) {
            if (oe(e = Ie(U(e)), t = Ie(U(t)), c = Ie(U(c)))) return a;
            const w = he(e, t), R = w[0], V = w[1], K = [];
            return c.forEach(((ae) => {
              K.push(R * ae + V);
            })), K;
          }, g.TRIM = function(e) {
            return (e = Ve(e)) instanceof Error ? e : e.replace(/\s+/g, " ").trim();
          }, g.TRIMMEAN = function(e, t) {
            if (oe(e = Ie(U(e)), t = W(t))) return a;
            const c = Ke(e.length * t, 2) / 2;
            return b.mean((R = (R = c) || 1, (w = G(e.sort(((V, K) => V - K)), c)) && typeof w.slice == "function" ? w.slice(0, w.length - R) : w));
            var w, R;
          }, g.TRUE = function() {
            return !0;
          }, g.TRUNC = function(e, t) {
            return de(e = W(e), t = W(t)) || (e > 0 ? 1 : -1) * Math.floor(Math.abs(e) * Math.pow(10, t)) / Math.pow(10, t);
          }, g.TTEST = yr, g.TYPE = function(e) {
            return Et(e) ? 1 : Ft(e) ? 2 : Pt(e) ? 4 : _t(e) ? 16 : Array.isArray(e) ? 64 : void 0;
          }, g.UNICHAR = bn, g.UNICODE = vn, g.UNIQUE = Mt, g.UPPER = function(e) {
            return (e = Ve(e)) instanceof Error ? e : e.toUpperCase();
          }, g.VALUE = function(e) {
            const t = de(e);
            if (t) return t;
            if (typeof e == "number") return e;
            if (Se(e) || (e = ""), typeof e != "string") return a;
            const c = /(%)$/.test(e) || /^(%)/.test(e);
            if ((e = (e = (e = e.replace(/^[^0-9-]{0,3}/, "")).replace(/[^0-9]{0,3}$/, "")).replace(/[ ,]/g, "")) === "") return 0;
            let w = Number(e);
            return isNaN(w) ? a : (w = w || 0, c && (w *= 0.01), w);
          }, g.VAR = pe, g.VARA = Ee, g.VARP = wr, g.VARPA = ne, g.VARS = kr, g.VDB = function() {
            throw new Error("VDB is not implemented");
          }, g.VLOOKUP = Lt, g.WEEKDAY = function(e, t) {
            if ((e = Re(e)) instanceof Error) return e;
            t === void 0 && (t = 1);
            const c = e.getDay();
            return hn[t][c];
          }, g.WEEKNUM = function(e, t) {
            if ((e = Re(e)) instanceof Error) return e;
            if (t === void 0 && (t = 1), t === 21) return on(e);
            const c = Je[t];
            let w = new Date(e.getFullYear(), 0, 1);
            const R = w.getDay() < c ? 1 : 0;
            return w -= 24 * Math.abs(w.getDay() - c) * 60 * 60 * 1e3, Math.floor((e - w) / 864e5 / 7 + 1) + R;
          }, g.WEIBULL = ce, g.WEIBULLDIST = xr, g.WORKDAY = Ut, g.WORKDAYINTL = Cr, g.XIRR = function(e, t, c) {
            if (oe(e = Ie(U(e)), t = $e(U(t)), c = W(c))) return a;
            const w = (Fe, Ge, Qe) => {
              const rt = Qe + 1;
              let mt = Fe[0];
              for (let ct = 1; ct < Fe.length; ct++) mt += Fe[ct] / Math.pow(rt, At(Ge[ct], Ge[0]) / 365);
              return mt;
            }, R = (Fe, Ge, Qe) => {
              const rt = Qe + 1;
              let mt = 0;
              for (let ct = 1; ct < Fe.length; ct++) {
                const Ct = At(Ge[ct], Ge[0]) / 365;
                mt -= Ct * Fe[ct] / Math.pow(rt, Ct + 1);
              }
              return mt;
            };
            let V = !1, K = !1;
            for (let Fe = 0; Fe < e.length; Fe++) e[Fe] > 0 && (V = !0), e[Fe] < 0 && (K = !0);
            if (!V || !K) return u;
            let ae, ye, _e, Ne = c = c || 0.1, Ue = !0;
            do
              _e = w(e, t, Ne), ae = Ne - _e / R(e, t, Ne), ye = Math.abs(ae - Ne), Ne = ae, Ue = ye > 1e-10 && Math.abs(_e) > 1e-10;
            while (Ue);
            return Ne;
          }, g.XNPV = function(e, t, c) {
            if (oe(e = W(e), t = Ie(U(t)), c = $e(U(c)))) return a;
            let w = 0;
            for (let R = 0; R < t.length; R++) w += t[R] / Math.pow(1 + e, At(c[R], c[0]) / 365);
            return w;
          }, g.XOR = function() {
            const e = U(arguments);
            let t = a;
            for (let c = 0; c < e.length; c++) {
              if (e[c] instanceof Error) return e[c];
              e[c] !== void 0 && e[c] !== null && typeof e[c] != "string" && (t === a && (t = 0), e[c] && t++);
            }
            return t === a ? t : !!(1 & Math.floor(Math.abs(t)));
          }, g.YEAR = function(e) {
            return (e = Re(e)) instanceof Error ? e : e.getFullYear();
          }, g.YEARFRAC = Kt, g.YIELD = function() {
            throw new Error("YIELD is not implemented");
          }, g.YIELDDISC = function() {
            throw new Error("YIELDDISC is not implemented");
          }, g.YIELDMAT = function() {
            throw new Error("YIELDMAT is not implemented");
          }, g.Z = ke, g.ZTEST = Er, g.utils = Ar;
        } }, k = {};
        function j(B) {
          var g = k[B];
          if (g !== void 0) return g.exports;
          var o = k[B] = { exports: {} };
          return d[B].call(o.exports, o, o.exports, j), o.exports;
        }
        j.g = (function() {
          if (typeof globalThis == "object") return globalThis;
          try {
            return this || new Function("return this")();
          } catch {
            if (typeof window == "object") return window;
          }
        })();
        var z = j(960);
        s = z;
      })(), s;
    }));
  })(dist$2)), dist$2.exports;
}
var dist = dist$3.exports, hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, (function(module, exports) {
    if (!jSuites && typeof commonjsRequire == "function")
      var jSuites = requireJsuites();
    if (!formula && typeof commonjsRequire == "function")
      var formula = requireDist$1();
    (function(n, m) {
      module.exports = m();
    })(dist, (function() {
      var jspreadsheet;
      return (function() {
        var __webpack_modules__ = { 805: function(n, m) {
          const s = function(j) {
            const z = this, B = [];
            for (let g = 0; g < j.length; g++) {
              const o = j[g].x, b = j[g].y, D = z.options.columns[o].name ? z.options.columns[o].name : o;
              B[b] || (B[b] = { row: b, data: {} }), B[b].data[D] = j[g].value;
            }
            return B.filter((function(g) {
              return g != null;
            }));
          }, d = function(j, z) {
            const B = this, g = k.call(B.parent, "onbeforesave", B.parent, B, z);
            if (g) z = g;
            else if (g === !1) return !1;
            jSuites.ajax({ url: j, method: "POST", dataType: "json", data: { data: JSON.stringify(z) }, success: function(o) {
              k.call(B, "onsave", B.parent, B, z);
            } });
          }, k = function(j) {
            const z = this;
            let B = null, g = z.parent ? z.parent : z;
            if (!g.ignoreEvents && (typeof g.config.onevent == "function" && (B = g.config.onevent.apply(this, arguments)), typeof g.config[j] == "function" && (B = g.config[j].apply(this, Array.prototype.slice.call(arguments, 1))), typeof g.plugins == "object")) {
              const o = Object.keys(g.plugins);
              for (let b = 0; b < o.length; b++) {
                const D = o[b], _ = g.plugins[D];
                typeof _.onevent == "function" && (B = _.onevent.apply(this, arguments));
              }
            }
            if (j == "onafterchanges") {
              const o = arguments;
              if (typeof g.plugins == "object" && Object.entries(g.plugins).forEach((function([, b]) {
                typeof b.persistence == "function" && b.persistence(z, "setValue", { data: o[2] });
              })), z.options.persistence) {
                const b = z.options.persistence == 1 ? z.options.url : z.options.persistence, D = s.call(z, arguments[2]);
                d.call(z, b, D);
              }
            }
            return B;
          };
          m.A = k;
        }, 829: function(n, m, s) {
          s.d(m, { F8: function() {
            return z;
          }, N$: function() {
            return j;
          }, dr: function() {
            return B;
          } });
          var d = s(530), k = s(657);
          const j = function(g) {
            const o = this;
            if (o.options.filters) {
              g = parseInt(g), o.resetSelection();
              let b = [];
              if (o.options.columns[g].type == "checkbox") b.push({ id: "true", name: "True" }), b.push({ id: "false", name: "False" });
              else {
                const l = [];
                let a = !1;
                for (let p = 0; p < o.options.data.length; p++) {
                  const u = o.options.data[p][g], v = o.records[p][g].element.innerHTML;
                  u && v ? l[u] = v : a = !0;
                }
                const h = Object.keys(l);
                b = [];
                for (let p = 0; p < h.length; p++) b.push({ id: h[p], name: l[h[p]] });
                a && b.push({ value: "", id: "", name: "(Blanks)" });
              }
              const D = document.createElement("div");
              o.filter.children[g + 1].innerHTML = "", o.filter.children[g + 1].appendChild(D), o.filter.children[g + 1].style.paddingLeft = "0px", o.filter.children[g + 1].style.paddingRight = "0px", o.filter.children[g + 1].style.overflow = "initial";
              const _ = { data: b, multiple: !0, autocomplete: !0, opened: !0, value: o.filters[g] !== void 0 ? o.filters[g] : null, width: "100%", position: o.options.tableOverflow == 1 || o.parent.config.fullscreen == 1, onclose: function(l) {
                B.call(o), o.filters[g] = l.dropdown.getValue(!0), o.filter.children[g + 1].innerHTML = l.dropdown.getText(), o.filter.children[g + 1].style.paddingLeft = "", o.filter.children[g + 1].style.paddingRight = "", o.filter.children[g + 1].style.overflow = "", z.call(o, g), k.G9.call(o);
              } };
              jSuites.dropdown(D, _);
            } else console.log("Jspreadsheet: filters not enabled.");
          }, z = function(g) {
            const o = this;
            if (!g) for (let _ = 0; _ < o.filter.children.length; _++) o.filters[_] && (g = _);
            const b = function(_, l, a) {
              for (let h = 0; h < _.length; h++) {
                const p = "" + o.options.data[a][l], u = "" + o.records[a][l].element.innerHTML;
                if (_[h] == p || _[h] == u) return !0;
              }
              return !1;
            }, D = o.filters[g];
            o.results = [];
            for (let _ = 0; _ < o.options.data.length; _++) b(D, g, _) && o.results.push(_);
            o.results.length || (o.results = null), d.hG.call(o);
          }, B = function() {
            const g = this;
            if (g.options.filters) for (let o = 0; o < g.filter.children.length; o++) g.filter.children[o].innerHTML = "&nbsp;", g.filters[o] = null;
            g.results = null, d.hG.call(g);
          };
        }, 160: function(n, m, s) {
          s.d(m, { e: function() {
            return k;
          } });
          var d = s(530);
          const k = function(j) {
            const z = this;
            if (j && (z.options.footers = j), z.options.footers) {
              z.tfoot || (z.tfoot = document.createElement("tfoot"), z.table.appendChild(z.tfoot));
              for (let B = 0; B < z.options.footers.length; B++) {
                let g;
                if (z.tfoot.children[B]) g = z.tfoot.children[B];
                else {
                  g = document.createElement("tr");
                  const o = document.createElement("td");
                  g.appendChild(o), z.tfoot.appendChild(g);
                }
                for (let o = 0; o < z.headers.length; o++) {
                  let b;
                  if (z.options.footers[B][o] || (z.options.footers[B][o] = ""), z.tfoot.children[B].children[o + 1]) b = z.tfoot.children[B].children[o + 1];
                  else {
                    b = document.createElement("td"), g.appendChild(b);
                    const D = z.options.columns[o].align || z.options.defaultColAlign || "center";
                    b.style.textAlign = D;
                  }
                  b.textContent = d.$x.call(z, +z.records.length + o, B, z.options.footers[B][o]), b.style.display = z.cols[o].colElement.style.display;
                }
              }
            }
          };
        }, 296: function(n, m, s) {
          s.d(m, { w: function() {
            return d;
          } });
          const d = function() {
            const k = this;
            let j = 0;
            if (k.options.freezeColumns > 0) for (let z = 0; z < k.options.freezeColumns; z++) {
              let B;
              B = k.options.columns && k.options.columns[z] && k.options.columns[z].width !== void 0 ? parseInt(k.options.columns[z].width) : k.options.defaultColWidth !== void 0 ? parseInt(k.options.defaultColWidth) : 100, j += B;
            }
            return j;
          };
        }, 978: function(n, m, s) {
          s.r(m), s.d(m, { createFromTable: function() {
            return D;
          }, getCaretIndex: function() {
            return k;
          }, getCellNameFromCoords: function() {
            return B;
          }, getColumnName: function() {
            return z;
          }, getCoordsFromCellName: function() {
            return g;
          }, getCoordsFromRange: function() {
            return o;
          }, invert: function() {
            return j;
          }, parseCSV: function() {
            return b;
          } });
          var d = s(689);
          const k = function(_) {
            let l;
            l = this.config.root ? this.config.root : window;
            let a = 0;
            const h = l.getSelection();
            if (h && h.rangeCount !== 0) {
              const p = h.getRangeAt(0), u = p.cloneRange();
              u.selectNodeContents(_), u.setEnd(p.endContainer, p.endOffset), a = u.toString().length;
            }
            return a;
          }, j = function(_) {
            const l = [], a = Object.keys(_);
            for (let h = 0; h < a.length; h++) l[_[a[h]]] = a[h];
            return l;
          }, z = function(_) {
            let l, a = _ + 1, h = "";
            for (; a > 0; ) l = (a - 1) % 26, h = String.fromCharCode(65 + l).toString() + h, a = parseInt((a - l) / 26);
            return h;
          }, B = function(_, l) {
            return z(parseInt(_)) + (parseInt(l) + 1);
          }, g = function(_) {
            const l = /^[a-zA-Z]+/.exec(_);
            if (l) {
              let a = 0;
              for (let p = 0; p < l[0].length; p++) a += parseInt(l[0].charCodeAt(p) - 64) * Math.pow(26, l[0].length - 1 - p);
              a--, a < 0 && (a = 0);
              let h = parseInt(/[0-9]+$/.exec(_)) || null;
              return h > 0 && h--, [a, h];
            }
          }, o = function(_) {
            const [l, a] = _.split(":");
            return [...g(l), ...g(a)];
          }, b = function(_, l) {
            l = l || ",", _ = _.replace(/\r?\n$|\r$|\n$/g, "");
            const a = [];
            let h = !1, p = 0, u = 0, v = 0;
            for (let A = 0; A < _.length; A++) {
              const M = _[A], N = _[A + 1];
              a[u] = a[u] || [], a[u][v] = a[u][v] || "", M == '"' && h && N == '"' ? (a[u][v] += M, ++A) : M != '"' ? M != l || h ? M != "\r" || N != `
` || h ? M == `
` && !h || M == "\r" && !h ? (++u, p = Math.max(p, v), v = 0) : a[u][v] += M : (++u, p = Math.max(p, v), v = 0, ++A) : ++v : h = !h;
            }
            return a.forEach(((A, M) => {
              for (let N = A.length; N <= p; N++) A.push("");
            })), a;
          }, D = function(_, l) {
            if (_.tagName == "TABLE") {
              l || (l = {}), l.columns = [], l.data = [];
              const a = _.querySelectorAll("colgroup > col");
              if (a.length) for (let O = 0; O < a.length; O++) {
                let Y = a[O].style.width;
                Y || (Y = a[O].getAttribute("width")), Y && (l.columns[O] || (l.columns[O] = {}), l.columns[O].width = Y);
              }
              const h = function(O, Y) {
                let U = O.getBoundingClientRect();
                const ue = U.width > 50 ? U.width : 50;
                l.columns[Y] || (l.columns[Y] = {}), O.getAttribute("data-celltype") ? l.columns[Y].type = O.getAttribute("data-celltype") : l.columns[Y].type = "text", l.columns[Y].width = ue + "px", l.columns[Y].title = O.innerHTML, O.style.textAlign && (l.columns[Y].align = O.style.textAlign), (U = O.getAttribute("name")) && (l.columns[Y].name = U), (U = O.getAttribute("id")) && (l.columns[Y].id = U), (U = O.getAttribute("data-mask")) && (l.columns[Y].mask = U);
              }, p = [];
              let u = _.querySelectorAll(":scope > thead > tr");
              if (u.length) {
                for (let O = 0; O < u.length - 1; O++) {
                  const Y = [];
                  for (let U = 0; U < u[O].children.length; U++) {
                    const ue = { title: u[O].children[U].textContent, colspan: u[O].children[U].getAttribute("colspan") || 1 };
                    Y.push(ue);
                  }
                  p.push(Y);
                }
                u = u[u.length - 1].children;
                for (let O = 0; O < u.length; O++) h(u[O], O);
              }
              let v = 0;
              const A = {}, M = {}, N = {}, T = {};
              let I = _.querySelectorAll(":scope > tr, :scope > tbody > tr");
              for (let O = 0; O < I.length; O++) if (l.data[v] = [], l.parseTableFirstRowAsHeader != 1 || u.length || O != 0) {
                for (let Y = 0; Y < I[O].children.length; Y++) {
                  let U = I[O].children[Y].getAttribute("data-formula");
                  U ? U.substr(0, 1) != "=" && (U = "=" + U) : U = I[O].children[Y].innerHTML, l.data[v].push(U);
                  const ue = (0, d.t3)([Y, O]), be = I[O].children[Y].getAttribute("class");
                  be && (T[ue] = be);
                  const G = parseInt(I[O].children[Y].getAttribute("colspan")) || 0, ie = parseInt(I[O].children[Y].getAttribute("rowspan")) || 0;
                  (G || ie) && (A[ue] = [G || 1, ie || 1]), I[O].children[Y].style && I[O].children[Y].style.display == "none" && (I[O].children[Y].style.display = "");
                  const ge = I[O].children[Y].getAttribute("style");
                  ge && (N[ue] = ge), I[O].children[Y].classList.contains("styleBold") && (N[ue] ? N[ue] += "; font-weight:bold;" : N[ue] = "font-weight:bold;");
                }
                I[O].style && I[O].style.height && (M[O] = { height: I[O].style.height }), v++;
              } else for (let Y = 0; Y < I[O].children.length; Y++) h(I[O].children[Y], Y);
              if (Object.keys(p).length > 0 && (l.nestedHeaders = p), Object.keys(N).length > 0 && (l.style = N), Object.keys(A).length > 0 && (l.mergeCells = A), Object.keys(M).length > 0 && (l.rows = M), Object.keys(T).length > 0 && (l.classes = T), I = _.querySelectorAll("tfoot tr"), I.length) {
                const O = [];
                for (let Y = 0; Y < I.length; Y++) {
                  let U = [];
                  for (let ue = 0; ue < I[Y].children.length; ue++) U.push(I[Y].children[ue].textContent);
                  O.push(U);
                }
                Object.keys(O).length > 0 && (l.footers = O);
              }
              if (l.parseTableAutoCellType == 1) {
                const O = [];
                for (let Y = 0; Y < l.columns.length; Y++) {
                  let U = !0, ue = !0;
                  O[Y] = [];
                  for (let G = 0; G < l.data.length; G++) {
                    const ie = l.data[G][Y];
                    O[Y][ie] || (O[Y][ie] = 0), O[Y][ie]++, ie.length > 25 && (U = !1), ie.length == 10 && ie.substr(4, 1) == "-" && ie.substr(7, 1) == "-" || (ue = !1);
                  }
                  const be = Object.keys(O[Y]).length;
                  ue ? l.columns[Y].type = "calendar" : U == 1 && be > 1 && be <= parseInt(0.1 * l.data.length) && (l.columns[Y].type = "dropdown", l.columns[Y].source = Object.keys(O[Y]));
                }
              }
              return l;
            }
            console.log("Element is not a table");
          };
        }, 911: function(n, m, s) {
          s.d(m, { Dh: function() {
            return o;
          }, ZS: function() {
            return l;
          }, tN: function() {
            return _;
          } });
          var d = s(805), k = s(689), j = s(530), z = s(910), B = s(94), g = s(657);
          const o = function(a) {
            const h = this;
            if (h.ignoreHistory != 1) {
              const p = ++h.historyIndex;
              h.history = h.history = h.history.slice(0, p + 1), h.history[p] = a;
            }
          }, b = function(a, h) {
            const p = this, u = h.insertBefore ? +h.rowNumber : h.rowNumber + 1;
            if (p.options.search == 1 && p.results && p.results.length != p.rows.length && p.resetSearch(), a == 1) {
              const v = h.numOfRows;
              for (let A = u; A < v + u; A++) p.rows[A].element.parentNode.removeChild(p.rows[A].element);
              p.records.splice(u, v), p.options.data.splice(u, v), p.rows.splice(u, v), g.at.call(p, 1, u, v + u - 1);
            } else {
              const v = h.rowRecords.map(((N) => [...N]));
              p.records = (0, k.Hh)(p.records, u, v);
              const A = h.rowData.map(((N) => [...N]));
              p.options.data = (0, k.Hh)(p.options.data, u, A), p.rows = (0, k.Hh)(p.rows, u, h.rowNode);
              let M = 0;
              for (let N = u; N < h.numOfRows + u; N++) p.tbody.insertBefore(h.rowNode[M].element, p.tbody.children[N]), M++;
            }
            for (let v = u; v < p.rows.length; v++) p.rows[v].y = v;
            for (let v = u; v < p.records.length; v++) for (let A = 0; A < p.records[v].length; A++) p.records[v][A].y = v;
            p.options.pagination > 0 && p.page(p.pageNumber), j.o8.call(p);
          }, D = function(a, h) {
            const p = this, u = h.insertBefore ? h.columnNumber : h.columnNumber + 1;
            if (a == 1) {
              const v = h.numOfColumns;
              p.options.columns.splice(u, v);
              for (let A = u; A < v + u; A++) p.headers[A].parentNode.removeChild(p.headers[A]), p.cols[A].colElement.parentNode.removeChild(p.cols[A].colElement);
              p.headers.splice(u, v), p.cols.splice(u, v);
              for (let A = 0; A < h.data.length; A++) {
                for (let M = u; M < v + u; M++) p.records[A][M].element.parentNode.removeChild(p.records[A][M].element);
                p.records[A].splice(u, v), p.options.data[A].splice(u, v);
              }
              if (p.options.footers) for (let A = 0; A < p.options.footers.length; A++) p.options.footers[A].splice(u, v);
            } else {
              p.options.columns = (0, k.Hh)(p.options.columns, u, h.columns), p.headers = (0, k.Hh)(p.headers, u, h.headers), p.cols = (0, k.Hh)(p.cols, u, h.cols);
              let v = 0;
              for (let A = u; A < h.numOfColumns + u; A++) p.headerContainer.insertBefore(h.headers[v], p.headerContainer.children[A + 1]), p.colgroupContainer.insertBefore(h.cols[v].colElement, p.colgroupContainer.children[A + 1]), v++;
              for (let A = 0; A < h.data.length; A++) {
                p.options.data[A] = (0, k.Hh)(p.options.data[A], u, h.data[A]), p.records[A] = (0, k.Hh)(p.records[A], u, h.records[A]);
                let M = 0;
                for (let N = u; N < h.numOfColumns + u; N++) p.rows[A].element.insertBefore(h.records[A][M].element, p.rows[A].element.children[N + 1]), M++;
              }
              if (p.options.footers) for (let A = 0; A < p.options.footers.length; A++) p.options.footers[A] = (0, k.Hh)(p.options.footers[A], u, h.footers[A]);
            }
            for (let v = u; v < p.cols.length; v++) p.cols[v].x = v;
            for (let v = 0; v < p.records.length; v++) for (let A = u; A < p.records[v].length; A++) p.records[v][A].x = A;
            if (p.options.nestedHeaders && p.options.nestedHeaders.length > 0 && p.options.nestedHeaders[0] && p.options.nestedHeaders[0][0]) for (let v = 0; v < p.options.nestedHeaders.length; v++) {
              let A;
              A = a == 1 ? parseInt(p.options.nestedHeaders[v][p.options.nestedHeaders[v].length - 1].colspan) - h.numOfColumns : parseInt(p.options.nestedHeaders[v][p.options.nestedHeaders[v].length - 1].colspan) + h.numOfColumns, p.options.nestedHeaders[v][p.options.nestedHeaders[v].length - 1].colspan = A, p.thead.children[v].children[p.thead.children[v].children.length - 1].setAttribute("colspan", A);
            }
            j.o8.call(p);
          }, _ = function() {
            const a = this, h = !!a.parent.ignoreEvents, p = !!a.ignoreHistory;
            a.parent.ignoreEvents = !0, a.ignoreHistory = !0;
            const u = [];
            let v;
            if (a.historyIndex >= 0) {
              if (v = a.history[a.historyIndex--], v.action == "insertRow") b.call(a, 1, v);
              else if (v.action == "deleteRow") b.call(a, 0, v);
              else if (v.action == "insertColumn") D.call(a, 1, v);
              else if (v.action == "deleteColumn") D.call(a, 0, v);
              else if (v.action == "moveRow") a.moveRow(v.newValue, v.oldValue);
              else if (v.action == "moveColumn") a.moveColumn(v.newValue, v.oldValue);
              else if (v.action == "setMerge") a.removeMerge(v.column, v.data);
              else if (v.action == "setStyle") a.setStyle(v.oldValue, null, null, 1);
              else if (v.action == "setWidth") a.setWidth(v.column, v.oldValue);
              else if (v.action == "setHeight") a.setHeight(v.row, v.oldValue);
              else if (v.action == "setHeader") a.setHeader(v.column, v.oldValue);
              else if (v.action == "setComments") a.setComments(v.oldValue);
              else if (v.action == "orderBy") {
                let A = [];
                for (let M = 0; M < v.rows.length; M++) A[v.rows[M]] = M;
                B.Th.call(a, v.column, v.order ? 0 : 1), B.iY.call(a, A);
              } else if (v.action == "setValue") {
                for (let A = 0; A < v.records.length; A++) u.push({ x: v.records[A].x, y: v.records[A].y, value: v.records[A].oldValue }), v.oldStyle && a.resetStyle(v.oldStyle);
                a.setValue(u), v.selection && a.updateSelectionFromCoords(v.selection[0], v.selection[1], v.selection[2], v.selection[3]);
              }
            }
            a.parent.ignoreEvents = h, a.ignoreHistory = p, d.A.call(a, "onundo", a, v);
          }, l = function() {
            const a = this, h = !!a.parent.ignoreEvents, p = !!a.ignoreHistory;
            let u;
            if (a.parent.ignoreEvents = !0, a.ignoreHistory = !0, a.historyIndex < a.history.length - 1) {
              if (u = a.history[++a.historyIndex], u.action == "insertRow") b.call(a, 0, u);
              else if (u.action == "deleteRow") b.call(a, 1, u);
              else if (u.action == "insertColumn") D.call(a, 0, u);
              else if (u.action == "deleteColumn") D.call(a, 1, u);
              else if (u.action == "moveRow") a.moveRow(u.oldValue, u.newValue);
              else if (u.action == "moveColumn") a.moveColumn(u.oldValue, u.newValue);
              else if (u.action == "setMerge") z.FU.call(a, u.column, u.colspan, u.rowspan, 1);
              else if (u.action == "setStyle") a.setStyle(u.newValue, null, null, 1);
              else if (u.action == "setWidth") a.setWidth(u.column, u.newValue);
              else if (u.action == "setHeight") a.setHeight(u.row, u.newValue);
              else if (u.action == "setHeader") a.setHeader(u.column, u.newValue);
              else if (u.action == "setComments") a.setComments(u.newValue);
              else if (u.action == "orderBy") B.Th.call(a, u.column, u.order), B.iY.call(a, u.rows);
              else if (u.action == "setValue") {
                a.setValue(u.records);
                for (let v = 0; v < u.records.length; v++) u.oldStyle && a.resetStyle(u.newStyle);
                u.selection && a.updateSelectionFromCoords(u.selection[0], u.selection[1], u.selection[2], u.selection[3]);
              }
            }
            a.parent.ignoreEvents = h, a.ignoreHistory = p, d.A.call(a, "onredo", a, u);
          };
        }, 530: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
          __webpack_require__.d(__webpack_exports__, { $O: function() {
            return getWorksheetActive;
          }, $x: function() {
            return parseValue;
          }, C6: function() {
            return showIndex;
          }, Em: function() {
            return executeFormula;
          }, P9: function() {
            return createCell;
          }, Rs: function() {
            return updateScroll;
          }, TI: function() {
            return hideIndex;
          }, Xr: function() {
            return getCellFromCoords;
          }, Y5: function() {
            return fullscreen;
          }, am: function() {
            return updateTable;
          }, dw: function() {
            return isFormula;
          }, eN: function() {
            return getWorksheetInstance;
          }, hG: function() {
            return updateResult;
          }, ju: function() {
            return createNestedHeader;
          }, k9: function() {
            return updateCell;
          }, o8: function() {
            return updateTableReferences;
          }, p9: function() {
            return getLabel;
          }, rS: function() {
            return getMask;
          }, tT: function() {
            return getCell;
          }, xF: function() {
            return updateFormulaChain;
          }, yB: function() {
            return updateFormula;
          } });
          var _dispatch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(805), _selection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(657), _helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(978), _meta_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(654), _freeze_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(296), _pagination_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(167), _footer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(160), _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(689);
          const updateTable = function() {
            const n = this;
            if (n.options.minSpareRows > 0) {
              let m = 0;
              for (let s = n.rows.length - 1; s >= 0; s--) {
                let d = !1;
                for (let k = 0; k < n.headers.length; k++) n.options.data[s][k] && (d = !0);
                if (d) break;
                m++;
              }
              n.options.minSpareRows - m > 0 && n.insertRow(n.options.minSpareRows - m);
            }
            if (n.options.minSpareCols > 0) {
              let m = 0;
              for (let s = n.headers.length - 1; s >= 0; s--) {
                let d = !1;
                for (let k = 0; k < n.rows.length; k++) n.options.data[k][s] && (d = !0);
                if (d) break;
                m++;
              }
              n.options.minSpareCols - m > 0 && n.insertColumn(n.options.minSpareCols - m);
            }
            n.options.footers && _footer_js__WEBPACK_IMPORTED_MODULE_0__.e.call(n), setTimeout((function() {
              _selection_js__WEBPACK_IMPORTED_MODULE_1__.Aq.call(n);
            }), 0);
          }, parseNumber = function(n, m) {
            const s = m && this.options.columns[m].decimal ? this.options.columns[m].decimal : ".";
            let d = "" + n;
            return d = d.split(s), d[0] = d[0].match(/[+-]?[0-9]/g), d[0] && (d[0] = d[0].join("")), d[1] && (d[1] = d[1].match(/[0-9]*/g).join("")), d[0] && Number.isInteger(Number(d[0])) ? d[1] ? +(d[0] + "." + d[1]) : +(d[0] + ".00") : null;
          }, executeFormula = function(expression, x, y) {
            const obj = this, formulaResults = [], formulaLoopProtection = [], execute = function(expression, x, y) {
              const parentId = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([x, y]);
              if (formulaLoopProtection[parentId]) return console.error("Reference loop detected"), "#ERROR";
              formulaLoopProtection[parentId] = !0;
              const tokensUpdate = function(n) {
                for (let m = 0; m < n.length; m++) {
                  const s = [], d = n[m].split(":"), k = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(d[0], !0), j = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(d[1], !0);
                  let z, B, g, o;
                  k[0] <= j[0] ? (z = k[0], B = j[0]) : (z = j[0], B = k[0]), k[1] <= j[1] ? (g = k[1], o = j[1]) : (g = j[1], o = k[1]);
                  for (let b = g; b <= o; b++) for (let D = z; D <= B; D++) s.push((0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([D, b]));
                  expression = expression.replace(n[m], s.join(","));
                }
              };
              expression = expression.replace(/\$?([A-Z]+)\$?([0-9]+)/g, "$1$2");
              let tokens = expression.match(/([A-Z]+[0-9]+)\:([A-Z]+[0-9]+)/g);
              if (tokens && tokens.length && tokensUpdate(tokens), tokens = expression.match(/([A-Z]+[0-9]+)/g), tokens && tokens.indexOf(parentId) > -1) return console.error("Self Reference detected"), "#ERROR";
              {
                const formulaExpressions = {};
                if (tokens) {
                  for (let i = 0; i < tokens.length; i++) if (obj.formula[tokens[i]] || (obj.formula[tokens[i]] = []), obj.formula[tokens[i]].indexOf(parentId) < 0 && obj.formula[tokens[i]].push(parentId), eval("typeof(" + tokens[i] + ') == "undefined"')) {
                    const n = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(tokens[i], 1);
                    let m;
                    if (m = obj.options.data[n[1]] !== void 0 && obj.options.data[n[1]][n[0]] !== void 0 ? obj.options.data[n[1]][n[0]] : "", ("" + m).substr(0, 1) == "=" && (formulaResults[tokens[i]] !== void 0 ? m = formulaResults[tokens[i]] : (m = execute(m, n[0], n[1]), formulaResults[tokens[i]] = m)), ("" + m).trim() == "") formulaExpressions[tokens[i]] = null;
                    else if (m == Number(m) && obj.parent.config.autoCasting != 0) formulaExpressions[tokens[i]] = Number(m);
                    else {
                      const s = parseNumber.call(obj, m, n[0]);
                      obj.parent.config.autoCasting != 0 && s ? formulaExpressions[tokens[i]] = s : formulaExpressions[tokens[i]] = '"' + m + '"';
                    }
                  }
                }
                const ret = _dispatch_js__WEBPACK_IMPORTED_MODULE_3__.A.call(obj, "onbeforeformula", obj, expression, x, y);
                if (ret === !1) return expression;
                let res;
                ret && (expression = ret);
                try {
                  res = formula(expression.substr(1), formulaExpressions, x, y, obj), typeof res == "function" && (res = "#ERROR");
                } catch (n) {
                  res = "#ERROR", obj.parent.config.debugFormulas === !0 && console.log(expression.substr(1), formulaExpressions, n);
                }
                return res;
              }
            };
            return execute(expression, x, y);
          }, parseValue = function(n, m, s, d) {
            const k = this;
            ("" + s).substr(0, 1) == "=" && k.parent.config.parseFormulas != 0 && (s = executeFormula.call(k, s, n, m));
            const j = k.options.columns && k.options.columns[n];
            if (j && !isFormula(s)) {
              let z = null;
              if (z = getMask(j)) {
                s && s == Number(s) && (s = Number(s));
                let B = jSuites.mask.render(s, z, !0);
                if (d && z.mask) {
                  const g = z.mask.split(";");
                  g[1] && (g[1].match(new RegExp("\\[Red\\]", "gi")) && (s < 0 ? d.classList.add("red") : d.classList.remove("red")), g[1].match(new RegExp("\\(", "gi")) && s < 0 && (B = "(" + B + ")"));
                }
                B && (s = B);
              }
            }
            return s;
          }, getDropDownValue = function(n, m) {
            const s = this, d = [];
            if (s.options.columns && s.options.columns[n] && s.options.columns[n].source) {
              const k = [], j = s.options.columns[n].source;
              for (let B = 0; B < j.length; B++) typeof j[B] == "object" ? k[j[B].id] = j[B].name : k[j[B]] = j[B];
              const z = Array.isArray(m) ? m : ("" + m).split(";");
              for (let B = 0; B < z.length; B++) typeof z[B] == "object" ? d.push(k[z[B].id]) : k[z[B]] && d.push(k[z[B]]);
            } else console.error("Invalid column");
            return d.length > 0 ? d.join("; ") : "";
          }, validDate = function(n) {
            return (n = "" + n).substr(4, 1) == "-" && n.substr(7, 1) == "-" || (n = n.split("-"))[0].length == 4 && n[0] == Number(n[0]) && n[1].length == 2 && n[1] == Number(n[1]);
          }, stripScript = function(n) {
            const m = new Option();
            m.innerHTML = n;
            let s = null;
            for (n = m.getElementsByTagName("script"); s = n[0]; ) s.parentNode.removeChild(s);
            return m.innerHTML;
          }, createCell = function(n, m, s) {
            const d = this;
            let k = document.createElement("td");
            if (k.setAttribute("data-x", n), k.setAttribute("data-y", m), d.headers[n].style.display === "none" && (k.style.display = "none"), ("" + s).substr(0, 1) == "=" && d.options.secureFormulas == 1) {
              const z = secureFormula(s);
              z != s && (s = z);
            }
            if (d.options.columns && d.options.columns[n] && typeof d.options.columns[n].type == "object") d.parent.config.parseHTML === !0 ? k.innerHTML = s : k.textContent = s, typeof d.options.columns[n].type.createCell == "function" && d.options.columns[n].type.createCell(k, s, parseInt(n), parseInt(m), d, d.options.columns[n]);
            else if (d.options.columns && d.options.columns[n] && d.options.columns[n].type == "hidden") k.style.display = "none", k.textContent = s;
            else if (d.options.columns && d.options.columns[n] && (d.options.columns[n].type == "checkbox" || d.options.columns[n].type == "radio")) {
              const z = document.createElement("input");
              z.type = d.options.columns[n].type, z.name = "c" + n, z.checked = s == 1 || s == 1 || s == "true", z.onclick = function() {
                d.setValue(k, this.checked);
              }, d.options.columns[n].readOnly != 1 && d.options.editable != 0 || z.setAttribute("disabled", "disabled"), k.appendChild(z), d.options.data[m][n] = z.checked;
            } else if (d.options.columns && d.options.columns[n] && d.options.columns[n].type == "calendar") {
              let z = null;
              if (!validDate(s)) {
                const B = jSuites.calendar.extractDateFromString(s, d.options.columns[n].options && d.options.columns[n].options.format || "YYYY-MM-DD");
                B && (z = B);
              }
              k.textContent = jSuites.calendar.getDateString(z || s, d.options.columns[n].options && d.options.columns[n].options.format);
            } else if (d.options.columns && d.options.columns[n] && d.options.columns[n].type == "dropdown") k.classList.add("jss_dropdown"), k.textContent = getDropDownValue.call(d, n, s);
            else if (d.options.columns && d.options.columns[n] && d.options.columns[n].type == "color") if (d.options.columns[n].render == "square") {
              const z = document.createElement("div");
              z.className = "color", z.style.backgroundColor = s, k.appendChild(z);
            } else k.style.color = s, k.textContent = s;
            else if (d.options.columns && d.options.columns[n] && d.options.columns[n].type == "image") {
              if (s && s.substr(0, 10) == "data:image") {
                const z = document.createElement("img");
                z.src = s, k.appendChild(z);
              }
            } else d.options.columns && d.options.columns[n] && d.options.columns[n].type == "html" || d.parent.config.parseHTML === !0 ? k.innerHTML = stripScript(parseValue.call(this, n, m, s, k)) : k.textContent = parseValue.call(this, n, m, s, k);
            d.options.columns && d.options.columns[n] && d.options.columns[n].readOnly == 1 && (k.className = "readonly");
            const j = d.options.columns && d.options.columns[n] && d.options.columns[n].align || d.options.defaultColAlign || "center";
            return k.style.textAlign = j, d.options.columns && d.options.columns[n] && d.options.columns[n].wordWrap == 0 || !(d.options.wordWrap == 1 || d.options.columns && d.options.columns[n] && d.options.columns[n].wordWrap == 1 || k.innerHTML.length > 200) || (k.style.whiteSpace = "pre-wrap"), n > 0 && this.options.textOverflow == 1 && (s || k.innerHTML ? d.records[m][n - 1].element.style.overflow = "hidden" : n == d.options.columns.length - 1 && (k.style.overflow = "hidden")), _dispatch_js__WEBPACK_IMPORTED_MODULE_3__.A.call(d, "oncreatecell", d, k, n, m, s), k;
          }, updateCell = function(n, m, s, d) {
            const k = this;
            let j;
            if (k.records[m][n].element.classList.contains("readonly") != 1 || d) {
              if (("" + s).substr(0, 1) == "=" && k.options.secureFormulas == 1) {
                const g = secureFormula(s);
                g != s && (s = g);
              }
              const z = _dispatch_js__WEBPACK_IMPORTED_MODULE_3__.A.call(k, "onbeforechange", k, k.records[m][n].element, n, m, s);
              if (z != null && (s = z), k.options.columns && k.options.columns[n] && typeof k.options.columns[n].type == "object" && typeof k.options.columns[n].type.updateCell == "function") {
                const g = k.options.columns[n].type.updateCell(k.records[m][n].element, s, parseInt(n), parseInt(m), k, k.options.columns[n]);
                g !== void 0 && (s = g);
              }
              j = { x: n, y: m, col: n, row: m, value: s, oldValue: k.options.data[m][n] };
              let B = k.options.columns && k.options.columns[n] && typeof k.options.columns[n].type == "object" ? k.options.columns[n].type : null;
              if (B) k.options.data[m][n] = s, typeof B.setValue == "function" && B.setValue(k.records[m][n].element, s);
              else if (k.options.columns && k.options.columns[n] && (k.options.columns[n].type == "checkbox" || k.options.columns[n].type == "radio")) {
                if (k.options.columns[n].type == "radio") for (let g = 0; g < k.options.data.length; g++) k.options.data[g][n] = !1;
                k.records[m][n].element.children[0].checked = s == 1 || s == 1 || s == "true" || s == "TRUE", k.options.data[m][n] = k.records[m][n].element.children[0].checked;
              } else if (k.options.columns && k.options.columns[n] && k.options.columns[n].type == "dropdown") k.options.data[m][n] = s, k.records[m][n].element.textContent = getDropDownValue.call(k, n, s);
              else if (k.options.columns && k.options.columns[n] && k.options.columns[n].type == "calendar") {
                let g = null;
                if (!validDate(s)) {
                  const o = jSuites.calendar.extractDateFromString(s, k.options.columns[n].options && k.options.columns[n].options.format || "YYYY-MM-DD");
                  o && (g = o);
                }
                k.options.data[m][n] = s, k.records[m][n].element.textContent = jSuites.calendar.getDateString(g || s, k.options.columns[n].options && k.options.columns[n].options.format);
              } else if (k.options.columns && k.options.columns[n] && k.options.columns[n].type == "color") if (k.options.data[m][n] = s, k.options.columns[n].render == "square") {
                const g = document.createElement("div");
                g.className = "color", g.style.backgroundColor = s, k.records[m][n].element.textContent = "", k.records[m][n].element.appendChild(g);
              } else k.records[m][n].element.style.color = s, k.records[m][n].element.textContent = s;
              else if (k.options.columns && k.options.columns[n] && k.options.columns[n].type == "image") {
                if (s = "" + s, k.options.data[m][n] = s, k.records[m][n].element.innerHTML = "", s && s.substr(0, 10) == "data:image") {
                  const g = document.createElement("img");
                  g.src = s, k.records[m][n].element.appendChild(g);
                }
              } else k.options.data[m][n] = s, k.options.columns && k.options.columns[n] && k.options.columns[n].type == "html" ? k.records[m][n].element.innerHTML = stripScript(parseValue.call(k, n, m, s)) : k.parent.config.parseHTML === !0 ? k.records[m][n].element.innerHTML = stripScript(parseValue.call(k, n, m, s, k.records[m][n].element)) : k.records[m][n].element.textContent = parseValue.call(k, n, m, s, k.records[m][n].element), k.options.columns && k.options.columns[n] && k.options.columns[n].wordWrap == 0 || !(k.options.wordWrap == 1 || k.options.columns && k.options.columns[n] && k.options.columns[n].wordWrap == 1 || k.records[m][n].element.innerHTML.length > 200) ? k.records[m][n].element.style.whiteSpace = "" : k.records[m][n].element.style.whiteSpace = "pre-wrap";
              n > 0 && (k.records[m][n - 1].element.style.overflow = s ? "hidden" : ""), k.options.columns && k.options.columns[n] && typeof k.options.columns[n].render == "function" && k.options.columns[n].render(k.records[m] && k.records[m][n] ? k.records[m][n].element : null, s, parseInt(n), parseInt(m), k, k.options.columns[n]), _dispatch_js__WEBPACK_IMPORTED_MODULE_3__.A.call(k, "onchange", k, k.records[m] && k.records[m][n] ? k.records[m][n].element : null, n, m, s, j.oldValue);
            } else j = { x: n, y: m, col: n, row: m };
            return j;
          }, isFormula = function(n) {
            const m = ("" + n)[0];
            return m == "=" || m == "#";
          }, getMask = function(n) {
            if (n.format || n.mask || n.locale) {
              const m = {};
              return n.mask ? m.mask = n.mask : n.format ? m.mask = n.format : (m.locale = n.locale, m.options = n.options), n.decimal && (m.options || (m.options = {}), m.options = { decimal: n.decimal }), m;
            }
            return null;
          }, secureFormula = function(n) {
            let m = "", s = 0;
            for (let d = 0; d < n.length; d++) n[d] == '"' && (s = s == 0 ? 1 : 0), m += s == 1 ? n[d] : n[d].toUpperCase();
            return m;
          };
          let chainLoopProtection = [];
          const updateFormulaChain = function(n, m, s) {
            const d = this, k = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([n, m]);
            if (d.formula[k] && d.formula[k].length > 0) if (chainLoopProtection[k]) d.records[m][n].element.innerHTML = "#ERROR", d.formula[k] = "";
            else {
              chainLoopProtection[k] = !0;
              for (let j = 0; j < d.formula[k].length; j++) {
                const z = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(d.formula[k][j], !0), B = "" + d.options.data[z[1]][z[0]];
                B.substr(0, 1) == "=" ? s.push(updateCell.call(d, z[0], z[1], B, !0)) : Object.keys(d.formula)[j] = null, updateFormulaChain.call(d, z[0], z[1], s);
              }
            }
            chainLoopProtection = [];
          }, updateFormula = function(n, m) {
            const s = /[A-Z]/, d = /[0-9]/;
            let k = "", j = null, z = null, B = "";
            for (let g = 0; g < n.length; g++) s.exec(n[g]) ? (j = 1, z = 0, B += n[g]) : d.exec(n[g]) ? (z = j ? 1 : 0, B += n[g]) : (j && z && (B = m[B] ? m[B] : B), k += B, k += n[g], j = 0, z = 0, B = "");
            return B && (j && z && (B = m[B] ? m[B] : B), k += B), k;
          }, updateFormulas = function(n) {
            const m = this;
            for (let k = 0; k < m.options.data.length; k++) for (let j = 0; j < m.options.data[0].length; j++) {
              const z = "" + m.options.data[k][j];
              if (z.substr(0, 1) == "=") {
                const B = updateFormula(z, n);
                B != z && (m.options.data[k][j] = B);
              }
            }
            const s = [], d = Object.keys(m.formula);
            for (let k = 0; k < d.length; k++) {
              let j = d[k];
              const z = m.formula[j];
              n[j] && (j = n[j]), s[j] = [];
              for (let B = 0; B < z.length; B++) {
                let g = z[B];
                n[g] && (g = n[g]), s[j].push(g);
              }
            }
            m.formula = s;
          }, updateTableReferences = function() {
            const n = this;
            if (n.skipUpdateTableReferences) return;
            for (let j = 0; j < n.headers.length; j++) n.headers[j].getAttribute("data-x") != j && (n.headers[j].setAttribute("data-x", j), n.headers[j].getAttribute("title") || (n.headers[j].innerHTML = (0, _helpers_js__WEBPACK_IMPORTED_MODULE_4__.getColumnName)(j)));
            for (let j = 0; j < n.rows.length; j++) n.rows[j] && n.rows[j].element.getAttribute("data-y") != j && (n.rows[j].element.setAttribute("data-y", j), n.rows[j].element.children[0].setAttribute("data-y", j), n.rows[j].element.children[0].innerHTML = j + 1);
            const m = [], s = [], d = function(j, z, B, g) {
              if (j != B && n.records[g][B].element.setAttribute("data-x", B), z != g && n.records[g][B].element.setAttribute("data-y", g), j != B || z != g) {
                const o = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([j, z]), b = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([B, g]);
                m[o] = b;
              }
            };
            for (let j = 0; j < n.records.length; j++) for (let z = 0; z < n.records[0].length; z++) if (n.records[j][z]) {
              const B = n.records[j][z].element.getAttribute("data-x"), g = n.records[j][z].element.getAttribute("data-y");
              if (n.records[j][z].element.getAttribute("data-merged")) {
                const o = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([B, g]), b = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.t3)([z, j]);
                if (s[o] == null) if (o == b) s[o] = !1;
                else {
                  const D = parseInt(z - B), _ = parseInt(j - g);
                  s[o] = [b, D, _];
                }
              } else d(B, g, z, j);
            }
            const k = Object.keys(s);
            if (k.length) {
              for (let j = 0; j < k.length; j++) if (s[k[j]]) {
                const z = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(k[j], !0);
                let B = z[0], g = z[1];
                d(B, g, B + s[k[j]][1], g + s[k[j]][2]);
                const o = k[j], b = s[k[j]][0];
                for (let D = 0; D < n.options.mergeCells[o][2].length; D++) B = parseInt(n.options.mergeCells[o][2][D].getAttribute("data-x")), g = parseInt(n.options.mergeCells[o][2][D].getAttribute("data-y")), n.options.mergeCells[o][2][D].setAttribute("data-x", B + s[k[j]][1]), n.options.mergeCells[o][2][D].setAttribute("data-y", g + s[k[j]][2]);
                n.options.mergeCells[b] = n.options.mergeCells[o], delete n.options.mergeCells[o];
              }
            }
            updateFormulas.call(n, m), _meta_js__WEBPACK_IMPORTED_MODULE_5__.hs.call(n, m), _selection_js__WEBPACK_IMPORTED_MODULE_1__.G9.call(n), updateTable.call(n);
          }, updateScroll = function(n) {
            const m = this, s = m.content.getBoundingClientRect(), d = s.left, k = s.top, j = s.width, z = s.height, B = m.records[m.selectedCell[3]][m.selectedCell[2]].element.getBoundingClientRect(), g = B.left, o = B.top, b = B.width, D = B.height;
            let _, l;
            n == 0 || n == 1 ? (_ = g - d + m.content.scrollLeft, l = o - k + m.content.scrollTop - 2) : (_ = g - d + m.content.scrollLeft + b, l = o - k + m.content.scrollTop + D), l > m.content.scrollTop + 30 && l < m.content.scrollTop + z || (l < m.content.scrollTop + 30 ? m.content.scrollTop = l - D : m.content.scrollTop = l - (z - 2));
            const a = _freeze_js__WEBPACK_IMPORTED_MODULE_6__.w.call(m);
            _ > m.content.scrollLeft + a && _ < m.content.scrollLeft + j || (_ < m.content.scrollLeft + 30 ? (m.content.scrollLeft = _, m.content.scrollLeft < 50 && (m.content.scrollLeft = 0)) : _ < m.content.scrollLeft + a ? m.content.scrollLeft = _ - a - 1 : m.content.scrollLeft = _ - (j - 20));
          }, updateResult = function() {
            const n = this;
            let m = 0, s = 0;
            for (m = n.options.lazyLoading == 1 ? 100 : n.options.pagination > 0 ? n.options.pagination : n.results ? n.results.length : n.rows.length; n.tbody.firstChild; ) n.tbody.removeChild(n.tbody.firstChild);
            for (let d = 0; d < n.rows.length; d++) !n.results || n.results.indexOf(d) > -1 ? (s < m && (n.tbody.appendChild(n.rows[d].element), s++), n.rows[d].element.style.display = "") : n.rows[d].element.style.display = "none";
            return n.options.pagination > 0 && _pagination_js__WEBPACK_IMPORTED_MODULE_7__.IV.call(n), _selection_js__WEBPACK_IMPORTED_MODULE_1__.Aq.call(n), m;
          }, getCell = function(n, m) {
            if (typeof n == "string") {
              const s = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(n, !0);
              n = s[0], m = s[1];
            }
            return this.records[m][n].element;
          }, getCellFromCoords = function(n, m) {
            return this.records[m][n].element;
          }, getLabel = function(n, m) {
            if (typeof n == "string") {
              const s = (0, _internalHelpers_js__WEBPACK_IMPORTED_MODULE_2__.vu)(n, !0);
              n = s[0], m = s[1];
            }
            return this.records[m][n].element.innerHTML;
          }, fullscreen = function(n) {
            const m = this;
            n == null && (n = !m.config.fullscreen), m.config.fullscreen != n && (m.config.fullscreen = n, n == 1 ? m.element.classList.add("fullscreen") : m.element.classList.remove("fullscreen"));
          }, showIndex = function() {
            this.table.classList.remove("jss_hidden_index");
          }, hideIndex = function() {
            this.table.classList.add("jss_hidden_index");
          }, createNestedHeader = function(n) {
            const m = this, s = document.createElement("tr");
            s.classList.add("jss_nested");
            const d = document.createElement("td");
            d.classList.add("jss_selectall"), s.appendChild(d), n.element = s;
            let k = 0;
            for (let j = 0; j < n.length; j++) {
              n[j].colspan || (n[j].colspan = 1), n[j].title || (n[j].title = ""), n[j].id || (n[j].id = "");
              let z = n[j].colspan;
              const B = [];
              for (let o = 0; o < z; o++) m.options.columns[k] && m.options.columns[k].type == "hidden" && z++, B.push(k), k++;
              const g = document.createElement("td");
              g.setAttribute("data-column", B.join(",")), g.setAttribute("colspan", n[j].colspan), g.setAttribute("align", n[j].align || "center"), g.setAttribute("id", n[j].id), g.textContent = n[j].title, s.appendChild(g);
            }
            return s;
          }, getWorksheetActive = function() {
            const n = this.parent ? this.parent : this;
            return n.element.tabs ? n.element.tabs.getActive() : 0;
          }, getWorksheetInstance = function(n) {
            const m = n !== void 0 ? n : getWorksheetActive.call(this);
            return this.worksheets[m];
          };
        }, 689: function(n, m, s) {
          s.d(m, { Hh: function() {
            return k;
          }, t3: function() {
            return z;
          }, vu: function() {
            return j;
          } });
          var d = s(978);
          const k = function(B, g, o) {
            if (g <= B.length) return B.slice(0, g).concat(o).concat(B.slice(g));
            const b = B.slice(0, B.length);
            for (; g > b.length; ) b.push(void 0);
            return b.concat(o);
          }, j = function(B, g) {
            const o = /^[a-zA-Z]+/.exec(B);
            if (o) {
              let b = 0;
              for (let _ = 0; _ < o[0].length; _++) b += parseInt(o[0].charCodeAt(_) - 64) * Math.pow(26, o[0].length - 1 - _);
              b--, b < 0 && (b = 0);
              let D = parseInt(/[0-9]+$/.exec(B));
              D > 0 && D--, B = g == 1 ? [b, D] : b + "-" + D;
            }
            return B;
          }, z = function(B) {
            return Array.isArray(B) || (B = B.split("-")), (0, d.getColumnName)(parseInt(B[0])) + (parseInt(B[1]) + 1);
          };
        }, 497: function(n, m, s) {
          s.d(m, { AG: function() {
            return k;
          }, G_: function() {
            return j;
          }, p6: function() {
            return z;
          }, wu: function() {
            return d;
          } });
          const d = function(B) {
            const g = this;
            let o;
            o = g.options.search != 1 && g.options.filters != 1 || !g.results ? g.rows : g.results;
            const b = 100;
            B != null && B != -1 || (B = Math.ceil(o.length / b) - 1);
            let D = B * b, _ = B * b + b;
            _ > o.length && (_ = o.length), D = _ - 100, D < 0 && (D = 0);
            for (let l = D; l < _; l++) g.options.search != 1 && g.options.filters != 1 || !g.results ? g.tbody.appendChild(g.rows[l].element) : g.tbody.appendChild(g.rows[o[l]].element), g.tbody.children.length > b && g.tbody.removeChild(g.tbody.firstChild);
          }, k = function() {
            const B = this;
            if (B.selectedCell) {
              const g = parseInt(B.tbody.firstChild.getAttribute("data-y")) / 100, o = parseInt(B.selectedCell[3] / 100), b = parseInt(B.rows.length / 100);
              if (g != o && o <= b && !Array.prototype.indexOf.call(B.tbody.children, B.rows[B.selectedCell[3]].element)) return B.loadPage(o), !0;
            }
            return !1;
          }, j = function() {
            const B = this;
            let g;
            g = B.options.search != 1 && B.options.filters != 1 || !B.results ? B.rows : B.results;
            let o = 0;
            if (g.length > 100) {
              let b = parseInt(B.tbody.firstChild.getAttribute("data-y"));
              if (B.options.search != 1 && B.options.filters != 1 || !B.results || (b = g.indexOf(b)), b > 0) for (let D = 0; D < 30; D++) b -= 1, b > -1 && (B.options.search != 1 && B.options.filters != 1 || !B.results ? B.tbody.insertBefore(B.rows[b].element, B.tbody.firstChild) : B.tbody.insertBefore(B.rows[g[b]].element, B.tbody.firstChild), B.tbody.children.length > 100 && (B.tbody.removeChild(B.tbody.lastChild), o = 1));
            }
            return o;
          }, z = function() {
            const B = this;
            let g;
            g = B.options.search != 1 && B.options.filters != 1 || !B.results ? B.rows : B.results;
            let o = 0;
            if (g.length > 100) {
              let b = parseInt(B.tbody.lastChild.getAttribute("data-y"));
              if (B.options.search != 1 && B.options.filters != 1 || !B.results || (b = g.indexOf(b)), b < B.rows.length - 1) for (let D = 0; D <= 30; D++) b < g.length && (B.options.search != 1 && B.options.filters != 1 || !B.results ? B.tbody.appendChild(B.rows[b].element) : B.tbody.appendChild(B.rows[g[b]].element), B.tbody.children.length > 100 && (B.tbody.removeChild(B.tbody.firstChild), o = 1)), b += 1;
            }
            return o;
          };
        }, 910: function(n, m, s) {
          s.d(m, { D0: function() {
            return o;
          }, FU: function() {
            return D;
          }, Lt: function() {
            return g;
          }, VP: function() {
            return l;
          }, Zp: function() {
            return _;
          }, fd: function() {
            return b;
          } });
          var d = s(689), k = s(530), j = s(911), z = s(805), B = s(657);
          const g = function(a, h) {
            const p = this, u = [];
            if (p.options.mergeCells) {
              const v = Object.keys(p.options.mergeCells);
              for (let A = 0; A < v.length; A++) {
                const M = (0, d.vu)(v[A], !0), N = p.options.mergeCells[v[A]][0], T = M[0], I = M[0] + (N > 1 ? N - 1 : 0);
                h == null ? T <= a && I >= a && u.push(v[A]) : h ? T < a && I >= a && u.push(v[A]) : T <= a && I > a && u.push(v[A]);
              }
            }
            return u;
          }, o = function(a, h) {
            const p = this, u = [];
            if (p.options.mergeCells) {
              const v = Object.keys(p.options.mergeCells);
              for (let A = 0; A < v.length; A++) {
                const M = (0, d.vu)(v[A], !0), N = p.options.mergeCells[v[A]][1], T = M[1], I = M[1] + (N > 1 ? N - 1 : 0);
                h == null ? T <= a && I >= a && u.push(v[A]) : h ? T < a && I >= a && u.push(v[A]) : T <= a && I > a && u.push(v[A]);
              }
            }
            return u;
          }, b = function(a) {
            const h = this;
            let p = {};
            if (a) p = h.options.mergeCells && h.options.mergeCells[a] ? [h.options.mergeCells[a][0], h.options.mergeCells[a][1]] : null;
            else if (h.options.mergeCells) {
              h.options.mergeCells;
              const u = Object.keys(h.options.mergeCells);
              for (let v = 0; v < u.length; v++) p[u[v]] = [h.options.mergeCells[u[v]][0], h.options.mergeCells[u[v]][1]];
            }
            return p;
          }, D = function(a, h, p, u) {
            const v = this;
            let A = !1;
            if (a) {
              if (typeof a != "string") return null;
            } else {
              if (!v.highlighted.length) return alert(jSuites.translate("No cells selected")), null;
              {
                const N = parseInt(v.highlighted[0].getAttribute("data-x")), T = parseInt(v.highlighted[0].getAttribute("data-y")), I = parseInt(v.highlighted[v.highlighted.length - 1].getAttribute("data-x")), O = parseInt(v.highlighted[v.highlighted.length - 1].getAttribute("data-y"));
                a = (0, d.t3)([N, T]), h = I - N + 1, p = O - T + 1;
              }
            }
            const M = (0, d.vu)(a, !0);
            if (v.options.mergeCells && v.options.mergeCells[a]) v.records[M[1]][M[0]].element.getAttribute("data-merged") && (A = "Cell already merged");
            else if ((!h || h < 2) && (!p || p < 2)) A = "Invalid merged properties";
            else for (let N = M[1]; N < M[1] + p; N++) for (let T = M[0]; T < M[0] + h; T++) (0, d.t3)([T, N]), v.records[N][T].element.getAttribute("data-merged") && (A = "There is a conflict with another merged cell");
            if (A) alert(jSuites.translate(A));
            else {
              h > 1 ? v.records[M[1]][M[0]].element.setAttribute("colspan", h) : h = 1, p > 1 ? v.records[M[1]][M[0]].element.setAttribute("rowspan", p) : p = 1, v.options.mergeCells || (v.options.mergeCells = {}), v.options.mergeCells[a] = [h, p, []], v.records[M[1]][M[0]].element.setAttribute("data-merged", "true"), v.records[M[1]][M[0]].element.style.overflow = "hidden";
              const N = [];
              for (let T = M[1]; T < M[1] + p; T++) for (let I = M[0]; I < M[0] + h; I++) M[0] == I && M[1] == T || (N.push(v.options.data[T][I]), k.k9.call(v, I, T, "", !0), v.options.mergeCells[a][2].push(v.records[T][I].element), v.records[T][I].element.style.display = "none", v.records[T][I].element = v.records[M[1]][M[0]].element);
              B.c6.call(v, v.records[M[1]][M[0]].element), u || (j.Dh.call(v, { action: "setMerge", column: a, colspan: h, rowspan: p, data: N }), z.A.call(v, "onmerge", v, { [a]: [h, p] }));
            }
          }, _ = function(a, h, p) {
            const u = this;
            if (u.options.mergeCells && u.options.mergeCells[a]) {
              const v = (0, d.vu)(a, !0);
              u.records[v[1]][v[0]].element.removeAttribute("colspan"), u.records[v[1]][v[0]].element.removeAttribute("rowspan"), u.records[v[1]][v[0]].element.removeAttribute("data-merged");
              const A = u.options.mergeCells[a];
              let M, N, T = 0;
              for (M = 0; M < A[1]; M++) for (N = 0; N < A[0]; N++) (M > 0 || N > 0) && (u.records[v[1] + M][v[0] + N].element = A[2][T], u.records[v[1] + M][v[0] + N].element.style.display = "", h && h[T] && k.k9.call(u, v[0] + N, v[1] + M, h[T]), T++);
              B.c6.call(u, u.records[v[1]][v[0]].element, u.records[v[1] + M - 1][v[0] + N - 1].element), p || delete u.options.mergeCells[a];
            }
          }, l = function(a) {
            const h = this;
            if (h.options.mergeCells) {
              h.options.mergeCells;
              const p = Object.keys(h.options.mergeCells);
              for (let u = 0; u < p.length; u++) _.call(h, p[u], null, a);
            }
          };
        }, 654: function(n, m, s) {
          s.d(m, { IQ: function() {
            return k;
          }, hs: function() {
            return j;
          }, iZ: function() {
            return z;
          } });
          var d = s(805);
          const k = function(B, g) {
            const o = this;
            return B ? g ? o.options.meta && o.options.meta[B] && o.options.meta[B][g] ? o.options.meta[B][g] : null : o.options.meta && o.options.meta[B] ? o.options.meta[B] : null : o.options.meta;
          }, j = function(B) {
            const g = this;
            if (g.options.meta) {
              const o = {}, b = Object.keys(g.options.meta);
              for (let D = 0; D < b.length; D++) B[b[D]] ? o[B[b[D]]] = g.options.meta[b[D]] : o[b[D]] = g.options.meta[b[D]];
              g.options.meta = o;
            }
          }, z = function(B, g, o) {
            const b = this;
            if (b.options.meta || (b.options.meta = {}), g && o) b.options.meta[B] || (b.options.meta[B] = {}), b.options.meta[B][g] = o, d.A.call(b, "onchangemeta", b, { [B]: { [g]: o } });
            else {
              const D = Object.keys(B);
              for (let _ = 0; _ < D.length; _++) {
                b.options.meta[D[_]] || (b.options.meta[D[_]] = {});
                const l = Object.keys(B[D[_]]);
                for (let a = 0; a < l.length; a++) b.options.meta[D[_]][l[a]] = B[D[_]][l[a]];
              }
              d.A.call(b, "onchangemeta", b, B);
            }
          };
        }, 94: function(n, m, s) {
          s.d(m, { My: function() {
            return b;
          }, Th: function() {
            return g;
          }, iY: function() {
            return o;
          } });
          var d = s(911), k = s(805), j = s(530), z = s(497), B = s(829);
          const g = function(D, _) {
            const l = this;
            for (let a = 0; a < l.headers.length; a++) l.headers[a].classList.remove("arrow-up"), l.headers[a].classList.remove("arrow-down");
            _ ? l.headers[D].classList.add("arrow-up") : l.headers[D].classList.add("arrow-down");
          }, o = function(D) {
            const _ = this;
            let l = [];
            for (let a = 0; a < D.length; a++) l[a] = _.options.data[D[a]];
            _.options.data = l, l = [];
            for (let a = 0; a < D.length; a++) {
              l[a] = _.records[D[a]];
              for (let h = 0; h < l[a].length; h++) l[a][h].y = a;
            }
            _.records = l, l = [];
            for (let a = 0; a < D.length; a++) l[a] = _.rows[D[a]], l[a].y = a;
            if (_.rows = l, j.o8.call(_), _.results && _.results.length) _.searchInput.value ? _.search(_.searchInput.value) : B.F8.call(_);
            else if (_.results = null, _.pageNumber = 0, _.options.pagination > 0) _.page(0);
            else if (_.options.lazyLoading == 1) z.wu.call(_, 0);
            else for (let a = 0; a < _.rows.length; a++) _.tbody.appendChild(_.rows[a].element);
          }, b = function(D, _) {
            const l = this;
            if (D >= 0) {
              if (l.options.mergeCells && Object.keys(l.options.mergeCells).length > 0) {
                if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
                l.destroyMerge();
              }
              _ = _ == null ? l.headers[D].classList.contains("arrow-down") ? 1 : 0 : _ ? 1 : 0;
              let a = [];
              if (l.options.columns && l.options.columns[D] && (l.options.columns[D].type == "number" || l.options.columns[D].type == "numeric" || l.options.columns[D].type == "percentage" || l.options.columns[D].type == "autonumber" || l.options.columns[D].type == "color")) for (let p = 0; p < l.options.data.length; p++) a[p] = [p, Number(l.options.data[p][D])];
              else if (l.options.columns && l.options.columns[D] && (l.options.columns[D].type == "calendar" || l.options.columns[D].type == "checkbox" || l.options.columns[D].type == "radio")) for (let p = 0; p < l.options.data.length; p++) a[p] = [p, l.options.data[p][D]];
              else for (let p = 0; p < l.options.data.length; p++) a[p] = [p, l.records[p][D].element.textContent.toLowerCase()];
              typeof l.parent.config.sorting != "function" && (l.parent.config.sorting = function(p) {
                return function(u, v) {
                  const A = u[1], M = v[1];
                  return p ? A === "" && M !== "" ? 1 : A !== "" && M === "" || A > M ? -1 : A < M ? 1 : 0 : A === "" && M !== "" ? 1 : A !== "" && M === "" ? -1 : A > M ? 1 : A < M ? -1 : 0;
                };
              }), a = a.sort(l.parent.config.sorting(_));
              const h = [];
              for (let p = 0; p < a.length; p++) h[p] = a[p][0];
              return d.Dh.call(l, { action: "orderBy", rows: h, column: D, order: _ }), g.call(l, D, _), o.call(l, h), k.A.call(l, "onsort", l, D, _, h.map(((p) => p))), !0;
            }
          };
        }, 167: function(n, m, s) {
          s.d(m, { $f: function() {
            return g;
          }, IV: function() {
            return z;
          }, MY: function() {
            return B;
          }, ho: function() {
            return j;
          } });
          var d = s(805), k = s(657);
          const j = function(o) {
            const b = this;
            return b.options.search != 1 && b.options.filters != 1 || !b.results || (o = b.results.indexOf(o)), Math.ceil((parseInt(o) + 1) / parseInt(b.options.pagination)) - 1;
          }, z = function() {
            const o = this;
            if (o.pagination.children[0].innerHTML = "", o.pagination.children[1].innerHTML = "", o.options.pagination) {
              let b;
              if (b = o.options.search != 1 && o.options.filters != 1 || !o.results ? o.rows.length : o.results.length, b) {
                const D = Math.ceil(b / o.options.pagination);
                let _, l;
                if (o.pageNumber < 6 ? (_ = 1, l = D < 10 ? D : 10) : D - o.pageNumber < 5 ? (_ = D - 9, l = D, _ < 1 && (_ = 1)) : (_ = o.pageNumber - 4, l = o.pageNumber + 5), _ > 1) {
                  const h = document.createElement("div");
                  h.className = "jss_page", h.innerHTML = "<", h.title = 1, o.pagination.children[1].appendChild(h);
                }
                for (let h = _; h <= l; h++) {
                  const p = document.createElement("div");
                  p.className = "jss_page", p.innerHTML = h, o.pagination.children[1].appendChild(p), o.pageNumber == h - 1 && p.classList.add("jss_page_selected");
                }
                if (l < D) {
                  const h = document.createElement("div");
                  h.className = "jss_page", h.innerHTML = ">", h.title = D, o.pagination.children[1].appendChild(h);
                }
                const a = function(h) {
                  const p = Array.prototype.slice.call(arguments, 1);
                  return h.replace(/{(\d+)}/g, (function(u, v) {
                    return p[v] !== void 0 ? p[v] : u;
                  }));
                };
                o.pagination.children[0].innerHTML = a(jSuites.translate("Showing page {0} of {1} entries"), o.pageNumber + 1, D);
              } else o.pagination.children[0].innerHTML = jSuites.translate("No records found");
            }
          }, B = function(o) {
            const b = this, D = b.pageNumber;
            let _;
            _ = b.options.search != 1 && b.options.filters != 1 || !b.results ? b.rows : b.results;
            const l = parseInt(b.options.pagination);
            o != null && o != -1 || (o = Math.ceil(_.length / l) - 1), b.pageNumber = o;
            let a = o * l, h = o * l + l;
            for (h > _.length && (h = _.length), a < 0 && (a = 0); b.tbody.firstChild; ) b.tbody.removeChild(b.tbody.firstChild);
            for (let p = a; p < h; p++) b.options.search != 1 && b.options.filters != 1 || !b.results ? b.tbody.appendChild(b.rows[p].element) : b.tbody.appendChild(b.rows[_[p]].element);
            b.options.pagination > 0 && z.call(b), k.Aq.call(b), d.A.call(b, "onchangepage", b, o, D, b.options.pagination);
          }, g = function() {
            const o = this;
            let b;
            return b = o.options.search != 1 && o.options.filters != 1 || !o.results ? o.rows.length : o.results.length, Math.ceil(b / o.options.pagination);
          };
        }, 657: function(n, m, s) {
          s.d(m, { AH: function() {
            return a;
          }, Aq: function() {
            return b;
          }, G9: function() {
            return p;
          }, Jg: function() {
            return h;
          }, Lo: function() {
            return O;
          }, R5: function() {
            return T;
          }, Ub: function() {
            return I;
          }, at: function() {
            return N;
          }, c6: function() {
            return _;
          }, eO: function() {
            return U;
          }, ef: function() {
            return Y;
          }, gE: function() {
            return D;
          }, gG: function() {
            return u;
          }, kA: function() {
            return l;
          }, kF: function() {
            return A;
          }, kV: function() {
            return be;
          }, sp: function() {
            return ue;
          }, tW: function() {
            return M;
          } });
          var d = s(805), k = s(296), j = s(978), z = s(911), B = s(530), g = s(689), o = s(392);
          const b = function() {
            const G = this;
            if (G.highlighted && G.highlighted.length) {
              const ie = G.highlighted[G.highlighted.length - 1].element, ge = ie.getAttribute("data-x"), de = G.content.getBoundingClientRect(), oe = de.left, xe = de.top, Oe = ie.getBoundingClientRect(), Be = Oe.left, Re = Oe.top, $e = Oe.width, W = Oe.height, Ie = Be - oe + G.content.scrollLeft + $e - 4, Ve = Re - xe + G.content.scrollTop + W - 4;
              if (G.corner.style.top = Ve + "px", G.corner.style.left = Ie + "px", G.options.freezeColumns) {
                const st = k.w.call(G);
                ge > G.options.freezeColumns - 1 && Be - oe + $e < st ? G.corner.style.display = "none" : G.options.selectionCopy != 0 && (G.corner.style.display = "");
              } else G.options.selectionCopy != 0 && (G.corner.style.display = "");
            } else G.corner.style.top = "-2000px", G.corner.style.left = "-2000px";
            (0, o.nK)(G);
          }, D = function(G) {
            const ie = this;
            let ge;
            if (ie.highlighted && ie.highlighted.length) {
              ge = 1;
              for (let de = 0; de < ie.highlighted.length; de++) {
                ie.highlighted[de].element.classList.remove("highlight"), ie.highlighted[de].element.classList.remove("highlight-left"), ie.highlighted[de].element.classList.remove("highlight-right"), ie.highlighted[de].element.classList.remove("highlight-top"), ie.highlighted[de].element.classList.remove("highlight-bottom"), ie.highlighted[de].element.classList.remove("highlight-selected");
                const oe = parseInt(ie.highlighted[de].element.getAttribute("data-x")), xe = parseInt(ie.highlighted[de].element.getAttribute("data-y"));
                let Oe, Be;
                if (ie.highlighted[de].element.getAttribute("data-merged")) {
                  const Re = parseInt(ie.highlighted[de].element.getAttribute("colspan")), $e = parseInt(ie.highlighted[de].element.getAttribute("rowspan"));
                  Oe = Re > 0 ? oe + (Re - 1) : oe, Be = $e > 0 ? xe + ($e - 1) : xe;
                } else Oe = oe, Be = xe;
                for (let Re = oe; Re <= Oe; Re++) ie.headers[Re] && ie.headers[Re].classList.remove("selected");
                for (let Re = xe; Re <= Be; Re++) ie.rows[Re] && ie.rows[Re].element.classList.remove("selected");
              }
            } else ge = 0;
            return ie.highlighted = [], ie.selectedCell = null, ie.corner.style.top = "-2000px", ie.corner.style.left = "-2000px", G == 1 && ge == 1 && d.A.call(ie, "onblur", ie), ge;
          }, _ = function(G, ie, ge) {
            const de = G.getAttribute("data-x"), oe = G.getAttribute("data-y");
            let xe, Oe;
            ie ? (xe = ie.getAttribute("data-x"), Oe = ie.getAttribute("data-y")) : (xe = de, Oe = oe), a.call(this, de, oe, xe, Oe, ge);
          }, l = function() {
            const G = document.querySelectorAll(".jss_worksheet .copying");
            for (let ie = 0; ie < G.length; ie++) G[ie].classList.remove("copying"), G[ie].classList.remove("copying-left"), G[ie].classList.remove("copying-right"), G[ie].classList.remove("copying-top"), G[ie].classList.remove("copying-bottom");
          }, a = function(G, ie, ge, de, oe) {
            const xe = this;
            if (ie == null) {
              if (ie = 0, de = xe.rows.length - 1, G == null) return;
            } else G == null && (G = 0, ge = xe.options.data[0].length - 1);
            ge == null && (ge = G), de == null && (de = ie), G >= xe.headers.length && (G = xe.headers.length - 1), ie >= xe.rows.length && (ie = xe.rows.length - 1), ge >= xe.headers.length && (ge = xe.headers.length - 1), de >= xe.rows.length && (de = xe.rows.length - 1);
            let Oe, Be, Re, $e, W = null, Ie = null, Ve = null, st = null;
            parseInt(G) < parseInt(ge) ? (Oe = parseInt(G), Be = parseInt(ge)) : (Oe = parseInt(ge), Be = parseInt(G)), parseInt(ie) < parseInt(de) ? (Re = parseInt(ie), $e = parseInt(de)) : (Re = parseInt(de), $e = parseInt(ie));
            for (let Ce = Oe; Ce <= Be; Ce++) for (let Me = Re; Me <= $e; Me++) if (xe.records[Me][Ce] && xe.records[Me][Ce].element.getAttribute("data-merged")) {
              const Pe = parseInt(xe.records[Me][Ce].element.getAttribute("data-x")), He = parseInt(xe.records[Me][Ce].element.getAttribute("data-y")), Ye = parseInt(xe.records[Me][Ce].element.getAttribute("colspan")), et = parseInt(xe.records[Me][Ce].element.getAttribute("rowspan"));
              Ye > 1 && (Pe < Oe && (Oe = Pe), Pe + Ye > Be && (Be = Pe + Ye - 1)), et && (He < Re && (Re = He), He + et > $e && ($e = He + et - 1));
            }
            for (let Ce = Re; Ce <= $e; Ce++) xe.rows[Ce].element.style.display != "none" && (Ve == null && (Ve = Ce), st = Ce);
            for (let Ce = Oe; Ce <= Be; Ce++) for (let Me = Re; Me <= $e; Me++) xe.options.columns && xe.options.columns[Ce] && xe.options.columns[Ce].type == "hidden" || (W == null && (W = Ce), Ie = Ce);
            if (W || (W = 0), Ie || (Ie = 0), d.A.call(xe, "onbeforeselection", xe, W, Ve, Ie, st, oe) === !1) return !1;
            const Se = xe.resetSelection();
            xe.selectedCell = [G, ie, ge, de], xe.records[ie][G] && xe.records[ie][G].element.classList.add("highlight-selected");
            for (let Ce = Oe; Ce <= Be; Ce++) for (let Me = Re; Me <= $e; Me++) xe.rows[Me].element.style.display != "none" && xe.records[Me][Ce].element.style.display != "none" && (xe.records[Me][Ce].element.classList.add("highlight"), xe.highlighted.push(xe.records[Me][Ce]));
            for (let Ce = W; Ce <= Ie; Ce++) xe.options.columns && xe.options.columns[Ce] && xe.options.columns[Ce].type == "hidden" || !xe.cols[Ce].colElement.style || xe.cols[Ce].colElement.style.display == "none" || (xe.records[Ve] && xe.records[Ve][Ce] && xe.records[Ve][Ce].element.classList.add("highlight-top"), xe.records[st] && xe.records[st][Ce] && xe.records[st][Ce].element.classList.add("highlight-bottom"), xe.headers[Ce].classList.add("selected"));
            for (let Ce = Ve; Ce <= st; Ce++) xe.rows[Ce] && xe.rows[Ce].element.style.display != "none" && (xe.records[Ce][W].element.classList.add("highlight-left"), xe.records[Ce][Ie].element.classList.add("highlight-right"), xe.rows[Ce].element.classList.add("selected"));
            xe.selectedContainer = [W, Ve, Ie, st], Se == 0 && (d.A.call(xe, "onfocus", xe), l()), d.A.call(xe, "onselection", xe, W, Ve, Ie, st, oe), b.call(xe);
          }, h = function(G) {
            const ie = this;
            if (!ie.selectedCell) return [];
            const ge = [];
            for (let de = Math.min(ie.selectedCell[0], ie.selectedCell[2]); de <= Math.max(ie.selectedCell[0], ie.selectedCell[2]); de++) G && ie.headers[de].style.display == "none" || ge.push(de);
            return ge;
          }, p = function() {
            const G = this;
            G.selectedCell && G.updateSelectionFromCoords(G.selectedCell[0], G.selectedCell[1], G.selectedCell[2], G.selectedCell[3]);
          }, u = function() {
            const G = this;
            for (let ie = 0; ie < G.selection.length; ie++) G.selection[ie].classList.remove("selection"), G.selection[ie].classList.remove("selection-left"), G.selection[ie].classList.remove("selection-right"), G.selection[ie].classList.remove("selection-top"), G.selection[ie].classList.remove("selection-bottom");
            G.selection = [];
          }, v = function(G) {
            return (G = "" + G).length == 1 && (G = "0" + G), G;
          }, A = function(G, ie) {
            const ge = this, de = ge.getData(!0, !1), oe = ge.selectedContainer, xe = parseInt(G.getAttribute("data-x")), Oe = parseInt(G.getAttribute("data-y")), Be = parseInt(ie.getAttribute("data-x")), Re = parseInt(ie.getAttribute("data-y")), $e = [];
            let W, Ie, Ve = !1;
            oe[0] == xe ? (W = Oe < oe[1] ? Oe - oe[1] : 1, Ie = 0) : (Ie = xe < oe[0] ? xe - oe[0] : 1, W = 0);
            let st = 0, Se = 0;
            for (let Me = Oe; Me <= Re; Me++) if (!ge.rows[Me] || ge.rows[Me].element.style.display != "none") {
              de[Se] == null && (Se = 0), st = 0, oe[0] != xe && (Ie = xe < oe[0] ? xe - oe[0] : 1);
              for (let Pe = xe; Pe <= Be; Pe++) {
                if (ge.records[Me][Pe] && !ge.records[Me][Pe].element.classList.contains("readonly") && ge.records[Me][Pe].element.style.display != "none" && Ve == 0) {
                  if (!ge.selection.length && ge.options.data[Me][Pe] != "") {
                    Ve = !0;
                    continue;
                  }
                  (de[Se] == null || de[Se][st] == null) && (st = 0);
                  let He = de[Se][st];
                  if (He && !de[1] && ge.parent.config.autoIncrement != 0) if (!ge.options.columns || !ge.options.columns[Pe] || ge.options.columns[Pe].type && ge.options.columns[Pe].type != "text" && ge.options.columns[Pe].type != "number") {
                    if (ge.options.columns && ge.options.columns[Pe] && ge.options.columns[Pe].type == "calendar") {
                      const Ye = new Date(He);
                      Ye.setDate(Ye.getDate() + W), He = Ye.getFullYear() + "-" + v(parseInt(Ye.getMonth() + 1)) + "-" + v(Ye.getDate()) + " 00:00:00";
                    }
                  } else if (("" + He).substr(0, 1) == "=") {
                    const Ye = He.match(/([A-Z]+[0-9]+)/g);
                    if (Ye) {
                      const et = [];
                      for (let tt = 0; tt < Ye.length; tt++) {
                        const at = (0, g.vu)(Ye[tt], 1);
                        at[0] += Ie, at[1] += W, at[1] < 0 && (at[1] = 0);
                        const ft = (0, g.t3)([at[0], at[1]]);
                        ft != Ye[tt] && (et[Ye[tt]] = ft);
                      }
                      et && (He = (0, B.yB)(He, et));
                    }
                  } else He == Number(He) && (He = Number(He) + W);
                  $e.push(B.k9.call(ge, Pe, Me, He)), B.xF.call(ge, Pe, Me, $e);
                }
                st++, oe[0] != xe && Ie++;
              }
              Se++, W++;
            }
            z.Dh.call(ge, { action: "setValue", records: $e, selection: ge.selectedCell }), B.am.call(ge);
            const Ce = $e.map((function(Me) {
              return { x: Me.x, y: Me.y, value: Me.value, oldValue: Me.oldValue };
            }));
            d.A.call(ge, "onafterchanges", ge, Ce);
          }, M = function(G) {
            let ie, ge, de = 0;
            if (!G || G.length === 0) return de;
            for (ie = 0; ie < G.length; ie++) ge = G.charCodeAt(ie), de = (de << 5) - de + ge, de |= 0;
            return de;
          }, N = function(G, ie, ge) {
            const de = this;
            if (G == 1) {
              if (de.selectedCell && (ie >= de.selectedCell[1] && ie <= de.selectedCell[3] || ge >= de.selectedCell[1] && ge <= de.selectedCell[3])) return void de.resetSelection();
            } else if (de.selectedCell && (ie >= de.selectedCell[0] && ie <= de.selectedCell[2] || ge >= de.selectedCell[0] && ge <= de.selectedCell[2])) return void de.resetSelection();
          }, T = function(G) {
            const ie = this;
            if (!ie.selectedCell) return [];
            const ge = [];
            for (let de = Math.min(ie.selectedCell[1], ie.selectedCell[3]); de <= Math.max(ie.selectedCell[1], ie.selectedCell[3]); de++) G && ie.rows[de].element.style.display == "none" || ge.push(de);
            return ge;
          }, I = function() {
            const G = this;
            G.selectedCell || (G.selectedCell = []), G.selectedCell[0] = 0, G.selectedCell[1] = 0, G.selectedCell[2] = G.headers.length - 1, G.selectedCell[3] = G.records.length - 1, G.updateSelectionFromCoords(G.selectedCell[0], G.selectedCell[1], G.selectedCell[2], G.selectedCell[3]);
          }, O = function() {
            const G = this;
            return G.selectedCell ? [Math.min(G.selectedCell[0], G.selectedCell[2]), Math.min(G.selectedCell[1], G.selectedCell[3]), Math.max(G.selectedCell[0], G.selectedCell[2]), Math.max(G.selectedCell[1], G.selectedCell[3])] : null;
          }, Y = function(G) {
            const ie = this, ge = O.call(ie);
            if (!ge) return [];
            const de = [];
            for (let oe = ge[1]; oe <= ge[3]; oe++) for (let xe = ge[0]; xe <= ge[2]; xe++) G ? de.push((0, j.getCellNameFromCoords)(xe, oe)) : de.push(ie.records[oe][xe]);
            return de;
          }, U = function() {
            const G = this, ie = O.call(G);
            if (!ie) return "";
            const ge = (0, j.getCellNameFromCoords)(ie[0], ie[1]), de = (0, j.getCellNameFromCoords)(ie[2], ie[3]);
            return ge === de ? G.options.worksheetName + "!" + ge : G.options.worksheetName + "!" + ge + ":" + de;
          }, ue = function(G, ie) {
            const ge = O.call(this);
            return G >= ge[0] && G <= ge[2] && ie >= ge[1] && ie <= ge[3];
          }, be = function() {
            const G = O.call(this);
            return G ? [G] : [];
          };
        }, 392: function(n, m, s) {
          s.d(m, { Ar: function() {
            return D;
          }, ll: function() {
            return b;
          }, nK: function() {
            return o;
          } });
          var d = s(978), k = s(530);
          const j = function(_, l) {
            l.options.editable != 0 ? _.classList.remove("jtoolbar-disabled") : _.classList.add("jtoolbar-disabled");
          }, z = function() {
            const _ = [], l = this, a = function() {
              return k.eN.call(l);
            };
            _.push({ content: "undo", onclick: function() {
              a().undo();
            } }), _.push({ content: "redo", onclick: function() {
              a().redo();
            } }), _.push({ content: "save", onclick: function() {
              const p = a();
              p && p.download();
            } }), _.push({ type: "divisor" }), _.push({ type: "select", width: "120px", options: ["Default", "Verdana", "Arial", "Courier New"], render: function(p) {
              return '<span style="font-family:' + p + '">' + p + "</span>";
            }, onchange: function(p, u, v, A, M) {
              const N = a();
              let T = N.getSelected(!0);
              if (T) {
                let I = M ? A : "";
                N.setStyle(Object.fromEntries(T.map((function(O) {
                  return [O, "font-family: " + I];
                }))));
              }
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "select", width: "48px", content: "format_size", options: ["x-small", "small", "medium", "large", "x-large"], render: function(p) {
              return '<span style="font-size:' + p + '">' + p + "</span>";
            }, onchange: function(p, u, v, A) {
              const M = a();
              let N = M.getSelected(!0);
              N && M.setStyle(Object.fromEntries(N.map((function(T) {
                return [T, "font-size: " + A];
              }))));
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "select", options: ["left", "center", "right", "justify"], render: function(p) {
              return '<i class="material-icons">format_align_' + p + "</i>";
            }, onchange: function(p, u, v, A) {
              const M = a();
              let N = M.getSelected(!0);
              N && M.setStyle(Object.fromEntries(N.map((function(T) {
                return [T, "text-align: " + A];
              }))));
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ content: "format_bold", onclick: function(p, u, v) {
              const A = a();
              let M = A.getSelected(!0);
              M && A.setStyle(Object.fromEntries(M.map((function(N) {
                return [N, "font-weight:bold"];
              }))));
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "color", content: "format_color_text", k: "color", updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "color", content: "format_color_fill", k: "background-color", updateState: function(p, u, v, A) {
              j(v, a());
            } });
            let h = ["top", "middle", "bottom"];
            return _.push({ type: "select", options: ["vertical_align_top", "vertical_align_center", "vertical_align_bottom"], render: function(p) {
              return '<i class="material-icons">' + p + "</i>";
            }, value: 1, onchange: function(p, u, v, A, M) {
              const N = a();
              let T = N.getSelected(!0);
              T && N.setStyle(Object.fromEntries(T.map((function(I) {
                return [I, "vertical-align: " + h[M]];
              }))));
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ content: "web", tooltip: jSuites.translate("Merge the selected cells"), onclick: function() {
              const p = a();
              if (p.selectedCell && confirm(jSuites.translate("The merged cells will retain the value of the top-left cell only. Are you sure?"))) {
                const u = [Math.min(p.selectedCell[0], p.selectedCell[2]), Math.min(p.selectedCell[1], p.selectedCell[3]), Math.max(p.selectedCell[0], p.selectedCell[2]), Math.max(p.selectedCell[1], p.selectedCell[3])];
                let v = (0, d.getCellNameFromCoords)(u[0], u[1]);
                if (p.records[u[1]][u[0]].element.getAttribute("data-merged")) p.removeMerge(v);
                else {
                  let A = u[2] - u[0] + 1, M = u[3] - u[1] + 1;
                  A === 1 && M === 1 || p.setMerge(v, A, M);
                }
              }
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "select", options: ["border_all", "border_outer", "border_inner", "border_horizontal", "border_vertical", "border_left", "border_top", "border_right", "border_bottom", "border_clear"], columns: 5, render: function(p) {
              return '<i class="material-icons">' + p + "</i>";
            }, right: !0, onchange: function(p, u, v, A) {
              const M = a();
              if (M.selectedCell) {
                const N = [Math.min(M.selectedCell[0], M.selectedCell[2]), Math.min(M.selectedCell[1], M.selectedCell[3]), Math.max(M.selectedCell[0], M.selectedCell[2]), Math.max(M.selectedCell[1], M.selectedCell[3])];
                let T = A;
                if (N) {
                  let I = u.thickness || 1, O = u.color || "black";
                  const Y = u.style || "solid";
                  Y === "double" && (I += 2);
                  let U = {}, ue = N[0], be = N[1], G = N[2], ie = N[3];
                  const ge = function(de, oe, xe) {
                    let Oe = ["", "", "", ""];
                    Oe[0] = (T === "border_top" || T === "border_outer") && xe === be || (T === "border_inner" || T === "border_horizontal") && xe > be || T === "border_all" ? "border-top: " + I + "px " + Y + " " + O : "border-top: ", Oe[1] = T !== "border_all" && T !== "border_right" && T !== "border_outer" || oe !== G ? "border-right: " : "border-right: " + I + "px " + Y + " " + O, Oe[2] = T !== "border_all" && T !== "border_bottom" && T !== "border_outer" || xe !== ie ? "border-bottom: " : "border-bottom: " + I + "px " + Y + " " + O, Oe[3] = (T === "border_left" || T === "border_outer") && oe === ue || (T === "border_inner" || T === "border_vertical") && oe > ue || T === "border_all" ? "border-left: " + I + "px " + Y + " " + O : "border-left: ", U[de] = Oe.join(";");
                  };
                  for (let de = N[1]; de <= N[3]; de++) for (let oe = N[0]; oe <= N[2]; oe++) ge((0, d.getCellNameFromCoords)(oe, de), oe, de), M.records[de][oe].element.getAttribute("data-merged") && ge((0, d.getCellNameFromCoords)(N[0], N[1]), oe, de);
                  Object.keys(U) && M.setStyle(U);
                }
              }
            }, onload: function(p, u) {
              let v = document.createElement("div"), A = document.createElement("div");
              v.appendChild(A);
              let M = jSuites.color(A, { closeOnChange: !1, onchange: function(I, O) {
                I.parentNode.children[1].style.color = O, u.color = O;
              } }), N = document.createElement("i");
              N.classList.add("material-icons"), N.innerHTML = "color_lens", N.onclick = function() {
                M.open();
              }, v.appendChild(N), p.children[1].appendChild(v), A = document.createElement("div"), jSuites.picker(A, { type: "select", data: [1, 2, 3, 4, 5], render: function(I) {
                return '<div style="height: ' + I + 'px; width: 30px; background-color: black;"></div>';
              }, onchange: function(I, O, Y, U) {
                u.thickness = U;
              }, width: "50px" }), p.children[1].appendChild(A);
              const T = document.createElement("div");
              jSuites.picker(T, { type: "select", data: ["solid", "dotted", "dashed", "double"], render: function(I) {
                return I === "double" ? '<div style="width: 30px; border-top: 3px ' + I + ' black;"></div>' : '<div style="width: 30px; border-top: 2px ' + I + ' black;"></div>';
              }, onchange: function(I, O, Y, U) {
                u.style = U;
              }, width: "50px" }), p.children[1].appendChild(T), A = document.createElement("div"), A.style.flex = "1", p.children[1].appendChild(A);
            }, updateState: function(p, u, v) {
              j(v, a());
            } }), _.push({ type: "divisor" }), _.push({ content: "fullscreen", tooltip: "Toggle Fullscreen", onclick: function(p, u, v) {
              v.children[0].textContent === "fullscreen" ? (l.fullscreen(!0), v.children[0].textContent = "fullscreen_exit") : (l.fullscreen(!1), v.children[0].textContent = "fullscreen");
            }, updateState: function(p, u, v, A) {
              A.parent.config.fullscreen === !0 ? v.children[0].textContent = "fullscreen_exit" : v.children[0].textContent = "fullscreen";
            } }), _;
          }, B = function(_) {
            const l = this, a = _.items;
            for (let h = 0; h < a.length; h++) a[h].tooltip && (a[h].title = a[h].tooltip, delete a[h].tooltip), a[h].type == "select" ? a[h].options ? (a[h].data = a[h].options, delete a[h].options) : (a[h].data = a[h].v, delete a[h].v, a[h].k && !a[h].onchange && (a[h].onchange = function(p, u, v) {
              const A = k.eN.call(l), M = A.getSelected(!0);
              A.setStyle(Object.fromEntries(M.map((function(N) {
                return [N, a[h].k + ": " + v];
              }))));
            })) : a[h].type == "color" && (a[h].type = "i", a[h].onclick = function(p, u, v) {
              v.color || (jSuites.color(v, { onchange: function(A, M) {
                const N = k.eN.call(l), T = N.getSelected(!0);
                N.setStyle(Object.fromEntries(T.map((function(I) {
                  return [I, a[h].k + ": " + M];
                }))));
              }, onopen: function(A) {
                A.color.select("");
              } }), v.color.open());
            });
          }, g = function(_) {
            const l = this, a = document.createElement("div");
            return a.classList.add("jss_toolbar"), B.call(l, _), typeof l.plugins == "object" && Object.entries(l.plugins).forEach((function([, h]) {
              if (typeof h.toolbar == "function") {
                const p = h.toolbar(_);
                p && (_ = p);
              }
            })), jSuites.toolbar(a, _), a;
          }, o = function(_) {
            _.parent.toolbar && _.parent.toolbar.toolbar.update(_);
          }, b = function() {
            const _ = this;
            if (_.config.toolbar && !_.toolbar) {
              let l;
              Array.isArray(_.config.toolbar) ? l = { items: _.config.toolbar } : typeof _.config.toolbar == "object" ? l = _.config.toolbar : (l = { items: z.call(_) }, typeof _.config.toolbar == "function" && (l = _.config.toolbar(l))), _.toolbar = _.element.insertBefore(g.call(_, l), _.element.children[1]);
            }
          }, D = function() {
            const _ = this;
            _.toolbar && (_.toolbar.parentNode.removeChild(_.toolbar), delete _.toolbar);
          };
        } }, __webpack_module_cache__ = {};
        function __webpack_require__(n) {
          var m = __webpack_module_cache__[n];
          if (m !== void 0) return m.exports;
          var s = __webpack_module_cache__[n] = { exports: {} };
          return __webpack_modules__[n](s, s.exports, __webpack_require__), s.exports;
        }
        __webpack_require__.d = function(n, m) {
          for (var s in m) __webpack_require__.o(m, s) && !__webpack_require__.o(n, s) && Object.defineProperty(n, s, { enumerable: !0, get: m[s] });
        }, __webpack_require__.o = function(n, m) {
          return Object.prototype.hasOwnProperty.call(n, m);
        }, __webpack_require__.r = function(n) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
        };
        var __webpack_exports__ = {};
        __webpack_require__.d(__webpack_exports__, { default: function() {
          return src;
        } });
        const lib = { jspreadsheet: {} };
        var libraryBase = lib, dispatch = __webpack_require__(805), internal = __webpack_require__(530), utils_history = __webpack_require__(911);
        const openEditor = function(n, m, s) {
          const d = this, k = n.getAttribute("data-y"), j = n.getAttribute("data-x");
          dispatch.A.call(d, "oneditionstart", d, n, parseInt(j), parseInt(k)), j > 0 && (d.records[k][j - 1].element.style.overflow = "hidden");
          const z = function(B) {
            const g = n.getBoundingClientRect(), o = document.createElement(B);
            return o.style.width = g.width + "px", o.style.height = g.height - 2 + "px", o.style.minHeight = g.height - 2 + "px", n.classList.add("editor"), n.innerHTML = "", n.appendChild(o), o;
          };
          if (n.classList.contains("readonly") != 1) {
            if (d.edition = [d.records[k][j].element, d.records[k][j].element.innerHTML, j, k], d.options.columns && d.options.columns[j] && typeof d.options.columns[j].type == "object") d.options.columns[j].type.openEditor(n, d.options.data[k][j], parseInt(j), parseInt(k), d, d.options.columns[j], s), dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]);
            else if (!(d.options.columns && d.options.columns[j] && d.options.columns[j].type == "hidden")) if (d.options.columns && d.options.columns[j] && (d.options.columns[j].type == "checkbox" || d.options.columns[j].type == "radio")) {
              const B = !n.children[0].checked;
              d.setValue(n, B), d.edition = null;
            } else if (d.options.columns && d.options.columns[j] && d.options.columns[j].type == "dropdown") {
              let B, g = d.options.data[k][j];
              d.options.columns[j].multiple && !Array.isArray(g) && (g = g.split(";")), B = typeof d.options.columns[j].filter == "function" ? d.options.columns[j].filter(d.element, n, j, k, d.options.columns[j].source) : d.options.columns[j].source;
              const o = [];
              if (B) for (let _ = 0; _ < B.length; _++) o.push(B[_]);
              const b = z("div");
              dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]);
              const D = { data: o, multiple: !!d.options.columns[j].multiple, autocomplete: !!d.options.columns[j].autocomplete, opened: !0, value: g, width: "100%", height: b.style.minHeight, position: d.options.tableOverflow == 1 || d.parent.config.fullscreen == 1, onclose: function() {
                closeEditor.call(d, n, !0);
              } };
              d.options.columns[j].options && d.options.columns[j].options.type && (D.type = d.options.columns[j].options.type), jSuites.dropdown(b, D);
            } else if (d.options.columns && d.options.columns[j] && (d.options.columns[j].type == "calendar" || d.options.columns[j].type == "color")) {
              const B = d.options.data[k][j], g = z("input");
              dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]), g.value = B;
              const o = d.options.columns[j].options ? { ...d.options.columns[j].options } : {};
              if (d.options.tableOverflow != 1 && d.parent.config.fullscreen != 1 || (o.position = !0), o.value = d.options.data[k][j], o.opened = !0, o.onclose = function(b, D) {
                closeEditor.call(d, n, !0);
              }, d.options.columns[j].type == "color") {
                jSuites.color(g, o);
                const b = n.getBoundingClientRect();
                o.position && (g.nextSibling.children[1].style.top = b.top + b.height + "px", g.nextSibling.children[1].style.left = b.left + "px");
              } else o.format || (o.format = "YYYY-MM-DD"), jSuites.calendar(g, o);
              g.focus();
            } else if (d.options.columns && d.options.columns[j] && d.options.columns[j].type == "html") {
              const B = d.options.data[k][j], g = z("div");
              dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]), g.style.position = "relative";
              const o = document.createElement("div");
              o.classList.add("jss_richtext"), g.appendChild(o), jSuites.editor(o, { focus: !0, value: B });
              const b = n.getBoundingClientRect(), D = o.getBoundingClientRect();
              window.innerHeight < b.bottom + D.height ? o.style.top = b.bottom - (D.height + 2) + "px" : o.style.top = b.top + "px", window.innerWidth < b.left + D.width ? o.style.left = b.right - (D.width + 2) + "px" : o.style.left = b.left + "px";
            } else if (d.options.columns && d.options.columns[j] && d.options.columns[j].type == "image") {
              const B = n.children[0], g = z("div");
              dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]), g.style.position = "relative";
              const o = document.createElement("div");
              o.classList.add("jclose"), B && B.src && o.appendChild(B), g.appendChild(o), jSuites.image(o, d.options.columns[j]);
              const b = n.getBoundingClientRect(), D = o.getBoundingClientRect();
              window.innerHeight < b.bottom + D.height ? o.style.top = b.top - (D.height + 2) + "px" : o.style.top = b.top + "px", o.style.left = b.left + "px";
            } else {
              const B = m == 1 ? "" : d.options.data[k][j];
              let g;
              g = d.options.columns && d.options.columns[j] && d.options.columns[j].wordWrap == 0 || !(d.options.wordWrap == 1 || d.options.columns && d.options.columns[j] && d.options.columns[j].wordWrap == 1) ? z("input") : z("textarea"), dispatch.A.call(d, "oncreateeditor", d, n, parseInt(j), parseInt(k), null, d.options.columns[j]), g.focus(), g.value = B;
              const o = d.options.columns && d.options.columns[j];
              if (!(0, internal.dw)(B) && o) {
                const b = (0, internal.rS)(o);
                if (b) {
                  if (!o.disabledMaskOnEdition) if (o.mask) {
                    const D = o.mask.split(";");
                    g.setAttribute("data-mask", D[0]);
                  } else o.locale && g.setAttribute("data-locale", o.locale);
                  b.input = g, g.mask = b, jSuites.mask.render(B, b, !1);
                }
              }
              g.onblur = function() {
                closeEditor.call(d, n, !0);
              }, g.scrollLeft = g.scrollWidth;
            }
          }
        }, closeEditor = function(n, m) {
          const s = this, d = parseInt(n.getAttribute("data-x")), k = parseInt(n.getAttribute("data-y"));
          let j;
          if (m == 1) {
            if (s.options.columns && s.options.columns[d] && typeof s.options.columns[d].type == "object") j = s.options.columns[d].type.closeEditor(n, m, parseInt(d), parseInt(k), s, s.options.columns[d]);
            else if (!(s.options.columns && s.options.columns[d] && (s.options.columns[d].type == "checkbox" || s.options.columns[d].type == "radio" || s.options.columns[d].type == "hidden"))) if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "dropdown") j = n.children[0].dropdown.close(!0);
            else if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "calendar") j = n.children[0].calendar.close(!0);
            else if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "color") j = n.children[0].color.close(!0);
            else if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "html") j = n.children[0].children[0].editor.getData();
            else if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "image") {
              const z = n.children[0].children[0].children[0];
              j = z && z.tagName == "IMG" ? z.src : "";
            } else if (s.options.columns && s.options.columns[d] && s.options.columns[d].type == "numeric") j = n.children[0].value, ("" + j).substr(0, 1) != "=" && j == "" && (j = s.options.columns[d].allowEmpty ? "" : 0), n.children[0].onblur = null;
            else {
              j = n.children[0].value, n.children[0].onblur = null;
              const z = s.options.columns && s.options.columns[d];
              if (z) {
                const B = (0, internal.rS)(z);
                if (B && j !== "" && !(0, internal.dw)(j) && typeof j != "number") {
                  const g = jSuites.mask.extract(j, B, !0);
                  g && g.value !== "" && (j = g.value);
                }
              }
            }
            s.options.data[k][d] == j ? n.innerHTML = s.edition[1] : s.setValue(n, j);
          } else s.options.columns && s.options.columns[d] && typeof s.options.columns[d].type == "object" ? s.options.columns[d].type.closeEditor(n, m, parseInt(d), parseInt(k), s, s.options.columns[d]) : s.options.columns && s.options.columns[d] && s.options.columns[d].type == "dropdown" ? n.children[0].dropdown.close(!0) : s.options.columns && s.options.columns[d] && s.options.columns[d].type == "calendar" ? n.children[0].calendar.close(!0) : s.options.columns && s.options.columns[d] && s.options.columns[d].type == "color" ? n.children[0].color.close(!0) : n.children[0].onblur = null, n.innerHTML = s.edition && s.edition[1] ? s.edition[1] : "";
          dispatch.A.call(s, "oneditionend", s, n, d, k, j, m), n.classList.remove("editor"), s.edition = null;
        }, setCheckRadioValue = function() {
          const n = this, m = [], s = Object.keys(n.highlighted);
          for (let d = 0; d < s.length; d++) {
            const k = n.highlighted[d].element.getAttribute("data-x"), j = n.highlighted[d].element.getAttribute("data-y");
            n.options.columns[k].type != "checkbox" && n.options.columns[k].type != "radio" || m.push(internal.k9.call(n, k, j, !n.options.data[j][k]));
          }
          if (m.length) {
            utils_history.Dh.call(n, { action: "setValue", records: m, selection: n.selectedCell });
            const d = m.map((function(k) {
              return { x: k.x, y: k.y, value: k.value, oldValue: k.oldValue };
            }));
            dispatch.A.call(n, "onafterchanges", n, d);
          }
        };
        var lazyLoading = __webpack_require__(497);
        const upGet = function(n, m) {
          const s = this;
          n = parseInt(n);
          for (let d = (m = parseInt(m)) - 1; d >= 0; d--) if (s.records[d][n].element.style.display != "none" && s.rows[d].element.style.display != "none") {
            if (s.records[d][n].element.getAttribute("data-merged") && s.records[d][n].element == s.records[m][n].element) continue;
            m = d;
            break;
          }
          return m;
        }, upVisible = function(n, m) {
          const s = this;
          let d, k;
          if (n == 0 ? (d = parseInt(s.selectedCell[0]), k = parseInt(s.selectedCell[1])) : (d = parseInt(s.selectedCell[2]), k = parseInt(s.selectedCell[3])), m == 0) {
            for (let j = 0; j < k; j++) if (s.records[j][d].element.style.display != "none" && s.rows[j].element.style.display != "none") {
              k = j;
              break;
            }
          } else k = upGet.call(s, d, k);
          n == 0 ? (s.selectedCell[0] = d, s.selectedCell[1] = k) : (s.selectedCell[2] = d, s.selectedCell[3] = k);
        }, up = function(n, m) {
          const s = this;
          if (n ? s.selectedCell[3] > 0 && upVisible.call(s, 1, m ? 0 : 1) : (s.selectedCell[1] > 0 && upVisible.call(s, 0, m ? 0 : 1), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), s.options.lazyLoading == 1) if (s.selectedCell[1] == 0 || s.selectedCell[3] == 0) lazyLoading.wu.call(s, 0), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]);
          else if (lazyLoading.AG.call(s)) s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]);
          else {
            const d = parseInt(s.tbody.firstChild.getAttribute("data-y"));
            s.selectedCell[1] - d < 30 && (lazyLoading.G_.call(s), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]));
          }
          else if (s.options.pagination > 0) {
            const d = s.whichPage(s.selectedCell[3]);
            d != s.pageNumber && s.page(d);
          }
          internal.Rs.call(s, 1);
        }, rightGet = function(n, m) {
          const s = this;
          n = parseInt(n), m = parseInt(m);
          for (let d = n + 1; d < s.headers.length; d++) if (s.records[m][d].element.style.display != "none") {
            if (s.records[m][d].element.getAttribute("data-merged") && s.records[m][d].element == s.records[m][n].element) continue;
            n = d;
            break;
          }
          return n;
        }, rightVisible = function(n, m) {
          const s = this;
          let d, k;
          if (n == 0 ? (d = parseInt(s.selectedCell[0]), k = parseInt(s.selectedCell[1])) : (d = parseInt(s.selectedCell[2]), k = parseInt(s.selectedCell[3])), m == 0) {
            for (let j = s.headers.length - 1; j > d; j--) if (s.records[k][j].element.style.display != "none") {
              d = j;
              break;
            }
          } else d = rightGet.call(s, d, k);
          n == 0 ? (s.selectedCell[0] = d, s.selectedCell[1] = k) : (s.selectedCell[2] = d, s.selectedCell[3] = k);
        }, right = function(n, m) {
          const s = this;
          n ? s.selectedCell[2] < s.headers.length - 1 && rightVisible.call(s, 1, m ? 0 : 1) : (s.selectedCell[0] < s.headers.length - 1 && rightVisible.call(s, 0, m ? 0 : 1), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), internal.Rs.call(s, 2);
        }, downGet = function(n, m) {
          const s = this;
          n = parseInt(n);
          for (let d = (m = parseInt(m)) + 1; d < s.rows.length; d++) if (s.records[d][n].element.style.display != "none" && s.rows[d].element.style.display != "none") {
            if (s.records[d][n].element.getAttribute("data-merged") && s.records[d][n].element == s.records[m][n].element) continue;
            m = d;
            break;
          }
          return m;
        }, downVisible = function(n, m) {
          const s = this;
          let d, k;
          if (n == 0 ? (d = parseInt(s.selectedCell[0]), k = parseInt(s.selectedCell[1])) : (d = parseInt(s.selectedCell[2]), k = parseInt(s.selectedCell[3])), m == 0) {
            for (let j = s.rows.length - 1; j > k; j--) if (s.records[j][d].element.style.display != "none" && s.rows[j].element.style.display != "none") {
              k = j;
              break;
            }
          } else k = downGet.call(s, d, k);
          n == 0 ? (s.selectedCell[0] = d, s.selectedCell[1] = k) : (s.selectedCell[2] = d, s.selectedCell[3] = k);
        }, down = function(n, m) {
          const s = this;
          if (n ? s.selectedCell[3] < s.records.length - 1 && downVisible.call(s, 1, m ? 0 : 1) : (s.selectedCell[1] < s.records.length - 1 && downVisible.call(s, 0, m ? 0 : 1), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), s.options.lazyLoading == 1) s.selectedCell[1] == s.records.length - 1 || s.selectedCell[3] == s.records.length - 1 ? (lazyLoading.wu.call(s, -1), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3])) : lazyLoading.AG.call(s) ? s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]) : parseInt(s.tbody.lastChild.getAttribute("data-y")) - s.selectedCell[3] < 30 && (lazyLoading.p6.call(s), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]));
          else if (s.options.pagination > 0) {
            const d = s.whichPage(s.selectedCell[3]);
            d != s.pageNumber && s.page(d);
          }
          internal.Rs.call(s, 3);
        }, leftGet = function(n, m) {
          const s = this;
          n = parseInt(n), m = parseInt(m);
          for (let d = n - 1; d >= 0; d--) if (s.records[m][d].element.style.display != "none") {
            if (s.records[m][d].element.getAttribute("data-merged") && s.records[m][d].element == s.records[m][n].element) continue;
            n = d;
            break;
          }
          return n;
        }, leftVisible = function(n, m) {
          const s = this;
          let d, k;
          if (n == 0 ? (d = parseInt(s.selectedCell[0]), k = parseInt(s.selectedCell[1])) : (d = parseInt(s.selectedCell[2]), k = parseInt(s.selectedCell[3])), m == 0) {
            for (let j = 0; j < d; j++) if (s.records[k][j].element.style.display != "none") {
              d = j;
              break;
            }
          } else d = leftGet.call(s, d, k);
          n == 0 ? (s.selectedCell[0] = d, s.selectedCell[1] = k) : (s.selectedCell[2] = d, s.selectedCell[3] = k);
        }, left = function(n, m) {
          const s = this;
          n ? s.selectedCell[2] > 0 && leftVisible.call(s, 1, m ? 0 : 1) : (s.selectedCell[0] > 0 && leftVisible.call(s, 0, m ? 0 : 1), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), internal.Rs.call(s, 0);
        }, first = function(n, m) {
          const s = this;
          if (n ? m ? s.selectedCell[3] = 0 : leftVisible.call(s, 1, 0) : (m ? s.selectedCell[1] = 0 : leftVisible.call(s, 0, 0), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.options.lazyLoading != 1 || s.selectedCell[1] != 0 && s.selectedCell[3] != 0) {
            if (s.options.pagination > 0) {
              const d = s.whichPage(s.selectedCell[3]);
              d != s.pageNumber && s.page(d);
            }
          } else lazyLoading.wu.call(s, 0);
          s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), internal.Rs.call(s, 1);
        }, last = function(n, m) {
          const s = this;
          if (n ? m ? s.selectedCell[3] = s.records.length - 1 : rightVisible.call(s, 1, 0) : (m ? s.selectedCell[1] = s.records.length - 1 : rightVisible.call(s, 0, 0), s.selectedCell[2] = s.selectedCell[0], s.selectedCell[3] = s.selectedCell[1]), s.options.lazyLoading != 1 || s.selectedCell[1] != s.records.length - 1 && s.selectedCell[3] != s.records.length - 1) {
            if (s.options.pagination > 0) {
              const d = s.whichPage(s.selectedCell[3]);
              d != s.pageNumber && s.page(d);
            }
          } else lazyLoading.wu.call(s, -1);
          s.updateSelectionFromCoords(s.selectedCell[0], s.selectedCell[1], s.selectedCell[2], s.selectedCell[3]), internal.Rs.call(s, 3);
        };
        var merges = __webpack_require__(910), selection = __webpack_require__(657), helpers = __webpack_require__(978), internalHelpers = __webpack_require__(689);
        const copy = function(n, m, s, d, k, j, z) {
          const B = this;
          m || (m = "	");
          const g = new RegExp(m, "ig"), o = [];
          let b = [], D = [];
          const _ = [], l = [], a = B.options.data[0].length, h = B.options.data.length;
          let p = "", u = !1, v = "", A = "", M = 0, N = 0, T = 0;
          for (let Y = 0; Y < h; Y++) for (let U = 0; U < a; U++) n && !B.records[Y][U].element.classList.contains("highlight") || T <= Y && (T = Y);
          if (k && (B.parent.config.includeHeadersOnDownload == 1 || d)) {
            if (B.options.nestedHeaders && B.options.nestedHeaders.length > 0) {
              p = B.options.nestedHeaders;
              for (let Y = 0; Y < p.length; Y++) {
                const U = [];
                for (let ue = 0; ue < p[Y].length; ue++) {
                  const be = parseInt(p[Y][ue].colspan);
                  U.push(p[Y][ue].title);
                  for (let G = 0; G < be - 1; G++) U.push("");
                }
                A += U.join(m) + `\r
`;
              }
            }
            u = !0;
          }
          B.style = [];
          for (let Y = 0; Y < h; Y++) {
            b = [], D = [];
            for (let U = 0; U < a; U++) if (!n || B.records[Y][U].element.classList.contains("highlight")) {
              u == 1 && o.push(B.headers[U].textContent);
              let ue, be = B.options.data[Y][U];
              be.match && (be.match(g) || be.match(/,/g) || be.match(/\n/) || be.match(/\"/)) && (be = be.replace(new RegExp('"', "g"), '""'), be = '"' + be + '"'), b.push(be), B.options.columns && B.options.columns[U] && (B.options.columns[U].type == "checkbox" || B.options.columns[U].type == "radio") ? ue = be : (ue = B.records[Y][U].element.innerHTML, ue.match && (ue.match(g) || ue.match(/,/g) || ue.match(/\n/) || ue.match(/\"/)) && (ue = ue.replace(new RegExp('"', "g"), '""'), ue = '"' + ue + '"')), D.push(ue), p = B.records[Y][U].element.getAttribute("style"), p = p.replace("display: none;", ""), B.style.push(p || "");
            }
            b.length && (u && (M = b.length, _.push(o.join(m))), _.push(b.join(m))), D.length && (N++, u && (l.push(o.join(m)), u = !1), l.push(D.join(m)));
          }
          a == M && h == N && (v = A);
          const I = v + _.join(`\r
`);
          let O = v + l.join(`\r
`);
          if (!s) {
            const Y = [Math.min(B.selectedCell[0], B.selectedCell[2]), Math.min(B.selectedCell[1], B.selectedCell[3]), Math.max(B.selectedCell[0], B.selectedCell[2]), Math.max(B.selectedCell[1], B.selectedCell[3])], U = dispatch.A.call(B, "oncopy", B, Y, O, j);
            if (U) O = U;
            else if (U === !1) return !1;
            B.textarea.value = O, B.textarea.select(), document.execCommand("copy");
          }
          if (B.data = z == 1 ? O : I, B.hashString = selection.tW.call(B, B.data), !s && (selection.kA.call(B), B.highlighted)) for (let Y = 0; Y < B.highlighted.length; Y++) B.highlighted[Y].element.classList.add("copying"), B.highlighted[Y].element.classList.contains("highlight-left") && B.highlighted[Y].element.classList.add("copying-left"), B.highlighted[Y].element.classList.contains("highlight-right") && B.highlighted[Y].element.classList.add("copying-right"), B.highlighted[Y].element.classList.contains("highlight-top") && B.highlighted[Y].element.classList.add("copying-top"), B.highlighted[Y].element.classList.contains("highlight-bottom") && B.highlighted[Y].element.classList.add("copying-bottom");
          return B.data;
        }, paste = function(n, m, s) {
          const d = this, k = (0, selection.tW)(s);
          let j = k == d.hashString ? d.style : null;
          k == d.hashString && (s = d.data), s = (0, helpers.parseCSV)(s, "	");
          const z = d.selectedCell[2] - n + 1, B = d.selectedCell[3] - m + 1, g = s[0].length;
          if (z > 1 & Number.isInteger(z / g)) {
            const D = z / g;
            if (j) {
              const l = [];
              for (let a = 0; a < j.length; a += g) {
                const h = j.slice(a, a + g);
                for (let p = 0; p < D; p++) l.push(...h);
              }
              j = l;
            }
            s = s.map((function(l, a) {
              return Array.apply(null, { length: D * l.length }).map((function(p, u) {
                return l[u % l.length];
              }));
            }));
          }
          const o = s.length;
          if (B > 1 & Number.isInteger(B / o)) {
            const D = B / o;
            if (j) {
              const l = [];
              for (let a = 0; a < D; a++) l.push(...j);
              j = l;
            }
            s = Array.apply(null, { length: D * o }).map((function(l, a) {
              return s[a % o];
            }));
          }
          const b = dispatch.A.call(d, "onbeforepaste", d, s.map((function(D) {
            return D.map((function(_) {
              return { value: _ };
            }));
          })), n, m);
          if (b === !1) return !1;
          if (b && (s = b), n != null && m != null && s) {
            let D = 0, _ = 0;
            const l = [], a = {}, h = {};
            let p = 0, u = parseInt(n), v = parseInt(m), A = null;
            const M = d.headers.slice(u).filter(((be) => be.style.display === "none")).length, N = u + M + s[0].length, T = d.headers.length;
            N > T && (d.skipUpdateTableReferences = !0, d.insertColumn(N - T));
            const I = d.rows.slice(v).filter(((be) => be.element.style.display === "none")).length, O = v + I + s.length, Y = d.rows.length;
            for (O > Y && (d.skipUpdateTableReferences = !0, d.insertRow(O - Y)), d.skipUpdateTableReferences && (d.skipUpdateTableReferences = !1, internal.o8.call(d)); A = s[_]; ) {
              for (D = 0, u = parseInt(n); A[D] != null; ) {
                let be = A[D];
                d.options.columns && d.options.columns[D] && d.options.columns[D].type == "calendar" && (be = jSuites.calendar.extractDateFromString(be, d.options.columns[D].options && d.options.columns[D].options.format || "YYYY-MM-DD"));
                const G = internal.k9.call(d, u, v, be);
                if (l.push(G), internal.xF.call(d, u, v, l), j && j[p]) {
                  const ie = (0, internalHelpers.t3)([u, v]);
                  a[ie] = j[p], h[ie] = d.getStyle(ie), d.records[v][u].element.setAttribute("style", j[p]), p++;
                }
                if (D++, A[D] != null) {
                  if (u >= d.headers.length - 1) {
                    if (d.options.allowInsertColumn == 0) break;
                    d.insertColumn();
                  }
                  u = rightGet.call(d, u, v);
                }
              }
              if (_++, s[_]) {
                if (v >= d.rows.length - 1) {
                  if (d.options.allowInsertRow == 0) break;
                  d.insertRow();
                }
                v = downGet.call(d, n, v);
              }
            }
            selection.AH.call(d, n, m, u, v), utils_history.Dh.call(d, { action: "setValue", records: l, selection: d.selectedCell, newStyle: a, oldStyle: h }), internal.am.call(d);
            const U = [];
            for (let be = 0; be < s.length; be++) for (let G = 0; G < s[be].length; G++) U.push({ x: G + n, y: be + m, value: s[be][G] });
            dispatch.A.call(d, "onpaste", d, U);
            const ue = l.map((function(be) {
              return { x: be.x, y: be.y, value: be.value, oldValue: be.oldValue };
            }));
            dispatch.A.call(d, "onafterchanges", d, ue);
          }
          (0, selection.kA)();
        };
        var filter = __webpack_require__(829), footer = __webpack_require__(160);
        const getNumberOfColumns = function() {
          const n = this;
          let m = n.options.columns && n.options.columns.length || 0;
          if (n.options.data && n.options.data[0] !== void 0) {
            const s = Object.keys(n.options.data[0]);
            s.length > m && (m = s.length);
          }
          return n.options.minDimensions && n.options.minDimensions[0] > m && (m = n.options.minDimensions[0]), m;
        }, createCellHeader = function(n) {
          const m = this, s = m.options.columns && m.options.columns[n] && m.options.columns[n].width || m.options.defaultColWidth || 100, d = m.options.columns && m.options.columns[n] && m.options.columns[n].align || m.options.defaultColAlign || "center";
          m.headers[n] = document.createElement("td"), m.headers[n].textContent = m.options.columns && m.options.columns[n] && m.options.columns[n].title || (0, helpers.getColumnName)(n), m.headers[n].setAttribute("data-x", n), m.headers[n].style.textAlign = d, m.options.columns && m.options.columns[n] && m.options.columns[n].title && m.headers[n].setAttribute("title", m.headers[n].innerText), m.options.columns && m.options.columns[n] && m.options.columns[n].id && m.headers[n].setAttribute("id", m.options.columns[n].id);
          const k = document.createElement("col");
          k.setAttribute("width", s), m.cols[n] = { colElement: k, x: n }, m.options.columns && m.options.columns[n] && m.options.columns[n].type == "hidden" && (m.headers[n].style.display = "none", k.style.display = "none");
        }, insertColumn = function(n, m, s, d) {
          const k = this;
          if (k.options.allowInsertColumn != 0) {
            let j, z = [];
            Array.isArray(n) ? (j = 1, n && (z = n)) : j = typeof n == "number" ? n : 1, s = !!s;
            const B = Math.max(k.options.columns.length, ...k.options.data.map((function(u) {
              return u.length;
            }))) - 1;
            (m == null || m >= parseInt(B) || m < 0) && (m = B), d || (d = []);
            for (let u = 0; u < j; u++) d[u] || (d[u] = {});
            const g = [];
            if (Array.isArray(n)) {
              const u = [];
              for (let A = 0; A < k.options.data.length; A++) u.push(A < n.length ? n[A] : "");
              const v = { column: m + (s ? 0 : 1), options: Object.assign({}, d[0]), data: u };
              g.push(v);
            } else for (let u = 0; u < n; u++) {
              const v = { column: m + u + (s ? 0 : 1), options: Object.assign({}, d[u]) };
              g.push(v);
            }
            if (dispatch.A.call(k, "onbeforeinsertcolumn", k, g) === !1) return !1;
            if (k.options.mergeCells && Object.keys(k.options.mergeCells).length > 0 && merges.Lt.call(k, m, s).length) {
              if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
              k.destroyMerge();
            }
            const o = s ? m : m + 1;
            k.options.columns = (0, internalHelpers.Hh)(k.options.columns, o, d);
            const b = k.headers.splice(o), D = k.cols.splice(o), _ = [], l = [], a = [], h = [], p = [];
            for (let u = o; u < j + o; u++) createCellHeader.call(k, u), k.headerContainer.insertBefore(k.headers[u], k.headerContainer.children[u + 1]), k.colgroupContainer.insertBefore(k.cols[u].colElement, k.colgroupContainer.children[u + 1]), _.push(k.headers[u]), l.push(k.cols[u]);
            if (k.options.footers) for (let u = 0; u < k.options.footers.length; u++) {
              p[u] = [];
              for (let v = 0; v < j; v++) p[u].push("");
              k.options.footers[u].splice(o, 0, p[u]);
            }
            for (let u = 0; u < k.options.data.length; u++) {
              const v = k.options.data[u].splice(o), A = k.records[u].splice(o);
              h[u] = [], a[u] = [];
              for (let M = o; M < j + o; M++) {
                const N = z[u] ? z[u] : "";
                k.options.data[u][M] = N;
                const T = internal.P9.call(k, M, u, k.options.data[u][M]);
                k.records[u][M] = { element: T, y: u }, k.rows[u] && k.rows[u].element.insertBefore(T, k.rows[u].element.children[M + 1]), k.options.columns && k.options.columns[M] && typeof k.options.columns[M].render == "function" && k.options.columns[M].render(T, N, parseInt(M), parseInt(u), k, k.options.columns[M]), h[u].push(N), a[u].push({ element: T, x: M, y: u });
              }
              Array.prototype.push.apply(k.options.data[u], v), Array.prototype.push.apply(k.records[u], A);
            }
            Array.prototype.push.apply(k.headers, b), Array.prototype.push.apply(k.cols, D);
            for (let u = o; u < k.cols.length; u++) k.cols[u].x = u;
            for (let u = 0; u < k.records.length; u++) for (let v = 0; v < k.records[u].length; v++) k.records[u][v].x = v;
            if (k.options.nestedHeaders && k.options.nestedHeaders.length > 0 && k.options.nestedHeaders[0] && k.options.nestedHeaders[0][0]) for (let u = 0; u < k.options.nestedHeaders.length; u++) {
              const v = parseInt(k.options.nestedHeaders[u][k.options.nestedHeaders[u].length - 1].colspan) + j;
              k.options.nestedHeaders[u][k.options.nestedHeaders[u].length - 1].colspan = v, k.thead.children[u].children[k.thead.children[u].children.length - 1].setAttribute("colspan", v);
              let A = k.thead.children[u].children[k.thead.children[u].children.length - 1].getAttribute("data-column");
              A = A.split(",");
              for (let M = o; M < j + o; M++) A.push(M);
              k.thead.children[u].children[k.thead.children[u].children.length - 1].setAttribute("data-column", A);
            }
            utils_history.Dh.call(k, { action: "insertColumn", columnNumber: m, numOfColumns: j, insertBefore: s, columns: d, headers: _, cols: l, records: a, footers: p, data: h }), internal.o8.call(k), dispatch.A.call(k, "oninsertcolumn", k, g);
          }
        }, moveColumn = function(n, m) {
          const s = this;
          if (s.options.mergeCells && Object.keys(s.options.mergeCells).length > 0) {
            let j;
            if (j = n > m ? 1 : 0, merges.Lt.call(s, n).length || merges.Lt.call(s, m, j).length) {
              if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
              s.destroyMerge();
            }
          }
          if ((n = parseInt(n)) > (m = parseInt(m))) {
            s.headerContainer.insertBefore(s.headers[n], s.headers[m]), s.colgroupContainer.insertBefore(s.cols[n].colElement, s.cols[m].colElement);
            for (let j = 0; j < s.rows.length; j++) s.rows[j].element.insertBefore(s.records[j][n].element, s.records[j][m].element);
          } else {
            s.headerContainer.insertBefore(s.headers[n], s.headers[m].nextSibling), s.colgroupContainer.insertBefore(s.cols[n].colElement, s.cols[m].colElement.nextSibling);
            for (let j = 0; j < s.rows.length; j++) s.rows[j].element.insertBefore(s.records[j][n].element, s.records[j][m].element.nextSibling);
          }
          s.options.columns.splice(m, 0, s.options.columns.splice(n, 1)[0]), s.headers.splice(m, 0, s.headers.splice(n, 1)[0]), s.cols.splice(m, 0, s.cols.splice(n, 1)[0]);
          const d = Math.min(n, m), k = Math.max(n, m);
          for (let j = 0; j < s.rows.length; j++) s.options.data[j].splice(m, 0, s.options.data[j].splice(n, 1)[0]), s.records[j].splice(m, 0, s.records[j].splice(n, 1)[0]);
          for (let j = d; j <= k; j++) s.cols[j].x = j;
          for (let j = 0; j < s.records.length; j++) for (let z = d; z <= k; z++) s.records[j][z].x = z;
          if (s.options.footers) for (let j = 0; j < s.options.footers.length; j++) s.options.footers[j].splice(m, 0, s.options.footers[j].splice(n, 1)[0]);
          utils_history.Dh.call(s, { action: "moveColumn", oldValue: n, newValue: m }), internal.o8.call(s), dispatch.A.call(s, "onmovecolumn", s, n, m, 1);
        }, deleteColumn = function(n, m) {
          const s = this;
          if (s.options.allowDeleteColumn != 0) if (s.headers.length > 1) {
            if (n == null) {
              const j = s.getSelectedColumns(!0);
              j.length ? (n = parseInt(j[0]), m = parseInt(j.length)) : (n = s.headers.length - 1, m = 1);
            }
            const d = s.options.data[0].length - 1;
            (n == null || n > d || n < 0) && (n = d), m || (m = 1), m > s.options.data[0].length - n && (m = s.options.data[0].length - n);
            const k = [];
            for (let j = 0; j < m; j++) k.push(j + n);
            if (dispatch.A.call(s, "onbeforedeletecolumn", s, k) === !1) return !1;
            if (parseInt(n) > -1) {
              let j = !1;
              if (s.options.mergeCells && Object.keys(s.options.mergeCells).length > 0) for (let _ = n; _ < n + m; _++) merges.Lt.call(s, _, null).length && (j = !0);
              if (j) {
                if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
                s.destroyMerge();
              }
              const z = s.options.columns ? s.options.columns.splice(n, m) : void 0;
              for (let _ = n; _ < n + m; _++) s.cols[_].colElement.className = "", s.headers[_].className = "", s.cols[_].colElement.parentNode.removeChild(s.cols[_].colElement), s.headers[_].parentNode.removeChild(s.headers[_]);
              const B = s.headers.splice(n, m), g = s.cols.splice(n, m), o = [], b = [], D = [];
              for (let _ = 0; _ < s.options.data.length; _++) for (let l = n; l < n + m; l++) s.records[_][l].element.className = "", s.records[_][l].element.parentNode.removeChild(s.records[_][l].element);
              for (let _ = 0; _ < s.options.data.length; _++) b[_] = s.options.data[_].splice(n, m), o[_] = s.records[_].splice(n, m);
              for (let _ = n; _ < s.cols.length; _++) s.cols[_].x = _;
              for (let _ = 0; _ < s.records.length; _++) for (let l = n; l < s.records[_].length; l++) s.records[_][l].x = l;
              if (s.options.footers) for (let _ = 0; _ < s.options.footers.length; _++) D[_] = s.options.footers[_].splice(n, m);
              if (selection.at.call(s, 0, n, n + m - 1), s.options.nestedHeaders && s.options.nestedHeaders.length > 0 && s.options.nestedHeaders[0] && s.options.nestedHeaders[0][0]) for (let _ = 0; _ < s.options.nestedHeaders.length; _++) {
                const l = parseInt(s.options.nestedHeaders[_][s.options.nestedHeaders[_].length - 1].colspan) - m;
                s.options.nestedHeaders[_][s.options.nestedHeaders[_].length - 1].colspan = l, s.thead.children[_].children[s.thead.children[_].children.length - 1].setAttribute("colspan", l);
              }
              utils_history.Dh.call(s, { action: "deleteColumn", columnNumber: n, numOfColumns: m, insertBefore: 1, columns: z, headers: B, cols: g, records: o, footers: D, data: b }), internal.o8.call(s), dispatch.A.call(s, "ondeletecolumn", s, k);
            }
          } else console.error("Jspreadsheet: It is not possible to delete the last column");
        }, getWidth = function(n) {
          const m = this;
          let s;
          if (n === void 0) {
            s = [];
            for (let d = 0; d < m.headers.length; d++) s.push(m.options.columns && m.options.columns[d] && m.options.columns[d].width || m.options.defaultColWidth || 100);
          } else s = parseInt(m.cols[n].colElement.getAttribute("width"));
          return s;
        }, setWidth = function(n, m, s) {
          const d = this;
          if (m) {
            if (Array.isArray(n)) {
              s || (s = []);
              for (let k = 0; k < n.length; k++) {
                s[k] || (s[k] = parseInt(d.cols[n[k]].colElement.getAttribute("width")));
                const j = Array.isArray(m) && m[k] ? m[k] : m;
                d.cols[n[k]].colElement.setAttribute("width", j), d.options.columns || (d.options.columns = []), d.options.columns[n[k]] || (d.options.columns[n[k]] = {}), d.options.columns[n[k]].width = j;
              }
            } else s || (s = parseInt(d.cols[n].colElement.getAttribute("width"))), d.cols[n].colElement.setAttribute("width", m), d.options.columns || (d.options.columns = []), d.options.columns[n] || (d.options.columns[n] = {}), d.options.columns[n].width = m;
            utils_history.Dh.call(d, { action: "setWidth", column: n, oldValue: s, newValue: m }), dispatch.A.call(d, "onresizecolumn", d, n, m, s), selection.Aq.call(d);
          }
        }, showColumn = function(n) {
          const m = this;
          Array.isArray(n) || (n = [n]);
          for (let s = 0; s < n.length; s++) {
            const d = n[s];
            m.headers[d].style.display = "", m.cols[d].colElement.style.display = "", m.filter && m.filter.children.length > d + 1 && (m.filter.children[d + 1].style.display = "");
            for (let k = 0; k < m.options.data.length; k++) m.records[k][d].element.style.display = "";
          }
          m.options.footers && footer.e.call(m), m.resetSelection();
        }, hideColumn = function(n) {
          const m = this;
          Array.isArray(n) || (n = [n]);
          for (let s = 0; s < n.length; s++) {
            const d = n[s];
            m.headers[d].style.display = "none", m.cols[d].colElement.style.display = "none", m.filter && m.filter.children.length > d + 1 && (m.filter.children[d + 1].style.display = "none");
            for (let k = 0; k < m.options.data.length; k++) m.records[k][d].element.style.display = "none";
          }
          m.options.footers && footer.e.call(m), m.resetSelection();
        }, getColumnData = function(n, m) {
          const s = this, d = [];
          for (let k = 0; k < s.options.data.length; k++) m ? d.push(s.records[k][n].element.innerHTML) : d.push(s.options.data[k][n]);
          return d;
        }, setColumnData = function(n, m, s) {
          const d = this;
          for (let k = 0; k < d.rows.length; k++) {
            const j = (0, internalHelpers.t3)([n, k]);
            m[k] != null && d.setValue(j, m[k], s);
          }
        }, createRow = function(n, m) {
          const s = this;
          s.records[n] || (s.records[n] = []), m || (m = s.options.data[n]);
          const d = { element: document.createElement("tr"), y: n };
          s.rows[n] = d, d.element.setAttribute("data-y", n);
          let k = null;
          s.options.defaultRowHeight && (d.element.style.height = s.options.defaultRowHeight + "px"), s.options.rows && s.options.rows[n] && (s.options.rows[n].height && (d.element.style.height = s.options.rows[n].height), s.options.rows[n].title && (k = s.options.rows[n].title)), k || (k = parseInt(n + 1));
          const j = document.createElement("td");
          j.innerHTML = k, j.setAttribute("data-y", n), j.className = "jss_row", d.element.appendChild(j);
          const z = getNumberOfColumns.call(s);
          for (let B = 0; B < z; B++) s.records[n][B] = { element: internal.P9.call(this, B, n, m[B]), x: B, y: n }, d.element.appendChild(s.records[n][B].element), s.options.columns && s.options.columns[B] && typeof s.options.columns[B].render == "function" && s.options.columns[B].render(s.records[n][B].element, m[B], parseInt(B), parseInt(n), s, s.options.columns[B]);
          return d;
        }, insertRow = function(n, m, s) {
          const d = this;
          if (d.options.allowInsertRow != 0) {
            let k, j = [];
            Array.isArray(n) ? (k = 1, n && (j = n)) : k = n !== void 0 ? n : 1, s = !!s;
            const z = d.options.data.length - 1;
            (m == null || m >= parseInt(z) || m < 0) && (m = z);
            const B = [];
            for (let h = 0; h < k; h++) {
              const p = [];
              for (let u = 0; u < d.options.columns.length; u++) p[u] = j[u] ? j[u] : "";
              B.push({ row: h + m + (s ? 0 : 1), data: p });
            }
            if (dispatch.A.call(d, "onbeforeinsertrow", d, B) === !1) return !1;
            if (d.options.mergeCells && Object.keys(d.options.mergeCells).length > 0 && merges.D0.call(d, m, s).length) {
              if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
              d.destroyMerge();
            }
            if (d.options.search == 1) {
              if (d.results && d.results.length != d.rows.length) {
                if (!confirm(jSuites.translate("This action will clear your search results. Are you sure?"))) return !1;
                d.resetSearch();
              }
              d.results = null;
            }
            const g = s ? m : m + 1, o = d.records.splice(g), b = d.options.data.splice(g), D = d.rows.splice(g), _ = [], l = [], a = [];
            for (let h = g; h < k + g; h++) {
              d.options.data[h] = [];
              for (let u = 0; u < d.options.columns.length; u++) d.options.data[h][u] = j[u] ? j[u] : "";
              const p = createRow.call(d, h, d.options.data[h]);
              D[0] ? Array.prototype.indexOf.call(d.tbody.children, D[0].element) >= 0 && d.tbody.insertBefore(p.element, D[0].element) : Array.prototype.indexOf.call(d.tbody.children, d.rows[m].element) >= 0 && d.tbody.appendChild(p.element), _.push([...d.records[h]]), l.push([...d.options.data[h]]), a.push(p);
            }
            Array.prototype.push.apply(d.records, o), Array.prototype.push.apply(d.options.data, b), Array.prototype.push.apply(d.rows, D);
            for (let h = g; h < d.rows.length; h++) d.rows[h].y = h;
            for (let h = g; h < d.records.length; h++) for (let p = 0; p < d.records[h].length; p++) d.records[h][p].y = h;
            d.options.pagination > 0 && d.page(d.pageNumber), utils_history.Dh.call(d, { action: "insertRow", rowNumber: m, numOfRows: k, insertBefore: s, rowRecords: _, rowData: l, rowNode: a }), internal.o8.call(d), dispatch.A.call(d, "oninsertrow", d, B);
          }
        }, moveRow = function(n, m, s) {
          const d = this;
          if (d.options.mergeCells && Object.keys(d.options.mergeCells).length > 0) {
            let z;
            if (z = n > m ? 1 : 0, merges.D0.call(d, n).length || merges.D0.call(d, m, z).length) {
              if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
              d.destroyMerge();
            }
          }
          if (d.options.search == 1) {
            if (d.results && d.results.length != d.rows.length) {
              if (!confirm(jSuites.translate("This action will clear your search results. Are you sure?"))) return !1;
              d.resetSearch();
            }
            d.results = null;
          }
          s || (Array.prototype.indexOf.call(d.tbody.children, d.rows[m].element) >= 0 ? n > m ? d.tbody.insertBefore(d.rows[n].element, d.rows[m].element) : d.tbody.insertBefore(d.rows[n].element, d.rows[m].element.nextSibling) : d.tbody.removeChild(d.rows[n].element)), d.rows.splice(m, 0, d.rows.splice(n, 1)[0]), d.records.splice(m, 0, d.records.splice(n, 1)[0]), d.options.data.splice(m, 0, d.options.data.splice(n, 1)[0]);
          const k = Math.min(n, m), j = Math.max(n, m);
          for (let z = k; z <= j; z++) d.rows[z].y = z;
          for (let z = k; z <= j; z++) for (let B = 0; B < d.records[z].length; B++) d.records[z][B].y = z;
          d.options.pagination > 0 && d.tbody.children.length != d.options.pagination && d.page(d.pageNumber), utils_history.Dh.call(d, { action: "moveRow", oldValue: n, newValue: m }), internal.o8.call(d), dispatch.A.call(d, "onmoverow", d, parseInt(n), parseInt(m), 1);
        }, deleteRow = function(n, m) {
          const s = this;
          if (s.options.allowDeleteRow != 0) if (s.options.allowDeletingAllRows == 1 || s.options.data.length > 1) {
            if (n == null) {
              const j = selection.R5.call(s);
              j.length === 0 ? (n = s.options.data.length - 1, m = 1) : (n = j[0], m = j.length);
            }
            let d = s.options.data.length - 1;
            (n == null || n > d || n < 0) && (n = d), m || (m = 1), n + m >= s.options.data.length && (m = s.options.data.length - n);
            const k = [];
            for (let j = 0; j < m; j++) k.push(j + n);
            if (dispatch.A.call(s, "onbeforedeleterow", s, k) === !1) return !1;
            if (parseInt(n) > -1) {
              let j = !1;
              if (s.options.mergeCells && Object.keys(s.options.mergeCells).length > 0) for (let o = n; o < n + m; o++) merges.D0.call(s, o, !1).length && (j = !0);
              if (j) {
                if (!confirm(jSuites.translate("This action will destroy any existing merged cells. Are you sure?"))) return !1;
                s.destroyMerge();
              }
              if (s.options.search == 1) {
                if (s.results && s.results.length != s.rows.length) {
                  if (!confirm(jSuites.translate("This action will clear your search results. Are you sure?"))) return !1;
                  s.resetSearch();
                }
                s.results = null;
              }
              s.options.allowDeletingAllRows != 1 && d + 1 === m && (m--, console.error("Jspreadsheet: It is not possible to delete the last row"));
              for (let o = n; o < n + m; o++) Array.prototype.indexOf.call(s.tbody.children, s.rows[o].element) >= 0 && (s.rows[o].element.className = "", s.rows[o].element.parentNode.removeChild(s.rows[o].element));
              const z = s.records.splice(n, m), B = s.options.data.splice(n, m), g = s.rows.splice(n, m);
              for (let o = n; o < s.rows.length; o++) s.rows[o].y = o;
              for (let o = n; o < s.records.length; o++) for (let b = 0; b < s.records[o].length; b++) s.records[o][b].y = o;
              s.options.pagination > 0 && s.tbody.children.length != s.options.pagination && s.page(s.pageNumber), selection.at.call(s, 1, n, n + m - 1), utils_history.Dh.call(s, { action: "deleteRow", rowNumber: n, numOfRows: m, insertBefore: 1, rowRecords: z, rowData: B, rowNode: g }), internal.o8.call(s), dispatch.A.call(s, "ondeleterow", s, k);
            }
          } else console.error("Jspreadsheet: It is not possible to delete the last row");
        }, getHeight = function(n) {
          const m = this;
          let s;
          if (n === void 0) {
            s = [];
            for (let d = 0; d < m.rows.length; d++) {
              const k = m.rows[d].element.style.height;
              k && (s[d] = k);
            }
          } else typeof n == "object" && (n = $(n).getAttribute("data-y")), s = m.rows[n].element.style.height;
          return s;
        }, setHeight = function(n, m, s) {
          const d = this;
          m > 0 && (s || (s = d.rows[n].element.getAttribute("height")) || (s = d.rows[n].element.getBoundingClientRect().height), m = parseInt(m), d.rows[n].element.style.height = m + "px", d.options.rows || (d.options.rows = []), d.options.rows[n] || (d.options.rows[n] = {}), d.options.rows[n].height = m, utils_history.Dh.call(d, { action: "setHeight", row: n, oldValue: s, newValue: m }), dispatch.A.call(d, "onresizerow", d, n, m, s), selection.Aq.call(d));
        }, showRow = function(n) {
          const m = this;
          Array.isArray(n) || (n = [n]), n.forEach((function(s) {
            m.rows[s].element.style.display = "";
          }));
        }, hideRow = function(n) {
          const m = this;
          Array.isArray(n) || (n = [n]), n.forEach((function(s) {
            m.rows[s].element.style.display = "none";
          }));
        }, getRowData = function(n, m) {
          return m ? this.records[n].map((function(s) {
            return s.element.innerHTML;
          })) : this.options.data[n];
        }, setRowData = function(n, m, s) {
          const d = this;
          for (let k = 0; k < d.headers.length; k++) {
            const j = (0, internalHelpers.t3)([k, n]);
            m[k] != null && d.setValue(j, m[k], s);
          }
        };
        var version = { version: "5.0.0", host: "https://bossanova.uk/jspreadsheet", license: "MIT", print: function() {
          return [["Jspreadsheet CE", this.version, this.host, this.license].join(`\r
`)];
        } };
        const getElement = function(n) {
          let m = 0, s = 0;
          return (function d(k) {
            k.className && (k.classList.contains("jss_container") && (s = k), k.classList.contains("jss_spreadsheet") && (s = k.querySelector(":scope > .jtabs-content > .jtabs-selected"))), k.tagName == "THEAD" ? m = 1 : k.tagName == "TBODY" && (m = 2), k.parentNode && (s || d(k.parentNode));
          })(n), [s, m];
        }, mouseUpControls = function(n) {
          if (libraryBase.jspreadsheet.current) if (libraryBase.jspreadsheet.current.resizing) {
            if (libraryBase.jspreadsheet.current.resizing.column) {
              const m = parseInt(libraryBase.jspreadsheet.current.cols[libraryBase.jspreadsheet.current.resizing.column].colElement.getAttribute("width")), s = libraryBase.jspreadsheet.current.getSelectedColumns();
              if (s.length > 1) {
                const d = [];
                for (let k = 0; k < s.length; k++) d.push(parseInt(libraryBase.jspreadsheet.current.cols[s[k]].colElement.getAttribute("width")));
                d[s.indexOf(parseInt(libraryBase.jspreadsheet.current.resizing.column))] = libraryBase.jspreadsheet.current.resizing.width, setWidth.call(libraryBase.jspreadsheet.current, s, m, d);
              } else setWidth.call(libraryBase.jspreadsheet.current, parseInt(libraryBase.jspreadsheet.current.resizing.column), m, libraryBase.jspreadsheet.current.resizing.width);
              libraryBase.jspreadsheet.current.headers[libraryBase.jspreadsheet.current.resizing.column].classList.remove("resizing");
              for (let d = 0; d < libraryBase.jspreadsheet.current.records.length; d++) libraryBase.jspreadsheet.current.records[d][libraryBase.jspreadsheet.current.resizing.column] && libraryBase.jspreadsheet.current.records[d][libraryBase.jspreadsheet.current.resizing.column].element.classList.remove("resizing");
            } else {
              libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.children[0].classList.remove("resizing");
              let m = libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.getAttribute("height");
              setHeight.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.resizing.row, m, libraryBase.jspreadsheet.current.resizing.height), libraryBase.jspreadsheet.current.resizing.element.classList.remove("resizing");
            }
            libraryBase.jspreadsheet.current.resizing = null;
          } else if (libraryBase.jspreadsheet.current.dragging) {
            if (libraryBase.jspreadsheet.current.dragging) {
              if (libraryBase.jspreadsheet.current.dragging.column) {
                const m = n.target.getAttribute("data-x");
                libraryBase.jspreadsheet.current.headers[libraryBase.jspreadsheet.current.dragging.column].classList.remove("dragging");
                for (let s = 0; s < libraryBase.jspreadsheet.current.rows.length; s++) libraryBase.jspreadsheet.current.records[s][libraryBase.jspreadsheet.current.dragging.column] && libraryBase.jspreadsheet.current.records[s][libraryBase.jspreadsheet.current.dragging.column].element.classList.remove("dragging");
                for (let s = 0; s < libraryBase.jspreadsheet.current.headers.length; s++) libraryBase.jspreadsheet.current.headers[s].classList.remove("dragging-left"), libraryBase.jspreadsheet.current.headers[s].classList.remove("dragging-right");
                m && libraryBase.jspreadsheet.current.dragging.column != libraryBase.jspreadsheet.current.dragging.destination && libraryBase.jspreadsheet.current.moveColumn(libraryBase.jspreadsheet.current.dragging.column, libraryBase.jspreadsheet.current.dragging.destination);
              } else {
                let m;
                libraryBase.jspreadsheet.current.dragging.element.nextSibling ? (m = parseInt(libraryBase.jspreadsheet.current.dragging.element.nextSibling.getAttribute("data-y")), libraryBase.jspreadsheet.current.dragging.row < m && (m -= 1)) : m = parseInt(libraryBase.jspreadsheet.current.dragging.element.previousSibling.getAttribute("data-y")), libraryBase.jspreadsheet.current.dragging.row != libraryBase.jspreadsheet.current.dragging.destination && moveRow.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.dragging.row, m, !0), libraryBase.jspreadsheet.current.dragging.element.classList.remove("dragging");
              }
              libraryBase.jspreadsheet.current.dragging = null;
            }
          } else libraryBase.jspreadsheet.current.selectedCorner && (libraryBase.jspreadsheet.current.selectedCorner = !1, libraryBase.jspreadsheet.current.selection.length > 0 && (selection.kF.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.selection[0], libraryBase.jspreadsheet.current.selection[libraryBase.jspreadsheet.current.selection.length - 1]), selection.gG.call(libraryBase.jspreadsheet.current)));
          libraryBase.jspreadsheet.timeControl && (clearTimeout(libraryBase.jspreadsheet.timeControl), libraryBase.jspreadsheet.timeControl = null), libraryBase.jspreadsheet.isMouseAction = !1;
        }, mouseDownControls = function(n) {
          let m;
          m = (n = n || window.event).buttons ? n.buttons : n.button ? n.button : n.which;
          const s = getElement(n.target);
          if (s[0] ? libraryBase.jspreadsheet.current != s[0].jssWorksheet && (libraryBase.jspreadsheet.current && (libraryBase.jspreadsheet.current.edition && closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0), libraryBase.jspreadsheet.current.resetSelection()), libraryBase.jspreadsheet.current = s[0].jssWorksheet) : libraryBase.jspreadsheet.current && (libraryBase.jspreadsheet.current.edition && closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0), n.target.classList.contains("jss_object") || (selection.gE.call(libraryBase.jspreadsheet.current, !0), libraryBase.jspreadsheet.current = null)), libraryBase.jspreadsheet.current && m == 1) {
            if (n.target.classList.contains("jss_selectall")) libraryBase.jspreadsheet.current && selection.Ub.call(libraryBase.jspreadsheet.current);
            else if (n.target.classList.contains("jss_corner")) libraryBase.jspreadsheet.current.options.editable != 0 && (libraryBase.jspreadsheet.current.selectedCorner = !0);
            else {
              if (s[1] == 1) {
                const d = n.target.getAttribute("data-x");
                if (d) {
                  const k = n.target.getBoundingClientRect();
                  if (libraryBase.jspreadsheet.current.options.columnResize != 0 && k.width - n.offsetX < 6) {
                    libraryBase.jspreadsheet.current.resizing = { mousePosition: n.pageX, column: d, width: k.width }, libraryBase.jspreadsheet.current.headers[d].classList.add("resizing");
                    for (let j = 0; j < libraryBase.jspreadsheet.current.records.length; j++) libraryBase.jspreadsheet.current.records[j][d] && libraryBase.jspreadsheet.current.records[j][d].element.classList.add("resizing");
                  } else if (libraryBase.jspreadsheet.current.options.columnDrag != 0 && k.height - n.offsetY < 6) if (merges.Lt.call(libraryBase.jspreadsheet.current, d).length) console.error("Jspreadsheet: This column is part of a merged cell.");
                  else {
                    libraryBase.jspreadsheet.current.resetSelection(), libraryBase.jspreadsheet.current.dragging = { element: n.target, column: d, destination: d }, libraryBase.jspreadsheet.current.headers[d].classList.add("dragging");
                    for (let j = 0; j < libraryBase.jspreadsheet.current.records.length; j++) libraryBase.jspreadsheet.current.records[j][d] && libraryBase.jspreadsheet.current.records[j][d].element.classList.add("dragging");
                  }
                  else {
                    let j, z;
                    libraryBase.jspreadsheet.current.selectedHeader && (n.shiftKey || n.ctrlKey) ? (j = libraryBase.jspreadsheet.current.selectedHeader, z = d) : (libraryBase.jspreadsheet.current.selectedHeader == d && libraryBase.jspreadsheet.current.options.allowRenameColumn != 0 && (libraryBase.jspreadsheet.timeControl = setTimeout((function() {
                      libraryBase.jspreadsheet.current.setHeader(d);
                    }), 800)), libraryBase.jspreadsheet.current.selectedHeader = d, j = d, z = d), selection.AH.call(libraryBase.jspreadsheet.current, j, 0, z, libraryBase.jspreadsheet.current.options.data.length - 1, n);
                  }
                } else if (n.target.parentNode.classList.contains("jss_nested")) {
                  let k, j;
                  if (n.target.getAttribute("data-column")) {
                    const z = n.target.getAttribute("data-column").split(",");
                    k = parseInt(z[0]), j = parseInt(z[z.length - 1]);
                  } else k = 0, j = libraryBase.jspreadsheet.current.options.columns.length - 1;
                  selection.AH.call(libraryBase.jspreadsheet.current, k, 0, j, libraryBase.jspreadsheet.current.options.data.length - 1, n);
                }
              } else libraryBase.jspreadsheet.current.selectedHeader = !1;
              if (s[1] == 2) {
                const d = parseInt(n.target.getAttribute("data-y"));
                if (n.target.classList.contains("jss_row")) {
                  const k = n.target.getBoundingClientRect();
                  if (libraryBase.jspreadsheet.current.options.rowResize != 0 && k.height - n.offsetY < 6) libraryBase.jspreadsheet.current.resizing = { element: n.target.parentNode, mousePosition: n.pageY, row: d, height: k.height }, n.target.parentNode.classList.add("resizing");
                  else if (libraryBase.jspreadsheet.current.options.rowDrag != 0 && k.width - n.offsetX < 6) merges.D0.call(libraryBase.jspreadsheet.current, d).length ? console.error("Jspreadsheet: This row is part of a merged cell") : libraryBase.jspreadsheet.current.options.search == 1 && libraryBase.jspreadsheet.current.results ? console.error("Jspreadsheet: Please clear your search before perform this action") : (libraryBase.jspreadsheet.current.resetSelection(), libraryBase.jspreadsheet.current.dragging = { element: n.target.parentNode, row: d, destination: d }, n.target.parentNode.classList.add("dragging"));
                  else {
                    let j, z;
                    libraryBase.jspreadsheet.current.selectedRow != null && (n.shiftKey || n.ctrlKey) ? (j = libraryBase.jspreadsheet.current.selectedRow, z = d) : (libraryBase.jspreadsheet.current.selectedRow = d, j = d, z = d), selection.AH.call(libraryBase.jspreadsheet.current, null, j, null, z, n);
                  }
                } else if (n.target.classList.contains("jclose") && n.target.clientWidth - n.offsetX < 50 && n.offsetY < 50) closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0);
                else {
                  const k = function(z) {
                    const B = z.getAttribute("data-x"), g = z.getAttribute("data-y");
                    return B && g ? [B, g] : z.parentNode ? k(z.parentNode) : void 0;
                  }, j = k(n.target);
                  if (j) {
                    const z = j[0], B = j[1];
                    libraryBase.jspreadsheet.current.edition && (libraryBase.jspreadsheet.current.edition[2] == z && libraryBase.jspreadsheet.current.edition[3] == B || closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0)), libraryBase.jspreadsheet.current.edition || (n.shiftKey ? selection.AH.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.selectedCell[0], libraryBase.jspreadsheet.current.selectedCell[1], z, B, n) : selection.AH.call(libraryBase.jspreadsheet.current, z, B, void 0, void 0, n)), libraryBase.jspreadsheet.current.selectedHeader = null, libraryBase.jspreadsheet.current.selectedRow = null;
                  }
                }
              } else libraryBase.jspreadsheet.current.selectedRow = !1;
              n.target.classList.contains("jss_page") && (n.target.textContent == "<" ? libraryBase.jspreadsheet.current.page(0) : n.target.textContent == ">" ? libraryBase.jspreadsheet.current.page(n.target.getAttribute("title") - 1) : libraryBase.jspreadsheet.current.page(n.target.textContent - 1));
            }
            libraryBase.jspreadsheet.current.edition ? libraryBase.jspreadsheet.isMouseAction = !1 : libraryBase.jspreadsheet.isMouseAction = !0;
          } else libraryBase.jspreadsheet.isMouseAction = !1;
        }, mouseMoveControls = function(n) {
          let m;
          if (m = (n = n || window.event).buttons ? n.buttons : n.button ? n.button : n.which, m || (libraryBase.jspreadsheet.isMouseAction = !1), libraryBase.jspreadsheet.current) if (libraryBase.jspreadsheet.isMouseAction == 1) {
            if (libraryBase.jspreadsheet.current.resizing) if (libraryBase.jspreadsheet.current.resizing.column) {
              const s = n.pageX - libraryBase.jspreadsheet.current.resizing.mousePosition;
              if (libraryBase.jspreadsheet.current.resizing.width + s > 0) {
                const d = libraryBase.jspreadsheet.current.resizing.width + s;
                libraryBase.jspreadsheet.current.cols[libraryBase.jspreadsheet.current.resizing.column].colElement.setAttribute("width", d), selection.Aq.call(libraryBase.jspreadsheet.current);
              }
            } else {
              const s = n.pageY - libraryBase.jspreadsheet.current.resizing.mousePosition;
              if (libraryBase.jspreadsheet.current.resizing.height + s > 0) {
                const d = libraryBase.jspreadsheet.current.resizing.height + s;
                libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.setAttribute("height", d), selection.Aq.call(libraryBase.jspreadsheet.current);
              }
            }
            else if (libraryBase.jspreadsheet.current.dragging) if (libraryBase.jspreadsheet.current.dragging.column) {
              const s = n.target.getAttribute("data-x");
              if (s) if (merges.Lt.call(libraryBase.jspreadsheet.current, s).length) console.error("Jspreadsheet: This column is part of a merged cell.");
              else {
                for (let d = 0; d < libraryBase.jspreadsheet.current.headers.length; d++) libraryBase.jspreadsheet.current.headers[d].classList.remove("dragging-left"), libraryBase.jspreadsheet.current.headers[d].classList.remove("dragging-right");
                libraryBase.jspreadsheet.current.dragging.column == s ? libraryBase.jspreadsheet.current.dragging.destination = parseInt(s) : n.target.clientWidth / 2 > n.offsetX ? (libraryBase.jspreadsheet.current.dragging.column < s ? libraryBase.jspreadsheet.current.dragging.destination = parseInt(s) - 1 : libraryBase.jspreadsheet.current.dragging.destination = parseInt(s), libraryBase.jspreadsheet.current.headers[s].classList.add("dragging-left")) : (libraryBase.jspreadsheet.current.dragging.column < s ? libraryBase.jspreadsheet.current.dragging.destination = parseInt(s) : libraryBase.jspreadsheet.current.dragging.destination = parseInt(s) + 1, libraryBase.jspreadsheet.current.headers[s].classList.add("dragging-right"));
              }
            } else {
              const s = n.target.getAttribute("data-y");
              if (s) if (merges.D0.call(libraryBase.jspreadsheet.current, s).length) console.error("Jspreadsheet: This row is part of a merged cell.");
              else {
                const d = n.target.clientHeight / 2 > n.offsetY ? n.target.parentNode.nextSibling : n.target.parentNode;
                libraryBase.jspreadsheet.current.dragging.element != d && (n.target.parentNode.parentNode.insertBefore(libraryBase.jspreadsheet.current.dragging.element, d), libraryBase.jspreadsheet.current.dragging.destination = Array.prototype.indexOf.call(libraryBase.jspreadsheet.current.dragging.element.parentNode.children, libraryBase.jspreadsheet.current.dragging.element));
              }
            }
          } else {
            const s = n.target.getAttribute("data-x"), d = n.target.getAttribute("data-y"), k = n.target.getBoundingClientRect();
            libraryBase.jspreadsheet.current.cursor && (libraryBase.jspreadsheet.current.cursor.style.cursor = "", libraryBase.jspreadsheet.current.cursor = null), n.target.parentNode.parentNode && n.target.parentNode.parentNode.className && (n.target.parentNode.parentNode.classList.contains("resizable") && (n.target && s && !d && k.width - (n.clientX - k.left) < 6 ? (libraryBase.jspreadsheet.current.cursor = n.target, libraryBase.jspreadsheet.current.cursor.style.cursor = "col-resize") : n.target && !s && d && k.height - (n.clientY - k.top) < 6 && (libraryBase.jspreadsheet.current.cursor = n.target, libraryBase.jspreadsheet.current.cursor.style.cursor = "row-resize")), n.target.parentNode.parentNode.classList.contains("draggable") && (n.target && !s && d && k.width - (n.clientX - k.left) < 6 || n.target && s && !d && k.height - (n.clientY - k.top) < 6) && (libraryBase.jspreadsheet.current.cursor = n.target, libraryBase.jspreadsheet.current.cursor.style.cursor = "move"));
          }
        }, updateCopySelection = function(n, m) {
          const s = this;
          selection.gG.call(s);
          const d = s.selectedContainer[0], k = s.selectedContainer[1], j = s.selectedContainer[2], z = s.selectedContainer[3];
          if (n != null && m != null) {
            let B, g, o, b;
            n - j > 0 ? (B = parseInt(j) + 1, g = parseInt(n)) : (B = parseInt(n), g = parseInt(d) - 1), m - z > 0 ? (o = parseInt(z) + 1, b = parseInt(m)) : (o = parseInt(m), b = parseInt(k) - 1), g - B <= b - o ? (B = parseInt(d), g = parseInt(j)) : (o = parseInt(k), b = parseInt(z));
            for (let D = o; D <= b; D++) for (let _ = B; _ <= g; _++) s.records[D][_] && s.rows[D].element.style.display != "none" && s.records[D][_].element.style.display != "none" && (s.records[D][_].element.classList.add("selection"), s.records[o][_].element.classList.add("selection-top"), s.records[b][_].element.classList.add("selection-bottom"), s.records[D][B].element.classList.add("selection-left"), s.records[D][g].element.classList.add("selection-right"), s.selection.push(s.records[D][_].element));
          }
        }, mouseOverControls = function(n) {
          let m;
          if (m = (n = n || window.event).buttons ? n.buttons : n.button ? n.button : n.which, m || (libraryBase.jspreadsheet.isMouseAction = !1), libraryBase.jspreadsheet.current && libraryBase.jspreadsheet.isMouseAction == 1) {
            const s = getElement(n.target);
            if (s[0]) {
              if (libraryBase.jspreadsheet.current != s[0].jssWorksheet && libraryBase.jspreadsheet.current) return !1;
              let d = n.target.getAttribute("data-x");
              const k = n.target.getAttribute("data-y");
              if (!(libraryBase.jspreadsheet.current.resizing || libraryBase.jspreadsheet.current.dragging)) {
                if (s[1] == 1 && libraryBase.jspreadsheet.current.selectedHeader) {
                  d = n.target.getAttribute("data-x");
                  const j = libraryBase.jspreadsheet.current.selectedHeader, z = d;
                  selection.AH.call(libraryBase.jspreadsheet.current, j, 0, z, libraryBase.jspreadsheet.current.options.data.length - 1, n);
                }
                if (s[1] == 2) if (n.target.classList.contains("jss_row")) {
                  if (libraryBase.jspreadsheet.current.selectedRow != null) {
                    const j = libraryBase.jspreadsheet.current.selectedRow, z = k;
                    selection.AH.call(libraryBase.jspreadsheet.current, 0, j, libraryBase.jspreadsheet.current.options.data[0].length - 1, z, n);
                  }
                } else libraryBase.jspreadsheet.current.edition || d && k && (libraryBase.jspreadsheet.current.selectedCorner ? updateCopySelection.call(libraryBase.jspreadsheet.current, d, k) : libraryBase.jspreadsheet.current.selectedCell && selection.AH.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.selectedCell[0], libraryBase.jspreadsheet.current.selectedCell[1], d, k, n));
              }
            }
          }
          libraryBase.jspreadsheet.timeControl && (clearTimeout(libraryBase.jspreadsheet.timeControl), libraryBase.jspreadsheet.timeControl = null);
        }, doubleClickControls = function(n) {
          if (libraryBase.jspreadsheet.current) if (n.target.classList.contains("jss_corner")) {
            if (libraryBase.jspreadsheet.current.highlighted.length > 0) {
              const m = libraryBase.jspreadsheet.current.highlighted[0].element.getAttribute("data-x"), s = parseInt(libraryBase.jspreadsheet.current.highlighted[libraryBase.jspreadsheet.current.highlighted.length - 1].element.getAttribute("data-y")) + 1, d = libraryBase.jspreadsheet.current.highlighted[libraryBase.jspreadsheet.current.highlighted.length - 1].element.getAttribute("data-x"), k = libraryBase.jspreadsheet.current.records.length - 1;
              selection.kF.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[s][m].element, libraryBase.jspreadsheet.current.records[k][d].element);
            }
          } else if (n.target.classList.contains("jss_column_filter")) {
            const m = n.target.getAttribute("data-x");
            filter.N$.call(libraryBase.jspreadsheet.current, m);
          } else {
            const m = getElement(n.target);
            if (m[1] == 1 && libraryBase.jspreadsheet.current.options.columnSorting != 0) {
              const s = n.target.getAttribute("data-x");
              s && libraryBase.jspreadsheet.current.orderBy(parseInt(s));
            }
            if (m[1] == 2 && libraryBase.jspreadsheet.current.options.editable != 0 && !libraryBase.jspreadsheet.current.edition) {
              const s = function(k) {
                if (k.parentNode) {
                  const j = k.getAttribute("data-x"), z = k.getAttribute("data-y");
                  return j && z ? k : s(k.parentNode);
                }
              }, d = s(n.target);
              d && d.classList.contains("highlight") && openEditor.call(libraryBase.jspreadsheet.current, d, void 0, n);
            }
          }
        }, pasteControls = function(n) {
          libraryBase.jspreadsheet.current && libraryBase.jspreadsheet.current.selectedCell && (libraryBase.jspreadsheet.current.edition || libraryBase.jspreadsheet.current.options.editable != 0 && (n && n.clipboardData ? (paste.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.selectedCell[0], libraryBase.jspreadsheet.current.selectedCell[1], n.clipboardData.getData("text")), n.preventDefault()) : window.clipboardData && paste.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.selectedCell[0], libraryBase.jspreadsheet.current.selectedCell[1], window.clipboardData.getData("text"))));
        }, getRole = function(n) {
          if (n.classList.contains("jss_selectall")) return "select-all";
          if (n.classList.contains("jss_corner")) return "fill-handle";
          let m = n;
          for (; !m.classList.contains("jss_spreadsheet"); ) {
            if (m.classList.contains("jss_row")) return "row";
            if (m.classList.contains("jss_nested")) return "nested";
            if (m.classList.contains("jtabs-headers")) return "tabs";
            if (m.classList.contains("jtoolbar")) return "toolbar";
            if (m.classList.contains("jss_pagination")) return "pagination";
            if (m.tagName === "TBODY") return "cell";
            if (m.tagName === "TFOOT") return getElementIndex(n) === 0 ? "grid" : "footer";
            if (m.tagName === "THEAD") return "header";
            m = m.parentElement;
          }
          return "applications";
        }, defaultContextMenu = function(n, m, s, d) {
          const k = [];
          if (d === "header" && (n.options.allowInsertColumn != 0 && k.push({ title: jSuites.translate("Insert a new column before"), onclick: function() {
            n.insertColumn(1, parseInt(m), 1);
          } }), n.options.allowInsertColumn != 0 && k.push({ title: jSuites.translate("Insert a new column after"), onclick: function() {
            n.insertColumn(1, parseInt(m), 0);
          } }), n.options.allowDeleteColumn != 0 && k.push({ title: jSuites.translate("Delete selected columns"), onclick: function() {
            n.deleteColumn(n.getSelectedColumns().length ? void 0 : parseInt(m));
          } }), n.options.allowRenameColumn != 0 && k.push({ title: jSuites.translate("Rename this column"), onclick: function() {
            const j = n.getHeader(m), z = prompt(jSuites.translate("Column name"), j);
            n.setHeader(m, z);
          } }), n.options.columnSorting != 0 && (k.push({ type: "line" }), k.push({ title: jSuites.translate("Order ascending"), onclick: function() {
            n.orderBy(m, 0);
          } }), k.push({ title: jSuites.translate("Order descending"), onclick: function() {
            n.orderBy(m, 1);
          } }))), d !== "row" && d !== "cell" || (n.options.allowInsertRow != 0 && (k.push({ title: jSuites.translate("Insert a new row before"), onclick: function() {
            n.insertRow(1, parseInt(s), 1);
          } }), k.push({ title: jSuites.translate("Insert a new row after"), onclick: function() {
            n.insertRow(1, parseInt(s));
          } })), n.options.allowDeleteRow != 0 && k.push({ title: jSuites.translate("Delete selected rows"), onclick: function() {
            n.deleteRow(n.getSelectedRows().length ? void 0 : parseInt(s));
          } })), d === "cell" && n.options.allowComments != 0) {
            k.push({ type: "line" });
            const j = n.records[s][m].element.getAttribute("title") || "";
            k.push({ title: jSuites.translate(j ? "Edit comments" : "Add comments"), onclick: function() {
              const z = prompt(jSuites.translate("Comments"), j);
              z && n.setComments((0, helpers.getCellNameFromCoords)(m, s), z);
            } }), j && k.push({ title: jSuites.translate("Clear comments"), onclick: function() {
              n.setComments((0, helpers.getCellNameFromCoords)(m, s), "");
            } });
          }
          return k.length !== 0 && k.push({ type: "line" }), d !== "header" && d !== "row" && d !== "cell" || (k.push({ title: jSuites.translate("Copy") + "...", shortcut: "Ctrl + C", onclick: function() {
            copy.call(n, !0);
          } }), navigator && navigator.clipboard && k.push({ title: jSuites.translate("Paste") + "...", shortcut: "Ctrl + V", onclick: function() {
            n.selectedCell && navigator.clipboard.readText().then((function(j) {
              j && paste.call(n, n.selectedCell[0], n.selectedCell[1], j);
            }));
          } })), n.parent.config.allowExport != 0 && k.push({ title: jSuites.translate("Save as") + "...", shortcut: "Ctrl + S", onclick: function() {
            n.download();
          } }), n.parent.config.about != 0 && k.push({ title: jSuites.translate("About"), onclick: function() {
            n.parent.config.about === void 0 || n.parent.config.about === !0 ? alert(version.print()) : alert(n.parent.config.about);
          } }), k;
        }, getElementIndex = function(n) {
          const m = n.parentElement.children;
          for (let s = 0; s < m.length; s++) if (n === m[s]) return s;
          return -1;
        }, contextMenuControls = function(n) {
          if ("buttons" in (n = n || window.event) ? n.buttons : n.which || n.button, libraryBase.jspreadsheet.current) {
            const m = libraryBase.jspreadsheet.current.parent;
            if (libraryBase.jspreadsheet.current.edition) n.preventDefault();
            else if (m.contextMenu.contextmenu.close(), libraryBase.jspreadsheet.current) {
              const s = getRole(n.target);
              let d = null, k = null;
              if (s === "cell") {
                let z = n.target;
                for (; z.tagName !== "TD"; ) z = z.parentNode;
                k = z.getAttribute("data-y"), d = z.getAttribute("data-x"), (!libraryBase.jspreadsheet.current.selectedCell || d < parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) || d > parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) || k < parseInt(libraryBase.jspreadsheet.current.selectedCell[1]) || k > parseInt(libraryBase.jspreadsheet.current.selectedCell[3])) && selection.AH.call(libraryBase.jspreadsheet.current, d, k, d, k, n);
              } else if (s === "row" || s === "header") s === "row" ? k = n.target.getAttribute("data-y") : d = n.target.getAttribute("data-x"), (!libraryBase.jspreadsheet.current.selectedCell || d < parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) || d > parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) || k < parseInt(libraryBase.jspreadsheet.current.selectedCell[1]) || k > parseInt(libraryBase.jspreadsheet.current.selectedCell[3])) && selection.AH.call(libraryBase.jspreadsheet.current, d, k, d, k, n);
              else if (s === "nested") {
                const z = n.target.getAttribute("data-column").split(",");
                d = getElementIndex(n.target) - 1, k = getElementIndex(n.target.parentElement), libraryBase.jspreadsheet.current.selectedCell && z[0] == parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) && z[z.length - 1] == parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) && libraryBase.jspreadsheet.current.selectedCell[1] == null && libraryBase.jspreadsheet.current.selectedCell[3] == null || selection.AH.call(libraryBase.jspreadsheet.current, z[0], null, z[z.length - 1], null, n);
              } else s === "select-all" ? selection.Ub.call(libraryBase.jspreadsheet.current) : s === "tabs" ? d = getElementIndex(n.target) : s === "footer" && (d = getElementIndex(n.target) - 1, k = getElementIndex(n.target.parentElement));
              let j = defaultContextMenu(libraryBase.jspreadsheet.current, parseInt(d), parseInt(k), s);
              if (typeof m.config.contextMenu == "function") {
                const z = m.config.contextMenu(libraryBase.jspreadsheet.current, d, k, n, j, s, d, k);
                if (z) j = z;
                else if (z === !1) return;
              }
              typeof m.plugins == "object" && Object.entries(m.plugins).forEach((function([, z]) {
                if (typeof z.contextMenu == "function") {
                  const B = z.contextMenu(libraryBase.jspreadsheet.current, d !== null ? parseInt(d) : null, k !== null ? parseInt(k) : null, n, j, s, d !== null ? parseInt(d) : null, k !== null ? parseInt(k) : null);
                  B && (j = B);
                }
              })), m.contextMenu.contextmenu.open(n, j), n.preventDefault();
            }
          }
        }, touchStartControls = function(n) {
          const m = getElement(n.target);
          if (m[0] ? libraryBase.jspreadsheet.current != m[0].jssWorksheet && (libraryBase.jspreadsheet.current && libraryBase.jspreadsheet.current.resetSelection(), libraryBase.jspreadsheet.current = m[0].jssWorksheet) : libraryBase.jspreadsheet.current && (libraryBase.jspreadsheet.current.resetSelection(), libraryBase.jspreadsheet.current = null), libraryBase.jspreadsheet.current && !libraryBase.jspreadsheet.current.edition) {
            const s = n.target.getAttribute("data-x"), d = n.target.getAttribute("data-y");
            s && d && (selection.AH.call(libraryBase.jspreadsheet.current, s, d, void 0, void 0, n), libraryBase.jspreadsheet.timeControl = setTimeout((function() {
              libraryBase.jspreadsheet.current.options.columns[s].type == "color" ? libraryBase.jspreadsheet.tmpElement = null : libraryBase.jspreadsheet.tmpElement = n.target, openEditor.call(libraryBase.jspreadsheet.current, n.target, !1, n);
            }), 500));
          }
        }, touchEndControls = function(n) {
          libraryBase.jspreadsheet.timeControl && (clearTimeout(libraryBase.jspreadsheet.timeControl), libraryBase.jspreadsheet.timeControl = null, libraryBase.jspreadsheet.tmpElement && libraryBase.jspreadsheet.tmpElement.children[0].tagName == "INPUT" && libraryBase.jspreadsheet.tmpElement.children[0].focus(), libraryBase.jspreadsheet.tmpElement = null);
        }, cutControls = function(n) {
          libraryBase.jspreadsheet.current && (libraryBase.jspreadsheet.current.edition || (copy.call(libraryBase.jspreadsheet.current, !0, void 0, void 0, void 0, void 0, !0), libraryBase.jspreadsheet.current.options.editable != 0 && libraryBase.jspreadsheet.current.setValue(libraryBase.jspreadsheet.current.highlighted.map((function(m) {
            return m.element;
          })), "")));
        }, copyControls = function(n) {
          libraryBase.jspreadsheet.current && copyControls.enabled && (libraryBase.jspreadsheet.current.edition || copy.call(libraryBase.jspreadsheet.current, !0));
        }, isMac = function() {
          return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        }, isCtrl = function(n) {
          return isMac() ? n.metaKey : n.ctrlKey;
        }, keyDownControls = function(n) {
          if (libraryBase.jspreadsheet.current) {
            if (libraryBase.jspreadsheet.current.edition) if (n.which == 27) libraryBase.jspreadsheet.current.edition && closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !1), n.preventDefault();
            else if (n.which == 13) {
              if (libraryBase.jspreadsheet.current.options.columns && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type == "calendar") closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0);
              else if (!(libraryBase.jspreadsheet.current.options.columns && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type == "dropdown")) if ((libraryBase.jspreadsheet.current.options.wordWrap == 1 || libraryBase.jspreadsheet.current.options.columns && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].wordWrap == 1 || libraryBase.jspreadsheet.current.options.data[libraryBase.jspreadsheet.current.edition[3]][libraryBase.jspreadsheet.current.edition[2]] && libraryBase.jspreadsheet.current.options.data[libraryBase.jspreadsheet.current.edition[3]][libraryBase.jspreadsheet.current.edition[2]].length > 200) && n.altKey) {
                const m = libraryBase.jspreadsheet.current.edition[0].children[0];
                let s = libraryBase.jspreadsheet.current.edition[0].children[0].value;
                const d = m.selectionStart;
                s = s.slice(0, d) + `
` + s.slice(d), m.value = s, m.focus(), m.selectionStart = d + 1, m.selectionEnd = d + 1;
              } else libraryBase.jspreadsheet.current.edition[0].children[0].blur();
            } else n.which == 9 && (libraryBase.jspreadsheet.current.options.columns && libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] && ["calendar", "html"].includes(libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type) ? closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], !0) : libraryBase.jspreadsheet.current.edition[0].children[0].blur());
            if (!libraryBase.jspreadsheet.current.edition && libraryBase.jspreadsheet.current.selectedCell) if (n.which == 37) left.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 39) right.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 38) up.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 40) down.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 36) first.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 35) last.call(libraryBase.jspreadsheet.current, n.shiftKey, n.ctrlKey), n.preventDefault();
            else if (n.which == 46 || n.which == 8) libraryBase.jspreadsheet.current.options.editable != 0 && (libraryBase.jspreadsheet.current.selectedRow != null ? libraryBase.jspreadsheet.current.options.allowDeleteRow != 0 && confirm(jSuites.translate("Are you sure to delete the selected rows?")) && libraryBase.jspreadsheet.current.deleteRow() : libraryBase.jspreadsheet.current.selectedHeader ? libraryBase.jspreadsheet.current.options.allowDeleteColumn != 0 && confirm(jSuites.translate("Are you sure to delete the selected columns?")) && libraryBase.jspreadsheet.current.deleteColumn() : libraryBase.jspreadsheet.current.setValue(libraryBase.jspreadsheet.current.highlighted.map((function(m) {
              return m.element;
            })), ""));
            else if (n.which == 13) n.shiftKey ? up.call(libraryBase.jspreadsheet.current) : (libraryBase.jspreadsheet.current.options.allowInsertRow != 0 && libraryBase.jspreadsheet.current.options.allowManualInsertRow != 0 && libraryBase.jspreadsheet.current.selectedCell[1] == libraryBase.jspreadsheet.current.options.data.length - 1 && libraryBase.jspreadsheet.current.insertRow(), down.call(libraryBase.jspreadsheet.current)), n.preventDefault();
            else if (n.which == 9) n.shiftKey ? left.call(libraryBase.jspreadsheet.current) : (libraryBase.jspreadsheet.current.options.allowInsertColumn != 0 && libraryBase.jspreadsheet.current.options.allowManualInsertColumn != 0 && libraryBase.jspreadsheet.current.selectedCell[0] == libraryBase.jspreadsheet.current.options.data[0].length - 1 && libraryBase.jspreadsheet.current.insertColumn(), right.call(libraryBase.jspreadsheet.current)), n.preventDefault();
            else if (!n.ctrlKey && !n.metaKey || n.shiftKey) {
              if (libraryBase.jspreadsheet.current.selectedCell && libraryBase.jspreadsheet.current.options.editable != 0) {
                const m = libraryBase.jspreadsheet.current.selectedCell[1], s = libraryBase.jspreadsheet.current.selectedCell[0];
                n.keyCode == 32 ? (n.preventDefault(), libraryBase.jspreadsheet.current.options.columns[s].type == "checkbox" || libraryBase.jspreadsheet.current.options.columns[s].type == "radio" ? setCheckRadioValue.call(libraryBase.jspreadsheet.current) : openEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[m][s].element, !0, n)) : n.keyCode == 113 ? openEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[m][s].element, !1, n) : n.key.length !== 1 && n.key !== "Process" || n.altKey || isCtrl(n) || (openEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[m][s].element, !0, n), libraryBase.jspreadsheet.current.options.columns && libraryBase.jspreadsheet.current.options.columns[s] && libraryBase.jspreadsheet.current.options.columns[s].type == "calendar" && n.preventDefault());
              }
            } else n.which == 65 ? (selection.Ub.call(libraryBase.jspreadsheet.current), n.preventDefault()) : n.which == 83 ? (libraryBase.jspreadsheet.current.download(), n.preventDefault()) : n.which == 89 ? (libraryBase.jspreadsheet.current.redo(), n.preventDefault()) : n.which == 90 ? (libraryBase.jspreadsheet.current.undo(), n.preventDefault()) : n.which == 67 ? (copy.call(libraryBase.jspreadsheet.current, !0), n.preventDefault()) : n.which == 88 ? (libraryBase.jspreadsheet.current.options.editable != 0 ? cutControls() : copyControls(), n.preventDefault()) : n.which == 86 && pasteControls();
            else n.target.classList.contains("jss_search") && (libraryBase.jspreadsheet.timeControl && clearTimeout(libraryBase.jspreadsheet.timeControl), libraryBase.jspreadsheet.timeControl = setTimeout((function() {
              libraryBase.jspreadsheet.current.search(n.target.value);
            }), 200));
          }
        }, wheelControls = function(n) {
          const m = this;
          m.options.lazyLoading == 1 && libraryBase.jspreadsheet.timeControlLoading == null && (libraryBase.jspreadsheet.timeControlLoading = setTimeout((function() {
            m.content.scrollTop + m.content.clientHeight >= m.content.scrollHeight - 10 ? lazyLoading.p6.call(m) && (m.content.scrollTop + m.content.clientHeight > m.content.scrollHeight - 10 && (m.content.scrollTop = m.content.scrollTop - m.content.clientHeight), selection.Aq.call(m)) : m.content.scrollTop <= m.content.clientHeight && lazyLoading.G_.call(m) && (m.content.scrollTop < 10 && (m.content.scrollTop = m.content.scrollTop + m.content.clientHeight), selection.Aq.call(m)), libraryBase.jspreadsheet.timeControlLoading = null;
          }), 100));
        };
        let scrollLeft = 0;
        const updateFreezePosition = function() {
          const n = this;
          scrollLeft = n.content.scrollLeft;
          let m = 0;
          if (scrollLeft > 50) for (let s = 0; s < n.options.freezeColumns; s++) {
            if (s > 0 && (!n.options.columns || !n.options.columns[s - 1] || n.options.columns[s - 1].type !== "hidden")) {
              let d;
              d = n.options.columns && n.options.columns[s - 1] && n.options.columns[s - 1].width !== void 0 ? parseInt(n.options.columns[s - 1].width) : n.options.defaultColWidth !== void 0 ? parseInt(n.options.defaultColWidth) : 100, m += parseInt(d);
            }
            n.headers[s].classList.add("jss_freezed"), n.headers[s].style.left = m + "px";
            for (let d = 0; d < n.rows.length; d++) if (n.rows[d] && n.records[d][s]) {
              const k = scrollLeft + (s > 0 ? n.records[d][s - 1].element.style.width : 0) - 51 + "px";
              n.records[d][s].element.classList.add("jss_freezed"), n.records[d][s].element.style.left = k;
            }
          }
          else for (let s = 0; s < n.options.freezeColumns; s++) {
            n.headers[s].classList.remove("jss_freezed"), n.headers[s].style.left = "";
            for (let d = 0; d < n.rows.length; d++) n.records[d][s] && (n.records[d][s].element.classList.remove("jss_freezed"), n.records[d][s].element.style.left = "");
          }
          selection.Aq.call(n);
        }, scrollControls = function(n) {
          const m = this;
          wheelControls.call(m), m.options.freezeColumns > 0 && m.content.scrollLeft != scrollLeft && updateFreezePosition.call(m), m.options.lazyLoading != 1 && m.options.tableOverflow != 1 || m.edition && n.target.className.substr(0, 9) != "jdropdown" && closeEditor.call(m, m.edition[0], !0);
        }, setEvents = function(n) {
          destroyEvents(n), n.addEventListener("mouseup", mouseUpControls), n.addEventListener("mousedown", mouseDownControls), n.addEventListener("mousemove", mouseMoveControls), n.addEventListener("mouseover", mouseOverControls), n.addEventListener("dblclick", doubleClickControls), n.addEventListener("paste", pasteControls), n.addEventListener("contextmenu", contextMenuControls), n.addEventListener("touchstart", touchStartControls), n.addEventListener("touchend", touchEndControls), n.addEventListener("touchcancel", touchEndControls), n.addEventListener("touchmove", touchEndControls), document.addEventListener("keydown", keyDownControls);
        }, destroyEvents = function(n) {
          n.removeEventListener("mouseup", mouseUpControls), n.removeEventListener("mousedown", mouseDownControls), n.removeEventListener("mousemove", mouseMoveControls), n.removeEventListener("mouseover", mouseOverControls), n.removeEventListener("dblclick", doubleClickControls), n.removeEventListener("paste", pasteControls), n.removeEventListener("contextmenu", contextMenuControls), n.removeEventListener("touchstart", touchStartControls), n.removeEventListener("touchend", touchEndControls), n.removeEventListener("touchcancel", touchEndControls), document.removeEventListener("keydown", keyDownControls);
        };
        var toolbar = __webpack_require__(392), pagination = __webpack_require__(167);
        const setData = function(n) {
          const m = this;
          if (n && (m.options.data = n), m.options.data || (m.options.data = []), m.options.data && m.options.data[0] && !Array.isArray(m.options.data[0])) {
            n = [];
            for (let _ = 0; _ < m.options.data.length; _++) {
              const l = [];
              for (let a = 0; a < m.options.columns.length; a++) l[a] = m.options.data[_][m.options.columns[a].name];
              n.push(l);
            }
            m.options.data = n;
          }
          let s = 0, d = 0;
          const k = m.options.columns && m.options.columns.length || 0, j = m.options.data.length, z = m.options.minDimensions[0], B = m.options.minDimensions[1], g = z > k ? z : k, o = B > j ? B : j;
          for (s = 0; s < o; s++) for (d = 0; d < g; d++) m.options.data[s] == null && (m.options.data[s] = []), m.options.data[s][d] == null && (m.options.data[s][d] = "");
          let b, D;
          for (m.rows = [], m.results = null, m.records = [], m.history = [], m.historyIndex = -1, m.tbody.innerHTML = "", m.options.lazyLoading == 1 ? (b = 0, D = m.options.data.length < 100 ? m.options.data.length : 100, m.options.pagination && (m.options.pagination = !1, console.error("Jspreadsheet: Pagination will be disable due the lazyLoading"))) : m.options.pagination ? (m.pageNumber || (m.pageNumber = 0), m.options.pagination, b = m.options.pagination * m.pageNumber, D = m.options.pagination * m.pageNumber + m.options.pagination, m.options.data.length < D && (D = m.options.data.length)) : (b = 0, D = m.options.data.length), s = 0; s < m.options.data.length; s++) {
            const _ = createRow.call(m, s, m.options.data[s]);
            s >= b && s < D && m.tbody.appendChild(_.element);
          }
          if (m.options.lazyLoading == 1 || m.options.pagination && pagination.IV.call(m), m.options.mergeCells) {
            const _ = Object.keys(m.options.mergeCells);
            for (let l = 0; l < _.length; l++) {
              const a = m.options.mergeCells[_[l]];
              merges.FU.call(m, _[l], a[0], a[1], 1);
            }
          }
          internal.am.call(m);
        }, getValue = function(n, m) {
          const s = this;
          let d, k;
          if (typeof n != "string") return null;
          d = (n = (0, internalHelpers.vu)(n, !0))[0], k = n[1];
          let j = null;
          return d != null && k != null && (s.records[k] && s.records[k][d] && m ? j = s.records[k][d].element.innerHTML : s.options.data[k] && s.options.data[k][d] != "undefined" && (j = s.options.data[k][d])), j;
        }, getValueFromCoords = function(n, m, s) {
          const d = this;
          let k = null;
          return n != null && m != null && (d.records[m] && d.records[m][n] && s ? k = d.records[m][n].element.innerHTML : d.options.data[m] && d.options.data[m][n] != "undefined" && (k = d.options.data[m][n])), k;
        }, setValue = function(n, m, s) {
          const d = this, k = [];
          if (typeof n == "string") {
            const z = (0, internalHelpers.vu)(n, !0), B = z[0], g = z[1];
            k.push(internal.k9.call(d, B, g, m, s)), internal.xF.call(d, B, g, k);
          } else {
            let z = null, B = null;
            if (n && n.getAttribute && (z = n.getAttribute("data-x"), B = n.getAttribute("data-y")), z != null && B != null) k.push(internal.k9.call(d, z, B, m, s)), internal.xF.call(d, z, B, k);
            else {
              const g = Object.keys(n);
              if (g.length > 0) for (let o = 0; o < g.length; o++) {
                let b, D;
                if (typeof n[o] == "string") {
                  const _ = (0, internalHelpers.vu)(n[o], !0);
                  b = _[0], D = _[1];
                } else n[o].x != null && n[o].y != null ? (b = n[o].x, D = n[o].y, n[o].value != null && (m = n[o].value)) : (b = n[o].getAttribute("data-x"), D = n[o].getAttribute("data-y"));
                b != null && D != null && (k.push(internal.k9.call(d, b, D, m, s)), internal.xF.call(d, b, D, k));
              }
            }
          }
          utils_history.Dh.call(d, { action: "setValue", records: k, selection: d.selectedCell }), internal.am.call(d);
          const j = k.map((function(z) {
            return { x: z.x, y: z.y, value: z.value, oldValue: z.oldValue };
          }));
          dispatch.A.call(d, "onafterchanges", d, j);
        }, setValueFromCoords = function(n, m, s, d) {
          const k = this, j = [];
          j.push(internal.k9.call(k, n, m, s, d)), internal.xF.call(k, n, m, j), utils_history.Dh.call(k, { action: "setValue", records: j, selection: k.selectedCell }), internal.am.call(k);
          const z = j.map((function(B) {
            return { x: B.x, y: B.y, value: B.value, oldValue: B.oldValue };
          }));
          dispatch.A.call(k, "onafterchanges", k, z);
        }, getData = function(n, m, s, d) {
          const k = this, j = [];
          let z = 0, B = 0;
          const g = Math.max(...k.options.data.map((function(b) {
            return b.length;
          }))), o = k.options.data.length;
          for (let b = 0; b < o; b++) {
            z = 0;
            for (let D = 0; D < g; D++) n && !k.records[b][D].element.classList.contains("highlight") || (j[B] || (j[B] = []), j[B][z] = m ? k.records[b][D].element.innerHTML : k.options.data[b][D], z++);
            z > 0 && B++;
          }
          return s ? j.map((function(b) {
            return b.join(s);
          })).join(`\r
`) + `\r
` : d ? j.map((function(b) {
            const D = {};
            return b.forEach((function(_, l) {
              D[l] = _;
            })), D;
          })) : j;
        }, getDataFromRange = function(n, m) {
          const s = this, d = (0, helpers.getCoordsFromRange)(n), k = [];
          for (let j = d[1]; j <= d[3]; j++) {
            k.push([]);
            for (let z = d[0]; z <= d[2]; z++) m ? k[k.length - 1].push(s.records[j][z].element.innerHTML) : k[k.length - 1].push(s.options.data[j][z]);
          }
          return k;
        }, search = function(n) {
          const m = this;
          if (m.options.filters && filter.dr.call(m), m.resetSelection(), m.pageNumber = 0, m.results = [], n) {
            m.searchInput.value !== n && (m.searchInput.value = n);
            const s = function(j, z, B) {
              for (let g = 0; g < j.length; g++) if (("" + j[g]).toLowerCase().search(z) >= 0 || ("" + m.records[B][g].element.innerHTML).toLowerCase().search(z) >= 0) return !0;
              return !1;
            }, d = function(j) {
              m.results.indexOf(j) == -1 && m.results.push(j);
            };
            let k = n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            k = new RegExp(k, "i"), m.options.data.forEach((function(j, z) {
              if (s(j, k, z)) {
                const B = merges.D0.call(m, z);
                if (B.length) for (let g = 0; g < B.length; g++) {
                  const o = (0, internalHelpers.vu)(B[g], !0);
                  for (let b = 0; b < m.options.mergeCells[B[g]][1]; b++) d(o[1] + b);
                }
                else d(z);
              }
            }));
          } else m.results = null;
          internal.hG.call(m);
        }, resetSearch = function() {
          const n = this;
          n.searchInput.value = "", n.search(""), n.results = null;
        }, getHeader = function(n) {
          return this.headers[n].textContent;
        }, getHeaders = function(n) {
          const m = this, s = [];
          for (let d = 0; d < m.headers.length; d++) s.push(m.getHeader(d));
          return n ? s : s.join(m.options.csvDelimiter);
        }, setHeader = function(n, m) {
          const s = this;
          if (s.headers[n]) {
            const d = s.headers[n].textContent, k = s.options.columns && s.options.columns[n] && s.options.columns[n].title || "";
            m || (m = (0, helpers.getColumnName)(n)), s.headers[n].textContent = m, s.headers[n].setAttribute("title", m), s.options.columns || (s.options.columns = []), s.options.columns[n] || (s.options.columns[n] = {}), s.options.columns[n].title = m, utils_history.Dh.call(s, { action: "setHeader", column: n, oldValue: d, newValue: m }), dispatch.A.call(s, "onchangeheader", s, parseInt(n), m, k);
          }
        }, getStyle = function(n, m) {
          const s = this;
          if (n) return n = (0, internalHelpers.vu)(n, !0), m ? s.records[n[1]][n[0]].element.style[m] : s.records[n[1]][n[0]].element.getAttribute("style");
          {
            const d = {}, k = s.options.data[0].length, j = s.options.data.length;
            for (let z = 0; z < j; z++) for (let B = 0; B < k; B++) {
              const g = m ? s.records[z][B].element.style[m] : s.records[z][B].element.getAttribute("style");
              g && (d[(0, internalHelpers.t3)([B, z])] = g);
            }
            return d;
          }
        }, setStyle = function(n, m, s, d, k) {
          const j = this, z = {}, B = {}, g = function(b, D, _) {
            const l = (0, internalHelpers.vu)(b, !0);
            if (j.records[l[1]] && j.records[l[1]][l[0]] && (j.records[l[1]][l[0]].element.classList.contains("readonly") == 0 || d)) {
              const a = j.records[l[1]][l[0]].element.style[D];
              a != _ || d ? j.records[l[1]][l[0]].element.style[D] = _ : (_ = "", j.records[l[1]][l[0]].element.style[D] = ""), B[b] || (B[b] = []), z[b] || (z[b] = []), B[b].push([D + ":" + a]), z[b].push([D + ":" + _]);
            }
          };
          if (m && s) typeof n == "string" && g(n, m, s);
          else {
            const b = Object.keys(n);
            for (let D = 0; D < b.length; D++) {
              let _ = n[b[D]];
              typeof _ == "string" && (_ = _.split(";"));
              for (let l = 0; l < _.length; l++) typeof _[l] == "string" && (_[l] = _[l].split(":")), _[l][0].trim() && g(b[D], _[l][0].trim(), _[l][1]);
            }
          }
          let o = Object.keys(B);
          for (let b = 0; b < o.length; b++) B[o[b]] = B[o[b]].join(";");
          o = Object.keys(z);
          for (let b = 0; b < o.length; b++) z[o[b]] = z[o[b]].join(";");
          k || utils_history.Dh.call(j, { action: "setStyle", oldValue: B, newValue: z }), dispatch.A.call(j, "onchangestyle", j, z);
        }, resetStyle = function(n, m) {
          const s = this, d = Object.keys(n);
          for (let k = 0; k < d.length; k++) {
            const j = (0, internalHelpers.vu)(d[k], !0);
            s.records[j[1]] && s.records[j[1]][j[0]] && s.records[j[1]][j[0]].element.setAttribute("style", "");
          }
          s.setStyle(n, null, null, null, m);
        }, download = function(n, m) {
          const s = this;
          if (s.parent.config.allowExport == 0) console.error("Export not allowed");
          else {
            let d = "";
            d += copy.call(s, !1, s.options.csvDelimiter, !0, n, !0, void 0, m);
            const k = new Blob(["\uFEFF" + d], { type: "text/csv;charset=utf-8;" });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(k, (s.options.csvFileName || s.options.worksheetName) + ".csv");
            else {
              const j = document.createElement("a");
              j.setAttribute("target", "_top");
              const z = URL.createObjectURL(k);
              j.href = z, j.setAttribute("download", (s.options.csvFileName || s.options.worksheetName) + ".csv"), document.body.appendChild(j), j.click(), j.parentNode.removeChild(j);
            }
          }
        }, getComments = function(n) {
          const m = this;
          if (n) return typeof n != "string" ? getComments.call(m) : (n = (0, internalHelpers.vu)(n, !0), m.records[n[1]][n[0]].element.getAttribute("title") || "");
          {
            const s = {};
            for (let d = 0; d < m.options.data.length; d++) for (let k = 0; k < m.options.columns.length; k++) {
              const j = m.records[d][k].element.getAttribute("title");
              j && (s[(0, internalHelpers.t3)([k, d])] = j);
            }
            return s;
          }
        }, setComments = function(n, m) {
          const s = this;
          let d;
          d = typeof n == "string" ? { [n]: m } : n;
          const k = {};
          Object.entries(d).forEach((function([j, z]) {
            const B = (0, helpers.getCoordsFromCellName)(j);
            k[j] = s.records[B[1]][B[0]].element.getAttribute("title"), s.records[B[1]][B[0]].element.setAttribute("title", z || ""), z ? (s.records[B[1]][B[0]].element.classList.add("jss_comments"), s.options.comments || (s.options.comments = {}), s.options.comments[j] = z) : (s.records[B[1]][B[0]].element.classList.remove("jss_comments"), s.options.comments && s.options.comments[j] && delete s.options.comments[j]);
          })), utils_history.Dh.call(s, { action: "setComments", newValue: d, oldValue: k }), dispatch.A.call(s, "oncomments", s, d, k);
        };
        var orderBy = __webpack_require__(94);
        const getWorksheetConfig = function() {
          return this.options;
        }, getSpreadsheetConfig = function() {
          return this.config;
        }, setConfig = function(n, m) {
          const s = this, d = Object.keys(n);
          let k;
          s.parent ? k = s.parent : (m = !0, k = s), d.forEach((function(j) {
            m ? (k.config[j] = n[j], j === "toolbar" && (n[j] === !0 ? k.showToolbar() : n[j] === !1 && k.hideToolbar())) : s.options[j] = n[j];
          }));
        };
        var meta = __webpack_require__(654);
        const setReadOnly = function(n, m) {
          const s = this;
          let d;
          if (typeof n == "string") {
            const k = (0, helpers.getCoordsFromCellName)(n);
            d = s.records[k[1]][k[0]];
          } else {
            const k = parseInt(n.getAttribute("data-x")), j = parseInt(n.getAttribute("data-y"));
            d = s.records[j][k];
          }
          m ? d.element.classList.add("readonly") : d.element.classList.remove("readonly");
        }, isReadOnly = function(n, m) {
          return typeof n == "string" && m === void 0 && ([n, m] = (0, helpers.getCoordsFromCellName)(n)), this.records[m][n].element.classList.contains("readonly");
        }, setWorksheetFunctions = function(n) {
          for (let m = 0; m < worksheetPublicMethodsLength; m++) {
            const [s, d] = worksheetPublicMethods[m];
            n[s] = d.bind(n);
          }
        }, createTable = function() {
          let n = this;
          setWorksheetFunctions(n), n.table = document.createElement("table"), n.thead = document.createElement("thead"), n.tbody = document.createElement("tbody"), n.headers = [], n.cols = [], n.content = document.createElement("div"), n.content.classList.add("jss_content"), n.content.onscroll = function(D) {
            scrollControls.call(n, D);
          }, n.content.onwheel = function(D) {
            wheelControls.call(n, D);
          };
          const m = document.createElement("div"), s = document.createElement("label");
          s.innerHTML = jSuites.translate("Search") + ": ", m.appendChild(s), n.searchInput = document.createElement("input"), n.searchInput.classList.add("jss_search"), s.appendChild(n.searchInput), n.searchInput.onfocus = function() {
            n.resetSelection();
          };
          const d = document.createElement("div");
          if (n.options.pagination > 0 && n.options.paginationOptions && n.options.paginationOptions.length > 0) {
            n.paginationDropdown = document.createElement("select"), n.paginationDropdown.classList.add("jss_pagination_dropdown"), n.paginationDropdown.onchange = function() {
              n.options.pagination = parseInt(this.value), n.page(0);
            };
            for (let D = 0; D < n.options.paginationOptions.length; D++) {
              const _ = document.createElement("option");
              _.value = n.options.paginationOptions[D], _.innerHTML = n.options.paginationOptions[D], n.paginationDropdown.appendChild(_);
            }
            n.paginationDropdown.value = n.options.pagination, d.appendChild(document.createTextNode(jSuites.translate("Show "))), d.appendChild(n.paginationDropdown), d.appendChild(document.createTextNode(jSuites.translate("entries")));
          }
          const k = document.createElement("div");
          k.classList.add("jss_filter"), k.appendChild(d), k.appendChild(m), n.colgroupContainer = document.createElement("colgroup");
          let j = document.createElement("col");
          if (j.setAttribute("width", "50"), n.colgroupContainer.appendChild(j), n.options.nestedHeaders && n.options.nestedHeaders.length > 0 && n.options.nestedHeaders[0] && n.options.nestedHeaders[0][0]) for (let D = 0; D < n.options.nestedHeaders.length; D++) n.thead.appendChild(internal.ju.call(n, n.options.nestedHeaders[D]));
          n.headerContainer = document.createElement("tr"), j = document.createElement("td"), j.classList.add("jss_selectall"), n.headerContainer.appendChild(j);
          const z = getNumberOfColumns.call(n);
          for (let D = 0; D < z; D++) createCellHeader.call(n, D), n.headerContainer.appendChild(n.headers[D]), n.colgroupContainer.appendChild(n.cols[D].colElement);
          if (n.thead.appendChild(n.headerContainer), n.options.filters == 1) {
            n.filter = document.createElement("tr");
            const D = document.createElement("td");
            n.filter.appendChild(D);
            for (let _ = 0; _ < n.options.columns.length; _++) {
              const l = document.createElement("td");
              l.innerHTML = "&nbsp;", l.setAttribute("data-x", _), l.className = "jss_column_filter", n.options.columns[_].type == "hidden" && (l.style.display = "none"), n.filter.appendChild(l);
            }
            n.thead.appendChild(n.filter);
          }
          n.table = document.createElement("table"), n.table.classList.add("jss_worksheet"), n.table.setAttribute("cellpadding", "0"), n.table.setAttribute("cellspacing", "0"), n.table.setAttribute("unselectable", "yes"), n.table.appendChild(n.colgroupContainer), n.table.appendChild(n.thead), n.table.appendChild(n.tbody), n.options.textOverflow || n.table.classList.add("jss_overflow"), n.corner = document.createElement("div"), n.corner.className = "jss_corner", n.corner.setAttribute("unselectable", "on"), n.corner.setAttribute("onselectstart", "return false"), n.options.selectionCopy == 0 && (n.corner.style.display = "none"), n.textarea = document.createElement("textarea"), n.textarea.className = "jss_textarea", n.textarea.id = "jss_textarea", n.textarea.tabIndex = "-1", n.textarea.ariaHidden = "true";
          const B = document.createElement("a");
          B.setAttribute("href", "https://bossanova.uk/jspreadsheet/"), n.ads = document.createElement("div"), n.ads.className = "jss_about";
          const g = document.createElement("span");
          g.innerHTML = "Jspreadsheet CE", B.appendChild(g), n.ads.appendChild(B), document.createElement("div").classList.add("jss_table"), n.pagination = document.createElement("div"), n.pagination.classList.add("jss_pagination");
          const o = document.createElement("div"), b = document.createElement("div");
          if (n.pagination.appendChild(o), n.pagination.appendChild(b), n.options.pagination || (n.pagination.style.display = "none"), n.options.search == 1 && n.element.appendChild(k), n.content.appendChild(n.table), n.content.appendChild(n.corner), n.content.appendChild(n.textarea), n.element.appendChild(n.content), n.element.appendChild(n.pagination), n.element.appendChild(n.ads), n.element.classList.add("jss_container"), n.element.jssWorksheet = n, n.element.jspreadsheet = n, n.options.tableOverflow == 1 && (n.options.tableHeight && (n.content.style["overflow-y"] = "auto", n.content.style["box-shadow"] = "rgb(221 221 221) 2px 2px 5px 0.1px", n.content.style.maxHeight = typeof n.options.tableHeight == "string" ? n.options.tableHeight : n.options.tableHeight + "px"), n.options.tableWidth && (n.content.style["overflow-x"] = "auto", n.content.style.width = typeof n.options.tableWidth == "string" ? n.options.tableWidth : n.options.tableWidth + "px")), n.options.tableOverflow != 1 && n.parent.config.toolbar && n.element.classList.add("with-toolbar"), n.options.columnDrag != 0 && n.thead.classList.add("draggable"), n.options.columnResize != 0 && n.thead.classList.add("resizable"), n.options.rowDrag != 0 && n.tbody.classList.add("draggable"), n.options.rowResize != 0 && n.tbody.classList.add("resizable"), n.setData.call(n), n.options.style && (n.setStyle(n.options.style, null, null, 1, 1), delete n.options.style), Object.defineProperty(n.options, "style", { enumerable: !0, configurable: !0, get() {
            return n.getStyle();
          } }), n.options.comments && n.setComments(n.options.comments), n.options.classes) {
            const D = Object.keys(n.options.classes);
            for (let _ = 0; _ < D.length; _++) {
              const l = (0, internalHelpers.vu)(D[_], !0);
              n.records[l[1]][l[0]].element.classList.add(n.options.classes[D[_]]);
            }
          }
        }, prepareTable = function() {
          const n = this;
          n.options.lazyLoading == 1 && n.options.tableOverflow != 1 && n.parent.config.fullscreen != 1 && (console.error("Jspreadsheet: The lazyloading only works when tableOverflow = yes or fullscreen = yes"), n.options.lazyLoading = !1), n.options.columns || (n.options.columns = []);
          let m, s = n.options.columns.length;
          if (n.options.data && n.options.data[0] !== void 0) if (Array.isArray(n.options.data[0])) {
            const k = n.options.data[0].length;
            k > s && (s = k);
          } else m = Object.keys(n.options.data[0]), m.length > s && (s = m.length);
          n.options.minDimensions || (n.options.minDimensions = [0, 0]), n.options.minDimensions[0] > s && (s = n.options.minDimensions[0]);
          const d = [];
          for (let k = 0; k < s; k++) n.options.columns[k] || (n.options.columns[k] = {}), !n.options.columns[k].name && m && m[k] && (n.options.columns[k].name = m[k]), n.options.columns[k].type == "dropdown" && n.options.columns[k].url && d.push({ url: n.options.columns[k].url, index: k, method: "GET", dataType: "json", success: function(j) {
            n.options.columns[this.index].source || (n.options.columns[this.index].source = []);
            for (let z = 0; z < j.length; z++) n.options.columns[this.index].source.push(j[z]);
          } });
          d.length ? jSuites.ajax(d, (function() {
            createTable.call(n);
          })) : createTable.call(n);
        }, getNextDefaultWorksheetName = function(n) {
          const m = /^Sheet(\d+)$/;
          let s = 0;
          return n.worksheets.forEach((function(d) {
            const k = m.exec(d.options.worksheetName);
            k && (s = Math.max(s, parseInt(k[1])));
          })), "Sheet" + (s + 1);
        }, buildWorksheet = async function() {
          const n = this, m = (n.element, n.parent);
          typeof m.plugins == "object" && Object.entries(m.plugins).forEach((function([, d]) {
            typeof d.beforeinit == "function" && d.beforeinit(n);
          })), libraryBase.jspreadsheet.current = n;
          const s = [];
          if (n.options.csv) {
            const d = new Promise(((k) => {
              jSuites.ajax({ url: n.options.csv, method: "GET", dataType: "text", success: function(j) {
                const z = (0, helpers.parseCSV)(j, n.options.csvDelimiter);
                if (n.options.csvHeaders == 1 && z.length > 0) {
                  const B = z.shift();
                  if (B.length > 0) {
                    n.options.columns || (n.options.columns = []);
                    for (let g = 0; g < B.length; g++) n.options.columns[g] || (n.options.columns[g] = {}), n.options.columns[g].title === void 0 && (n.options.columns[g].title = B[g]);
                  }
                }
                n.options.data = z, prepareTable.call(n), k();
              } });
            }));
            s.push(d);
          } else if (n.options.url) {
            const d = new Promise(((k) => {
              jSuites.ajax({ url: n.options.url, method: "GET", dataType: "json", success: function(j) {
                n.options.data = j.data ? j.data : j, prepareTable.call(n), k();
              } });
            }));
            s.push(d);
          } else prepareTable.call(n);
          await Promise.all(s), typeof m.plugins == "object" && Object.entries(m.plugins).forEach((function([, d]) {
            typeof d.init == "function" && d.init(n);
          }));
        }, createWorksheetObj = function(n) {
          const m = this.parent;
          n.worksheetName || (n.worksheetName = getNextDefaultWorksheetName(this.parent));
          const s = { parent: m, options: n, filters: [], formula: [], history: [], selection: [], historyIndex: -1 };
          return m.config.worksheets.push(s.options), m.worksheets.push(s), s;
        }, createWorksheet = function(n) {
          const m = this.parent;
          m.creationThroughJss = !0, createWorksheetObj.call(this, n), m.element.tabs.create(n.worksheetName);
        }, openWorksheet = function(n) {
          this.parent.element.tabs.open(n);
        }, deleteWorksheet = function(n) {
          const m = this;
          m.parent.element.tabs.remove(n);
          const s = m.parent.worksheets.splice(n, 1)[0];
          dispatch.A.call(m.parent, "ondeleteworksheet", s, n);
        }, worksheetPublicMethods = [["selectAll", selection.Ub], ["updateSelectionFromCoords", function(n, m, s, d) {
          return selection.AH.call(this, n, m, s, d);
        }], ["resetSelection", function() {
          return selection.gE.call(this);
        }], ["getSelection", selection.Lo], ["getSelected", selection.ef], ["getSelectedColumns", selection.Jg], ["getSelectedRows", selection.R5], ["getData", getData], ["setData", setData], ["getValue", getValue], ["getValueFromCoords", getValueFromCoords], ["setValue", setValue], ["setValueFromCoords", setValueFromCoords], ["getWidth", getWidth], ["setWidth", function(n, m) {
          return setWidth.call(this, n, m);
        }], ["insertRow", insertRow], ["moveRow", function(n, m) {
          return moveRow.call(this, n, m);
        }], ["deleteRow", deleteRow], ["hideRow", hideRow], ["showRow", showRow], ["getRowData", getRowData], ["setRowData", setRowData], ["getHeight", getHeight], ["setHeight", function(n, m) {
          return setHeight.call(this, n, m);
        }], ["getMerge", merges.fd], ["setMerge", function(n, m, s) {
          return merges.FU.call(this, n, m, s);
        }], ["destroyMerge", function() {
          return merges.VP.call(this);
        }], ["removeMerge", function(n, m) {
          return merges.Zp.call(this, n, m);
        }], ["search", search], ["resetSearch", resetSearch], ["getHeader", getHeader], ["getHeaders", getHeaders], ["setHeader", setHeader], ["getStyle", getStyle], ["setStyle", function(n, m, s, d) {
          return setStyle.call(this, n, m, s, d);
        }], ["resetStyle", resetStyle], ["insertColumn", insertColumn], ["moveColumn", moveColumn], ["deleteColumn", deleteColumn], ["getColumnData", getColumnData], ["setColumnData", setColumnData], ["whichPage", pagination.ho], ["page", pagination.MY], ["download", download], ["getComments", getComments], ["setComments", setComments], ["orderBy", orderBy.My], ["undo", utils_history.tN], ["redo", utils_history.ZS], ["getCell", internal.tT], ["getCellFromCoords", internal.Xr], ["getLabel", internal.p9], ["getConfig", getWorksheetConfig], ["setConfig", setConfig], ["getMeta", function(n) {
          return meta.IQ.call(this, n);
        }], ["setMeta", meta.iZ], ["showColumn", showColumn], ["hideColumn", hideColumn], ["showIndex", internal.C6], ["hideIndex", internal.TI], ["getWorksheetActive", internal.$O], ["openEditor", openEditor], ["closeEditor", closeEditor], ["createWorksheet", createWorksheet], ["openWorksheet", openWorksheet], ["deleteWorksheet", deleteWorksheet], ["copy", function(n) {
          n ? cutControls() : copy.call(this, !0);
        }], ["paste", paste], ["executeFormula", internal.Em], ["getDataFromRange", getDataFromRange], ["quantiyOfPages", pagination.$f], ["getRange", selection.eO], ["isSelected", selection.sp], ["setReadOnly", setReadOnly], ["isReadOnly", isReadOnly], ["getHighlighted", selection.kV], ["dispatch", dispatch.A], ["down", down], ["first", first], ["last", last], ["left", left], ["right", right], ["up", up], ["openFilter", filter.N$], ["resetFilters", filter.dr]], worksheetPublicMethodsLength = worksheetPublicMethods.length, factory = function() {
        }, createWorksheets = async function(n, m, s) {
          let d = m.worksheets;
          if (!d) throw new Error("JSS: worksheets are not defined");
          {
            let k = { animation: !0, onbeforecreate: function(g, o) {
              return o || getNextDefaultWorksheetName(n);
            }, oncreate: function(g, o) {
              if (n.creationThroughJss) n.creationThroughJss = !1;
              else {
                const D = g.tabs.headers.children[g.tabs.headers.children.length - 2].innerHTML;
                createWorksheetObj.call(n.worksheets[0], { minDimensions: [10, 15], worksheetName: D });
              }
              const b = n.worksheets[n.worksheets.length - 1];
              b.element = o, buildWorksheet.call(b).then((function() {
                (0, toolbar.nK)(b), dispatch.A.call(b, "oncreateworksheet", b, m, n.worksheets.length - 1);
              }));
            }, onchange: function(g, o, b) {
              n.worksheets.length != 0 && n.worksheets[b] && (0, toolbar.nK)(n.worksheets[b]);
            } };
            m.tabs == 1 ? k.allowCreate = !0 : k.hideHeaders = !0, k.data = [];
            let j = 1;
            for (let g = 0; g < d.length; g++) d[g].worksheetName || (d[g].worksheetName = "Sheet" + j++), k.data.push({ title: d[g].worksheetName, content: "" });
            s.classList.add("jss_spreadsheet"), s.tabIndex = 0;
            const z = jSuites.tabs(s, k), B = m.style;
            delete m.style;
            for (let g = 0; g < d.length; g++) d[g].style && Object.entries(d[g].style).forEach((function([o, b]) {
              typeof b == "number" && (d[g].style[o] = B[b]);
            })), n.worksheets.push({ parent: n, element: z.content.children[g], options: d[g], filters: [], formula: [], history: [], selection: [], historyIndex: -1 }), await buildWorksheet.call(n.worksheets[g]);
          }
        };
        factory.spreadsheet = async function(n, m, s) {
          if (n.tagName == "TABLE") {
            m || (m = {}), m.worksheets || (m.worksheets = []);
            const k = (0, helpers.createFromTable)(n, m.worksheets[0]);
            m.worksheets[0] = k;
            const j = document.createElement("div");
            n.parentNode.insertBefore(j, n), n.remove(), n = j;
          }
          let d = { worksheets: s, config: m, element: n, el: n };
          return d.contextMenu = document.createElement("div"), d.contextMenu.className = "jss_contextmenu", d.getWorksheetActive = internal.$O.bind(d), d.fullscreen = internal.Y5.bind(d), d.showToolbar = toolbar.ll.bind(d), d.hideToolbar = toolbar.Ar.bind(d), d.getConfig = getSpreadsheetConfig.bind(d), d.setConfig = setConfig.bind(d), d.setPlugins = function(k) {
            d.plugins || (d.plugins = {}), typeof k == "object" && Object.entries(k).forEach((function([j, z]) {
              d.plugins[j] = z.call(libraryBase.jspreadsheet, d, {}, d.config);
            }));
          }, d.setPlugins(m.plugins), await createWorksheets(d, m, n), d.element.appendChild(d.contextMenu), jSuites.contextmenu(d.contextMenu, { onclick: function() {
            d.contextMenu.contextmenu.close(!1);
          } }), d.config.fullscreen == 1 && d.element.classList.add("fullscreen"), toolbar.ll.call(d), m.root ? setEvents(m.root) : setEvents(document), n.spreadsheet = d, d;
        }, factory.worksheet = function(n, m, s) {
          let d = { parent: n, options: {} };
          return s === void 0 ? n.worksheets.push(d) : n.worksheets.splice(s, 0, d), Object.assign(d.options, m), d;
        };
        var utils_factory = factory;
        libraryBase.jspreadsheet = function(n, m) {
          try {
            let s = [];
            return utils_factory.spreadsheet(n, m, s).then(((d) => {
              libraryBase.jspreadsheet.spreadsheet.push(d), dispatch.A.call(d, "onload", d);
            })), s;
          } catch (s) {
            console.error(s);
          }
        }, libraryBase.jspreadsheet.getWorksheetInstanceByName = function(n, m) {
          const s = libraryBase.jspreadsheet.spreadsheet.find(((d) => d.config.namespace === m));
          if (s) return {};
          if (n == null) {
            const d = s.worksheets.map(((k) => [k.options.worksheetName, k]));
            return Object.fromEntries(d);
          }
          return s.worksheets.find(((d) => d.options.worksheetName === n));
        }, libraryBase.jspreadsheet.setDictionary = function(n) {
          jSuites.setDictionary(n);
        }, libraryBase.jspreadsheet.destroy = function(n, m) {
          if (n.spreadsheet) {
            const s = libraryBase.jspreadsheet.spreadsheet.indexOf(n.spreadsheet);
            libraryBase.jspreadsheet.spreadsheet.splice(s, 1);
            const d = n.spreadsheet.config.root || document;
            n.spreadsheet = null, n.innerHTML = "", m && destroyEvents(d);
          }
        }, libraryBase.jspreadsheet.destroyAll = function() {
          for (let n = 0; n < libraryBase.jspreadsheet.spreadsheet.length; n++) {
            const m = libraryBase.jspreadsheet.spreadsheet[n];
            libraryBase.jspreadsheet.destroy(m.element);
          }
        }, libraryBase.jspreadsheet.current = null, libraryBase.jspreadsheet.spreadsheet = [], libraryBase.jspreadsheet.helpers = {}, libraryBase.jspreadsheet.version = function() {
          return version;
        }, Object.entries(helpers).forEach((([n, m]) => {
          libraryBase.jspreadsheet.helpers[n] = m;
        }));
        var src = libraryBase.jspreadsheet;
        jspreadsheet = __webpack_exports__.default;
      })(), jspreadsheet;
    }));
  })(dist$3)), dist$3.exports;
}
var distExports = requireDist();
const jspreadsheet = /* @__PURE__ */ getDefaultExportFromCjs(distExports);
function updateEncode() {
  var n = document.getElementById("assemblyString").value, m = encodeInstruction({ assemblyString: n });
  document.getElementById("result").innerHTML = "Encoded result: " + m.binary.slice(2);
}
function updateDecode() {
  var n = document.getElementById("encodedvalue").value;
  n = parseInt(n, 2);
  var m = decodeInstruction({ value: n });
  document.getElementById("result").innerHTML = "Decoded result: " + JSON.stringify(m, null, 2);
}
function updatePruned() {
  for (var n = [], m = {}, s = document.getElementsByClassName("bit-button"), d = 0; d < s.length; d++) {
    var k = s[d].textContent, j = k === "1" ? "1" : k === "0" ? "0" : "-";
    n.push(j);
  }
  m = pruneInstructions({ constraints: n });
  var { tabulatedData: z, generatedColumns: B } = tableEncoder({
    prunedInstructions: m
  });
  document.getElementById("spreadsheet").innerHTML = "", jspreadsheet(document.getElementById("spreadsheet"), {
    data: z,
    columns: B
  });
}
let sliderules$1 = {
  loadInto: (n) => {
    document.getElementById(n).append(
      Encoder(),
      Decoder(),
      Pruner(),
      _div({ id: "result" }),
      // No need for each interface to have its own result div. This will be substituted by the visualization by Siyu.
      _div({ id: "spreadsheet" })
    );
  },
  updateEncode,
  updateDecode,
  updatePruned
};
window.sliderules = sliderules$1;
export {
  sliderules$1 as default
};
