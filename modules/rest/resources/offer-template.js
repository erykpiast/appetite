var Q = $require('q'),
	auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'title', 'description', 'recipe' ],
		create: [ 'title', 'description', 'recipe' ],
		createSearch: [ 'id' ],
		update: [ 'startedAt', 'endAt' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var OfferTemplate, Recipe;

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
					var search = restrict.createSearch(proto);

					OfferTemplate.find({ where: search }).then(
						function(template) {
							if(!template) {
								if(!proto.recipe) {
									deffered.reject(new Errors.WrongData());
								} else {
									var recipeProto = { url: proto.recipe };
	
									Recipe.findOrCreate(recipeProto).then(
										function(recipe) {
											proto = restrict.create(proto);
	
											 var template = OfferTemplate.build(proto);
											 template.setAuthor(user);
											 template.setRecipe(recipe);
											 
											template.save().then(
												function() {
													deffered.resolve({
															resource: restrict.public(template.values)
														}
													);
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
								}
							} else {
								deffered.resolve({
										resource: restrict.public(template),
										existed: true
									}
								);
							}
						},
						function() {
							deffered.reject(new Errors.Database());
						}
					);
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

	OfferTemplate.find({ where: search }).then(
		function(template) {
			if(!!template) {
				deffered.resolve({
						resource: restrict.public(template)
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

	OfferTemplate.find({ where: search }).then(
		function(template) {
			if(!!template) {
				auth(proto.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === template.serviceId)) {
							proto = restrict.update(proto);
			
							template.updateAttributes(proto).then(
								function() {
									deffered.resolve({
											resource: restrict.public(template)
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

	OfferTemplate.find({ where: search }).then(
		function(template) {
			if(!!template) {
				auth(template.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === template.serviceId)) {
							template.destroy().then(
								function() {
									deffered.resolve({
											resource: restrict.public(template)
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
	OfferTemplate = app.get('db').OfferTemplate;
	Recipe = app.get('db').Recipe;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};