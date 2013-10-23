'use strict';

define([ 'libs/angular' ], function(angular) {

	return function($rootScope, $scope, $stateParams, rest) {

		rest.offer.retrieve({ id: $stateParams.id })
			.$then(function(res) {
				var authorId = res.data.author;
				
			    $scope.offer = res.data;
			    $scope.offer.author = { };
				$scope.offer.comments = [ ];

			    rest.user.retrieve({ id: authorId })
					.$then(function(res) {
						angular.extend($scope.offer.author, res.data);
					});
					
				rest.offer.comments.retrieveAll({ offerId: $scope.offer.id })
					.$then(function(res) {
						res.data.forEach(function(comment, index, comments) {
							if(comment.parent) {
								var parent = comments.filter(function(c) { return (c.id === comment.parent); })[0];

								if(parent) {
									parent.children = parent.children || [ ];

									parent.children.push(comment);
								}
							} else {
								$scope.offer.comments.push(comment);
							}
						});
					});
			});
		
	};

});
