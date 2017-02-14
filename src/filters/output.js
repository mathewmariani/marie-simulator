// this should check with the controller for the current
// output filter.
angular.module('MarieSimulator').filter("outputfilter", function() {
  return function(input, filter) {
      switch (filter) {
        case "dec":
					input = (input > 0x7F) ? input - 0x100 : input;
          return input.toString(10);
        case "hex":
          input = input.toString(16).toUpperCase()
          while (input.length < 4) {
            input = '0'+input;
          }

          return input;
        case "ascii":
          return String.fromCharCode(input);
        default:
          return input.toString(10);
      }
  };
});
