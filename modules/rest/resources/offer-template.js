var Sequelize = $require('sequelize'),
    auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'title', 'description', 'recipe' ],
		recipePublic: [ 'id', 'url' ],
		imagePublic: [ 'id', 'filename' ],
		create: [ 'title', 'description' ],
		update: [ 'title', 'description', 'pictures' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var DB, OfferTemplate, Recipe, Image, User;


function _setPictures(proto, authorId) {
    if(proto.pictures) {
        if((proto.pictures instanceof Array) && proto.pictures.length) {
            var chainer = new Sequelize.Utils.QueryChainer;
            
            var pictures = proto.pictures.map(function(proto) {
                if(!proto) {
                    return null;
                } else {
                    proto = proto.toString();
                    
	                proto = {
	                    originalUrl: proto,
	                    filename: new RegExp('^(.*/)([^/]*)$').exec(proto)[2]
	                };
	                
	                var img = Image.findOrCreate({ originalUrl: proto.originalUrl }, { filename: proto.filename, AuthorId: authorId });
	                
	                chainer.add(img);
	                
	                return img;
                }
            }).filter(function(img) {
                return !!img;
            });
            
            if(pictures.length) {
	            return chainer.run();
            } else {
                throw Errors.WrongData();
            }
        } else {
            throw Errors.WrongData();
        }
    } else {
        delete proto.pictures;
        
        return true;
    }
}


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
		    
		    return _setPictures(proto, user.values.id);
		},
		Errors.report('Database')
	).then(
		function(pictures) {
		    if(pictures instanceof Array) {
		        proto.pictures = pictures;
		    }
		    
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
		    
		    if(proto.pictures) {
		        return template.setPictures(proto.pictures);
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
            				pictures: (proto.pictures ? proto.pictures.map(function(image) { return restrict.imagePublic(image.values); }) : [ ])
        				})
    				};
		},
		Errors.report('Database')
	);
}


function retrieve(params, authData) {
	return OfferTemplate.find({ where: restrict.search(params), include: [ Recipe, { model: Image, as: 'Pictures' } ] }).then(
		function(template) {
			if(!!template) {
				return { resource: extend(restrict.public(template.values), {
				                recipe: restrict.recipePublic(template.values.recipe.values),
					            author: template.values.AuthorId,
					            pictures: template.pictures.map(function(image) { return restrict.imagePublic(image.values); })
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
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, { model: Image, as: 'Pictures' }, Recipe ] });
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
			return { resource: extend(restrict.public(template.values), {
			                recipe: restrict.recipePublic(template.values.recipe.values),
				            author: template.values.AuthorId,
				            pictures: (proto.pictures ? proto.pictures : template.pictures).map(function(image) { return restrict.imagePublic(image.values); })
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
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, { model: Image, as: 'Pictures' }, Recipe ] });
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
				            pictures: template.pictures.map(function(image) { return restrict.imagePublic(image.values); })
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
	User = DB.User,
	Image = DB.Image;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};

module.exports['public'] = restrict.public;