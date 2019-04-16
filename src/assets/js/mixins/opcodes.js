const opcodes = {
	data: function () {
		return {
			opcodes: {
				JNS: { opcode: 0x0, operand: true, base: undefined },
				LOAD: { opcode: 0x1, operand: true, base: undefined },
				STORE: { opcode: 0x2, operand: true, base: undefined },
				ADD: { opcode: 0x3, operand: true, base: undefined },
				SUBT: { opcode: 0x4, operand: true, base: undefined },
				INPUT: { opcode: 0x5, operand: false, base: undefined },
				OUTPUT: { opcode: 0x6, operand: false, base: undefined },
				HALT: { opcode: 0x7, operand: false, base: undefined },
				SKIPCOND: { opcode: 0x8, operand: true, base: undefined },
				JUMP: { opcode: 0x9, operand: true, base: undefined },
				CLEAR: { opcode: 0xA, operand: false, base: undefined },

				ADDI: { opcode: 0xB, operand: true, base: undefined },
				JUMPI: { opcode: 0xC, operand: true, base: undefined },
				LOADI: { opcode: 0xD, operand: true, base: undefined },
				STOREI: { opcode: 0xE, operand: true, base: undefined },

				DEC: { opcode: -1, operand: true, base: 10 },
				OCT: { opcode: -2, operand: true, base: 8 },
				HEX: { opcode: -3, operand: true, base: 16 },
				ORG: { opcode: -4, operand: true, base: 16 },
				END: { opcode: -5, operand: false, base: undefined }
			}
		}
	}
}