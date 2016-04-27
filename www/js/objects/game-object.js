define(['factoryKeys', 'gameKeys', 'mediator'], function (factoryKeys, gameKeys, mediator) {

	// abstract class
	function GameObject() {

	}

	GameObject.prototype.mainInitialize = function () {
		this.attr = { isPause: false, frameCounter: 0 };
		this.mainBindEventListeners();
	};

	GameObject.prototype.mainBindEventListeners = function () {
		mediator.installTo(this);
		this.subscribe(gameKeys.PAUSE, this.onPause);
		this.subscribe(gameKeys.RESUME, this.onResume);
	};

	GameObject.prototype.onPause = function () {
		this.attr.isPause = true;
	};

	GameObject.prototype.onResume = function () {
		this.attr.isPause = false;
	};

	GameObject.prototype.destroy = function () {

		this.hide();
		mediator.publish(factoryKeys.events.DESTROY, this);

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

		return objData.x + objData.w05 > cameraX0 &&
			objData.y + objData.h05 > cameraY0 &&
			objData.x - objData.w05 < cameraX1 &&
			objData.y - objData.h05 < cameraY1;

	};

	GameObject.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

		if ( this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1) ) {
			return;
		}

		this.attr.visible = this.attr.sprite.visible = false;
		// console.log('add destroy here');
	};

	GameObject.prototype.updateBounds = function () {

		this.attr.w05 = this.attr.w / 2;
		this.attr.h05 = this.attr.h / 2;

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

		attr.x += attr.speed.x * dTime;
		attr.y += attr.speed.y * dTime;

		attr.lastUpdate = now;

	};

	GameObject.prototype.updateByMoveTo = function (xy, now) {

		var attr = this.attr,
			dTime = (now - attr.lastUpdate) / 1000,
			dx = attr.speed.x * dTime,
			dy = attr.speed.y * dTime;

		if (Math.abs(attr.x - xy.x) <= Math.abs(dx)) {
			attr.x = xy.x;
			attr.speed.x = 0;
		} else {
			attr.x += dx;
		}

		if (Math.abs(attr.y - xy.y) <= Math.abs(dy)) {
			attr.y = xy.y;
			attr.speed.y = 0;
		} else {
			attr.y += dy;
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
