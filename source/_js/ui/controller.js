app.controller('Ctrl', ['$document', '$scope', '$timeout', '$log', 'cpu', 'memory', 'assembler', function($document, $scope, $timeout, $log, cpu, memory, assembler) {

  // machine
  $scope.memory = memory;
  $scope.cpu = cpu;

  // status
  $scope.status_message = "Ready to load program instructions.";

  // assembly variables
  $scope.assembly = [];
  $scope.assembly_successful = false;
  $scope.assembly_errors = false;

  // memory variables
  $scope.programLoaded = false;

  // cpu variables
  $scope.halted = false;

  // current 'sample' program
  $scope.code = "LOAD X\nADD Y\nOUTPUT\nHALT\nX, DEC 0\nY, DEC 1";

  // reset the machine
  $scope.reset = function() {
    $scope.memory.reset();
    $scope.cpu.reset();

    $scope.isRunning = false;
    $scope.programLoaded = false;
    $scope.assembly_errors = [];

    $scope.status_message = "Ready to load program instructions.";
  };

  // assemble the program, and load the instructions into memory
  $scope.assemble = function() {
    try {
      $scope.reset();

      var assembly = assembler.assemble($scope.code);

      $scope.assembly_successful = !assembly.failed;
      if (assembly.failed) {
        $scope.assembly_errors = assembly.errors;
        return;
      }

      $scope.assembly = assembly.assembled;

      // place all instructions into memory
      for (var i = 0, l = assembly.instructions.length; i < l; i++) {
        memory.data[i] = assembly.instructions[i];
      }

      // we've reassembled, so reset some values/
      $scope.halted = false;
      $scope.programLoaded = true;

    } catch (e) {
      // assembly halted
      $scope.assembly_errors = assembly.errors;
      $scope.assembly_successful = false;
      $scope.programLoaded = false;
    }
  };


  $scope.stepForward = function() {
    if (!$scope.programLoaded) {
      return;
    }

    $scope.status_message = "Press [Step Forward] to continue.";
    $scope.executeStep();
  };

  // execute a single instruction
  $scope.executeStep = function() {
    try {
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

    $scope.isRunning = true;
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
