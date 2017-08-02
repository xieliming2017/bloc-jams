

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
        $playPauseButton.html(playerBarPauseButton);
        setSong(songNumber);
        updatePlayerBarSong();
        currentSoundFile.play();

      }else if(currentlyPlayingSongNumber === songNumber){
        if(currentSoundFile.isPaused()){
          $(this).html(pauseButtonTemplate);
          $playPauseButton.html(playerBarPauseButton);
          currentSoundFile.play();
        } else if(!currentSoundFile.isPaused()){
          $(this).html(playButtonTemplate);
          $playPauseButton.html(playerBarPlayButton);
          currentSoundFile.pause();
        }

      }else if(currentlyPlayingSongNumber !== songNumber){
          var currentlyPlayingCell = $('.song-item-number[data-song-number = "'+currentlyPlayingSongNumber+'"]' );
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
          $(this).html(pauseButtonTemplate);
          $playPauseButton.html(playerBarPauseButton);
          setSong(songNumber);
          updatePlayerBarSong();
          currentSoundFile.play();
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
   currentSoundFile.play();
   updatePlayerBarSong();
   $('.main-controls .play-pause').html(playerBarPauseButton);
   var $comingSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   $comingSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
 }

 var togglePlayFromPlayerBar = function(){

   if(currentSoundFile.isPaused()){
     currentSoundFile.play()
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
    }

   else if(currentSoundFile){
     getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
     $(this).html(playerBarPlayButton);
     currentSoundFile.pause();
   }


 };

 var updatePlayerBarSong = function(){
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

 };

 var setSong = function(songNumber){
    if(currentSoundFile){
      currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: ['mp3'],
      preload: true
    });

    setVolume(currentVolume);
 }

 var setVolume = function(volume){
   if(currentSoundFile){
     currentSoundFile.setVolume(volume);
   }
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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

 $(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(switchSong);
   $nextButton.click(switchSong);
   $playPauseButton.click(togglePlayFromPlayerBar);

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
