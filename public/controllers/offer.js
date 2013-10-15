'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $stateParams, rest) {
    
        console.log($stateParams.id);

		rest.offer.retrieve({ id: $stateParams.id }).$then(function(res) {
		    $scope.offer = res.data;
		});
		
	};

});
