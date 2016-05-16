define(function (require, exports, module) {

	'use strict';

	requirejs.config(require('require-config'));

	require(
		[
			'lib/load',
			'view/load',
			'mediator',
			'device',
			'loader',
			'renderer',
			'camera',
			'uiManager',
			'gameState'
			//'gameObjectHelper'
		],
		function (libLoad,
				  viewLoad,
				  mediator,
				  device,
				  loader,
				  renderer,
				  camera,
				  uiManager,
				  gameState
				  //gameObjectHelper
		) {

			device.initialize();
			// gameObjectHelper.initialize();
			camera.initialize();
			uiManager.initialize();

			gameState.initialize();

			loader
				.load()
				.done(function () {
					renderer.initialize();
					mediator.publish('show:TitleView');
				});

		}
	);

});
