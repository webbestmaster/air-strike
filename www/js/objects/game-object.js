define(['factoryKeys', 'gameKeys', 'mediator', 'gameConfig', 'camera', 'gameObjectKeys'], function (factoryKeys, gameKeys, mediator, gameConfig, camera, gameObjectKeys) {

	// abstract class
	function GameObject() {

	}

	GameObject.prototype.mainInitialize = function () {

		var obj = this;

		obj.attr = {
			isPause: false,
			frameCounter: 0,
			teamId: 0,
			ownerId: 0,
			angle: 0
		};
		obj.tweens = {
			instances: {},
			keys: [],
			keysLength: 0
		};

		obj.setDefaultStates();

		/*

		 this.tweens = {
		 instances: {
		 myTween1: TweenMax,
		 myTween2: TweenMax,
		 myTween3: TweenMax,
		 myTween4: TweenMax
		 },
		 keys: ['myTween1', 'myTween2', 'myTween3', 'myTween4'],
		 keysLength: 4
		 };
		 */

		obj.mainBindEventListeners();

	};

	GameObject.prototype.setDefaultStates = function () {

		var obj = this,
			attr = obj.attr,
			state = {},
			prevState = {},
			stateList = obj.stateList,
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

		attr.state = state;
		attr.prevState = prevState;

	};

	GameObject.prototype.stateList = {
		list: [],
		length: 0
	};

	GameObject.prototype.setState = function (stateName, stateData) {

		var obj = this,
			attr = obj.attr,
			state = attr.state[stateName],
			prevState = attr.prevState[stateName];

		// save prev value
		prevState.data = state.data;
		// set current value
		state.data = stateData;

		obj.onChangeState(stateName, stateData);

	};

	GameObject.prototype.onChangeState = function (stateName, stateData) {
		// just empty method for setState
		// each class have to override this one
	};

	GameObject.prototype.setTween = function (tweenId, obj, time, settings) {

		var tweens = this.tweens;

		if (tweens.instances[tweenId]) {
			// kill tween if exist
			tweens.instances[tweenId].kill();
		} else {
			tweens.keys[tweens.keysLength] = tweenId;
			tweens.keysLength += 1;
		}

		tweens.instances[tweenId] = new TweenMax(obj, time, settings);

	};

	/*
	 GameObject.prototype.stopTweenFor = function (tweenId, cfg) {

	 var tweens = this.tweens;

	 if (tweens.instances[tweenId]) {
	 // kill tween if exist
	 tweens.instances[tweenId].kill(cfg);
	 }

	 };

	 GameObject.prototype.stopTween = function (tweenId) {

	 var tweens = this.tweens;
	 if (tweens.instances[tweenId]) {
	 // kill tween if exist
	 tweens.instances[tweenId].kill();
	 }

	 };
	 */

	GameObject.prototype.stopTweens = function () {

		var tweens = this.tweens,
			instances = tweens.instances,
			keys = tweens.keys,
			keysLength = tweens.keysLength,
			i = 0;

		for (; i < keysLength; i += 1) {
			instances[keys[i]].kill();
		}

	};

	GameObject.prototype.pauseTweens = function () {

		var tweens = this.tweens,
			instances = tweens.instances,
			keys = tweens.keys,
			keysLength = tweens.keysLength,
			i = 0;

		for (; i < keysLength; i += 1) {
			instances[keys[i]].pause();
		}

	};

	GameObject.prototype.resumeTweens = function () {

		var tweens = this.tweens,
			instances = tweens.instances,
			keys = tweens.keys,
			keysLength = tweens.keysLength,
			i = 0;

		for (; i < keysLength; i += 1) {
			instances[keys[i]].resume();
		}

	};

	/*
	 // still not used
	 GameObject.prototype.playTweens = function () {

	 var tweens = this.tweens,
	 instances = tweens.instances,
	 keys = tweens.keys,
	 keysLength = tweens.keysLength,
	 i = 0;

	 for (; i < keysLength; i += 1) {
	 instances[keys[i]].play();
	 }

	 };
	 */

	GameObject.prototype.mainBindEventListeners = function () {
		var obj = this;
		mediator.installTo(obj);
		obj.subscribe(gameKeys.PAUSE, obj.onPause);
		obj.subscribe(gameKeys.RESUME, obj.onResume);
		obj.subscribe(gameObjectKeys.DEBUG.SHOW, obj.debugShow);
		obj.subscribe(gameObjectKeys.DEBUG.HIDE, obj.debugHide);
	};

	GameObject.prototype.debugShow = function () {

		var obj = this,
			points = obj.getPointCoordinates().map(function (point) {
				return {
					x: (point.x + camera.attr.w05 - camera.attr.pos.x) * camera.attr.q,
					y: (point.y + camera.attr.h05 - camera.attr.pos.y) * camera.attr.q
				}
			}),
			graphics = new PIXI.Graphics();

		graphics.beginFill(0xFFFFFF, 1);
		// graphics.lineStyle(3, 0xffd900, 1);
		graphics.moveTo(points[3].x, points[3].y);
		points.forEach(function (point) {
			graphics.lineTo(point.x, point.y);
		});
		graphics.endFill();
		obj.publish(gameKeys.APPEND_SPRITE, {
			sprite: graphics,
			layer: obj.attr.layer
		});

	};

	GameObject.prototype.debugHide = function () {

	};

	GameObject.prototype.onPause = function () {
		this.pauseTweens();
		this.attr.isPause = true;
	};

	GameObject.prototype.onResume = function () {
		this.resumeTweens();
		this.attr.isPause = false;
	};

	GameObject.prototype.destroy = function () {

		var obj = this;

		obj.hide();
		obj.stopTweens();
		obj.setDefaultStates();
		mediator.publish(factoryKeys.events.DESTROY, this);

	};

	GameObject.prototype.fullDestroy = function () {

		var obj = this,
			attr = obj.attr,
			sprite = attr.sprite;

		obj.stopTweens();
		// TweenMax.killTweensOf(attr.pos);
		sprite.parent.removeChild(sprite);
		// TweenMax.killTweensOf(sprite);

		obj.textures = null;

		obj.unsubscribe();
		mediator.uninstallFrom(obj);
		obj.attr = null;
		obj.tweens = null;

	};

	GameObject.prototype.hide = function () {
		this.attr.visible = false;
		this.attr.sprite.visible = false;
	};

	GameObject.prototype.show = function () {
		this.attr.visible = true;
		this.attr.sprite.visible = true;
	};

	GameObject.prototype.set = function (keyOrObject, value) {

		var key;

		if (typeof keyOrObject === 'string') {
			this.attr[keyOrObject] = value;
			return this;
		}

		for (key in keyOrObject) {
			if (keyOrObject.hasOwnProperty(key)) {
				this.attr[key] = keyOrObject[key];
			}
		}

		return this;

	};

	GameObject.prototype.get = function (key) {
		return this.attr[key];
	};

	/*
	 GameObject.prototype.mainDefaultProperties = {
	 visible: true,
	 x: 0,
	 y: 0,
	 sprite: null,
	 w: 0,
	 h: 0,
	 w05: 0, // w /2
	 h05: 0	// h / 2,
	 };

	 GameObject.prototype.mainInitialize = function (cfg) {

	 var obj = this,
	 mainDefaultProperties = this.mainDefaultProperties,
	 data = {
	 lastUpdate: Date.now(),
	 speed: {
	 x: 0,
	 y: 0
	 }
	 },
	 key;

	 for (key in mainDefaultProperties) {
	 if (mainDefaultProperties.hasOwnProperty(key)) {
	 data[key] = cfg.hasOwnProperty(key) ? cfg[key] : mainDefaultProperties[key];
	 }
	 }

	 data.w05 = data.w / 2;
	 data.h05 = data.h / 2;

	 obj.attr = data;

	 };
	 */

	GameObject.prototype.isInRectangle = function (cameraX0, cameraY0, cameraX1, cameraY1) {

		// count position relative camera
		var objData = this.attr;

		return objData.pos.x + objData.w05 > cameraX0 &&
			objData.pos.y + objData.h05 > cameraY0 &&
			objData.pos.x - objData.w05 < cameraX1 &&
			objData.pos.y - objData.h05 < cameraY1;

	};

	GameObject.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

		this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);

		// console.log('add destroy here');

	};

	GameObject.prototype.updateBounds = function () {

		var attr = this.attr,
			texture = attr.sprite.texture,
			width = texture.width,
			height = texture.height,
			width05 = width / 2,
			height05 = height / 2;

		attr.w = width;
		attr.h = height;

		attr.minX = attr.w05 = width05;
		attr.minY = attr.h05 = height05;

		attr.maxX = gameConfig.world.width - width05;
		attr.maxY = gameConfig.world.height - height05;

	};

	GameObject.prototype.getPointCoordinates = function () {

		// TODO: optimize it - cache sins and cos'

		var attr = this.attr,
			x = attr.pos.x,
			y = attr.pos.y,
			width05 = attr.w05,
			height05 = attr.h05,
			pi = Math.PI,
			pi05 = pi / 2,
			lineSize = Math.sqrt(width05 * width05 + height05 * height05),
			ltAngle = Math.atan2(-height05, -width05) + attr.angle || 0; // lt - Left Top angle

		return [
			{
				x: Math.cos(pi05 - ltAngle) * lineSize + x,
				y: Math.sin(pi05 - ltAngle) * lineSize + y
			},
			{
				x: Math.cos(ltAngle) * lineSize + x,
				y: Math.sin(ltAngle) * lineSize + y
			},
			{
				x: Math.cos(-pi05 - ltAngle) * lineSize + x,
				y: Math.sin(-pi05 - ltAngle) * lineSize + y
			},
			{
				x: Math.cos(pi + ltAngle) * lineSize + x,
				y: Math.sin(pi + ltAngle) * lineSize + y
			}
		];

	};

	GameObject.prototype.mainBindTextures = function (data) {

		var i, len, textures;

		if (Array.isArray(data)) {
			textures = [];
			for (i = 0, len = data.length; i < len; i += 1) {
				textures[i] = PIXI.Texture.fromFrame(data[i])
			}
			this.attr.texturesLength = len;
			this.attr.texturesIndex = 0;
		} else {
			textures = {};
			for (i in data) {
				if (data.hasOwnProperty(i)) {
					textures[i] = PIXI.Texture.fromFrame(data[i]);
				}
			}
		}

		this.textures = textures;

	};

	/*	// not used yet
	 Bullet.prototype.getBounds = function () {

	 var data = this.attr,
	 x = data.x,
	 y = data.y;

	 return {
	 x0: x - data.w05,
	 y0: y - data.h05,
	 x1: x + data.w05,
	 y1: y + data.h05
	 }

	 };
	 */

	GameObject.prototype.updateBySpeed = function (now) {

		var attr = this.attr,
			dTime = (now - attr.lastUpdate) / 1000;

		attr.pos.x += attr.speed.x * dTime;
		attr.pos.y += attr.speed.y * dTime;

		// attr.lastUpdate = now;

	};

	GameObject.prototype.updateBySpeedX = function (now) {

		var attr = this.attr;

		attr.pos.x += attr.speed.x * (now - attr.lastUpdate) / 1000;

		// attr.lastUpdate = now;

	};

	GameObject.prototype.updateBySpeedY = function (now) {

		var attr = this.attr;

		attr.pos.y += attr.speed.y * (now - attr.lastUpdate) / 1000;

		// attr.lastUpdate = now;

	};

	GameObject.prototype.updateByMoveTo = function (xy, now) {

		var attr = this.attr,
			dTime = (now - attr.lastUpdate) / 1000,
			dx = attr.speed.x * dTime,
			dy = attr.speed.y * dTime;

		if (Math.abs(attr.pos.x - xy.x) <= Math.abs(dx)) {
			attr.pos.x = xy.x;
			attr.speed.x = 0;
		} else {
			attr.pos.x += dx;
		}

		if (Math.abs(attr.pos.y - xy.y) <= Math.abs(dy)) {
			attr.pos.y = xy.y;
			attr.speed.y = 0;
		} else {
			attr.pos.y += dy;
		}

		// attr.lastUpdate = now;

	};

	GameObject.prototype.moveBy = function (data) {

		var obj = this,
			pos = obj.attr.pos;

		if (data.time) {
			obj.setTween('moveByTween', pos, data.time, {
				x: pos.x + (data.x || 0),
				y: pos.y + (data.y || 0)
			});
			return;
		}

		pos.x += data.x || 0;
		pos.y += data.y || 0;

	};

	GameObject.prototype.useNextTexture = function () {

		var obj = this,
			data = obj.attr,
			index = data.texturesIndex + 1;

		if (index === data.texturesLength) {
			index = 0;
		}

		data.texturesIndex = index;

		// debugger

		data.sprite.texture = obj.textures[index];

	};

	return GameObject;

});
