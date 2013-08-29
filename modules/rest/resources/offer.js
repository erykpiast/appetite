var Q = $require('q'),
    auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'place', 'author' ],
		create: [ 'template', 'place', 'startedAt', 'endAt' ],
		createSearch: [ 'id' ],
		update: [ 'startedAt', 'endAt' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var Offer, OfferTemplate;

function create(proto) {
	var deffered = Q.defer();
	
	auth(proto.authService, proto.accessToken).then(
		function(serviceId) {
			var userSearch = { serviceId: serviceId };
			User.find({ where: userSearch }).then(
				function(user) {
					var search = restrict.createSearch(proto);

					Offer.find({ where: search }).then(
						function(offer) {
							if(!offer) {
								var templateSearch = { id: proto.template };

								OfferTemplate.find({ where: templateSearch }).then(
									function(template) {
										proto = restrict.create(proto);
										proto.author = user.id;

										Offer.create(proto).then(
											function(offer) {
												deffered.resolve({
														resource: restrict.public(offer.values)
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
							} else {
								deffered.resolve({
										resource: restrict.public(offer),
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

	Offer.find({ where: search }).then(
		function(offer) {
			if(!!offer) {
				deffered.resolve({
						resource: restrict.public(offer)
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

	Offer.find({ where: search }).then(
		function(offer) {
			if(!!offer) {
				auth(proto.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === offer.serviceId)) {
							proto = restrict.update(proto);
			
							offer.updateAttributes(proto).then(
								function() {
									deffered.resolve({
											resource: restrict.public(offer)
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

	Offer.find({ where: search }).then(
		function(offer) {
			if(!!offer) {
				auth(offer.authService, proto.accessToken).then(
					function(serviceId) {
						if(serviceId && (serviceId === offer.serviceId)) {
							offer.destroy().then(
								function() {
									deffered.resolve({
											resource: restrict.public(offer)
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
	OfferTemplate = app.get('db').OfferTemplate;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};