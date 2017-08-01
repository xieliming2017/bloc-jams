

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

    var $row = $(template);

    var clickHandler = function(){

      var songNumber = parseInt($(this).attr('data-song-number'));
      if(currentlyPlayingSongNumber === null){
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1];
        updatePlayerBarSong();

      }else if(currentlyPlayingSongNumber === songNumber){
        $(this).html(playButtonTemplate);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
        $('.main-controls .play-pause').html(playerBarPlayButton);

      }else if(currentlyPlayingSongNumber !== songNumber){
          var currentlyPlayingCell = $('.song-item-number[data-song-number = "'+currentlyPlayingSongNumber+'"]' );
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
          $(this).html(pauseButtonTemplate);
          currentlyPlayingSongNumber = songNumber;
          currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1];
          updatePlayerBarSong();
      }

    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;

 };

var setCurrentAlbum = function(album) {
    currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song){
   return album.songs.indexOf(song);
 }

 var nextSong = function(){
   var indexOfPlayingSong = trackIndex(currentAlbum,currentSongFromAlbum);
   if(indexOfPlayingSong === currentAlbum.songs.length-1){
     indexOfPlayingSong = 0;
   }
   else {
     indexOfPlayingSong ++;
   }
   var lastSongNumber = currentlyPlayingSongNumber;
   currentlyPlayingSongNumber = indexOfPlayingSong + 1;
   currentSongFromAlbum = currentAlbum.songs[indexOfPlayingSong];
   updatePlayerBarSong();
   var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
 };

 var previousSong = function(){
   var indexOfPlayingSong = trackIndex(currentAlbum,currentSongFromAlbum);
   if(indexOfPlayingSong === 0){
     indexOfPlayingSong = currentAlbum.songs.length-1;
   }
   else {
     indexOfPlayingSong --;
   }
   var lastSongNumber = currentlyPlayingSongNumber;
   currentlyPlayingSongNumber = indexOfPlayingSong + 1;
   currentSongFromAlbum = currentAlbum.songs[indexOfPlayingSong];
   updatePlayerBarSong();
   $('.main-controls .play-pause').html(playerBarPauseButton);
   var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
 }

 var updatePlayerBarSong = function(){
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);

  //  var clickCount = 0;
  //   $albumImage.click(function (){
  //     clickCount++;
  //     if(clickCount%3 == 0){
  //       setCurrentAlbum(albumPicasso);
  //     } else if (clickCount%3 ==1) {
  //       setCurrentAlbum(albumMarconi);
  //     } else if (clickCount%3 == 2) {
  //       setCurrentAlbum(albumDaVinci);
  //     } else {
  //       setCurrentAlbum(albumDaVinci);
  //     }
  //   });
 });
