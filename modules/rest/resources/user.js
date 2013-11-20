var auth = $require('/modules/auth'),
    Errors = $require('/modules/rest/errors'),
    locate = $require('/modules/locate'),
    md5 = $require('MD5'),
    Resource = $require('/modules/resource'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'authService', 'fullName', 'gender', 'site' ],
        avatarPublic: [ 'id', 'filename' ],
        placePublic: [ 'id', 'serviceId' ],
        create: [ 'authService', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
        createSearch: [ 'authService', 'serviceId', 'deletedAt' ],
        update: [ 'firstName', 'lastName', 'gender', 'site' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search', 'createSearch' ] );


var User, Place, Image,
    resourceTypes, resourcePath;

function create(authData, proto) {
    var user, existed, place, avatar, updateProps = [ ];
    
    return auth(authData.service, authData.userId, authData.accessToken).then(
        function(serviceId) {
            proto.authService = authData.service;
            proto.serviceId = serviceId;

            return User.find({ where: restrict.createSearch(proto), include: [ Place, { model: Image, as: 'Avatar' } ] });
        },
        Errors.report('Authentication')
    ).then(
        function(_user) {
            if(_user) {
                existed = true;

                return _user;
            } else if((proto.firstName && proto.firstName.length) && (proto.lastName && proto.lastName.length)) {
                var p = restrict.create(proto);

                return User.create(p, Object.keys(p));
            } else {
                throw new Errors.WrongData();
            }
        },
        Errors.report('Database')
    ).then(
        function(_user) {
            if(_user) {
                user = _user;
            }

            if(!existed && !!proto.place) {
                return locate(proto.place);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(place) {
            if(!existed && !place) {
                throw new Errors.WrongData();
            } else if(!existed && (place !== true)) {
                return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(_place) {
            if(!existed && (_place !== true)) {
                place = _place;
                user.PlaceId = place.values.id;
                
                updateProps.push('PlaceId');
            } 

            if(!existed && !!proto.avatar) {
                return Image.findOrCreate({ originalUrl: proto.avatar }, { filename: new RegExp('^(.*/)([^/]*)$').exec(proto.avatar)[2], AuthorId: user.id });
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(_avatar) {
            if(!existed && (_avatar !== true)) {
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
		Errors.report('Database')
	).then(
        function(savingResult) {
            if(!existed && (savingResult !== true)) {
                avatar.filename = savingResult;
                
                return avatar.save(/*[ 'filename '] -- for some reason with this restriction saving doesn't work */);
            } else {
                return true;
            }
        },
		Errors.report('Database')
	).then(
        function() {
            if(!existed && updateProps.length) {
                return user.save(updateProps);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function() {
            return { resource: extend(restrict.public(user), {
                            avatar: (avatar ? restrict.avatarPublic(avatar) : (user.values.avatar ? restrict.avatarPublic(user.values.avatar) : 0)),
                            place: (place ? restrict.placePublic(place) : (user.values.place ? restrict.placePublic(user.values.place) : 0))
                        }),
                    existed: existed
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
                            avatar: (user.values.avatar ? restrict.avatarPublic(user.values.avatar) : 0),
                            place: (user.values.place ? restrict.placePublic(user.values.place) : 0)
                        })
                };
            }
        },
        Errors.report('Database')
    );
}


function update(params, authData, proto) {
    var user, place, avatar, updateProps = [ ];
    
    return auth(authData.service, authData.userId, authData.accessToken).then(
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
                throw new Errors.WrongData();
            } else if(place !== true) {
                return Place.findOrCreate({ serviceId: place.id }, { name: place.name, AuthorId: user.id });
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(
        function(_place) {
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
        Errors.report('Database')
    ).then(
        function(_avatar) {
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
        Errors.report('Database')
    ).then(
        function(savingResult) {
            if(savingResult !== true) {
                avatar.filename = savingResult;
                
                return avatar.save(/*[ 'filename '] -- for some reason with this restriction saving doesn't work */);
            } else {
                return true;
            }
        },
        Errors.report('Database')
    ).then(function() {
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
                            avatar: (avatar ? restrict.avatarPublic(avatar) : (user.values.avatar ? restrict.avatarPublic(user.values.avatar) : 0)),
                            place: (place ? restrict.placePublic(place) : (user.values.place ? restrict.placePublic(user.values.place) : 0))
                        })
                };
        },
        Errors.report('Database')
    );
}


function destroy(params, authData) {
    var user, serviceId;
    
    return auth(authData.service, authData.userId, authData.accessToken).then(
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


module.exports = function(app) {
    var DB = app.get('db');

    User = DB.User;
    Place = DB.Place;
    Image = DB.Image;
    resourceTypes = [ 'image/jpeg', 'image/png' ];
    resourcePath = app.get('root') + '/public/images';

    return {
        create: create,
        retrieve: retrieve,
        update: update,
        destroy: destroy
    }
};