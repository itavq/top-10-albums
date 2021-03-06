var d3 = require('d3'),
    stateMachine = require('./stateMachine');

function barChart(){
  var width = 1000,
      barHeight = 25,
      numBars = 20,
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
        return Number(d.d);
      });

      var height = (barHeight + barMargin) * numBars,
          outerHeight = height + chartMargin.top + chartMargin.bottom,
          outerWidth = width + chartMargin.left + chartMargin.right;

      var svg = d3.select(this)
        .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('transform', 'translate(' + chartMargin.left + ',' + chartMargin.top + ')');

      var x = d3.scaleLinear()
        .domain([0, d3.max(playCounts)])
        .range([0, width]);

      window.itz_x = x;

      var y = d3.scaleBand()
        .domain(d3.range(1, numBars + 1))
        .range([0, height]);

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
          return x(d.d);
        })
        .attr('height', barHeight)
        // .attr('transform', 'translate(' + thumbWidth + ',' + ((barHeight + barMargin)/2) + ')');
        .attr('transform', 'translate(0,' + barMargin/4 + ')');

      bar.append('image')
        .attr('width', thumbWidth)
        .attr('height', thumbWidth)
        .attr('y', barMargin/4)
        .attr('xlink:href', function(d){
          return d.image[0]['#text'];
        });

      var barText = bar.append('text')
        .attr('x', function(d){
          return x(d.d);
        })
        .attr('y', barMargin/4 + barHeight)
        .attr('dy', '1em')
        .attr('x', 3);

      barText.append('tspan')
        .attr('class', 'albumName')
        .text(function(d){
          return d.name;
        });

      // barText.append('tspan')
      //   .attr('class', 'artist')
      //   .attr('dx', 10)
      //   .text(function(d){
      //     return d.artist.name;
      //   });

        var barVal = bar.append('text')
            .attr('x', function(d){
                return x(d.d) - 20;
            })
            // .attr('y', barMargin/4 + barHeight)
            .attr('dy', '2em');
            //.attr('x', 70);

        barVal.append('tspan')
            .attr('class', 'albumName')
            .text(function(d){
                return d.d;
            });

      //axes!
      var xAxis = d3.axisBottom()
          .scale(x)
          .tickSize(5, 1)
          .tickPadding(5);

      var yAxis = d3.axisLeft()
          .scale(y)
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
          .attr('fill', 'url(#coolGradient)')
          .attr('transform', function(d, i){
              return 'translate(0,' + (3 - i) * (25 + 35) + ')';
          });
          // .attr('width', function(d) {
          //     return window.itz_x(d.playcount);
          // });
    return chart;
  };

  chart.test = function () {
      window.d3 = d3;

      function doStep() {
          d3.selectAll(".album>rect")
              .transition()
              .duration(2000)
              .attr("width", function (d, i) {
                  // console.log(d.name + " " + itz_x(d.d));
                  return itz_x(stateMachine.getVal(i));
              });

          d3.selectAll('.album')
              .transition()
              .duration(2000)
              .attr('transform', function (d, i) {
                  var rank = stateMachine.getRank(i);
                  return 'translate(0,' + rank * (25 + 35) + ')';
              });

          stateMachine.step();
      }

      var interval = setInterval(function() {
          if (!stateMachine.exceeded()) {
              doStep();
          } else {
              clearInterval(interval);
          }
      },3000);

      return chart;
  };

  chart.orderByPlayCount = function() {
    d3.selectAll('.album')
    .transition().duration(1500)
    .attr('fill', 'url(#coolGradient)')
    .attr('transform', function(d, i){
      return 'translate(0,' + i * (barHeight + barMargin) + ')';
    });

    return chart;
  };

  return chart;
}

module.exports = barChart;