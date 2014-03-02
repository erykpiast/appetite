var Errors = $require('/modules/errors'),
    restrict = $require('/modules/rest/restrict')({
        public: [ 'id', 'text' ],
        create: [ 'text' ],
        search: [ 'id', 'deletedAt' ]
    }, [ 'public', 'search' ] );

var Tag, User;


function create(authData, proto) {
    return User.find({ where: { AuthDataId: authData.storedId } })
    .then(function(user) {
        if(!user) {
            throw new Errors.Authentication();
        } else if(!proto.text) {
            throw new Errors.WrongData();
        } else {
            return Tag.findOrCreate({ text: proto.text }, { AuthorId: user.id });
        }
    },
    Errors.report('Internal', 'DATABASE')
    ).then(function(tag) {
        return { resource: restrict.public(tag) };
    },
    Errors.report('Internal', 'DATABASE'));
}


function retrieve(params, authData) {
    return Tag.find({ where: restrict.search(params) }).then(
        function(tag) {
            if(!tag) {
                throw new Errors.NotFound();
            } else {
                return { resource: restrict.public(tag) };
            }
        },
        Errors.report('Internal', 'DATABASE')
    );
}


function retrieveAll(params, authData) {
    var offset = parseInt0(params.offset),
        limit = parseInt0(params.limit) || 10;

    return Tag.findAll({ where: { deletedAt: null }, offset: offset, limit: limit })
    .then(function(tags) {
        if(!tags || !tags.length) {
            throw new Errors.NotFound();
        } else {
            return {
                resource: tags.map(function(tag) {
                        return restrict.public(tag);
                    })
                };
        }
    },
    Errors.report('Internal', 'DATABASE'));
}


function update(params, authData, proto) {
    throw new Errors.Authentication();
}


function destroy(params, authData) {
    throw new Errors.Authentication();
}


module.exports = function(app) {
    var DB = app.get('db');

    Tag = DB.Tag;
    User = DB.User;

    return {
        create: create,
        retrieve: retrieve,
        retrieveAll: retrieveAll,
        update: update,
        destroy: destroy
    }
};

module.exports['public'] = restrict.public;