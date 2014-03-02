'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, rest) {
		$scope.offers = [];

		rest.offer.retrieveAll().$promise.then(function(res) {
		    $scope.offers.append(res);
		});
		
	};

});
