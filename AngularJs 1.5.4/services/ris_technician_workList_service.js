(function () {
    'use strict';

    angular
        .module('napierContainerUi')
        .service('risTechnicianComboService', risTechnicianComboService);

    /** @ngInject */
    function risTechnicianComboService($q, BILLING_APIS, CallManager) {
        
		this.userId = JSON.parse(sessionStorage.userContextObj).LOGIN_NAME;
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
							"com.napier.core.service.vo.query.Index": []
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
									paramName: 'pUserId',
									value: this.userId
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
								},
								{
									paramName: 'pUserId',
									value: this.userId
								}
							]
						}]
					}]
				}]
			};
			commonServiceParamsandResponse(combosObject,D);
			return D.promise;
         }
		 /*-----Modalitiy Dropdown----*/
		 this.modalitieComboFetch = function (getCombosId) {
            var D = $q.defer();
            var combosObject = {};
            combosObject = {
				"@class": "com.napier.core.service.vo.query.QueryData",
				"queryList": [{
					"com.napier.core.service.vo.query.Query": [{
						"identifier": getCombosId,
						"idxList": [{
							"com.napier.core.service.vo.query.Index": []
						}]
					}]
				}]
			};
            commonServiceParamsandResponse(combosObject,D);
            return D.promise;
         }
		 /*-----Film Dropdown----*/
         /*this.filmComboFetch = function (getCombosId, param1) {
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
									paramName: 'pInvestId',
									value: 33
								}
							]
						}]
					}]
				}]
			};
			commonServiceParamsandResponse(combosObject,D);
			return D.promise;
         }*/
		 /*-----Consumable Dropdown----*/
        /*this.consumableComboFetch = function (getCombosId, param1) {
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
                                   "ident": "1",
                                   "value": -999
                                }, {
                                   "ident": "3",
                                   "value": 33
                                }

							]
						}]
					}]
				}]
			};
			commonServiceParamsandResponse(combosObject,D);
			return D.promise;
         }
		*/
         /*-----Statistics----*/
        this.statisticsData = function (getCombosId, param1) {
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
            return D.promise;
         }
		 
		/*-----abortInvistServices----*/
        this.abortInvistServices = function (getCombosId, param1) {
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
            return D.promise;
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
						var seqId = 0,subDept=0;
						if(typeof(prioritytype[2])!='undefined') { seqId = prioritytype[2].data; }
						if(typeof(prioritytype[3])!='undefined') { subDept = prioritytype[3].data; }
						var prioritytypeObject = {
							   "CODE": prioritytype[0].data,
							   "DESCRIPTION": prioritytype[1].data,
							   "SEQID":seqId,
							   "SUB_CODE":subDept
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
                    var len=res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].
                    rowList[0]['com.napier.core.service.vo.query.Row'].columnList.length;
                    if(len == 1){
                    	var finalArray = [];
						var resul;
                    	var resulArray = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].
                        rowList[0]['com.napier.core.service.vo.query.Row'];
                        finalArray.push(resulArray);
						resul =finalArray; 
                    }else{
                    	var resul = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].
                       rowList[0]['com.napier.core.service.vo.query.Row'].columnList[0]['com.napier.core.service.vo.query.Column'];
                    }
                    return resul;
                } else
                    return resul = '';

            }
        }          
    }
})();