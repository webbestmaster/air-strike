define(['GameObject'], function (GameObject) {

	function Bullet() {

		var bullet = this,
			sprite = new PIXI.Sprite.fromFrame('bullet');

		sprite.anchor.set(0.5, 0.5);

		bullet.attr = {
			sprite: sprite
		};

		bullet.setDefaultProperties();

		bullet.updateBounds();

		TweenLite.to(bullet.attr, 5, {
			x: 0
		});

	}

	Bullet.prototype = Object.create(GameObject.prototype);

	Bullet.prototype.setDefaultProperties = function () {
		
		return this.set({
			w: 146,
			h: 50,
			w05: 0, // w /2
			h05: 0,	// h / 2,
			x: 320.00,
			y: 300.00,
			visible: true
		});
		
	};
	
	// Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

		// this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);

		
		
		// console.log(this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1));

	// };

	return Bullet;

});