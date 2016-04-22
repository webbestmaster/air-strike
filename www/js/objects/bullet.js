define(function () {

	function Bullet() {

		this.attr = {
			visible: true,
			x: 0,
			y: 0,
			sprite: null,
			w: 100,
			h: 50,
			w05: 100 / 2,
			h05: 50 / 2
			// ,a: 0 // FIXME: use angle for detect object bound
		};

	}

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

	Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

/*
		console.log(cameraX0, cameraY0, cameraX1, cameraY1, time);

		console.log('set for sprite.visible to true or false for renderer');
		console.log('set for object.visible to true or false for camera');
*/

	};

	return Bullet;

});