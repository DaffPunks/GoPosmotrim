/**
 * Main logic component
 * So this place where magic comes true
 */
import Sockets from './sockets';
import YoutubePlayer from './youtube.player'


var GoPosmotrim = (function () {


    /**
     * Initialize Socket.IO in application
     */
    var initDOM = function () {
        console.log('initDOM');

    };

    /**
     * Initialize Socket.IO in application
     */
    var initSockets = function () {
        console.log('initSockets');

        Sockets.init({
            onConnected: onSocketConnect
        });
    };

    /**
     * Initialize Youtube Player when socket is ready
     */
    var onSocketConnect = function (msg) {
        console.log('onSocketConnect');

        console.log('ON_CONNECTED', msg);

        YoutubePlayer.init({
            videoID: msg.video,
            onPlayerInit: onPlayerInitialize,
            onPlayerPause: Sockets.setPause,
            onPlayerPlay: Sockets.setPlay
        })
    };

    /**
     * Link player events with socket events
     */
    var onPlayerInitialize = function () {
        console.log('onPlayerInitialize');

        Sockets.update({
            onNewUserConnected: () => {},
            onGetVideo: YoutubePlayer.setPlayerNewVideo,
            onPause: YoutubePlayer.setPlayerPause,
            onPlay: YoutubePlayer.setPlayerPlay,
        });
    };


    /* =================== Public Methods ================== */

    var init = function () {

        initDOM();
        initSockets();

    };

    /* =============== Run application =============== */

    init();

}());











/*
* 1. Initialize RE:DOM
* 2. Initialize Sockets
* 3. Initialize Player
* 4. Update events for player
**/
