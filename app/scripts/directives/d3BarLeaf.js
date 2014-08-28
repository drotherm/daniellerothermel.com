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
					.attr("class", "line")
					.attr("x1", function(d,i){ return xscale(i+1); })
					.attr("y1", function(d,i){ return yscale(d.h1)})
					.attr("x2", function(d,i){ return xscale(i+1); })
					.attr("y2", function(d,i){ return yscale(d.h2)});

				//Iphone Plot
				svg.selectAll("circle.type1").data(d3.values(data)).enter().append("circle")
					.attr("class", "type1")
					.attr("cx", function(d, i){
						return xscale(i+1);
					})
					.attr("cy", function(d){
						return yscale(d.h1);
					})
					.attr("r", 8);

				//Ipad Plot
				svg.selectAll("circle.type2").data(d3.values(data)).enter().append("circle")
					.attr("class", "type2")
					.attr("cx", function(d, i){
						return xscale(i+1);
					})
					.attr("cy", function(d){
						return yscale(d.h2);
					})
					.attr("r", 8);

				//Add Axes
				xAxis.ticks(d3.values(data).length);
				yAxis.ticks(d3.values(data).length);

				svg.append("g")
					.attr("class","axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
				   .append("text")
				   	.attr("class", "axislabel")
				   	.attr("x", width)
				   	.attr("y", -6)
				   	.style("text-anchor", "end")
				   	.text("Blast Number (Chronological)");

				svg.append("g")
					.attr("class","axis")
					.call(yAxis)
				   .append("text")
				   	.attr("class", "axislabel")
				   	.attr("transform", "rotate(-90)")
				   	.attr("y", 6)
				   	.attr("dy", ".71em")
				   	.style("text-anchor", "end")
				   	.text("Number of User Deletes (Iphone = Blue, Ipad = Red)");
        	}; //scope.render(){};

        });// then(service function{});
      }};// return{link: function{}};
}]); // directive('name'[attrs, function {}]);