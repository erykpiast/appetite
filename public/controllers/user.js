define([ 'libs/angular' ], function(angular) {
    'use strict';

	return function ($rootScope, $scope, $stateParams, rest) {
		$scope.user = {};

        angular.extend($scope, {
            
        });


        rest.user.retrieve({ id: $stateParams.id })
            .$then(function(res) {
                angular.extend($scope.user, res.data, {
                    offers: [ ],
                    rating: { }
                });

                rest.user.offers.retrieve({ userId: $scope.user.id })
                    .$then(function(res) {
                        $scope.user.offers.append(res.data);
                    });

                rest.user.rating.retrieve({ userId: $scope.user.id })
                    .$then(function(res) {
                        angular.extend($scope.user.rating, res.data);
                    });
            });
	};
	
});