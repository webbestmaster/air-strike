define(
	[
		'log'  // remove
	],
	function (
		log // remove
	) {

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

		function publish(channel) {

			var list = mediator.channels[channel] || [],
				item,
				i, len = arguments.length,
				args;

			log('publish -', channel, arguments); // remove

			if ( len === 1 ) {
				for (i = 0, len = list.length; i < len; i += 1) {
					item = list[i];
					item.callback.call(item.context);
				}
				return this;
			}

			if ( len === 2 ) {
				args = arguments[1];
				for (i = 0, len = list.length; i < len; i += 1) {
					item = list[i];
					item.callback.call(item.context, args);
				}
				return this;
			}

			args = [];
			for (i = 1; i < len; i += 1) {
				args[i - 1] = arguments[i];
			}

			for (i = 0, len = list.length; i < len; i += 1) {
				item = list[i];
				item.callback.apply(item.context, args);
			}

			return this;

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
