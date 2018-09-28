/**
 * Main logic component
 * So this place where magic comes true
 */
import Utils from './utils';
import Sockets from './sockets';
import YoutubePlayer from './youtube.player';
import SearchDOM from './components/search.component';
import CurrentVideo from './components/current_video.component';
import Video from './components/video.component';
import { mount } from 'redom';


var GoPosmotrim = (function () {

    const domSearch = new SearchDOM();
    const domCurrentVideo = new CurrentVideo();
    const domVideo = new Video();


    /**
     * Initialize Socket.IO in application
     */
    var initDOM = function () {
        console.log('initDOM');

        mount(document.querySelector('.header'), domSearch);
        mount(document.querySelector('.current-wrap'), domCurrentVideo);
        mount(document.querySelector('.video-component'), domVideo);

    };

    /**
     * Initialize Socket.IO in application
     */
    var initSockets = function () {
        console.log('initSockets');

        Sockets.init({
            onConnected: onSocketConnect
        });

        domSearch.onSubmit((value) => {
            Sockets.addNewVideo(Utils.getYoutubeID(value));
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
            onPlayerPlay: Sockets.setPlay,
            onInfoRecieve: onUpdateVideo
        });


    };

    /**
     * Update DOM objects when video is updated
     */
    var onUpdateVideo = function (json) {
        var title = json.items[0].snippet.title;
        var imageUrl = json.items[0].snippet.thumbnails.maxres.url;
        var channel = json.items[0].snippet.channelTitle;
        var views = json.items[0].statistics.viewCount;

        console.log(imageUrl, title);
        domCurrentVideo.update(imageUrl, title);
        domVideo.update(title, channel, views);
    };

    /**
     * Link player events with socket events
     */
    var onPlayerInitialize = function () {
        console.log('onPlayerInitialize');

        Sockets.update({
            onNewUserConnected: () => {},
            onGetVideo: onSocketGetVideo,
            onPause: YoutubePlayer.setPlayerPause,
            onPlay: YoutubePlayer.setPlayerPlay,
        });
    };

    var onSocketGetVideo = function (msg) {
        YoutubePlayer.setPlayerNewVideo(msg);
        YoutubePlayer.getInfo(msg);
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
