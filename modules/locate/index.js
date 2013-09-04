module.exports = function(id) {
	var deffered = Q.defer();

	setTimeout(function() {
		deffered.resolve({
			name: id
		});
	}, 0);

	return deffered.promise;
};