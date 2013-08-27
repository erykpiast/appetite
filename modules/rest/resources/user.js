var Faker = $require('Faker'), Q = $require('q'), extend = $require('extend'),
	auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'service', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
		create: [ 'service', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
		createSearch: [ 'service', 'serviceId' ],
		update: [ 'firstName', 'lastName', 'gender', 'site' ],
		search: 'id'
	});

var User;

function create(proto) {
	var deffered = Q.defer();

	if(auth(proto.service, proto.serviceId)) {
		var search = restrict.createSearch(proto)
			proto = restrict.create(proto);

		User.find({ where: search }).success(function(user) {
				if(!user) {
					User.create(proto).success(function(user) {
							deffered.resolve({
								resource: restrict.public(user)
							});
						}).fail(function() {
							deffered.reject(new Errors.Database());
						});
				} else {
					deffered.resolve({
							resource: restrict.public(user),
							existed: true
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


function retrieve(proto) {
	var deffered = Q.defer();

	var search = restrict.search(proto);

	console.log(search);

	User.find({ where: search })
		.success(function(user) {
			if(!!user) {
				deffered.resolve({
						resource: restrict.public(user)
					});
			} else {
				deffered.reject(new Errors.NotFound());
			}
		})
		.fail(function() {
			deffered.reject(new Errors.Database());
		});

	return deffered.promise;
}


function update(proto) {
	var deffered = Q.defer();

	if(auth(proto.service, proto.serviceId)) {
		var search = restrict.search(proto),
			proto = restrict.update(proto);

		User.update(proto, search)
			.success(function(user) {
				deffered.resolve({
						resource: restrict.public(user)
					});
			})
			.fail(function() {
				deffered.reject(new Errors.Database());
			});
	} else {
		deffered.reject(new Errors.Authentication());
	}

	return deffered.promise;
}


function destroy(proto) {
	var deffered = Q.defer();

	if(auth(proto.service, proto.serviceId)) {
		var search = restric.search(proto);

		User.destroy(search)
			.success(function(user) {
				if(!!user) {
					deffered.resolve({
							resource: restrict.public(user)
						});
				} else {
					deffered.reject(new Errors.NotFound());
				}
			})
			.fail(function() {
				deffered.reject(new Errors.Database());
			});
	} else {
		deffered.reject(new Errors.Authentication());
	}
}


module.exports = function(app) {
	User = app.get('db').User;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};