define(['mediator', 'cameraKeys', 'camera'], function (mediator, cameraKeys, camera) {

	return {

		attr: {
			qX: 0,
			qY: 0,
			q: 0
		},

		initialize: function () {

			var helper = this;

			helper.bindEventListeners();

		},

		bindEventListeners: function () {

			var helper = this;

			// mediator.installTo(helper);

			// helper.subscribe(cameraKeys.BOUNDS_UPDATED, helper.setBoundsOfCamera);

		}

/*
		setBoundsOfCamera: function (data) {

			var attr = this.attr;
			attr.w = data.w;
			attr.h = data.h;
			attr.dw = data.dw;
			attr.dh = data.dh;
			attr.w05 = data.w05;
			attr.h05 = data.h05;
			attr.q = data.q;
			attr.qX = data.qX;
			attr.qY = data.qY;

		},
*/

		/*
		 getPathSize: function (x1, y1, x2, y2) {

		 var dx = x2 - x1,
		 dy = y2 - y1;

		 return Math.sqrt(dx * dx + dy * dy);

		 },
		 */


	};

});
