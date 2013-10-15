'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $stateParams, rest) {

		rest.offer.retrieve({ id: $stateParams.id }).$then(function(res) {
		    $scope.offer = res.data;

		    console.log('offer', $scope.offer.template.pictures);
		});
		
	};

});
