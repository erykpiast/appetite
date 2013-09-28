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


function _setTimestamps(target, src) {
    var startAt = parseInt0(src.startAt),
        endAt = parseInt0(src.endAt);
    
    if(startAt !== 0) {
    	startAt = new Date(src.startAt);
    }

    if(endAt !== 0) {
    	endAt = new Date(src.endAt);
    }
    
    if(((!startAt) !== (!endAt)) || ((!!startAt && !!endAt) && (startAt >= endAt))) {
        delete target.startAt;
        delete target.endAt;
        
        return false;
    } else {
        target.startAt = startAt;
        target.endAt = endAt;
        
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
                throw new Errors.Authentication();
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
                throw new Errors.Authentication();
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

            var res = _setTimestamps(p, proto);
		    if(!res) {
		        throw new Errors.WrongData();
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


function retrieve(params, authData) {
	return Offer.find({ where: restrict.search(params), include: [ Place ] }).then(
		function(offer) {
			if(!!offer) {
				return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId }) };
			} else {
				throw new Errors.NotFound();
			}
		},
		function(err) {
			throw new Errors.Database();
		}
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
		function(err) {
			throw new Errors.Authentication();
		}
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
                
                if(!isNaN(Date.parse(offer.values.startAt))) {
                    throw new Errors.Database();
                }
                
                extend(offer, newAttrs);
                
                return offer.save(Object.keys(newAttrs));
			} else {
				throw new Errors.Authentication();
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
		function(offer) {
			return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId }) };
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
		function(err) {
			throw new Errors.Authentication();
		}
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
		function(err) {
			if(!(err instanceof Errors.Generic)) {
			    throw new Errors.Database();
		    } else {
                throw err;
            }
		}
	).then(
		function() {
			return { resource: extend(restrict.public(offer.values), { place: restrict.placePublic(offer.values.place.values), template: offer.values.TemplateId }) };
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