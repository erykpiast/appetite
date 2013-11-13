var auth = $require('/modules/auth'),
    Errors = $require('/modules/rest/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'type' ],
        create: [ 'type' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var DB, Rating, Response, Offer, User;


function create(authData, proto) {
    var user, response;

    proto.userId = parseInt0(proto.userId);

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
            if(!_user) {
                throw new Errors.Authentication();
            } else if(!proto.response || !proto.type) {
                throw new Errors.WrongData();
            } else {
                user = _user;

                return Response.find({ where: {
                    id: proto.response
                }, include: [ Offer ] });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(_response) {
            if(!_response) {
                throw new Errors.WrongData();
            } else if((user.id !== _response.AuthorId) || (_response.offer.AuthorId !== proto.userId) || !_response.accepted) {
                throw new Errors.Authentication();
            } else {
                response = _response;

                return Rating.find({ where: { ResponseId: response.id, AuthorId: user.id } });
            }
        },
        Errors.report('Authentication')
    ).then(
        function(rating) {
            if(!!rating) {
                throw new Errors.WrongData();
            } else {
                var p = extend(restrict.create(proto), {
                        AuthorId: user.id,
                        TargetId: proto.userId,
                        ResponseId: response.id
                    });

                return Rating.create(p, Object.keys(p));    
            }
        },
        Errors.report('Database')
    ).then(
        function(rating) {
            if(!rating) {
                throw new Errors.Database();
            } else {
                return {
                        resource: extend(restrict.public(rating), {
                            author: user.id,
                            target: response.offer.AuthorId,
                            response: response.id
                        })
                    };
            }
        },
        Errors.report('Database')
    );
}


function retrieve(params, authData) {
    return Rating.find({ where: restrict.search(params) }).then(
        function(rating) {
            if(!!rating) {
                return {
                        resource: extend(restrict.public(rating), {
                            author: rating.AuthorId,
                            target: rating.TargetId,
                            response: rating.ResponseId
                        })
                    };
            } else {
                throw new Errors.NotFound();
            }
        },
        Errors.report('Database')
    );
}


function countAllForUser(params, authData) {
    return User.find({ where: { id: params.userId, deletedAt: null } }).then(
        function(user) {
            if(!user) {
               throw new Errors.NotFound(); 
            } else {
                return DB.sequelize.query('SELECT `type`, COUNT(*) AS "value" FROM `' + Rating.tableName + '` WHERE `TargetId`=' + user.id + ' AND `deletedAt` IS NULL GROUP BY `type`');
            }
        },
        Errors.report('Database')
    ).then(
        function(res) {
            if(!!res) {
                var values = { };

                res.forEach(function(res) {
                    values[res.type + 's'] = res.value;
                });

                return {
                        resource: {
                            positives: values.positives || 0,
                            negatives: values.negatives || 0
                        }
                    };
            } else {
                throw new Errors.NotFound();
            }
        },
        Errors.report('Database')
    );
}


function update(params, authData, proto) {
    throw new Errors.Authentication();
}


function destroy(params, authData) {
    throw new Errors.Authentication();
}


module.exports = function(app) {
    DB = app.get('db');
    Rating = DB.UserRating;
    Response = DB.Response;
    Offer = DB.Offer;
    User = DB.User;

    return {
        create: create,
        retrieve: retrieve,
        countAllForUser: countAllForUser,
        update: update,
        destroy: destroy
    }
};