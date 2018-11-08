/*
 * Module dependencies
 */

var log = require('debug')('sockets'),
    sio  = require('socket.io');

/**
 * Expose Sockets initialization
 */

module.exports = Sockets;

/*
 * Global variables
 */
 var App = null;
 var IO  = null;
 var currentVideo = '';
 // module.exports.io = (()=>{ return IO; })();

/*
 * @param videoID The ID of Youtube video
 */
const addVideo = (videoID) => {
    log('Attempt to add new video: %s', videoID);

    if (currentVideo == videoID)
        return;

    const dbController = App.get('databaseController');
    dbController.insertVideo(videoID)
        .then(() => {
            currentVideo = videoID;

            // Emit GET_VIDEO
            IO.emit('GET_VIDEO', videoID);
        })
        .catch(e => log('Error: ', e));
}

module.exports.addVideo = addVideo;

/**
 * Socket.io
 *
 * CONNECTION
 *     you:ON_CONNECTED -> Videos, Cur Video, Users
 *     other:USER_LIST_UPDATED -> Users
 * ADD_VIDEO
 *     all:GET_VIDEO -> Curr Video
 * SET_VIDEO_PAUSE
 *     other:GET_VIDEO_PAUSE
 * SET_VIDEO_PLAY
 *     other:GET_VIDEO_PLAY
 * SET_LEADER (?)
 *     all:GET_LEADER
 *
 *
 * @param app `Express` instance.
 * @param server `http` server instance.
 * @api public
 */

function Sockets(app, server) {
    App = app;
    IO = sio.listen(server);

    const config       = app.get('config'),
          dbController = app.get('databaseController');

    var userList = [];
    var history = []; // TODO: make history

    dbController.getLastVideo()
        .then((msg => {
            console.log('Last Video: ', msg);
            currentVideo = msg;
        }))
        .catch(e => log('Error: ', e));


    // CONNECTION
    IO.on('connection', function (socket) {
        log('Connected user %s', socket.id);

        const username = socket.id.slice(0, 5);

        userList.push({
            username: username
        });

        dbController.getLastTenVideos()
            .then(data => {
                history = data;
                // Emit ROOM_INFO
                socket.emit('ON_CONNECTED', {userList: userList, video: currentVideo, history: history});
            });



        // Broadcast USER_LIST UPDATED
        socket.broadcast.emit('USER_LIST_UPDATED', userList);

        // On ADD_VIDEO
        socket.on('ADD_VIDEO', (videoID)=>{
            addVideo(videoID, currentVideo);
        });

        // On GET_VIDEO_PAUSE
        socket.on('SET_VIDEO_PAUSE', () => {
            log('Video Pause');
           socket.broadcast.emit('GET_VIDEO_PAUSE');
        });

        // On GET_VIDEO_PAUSE
        socket.on('SET_VIDEO_PLAY', (time) => {
            log('Video Play', time);
            socket.broadcast.emit('GET_VIDEO_PLAY', time);
        });

        socket.on('disconnect', () => {
            userList = userList.filter((user) => user.username !== username);

            socket.broadcast.emit('USER_LIST_UPDATED', userList);
        })


    });
}

/*
SocketIO logic












*/
