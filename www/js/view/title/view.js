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

			var view = this;

			buttonMap.forEach(function (buttonData) {

				var button = new Button(view);

				button.createTextNode('I am the text on the button', {
					font: camera.remToPixel(3, 'px') + ' quake',
					fill: '#FFF',
					align: 'center',
					wordWrap: true,
					wordWrapWidth: button.sprite.width * 0.8
				});

				button.setSize(-1, 30);

				// debugger
				button.moveTo(9, 9);

				// the same of
				// button.moveToAnimate(1, 1, {
				// 	time: 6
				// });
				// this
				button.moveToAnimate(3, 3, 5);

				button.on('click', function () {
					mediator.publish('show:SettingView');
					// button.destroy();
				});
				//
				// // setTimeout(function () {
				// // 	button.destroy();
				// // }, 3000);
				//
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
