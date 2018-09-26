/**
 * Utils.js
 * Special utility function placed here
 * No dependencies, feel free to use them.
 **/

export default (function () {

    /* =================== Public Methods ================== */

    /**
     * A method that help you to get video id from any YouTube URL
     * @param url Youtube video url.
     **/
    var getYoutubeID = function (url) {
        var ID = '';
        url = url.replace(/([><])/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if(url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        }
        else {
            ID = url;
        }
        return ID;
    };


    /* =============== Export Public Methods =============== */

    return {
        getYoutubeID: getYoutubeID
    }

}());
