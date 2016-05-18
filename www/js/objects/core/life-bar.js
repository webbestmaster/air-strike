/*global define, PIXI */
define(['util', 'gameKeys', 'mediator', 'camera'], function (util, gameKeys, mediator, camera) {

	"use strict";

	function LifeBar() {

		var lifeBar = this;

		lifeBar.attr = {
			layer: gameKeys.VIEW_LAYER_GAME_OBJECT_INFO,
			graphics: null,
			parent: null
		};

		lifeBar.setDefaultProperties();

		lifeBar.initialize();

	}

	LifeBar.prototype.initialize = function () {

		var lifeBar = this,
			graphics = new PIXI.Graphics();

		lifeBar.set('graphics', graphics);

	};

	LifeBar.prototype.setDefaultProperties = function () {

		return this.set({
			pos: {
				x: NaN,
				y: NaN
			},
			w: NaN,
			h: NaN,
			w05: NaN,
			h05: NaN,
			value: NaN
		}, true);

	};

	LifeBar.prototype.addTo = function (parent) {

		var lifeBar = this,
			attr = lifeBar.attr;

		attr.parent = parent;

		mediator.publish(gameKeys.APPEND_SPRITE, {
			sprite: attr.graphics,
			layer: attr.layer
		});

		lifeBar.updateBounds();

	};

	LifeBar.prototype.updateBounds = function () {

		var lifeBar = this,
			attr = lifeBar.attr,
			bar = attr.parent.attr.life.bar;

		attr.w = bar.w;
		attr.h = bar.h;

		attr.w05 = bar.w / 2;
		attr.h05 = bar.h / 2;

	};

	LifeBar.prototype.update = function () {

		var attr = this.attr,
			parentAttr = attr.parent.attr,
			graphics = attr.graphics;

		if (attr.value !== parentAttr.life.value) {
			attr.value = parentAttr.life.value;
			graphics.clear();
			graphics.lineStyle(0);
			graphics.beginFill(0xFF0000, 1);
			graphics.drawRect(0, 0, attr.w, attr.h);
			graphics.beginFill(0x00FF00, 1);
			graphics.drawRect(0, 0, attr.w * attr.value / parentAttr.life.max, attr.h);
			// graphics.endFill();
		}

		attr.pos.x = parentAttr.pos.x;
		attr.pos.y = parentAttr.pos.y - parentAttr.diagonal05;
		camera.adjustGraphics(attr);

	};

	LifeBar.prototype.destroy = function () {

		var lifeBar = this,
			graphics = lifeBar.attr.graphics;

		graphics.clear();
		graphics.visible = false;

		lifeBar.setDefaultProperties();

	};

	LifeBar.prototype.fullDestroy = function () {

		var lifeBar = this,
			graphics = lifeBar.attr.graphics;

		lifeBar.destroy();
		graphics.parent.removeChild(graphics);

		lifeBar.attr = null;

	};

	LifeBar.prototype.set = function (keyOrObject, valueOrIsDeep, isDeep) {

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

	LifeBar.prototype.get = function (key) {
		return this.attr[key];
	};

	return LifeBar;

});
