(function() {
    'use strict';

    angular
        .module('napierContainerUi')
        .controller('RISWorkListCrtl', RISWorkListCrtl)
        .controller('printPDFCtrl', printPDFCtrl)
    /*.filter('unique', function() {
            return function (arr, field) {
                return _.uniq(arr, function(a) { return a[field]; });
            };
        });
*/
    /** @ngInject */
    function RISWorkListCrtl($q, APIS,$scope,PatientBannerGlobal,PatientBannerBilling, hisModalService,risTechnicianComboService, $rootScope, hisAlertService, $http, $uibModal, $timeout, CallManager, $log, $filter, $uibModalStack, $state, QueryService, risComboService, hisTranslationsGlobalLang, hisTranslationsService, BILLING_APIS,PrintService,$window) {
        
		$scope.drawComponent = {};
		$scope.docNameAnno = {};
		$scope.docSeqAnno = {};
		$scope.imageAnno = {};
		$scope.pDetails = true;
        $scope.priority = true;
        $scope.investigation = true;
        $scope.orderBy = true;
        $scope.schTime = true;
        $scope.remarks = true;
        $scope.status = true;
        $scope.action = true;
        $scope.patientId = true;
        $scope.showErrors = false;
        $scope.showErrorsMore = false;
        $scope.sortReverse = true;
        $scope.options = false;
        $scope.loaderFlag = false;
        $scope.orderWList = {};
        $scope.invDet = {};
        $scope.dataValPrint={};
        $scope.consumableFilms = {};
        $scope.consumableContrast = {};
        $scope.checkListRec = {};
        $scope.checkListRec1 = {};
        $scope.checkListRemarks = {};
        $scope.queGrp = {};
        $scope.dataVal={};
        $scope.globalFormVal;
        $scope.globalValid;
        $scope.dynamicFilter = 'pname';
        $scope.orderWList.fromDate = moment().format("YYYY-MM-DD");
        $scope.orderWList.toDate = moment().format("YYYY-MM-DD");

        $scope.orderWList.department = {};
        $scope.orderWList.subDepartment = {};
        $scope.abortDetailsGlobal = {};
        $scope.invDetGlobal = '';
        $scope.checkListRecGlobal = '';
        $scope.checkListRec1Global = '';
        $scope.checkListRemarksGlobal = '';
        $scope.consumableFilmsGlobal = '';
        $scope.consumableContrastGlobal = '';
        $scope.queGrpGlobal = '';
        $scope.methodsGlobal = '';
        $scope.resultentry = {};
        $scope.reportDispatch={};


      
        /*-----Load Translations-----*/
        hisTranslationsService.loadModule('ris');
        var languageToSet = hisTranslationsGlobalLang.getLanguageToSet();
        hisTranslationsService.changeLanguage(languageToSet);
        /*-------DateandTimePicker-----*/

        $scope.startDateOptions = {
            format: 'DD/MM/YYYY',
            maxDate: new Date()
        }
        $scope.endDateOptions = {
            format: 'DD/MM/YYYY',
            maxDate: new Date()
        }
        /*----------Date Validation----*/
        $scope.changeStartDate = function(fromDate) {
            $scope.endDateOptions.minDate = fromDate;
        }

        /*----------Priority DropDown----*/
        risComboService.priorityComboFetch("TRN003").then(function(res) {
            $scope.priorityDetails = res;
        });
        /*---------OrderBy Dropdown-------*/
        risComboService.orderByComboFetch("LBMAQ075").then(function(res) {
            $scope.orderByDetails = res;
        });
        /*----------patient Type DropDown----*/
        risComboService.patientTypeComboFetch("PATIENT_TYPE_TRN003").then(function(res) {
            $scope.patientsTypeDetails = res;
        });
        /*----------status DropDown----*/
        risComboService.statusComboFetch("STATUS_DROPDOWN").then(function(res) {
            $scope.statusDetails = res;
        });
        /*----------department DropDown----*/
        risTechnicianComboService.departmentComboFetch("GET-RIS-DEPARTMENT-COMBO").then(function(res) {
            $scope.departmentsDetails = res;
            $scope.orderWList.department = {};
            for (var i = 0; i < $scope.departmentsDetails.length; i++) {
                if ($scope.departmentsDetails[i].SEQID == 1) {
                    $scope.orderWList.department.CODE = $scope.departmentsDetails[i].CODE;
                    $scope.orderWList.department.DESCRIPTION = $scope.departmentsDetails[i].DESCRIPTION;
                }
            }

            risTechnicianComboService.subDepartmentComboFetch("GET-RIS-SUB-DEPARTMENT-COMBO", $scope.orderWList.department.CODE).then(function(res) {
                $scope.subDepartmentsDetails = res;
                $scope.orderWList.subDepartment = {};
                for (var i = 0; i < $scope.subDepartmentsDetails.length; i++) {
                    if ($scope.subDepartmentsDetails[i].SEQID == 1) {
                        $scope.orderWList.subDepartment.SUB_CODE = $scope.subDepartmentsDetails[i].SUB_CODE;
                        $scope.orderWList.subDepartment.DESCRIPTION = $scope.subDepartmentsDetails[i].DESCRIPTION;
                    }
                }
                var subcode = $scope.orderWList.subDepartment.SUB_CODE;
                var code = $scope.orderWList.department.CODE;
                $scope.staticorderlist(subcode, code);
                var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                $scope.loadDefault(subcode, code, fromdate, todate);
            });
        });
        /*---text editor---*/
        $scope.editorConfig = {
            sanitize: false,
            toolbar: [{
                name: 'basicStyling',
                items: ['bold', 'italic', 'underline', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-']
            }, {
                name: 'paragraph',
                items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-']
            }, {
                name: 'doers',
                items: ['removeFormatting', 'undo', 'redo', '-']
            }, {
                name: 'colors',
                items: ['fontColor', 'backgroundColor', '-']
            }, {
                name: 'links',
                items: ['image', 'hr', 'symbols', 'link', 'unlink', '-']
            }]
        }
        /*-----Sub Department Dropdown----*/
        $scope.loadSubDepartment = function(deptCode) {
            risTechnicianComboService.subDepartmentComboFetch("GET-RIS-SUB-DEPARTMENT-COMBO", deptCode).then(function(res) {
                $scope.subDepartmentsDetails = res;
            });
        }
        /*----------modalitiy DropDown----*/
        risTechnicianComboService.modalitieComboFetch("GET_RIS_MODALITIES_LIST").then(function(res) {
            $scope.modalitiesDetails = res;
        });
        /*------ Statistics Data -----*/
        $scope.staticorderlist = function(subDepat, mainDepatCode) {
            $scope.aCnt = 0;
            $scope.pCnt = 0;
            $scope.cCnt = 0;
            var statisticsObject = {};
            statisticsObject = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": "STATISTICS_ORDERWORKLIST",
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                    "paramName": "PdEPT",
                                    "value": mainDepatCode
                                },
                                {
                                    "paramName": "PSubDept",
                                    "value": subDepat
                                },
                                {
                                    "paramName": "pUseqId",
                                    "value": JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID
                                }
                            ]
                        }]
                    }]
                }]
            };
            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                operation: "ExecuteQuery",
                destination: "QueryService",
                message: statisticsObject
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                $scope.finalStatistics = [];
                var result = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].rowList[0]['com.napier.core.service.vo.query.Row'];
                if (typeof(result) == 'undefined') {
                    hisAlertService.hisAlertMulti('information', "Information!", "No statistics found!", "", "", "");
                } else {
                    var finalArray = [];
                    var arrayNow;
                    if (typeof(result.length) != 'undefined') {
                        arrayNow = result;
                    } else {
                        finalArray.push(result);
                        arrayNow = finalArray;
                    }
                    var len = arrayNow.length;
                    for (var i = 0; i < len; i++) {
                        var objKey = {};
                        var response = arrayNow[i].columnList[0]['com.napier.core.service.vo.query.Column']
                        var finalResLen = response.length;
                        for (var k = 0; k < finalResLen; k++) {
                            var arrayKey = response[k].name.split(".");
                            objKey[arrayKey[1]] = response[k].data;
                        }
                        $scope.finalStatistics.push(objKey);
                    }
                }
            });
        }
        /*-------------- Patient banner service ------------*/
        $scope.patientbanner = function(id) {
            var message = {
                "@class": "com.napier.core.patientbanner.vo.PatientBannerSearch",
                "rgSeqId": id,
                "context": 2
            }
            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "getPatientBanner",
                "messageId": "",
                "destination": "com.napier.core.patientbanner.service.external.PatientBannerService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var results = res.data.HITService.message;
                $scope.headerbanner = results;
            }, function(err) {
                hisAlertService.failure("Failed", "Failed to load patient banner");
            })
        }
        /*---resultentry popup----*/
        $scope.resultEntryRIS = function(data, value) {
            $scope.modalInstance = hisModalService.open('RESULT ENTRY', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-resultEntryModal.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
            $scope.itemsUploadedFiles = [];
            $scope.resultentry = {};
            $scope.showErrorsForResultEntry=false;
            $scope.resultentry.reportDate = new Date();
            $scope.resultentry.investigation = data.investigationName;
            $scope.resultentry.modality = data.modility;
            $scope.resultentry.orderDetailId = data.orderDetailId;
            $scope.resultentry.orderBy = data.doctorName;
            $scope.resultentry.reported = angular.fromJson(sessionStorage.userContextObj).LOGIN_NAME;
            var ReSeqId = data.rgSeqId;
            $scope.patientbanner(ReSeqId);
            /*---Templates combo----*/
            risComboService.templateComboFetch("QS_RIS_TEMPLATES_DETAILS").then(function(res) {
                $scope.templateDetails = res;
            });
        }


        /*---retrieve image-----*/
        $scope.retrieveDocumentBySearch = function(orderDetailId) {
            var message = {
                "@class": "com.napier.core.service.vo.uploadfile.DocumentSearch",
                "context": 12,
                "entityId": orderDetailId,
                "primaryEntityId": orderDetailId
            }

            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "retrieveDocumentBySearch",
                "messageId": "",
                "destination": "fileUploadCoreService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                debugger;
                var results = res.data.HITService.message.napierDocumentList[0]["com.napier.core.service.vo.uploadfile.NapierDocument"];
                $scope.itemsUploadedFiles = (results instanceof Array) ? results : [results];
            })

        }
        
        /*---result AddendumRIS popup----*/
           $scope.addendumVerifiedRIS = function(data, value) {
            debugger;
            $scope.modalInstance = hisModalService.open('ADDENDUM RESULT', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-resultAddendumModel.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
            $scope.resultentry = {};
            $scope.itemsUploadedFiles = [];
            $scope.resultentry.reportDate = new Date();
            $scope.resultentry.investigation = data.investigationName;
            $scope.resultentry.modality = data.modility;
            $scope.resultentry.orderDetailId = data.orderDetailId;
            $scope.resultentry.orderBy = data.doctorName;
            $scope.resultentry.reported = angular.fromJson(sessionStorage.userContextObj).LOGIN_NAME;
            $scope.resultentry.resultEntryId=data.resultEntityId;
            var ReSeqId = data.rgSeqId;
            $scope.patientbanner(ReSeqId);
            /*---Templates combo----*/
            risComboService.templateComboFetch("QS_RIS_TEMPLATES_DETAILS",data.orderDetailId).then(function(res) {
                $scope.templateDetails = res;
            });

            var message = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": "QS_RIS_TEMPLATES_BODY_ORDER_DETAIL_WISE",
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                "ident": "1",
                                "value": data.orderDetailId
                            }]
                        }]
                    }]
                }]
            }

            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                "operation": "ExecuteQuery",
                "messageId": "",
                "destination": "QueryService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                debugger;
                var result = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].rowList[0]['com.napier.core.service.vo.query.Row'];
                if (typeof(result) == 'undefined') {
                    //hisAlertService.hisAlertMulti('information', "Information!", "No statistics found!", "", "", "");
                } else {
                    var finalArray = [];
                    var arrayNow;
                    if (typeof(result.length) != 'undefined') {
                        arrayNow = result;
                    } else {
                        finalArray.push(result);
                        arrayNow = finalArray;
                    }
                    var len = arrayNow.length;
                    var finalResultVerification = [];
                    for (var i = 0; i < len; i++) {
                        var objKey = {};
                        var response = arrayNow[i].columnList[0]['com.napier.core.service.vo.query.Column']
                        var finalResLen = response.length;
                        for (var k = 0; k < finalResLen; k++) {
                            var arrayKey = response[k].name.split(".");
                            objKey[arrayKey[1]] = response[k].data;
                        }
                        finalResultVerification.push(objKey);
                    }
                }
                $scope.resultentry.impression = finalResultVerification[0].RESULT_ENTRY_REMARK;
                $scope.resultentry.addendum = finalResultVerification[0].RESULT_ADDENDUM_REMARK;
                $scope.resultentry.resultEntryId=finalResultVerification[0].RESULT_ENTRY_ID;
                $scope.resultentry.textEditorContent = finalResultVerification[0].BODY;
                $scope.resultentry.template = {};
                $scope.resultentry.template.CODE = finalResultVerification[0].TEMPLATE_CODE;
                $scope.resultentry.template.DESCRIPTION = finalResultVerification[0].NAME;
                $scope.retrieveDocumentBySearch($scope.resultentry.orderDetailId);
            });
        }
            
             /*---result AddendumRIS Saving----*/
          $scope.addendumVerifiedResultSave = function(resultEntry) {
            debugger;
            var methodName,messageBody;
            var resultEntryDate = moment(resultEntry.reportDate._d).format("YYYY-MM-DD HH:mm:ss.000") + ' IST';
            if (resultEntry.template != undefined) {
                var templateCode = resultEntry.template.CODE ? resultEntry.template.CODE : ""
                var templateName = resultEntry.template.DESCRIPTION ? resultEntry.template.DESCRIPTION : ""
                var templateData = resultEntry.textEditorContent ? resultEntry.textEditorContent : ""
            }

                methodName="resultReVerification";
                messageBody={
                    "@class": "com.napier.ris.vo.transactions.Entry",
                    "resultEntryId":resultEntry.resultEntryId,
                    "reVerifiedBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
                    "reVerifyRemark" : resultEntry.addendum,
                    "investigationDetailsForOrder": {
                        "@class": "com.napier.ris.vo.transactions.InvestigationDetailsForOrder",
                        "orderDetailSeqId": resultEntry.orderDetailId
                    },
                    "template": {
                        "@class": "com.napier.ris.vo.masters.Template",
                        "templateBody": templateData,
                        "statusMaster": {
                            "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                            "code": 1
                        }
                    }
                
                }

           
            var message = messageBody;
            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": methodName,
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyResultService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                debugger;
                var results = res.data.HITService.message;
                var dep = $scope.orderWList.department.CODE;
                var subdep = $scope.orderWList.subDepartment.SUB_CODE;
                $scope.resultEntryId = results.resultEntryId;
                var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                if ($scope.resultEntryId) {
                    hisAlertService.hisAlertMulti('success', "Success", "Verified Result Successfully Updated", "", "", "");
                    //$scope.reset();
                    $uibModalStack.dismissAll();
                    $scope.loadDefault(subdep, dep, fromdate, todate);

                } else {
                    hisAlertService.failure("FAILED", " Save Failed");
                    $uibModalStack.dismissAll();
                    $scope.loadDefault(subdep, dep, fromdate, todate);
                }
            }, function(err) {
                hisAlertService.failure("Failed", "Save Failed");
                $uibModalStack.dismissAll();
                $scope.loadDefault(subdep, dep, fromdate, todate);
            })
        }


        /*---result Verification  pop-up----*/
        $scope.resultVerificationRIS = function(data, value) {
            $scope.modalInstance = hisModalService.open('RESULT VERIFICATION', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-resultEntryModal.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
            $scope.resultentry = {};
            $scope.itemsUploadedFiles = [];
            $scope.resultentry.reportDate = new Date();
            $scope.resultentry.investigation = data.investigationName;
            $scope.resultentry.modality = data.modility;
            $scope.resultentry.orderDetailId = data.orderDetailId;
            $scope.resultentry.orderBy = data.doctorName;
            $scope.resultentry.reported = angular.fromJson(sessionStorage.userContextObj).LOGIN_NAME;
            var ReSeqId = data.rgSeqId;
            $scope.patientbanner(ReSeqId);
            /*---Templates combo----*/
            risComboService.templateComboFetch("QS_RIS_TEMPLATES_DETAILS",data.orderDetailId).then(function(res) {
                $scope.templateDetails = res;
            });

            var message = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": "QS_RIS_TEMPLATES_BODY_ORDER_DETAIL_WISE",
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                "ident": "1",
                                "value": data.orderDetailId
                            }]
                        }]
                    }]
                }]
            }

            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                "operation": "ExecuteQuery",
                "messageId": "",
                "destination": "QueryService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                debugger;
                var result = res.data.HITService.message.queryList[0]['com.napier.core.service.vo.query.Query'].rowList[0]['com.napier.core.service.vo.query.Row'];
                if (typeof(result) == 'undefined') {
                    //hisAlertService.hisAlertMulti('information', "Information!", "No statistics found!", "", "", "");
                } else {
                    var finalArray = [];
                    var arrayNow;
                    if (typeof(result.length) != 'undefined') {
                        arrayNow = result;
                    } else {
                        finalArray.push(result);
                        arrayNow = finalArray;
                    }
                    var len = arrayNow.length;
                    var finalResultVerification = [];
                    for (var i = 0; i < len; i++) {
                        var objKey = {};
                        var response = arrayNow[i].columnList[0]['com.napier.core.service.vo.query.Column']
                        var finalResLen = response.length;
                        for (var k = 0; k < finalResLen; k++) {
                            var arrayKey = response[k].name.split(".");
                            objKey[arrayKey[1]] = response[k].data;
                        }
                        finalResultVerification.push(objKey);
                    }
                }
                $scope.resultentry.impression = finalResultVerification[0].RESULT_ENTRY_REMARK;
                $scope.resultentry.resultEntryId=finalResultVerification[0].RESULT_ENTRY_ID;
                $scope.resultentry.textEditorContent = finalResultVerification[0].BODY;
                $scope.resultentry.template = {};
                $scope.resultentry.template.CODE = finalResultVerification[0].TEMPLATE_CODE;
                $scope.resultentry.template.DESCRIPTION = finalResultVerification[0].NAME;
                $scope.retrieveDocumentBySearch($scope.resultentry.orderDetailId);
            });
        }




        /*----resultentry SAVING----------------*/
        $scope.resultEntrySave = function(resultEntry,verify,formValid) {
            debugger;
            if (formValid.$valid) {
            var methodName,messageBody;
            var resultEntryDate = moment(resultEntry.reportDate._d).format("YYYY-MM-DD HH:mm:ss.000") + ' IST';
            if (resultEntry.template != undefined) {
                var templateCode = resultEntry.template.CODE ? resultEntry.template.CODE : ""
                var templateName = resultEntry.template.DESCRIPTION ? resultEntry.template.DESCRIPTION : ""
                var templateData = resultEntry.textEditorContent ? resultEntry.textEditorContent : ""
            }
            if(verify=='Verify'){
                methodName="resultVerification";
                messageBody={
                  "@class": "com.napier.ris.vo.transactions.Entry",
                  "resultEntryId": resultEntry.resultEntryId,
                  "reportedBy": angular.fromJson(sessionStorage.userContextObj).USER_ENTITY_ID,
                  "verifiedBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
                  "verifyRemark": resultEntry.impression,
                  "isLevel2Checked": 0,
                  "investigationDetailsForOrder": {
                    "@class": "com.napier.ris.vo.transactions.InvestigationDetailsForOrder",
                    "orderDetailSeqId": resultEntry.orderDetailId,
                  },
                  "template": {
                        "@class": "com.napier.ris.vo.masters.Template",
                        "templateBody": templateData,
                        "statusMaster": {
                            "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                            "code": 1
                        }
                    }
                }
                
            }
            if(verify=='Entry'){
                methodName="saveAndupdateResultEntryDetails";
                messageBody={
                    "@class": "com.napier.ris.vo.transactions.ResultEntry",
                    "verifiedDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
                    "verifiedBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
                    "gnTranStatus": 1,
                    "reportedBy": JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID,
                    "resultEntryDate": resultEntryDate,
                    "resultDetails": "",
                    "verifyRemark" : resultEntry.impression,
                    "investigationDetailsForOrder": {
                        "@class": "com.napier.ris.vo.transactions.InvestigationDetailsForOrder",
                        "orderDetailSeqId": resultEntry.orderDetailId
                    },
                    "template": {
                        "@class": "com.napier.ris.vo.masters.Template",
                        "templateCode": templateCode,
                        "templateName": templateName,
                        "templateBody": templateData,
                        "statusMaster": {
                            "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                            "code": 1
                        }
                    },
                    "isNewTemplate": false
                }
            }
           
            var message = messageBody;
            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": methodName,
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyResultService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var dep = $scope.orderWList.department.CODE;
                var subdep = $scope.orderWList.subDepartment.SUB_CODE;
                var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                $timeout(function() {
                    hisAlertService.hisAlertMulti('success', "Success", "Result "+verify+" Successful", "", "", "");
                }, 100);
                
                $uibModalStack.dismissAll();
                if ($scope.loaderFlag) {
                   $scope.searchOrderWorklist($scope.globalFormVal, $scope.globalValid);
                } else {
                    $scope.loadDefault(subdep, dep, fromdate, todate);
                }
                $scope.staticorderlist(subdep, dep);
            })
        
            }else{
                $scope.showErrorsForResultEntry=true;

            }
        }
        /*----resultentry Templates----------------*/
        $scope.templatechange = function(resultentry) {
            debugger;
            if (resultentry.template===null || resultentry.template===undefined){
                $scope.resultentry.textEditorContent="";
            }else{
            $scope.TemplateDropDown = [];
            $scope.templatecomboList = {
                1: $scope.TemplateDropDown
            }
            var getQuery = QueryService.executeQueryURLReset();
            $scope.templateList = new Array();
            QueryService.prepareParamList(1, resultentry.template.CODE, $scope.templateList);
            QueryService.executeQueryInput("QS_RIS_TEMPLATES_BODY", $scope.templateList, $scope.templatecomboList, true, true, getQuery, 'popUp').then(function(res) {
                    console.log($scope.TemplateDropDown);
                    $scope.resultentry.textEditorContent = $scope.TemplateDropDown[0].gQDataSequence;
                });
            }
        }

        /*--------------------loadDefault-----------------------------*/
        $scope.loadDefault = function(subDepat, mainDepatCode, fromdate, todate) {

            $scope.mainArray = [];
            $scope.loader = true;
            $scope.showErrors = true;
            var message = {
                "@class": "com.napier.ris.vo.transactions.SearchParameters",
                "orderfromDate": fromdate + 'T' + "00:00:00.000" + 'Z',
                "orderToDate": todate + 'T' + "23:59:59.000" + 'Z',
                "userId": JSON.parse(sessionStorage.userContextObj).LOGIN_NAME,
                "deptCode": mainDepatCode, //20
                "subDepartment": subDepat, //758230509
                "patientSearch": {
                    "@class": "com.napier.ris.vo.masters.PatientSearch"
                },
                "order": {
                    "@class": "com.napier.ris.vo.masters.InvestigationOrderType"
                },
                "orderStatus": {
                    "@class": "com.napier.core.service.vo.masters.GeneralMaster"
                },
                "investigation": {
                    "@class": "com.napier.ris.vo.masters.Investigation"
                }
            };

            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "getRisWorkListPatientWiseDetails",
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyOrderService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                $scope.loader = false;
                if (res.data.HITService.message.risOrder) {
                    var results = res.data.HITService.message.risOrder[0]["com.napier.ris.vo.transactions.RISOrder"];
                    if (results instanceof Array) {
                        $scope.mainArray = results;
                    } else {
                        $scope.mainArray = [results];
                    }
                } else {
                    hisAlertService.hisAlertMulti('information', "Information!", "No Record found!", "", "", "");
                }
            })
        }
        /*----Clear Form-----------*/
        $scope.OrderWorklistClear = function(val) {
            angular.copy({}, val);
            $scope.mainArray = [];
            $scope.orderWList.department = {};
            $scope.orderWList.department.CODE = $scope.departmentsDetails[0].CODE;
            $scope.orderWList.department.DESCRIPTION = $scope.departmentsDetails[0].DESCRIPTION;
            $scope.orderWList.subDepartment = {};
            $scope.orderWList.subDepartment.SUB_CODE = $scope.subDepartmentsDetails[0].SUB_CODE;
            $scope.orderWList.subDepartment.DESCRIPTION = $scope.subDepartmentsDetails[0].DESCRIPTION;
            $scope.showErrors = false;
            $scope.showErrorsMore = false;
            $scope.orderWList.fromDate = "";
            $scope.orderWList.toDate = "";
            $scope.orderWList.fromDate = moment().format("YYYY-MM-DD");
            $scope.orderWList.toDate = moment().format("YYYY-MM-DD");
        }
        /*----Change Error Message on More---*/
        $scope.changeMsg = function() {
            $scope.showErrorsMore = false;
            $scope.orderWList.ipNumber = "";
            $scope.orderWList.orderNumber = "";
            $scope.orderWList.patientType = "";
            $scope.orderWList.status = "";
        }
        /*----Grid OrderBy Filter---*/
        $scope.chnageOrderByFilter = function(status) {
            if (status == true) {
                $scope.dynamicFilter = 'pname';
            } else {
                $scope.dynamicFilter = '-pname';
            }
        }
        /*----- Grid Search Based on Statistics ----*/
        $scope.StatisticGridLoad = function(Code) {
            $scope.loader = true;
            $scope.mainArray = [];
            $scope.showErrors = true;
            var message = {
                "@class": "com.napier.ris.vo.transactions.SearchParameters",
                "orderfromDate": moment().format("YYYY-MM-DD") + 'T' + "00:00:00.000" + 'Z',
                "orderToDate": moment().format("YYYY-MM-DD") + 'T' + "23:59:59.000" + 'Z',
                "userId": JSON.parse(sessionStorage.userContextObj).LOGIN_NAME,
                "deptCode": $scope.orderWList.department.CODE,
                "subDepartment": $scope.orderWList.subDepartment.SUB_CODE,
                "patientSearch": {
                    "@class": "com.napier.ris.vo.masters.PatientSearch"
                },
                "order": {
                    "@class": "com.napier.ris.vo.masters.InvestigationOrderType"
                },
                "orderStatus": {
                    "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                    "code": parseInt(Code) //20
                },
                "investigation": {
                    "@class": "com.napier.ris.vo.masters.Investigation"
                }
            };

            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "getRisWorkListPatientWiseDetails",
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyOrderService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                $scope.loader = false;
                if (res.data.HITService.message.risOrder) {
                    var results = res.data.HITService.message.risOrder[0]["com.napier.ris.vo.transactions.RISOrder"];
                    if (results instanceof Array) {
                        $scope.mainArray = results;
                    } else {
                        $scope.mainArray = [results];
                    }
                } else {
                    hisAlertService.hisAlertMulti('information', "Information!", "No result found!", "", "", "");
                }
            })
        }
        /*----get bed side details---------------*/
        $scope.getBedSideDetails = function(ipNumber, index) {
            $scope.beddetails = "";
            $scope.roomdetails = "";
            $scope.warddetails = "";
            var message = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": "GET-RIS-BED-DETAILS",
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                "ident": "1",
                                "value": ipNumber
                            }]
                        }]
                    }]
                }]
            }

            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                "operation": "ExecuteQuery",
                "messageId": "",
                "destination": "QueryService",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var results = res.data.HITService.message.queryList[0]["com.napier.core.service.vo.query.Query"].rowList[0]["com.napier.core.service.vo.query.Row"].columnList[0]["com.napier.core.service.vo.query.Column"];
                $scope.beddetails = 'Bed Number :' + results[1].data;
                $scope.roomdetails = 'Room Number :' + results[6].data;
                $scope.warddetails = 'Ward Number :' + results[4].data;
            });
        }
        /*---- Change Order Status ------*/
        $scope.changeOrderStatus = function(rowData, headerData) {
            sessionStorage.setItem("setRowVal", JSON.stringify(rowData));
            sessionStorage.setItem("setHeaderVal", JSON.stringify(headerData));
            var message = "Are you sure you want to arrive the patient?"
            var buttonDetails = {
                buttonText: 'Yes',
                buttonText2: 'No',
            }
            var buttonFunction = {
                buttonCallBack1: function() {
                    var setRowVal = sessionStorage.getItem("setRowVal");
                    var setHeaderVal = sessionStorage.getItem("setHeaderVal");
                    sessionStorage.removeItem("setRowVal");
                    sessionStorage.removeItem("setHeaderVal");
                    var message = {
                        "@class": "com.napier.ris.vo.transactions.OrderLineItem",
                        "orderSeqId": (JSON.parse(setRowVal).orderSeqId == undefined) ? JSON.parse(setRowVal)["com.napier.ris.vo.transactions.RISOrder"].orderSeqId : JSON.parse(setRowVal).orderSeqId,
                        "gnTranStatus": {
                            "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                            "code": 1
                        },
                        "investigationDetailsForOrder": {
                            "com.napier.ris.vo.transactions.InvestigationDetailsForOrder": [{
                                "@class": "com.napier.ris.vo.transactions.InvestigationDetailsForOrder",
                                "investigation": {
                                    "@class": "com.napier.ris.vo.masters.Investigation",
                                    //"investSeqId":JSON.parse(setRowVal).inves_Code,
                                    //(JSON.parse(setRowVal).invesCode == undefined) ? JSON.parse(setRowVal)["com.napier.ris.vo.transactions.RISOrder"].invesCode : JSON.parse(setRowVal).invesCode,
                                },
                                "acceptedBy": JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID,
                                "orderDetailSeqId": (JSON.parse(setRowVal).orderDetailId == undefined) ? JSON.parse(setRowVal)["com.napier.ris.vo.transactions.RISOrder"].orderDetailId : JSON.parse(setRowVal).orderDetailId,
                            }]
                        }
                    };

                    var urlParams = {};
                    urlParams.url = "HISServices/HITService";
                    urlParams.requestData = {
                        "operation": "acceptOrder",
                        "messageId": "",
                        "destination": "com.napier.ris.service.external.RadiologyOrderService",
                        "message": message
                    };
                    CallManager.sendRestRequest(urlParams).then(function(res) {
                        var dep = $scope.orderWList.department.CODE;
                        var subdep = $scope.orderWList.subDepartment.SUB_CODE;
                        var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                        var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                        if ($scope.loaderFlag) {
                            $scope.searchOrderWorklist($scope.globalFormVal, $scope.globalValid);
                        } else {
                            $scope.loadDefault(subdep, dep, fromdate, todate);
                        }
                        $scope.staticorderlist(subdep, dep);
                    });
                },
                buttonCallBack2: function() {

                }
            }
            hisAlertService.hisAlertMulti('information', "", message, buttonDetails, buttonFunction, close);
        }
        /*---change radio dispatch--*/
        $scope.rbDispatch=function(){
            debugger;
            $scope.reportDispatch.isPatent='';
        }
        /*----------------REPORTDISPATCH pop up-------------*/

 $scope.reportDispatchRIS = function(data, value) {
            $scope.modalInstance = hisModalService.open('REPORT DISPATCH', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-reportDispatch.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
              /*----------staff DropDown----*/
        risComboService.staffComboFetch("GET-STAFF-DROPDOWN").then(function(res) {
            $scope.getStaffDropdown = res;
        });
        $scope.reportDispatch={};
        $scope.reportDispatch.isStaffandPatient="0";
        $scope.PatientValue=true;
        $scope.reportDispatch.mrno = value.risOrder.mrNo;
        $scope.reportDispatch.name=data.doctorName;
        $scope.reportDispatch.gender=value.risOrder.patientGender;
        $scope.reportDispatch.dispatchBy=JSON.parse(sessionStorage.userContextObj).LOGIN_NAME;
        $scope.reportDispatch.resultEntryId=data.resultEntityId;
        $scope.reportDispatch.orderSeqId=data.orderSeqId;
        $scope.reportDispatch.orderDetailSeqId=data.orderDetailId;
}


        /*----function to change status*/
        $scope.loadStatusPopUp = function(statusCode, rowData, headerData) {
            console.log("statusCode---"+statusCode);
            
            if (statusCode == 2) {
                $scope.changeOrderStatus(rowData, headerData);//Inprogess
                $scope.saveRERV=false;
                $scope.verifyRERV=true;
                $scope.printRERV=true;
            } else if (statusCode == 4 || statusCode == 5) {
                $scope.checkList(rowData, headerData, statusCode);//Technican work flow
                $scope.saveRERV=false;
                $scope.verifyRERV=true;
                $scope.printRERV=true;
            } else if (statusCode == 6) {
                $scope.resultEntryRIS(rowData, headerData);
                $scope.dataVal.orderDetailId= rowData.orderDetailId;
                $scope.saveRERV=false;
                 $scope.dataValPrint= rowData;
                $scope.verifyRERV=true;
                $scope.printRERV=true;
            } else if (statusCode == 8) {
                $scope.resultVerificationRIS(rowData, headerData);
                $scope.dataVal.orderDetailId= rowData.orderDetailId;
                $scope.dataValPrint= rowData;
                $scope.saveRERV=true;
                $scope.verifyRERV=false;
                $scope.printRERV=false; 
            }
             else if (statusCode == 9) {
                $scope.addendumVerifiedRIS(rowData, headerData);
                $scope.dataVal.orderDetailId= rowData.orderDetailId;
                $scope.saveRERV=false;
                $scope.printRERV=false; 
            }
    
            else if(statusCode== 11){
                $scope.printPDF(rowData, headerData);
            }else if(statusCode== 15){
                $scope.reportDispatchRIS(rowData, headerData);
            }
        }

        /*
        Module: Technician work list
        Auth: Ramakrishna
        */

        /*----------------Technician popup data (Check list , Films , Consumbles)---------------*/
        $scope.checklistFilmsConsumbles = function(invesCode, testCode, orderDeatilsId) {
            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "getOrderWorkListData",
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyService",
                "message": {
                    "@class": "com.napier.ris.vo.transactions.OrderWorkListDataLoadVo",
                    "testInvestigationCode": invesCode,
                    "testCode": testCode,
                    "orderDetailSeqId": orderDeatilsId
                }
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                // CheckList array creation
                var remarks = res.data.HITService.message.remarks;
                $scope.checkListRemarks.Remarks = remarks;

                var checklist = res.data.HITService.message.checkListTransations[0]['com.napier.ris.vo.transactions.CheckListTransactionVo'];
                if (checklist != undefined) {
                    var checklistfinalArray = [];
                    var checklistarrayNew;
                    if (typeof(checklist.length) != 'undefined') {
                        checklistarrayNew = checklist;
                    } else {
                        checklistfinalArray.push(checklist);
                        checklistarrayNew = checklistfinalArray;
                    }
                    $scope.checklistData = checklistarrayNew;

                    var checkLen = $scope.checklistData.length;
                    for (var i = 0; i < checkLen; i++) {
                        var id = $scope.checklistData[i].checkListSeqNo;
                        $scope.checkListRec['QueSeqNo_' + id] = $scope.checklistData[i].checkSeqNo;
                        $scope.checkListRec['QueSeqId_' + id] = $scope.checklistData[i].checked;
                        $scope.checkListRec['QueDesc_' + id] = $scope.checklistData[i].checkListRemarks;
                    }
                } else {
                    $scope.checklistData = [];
                }
                //Films array creation
                var films = res.data.HITService.message.consumableFilmsList[0]['com.napier.ris.vo.transactions.ConsumableFilms'];
                if (films != undefined) {
                    var filmsfinalArray = [];
                    var filmsarrayNew;
                    if (typeof(films.length) != 'undefined') {
                        filmsarrayNew = films;
                    } else {
                        filmsfinalArray.push(films);
                        filmsarrayNew = filmsfinalArray;
                    }
                    $scope.filmsDetails = filmsarrayNew;

                    var filmsLen = $scope.filmsDetails.length;
                    for (var k = 0; k < filmsLen; k++) {
                        var id = $scope.filmsDetails[k].filmCode;
                        $scope.consumableFilms['seqId_' + id] = $scope.filmsDetails[k].filmSeqId;
                        $scope.consumableFilms['used_' + id] = $scope.filmsDetails[k].usedFilmQuantity;
                        $scope.consumableFilms['reason_' + id] = $scope.filmsDetails[k].filmReason;
                    }
                } else {
                    $scope.filmsDetails = [];
                }
                // Contrast array creation
                var contrast = res.data.HITService.message.consumableConstrastList[0]['com.napier.ris.vo.transactions.ConsumableContrast'];
                if (contrast != undefined) {
                    var contrastfinalArray = [];
                    var contrastarrayNew;
                    if (typeof(contrast.length) != 'undefined') {
                        contrastarrayNew = contrast;
                    } else {
                        contrastfinalArray.push(contrast);
                        contrastarrayNew = contrastfinalArray;
                    }
                    $scope.contrastDetails = contrastarrayNew;

                    var contrastLen = $scope.contrastDetails.length;
                    for (var j = 0; j < contrastLen; j++) {
                        var id = $scope.contrastDetails[j].contrastCode;
                        $scope.consumableContrast['seqId_' + id] = $scope.contrastDetails[j].contrastSeqId;
                        $scope.consumableContrast['used_' + id] = $scope.contrastDetails[j].usedQuantity;
                        $scope.consumableContrast['reason_' + id] = $scope.contrastDetails[j].filmReasons;
                    }
                } else {
                    $scope.contrastDetails = [];
                }
            })
        }



        /*----------------Technician popup---------------*/
        $scope.checkList = function(data, value, statusCode) {
            $scope.modalInstance = hisModalService.open('TECHNICIAN WORKFLOW', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-Technician.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
            var setOrderSqID = '',
                setinvesCode = '';
            setOrderSqID = data.orderDetailId;
            setinvesCode = data.inves_Code;
            var ReSeqId = data.rgSeqId;
            $scope.patientbanner(ReSeqId);
            $scope.checklistFilmsConsumbles(setinvesCode, data.testCode, setOrderSqID); // Check list , Films , Consumbles
            $scope.whatClassIsIt(); // Add required class           

            var date = new Date();
            var currentDate = moment(date).format("YYYY-MM-DD") + 'T' + moment().format("HH:mm:ss.SSS") + 'Z';
            $scope.invDet.Investigation = data.investigationName;
            $scope.invDet.Location = data.department;
            $scope.invDet.Modality = data.modility;
            $scope.invDet.clinicalRemarks = data.remarks;
            $scope.invDet.toDateOptions = (data.scheduledTimes) ? data.scheduledTimes : currentDate
            $scope.invDet.orderId = data.orderSeqId;
            $scope.invDet.orderDetailId = data.orderDetailId;
            $scope.invDet.regseqid = data.rgSeqId;
            if (statusCode == 3) {
                $scope.invDet.Pcode = statusCode;
                $scope.invDet.Ccode = "";
            } else {
                $scope.invDet.Pcode = "";
                $scope.invDet.Ccode = statusCode;
            }

        }

        /*---------------------- In-progress AND Complete ---------------------------*/
        $scope.inProgCompAbort = function(invDet, checkListRec, checkListRec1, checkListRemarks, consumableFilms, consumableContrast, queGrp, methods) {
            /*----methods name on based of button click-----*/
            if (methods == 'inProgress') {
                var methodName = "orderWorkListProgress";
                var remarks = checkListRemarks.Remarks;
                var cancelledBy = JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID;
                var completeStatus = 4;
            } else if (methods == 'Complete') {
                var methodName = "orderWorkListProgress";
                var remarks = checkListRemarks.Remarks;
                var cancelledBy = JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID;
                var completeStatus = 5;
            } else if (methods == 'Abort') {
                var methodName = "abortInvestigations";
                var remarks = checkListRemarks.Remarks;
                var cancelledBy = JSON.parse(sessionStorage.userContextObj).USER_SEQ_ID;
                var completeStatus = 1;
            }
            /*----------- check list array creation ---------------*/
            var objCheckList = null;
            var arrCheckList = [];
            var keysCheckList = Object.keys(checkListRec).sort();
            if (keysCheckList.length == 3) {
                var len = keysCheckList.length / 3;
                for (var i = 0; i < keysCheckList.length; i++) {
                    if (i < len) {
                        var seqid = keysCheckList[i].split("_");
                        if (checkListRec['QueSeqId_' + seqid[1]] == true) {
                            objCheckList = {
                                "@class": "com.napier.ris.vo.transactions.CheckListTransactionVo",
                                "checkSeqNo": checkListRec['QueSeqNo_' + seqid[1]],
                                "checkListSeqNo": seqid[1],
                                "orderDetailSeqId": invDet.orderDetailId,
                                "checkListRemarks": checkListRec['QueDesc_' + seqid[1]]
                            };
                            arrCheckList.push(objCheckList);
                        }
                    }
                }
            } else {
                var len = keysCheckList.length / 3;
                for (var i = 0; i < keysCheckList.length; i++) {
                    if (i < len) {
                        var seqid = keysCheckList[i].split("_");
                        if (checkListRec['QueSeqId_' + seqid[1]] == true) {
                            objCheckList = {
                                "@class": "com.napier.ris.vo.transactions.CheckListTransactionVo",
                                "checkSeqNo": checkListRec['QueSeqNo_' + seqid[1]],
                                "checkListSeqNo": seqid[1],
                                "orderDetailSeqId": invDet.orderDetailId,
                                "checkListRemarks": checkListRec['QueDesc_' + seqid[1]]
                            };
                            arrCheckList.push(objCheckList);
                        }
                    }
                }
            }

            //console.log(arrCheckList);    // check list array
            /*------------ Films list array creation -----------------*/
            var objfilms = null;
            var arrfilms = [];
            var keysfilms = Object.keys(consumableFilms).sort();
            if (keysfilms.length == 3) {
                var len = keysfilms.length / 3;
                for (var i = 0; i < keysfilms.length; i++) {
                    if (i < len) {
                        var seqid = keysfilms[i].split("_");
                        objfilms = {
                            "@class": "com.napier.ris.vo.transactions.ConsumableFilms",
                            "filmsOrderSeqId": invDet.orderDetailId,
                            "filmSeqId": consumableFilms['seqId_' + seqid[1]],
                            "filmCode": seqid[1],
                            "filmQuantity": consumableFilms['used_' + seqid[1]],
                            "filmReason": consumableFilms['reason_' + seqid[1]],
                            "status": {
                                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                                "code": 1
                            }
                        };
                        arrfilms.push(objfilms)
                    }
                }
            } else {
                var len = keysfilms.length / 3;
                for (var i = 0; i < keysfilms.length; i++) {
                    if (i < len) {
                        var seqid = keysfilms[i].split("_");
                        objfilms = {
                            "@class": "com.napier.ris.vo.transactions.ConsumableFilms",
                            "filmsOrderSeqId": invDet.orderDetailId,
                            "filmSeqId": consumableFilms['seqId_' + seqid[1]],
                            "filmCode": seqid[1],
                            "filmQuantity": consumableFilms['used_' + seqid[1]],
                            "filmReason": consumableFilms['reason_' + seqid[1]],
                            "status": {
                                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                                "code": 1
                            }
                        };
                        arrfilms.push(objfilms)
                    }
                }
            }

            //console.log(arrfilms);    // films list array
            /*------------ contrast list array creation -----------------*/
            var objcontrast = null;
            var arrcontrast = [];
            var keyscontrast = Object.keys(consumableContrast).sort();
            if (keyscontrast.length == 3) {
                var len = keyscontrast.length / 3;
                for (var i = 0; i < keyscontrast.length; i++) {
                    if (i < len) {
                        var seqid = keyscontrast[i].split("_");
                        objcontrast = {
                            "@class": "com.napier.ris.vo.transactions.ConsumableContrast",
                            "contrastOrderSeqId": invDet.orderDetailId,
                            "contrastSeqId": consumableContrast['seqId_' + seqid[1]],
                            "contrastCode": seqid[1],
                            "contrastQuantity": consumableContrast['used_' + seqid[1]],
                            "filmReasons": consumableContrast['reason_' + seqid[1]],
                            "contrastStatus": {
                                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                                "code": 1
                            }
                        };
                        arrcontrast.push(objcontrast)
                    }
                }
            } else {
                var len = keyscontrast.length / 3;
                for (var i = 0; i < keyscontrast.length; i++) {
                    if (i < len) {
                        var seqid = keyscontrast[i].split("_");
                        objcontrast = {
                            "@class": "com.napier.ris.vo.transactions.ConsumableContrast",
                            "contrastOrderSeqId": invDet.orderDetailId,
                            "contrastSeqId": consumableContrast['seqId_' + seqid[1]],
                            "contrastCode": seqid[1],
                            "contrastQuantity": consumableContrast['used_' + seqid[1]],
                            "filmReasons": consumableContrast['reason_' + seqid[1]],
                            "contrastStatus": {
                                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                                "code": 1
                            }
                        };
                        arrcontrast.push(objcontrast)
                    }
                }
            }

            //console.log(arrcontrast); // contrast list array

            var date = new Date();
            var currentDate = moment(date).format("YYYY-MM-DD");

            var urlParams = {};
            urlParams.url = "HISServices/HISServices";
            urlParams.requestData = {
                "operation": methodName, //"orderWorkListProgress",
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyService",
                "message": {
                    "@class": "com.napier.ris.vo.transactions.OrderWorkListVo",
                    "orderDetailSeqId": invDet.orderDetailId,
                    "orderDetailId": invDet.orderId,
                    "clinicalRemarks": invDet.clinicalRemarks,
                    "modality": invDet.Modality,
                    "remarks": remarks,
                    "completeStatus": completeStatus,
                    "cancelledBy": cancelledBy,

                    "checkListTransations": {
                        "com.napier.ris.vo.transactions.CheckListTransactionVo": arrCheckList
                    },
                    "consumableFilmsList": {
                        "com.napier.ris.vo.transactions.ConsumableFilms": arrfilms
                    },
                    "consumableConstrastList": {
                        "com.napier.ris.vo.transactions.ConsumableContrast": arrcontrast
                    }
                }
            }

            CallManager.sendRestRequest(urlParams).then(function(res) {
                $scope.result = res.data;
                if ($scope.result.HITService.message.errorCode == 60421) {
                    //An Error Occured,Please Try Again
                    var message = $scope.result.HITService.message.errorMessage;
                    hisAlertService.hisAlertMulti('failure', "Failure", message, "", "", "");
                } else if ($scope.result.HITService.message.errorCode == 2038) {
                    var message = $scope.result.HITService.message.errorMessage;
                    hisAlertService.hisAlertMulti('warning', "Warning!", message, "", "", "");
                } else {
                    if (methods == 'inProgress') {
                        var message = "Investigation is In-Progress";
                    }
                    if (methods == 'Complete') {
                        var message = "Investigation is completed";
                    }
                    if (methods == 'Abort') {
                        var message = "Aborted successfully";
                    }
                    hisAlertService.hisAlertMulti('success', "Success", message, "", "", "");
                    $uibModalStack.dismissAll();
                    var dep = $scope.orderWList.department.CODE;
                    var subdep = $scope.orderWList.subDepartment.SUB_CODE;
                    var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                    var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                    if ($scope.loaderFlag) {
                        $scope.searchOrderWorklist($scope.globalFormVal, $scope.globalValid);
                    } else {
                        $scope.loadDefault(subdep, dep, fromdate, todate);
                    }
                    $scope.staticorderlist(subdep, dep);
                }
            }, function(err) {
                hisAlertService.failure("Failed", err);
            })

        }
        /*------------ Abort popup ------------------*/
        $scope.abort = function(invDet, checkListRec, checkListRec1, checkListRemarks, consumableFilms, consumableContrast, queGrp, methods) {
            $scope.invDetGlobal = invDet;
            $scope.checkListRecGlobal = checkListRec;
            $scope.checkListRec1Global = checkListRec1;
            $scope.checkListRemarksGlobal = checkListRemarks;
            $scope.consumableFilmsGlobal = consumableFilms;
            $scope.consumableContrastGlobal = consumableContrast;
            $scope.queGrpGlobal = queGrp;
            $scope.methodsGlobal = methods;
            $scope.abortDetailsGlobal = {};
            $scope.modalInstance = hisModalService.open('ABORT', {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'search-service-modals-popups',
                templateUrl: 'app/consumer/his17_1/RIS/screens/templates/RIS-abort.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });
            $scope.abortDetailsGlobal.by = JSON.parse(sessionStorage.userContextObj).LOGIN_NAME;
        }
        $scope.confirmAbort = function(btnClcik, abort) {
            $scope.abortDetailsGlobal = abort;
            if (btnClcik == 'yes') {
                $scope.inProgCompAbort($scope.invDetGlobal, $scope.checkListRecGlobal, $scope.checkListRec1Global, $scope.checkListRemarksGlobal, $scope.consumableFilmsGlobal, $scope.consumableContrastGlobal, $scope.queGrpGlobal, $scope.methodsGlobal);
            } else if (btnClcik == 'no') {
                var openedModal = $uibModalStack.getTop();
                $uibModalStack.dismiss(openedModal.key);
            }
        }

        /*---------------- Append class dynamically ------------*/
        $scope.whatClassIsIt = function(cls) {
            if (cls == 1)
                return "req-field"
            else
                return "req-field-hidden req-field";
        }

        /*------------------------------------------------------- Technician Screen end here --------------------------------------*/
        /*----Search Order Worklist---*/
        $scope.searchOrderWorklist = function(formData, formValid) {
            $timeout(function() {
                $scope.globalFormVal = formData;
                $scope.globalValid = formValid;
                if (!formValid.$valid) {
                    $scope.showErrors = true;
                    $scope.showErrorsMore = true;
                }
                if (formValid.$valid) {
                    $scope.staticorderlist(formData.subDepartment.SUB_CODE, formData.department.CODE);
                    $scope.mainArray = [];
                    $scope.loader = true;
                    $scope.loaderFlag = true;
                    var message = {
                        "@class": "com.napier.ris.vo.transactions.SearchParameters",
                        "orderfromDate": moment(formData.fromDate._d).format("YYYY-MM-DD") + 'T' + "00:00:00.000" + 'Z',
                        "orderToDate": moment(formData.toDate._d).format("YYYY-MM-DD") + 'T' + "23:59:59.000" + 'Z',
                        "userId": JSON.parse(sessionStorage.userContextObj).LOGIN_NAME,
                        "deptCode": formData.department.CODE, //20
                        "subDepartment": formData.subDepartment.SUB_CODE, //758230509
                        "patientType": (formData.patientType == "" || formData.patientType === null) ? undefined : formData.patientType, //1
                        "patientSearch": {
                            "@class": "com.napier.ris.vo.masters.PatientSearch",
                            "rgIntMrNo": (formData.mrNumber == "" || formData.mrNumber === null) ? undefined : formData.mrNumber, //NH17000313
                            "priorityCode": (formData.priority == "" || formData.priority === null) ? undefined : formData.priority, //2
                            "admIpNo": (formData.ipNumber == "" || formData.ipNumber === null) ? undefined : formData.ipNumber, //"IP17000113",
                            "patientName": (formData.patName == "" || formData.patName === null) ? undefined : formData.patName //"IPpatienttwo"

                        },
                        "order": {
                            "@class": "com.napier.ris.vo.masters.InvestigationOrderType",
                            "orderNo": (formData.orderNumber == "" || formData.orderNumber === null) ? undefined : formData.orderNumber //"DG1702005788"
                        },
                        "orderStatus": {
                            "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                            "code": (formData.status == "" || formData.status === null) ? undefined : formData.status //20
                        },
                        "investigation": {
                            "@class": "com.napier.ris.vo.masters.Investigation"
                        }
                    };

                    var urlParams = {};
                    urlParams.url = "HISServices/HITService";
                    urlParams.requestData = {
                        "operation": "getRisWorkListPatientWiseDetails",
                        "messageId": "",
                        "destination": "com.napier.ris.service.external.RadiologyOrderService",
                        "message": message
                    };
                    CallManager.sendRestRequest(urlParams).then(function(res) {
                        $scope.loader = false;
                        if (res.data.HITService.message.risOrder) {
                            var results = res.data.HITService.message.risOrder[0]["com.napier.ris.vo.transactions.RISOrder"];
                            if (results instanceof Array) {
                                $scope.mainArray = results;
                            } else {
                                $scope.mainArray = [results];
                            }
                        } else {
                            hisAlertService.hisAlertMulti('information', "Information!", "No result found!", "", "", "");
                        }
                    })
                }

            }, 100);
        }
        /*$scope.loadModalityRelatedData = function() {
            $Console.log("--printing log------in load modality master");


        }*/



        /*------button for button----*/
        $scope.loadButtonGrid = function(val) {
            var buttonObj = {
                "@class": "com.napier.core.service.vo.query.QueryData",
                "queryList": [{
                    "com.napier.core.service.vo.query.Query": [{
                        "identifier": "GET-RIS-NEXT-ACTIVITY",
                        "idxList": [{
                            "com.napier.core.service.vo.query.Index": [{
                                    "paramName": "pUID",
                                    "value": JSON.parse(sessionStorage.userContextObj).LOGIN_NAME
                                },
                                {
                                    "paramName": "pTaskId",
                                    "value": "T_RIS_ORDER_WORK_LIST"
                                },
                                {
                                    "paramName": "pflseqid",
                                    "value": val.statusCode
                                }
                            ]
                        }]
                    }]
                }]
            }
            var urlParams = {};
            urlParams.url = BILLING_APIS.HISCOMBOFILLING.URL;
            urlParams.requestData = {
                operation: "ExecuteQuery",
                destination: "QueryService",
                message: buttonObj
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var results = res.data.HITService.message.queryList[0]["com.napier.core.service.vo.query.Query"]
                    .rowList[0]["com.napier.core.service.vo.query.Row"];
                $scope.buttonList = results;
            })
        }

        /*---show uploaded file for result entry---*/
        $scope.showuploaderFile = function(docSeqId,nameDoc) {
			debugger;
            var urlParams = {};
            urlParams.url = "HISServices/HISServices";
            urlParams.requestData = {
                "operation": "retrieveDocumentById",
                "messageId": "",
                "destination": "com.napier.core.fileupload.service.external.FileUploadServiceImpl",
                "message": {
                    "@class": "com.napier.core.service.vo.uploadfile.NapierDocument",
                    "docSeqId": docSeqId
                },
            }
            CallManager.sendRestRequest(urlParams).then(function(res) {
            debugger;
            var results=res.data.HITService.message;
                if (results.docExtension == "png" || results.docExtension == "PNG" || results.docExtension == "jpg" || results.docExtension == "JPG" || results.docExtension == "jpeg" || results.docExtension == "JPEG") {
                    $scope.modalInstance = hisModalService.open('View File', {
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        windowClass: 'search-service-modals-popups',
                        templateUrl: 'app/consumer/his17_1/RIS/screens/templates/Ris-show-file.html',
                        size: 'lg',
                        scope: $scope,
                        backdrop: 'static',
                        keyboard: false
                    });
                    $scope.docNameAnno = nameDoc;
                    $scope.docSeqAnno = results.docSeqId;
					
                    var DocString = results.uploadDocumnt[0];
					var someText = DocString.replace(/(\r\n|\n|\r)/gm,"");
					var AnnoDocString = results.annotationDocument[0];
					var AnnoDocText = AnnoDocString.replace(/(\r\n|\n|\r)/gm,"");
					
					
					$rootScope.Ris={};
					var dotFormat = results.docName;
					$scope.dotFormat2 = dotFormat.split('.')[1];
					var DocStringConcat1 = "data:image/jpeg;base64,";
					$rootScope.Ris.docFileLink = DocStringConcat1 + someText;
					$scope.imageData = DocStringConcat1 + AnnoDocText; // annotations
					$scope.imageAnno = DocStringConcat1 + someText; //image
					$scope.docname = dotFormat;
                }else {
                    $window.open($rootScope.Ris.docFileLink, "windowName");
                    //hisAlertService.hisAlertMulti('warning', "Warning!", "Something went wrong! please try again", "", "", "");
                }


            })


        }

		$scope.saveAnnotions = function(){
			debugger;
			var dt = $scope.drawComponent.getBitmapData();
			if(dt == null)
				var anno = "";
			else
				var anno = dt;
			
			 var message = {
                "@class": "com.napier.core.service.vo.uploadfile.NapierDocument",
				"docName": $scope.docNameAnno,
				"docSeqId": $scope.docSeqAnno,
				"annotationDocument": anno,
				"modifiedDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
				"modifiedBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
            }
            var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "updateAnnotationDocument",
                "messageId": "",
                "destination": "com.napier.core.fileupload.service.external.FileUploadServiceImpl",
                "message": message
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var results = res.data.HITService.message;
				if(results.docSeqId !=''){
					hisAlertService.hisAlertMulti('success', "Success", "Successfully updated annotations", "", "", "");
					var openedModal = $uibModalStack.getTop();
					$uibModalStack.dismiss(openedModal.key);
				}else{
					hisAlertService.failure("Failed", "Service failed");
				}
            }, function(err) {
                hisAlertService.failure("Failed", "Failed to updated annotations");
            })
	
		}

        /*---delete uploaded file for result entry---*/
        $scope.deleteuploaderFile = function(docSeqId, index) {
            debugger;
            var urlParams = {};
            urlParams.url = "HISServices/HISServices";
            urlParams.requestData = {
                "operation": "removeDocumentList",
                "messageId": "",
                "destination": "com.napier.core.fileupload.service.external.FileUploadServiceImpl",
                "message": {
                    "@class": "com.napier.core.service.vo.uploadfile.NapierDocumentList",
                    "napierDocumentList": [{
                        "com.napier.core.service.vo.uploadfile.NapierDocument": [{
                            "@class": "com.napier.core.service.vo.uploadfile.NapierDocument",
                            "docSeqId": docSeqId,
                            "facilityId": "1  ",
                            "practiceId": "Napier123"
                        }]
                    }]
                },
            }
            CallManager.sendRestRequest(urlParams).then(function(res) {
                $scope.itemsUploadedFiles.splice(index, 1);

            })

        }


        $scope.itemsUploadedFiles = [];
        $scope.uploadMethod = function(uploadData) {
            var verifymessage = {
                "@class": "com.napier.core.service.vo.uploadfile.NapierDocumentList",
                "napierDocumentList": [{
                    "com.napier.core.service.vo.uploadfile.NapierDocument": [{
                        "@class": "com.napier.core.service.vo.uploadfile.NapierDocument",
                        "docName": $scope.file.name,
                        "docExtension": $scope.file.type.split('/')[1],
                        "context": 12,
                        "contextDetailMaster": {
                            "@class": "com.napier.core.service.vo.uploadfile.ContextDetailMaster",
                            "code": 32,
                            "description": "Radiology Result Image"
                        },
                        "referenceId": $scope.resultentry.orderDetailId,
                        "prmryEntityId": $scope.resultentry.orderDetailId,
                        "facilityId": "1",
                        "uploadDocumnt": uploadData,
                        "docCreatedDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
                        "docUploadedDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
                        "docTypeSeqId": 32,
                        "createdDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
                        "createdBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
                        "modifiedDate": moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
                        "modifiedBy": angular.fromJson(sessionStorage.userContextObj).USER_SEQ_ID,
                        "status": 1,
                        "machineIp": angular.fromJson(sessionStorage.userContextObj).WORKSTATION
                    }]
                }]
            }
            var urlParams = {};
            urlParams.url = APIS.HITSERVICE.URL;
            urlParams.requestData = {
                operation: "storeDocumentList",
                messageId: "",
                destination: "com.napier.core.fileupload.service.external.FileUploadServiceImpl",
                //voclass: "com.napier.core.service.vo.billing.PatientAdditionalDetailsList",
                "message": verifymessage,


            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
                var results = res.data.HITService.message;
                $scope.uploadResult = results;
                $scope.itemsUploadedFiles.push(results.napierDocumentList[0]["com.napier.core.service.vo.uploadfile.NapierDocument"]);


                // $scope.bulkResponse = res.data.HITService.message.corporateServiceListVo[0]["com.napier.core.service.vo.emrmasters.CorporateServiceListVo"];
            }, function(res) {



            });


        }
        $scope.uploadedFiles = [];
        $scope.uploadFiles = function(files) {
            if (files && files.length) {
                $scope.uploadedFiles.push(files[0]);
                $scope.items = $scope.uploadedFiles;
                var file = files[0];
                $scope.file = file;

                var fileExtTypeArray = $scope.file.name.split('.');
                var fileExtType = fileExtTypeArray[fileExtTypeArray.length - 1];
                var r = null;
                var docValidTypeArray = ['jpg','JPG', 'gif','GIF', 'jpeg','JPEG', 'tif','TIF', 'tiff', 'bmp', 'BMP','png','PDF'];
                if (docValidTypeArray.indexOf(fileExtType) >= 0) {
                    if (file.size <= 5244601) {
                        r = new window.FileReader();
                        r.onloadend = (function(f) {
                            return function(e) {
                                var contents = e.target.result;
                                var uploadData = contents.split(',')[1];
                                $scope.uploadData = uploadData;
                                $scope.uploadMethod(uploadData);
                                $scope.isUploadContentSet = true;
                            };
                        })(file);
                        r.readAsDataURL(file);
                    } else {
                        file = null;
                        return;
                    }
                } else {
                    file = null;
                    return;
                }

                /*for (var i = 0; i < files.length; i++) {
          Upload.upload({..., data: {file: files[i]}, ...});
                }*/
            }
        }

          $scope.stepsModel = [];
    /*-----------print PDF ----------------*/
    var printObj = 'printPDFCtrl';
    $scope.printPDF = function(data,val) {
        debugger;
        var returnObj = {       
            pOrderDtSeqId:data.orderDetailId,
            pOrderData:data
        };
        PrintService.printReportModal(printObj, 'lg', 'PDF', returnObj);
        $timeout(function() {
            var dep = $scope.orderWList.department.CODE;
            var subdep = $scope.orderWList.subDepartment.SUB_CODE;
            var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
            var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
            if ($scope.loaderFlag) {
                $scope.searchOrderWorklist($scope.globalFormVal, $scope.globalValid);
            } else {
                $scope.loadDefault(subdep, dep, fromdate, todate);
            }
            $scope.staticorderlist(subdep, dep);
        }, 1000);

      
    }; 

    $scope.printPdfForResultEntry=function(dataValPrint){

        debugger;
        var returnObj = {       
            pOrderDtSeqId:dataValPrint.orderDetailId,
            pOrderData:dataValPrint
        };
        PrintService.printReportModal(printObj, 'lg', 'PDF', returnObj);
        
    
    }
    /*---------------function for ReportDispatch----------*/

 $scope.reportDispatchSave= function(reportDispatch) {
 debugger;
var messageBody={

"@class": "com.napier.ris.vo.transactions.ReportDelivery",
            "resultEntryId": reportDispatch.resultEntryId,
            "deliveryBy": reportDispatch.dispatchBy,
            "deliveryTo": reportDispatch.isPatent,
            "deliveryDate":  moment(new Date()).format("YYYY-MM-DD HH:mm:ss.000") + ' IST',
            "orderSeqId": reportDispatch.orderSeqId,
            "orderDetailSeqId": reportDispatch.orderDetailSeqId,
            "isStaff": reportDispatch.isStaffandPatient,
            "isSendSms":"Y", 
            "investigationDetailsForOrder": {
            "@class": "com.napier.ris.vo.transactions.InvestigationDetailsForOrder",
             "orderDetailSeqId": reportDispatch.orderDetailSeqId
            },
            "status": {
                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                "code": 10
            }
}

var urlParams = {};
            urlParams.url = "HISServices/HITService";
            urlParams.requestData = {
                "operation": "saveReportDelivery",
                "messageId": "",
                "destination": "com.napier.ris.service.external.RadiologyReportingService",
                "message": messageBody
            };
            CallManager.sendRestRequest(urlParams).then(function(res) {
              debugger;
                        var dep = $scope.orderWList.department.CODE;
                        var subdep = $scope.orderWList.subDepartment.SUB_CODE;
                        var fromdate = moment($scope.orderWList.fromDate._d).format("YYYY-MM-DD");
                        var todate = moment($scope.orderWList.toDate._d).format("YYYY-MM-DD");
                        hisAlertService.hisAlertMulti('success', "Success", "Result Dispatch Successfully", "", "", "");
                         $uibModalStack.dismissAll();
                        if ($scope.loaderFlag) {
                            $scope.searchOrderWorklist($scope.globalFormVal, $scope.globalValid);
                        } else {
                            $scope.loadDefault(subdep, dep, fromdate, todate);
                        }
                        $scope.staticorderlist(subdep, dep);
                })

        }
  }
   
  /*--------------- Print Controller --------------*/
 function printPDFCtrl($uibModalInstance, $uibModalStack, selectedPrintType, QueryService, PrintService, $sce, $scope, $rootScope, CallManager, IPINDENTAPIS, APIS, $window, returnObj) {

    $scope.cancel = function() {
      //$uibModalInstance.dismiss('cancel');
      var openedModal = $uibModalStack.getTop();
      $uibModalStack.dismiss(openedModal.key);
    }
    $scope.printParameterList = new Array();   
    QueryService.prepareParamList('pOrderDtSeqId',  (returnObj.pOrderDtSeqId != undefined)?returnObj.pOrderDtSeqId : "", $scope.printParameterList);
    $scope.printObject = {};
    $scope.printObject["reportId"] = 'RADIOLOGY-INFORMATION-REPORT';
    $scope.printObject["destination"] = 'reportingServiceImpl';
    $scope.printObject["reportType"] = {
      "@class": "com.napier.report.type.ReportType",
      "id": selectedPrintType == 'PDF' ? 4 : 5,
      "desc": selectedPrintType 
    };
    $scope.printObject["paramsList"] = $scope.printParameterList;
    PrintService.printReportFunction($scope.printObject, $scope);

    $scope.printStatus = function(pdata){
        var message = {
            "@class": "com.napier.ris.vo.transactions.RadiologyReport",
            "orderStatus": {
                "@class": "com.napier.core.service.vo.masters.GeneralMaster",
                "code": pdata.statusCode
            },
            "investigationDetailsForOrder": {
                "orderDetailSeqId": pdata.orderDetailId
            },
            "resultEntryId":pdata.resultEntityId
        }
        var urlParams = {};
        urlParams.url = "HISServices/HITService";
        urlParams.requestData = {
            "operation": "printReport",
            "messageId": "",
            "destination": "com.napier.ris.service.external.RadiologyResultService",
            "message": message
        };
        CallManager.sendRestRequest(urlParams).then(function(res) {
            var results = res.data.HITService.message;
        }, function(err) {
            hisAlertService.failure("Failed", "Failed to change print status");
        })
    }
    $scope.printStatus(returnObj.pOrderData);
  }; 

    
})();