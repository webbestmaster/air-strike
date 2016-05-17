/*global define*/
define(['util'], function (util) {

	"use strict";

	function LifeBar() {

		var lifeBar = this;

		lifeBar.attr = {
			pos: {
				x: 0,
				y: 0
			},
			value: 0
		};

		// lifeBar.bindEventListeners();

	}

	/*
		LifeBar.prototype.bindEventListeners = function () {

		};
	*/

	LifeBar.prototype.addTo = function (parent) {

	};

	LifeBar.prototype.hide = function () {

	};

	LifeBar.prototype.show = function () {

	};

	LifeBar.prototype.update = function () {

		// update position if needed
		// update value if needed
		// after that use camera.adjustLiveBar(this.attr)
		// camera.adjustLiveBar still not implemented

	};

	LifeBar.prototype.destroy = function () {

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
