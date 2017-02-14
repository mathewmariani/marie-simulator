(function (angular) {
  'use strict';
	angular.module('MarieSimulator')
		.filter("hexcode", function() {
		return function(input) {
			input = (input || 0x0);
      input = input.toString(16).toUpperCase()
      while (input.length < 4) {
        input = '0'+input;
      }

			return input;
	  };
	});
} (window.angular));
