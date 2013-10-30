var auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'authService', 'fullName', 'gender', 'site' ],
        avatarPublic: [ 'id', 'filename' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'authService', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
        createSearch: [ 'authService', 'serviceId', 'deletedAt' ],
        update: [ 'firstName', 'lastName', 'gender', 'site' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search', 'createSearch' ] );

var app, DB, User, Place, Image;

function create(authData, proto) {
    var user, created, place, avatar, updateProps = [ ];
    
    return auth(authData.service, authData.accessToken).then(
        function(serviceId) {
            proto.authService = authData.service;
            proto.serviceId = serviceId;

            return User.find({ where: restrict.createSearch(proto), include: [ Place, { model: Image, as: 'Avatar' } ] });
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            if(_user) {
                return _user;
            } else {
                var p = restrict.create(proto);

                created = true;

                return User.create(p, Object.keys(p));
            }
        },
        Errors.report('Database')
    ).then(
        function(_user) {
            if(!!_user && (_user !== true)) {
                user = _user;
            }

            if(proto.place) {
                return locate(proto.place);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(place) {
            if(!place) {
                throw Errors.WrongData();
            } else if(place !== true) {
                return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(_place) {
            if((_place !== true) && !!_place) {
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
        Errors.report('Database')
    ).then(
        function(_avatar) {
            if((_avatar !== true) && !!_avatar) {
                avatar = _avatar;
                user.AvatarId = avatar.values.id;
                
                updateProps.push('AvatarId');
            }
            
            if(updateProps.length) {
                return user.save(updateProps);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(user), {
                            avatar: (avatar ? restrict.avatarPublic(avatar.values) : (user.values.avatar ? restrict.avatarPublic(user.values.avatar.values) : 0)),
                            place: (place ? restrict.placePublic(place.values) : (user.values.place ? restrict.placePublic(user.values.place.values) : 0))
                        }),
                    existed: !created
                };
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {
    return User.find({ where: restrict.search(params), include: [ Place, { model: Image, as: 'Avatar' } ] }).then(
        function(user) {
            if(!user) {
                throw new Errors.NotFound();
            } else {
                return { resource: extend(restrict.public(user), {
                            avatar: (user.values.avatar ? restrict.avatarPublic(user.values.avatar.values) : 0),
                            place: (user.values.place ? restrict.placePublic(user.values.place.values) : 0)
                        })
                };
            }
        },
        Errors.report('Database')
    );
}


function update(params, authData, proto) {
    var user, place, avatar, updateProps = [ ];
    
    return auth(authData.service, authData.accessToken).then(
        function(serviceId) {
            proto.authService = authData.service;
            proto.serviceId = serviceId;

            return User.find({ where: restrict.createSearch(proto), include: [ Place, { model: Image, as: 'Avatar' } ] });
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            user = _user;
            
            if(proto.place) {
                return locate(proto.place);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(place) {
            if(!place) {
                throw Errors.WrongData();
            } else if(place !== true) {
                return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(_place) {
            if((_place !== true) && !!_place) {
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
        Errors.report('Database')
    ).then(
        function(_avatar) {
            if((_avatar !== true) && !!_avatar) {
                avatar = _avatar;
                user.AvatarId = avatar.values.id;
                
                updateProps.push('AvatarId');
            }

            updateProps = updateProps.concat(Object.keys(restrict.update(proto)));

            extend(user, restrict.update(proto));
            
            if(updateProps.length) {
                return user.save(updateProps);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(user), {
                            avatar: (avatar ? restrict.avatarPublic(avatar.values) : (user.values.avatar ? restrict.avatarPublic(user.values.avatar.values) : 0)),
                            place: (place ? restrict.placePublic(place.values) : (user.values.place ? restrict.placePublic(user.values.place.values) : 0))
                        })
                };
        },
        Errors.report('Database')
    );
}


function destroy(params, authData) {
    var user, serviceId;
    
    return auth(authData.service, authData.accessToken).then(
        function(_serviceId) {
            serviceId = _serviceId;
            
            if(serviceId) {
                return User.find({ where: restrict.search(params), include: [ Place, { model: Image, as: 'Avatar' } ] });
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            user = _user;
            
            if(!user) {
                throw new Errors.NotFound();
            } else if(serviceId === user.values.serviceId) {
                return user.destroy();
            } else {
                throw new Errors.Authentication();
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(user), {
                            avatar: (user.values.avatar ? restrict.avatarPublic(user.values.avatar.values) : 0),
                            place: (user.values.place ? restrict.placePublic(user.values.place.values) : 0)
                        })
                };
        },
        Errors.report('Database')
    );
}


module.exports = function(_app) {
    app = _app;
    DB = app.get('db');
    User = DB.User;
    Place = DB.Place;
    Image = DB.Image;

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy
    }
};