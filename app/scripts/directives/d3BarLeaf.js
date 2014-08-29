/*
	Bar and Leaves Chart Directive (Made with D3)
	----------------------------------------

	data: an array of objects with "h1" and "h2" specified, indicating the
		   height of each type for a given location.

	config: an associative array of config options, all optional
		no options yet

	Insert into html as follows:
		<div d3-bar-leaf data="dataVar"></div>
*/

angular.module('daniellerothermelcomApp')
.directive('d3BarLeaf', ['$window', '$timeout', 'd3Service', 
  function ($window, $timeout, d3Service) {
  	'use strict';
    return {
      restrict: 'A',
      scope: {
      	data: '=', //bi-directional data-binding
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var xscale = d3.scale.linear()
							.range([0, width]).nice();

			var yscale = d3.scale.linear()
							.range([height, 0]).nice();

			var xAxis = d3.svg.axis()
							.scale(xscale)
							.orient("bottom");

			var yAxis = d3.svg.axis()
							.scale(yscale)
							.orient("left");

			var svg = d3.select("body").append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
					  .append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			/*
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
			*/

        	//watch for data changes and re-render
			scope.$watch('data', function(newVals, oldVals) {
			  	return scope.render(newVals);
			}, true);

        	scope.render = function(data) {
        		var ymax, ymin, yrange;

				if (!data) {
        			return;
        		}

        		svg.selectAll('*').remove();

				//Axes Scale
				ymax = d3.max([
					d3.max(d3.values(data), function(d){ return d.h1; }),
					d3.max(d3.values(data), function(d){ return d.h2; })
				]);

				ymin = d3.min([
					d3.min(d3.values(data), function(d){ return d.h1; }),
					d3.min(d3.values(data), function(d){ return d.h2; })
				]);

				yrange = ymax - ymin;

				yscale.domain([ymin - (yrange/10.0) , ymax*1 + (yrange/10.0) ]);
				xscale.domain([.6, d3.values(data).length + .4]);

				//Lines
				svg.selectAll("line").data(d3.values(data)).enter().append("line")
					.attr("x1", function(d,i){ return xscale(i+1); })
					.attr("y1", function(d,i){ return yscale(d.h1)})
					.attr("x2", function(d,i){ return xscale(i+1); })
					.attr("y2", function(d,i){ return yscale(d.h2)})
					.style('stroke','black')
					.style('stroke-width',2);

				//Iphone Plot
				svg.selectAll("circle.type1").data(d3.values(data)).enter().append("circle")
					.attr("cx", function(d, i){
						return xscale(i+1);
					})
					.attr("cy", function(d){
						return yscale(d.h1);
					})
					.attr("r", 8)
					.style('fill','Maroon')
					.style('stroke', 'black')
					.style('stroke-width', 1);

				//Ipad Plot
				svg.selectAll("circle.type2").data(d3.values(data)).enter().append("circle")
					.attr("cx", function(d, i){
						return xscale(i+1);
					})
					.attr("cy", function(d){
						return yscale(d.h2);
					})
					.attr("r", 8)
					.style('fill','DarkBlue')
					.style('stroke', 'black')
					.style('stroke-width', 1);

				//Add Axes
				xAxis.ticks(d3.values(data).length);
				yAxis.ticks(d3.values(data).length);

				var xaxisg = svg.append("g")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				xaxisg.selectAll('path').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				xaxisg.selectAll('line').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				xaxisg.selectAll('text').style('font-family', 'sans-serif').style('font-size', '14px');

				xaxisg.append("text")
				   	.attr("x", width)
				   	.attr("y", -6)
				   	.style("text-anchor", "end")
				   	.text("Blast Number (Chronological)");

				var yaxisg = svg.append("g")
					.call(yAxis);

				yaxisg.selectAll('path').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				yaxisg.selectAll('line').style('fill', 'none').style('stroke', 'black').style('shape-rendering', 'crispEdges');
				yaxisg.selectAll('text').style('font-family', 'sans-serif').style('font-size', '14px');

				yaxisg.append("text")
				   	.attr("transform", "rotate(-90)")
				   	.attr("y", 6)
				   	.attr("dy", ".71em")
				   	.style("text-anchor", "end")
				   	.text("Number of User Deletes (Iphone = Blue, Ipad = Red)");
        	}; //scope.render(){};

        });// then(service function{});
      }};// return{link: function{}};
}]); // directive('name'[attrs, function {}]);