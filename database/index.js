/*
 * Module dependencies
 */

var log = require('debug')('database');

/**
 * Expose Sockets initialization
 */

module.exports = DatabaseController;


function DatabaseController(app) {
    var dbworker = app.get('postgresClient');


    /* ============== Public Methods ============== */

    var getLastVideo = function () {
        return new Promise(function (resolve, reject) {
            dbworker.query('SELECT video_id FROM video ORDER BY id DESC LIMIT 1')
                .then((resp) => {
                    var lastVideoID = resp.rows[0].video_id;
                    resolve(lastVideoID);
                })
                .catch(e => reject(e));
        })
    };

    var insertVideo = function (videoID) {
        return new Promise(function (resolve, reject) {
            dbworker.query('INSERT INTO video(video_id) VALUES($1)', [videoID])
                .then(() => {
                    log('Video added: %s', videoID);

                    resolve();
                })
                .catch(e => reject(e));
        });

    };

    return {
        getLastVideo: getLastVideo,
        insertVideo: insertVideo
    }
}
