var crypto = $require('crypto'),
    config = $require('config').auth.google;


function _connect() {

}


function auth(accessToken, deffered) {
	
	deffered.resolve(crypto.createHash('md5').update(accessToken).digest('hex'));
}

module.exports = auth;