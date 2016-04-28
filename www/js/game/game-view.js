define(
	['BaseView', 'mediator', 'GameModel', 'gameKeys'],
	function (BaseView, mediator, GameModel, gameKeys) {

		function GameView() {

			var view = this;

			view.initialize({
				bg: 'bg-game'
			});

			view.mainShow();

			view.bindEventListeners();

			view.createLayeredStages();

		}

		GameView.prototype = Object.create(BaseView.prototype);

		GameView.prototype.createLayeredStages = function () {

			var view = this,
				stage = view.stage,
				orderedList = ['VIEW_LAYER_MINOR_OBJECT', 'VIEW_LAYER_MAJOR_OBJECT', 'VIEW_LAYER_UI', 'VIEW_LAYER_POPUP'],
				i = 0,
				len = orderedList.length,
				stages = {};

			for (; i < len; i += 1) {
				stage.addChild(stages[gameKeys[orderedList[i]]] = new PIXI.Container());
			}

			view.stages = stages;

		};

		GameView.prototype.bindEventListeners = function () {

			var view = this;

			view.subscribe(gameKeys.APPEND_SPRITE, view.appendSprite);
			view.subscribe(gameKeys.REMOVE_SPRITE, view.removeSprite);

		};

		GameView.prototype.appendSprite = function (data) {
			this.stages[data.layer].addChild(data.sprite);
		};

		GameView.prototype.removeSprite = function () {
			this.stages[data.layer].removeChild(data.sprite);
		};

		mediator.subscribe('show:GameView', function showGameView() {
			new GameView();
			new GameModel();
		});

		return GameView;

	}
);
