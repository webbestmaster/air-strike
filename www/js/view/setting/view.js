define(
	['BaseView', 'Button', 'device', 'TweenLite', 'mediator', 'camera'],
	function (BaseView, Button, device, TweenLite, mediator, camera) {

		function SettingView() {

			var view = this;

			view.initialize({
				bg: 'bg-setting'
			});

			view.mainShow();




			var button = new Button(view),
				deviceData = device.attr,
				delta;

			button.createTextNode('I am the text on the button', {
				font: camera.remToPixel(1, 'px') + ' quake',
				fill: '#FFF',
				align: 'center',
				wordWrap: true,
				wordWrapWidth: button.sprite.width * 0.8
			});

			delta = button.getDelta({
				x: 0,
				y: 0,
				width: deviceData.width,
				height: deviceData.height
			}, button.getBounds(), 4, 6);

			button.setPosition(delta.x, delta.y);

			TweenLite
				.to(
					button.sprite,
					2,
					{
						x: deviceData.width / 2,
						y: deviceData.height / 2,
						onComplete: function () {
							console.log('onComplete');
						},
						ease: Back.easeOut
					}
				);

			button.on('click', function () {
				mediator.publish('show:TitleView');
				// button.destroy();
			});

			// setTimeout(function () {
			// 	button.destroy();
			// }, 3000);

			view.buttons.push(button);




		}

		SettingView.prototype = Object.create(BaseView.prototype);

		mediator.subscribe('show:SettingView', function () {
			new SettingView();
		});

		return SettingView;

	}

);
