var auth = $require('/modules/auth'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'accepted' ],
        create: [ ],
        update: [ 'accepted' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var Response, Offer, User;


function create(authData, proto) {
    var user, offer;
    
    return auth(authData.service, authData.accessToken).then(
        function(serviceId) {
            if(!serviceId) {
                throw new Errors.Authentication();
            } else {
                return User.find({ where: {
                        serviceId: serviceId,
                        authService: authData.service,
                        deletedAt: null
                    } });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            user = _user;

            if(!user) {
                throw new Errors.Authentication();
            } else if(!proto.offer) {
                throw new Errors.WrongData();
            } else {
                return Offer.find({ where: { id: proto.offer } });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_offer) {
            offer = _offer;
            
            if(!offer || !offer.started || offer.ended) {
                throw new Errors.WrongData();
            } else if(offer.values.AuthorId === user.values.id) {
                throw new Errors.Authentication();
            } else {
                proto = extend(restrict.create(proto), {
                    OfferId: proto.offer,
                    AuthorId: user.values.id
                });

                return Response.create(proto, Object.keys(proto));
            }
        },
        Errors.report('Database')
    ).then(
        function(response) {
            return { resource: extend(restrict.public(response.values), {
                        offer: response.values.OfferId,
                        author: response.values.AuthorId
                    }) };
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {
    return Response.find({ where: restrict.search(params) }).then(
        function(response) {
            if(!response) {
                throw new Errors.NotFound();
            } else {
                return { resource: extend(restrict.public(response.values), {
                        offer: response.values.OfferId,
                        author: response.values.AuthorId
                    }) };
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

            if(!serviceId) {
                throw new Errors.Authentication();
            } else {
                return User.find({ where: {
                        serviceId: serviceId,
                        authService: authData.service,
                        deletedAt: null
                    } });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            user = _user;
            
            if(!user) {
                throw new Errors.Authentication();
            } else {
                return Response.find({ where: restrict.search(params), include: [ Offer ] });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(response) {
            if(!response) {
                throw new Errors.NotFound();    
            } else if(user.values.id !== response.values.offer.values.AuthorId) {
                throw new Errors.Authentication();
            } else {
                var newAttrs = restrict.update(proto);
                
                extend(response, newAttrs);
                
                return response.save(Object.keys(newAttrs));
            }
        },
        Errors.report('Database')
    ).then(
        function(response) {
            return { resource: extend(restrict.public(response.values), {
                    offer: response.values.offer.values.id,
                    author: response.values.AuthorId
                }) };
        },
        Errors.report('Database')
    );
}


function destroy(params, authData) {
    var response, serviceId;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!serviceId) {
                throw new Errors.Authentication();
            } else {
                return Response.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' } ] });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_response) {
            response = _response;
            
            if(!response) {
                throw new Errors.NotFound();    
            } else if(serviceId !== response.values.author.values.serviceId) {
                throw new Errors.Authentication();
            } else {
                return response.destroy();
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(response.values), {
                    offer: response.values.OfferId,
                    author: response.values.AuthorId
                }) };
        },
        Errors.report('Database')
    );
}


module.exports = function(app) {
    Response = app.get('db').Response;
    Offer = app.get('db').Offer;
    User = app.get('db').User;

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy,
        public: restrict.public
    }
};