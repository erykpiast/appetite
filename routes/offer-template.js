var extend = $require('extend'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').OfferTemplate;

	app
		.post(restUrl + '/offer-template', function(req, res) {
			rest.create(req.body).then(
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
			rest.retrieve({ id: req.params.id }).then(
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
			var proto = extend({ id: req.params.id }, req.body);

			rest.update(proto).then(
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
			var proto = extend({ id: req.params.id }, req.body);

			rest.destroy(proto).then(
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