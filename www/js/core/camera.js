define(
	['device'],
	function (device) {

	// WARNING  camera use game coordinates only

	return {

		defaults: {
			// w: 480,
			// h: 320,
			w: 480,
			h: 320,
			remSize: {
				min: 16,
				max: 26
			}
		},

		attr: {
			w: 0,
			h: 0,
			w05: 0,
			h05: 0,
			q: 1,
			x: 0, // center camera is here
			y: 0, // center camera is here
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

		getBounds: function () {

			var data = this.attr,
				x = data.x,
				y = data.y;

			return [x - data.w05, y - data.h05, x + data.w05, y + data.h05, Date.now()];

		},

		adjust: function (width, height) {

			var camera = this,
				cameraData = camera.attr,
				defaults = camera.defaults,
				qWidth = width / defaults.w,
				qHeight = height / defaults.h;

			if (qWidth < qHeight) {
				cameraData.w = defaults.w;
				cameraData.h = Math.floor((cameraData.w * height / width) / qWidth);
				cameraData.q = qWidth;
			} else {
				cameraData.h = defaults.h;
				cameraData.w = Math.floor((cameraData.h * width / height) / qHeight);
				cameraData.q = qHeight;
			}

			cameraData.w05 = cameraData.w / 2;
			cameraData.h05 = cameraData.h / 2;

		},

		detectRemSize: function () {

			var camera = this,
				defaults = camera.defaults,
				cameraArea = defaults.w * defaults.h,
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

		},

		adjustSprite: function (obj) {
			console.log('camera adjust sprite');
		}

	};

});
