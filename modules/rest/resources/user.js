var auth = $require('/modules/auth'),
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
	return auth(proto.authService, proto.accessToken).then(
		function(serviceId) {
			proto.serviceId = serviceId;
			
			return User.find({ where: restrict.createSearch(proto) });
		},
		function(err) {
			throw new Errors.Authentication();
		}
	).then(
	    function(user) {
    		if(!user) {
    		    proto = restrict.create(proto);
    		    
    		    return User.create(proto, Object.keys(proto));
    		} else {
    		    return { resource: restrict.public(user), existed: true };
    		}
	    },
	    function(err) {
    		throw new Errors.Database();
    	}
    ).then(
		function(user) {
			return { resource: restrict.public(user.values) };
		},
		function(err) {
			return new Errors.Database();
		}
	);
}


function retrieve(proto) {
	var search = restrict.search(proto);

	return User.find({ where: search }).then(
		function(user) {
			if(!user) {
				throw new Errors.NotFound();
			} else {
			    return { resource: restrict.public(user) };
			}
		},
		function(err) {
		    throw new Errors.Database();
		}
	);
}


function update(proto) {
	return User.find({ where: restrict.search(proto) }).then(
		function(user) {
			if(!!user) {
			    return auth(proto.authService, proto.accessToken)
			} else {
				throw new Errors.NotFound();   
			}
		},
		function(err) {
			return new Errors.Database();
		}
	).then(
		function(serviceId) {
			if(serviceId && (serviceId === user.serviceId)) {
				return user.updateAttributes(restrict.update(proto)).then(
					function(user) {
						return { resource: restrict.public(user.values) };
					},
					function(err) {
						throw new Errors.Database();
					}
				);	
			} else {
			     throw new Errors.Authentication();
			}
		},
		function(err) {
			return new Errors.Authentication();
		}
	);
}


function destroy(proto) {
	return User.find({ where: restrict.search(proto) }).then(
		function(user) {
			if(!!user) {
				return auth(user.authService, proto.accessToken);
			} else {
				throw new Errors.NotFound();
			}
		},
		function() {
		    throw new Errors.Database();
		}
	).then(
		function(serviceId) {
			if(serviceId && (serviceId === user.serviceId)) {
				return user.destroy();
		    } else {
		        throw new Errors.Authentication();    
		    }
		},
		function(err) {
			throw new Errors.Authentication();
		}
    ).then(
		function(user) {
			return { resource: restrict.public(user) };
		},
		function(err) {
			throw new Errors.Database();
		}
	);
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