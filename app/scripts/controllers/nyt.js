'use strict';

angular.module('daniellerothermelcomApp')
    .controller('NytChartsCtrl', ['$scope',
        function ($scope) {
            $scope.testBHCre = [{barHeight:1}, {barHeight:4}, {barHeight:3}, {barHeight:5}, {barHeight:2},{barHeight:1}, {barHeight:4}, {barHeight:3}, {barHeight:5}, {barHeight:2},{barHeight:1}, {barHeight:4}, {barHeight:3}, {barHeight:5}, {barHeight:2}];
            $scope.testBHDel = [{barHeight:4}, {barHeight:1}, {barHeight:3}, {barHeight:2}, {barHeight:5},{barHeight:4}, {barHeight:1}, {barHeight:3}, {barHeight:2}, {barHeight:5},{barHeight:4}, {barHeight:1}, {barHeight:3}, {barHeight:2}, {barHeight:5}];
            $scope.maxBarHeight = 5.5;
            $scope.testBL = [
                {h1:2, h2:5},
                {h1:1, h2:3},
                {h1:7, h2:8},
                {h1:9, h2:1},
                {h1:9, h2:10},
                {h1:5, h2:3},
                {h1:2, h2:1},
                {h1:4, h2:9},
                {h1:1, h2:3}
            ]
        }
    ]);