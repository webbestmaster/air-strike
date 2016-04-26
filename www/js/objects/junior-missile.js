define(['GameObject'], function (GameObject) {

	function JuniorMissile(options) {

		var missile = this,
			sprite;

		missile.attr = {};

		missile.mainBindTextures(missile.initialTexture);

		sprite = new PIXI.Sprite(missile.textures[0]);
		sprite.anchor.set(0.5, 0.5);

		missile.attr.sprite = sprite;

		missile.setDefaultProperties(options);

		missile.updateBounds();

	}

	JuniorMissile.prototype = Object.create(GameObject.prototype);

	JuniorMissile.prototype.initialTexture = [
		'junior-missile-0.png',
		'junior-missile-1.png',
		'junior-missile-2.png',
		'junior-missile-3.png'
	];

	JuniorMissile.prototype.setDefaultProperties = function (options) {

		return this.set({
			w: 11,
			h: 36,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: 320.00,
			y: 300.00,
			visible: true,
			lastUpdate: Date.now(),
			fullSpeed: 0, // 50 px per sec
			speed: {
				x: 0,
				y: 0
			}
		}).set(options || {});

	};

	JuniorMissile.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, now) {

		this.updateBySpeed(now);
		
		this.useNextTexture();

		if ( this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1) ) {
			return;
		}

		this.destroy();

	};

	// Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

	// this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);


	// console.log(this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1));

	// };

	return JuniorMissile;

});
