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

		}

		GameView.prototype = Object.create(BaseView.prototype);

		GameView.prototype.bindEventListeners = function () {

			var view = this;

			view.subscribe(gameKeys.APPEND_SPRITE, view.appendSprite);
			view.subscribe(gameKeys.REMOVE_SPRITE, view.removeSprite);

		};

		mediator.subscribe('show:GameView', function showGameView() {
			new GameView();
			new GameModel();
		});

		return GameView;

	}

);
