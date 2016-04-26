define(function () {

	return {
		objects: {
			BULLET: 'factory:Bullet',
			AIRCRAFT: 'factory:Aircraft',
			JUNIOR_MISSILE: 'factory:JuniorMissile'
		},
		events: {
			CREATE: 'factory:create',
			DESTROY: 'factory:destroy'
		}
	}

});