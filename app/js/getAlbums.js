var d3 = require('d3');

var apiRoot = 'http://ws.audioscrobbler.com/2.0/',
    apiKey = '7d9430aeb83e28c80128853dbbf10850',
    lastfmUser = 'janiejjones',
    topAlbums = [],
    filteredAlbums = [];

var baseReqURL = apiRoot + '?format=json&api_key=' + apiKey + '&user=' + lastfmUser;

function getAlbums(callback){

  var topAlbumsURL = baseReqURL + '&method=user.getTopAlbums' + '&period=12month';

  //request top albums
  d3.json(topAlbumsURL, function(data){
    topAlbums = data.topalbums.album;

    //filter by year here

    callback(topAlbums);
  });
}

function filterByYear(albums, year, callback){
  var albumDetailsURL = baseReqURL + "&method=album.getinfo";

  for(var i=0; i < albums.length; i++){
    // if (albums[i].mbid){
    //   validateYear(albums[i].mbid, year, function(result){
    //     if (result){
    //       filteredAlbums.push(albums[i]);
    //     }
    //   });
    // }
  }
  callback(filteredAlbums);
}

function validateYear(albumID, year, callback){
  var albumDetailsURL = baseReqURL + "&method=album.getinfo" + '&mbid=' + albumID,
      isMatch = false;

  year = Number(year); //just in case a string is provided

  d3.json(albumDetailsURL, function(data){
    var releaseYear = new Date(data.album.releasedate).getFullYear();

    if (releaseYear == year){
      isMatch = true;
    }

    callback(isMatch);
  });
}

module.exports = getAlbums;