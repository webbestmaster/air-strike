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
			lists: {}
		};

		factory.initialize();

	}

	Factory.prototype.initialize = function () {

		// create lists for arrays
		var factory = this,
			lists = factory.attr.lists;

		for (var key in factoryKeys) {
			if (factoryKeys.hasOwnProperty(key)) {
				lists[factoryKeys[key]] = {
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