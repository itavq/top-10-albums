function rank(albums, ranking){
  for (var i = 0; i < albums.length; i++){
    var match = ranking.indexOf(albums[i].name);
    if (match > -1){
      albums[i].rank = match + 1;
    } else {
      albums[i].rank = 999;
    }
  }
  return albums;
}

module.exports = rank;