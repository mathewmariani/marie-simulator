app.service('cpu', ['opcodes', 'memory', 'register_int8', 'register_int12', 'register_int16', function(opcodes, memory, reg8, reg12, reg16) {
  var cpu = {
    reset: function() {
      var self = this;

      self.AC = new reg16();
      self.IR = new reg16();
      self.MBR = new reg16();
      self.PC = new reg12();
      self.MAR = new reg12();
      self.InREG = new reg8();
      self.OutREG = new reg8();

      // all outputs
      self.outputs = [];

      self.interrupt = false;
      self.fault = false;
      self.halt = false;
    },

    settle: function(value) {
      var self = this;

      self.InREG.write(value);
      self.AC.write(self.InREG.read());
      self.interrupt = false;
    },

    step: function() {
      var self = this;
      if (self.fault === true) {
        throw "FAULT. Reassemble to continue.";
      }

      try {

        // load current instruction into IR and advance PC
        self.IR.write(memory.read(self.PC.read()));
        self.PC.write(self.PC.read() + 1);

        var opcode = ((self.IR.read() >> 12) & 0xF);
        var address = (self.IR.read() & 0xFFF);

        switch (opcode) {
        case opcodes.JNS:
          // MBR      <-- PC
          // MAR      <-- X
          // M[MAR]   <-- MBR
          // MBR      <-- X
          // AC       <-- 1
          // AC       <-- AC + MBR
          // PC       <-- AC
          self.MBR.write(self.PC.read());
          self.MAR.write(address);
          memory.write(self.MAR.read(), self.MBR.read());
          self.MBR.write(address);
          self.AC.write(1 + self.MBR.read());
          self.PC.write(self.AC.read());
          break;
        case opcodes.LOAD:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // AC       <-- MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.AC.write(self.MBR.read());
          break;
        case opcodes.STORE:
          // MAR      <-- X
          // MBR      <-- AC
          // M[MAR]   <-- MBR
          self.MAR.write(address);
          self.MBR.write(self.AC.read());
          memory.write(self.MAR.read(), self.MBR.read());
          break;
        case opcodes.ADD:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // AC       <-- AC + MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.AC.write(self.AC.read() + self.MBR.read());
          break;
        case opcodes.SUBT:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // AC       <-- AC - MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.AC.write(self.AC.read() - self.MBR.read());
          break;
        case opcodes.INPUT:
          self.interrupt = true;
          throw "Machine interrupted. Waiting for input.";
          break;
        case opcodes.OUTPUT:
          self.OutREG.write(self.AC.read());

          // just so we can see all our outputs
          self.outputs.push(self.OutREG.read());
          break;
        case opcodes.HALT:
          self.halt = true;
          throw "Machine halted normarly.";
        case opcodes.SKIPCOND:

          // 0000 [00]00 0000 0000
          // significant bits

          //      0000 0000 0000 0000
          // &    0000 1100 0000 0000 (0xC00)

          // 0000 [00]00 0000 0000 (0x000)
          // 0000 [01]00 0000 0000 (0x400)
          // 0000 [10]00 0000 0000 (0x800)

          // if IR[11-10] == 00 then
          //      IF AC < 0 then PC <-- PC + 1
          // else if IR[11-10] == 01 then
          //      IF AC = 0 then PC <-- PC + 1
          // else if IR[11-10] == 10 then
          //      IF AC > 0 then PC <-- PC + 1

          var sig = (self.IR.read() & 0xC00);
          if ((sig == 0x000)&&(self.AC.read() < 0)) {
            self.PC.write(self.PC.read() + 1);
          } else if ((sig == 0x400)&&(self.AC.read() == 0)) {
            self.PC.write(self.PC.read() + 1);
          } else if ((sig == 0x800)&&(self.AC.read() > 0)) {
            self.PC.write(self.PC.read() + 1);
          }

          break;
        case opcodes.JUMP:
          // PC       <-- IR[11-0]
          self.PC.write(self.IR.read() & 0xFFF);
          break;
        case opcodes.CLEAR:
          // AC       <-- 0
          self.AC.write(0);
          break;
        case opcodes.ADDI:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // MAR      <-- MBR
          // MBR      <-- M[MAR]
          // AC       <-- AC + MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.MAR.write(self.MBR.read());
          self.MBR.write(memory.read(self.MAR.read()));
          self.AC.write(self.AC.read() + self.MBR.read());
          break;
        case opcodes.JUMPI:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // PC       <-- MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.PC.write(self.MBR.read());
          break;
        case opcodes.LOADI:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // MAR      <-- MBR
          // MBR      <-- M[MAR]
          // AC       <-- MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.MAR.write(self.MBR.read());
          self.MBR.write(memory.read(self.MAR.read()));
          self.AC.write(self.MBR.read());
          break;
        case opcodes.STOREI:
          // MAR      <-- X
          // MBR      <-- M[MAR]
          // MAR      <-- MBR
          // MBR      <-- AC
          // M[MAR]   <-- MBR
          self.MAR.write(address);
          self.MBR.write(memory.read(self.MAR.read()));
          self.MAR.write(self.MBR.read());
          self.MBR.write(self.AC.read());
          memory.write(self.MAR.read(), self.MBR.read());
          break;
        case opcodes.DEC:
        case opcodes.OCT:
        case opcodes.HEX:
        case opcodes.ORG:
        case opcodes.END:
          break;
        default:
          throw "Invalid op code: " + opcode;
        }
        return true;
      } catch (e) {
        throw e;
      }
    }
  }

  cpu.reset();
  return cpu;
}]);
