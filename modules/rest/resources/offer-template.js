var Sequelize = $require('sequelize'),
    Resource = $require('/modules/resource'),
    md5 = $require('MD5'),
    Errors = $require('/modules/errors'),
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

var DB, OfferTemplate, Recipe, Image, Tag, User, resourceTypes, resourcePath;


function _createSetFn(propName, modelName, searchRestrictFn, protoProcessingFn) {  // function factory
    return function(proto, authorId, dontIgnoreEmpty) {
        if(proto[propName]) {
            if((proto[propName] instanceof Array)) {
                if(proto[propName].length) {
                    var chainer = new Sequelize.Utils.QueryChainer();
                    
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
                        throw new Errors.WrongData();
                    }
                } else if(dontIgnoreEmpty) {
                    return true;
                }
            } else {
                throw new Errors.WrongData();
            }
        }
        
        delete proto[propName];
        
        return true;
    };
}


function _createPublishFn(prop, restrictFn) { // function factory
    return function(source1, source2) {
        var source = Array.create(source1[prop] ? source1[prop] : (source2 && source2[prop] ? source2[prop] : [ ]));

        return source
            .map(function(obj) {
                return restrictFn(obj);
            })
            .unique(true); // required until Sequelize returns duplicated objects in collections of pictures and tags
    };
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
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user || !proto.recipe || !String.isUrl(proto.recipe) || !proto.description || !proto.title) {
            throw new Errors.WrongData();
        } else {
            return Recipe.findOrCreate({ url: proto.recipe }, { AuthorId: user.id });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_recipe) {
        recipe = _recipe;
        
        var p;
        return OfferTemplate.create(p = extend(restrict.create(proto), {
                AuthorId: user.id,
                RecipeId: recipe.id
            }), Object.keys(p));
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_template) {
        template = _template;
        
        return _setPictures(proto, user.id);
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(pictures) {
        if(pictures instanceof Array) {
            proto.pictures = pictures;

            return Q.all(proto.pictures.map(function(picture) {
                var r = new Resource(resourceTypes, resourcePath);

                return r.fetch(picture.originalUrl).then(function() {
                        return r.save(picture.filename);
                    });
                }));
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(savingResults) {
        if(savingResults instanceof Array) {
            return Q.all(savingResults.map(function(file, index) {
                proto.pictures[index].filename = file;
                
                return proto.pictures[index].save([ 'filename' ]);
            }));
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        if(proto.pictures) {
            return template.setPictures(proto.pictures);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return _setTags(proto, user.id);
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(tags) {
        if(tags instanceof Array) {
            proto.tags = tags;
        }

        if(proto.tags) {
            return template.setTags(proto.tags);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(template), {
                        recipe: restrict.recipePublic(recipe),
                        author: user.id,
                        pictures: _publishPictures(proto),
                        tags: _publishTags(proto)
                    })
                };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    return OfferTemplate.find({ where: restrict.search(params), include: [ Recipe, Tag, { model: Image, as: 'Pictures' } ] })
    .then(function(template) {
        if(!template) {
            throw new Errors.NotFound();
        } else {
            return { resource: extend(restrict.public(template), {
                            recipe: restrict.recipePublic(template.recipe),
                            author: template.AuthorId,
                            pictures: _publishPictures(template),
                            tags: _publishTags(template)
                        })
                   };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    var user, template;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.Authentication();
        } else {
            return OfferTemplate.find({ where: restrict.search(params), include: [ { model: Image, as: 'Pictures' }, Tag, Recipe ] });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_template) {
        template = _template;

        if(!template) {
            throw new Errors.NotFound();    
        } else if(user.id !== template.AuthorId) {
            throw new Errors.Authentication();
        } else {
            var newAttrs = restrict.update(proto);
            
            extend(template, newAttrs);
            
            return template.save(Object.keys(newAttrs));
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_template) {
        template = _template;
        
        return _setPictures(proto, template.AuthorId, !!'don\'t ignore empty');
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(pictures) {
        if(pictures instanceof Array) {
            proto.pictures = pictures;

            return Q.all(proto.pictures.map(function(picture) {
                var r = new Resource(resourceTypes, resourcePath);

                return r.fetch(picture.originalUrl).then(function() {
                        return r.save(picture.filename);
                    });
                }));
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(savingResults) {
        if(savingResults instanceof Array) {
            return Q.all(savingResults.map(function(file, index) {
                proto.pictures[index].filename = file;
                
                return proto.pictures[index].save([ 'filename' ]);
            }));
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        if(proto.pictures) {
            return template.setPictures(proto.pictures);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return _setTags(proto, template.AuthorId, !!'don\'t ignore empty');
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(tags) {
        if(tags instanceof Array) {
            proto.tags = tags;
        }
        
        if(proto.tags) {
            return template.setTags(proto.tags);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(template), {
                        recipe: restrict.recipePublic(template.recipe),
                        author: template.AuthorId,
                        pictures: _publishPictures(proto, template),
                        tags: _publishTags(proto, template)
                    })
                };
    },
    Errors.report('Internal', 'DATABASE'));
}


function destroy(params, authData) {
    var user, template;
    
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(_user) {
        user = _user;

        if(!user) {
            throw new Errors.Authentication();
        } else {
            return OfferTemplate.find({ where: restrict.search(params), include: [ { model: Image, as: 'Pictures' }, Tag, Recipe ] });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_template) {
        template = _template;

        if(!template) {
            throw new Errors.NotFound();    
        } else if(user.id !== template.AuthorId) {
            throw new Errors.Authentication();
        } else {
            return template.destroy();
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(template), {
                        recipe: restrict.recipePublic(template.recipe),
                        author: template.AuthorId,
                        pictures: _publishPictures(template),
                        tags: _publishTags(template)
                    })
               };
    },
    Errors.report('Internal', 'DATABASE'));
}


module.exports = function(app) {
    DB = app.get('db');
    OfferTemplate = DB.OfferTemplate;
    Recipe = DB.Recipe;
    User = DB.User;
    Image = DB.Image;
    Tag = DB.Tag;
    resourceTypes = [ 'image/jpeg', 'image/png' ];
    resourcePath = app.get('uploadsDir');

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy
    };
};