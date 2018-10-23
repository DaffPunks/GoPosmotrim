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
import {UserList} from './components/userlist.component';
import {HistoryList} from './components/history.component';
import { mount } from 'redom';


var GoPosmotrim = (function () {

    var historyList = [];

    const domSearch = new SearchDOM();
    const domCurrentVideo = new CurrentVideo();
    const domVideo = new Video();
    const domUserList = new UserList();
    const domHistoryList = new HistoryList();

    /**
     * Initialize Socket.IO in application
     */
    var initDOM = function () {
        console.log('initDOM');

        mount(document.querySelector('.search-component'), domSearch);
        mount(document.querySelector('.current-component'), domCurrentVideo);
        mount(document.querySelector('.video-component'), domVideo);
        mount(document.querySelector('.users-component'), domUserList);
        mount(document.querySelector('.history-component'), domHistoryList);

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
                        // putVideoInHistory(resp, true);
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

        onVideoListUpdated(msg.history);

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
        var imageUrl = getVideoThumbnail(json.items[0].snippet.thumbnails);
        var channel = json.items[0].snippet.channelTitle;
        var views = Utils.makeSpaceForViwes(json.items[0].statistics.viewCount);

        console.log('WTF');

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
        YoutubePlayer.getInfo(msg)
            .then(json => putVideoInHistory(json, true));

    };

    /**
     * When new user
     * @param list
     */
    var onSocketUserListUpdated = function (list) {
        domUserList.update(list);
    };

    /**
     * When new user
     * @param list
     */
    var onVideoListUpdated = function (list) {
        console.log(list);

        let promisesArray = [];

        list.forEach((item) => {
            promisesArray.push(YoutubePlayer.getInfo(item.video_id));
        });

        Promise.all(promisesArray).then(values => values.map(item => putVideoInHistory(item)));
    };

    var putVideoInHistory = function (json, onTop = false) {

        let item = {
            id: json.items[0].id,
            title: json.items[0].snippet.title,
            image: getVideoThumbnail(json.items[0].snippet.thumbnails)
        };

        if (onTop) {
            historyList.unshift(item);
        } else {
            historyList.push(item);
        }


        domHistoryList.update(historyList);
        domHistoryList.onClick((videoID) => {
            Sockets.addNewVideo(videoID);
        })
    };

    /**
     *
     */
    var getVideoThumbnail = function (thumbnails) {
        if (thumbnails.maxres) {
            return thumbnails.maxres.url
        } else if (thumbnails.standard) {
            return thumbnails.standard.url
        } else {
            return thumbnails.medium.url
        }
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
