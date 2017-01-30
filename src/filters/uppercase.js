angular.module('MarieSimulator').filter("uppercase", function() {
  return function(input) {
    return input.toUpperCase();
  };
});
