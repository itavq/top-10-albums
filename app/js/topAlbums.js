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
      topAlbumsURL = baseReqURL + '&method=user.getTopAlbums' + '&period=12month';

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

window.MOCK = function() { return {
"artist": {
    "url": "https://www.last.fm/music/George+Harrison",
        "name": "George Harrison",
        "mbid": "42a8f507-8412-4611-854f-926571049fa0"
},
"@attr": {
    "rank": "7"
},
"image": [
    {
        "size": "small",
        "#text": "https://lastfm-img2.akamaized.net/i/u/34s/312f904538674a70486f1e782d0d053a.jpg"
    },
    {
        "size": "medium",
        "#text": "https://lastfm-img2.akamaized.net/i/u/64s/312f904538674a70486f1e782d0d053a.jpg"
    },
    {
        "size": "large",
        "#text": "https://lastfm-img2.akamaized.net/i/u/174s/312f904538674a70486f1e782d0d053a.jpg"
    },
    {
        "size": "extralarge",
        "#text": "https://lastfm-img2.akamaized.net/i/u/300x300/312f904538674a70486f1e782d0d053a.jpg"
    }
],
    "playcount": "137",
    "url": "https://www.last.fm/music/George+Harrison/All+Things+Must+Pass+(Remastered)",
    "name": "All Things Must Pass (Remastered)",
    "mbid": "",
    "releaseYear": null
};};

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
      // deferred.reject(new Error(error));
        console.warn("could not get it..." + error);
        // deferred.reject("could not...");
        deferred.resolve(MOCK());
    } else {
        if (!data.album.wiki) {
            album.releaseYear = 2014;
            deferred.resolve(album);
        } else {
            album.releaseYear = new Date(data.album.wiki.published).getFullYear();
            deferred.resolve(album);
        }
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