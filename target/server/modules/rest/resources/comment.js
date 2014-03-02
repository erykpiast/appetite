var moment = $require('moment'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'content', 'createdAt', 'updatedAt' ],
        create: [ 'content' ],
        update: [ 'content' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var REST, Comment, Offer, User;


function create(authData, proto) {
    var user, offer, parent, response;
    
   return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user || !proto.offer || !proto.content) {
            throw new Errors.WrongData();
        } else {
            return REST.Offer.retrieve({ id: proto.offer }, authData);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_offer) {
        if(!_offer || !_offer.resource) {
            throw new Errors.WrongData();
        } else {
            offer = _offer.resource;

            if(proto.parent) {
                return Comment.find({ where: { id: proto.parent } });
            } else {
                return true;
            }
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_parent) {
        parent = _parent;

        if(parent !== true) {
            if(!parent) {
                throw new Errors.WrongData();
            }
        }
        
        if(proto.response) {
            return REST.Response.retrieve({ id: proto.response }, authData);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_response) {
        if(_response !== true) {
            if(!_response || !_response.resource) {
                throw new Errors.WrongData();
            } else {
                response = _response.resource;

                if(user.id !== response.author) {
                    throw new Errors.Authentication();
                } else { // create comment related with response
                    return Comment.findOrCreate(extend({
                            AuthorId: user.id,
                            OfferId: offer.id,
                            ResponseId: response.id,
                            deletedAt: null
                        }, (parent !== true ? { ParentId: parent.id } : { })), restrict.create(proto));
                }
            }       
        } else { // create comment not related with response
            var p;
            return Comment.create(p = extend(restrict.create(proto), {
                    AuthorId: user.id,
                    OfferId: offer.id,
                    ResponseId: 0
                },
                (parent !== true ? { ParentId: parent.id } : { })), Object.keys(p));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(comment, created) {
        return extend({ resource: extend(restrict.public(comment), {
                response: (response ? extend({ 
                        offer: offer.id,
                        author: user.id
                    }, response) : 0),
                offer: offer.id,
                author: user.id,
                parent: (parent !== true ?  parent.id : 0)
            }) },
            (created === false ? { existed: true } : { }));
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    var comment;
    
    return Comment.find({ where: restrict.search(params) })
    .then(function(_comment) {
        comment = _comment;
        
        if(!comment) {
            throw new Errors.NotFound();
        } else if(comment.ResponseId) {
            return REST.Response.retrieve({ id: comment.ResponseId }, authData);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(response) {
        if((response !== true) && (!response || !response.resource)) {
            throw new Error.Internal('DATABASE');
        } else {
            return { resource: extend(restrict.public(comment), {
                        offer: comment.OfferId,
                        author: comment.AuthorId,
                        parent: comment.ParentId || 0,
                        response: response !== true ? response.resource : 0
                    })
                };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieveAllForOffer(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10;

    var comments;

    return Comment.findAll({ where: { OfferId: params.offerId, deletedAt: null }, offset: offset, limit: limit })
    .then(function(_comments) {
        comments = _comments;

        if(!comments || !comments.length) {
            throw new Errors.NotFound();
        } else {
            var promises = [ ];
        
            comments = comments.map(function(comment) {
                if(comment.ResponseId) {
                    promises.push(REST.Response.retrieve({ id: comment.ResponseId }, authData));
                }
                
                return extend(restrict.public(comment), {
                        offer: comment.OfferId,
                        author: comment.AuthorId,
                        parent: comment.ParentId || 0,
                        response: 0
                    });
            });
                
            return Q.all(promises);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(responses) {
        responses.forEach(function(response, index) {
            comments[index].response = response.resource;
        });
        
        return { resource: comments };
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    var user, comment;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.Authentication();
        } else {
            return Comment.find({ where: restrict.search(params) });
        }
    },
    Errors.report('Authentication')
    ).then(function(_comment) {
        comment = _comment;

        if(!comment) {
            throw new Errors.NotFound();    
        } else if(user.id !== comment.AuthorId) {
            throw new Errors.Authentication();
        } else {
            var newAttrs = restrict.update(proto);
            
            extend(comment, newAttrs);
            
            return comment.save(Object.keys(newAttrs));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        if(comment.ResponseId) {
            return REST.Response.retrieve({ id: comment.ResponseId }, authData);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(response) {
        if((response !== true) && (!response || !response.resource)) {
            throw new Error.Internal('DATABASE');
        } else {
            return { resource: extend(restrict.public(comment), {
                        offer: comment.OfferId,
                        author: comment.AuthorId,
                        parent: comment.ParentId || 0,
                        response: response !== true ? response.resource : 0
                    })
                };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function destroy(params, authData) {
    var user, comment;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.Authentication();
        } else {
            return Comment.find({ where: restrict.search(params) });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_comment) {
        comment = _comment;
        
        if(!comment) {
            throw new Errors.NotFound();    
        } else if(user.id !== comment.AuthorId) {
            throw new Errors.Authentication();
        } else {
            return comment.destroy();
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        if(comment.ResponseId) {
            return REST.Response.retrieve({ id: comment.ResponseId }, authData);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(response) {
        if((response !== true) && (!response || !response.resource)) {
            throw new Error.Internal('DATABASE');
        } else {
            return { resource: extend(restrict.public(comment), {
                    offer: comment.OfferId,
                    author: comment.AuthorId,
                    parent: comment.ParentId || 0,
                    response: response !== true ? response.resource : 0
                })
            };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


module.exports = function(app) {
    var DB = app.get('db');

    REST = app.get('rest');
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