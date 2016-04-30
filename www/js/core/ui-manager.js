define(['mediator', 'uiManagerKeys', 'BaseViewKeys'], function (mediator, uiManagerKeys, BaseViewKeys) {
	
	return {

		bounds: [],
		sprites: [],
		length: 0,

		initialize: function () {

			var uiManager = this;

			// uiManager.reset();

			uiManager.bindEventListeners();
			
		},

		bindEventListeners: function () {

			var uiManager = this;

			mediator.installTo(uiManager);

			uiManager.subscribe(uiManagerKeys.APPEND_SPRITE, uiManager.appendSprite);
			uiManager.subscribe(uiManagerKeys.REMOVE_SPRITE, uiManager.removeSprite);
			uiManager.subscribe(uiManagerKeys.UPDATE_SPRITE, uiManager.updateSprite);
			uiManager.subscribe(BaseViewKeys.HIDE, uiManager.reset);
			// uiManager.subscribe(uiManagerKeys.UPDATE, uiManager.update);

		},

		appendSprite: function (sprite) {

			var uiManager = this;

			uiManager.sprites[uiManager.length] = sprite;
			uiManager.length += 1;

			uiManager.updateSprite(sprite);

		},

		removeSprite: function (sprite) {

			var uiManager = this,
				sprites = uiManager.sprites,
				index = sprites.indexOf(sprite);

			if (index === -1) {
				return;
			}

			sprites.splice(index, 1);
			uiManager.bounds.splice(index, 1);
			uiManager.length -= 1;

		},

		reset: function () {

			var uiManager = this;

			uiManager.bounds = [];
			uiManager.sprites = [];
			uiManager.length = 0;

		},

/*
		update: function () {

		},
*/

		updateSprite: function (sprite) {

			var uiManager = this,
				index = uiManager.sprites.indexOf(sprite),
				bounds = uiManager.bounds,
				spriteBounds;

			if (index === -1) {
				return;
			}

			sprite.updateTransform();

			spriteBounds = sprite.getBounds();

			bounds[index] = {
				x0: spriteBounds.x,
				y0: spriteBounds.y,
				x1: spriteBounds.x + spriteBounds.width,
				y1: spriteBounds.y + spriteBounds.height
			};

		},

		isInUI: function (x, y) {

			var uiManager = this,
				len = uiManager.length,
				bounds = uiManager.bounds,
				boundData,
				i = 0;

			for (; i < len; i += 1) {
				boundData = bounds[i];
				if (x > boundData.x0 && x < boundData.x1 && y > boundData.y0 && y < boundData.y1) {
					return true;
				}
			}

			return false;

		}

	}
	
});
