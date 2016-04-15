// init service - window.requireAsset
import requireAsset from 'services/require-asset';

// init service - mediator
import mediator from 'services/mediator';

// init libs
import PIXI from 'lib/pixi';
window.requireAsset.set('PIXI', PIXI);
import Deferred from 'lib/deferred';
window.requireAsset.set('Deferred', Deferred);
import fontLoader from 'lib/font-loader';
import EasePack from 'lib/EasePack.min';
import TweenLite from 'lib/TweenLite.min';

// init services
import log from 'services/log'; // remove
import device from 'services/device';

// core
import renderer from 'core/renderer';
import textureMaster from 'core/texture-master';
import DisplayObject from 'core/display-object';
import BaseView from 'core/base-view';
import Button from 'core/button';
import loader from 'core/loader';

// views
import TitleView from 'view/title/title';

function main() {

	device.initialize();

	loader
		.load()
		.done(function () {
			renderer.initialize();
			mediator.publish('show:TitleView');
		});

}

window.addEventListener('load', main, false);

