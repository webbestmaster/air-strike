define(['Deferred', 'fontLoader', 'textureMaster'],
	function (Deferred, fontLoader, textureMaster) {
		return {
			load: function () {

				PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

				return Deferred
					.when([
						fontLoader.load('font/quake.otf'),
						textureMaster.initTextures()
					]);
			}
		}
	}
);
