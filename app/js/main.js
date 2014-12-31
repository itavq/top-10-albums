var d3 = require('d3'),
    Q = require('q'),
    topAlbums = require('./topAlbums'),
    addRank = require('./addRank'),
    barChart = require('./barChart'),
    smoothScroll = require('smooth-scroll');

var myChart = barChart(),
    loader = d3.select('.loader'),
    btnOrderRank = document.getElementById('orderByRank'),
    btnOrderCount = document.getElementById('orderByPlayCount'),
    yearFilter = 2014,
    favouriteAlbums = [
      "Our Love", //Caribou
      "You're Dead!", //Flying Lotus
      "St. Vincent", //St. Vincent
      "Oxymoron", //ScHoolboy Q
      "They Want My Soul", //Spoon
      "Do It Again", //Röyksopp & Robyn
      "Wonder Where We Land", //SBTRKT
      "Salad Days", //Mac DeMarco
      "Here and Nowhere Else", //Cloud Nothings
      "LP1" //FKA Twigs
    ];

//smooth scroll anchor links
smoothScroll.init();

//request top album data
topAlbums().done(function(albums){

  //change up the UI once data is loaded
  loader.attr('style', 'display: none;');
  btnOrderRank.setAttribute('style', 'display: inline-block;');
  btnOrderCount.setAttribute('style', 'display: inline-block;');

  /* massage data a bit */
  //reduce data to only albums matching our year filter
  albums = albums.filter(function(album){
    return Number(album.releaseYear) === yearFilter;
  });

  //actively remove a known bad data point
  //(release year for "Because the Internet" is wrong!!)
  albums = albums.filter(function(album){
    return album.name !== 'Because the Internet';
  });

  //merge in personal ranking data
  var rankedAlbums = addRank(albums, favouriteAlbums);

  //create our chart
  d3.select('#topAlbums')
    .datum(rankedAlbums)
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


});

