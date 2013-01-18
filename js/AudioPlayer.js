//var GW = GW || {};
AudioPlayer = function(playlist) {
    var currentSong = 0;
    var prevSong = undefined;
    var player = undefined;
    var settings = {
        player:             '#audio_player',
        btnPlayPause:       '#btn_play_pause',
        btnPrev:            '#btn_prev',
        btnNext:            '#btn_next',
        playlistBrowser:    '#playlist',
        progress:           '#progress',
        seek:               '#seek',
        playlistElement:    'p',
        albumArt:           '#album_art',
        playEvent:          'click'
    };

    // Public Methods

    this.init = function(options) {
        $.extend(settings, options);
        player = $(settings.player).get(0);
        var playlistHtml = '';
        for (i = 0, j=playlist.length; i < j; i++) {
            playlistHtml += '<' + settings.playlistElement + '>' + playlist[i].title + '</' + settings.playlistElement + '>';
        }
        $(settings.playlistBrowser).html(playlistHtml)
        bindEvents();
        loadTrack(0);
    };

    this.play = function(track) {
        if(track === undefined) track = 0;
        loadTrack(track);
        // make sure file is loaded enough to play
        console.log(player.readyState);

        console.log('payl');
        if(player.readyState != 4) {
            console.log('add listener');
            player.addEventListener('canplay', onTrackReady);
        } else {
            onTrackReady();
        }
        currentSong = track;
    };

    this.next = function() {
        if( currentSong < ( playlist.length - 1 ) ) {
            this.play(currentSong + 1);
        } else {
            this.play(0);
        }
    };

    this.prev = function() {
        if( currentSong > 0) {
            this.play(currentSong -1);
        } else {
            this.play(playlist.length-1);
        }
    };

    // Private Methods

    var self = this;

    function onTrackReady() {
        console.log('canplay');
        player.play();
        showPause();
        console.log('call after play');
        console.log('duration', player.duration);
        $(settings.seek).attr('max',player.duration);
        prevSong = currentSong;
        player.removeEventListener('canplay');
    }

    function loadTrack(track) {
        $('#now_playing .song_title').text(playlist[track].title);
        player.src = playlist[track].file;
        player.load();
        console.log(player);
        $(settings.albumArt).attr('src', playlist[track].art);
    };

    function showPlay() {
        $(settings.btnPlayPause + ' span').removeClass('icon-pause').addClass('icon-play');
    }
    function showPause() {
        console.log('do toggle!');
        $(settings.btnPlayPause + ' span').removeClass('icon-play').addClass('icon-pause');
    };

    function bindEvents() {        
        $(settings.playlistBrowser)
            .on(settings.playEvent,  settings.playlistElement, function() {
                console.log('playing', $(this).index());
                self.play($(this).index());
            });

        $(settings.btnPlayPause).on(settings.playEvent, function() {
            if(player.paused) {
                if(player.currentTime > 0) {
                    player.play();    
                } else {
                    self.play(self.currentSong);        
                }
            } else {
                player.pause();
            }
            // toggle play/pause
            $(settings.btnPlayPause + ' span').toggleClass('icon-play icon-pause');
        });

        $(settings.btnNext).on(settings.playEvent, function() {
            showPlay();
            self.next();
        });

        $(settings.btnPrev).on(settings.playEvent, function() {
            showPlay();
            self.prev();
        });

        $(settings.seek).on('change', function() {
            player.currentTime = $(this).val();
            $(this).attr("max", player.duration);
        });

        player.addEventListener('timeupdate', function(e) {
            $(settings.progress).text(friendlyTimeFormat(player.currentTime));
            $(settings.seek).attr('value', parseInt(player.currentTime, 10));
        });
    };

    function friendlyTimeFormat(uglyTime) {
        var time = Math.floor(uglyTime);
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        if((seconds + '').length < 2) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    };

};
