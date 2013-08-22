var restUrl = $require('config').restUrl,
	auth = $require('/modules/auth');

module.exports = function(app) {
	var User = app.get('db').User;

	app
		.post(restUrl + '/user', function(req, res) {
			var proto = {
					'service': req.body['service'],
					'serviceId': req.body['id']
				};

			if(auth[proto.service](proto.serviceId)) {
				res.json(proto);
			} else {
				res.status(404).json({
					msg: 'User authentication failed!'
				});
			}
		})
		.get(restUrl + '/user/:id', function(req, res) {
			res.json({
				id: req.param('id')
			});
		})
		.put(restUrl + '/user/:id', function(req, res) {
			
		})
		.delete(restUrl + '/user/:id', function(req, res) {
			
		});
};