app.controller('Ctrl', ['$document', '$scope', '$timeout', '$log', 'cpu', 'memory', 'assembler', function($document, $scope, $timeout, $log, cpu, memory, assembler) {

  // machine
  $scope.memory = memory;
  $scope.cpu = cpu;
  $scope.assembly = [];

  // status
  $scope.status_message = "Ready to load program instructions.";

  // memory variables
  $scope.programLoaded = false;
  $scope.currentAddress = undefined;

  // cpu variables
  $scope.halted = false;

  // current 'sample' program
  $scope.code = "ORG\nLOAD X\nADD Y\nOUTPUT\nHALT\nX, DEC 0\nY, DEC 1";

  // reset the machine
  $scope.reset = function() {
    $scope.memory.reset();
    $scope.cpu.reset();
    $scope.assembly = [];

    // machine
    $scope.programLoaded = false;
    $scope.currentAddress = undefined;
    $scope.halted = false;
    $scope.status_message = "Ready to load program instructions.";
  };

  // FIXME: this needs to be re-programmed
  // assemble the program, and load the instructions into memory
  $scope.assemble = function() {
    try {
      $scope.reset();
      $scope.assembly = assembler.assemble($scope.code);

      // if we have some errors don't continue assembling
      if ($scope.assembly.errors.length > 0) {
        return;
      }

      // place all instructions into memory
      for (var i = 0, l = $scope.assembly.hexcodes.length; i < l; i++) {
        memory.data[i] = $scope.assembly.hexcodes[i];
      }

      // we've reassembled, so reset some values/
      $scope.halted = false;
      $scope.programLoaded = true;

    } catch (e) {
      // assembly halted
      console.error (e);
    }
  };


  $scope.stepForward = function() {
    if ($scope.programLoaded && $scope.executeStep()) {
      $scope.status_message = "Press [Step Forward] to continue.";
    }
  };

  // execute a single instruction
  $scope.executeStep = function() {
    try {
      if (cpu.halt) {
        return false;
      }

      // highlight current memory
      $scope.currentAddress = cpu.PC.read();

      return cpu.step();
    } catch (e) {
      $scope.status_message = e;
      return false;
    }
  };

  var tick;
  $scope.run = function() {
    if (!$scope.programLoaded) {
      $scope.assemble();
    }

    tick = $timeout(function () {
      if ($scope.executeStep()) {
        $scope.run();
      }
    }, 1000 / 4);
  };

  $scope.halt = function() {
    $timeout.cancel(tick);
    $scope.reset();
  };
}]);
