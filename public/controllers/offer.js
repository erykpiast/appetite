define([ 'libs/angular' ], function(angular) {
	'use strict';

	var relatedEntities = { }, users = [ ];

	function retrieveAuthorInfo(rest, entity) {
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


	function appendToParent(mainCollection, collection, entity) {
		if(entity.parent) {
			var parent = collection.filter(function(ent) { return (ent.id === entity.parent); })[0];

			if(parent) {
				parent.children = parent.children || [ ];

				parent.children.push(entity);
			}
		} else {
			mainCollection.push(entity);
		}
	}


	return function($rootScope, $scope, $stateParams, rest) {
		$scope.users = users;

		var _expandAuthor = retrieveAuthorInfo.bind(null, rest),
			_appendToParent,
			_addComment = function(comment, comments) {
				_appendToParent(comments, comment);

				_expandAuthor(comment);
			};


		angular.extend($scope, {
			addComment: function(comment) {
				angular.extend(comment, {
					offer: $scope.offer.id
				});

				rest.comment.create(comment)
					.$then(function(res) {
						_addComment(res.data, $scope.offer.comments);
					});
			},
			response: function(comment) {
				rest.response.create({ offer: $scope.offer.id })
					.$then(function(res) {
						$scope.addComment(angular.extend(comment, { response: res.resource.id }));
					});
			},
			showOwnerFeatures: function() {
				return ($scope.offer && $scope.offer.author && ($rootScope.currentUser.id === $scope.offer.author.id));
			},
			acceptResponse: function(response) {
				rest.response.update({ id: response.id }, { accepted: true })
					.$then(function(res) {
						response.accepted = true;
					});	
			}
		});


		rest.offer.retrieve({ id: $stateParams.id })
			.$then(function(res) {
				$scope.offer = res.data;

				_expandAuthor($scope.offer);

				$scope.offer.comments = [ ];		
				_appendToParent =  appendToParent.bind(null, $scope.offer.comments);
				rest.offer.comments.retrieveAll({ offerId: $scope.offer.id })
					.$then(function(res) {
						res.data.forEach(function(comment, index, comments) {
							_addComment(comment, comments);
						});
					});
			});
	};

});
