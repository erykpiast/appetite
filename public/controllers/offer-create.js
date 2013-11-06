define([ 'libs/angular' ], function(angular) {
	'use strict';

	function _getTags(str) {
		return str.split(',').map(function(tag) {
			return tag.trim();
		}).filter(function(tag) {
			return tag.length > 0;
		});
	}

	return function($rootScope, $scope, rest) {
		angular.extend($scope, {
			offer: {
				endAt: '',
				place: '',
				startAt: '',
				template: {
					description: '',
					recipe: '',
					tags: '',
					title: ''
				}
			},
			addOffer: function() {
				rest.offerTemplate.create(angular.extend({ }, $scope.offer.template, {
					tags: _getTags($scope.offer.template.tags)
				})).$then(function(res) {
					console.log('template', res.data);

					rest.offer.create({
						type: 'offer',
						template: res.data.id,
						place: $scope.offer.place,
						startAt: $scope.offer.startAt,
						endAt: $scope.offer.endAt
					}).$then(function(res) {
						console.log('offer', res.data);
					})
				});
			},
			templateFullfilled: function() {
				var t = $scope.offer.template,
					o = $scope.offer;

				return [ t.title, t.description, o.place ].every(function(field) {
						return (field.length > 0);
					}) && String.isUrl(t.recipe) && _getTags(t.tags).length;
			}
		});
	};

});
