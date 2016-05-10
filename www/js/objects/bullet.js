define(['GameObject'], function (GameObject) {

	function Bullet(options) {

		var bullet = this,
			sprite = new PIXI.Sprite.fromFrame('bullet');

		bullet.mainInitialize();

		sprite.anchor.set(0.5, 0.5);

		bullet.set('sprite', sprite);

		bullet.setDefaultProperties(options);

		bullet.updateBounds();

	}

	Bullet.prototype = Object.create(GameObject.prototype);
	Bullet.prototype.constructor = Bullet;

	Bullet.prototype.setDefaultProperties = function (options) {

		return this.set({
			w: 146,
			h: 50,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: 320.00,
			y: 300.00,
			visible: true,
			// lastUpdate: options.lastUpdate,
			fullSpeed: 200, // 50 px per sec
			speed: {
				x: 10,
				y: 10
			}
		}).set(options || {});

	};

	Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, now) {

		this.updateBySpeed(now);

		if ( this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1) ) {
			return;
		}

		this.destroy();

	};

	// Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

	// this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);


	// console.log(this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1));

	// };

	return Bullet;

});