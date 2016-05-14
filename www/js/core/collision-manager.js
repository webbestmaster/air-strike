define(['mediator', 'factoryKeys', 'gameConfig', 'util', 'collisionManagerKeys'], function (mediator, factoryKeys, gameConfig, util, collisionManagerKeys) {

	// TODO: subscribe to (factoryKeys.events.OBJECT_CREATED, neededObject)
	// to collect objects by id
	// this.attr.objects[id]

	function CollisionManager() {

		var collisionManager = this;

		collisionManager.initialize();

		collisionManager.bindEventListeners();

	}


	CollisionManager.prototype.bindEventListeners = function () {

		var collisionManager = this;

		mediator.installTo(collisionManager);

		collisionManager.subscribe(factoryKeys.events.OBJECT_CREATED, collisionManager.onObjectCreate);

	};

	CollisionManager.prototype.onObjectCreate = function (newObject) {

		// var collisionManager = this,
		// 	ids = collisionManager.attr.ids;

		// just add new obj to ids
		this.attr.ids[newObject.attr.id] = {
			object: newObject,
			place: {
				before: {minX: -1, minY: -1, maxX: -1, maxY: -1},
				current: {minX: -1, minY: -1, maxX: -1, maxY: -1}
			}
		};

	};

	CollisionManager.prototype.getMaxPlace = function (object) {

		var squareData = this.attr.square,
			squareWidth = squareData.w,
			squareHeight = squareData.h,
			attr = object.attr,
			diagonal05 = attr.diagonal05,
			x = attr.pos.x,
			y = attr.pos.y;

		return {
			minX: Math.floor((x - diagonal05) / squareWidth),
			minY: Math.floor((y - diagonal05) / squareHeight),
			maxX: Math.ceil((x + diagonal05) / squareWidth),
			maxY: Math.ceil((y + diagonal05) / squareWidth)
		};

	};

	CollisionManager.prototype.updatePlace = function (object) {

		// get object min and max coordinates
		// check new data with before data
		// if has change - do change

		// get max sqaure
		var collisionManager = this,
			beforePlace = collisionManager.attr.ids[object.attr.id].place,
			currentPlace = collisionManager.getMaxPlace(object);

		if (
			currentPlace.minX === beforePlace.minX &&
			currentPlace.minY === beforePlace.minY &&
			currentPlace.maxX === beforePlace.maxX &&
			currentPlace.maxY === beforePlace.maxY) {
			return;
		}

		beforePlace.minX = currentPlace.minX;
		beforePlace.minY = currentPlace.minY;
		beforePlace.maxX = currentPlace.maxX;
		beforePlace.maxY = currentPlace.maxY;
		debugger


	};

	CollisionManager.prototype.removePlace = function (object) {

	};

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
		collisionManager.attr = {
			ids: {}
		};

		collisionManager.createGrid();




	};

	CollisionManager.prototype.createGrid = function () {

		var collisionManager = this,
			squareSize = collisionManager.getSquareSize(),
			gridWidth = gameConfig.world.width / squareSize.w,
			gridHeight = gameConfig.world.height / squareSize.h,
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
			h: gridHeight,
			square: {
				w: squareSize.w,
				h: squareSize.h
			}
		});

	};

	CollisionManager.prototype.getSquareSize = function () {

		// var worldWidth = gameConfig.world.width,
		// 	worldHeight = gameConfig.world.height;

		// TODO: I do not know how to get the best square's size for collisions
		// if you know - let me know - web.best.master@gmail.com

		return {
			w: 40,
			h: 60
		}

	};

	return CollisionManager;

});
