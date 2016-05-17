// use for collect links to constructors
/*global define */
define(['factoryKeys', 'Aircraft', 'Bullet', 'JuniorMissile', 'Cross'],function (factoryKeys, Aircraft, Bullet, JuniorMissile, Cross) {

	"use strict";
	
	var map = {};

	map[factoryKeys.objects.AIRCRAFT] = Aircraft;
	map[factoryKeys.objects.BULLET] = Bullet;
	map[factoryKeys.objects.JUNIOR_MISSILE] = JuniorMissile;
	map[factoryKeys.objects.CROSS] = Cross;

	return map;

});