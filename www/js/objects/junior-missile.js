/*global define, PIXI */
define(['GameObject', 'gameKeys'], function (GameObject, gameKeys) {

	"use strict";
	
	function JuniorMissile(options) {

		var missile = this,
			sprite;

		missile.mainInitialize();

		missile.mainBindTextures(missile.initialTexture);

		sprite = new PIXI.Sprite(missile.textures[0]);
		sprite.anchor.set(0.5, 0.5);
		missile.set('sprite', sprite);
		missile.set('useCollision', true);
		// missile.set('rotation', Math.PI / 4);

		missile.setDefaultProperties(options);

		// missile.updateBounds();

		// this.addTween('moveTween', TweenMax.to(this.attr, 1, {x: this.attr.x - 100, repeat: -1, yoyo: true, ease: Sine.easeInOut}));

	}

	JuniorMissile.prototype = Object.create(GameObject.prototype);
	JuniorMissile.prototype.constructor = JuniorMissile;

	JuniorMissile.prototype.initialTexture = [
		'junior-missile-0.png',
		'junior-missile-1.png',
		'junior-missile-2.png',
		'junior-missile-3.png'
	];

	JuniorMissile.prototype.setDefaultProperties = function (options) {

		this.set({
			// w: 11,
			// h: 36,
			// w05: 0, // w /2
			// h05: 0,	// h / 2,
			damage: {
				value: 40
			},
			pos: {
				x: 0,
				y: 0
			},
			visible: true,
			layer: gameKeys.VIEW_LAYER_MINOR_OBJECT,
			//lastUpdate: options.lastUpdate,
			fullSpeed: 0, // 50 px per sec
			speed: {
				x: 0,
				y: 0
			}
		}).set(options || {});

		this.setTween('moveTween', this.attr.pos, 1, {x: this.attr.pos.x - 100, repeat: -1, yoyo: true, ease: Sine.easeInOut});

		return this;

	};

	JuniorMissile.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, now) {

		var missile = this,
			attr = missile.attr;

		attr.frameCounter += 1;
		if (attr.frameCounter % 4 === 0) {
			missile.useNextTexture();
		}

		if (attr.isPause) {
			return; //attr.lastUpdate = now; // no matter what was return
		}

		missile.updateBySpeedY(now);

		attr.lastUpdate = now;

		// check for missile.destroy() only
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
