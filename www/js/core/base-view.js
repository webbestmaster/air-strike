function BaseView() {

}

BaseView.prototype.initialize = function (data) {

    var view = this,
        PIXI = requireAsset.get('PIXI'),
        mediator = requireAsset.get('mediator');

    view.stage = new PIXI.Container();

    mediator.installTo(view);

    if (data.hasOwnProperty('bg')) {
        view.setBg(data);
    }

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
        device = requireAsset.get('device');

    view.bgSprite = bgSprite;

    view.stage.addChild(bgSprite);

    view.updateBgPosition(device.attr);

    view.subscribe('deviceEvent:resize', view.updateBgPosition);

};

BaseView.prototype.show = function () {

    this.stage.visible = true;

};

requireAsset.set('BaseView', BaseView);

export default BaseView;
