const cpu = {
	methods: {
		settle: function (value) {
			this.registers.inreg = ((value >>> 0) & 0xFF)
			this.registers.mar = this.registers.inreg
			this.registers.ac = ((this.registers.mar >>> 0) & 0xFFFF)
			this.machine.interrupt = false
		},
		fetch: function () {
			this.registers.mar = ((this.registers.pc >>> 0) & 0xFFF)
			this.registers.ir = ((this.read(this.registers.pc) >>> 0) & 0xFFFF)
			this.registers.pc = (((this.registers.pc + 1) >>> 0) & 0xFFF)
		},
		execute: function () {
			var opcode = ((this.registers.ir >> 12) & 0xF)
			var address = (this.registers.ir & 0xFFF)
			switch (opcode) {
			case this.opcodes.JNS.opcode:
				// MBR 		← PC
				// MAR 		← X
				// M[MAR]	← MBR
				// MBR 		← X
				// AC 		← 1
				// AC 		← AC + MBR
				// PC		← AC
				this.registers.mbr = ((this.registers.pc >>> 0) & 0xFFFF)
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.write(this.registers.mar, this.registers.mbr)
				this.registers.mbr = ((address >>> 0) & 0xFFFF)
				this.registers.ac = ((1 >>> 0) & 0xFFFF)
				this.registers.ac = (((this.registers.ac + this.registers.mbr) >>> 0) & 0xFFFF)
				this.registers.pc = ((this.registers.ac >>> 0) & 0xFFF)
				break
			case this.opcodes.LOAD.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// AC		← MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.ac = ((this.registers.mbr >>> 0) & 0xFFFF)
				break
			case this.opcodes.STORE.opcode:
				// MAR		← X
				// MBR		← AC
				// M[MAR]	← MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.registers.ac >>> 0) & 0xFFFF)
				this.write(this.registers.mar, this.registers.mbr)
				break
			case this.opcodes.ADD.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// AC		← AC + MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.ac = (((this.registers.ac + this.registers.mbr) >>> 0) & 0xFFFF)
				break
			case this.opcodes.SUBT.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// AC		← AC - MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.ac = (((this.registers.ac - this.registers.mbr) >>> 0) & 0xFFFF)
				break
			case this.opcodes.INPUT.opcode:
				this.machine.interrupt = true
				throw "Machine waiting for interrupt to be settled."
				break
			case this.opcodes.OUTPUT.opcode:
				this.registers.outreg = ((this.registers.ac >>> 0) & 0xFF)
				// this.machine.outputs.push(this.registers.outreg)
				this.$set(this.machine.outputs, this.machine.outputs.length, this.registers.outreg)
				break
			case this.opcodes.HALT.opcode:
				this.machine.halt = true
				throw "Machine halted normally."
				break
			case this.opcodes.SKIPCOND.opcode:
				//	0000 [00]00 0000 0000
				//	significant bits

				//		0000 0000 0000 0000
				//	&	0000 1100 0000 0000 (0xC00)

				// 0000 [00]00 0000 0000 (0x000)
				// 0000 [01]00 0000 0000 (0x400)
				// 0000 [10]00 0000 0000 (0x800)

				//	if IR[11-10] == 00 then
				//		IF AC < 0 then PC ← PC + 1
				//	else if IR[11-10] == 01 then
				//		IF AC = 0 then PC ← PC + 1
				//	else if IR[11-10] == 10 then
				//		IF AC > 0 then PC ← PC + 1

				var sig = (this.registers.ir & 0xC00)
				var val = (this.registers.ac > 0x7FFF) ? this.registers.ac - 0x10000 : this.registers.ac

				if ((sig == 0x000)&&(val < 0)) {
					this.registers.pc = (((this.registers.pc + 1) >>> 0) & 0xFFF)
				} else if ((sig == 0x400)&&(val == 0)) {
					this.registers.pc = (((this.registers.pc + 1) >>> 0) & 0xFFF)
				} else if ((sig == 0x800)&&(val > 0)) {
					this.registers.pc = (((this.registers.pc + 1) >>> 0) & 0xFFF)
				}

				break
			case this.opcodes.JUMP.opcode:
				// PC		← IR[11-0]
				this.registers.pc = (((this.registers.ir) >>> 0) & 0xFFF)
				break
			case this.opcodes.CLEAR.opcode:
				// AC		← 0
				this.registers.ac = ((0 >>> 0) & 0xFFFF)
				break
			case this.opcodes.ADDI.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// MAR		← MBR
				// MBR		← M[MAR]
				// AC		← AC + MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.mar = ((this.registers.mbr >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.ac = (((this.registers.ac + this.registers.mbr) >>> 0) & 0xFFFF)
				break
			case this.opcodes.JUMPI.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// PC		← MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.pc = (((this.registers.mbr) >>> 0) & 0xFFF)
				break
			case this.opcodes.LOADI.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// MAR		← MBR
				// MBR		← M[MAR]
				// AC		← MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.mar = ((this.registers.mbr >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.ac = ((this.registers.mbr >>> 0) & 0xFFFF)
				break
			case this.opcodes.STOREI.opcode:
				// MAR		← X
				// MBR		← M[MAR]
				// MAR		← MBR
				// MBR		← AC
				// M[MAR]	← MBR
				this.registers.mar = ((address >>> 0) & 0xFFF)
				this.registers.mbr = ((this.read(this.registers.mar) >>> 0) & 0xFFFF)
				this.registers.mar = ((this.registers.mbr >>> 0) & 0xFFF)
				this.registers.mbr = ((this.registers.ac >>> 0) & 0xFFFF)
				this.write(this.registers.mar, this.registers.mbr)
				break
			case this.opcodes.DEC.opcode:
			case this.opcodes.OCT.opcode:
			case this.opcodes.HEX.opcode:
			case this.opcodes.ORG.opcode:
			case this.opcodes.END.opcode:
				break
			}
		}
	}
}