define([
	'GameObject',
	'gameConfig',
	'mediator',
	'camera',
	'cameraKeys',
	'deviceKeys',
	'gameObjectHelper'
], function (
	GameObject,
	gameConfig,
	mediator,
	camera,
	cameraKeys,
	deviceKeys,
	gameObjectHelper) {

	function Aircraft() {

		var aircraft = this,
			sprite;

		aircraft.mainInitialize(aircraft.initialConfig);

		aircraft.mainBindTextures(aircraft.initialTexture);

		sprite = new PIXI.Sprite(aircraft.textures.rotate_2);

		aircraft.set('sprite', sprite);
		sprite.anchor.set(0.5, 0.5);

		aircraft.bindEventListeners();

	}

	Aircraft.prototype = Object.create(GameObject.prototype);

	Aircraft.prototype.bindEventListeners = function () {

		var obj = this;

		mediator.installTo(obj);

		obj.subscribe(deviceKeys.MOVE, obj.onDeviceMove);

	};

	Aircraft.prototype.onDeviceMove = function (data) {

		this.attr.x += (data.dx / gameObjectHelper.attr.qX);
		this.attr.y += (data.dy / gameObjectHelper.attr.qY);

	};

	Aircraft.prototype.initialConfig = {
		w: 47,
		h: 28,
		x: gameConfig.world.width / 2,
		y: gameConfig.world.height / 2
	};

	Aircraft.prototype.initialTexture = {
		rotate_1: 'aircraft-rotate-1.png',
		rotate_2: 'aircraft-rotate-2.png',
		normal: 'aircraft.png'
	};

	Aircraft.prototype.update = function () {

		// detect is in camera or not - in not needed, cause this object belongs to player


	};


	return Aircraft;

});
