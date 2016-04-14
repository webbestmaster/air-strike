window.requireAsset = {

	attr: {},

	set: function (id, obj) {
		return this.attr[id] = obj;
	},

	get: function (id) {
		return this.attr[id];
	}

};