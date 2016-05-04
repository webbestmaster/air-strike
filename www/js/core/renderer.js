define(['device', 'mediator', 'deviceKeys', 'FPSMeter', 'gameKeys', 'rendererKeys'],
	function (device, mediator, deviceKeys, _fpsMeter, gameKeys, rendererKeys) {

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
						,{
							// resolution: 2
						}
					);

				renderer.stage = new PIXI.Container();

				window.document.body.appendChild(pixiRenderer.view);

				return renderer.renderer = pixiRenderer;

			},

			bindEventListeners: function () {

				var renderer = this;

				mediator.installTo(renderer);

				renderer.subscribe(deviceKeys.RESIZE, function rendererOnResize(data) {
					this.renderer.resize(data.width, data.height);
				});

				renderer.subscribe(rendererKeys.APPEND, renderer.append);
				renderer.subscribe(rendererKeys.REMOVE, renderer.remove);

			},

			append: function (sprite) {
				this.stage.addChild(sprite);
			},

			remove: function (sprite) {
				this.stage.removeChild(sprite);
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
