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
			PIXI = requireAsset.get('PIXI'),
			ticker = new PIXI.ticker.Ticker();

		ticker.add(renderer.draw, renderer);

		ticker.start();

	},

	draw: function () {

		this.renderer.render(this.stage);

	},

	createRenderer: function () {

		var renderer = this,

			PIXI = requireAsset.get('PIXI'),

			deviceData = requireAsset.get('device').attr,

			pixiRenderer = PIXI.autoDetectRenderer(
				deviceData.width,
				deviceData.height,
				{
					backgroundColor: 0x000000
				}
			);

		renderer.stage = new PIXI.Container();

		window.document.body.appendChild(pixiRenderer.view);

		return renderer.renderer = pixiRenderer;

	},

	bindEventListeners: function () {

		var renderer = this,
			mediator = requireAsset.get('mediator');

		mediator.installTo(renderer);

		renderer.subscribe('deviceEvent:resize', function (data) {
			this.renderer.resize(data.width, data.height);
		});

	},

	append: function (view) {

		this.stage.addChild(view.stage);

	},

	//////
	//  only for mediator
	//////
	publish: function () {},
	subscribe: function () {},
	unsubscribe: function () {}

};

requireAsset.set('renderer', renderer);

export default renderer;