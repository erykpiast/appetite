var Sequelize = $require('sequelize'),
	Resource = $require('/modules/resource'),
	md5 = $require('MD5'),
	q = $require('q'),
    auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'title', 'description', 'recipe' ],
		recipePublic: [ 'id', 'url', 'domain' ],
		imagePublic: [ 'id', 'filename' ],
		imageSearch: [ 'filename' ],
		tagPublic: [ 'id', 'text' ],
		tagSearch: [ 'text' ],
		create: [ 'title', 'description' ],
		update: [ 'title', 'description' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var DB, OfferTemplate, Recipe, Image, Tag, User, rootDir, r;


function _createSetFn(propName, modelName, searchRestrictFn, protoProcessingFn) {  // function factory
	return function(proto, authorId, dontIgnoreEmpty) {
		if(proto[propName]) {
	        if((proto[propName] instanceof Array)) {
	        	if(proto[propName].length) {
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
		        } else if(dontIgnoreEmpty) {
		        	return true;
		        }
	        } else {
	            throw Errors.WrongData();
	        }
	    }
	    
        delete proto[propName];
        
        return true;
	}
}


function _createPublishFn(prop, restrictFn) { // function factory
	return function(source1, source2) {
		var source = Array.create(source1[prop] ? source1[prop] : (source2 && source2[prop] ? source2[prop] : [ ]));

		return source
			.map(function(obj) {
				return restrictFn(obj.values);
			})
			.unique(true); // required until Sequelize returns duplicated objects in collections of pictures and tags
	}
}


var _publishPictures = _createPublishFn('pictures', restrict.imagePublic),
	_publishTags = _createPublishFn('tags', restrict.tagPublic),
	_setPictures = _createSetFn('pictures', 'Image', restrict.imageSearch, function(proto) {
			proto = proto.toString();

			return {
                originalUrl: proto,
                filename: md5(proto)
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
			} else if(!proto.recipe || !String.isUrl(proto.recipe)) {
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

		        return q.all(proto.pictures.map(function(picture) {
		    		return r.fetch(picture.originalUrl).then(function() {
	    				    return r.save(picture.filename);
	    			    });
		    		}));
		    } else {
		    	return true;
		    }
		},
		Errors.report('Database')
	).then(
		function(savingResults) {
			if(savingResults instanceof Array) {
			    return q.all(savingResults.map(function(file, index) {
			        proto.pictures[index].filename = file;
			        
			        return proto.pictures[index].save([ 'filename' ]);
			    }));
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
			if(proto.pictures) {
		        return template.setPictures(proto.pictures);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
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
            			    recipe: restrict.recipePublic(recipe),
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
				                recipe: restrict.recipePublic(template.values.recipe),
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
		    
			return _setPictures(proto, template.values.author.values.id, !!"don't ignore empty");
		},
		Errors.report('Database')
	).then(
		function(pictures) {
			if(pictures instanceof Array) {
		        proto.pictures = pictures;

		        return q.all(proto.pictures.map(function(picture) {
		    		return r.fetch(picture.originalUrl).then(function() {
	    				    return r.save(picture.filename);
	    			    });
		    		}));
		    } else {
		    	return true;
		    }
		},
		Errors.report('Database')
	).then(
		function(savingResults) {
			if(savingResults instanceof Array) {
			    return q.all(savingResults.map(function(file, index) {
			        proto.pictures[index].filename = file;
			        
			        return proto.pictures[index].save([ 'filename' ]);
			    }));
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function(savingResults) {
		    if(proto.pictures) {
		        return template.setPictures(proto.pictures);
		    } else {
		        return true;
		    }
		},
		Errors.report('Database')
	).then(
		function() {
		    return _setTags(proto, template.values.author.values.id, !!"don't ignore empty");
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
			                recipe: restrict.recipePublic(template.values.recipe),
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
			                recipe: restrict.recipePublic(template.values.recipe),
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

	r = new Resource([ 'image/jpeg', 'image/png' ], app.get('root') + '/public/images');

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy,
		public: restrict.public
	};
};