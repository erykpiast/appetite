var Errors = $require('/modules/errors'),
    locate = $require('/modules/locate'),
    md5 = $require('MD5'),
    Resource = $require('/modules/resource'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'fullName', 'gender', 'site' ],
        avatarPublic: [ 'id', 'filename' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'authService', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
        authDataCreateSearch: [ 'service', 'serviceId', 'deletedAt' ],
        authDataCreate: [ 'service', 'serviceId', 'accessToken', 'tokenExpires' ],
        createSearch: [ 'id', 'deletedAt' ],
        update: [ 'firstName', 'lastName', 'gender', 'site' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search', 'createSearch', 'authDataCreateSearch' ] );


var User, AuthData, Place, Image,
    resourceTypes, resourcePath;

function create(authData, proto) {
    var user, existed, place, avatar, updateProps = [ ];

    return User.find({ where: { AuthDataId: authData.storedId }, include: [ Place, { model: Image, as: 'Avatar' } ] })
    .then(function(_user) {
        if(_user) {
            existed = true;
            user = _user;

            return _user;
        } else if(!(authData.service && authData.serviceId)) {
            throw new Errors.Authentication();
        } else if(!(proto.firstName && proto.firstName.length) || !(proto.lastName && proto.lastName.length)) {
            throw new Errors.WrongData();
        } else {
            return AuthData.find({ where: restrict.authDataCreateSearch(authData) })
            .then(function(storedAuthData) {
                if(storedAuthData) {
                    throw new Errors.Internal('CONCURRENCY'); // auth data entity was created by concurrent request, so it's kind of semaphore
                } else {
                    var p;
                    return AuthData.create(p = restrict.authDataCreate(authData), Object.keys(p));
                }
            },
            Errors.report('Internal', 'DATABASE'))
            .then(function(authData) {
                if(authData) {
                    var p;
                    return User.create(p = extend(restrict.create(proto), {
                        AuthDataId: authData.id
                    }), Object.keys(p))
                } else {
                    throw new Errors.Database();
                }
            },
            Errors.report('Internal', 'DATABASE'))
            .then(function(_user) {
                if(_user) {
                    user = _user;

                    if(!!proto.place) {
                        return locate(proto.place);
                    } else {
                        return true;
                    }
                } else {
                    throw new Errors.Database();
                }
            },
            Errors.report('Internal', 'DATABASE')
            ).then(function(place) {
                if(!place) {
                    throw new Errors.WrongData();
                } else if(place !== true) {
                    return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
                } else {
                    return true;
                }
            },
            Errors.report('Internal', 'DATABASE')
            ).then(function(_place) {
                if(_place !== true) {
                    if(!!_place) {
                        place = _place;
                        user.PlaceId = place.values.id;
                        
                        updateProps.push('PlaceId');
                    } else {
                        throw new Errors.Database();
                    }
                }

                if(!!proto.avatar) {
                    return Image.findOrCreate({ originalUrl: proto.avatar }, { filename: new RegExp('^(.*/)([^/]*)$').exec(proto.avatar)[2], AuthorId: user.id });
                } else {
                    return true;
                }
            },
            Errors.report('Internal', 'DATABASE')
            ).then(function(_avatar) {
                if(_avatar !== true) {
                    if(!!_avatar) {
                        avatar = _avatar;
                        
                        user.AvatarId = avatar.values.id;
                        
                        updateProps.push('AvatarId');
                        
                        var r = new Resource(resourceTypes, resourcePath);

                        return r.fetch(avatar.originalUrl).then(function() {
                                    return r.save(md5(avatar.filename));
                                });
                    } else {
                        throw new Errors.Database();
                    }
                } else {
                    return true;
                }
            },
            Errors.report('Internal', 'DATABASE')
            ).then(function(savingResult) {
                if(savingResult !== true) {
                    if(!!savingResult) {
                        avatar.filename = savingResult;
                        
                        return avatar.save(/*[ 'filename '] -- for some reason with this restriction saving doesn't work */);
                    } else {
                        throw new Errors.Database();
                    }
                } else {
                    return true;
                }
            },
            Errors.report('Internal', 'DATABASE')
            ).then(function() {
                if(updateProps.length) {
                    return user.save(updateProps);
                } else {
                    return true;
                }
            },
            Errors.report('Internal', 'DATABASE'));
        }
    },
    Errors.report('Internal', 'DATABASE'))
    .then(function() {
        return { resource: extend(restrict.public(user), {
                        authService: authData.serviceName,
                        avatar: (avatar ? restrict.avatarPublic(avatar) : (user.avatar ? restrict.avatarPublic(user.avatar) : 0)),
                        place: (place ? restrict.placePublic(place) : (user.place ? restrict.placePublic(user.place) : 0))
                    }),
                existed: existed
            };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    return User.find({ where: restrict.search(params), include: [ Place, AuthData, { model: Image, as: 'Avatar' } ] })
    .then(function(user) {
        if(!user) {
            throw new Errors.NotFound();
        } else {
            return { resource: extend(restrict.public(user), {
                        authService: user.authData.serviceName,
                        avatar: (user.avatar ? restrict.avatarPublic(user.avatar) : 0),
                        place: (user.place ? restrict.placePublic(user.place) : 0)
                    })
            };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    var user, place, avatar, updateProps = [ ];

    return User.find({ where: { id: params.id }, include: [ Place, AuthData, { model: Image, as: 'Avatar' } ] })
    .then(function(_user) {
        user = _user;

        if(!user) {
            return new Errors.NotFound();
        } else if(user.AuthDataId !== authData.storedId) {
            return new Errors.Authentication();
        } else if(proto.place) {
            return locate(proto.place);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(place) {
        if(!place) {
            throw new Errors.WrongData();
        } else if(place !== true) {
            return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_place) {
        if(_place !== true) {
            place = _place;
            user.PlaceId = place.values.id;
            
            updateProps.push('PlaceId');
        }
        
        if(proto.avatar) {
            return Image.findOrCreate({ originalUrl: proto.avatar }, { filename: new RegExp('^(.*/)([^/]*)$').exec(proto.avatar)[2], AuthorId: user.id });
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(_avatar) {
        if(_avatar !== true) {
            avatar = _avatar;
            
            user.AvatarId = avatar.values.id;
            
            updateProps.push('AvatarId');
            
            var r = new Resource(resourceTypes, resourcePath);

            return r.fetch(avatar.originalUrl).then(function() {
                        return r.save(md5(avatar.filename));
                    });
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(savingResult) {
        if(savingResult !== true) {
            avatar.filename = savingResult;
            
            return avatar.save(/*[ 'filename '] -- for some reason with this restriction saving doesn't work */);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        updateProps = updateProps.concat(Object.keys(restrict.update(proto)));

        extend(user, restrict.update(proto));
        
        if(updateProps.length) {
            return user.save(updateProps);
        } else {
            return true;
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(user), {
                        authService: user.authData.serviceName,
                        avatar: (avatar ? restrict.avatarPublic(avatar) : (user.avatar ? restrict.avatarPublic(user.avatar) : 0)),
                        place: (place ? restrict.placePublic(place) : (user.place ? restrict.placePublic(user.place) : 0))
                    })
            };
    },
    Errors.report('Internal', 'DATABASE'));
}


function destroy(params, authData) {
    var user;
    
    return User.find({ where: { id: params.id }, include: [ Place, AuthData, { model: Image, as: 'Avatar' } ] })
    .then(function(_user) {
        user = _user;

        if(!user) {
            return new Errors.NotFound();
        } else if(user.AuthDataId !== authData.storedId) {
            return new Errors.Authentication();
        } else {
            return user.destroy();
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function() {
        return { resource: extend(restrict.public(user), {
                        authService: user.authData.serviceName,
                        avatar: (user.avatar ? restrict.avatarPublic(user.avatar) : 0),
                        place: (user.place ? restrict.placePublic(user.place) : 0)
                    })
            };
    },
    Errors.report('Internal', 'DATABASE'));
}


module.exports = function(app) {
    var DB = app.get('db');

    User = DB.User;
    AuthData = DB.AuthData;
    Place = DB.Place;
    Image = DB.Image;
    resourceTypes = [ 'image/jpeg', 'image/png' ];
    resourcePath = app.get('uploadsDir');

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy
    }
};