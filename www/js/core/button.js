define(['DisplayObject', 'device'],
	function (DisplayObject, device) {

		function Button(view) {

			var button = this,
				sprite = new PIXI.Sprite.fromImage('src/button.png');

			button.sprite = sprite;

			button.enable();

			button.setAnchor(0.5, 0.5);
			// button.setPosition(200, 100);
			// button.setSize(-1, 100);

			// button.createTextNode();
			// // button.setText('I am The Text');
			// button.setTextStyles({
			// 	font : '50px monospace',
			// 	fill : '#FFF'
			// });

			view.stage.addChild(sprite);

			button.parentView = view;

		}

		/*
		 Button.prototype.defaultOptions = {
		 // remove if useless
		 };
		 */

		Button.prototype = Object.create(DisplayObject.prototype);

		Button.prototype.eventMap = device.events;

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

		Button.prototype.setSize = function (width, height) {

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

		Button.prototype.setAnchor = function (x, y) {
			this.sprite.anchor.x = x;
			this.sprite.anchor.y = y;
		};

		Button.prototype.setPosition = function (x, y) {
			this.sprite.position.x = x;
			this.sprite.position.y = y;
		};

		Button.prototype.on = function (type, fn) {
			this.sprite.on(this.eventMap[type], fn);
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
			this.sprite.interactive = true;
		};

		Button.prototype.disable = function () {
			this.sprite.interactive = false;
		};

		Button.prototype.destroy = function () {

			var button = this;

			button.disable();

			button.off();

			if (button.textNode) {
				button.sprite.removeChild(button.textNode);
			}

			button.parentView.stage.removeChild(button.sprite);

		};

		return Button;

	}
);
