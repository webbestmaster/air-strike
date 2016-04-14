var renderer = {

	renderer: null,
	stage: null,

	initialize: function () {

		var renderer = this;

		renderer.createRenderer();

		renderer.bindEventListeners();

		renderer.start();

	},

	start: function () {

		var renderer = this,
			PIXI = window.requireAsset.get('PIXI'),
			ticker = PIXI.ticker.shared;

		ticker.add(renderer.draw, renderer);

		ticker.start();
	},

	draw: function () {

		this.renderer.render(this.stage);

	},

	createRenderer: function () {

		var renderer = this,

			PIXI = window.requireAsset.get('PIXI'),

			deviceData = window.requireAsset.get('device').attr,

			pixiRenderer = PIXI.autoDetectRenderer(
				deviceData.width,
				deviceData.height
			);

		renderer.stage = new PIXI.Container();

		window.document.body.appendChild(pixiRenderer.view);

		return renderer.renderer = pixiRenderer;

	},

	bindEventListeners: function () {

		var renderer = this,
			mediator = window.requireAsset.get('mediator');

		mediator.installTo(renderer);

		renderer.subscribe('deviceEvent:resize', function (data) {
			this.renderer.resize(data.width, data.height);
		});

	},

	append: function (view) {

		this.stage.addChild(view.stage);

	},

	remove: function (view) {

		this.stage.removeChild(view.stage);

	},

	//////
	//  only for mediator
	//////
	publish: function () {},
	subscribe: function () {},
	unsubscribe: function () {}

};

window.requireAsset.set('renderer', renderer);

export default renderer;