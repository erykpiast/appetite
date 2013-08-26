$require('/libs/std'); // Array helpers

var keys = { };

function _restrict(allowedKeys, o) {
	var r = { };

	allowedKeys.forEach(function(key) {
		r[key] = o[key];
	})

	return r;
}


module.exports = function(keys) {
	var exports = { };

	for(var prop in keys) {
		if(keys.hasOwnProperty(prop)) {
			exports[prop] = _restrict.bind(null, Array.create(keys[prop]));
		}
	}

	exports.array = _restrict;

	return exports;
}