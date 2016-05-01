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

		},

		switchState: function () {

			var gameState = this,
				state = gameState.attr.state;

			if (state === gameKeys.PAUSE) {
				gameState.publish(gameKeys.RESUME);
			}

			if (state === gameKeys.RESUME) {
				gameState.publish(gameKeys.PAUSE);
			}

		}

	}

});