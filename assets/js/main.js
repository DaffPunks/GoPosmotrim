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
import User from './components/userlist.component';
import { list, mount } from 'redom';


var GoPosmotrim = (function () {

    const domSearch = new SearchDOM();
    const domCurrentVideo = new CurrentVideo();
    const domVideo = new Video();
    const domuserList = list('ul', User);

    /**
     * Initialize Socket.IO in application
     */
    var initDOM = function () {
        console.log('initDOM');

        mount(document.querySelector('.header'), domSearch);
        mount(document.querySelector('.current-wrap'), domCurrentVideo);
        mount(document.querySelector('.video-component'), domVideo);
        mount(document.querySelector('.userlist-component'), domuserList);

    };

    /**
     * Initialize Socket.IO in application
     */
    var initSockets = function () {
        console.log('initSockets');

        Sockets.init({
            onConnected: onSocketConnect,
            onUserListUpdated: onSocketUserListUpdated
        });

        domSearch.onSubmit((value) => {
            var videoID = Utils.getYoutubeID(value);

            YoutubePlayer.getInfo(videoID)
                .then(resp => {
                    if (resp.items.length === 0) {
                        console.log('On_Submit: ', 'There is no video with id ', value);
                    } else {
                        Sockets.addNewVideo(videoID);
                    }


                });
        });
    };

    /**
     * Initialize Youtube Player when socket is ready
     */
    var onSocketConnect = function (msg) {
        console.log('onSocketConnect');

        console.log('ON_CONNECTED', msg);

        onSocketUserListUpdated(msg.userList);

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
        console.log('JSON', json);

        var title = json.items[0].snippet.title;
        var imageUrl = json.items[0].snippet.thumbnails.standard.url;
        var channel = json.items[0].snippet.channelTitle;
        var views = Utils.makeSpaceForViwes(json.items[0].statistics.viewCount);

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

    /**
     *
     * @param msg
     */
    var onSocketGetVideo = function (msg) {
        YoutubePlayer.setPlayerNewVideo(msg);
        YoutubePlayer.doEventInfo(msg);
    };

    /**
     * When new user
     * @param list
     */
    var onSocketUserListUpdated = function (list) {
        domuserList.update(list);
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
