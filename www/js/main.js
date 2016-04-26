requirejs.config({

	baseUrl: './js/',

	paths: {
		// init service
		log: 'services/log',
		mediator: 'services/mediator',
		// init libs
		Deferred: 'lib/deferred',
		fontLoader: 'lib/font-loader',
		PIXI: 'lib/pixi',
		EasePack: 'lib/EasePack',
		TweenLite: 'lib/TweenLite',
		FPSMeter: 'lib/fpsmeter',
		// init service
		device: 'services/device',
		deviceKeys: 'services/device-keys',
		// core
		renderer: 'core/renderer',
		rendererKeys: 'core/renderer-keys',
		textureMaster: 'core/texture-master',
		textureSources: 'core/texture-sources',
		DisplayObject: 'core/display-object',
		BaseView: 'core/base-view',
		BaseViewEvents: 'core/base-view-events',
		Button: 'core/button',
		loader: 'core/loader',
		camera: 'core/camera',
		cameraKeys: 'core/camera-keys',
		// views
		TitleView: 'view/title/view',
		SettingView: 'view/setting/view',

		// game
		GameModel: 'game/game-model',
		GameView: 'game/game-view',
		gameKeys: 'game/game-keys',
		gameConfig: 'game/game-config',
		Factory: 'factory/factory',
		factoryKeys: 'factory/factory-keys',
		objectKeys: 'factory/object-keys',
		constructorMap: 'factory/constructor-map',

		// game objects
		GameObject: 'objects/game-object',
		// gameObjectHelper: 'objects/game-object-helper',
		Aircraft: 'objects/aircraft',
		Bullet: 'objects/bullet',
		JuniorMissile: 'objects/junior-missile'

	}

});

define(
	[
		'lib/load',
		'view/load',
		'mediator',
		'device',
		'loader',
		'renderer',
		'camera'
		//'gameObjectHelper'
	],
	function (libLoad,
			  viewLoad,
			  mediator,
			  device,
			  loader,
			  renderer,
			  camera
			  //gameObjectHelper
				) {

		device.initialize();
		// gameObjectHelper.initialize();
		camera.initialize();

		loader
			.load()
			.done(function () {
				renderer.initialize();
				mediator.publish('show:TitleView');
			});

	}
);

