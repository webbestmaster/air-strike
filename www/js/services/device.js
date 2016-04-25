define(
	[
		'mediator',
		'lib/endless-array',
		'deviceKeys'
	],
	function (mediator,
			  EndlessArray,
			  deviceKeys) {

		var win = window,
			doc = win.document,
			docElem = doc.documentElement,
			device = {

				eventTypes: {
					click: ['click', 'tap'],
					down: ['mousedown', 'touchstart'],
					move: ['mousemove', 'touchmove'],
					up: ['mouseup', 'touchend']
				},

				events: {
					click: '',
					down: '',
					move: '',
					up: ''
				},

				mapEventType: {
					click: 'click',
					tap: 'click',
					mousedown: 'down',
					touchstart: 'down',
					mousemove: 'move',
					touchmove: 'move',
					mouseup: 'up',
					touchend: 'up'
				},

				attr: {

					pixelRatio: win.devicePixelRatio || 1,

					width: 0,
					height: 0,
					orientation: '|',
					spaceSize: 0,

					isTouch: false,
					_logMoving: new EndlessArray(10), // use endless array
					_logDown: new EndlessArray(10), // use endless array
					_pinchStartEvents: [], // normal array
					_pointDataX: 0.0,
					_pointDataY: 0.0,
					_pointDataScale: 1.0,

					_currentPointData: {
						x: 0.0,
						y: 0.0
					},

					_actionIsActive: false,
					_pinchIsActive: false

				},

				mediator: mediator,

				initialize: function () {

					var device = this;

					device.collectInfo();

					device.bindEventListeners();

					device.onResize();

				},

				collectInfo: function () {

					var device = this,
						isTouch = 'ontouchstart' in doc,
						eventTypesIndex = Number(isTouch),
						types = device.eventTypes,
						events = device.events,
						key;

					// set is touch
					device.attr.isTouch = isTouch;

					// set events names - touch or mouse
					for (key in types) {
						if (types.hasOwnProperty(key)) {
							events[key] = types[key][eventTypesIndex];
						}
					}

				},

				bindEventListeners: function () {

					var events = device.events,
						body = doc.body;

					win.addEventListener('resize', this.onResize.bind(this), false);

					body.addEventListener(events.down, this.onDown.bind(this), false);

					body.addEventListener(events.move, this.onMove.bind(this), false);

					body.addEventListener(events.up, this.onUp.bind(this), false);

					/*
					 device.on('change:_actionIsActive', function (self, actionIsActive) {
					 self.publish('deviceEvent:isActive', actionIsActive, self.attr._logMoving.getLast()());
					 });
					 */

				},

				getEvents: function (e) {

					//e = e.originalEvent; // for jQ like

					var device = this,
						evt = {
							events: [],
							length: 0,
							type: ''
						},
						events = device.attr.isTouch ? e.touches : [e],
						i, len = events.length;

					evt.length = len;
					evt.type = device.mapEventType[e.type];

					for (i = 0; i < len; i += 1) {
						evt.events[i] = {
							x: events[i].clientX,
							y: events[i].clientY
						};
					}

					return evt;

				},

				getAverageXY: function (arr) {

					var sumX = 0,
						sumY = 0,
						count = arr.length,
						i;

					for (i = 0; i < count; i += 1) {
						sumX += arr[i].x;
						sumY += arr[i].y;
					}

					return {
						x: sumX / count,
						y: sumY / count
					};

				},

				logDown: function (events) {

					var device = this,
						xy;

					if (events.length !== 1) {
						return;
					}

					xy = events.events[0];

					device.attr._logDown.push({
						x: xy.x,
						y: xy.y,
						ts: Date.now()
					});

				},

				getPinchData: function (events) {

					var device = this,
						startEvents = device.attr._pinchStartEvents,

						startXY0 = startEvents[0],
						startXY1 = startEvents[1],
						startXY0X = startXY0.x,
						startXY0Y = startXY0.y,
						startXY1X = startXY1.x,
						startXY1Y = startXY1.y,
						startVectorX = startXY1X - startXY0X,
						startVectorY = startXY1Y - startXY0Y,

						currentXY0 = events[0],
						currentXY1 = events[1],
						currentXY0X = currentXY0.x,
						currentXY0Y = currentXY0.y,
						currentXY1X = currentXY1.x,
						currentXY1Y = currentXY1.y,
						currentVectorX = currentXY1X - currentXY0X,
						currentVectorY = currentXY1Y - currentXY0Y,

						before,
						after,
						startAngle,
						currentAngle,
						deltaAngle;

					// get scale
					before = Math.pow(startXY0X - startXY1X, 2) + Math.pow(startXY0Y - startXY1Y, 2);
					before = Math.pow(before, 0.5);

					after = Math.pow(currentXY0X - currentXY1X, 2) + Math.pow(currentXY0Y - currentXY1Y, 2);
					after = Math.pow(after, 0.5);

					// get angle
					startAngle = Math.atan2(startVectorY, startVectorX);
					currentAngle = Math.atan2(currentVectorY, currentVectorX);
					deltaAngle = (currentAngle - startAngle) * 180 / Math.PI;

					return {
						scale: (after / before) || 1,
						deltaAngle: deltaAngle
					}

				},

				onDown: function (e) {

					var device = this,
						events = device.getEvents(e),
						startEventXY = device.getAverageXY(events.events),
						attr = device.attr,
						pointData = {
							x: attr._pointDataX,
							y: attr._pointDataY,
							scale: attr._pointDataScale
						};

					// set start events position
					// device.attr._startDownEventXY = startEventXY;

					// set start point position
					// device.attr._startPointData = pointData;
					attr._currentPointData.x = pointData.x;
					attr._currentPointData.y = pointData.y;

					// device.clearLogMoving();
					attr._logMoving.fill(0);

					// device.logMoving(startEventXY);
					attr._logMoving.push({
						x: startEventXY.x,
						y: startEventXY.y
						// ts: ts
					});

					device.logDown(events);

					attr._actionIsActive = true;

					// detect start zooming
					if (events.length === 2) {
						attr._pinchIsActive = true;
						attr._pinchStartEvents = events.events;
					} else {
						attr._pinchIsActive = false;
					}

					device.mediator.publish(deviceKeys.DOWN, startEventXY);
					// device.mediator.publish(deviceKeys.DOWNS, events.events);

				},

				onMove: function (e) {

					if (!this.attr._actionIsActive) {
						return false;
					}

					var device = this,
						attr = device.attr,
						events = device.getEvents(e),
						currentEventXY = device.getAverageXY(events.events),
						currentPointData = attr._currentPointData,
						lastEventXY = attr._logMoving.getLast(),
						pinchData,
						x,
						y,
						dx,
						dy,
						scale;

					dx = currentEventXY.x - lastEventXY.x;
					x = currentPointData.x + dx;

					dy = currentEventXY.y - lastEventXY.y;
					y = currentPointData.y + dy;

					currentPointData.x = x;
					currentPointData.y = y;

					if (attr._pinchIsActive) { // zooming
						pinchData = device.getPinchData(events.events);
						scale = pinchData.scale;
						attr._pointDataX = x * scale;
						attr._pointDataY = y * scale;
						attr._pointDataScale = scale;
					} else { // just moving
						attr._pointDataX = x;
						attr._pointDataY = y;
					}

					device.mediator.publish(deviceKeys.MOVE, {
						x: currentEventXY.x,
						y: currentEventXY.y,
						dx: dx,
						dy: dy
					});

					// device.mediator.publish(deviceKeys.MOVES, events.events);

					attr._logMoving.push({
						x: currentEventXY.x,
						y: currentEventXY.y
						// ts: Date.now()
					});

				},

				onUp: function (e) {

					var device = this,
						attr = device.attr,
						events = device.getEvents(e),
						eventsArr = events.events,
						eventsArrLength = eventsArr.length,
						isTouch = attr.isTouch,
						pinchIsActive = attr._pinchIsActive;

					// try to detect double click
					// and auto trigger event


					device.mediator.publish(deviceKeys.UP);
					// if (eventsArrLength) {
						// device.mediator.publish(deviceKeys.UP, device.getAverageXY(eventsArr));
						// device.mediator.publish(deviceKeys.UPS, eventsArr);
					// } else {
						// device.mediator.publish(deviceKeys.UP, null);
						// device.mediator.publish(deviceKeys.UPS, null);
					// }

					if (!eventsArrLength && isTouch && pinchIsActive) { // 2 fingers -> 0 finger
						attr._pinchIsActive = false;
						attr._actionIsActive = false;
						device.checkDblTap();
						return;
					}

					if (!eventsArrLength || !isTouch) { // if is not touch device - stop moving
						attr._actionIsActive = false;
						device.checkDblTap();
						attr._logMoving.fill(0);
						return;
					}

					if (eventsArrLength === 1 && isTouch) { // 2 fingers -> 1 finger
						attr._pinchIsActive = false;
						device.onDown(e);
					}

				},

				checkDblTap: function () {

					var device = this,
						downLog = device.attr._logDown,
						lastDown = downLog.getLast(),
						preLastDown = downLog.getLastBy(1);

					if (!preLastDown) {
						return;
					}

					// timer check
					if ((lastDown.ts - preLastDown.ts) > 300) {
						return;
					}

					// coordinates check
					if (Math.abs(lastDown.x - preLastDown.x) > 25 || Math.abs(lastDown.y - preLastDown.y) > 25) {
						return;
					}

					device.mediator.publish(deviceKeys.DBL_TAP, lastDown);

				},

				onResize: function () {

					var device = this,
						attr = device.attr,
						width = docElem.clientWidth,
						height = docElem.clientHeight,
						orientation = width > height ? '-' : '|',
						spaceSize = width * height;

					attr.width = width;
					attr.height = height;
					attr.orientation = orientation;
					attr.viewPortSize = spaceSize;

					device.mediator.publish(deviceKeys.RESIZE, {
						width: width,
						height: height,
						orientation: orientation
					});

				},

				getCoordinatesOfPoint: function (point) {

					var coordinates = {
						x: 0,
						y: 0
					};

					switch (point) {
						case 2 :
							coordinates.x = this.attr.width / 2;
							break;
						case 3 :
							coordinates.x = this.attr.width;
							break;
						case 4 :
							coordinates.y = this.attr.height / 2;
							break;
						case 5 :
							coordinates.x = this.attr.width / 2;
							coordinates.y = this.attr.height / 2;
							break;
						case 6 :
							coordinates.x = this.attr.width;
							coordinates.y = this.attr.height / 2;
							break;
						case 7 :
							coordinates.y = this.attr.height;
							break;
						case 8 :
							coordinates.x = this.attr.width / 2;
							coordinates.y = this.attr.height;
							break;
						case 9 :
							coordinates.x = this.attr.width;
							coordinates.y = this.attr.height;
							break;
					}

					return coordinates;

				}

			};

		return device;

	}
);
