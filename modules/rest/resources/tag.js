var auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'text' ],
		create: [ 'text' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var DB, Tag, User;


function create(authData, proto) {
	return auth(authData.service, authData.userId, authData.accessToken).then(
		function(serviceId) {
		    return User.find({ where: {
					serviceId: serviceId,
					authService: authData.service,
					deletedAt: null
				} });
		},
		Errors.report('Authentication')
	).then(
		function(user) {
		    if(!user) {
		        throw new Errors.Authentication();
			} else if(!proto.text) {
				throw new Errors.WrongData();
			} else {
				return Tag.findOrCreate({ text: proto.text }, { AuthorId: user.values.id });
			}
		},
		Errors.report('Authentication')
	).then(
		function(tag) {
			return { resource: restrict.public(tag.values) };
		},
		Errors.report('Database')
	);
}


function retrieve(params, authData) {
	return Tag.find({ where: restrict.search(params) }).then(
		function(tag) {
			if(!!tag) {
				return { resource: restrict.public(tag.values) };
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
	Tag = DB.Tag;
	User = DB.User;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};

module.exports['public'] = restrict.public;