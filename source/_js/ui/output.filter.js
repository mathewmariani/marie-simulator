// this should check with the controller for the current
// output filter.
app.filter("output", function() {
  return function(input, base) {
    return input.toString(base);
  };
});
