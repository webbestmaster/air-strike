define([
	'Factory',
	'factoryKeys',
	'camera',
	'mediator',
	'gameKeys',
	'objectKeys',
	'gameConfig',
	'cameraKeys',
	'gameObjectKeys',
	'CollisionManager'
	// 'requireAsset'
], function (Factory,
			factoryKeys,
			camera,
			mediator,
			gameKeys,
			objectKeys,
			gameConfig,
			cameraKeys,
		 	gameObjectKeys,
		 	CollisionManager
			// requireAsset
			) {

	function GameModel() {

		var game = this,
			factory = new Factory(),
			collisionManager = new CollisionManager();

		game.attr = {
			factory: factory,
			collisionManager: collisionManager
		};

		game.bindEventListeners();

		// create first aircraft
		game.publish(factoryKeys.events.CREATE, factoryKeys.objects.AIRCRAFT, {
			lastUpdate: camera.get('now')
		});
		game.publish(factoryKeys.events.GET_LAST_OF, {
			type: factoryKeys.objects.AIRCRAFT,
			fn: function (aircraft) {
				aircraft.set({
					ownerId: gameObjectKeys.IDS.PLAYER[0].ownerId,
					teamId: gameObjectKeys.IDS.PLAYER[0].teamId
				});
				aircraft.publish(cameraKeys.FOLLOW_TO, aircraft.attr);

				// aircraft.set('rotation', Math.PI);
				// aircraft.set('scale', {x: -1}, true);

			},
			ctx: this
		});

		// create second aircraft
		game.publish(factoryKeys.events.CREATE, factoryKeys.objects.AIRCRAFT, {
			lastUpdate: camera.get('now')
		});
		game.publish(factoryKeys.events.GET_LAST_OF, {
			type: factoryKeys.objects.AIRCRAFT,
			fn: function (aircraft) {
				aircraft.set({
					ownerId: gameObjectKeys.IDS.ENEMY.ownerId,
					teamId: gameObjectKeys.IDS.ENEMY.teamId
				});

				aircraft.moveBy({
					x: aircraft.attr.w,
					time: 4
				});

				aircraft.get('sprite').tint = 0xFF0000;

				aircraft.unBindEventListeners();
				
			},
			ctx: this
		});

		game.createLandscapeMarks();

	}

	GameModel.prototype.createLandscapeMarks = function () {

		var game = this,
			i,
			j;

		for (i = 1; i < 10; i += 1) {
			for (j = 1; j < 10; j += 1) {
				game.publish(factoryKeys.events.CREATE, factoryKeys.objects.CROSS, {
					lastUpdate: camera.get('now'),
					pos: {
						x: i * gameConfig.world.width / 10,
						y: j * gameConfig.world.height / 10
					}
				});
			}
		}

	};

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

		var attr = this.attr,
			factory = attr.factory,
			collisionManager = attr.collisionManager,
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

					if (object.attr.useCollision) {
						if (object.attr.visible) {
							collisionManager.updatePlace(object);

							// TODO: add processing of collision here !!!

						} else {
							collisionManager.removePlace(object.attr.id);
						}
					}

					/* alive object is here - end */
				}
			}
		}
		
		
		//TODO: do collision detection

	};


	GameModel.prototype.destroy = function () {

		var game = this;

		this.attr = {};

		// requireAsset(factoryKeys.REQUIRE_ASSET_NAME, null);

		game.unsubscribe();

		mediator.uninstallFrom(game);

	};

	return GameModel;

});
