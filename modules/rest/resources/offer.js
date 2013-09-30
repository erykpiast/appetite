var moment = $require('moment'),
    auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'type', 'place', 'template', 'startAt', 'endAt' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'type', 'startAt', 'endAt' ],
        update: [ 'startAt', 'endAt' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var DB, REST, Offer, Template, Place, User;


function _setTimestamps(target, src) {
    var startAt = src.startAt ? Date.parse(src.startAt) : null,
        endAt = src.endAt ? Date.parse(src.endAt) : null;
    
    if((isNaN(startAt) || isNaN(endAt)) || (!startAt !== !endAt) || ((startAt && endAt) && (startAt >= endAt))) {
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
                return Template.find({ where: { id: proto.template } });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_template) {
            template = _template;
            
            if(!template || (template.values.AuthorId !== user.values.id) || !proto.place) {
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
                        TemplateId: template.values.id
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
            return { resource: extend(restrict.public(offer.values), {
                    place: restrict.placePublic(place.values),
                    template: template.values.id,
                    author: user.values.id
                }) };
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {// one
    return Offer.find({ where: restrict.search(params), include: [ Place ] }).then(
        function(offer) {
            if(!!offer) {
                return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId,
                    author: offer.values.AuthorId }) };
            } else {
                throw new Errors.NotFound();
            }
        },
        Errors.report('Database')
    );
}


function retrieveAll(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10,
        include = [ { model: OfferTemplate, as: 'Template' } ];

    return Offer.findAll({ where: restrict.search(params), offset: offset, limit: limit, include: include }).then(
        function(offers) {
            if(offers && offers.length) {
                return { resource: offers.map(function(offer) {
                    return extend(restrict.public(offer.values), {
                        template: REST.OfferTemplate.public(offer.values.Template.values),
                        author: offer.values.AuthorId
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
    var serviceId;
    
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
        function(offer) {
            return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId,
                author: offer.values.AuthorId }) };
        },
        Errors.report('Database')
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
            return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId,
                author: offer.values.AuthorId }) };
        },
        Errors.report('Database')
    );
}


module.exports = function(app) {
    DB = app.get('db');
    REST = app.get('rest');
    Offer = app.get('db').Offer;
    Template = app.get('db').OfferTemplate;
    Place = app.get('db').Place;
    User = app.get('db').User;

    return {
        create: create,
        retrieve: retrieve,
        retrieveAll: retrieveAll,
        update: update,
        destroy: destroy
    }
};