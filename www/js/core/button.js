function Button(view, optipns) {

	var button = this,
		PIXI = window.requireAsset.get('PIXI'),
		sprite = new PIXI.Sprite.fromImage('src/button.png');

	sprite.interactive = true;

	button.sprite = sprite;

	button.setAnchor(0.5, 0.5);
	button.setPosition(100, 100);

	view.stage.addChild(sprite);

	button.parentView = view;

	button.createTextNode();

}

Button.prototype.createTextNode = function (text, options) {

	var button = this,
		PIXI = window.requireAsset.get('PIXI'),
		textNode = new PIXI.Text('Basic text in pixi');

	button.sprite.addChild(textNode);

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

	button.parentView.stage.removeChild(button.sprite);

	button.off();

};

window.requireAsset.set('Button', Button);

export default Button;
