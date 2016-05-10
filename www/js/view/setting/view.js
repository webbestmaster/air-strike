define(
	['BaseView', 'Button', 'device', 'TweenMax', 'mediator', 'camera'],
	function (BaseView, Button, device, TweenMax, mediator, camera) {

		function SettingView() {

			var view = this;

			view.mainInitialize({
				bg: 'bg-setting'
			});

			view.mainShow();



			
			var button = new Button(view);

			button.createTextNode('I am the text on the button', {
				font: camera.remToPixel(1) + 'px quake',
				fill: '#FFF',
				align: 'center',
				wordWrap: true,
				wordWrapWidth: button.sprite.width * 0.8
			});

			button.moveTo(5, 4);

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
		SettingView.prototype.constructor = SettingView;

		mediator.subscribe('show:SettingView', function showSettingView() {
			new SettingView();
		});

		return SettingView;

	}

);
