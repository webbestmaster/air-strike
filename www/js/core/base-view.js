define(
	[
		'DisplayObject',
		// 'PIXI',
		'mediator',
		'renderer',
		'device'
	],
	function (DisplayObject,
			  // PIXI,
			  mediator,
			  renderer,
			  device) {

		function BaseView() {

		}

		BaseView.prototype = Object.create(DisplayObject.prototype);

		BaseView.prototype.initialize = function (data) {

			var view = this;

			view.stage = new PIXI.Container();

			mediator.publish('hideView');

			view.bindMainEventListeners();

			if (data.hasOwnProperty('bg')) {
				view.setBg(data);
			}


		};

		BaseView.prototype.bindMainEventListeners = function () {

			var view = this;

			mediator.installTo(view);

			view.subscribe('hideView', view.mainHide);

		};

		BaseView.prototype.mainHide = function () {

			var view = this,
				stage = view.stage;

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
				bgSprite = new PIXI.Sprite.fromFrame(data.bg);

			view.bgSprite = bgSprite;

			view.stage.addChild(bgSprite);

			view.updateBgPosition(device.attr);

			view.subscribe('deviceEvent:resize', view.updateBgPosition);

		};

		BaseView.prototype.show = function () {

			// this.stage.visible = true;
			renderer.append(this);

		};

		return BaseView;

	}
);
