var auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'place', 'template', 'startAt', 'endAt' ],
		placePublic: [ 'id', 'serviceId' ],
		create: [ 'startAt', 'endAt' ],
		update: [ 'startAt', 'endAt' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var Offer, Template, Place, User;


function create(proto) {
    var user, template, place;
    
	return auth(proto.authService, proto.accessToken).then(
		function(serviceId) {
		    return User.find({ where: {
					serviceId: serviceId,
					authService: proto.authService,
					deletedAt: null
				} });
		},
		function(err) {
		    throw new Errors.Authentication();
		}
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
		function(err) {
			if(!(err instanceof Errors.Generic)) {
                return new Errors.Authentication();
            } else {
                throw err;
            }
		}
	).then(
		function(_template) {
		    template = _template;
		    
		    if(!template || (template.values.AuthorId !== user.values.id) || !proto.place) {
				throw new Errors.WrongData();
			} else {
			    return locate(proto.place);
			}
		},
		function(err) {
			if(!(err instanceof Errors.Generic)) {
                return new Errors.Authentication();
            } else {
                throw err;
            }
		}
	).then(
		function(place) {
		    if(!place) {
				throw new Errors.WrongData();
			} else {
				return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
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
		function(_place) {
			place = _place;

		    var p = extend(restrict.create(proto), {
    			        AuthorId: user.values.id,
    			        PlaceId: place.values.id,
    			        TemplateId: template.values.id
    			    });

		    if(parseInt0(proto.startAt) !== 0) {
		    	p.startAt = new Date(proto.startAt);
		    }

		    if(parseInt0(proto.endAt) !== 0) {
		    	p.endAt = new Date(proto.endAt);
		    }

			return Offer.create(p, Object.keys(p));
		},
		function(err) {
		    if(!(err instanceof Errors.Generic)) {
			    throw new Errors.Database();
		    } else {
                throw err;
            }
		}
	).then(
		function(offer) {
			return { resource: extend(restrict.public(offer.values), {
					place: restrict.placePublic(place.values),
					template: template.values.id
				}) };
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


function retrieve(proto) {
	return OfferTemplate.find({ where: restrict.search(proto), include: [ Recipe ] }).then(
		function(template) {
			if(!!template) {
				return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.recipe.values) }) };
			} else {
				throw new Errors.NotFound();
			}
		},
		function(err) {
			throw new Errors.Database();
		}
	);
}


function update(proto) {
    var serviceId;
    
	return auth(proto.authService, proto.accessToken).then(
		function(_serviceId) {
		    serviceId = _serviceId;
		    
			if(!!serviceId) {
				return OfferTemplate.find({ where: restrict.search(proto), include: [ { model: User, as: 'Author' }, Recipe ] });
			} else {
				throw new Errors.Authentication();
			}
		},
		function() {
			throw new Errors.Authentication();
		}
	).then(
		function(template) {
			if(!template) {
			    throw new Errors.NotFound();	
			} else if(serviceId === template.values.author.values.serviceId) {
                var newAttrs = restrict.update(proto);
                
                extend(template, newAttrs);
                
                return template.save(Object.keys(newAttrs));
			} else {
				throw new Errors.Authentication();
			}
		},
		function(err) {
		    throw new Errors.Database();
		}
	).then(
		function(template) {
			return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.values.recipe.values) }) };
		},
		function() {
			throw new Errors.Database();
		}
	);
}


function destroy(proto) {
    var template, serviceId;
    
	return auth(proto.authService, proto.accessToken).then(
		function(_serviceId) {
		    serviceId = _serviceId;
		    
			if(!!serviceId) {
				return OfferTemplate.find({ where: restrict.search(proto), include: [ { model: User, as: 'Author' }, Recipe ] });
			} else {
				throw new Errors.Authentication();
			}
		},
		function() {
			throw new Errors.Authentication();
		}
	).then(
		function(_template) {
		    template = _template;
		    
			if(!template) {
			    throw new Errors.NotFound();	
			} else if(serviceId === template.values.author.values.serviceId) {
                return template.destroy();
			} else {
				throw new Errors.Authentication();
			}
		},
		function(err) {
		    throw new Errors.Database();
		}
	).then(
		function() {
			return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.values.recipe.values) }) };
		},
		function() {
			throw new Errors.Database();
		}
	);
}


module.exports = function(app) {
    Offer = app.get('db').Offer;
	Template = app.get('db').OfferTemplate;
	Place = app.get('db').Place;
	User = app.get('db').User;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};