var crypto = $require('crypto'),
    config = $require('config').auth.facebook;


function _connect() {

}


function auth(userId, accessToken, deffered) {
	
	deffered.resolve(userId);
}

module.exports = auth;