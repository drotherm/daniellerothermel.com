angular.module('daniellerothermelcomApp')
.directive('d3BasicBar', ['$window', '$timeout', 'd3Service', 
  function ($window, $timeout, d3Service) {
  	'use strict';
    return {
      restrict: 'A',
      scope: {
      	data: '=', //bi-directional data-binding
      	maxvalue: '='
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

        	// Variable Declarations
        	var direction = attrs.direction || 'up';
        	var	height = parseInt(attrs.height) || 250;
			var	color = attrs.color || 'DarkBlue';
			var title = attrs.title || 'Insert Label Here';
			var vertMargin = 6;
			var htextPadding = 30;
			var textPadding = 60;

			var	barPadding = 2;
			var	initBarHeight = 20;

			var maxBarHeight = height - 2*vertMargin - htextPadding;

        	var svg = d3.select(ele[0])
        		.append('svg')
        		.style('width', '100%')
        		.attr('height', height);

        	var yScale = d3.scale.linear();
			var yAxis = d3.svg.axis();

        	//reapply scope on resize
        	window.onresize = function () {
        		scope.$apply();
        	};

        	//re-render on resize
        	scope.$watch(function(){
        		return angular.element($window)[0].innerWidth;
        	}, function() {
        		scope.render(scope.data);
        	});

        	//watch for data changes and re-render
			scope.$watch('data', function(newVals, oldVals) {
			  	return scope.render(newVals);
			}, true);

        	if (direction === 'down'){
        		scope.render = function (data) {
        			var width, chartWidth, barWidth, maxValue;
        			
        			if (!data) {
        				return; 
        			}

	        		svg.selectAll('*').remove();

					width = d3.select(ele[0]).node().offsetWidth;
					chartWidth = width - barPadding - 1.2 * textPadding;
	        		barWidth = chartWidth/data.length - barPadding;
	        		maxValue = scope.maxvalue || d3.max(data, function(d){
										        					return d.barHeight;
										        				});

	        		yScale.domain([0, maxValue])
	        				.range([0, maxBarHeight]);

	        		svg.selectAll('rect')
	        			.data(data)
	        			.enter()
	        			.append('rect')
	        			.attr('x', function(d,i){
	        				return textPadding + barPadding + i * (barWidth + barPadding);
	        			})
	        			.attr('y', vertMargin)
	        			.attr('width', barWidth)
	        			.attr('height', initBarHeight)
	        			.attr('fill', color)
	        			.transition()
	        				.duration(1000)
	        				.attr('height', function(d){
	        					return yScale(d.barHeight);
	        				});

	        		yAxis.scale(yScale).orient('left').ticks(height/30);

	        		svg.append('g')
	        			.attr('transform', 'rotate(-90)')
	        			.attr('transform', 'translate(' + textPadding + ',' + vertMargin + ')')
	        			.call(yAxis)
	        		   .append('text')
					   	.attr('class', 'axislabel')
					   	.attr('y', maxBarHeight + vertMargin)
					   	.attr('x', -7)
					   	.attr('dy', '.71em')
					   	.style('text-anchor', 'beginning')
					   	.text(title);


	        	};// scope.render()
	        	
        	} else {
	        	scope.render = function(data) {
	        		var width, chartWidth, barWidth, maxValue;
	        		
	        		if (!data) {
	        			return;
	        		}

	        		svg.selectAll('*').remove();

					width = d3.select(ele[0]).node().offsetWidth;
					chartWidth = width - barPadding - 1.2 * textPadding;
	        		barWidth = chartWidth/data.length - barPadding;
	        		maxValue = scope.maxvalue || d3.max(data, function(d){
						        					return d.barHeight;
						        				});

        			yScale.domain([maxValue, 0])
        				.range([0, + maxBarHeight]);

	        		svg.selectAll('rect')
	        			.data(data)
	        			.enter()
	        			.append('rect')
	        			.attr('x', function(d,i){
	        				return textPadding + barPadding + i * (barWidth + barPadding);
	        			})
	        			.attr('y', htextPadding + vertMargin + maxBarHeight - initBarHeight)
	        			.attr('width', barWidth)
	        			.attr('height', initBarHeight)
	        			.attr('fill', color)
	        			.transition()
	        				.duration(1000)
	        				.attr('height', function(d){
	        					return yScale(maxValue - d.barHeight);
	        				})
	        				.attr('y', function(d){
	        					return htextPadding + vertMargin + maxBarHeight - yScale(maxValue - d.barHeight);
	        				});

	        		yAxis.scale(yScale).orient('left').ticks(height/30);

	        		svg.append('g')
	        			.attr('transform', 'rotate(-90)')
	        			.attr('transform', 'translate(' + textPadding + ',' + (htextPadding + vertMargin) +')')
	        			.call(yAxis)
	        		   .append('text')
					   	.attr('class', 'axislabel')
					   	.attr('y', -15)
					   	.attr('x', -7)
					   	.attr('dy', '.71em')
					   	.style('text-anchor', 'beginning')
					   	.text(title);

	        	}; //scope.render(){};
        	} //else{}

        });// then(service function{});
      }};// return{link: function{}};
}]); // directive('name'[attrs, function {}]);