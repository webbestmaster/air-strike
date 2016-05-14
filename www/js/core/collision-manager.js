define(['gameConfig', 'util', 'collisionManagerKeys'], function (gameConfig, util, collisionManagerKeys) {

	// TODO: subscribe to (factoryKeys.events.OBJECT_CREATED, neededObject)
	// to collect objects by id
	// this.attr.objects[id]

	function CollisionManager() {

		var collisionManager = this;

		collisionManager.initialize();

	}

	CollisionManager.prototype.set = function (keyOrObject, valueOrIsDeep, isDeep) {

		if (typeof keyOrObject === 'string') {
			if (isDeep) {
				// used - key, value
				util.deepExtend(valueOrIsDeep, this.attr[keyOrObject] = this.attr[keyOrObject] || {});
			} else {
				// used - key, value, true
				this.attr[keyOrObject] = valueOrIsDeep;
			}
			return this;
		}

		// keyOrObject = object
		// valueOrIsDeep = isDeep
		if (valueOrIsDeep) {
			util.deepExtend(keyOrObject, this.attr);
		} else {
			util.extend(keyOrObject, this.attr);
		}

		return this;

	};

	CollisionManager.prototype.get = function (key) {
		return this.attr[key];
	};

	CollisionManager.prototype.initialize = function () {

		var collisionManager = this;
		collisionManager.attr = {};

		collisionManager.createGrid();




	};

	CollisionManager.prototype.createGrid = function () {

		var collisionManager = this,
			squareSize = collisionManager.getSquareSize(),
			gridWidth = gameConfig.world.width / squareSize.width,
			gridHeight = gameConfig.world.height / squareSize.height,
			i,
			j,
			grid = {},
			xyDivider = collisionManagerKeys.XY_DIVIDER;

		for (i = 0; i < gridWidth; i += 1) {
			for (j = 0; j < gridHeight; j += 1) {
				grid[i + xyDivider + j] = {
					list: [],
					length: 0
				};
			}
		}

		collisionManager.set({
			grid: grid,
			w: gridWidth,
			h: gridHeight
		});

	};

	CollisionManager.prototype.getSquareSize = function () {

		// var worldWidth = gameConfig.world.width,
		// 	worldHeight = gameConfig.world.height;

		// TODO: I do not know how to get the best square's size for collisions
		// if you know - let me know - web.best.master@gmail.com

		return {
			width: 40,
			height: 60
		}

	};

	return CollisionManager;

});
