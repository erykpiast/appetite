'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, rest) {

		rest.offer.getAll().$then(function(offers) {
		    $scope.offers = offers.data;
		});
		
	};

});
