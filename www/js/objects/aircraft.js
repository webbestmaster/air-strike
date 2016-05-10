define([
	'GameObject',
	'gameConfig',
	'mediator',
	'camera',
	'cameraKeys',
	'deviceKeys',
	'factoryKeys',
	'gameKeys',
	'gameObjectKeys'
], function (GameObject,
			 gameConfig,
			 mediator,
			 camera,
			 cameraKeys,
			 deviceKeys,
			 factoryKeys,
			 gameKeys,
			 gameObjectKeys) {

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


		// for test only
		setTimeout(function () {
			aircraft.setState(gameObjectKeys.STATE.SHOOTING, true);
		}, 1e3);
		// for test only
		setTimeout(function () {
			aircraft.setState(gameObjectKeys.STATE.SHOOTING, false);
		}, 10e3);

		

	}

	Aircraft.prototype = Object.create(GameObject.prototype);

	Aircraft.prototype.setState = function (stateName, stateData) {

		// TODO: merge this method with onChangeState

		var aircraft = this,
			attr = aircraft.attr,
			state = attr.state;

		// save prev value
		attr.prevState[stateName].data = state[stateName].data;
		// set current value
		state[stateName].data = stateData;

		aircraft.onChangeState(stateName, stateData);

	};

	Aircraft.prototype.onChangeState = function (stateName, stateData) {

		// TODO: refactor me
		// separate STATE.MOVING in other method

		var aircraft = this,
			attr = aircraft.attr,
			speed = attr.speed,
			prevSpeedX = speed.prevX,
			curSpeedX = speed.x,

			state = attr.state[stateName],
			prevState = attr.prevState[stateName],
			turnAnimationData = attr.animationData.turn,
			time = turnAnimationData.time,
			count = turnAnimationData.count,

			STATE = gameObjectKeys.STATE;

		switch (stateName) {
			case STATE.SHOOTING:
				// state.needRAFUpdate = true;
				// state.data = stateData;
				console.log('shooting update'); // remove
				break;

			case STATE.MOVING:

				if ( prevSpeedX !== 0 && curSpeedX === 0 ) { // <=> prevSpeedX && !curSpeedX
					aircraft.setTween(
						'turn',
						turnAnimationData,
						time,
						{ index: 0 }
					);
					speed.prevX = curSpeedX;
					return;
				}

				if ( prevSpeedX >= 0 && curSpeedX < 0 ) {
					aircraft.setTween(
						'turn',
						turnAnimationData,
						time,
						{ index: -count }
					);
					speed.prevX = curSpeedX;
					return;
				}

				if ( prevSpeedX <= 0 && curSpeedX > 0 ) {
					aircraft.setTween(
						'turn',
						turnAnimationData,
						time,
						{ index: count }
					);
					speed.prevX = curSpeedX;
					// return; // TODO: uncomment return in case adding code below
				}


				console.log('moving update'); // remove

				break;

			default:
				console.log(' - Unknown state - ', stateName); // remove

		}


	};

	Aircraft.prototype.setDefaultProperties = function (options) {

		var state = {},
			prevState = {},
			stateList = this.stateList,
			stateName,
			i = 0,
			len = stateList.length,
			list = stateList.list;

		for (; i < len; i += 1) {
			stateName = list[i];
			state[stateName] = {
				data: null
			};
			prevState[stateName] = {
				data: null
			};
		}

		return this.set({
			w: 47,
			h: 28,
			w05: 0, // w / 2
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
					index: 0,
					lastRoundIndex: 0,
					prefix: 'turn-',
					time: 0.2,
					count: 3
				}
			},
			movieTarget: {
				x: 0,
				y: 0
			},
			state: state,
			prevState: prevState
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

		aircraft.setState(gameObjectKeys.STATE.MOVING, true);

	};

	Aircraft.prototype.onDeviceUp = function () {

		// debugger

		// if (data) {
		// 	this.onDeviceMove(data);
		// 	return;
		// }

		this.attr.speed.x = 0;
		this.attr.speed.y = 0;

		this.setState(gameObjectKeys.STATE.MOVING, false);

	};

	Aircraft.prototype.initialTexture = {
		'turn-1': 'aircraft-1.png',
		'turn-2': 'aircraft-2.png',
		'turn-3': 'aircraft-3.png',
		// 'turn-4': 'aircraft-4.png',
		// 'turn-5': 'aircraft-5.png',
		// 'turn-6': 'aircraft-6.png',
		'normal': 'aircraft-0.png'
	};

	Aircraft.prototype.stateList = {
		list: [
			gameObjectKeys.STATE.SHOOTING,
			gameObjectKeys.STATE.MOVING
		],
		length: 2
	};

	Aircraft.prototype.update = function (x0, y0, x1, y1, now) {

		// detect is in camera or not - in not needed, cause this object belongs to player
		var aircraft = this,
			attr = aircraft.attr,
			STATE = gameObjectKeys.STATE;

		if (attr.isPause) {
			return attr.lastUpdate = now; // no matter what was return
		}

		if (attr.state[STATE.MOVING].data) {
			aircraft.updateByMoveTo(attr.movieTarget, now);
		}

		if (attr.state[STATE.SHOOTING].data) {
			aircraft.updateShooting(now);
		}

		aircraft.updateSpriteByState();

		aircraft.adjustEdge();

		attr.lastUpdate = now;

	};

	Aircraft.prototype.updateSpriteByState = function () {

		var aircraft = this,
			attr = aircraft.attr,
			sprite = attr.sprite,
			turnAnimationData = attr.animationData.turn,
			roundIndex = Math.round(turnAnimationData.index);

		// TODO: just note
		// right now we have different sprites for turns only
		// add other logic for sprites in this method
		if (roundIndex !== turnAnimationData.lastRoundIndex) {
			if (roundIndex) {
				sprite.scale.x = roundIndex < 0 ? -1 : 1;
				sprite.texture = aircraft.textures[turnAnimationData.prefix + Math.abs(roundIndex)];
			} else {
				sprite.scale.x = 1;
				// if index near from 0
				sprite.texture = aircraft.textures.normal;
			}
			turnAnimationData.lastRoundIndex = roundIndex;
			aircraft.updateBounds();
		}

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
