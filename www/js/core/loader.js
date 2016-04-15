var loader = {
	
	load: function () {

		var Deferred = window.requireAsset.get('Deferred'),
			fontLoader = window.requireAsset.get('fontLoader'),
			textureMaster = window.requireAsset.get('textureMaster');

		return Deferred
			.when([
				fontLoader.load('font/quake.otf'),
				textureMaster.initTextures()
			]);

	}
	
};

export default loader;
