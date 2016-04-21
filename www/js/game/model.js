define(['Factory', 'factoryKeys'], function (Factory, factoryKeys) {

	function GameModel() {

		var game = this;

		game.factory = new Factory();

		var obj = game.factory.getObject(factoryKeys.BULLET);

		console.log(obj);

		console.log(game.factory);


	}

	

	return GameModel;

});
