'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $routeParams, rest) {

		rest.offer.get($routeParams.id).$then(function(offer) {
		    $scope.offer = offer.data;
		});
		
	};

});
