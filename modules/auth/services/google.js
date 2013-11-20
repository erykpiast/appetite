var crypto = $require('crypto'),
    config = $require('config').auth.google;


function _connect() {

}


function auth(userId, accessToken, deffered) {
	
	deffered.resolve(userId);
}

module.exports = auth;