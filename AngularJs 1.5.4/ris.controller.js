(function() {
  'use strict';

  angular
      .module('napierContainerUi')
      .controller('risController', risController);

  /** @ngInject */
  function risController(BILLING_APIS, QueryService, $filter, $http,$scope, $rootScope, $timeout, $log, hisAlertService, hisModalService, CallManager, risEquipmentSearchService, risEquipmentSearchGridDefinition, $uibModalStack, $uibModal) {
    $rootScope.eqSearch={};
$scope.ReportDispatchgridOptions = {
    enableRowHeaderSelection: false,
    multiSelect: false,
    enableSelectAll: false,
  enableSorting: false,
  enableCellEditOnFocus: true,
  enableFiltering: true,
  enableFullRowSelection: true,
  columnDefs: [{
    field: 'modalityName',
    displayName: 'Modality Name',
    enableSorting: true,
    enableCellEdit: false,
    pinnedLeft: true,
    width: '70%'
  }, /*{
    field: 'action',
     displayName: '',
    enableSorting: false,
    enableCellEdit: false,
    enableFiltering: false,
    cellTemplate: '<div class="action-layout"><span><i class="fa fa-pencil fa-lg edit-action " role="button" tabindex="0" style="color:grey;"></i>&nbsp;&nbsp;<i class="fa fa-trash-o fa-lg" aria-hidden="true" style="color:grey;"></i></span></div>',
    pinnedRight: true,
   width: '4%'
  },*/{
      field: 'actionToggle',
      displayName: 'Action',
      enableSorting: false,
      enableCellEdit: false,
      enableFiltering: false,
      cellTemplate:'<div class="action-layout" style="margin-top:15px"><md-switch style="margin-top: -20px;" class="md-primary" md-no-ink aria-label="Switch No Ink" ng-model="row.entity.actionToggle" ng-true-value="1" ng-false-value="2" ng-click="grid.appScope.toggleStatusUpdate(row.entity.code, row.entity.modCodeField, row.entity.actionToggle)">{{(row.entity.actionToggle==1)?"Active":"InActive"}}</md-switch></div>' ,
      pinnedRight: true,
      width: '30%'
  },{
    field: 'code',
    visible: false,
    displayName: ' Equipment Code',
    enableSorting: true,
    enableCellEdit: false,
    pinnedLeft: true
    // width: '0'
  }, {
    field: 'modCodeField',
    visible: false,
    displayName: ' Mod Code',
    enableSorting: true,
    enableCellEdit: false,
    pinnedLeft: true
    // width: '0'
  }]
};

 $scope.ReportDispatchgridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi;
  };

 /* $scope.EqCode="";
  $scope.EqDesc="";*/
  $scope.AcceptedCode="";
  $scope.AcceptedEquipmentDescription="";
  $scope.invisibleModCode="";
  $scope.modCode="";
    
$scope.AcceptEquipmentDetails = function(){
  debugger;
  $scope.AcceptedCode=$scope.eqSearch.EqCode;
  $scope.AcceptedEquipmentDescription=$scope.eqSearchEqDesc;
  $scope.eqSearch={};
  $uibModalStack.dismissAll();
  $scope.invisibleModCode=$scope.modCode;
}
$scope.toggleStatusUpdate = function(a, b, c){
  debugger;
                $scope.ToggleEquipmentCode=a;
                $scope.ToggleModCode=b; 
                $scope.ToggleStatusCode=(c==1)?2:1;
                $scope.updateModality();

}

$scope.clearEquipmentSearchFields = function(){
  $scope.eqSearch={};
}



          $scope.loadEquipmentDetails = function(eqSearch) {
            debugger;
            //var searchid="",searchname="";
            debugger;
            /*if(a=="" && b==""){
              searchid="%%";
              searchname="%%";
            }
            else if(a==undefined && b==undefined)
            {
              searchid="%%";
              searchname="%%";
            }
            else if(a!="" && b=="")
            {
              searchid="%"+a+"%";
              searchname="%%";
            }
            else if(a=="" && b!="")
            {
              searchid="%%";
              searchname="%"+b+"%";
            }
            else
            {
              searchid="%"+a+"%";
              searchname="%"+b+"%";
            }*/
            var statisticsObject = {};
            statisticsObject = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [
                  {
                    "com.napier.core.service.vo.query.Query": [
                      {
                        "identifier": "QS_RIS_EQP_PCKUP_LST",
                        "idxList": [
                          {
                            "com.napier.core.service.vo.query.Index": [
                              {
                                "paramName": "pEqpId",
                                "value":  (eqSearch==undefined || eqSearch.EqCode==undefined || eqSearch.EqCode==null || eqSearch.EqCode=="")?"%%":"%%"+eqSearch.EqCode+"%%"
                              },
                              {
                                "paramName": "pEqpLongName",
                                "value": (eqSearch==undefined || eqSearch.EqDesc==undefined || eqSearch.EqDesc==null || eqSearch.EqDesc=="")?"%%":"%%"+eqSearch.EqDesc+"%%"
                              },
                              {
                                "paramName": "pEqpType",
                                "value": ""
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
            };
            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                operation: "ExecuteQuery",
                destination: "QueryService",
                message: statisticsObject
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {			
                				
                var result = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].rowList[0]['com.napier.core.service.vo.query.Row'];
                if(typeof(result) == 'undefined'){
                    hisAlertService.hisAlertMulti('information', "Information!", "Sorry No Statistics Found!", "", "", "");
                }else{
                    var finalArray = [];
                    var arrayNow;
                    if(typeof(result.length)!=undefined)
                    {
                        arrayNow = result;
                    }
                    else
                    {
                        finalArray.push(result);
                        arrayNow =finalArray; 
                    }
                    var len = arrayNow.length;
                    $rootScope.FinalStatistics.data=[];
                    for(var i =0; i<len; i++){
                        var objKey={};
                        var response = arrayNow[i].columnList[0]['com.napier.core.service.vo.query.Column']
                        var finalResLen= response.length;
                        for(var k=0; k<finalResLen; k++){
                            var arrayKey = response[k].name.split(".");
                            objKey[arrayKey[1]]=response[k].data;
                        }
                        $rootScope.FinalStatistics.data.push({
                            eqpId: objKey.eqpId,
                            eqpDesc: objKey.eqpLongName
                        });
                        
                    }
                    
                }
            });
             $scope.eqSearch={};
        }
      $scope.open = function(size) {
        debugger;
        $rootScope.FinalStatistics = angular.copy(risEquipmentSearchGridDefinition);
        $scope.EqCode="";
        $scope.EqDesc="";
          $scope.loadEquipmentDetails();
          var modalInstance = hisModalService.open('Equipment Search', {
              animation: true,
              templateUrl: 'app/consumer/his17_1/RIS/screens/templates/ris.modality.popup.html',
              size: size,
              scope:$scope
              /*controller: 'sampleThemeModalController',
              controllerAs: 'box'*/
          })

          $rootScope.FinalStatistics.onRegisterApi = function(gridApi) {
            $rootScope.FinalStatistics = gridApi;
            //$scope.gridApi.grid.modifyRows($scope.FinalStatistics.data);
          //var rows = $scope.gridApi.selection.getSelectedRows();
          $rootScope.FinalStatistics.selection.on.rowSelectionChanged($rootScope,function(row){
              if(row.isSelected){
                debugger;
                $scope.eqSearch.EqCode=row.entity.eqpId;
                $scope.eqSearch.EqDesc=row.entity.eqpDesc;    
              }
              else{
                $scope.eqSearch={};    
              }
          
        });
          
        }
          
      }
      $scope.loadModalityRelatedData = function() {

          console.log("--printing log------in load modality master");

          var message = {
              "@class": "com.napier.ris.vo.masters.Modality",
              "equipment": {
                  "@class": "com.napier.ris.vo.masters.Equipment"
              },
              "statusMaster": {
                  "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                  "code": -999
              }
          };
          var urlParams = {};
          urlParams.url = "HISServices/HITService";
          urlParams.requestData = {
              "operation": "getModalities",
              "messageId": "",
              "destination": "com.napier.ris.service.external.RISMasterService",
              "message": message

          }
          CallManager.sendRestRequest(urlParams).then(function(res) {           
              //console.log("printing the data"+res.data.HITService.message);
              console.log("printing the data" + res.data.HITService.message);
              //$scope.loader = false;
              var response=res.data.HITService.message.modalitiesType["0"]["com.napier.ris.vo.masters.Modality"];
              $scope.modCode=response.length+1;
              console.log(response.length);
              $scope.ReportDispatchgridOptions.data = [];
              for (var i = 0; i < response.length; i++) {
                $scope.ReportDispatchgridOptions.data.push({
                  modalityName: response[i].equipment.eqpLongName,
                  actionToggle: (response[i].statusMaster.description=='Active')?1:2,
                  code: response[i].equipment.equipmentCode,
                  modCodeField: response[i].modCode
                });
                debugger;
                $scope.toggleStatus="";
                $scope.toggleStatus=response[i].statusMaster.description;
              }
          })

    $scope.addButton = true;
          

      }

      $scope.saveModalityInGrid = function(){
        debugger;
        if($scope.AcceptedCode==""||$scope.AcceptedEquipmentDescription==""||$scope.invisibleModCode==""){
          debugger;
        hisAlertService.hisAlertMulti("information","information","Select an equipment from table","","","");
        }else{
          var addmessage = {
            "@class": "com.napier.ris.vo.masters.Modality",
            "modCode": $scope.invisibleModCode,
            "equipment": {
              "@class": "com.napier.ris.vo.masters.Equipment",
              "equipmentCode": $scope.AcceptedCode
            },
            "statusMaster": {
              "@class": "com.napier.core.service.vo.masters.GeneralMaster",
              "code": 1
            }
          };
          var urlParams = {};
          urlParams.url = "HISServices/HITService";
          urlParams.requestData = {
              "operation": "saveModality",
              "messageId": "",
              "destination": "com.napier.ris.service.external.RISMasterService",
              "message": addmessage
              
      }
      CallManager.sendRestRequest(urlParams).then(function(res) {
        $scope.loadModalityRelatedData();
        $scope.AcceptedCode="";
        $scope.AcceptedEquipmentDescription="";
        $scope.invisibleModCode="";
      })
    }
      
    }


    $scope.updateModality = function(){
         var updateMessage = 
        {
            "@class": "com.napier.ris.vo.masters.Modality",
            "modCode": $scope.ToggleModCode,
            "equipment": {
              "@class": "com.napier.ris.vo.masters.Equipment",
              "equipmentCode": $scope.ToggleEquipmentCode
            },
            "statusMaster": {
              "@class": "com.napier.core.service.vo.masters.GeneralMaster",
              "code": $scope.ToggleStatusCode
            }
        };
        var urlParams = {};
        urlParams.url = "HISServices/HITService";
        urlParams.requestData = {
            "operation": "updateModality",
            "messageId": "",
            "destination": "com.napier.ris.service.external.RISMasterService",
            "message": updateMessage
            
    }
    CallManager.sendRestRequest(urlParams).then(function(res) {
        $scope.loadModalityRelatedData();
    })
}
        
      

    





  }
})();