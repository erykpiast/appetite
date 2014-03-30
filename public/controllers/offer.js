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
					$promise.then(function(res) {
						var user = res;

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


	function appendToParent(mainCollection, buffer, entity) {
		if(entity.parent) {
			var parent = buffer.filter(function(ent) { return (ent.id === entity.parent); })[0];

			if(parent) {
				parent.children = parent.children || [ ];

				parent.children.push(entity);
			}
		} else {
			mainCollection.push(entity);
		}
	}


	return function($rootScope, $scope, $stateParams, rest, authData, i18n) {
		$scope.users = users;
		$scope.offer = {
			comments: [ ]
		};

		var commentsBuffer = [ ], // flat list of all comments
			_expandAuthor = retrieveAuthorInfo.bind(null, rest),
			_appendToParent = appendToParent.bind(null, $scope.offer.comments, commentsBuffer),
			_addComment = function(comment) {
				_appendToParent(comment);

				_expandAuthor(comment);
			};

		angular.extend($scope, {
			newCommentParent: { comment: undefined },
			currentUser: authData,
			addComment: function(commentContent) {
				var comment = {
					content: commentContent,
					parent: $scope.newCommentParent.comment && $scope.newCommentParent.comment.id,
					offer: $scope.offer.id
				};

				rest.comment.create(comment)
					.$promise.then(function(res) {
						commentsBuffer.push(res);

						_addComment(res);
					});
			},
			response: function(comment) {
				rest.response.create({ offer: $scope.offer.id })
					.$promise.then(function(res) {
						$scope.addComment(angular.extend(comment, { response: res.resource.id }));
					});
			},
			showUserFeatures: function() {
				return authData && authData.userInfo;
			},
			showOwnerFeatures: function() {
				return ($scope.offer && $scope.offer.author && ((
                    authData && authData.userInfo && authData.userInfo.id) === $scope.offer.author.id));
			},
			setParentOfNewComment: function(parent) {
				$scope.newCommentParent.comment = parent;
			},
			acceptResponse: function(response) {
				rest.response.update({ id: response.id }, { accepted: true })
					.$promise.then(function() {
						response.accepted = true;
					});	
			},
			formatAmount: function(value, unit) {
				var labels = i18n.offer.order.amountUnits,
					valuePlaceholder = i18n.offer.order.amountUnits.valuePlaceholder;

				return labels[unit].replace(valuePlaceholder, value);
			}
		});


		rest.offer.retrieve({ id: $stateParams.id })
			.$promise.then(function(res) {
				angular.extend($scope.offer, res);

				_expandAuthor($scope.offer);

				rest.offer.comments.retrieveAll({ offerId: $scope.offer.id })
					.$promise.then(function(res) {
						commentsBuffer.append(res);

						res.forEach(_addComment);
					});
			});
	};

});
