define(
	['BaseView', 'Button', 'device', 'TweenLite', 'mediator', 'camera'],
	function (BaseView, Button, device, TweenLite, mediator, camera) {

		var buttonMap = [

			{
				text: 'text',
				offset: {
					top: -3
				}
			},
			{
				text: 'text 1',
				offset: {
					top: 0
				}
			},
			{
				text: 'text 2',
				offset: {
					top: 3
				}
			},
			{
				text: 'text 3',
				offset: {
					top: 6
				}
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

			buttonMap.forEach(function (buttonData, index) {

				var button = new Button(view);

				button.createTextNode(buttonData.text, {
					font: camera.remToPixel(3, 'px') + ' quake',
					fill: '#FFF',
					align: 'center',
					wordWrap: true,
					wordWrapWidth: button.sprite.width * 0.8
				});

				button.setSize(-1, camera.remToPixel(2.8));

				// debugger
				button.moveTo(4, 6, 0, camera.remToPixel(buttonData.offset.top));

				// the same of
				// button.moveToAnimate(1, 1, {
				// 	time: 6
				// });
				// this
				button.moveToAnimate(5, 5, {
					time: 2,
					delay: index / 3
				}, 0, camera.remToPixel(buttonData.offset.top));

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

		mediator.subscribe('show:TitleView', function showTitleView() {
			new TitleView();
		});

		return TitleView;

	}

);
