define(['Deferred', 'fontLoader', 'textureMaster'],
	function (Deferred, fontLoader, textureMaster) {
		return {
			load: function () {
				return Deferred
					.when([
						fontLoader.load('font/quake.otf'),
						textureMaster.initTextures()
					]);
			}
		}
	}
);
