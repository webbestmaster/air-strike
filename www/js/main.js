// init require Asset
import requireAsset from 'services/require-asset';

// init mediator
import mediator from 'services/mediator';

// init libs
import PIXI from 'lib/pixi';

// init services
import log from 'services/log'; // remove
import device from 'services/device'; // remove

// core
import renderer from 'core/renderer';

requireAsset.set('mediator', mediator);
requireAsset.set('PIXI', PIXI);
requireAsset.set('device', device);
requireAsset.set('log', log);
requireAsset.set('renderer', renderer);

function main() {

	device.initialize();
	renderer.initialize();

}

window.addEventListener('load', main, false);

