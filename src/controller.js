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

    // cpu variables
    $scope.accumulator = undefined;
    $scope.instructionRegister = undefined;
    $scope.memoryBusRegister = undefined;
    $scope.programCounter = undefined;
    $scope.memoryAddressRegister = undefined;
    $scope.inputRegister = undefined;
    $scope.outputRegister = undefined;

    // filters variables (decimal, hexadecimal, ascii)
    $scope.selectedInputFilter = "decimal";
    $scope.selectedOutputFilter = "decimal";

    // cpu variables
    $scope.halted = false;
    $scope.speed = 4;

    // current 'sample' program
    $scope.code = "ORG\nLOAD X\nADD Y\nOUTPUT\nHALT\nX, DEC 0\nY, DEC 1";

    // FIXME: this is currently a patch
    $scope.saveAs = function() {
      var blob = new Blob([$scope.code], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "marie-program.mas");
    }

    // reset the machine
    $scope.reset = function() {
      $scope.memory.reset();
      $scope.cpu.reset();
      $scope.assembly = [];

      // machine
      $scope.programLoaded = false;
      $scope.halted = false;
      $scope.status_message = "Ready to load program instructions.";

      // cpu ref values
      $scope.accumulator = undefined;
      $scope.instructionRegister = undefined;
      $scope.memoryBusRegister = undefined;
      $scope.programCounter = undefined;
      $scope.memoryAddressRegister = undefined;
      $scope.inputRegister = undefined;
      $scope.outputRegister = undefined;
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
        $scope.statusMessage = "Press [Step Forward] to continue.";
      }
    };

    // execute a single instruction
    $scope.executeStep = function() {
      try {
        if (cpu.halt || cpu.interrupt) {
          return false;
        }

        $scope.accumulator = cpu.AC.read();
        $scope.instructionRegister = cpu.IR.read();
        $scope.memoryBusRegister = cpu.MBR.read();
        $scope.programCounter = cpu.PC.read();
        $scope.memoryAddressRegister = cpu.MAR.read();
        $scope.inputRegister = cpu.InREG.read();
        $scope.outputRegister = cpu.OutREG.read();

        return cpu.step();
      } catch (e) {
        $scope.statusMessage = e;
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
          value = parseInt($scope.inputValue, 10);
          break;
        case "hexadecimal":
          value = parseInt($scope.inputValue, 16);
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
