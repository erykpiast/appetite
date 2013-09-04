var keys = { };

function _restrict(allowedKeys, requireValue, o) {
	var r = { };

	allowedKeys.forEach(function(key) {
		if(o[key] !== undefined) {
			r[key] = o[key];
		} else if(!!requireValue) {
			r[key] = null;
		}
	})

	return r;
}


module.exports = function(keys, requireValue) {
	var exports = { };

	requireValue = Array.create(requireValue);

	for(var prop in keys) {
		if(keys.hasOwnProperty(prop)) {
			exports[prop] = _restrict.bind(null, Array.create(keys[prop]),
				(requireValue.indexOf(prop) !== -1));
		}
	}

	exports.array = _restrict;

	return exports;
}