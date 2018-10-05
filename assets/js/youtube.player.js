/**
 * YouTube player component
 */

var YouTubePlayer = (function () {
    var player,
        doNotSendNextAction = true,  // Because you recived it from another user
        config = {
            apiKey: 'AIzaSyAipCimbojcWJ4M8Y01NXvu-HYPJl0JOWI',
            videoID:        'oWBDZo3axYg',
            elementID:      'player',
            onPlayerInit:   () => {},   // When player is ready
            onPlayerPause:  () => {},   // When player is paused
            onPlayerPlay:   () => {},   // When player is play
            onInfoRecieve:  () => {}
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
                playerVars: {autoplay: 1, rel: 0, color: 'white'},
                events: {
                    'onReady': config.onPlayerInit,
                    'onStateChange': onPlayerEvent
                }
            });

            doEventInfo(config.videoID);

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


    var doEventInfo = function (videoID) {
        // https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=4Y4YSpF6d6w&key=

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${videoID}&key=${config.apiKey}`)
            .then(response => response.json())
            .then(json => {
                config.onInfoRecieve.call(this, json);
            })
            .catch(e => console.log(e));
    };


    /* =================== Public Methods ================== */

    var getInfo = function (videoID) {
        // https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=4Y4YSpF6d6w&key=

        return fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${videoID}&key=${config.apiKey}`)
            .then(response => response.json())
            .catch(e => console.log(e));
    };

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
        doEventInfo(videoID);

        player.loadVideoById(videoID);
    };

    var init = function (newConfig = null) {

        if (newConfig) {
            Object.assign(config, newConfig);
        }

        initYoutubePlayer();

    };

    var update = function (newConfig = null) {

        if (newConfig) {
            Object.assign(config, newConfig);
        }

    };


    /* =============== Export Public Methods =============== */

    return {
        init: init,
        update: update,
        setPlayerPause: setPlayerPause,
        setPlayerPlay: setPlayerPlay,
        setPlayerNewVideo: setPlayerNewVideo,
        doEventInfo: doEventInfo,
        getInfo: getInfo,
    }
}());

export default YouTubePlayer;
