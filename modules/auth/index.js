var _ = $require('/libs/underscore'),
	authServices = { };

$require('fs').readdirSync(__dirname + '/services')
    .filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js');
	}).forEach(function(filename) {
		var servicename = _.capitalize(_.camelize(filename)).slice(0, -3); // google-plus.js -> GooglePlus
		authServices[servicename] = $require(__dirname + '/services/' + filename);
	});

module.exports = function(servicename, id) {
	servicename = _.capitalize(servicename);

	if(authServices.hasOwnProperty(servicename)) {
		return authServices[servicename](id);
	} else {
		return false;
	}
};

module.exports.services = Object.keys(authServices);