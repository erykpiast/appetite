var extend = $require('extend'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').User;

	app
		.post(restUrl + '/user', function(req, res) {
			rest.create(res.locals.authData, req.body).then(
				function(user) {
					if(!user.existed) {
						res.status(201);
					}

					res.json(user.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/user/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }, res.locals.authData).then(
				function(user) {
					res.json(user.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restUrl + '/user/:id', function(req, res) {
			rest.update({ id: req.params.id }, res.locals.authData, req.body).then(
				function(user) {
					res.json(user.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restUrl + '/user/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, res.locals.authData).then(
				function(user) {
					res.json(user.resource);
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