var extend = $require('extend'),
	getAuthData = $require(__dirname + '/get-auth-data'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').Offer;

	app
		.post(restUrl + '/offer', function(req, res) {
			rest.create(getAuthData(req), req.body).then(
				function(offer) {
					if(!offer.existed) {
						res.status(201);
					}

					res.json(offer.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/offer/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }, getAuthData(req)).then(
				function(offer) {
					res.json(offer.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/offer', function(req, res) {
			rest.retrieveAll({ limit: req.query.limit, offset: req.query.offset }, getAuthData(req)).then(
				function(offer) {
					res.json(offer.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restUrl + '/offer/:id', function(req, res) {
			rest.update({ id: req.params.id }, getAuthData(req), req.body).then(
				function(offer) {
					res.json(offer.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restUrl + '/offer/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, getAuthData(req)).then(
				function(offer) {
					res.json(offer.resource);
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