angular.module('MarieSimulator').filter("fixedLength", function() {
  return function(input, length) {
    while (input.length < length) {
      input = '0'+input;
    }
    return input;
  };
});
