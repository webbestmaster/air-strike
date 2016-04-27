define(
	[
		'DisplayObject',
		'mediator',
		'rendererKeys',
		'device',
		'TweenMax',
		'deviceKeys',
		'BaseViewEvents'
	],
	function (DisplayObject,
			  mediator,
			  rendererKeys,
			  device,
			  TweenMax,
			  deviceKeys,
			  BaseViewEvents) {

		function BaseView() {

		}

		BaseView.prototype = Object.create(DisplayObject.prototype);

		BaseView.prototype.initialize = function (data) {

			var view = this;

			view.stage = new PIXI.Container();

			view.buttons = [];

			mediator.publish(BaseViewEvents.HIDE);

			view.bindMainEventListeners();

			if (data.hasOwnProperty('bg')) {
				view.setBg(data);
			}

		};

		BaseView.prototype.bindMainEventListeners = function () {

			var view = this;

			mediator.installTo(view);

			view.subscribe(BaseViewEvents.HIDE, view.mainHide);

		};

		BaseView.prototype.mainShow = function () {

			this.publish(rendererKeys.APPEND, this.stage);

			this.mainShowAnimation();

		};

		BaseView.prototype.mainHide = function () {

			this.unsubscribe();
			mediator.uninstallFrom(this);
			this.mainHideAnimation();

		};

		BaseView.prototype.mainHideAnimation = function () {

			TweenMax
				.to(
					this.stage,
					2,
					{
						alpha: 0,
						onComplete: this.mainRemove.bind(this)
						// ease: Back.easeOut
					}
				);

		};

		BaseView.prototype.mainShowAnimation = function () {

			this.stage.alpha = 0;

			TweenMax
				.to(
					this.stage,
					2,
					{
						alpha: 1
						// onComplete: function () {
							// view.mainRemove();
						// },
						// ease: l
					}
				);

		};

		BaseView.prototype.mainRemove = function () {

			var view = this;

			if (view.bgSprite) {
				view.stage.removeChild(view.bgSprite);
				view.bgSprite = null;
			}

			view.buttons.forEach(function (button) {
				button.destroy();
			});

			mediator.publish(rendererKeys.REMOVE, this.stage);

			console.log('view is hidden'); // remove

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

			view.subscribe(deviceKeys.RESIZE, view.updateBgPosition);

		};

		BaseView.prototype.appendSprite = function (sprite) {
			this.stage.addChild(sprite);
		};

		BaseView.prototype.removeSprite = function (sprite) {
			this.stage.removeChild(sprite);
		};

		return BaseView;

	}
);
