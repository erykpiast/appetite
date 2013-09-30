var extend = $require('extend'),
	getAuthData = $require(__dirname + '/get-auth-data'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').OfferTemplate;

	app
		.post(restUrl + '/offer-template', function(req, res) {
			rest.create(getAuthData(req), req.body).then(
				function(template) {
					if(!template.existed) {
						res.status(201);
					}

					res.json(template.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/offer-template/:id', function(req, res) {
			rest.retrieve(req.params, getAuthData(req)).then(
				function(template) {
					res.json(template.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restUrl + '/offer-template/:id', function(req, res) {
			rest.update({ id: req.params.id }, getAuthData(req), req.body).then(
				function(template) {
					res.json(template.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restUrl + '/offer-template/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, getAuthData(req)).then(
				function(template) {
					res.json(template.resource);
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