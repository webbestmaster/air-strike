define(
	['device', 'mediator', 'deviceKeys', 'gameConfig', 'cameraKeys', 'gameKeys', 'uiManager'],
	function (device, mediator, deviceKeys, gameConfig, cameraKeys, gameKeys, uiManager) {

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
			x: gameConfig.world.width / 2, // center camera is here // half of word size
			y: gameConfig.world.height / 2, // center camera is here
			now: Date.now(),
			pause: {
				start: 0,
				// stop: 0,
				time: 0
			},
			remSize: 20,
			dw: 0, 	//device width
			dh: 0 	//device height
			// bounds: [0.0, 0.0, 0.0, 0.0, 0.0],
		},

		follow: {
			list: [],
			length: 0
		},

		initialize: function () {

			var camera = this;

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
			camera.subscribe(cameraKeys.ADJUST_SPRITE, camera.adjustSprite);

			camera.subscribe(gameKeys.PAUSE, camera.onPause);
			camera.subscribe(gameKeys.RESUME, camera.onResume);

			camera.subscribe(gameKeys.DESTROY, camera.onDestroy);
			camera.subscribe(cameraKeys.FOLLOW_TO, camera.followTo);

		},

		onDestroy: function () {

			var camera = this;

			camera.attr.pause = {
				start: 0,
				time: 0
			};

			camera.unFollowAll();

		},

		onPause: function () {

			var pause = this.attr.pause;

			// if start === 0 -> game is paused yet
			if (pause.start) {
				return;
			}

			pause.start = Date.now();

		},

		onResume: function () {

			var pause = this.attr.pause;

			// if start !== 0 -> game is resumed yet
			if (pause.start) {
				pause.time += Date.now() - pause.start;
				pause.start = 0;
			}

		},

		followTo: function (obj) {

			var camera = this,
				followData = camera.follow;

			followData.list[followData.length] = obj;

			followData.length += 1;

		},

		unFollowAll: function () {

			var camera = this,
				followData = camera.follow;

			followData.list = [];
			followData.length = 0;

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

			var camera = this,
				follow = camera.follow,
				length = follow.length,
				list = follow.list,
				i = 0,
				x = 0,
				y = 0;

			// if (!length) {
			// 	return camera;
			// }

			for (;i < length; i += 1) {
				x += list[i].x;
				y += list[i].y;
			}

			x /= length;
			y /= length;

			camera.attr.x = x;
			camera.attr.y = y;

			return camera;
			
		},

		getBounds: function () {

			var attr = this.attr,
				x = attr.x,
				y = attr.y;

			return [x - attr.w05, y - attr.h05, x + attr.w05, y + attr.h05, attr.now = Date.now() - attr.pause.time];

		},

		adjust: function (data) {

			var camera = this,
				cameraData = camera.attr,
				width = data.width,
				height = data.height,
				defaults = camera.defaults,
				devQ = width / height,
				camQ = defaults.w / defaults.h;

			if (devQ > camQ) {
				cameraData.h = defaults.h;
				cameraData.w = defaults.h * devQ;
				cameraData.q = height / defaults.h;
			} else {
				cameraData.w = defaults.w;
				cameraData.h = defaults.w / devQ;
				cameraData.q = width / defaults.w;
			}

			cameraData.w05 = cameraData.w / 2;
			cameraData.h05 = cameraData.h / 2;

			cameraData.dw = width;
			cameraData.dh = height;

			camera.detectRemSize();

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

		remToPixel: function (rem) {

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

		toGameCoordinatesAverage: function (data) {

			var camera = this,
				length = data.length,
				events = data.events,
				eventItem,
				i = 0,
				sumX = 0,
				sumY = 0,
				newArrayLength = 0,
				attr = camera.attr;

			for (; i < length; i += 1) {
				eventItem = events[i];
				if (!uiManager.isInUI(eventItem.x, eventItem.y)) {
					newArrayLength += 1;
					sumX += eventItem.x;
					sumY += eventItem.y;
				}
			}

			if (!newArrayLength) {
				return null;
			}

			sumX /= newArrayLength;
			sumY /= newArrayLength;

			return {
				x: sumX / attr.dw * attr.w + attr.x - attr.w05,
				y: sumY / attr.dh * attr.h + attr.y - attr.h05
			}

		}

	};

});
