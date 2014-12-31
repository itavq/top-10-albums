var d3 = require('d3');

function barChart(){
  var width = 1000,
      barHeight = 25,
      numBars = 10,
      barMargin = 35,
      thumbWidth = 25,
      chartMargin = {
        top: 20,
        left: 50,
        bottom: 70,
        right: 20
      };

  function chart(selection){

    selection.each(function(data){

      var playCounts = data.map(function(d){
        return Number(d.playcount);
      });

      var height = (barHeight + barMargin) * numBars,
          outerHeight = height + chartMargin.top + chartMargin.bottom,
          outerWidth = width + chartMargin.left + chartMargin.right;

      var svg = d3.select(this)
        .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('transform', 'translate(' + chartMargin.left + ',' + chartMargin.top + ')');

      var x = d3.scale.linear()
        .domain([0, d3.max(playCounts)])
        .range([0, width]);

      var y = d3.scale.ordinal()
        .domain(d3.range(1, numBars + 1))
        .rangeBands([0, height]);

      //group bars inside child svg to have overflow hidden effect
      var bars = svg.append('svg')
        .attr('height', height)
        .attr('class', 'bars');

      var bar = bars.selectAll('.album')
        .data(data)
        .enter().append('g')
        .attr('class', 'album')
        .attr('fill', 'url(#coolGradient)')
        .attr('transform', function(d, i){
          return 'translate(0, ' + i * (barHeight + barMargin) + ')';
        });

      bar.append('rect')
        .attr('width', function(d){
          return x(d.playcount);
        })
        .attr('height', barHeight)
        // .attr('transform', 'translate(' + thumbWidth + ',' + ((barHeight + barMargin)/2) + ')');
        .attr('transform', 'translate(0,' + barMargin/4 + ')');

      bar.append('image')
        .attr('width', thumbWidth)
        .attr('height', thumbWidth)
        .attr('y', barMargin/4)
        .attr('xlink:href', function(d){
          return d.image[1]['#text'];
        });

      var barText = bar.append('text')
        .attr('x', function(d){
          return x(d.playcount);
        })
        .attr('y', barMargin/4 + barHeight)
        .attr('dy', '1em')
        .attr('x', 3);

      barText.append('tspan')
        .attr('class', 'albumName')
        .text(function(d){
          return d.name;
        });

      barText.append('tspan')
        .attr('class', 'artist')
        .attr('dx', 10)
        .text(function(d){
          return d.artist.name;
        });


      //axes!
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .tickSize(5, 1)
          .tickPadding(5);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .tickSize(0, 1)
          .tickPadding(15);

      svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')');

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      //axis post-processing
      //(text-alignment and labels)
      svg.selectAll('.y.axis .tick text')
        .attr('dy', '0');

      svg.append('text')
        .attr('class','axisLabel')
        .attr('y', height)
        .attr('x', width/2)
        .attr('dy', '3em')
        .attr('text-anchor', 'middle')
        .text('play count');
    });
  }

  chart.orderByRank = function() {
    d3.selectAll('.album')
    .transition(700)
    .attr('fill', 'url(#warmGradient)')
    .attr('transform', function(d){
      return 'translate(0,' + (d.rank - 1) * (barHeight + barMargin) + ')';
    });

    return chart;
  };

  chart.orderByPlayCount = function() {
    d3.selectAll('.album')
    .transition(700)
    .attr('fill', 'url(#coolGradient)')
    .attr('transform', function(d, i){
      return 'translate(0,' + i * (barHeight + barMargin) + ')';
    });

    return chart;
  };

  return chart;
}

module.exports = barChart;