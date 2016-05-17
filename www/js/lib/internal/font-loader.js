/*global define, Image */
define(['Deferred'], function (Deferred) {

	"use strict";

	return {

		load: function (path) {

			var image = new Image(),
				defer = new Deferred(),
				style = image.style;

			style.position = 'fixed';
			style.top = '0';
			style.left = '0';

			image.onerror = image.onload = function () {
				this.onerror = this.onload = null;
				defer.resolve();
			};

			image.src = path;

			return defer.promise();

		}

	};

});
