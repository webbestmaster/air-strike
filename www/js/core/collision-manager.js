define(['mediator', 'factoryKeys', 'gameConfig', 'util', 'collisionManagerKeys'], function (mediator, factoryKeys, gameConfig, util, collisionManagerKeys) {

	'use strict';

	function CollisionManager() {

		var collisionManager = this;

		collisionManager.initialize();

		collisionManager.bindEventListeners();

	}


	CollisionManager.prototype.bindEventListeners = function () {

		var collisionManager = this;

		mediator.installTo(collisionManager);

		collisionManager.subscribe(factoryKeys.events.OBJECT_CREATED, collisionManager.onObjectCreate);
		collisionManager.subscribe(collisionManagerKeys.PUSH_OBJECT, collisionManager.pushObject);

	};

	CollisionManager.prototype.onObjectCreate = function (newObject) {

		// var collisionManager = this,
		// 	ids = collisionManager.attr.ids;

		if (!newObject.attr.useCollision) {
			return;
		}

		// just add new obj to ids
		this.attr.ids[newObject.attr.id] = {
			object: newObject,
			place: {
				minX: 0,
				minY: 0,
				maxX: 0,
				maxY: 0
			},
			isIn: false
		};

	};

	CollisionManager.prototype.pushObject = function (object) {

		if (!object.attr.useCollision) {
			return;
		}

		var collisionManager = this,
			maxPlace = collisionManager.getMaxPlace(object),
			objData = collisionManager.attr.ids[object.attr.id],
			place = objData.place;

		objData.isIn = true;

		place.minX = maxPlace.minX;
		place.maxX = maxPlace.maxX;
		place.minY = maxPlace.minY;
		place.maxY = maxPlace.maxY;

	};

	CollisionManager.prototype.getMaxPlace = function (object) {

		var managerAttr = this.attr,
			squareData = managerAttr.square,
			attr = object.attr,
			diagonal05 = attr.diagonal05,
			x = attr.pos.x,
			y = attr.pos.y,
			minX = Math.floor((x - diagonal05) / squareData.w),
			minY = Math.floor((y - diagonal05) / squareData.h),
			maxX = Math.ceil((x + diagonal05) / squareData.w),
			maxY = Math.ceil((y + diagonal05) / squareData.h);

		if (maxX > managerAttr.maxX) {
			maxX = managerAttr.maxX;
		} else if (minX < managerAttr.minX) {
			minX = managerAttr.minX;
		}

		if (maxY > managerAttr.maxY) {
			maxY = managerAttr.maxY;
		} else if (minY < managerAttr.minY) {
			minY = managerAttr.minY;
		}

		return {
			minX: minX,
			minY: minY,
			maxX: maxX,
			maxY: maxY
		};

	};

	CollisionManager.prototype.updatePlace = function (object) {

		// get object min and max coordinates
		// check new data with before data
		// if has changes - do changes

		// get max sqaure
		var collisionManager = this,
			place = collisionManager.attr.ids[object.attr.id].place,
			newPlace = collisionManager.getMaxPlace(object);

		if (
			newPlace.minX === place.minX &&
			newPlace.minY === place.minY &&
			newPlace.maxX === place.maxX &&
			newPlace.maxY === place.maxY) {
			return;
		}

		// update places here
		collisionManager.changePlace(place, newPlace, object.attr.id);

	};

	CollisionManager.prototype.changePlace = function (place, newPlace, id) {

		var grid = this.attr.grid,
			placeMinX = place.minX,
			placeMinY = place.minY,
			placeMaxX = place.maxX,
			placeMaxY = place.maxY,
			newPlaceMinX = newPlace.minX,
			newPlaceMinY = newPlace.minY,
			newPlaceMaxX = newPlace.maxX,
			newPlaceMaxY = newPlace.maxY,
			iX, iY, cell,
			xyDivider = collisionManagerKeys.XY_DIVIDER;

		// clear from place
		for (iX = placeMinX; iX <= placeMaxX; iX += 1) {
			for (iY = placeMinY; iY <= placeMaxY; iY += 1) {
				// detect need clear or not
				if (!(iY > newPlaceMinY && iY < newPlaceMaxY && iX > newPlaceMinX && iX < newPlaceMaxX)) {
					cell = grid[iX + xyDivider + iY];
					cell.list.splice(cell.list.indexOf(id), 1);
					cell.length -= 1;
				}
			}
		}

		for (iX = newPlaceMinX; iX <= newPlaceMaxX; iX += 1) {
			for (iY = newPlaceMinY; iY <= newPlaceMaxY; iY += 1) {
				// detect need add or not
				if (!(iY > placeMinY && iY < placeMaxY && iX > placeMinX && iX < placeMaxX)) {
					cell = grid[iX + xyDivider + iY];
					cell.list[cell.length] = id;
					cell.length += 1;
				}
			}
		}

		place.minX = newPlaceMinX;
		place.minY = newPlaceMinY;
		place.maxX = newPlaceMaxX;
		place.maxY = newPlaceMaxY;

	};

	CollisionManager.prototype.removePlace = function (id) {

		var attr, grid, place, placeMinX, placeMinY, placeMaxX, placeMaxY, xyDivider, iX, iY, cell;
		attr = this.attr;

		if (!attr.ids[id].isIn) {
			console.log(' ----- attempt to remove twice');
			return;
		}

		grid = attr.grid;
		place = attr.ids[id].place;
		placeMinX = place.minX;
		placeMinY = place.minY;
		placeMaxX = place.maxX;
		placeMaxY = place.maxY;
		xyDivider = collisionManagerKeys.XY_DIVIDER;

		for (iX = placeMinX; iX <= placeMaxX; iX += 1) {
			for (iY = placeMinY; iY <= placeMaxY; iY += 1) {
				cell = grid[iX + xyDivider + iY];
				cell.list.splice(cell.list.indexOf(id), 1);
				cell.length -= 1;
			}
		}

		attr.ids[id].isIn = false;

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
			maxX: gridWidth - 1,
			maxY: gridHeight - 1,
			minX: 0,
			minY: 0,
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
			w: 40 * 2,
			h: 60 * 2
		};

	};

	return CollisionManager;

});
