/*
 * Module dependencies
 */
const path = require('path');
const sockets = require(path.resolve('sockets/sockets'));

const MainController = () => {

	const getMain = (req, res, next) => {
		const{ query } = req;
		const videoId = query.v;

		// Send view
		res.sendFile(path.resolve('views/index.html'));

		// Set sockets
		sockets.addVideo(videoId);
	}

	return {
		getMain
	};
};

module.exports = MainController;