var extend = $require('extend'),
    getAuthData = $require('/modules/rest/get-auth-data'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').User;

	app
		.post(restUrl + '/user', function(req, res) {
			rest.create(req.body, getAuthData(req)).then(
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
			rest.retrieve({ id: req.params.id }, getAuthData(req)).then(
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
			var proto = extend({ id: req.params.id }, req.body),
			    authData = getAuthData(req);

			rest.update(proto, authData).then(
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
			rest.destroy({ id: req.params.id }, getAuthData(req)).then(
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