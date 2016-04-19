define(['device'],
	function (device) {

		// "abstracted class"
		function DisplayObject() {

		}

		DisplayObject.prototype.setSize = function (width, height) {

			var sprite = this.sprite,
				q;

			if (width === -1) {
				q = sprite.height / height;
				sprite.height = height;
				sprite.width = Math.round(sprite.width / q);
				return this;
			}

			if (height === -1) {
				q = sprite.width / width;
				sprite.width = width;
				sprite.height = Math.round(sprite.height / q);
				return this;
			}

			sprite.width = width;
			sprite.height = height;

			return this;

		};

		DisplayObject.prototype.setAnchor = function (x, y) {
			this.sprite.anchor.x = x;
			this.sprite.anchor.y = y;
		};

		DisplayObject.prototype.moveTo = function (windowPoint, objectPoint, leftOffset, topOffset) {

			var xy1 = device.getCoordinatesOfPoint(windowPoint),
				xy2 = this.getCoordinatesOfPoint(objectPoint);

			this.sprite.x += xy1.x - xy2.x + (leftOffset || 0);
			this.sprite.y += xy1.y - xy2.y + (topOffset || 0);

		};

		DisplayObject.prototype.moveToAnimate = function (windowPoint, objectPoint, options, leftOffset, topOffset) {

			if (typeof options === 'number') {
				options = {time: options};
			}

			var sprite = this.sprite,
				xy1 = device.getCoordinatesOfPoint(windowPoint),
				xy2 = this.getCoordinatesOfPoint(objectPoint),
				cfg = {
					x: sprite.x - xy2.x + xy1.x + (leftOffset || 0),
					y: sprite.y - xy2.y + xy1.y + (topOffset || 0),
					onComplete: options.onComplete,
					ease: options.ease || Back.easeOut
				};

			TweenLite.to(sprite, options.time, cfg);

		};

		//////
		// helpers
		//////

		DisplayObject.prototype.getBounds = function () {

			this.sprite.updateTransform();

			return this.sprite.getBounds();

		};

		DisplayObject.prototype.getCoordinatesOfPoint = function (point) {

			var bounds = this.getBounds(),
				coordinates = {
					x: 0,
					y: 0
				};

			switch (point) {
				case 1 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y;
					break;
				case 2 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y;
					break;
				case 3 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y;
					break;
				case 4 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 5 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 6 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y + bounds.height / 2;
					break;
				case 7 :
					coordinates.x = bounds.x;
					coordinates.y = bounds.y + bounds.height;
					break;
				case 8 :
					coordinates.x = bounds.x + bounds.width / 2;
					coordinates.y = bounds.y + bounds.height;
					break;
				case 9 :
					coordinates.x = bounds.x + bounds.width;
					coordinates.y = bounds.y + bounds.height;
					break;
			}

			return coordinates;

		};

//////
// debug
//////
		DisplayObject.prototype.showSpriteDebug = function (sprite) {

			sprite.updateTransform();

			var bounds = sprite.getBounds(),
				graphic = new PIXI.Graphics();

			graphic.beginFill(0xFF0000, 0.5);
			graphic.drawRect(-bounds.width * sprite.anchor.x, -bounds.height * sprite.anchor.y, bounds.width, bounds.height);
			graphic.endFill();
			sprite.addChild(graphic);

		};

		DisplayObject.prototype.showDebug = function () {

			this.showSpriteDebug(this.sprite);

		};

		return DisplayObject;

	}
);

