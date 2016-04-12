var requireAsset = {

	attr: {},

	set: function (id, obj) {
		return this.attr[id] = obj;
	},

	get: function (id) {
		return this.attr[id];
	}

};

window.requireAsset = requireAsset;

export default requireAsset;
