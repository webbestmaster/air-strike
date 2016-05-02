// use for collect links to constructors
define(['factoryKeys', 'Aircraft', 'Bullet', 'JuniorMissile', 'Cross'],function (factoryKeys, Aircraft, Bullet, JuniorMissile, Cross) {

	var map = {};

	map[factoryKeys.objects.AIRCRAFT] = Aircraft;
	map[factoryKeys.objects.BULLET] = Bullet;
	map[factoryKeys.objects.JUNIOR_MISSILE] = JuniorMissile;
	map[factoryKeys.objects.CROSS] = Cross;

	return map;

});