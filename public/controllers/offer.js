'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $stateParams, rest) {

		rest.offer.retrieve({ id: $stateParams.id })
			.$then(function(res) {
				var authorId = res.data.author;
				
			    $scope.offer = res.data;
			    $scope.offer.author = { };
				$scope.offer.comments = { };

			    rest.user.retrieve({ id: authorId })
					.$then(function(res) {
						angular.extend($scope.offer.author, res.data);
					});
					
				rest.comment.retrieve({ offerId: $scope.offer.id })
					.$then(function(res) {
						angular.extend($scope.offer.comments, res.data);
					});
			});
		
	};

});
