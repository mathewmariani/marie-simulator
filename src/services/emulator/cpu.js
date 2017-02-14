(function (angular) {
  'use strict';
  angular.module('MarieSimulator')
    .service('cpu', ['opcodes', 'memory', function(opcodes, memory) {
    var service = {};

    service.reset = function() {
      // registers
      this.ac = 0x0;
      this.ir = 0x0;
      this.mbr = 0x0;
      this.pc = 0x0;
      this.mar = 0x0;
      this.inreg = 0x0;
      this.outreg = 0x0;

      // all outputs
      this.outputs = [];

      this.interrupt = false;
      this.halt = false;
    }

    service.settle = function(value) {
      this.inreg = ((value >>> 0) & 0xFF);
      this.ac = ((this.inreg >>> 0) & 0xFFFF);
      this.interrupt = false;
    }

    service.fetch = function() {
      this.mar = ((this.pc >>> 0) & 0xFFF);
      this.ir = ((memory.read(this.pc) >>> 0) & 0xFFFF);
      this.pc = (((this.pc + 1) >>> 0) & 0xFFF);
    }

    service.execute = function() {
      var opcode = ((this.ir >> 12) & 0xF);
      var address = (this.ir & 0xFFF);

      switch (opcode) {
      case opcodes.JNS.opcode:
				// MBR 			← PC
				// MAR 			← X
				// M[MAR] 	← MBR
				// MBR 			← X
				// AC 			← 1
				// AC 			← AC + MBR
				// PC				← AC
				this.mbr = ((this.pc >>> 0) & 0xFFFF);
				this.mar = ((address >>> 0) & 0xFFF);
				memory.write(this.mar, this.mbr);
        this.mbr = ((address >>> 0) & 0xFFFF);
				this.ac = ((1 >>> 0) & 0xFFFF);
        this.ac = (((this.ac + this.mbr) >>> 0) & 0xFFFF);
        this.pc = ((this.ac >>> 0) & 0xFFF);
        break;
      case opcodes.LOAD.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // AC       ← MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.ac = ((this.mbr >>> 0) & 0xFFFF);
        break;
      case opcodes.STORE.opcode:
        // MAR      ← X
        // MBR      ← AC
        // M[MAR]   ← MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((this.ac >>> 0) & 0xFFFF);
        memory.write(this.mar, this.mbr);
        break;
      case opcodes.ADD.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // AC       ← AC + MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.ac = (((this.ac + this.mbr) >>> 0) & 0xFFFF);
        break;
      case opcodes.SUBT.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // AC       ← AC - MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.ac = (((this.ac - this.mbr) >>> 0) & 0xFFFF);
        break;
      case opcodes.INPUT.opcode:
        this.interrupt = true;
				throw "Machine waiting for interrupt to be settled.";
        break;
      case opcodes.OUTPUT.opcode:
        this.outreg = ((this.ac >>> 0) & 0xFF);

        // just so we can see all our outputs
        this.outputs.push(this.outreg);
        break;
      case opcodes.HALT.opcode:
        this.halt = true;
				throw "Machine halted normally.";
        break;
      case opcodes.SKIPCOND.opcode:

        // 0000 [00]00 0000 0000
        // significant bits

        //      0000 0000 0000 0000
        // &    0000 1100 0000 0000 (0xC00)

        // 0000 [00]00 0000 0000 (0x000)
        // 0000 [01]00 0000 0000 (0x400)
        // 0000 [10]00 0000 0000 (0x800)

        // if IR[11-10] == 00 then
        //      IF AC < 0 then PC ← PC + 1
        // else if IR[11-10] == 01 then
        //      IF AC = 0 then PC ← PC + 1
        // else if IR[11-10] == 10 then
        //      IF AC > 0 then PC ← PC + 1

        var sig = (this.ir & 0xC00);
				var val = (this.ac > 0x7FFF) ? this.ac - 0x10000 : this.ac;
				// console.log ("sig: "+sig);
				// console.log ("ac:  "+this.ac);
        if ((sig == 0x000)&&(val < 0)) {
					console.log ("skip 0x000");
          this.pc = (((this.pc + 1) >>> 0) & 0xFFF);
        } else if ((sig == 0x400)&&(val == 0)) {
					console.log ("skip 0x400");
          this.pc = (((this.pc + 1) >>> 0) & 0xFFF);
        } else if ((sig == 0x800)&&(val > 0)) {
					console.log ("skip 0x800");
          this.pc = (((this.pc + 1) >>> 0) & 0xFFF);
        }

        break;
      case opcodes.JUMP.opcode:
        // PC       ← IR[11-0]
        this.pc = (((this.ir) >>> 0) & 0xFFF);
        break;
      case opcodes.CLEAR.opcode:
        // AC       ← 0
        this.ac = ((0 >>> 0) & 0xFFFF);
        break;
      case opcodes.ADDI.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // MAR      ← MBR
        // MBR      ← M[MAR]
        // AC       ← AC + MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.mar = ((this.mbr >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.ac = (((this.ac + this.mbr) >>> 0) & 0xFFFF);
        break;
      case opcodes.JUMPI.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // PC       ← MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.pc = (((this.mbr) >>> 0) & 0xFFF);
        break;
      case opcodes.LOADI.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // MAR      ← MBR
        // MBR      ← M[MAR]
        // AC       ← MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.mar = ((this.mbr >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.ac = ((this.mbr >>> 0) & 0xFFFF);
        break;
      case opcodes.STOREI.opcode:
        // MAR      ← X
        // MBR      ← M[MAR]
        // MAR      ← MBR
        // MBR      ← AC
        // M[MAR]   ← MBR
        this.mar = ((address >>> 0) & 0xFFF);
        this.mbr = ((memory.read(this.mar) >>> 0) & 0xFFFF);
        this.mar = ((this.mbr >>> 0) & 0xFFF);
        this.mbr = ((this.ac >>> 0) & 0xFFFF);
        memory.write(this.mar, this.mbr);
        break;
      case opcodes.DEC.opcode:
      case opcodes.OCT.opcode:
      case opcodes.HEX.opcode:
      case opcodes.ORG.opcode:
      case opcodes.END.opcode:
        break;
      }

      // return (!(this.halt || this.interrupt));
    }

    service.reset();
    return service;
  }]);
} (window.angular));
