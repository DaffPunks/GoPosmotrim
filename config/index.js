/**
 * Module dependencies.
 */

var log         = require('debug')('config'),
    express     = require('express'),
    path        = require('path'),
    { Client }  = require('pg'),
    config      = {};


/**
 * Expose Configuration scope
 */

module.exports = Config;

/**
 * Applies configurations settings
 * for application.
 *
 * @param app `Express` instance.
 * @api public
 */

function Config(app) {
    log("Attempt to load from config.json");
    try {
        config = require('./config.json');
        log('Loaded from config.json');
    } catch (err) {
        log("Failed to load file config.json");
    }

    log('Save configuration values in app');
    app.set('config', config);

    log('Setting port as %d', config.app.port);
    app.set('port', config.app.port);

    log('Setting view engine as %s', 'pug');
    app.set('view engine', 'pug');

    log('Attemp to connect to database');
    var postgresClient = new Client({
        user: config.postgresql.user,
        host: config.postgresql.host,
        database: config.postgresql.database,
        password: config.postgresql.password,
        port: config.postgresql.port,
        ssl: true
    });
    postgresClient.connect();

    log('Saving postgresClient connection in app');
    app.set('postgresClient', postgresClient);

    log('Setting views lookup root path.');
    app.set('views', path.join(__dirname, '..', '/views'));

    log('Setting static files lookup root path.');
    app.use(express.static(path.join(__dirname, '..', '/public')));
}
