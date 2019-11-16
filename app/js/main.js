var d3 = require('d3'),
    Q = require('q'),
    topAlbums = require('./topAlbums'),
    addRank = require('./addRank'),
    barChart = require('./barChart'),
    data = require('./nbaStaticData');

var myChart = barChart(),
    loader = d3.select('.loader'),
    btnOrderRank = document.getElementById('orderByRank'),
    btnOrderCount = document.getElementById('orderByPlayCount'),
    btnTest = document.getElementById('test');

//smooth scroll anchor links
// smoothScroll.init();

//request top album data
// topAlbums().done(function(albums){

  //change up the UI once data is loaded
  loader.attr('style', 'display: none;');
  btnOrderRank.setAttribute('style', 'display: inline-block;');
  btnOrderCount.setAttribute('style', 'display: inline-block;');
  btnTest.setAttribute('style', 'display: inline-block;');


(function doShow(){
  //create our chart
  d3.select('#topAlbums')
    .datum(data.stats)
    .call(myChart);

  //chart controls
  btnOrderRank.addEventListener('click', function(){
    myChart.orderByRank();
    btnOrderCount.setAttribute('class', '');
    btnOrderRank.setAttribute('class', 'inactive');
  });

  btnOrderCount.addEventListener('click', function(){
    myChart.orderByPlayCount();
    btnOrderRank.setAttribute('class', '');
    btnOrderCount.setAttribute('class', 'inactive');
  });

    btnTest.addEventListener('click', function(){
        myChart.test();
        btnOrderCount.setAttribute('class', '');
        btnOrderRank.setAttribute('class', 'inactive');
    });

})();

