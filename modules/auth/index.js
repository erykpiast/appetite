var _ = $require('/libs/underscore');

$require('fs').readdirSync(__dirname)
	.filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js');
	}).forEach(function(filename) {
		var servicename = _.capitalize(_.camelize(filename)).slice(0, -3); // google-plus.js -> GooglePlus
		module.exports[servicename] = $require(__dirname + '/' + filename);
	});