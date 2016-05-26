app.service('assembler', ['opcodes', function(opcodes) {
  return {
    assemble: function(input) {
      // [1]LABEL, [2]OPCODE [3]OPERAND /[4]COMMENT
      var regexInterpreter = /^[\s]?(?:(\w*)[,])?[\s]*(?:(\w*))?[\s]*(?:(\w*))?/;

      var GROUP_LABEL = 1;
      var GROUP_OPCODE = 2;
      var GROUP_OPERAND = 3;
      var GROUP_COMMENT = 4;

      var MAX_ADDRESS = 4095;   // 2^12 [0000 0000] = 4095
      var MAX_INT = 32767;
      var MIN_INT = -32768;
      var DEC = -1;
      var OCT = -2;
      var HEX = -3;
      var ORG = -4;
      var END = -5;

      var COMMENT_DELIMITER = '/';

      var errorMessages = [
          "ORiGination directive must be first noncomment line of program.",
          "A label cannot have 0..9 as its beginning character.",
          "Statement label must be unique.",
          "Instruction not recognized.",
          "Missing instruction.",
          "Missing operand.",
          "Hex address literal out of range 0 to 0FFF allowable.",
          "Invalid decimal value: -32768 to 32767 allowable.",
          "Invalid octal value: 0 to 177777 allowable.",
          "Invalid hexadecimal value: 0 to FFFF allowable.",
          "Operand undefined.",
          "Maximum source lines exceeded. Assembly halted.",
          "Maximum line number exceeded. Assembly halted."
      ];

      var CODE = [];
      var LABELS = [];

      var ASSEMBLED = [];
      var INSTRUCTIONS = [];
      var ERROR_LIST = [];
      var FAULTY = false;

      var currentLine = 0;
      var endFlag = false;
      var currentAssembledLine = undefined;

      var setError = function(id) {
        FAULTY = true;
        ERROR_LIST.push({
          msg: errorMessages[id],
          line: currentLine
        });
      };

      var addLabel = function(symbol) {
        if (!isNaN(symbol.charAt(0))) {
           setError(1);
        }

        if (symbol in LABELS) {
          setError(2);
        } else {
          LABELS[symbol] = ASSEMBLED.length;
        }
      };

      var getOpcode = function(instruction) {
        var ref, value;
        if (instruction in opcodes) {
          ref = opcodes[instruction];
          if (ref == opcodes.ORG && currentLine > 0) {
            setError(0);
          }

          if (ref == opcodes.END) {
            endFlag = true;
          }

          if (ref < 0) {
            ref = 0;
          }

        } else {
          setError(3);
        }

        return ref;
      };

      var isValidValue = function(value) {
        return ((value <= MAX_INT)&&(value >= MIN_INT));
      };

      var literalToDecimal = function(type, value) {
        var result = 0;
        switch (type) {
          case DEC:
            result = parseInt(value, 10);
            if (!isValidValue(result)) {
              setError(7);
              result = 0;
            }
            break;
          case OCT:
            result = parseInt(value, 8);
            if (!isValidValue(result)) {
              setError(8);
              result = 0;
            }
            break;
          case HEX:
            result = parseInt(value, 16);
            if (!isValidValue(result)) {
              setError(9);
              result = 0;
            }
            break;
          case ORG:
            result = parseInt(value, 16);
            if (!isValidValue(result)) {
              setError(6);
              result = 0;
            }
            break;
          case END:
            result = 0;
            break;
        }

        return parseInt(result);
      };

      // reads labels that can be legal hex values
      var getOperand = function(opcode, operand) {
        opcode = opcodes[opcode];
        var result = undefined;

        switch(opcode) {
          // needs operand, could be label though so watch out
          case opcodes.JNS:
          case opcodes.LOAD:
          case opcodes.STORE:
          case opcodes.ADD:
          case opcodes.SUBT:
          case opcodes.ADDI:
          case opcodes.JUMPI:
          case opcodes.LOADI:
          case opcodes.STOREI:
          case opcodes.SKIPCOND:
          case opcodes.JUMP:
            if (operand !== undefined) {
              var value = parseInt(operand);
              if (!isNaN(value)) {
                if (isValidValue(value)) {
                  result = value;
                } else {
                  setError(9);
                }
              } else {
                // assume its a label
                result = operand;
              }
            } else {
              setError(10);
            }
            break;

          // special case operand
          case opcodes.DEC:
          case opcodes.OCT:
          case opcodes.HEX:
            if (operand) {
              result = literalToDecimal(opcode, operand);
            } else {
              setError(10);
            }
            break;

          // dont require operand
          case opcodes.ORG:
          case opcodes.END:
          case opcodes.INPUT:
          case opcodes.OUTPUT:
          case opcodes.HALT:
          case opcodes.CLEAR:
            result = undefined;
            break;
        }

        return result;
      };

      var parseLine = function(str) {
        var assembledLine = {};

        // find commment, and remove it
        var n = str.indexOf(COMMENT_DELIMITER);
        if (n >= 0) {
          str = str.substring(0, n);
        }

        str = str.trim();
        if (!str || 0 === str.length) {
          return;
        }

        // NOTE: in a later version I would like to
        // be able to store the currentAssembledLine
        // and have the functions edit the hexcode as they see fit
        // all the extra information would be used for saving.

        // [1]LABEL, [2]OPCODE [3]OPERAND
        var interpreter = regexInterpreter.exec(str);
        assembledLine["line"] = currentLine;
        assembledLine["address"] = ASSEMBLED.length;
        assembledLine["label"] = interpreter[GROUP_LABEL];
        assembledLine["opcode"] = getOpcode(interpreter[GROUP_OPCODE].toUpperCase());

        // FIXME: this is just a hack for the meantime
        assembledLine["op"] = interpreter[GROUP_OPCODE].toUpperCase();

        assembledLine["operand"] = getOperand(interpreter[GROUP_OPCODE], interpreter[GROUP_OPERAND]);
        assembledLine["hexcode"] = undefined;

        // add label
        if (interpreter[GROUP_LABEL]) {
          addLabel(assembledLine.label);
        }

        ASSEMBLED.push(assembledLine);
        if (ASSEMBLED.length > MAX_ADDRESS) {
          throw errorMessages[12];
        }
      };

      // split the lines
      lines = input.split('\n');

      // first pass O(n)
      for(var i = 0; i < lines.length; ++i) {
        currentLine = i;
        parseLine(lines[i]);

        // end opcode was found
        if (endFlag) {
          break;
        }
      }

      var getLabelAddress = function(symbol) {
        var result = undefined;
        if (symbol in LABELS) {
          result = LABELS[symbol];
        } else {
          setError(10);
        }

        return result;
      };

      // second pass O(n)
      for (var i = 0; i < ASSEMBLED.length; ++i) {
        currentLine = i;
        var opcode = ASSEMBLED[currentLine].opcode;
        var operand = ASSEMBLED[currentLine].operand;

        if (typeof operand === "string") {
          operand = getLabelAddress(operand);
        }

        // for some reason the hexcodes dont work as intented
        var hexcode = undefined;
        hexcode |= opcode;
        hexcode <<= 12;
        hexcode |= operand;

        ASSEMBLED[i].hexcode = hexcode;
        INSTRUCTIONS.push(hexcode);
      }

      console.log (ASSEMBLED);

      return {
        assembled: ASSEMBLED,
        instructions: INSTRUCTIONS,
        errors: ERROR_LIST,
        failed: FAULTY
      };
    }
  };
}]);
