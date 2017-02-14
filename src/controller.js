(function (angular) {
  'use strict';
  angular.module('MarieSimulator')
    .controller('MarieCtrl', ['$scope', '$timeout', '$uibModal', 'assembler', 'cpu', 'memory', function($scope, $timeout, $uibModal, assembler, cpu, memory) {

		var $ctrl = this;

		// services
		$scope.cpu = cpu;
		$scope.memory = memory;

		// filters
		$scope.outputFilter = "dec";
		$scope.inputFilter = "dec";

		// variables
		$scope.assembly = {};
		$scope.delay = 1000;
		$scope.status = "Ready to load program instructions.";

		// flags
		$scope.assembled = false;
		$scope.halted = false;
		$scope.interrupted = false;
		$scope.programLoaded = false;
		$scope.running = false;

    // current 'sample' program
    $scope.code = "ORG 0\nLOAD X\nADD Y\nOUTPUT\nHALT\nX, DEC 0\nY, DEC 1";

		$scope.reset = function() {
			cpu.reset();
			memory.reset();

			// reset flags
			$scope.assembled = false;
			$scope.halted = false;
			$scope.interrupted = false;
			$scope.programLoaded = false;
			$scope.running = false;

			$scope.halt();
			$scope.status = "Ready to load program instructions.";
		}

		$scope.assemble = function() {
			// reset the machine
			$scope.reset();

			// assemble code
			$scope.assembly = assembler.assemble($scope.code);


			if ($scope.assembly.errors.length > 0) {
				$ctrl.openAssemblyErrorModal();
				// make sure to clear the faulty assembly
				$scope.assembly = {};
				return;
			}

			$scope.assembled = true;

      $scope.assembly.program.forEach(function(instruction) {
        memory.data[instruction.address] = instruction.hexcode;
      });
		}

		$scope.stepForward = function() {
			$scope.status = "Press [Step Forward] to continue.";
			$scope.step();
		}

		$scope.step = function() {
			if (cpu.halt || cpu.interrupt) {
				return false;
			}

			try {
				cpu.fetch();
				cpu.execute();
			} catch (e) {
				$scope.halt(e);
				return false;
			}

			return true;
		}

		var tick;
    $scope.run = function() {
			$scope.running = true;
      tick = $timeout(function () {
        if ($scope.step()) {
          $scope.run()
        }
      }, $scope.delay);
    };

		$scope.halt = function(err) {
			$timeout.cancel(tick);
      if (err) {
				if (cpu.halt || cpu.interrupt) {
					if (cpu.interrupt) {
						$ctrl.openInputModal();
					}

					this.status = err;
				} else {
        	this.status = "Machine halted abnormally. Error: "+err;
				}
      } else {
        this.status = "Halted at user request.";
      }
    }

		/**
		 * Assembly Errors
		 */

		$ctrl.openAssemblyErrorModal = function () {
			var modalInstance = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'views/errors.html',
				controller: 'ErrorModalInstanceCtrl',
				controllerAs: '$errorModal',
				resolve: {
	        errors: function () {
	          return $scope.assembly.errors;
	        }
	      }
			});
		};

		$ctrl.openInputModal = function () {
			var modalInstance = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'views/input.html',
				controller: 'InputModalInstanceCtrl',
				controllerAs: '$inputModal'
			});

			modalInstance.result.then(function (value) {
      	$scope.cpu.settle(value);
        $scope.run();
    	});
		};

		/**
		 * User Interface
		 */

		$scope.delays = [
			{ name: "1 Hz", value: 1 },
			{ name: "4 Hz", value: 4 },
			{ name: "8 Hz", value: 8 },
			{ name: "16 Hz", value: 16 }
		];

		$scope.setDelay = function(value) {
			$scope.delay = (1000 / value);
		};

		$scope.setFilter = function(value) {
			$scope.outputFilter = value;
		};

		$scope.dissableAssembleButton = function() {
			// can't assemble while running
			return $scope.running;
		}

		$scope.dissableRunButton = function() {
			// can't run if not assembled
			return !$scope.assembled;
		}

		$scope.dissableHaltButton = function() {
			// can't stop if not assembled or not running
			return (!$scope.assembled || !$scope.running);
		}

		$scope.dissableStepButton = function() {
			// can't step if not assembled or if running
			return (!$scope.assembled || $scope.running);
		}
  }]);
} (window.angular));
