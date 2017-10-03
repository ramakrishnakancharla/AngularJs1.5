(function () {
    'use strict';

    angular
        .module('napierContainerUi')
        .constant('gridFlimsConstants', {
            enableExpandableRowHeader: false,
            enableRowSelection: true,
            columnDefs: [{
            displayName: 'Film Code',
            field: 'filmCode',
            minWidth: 100
        }, {
            displayName: 'Film Name',
            field: 'filmName',
            minWidth: 100
        }, {
            displayName: 'Avaliable Quantity',
            field: 'avaliableQuantity',
            minWidth: 150
        },{
            displayName: 'Used Quantity',
            field: 'usedQuantity',
            minWidth: 150
        },{
            displayName: 'Reason',
            field: 'Reason',
            minWidth: 100
        }],
        });


})();
