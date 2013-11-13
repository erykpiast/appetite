var Q = $require('q'),
    moment = $require('moment'),
    auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'type', 'place', 'template', 'startAt', 'endAt', 'started', 'ended' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'type', 'startAt', 'endAt' ],
        update: [ 'startAt', 'endAt' ],
        search: [ 'id', 'deletedAt' ],
        searchAll: [ 'deletedAt' ]
    }, [ 'public', 'search', 'searchAll' ] );

var app, DB, Offer, Template, Place, User;


function _setTimestamps(target, src) {
    var startAt = src.startAt ? new Date(src.startAt) : null,
        endAt = src.endAt ? new Date(src.endAt) : null;
    
    if((isNaN(startAt) || isNaN(endAt)) || (!startAt !== !endAt) || ((startAt && endAt) && (startAt.getTime() > endAt.getTime()) || (endAt.getTime() < Date.now()))) {
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
            } else if(!proto.template) {
                throw new Errors.WrongData();
            } else {
                return app.get('rest').OfferTemplate.retrieve({ id: proto.template }, authData);
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_template) {
            template = _template.resource;
            
            if(!template || (template.author !== user.values.id) || !proto.place) {
                throw new Errors.WrongData();
            } else {
                return locate(proto.place);
            }
        },
        Errors.report('Authentication')
    ).then(
        function(place) {
            if(!place) {
                throw new Errors.WrongData();
            } else {
                return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
            }
        },
        Errors.report('Database')
    ).then(
        function(_place) {
            place = _place;

            var p = extend(restrict.create(proto), {
                        AuthorId: user.values.id,
                        PlaceId: place.values.id,
                        TemplateId: template.id
                    });

            var res = _setTimestamps(p, proto);
            if(!res) {
                throw new Errors.WrongData();
            }

            return Offer.create(p, Object.keys(p));
        },
        Errors.report('Database')
    ).then(
        function(offer) {
            return { resource: extend(restrict.public(offer), {
                    place: restrict.placePublic(place.values),
                    template: template,
                    author: user.values.id
                }) };
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {
    var offer;
    
    return Offer.find({ where: restrict.search(params), include: [ Place ] }).then(
        function(_offer) {
            offer = _offer;
            
            if(!offer) {
                throw new Errors.NotFound();
            } else {
                return app.get('rest').OfferTemplate.retrieve({ id: offer.values.TemplateId }, authData);
            }
        },
        Errors.report('Database')
    ).then(
        function(template) {
            return { resource: extend(restrict.public(offer), {
                            place: restrict.placePublic(offer.values.place.values),
                            template: template.resource,
                            author: offer.values.AuthorId
                        })
                    };
        },
        Errors.report('Database')
    );
}


function retrieveAll(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10,
        params = {
            deletedAt: null,
            endAt: {
                gt: Date.now()
            }
        };
        
    var offers;

    return Offer.findAll({ where: params, offset: offset, limit: limit }).then(
        function(_offers) {
            if(_offers) {
                var promises = [ ];
                
                offers = _offers.map(function(offer) {
                    promises.push(app.get('rest').OfferTemplate.retrieve({ id: offer.values.TemplateId }, authData));
                    
                    return extend(restrict.public(offer), {
                        author: offer.values.AuthorId
                        });
                    });
                    
                return Q.all(promises);
            } else {
                throw new Errors.NotFound();
            }
        },
        Errors.report('Database')
    ).then(
        function(templates) {
            templates.forEach(function(template, index) {
                offers[index].template = template.resource;
            });
            
            return { resource: offers };
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
            return { resource: extend(restrict.public(offer), {
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
            return { resource: extend(restrict.public(offer), {
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