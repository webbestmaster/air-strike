define(
	['device'],
	function (device) {

	return {

		defaults: {
			width: 320,
			height: 480,
			remSize: {
				min: 16,
				max: 26
			}
		},

		attr: {
			width: 320,
			height: 480,
			x: 0,
			y: 0,
			remSize: 20
		},

		initialize: function () {

			var camera = this;

			camera.detectRemSize();

		},

		detectRemSize: function () {

			var camera = this,
				defaults = camera.defaults,
				cameraArea = defaults.width * defaults.height,
				deviceData = device.attr,
				deviceArea = deviceData.width * deviceData.height,
				remSize = Math.round(deviceArea / cameraArea * defaults.remSize.min);

			remSize = Math.max(remSize, defaults.remSize.min);
			remSize = Math.min(remSize, defaults.remSize.max);

			camera.attr.remSize = remSize;

			document.documentElement.style.fontSize = camera.attr.remSize + 'px';

		},

		remToPixel: function (rem, postfix) {

			if (postfix) {
				return this.attr.remSize * rem + postfix;
			}

			return this.attr.remSize * rem;

		}






	};

});
