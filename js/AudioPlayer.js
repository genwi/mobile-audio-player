//var GW = GW || {};
AudioPlayer = function(playlist) {
    var _currentSong = 0;
    var _player = undefined;
    var _settings = {
        /* DOM settings */
        player:             '#audio_player',
        btnPlayPause:       '#btn_play_pause',
        btnPrev:            '#btn_prev',
        btnNext:            '#btn_next',
        playlistBrowser:    '#playlist',
        progress:           '#progress',
        seek:               '#seek',
        playlistElement:    'p',
        albumArt:           '#album_art',

        /* event triggers */
        playEvent:          'click',

        /* callbacks */
        onPlayerInit: undefined,
        onLoadTrack: undefined,
        onTrackStart: undefined
    };

    // Public Methods

    this.init = function(options) {
        $.extend(_settings, options);
        _player = $(_settings.player).get(0);
        var playlistHtml = '';
        for (i = 0, j=playlist.length; i < j; i++) {
            playlistHtml += '<' + _settings.playlistElement + '>' + playlist[i].title + '</' + _settings.playlistElement + '>';
        }
        $(_settings.playlistBrowser).html(playlistHtml)
        bindEvents();
        loadTrack(0);
        if(_settings.onPlayerInit) {
            _settings.onPlayerInit();
        }
    };

    this.play = function(track) {
        if(track === undefined) track = 0;
        loadTrack(track);
        // make sure file is loaded enough to play

        if(_player.readyState != 4) {
            _player.addEventListener('canplay', onTrackReady);
        } else {
            onTrackReady();
        }
        _currentSong = track;
    };

    this.next = function() {
        if( _currentSong < ( playlist.length - 1 ) ) {
            this.play(_currentSong + 1);
        } else {
            this.play(0);
        }
    };

    this.prev = function() {
        if( _currentSong > 0) {
            this.play(_currentSong -1);
        } else {
            this.play(playlist.length-1);
        }
    };

    this.nowPlaying = function() {
        return playlist[_currentSong];
    }
    // Private Methods

    var self = this;

    function onTrackReady() {
        if(_settings.onTrackStart) {
            _settings.onTrackStart(playlist[_currentSong]);
        }
        _player.play();
        showPause();
        $(_settings.seek).attr('max',_player.duration);
        _player.removeEventListener('canplay');
    }

    function loadTrack(track) {
        if(_settings.onLoadTrack) {
            _settings.onLoadTrack(playlist[track]);
        }
        $('#now_playing .song_title').text(playlist[track].title);
        _player.src = playlist[track].file;
        _player.load();
        $(_settings.albumArt).attr('src', playlist[track].art);
    };

    function showPlay() {
        $(_settings.btnPlayPause + ' span').removeClass('icon-pause').addClass('icon-play');
    }
    function showPause() {
        $(_settings.btnPlayPause + ' span').removeClass('icon-play').addClass('icon-pause');
    };

    function bindEvents() {        
        $(_settings.playlistBrowser)
            .on(_settings.playEvent,  _settings.playlistElement, function() {
                self.play($(this).index());
            });

        $(_settings.btnPlayPause).on(_settings.playEvent, function() {
            if(_player.paused) {
                if(_player.currentTime > 0) {
                    _player.play();    
                } else {
                    self.play(self._currentSong);        
                }
            } else {
                _player.pause();
            }
            // toggle play/pause
            $(_settings.btnPlayPause + ' span').toggleClass('icon-play icon-pause');
        });

        $(_settings.btnNext).on(_settings.playEvent, function() {
            showPlay();
            self.next();
        });

        $(_settings.btnPrev).on(_settings.playEvent, function() {
            showPlay();
            self.prev();
        });

        $(_settings.seek).on('change', function() {
            _player.currentTime = $(this).val();
            $(this).attr("max", _player.duration);
        });

        _player.addEventListener('timeupdate', function(e) {
            $(_settings.progress).text(friendlyTimeFormat(_player.currentTime));
            $(_settings.seek).attr('value', parseInt(_player.currentTime, 10));
        });
        _player.addEventListener('ended', function() {
           self.next(); 
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
