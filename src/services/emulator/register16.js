angular.module('MarieSimulator')
  .factory('register_int16', [function() {
  var Register_Int16 = function() {
    // Public properties, assigned to the instance ('this')
    this.value = 0;
  }

  Register_Int16.prototype.read = function () {
    return this.value;
  };

  Register_Int16.prototype.write = function (value) {
    var ref = (value & 0xFFFF);
    this.value = (ref > 0x7FFF) ? ref - 0x10000 : ref;
  };

  return Register_Int16;
}]);
