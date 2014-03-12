var restRoot = $require('config').restRoot;

module.exports = function(app) {
	var rest = app.get('rest').Tag;

	app
		.post(restRoot + '/tag', function(req, res) {
			rest.create(res.locals.authData, req.body).then(
				function(tag) {
					if(!tag.existed) {
						res.status(201);
					}

					res.json(tag.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restRoot + '/tag/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }, res.locals.authData).then(
				function(tag) {
					res.json(tag.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restRoot + '/tag', function(req, res) {
			rest.retrieveAll({ limit: req.query.limit, offset: req.query.offset }, res.locals.authData).then(
				function(tag) {
					res.json(tag.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restRoot + '/tag/:id', function(req, res) {
			rest.update({ id: req.params.id }, res.locals.authData, req.body).then(
				function(tag) {
					res.json(tag.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restRoot + '/tag/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, res.locals.authData).then(
				function(tag) {
					res.json(tag.resource);
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