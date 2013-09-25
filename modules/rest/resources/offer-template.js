var auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'title', 'description', 'recipe' ],
		recipePublic: [ 'id', 'url' ],
		create: [ 'title', 'description' ],
		update: [ 'title', 'description' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var OfferTemplate, Recipe, User;


function create(authData, proto) {
    var user, recipe;
    
    console.log('------authData:', authData);
    
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
		    
		    var p = extend(restrict.create(proto), {
    			        AuthorId: user.id,
    			        RecipeId: recipe.id
    			    });
		    
			return OfferTemplate.create(p, Object.keys(p));
		},
		Errors.report('Database')
	).then(
		function(template) {
			return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(recipe.values) }) };
		},
		Errors.report('Database')
	);
}


function retrieve(params, authData) {
	return OfferTemplate.find({ where: restrict.search(params), include: [ Recipe ] }).then(
		function(template) {
			if(!!template) {
				return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.recipe.values) }) };
			} else {
				throw new Errors.NotFound();
			}
		},
		Errors.report('Database')
	);
}


function update(params, authData, proto) {
    var serviceId;
    
	return auth(authData.service, authData.accessToken).then(
		function(_serviceId) {
		    serviceId = _serviceId;
		    
			if(!!serviceId) {
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, Recipe ] });
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
		function(template) {
			return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.values.recipe.values) }) };
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
				return OfferTemplate.find({ where: restrict.search(params), include: [ { model: User, as: 'Author' }, Recipe ] });
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
			return { resource: extend(restrict.public(template.values), { recipe: restrict.recipePublic(template.values.recipe.values) }) };
		},
		Errors.report('Database')
	);
}


module.exports = function(app) {
	OfferTemplate = app.get('db').OfferTemplate;
	Recipe = app.get('db').Recipe;
	User = app.get('db').User;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};