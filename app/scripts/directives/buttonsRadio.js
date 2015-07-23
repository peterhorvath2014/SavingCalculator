"use strict"
angular.module('savingcalculatorApp')
    .directive('buttonsRadio', function($log) {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '='
            },
            controller: function($scope) {
                $scope.activate = function(option) {
                    $scope.model = option;
                };
            },
            template: "<label class='btn' " +
                "ng-class='{true: option.class, false : \"\"}[option.cTrue]'" +
                "ng-repeat='option in options' " +
                "ng-model='model' " +
                "ng-click='activate(option.name)' " +
                "btn-radio='option.name'>{{option.name}}" +
                "</label>"
        };
    });