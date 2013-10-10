var Sequelize = $require('sequelize'),
    auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'title', 'description', 'recipe' ],
		recipePublic: [ 'id', 'url' ],
		imagePublic: [ 'id', 'filename' ],
		imageSearch: [ 'filename' ],
		tagPublic: [ 'id', 'text' ],
		tagSearch: [ 'text' ],
		create: [ 'title', 'description' ],
		update: [ 'title', 'description', 'pictures' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var DB, OfferTemplate, Recipe, Image, Tag, User;


function _createSetFn(propName, modelName, searchRestrictFn, protoProcessingFn) {
	return function(proto, authorId) {
		if(proto[propName]) {
	        if((proto[propName] instanceof Array) && proto[propName].length) {
	            var chainer = new Sequelize.Utils.QueryChainer;
	            
	            var props = proto[propName].map(function(proto) {
	                if(!proto) {
	                    return null;
	                } else {
	                	proto = protoProcessingFn(proto);

	                	var search = searchRestrictFn(proto);

		                var prop = chainer.add(DB[modelName], 'findOrCreate', [ search, extend({ AuthorId: authorId }, proto) ]);
		                
		                return prop;
	                }
	            }).filter(function(prop) {
	                return !!prop;
	            });
	            
	            if(props.length) {
	            	 // tests need this sequence for correct ids :(
		            return chainer.runSerially();
	            } else {
	                throw Errors.WrongData();
	            }
	        } else {
	            throw Errors.WrongData();
	        }
	    } else {
	        delete proto[propName];
	        
	        return true;
	    }
	}
}


function _createPublishFn(prop, restrictFn) {
	return function(source1, source2) {
		var source = source1[prop] ? source1[prop] : (source2[prop] ? source2[prop] : [ ]);

		return source.map(function(obj) {
			return restrictFn(obj.values);
		});// function factory
	}
}


var _publishPictures = _createPublishFn('pictures', restrict.imagePublic),
	_publishTags = _createPublishFn('tags', restrict.tagPublic),
	_setPictures = _createSetFn('pictures', 'Image', restrict.imageSearch, function(proto) {
			proto = proto.toString();

			return {
                originalUrl: proto,
                filename: new RegExp('^(.*/)([^/]*)$').exec(proto)[2]
            };
		}),
	_setTags = _createSetFn('tags', 'Tag', restrict.tagSearch, function(proto) {
			return {
				text: proto.toString()
			};
		});


function create(authData, proto) {
    var user, recipe, template;
    
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
			} else if(!proto.recipe) {
				throw new Errors.WrongData();
			} else {
				return Recipe.findOrCreate({ url: proto.recipe }, { AuthorId: user.values.id });
			}
		},
		Errors.report('Authentication')
	).then(
		function(_recipe) {
			recipe = _recipe;
		    
		    
		    var p = extend(restrict.create(proto), {
			        AuthorId: user.values.id,
			        RecipeId: recipe.values.id
			    });
		    
			return OfferTemplate.create(p, Object.keys(p));
		},
		Errors.report('Database')
	).then(
		function(_template) {
		    template = _template;
		    
		    return _setPictures(proto, user.values.id);
		},
		Errors.report('Database')
	).then(
		function(pictures) {
			if(pictures instanceof Array) {
		        proto.pictures = pictures;
		    }

			if(proto.pictures) {
		        return template.setPictures(proto.pictures);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function(pictures) {
		    return _setTags(proto, user.values.id);
		},
		Errors.report('Database')
	).then(
		function(tags) {
		    if(tags instanceof Array) {
		        proto.tags = tags;
		    }
		    
		    if(proto.tags) {
		        return template.setTags(proto.tags);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
			return { resource: extend(restrict.public(template.values), {
            			    recipe: restrict.recipePublic(recipe.values),
            				author: user.values.id,
            				pictures: _publishPictures(proto),
            				tags: _publishTags(proto)
        				})
    				};
		},
		Errors.report('Database')
	);
}


function retrieve(params, authData) {
	return OfferTemplate.find({ where: restrict.search(params), include: [ Recipe, Tag, { model: Image, as: 'Pictures' } ] }).then(
		function(template) {
			if(!!template) {
				return { resource: extend(restrict.public(template.values), {
				                recipe: restrict.recipePublic(template.values.recipe.values),
					            author: template.values.AuthorId,
					            pictures: _publishPictures(template.values),
            					tags: _publishTags(template.values)
					        })
					   };
			} else {
				throw new Errors.NotFound();
			}
		},
		Errors.report('Database')
	);
}


function update(params, authData, proto) {
    var serviceId, template;
    
	return auth(authData.service, authData.accessToken).then(
		function(_serviceId) {
		    serviceId = _serviceId;
		    
			if(!!serviceId) {
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, { model: Image, as: 'Pictures' }, Tag, Recipe ] });
			} else {
				throw new Errors.Authentication();
			}
		},
		Errors.report('Authentication')
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
		Errors.report('Database')
	).then(
		function(_template) {
		    template = _template;
		    
			return _setPictures(proto, template.values.author.values.id);
		},
		Errors.report('Database')
	).then(
		function(pictures) {
		    if(pictures instanceof Array) {
		        proto.pictures = pictures;
		    }
		    
		    if(proto.pictures) {
		        return template.setPictures(proto.pictures);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
		    return _setTags(proto, template.values.author.values.id);
		},
		Errors.report('Database')
	).then(
		function(tags) {
		    if(tags instanceof Array) {
		        proto.tags = tags;
		    }
		    
		    if(proto.tags) {
		        return template.setTags(proto.tags);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
			return { resource: extend(restrict.public(template.values), {
			                recipe: restrict.recipePublic(template.values.recipe.values),
				            author: template.values.AuthorId,
				            pictures: _publishPictures(proto, template.values),
				            tags: _publishTags(proto, template.values)
				        })
				    };
		},
		Errors.report('Database')
	);
}


function destroy(params, authData) {
    var template, serviceId;
    
	return auth(authData.service, authData.accessToken).then(
		function(_serviceId) {
		    serviceId = _serviceId;
		    
			if(!!serviceId) {
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, { model: Image, as: 'Pictures' }, Tag, Recipe ] });
			} else {
				throw new Errors.Authentication();
			}
		},
		Errors.report('Authentication')
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
		Errors.report('Database')
	).then(
		function() {
			return { resource: extend(restrict.public(template.values), {
			                recipe: restrict.recipePublic(template.values.recipe.values),
				            author: template.values.AuthorId,
				            pictures: _publishPictures(template.values),
            				tags: _publishTags(template.values)
				        })
				   };
		},
		Errors.report('Database')
	);
}


module.exports = function(app) {
    DB = app.get('db');
	OfferTemplate = DB.OfferTemplate;
	Recipe = DB.Recipe;
	User = DB.User;
	Image = DB.Image;
	Tag = DB.Tag;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};

module.exports['public'] = restrict.public;