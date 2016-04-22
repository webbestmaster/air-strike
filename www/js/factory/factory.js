define([
	'factoryKeys',
	'constructorMap',
	'objectKeys'
], function (
	factoryKeys,
	constructorMap,
	objectKeys
) {

	function Factory() {

		var factory = this;

		factory.attr = {
			lists: {},
			types: []
		};

		factory.initialize();

	}

	Factory.prototype.initialize = function () {

		// create lists for arrays
		// create list of types
		var factory = this,
			types = factory.attr.types,
			lists = factory.attr.lists,
			key, type;

		for (key in factoryKeys) {
			if (factoryKeys.hasOwnProperty(key)) {
				type = factoryKeys[key];
				types.push(type);
				lists[type] = {
					objects: [],
					lifeMap: []
				}
			}
		}

	};

	Factory.prototype.getObject = function (type) {

		// try to find object in saved array
		var lists = this.attr.lists[type],
			lifeMap = lists.lifeMap,
			objects = lists.objects,
			index = lifeMap.indexOf(objectKeys.DEAD);

		if (index !== -1) {
			lifeMap[index] = objectKeys.ALIVE;
			return objects[index];
		}

		index = lifeMap.length;
		lifeMap[index] = objectKeys.ALIVE;
		return objects[index] = new constructorMap[type]();

	};

	return Factory;

});