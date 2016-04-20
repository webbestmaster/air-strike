define(['device', 'mediator', 'deviceEvents', 'FPSMeter'],
	function (device, mediator, deviceEvents) {

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



				// this.publish('obj:update');
				// update x, y and other parameters of object
				// also obj have to has isEnable value to fast check: need work with this object or now
				// you can add logic to obj which behaviour relative from obj's key 'inCamera'
				// when object created it add self to camera's objects array



				// this.publish('camera:update');
				// check obj in camera
				// set obj's key 'inCamera' to true or false
				// position relative of center camera - deltaX, deltaY
				// set obj's SPRITE visible to true of false
				// set SPRITE coordinates and scale (width, height)



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
