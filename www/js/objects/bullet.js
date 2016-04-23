define(function () {

	function Bullet() {

		var bullet = this,
			data = {
				visible: true,
				x: 320.00,
				y: 300.00,
				sprite: new PIXI.Sprite.fromFrame('bullet'),
				w: 146,
				h: 50,
				w05: 0, // w /2
				h05: 0// h / 2
				/*
				 cam: {
				 x: 0,
				 y: 0
				 }
				 */
				// ,a: 0 // FIXME: use angle for detect object bound
			};


		data.sprite.anchor.set(0.5, 0.5);

		data.w05 = data.w / 2;
		data.h05 = data.h / 2;

		bullet.attr = data;

		// TweenLite.to(data, 5, {
		// 	x: 0
		// });

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

		// count position relative camera
		var objData = this.attr;

		if (
			objData.x + objData.w05 < cameraX0 ||
			objData.y + objData.h05 < cameraY0 ||
			objData.x - objData.w05 > cameraX1 ||
			objData.y - objData.h05 > cameraY1
		) {
			objData.visible = false;
			objData.sprite.visible = false;
		}




	};

	return Bullet;

});