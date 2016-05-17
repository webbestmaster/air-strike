/*global define */
define(function () {

	"use strict";

	var playersTeamId = 'ids:player:teamId:0';

	return {

		STATE: {
			SHOOTING: 'game-object:state:shooting',
			MOVING: 'game-object:state:moving'
		},
		DEBUG: {
			SHOW: 'game-object:debug:show',
			HIDE: 'game-object:debug:hide'
		},

		IDS: {
			PLAYER: [
				{
					ownerId: 'ids:player:0:ownerId:0',
					teamId: playersTeamId
				},
				{
					ownerId: 'ids:player:1:ownerId:1',
					teamId: playersTeamId
				}
			],
			NEUTRAL: {
				ownerId: 'ids:neutral:ownerId',
				teamId: 'ids:neutral:teamId'
			},
			ENEMY: {
				ownerId: 'ids:enemy:ownerId',
				teamId: 'ids:enemy:teamId'
			}
		}

	};

});
