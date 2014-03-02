var Errors = $require('/modules/errors'),
	_ = $require('/libs/underscore'),
	moment = $require('moment');

var cookieName = 'auth';

var authServices = { },
	DB;

var permitted = (process.env.NODE_ENV === 'production') ? [ 'test.js' ] : [ ]; // test auth service only for development and tests
$require('fs').readdirSync(__dirname + '/services')
    .filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js') && (permitted.indexOf(filename) === -1);
	}).forEach(function(filename) {
		var servicename = filename.slice(0, -3).split('-').join(''); // google-plus.js -> GooglePlus
		authServices[servicename] = $require(__dirname + '/services/' + filename);
	});


function _getAuthData(req) {
    var data = {
            serviceName: undefined,
            userId: undefined,
            accessToken: undefined
        };
    
    if(req.cookies && req.cookies[cookieName]) {
        var cookie = req.cookies[cookieName];

        try {
        	cookie = JSON.parse(req.cookies[cookieName]);
        } catch(e) {
        	// cookie is Object sometime o_O
        }
        
        data.serviceName = cookie.serviceName;
        data.userId = cookie.userId;
        data.accessToken = cookie.accessToken;
    } else {
        data.serviceName = req.body.authService;
        data.userId = req.body.userId;
        data.accessToken = req.body.accessToken;

        delete req.body.authService;
        delete req.body.userId;
        delete req.body.accessToken;
    }
    
    return data;
}


function _setAuthData(req, res, authData) {
	var currentCookie = req.cookies[cookieName];

	if(currentCookie) {
		currentCookie = JSON.parse(currentCookie);
		extend(currentCookie, authData);

		res.cookie(cookieName, JSON.stringify(currentCookie));
	} else {
		// somehow extending res body with authData
	}
}


function _authorize(serviceName, serviceId, accessToken) {
	serviceName = (serviceName || '').toLowerCase();

	if(authServices.hasOwnProperty(serviceName)) {
		var authData;
		return DB.AuthData.find({ // try find ACT for serviceName-serviceId pair in local database
			where: {
				service: serviceName,
				serviceId: serviceId,
				deletedAt: null
			}
		}).then(function(storedAuthData) {
			if(storedAuthData && (storedAuthData.tokenExpires.getTime() > Date.now())) { // stored ACT is still valid
				authData = _.restrict(storedAuthData, [ 'service', 'serviceId', 'accessToken' ]);
				extend(authData, {
					storedId: storedAuthData.id,
					tokenExpires: moment(storedAuthData.tokenExpires).toISOString()
				});

				return true;
			} else { // request new ACT
				return authServices[serviceName](serviceId, accessToken)
				.then(function(_authData) {
					authData = _authData;

					if(authData.accessToken && authData.accessToken.length) {
						// for sure mark expiration date ten seconds earlier than it really is
						authData.expirationDate = moment((authData.expires - 10) * 1000 + Date.now()).toISOString();

						if(storedAuthData) { // ACT entities are created by user create service
							authData.storedId = storedAuthData.id;

							extend(storedAuthData, { // update stored ACT
								accessToken: authData.accessToken,
								tokenExpires: authData.expirationDate
							});

							return storedAuthData.save([ 'accessToken', 'tokenExpires' ]);
						} else {
							return true;
						}
					} else {
						throw new Errors.Authentication('INVALID_ACCESSTOKEN');
					}
				});
			}
		}).then(function() {
			return {
				storedId: authData.storedId,
				service: serviceName, 
				serviceId: serviceId,
				accessToken: authData.accessToken,
				tokenExpires: authData.expirationDate
			};
		});
	} else {
		var deferred = Q.defer();

		deferred.reject(new Errors.Authentication('UNKNOWN_SERVICE'));

		return deferred.promise;
	}
}


function middleware(req, res, next) {
	var authData = _getAuthData(req);

	res.locals.authData = { };

	_authorize(authData.serviceName, authData.userId, authData.accessToken)
	.then(function(authData) {
		_setAuthData(req, res, authData);

		extend(res.locals.authData, authData);

		next();
	}, function(err) {
		next(err instanceof Errors.Generic ? err : new Errors.Authentication());
	});
}


module.exports = function(app) {
	DB = app.get('db');

	return {
			middleware: middleware
		};
};

module.exports.services = Object.keys(authServices);