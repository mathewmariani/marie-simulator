(function (angular) {
  'use strict';

  function MachineService($timeout, assembler, cpu, memory) {
    var service = {};

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

    service.init = function() {
      service.memory.reset();
      service.cpu.reset();
      service.assembly = [];

      service.programLoaded = false;
      service.currentAddress = undefined;
      service.halted = false;
      service.statusMessage = "Ready to load program instructions.";
    }

    service.reset = function() {
      service.init();
    }

    service.assemble = function() {
      try {
        service.reset();
        service.assembly = assembler.assemble(service.code);

        // if we have some errors don't continue assembling
        if (service.assembly.errors.length > 0) {
          return;
        }

        // place all instructions into memory
        for (var i = 0, l = service.assembly.hexcodes.length; i < l; i++) {
          memory.data[i] = service.assembly.hexcodes[i];
        }

        // we've reassembled, so reset some values/
        service.halted = false;
        service.programLoaded = true;

      } catch (e) {
        // assembly halted
        console.error (e);
      }
    };


    service.stepForward = function() {
      if (service.programLoaded && service.executeStep()) {
        service.statusMessage = "Press [Step Forward] to continue.";
      }
    };

    // execute a single instruction
    service.executeStep = function() {
      try {
        if (cpu.halt || cpu.interrupt) {
          return false;
        }

        // highlight current memory
        service.currentAddress = cpu.PC.read();

        return cpu.step();
      } catch (e) {
        service.statusMessage = e;
        return false;
      }
    };

    var tick;
    service.run = function() {
      if (!service.programLoaded) {
        service.assemble();
      }

      tick = $timeout(function () {
        if (service.executeStep()) {
          service.run();
        }
      }, 1000 / service.speed);
    };

    service.halt = function() {
      $timeout.cancel(tick);
      service.reset();
    }

    service.settle = function() {
      if (cpu.interrupt){
        var value = 0;
        switch (service.selectedInputFilter) {
        case "decimal":
        case "hexadecimal":
          value = parseInt(service.inputValue, 10);
        break;
        case "ascii":
          value = service.inputValue.charCodeAt();
        break;
        }
        service.cpu.settle(value);
        service.run();
      }
    };

    // Options
    service.setSpeed = function(value) {
      service.speed = value;
    };

    service.setInputFilter = function(filter) {
      service.selectedInputFilter = filter;
    };

    service.setOutputFilter = function(filter) {
      service.selectedOutputFilter = filter;
    };

    return service;
  };

  angular.module('MarieSimulator')
    .factory('MachineService', MachineService);
} (window.angular));
