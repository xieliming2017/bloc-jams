

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
        setSong(songNumber);
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
          setSong(songNumber);
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

 var $albumTitle = $('.album-view-title');
 var $albumArtist = $('.album-view-artist');
 var $albumReleaseInfo = $('.album-view-release-info');
 var $albumImage = $('.album-cover-art');
 var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album) {
    currentAlbum = album;
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

 // var nextSong = function(){
 //   var indexOfPlayingSong = trackIndex(currentAlbum,currentSongFromAlbum);
 //   if(indexOfPlayingSong === currentAlbum.songs.length-1){
 //     indexOfPlayingSong = 0;
 //   }
 //   else {
 //     indexOfPlayingSong ++;
 //   }
 //   var lastSongNumber = currentlyPlayingSongNumber;
 //   setSong(indexOfPlayingSong+1);
 //   updatePlayerBarSong();
 //   var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
 //    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);;
 //
 //    $nextSongNumberCell.html(pauseButtonTemplate);
 //    $lastSongNumberCell.html(lastSongNumber);
 // };
 //
 // var previousSong = function(){
 //   var indexOfPlayingSong = trackIndex(currentAlbum,currentSongFromAlbum);
 //   if(indexOfPlayingSong === 0){
 //     indexOfPlayingSong = currentAlbum.songs.length-1;
 //   }
 //   else {
 //     indexOfPlayingSong--;
 //   }
 //   var lastSongNumber = currentlyPlayingSongNumber;
 //   setSong(indexOfPlayingSong+1);
 //   updatePlayerBarSong();
 //   $('.main-controls .play-pause').html(playerBarPauseButton);
 //   var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
 //    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
 //
 //    $previousSongNumberCell.html(pauseButtonTemplate);
 //    $lastSongNumberCell.html(lastSongNumber);
 // }

 var switchSong = function(){
   var lastSongNumber = currentlyPlayingSongNumber;
   var currrentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
   var buttonType = $(this).attr('class');
   if(buttonType == "previous"){
     if(currrentSongIndex == 0){
       currrentSongIndex = currentAlbum.songs.length-1;
     }else {
       currrentSongIndex--;
     }
   }
   else if(buttonType == 'next'){
     if(currrentSongIndex == currentAlbum.songs.length-1){
       currrentSongIndex = 0;
     } else {
       currrentSongIndex++;
     }
   }
   setSong(currrentSongIndex+1);
   updatePlayerBarSong();
   $('.main-controls .play-pause').html(playerBarPauseButton);
   var $comingSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   $comingSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
 }

 var updatePlayerBarSong = function(){
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

 };

 var setSong = function(songNumber){
    var number = songNumber;
    if(number > currentAlbum.length || number < 1){
      number =1;
    }
    currentlyPlayingSongNumber = number;
    currentSongFromAlbum = currentAlbum.songs[number-1];
 }

 var getSongNumberCell = function(number){
    var songNo = number;
    if(songNo < 1 || songNo > currentAlbum.length){
      songNo = 1;
    }
    var songNumberCell = $('.song-item-number[data-song-number="' + songNo + '"]');
    return songNumberCell;
 }


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
   $previousButton.click(switchSong);
   $nextButton.click(switchSong);

  var albums = [albumPicasso, albumMarconi, albumDaVinci];
  var index = 1;
  $albumImage.click(function(event){
    setCurrentAlbum(albums[index]);
    index++;
    if(index == albums.length){
      index = 0;
    }
  });
 });
