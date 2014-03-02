var config = $require('config').auth.facebook,
    graph = $require('fbgraph');


function auth(serviceId, accessToken) {
    var deferred = Q.defer();

    graph.setAccessToken(accessToken);
    graph.get('/oauth/access_token_info', {
        client_id: config.id
    }, function(err, res) {
        if(!err) {
            if(res['token_type'] === 'bearer') {
                graph.extendAccessToken({
                    access_token: res['access_token'],
                    client_id: config.id,
                    client_secret: config.secret
                }, function(err, res) {
                    if(!err) {
                        deferred.resolve(res);
                    } else {
                        deffered.reject(err);               
                    }
                });
            } else {
                deferred.resolve(res);
            }
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise.then(function(res) {
        return {
            accessToken: res['access_token'],
            expires: parseInt0(res['expires_in'] || res['expires']) // seconds to expire
        };
    });
}

module.exports = auth;