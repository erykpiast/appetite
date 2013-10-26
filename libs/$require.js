var _require = require;

module.exports = function(rootPath) {
	var _r = function(resource) {
		if((resource !== null) && (resource !== undefined)) {
			resource = resource.toString();

			if(resource[0] === '/') {
				if(resource.indexOf(rootPath) !== 0) {
					resource = rootPath + resource;
				}
			}
		}

		return _require(resource);
	};

	for (var prop in _require) {
		if(_require.hasOwnProperty(prop)) {
			_r[prop] = _require[prop];
		}
	}

	return _r;
};