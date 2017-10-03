(function () {
    'use strict';

    angular
        .module('napierContainerUi')
        .service('risComboService', risComboService);

    /** @ngInject */
    function risComboService($q, BILLING_APIS, CallManager) {
   
         /*----------staff DropDown----*/
         this.staffComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pRoleId',
                                            value: 4
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
        /*----------Priority DropDown----*/
         this.priorityComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                        {
                                            paramName: 'pMasterSqId',
                                            value: 3113
                                        },
                                        {
                                            paramName: 'pMasterDesc',
                                            value: ""
                                        },
                                        {
                                            paramName: 'pDetailCode',
                                            value: -999
                                        },
                                        {
                                            paramName: 'pDetailDesc',
                                            value: ""
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                   commonServiceParamsandResponse(combosObject,D);
                return D.promise;

         }
          /*template Combobox*/
        this.templateComboFetch = function(getCombosId, param1) {
            debugger;
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": getCombosId,
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                "ident": 1,
                                "value": param1
                            }]
                        }]

                    }]
                }]
            };
            commonServiceParamsandResponse(combosObject, D);
            return D.promise;

        }
         /*---------OrderBy Dropdown-------*/
         this.orderByComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pPracticeId',
                                            value: "Napier123"
                                        },
                                        {
                                            paramName: 'pFacilityId',
                                            value: 1
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
         /*----------patient Type DropDown----*/
         this.patientTypeComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pMasterSqId',
                                            value: 29
                                        },
                                        {
                                            paramName: 'pMasterDesc',
                                            value: ""
                                        },
                                        {
                                            paramName: 'pDetailCode',
                                            value: -999
                                        },
                                        {
                                            paramName: 'pDetailDesc',
                                            value: ""
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
         /*----------status DropDown----*/
         this.statusComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pMasterSqId',
                                            value: 100021
                                        },
                                        {
                                            paramName: 'pMasterDesc',
                                            value: ""
                                        },
                                        {
                                            paramName: 'pDetailCode',
                                            value: -999
                                        },
                                        {
                                            paramName: 'pDetailDesc',
                                            value: ""
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
         /*----------department DropDown----*/
         this.departmentComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pFacId',
                                            value: 1
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
         /*-----Sub Department Dropdown----*/
         this.subDepartmentComboFetch = function (getCombosId, param1) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
                        "@class": "com.napier.core.service.vo.query.QueryData",
                        "queryList": [{
                            "com.napier.core.service.vo.query.Query": [{
                                "identifier": getCombosId,
                                "idxList": [{
                                    "com.napier.core.service.vo.query.Index": [
                                         {
                                            paramName: 'pDeptCode',
                                            value: param1
                                        }
                                    ]
                                }]
                            }]
                        }]
                    };
                commonServiceParamsandResponse(combosObject,D);
                return D.promise;
         }
         /*-----Statistics----*/
        this.statisticsData = function (getCombosId) {
            debugger;
            var D = $q.defer();

            var statisticsObject = {};
            statisticsObject = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [
                        {
                            "identifier": getCombosId,
                            "idxList": [
                                {
                                    "com.napier.core.service.vo.query.Index": []
                                }
                            ]
                        }
                    ]
                }]
                        
            };
            commonServiceParamsandResponse(statisticsObject,D);
            debugger;
            return D.promise;
         }
         /*---Search Orders for Gird----*/
         this.searchOrdersGrid = function(getCombosId, param1)
         {
            
         }

         function commonServiceParamsandResponse(combosObject,D){

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