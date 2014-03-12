var restRoot = $require('config').restRoot;

module.exports = function(app) {
	var rest = app.get('rest').Response;

	app
		.post(restRoot + '/response', function(req, res) {
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
		.get(restRoot + '/response/:id', function(req, res) {
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
		.put(restRoot + '/response/:id', function(req, res) {
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
		.delete(restRoot + '/response/:id', function(req, res) {
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