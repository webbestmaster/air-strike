define(
	['device', 'mediator', 'deviceKeys', 'gameConfig', 'cameraKeys'],
	function (device, mediator, deviceKeys, gameConfig, cameraKeys) {

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
			qX: 1,
			qY: 1,
			x: gameConfig.world.width / 2, // center camera is here // half of word size
			y: gameConfig.world.height / 2, // center camera is here
			remSize: 20,
			dw: 0, 	//device width
			dh: 0 	//device height
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

		set: function (key, value) {
			this.attr[key] = value;
		},

		get: function (key) {
			return this.attr[key];
		},

		bindEventListeners: function () {

			var camera = this;

			mediator.installTo(camera);

			camera.subscribe(deviceKeys.RESIZE, camera.adjust);

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

/*
		update: function () {

			// update camera's max/min X/Y
			// save result and return it
			// for this game Camera's X parameter has relative ship from Player's object

		},
*/

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
				cameraData.qX = cameraData.q = qWidth;
				cameraData.qY = height / cameraData.h;
			} else {
				cameraData.h = defaults.h;
				cameraData.w = Math.floor((cameraData.h * width / height) / qHeight);
				cameraData.qY = cameraData.q = qHeight;
				cameraData.qX = width / cameraData.w;
			}

			cameraData.w05 = cameraData.w / 2;
			cameraData.h05 = cameraData.h / 2;

			cameraData.dw = width;
			cameraData.dh = height;

			camera.publish(cameraKeys.BOUNDS_UPDATED, cameraData);

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

		adjustSprite: function (objData) {

			var cameraData = this.attr,
				sprite = objData.sprite;

			// sprite pos
			sprite.position.x = ((objData.x - cameraData.x) + cameraData.w05) / cameraData.w * cameraData.dw;
			sprite.position.y = ((objData.y - cameraData.y) + cameraData.h05) / cameraData.h * cameraData.dh;

			sprite.width = objData.w * cameraData.q;
			sprite.height = objData.h * cameraData.q;

		},

		toGameCoordinates: function (xy) {

			var attr = this.attr;

			return {
				x: xy.x / attr.dw * attr.w + attr.x - attr.w05,
				y: xy.y / attr.dh * attr.h + attr.y - attr.h05
			}

		}

	};

});
