var extend = $require('extend'),
	getAuthData = $require(__dirname + '/get-auth-data'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').UserRating;

	app
		.post(restUrl + '/user/:userId/rating', function(req, res) {
			rest.create(getAuthData(req), extend({ }, req.params, req.body)).then(
				function(userRating) {
					if(!userRating.existed) {
						res.status(201);
					}

					res.json(userRating.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/user/:userId/rating', function(req, res) {
			rest.countAllForUser(extend({ }, req.params, req.query), getAuthData(req)).then(
				function(userRating) {
					res.json(userRating.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/user-rating/:id', function(req, res) {
			rest.retrieve(req.params, getAuthData(req)).then(
				function(userRating) {
					res.json(userRating.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restUrl + '/user-rating/:id', function(req, res) {
			rest.update({ id: req.params.id }, getAuthData(req), req.body).then(
				function(userRating) {
					res.json(userRating.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restUrl + '/user-rating/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, getAuthData(req)).then(
				function(userRating) {
					res.json(userRating.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		});
};