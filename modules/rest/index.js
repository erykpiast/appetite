module.exports = function(app) {
	var exports = { };

	$require('fs').readdir(__dirname + '/resources', function(err, files) {
		files.filter(function(filename) { // all files except index.js
			return (/.js$/).test(filename) && (filename !== 'index.js');
		}).forEach(function(filename) {
			var restname = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request.js -> ActualRequest
			exports[restname] = $require(__dirname + '/resources/' + filename)(app);
		});
	});

	return exports;
};