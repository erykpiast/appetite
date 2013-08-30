var crypto = $require('crypto'),
    config = $require('config').auth.facebook;


function _connect() {

}


function auth(accessToken, deffered) {
	
	deffered.resolve(accessToken);
}

module.exports = auth;