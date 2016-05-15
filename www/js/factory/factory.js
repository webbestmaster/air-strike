define([
	'factoryKeys',
	'constructorMap',
	'objectKeys',
	'mediator',
	'gameKeys',
	'cameraKeys',
	'collisionManagerKeys'
], function (factoryKeys,
			 constructorMap,
			 objectKeys,
			 mediator,
			 gameKeys,
			 cameraKeys,
			 collisionManagerKeys
			) {

	function Factory() {

		var factory = this;

		factory.attr = {
			lists: {},
			types: [],
			length: 0,
			idCounter: 0
		};

		factory.initialize();

		factory.bindEventListeners();

	}

	Factory.prototype.bindEventListeners = function () {

		var factory = this;

		mediator.installTo(factory);

		factory.subscribe(factoryKeys.events.CREATE, factory.getObject);
		factory.subscribe(factoryKeys.events.DESTROY, factory.destroyObject);
		factory.subscribe(factoryKeys.events.GET_LIST_OF, factory.getListOf);
		factory.subscribe(factoryKeys.events.GET_LAST_OF, factory.getLastOf);
		factory.subscribe(gameKeys.DESTROY, factory.destroy);

	};

	Factory.prototype.getLastOf = function (data) {

		var lists = this.attr.lists[data.type];
		data.fn.call(data.ctx || null, lists.objects[lists.length - 1]);

	};

	Factory.prototype.getListOf = function (data) {

		// TODO: add methods getListOfLive - for only live objects

		var lists = this.attr.lists[data.type],
			length = lists.length,
			objects = lists.objects,
			items = [],
			i = 0;

		for (; i < length; i += 1) {
			items[i] = objects[i];
		}

		data.fn.call(data.ctx || null, {
			items: items,
			length: length
		});

	};

	Factory.prototype.destroyObject = function (obj) {

		var lists = this.attr.lists[obj.attr.factoryKey],
			index = lists.objects.indexOf(obj);

		lists.lifeMap[index] = objectKeys.DEAD;

	};

	Factory.prototype.initialize = function () {

		// create lists for arrays
		// create list of types


		var factory = this,
			attr = factory.attr,
			types = attr.types,
			lists = attr.lists,
			factoryObjectKeys = factoryKeys.objects,
			key, type;

		for (key in factoryObjectKeys) {
			if (factoryObjectKeys.hasOwnProperty(key)) {
				type = factoryObjectKeys[key];
				types[attr.length] = type;
				attr.length += 1;
				lists[type] = {
					objects: [],
					lifeMap: [],
					length: 0
				}
			}
		}

	};

	Factory.prototype.getObject = function (type, options) {

		// try to find object in saved array
		var factory = this,
			attr = factory.attr,
			lists = attr.lists[type],
			lifeMap = lists.lifeMap,
			objects = lists.objects,
			index = lifeMap.indexOf(objectKeys.DEAD),
			neededObject;

		if (index !== -1) {
			lifeMap[index] = objectKeys.ALIVE;
			neededObject = objects[index].setDefaultProperties(options);
			neededObject.show();
		} else {
			index = lists.length;
			lifeMap[index] = objectKeys.ALIVE;
			objects[index] = neededObject = new constructorMap[type](options);
			neededObject.attr.id = (attr.idCounter += 1);
			factory.publish(gameKeys.APPEND_SPRITE, {
				sprite: neededObject.attr.sprite,
				layer: neededObject.attr.layer
			});
			lists.length += 1;
			neededObject.attr.factoryKey = type;
			factory.publish(factoryKeys.events.OBJECT_CREATED, neededObject);
		}

		neededObject.updateBounds();
		factory.publish(collisionManagerKeys.PUSH_OBJECT, neededObject);
		factory.publish(cameraKeys.ADJUST_SPRITE, neededObject.attr);

		return neededObject;

	};

	Factory.prototype.destroy = function () {

		var factory = this,
			factoryData = factory.attr,
			lists = factoryData.lists,
			list,
			types = factoryData.types,
			iiTypes = 0, lenTypes = factoryData.length,
			iiObjects, lenObjects,
			objects, lifeMap;

		for (; iiTypes < lenTypes; iiTypes += 1) {
			list = lists[types[iiTypes]];
			objects = list.objects;
			lifeMap = list.lifeMap;
			for (iiObjects = 0, lenObjects = list.length; iiObjects < lenObjects; iiObjects += 1) {
				objects[iiObjects].fullDestroy();
			}
		}

		factory.attr = {};

		factory.unsubscribe();
		mediator.uninstallFrom(factory);

	};

	return Factory;

});