var moment = $require('moment'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'type', 'place', 'template', 'startAt', 'endAt', 'started', 'ended' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'type', 'startAt', 'endAt' ],
        update: [ 'startAt', 'endAt' ],
        search: [ 'id', 'deletedAt' ],
        searchAll: [ 'deletedAt' ]
    }, [ 'public', 'search', 'searchAll' ] );

var REST, Offer, Template, Place, User;


function _setTimestamps(target, src) {
    var now = Date.now(),
        startAt = (new Date(src.startAt)).getTime() || null,
        endAt = (new Date(src.endAt)).getTime() || null;
    
    if(!!startAt) {
        startAt = parseInt(startAt / 1000) * 1000;
    }

    if(!!endAt) {
        endAt = parseInt(endAt / 1000) * 1000;
    }

    if((!startAt !== !endAt)
    || ((startAt && endAt)
        && ((startAt > endAt)
        || (endAt < now)
        || (startAt < now)
        ))
    ) {
        delete target.startAt;
        delete target.endAt;
        
        return false;
    } else {
        if(!startAt && !endAt) {
            delete target.startAt;
            delete target.endAt;    
        } else {
            target.startAt = moment(startAt).toISOString();
            target.endAt = moment(endAt).toISOString();
        }
        
        return true;
    }
}


function create(authData, proto) {
    var user, template, place;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user || !proto.template || !proto.place || !proto.type) {
            throw new Errors.WrongData();
        } else {
            return REST.OfferTemplate.retrieve({ id: proto.template }, authData);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_template) {
        template = _template.resource;
        
        if(!template) {
            throw new Errors.WrongData();
        } else if (template.author !== user.id) {
            throw new Errors.Authentication();
        } else {
            return locate(proto.place);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(place) {
        if(!place) {
            throw new Errors.WrongData();
        } else {
            return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_place) {
        place = _place;

        var p = extend(restrict.create(proto), {
                AuthorId: user.id,
                PlaceId: place.id,
                TemplateId: template.id
            });

        var res = _setTimestamps(p, proto);
        if(!res) {
            throw new Errors.WrongData();
        }

        return Offer.create(p, Object.keys(p));
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(offer) {
        return { resource: extend(restrict.public(offer), {
                place: restrict.placePublic(place),
                template: template,
                author: user.id
            }) };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    var offer;
    
    return Offer.find({ where: restrict.search(params), include: [ Place ] })
    .then(function(_offer) {
        offer = _offer;
        
        if(!offer) {
            throw new Errors.NotFound();
        } else {
            return REST.OfferTemplate.retrieve({ id: offer.TemplateId }, authData);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(template) {
        return { resource: extend(restrict.public(offer), {
                        place: restrict.placePublic(offer.place),
                        template: template.resource,
                        author: offer.AuthorId
                    })
                };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieveAll(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10,
        params = {
            deletedAt: null,
            startAt: {
                gt: new Date(0)
            },
            endAt: {
                gt: new Date(Date.now())
            }
        };
        
    var offers;

    return Offer.findAll({ where: params, offset: offset, limit: limit, include: [ Place ] })
    .then(function(_offers) {
        offers = _offers;

        if(!offers || !offers.length) {
            throw new Errors.NotFound();
        } else {
            var promises = [ ];
            
            offers = offers.map(function(offer) {
                promises.push(REST.OfferTemplate.retrieve({ id: offer.TemplateId }, authData));
                
                return extend(restrict.public(offer), {
                    place: restrict.placePublic(offer.place),
                    author: offer.AuthorId
                    });
            });
                
            return Q.all(promises);
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(templates) {
        templates.forEach(function(template, index) {
            offers[index].template = template.resource;
        });
        
        return { resource: offers };
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    var user, offer;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.WrongData();
        } else {
            return Offer.find({ where: restrict.search(params), include: [ Place ] });
        }
    },
    Errors.report('Authentication')
    ).then(function(_offer) {
        offer = _offer;

        if(!offer) {
            throw new Errors.NotFound();    
        } else if(user.id !== offer.AuthorId) {
            throw new Errors.Authentication();
        } else if(offer.started) {
            throw new Errors.WrongData();
        } else {
            var newAttrs = restrict.update(proto);
            
            var res = _setTimestamps(newAttrs, proto);
            if(!res) {
                throw new Errors.WrongData();
            }
            
            extend(offer, newAttrs);
            
            return offer.save(Object.keys(newAttrs));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return REST.OfferTemplate.retrieve({ id: offer.TemplateId }, authData);
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(template) {
        return { resource: extend(restrict.public(offer), {
                        place: restrict.placePublic(offer.place),
                        template: template.resource,
                        author: offer.AuthorId
                    })
                };
    },
    Errors.report('Internal', 'DATABASE'));
}


function destroy(params, authData) {
    var user, offer;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.WrongData();
        } else {
            return Offer.find({ where: restrict.search(params), include: [ Place ] });
        }
    },
    Errors.report('Authentication')
    ).then(function(_offer) {
        offer = _offer;
        
        if(!offer) {
            throw new Errors.NotFound();    
        } else if(user.id !== offer.AuthorId) {
            throw new Errors.Authentication();
        } else {
            return offer.destroy();
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return REST.OfferTemplate.retrieve({ id: offer.TemplateId }, authData);
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(template) {
        return { resource: extend(restrict.public(offer), {
                        place: restrict.placePublic(offer.place),
                        template: template.resource,
                        author: offer.AuthorId
                    })
                };
    },
    Errors.report('Internal', 'DATABASE'));
}


module.exports = function(app) {
    var DB = app.get('db');

    REST = app.get('rest');
    Offer = DB.Offer;
    Template = DB.OfferTemplate;
    Place = DB.Place;
    User = DB.User;

    return {
        create: create,
        retrieve: retrieve,
        retrieveAll: retrieveAll,
        update: update,
        destroy: destroy
    }
};