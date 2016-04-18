define(
	['BaseView', 'Button', 'device', 'TweenLite', 'mediator', 'camera'],
	function (BaseView, Button, device, TweenLite, mediator, camera) {

		var buttonMap = [

			{
				text: 'text',
				style: {}
			}

		];

		function TitleView() {

			var view = this;

			view.initialize({
				bg: 'bg-title'
			});

			view.mainShow();

			view.addButtons();

		}

		TitleView.prototype = Object.create(BaseView.prototype);

		TitleView.prototype.addButtons = function () {

			var view = this,
				deviceData = device.attr;

			buttonMap.forEach(function (buttonData) {

				var button = new Button(view),
					delta;

				button.createTextNode('I am the text on the button', {
					font: camera.remToPixel(3, 'px') + ' quake',
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
					mediator.publish('show:SettingView');
					// button.destroy();
				});

				// setTimeout(function () {
				// 	button.destroy();
				// }, 3000);
				
				view.buttons.push(button);

			});


			/*
			 view.buttons.push(

			 )
			 */

		};

		mediator.subscribe('show:TitleView', function () {
			new TitleView();
		});

		return TitleView;

	}

);
