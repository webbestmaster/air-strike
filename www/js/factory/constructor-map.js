// use for collect links to constructors
define(['factoryKeys', 'Bullet'],function (factoryKeys, Bullet) {

	var map = {};

	map[factoryKeys.BULLET] = Bullet;

	return map;

});