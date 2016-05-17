/*global define, PIXI */
define(['log', 'Deferred', 'textureSources'],
	function (
			log, // remove
			Deferred,
			textureSources
	) {

		"use strict";

		return {

			// TODO: get resolution from camera
			// resolution: 1,

			baseUrl: '', // relative from resolution

			initTextures: function () {

				var
					defer = new Deferred(),
					loader = PIXI.loader;

				// loader.baseUrl = master.baseUrl;

				loader.add(textureSources);

				// loader.add();
				// loader.add('src/bg-setting.json');
				// loader.add('src/button.png');

				loader
					.on('progress', function () {
						log('on loading texture progress'); // remove
					})
					.load(function (loader, resources) {
						defer.resolve();
					});

				return defer.promise();

			}

		};
	}


);
