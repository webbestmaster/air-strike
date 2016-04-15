var fontLoader = {

	load: function (path) {

		var image = new Image(),
			Deferred = window.requireAsset.get('Deferred'),
			defer = new Deferred();

		image.style.position = 'fixed';

		image.style.top = 0;
		image.style.left = 0;

		image.onerror = image.onload = function () {
			this.onerror = this.onload = null;
			document.body.removeChild(this);
			defer.resolve();
		};

		image.src = path;

		document.body.appendChild(image);

		return defer.promise();

	}

};

window.requireAsset.set('fontLoader', fontLoader);

export default fontLoader;
