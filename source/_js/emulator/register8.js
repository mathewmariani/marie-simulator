app.factory('register_int8', [function() {
  function Register_Int8() {
    // Public properties, assigned to the instance ('this')
    this.value = 0;
  }

  Register_Int8.prototype.read = function () {
    return this.value;
  };

  Register_Int8.prototype.write = function (value) {
    var ref = (value & 0xFF);
    this.value = (ref > 0x7F) ? ref - 0x100 : ref;
  };

  return Register_Int8;
}]);
