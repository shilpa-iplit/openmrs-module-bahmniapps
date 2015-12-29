'use strict';

angular.module('bahmni.common.displaycontrol.chronicTreatmentChart').directive('chronicTreatmentChart', ['$translate','spinner','DrugService',
    function ($translate, spinner, DrugService) {
        var link = function ($scope, element, attrs) {
            $scope.config = $scope.isOnDashboard ? $scope.section.dashboardParams : $scope.section.allDetailsParams;
            var patient = $scope.patient;

            var init = function () {
                //var programConfig = appService.getAppDescriptor().getConfigValue("program") || {};
                //var startDate = null, endDate = null, getOtherActive;
                //if (programConfig.showDashBoardWithinDateRange) {
                //    startDate = $stateParams.dateEnrolled;
                //    endDate = $stateParams.dateCompleted;
                //}

                return DrugService.getRegimen(patient.uuid, $scope.config.drugs, $scope.startDate, $scope.endDate).success(function (data) {
                    $scope.regimen = data;
                });
            };

            $scope.getAbbreviation = function(concept){
                var result;

                if(concept && concept.mappings && concept.mappings.length > 0 && $scope.section.headingConceptSource){
                    result = _.result(_.find(concept.mappings, {"source": $scope.section.headingConceptSource}),"code");
                    result = $translate.instant(result);
                }

                return result || concept.shortName || concept.name;
            };

            $scope.isMonthNumberRequired = function(){
                var month = $scope.regimen && $scope.regimen.rows && $scope.regimen.rows[0] && $scope.regimen.rows[0].month;
                return month;
            };

            $scope.isClickable = function () {
                return $scope.isOnDashboard && $scope.section.allDetailsParams;
            };

            $scope.dialogData = {
                "patient": $scope.patient,
                "section": $scope.section
            };

            spinner.forPromise(init());
        };
        return {
            restrict: 'E',
            link: link,
            scope: {
                patient: "=",
                section: "=",
                isOnDashboard: "=",
                startDate: "=",
                endDate: "="
            },
            templateUrl: '../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html'
        }
    }]);