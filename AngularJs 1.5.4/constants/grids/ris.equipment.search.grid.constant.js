(function() {
  'use strict';

  angular
    .module('napierContainerUi')
    .constant('risEquipmentSearchGridDefinition', {
      enableRowHeaderSelection: false,
      multiSelect: false,
      enableSelectAll: false,
      enableSorting: false,
      enableCellEditOnFocus: true,
      enableFiltering: false,
      enableFullRowSelection: true,
      columnDefs: [{
        field: 'eqpId',
        displayName: 'Equipment Id',
        enableSorting: true,
        enableCellEdit: false,
        pinnedLeft: true
        //width: 75
      }, {
        field: 'eqpDesc',
		displayName: 'Equipment Description',
        enableSorting: false,
        enableCellEdit: false,
        enableFiltering: false,
        pinnedRight: true
        //width: 100
      }],
    });


})();
