module.exports = function(id) {
	var deffered = Q.defer();

	setTimeout(function() {
		deffered.resolve({
		    id: id,
			name: 'place' + id
		});
	}, 0);

	return deffered.promise;
};