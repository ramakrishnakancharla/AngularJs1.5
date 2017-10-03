(function() {
  'use strict';

  angular
    .module('napierContainerUi')
    .service('risEquipmentSearchService',risEquipmentSearchService);

  /** @ngInject */
  function risEquipmentSearchService($rootScope, CallManager, BILLING_APIS, risEquipmentSearchGridDefinition, $q){
 
    function commonServiceParamsandResponse(combosObject,D){
      debugger;
                  var urlParams = {};
                      urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
                      urlParams.requestData = {
                          operation: "ExecuteQuery",
                          destination: "QueryService",
                          message: combosObject
                      };
                      CallManager.sendRestRequest(urlParams).then(function (res) {             
                         
                              var priorityObj = [];                
                              var priorityCombo = commonComboFun(res);
                              angular.forEach(priorityCombo, function(AVal, AKey) {
                                  var prioritytype= AVal.columnList[0]['com.napier.core.service.vo.query.Column'];
                                  var seqId = 0;
                                  if(typeof(prioritytype[2])!='undefined') { seqId = prioritytype[2].data; }
                                  var prioritytypeObject = {
                                         "CODE": prioritytype[0].data,
                                         "DESCRIPTION": prioritytype[1].data,
                                         "SEQID":seqId
                                        }
                                  priorityObj.push(prioritytypeObject);
                              });                
                              D.resolve(priorityObj);                    
                      });
               }
              function commonComboFun(res) {
      
                  var resul = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].rowList[0]['com.napier.core.service.vo.query.Row'];
                  if (resul instanceof Array) {
                      return resul;
                  } else {
                      var check_res = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].
                      rowList[0]['com.napier.core.service.vo.query.Row'];
                      if (check_res != undefined) {
                          var resul = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].
                          rowList[0]['com.napier.core.service.vo.query.Row'].columnList[0]['com.napier.core.service.vo.query.Column'];
                          return resul;
                      } else
                          return resul = '';
      
                  }
              }






    
  }
  

})();


