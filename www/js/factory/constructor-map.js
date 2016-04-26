// use for collect links to constructors
define(['factoryKeys', 'Aircraft', 'Bullet'],function (factoryKeys, Aircraft, Bullet) {

	var map = {};

	map[factoryKeys.objects.AIRCRAFT] = Aircraft;
	map[factoryKeys.objects.BULLET] = Bullet;

	return map;

});