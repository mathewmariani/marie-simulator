app.factory('register_int12', [function() {
  function Register_Int12() {
    // Public properties, assigned to the instance ('this')
    this.value = 0;
  }

  Register_Int12.prototype.read = function () {
    return this.value;
  };

  Register_Int12.prototype.write = function (value) {
    var ref = (value & 0xFFF);
    this.value = (ref > 0x7FF) ? ref - 0x800 : ref;
  };

  return Register_Int12;
}]);
