var Q = $require('q'),
    auth = $require('/modules/auth'),
	Errors = $require('/modules/rest/errors'),
	restrict = $require('/modules/rest/restrict')({
		public: [ 'id', 'authService', 'firstName', 'lastName', 'gender', 'site' ],
		create: [ 'authService', 'serviceId', 'firstName', 'lastName', 'gender', 'site' ],
		createSearch: [ 'authService', 'serviceId' ],
		update: [ 'firstName', 'lastName', 'gender', 'site' ],
		search: [ 'id', 'deletedAt' ]
	}, [ 'public', 'search' ] );

var Offer;

function create(proto) {
	var deffered = Q.defer();
	
	auth(proto.authService, proto.accessToken).then(
		function(serviceId) {
			proto.serviceId = serviceId;

			var search = restrict.createSearch(proto)
				proto = restrict.create(proto);

			Offer.find({ where: search }).then(
				function(offer) {
					if(!offer) {
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
		function(err) {
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
	Offer = app.get('db').ActualOffer;

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		destroy: destroy
	}
};