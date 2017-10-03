(function () {
    'use strict';

    angular
        .module('napierContainerUi')
        .constant('gridContrastConstants', {
            enableExpandableRowHeader: false,
            enableRowSelection: true,
            columnDefs: [{
            displayName: 'Contrast Code',
            field: 'contrastCode',
            minWidth: 150
        }, {
            displayName: 'Contrast Name',
            field: 'contrastName',
            minWidth: 150
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
