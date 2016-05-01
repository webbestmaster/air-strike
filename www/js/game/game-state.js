define(['mediator', 'gameKeys'], function (mediator, gameKeys) {

	return {

		attr: {},

		initialize: function () {

			var gameState = this;

			gameState.reset();

			gameState.bindEventListeners();

		},

		bindEventListeners: function () {

			var gameState = this;

			mediator.installTo(gameState);

			gameState.subscribe(gameKeys.PAUSE, function () {
				this.attr.state = gameKeys.PAUSE;
			});

			gameState.subscribe(gameKeys.RESUME, function () {
				this.attr.state = gameKeys.RESUME;
			});

		},

		reset: function () {

			this.attr = {
				state: gameKeys.RESUME
			};

		}

	}

});