define(
	['BaseView', 'mediator', 'GameModel'],
	function (BaseView, mediator, GameModel) {

		function GameView() {

			var view = this;

			view.initialize({
				bg: 'bg-game'
			});

			view.mainShow();

		}

		GameView.prototype = Object.create(BaseView.prototype);

		mediator.subscribe('show:GameView', function showGameView() {
			new GameView();
			new GameModel();
		});

		return GameView;

	}

);
