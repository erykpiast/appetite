'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, rest) {
		
		rest.offer.retrieveAll().$then(function(res) {
		    $scope.offers = res.data;
		});
		
	};

});
