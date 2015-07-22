'use strict';

/**
 * @ngdoc function
 * @name savingcalculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the savingcalculatorApp
 */
angular.module('savingcalculatorApp')
  .controller('DiagramCtrl', function($scope, $log, diagramFactory) {

    $scope.dream = {};

    function refreshDataPoints() {
      var promise = diagramFactory.getFinancialData();
      promise.then(function(data) {
        $log.debug(data);
        $scope.datapoints = data;
      }, function(error) {

      });
    }
    refreshDataPoints();
    
     $scope.saveFinancialData = function(dream) {
            var promise;
            if ($scope._id) {
                promise = diagramFactory.updateFinancialData($scope.dream, $scope._id);
            }
            else {
                promise = diagramFactory.insertNewFinancialData($scope.dream);
            }
            promise.then(function(data) {
                resetForm();
                refreshDataPoints();
            }, function(error) {

            });
        };

    function resetForm() {
      $scope.dream = {};
      $scope._id = undefined;
    }

    $scope.datacolumns = [{
      "id": "top-1",
      "type": "bar",
      "name": "Income",
      "color": "lightgreen"
    }, {
      "id": "top-2",
      "type": "bar",
      "name": "Outlay",
      "color": "#FF0099"
    }];
    $scope.datax = {
      "id": "x"
    };

    $scope.today = function() {
      $scope.dream.targetDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.dream.targetDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.format = 'yyyy-MMMM';

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

    $scope.getDayClass = function(date, mode) {
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
  });
