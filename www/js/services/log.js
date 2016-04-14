var	gOldOnError,
	slice = Array.prototype.slice,
	logger = {
		remoteLog: false,
		xhr: new XMLHttpRequest(),
		log: function () {
			console.log.apply(console, arguments);
		},
		sendToServer: function () {

			if (!this.remoteLog) {
				return;
			}

			var logger = this,
				xhr = logger.xhr,
				args = slice.call(arguments).map(function (arg) {
					return (arg && typeof arg === 'object') ? JSON.stringify(arg) : String(arg);
				}).join(' ');

			xhr.open('POST', '/log/', false);

			xhr.send(args);

		}

	};

function log() {
	logger.sendToServer.apply(logger, arguments);
	return logger.log.apply(logger, arguments);
}

gOldOnError = window.onerror;

window.onerror = function (errorMsg, url, lineNumber) {

	log.apply(null, arguments);

	if (gOldOnError) {
		return gOldOnError(errorMsg, url, lineNumber);
	}

};

window.requireAsset.set('log', log);

export default log;
