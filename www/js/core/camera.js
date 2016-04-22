define(
	['device'],
	function (device) {

	return {

		defaults: {
			width: 480,
			height: 320,
			remSize: {
				min: 16,
				max: 26
			}
		},

		attr: {
			width: 480,
			height: 320,
			q: 1,
			x: 0, // left top corner of camera
			y: 0, // left top corner of camera
			remSize: 20
		},

		initialize: function () {

			var camera = this;

			camera.detectRemSize();

			camera.adjust(device.attr.width, device.attr.height);

		},

		moveToObj: function (obj) {



		},

		moveToArray: function (arr) {



		},

		setBorders: function (minX, minY, maxX, maxY) {

			// set max and min camera's position

		},

		update: function () {

			// update camera's max/min X/Y
			// save result and return it
			// for this game Camera's X parameter has relative ship from Player's object

		},

		adjust: function (width, height) {

			var camera = this,
				cameraData = camera.attr,
				defaults = camera.defaults,
				qWidth = width / defaults.width,
				qHeight = height / defaults.height;

			if (qWidth > qHeight) {
				cameraData.width = Math.floor(cameraData.width * qWidth);
				cameraData.height = defaults.height;
				cameraData.q = qWidth;
			} else {
				cameraData.width = defaults.width;
				cameraData.height = Math.floor(cameraData.height * qHeight);
				cameraData.q = qHeight;
			}

		},

		detectRemSize: function () {

			var camera = this,
				defaults = camera.defaults,
				cameraArea = defaults.width * defaults.height,
				deviceData = device.attr,
				deviceArea = deviceData.width * deviceData.height,
				remSize = Math.round(deviceArea / cameraArea * defaults.remSize.min);

			remSize = Math.max(remSize, defaults.remSize.min);
			remSize = Math.min(remSize, defaults.remSize.max);

			camera.attr.remSize = remSize;

			document.documentElement.style.fontSize = camera.attr.remSize + 'px';

		},

		remToPixel: function (rem, postfix) {

			if (postfix) {
				return this.attr.remSize * rem + postfix;
			}

			return this.attr.remSize * rem;

		}






	};

});
