define(function () {

	// abstract class
	function GameObject() {

	}

	GameObject.prototype.set = function (key, value) {
		this.attr[key] = value;
	};

	GameObject.prototype.get = function (key) {
		return this.attr[key];
	};

	GameObject.prototype.mainDefaultProperties = {
		visible: true,
		x: 0,
		y: 0,
		sprite: null,
		w: 0,
		h: 0,
		w05: 0, // w /2
		h05: 0// h / 2
	};

	GameObject.prototype.mainInitialize = function () {
		
		var obj = this,
			cfg = obj.config,
			mainDefaultProperties = this.mainDefaultProperties,
			data = {},
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
		console.log('add destroy here');
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

	return GameObject;

});
