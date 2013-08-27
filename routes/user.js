var restUrl = $require('config').restUrl,
	auth = $require('/modules/auth');

module.exports = function(app) {
	var rest = app.get('rest').User;

	app
		.post(restUrl + '/user', function(req, res) {
			rest.create(req.body).then(
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
			rest.retrieve({ id: req.params.id }).then(
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
			rest.update(req.body).then(
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

		});
};