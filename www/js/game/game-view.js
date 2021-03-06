/*global define, PIXI*/
define(
	['BaseView', 'mediator', 'GameModel', 'gameKeys', 'Button', 'cameraKeys', 'camera', 'gameState'],
	function (BaseView, mediator, GameModel, gameKeys, Button, cameraKeys, camera, gameState) {

		"use strict";

		function GameView() {

			var view = this;

			view.mainInitialize({
				// bg: 'bg-game'
			});

			view.mainShow();

			view.bindEventListeners();

			view.createLayeredStages();

			view.createButtons();

		}

		GameView.prototype = Object.create(BaseView.prototype);
		GameView.prototype.constructor = GameView;

		GameView.prototype.createLayeredStages = function () {

			var view = this,
				stage = view.stage,
				orderedList = ['VIEW_LAYER_MINOR_OBJECT', 'VIEW_LAYER_MAJOR_OBJECT', 'VIEW_LAYER_GAME_OBJECT_INFO', 'VIEW_LAYER_UI', 'VIEW_LAYER_POPUP'],
				i,
				len = orderedList.length,
				stages = {};

			for (i = 0; i < len; i += 1) {
				stages[gameKeys[orderedList[i]]] = new PIXI.Container();
				stage.addChild(stages[gameKeys[orderedList[i]]]);
			}

			view.stages = stages;

		};

		GameView.prototype.bindEventListeners = function () {

			var view = this;

			view.subscribe(gameKeys.APPEND_SPRITE, view.appendSprite);
			// view.subscribe(gameKeys.REMOVE_SPRITE, view.removeSprite);
			// view.subscribe(gameKeys.DESTROY, view.destroyStages);

		};

		GameView.prototype.appendSprite = function (data) {
			this.stages[data.layer].addChild(data.sprite);
		};

/*
		GameView.prototype.removeSprite = function () {
			this.stages[data.layer].removeChild(data.sprite);
		};
*/

		GameView.prototype.createButtons = function () {

			var view = this,
				button;

			// create pause button
			button = new Button({
				stage: view.stages[gameKeys.VIEW_LAYER_UI],
				textureName: 'button'
			});

			view.buttons.push(button);

			button.createTextNode('pause', {
				font: camera.remToPixel(1) + 'px quake',
				fill: '#FFF',
				align: 'center',
				wordWrap: true,
				wordWrapWidth: button.sprite.width * 0.8
			});

			button.setSize(-1, 2.8, cameraKeys.REM);

			button.moveTo(3, 9, 0, 0, cameraKeys.REM);
			button.moveToAnimate(3, 3, 0.5, 0, 0, cameraKeys.REM);

			button.on('click', gameState.switchState, gameState);

			// create exit button

			button = new Button({
				stage: view.stages[gameKeys.VIEW_LAYER_UI],
				textureName: 'button'
			});

			view.buttons.push(button);

			button.createTextNode('EXIT', {
				font: camera.remToPixel(1) + 'px quake',
				fill: '#FFF',
				align: 'center',
				wordWrap: true,
				wordWrapWidth: button.sprite.width * 0.8
			});

			button.setSize(-1, 2.8, cameraKeys.REM);

			button.moveTo(3, 9, 0, 0, cameraKeys.REM);
			button.moveToAnimate(3, 3, 0.5, 0, 2.8, cameraKeys.REM);

			button.on('click', function () {

				mediator.publish(gameKeys.DESTROY);
				mediator.publish('show:TitleView');

			});

		};

		mediator.subscribe('show:GameView', function showGameView() {
			new GameView();
			new GameModel();
		});

		return GameView;

	}
);
