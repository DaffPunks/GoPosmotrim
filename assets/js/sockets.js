/**
 * Main logic component
 * So this place where magic comes true
 */

var Sockets = (function () {
    var socket,
        events = {
            onConnected:        () => {}, // When client connecting to the room
            onUserListUpdated:  () => {}, // When somebody else connected to the room
            onGetVideo:         () => {},
            onPause:            () => {},
            onPlay:             () => {},
        };

    /* ============ Private Initialize Methods ============ */

    /**
     * Initialize socket connections and events
     */
    var initSockets = function () {
        socket = io();

        console.log('Successfuly connected');

        // List of events
        socket.on("ON_CONNECTED",       socketOnConnected);
        socket.on("USER_LIST_UPDATED",  socketUserListUpdated);
        socket.on("GET_VIDEO",          socketGetVideo);
        socket.on("GET_VIDEO_PAUSE",    socketGetVideoPause);
        socket.on("GET_VIDEO_PLAY",     socketGetVideoPlay);
    };


    /* ============== Private Sockets Methods ============== */

    /**
     * SocketIO: ON_CONNECTED event
     * @param msg Message from server(?)
     */
    var socketOnConnected = function (msg) {
        events.onConnected.call(this, msg);
    };

    /**
     * SocketIO: USER_LIST_UPDATED event
     * @param msg List of users
     */
    var socketUserListUpdated = function (msg) {
        events.onUserListUpdated.call(this, msg);
    };

    /**
     * SocketIO: GET_VIDEO event
     * @param msg New video ID
     */
    var socketGetVideo = function (msg) {
        console.log('GET_VIDEO', msg);
        events.onGetVideo.call(this, msg);
    };

    /**
     * SocketIO: GET_VIDEO_PAUSE event
     */
    var socketGetVideoPause = function () {
        console.log("GET_PAUSE");
        events.onPause.call(this);
    };

    /**
     * SocketIO: GET_VIDEO_PAUSE event
     */
    var socketGetVideoPlay = function (time) {
        console.log("GET_PLAY");
        events.onPlay.call(this, time);
    };


    /* =================== Public Methods ================== */

    /**
     * Add New Video
     * @param videoID New video ID
     */
    var addNewVideo = function (videoID) {
        console.log("ADD_VIDEO", videoID);
        socket.emit('ADD_VIDEO', videoID);
    };

    /**
     * Add New Video
     */
    var setPause = function () {
        socket.emit('SET_VIDEO_PAUSE');
    };

    /**
     * Add New Video
     */
    var setPlay = function (time) {
        socket.emit('SET_VIDEO_PLAY', time);
    };

    /**
     * Initialize Socket.IO
     * @param newEvents
     */
    var init = function (newEvents = null) {

        if (newEvents) {
            Object.assign(events, newEvents);
        }

        initSockets();

    };

    /**
     * Update configs
     * @param newEvents
     */
    var update = function (newEvents = null) {

        if (newEvents) {
            Object.assign(events, newEvents);
        }

    };


    /* =============== Export Public Methods =============== */

    return {
        init: init,
        update: update,
        addNewVideo: addNewVideo,
        setPause: setPause,
        setPlay: setPlay
    }

}());

export default Sockets;
