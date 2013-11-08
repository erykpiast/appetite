var crypto = $require('crypto');

var md5sum = crypto.createHash('md5');

module.exports = function(str) {
	md5sum.update(str);

	return md5sum.digest('hex');};