define([ 'libs/angular' ], function(angular) {
	'use strict';

	var relatedEntities = { };

	function retrieveAuthorInfo(rest, users, entity) {
		if(!entity.author) {
			return false;
		} else {
			if(!relatedEntities[entity.author]) {
				relatedEntities[entity.author] = [ ];

				rest.user.retrieve({ id: entity.author }).
					$then(function(res) {
						var user = res.data;

						relatedEntities[user.id].forEach(function(entity) {
							entity.author = user;
						});
						
						users[user.id] = user;

						relatedEntities[user.id].fetched = true;
					});
			}

			if(!relatedEntities[entity.author].fetched) {
				relatedEntities[entity.author].push(entity);

				entity.author = { };
			} else {
				entity.author = users[entity.author];
			}

			return true;
		}
	}


	return function($rootScope, $scope, $stateParams, rest) {

		var _expandAuthor = retrieveAuthorInfo.bind(null, rest, $scope.users = [ ]);


		angular.extend($scope, {
			addComment: function(comment) {
				$scope.offer.comments.push(comment);

				rest.comment.create(comment)
					.$then(function(res) {
						console.log('ok!');
					});
			},
			response: function(comment) {
				rest.response.create({ offer: $scope.offer.id })
					.$then(function(res) {
						$scope.addComment(angular.extend(comment, { offer: res.resource.id }));
					});
			}
		});


		rest.offer.retrieve({ id: $stateParams.id })
			.$then(function(res) {
				$scope.offer = res.data;
				_expandAuthor($scope.offer);

				$scope.offer.comments = [ ];
					
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

							_expandAuthor(comment);
						});
					});
			});
	};

});
