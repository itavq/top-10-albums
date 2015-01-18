var d3 = require('d3'),
    Q = require('q');

var apiRoot = 'http://ws.audioscrobbler.com/2.0/',
    apiKey = '7d9430aeb83e28c80128853dbbf10850',
    lastfmUser = 'janiejjones',
    topAlbums = [],
    filteredAlbums = [];

var baseReqURL = apiRoot + '?format=json&api_key=' + apiKey + '&user=' + lastfmUser;

function getAlbums(){
  var deferred = Q.defer(),
      topAlbumsURL = 'playcounts2014.json';

  //request top albums
  d3.json(topAlbumsURL, function(error, data){
    if (error){
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(data.topalbums.album);
    }
  });

  return deferred.promise;
}

function addReleaseYear(album){

  var deferred = Q.defer(),
      albumDetailsURL = baseReqURL + "&method=album.getinfo" + '&mbid=' + album.mbid;

  //don't bother if it's not cataloged properly in last.fm
  if (!album.mbid){
    album.releaseYear = null;
    deferred.resolve(album);
  }

  d3.json(albumDetailsURL, function(error, data){
    if (error || data.error){
      deferred.reject(new Error(data.error + album.name));
    } else {
      var releaseYear = new Date(data.album.releasedate).getFullYear();
      album.releaseYear = releaseYear;
      deferred.resolve(album);
    }
  });

  return deferred.promise;
}


function getTopAlbums(){
  return getAlbums()
  .then(function(albums){
    return Q.all(albums.map(addReleaseYear));
  });
}

module.exports = getTopAlbums;