define([
	'GameObject',
	'gameConfig',
	'mediator',
	'camera',
	'cameraKeys',
	'deviceKeys',
	'factoryKeys',
	'gameKeys'
], function (GameObject,
			 gameConfig,
			 mediator,
			 camera,
			 cameraKeys,
			 deviceKeys,
			 factoryKeys,
			 gameKeys) {

	function Aircraft(options) {

		var aircraft = this,
			sprite;

		aircraft.mainInitialize();

		aircraft.mainBindTextures(aircraft.initialTexture);

		sprite = new PIXI.Sprite(aircraft.textures.normal);
		sprite.anchor.set(0.5, 0.5);
		aircraft.set('sprite', sprite);

		aircraft.setDefaultProperties(options);

		aircraft.updateBounds();

		aircraft.bindEventListeners();

		aircraft.publish(cameraKeys.FOLLOW_TO, aircraft.attr);

	}

	Aircraft.prototype = Object.create(GameObject.prototype);

	Aircraft.prototype.setDefaultProperties = function (options) {

		return this.set({
			w: 47,
			h: 28,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			pos: {
				x: gameConfig.world.width / 2,
				y: gameConfig.world.height / 2
			},
			visible: true,
			layer: gameKeys.VIEW_LAYER_MAJOR_OBJECT,
			//lastUpdate: options.lastUpdate,
			lastUpdateShooting: options.lastUpdate,
			fullSpeed: 150, // 50 px per sec
			minX: 47 / 2,
			minY: 28 / 2,
			maxX: gameConfig.world.width - 47 / 2,
			maxY: gameConfig.world.height - 28 / 2,
			speed: {
				x: 0,
				y: 0,
				prevX: 0,
				prevY: 0
			},
			animationData: {
				turn: {
					curIndex: 0,
					lastIndex: 0,
					prefix: 'turn-',
					time: 1,
					count: 3
				}
			},
			movieTarget: {
				x: 0,
				y: 0
			}
		}).set(options || {});

	};

	Aircraft.prototype.bindEventListeners = function () {

		var aircraft = this;

		aircraft.subscribe(deviceKeys.DOWNS, aircraft.onDeviceMove);
		aircraft.subscribe(deviceKeys.MOVES, aircraft.onDeviceMove);
		aircraft.subscribe(deviceKeys.UPS, aircraft.onDeviceUp);
		aircraft.subscribe(cameraKeys.CHANGE_XY, aircraft.onCameraChangeXY);

	};

	Aircraft.prototype.onCameraChangeXY = function (dxdy) {

		var aircraft = this,
			attr = aircraft.attr,
			speed = aircraft.attr.speed;

		if (speed.x || speed.y) { // detect aircraft is moving
			attr.movieTarget.x += dxdy.dx;
			attr.movieTarget.y += dxdy.dy;
		}

	};

	Aircraft.prototype.onDeviceMove = function (data) {

		/*
		 this.attr.x += (data.dx / gameObjectHelper.attr.qX);
		 this.attr.y += (data.dy / gameObjectHelper.attr.qY);
		 */

		var aircraft, aircraftData, xy1, x1, y1, dx, dy, angleRadians, sin, cos, fullSpeed, speed;

		xy1 = camera.toGameCoordinatesAverage(data);

		if (xy1 === null) {
			return;
		}

		aircraft = this;
		aircraftData = aircraft.attr;
		x1 = xy1.x;
		y1 = xy1.y;
		dx = x1 - aircraftData.pos.x;
		dy = y1 - aircraftData.pos.y;
		angleRadians = Math.atan2(dy, dx);
		sin = Math.sin(angleRadians);
		cos = Math.cos(angleRadians);
		fullSpeed = aircraftData.fullSpeed;
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
		'turn-0': 'aircraft-rotate-1.png',
		'turn-1': 'aircraft-rotate-2.png',
		'normal': 'aircraft.png'
	};

	Aircraft.prototype.update = function (x0, y0, x1, y1, now) {

		// detect is in camera or not - in not needed, cause this object belongs to player
		var aircraft = this,
			attr = aircraft.attr;

		if (attr.isPause) {
			return;
		}

		aircraft.updateByMoveTo(attr.movieTarget, now);

		aircraft.updateAnimationIndex();

		aircraft.adjustEdge();

		aircraft.updateShooting(now);

	};

	Aircraft.prototype.updateAnimationIndex = function () {

		var aircraft = this,
			attr = aircraft.attr,
			speed = attr.speed,
			prevSpeedX = speed.prevX,
			curSpeedX = speed.x
/*
			turnAnimationData = attr.animationData.turn,
			time = turnAnimationData.time,
			count = turnAnimationData.count,
			prefix = turnAnimationData.prefix,
			index = turnAnimationData.index
*/
			;

		if ( prevSpeedX !== 0 && curSpeedX === 0 ) { // <=> prevSpeedX && !curSpeedX

			// todo: turn to normal state



			// console.log('normal');

			speed.prevX = curSpeedX;
			return;
		}

		if ( prevSpeedX >= 0 && curSpeedX < 0 ) {

			// todo: turn to left side



			// console.log('<');

			speed.prevX = curSpeedX;
			return;
		}

		if ( prevSpeedX <= 0 && curSpeedX > 0 ) {

			// todo: turn to rght side

			// console.log('>');

			speed.prevX = curSpeedX;
			return;
		}





		return;



		if ( (prevSpeedX > 0 && curSpeedX > 0) ||
			(prevSpeedX < 0 && curSpeedX < 0) ) {



		}



		if ( (prevSpeedX > 0 && curSpeedX > 0) ||
			(prevSpeedX < 0 && curSpeedX < 0) ||
			(prevSpeedX === 0 && curSpeedX === 0) ) {
			console.log('no change for speed x');
			return;
		}



		if (curSpeedX === 0) {
			attr.sprite.scale.x = 1;
			aircraft.setTween('spriteState', attr.spritesData, animationTime * attr.spritesData.spriteIndex / spritesCount, {spriteIndex: 0});
		}

		if (curSpeedX > 0) {
			attr.sprite.scale.x = 1;
		}

		if (curSpeedX < 0) {
			attr.sprite.scale.x = -1;
		}





		aircraft.setTween('spriteState', attr.spritesData, 1, {spriteIndex: spritesCount});



		speed.prevX = curSpeedX;


	};

	Aircraft.prototype.adjustEdge = function () {

		var aircraft = this,
			attr = aircraft.attr,
			x = attr.pos.x,
			y = attr.pos.y;

		if (x > attr.maxX) {
			x = attr.maxX;
		} else if (x < attr.minX) {
			x = attr.minX;
		}

		if (y > attr.maxY) {
			y = attr.maxY;
		} else if (y < attr.minY) {
			y = attr.minY;
		}

		attr.pos.x = x;
		attr.pos.y = y;

	};

	Aircraft.prototype.updateShooting = function (now) {

		var aircraft = this,
			attr = aircraft.attr,
			dTime = now - attr.lastUpdateShooting,
			options;

		if (dTime >= 300) {

			options = {pos:{ x: attr.pos.x - attr.w05, y: attr.pos.y}, speed: {x: 0, y: -150}, lastUpdate: now};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			options = {pos:{x: attr.pos.x, y: attr.pos.y - attr.h05}, speed: {x: 0, y: -150}, lastUpdate: now};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			options = {pos:{x: attr.pos.x + attr.w05, y: attr.pos.y}, speed: {x: 0, y: -150}, lastUpdate: now};
			this.publish(factoryKeys.events.CREATE, factoryKeys.objects.JUNIOR_MISSILE, options);

			attr.lastUpdateShooting = now;

		}


	};

	return Aircraft;

});
