var authServices = { };

$require('fs').readdirSync(__dirname + '/services')
    .filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js');
	}).forEach(function(filename) {
		var servicename = filename.slice(0, -3).split('-').join(''); // google-plus.js -> GooglePlus
		authServices[servicename] = $require(__dirname + '/services/' + filename);
	});

module.exports = function(servicename, userId, accessToken) {
	var deffered = Q.defer();

	servicename =  (servicename || '').toLowerCase();

	if(authServices.hasOwnProperty(servicename)) {
		authServices[servicename](userId, accessToken, deffered);
	} else {
		deffered.reject(false);
	}

	return deffered.promise;
};

module.exports.services = Object.keys(authServices);