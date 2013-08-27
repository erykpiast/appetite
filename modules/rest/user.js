var Faker = $require('Faker'),
	Q = $require('q'),
	auth = $require('/modules/auth');

var User,
	Errors,
	publicKeys = [ 'service', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ];

function _publish(user) {
	var pub = { };

	publicKeys.forEach(function(key) {
		pub[key] = user[key];
	})

	return pub;
}


function create(proto) {
	var deffered = Q.defer(),
		find = {
			'service' : proto.service,
			'serviceId' : proto.serviceId
		};

	if(auth(proto.service, proto.serviceId)) {
		User.find({ where: find }).success(function(user) {
				if(!user) {
					User.create(proto).success(function(user) {
							deffered.resolve(_publish(user));
						}).fail(function() {
							deffered.reject(new Errors.Database());
						});
				}

			}).fail(function() {
				deffered.reject(new Errors.Database());
			});
	} else {
		deffered.reject(new Errors.Authentication());
	}

	return deffered.promise;
}


function read(proto) {
    var deffered = Q.defer();

    User.find({ where: proto })
		.success(function(user) {
            if(!!user) {
			    deffered.resolve(_publish(user));
            } else {
                deffered.reject(new Errors.NotFound());
            }
		})
		.fail(function() {
			deffered.reject(new Errors.Database());
		});

    return deffered.promise;
}


function update() {

}


function del() {

}


module.exports = function(app) {
	User = app.get('db').User;
	Errors = app.get('rest').Errors;

	return {
		create: create,
		read: read,
		update: update,
		delete: del
	}
};