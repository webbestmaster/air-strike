define([
	'factoryKeys',
	'constructorMap',
	'objectKeys',
	'mediator',
	'gameKeys',
	'cameraKeys'
], function (factoryKeys,
			 constructorMap,
			 objectKeys,
			 mediator,
			 gameKeys,
			 cameraKeys) {

	function Factory() {

		var factory = this;

		factory.attr = {
			lists: {},
			types: []
		};

		factory.initialize();

		factory.bindEventListeners();

	}

	Factory.prototype.bindEventListeners = function () {

		var factory = this;

		mediator.installTo(factory);

		factory.subscribe(factoryKeys.events.CREATE, factory.getObject);
		factory.subscribe(factoryKeys.events.DESTROY, factory.destroyObject);

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
			types = factory.attr.types,
			lists = factory.attr.lists,
			factoryObjectKeys = factoryKeys.objects,
			key, type;

		for (key in factoryObjectKeys) {
			if (factoryObjectKeys.hasOwnProperty(key)) {
				type = factoryObjectKeys[key];
				types.push(type);
				lists[type] = {
					objects: [],
					lifeMap: []
				}
			}
		}

	};

	Factory.prototype.getObject = function (type, options) {

		// try to find object in saved array
		var lists = this.attr.lists[type],
			lifeMap = lists.lifeMap,
			objects = lists.objects,
			index = lifeMap.indexOf(objectKeys.DEAD),
			neededObject;

		if (index !== -1) {
			lifeMap[index] = objectKeys.ALIVE;
			neededObject = objects[index].setDefaultProperties(options);
			neededObject.show();
		} else {
			index = lifeMap.length;
			lifeMap[index] = objectKeys.ALIVE;
			objects[index] = neededObject = new constructorMap[type](options);
			this.publish(gameKeys.APPEND_SPRITE, {
				sprite: neededObject.attr.sprite,
				layer: neededObject.attr.layer
			});
			neededObject.attr.factoryKey = type;
		}

		this.publish(cameraKeys.ADJUST_SPRITE, neededObject.attr);

		return neededObject;

	};

	return Factory;

});