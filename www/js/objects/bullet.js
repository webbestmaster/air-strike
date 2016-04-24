define(['GameObject'], function (GameObject) {

	function Bullet() {

		var bullet = this,
			sprite = new PIXI.Sprite.fromFrame('bullet');

		bullet.mainInitialize(bullet.initialConfig);

		bullet.set('sprite',  sprite);
		sprite.anchor.set(0.5, 0.5);

		TweenLite.to(bullet.attr, 5, {
			x: 0
		});

	}

	Bullet.prototype = Object.create(GameObject.prototype);

	Bullet.prototype.initialConfig = {
		w: 146,
		h: 50,
		x: 320.00,
		y: 300.00
	};

	

	// Bullet.prototype.update = function (cameraX0, cameraY0, cameraX1, cameraY1, time) {

		// this.attr.visible = this.attr.sprite.visible = this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1);

		
		
		// console.log(this.isInRectangle(cameraX0, cameraY0, cameraX1, cameraY1));

	// };

	return Bullet;

});