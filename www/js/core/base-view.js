define(
	[
		'DisplayObject',
		'mediator',
		'rendererKeys',
		'device',
		'TweenMax',
		'deviceKeys',
		'baseViewKeys'
	],
	function (DisplayObject,
			  mediator,
			  rendererKeys,
			  device,
			  TweenMax,
			  deviceKeys,
			  baseViewKeys) {

		function BaseView() {

		}

		BaseView.prototype = Object.create(DisplayObject.prototype);

		BaseView.prototype.mainInitialize = function (data) {

			var view = this;

			view.stage = new PIXI.Container();

			view.buttons = [];

			mediator.publish(baseViewKeys.HIDE);

			view.bindMainEventListeners();

			if (data.hasOwnProperty('bg')) {
				view.setBg(data);
			}

		};

		BaseView.prototype.bindMainEventListeners = function () {

			var view = this;

			mediator.installTo(view);

			view.subscribe(baseViewKeys.HIDE, view.mainHide);

		};

		BaseView.prototype.mainShow = function () {

			this.publish(rendererKeys.APPEND, this.stage);

			this.mainShowAnimation();

		};

		BaseView.prototype.mainHide = function () {

			var view = this;

			view.buttons.forEach(function (button) {
				button.off();
			});

			view.unsubscribe();
			mediator.uninstallFrom(view);
			view.mainHideAnimation();

		};

		BaseView.prototype.mainShowAnimation = function () {

			this.stage.alpha = 0;

			TweenMax
				.to(
					this.stage,
					baseViewKeys.SHOW_ANIMATION_TIME,
					{
						alpha: 1
						// onComplete: function () {
						// view.mainRemove();
						// },
						// ease: l
					}
				);

		};

		BaseView.prototype.mainHideAnimation = function () {

			var view = this;

			TweenMax
				.to(
					view.stage,
					baseViewKeys.HIDE_ANIMATION_TIME,
					{
						alpha: 0,
						onComplete: view.mainRemove.bind(view)
						// ease: Back.easeOut
					}
				);

		};

		BaseView.prototype.mainRemove = function () {

			var view = this;

			if (view.bgSprite) {
				view.stage.removeChild(view.bgSprite);
				view.bgSprite.destroy();
				view.bgSprite = null;
			}

			view.buttons.forEach(function (button) {
				button.destroy();
			});

			TweenMax.killTweensOf(view.attr);
			TweenMax.killTweensOf(view.stage);

			view.destroyStages();

			view.stage.destroy();

			mediator.publish(rendererKeys.REMOVE, view.stage);

			// console.log('view is hidden'); // remove

		};

		BaseView.prototype.destroyStages = function () {

			var view = this,
				stages = view.stages,
				mainStage = view.stage,
				key,
				stage;

			for (key in stages) {
				if (stages.hasOwnProperty(key)) {
					stage = stages[key];
					mainStage.removeChild(stage);
					stage.destroy();
					// console.log('sadads');
				}
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
