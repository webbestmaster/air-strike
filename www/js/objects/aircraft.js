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

		this.set({
			w: 47,
			h: 28,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: gameConfig.world.width / 2,
			y: gameConfig.world.height / 2,
			visible: true,
			lastUpdate: Date.now(),
			fullSpeed: 50, // 50 px per sec
			speed: {
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
			dx = xy1.x - aircraftData.x,
			dy = xy1.y - aircraftData.y,
			angleRadians = Math.atan2(dy, dx),
			sin = Math.sin(angleRadians),
			cos = Math.cos(angleRadians),
			fullSpeed = aircraftData.fullSpeed,
			speed = aircraftData.speed;

// debugger
		speed.x = cos * fullSpeed;
		speed.y = sin * fullSpeed;

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

		// detect is in camera or not - in not needed, cause this object belongs to player
		var attr = this.attr,
			dTime = (now - attr.lastUpdate) / 1000;

		attr.x += attr.speed.x * dTime;
		attr.y += attr.speed.y * dTime;

		attr.lastUpdate = now;


	};


	return Aircraft;

});
