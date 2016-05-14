define(function () {

	return {
		objects: {
			BULLET: 'factory:Bullet',
			AIRCRAFT: 'factory:Aircraft',
			JUNIOR_MISSILE: 'factory:JuniorMissile',
			CROSS: 'factory:Cross'
		},
		events: {
			OBJECT_CREATED: 'factory:object-created',
			CREATE: 'factory:create',
			DESTROY: 'factory:destroy',
			GET_LIST_OF: 'factory:get-list-of',
			GET_LAST_OF: 'factory:get-last-of'
		}
		// REQUIRE_ASSET_NAME: 'factory:require-asset-name'
	}

});