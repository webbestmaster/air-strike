define(['factoryKeys', 'gameKeys', 'mediator'], function (factoryKeys, gameKeys, mediator) {

	// abstract class
	function GameObject() {

	}

	GameObject.prototype.mainInitialize = function () {
		this.attr = {isPause: false, frameCounter: 0};
		this.tweens = {
			instances: {},
			keys: [],
			keysLength: 0
		};

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


		this.mainBindEventListeners();
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
		mediator.installTo(this);
		this.subscribe(gameKeys.PAUSE, this.onPause);
		this.subscribe(gameKeys.RESUME, this.onResume);
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

		this.hide();
		this.stopTweens();
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
			texture = attr.sprite.texture;

		attr.w = texture.width;
		attr.h = texture.height;

		attr.w05 = attr.w / 2;
		attr.h05 = attr.h / 2;

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

		attr.lastUpdate = now;

	};

	GameObject.prototype.updateBySpeedX = function (now) {

		var attr = this.attr;

		attr.pos.x += attr.speed.x * (now - attr.lastUpdate) / 1000;

		attr.lastUpdate = now;

	};

	GameObject.prototype.updateBySpeedY = function (now) {

		var attr = this.attr;

		attr.pos.y += attr.speed.y * (now - attr.lastUpdate) / 1000;

		attr.lastUpdate = now;

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

		attr.lastUpdate = now;

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
