var crypto = $require('crypto'),
    config = $require('config').auth.facebook,
    graph = $require('fbgraph');


function auth(userId, accessToken, deffered) {
    graph.setAccessToken(accessToken);
    graph.get('/oauth/access_token_info', {
        client_id: config.id
    }, function(err, res) {
        if(!err) {
            if(res['token_type'] === 'bearer') {
                graph.extendAccessToken({
                    client_id: config.id,
                    client_secret: config.secret
                }, function (err, res) {
                    if(!err) {
                        deffered.resolve(userId);
                    } else {
                        deffered.reject(err);               
                    }
                });
            } else if(res['expires_in'] >= 1) {
                deffered.resolve(userId);
            } else {
                deffered.reject(err);
            }
        } else {
            deffered.reject(err);
        }
    });
}

module.exports = auth;