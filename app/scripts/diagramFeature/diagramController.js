'use strict';

/**
 * @ngdoc function
 * @name savingcalculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the savingcalculatorApp
 */

angular.module('savingcalculatorApp')
    .controller('DiagramCtrl', function ($scope, $log, diagramFactory, $resource) {
        function initDiagram() {
            $scope.datapoints = [];
            $scope.datacolumns = [{
                "id": "income",
                "type": "bar",
                "name": "Income",
                "color": "lightgreen"
      }, {
                "id": "expense",
                "type": "bar",
                "name": "Expense",
                "color": "#FF0099"
      }, {
                "id": "balance",
                "type": "line",
                "name": "Balance",
                "color": "#660033"
      }];
            $scope.datax = {
                "id": "x"
            };
        };

        function initDatePicker() {
            $scope.today = function () {
                $scope.financialData.targetDateFrom = new Date();
                $scope.financialData.targetDateTo = new Date();
            };

            $scope.clear = function () {
                $scope.financialData.targetDateFrom = null;
                $scope.financialData.targetDateTo = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.format = 'yyyy-M';

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 2);
            $scope.events = [{
                date: tomorrow,
                status: 'full'
      }, {
                date: afterTomorrow,
                status: 'partially'
      }];

            $scope.getDayClass = function (date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            };
        };

        function initFinancialDataForm() {
            $scope.financialDataTypes = [{
                "name": "Income",
                "class": "income",
                "cTrue": true
      }, {
                "name": "Expense",
                "class": "expense",
                "cTrue": true
      }];
            $scope.financialDataReoccurringTypes = [{
                "name": "One time",
                "class": "one-time",
                "cTrue": true
      }, {
                "name": "Monthly",
                "class": "monthly",
                "cTrue": true
      }, {
                "name": "Annually",
                "class": "annually",
                "cTrue": true
      }];
            $scope.defaultFinancialData = {
                "type": $scope.financialDataTypes[1].name,
                "reoccurringType": $scope.financialDataReoccurringTypes[0].name,
            };
            /*$scope.incomeDataType = {"financialData" : {"type":"Income"}};
            $scope.expenseDataType = {"financialData" : {"type":"Expense"}};*/
            resetForm();
        }

        function init() {
            initFinancialDataForm();
            initDatePicker();
            initDiagram();
        }
        init();

        function refreshDataPoints() {
            var FinancialData = $resource('http://peterdesktop.com:8080/financialData');
            FinancialData.get()
                .$promise.then(function (response) {
                    $log.debug(response);
                    $scope.financialDataFromDb = angular.copy(response._embedded.financialData);
                    $scope.datapoints = convertFinancialDataToDatapoint(response._embedded.financialData);
                });
            /*var promise = diagramFactory.getFinancialData();
            promise.then(function (data) {
                $scope.financialDataFromDb = angular.copy(data);
                $scope.datapoints = convertFinancialDataToDatapoint(data);
            }, function (error) {});*/
        }
        refreshDataPoints();

        $scope.removeFinancialDataFromDb = function (financialData) {
            var promise = diagramFactory.deleteFinancialData(financialData);
            promise.then(function (data) {
                refreshDataPoints();
            }, function (error) {

            });
        };

        $scope.saveFinancialData = function () {
            var promise;
            if ($scope.financialData._links) {
                promise = diagramFactory.updateFinancialData($scope.financialData);
            } else {
                promise = diagramFactory.insertNewFinancialData($scope.financialData);
            }
            promise.then(function (data) {
                resetForm();
                refreshDataPoints();
            }, function (error) {

            });
        };

        $scope.loadFinancialDataIntoWorkingArea = function (financialData) {
            $scope.financialData = angular.copy(financialData);
        }

        $scope.loadFinancialDataIntoWorkingAreaWithoutId = function (financialData) {
            var duplicatedFinancialData = angular.copy(financialData);
            delete duplicatedFinancialData._links;
            $scope.financialData = angular.copy(duplicatedFinancialData);
        }

        $scope.toggleShow = function (financialDataWrapper) {
            var promise;
            if (financialDataWrapper) {
                if (financialDataWrapper.financialData.show) {
                    financialDataWrapper.financialData.show = false;
                } else {
                    financialDataWrapper.financialData.show = true;
                }
                promise = diagramFactory.updateFinancialData(financialDataWrapper.financialData, financialDataWrapper._id);
            }
            promise.then(function (data) {
                resetForm();
                refreshDataPoints();
            }, function (error) {

            });
        }

        $scope.toggleShowGroup = function (financialDataWrapperGroups) {
            angular.forEach(financialDataWrapperGroups, function (value, key) {
                $scope.toggleShow(value);
            });
        }

        function resetForm() {
            $scope.financialData = angular.copy($scope.defaultFinancialData);
        }

        $scope.resetForm = function () {
            resetForm();
        };

        function findMinMaxDate(financialData) {
            var maxes = [];
            angular.forEach(financialData, function (value, key) {
                if (value.financialData.reoccurringType == 'One time') {
                    this.push(value.financialData.targetDateFrom);
                } else {
                    this.push(value.financialData.targetDateTo);
                }
            }, maxes);
            maxes.sort(function (a, b) {
                return Date.parse(a) - Date.parse(b);
            });
            var maxT = maxes[maxes.length - 1];


            var mins = [];
            angular.forEach(financialData, function (value, key) {
                this.push(value.financialData.targetDateFrom);
            }, mins);
            mins.sort(function (a, b) {
                return Date.parse(a) - Date.parse(b);
            });
            var minT = mins[0];

            var minMax = {
                "minDate": new Date(minT),
                "maxDate": new Date(maxT).setMonth(new Date(maxT).getMonth() + 1)
            }
            return minMax;
        }

        function getSummary(financialData, actualMonth, financialDataType) {
            var result = 0;
            angular.forEach(financialData, function (data) {

                if (data.financialData.reoccurringType == 'One time' && data.financialData.type == financialDataType) {
                    if (actualMonth.getMonth() == data.financialData.inflationMonth) {
                        data.financialData.amount = data.financialData.amount * (1 + data.financialData.inflation / 100);
                    }
                    var storedTargetDateFrom = new Date(data.financialData.targetDateFrom);
                    if (storedTargetDateFrom.getYear() == actualMonth.getYear() &&
                        storedTargetDateFrom.getMonth() == actualMonth.getMonth()) {
                        result += parseInt(data.financialData.amount);
                    }
                } else if (data.financialData.type == financialDataType) {
                    if (actualMonth.getMonth() == data.financialData.inflationMonth) {
                        data.financialData.amount = data.financialData.amount * (1 + data.financialData.inflation / 100);
                    }
                    var storedTargetDateFrom = new Date(data.financialData.targetDateFrom);
                    var storedTargetDateTo = new Date(data.financialData.targetDateTo);
                    if (
                        (
                            (storedTargetDateFrom.getYear() == actualMonth.getYear() && storedTargetDateFrom.getMonth() <= actualMonth.getMonth()) ||
                            (storedTargetDateFrom.getYear() < actualMonth.getYear())
                        ) &&
                        (
                            (storedTargetDateTo.getYear() == actualMonth.getYear() && storedTargetDateTo.getMonth() >= actualMonth.getMonth()) ||
                            (storedTargetDateTo.getYear() > actualMonth.getYear())
                        )
                    ) {

                        if (data.financialData.reoccurringType == 'Monthly') {
                            result += parseInt(data.financialData.amount);
                        } else if ((data.financialData.reoccurringType == 'Annually') && (new Date(data.financialData.targetDateFrom).getMonth() == actualMonth.getMonth())) {
                            result += parseInt(data.financialData.amount);
                        }
                    }
                }
            }, result)
            return result;
        }

        function getIncomeSummary(financialData, actualMonth) {
            return getSummary(financialData, actualMonth, "Income");
        }

        function getExpenseSummary(financialData, actualMonth) {
            return getSummary(financialData, actualMonth, "Expense")
        }

        function getBalanceSummary(financialData, actualMonth) {
            return 10;
        }

        function convertFinancialDataToDatapoint(financialData) {
            var actualFinancialData = [];
            angular.forEach(financialData, function (value, key) {
                if (value.show) {
                    this.push({
                        "financialData": value
                    });
                }
            }, actualFinancialData);
            var minMaxDates = findMinMaxDate(actualFinancialData);
            var result = [];
            /*var x_labels = [];*/
            var actualMonth = minMaxDates.minDate;
            var balanceSummary = 0;
            for (actualMonth; actualMonth < minMaxDates.maxDate; actualMonth.setMonth(actualMonth.getMonth() + 1)) {
                var incomeSummary = getIncomeSummary(actualFinancialData, actualMonth);
                var expenseSummary = getExpenseSummary(actualFinancialData, actualMonth);
                balanceSummary += incomeSummary;
                balanceSummary -= expenseSummary;
                var actualPush = {
                    "x": new Date(actualMonth),
                    "income": incomeSummary,
                    "expense": expenseSummary,
                    "balance": balanceSummary
                };
                /*x_labels.push(new Date(actualMonth));*/
                result.push(actualPush);
            }
            /*result.push({
                x_labels
            });*/
            return result;
        };
    });