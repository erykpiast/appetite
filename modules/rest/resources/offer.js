var auth = $require('/modules/auth'),
    locate = $require('/modules/locate'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'startedAt', 'endAt', 'PlaceId', 'TemplateId', 'AuthorId' ],
        placePublic: [ 'id', 'name', 'latitude', 'longitude' ],
        create: [ 'title', 'description' ],
        update: [ 'title', 'description' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var Offer, Template, Place, User;

function create(proto) {
    var deffered = Q.defer();

    auth(proto.authService, proto.accessToken).then(
        function(serviceId) {
            var userSearch = {
                    serviceId: serviceId,
                    authService: proto.authService,
                    deletedAt: null
                };
                
            User.find({ where: userSearch }).then(
                function(user) {
                    if(user) {
                        if(proto.template) {
                            var templateProto = { id: proto.template };

                            Template.find({ where: templateProto, include: [ { model: User, as: 'Author' } ] }).then(
                                function(template) {
                                    var templateOwnerId = template.values.author.values.id;
                                    
                                    if(template && (user.id === templateOwnerId)) {
                                        locate(proto.place).then(
                                            function(place) {
                                                var placeProto = {
                                                        serviceId: proto.place,
                                                        name: place.name
                                                    };

                                                Place.findOrCreate(placeProto, { AuthorId: user.id }).then(
                                                    function(place) {
                                                        proto = restrict.create(proto);
                        
                                                        proto.AuthorId = user.id;
                        
                                                        Offer.create(proto).then(
                                                            function(offer) {
                                                                offer = restrict.public(offer);
                                                                offer.place = restrict.placePublic(place.values);
                    
                                                                deffered.resolve({ resource: offer } );
                                                            },
                                                            function() {
                                                                deffered.reject(new Errors.Database());
                                                            }
                                                        );
                                                    },
                                                    function() {
                                                        deffered.reject(new Errors.Database());
                                                    }
                                                );
                                            },
                                            function() {
                                                deffered.reject(new Errors.WrongData());
                                            }
                                        );
                                    } else {
                                        deffered.reject(new Errors.Authentication());
                                    }
                                },
                                function() {
                                    deffered.reject(new Errors.Database());
                                }
                            );
                        } else {
                            deffered.reject(new Errors.WrongData());
                        }
                    } else {
                        deffered.reject(new Errors.Authentication());
                    }
                },
                function() {
                    deffered.reject(new Errors.Authentication());
                }
            )
        },
        function() {
            deffered.reject(new Errors.Authentication());
        }
    );

    return deffered.promise;
}


function retrieve(proto) {
    var deffered = Q.defer();

    var search = restrict.search(proto);

    OfferTemplate.find({ where: search, include: [ Recipe ] }).then(
        function(template) {
            if(!!template) {
                template = restrict.public(template);
                template.recipe = restrict.recipePublic(template.recipe);

                deffered.resolve({
                        resource: template
                    }
                );
            } else {
                deffered.reject(new Errors.NotFound());
            }
        },
        function() {
            deffered.reject(new Errors.Database());
        }
    );

    return deffered.promise;
}


function update(proto) {
    var deffered = Q.defer();

    var search = restrict.search(proto);

    OfferTemplate.find({ where: search, include: [ { model: User, as: 'Author' } ] }).then(
        function(template) {
            if(!!template) {
                auth(proto.authService, proto.accessToken).then(
                    function(serviceId) {
                        var templateOwnerServiceId = template.values.author.values.serviceId;

                        if(serviceId && (serviceId === templateOwnerServiceId)) {
                            proto = restrict.update(proto);
            
                            template.updateAttributes(proto).then(
                                function(template) {
                                    template.getRecipe().then(
                                        function(recipe) {
                                            template = restrict.public(template.values);
                                            template.recipe = restrict.recipePublic(recipe.values);

                                            deffered.resolve({ resource: template });
                                        },
                                        function() {
                                            deffered.reject(new Errors.Database());
                                        }
                                    );
                                },
                                function() {
                                    deffered.reject(new Errors.Database());
                                }
                            );

                        } else {
                            deffered.reject(new Errors.Authentication());   
                        }
                    },
                    function(err) {
                        deffered.reject(new Errors.Authentication());
                    }
                );
            } else {
                deffered.reject(new Errors.NotFound());
            }
        },
        function() {
            deffered.reject(new Errors.Database());
        }
    );

    return deffered.promise;
}


function destroy(proto) {
    var deffered = Q.defer();

    var search = restrict.search(proto);

    OfferTemplate.find({ where: search, include: [ { model: User, as: 'Author' } ] }).then(
        function(template) {
            if(!!template) {
                auth(proto.authService, proto.accessToken).then(
                    function(serviceId) {
                        var templateOwnerServiceId = template.values.author.values.serviceId;

                        if(serviceId && (serviceId === templateOwnerServiceId)) {
                            template.getRecipe().then(
                                function(recipe) {
                                    template.destroy().then(
                                        function() {
                                            template = restrict.public(template.values);
                                            template.recipe = restrict.recipePublic(recipe.values);

                                            deffered.resolve({ resource: template });
                                        },
                                        function() {
                                            deffered.reject(new Errors.Database());
                                        }
                                    );
                                },
                                function() {
                                    deffered.reject(new Errors.Database());
                                }
                            );
                        } else {
                            deffered.reject(new Errors.Authentication());   
                        }
                    },
                    function(err) {
                        deffered.reject(new Errors.Authentication());
                    }
                );
            } else {
                deffered.reject(new Errors.NotFound());
            }
        },
        function() {
            deffered.reject(new Errors.Database());
        }
    );

    return deffered.promise;
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