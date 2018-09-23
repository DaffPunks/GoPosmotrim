/*
 * Module dependencies
 */
var path = require('path');

/**
 * Expose routes
 */

module.exports = Routes;

/**
 * Defines routes for application
 *
 * @param app `Express` instance.
 * @api public
 */

function Routes(app) {
    // var config = app.get('config');

    /*
     * Homepage
     */

    app.get('/', function (req, res, next) {
        // res.render('pages/index');
        res.sendFile(path.resolve('views/index.html'));
    });
}
