angular.module('MarieSimulator')
  .service('assembler', ['opcodes', function(opcodes) {
  return {
    assemble: function(input) {
      // [1]LABEL, [2]OPCODE [3]OPERAND /[4]COMMENT
      var regexInterpreter = /^[\s]?(?:(\w*)[,])?[\s]*(?:(\w*))?[\s]*(?:(-?\w*))?/;
      var marieRegex = /^[\s]?(?:(\w*)[,])?[\s]*(?:(\w*))?[\s]*(?:(-?\w*))?/;
      var whitespaceRegex = /^\s*(?:\/.*)?$/;
      var labelRegex = /^\d.*$/;
      var addressRegex = /^\d[0-9a-fA-F]*$/;

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

      // split the lines
      var lines = input.split('\n');
      var parsed = [];
      var origin = 0;
      var symbols = {};
			var errors = [];

      if (lines.length > MAX_ADDRESS) {
				// throw errorMessages;
				errors.push({ name: errorMessages, line: 0 });
      }

      // first pass
      for (var i = 0, l = lines.length; i < l; ++i) {
        var line = lines[i];

        if (/^\s*(?:\/.*)?$/.test(line))
          continue;

        // [1]LABEL, [2]OPCODE [3]OPERAND
        var interpreter = marieRegex.exec(line);

        // check for other instructions
        var label = interpreter[GROUP_LABEL];
        var opcode = interpreter[GROUP_OPCODE].toUpperCase();
        var operand = interpreter[GROUP_OPERAND];

        // check for originator
        if (opcode == "ORG") {
          if (parsed.length > 0) {
            // unexpected origination directive.
            // throw errorMessages[0];
						errors.push({ name: errorMessages[0], line: i });
          }

          if (!operand) {
						// throw errorMessages[5];
						errors.push({ name: errorMessages[5], line: i });
          }

          origin = parseInt(operand, 16);
          continue;
        }

        if (label) {
          // check for a valid label
          if (label.match(labelRegex)) {
            // throw errorMessages[1];
						errors.push({ name: errorMessages[1], line: i });
          }

          // check for unique labels
          if (label in symbols) {
						// throw errorMessages[2];
						errors.push({	name: errorMessages[2], line: i });
          }

          // add the symbol
          symbols[label] = parsed.length + origin;
        }

        // check for the end directive
        if (opcode == "END") {
          break;
        }

        // otherwise just push it
        parsed.push({
          address: parsed.length,
          label: label,
          opcode: opcode,
          operand: operand,
          line: (i + 1)
        });
      }

      if (parsed.length > MAX_ADDRESS) {
				errors.push({ name: errorMessages[12], line: MAX_ADDRESS });
      }

      // second pass
      for (var i = 0, l = parsed.length; i < l; i++) {
        var instruction = parsed[i];

        var directiveBase = undefined;
        switch (instruction.opcode) {
          case "DEC":
            directiveBase = 10;
            break;
          case "OCT":
            directiveBase = 8;
            break;
          case "HEX":
            directiveBase = 16;
            break;
        }

        // if this is a directive
        if (directiveBase) {

          // directives need operands
          if (!instruction.operand) {
            // throw errorMessages[5];
						errors.push({ name: errorMessages[5], line: instruction.line });
          }

          var literal = parseInt(instruction.operand, directiveBase);

					// needs to be a valid number
					if (isNaN(literal)) {
						// throw (directiveBase == 10) ?
            //   errorMessages[7] : (directiveBase == 8) ?
            //   errorMessages[8] : errorMessages[9];
						if (directiveBase == 10) {
							errors.push({ name: errorMessages[7], line: instruction.line });
						} else if (directiveBase == 8) {
							errors.push({ name: errorMessages[8], line: instruction.line });
						} else if (directiveBase == 16) {
							errors.push({ name: errorMessages[9], line: instruction.line });
						}
					}

          // check for the (min, max)
          if (MIN_INT > literal || literal > MAX_INT) {
            // throw (directiveBase == 10) ?
            //   errorMessages[7] : (directiveBase == 8) ?
            //   errorMessages[8] : errorMessages[9];
						if (directiveBase == 10) {
							errors.push({ name: errorMessages[7], line: instruction.line });
						} else if (directiveBase == 8) {
							errors.push({ name: errorMessages[8], line: instruction.line });
						} else if (directiveBase == 16) {
							errors.push({ name: errorMessages[9], line: instruction.line });
						}
          }

          // create our hexcode (just a literal)
          instruction.hexcode = literal;

          // check to see if we need an operand
          continue;
        }

        var opcode = opcodes[instruction.opcode];
        var operand = instruction.operand;

        // check for valid opcodes
        if (!opcode) {
          // throw errorMessages[3];
					errors.push({	name: errorMessages[3], line: instruction.line });

					// check to see if we need an operand
					continue;
        }

        // check to see if we need an operand
        if (opcode.operand && !operand) {
          // throw errorMessages[5];
					errors.push({ name: errorMessages[5], line: instruction.line });
        }

        // if we have an operand
        // we can only make it this far if we have one and need it
        if (operand) {

          // were either a hex address literal, or a symbol
          if (operand.match(addressRegex)) {
            operand = parseInt(operand, 16);
            if (operand > 0x0FFF) {
              // throw errorMessages[6];
							errors.push({ name: errorMessages[6], line: instruction.line });
            }
          } else {
            if (!(operand in symbols)) {
              // throw errorMessages[10];
							errors.push({ name: errorMessages[10], line: instruction.line });
            }

            operand = symbols[operand];
          }
        }

        // create hexcode
        instruction.hexcode = ((opcode.opcode << 12) | operand);
      }

      return {
        origin: origin,
        program: parsed,
        symbols: symbols,
				errors: errors
      };
    }
  };
}]);
