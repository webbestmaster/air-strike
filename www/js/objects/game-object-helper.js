define(['mediator', 'cameraKeys'], function (mediator, cameraKeys) {

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

			mediator.installTo(helper);

			helper.subscribe(cameraKeys.BOUNDS_UPDATED, helper.setBoundsOfCamera);

		},

		setBoundsOfCamera: function (data) {

			var attr = this.attr;
			attr.q = data.q;
			attr.qX = data.qX;
			attr.qY = data.qY;

		}

	};

});
