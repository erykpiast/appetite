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
                return { resource: restrict.public(user.values), existed: true };
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                throw new Errors.Database();
            } else {
                throw err;
            }
        }
    ).then(
        function(user) {
            if(user) {
                return { resource: restrict.public(user.values) };
            } else {
                return user;
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                return new Errors.Database();
            } else {
                throw err;
            }
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
    var serviceId;
    
    return auth(proto.authService, proto.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return User.find({ where: restrict.search(proto) });
            } else {
                throw new Errors.Authentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                return new Errors.Authentication();
            } else {
                throw err;
            }
        }
    ).then(
        function(user) {
            if(!user) {
                throw new Errors.NotFound();
            } else if(serviceId === user.serviceId) {
                var newAttrs = restrict.update(proto);
                
                extend(user, newAttrs);
                
                return user.save(Object.keys(newAttrs));
            } else {
                return new Errors.Authentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                return new Errors.Database();
            } else {
                throw err;
            }
        }
    ).then(
        function(user) {
            return { resource: restrict.public(user.values) };
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                throw new Errors.Database();
            } else {
                throw err;
            }
        }
    );
}


function destroy(proto) {
    var user, serviceId;
    
    return auth(proto.authService, proto.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return User.find({ where: restrict.search(proto) });
            } else {
                throw new Errors.Authentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                return new Errors.Authentication();
            } else {
                throw err;
            }
        }
    ).then(
        function(_user) {
            user = _user;
            
            if(!user) {
                throw new Errors.NotFound();
            } else if(serviceId === user.serviceId) {
                return user.destroy();
            } else {
                return new Errors.Authentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                return new Errors.Database();
            } else {
                throw err;
            }
        }
    ).then(
        function(user) {
            return { resource: restrict.public(user.values) };
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                throw new Errors.Database();
            } else {
                throw err;
            }
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