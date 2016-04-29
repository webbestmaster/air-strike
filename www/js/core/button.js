define(['DisplayObject', 'device', 'deviceKeys'],
	function (DisplayObject, device, deviceKeys) {

		function Button(data) { // parentStage: stage, texturesPrefix: prefix, events: { 'name' : fn } or { 'name' : 'string' }

			var button = this,
				sprite = new PIXI.Sprite();

			button.sprite = sprite;
			button.setAnchor(0.5, 0.5);

			button.mainInitialize();


			button.stage = data.stage;

			data.stage.addChild(sprite);

			button.textureStatesInitialize(data.textureName);

			button.enable();
			// button.disable();

			// TODO: implement it!!!
			// button.bindEventListeners();

		}

		/*
		 Button.prototype.defaultOptions = {
		 // remove if useless
		 };
		 */

		Button.prototype = Object.create(DisplayObject.prototype);

		Button.prototype.eventMap = device.events;

		// Button.prototype.texturesPostfix = ['normal', 'hover', 'active', 'disable'];

		Button.prototype.textureStatesInitialize = function (textureName) {


			// Refactor this and add events logic for desctop

			var button = this;

			// add textures
			button.textures = {
				normal: PIXI.Texture.fromFrame(textureName + '-normal.png'),
				hover: PIXI.Texture.fromFrame(textureName + '-hover.png'),
				active: PIXI.Texture.fromFrame(textureName + '-active.png'),
				disable: PIXI.Texture.fromFrame(textureName + '-disable.png')
			};

			// mobile part
			button.subscribe(deviceKeys.DOWNS, button.onDowns);
			// button.subscribe(deviceKeys.MOVES, button.onMoves);
			button.subscribe(deviceKeys.UPS, button.onUps);

			// desktop part

			button.on('mouseover', button.onMouseOver, button);

			button.on('mouseout', button.onMouseOut, button);

		};

		Button.prototype.checkAction = function (events) {

			// don't ask me how
			// this is just magic
			var button = this,
				sprite,
				i,
				len = events.length,
				eventArr,
				width05,
				height05,
				x0,
				y0,
				x1,
				y1,
				pointX,
				pointY;

			if (!len) { // if len === 0, it means 2 or 1 finger to 0 finger
				return false;
			}

			sprite = button.sprite;
			i = 0;
			eventArr = events.events;
			width05 = sprite.width / 2;
			height05 = sprite.height / 2;
			x0 = sprite.x - width05;
			y0 = sprite.y - height05;
			x1 = sprite.x + width05;
			y1 = sprite.y + height05;

			for (; i < len; i += 1) {
				pointX = eventArr[i].x;
				pointY = eventArr[i].y;
				(x0 < pointX && x1 > pointX && y0 < pointY && y1 > pointY) && (len = 0); // exit from loop
			}

			return len === 0 && eventArr[i - 1];

		};

		Button.prototype.onMouseOver = function () {

			var button = this;

			if (!button.attr.isEnable) {
				return;
			}
			if (button.sprite.texture !== button.textures.hover) {
				button.sprite.texture = button.textures.hover;
			}

		};

		Button.prototype.onMouseOut = function () {

			var button = this;

			if (!button.attr.isEnable) {
				return;
			}

			if (button.sprite.texture !== button.textures.normal) {
				button.sprite.texture = button.textures.normal;
			}

		};

		Button.prototype.onDowns = function (events) {

			var button = this;

			if (!button.attr.isEnable) {
				return;
			}

			if ( button.checkAction(events) && button.sprite.texture !== button.textures.active) {
				button.sprite.texture = button.textures.active;
			}

		};

		Button.prototype.onMoves = function (events) {

			var button = this;

			if (!button.attr.isEnable) {
				return;
			}

			if (button.checkAction(events)) {
				if (button.sprite.texture !== button.textures.active) {
					button.sprite.texture = button.textures.active;
				}
			} else {
				if (button.sprite.texture !== button.textures.normal) {
					button.sprite.texture = button.textures.normal;
				}
			}
		};

		Button.prototype.onUps = function (events) {

			var button = this;

			if (!button.attr.isEnable) {
				return;
			}

			if ( button.checkAction(events) || button.sprite.texture === button.textures.normal) {
				return;
			}

			button.sprite.texture = button.textures.normal;

		};

		Button.prototype.setText = function (text) {
			this.textNode.text = text;
		};

		Button.prototype.setTextStyles = function (styles) {

			var textStyle = this.textNode.style;

			Object.keys(styles).forEach(function (key) {
				textStyle[key] = styles[key];
			});

			/*
			 this.textNode.style = {
			 font : 'bold italic 36px Arial',
			 fill : '#F7EDCA',
			 stroke : '#4a1850',
			 strokeThickness : 5,
			 dropShadow : true,
			 dropShadowColor : '#000000',
			 dropShadowAngle : Math.PI / 6,
			 dropShadowDistance : 6,
			 wordWrap : true,
			 wordWrapWidth : 440
			 };
			 */

		};

		Button.prototype.createTextNode = function (text, styles) {

			var button = this,
				textNode = new PIXI.Text(text || 'TEXT');

			textNode.anchor.set(0.5, 0.5);

			button.textNode = textNode;

			if (styles) {
				button.setTextStyles(styles);
			}

			button.sprite.addChild(textNode);

			return button;

		};

		Button.prototype.on = function (type, fn, context) {
			if (context) {
				this.sprite.on(this.eventMap[type], fn, context);
			} else {
				this.sprite.on(this.eventMap[type], fn);
			}
		};

		Button.prototype.off = function (typeArg, fn) {

			var button = this,
				sprite = button.sprite,
				eventMap = this.eventMap,
				type = eventMap[typeArg];

			if (typeArg && fn) {
				return sprite.off(type, fn);
			}

			if (typeArg) {
				return sprite.listeners(type).forEach(function (listener) {
					button.off(typeArg, listener);
				});
			}

			Object.keys(eventMap).forEach(function (key) {
				button.off(key);
			});

		};

		Button.prototype.enable = function () {
			this.attr.isEnable = true;
			this.sprite.interactive = true;
			this.sprite.texture = this.textures.normal;
		};

		Button.prototype.disable = function () {
			this.attr.isEnable = false;
			this.sprite.interactive = false;
			this.sprite.texture = this.textures.disable;
		};

		Button.prototype.destroy = function () {

			var button = this;

			button.disable();

			button.off();

			if (button.textNode) {
				button.sprite.removeChild(button.textNode);
			}

			button.stage.removeChild(button.sprite);

			button.mainDestroy();

			console.log('button destroy'); // remove

		};

		return Button;

	}
);
