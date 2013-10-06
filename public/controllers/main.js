'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($scope, rest) {
	    
		$scope.offers = rest.offer.getAll().success(function(offers) {
		    
		});
		
	};

});
