var extend = $require('extend'),
	restUrl = $require('config').restUrl;

module.exports = function(app) {
	var rest = app.get('rest').Comment;

	app
		.post(restUrl + '/comment', function(req, res) {
			rest.create(res.locals.authData, req.body).then(
				function(comment) {
					if(!comment.existed) {
						res.status(201);
					}

					res.json(comment.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/comment/:id', function(req, res) {
			rest.retrieve(req.params, res.locals.authData).then(
				function(comment) {
					res.json(comment.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.put(restUrl + '/comment/:id', function(req, res) {
			rest.update({ id: req.params.id }, res.locals.authData, req.body).then(
				function(comment) {
					res.json(comment.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.delete(restUrl + '/comment/:id', function(req, res) {
			rest.destroy({ id: req.params.id }, res.locals.authData).then(
				function(comment) {
					res.json(comment.resource);
				},
				function(err) {
					res
						.status(err.httpStatus)
						.json({
							msg: err.message
						});
				});
		})
		.get(restUrl + '/offer/:offerId/comments', function(req, res) {
			rest.retrieveAllForOffer(extend({ }, req.params, req.query), res.locals.authData).then(
				function(comment) {
					res.json(comment.resource);
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