define(
	['device', 'mediator', 'deviceEvents'],
	function (device, mediator, deviceEvents) {

	// WARNING  camera use game coordinates only

	return {

		defaults: {
			// w: 480,
			// h: 320,
			w: 320,
			h: 480,
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
			x: 320.00, // center camera is here // half of word size
			y: 300.00, // center camera is here
			remSize: 20,
			devW: 0,
			devH: 0
			// bounds: [0.0, 0.0, 0.0, 0.0, 0.0],
		},

		initialize: function () {

			var camera = this;

			camera.detectRemSize();

			camera.bindEventListeners();

			camera.adjust({
				width: device.attr.width,
				height: device.attr.height
			});

		},

		bindEventListeners: function () {

			var camera = this;

			mediator.installTo(camera);

			camera.subscribe(deviceEvents.RESIZE, camera.adjust);

		},

/*
		moveTo: function (x, y) {

			// FIXME: detect edge position of camera relative from game's world
			this.attr.x = x;
			this.attr.y = y;

		},

		followToObj: function (obj) {



		},

		followToArray: function (arr) {



		},

		detectBorders: function (minX, minY, maxX, maxY) {

			// detect max and min camera's position

		},
*/

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

		adjust: function (data) {

			var camera = this,
				cameraData = camera.attr,
				width = data.width,
				height = data.height,
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

			cameraData.devW = width;
			cameraData.devH = height;

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

			var cameraData = this.attr,
				objData = obj.attr,
				sprite = objData.sprite;

			// sprite pos
			sprite.position.x = (((objData.x - cameraData.x) + cameraData.w05) / cameraData.w * cameraData.devW) | 0;
			sprite.position.y = (((objData.y - cameraData.y) + cameraData.h05) / cameraData.h * cameraData.devH) | 0;

			sprite.width = objData.w * cameraData.q;
			sprite.height = objData.h * cameraData.q;


		}

	};

});
