define(['GameObject', 'gameKeys'], function (GameObject, gameKeys) {

	function Cross(options) {

		var cross = this,
			sprite;

		cross.mainInitialize();

		sprite = new PIXI.Sprite.fromFrame('cross');
		sprite.anchor.set(0.5, 0.5);
		cross.set('sprite', sprite);

		cross.setDefaultProperties(options);

		// cross.updateBounds();

	}

	Cross.prototype = Object.create(GameObject.prototype);
	Cross.prototype.constructor = Cross;

	Cross.prototype.setDefaultProperties = function (options) {

		this.set({
			//w: 16,
			//h: 16,
			// w05: 0, // w /2
			// h05: 0,	// h / 2,
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

		return this;

	};

	return Cross;

});
