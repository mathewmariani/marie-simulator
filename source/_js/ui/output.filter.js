// this should check with the controller for the current
// output filter.
app.filter("outputfilter", function() {
  return function(input, filter) {
      switch (filter) {
        case "decimal":
          return input.toString(10);
        case "hexadecimal":
          input = input.toString(16)
          input = input.toUpperCase();
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
