/*global define */
define(
	[
//		'log'  // remove
	],
	function (
//		log // remove
	) {

		"use strict";

		var mediator;

		function subscribe(channel, fn) {

			var channels = mediator.channels,
				neededChanel = channels[channel];

			if (neededChanel) {
				neededChanel[neededChanel.length] = {context: this, callback: fn};
				return this;
			}

			channels[channel] = [{context: this, callback: fn}];
			return this;

		}

		function publish(channel, command, options) {

			var list = mediator.channels[channel] || [],
				item,
				i,
				len;

			// log('publish -', channel, arguments); // remove
			// log('publish -', channel); // remove

			for (i = 0, len = list.length; i < len; i += 1) {
				item = list[i];
				item.callback.call(item.context, command, options);
			}

		}

		function filter(item) {
			return item.context !== this;
		}

		function unsubscribe(channel) {

			var channels = mediator.channels,
				ch;

			if (!channel) {

				for (ch in channels) {
					if (channels.hasOwnProperty(ch)) {
						this.unsubscribe(ch);
					}
				}

				return this;

			}

			if (!channels[channel]) {
				return this;
			}

			channels[channel] = channels[channel].filter(filter, this);

			return this;

		}

		mediator = {
			channels: {},
			publish: publish,
			subscribe: subscribe,
			unsubscribe: unsubscribe,
			installTo: function (obj) {
				obj.subscribe = subscribe;
				obj.publish = publish;
				obj.unsubscribe = unsubscribe;
			},
			uninstallFrom: function (obj) {
				obj.subscribe = null;
				delete obj.subscribe;
				obj.publish = null;
				delete obj.publish;
				obj.unsubscribe = null;
				delete obj.unsubscribe;
			}
		};

		return mediator;

	}
);
