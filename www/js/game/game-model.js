define(['Factory', 'factoryKeys', 'camera', 'mediator', 'gameKeys', 'objectKeys'], function (Factory, factoryKeys, camera, mediator, gameKeys, objectKeys) {

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

	}

	GameModel.prototype.bindEventListeners = function () {

		var game = this;

		mediator.installTo(game);

		game.subscribe(gameKeys.UPDATE, game.update);
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

/*
		window.ttt = window.ttt || {};

		window.ttt.curTime = Date.now();

		console.log(window.ttt.curTime - window.ttt.prevTime);
		window.ttt.prevTime = window.ttt.curTime;
*/


		var game = this,
			factory = game.attr.factory,
			factoryData = factory.attr,
			cameraBounds = camera.getBounds(),
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
	

	return GameModel;

});
