function BaseView() {

}

BaseView.prototype.initialize = function (data) {

    var view = this,
        PIXI = window.requireAsset.get('PIXI'),
        mediator = window.requireAsset.get('mediator');

    view.stage = new PIXI.Container();

    mediator.publish('hideView');

    view.bindMainEventListeners();

    if (data.hasOwnProperty('bg')) {
        view.setBg(data);
    }


};

BaseView.prototype.bindMainEventListeners = function () {

    var view = this,
        mediator = window.requireAsset.get('mediator');

    mediator.installTo(view);

    view.subscribe('hideView', view.mainHide);

};

BaseView.prototype.mainHide = function () {

    var view = this,
        stage = view.stage,
        renderer = window.requireAsset.get('renderer');

    if (view.bgSprite) {
        stage.removeChild(view.bgSprite);
        view.bgSprite = null;
    }

    renderer.remove(view);

    view.unsubscribe();

};

BaseView.prototype.updateBgPosition = function (sizes) {

    var bg = this.bgSprite,
        sW = sizes.width,
        sH = sizes.height,
        bgW = bg.width,
        bgH = bg.height,
        q = Math.min(bgW / sW, bgH / sH);

    bg.width = bgW /= q;
    bg.height = bgH /= q;

    bg.x = (sW - bgW) / 2;
    bg.y = (sH - bgH) / 2;

};

BaseView.prototype.setBg = function (data) {

    var view = this,
        bgSprite = new PIXI.Sprite.fromFrame(data.bg),
        device = window.requireAsset.get('device');

    view.bgSprite = bgSprite;

    view.stage.addChild(bgSprite);

    view.updateBgPosition(device.attr);

    view.subscribe('deviceEvent:resize', view.updateBgPosition);

};

BaseView.prototype.show = function () {

    var renderer = window.requireAsset.get('renderer');
    // this.stage.visible = true;
    renderer.append(this);

};

/*
* 
* 1 2 3
* 4 5 6
* 7 8 9
* 
* */

BaseView.prototype.getDelta = function (sprite_1, sprite_2, point_1, point_2) {



};

window.requireAsset.set('BaseView', BaseView);

export default BaseView;
