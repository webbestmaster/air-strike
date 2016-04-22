define(['device', 'mediator', 'deviceEvents', 'FPSMeter', 'gameKeys'],
	function (device, mediator, deviceEvents, _fpsMeter, gameKeys) {

		return {

			renderer: null,
			stage: null,

			fpsMeter: new FPSMeter(), // remove

			initialize: function () {

				var renderer = this;

				renderer.createRenderer();

				renderer.bindEventListeners();

				renderer.start();

			},

			start: function () {

				var renderer = this,
					ticker = PIXI.ticker.shared;

				ticker.add(renderer.draw, renderer);

				ticker.start();
			},

			draw: function () {

				this.publish(gameKeys.UPDATE);

				this.renderer.render(this.stage);

				this.fpsMeter.tick(); // remove

			},

			createRenderer: function () {

				var renderer = this,

					deviceData = device.attr,

					pixiRenderer = PIXI.autoDetectRenderer(
						deviceData.width,
						deviceData.height
					);

				renderer.stage = new PIXI.Container();

				window.document.body.appendChild(pixiRenderer.view);

				return renderer.renderer = pixiRenderer;

			},

			bindEventListeners: function () {

				var renderer = this;

				mediator.installTo(renderer);

				renderer.subscribe(deviceEvents.RESIZE, function rendererOnResize(data) {
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
			publish: function () {
			},
			subscribe: function () {
			},
			unsubscribe: function () {
			}

		};

	}
);
