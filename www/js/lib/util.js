define(function () {

	return {

		extend: function (from, to) {

			var key;

			for (key in from) {
				to[key] = from[key];
			}

		},

		deepExtend: function (from, to) {

			var key, obj;

			for (key in from) {
				obj = from[key];
				if (obj && typeof obj === 'object') {
					this.deepExtend(obj, to[key] = to[key] || {});
				} else {
					to[key] = obj;
				}
			}

		}

	}

});
