var Faker = $require('Faker'),
	restUrl = $require('config').restUrl,
	auth = $require('/modules/auth');

var publicKeys = [ 'service', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ];

function _publish(user) {
	var pub = { };

	publicKeys.forEach(function(key) {
		pub[key] = user[key];
	})

	return pub;
}


module.exports = function(app) {
	var User = app.get('db').User;

	app
		.post(restUrl + '/user', function(req, res) {
			var proto = { };

			publicKeys.forEach(function(key) {
				proto[key] = req.body[key];
			})

			if(auth(proto.service, proto.serviceId)) {
				User.findOrCreate(proto).success(function(user) {
					res.json(_publish(user));
				}).fail(function() {
					res.status(500).json({
						msg: 'User creation failed!'
					});
				});
			} else {
				res.status(401).json({
					msg: 'User authentication failed!'
				});
			}
		})
		.get(restUrl + '/user/:id', function(req, res) {
			var proto = {
					id: req.params['id']
				};

			User.find({ where: proto }).success(function(user) {
					res.json(_publish(user));
				}).fail(function() {
					res.status(404).json({
						msg: 'User with id ' + id + ' not found!'
					});
				});
		})
		.put(restUrl + '/user/:id', function(req, res) {

		})
		.delete(restUrl + '/user/:id', function(req, res) {

		});
};