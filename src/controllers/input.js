(function (angular) {
  'use strict';
	angular.module('MarieSimulator')
		.controller('InputModalInstanceCtrl', ['$uibModalInstance', function ($uibModalInstance) {
	  var $inputModal = this;

		$inputModal.filters = [
			{ name: "Decimal", base: 10 },
			{ name: "Hexadecimal", base: 16 },
			{ name: "ASCII", base: -1 }
		];

		$inputModal.input = 0x0;
		$inputModal.selectedInputFilter = $inputModal.filters[0];

		$inputModal.setFilter = function(index) {
			$inputModal.selectedInputFilter = $inputModal.filters[index];
		};

		$inputModal.settle = function () {
			if ($inputModal.selectedInputFilter.base <= 0) {
				$inputModal.input = $inputModal.input.charCodeAt(0);
			} else {
				$inputModal.input = parseInt(
					$inputModal.input,
					$inputModal.selectedInputFilter.base
				);
			}

	    $uibModalInstance.close($inputModal.input);
	  };
	}]);
} (window.angular));
