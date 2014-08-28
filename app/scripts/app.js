'use strict';

/**
 * @ngdoc overview
 * @name daniellerothermelcomApp
 * @description
 * # daniellerothermelcomApp
 *
 * Main module of the application.
 */
angular
  .module('daniellerothermelcomApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/nyt.html',
        controller: 'NytChartsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });