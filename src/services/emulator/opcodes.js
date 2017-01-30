angular.module('MarieSimulator')
  .service('opcodes', [function () {
  var opcodes = {
    JNS: 0,
    LOAD: 1,
    STORE: 2,
    ADD: 3,
    SUBT: 4,
    INPUT: 5,
    OUTPUT: 6,
    HALT: 7,
    SKIPCOND: 8,
    JUMP: 9,
    CLEAR: 10,

    ADDI: 11,
    JUMPI: 12,
    LOADI: 13,
    STOREI: 14,

    DEC: -1,
    OCT: -2,
    HEX: -3,
    ORG: -4,
    END: -5
  };

  return opcodes;
}]);
