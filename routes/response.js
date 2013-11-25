var extend = $require('extend'),
	getAuthData = $require(__dirname + '/get-auth-data'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').Response;

	app
		.post(restUrl + '/response', function(req, res) {
			rest.create(res.locals.authData, req.body).then(
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
		.get(restUrl + '/response/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }, res.locals.authData).then(
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
		.put(restUrl + '/response/:id', function(req, res) {
			rest.update({ id: req.params.id }, res.locals.authData, req.body).then(
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
		.delete(restUrl + '/response/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, res.locals.authData).then(
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