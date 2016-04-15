define(function () {

		function DisplayObject() {

		}

		DisplayObject.prototype.getDelta = function (obj_1, obj_2, point_1, point_2) {

			var xy1 = this.getCoordinatesByPoint(obj_1, point_1),
				xy2 = this.getCoordinatesByPoint(obj_2, point_2);

			return {
				x: xy1.x - xy2.x,
				y: xy1.y - xy2.y
			}

		};

		DisplayObject.prototype.getBounds = function () {

			this.sprite.updateTransform();

			return this.sprite.getBounds();

		};

		DisplayObject.prototype.getCoordinatesByPoint = function (obj, point) {

			var coordinates = {
				x: 0,
				y: 0
			};

			switch (point) {
				case 1 :
					coordinates.x = obj.x;
					coordinates.y = obj.y;
					break;
				case 2 :
					coordinates.x = obj.x + obj.width / 2;
					coordinates.y = obj.y;
					break;
				case 3 :
					coordinates.x = obj.x + obj.width;
					coordinates.y = obj.y;
					break;
				case 4 :
					coordinates.x = obj.x;
					coordinates.y = obj.y + obj.height / 2;
					break;
				case 5 :
					coordinates.x = obj.x + obj.width / 2;
					coordinates.y = obj.y + obj.height / 2;
					break;
				case 6 :
					coordinates.x = obj.x + obj.width;
					coordinates.y = obj.y + obj.height / 2;
					break;
				case 7 :
					coordinates.x = obj.x;
					coordinates.y = obj.y + obj.height;
					break;
				case 8 :
					coordinates.x = obj.x + obj.width / 2;
					coordinates.y = obj.y + obj.height;
					break;
				case 9 :
					coordinates.x = obj.x + obj.width;
					coordinates.y = obj.y + obj.height;
					break;
			}

			return coordinates;

		};

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

