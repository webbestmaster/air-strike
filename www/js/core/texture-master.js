var textureMaster = {

    // TODO: get resolutim from equireAsset.get('device')
    // resolution: 1,

    baseUrl: '', // relative from resolution

    initTextures: function () {

        var
            // master = this,
            PIXI = requireAsset.get('PIXI'),
            Deferred = requireAsset.get('Deferred'),
            defer = new Deferred(),
            loader = PIXI.loader;

        // loader.baseUrl = master.baseUrl;

        loader.add('src/bg-title.json');

        loader
            .on('progress', function () {
                requireAsset.get('log')('on loading texture progress'); // remove
            })
            .load(function (loader, resources) {
                defer.resolve();
            });

        return defer.promise();

    }

};

requireAsset.set('textureMaster', textureMaster);

return textureMaster;

