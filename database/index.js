/*
 * Module dependencies
 */

var log = require('debug')('database');

/**
 * Expose Sockets initialization
 */

module.exports = DatabaseController;


function DatabaseController(app) {
    const dbworker = app.get('postgresClient');

    /* ============== Public Methods ============== */

    const getLastVideo = () => {
        return new Promise(function (resolve, reject) {
            dbworker.query('SELECT video_id FROM video ORDER BY id DESC LIMIT 1')
                .then((resp) => {
                    var lastVideoID = resp.rows[0].video_id;
                    return resolve(lastVideoID);
                })
                .catch(e => reject(e));
        })
    };

    const insertVideo = (videoID) => {

        return new Promise(function (resolve, reject) {
            if(videoID === null || videoID === undefined){
                return reject("Empty video id");
            }

            dbworker.query('INSERT INTO video(video_id) VALUES($1)', [videoID])
                .then(() => {
                    log('Video added: %s', videoID);

                    return resolve();
                })
                .catch(e => reject(e));
        });

    };

    const getLastTenVideos = () => {
        return new Promise(function (resolve, reject) {
            dbworker.query('SELECT video_id FROM video ORDER BY id DESC LIMIT 10')
                .then((resp) => {
                    var lastVideoIDs = resp.rows;
                    return resolve(lastVideoIDs);
                })
                .catch(e => reject(e));
        })
    };

    return {
        getLastVideo,
        insertVideo,
        getLastTenVideos
    }
}
