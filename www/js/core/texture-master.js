define(['log', 'Deferred'],
	function (
			log, // remove
			Deferred
	) {
		return {

			// TODO: get resolution from device
			// resolution: 1,

			baseUrl: '', // relative from resolution

			initTextures: function () {

				var
					defer = new Deferred(),
					loader = PIXI.loader;

				// loader.baseUrl = master.baseUrl;

				loader.add([
					'src/bg-title.json',
					'src/bg-setting.json',
					'src/button.png'
				]);

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
