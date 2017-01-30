angular.module('MarieSimulator')
  .service('memory', [function () {
  var memoryService = {
    data: Array(4096),

    // 16-bit, but we store it in 16 bit so we shouldnt worry about
    // converting it when reading
    read: function (address) {
      var self = this;
      if (address < 0 || address >= self.data.length) {
        throw "Memory access violation. Address: " + address;
      }

      return self.data[address];
    },

    // 16-bit
    write: function (address, value) {
      var self = this;
      if (address < 0 || address >= self.data.length) {
        throw "Memory access violation. Address: " + address;
      }

      var ref = (value & 0xFFFF);
      self.data[address] = (ref > 0x7FFF) ? ref - 0x10000 : ref;
    },

    reset: function () {
      var self = this;
      for (var i = 0; i < self.data.length; i++) {
        self.data[i] = 0;
      }
    }
  };

  memoryService.reset();
  return memoryService;
}]);
