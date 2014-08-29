/*
	Basic Bar Chart Directive (Made with D3)
	----------------------------------------

	data: an array of objects with "barHeight" specified for each

	config: an associative array of config options, all optional
		direction (up or down facing bar chart)
		height (in pixels, on output)
		color (color of the bars)
		title (label displayed above the y-axis)
		textSize (size of the text in the label above the y-axis)
		axisTextSize (size of the tick labels on the y-axis)
		maxValue (the maximum data value to use, controls the scale of the plot)

	Insert into html as follows:
		<div d3-basic-bar data="dataVar" config="configVar"></div>
*/

angular.module('daniellerothermelcomApp')
.directive('d3BasicBar', ['$window', '$timeout', 'd3Service', 
  function ($window, $timeout, d3Service) {
  	'use strict';
    return {
      restrict: 'A',
      scope: {
      	data: '=', //bi-directional data-binding
      	config: '='
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

        	// Definitions from Config
        	var direction = scope.config.direction || 'up';
        	var	height = parseInt(scope.config.height) || 250;
			var	color = scope.config.color || 'DarkBlue';
			var title = scope.config.title || 'Insert Label Here';
			var textSize = scope.config.textSize || 14;
			var axisTextSize = scope.config.axisTextSize || 14;

			// Setup SVG and Scales & Axes
			var svg = d3.select(ele[0]).append('svg')
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

			scope.render = function (data) {
				var width, chartWidth, barWidth, textY, topPad;
				var maxValue, numDigits, numDecimals, axisWidth, textWidth, barPadding;
				var textHeight, yLabelDist, leftPad, yLabelPad, yNonLabelPad, chartHeight;
				var yfxn, hfxn;
				var yaxisg;

				if (!data) {
        			return;
        		}

        		svg.selectAll('*').remove();

        		// Setup Padding
        		maxValue = scope.config.maxValue || d3.max(data, function(d){
										        					return d.barHeight + d.barHeight*.1;
										        				  });

				numDigits = Math.floor(Math.log(maxValue)/Math.log(10)) + 1;
				numDecimals = Math.ceil(numDigits/3) - 1;

				axisWidth = 10;
				textWidth = (axisTextSize/2+1) * numDigits + (axisTextSize/2+1) * 0.5 * numDecimals;

				textHeight = textSize*.75;
				yLabelDist = 5;

				leftPad = axisWidth + textWidth;
				yLabelPad = textHeight + yLabelDist;
				yNonLabelPad = axisTextSize/2;

				barPadding = 2;

				// Define chart width and height
				chartHeight = height - yLabelPad - yNonLabelPad;

				width = d3.select(ele[0]).node().offsetWidth;
				chartWidth = width - leftPad;
				barWidth = (chartWidth - barPadding)/data.length - barPadding;

				// Differentiate between up and down facing bar plots
				if ( direction === "down" ) {
					topPad = yNonLabelPad;
					textY = chartHeight + yLabelDist;
					yScale.domain([0, maxValue])
							.range([0, chartHeight]);
					yfxn = function (d){
								return topPad;
							};
					hfxn = function (d){
								return yScale(d.barHeight);
							};
				} else {
					topPad = yLabelPad;
					textY = - textHeight - yLabelDist;
					yScale.domain([maxValue, 0])
							.range([0, chartHeight]);
					yfxn = function (d){
								return topPad + yScale(d.barHeight);
							};
					hfxn = function (d){
								return chartHeight - yScale(d.barHeight);
							};
				}

				// Create the bars
				svg.selectAll('rect')
	        			.data(data)
	        			.enter()
	        			.append('rect')
	        			.attr('x', function(d,i){
	        				return leftPad + barPadding + i * (barWidth + barPadding);
	        			})
	        			.attr('y', yfxn)
	        			.attr('width', barWidth)
	        			.attr('height', hfxn)
	        			.attr('fill', color);

	        	// Define and style y-axis
	        	yAxis.scale(yScale).orient('left').ticks(height/30);
	        	yaxisg = svg.append('g')
	        			.attr('transform', 'rotate(-90)')
	        			.attr('transform', 'translate(' + leftPad + ',' + topPad + ')')
	        			.call(yAxis);

	        	yaxisg.selectAll('path').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				yaxisg.selectAll('line').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				yaxisg.selectAll('text').style('font-family', 'sans-serif').style('font-size', axisTextSize);

				yaxisg.append('text')
					   	.attr('y', textY)
					   	.attr('x', -5)
					   	.style('text-anchor', 'start')
					   	.style('alignment-baseline', 'hanging')
					   	.style('font-size', textSize)
					   	.text(title);

			};// scope.render = function(data)

        });// then(service function{});
      }};// return{link: function{}};
}]); // directive('name'[attrs, function {}]);