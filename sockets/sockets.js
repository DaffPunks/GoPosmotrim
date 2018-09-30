/*
 * Module dependencies
 */

var log = require('debug')('sockets'),
    sio  = require('socket.io');

/**
 * Expose Sockets initialization
 */

module.exports = Sockets;

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
    var io              = sio.listen(server),
        config          = app.get('config'),
        dbController    = app.get('databaseController');

    var userList = [];
    var currentVideo = '';
    var history = ['asd', 'zxc']; // TODO: make history

    dbController.getLastVideo()
        .then((msg => {
            console.log('Last Video: ', msg);
            currentVideo = msg;
        }))
        .catch(e => log('Error: ', e));


    // CONNECTION
    io.on('connection', function (socket) {
        log('Connected user %s', socket.id);

        var username = socket.id.slice(0, 5);

        userList.push({
            username: username
        });

        // Emit ROOM_INFO
        socket.emit('ON_CONNECTED', {userList: userList, video: currentVideo, history: history});

        // Broadcast USER_LIST UPDATED
        socket.broadcast.emit('USER_LIST_UPDATED', userList);

        // On ADD_VIDEO
        socket.on('ADD_VIDEO', (videoID) => {
            log('Attempt to add new video: %s', videoID);

            dbController.insertVideo(videoID)
                .then(() => {
                    currentVideo = videoID;

                    // Emit GET_VIDEO
                    socket.emit('GET_VIDEO', videoID);
                })
                .catch(e => log('Error: ', e));
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
