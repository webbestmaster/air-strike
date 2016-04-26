define([
	'GameObject',
	'gameConfig',
	'mediator',
	'camera',
	'cameraKeys',
	'deviceKeys',
	'factoryKeys'
], function (GameObject,
			 gameConfig,
			 mediator,
			 camera,
			 cameraKeys,
			 deviceKeys,
			 factoryKeys) {

	function Aircraft(options) {

		var aircraft = this,
			sprite;

		aircraft.mainBindTextures(aircraft.initialTexture);

		sprite = new PIXI.Sprite(aircraft.textures.normal);
		sprite.anchor.set(0.5, 0.5);

		aircraft.attr = {
			sprite: sprite
		};

		aircraft.setDefaultProperties(options);

		aircraft.updateBounds();

		aircraft.bindEventListeners();

	}

	Aircraft.prototype = Object.create(GameObject.prototype);

	Aircraft.prototype.setDefaultProperties = function (options) {

		var now = Date.now();

		return this.set({
			w: 47,
			h: 28,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: gameConfig.world.width / 2,
			y: gameConfig.world.height / 2,
			visible: true,
			lastUpdate: now,
			lastUpdateShooting: now,
			fullSpeed: 150, // 50 px per sec
			speed: {
				x: 0,
				y: 0
			},
			movieTarget: {
				x: 0,
				y: 0
			}
		}).set(options || {});

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
		this.updateByMoveTo(this.attr.movieTarget, now);

		this.updateShooting(now);

	};

	Aircraft.prototype.updateShooting = function (now) {

		var aircraft = this,
			attr = aircraft.attr,
			dTime = now - attr.lastUpdateShooting,
			options;

		if (dTime >= 300) {

			options = {x: attr.x - attr.w05, y: attr.y, speed: {x: 0, y: -150}};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			options = {x: attr.x, y: attr.y - attr.h05, speed: {x: 0, y: -150}};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			options = {x: attr.x + attr.w05, y: attr.y, speed: {x: 0, y: -150}};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			attr.lastUpdateShooting = now;

		}


	};

	return Aircraft;

});
