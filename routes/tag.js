var restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').Tag;

	app
		.post(restUrl + '/tag', function(req, res) {
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
		.get(restUrl + '/tag/:id', function(req, res) {
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
		.get(restUrl + '/tag', function(req, res) {
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
		.put(restUrl + '/tag/:id', function(req, res) {
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
		.delete(restUrl + '/tag/:id', function(req, res) {
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