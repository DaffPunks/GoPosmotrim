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
 * @param app `Express` instance.
 * @param server `http` server instance.
 * @api public
 */

function Sockets(app, server) {

    // var config = app.get('config');
    var db = app.get('postgresClient');

    var io = sio.listen(server);


    io.on('connection', function (socket) {
        log('Connected user');

        socket.on('Rofal', (msg) => {
            log('RofalSuka %j', msg);

            var text = 'INSERT INTO video(video_id) VALUES($1)';
            var values = [msg.videoId];

            db.query(text, values)
                .then(res => {
                    console.log(res.rows[0])
                })
                .catch(e => console.error(e.stack))
        });
    });

}
