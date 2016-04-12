// init service - requireAsset
import requireAsset from 'services/require-asset';

// init service - mediator
import mediator from 'services/mediator';

// init libs
import PIXI from 'lib/pixi';
requireAsset.set('PIXI', PIXI);
import Deferred from 'lib/deferred';
requireAsset.set('Deferred', Deferred);

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

	requireAsset
		.get('textureMaster')
		.initTextures()
		.done(function () {
			renderer.initialize();
			var titleView = new TitleView();
			renderer.append(titleView);
			titleView.show();
		});

}

window.addEventListener('load', main, false);

