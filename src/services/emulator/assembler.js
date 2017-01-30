angular.module('MarieSimulator')
  .service('assembler', ['opcodes', function(opcodes) {
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
        "ORiGination directive must be first noncomment line of program.",  // 0
        "A label cannot have 0..9 as its beginning character.",             // 1
        "Statement label must be unique.",                                  // 2
        "Instruction not recognized.",                                      // 3
        "Missing instruction.",                                             // 4
        "Missing operand.",                                                 // 5
        "Hex address literal out of range 0 to 0FFF allowable.",            // 6
        "Invalid decimal value: -32768 to 32767 allowable.",                // 7
        "Invalid octal value: 0 to 177777 allowable.",                      // 8
        "Invalid hexadecimal value: 0 to FFFF allowable.",                  // 9
        "Operand undefined.",                                               // 10
        "Maximum source lines exceeded. Assembly halted.",                  // 11
        "Maximum line number exceeded. Assembly halted."                    // 12
      ];

      // returned values
      var source = input;       // untouched source
      var instructions = [];    // seperated instructions
      var hexcodes = [];        // hexcodes
      var errors = [];          // errors

      // this is the current line the assembler is using
      var currentAssembledLine = undefined;
      var labels = [];

      var endFlag = false;

      var setError = function(id) {
        errors.push({
          msg: errorMessages[id],
          line: currentAssembledLine["address"]
        });
      };

      var addLabel = function(symbol) {
        if (!isNaN(symbol.charAt(0))) {
          setError(1);
        }

        if (symbol in labels) {
          setError(2);
        } else {
          labels[symbol] = instructions.length;
        }
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

      var parseLine = function(str) {
        var assembledLine = {};

        // find the commment and remove it
        var n = str.indexOf(COMMENT_DELIMITER);
        if (n >= 0) {
          str = str.substring(0, n);
        }

        str = str.trim();
        if (!str || 0 === str.length) {
          return;
        }

        // [1]LABEL, [2]OPCODE [3]OPERAND
        var interpreter = regexInterpreter.exec(str);

        var currentLine = {};
        currentLine["address"] = instructions.length;
        currentLine["label"] = interpreter[GROUP_LABEL];
        currentLine["opcode"] = interpreter[GROUP_OPCODE].toUpperCase();
        currentLine["operand"] = interpreter[GROUP_OPERAND];
        currentLine["hexcode"] = 0;


        if (interpreter[GROUP_LABEL]) {
          addLabel(interpreter[GROUP_LABEL]);
        }

        instructions.push(currentLine);
        if (instructions.length > MAX_ADDRESS) {
          throw errorMessages[12];
        }
      };

      // split the lines
      lines = input.split('\n');

      // first pass O(n)
      for(var i = 0; i < lines.length; ++i) {
        parseLine(lines[i]);

        // end opcode was found
        if (endFlag) {
          break;
        }
      }

      var getLabelAddress = function(symbol) {
        var result = undefined;
        if (symbol in labels) {
          result = labels[symbol];
        } else {
          setError(10);
        }

        return result;
      };

      var getOpcode = function() {
        var ref, value, instruction;
        instruction = currentAssembledLine["opcode"];
        if (instruction in opcodes) {
          ref = opcodes[instruction];
          if (ref == opcodes.ORG && currentAssembledLine["address"] > 0) {
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

      var getOperand = function() {
        var opcode, operand, result;
        opcode = opcodes[currentAssembledLine["opcode"]];
        operand = currentAssembledLine["operand"];
        result = undefined;

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
                  result = parseInt(operand, 16);;
                } else {
                  setError(9);
                }
              } else {
                // assume its a label
                result = getLabelAddress(operand);
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
            result = 0;
            break;
        }

        return result;
      };

      // second pass
      for (var i = 0; i < instructions.length; ++i) {
        currentAssembledLine = instructions[i];

        var opcode, operand, hexcode;
        opcode = getOpcode();
        operand = getOperand();

        // calculate hex code
        hexcode = 0;
        hexcode |= opcode;
        hexcode <<= 12;
        hexcode |= operand;

        instructions[i].hexcode = hexcode;
        hexcodes.push(hexcode);
      }

      return {
        source: source,
        instructions: instructions,
        hexcodes: hexcodes,
        errors: errors
      };
    }
  };
}]);
