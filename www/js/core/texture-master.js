var textureMaster = {

    // TODO: get resolutim from equireAsset.get('device')
    // resolution: 1,

    baseUrl: '', // relative from resolution

    initTextures: function () {

        var
            // master = this,
            PIXI = window.requireAsset.get('PIXI'),
            Deferred = window.requireAsset.get('Deferred'),
            defer = new Deferred(),
            loader = PIXI.loader;

        // loader.baseUrl = master.baseUrl;

        loader.add('src/bg-title.json');
        loader.add('src/button.png');

        loader
            .on('progress', function () {
                window.requireAsset.get('log')('on loading texture progress'); // remove
            })
            .load(function (loader, resources) {
                defer.resolve();
            });

        return defer.promise();

    }

};

window.requireAsset.set('textureMaster', textureMaster);

export default textureMaster;
