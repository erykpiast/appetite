var _ = $require('/libs/underscore');

module.exports = function(app) {
	var exports = { };

	$require('fs').readdir(__dirname + '/', function(err, files) {
		files.filter(function(filename){
			return (/.js$/).test(filename) && (filename !== 'index.js');
		})
		.forEach(function(filename) {
			var routename = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request.js -> ActualRequest

			exports[routename] = $require(__dirname + '/' + filename)(app);
		});
	});

	return exports;
};