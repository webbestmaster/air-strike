// init mediator
import mediator from 'services/mediator';

// init libs
import PIXI from 'lib/pixi';

// init services
import log from 'services/log'; // remove
import device from 'services/device'; // remove

function main() {
	device.initialize();

}

var win = window.addEventListener('load', main, false);

