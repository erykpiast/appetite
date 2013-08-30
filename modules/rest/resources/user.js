var Q = $require('q'),
	auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'authService', 'firstName', 'lastName', 'gender', 'site' ],
		create: [ 'authService', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
		createSearch: [ 'authService', 'serviceId' ],
		update: [ 'firstName', 'lastName', 'gender', 'site' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var User;

function create(proto) {
	var deffered = Q.defer();
	
	auth(proto.authService, proto.accessToken).then(
		function(serviceId) {
			proto.serviceId = serviceId;

			var search = restrict.createSearch(proto)
				proto = restrict.create(proto);

			User.find({ where: search }).then(
				function(user) {
					if(!user) {
                        console.log(proto);
						User.create(proto).then(
							function(user) {
								deffered.resolve({
										resource: restrict.public(user.values)
									}
								);
							},
							function() {
								deffered.reject(new Errors.Database());
							}
						);
					} else {
						deffered.resolve({
								resource: restrict.public(user),
								existed: true
							}
						);
					}
				},
				function() {
					deffered.reject(new Errors.Database());
				}
			);
		},
		function(err) {
			deffered.reject(new Errors.Authentication());
		}
	);

	return deffered.promise;
}


function retrieve(proto) {
	var deffered = Q.defer();

	var search = restrict.search(proto);

	User.find({ where: search }).then(
		function(user) {
			if(!!user) {
				deffered.resolve({
						resource: restrict.public(user)
					}
				);
			} else {
				deffered.reject(new Errors.NotFound());
			}
		},
		function() {
			deffered.reject(new Errors.Database());
		}
	);

	return deffered.promise;
}


function update(proto) {
	var deffered = Q.defer();

	var search = restrict.search(proto);

	User.find({ where: search }).then(
		function(user) {
			if(!!user) {
				auth(proto.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === user.serviceId)) {
							proto = restrict.update(proto);
			
							user.updateAttributes(proto).then(
								function() {
									deffered.resolve({
											resource: restrict.public(user)
										}
									);
								},
								function() {
									deffered.reject(new Errors.Database());
								}
							);

						} else {
							deffered.reject(new Errors.Authentication());	
						}
					},
					function(err) {
						deffered.reject(new Errors.Authentication());
					}
				);
			} else {
				deffered.reject(new Errors.NotFound());
			}
		},
		function() {
			deffered.reject(new Errors.Database());
		}
	);

	return deffered.promise;
}


function destroy(proto) {
	var deffered = Q.defer();

	var search = restrict.search(proto);

	User.find({ where: search }).then(
		function(user) {
			if(!!user) {
				auth(user.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === user.serviceId)) {
							user.destroy().then(
								function() {
									deffered.resolve({
											resource: restrict.public(user)
										}
									);
								},
								function() {
									deffered.reject(new Errors.Database());
								}
							);
						} else {
							deffered.reject(new Errors.Authentication());	
						}
					},
					function(err) {
						deffered.reject(new Errors.Authentication());
					}
				);
			} else {
				deffered.reject(new Errors.NotFound());
			}
		},
		function() {
			deffered.reject(new Errors.Database());
		}
	);

	return deffered.promise;
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