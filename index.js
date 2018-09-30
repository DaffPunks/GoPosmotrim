/*
 * Module dependencies
 */

var express = require('express');

/*
 * Create and config server
 */

var app = exports.app = express();

/**
 * Configure application
 */

require('./config')(app);

/*
 * Routes
 */

require('./routes')(app);

/*
 * Web server
 */
exports.server = require('http')
    .createServer(app).listen(app.get('port'), function() {
        console.log('GoPosmotrim started on http://localhost:%d/', app.get('port'));
    });


/*
 * Database Wrap
 */
exports.app.set('databaseController', require('./database')(app));

/*
 * Socket.io
 */
require('./sockets/sockets')(app, exports.server);
