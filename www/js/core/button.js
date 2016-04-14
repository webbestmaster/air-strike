function Button(view) {

	var button = this,
		PIXI = window.requireAsset.get('PIXI'),
		sprite = new PIXI.Sprite.fromImage('src/button.png');

	sprite.interactive = true;

	button.sprite = sprite;

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

	// view.showPIXIDebug(button.textNode);
	// view.showPIXIDebug(button.sprite);

}

/*
 Button.prototype.defaultOptions = {
 // remove if useless
 };
 */

Button.prototype = Object.create(window.requireAsset.get('DisplayObject').prototype);

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
		PIXI = window.requireAsset.get('PIXI'),
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
	// see http://pixijs.github.io/examples/index.html?s=demos&f=interactivity.js&title=Interactivity
};

Button.prototype.off = function () {
	// see https://github.com/pixijs/pixi.js/issues/381
};

Button.prototype.destroy = function () {

	var button = this;

	if (button.textNode) {
		button.sprite.removeChild(button.textNode);
	}

	button.parentView.stage.removeChild(button.sprite);

	button.off();

};

window.requireAsset.set('Button', Button);

export default Button;
