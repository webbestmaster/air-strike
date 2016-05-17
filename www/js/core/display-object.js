/*global PIXI, TweenMax, Back, define */
define(['device', 'mediator', 'camera', 'cameraKeys', 'uiManagerKeys'],
	function (device, mediator, camera, cameraKeys, uiManagerKeys) {

		"use strict";

		// "abstracted class"
		function DisplayObject() {
			// you can add some initialization
			// jsLink: empty block
			return this;
		}

		DisplayObject.prototype.mainInitialize = function () {

			var obj = this;

			obj.attr = {
				moveTo: [],
				setSize: []
			};

			obj.mainBindEventListeners();

		};

		DisplayObject.prototype.mainBindEventListeners = function () {

			var obj = this;

			mediator.installTo(obj);

			obj.subscribe(cameraKeys.BOUNDS_UPDATED, obj.onMainResize);

		};

		DisplayObject.prototype.mainDestroy = function () {

			var obj = this;

			obj.unsubscribe();
			
			TweenMax.killTweensOf(obj.attr);
			TweenMax.killTweensOf(obj.sprite);

			obj.textures = null;

			mediator.publish(uiManagerKeys.REMOVE_SPRITE, obj.sprite);

			obj.sprite.destroy();

			mediator.uninstallFrom(obj);

			obj.attr = null;

		};

		DisplayObject.prototype.onMainResize = function () {

			var obj = this;

			TweenMax.killTweensOf(obj.sprite);

			obj.moveTo.apply(obj, obj.attr.moveTo);
			obj.setSize.apply(obj, obj.attr.setSize);

			mediator.publish(uiManagerKeys.UPDATE_SPRITE, obj.sprite);

		};

		DisplayObject.prototype.linkToUIManager = function () {

			var obj = this,
				sprite = obj.sprite;

			obj.publish(uiManagerKeys.APPEND_SPRITE, sprite);

		};

		DisplayObject.prototype.set = function (keyOrObject, valueOrIsDeep, isDeep) {

			if (typeof keyOrObject === 'string') {
				if (isDeep) {
					// used - key, value
					if (!this.attr[keyOrObject]) {
						this.attr[keyOrObject] = {};
					}
					util.deepExtend(valueOrIsDeep, this.attr[keyOrObject]);
				} else {
					// used - key, value, true
					this.attr[keyOrObject] = valueOrIsDeep;
				}
				return this;
			}

			// keyOrObject = object
			// valueOrIsDeep = isDeep
			if (valueOrIsDeep) {
				util.deepExtend(keyOrObject, this.attr);
			} else {
				util.extend(keyOrObject, this.attr);
			}

			return this;

		};

		DisplayObject.prototype.get = function (key) {
			return this.attr[key];
		};

		DisplayObject.prototype.setSize = function (width, height, unit) {

			var obj = this,
				sprite = obj.sprite,
				q;

			obj.set('setSize', [width, height, unit]);

			if (unit === cameraKeys.REM) {
				width = width === -1 ? -1 : camera.remToPixel(width);
				height = height === -1 ? -1 : camera.remToPixel(height);
			}

			if (width === -1) {
				q = sprite.height / height;
				sprite.height = height;
				sprite.width = Math.round(sprite.width / q);
				return this;
			}

			if (height === -1) {
				q = sprite.width / width;
				sprite.width = width;
				sprite.height = Math.round(sprite.height / q);
				return this;
			}

			sprite.width = width;
			sprite.height = height;

			return this;

		};

		DisplayObject.prototype.setAnchor = function (x, y) {
			this.sprite.anchor.x = x;
			this.sprite.anchor.y = y;
		};

		DisplayObject.prototype.moveTo = function (windowPoint, objectPoint, leftOffset, topOffset, unit) {

			leftOffset = leftOffset || 0;
			topOffset = topOffset || 0;

			var obj = this,
				xy1 = device.getCoordinatesOfPoint(windowPoint),
				xy2 = obj.getCoordinatesOfPoint(objectPoint);

			obj.set('moveTo', [windowPoint, objectPoint, leftOffset, topOffset, unit]);

			if (unit === cameraKeys.REM) {
				leftOffset = camera.remToPixel(leftOffset);
				topOffset = camera.remToPixel(topOffset);
			}

			obj.sprite.x += xy1.x - xy2.x + leftOffset;
			obj.sprite.y += xy1.y - xy2.y + topOffset;

		};

		DisplayObject.prototype.moveToAnimate = function (windowPoint, objectPoint, options, leftOffset, topOffset, unit) {

			leftOffset = leftOffset || 0;
			topOffset = topOffset || 0;

			if (typeof options === 'number') {
				options = {time: options};
			}

			this.set('moveTo', [windowPoint, objectPoint, leftOffset, topOffset, unit]);

			if (unit === cameraKeys.REM) {
				leftOffset = camera.remToPixel(leftOffset);
				topOffset = camera.remToPixel(topOffset);
			}

			var obj = this,
				sprite = obj.sprite,
				xy1 = device.getCoordinatesOfPoint(windowPoint),
				xy2 = obj.getCoordinatesOfPoint(objectPoint),
				cfg = {
					x: sprite.x - xy2.x + xy1.x + leftOffset,
					y: sprite.y - xy2.y + xy1.y + topOffset,
					delay: options.delay || 0,
					// onComplete: options.onComplete,
					onComplete: function () {

						if (options.onComplete) {
							options.onComplete();
						}

						mediator.publish(uiManagerKeys.UPDATE_SPRITE, obj.sprite);

					},
					ease: options.ease || Back.easeOut
				};

			TweenMax.killTweensOf(sprite);
			TweenMax.to(sprite, options.time, cfg);

		};

		//////
		// helpers
		//////

		DisplayObject.prototype.getBounds = function () {

			this.sprite.updateTransform();

			return this.sprite.getBounds();

		};

		DisplayObject.prototype.getCoordinatesOfPoint = function (point) {

			var bounds = this.getBounds(),
				coordinates = {
					x: 0,
					y: 0
				};

			switch (point) {
				case 1 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y;
					break;
				case 2 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y;
					break;
				case 3 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y;
					break;
				case 4 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 5 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 6 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 7 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y + bounds.height;
					break;
				case 8 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y + bounds.height;
					break;
				case 9 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y + bounds.height;
					break;
			}

			return coordinates;

		};

//////
// debug
//////
		DisplayObject.prototype.showSpriteDebug = function (sprite) {

			sprite.updateTransform();

			var bounds = sprite.getBounds(),
				graphic = new PIXI.Graphics();

			graphic.beginFill(0xFF0000, 0.5);
			graphic.drawRect(-bounds.width * sprite.anchor.x, -bounds.height * sprite.anchor.y, bounds.width, bounds.height);
			graphic.endFill();
			sprite.addChild(graphic);

		};

		DisplayObject.prototype.showDebug = function () {

			this.showSpriteDebug(this.sprite);

		};

		return DisplayObject;

	}
);

