app.filter("base", function() {
  return function(input, base) {
    return input.toString(base);
  };
});
