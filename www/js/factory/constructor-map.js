// use for collect links to constructors
define(['factoryKeys', 'Aircraft', 'Bullet'],function (factoryKeys, Aircraft, Bullet) {

	var map = {};

	map[factoryKeys.AIRCRAFT] = Aircraft;
	map[factoryKeys.BULLET] = Bullet;

	return map;

});