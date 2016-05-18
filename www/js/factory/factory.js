/*global define, String */
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

	"use strict";

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
			i;

		for (i = 0; i < length; i += 1) {
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
				};
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
			neededObject,
			objectAttr;

		if (index !== -1) {
			lifeMap[index] = objectKeys.ALIVE;
			neededObject = objects[index].setDefaultProperties(options);
			neededObject.show();
			if (neededObject.attr.life.hasBar) {
				neededObject.attr.lifeBar.graphics.visible = true;
			}
			objectAttr = neededObject.attr;
		} else {
			index = lists.length;
			lifeMap[index] = objectKeys.ALIVE;
			objects[index] = neededObject = new constructorMap[type](options);
			objectAttr = neededObject.attr;
			attr.idCounter += 1;
			objectAttr.id = String(attr.idCounter);
			factory.publish(gameKeys.APPEND_SPRITE, {
				sprite: objectAttr.sprite,
				layer: objectAttr.layer
			});
			lists.length += 1;
			objectAttr.factoryKey = type;
			factory.publish(factoryKeys.events.OBJECT_CREATED, neededObject);
		}

		neededObject.updateBounds();
		if (objectAttr.useCollision) {
			factory.publish(collisionManagerKeys.PUSH_OBJECT, neededObject);
		}
		factory.publish(cameraKeys.ADJUST_SPRITE, objectAttr);

		return neededObject;

	};

	Factory.prototype.destroy = function () {

		var factory = this,
			factoryData = factory.attr,
			lists = factoryData.lists,
			list,
			types = factoryData.types,
			iiTypes,
			lenTypes = factoryData.length,
			iiObjects, lenObjects,
			objects;
			// lifeMap

		for (iiTypes = 0; iiTypes < lenTypes; iiTypes += 1) {
			list = lists[types[iiTypes]];
			objects = list.objects;
			// lifeMap = list.lifeMap;
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