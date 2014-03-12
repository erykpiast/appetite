var restRoot = $require('config').restRoot;

module.exports = function(app) {
	var rest = app.get('rest').User;

	app
		.post(restRoot + '/user', function(req, res) {
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
		.get(restRoot + '/user/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }, res.locals.authData).then(
				function(user) {
					res.header('Access-Control-Allow-Origin', '*');
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
		.put(restRoot + '/user/:id', function(req, res) {
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
		.delete(restRoot + '/user/:id', function(req, res) {
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