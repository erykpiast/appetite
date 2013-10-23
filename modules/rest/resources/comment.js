var moment = $require('moment'),
    auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'content', 'createdAt' ],
        create: [ 'content', 'offer', 'response' ],
        update: [ 'content' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var app, DB, Comment, Offer, User;


function create(authData, proto) {
    var user, offer, response;
    
    return auth(authData.service, authData.accessToken).then(
        function(serviceId) {
            return User.find({ where: {
                    serviceId: serviceId,
                    authService: authData.service,
                    deletedAt: null
                } });
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
                return app.get('rest').Offer.retrieve({ id: proto.offer }, authData);
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_offer) {
            offer = _offer.resource;
            
            if(!offer) {
                throw new Errors.WrongData();
            } else if(proto.response) {
                return app.get('rest').Response.retrieve({ id: proto.response }, authData);
            } else {
                return true;
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_response) {
            if(_response && (_response.resource)) {
                response = _response.resource;

                if(!response) {
                    throw new Errors.WrongData();
                }
            }

            return Comment.create(extend(restrict.create(proto), {
                AuthorId: user.values.id,
                OfferId: offer.id,
            }, (response ? { ResponseId: response.id } : { })));
        },
        Errors.report('Database')
    ).then(
        function(comment) {
            return { resource: extend(restrict.public(comment.values), {
                    response: (response ? response.id : null),
                    author: user.values.id
                }) };
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {
    var comment;
    
    return Comment.find({ where: restrict.search(params), include: [ Response ] }).then(
        function(_comment) {
            comment = _comment;
            
            if(!comment) {
                throw new Errors.NotFound();
            } else {
                return app.get('rest').response.retrieve({ id: comment.values.ResponseId }, authData);
            }
        },
        Errors.report('Database')
    ).then(
        function(response) {
            return { resource: extend(restrict.public(comment.values), {
                            response: response.resource,
                            author: comment.values.AuthorId
                        })
                    };
        },
        Errors.report('Database')
    );
}


function retrieveAllForOffer(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10,
        include = [ Response ];

    return Comment.findAll({ where: { OfferId: params.offerId, deletedAt: null }), offset: offset, limit: limit, include: include }).then(
        function(comments) {
            if(comments && comments.length) {
                return { resource: comments.map(function(comment) {
                    return extend(restrict.public(comment.values), {
                        response: REST.response.public(comment.values.Response.values),
                        author: comment.values.AuthorId
                        });
                    }) };
            } else {
                throw new Errors.NotFound();
            }
        },
        Errors.report('Database')
    );
}


function update(params, authData, proto) {
    var serviceId, offer;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return Offer.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, Place ] });
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Authentication')
    ).then(
        function(offer) {
            if(!offer) {
                throw new Errors.NotFound();    
            } else if(serviceId === offer.values.author.values.serviceId) {
                var newAttrs = restrict.update(proto);
                
                var res = _setTimestamps(newAttrs, proto);
                if(!res) {
                    throw new Errors.WrongData();
                }
                
                if(Date.parse(offer.values.startAt) != 0) {
                    throw new Errors.Database();
                }
                
                extend(offer, newAttrs);
                
                return offer.save(Object.keys(newAttrs));
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Database')
    ).then(
        function(_offer) {
            offer = _offer;
            
            return app.get('rest').OfferTemplate.retrieve({ id: offer.values.TemplateId }, authData);
        },
        Errors.report('Database')
    ).then(
        function(template) {
            return { resource: extend(restrict.public(offer.values), {
                            place: restrict.placePublic(offer.values.place.values),
                            template: template.resource,
                            author: offer.values.AuthorId
                        })
                    };
        }    
    );
}


function destroy(params, authData) {
    var offer, serviceId;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return Offer.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, Place ] });
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_offer) {
            offer = _offer;
            
            if(!offer) {
                throw new Errors.NotFound();    
            } else if(serviceId === offer.values.author.values.serviceId) {
                return offer.destroy();
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return app.get('rest').OfferTemplate.retrieve({ id: offer.values.TemplateId }, authData);
        },
        Errors.report('Database')
    ).then(
        function(template) {
            return { resource: extend(restrict.public(offer.values), {
                            place: restrict.placePublic(offer.values.place.values),
                            template: template.resource,
                            author: offer.values.AuthorId
                        })
                    };
        },
        Errors.report('Database')
    );
}


module.exports = function(_app) {
    app = _app;
    DB = app.get('db');
    Comment = DB.Comment;
    Offer = DB.Offer;
    Response = DB.Response;
    User = DB.User;

    return {
        create: create,
        retrieve: retrieve,
        retrieveAll: retrieveAll,
        update: update,
        destroy: destroy
    }
};