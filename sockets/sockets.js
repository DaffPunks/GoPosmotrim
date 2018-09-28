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
    var io      = sio.listen(server),
        config  = app.get('config'),
        db      = app.get('postgresClient');

    var userList = [
        {
            username: 'Daff'
        },
        {
            username: 'Beba'
        }
    ];
    var currentVideo = 'GgAAPPf4z00';
    var history = ['asd', 'zxc'];


    db.query('SELECT video_id FROM video ORDER BY id DESC LIMIT 1')
        .then((resp) => {
            var lastVideoID = resp.rows[0].video_id;
            log(`Last video was: ${lastVideoID}`);
            currentVideo = lastVideoID;
        })
        .catch(e => console.error(e));

    // CONNECTION
    io.on('connection', function (socket) {
        log('Connected user %s', socket.id);

        // Emit ROOM_INFO
        socket.emit('ON_CONNECTED', {userList: userList, video: currentVideo, history: history});

        // Broadcast USER_LIST UPDATED
        socket.broadcast.emit('USER_LIST_UPDATED');

        // On ADD_VIDEO
        socket.on('ADD_VIDEO', (msg) => {
            log('Attempt to add new video: %s', msg);

            db.query('INSERT INTO video(video_id) VALUES($1)', [msg])
                .then(() => {
                    log('Video added: %s', msg);
                    currentVideo = msg;

                    // Emit GET_VIDEO
                    socket.emit('GET_VIDEO', msg);
                })
                .catch(e => console.error(e))
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




    });



}

/*
SocketIO logic












*/
