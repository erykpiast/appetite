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
        Errors.report('Authentication')
    ).then(
        function(user) {
            if(!user) {
                proto = restrict.create(proto);
                
                return User.create(proto, Object.keys(proto));
            } else {
                return { resource: restrict.public(user.values), existed: true };
            }
        },
        Errors.report('Database')
    ).then(
        function(user) {
            if(user) {
                return { resource: restrict.public(user.values) };
            } else {
                return user;
            }
        },
        Errors.report('Database')
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
        Errors.report('Database')
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
        Errors.report('Authentication')
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
        Errors.report('Database')
    ).then(
        function(user) {
            return { resource: restrict.public(user.values) };
        },
        Errors.report('Database')
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
        Errors.report('Authentication')
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
        Errors.report('Database')
    ).then(
        function(_user) {
            return { resource: restrict.public(user.values) };
        },
        Errors.report('Database')
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