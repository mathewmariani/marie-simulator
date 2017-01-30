(function (angular) {
  'use strict';
  angular.module('MarieSimulator')
    .controller('MarieCtrl', ['$scope', '$timeout', 'assembler', 'cpu', 'memory', function($scope, $timeout, assembler, cpu, memory) {

    // machine variables
    $scope.assembly = [];
    $scope.cpu = cpu;
    $scope.memory = memory;

    // input variables
    $scope.inputValue = undefined;

    // status variables
    $scope.statusMessage = "Ready to load program instructions.";

    // memory variables
    $scope.programLoaded = false;
    $scope.currentAddress = undefined;

    // filters variables (decimal, hexadecimal, ascii)
    $scope.selectedInputFilter = "decimal";
    $scope.selectedOutputFilter = "decimal";

    // cpu variables
    $scope.halted = false;
    $scope.speed = 4;

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
        if (cpu.halt || cpu.interrupt) {
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
      }, 1000 / $scope.speed);
    };

    $scope.halt = function() {
      $timeout.cancel(tick);
      $scope.reset();
    }

    $scope.settle = function() {
      if (cpu.interrupt){
        var value = 0;
        switch ($scope.selectedInputFilter) {
        case "decimal":
        case "hexadecimal":
          value = parseInt($scope.inputValue, 10);
        break;
        case "ascii":
          value = $scope.inputValue.charCodeAt();
        break;
        }
        $scope.cpu.settle(value);
        $scope.run();
      }
    };

    // Options
    $scope.setSpeed = function(value) {
      $scope.speed = value;
    };

    $scope.setInputFilter = function(filter) {
      $scope.selectedInputFilter = filter;
    };

    $scope.setOutputFilter = function(filter) {
      $scope.selectedOutputFilter = filter;
    };
  }]);
} (window.angular));

// FIXME: this way might be easier
// (function (angular) {
//   'use strict';
//
//   function MarieCtrl(
//     FileSystemService,
//     MachineService,
//     $scope) {
//
//     MachineService.init();
//
//     // function variables
//     $scope.assemble = MachineService.assemble;
//     $scope.halt = MachineService.halt;
//     $scope.run = MachineService.run;
//     $scope.stepForward = MachineService.stepForward;
//     $scope.settle = MachineService.settle;
//
//     // machine variables
//     $scope.assembly = MachineService.assembly;
//     $scope.cpu = MachineService.cpu;
//     $scope.memory = MachineService.memory;
//
//     // input variables
//     $scope.inputValue = $scope.inputValue;
//
//     // status variables
//     $scope.statusMessage = MachineService.statusMessage;
//
//     // memory variables
//     $scope.programLoaded = MachineService.programLoaded;
//     $scope.currentAddress = MachineService.currentAddress;
//
//     // filters variables
//     $scope.selectedInputFilter = MachineService.selectedInputFilter;
//     $scope.selectedOutputFilter = MachineService.selectedOutputFilter;
//
//     // cpu variables
//     $scope.halted = MachineService.halted;
//     $scope.speed = MachineService.speed;
//
//     // variables
//     $scope.code = MachineService.code;
//
//     console.log(MachineService.name);
//
//   }
//
//   angular.module('MarieSimulator')
// 		.controller('MarieCtrl', MarieCtrl);
//
// } (window.angular));
