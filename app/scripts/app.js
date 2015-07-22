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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/diagramFeature/diagramView.html',
        controller: 'DiagramCtrl',
        controllerAs: 'diagram'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
