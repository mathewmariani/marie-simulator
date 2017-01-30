angular.module('MarieSimulator').filter("memoryfilter", function() {
  return function(input) {
    input = input.toString(16)
    input = input.toUpperCase();
    while (input.length < 4) {
      input = '0'+input;
    }

    return input;
  };
});
