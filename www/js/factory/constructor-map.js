// use for collect links to constructors
define(['factoryKeys', 'Aircraft', 'Bullet', 'JuniorMissile'],function (factoryKeys, Aircraft, Bullet, JuniorMissile) {

	var map = {};

	map[factoryKeys.objects.AIRCRAFT] = Aircraft;
	map[factoryKeys.objects.BULLET] = Bullet;
	map[factoryKeys.objects.JUNIOR_MISSILE] = JuniorMissile;

	return map;

});