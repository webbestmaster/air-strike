define(['GameObject'], function (GameObject) {

	function JuniorMissile(options) {

		var missile = this,
			sprite;

		missile.mainInitialize();

		missile.mainBindTextures(missile.initialTexture);

		sprite = new PIXI.Sprite(missile.textures[0]);
		sprite.anchor.set(0.5, 0.5);
		missile.set('sprite', sprite);

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

		this.set({
			w: 11,
			h: 36,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: 320.00,
			y: 300.00,
			visible: true,
			//lastUpdate: options.lastUpdate,
			fullSpeed: 0, // 50 px per sec
			speed: {
				x: 0,
				y: 0
			}
		}).set(options || {});

		TweenMax.to(this.attr, 1, {x: this.attr.x - 100, repeat: -1, yoyo: true, ease: Sine.easeInOut});

/*
		var rr = TweenMax.to(this.attr, 1, {x: this.attr.x - 100, repeat: -1, yoyo: true, ease: Sine.easeInOut});
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

		return this;

	};

	JuniorMissile.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, now) {

		var missile = this;

		missile.attr.frameCounter += 1;
		if (missile.attr.frameCounter % 4 === 0) {
			missile.useNextTexture();
		}

		if (missile.attr.isPause) {
			return;
		}

		missile.updateBySpeedY(now);

		if (missile.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1)) {
			return;
		}

		missile.destroy();

	};

	// Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

	// this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);


	// console.log(this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1));

	// };

	return JuniorMissile;

});
