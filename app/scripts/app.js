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
        templateUrl: 'views/home.html',
        controller: 'NytChartsCtrl'
      })
      .when('/aboutme', {
        templateUrl: 'views/aboutme.html',
        controller: 'NytChartsCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'NytChartsCtrl'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'NytChartsCtrl'
      })
      .when('/contactme', {
        templateUrl: 'views/contactme.html',
        controller: 'NytChartsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
