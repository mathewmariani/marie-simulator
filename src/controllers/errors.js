(function (angular) {
  'use strict';
	angular.module('MarieSimulator')
		.controller('ErrorModalInstanceCtrl', ['$uibModalInstance', 'errors', function ($uibModalInstance, errors) {
	  var $errorModal = this;

		$errorModal.errors = errors;

		$errorModal.ok = function () {
	    $uibModalInstance.close();
	  };

	  $errorModal.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
	}]);
} (window.angular));
