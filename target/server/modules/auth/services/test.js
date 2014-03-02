var config = $require('config').auth.test;


function auth(serviceId, accessToken) {
    var deferred = Q.defer();

    deferred.resolve({
        accessToken: accessToken,
        expires: 365 * 24 * 60 * 60
    });

    return deferred.promise;
}

module.exports = auth;