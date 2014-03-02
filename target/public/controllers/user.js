define([ 'libs/angular' ], function(angular) {
    'use strict';

	return function ($rootScope, $scope, $stateParams, rest) {
		$scope.user = {};

        angular.extend($scope, {
            
        });


        rest.user.retrieve({ id: $stateParams.id })
            .$promise.then(function(res) {
                angular.extend($scope.user, res, {
                    offers: [ ],
                    rating: { }
                });

                rest.user.offers.retrieve({ userId: $scope.user.id })
                    .$promise.then(function(res) {
                        $scope.user.offers.append(res);
                    });

                rest.user.rating.retrieve({ userId: $scope.user.id })
                    .$promise.then(function(res) {
                        angular.extend($scope.user.rating, res);
                    });
            });
	};
	
});