var extend = $require('extend'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').Offer;

	app
		.post(restUrl + '/offer', function(req, res) {
			rest.create(req.body).then(
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
		.get(restUrl + '/offer/:id', function(req, res) {
			rest.retrieve({ id: req.params.id }).then(
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
		.put(restUrl + '/offer/:id', function(req, res) {
			var proto = extend({ id: req.params.id }, req.body);

			rest.update(proto).then(
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
		.delete(restUrl + '/offer/:id', function(req, res) {
			var proto = extend({ id: req.params.id }, req.body);

			rest.destroy(proto).then(
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