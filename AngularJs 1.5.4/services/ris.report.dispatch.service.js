(function() {
  'use strict';

  angular
    .module('napierContainerUi')
    .service('risReportDispatchService', risReportDispatchService);

  /** @ngInject */



  function risReportDispatchService($q, risReportDispatchGridData) {
    this.getReportDispatchGridData = function() {
      var D = $q.defer()
      D.resolve(angular.copy(risReportDispatchGridData))
      return D.promise
    }
  }



})();
