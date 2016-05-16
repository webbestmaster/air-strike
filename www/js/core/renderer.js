/*global FPSMeter, window, define */
define(['device', 'mediator', 'deviceKeys', 'FPSMeter', 'gameKeys', 'rendererKeys'],
	function (device, mediator, deviceKeys, _fpsMeter, gameKeys, rendererKeys) {

		"use strict";

		return {

			renderer: null,
			stage: null,

			pixelRatio: 1,
			isWebGLSupport: false,

			resolution: 1,

			fpsMeter: new FPSMeter(), // remove

			initialize: function () {

				var renderer = this;

				renderer.detectResolution();

				renderer.createRenderer();

				renderer.bindEventListeners();

				renderer.start();

			},

			detectPixelRatio: function () {

				return this.pixelRatio = window.devicePixelRatio || 1;

			},

			detectWebGlSupport: function () {

				var tempCanvas, isWebGLSupport;

				tempCanvas = document.createElement('canvas');

				try {
					isWebGLSupport = !!(tempCanvas.getContext('webgl') || tempCanvas.getContext('experimental-webgl'));
				} catch (e) {
					isWebGLSupport = false;
				}

				return this.isWebGLSupport = isWebGLSupport;

			},

			detectResolution: function () {

				var renderer = this,
					pixelRatio = renderer.detectPixelRatio(),
					isWebGLSupport = renderer.detectWebGlSupport();

				return renderer.resolution = pixelRatio >= 2 && isWebGLSupport ? 2 : 1;

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
						deviceData.height,
						{
							resolution: renderer.resolution
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
