define({

	baseUrl: './js/',

	paths: {
		// init service
		log: 'services/log',
		mediator: 'services/mediator',
		// init libs
		Deferred: 'lib/deferred',
		fontLoader: 'lib/font-loader',
		PIXI: 'lib/pixi',
		util: 'lib/util',
		//EasePack: 'lib/EasePack',
		TweenMax: 'lib/TweenMax',
		FPSMeter: 'lib/fpsmeter',
		// init service
		device: 'services/device',
		deviceKeys: 'services/device-keys',
		// core
		// requireAsset: 'services/require-asset',
		renderer: 'core/renderer',
		rendererKeys: 'core/renderer-keys',
		textureMaster: 'core/texture-master',
		textureSources: 'core/texture-sources',
		DisplayObject: 'core/display-object',
		BaseView: 'core/base-view',
		baseViewKeys: 'core/base-view-keys',
		Button: 'core/button',
		loader: 'core/loader',
		camera: 'core/camera',
		cameraKeys: 'core/camera-keys',
		uiManager: 'core/ui-manager',
		uiManagerKeys: 'core/ui-manager-keys',
		CollisionManager: 'core/collision-manager',
		collisionManagerKeys: 'core/collision-manager-keys',
		// views
		TitleView: 'view/title/view',
		SettingView: 'view/setting/view',

		// game
		GameModel: 'game/game-model',
		GameView: 'game/game-view',
		gameKeys: 'game/game-keys',
		gameConfig: 'game/game-config',
		gameState: 'game/game-state',
		Factory: 'factory/factory',
		factoryKeys: 'factory/factory-keys',
		objectKeys: 'factory/object-keys',
		constructorMap: 'factory/constructor-map',

		// game objects
		GameObject: 'objects/game-object',
		gameObjectKeys: 'objects/game-object-keys',
		// gameObjectHelper: 'objects/game-object-helper',
		Aircraft: 'objects/aircraft',
		Bullet: 'objects/bullet',
		JuniorMissile: 'objects/junior-missile',
		Cross: 'objects/cross'

	}

});