var GW = GW || {};
GW.AudioPlayer = function(playlist) {
    var currentSong = 0;
    var prevSong = undefined;

    var settings = {
        player:             '#audio_player',
        btnPrev:            '#btn_prev',
        btnNext:            '#btn_next',
        playlistBrowser:    '#playlist',
        playlistElement:    'p',
        albumArt:           '#album_art',
        playEvent:          'touchstart mousedown'
    };

    // Public Methods

    this.init = function(options) {
        $.extend(settings, options);
        var playlistHtml = '';
        for (i = 0, j=playlist.length; i < j; i++) {
            playlistHtml += '<' + settings.playlistElement + '>' + playlist[i].title + '</' + settings.playlistElement + '>';
        }
        $(settings.playlistBrowser).html(playlistHtml)

        bindEvents();
    };

    this.play = function(track) {
        var player = $(settings.player).get(0);
        player.src = playlist[track].file;
        $(settings.albumArt).attr('src', playlist[track].art);
        player.play();

        prevSong = currentSong;
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

    function bindEvents() {        
        $(settings.playlistBrowser)
            .on(settings.playEvent,  settings.playlistElement, function() {
                self.play($(this).index());
            });

        $(settings.btnNext).on(settings.playEvent, function() {
           self.next() ;
        });

        $(settings.btnPrev).on(settings.playEvent, function() {
           self.prev() ;
        });
    };

};
