'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $stateParams, rest) {

		rest.offer.retrieve({ id: $stateParams.id })
			.$then(function(res) {
				var authorId = res.data.author;
				res.data.author = { };

			    $scope.offer = res.data;

			    rest.user.retrieve({ id: authorId })
					.$then(function(res) {
						angular.extend($scope.offer.author, res.data);
					});
			});
		
	};

});
