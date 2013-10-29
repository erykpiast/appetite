var moment = $require('moment'),
    auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'content', 'createdAt', 'updatedAt' ],
        create: [ 'content' ],
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
            } else if(!proto.offer || !proto.content) {
                throw new Errors.WrongData();
            } else {
                proto.content = proto.content.toString();

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
                } else if(response.author !== user.values.id) {
                    throw new Errors.Authentication();
                }
            }

            if(response) {
                return Comment.findOrCreate({
                        AuthorId: user.values.id,
                        OfferId: offer.id,
                        ResponseId: response.id,
                        deletedAt: null
                    }, restrict.create(proto));
            } else {
                return Comment.create(extend(restrict.create(proto), {
                    AuthorId: user.values.id,
                    OfferId: offer.id
                }, (response ? { ResponseId: response.id } : { })));
            }
        },
        Errors.report('Database')
    ).then(
        function(comment, created) {
            return extend({ resource: extend(restrict.public(comment.values), {
                    response: (response ? extend({ 
                            offer: offer.id,
                            author: user.values.id
                        }, response) : 0),
                    offer: offer.id,
                    author: user.values.id
                }) }, (created === false ? { existed: true } : { }));
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
            } else if(comment.values.ResponseId) {
                return app.get('rest').Response.retrieve({ id: comment.values.ResponseId }, authData);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(response) {
            return { resource: extend(restrict.public(comment.values), {
                            offer: comment.values.OfferId,
                            author: comment.values.AuthorId,
                            response: (response.resource ? extend({ 
                                    offer: comment.values.OfferId,
                                    author: comment.values.AuthorId
                                }, response.resource) : 0)
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

    return Comment.findAll({ where: { OfferId: params.offerId, deletedAt: null }, offset: offset, limit: limit, include: include }).then(
        function(comments) {
            if(comments) {
                return { resource: comments.map(function(comment) {
                    return extend(restrict.public(comment.values), {
                        offer: comment.values.OfferId,
                        author: comment.values.AuthorId,
                        response: (comment.values.response ? extend({ 
                                    offer: comment.values.OfferId,
                                    author: comment.values.AuthorId
                                }, app.get('rest').Response.public(comment.values.response.values)) : 0)
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
    var serviceId, comment;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(!!serviceId) {
                return Comment.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, Response ] });
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Authentication')
    ).then(
        function(comment) {
            if(!comment) {
                throw new Errors.NotFound();    
            } else if(serviceId === comment.values.author.values.serviceId) {
                var newAttrs = restrict.update(proto);
                
                extend(comment, newAttrs);
                
                return comment.save(Object.keys(newAttrs));
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Database')
    ).then(
        function(_comment) {
            comment = _comment;

            return { resource: extend(restrict.public(comment.values), {
                            offer: comment.values.OfferId,
                            author: comment.values.author.values.id,
                            response: (comment.values.response ? extend({ 
                                    offer: comment.values.OfferId,
                                    author: comment.values.author.values.id
                                }, app.get('rest').Response.public(comment.values.response.values)) : 0)
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
                return Comment.find({ where: restrict.search(params), include: [ Response, { model: User, as: 'Author' } ] });
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_comment) {
            comment = _comment;
            
            if(!comment) {
                throw new Errors.NotFound();    
            } else if(serviceId === comment.values.author.values.serviceId) {
                return comment.destroy();
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(comment.values), {
                            offer: comment.values.OfferId,
                            author: comment.values.author.values.id,
                            response: (comment.values.response ? extend({ 
                                    offer: comment.values.OfferId,
                                    author: comment.values.author.values.id
                                }, app.get('rest').Response.public(comment.values.response.values)) : 0)
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
        retrieveAllForOffer: retrieveAllForOffer,
        update: update,
        destroy: destroy
    }
};