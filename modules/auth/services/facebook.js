var Math = $require('mathjs'),
    config = $require('config').auth.facebook;


function _connect() {

}


function auth(accessToken) {

	return Math.floor(Math.random(100000, 1000000));
}

module.exports = auth;