define(['Deferred'], function (Deferred) {

	var fontLoader = {

		load: function (path) {

			var image = new Image(),
				defer = new Deferred();

			image.style.position = 'fixed';

			image.style.top = 0;
			image.style.left = 0;

			image.onerror = image.onload = function () {
				this.onerror = this.onload = null;
				defer.resolve();
			};

			image.src = path;

			return defer.promise();

		}

	};

	return fontLoader;

});
