var Errors = $require('/modules/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'accepted' ],
        create: [ ],
        update: [ 'accepted' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var Response, Offer, User;


function create(authData, proto) {
    var user, offer;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user || !proto.offer) {
            throw new Errors.WrongData();
        } else {
            return Offer.find({ where: { id: proto.offer } });
        }
    },
    Errors.report('Authentication')
    ).then(function(_offer) {
        offer = _offer;
        
        if(!offer || !offer.started || offer.ended) {
            throw new Errors.WrongData();
        } else if(user.id === offer.AuthorId) { // you can't response to your own offer!
            throw new Errors.Authentication();
        } else {
            var p;
            return Response.create(p = extend(restrict.create(proto), {
                OfferId: proto.offer,
                AuthorId: user.values.id
            }), Object.keys(p));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(response) {
        return { resource: extend(restrict.public(response), {
                    offer: response.OfferId,
                    author: response.AuthorId
                }) };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    return Response.find({ where: restrict.search(params) })
    .then(function(response) {
        if(!response) {
            throw new Errors.NotFound();
        } else {
            return { resource: extend(restrict.public(response), {
                    offer: response.OfferId,
                    author: response.AuthorId
                }) };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    var user;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user)  {
            throw new Errors.Authentication();
        } else {
            return Response.find({ where: restrict.search(params), include: [ Offer ] });
        }
    },
    Errors.report('Authentication')
    ).then(function(response) {
        if(!response) {
            throw new Errors.NotFound();    
        } else if(user.id !== response.offer.AuthorId) { // only offer author can update (accept) response
            throw new Errors.Authentication();
        } else {
            var newAttrs = restrict.update(proto);
            
            extend(response, newAttrs);
            
            return response.save(Object.keys(newAttrs));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(response) {
        return { resource: extend(restrict.public(response), {
                offer: response.offer.id,
                author: response.AuthorId
            }) };
    },
    Errors.report('Internal', 'DATABASE'));
}


function destroy(params, authData) {
    var response, user;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.Authentication();
        } else {
            return Response.find({ where: restrict.search(params) });
        }
    },
    Errors.report('Authentication')
    ).then(function(_response) {
        response = _response;
        
        if(!response) {
            throw new Errors.NotFound();    
        } else if(user.id !== response.AuthorId) {
            throw new Errors.Authentication();
        } else if(response.accepted) {
            throw new Error.WrongData();
        } else {
            return response.destroy();
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(response), {
                offer: response.OfferId,
                author: response.AuthorId
            }) };
    },
    Errors.report('Internal', 'DATABASE'));
}


module.exports = function(app) {
    var DB = app.get('db');

    Response = DB.Response;
    Offer = DB.Offer;
    User = DB.User;

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy
    };
};