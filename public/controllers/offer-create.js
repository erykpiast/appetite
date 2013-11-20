define([ 'libs/angular' ], function(angular) {
	'use strict';

	function _getTags(str) {
		return str.split(',').map(function(tag) {
			return tag.trim();
		}).filter(function(tag) {
			return tag.length > 0;
		});
	}

	return function($rootScope, $scope, $q, rest) {

		function _submitTemplate() {
			var deferred = $q.defer(),
				t = $scope.offer.template;

			rest.offerTemplate.create(angular.extend({ }, t, {
				tags: _getTags(t.tags),
				pictures: t.pictures.length ? t.pictures : null
			})).$promise.then(function(res) {
				console.log('template', res.data);

				deferred.resolve(res.data);
			});

			return deferred.promise;
		}

		angular.extend($scope, {
			defaultStartTime: new Date(Date.now()),
			defaultEndTime: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
			offer: {
				details: {
					endAt: '',
					place: '',
					startAt: ''
				},
				template: {
					description: '',
					recipe: '',
					tags: '',
					title: '',
					pictures: [ ]
				}
			},
			submitTemplate: function() {
				_submitTemplate().then(function() {
					$rootScope.goTo('index');
				});
			},
			startOffer: function() {
				_submitTemplate().then(function(template) {
					var d = $scope.offer.details;

					rest.offer.create({
						type: 'offer',
						template: template.id,
						place: d.place,
						startAt: d.startAt,
						endAt: d.endAt
					}).$promise.then(function(res) {
						console.log('offer', res.data);

						$rootScope.goTo('index');
					});
				});
			},
			detailsFullfilled: function() {
				var d = $scope.offer.details;

				return [ d.place ].every(function(field) {
						return (field.length > 0);
					}) && [ d.startAt, d.endAt ].every(function(field) {
						return !!field;
					}) && ((new Date(d.startAt)).getTime() > (Date.now() + (10 * 60 * 1000))) && ((new Date(d.startAt)).getTime() < (new Date(d.endAt)).getTime());
			},
			templateFullfilled: function() {
				var t = $scope.offer.template;

				return [ t.title, t.description ].every(function(field) {
						return (field.length > 0);
					}) && String.isUrl(t.recipe) && _getTags(t.tags).length;
			}
		});
	};

});
