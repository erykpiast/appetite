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

function create(authData, proto) {
    return auth(authData.service, authData.accessToken).then(
        function(serviceId) {
            proto.authService = authData.service;
            proto.serviceId = serviceId;

            return User.find({ where: restrict.createSearch(proto) });
        },
        function(err) {
            throw new Errors.authDataentication();
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
                throw new Errors.Database();
            } else {
                throw err;
            }
        }
    );
}


function retrieve(params, authData) {
    return User.find({ where: restrict.search(params) }).then(
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


function update(params, authData, proto) {
    var serviceId;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return User.find({ where: restrict.search(params) });
            } else {
                throw new Errors.authDataentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                throw new Errors.authDataentication();
            } else {
                throw err;
            }
        }
    ).then(
        function(user) {
            if(!user) {
                throw new Errors.NotFound();
            } else if(serviceId === user.values.serviceId) {
                var newAttrs = restrict.update(proto);
                
                extend(user, newAttrs);
                
                return user.save(Object.keys(newAttrs));
            } else {
                throw new Errors.authDataentication();
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


function destroy(params, authData) {
    var user, serviceId;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(serviceId) {
                return User.find({ where: restrict.search(params) });
            } else {
                throw new Errors.authDataentication();
            }
        },
        function(err) {
            if(!(err instanceof Errors.Generic)) {
                throw new Errors.authDataentication();
            } else {
                throw err;
            }
        }
    ).then(
        function(_user) {
            user = _user;
            
            if(!user) {
                throw new Errors.NotFound();
            } else if(serviceId === user.values.serviceId) {
                return user.destroy();
            } else {
                throw new Errors.authDataentication();
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
        function(_user) {
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