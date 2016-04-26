define([
	'GameObject',
	'gameConfig',
	'mediator',
	'camera',
	'cameraKeys',
	'deviceKeys'
], function (GameObject,
			 gameConfig,
			 mediator,
			 camera,
			 cameraKeys,
			 deviceKeys) {

	function Aircraft() {

		var aircraft = this,
			sprite;

		aircraft.mainBindTextures(aircraft.initialTexture);

		sprite = new PIXI.Sprite(aircraft.textures.rotate_2);
		sprite.anchor.set(0.5, 0.5);

		aircraft.attr = {
			sprite: sprite
		};

		aircraft.setDefaultProperties();

		aircraft.updateBounds();

		aircraft.bindEventListeners();

	}

	Aircraft.prototype = Object.create(GameObject.prototype);

	Aircraft.prototype.setDefaultProperties = function () {

		return this.set({
			w: 47,
			h: 28,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: gameConfig.world.width / 2,
			y: gameConfig.world.height / 2,
			visible: true,
			lastUpdate: Date.now(),
			fullSpeed: 200, // 50 px per sec
			speed: {
				x: 0,
				y: 0
			},
			movieTarget: {
				x: 0,
				y: 0
			}
		});

	};

	Aircraft.prototype.bindEventListeners = function () {

		var obj = this;

		mediator.installTo(obj);

		obj.subscribe(deviceKeys.DOWN, obj.onDeviceMove);
		obj.subscribe(deviceKeys.MOVE, obj.onDeviceMove);
		obj.subscribe(deviceKeys.UP, obj.onDeviceUp);

	};

	Aircraft.prototype.onDeviceMove = function (data) {

		/*
		 this.attr.x += (data.dx / gameObjectHelper.attr.qX);
		 this.attr.y += (data.dy / gameObjectHelper.attr.qY);
		 */

		var aircraft = this,
			aircraftData = aircraft.attr,
			xy1 = camera.toGameCoordinates(data),
			x1 = xy1.x,
			y1 = xy1.y,
			dx = x1 - aircraftData.x,
			dy = y1 - aircraftData.y,
			angleRadians = Math.atan2(dy, dx),
			sin = Math.sin(angleRadians),
			cos = Math.cos(angleRadians),
			fullSpeed = aircraftData.fullSpeed,
			speed = aircraftData.speed;

		speed.x = cos * fullSpeed;
		speed.y = sin * fullSpeed;

		aircraftData.movieTarget.x = x1;
		aircraftData.movieTarget.y = y1;

	};

	Aircraft.prototype.onDeviceUp = function () {

		// debugger

		// if (data) {
		// 	this.onDeviceMove(data);
		// 	return;
		// }

		this.attr.speed.x = 0;
		this.attr.speed.y = 0;

	};

	Aircraft.prototype.initialTexture = {
		rotate_1: 'aircraft-rotate-1.png',
		rotate_2: 'aircraft-rotate-2.png',
		normal: 'aircraft.png'
	};

	Aircraft.prototype.update = function (x0, y0, x1, y1, now) {

		// NOTE: - attr.movieTarget.x and attr.movieTarget.y did not have a variable cause
		// attr.movieTarget.x and attr.movieTarget.y were seldom called twice in this function

		// detect is in camera or not - in not needed, cause this object belongs to player
		var attr = this.attr,
			dTime = (now - attr.lastUpdate) / 1000,
			dx = attr.speed.x * dTime,
			dy = attr.speed.y * dTime;

		if (Math.abs(attr.x - attr.movieTarget.x) <= Math.abs(dx)) {
			attr.x = attr.movieTarget.x;
			attr.speed.x = 0;
		} else {
			attr.x += dx;
		}

		if (Math.abs(attr.y - attr.movieTarget.y) <= Math.abs(dy)) {
			attr.y = attr.movieTarget.y;
			attr.speed.y = 0;
		} else {
			attr.y += dy;
		}

		attr.lastUpdate = now;

	};


	return Aircraft;

});
