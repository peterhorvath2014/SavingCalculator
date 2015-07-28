'use strict';

/**
 * @ngdoc overview
 * @name savingcalculatorApp
 * @description
 * # savingcalculatorApp
 *
 * Main module of the application.
 */
angular
    .module('savingcalculatorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'gridshore.c3js.chart',
    'ui.bootstrap',
    'angular.filter',
    'angular-loading-bar',
    'ngResource',
    'hateoas'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'scripts/diagramFeature/diagramView.html',
                controller: 'DiagramCtrl',
                controllerAs: 'diagram'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(['HateoasInterceptorProvider', function (HateoasInterceptorProvider) {
        HateoasInterceptorProvider.transformAllResponses();
    }]);