define(['Factory', 'factoryKeys', 'camera', 'mediator', 'gameKeys', 'objectKeys', 'gameConfig'], function (Factory, factoryKeys, camera, mediator, gameKeys, objectKeys, gameConfig) {

	function GameModel() {

		var game = this;

		game.attr = {
			factory: new Factory()
		};

		// var obj = game.attr.factory.getObject(factoryKeys.BULLET);
		// var obj = game.attr.factory.getObject(factoryKeys.AIRCRAFT);

		// console.log(game.attr.factory);

		game.bindEventListeners();


		game.publish(factoryKeys.events.CREATE, factoryKeys.objects.AIRCRAFT, {
			lastUpdate: camera.get('now')
		});


		var i, j;
		for (i = 1; i < 10; i += 1) {
			for (j = 1; j < 10; j += 1) {
				game.publish(factoryKeys.events.CREATE, factoryKeys.objects.CROSS, {
					lastUpdate: camera.get('now'),
					x: i * gameConfig.world.width / 10,
					y: j * gameConfig.world.height / 10
				});
			}
		}

	}

	GameModel.prototype.bindEventListeners = function () {

		var game = this;

		mediator.installTo(game);

		game.subscribe(gameKeys.UPDATE, game.update);
		game.subscribe(gameKeys.DESTROY, game.destroy);

		// game.subscribe(gameKeys.PAUSE, game.pause);
		// game.subscribe(gameKeys.RESUME, game.resume);

	};

/*
	GameModel.prototype.pause = function () {
		// TweenMax.pauseAll();
	};

	GameModel.prototype.resume = function () {
		// TweenMax.resumeAll();
	};
*/

	GameModel.prototype.update = function () {

		var factory = this.attr.factory,
			factoryData = factory.attr,
			cameraBounds = camera.update().getBounds(),
			lists = factoryData.lists,
			list,
			types = factoryData.types,
			iiTypes = 0, lenTypes = factoryData.length,
			iiObjects, lenObjects,
			objects, lifeMap, object;

		for (; iiTypes < lenTypes; iiTypes += 1) {
			list = lists[types[iiTypes]];
			objects = list.objects;
			lifeMap = list.lifeMap;
			for (iiObjects = 0, lenObjects = list.length; iiObjects < lenObjects; iiObjects += 1) {
				if (lifeMap[iiObjects] === objectKeys.ALIVE) {
					object = objects[iiObjects];
					/* alive object is here - begin */
					/* use 'object' to work with object */
					object.update.apply(object, cameraBounds);
					if (object.attr.visible) {
						camera.adjustSprite(object.attr);
					}
					/* alive object is here - end */
				}
			}
		}

	};


	GameModel.prototype.destroy = function () {

		var game = this;

		this.attr = {};

		game.unsubscribe();

		mediator.uninstallFrom(game);

	};

	return GameModel;

});
