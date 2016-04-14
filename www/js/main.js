// init service - window.requireAsset
import requireAsset from 'services/require-asset';

// init service - mediator
import mediator from 'services/mediator';

// init libs
import PIXI from 'lib/pixi';
window.requireAsset.set('PIXI', PIXI);
import Deferred from 'lib/deferred';
window.requireAsset.set('Deferred', Deferred);

// init services
import log from 'services/log'; // remove
import device from 'services/device';

// core
import renderer from 'core/renderer';
import BaseView from 'core/base-view';
import textureMaster from 'core/texture-master';

// views
import TitleView from 'view/title/title';

function main() {

	device.initialize();

	window
		.requireAsset
		.get('textureMaster')
		.initTextures()
		.done(function () {
			renderer.initialize();
			mediator.publish('show:TitleView');
		});

}

window.addEventListener('load', main, false);

