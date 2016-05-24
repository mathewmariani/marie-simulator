app.filter("output", function() {
  return function(input, base) {
    return input.toString(base);
  };
});
