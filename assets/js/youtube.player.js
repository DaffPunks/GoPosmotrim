/**
 * YouTube player component
 */

var YouTubePlayer = (function () {
    var player,
        doNotSendNextAction = true,  // Because you recived it from another user
        config = {
            videoID:        'oWBDZo3axYg',
            elementID:      'video',
            onPlayerInit:   () => {},   // When player is ready
            onPlayerPause:  () => {},   // When player is paused
            onPlayerPlay:   () => {},   // When player is play
        };

    /* ============ Private Initialize Methods ============ */

    /**
     * Initialize Youtube Player
     */
    var initYoutubePlayer = function () {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // On Youtube Player Ready
        window.onYouTubePlayerAPIReady = function () {
            player = new YT.Player(config.elementID, {
                height: '100%',
                width: '100%',
                videoId: config.videoID,
                playerVars: {autoplay: 1, rel: 0},
                events: {
                    'onReady': config.onPlayerInit,
                    'onStateChange': onPlayerEvent
                }
            });


        };
    };

    /**
     * Handle youtube player events
     * @param event
     */
    var onPlayerEvent = function (event) {

        if (!doNotSendNextAction) {
            switch (event.data) {
                case 1: {
                    console.log('YT:PLAY');
                    var newTime = player.getCurrentTime().toFixed(2);
                    config.onPlayerPlay.call(this, newTime);
                    break;
                }
                case 2: {
                    console.log('YT:PAUSE');
                    config.onPlayerPause.call(this);
                    break;
                }
            }
        } else if(event.data === 1 || event.data === 2) {
            doNotSendNextAction = false;
        }
    };


    /* =================== Public Methods ================== */

    var setPlayerPause = function () {
        doNotSendNextAction = true;
        player.pauseVideo();
    };

    var setPlayerPlay = function (time) {
        doNotSendNextAction = true;

        player.seekTo(time, true);

        player.playVideo();
    };

    var setPlayerNewVideo = function (videoID) {
        player.loadVideoById(videoID);
    };

    var init = function (newConfig = null) {

        if (newConfig) {
            Object.assign(config, newConfig);
        }

        initYoutubePlayer();

    };


    /* =============== Export Public Methods =============== */

    return {
        init: init,
        setPlayerPause: setPlayerPause,
        setPlayerPlay: setPlayerPlay,
        setPlayerNewVideo: setPlayerNewVideo
    }
}());

export default YouTubePlayer;
