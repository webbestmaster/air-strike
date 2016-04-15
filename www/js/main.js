requirejs.config({

	baseUrl: './js/',

	paths: {
		// init service
		log: 'services/log',
		mediator: 'services/mediator',
		// init libs
		Deferred: 'lib/deferred',
		fontLoader: 'lib/font-loader',
		// pixi: 'lib/pixi',
		EasePack: 'lib/EasePack',
		TweenLite: 'lib/TweenLite',
		// init service
		device: 'services/device',
		// core
		renderer: 'core/renderer',
		textureMaster: 'core/texture-master',
		DisplayObject: 'core/display-object',
		BaseView: 'core/base-view',
		Button: 'core/button',
		loader: 'core/loader',
		// views
		TitleView: 'view/title/view'
	}

});

define(
	[
		'lib/load',
		'mediator',
		'device',
		'loader',
		'renderer'
	],
	function (load,
			  mediator,
			  device,
			  loader,
			  renderer) {


		device.initialize();

		loader
			.load()
			.done(function () {
				renderer.initialize();
				mediator.publish('show:TitleView');
			});

	}
);

