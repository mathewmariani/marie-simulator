app.filter("uppercase", function() {
  return function(input) {
    return input.toUpperCase();
  };
});
