(function() {
  'use strict';

  function FileSystemService() {
    var service = {};

    service.init = function() {

    }
    
    return service;
  };

  angular.module('MarieSimulator')
    .factory('FileSystemService', FileSystemService);
}());
