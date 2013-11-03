define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appAddComment', function($rootScope) {
			return {
			    template: templates.addComment,
			    replace: true,
			    restrict: 'E',
			    scope: { addHandler: '&onSubmit', responseHandler: '&onResponse', showOwnerFeatures: '&', answerTo: '@referenceCommentId' },
			    link: function(scope, $element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	scope.i18n = $rootScope.i18n;

			    	angular.extend(scope, {
			    		comment: {
			    			content: ''
			    		},
			    		addComment: function() {
				    		if(scope.comment.content.length) {
				    			scope.addHandler({ comment: {
				    				content: scope.comment.content,
				    				parent: (scope.comment.parent ? scope.comment.parent.id : undefined)
				    			} });

				    			delete scope.comment.parent;
				    			scope.comment.content = '';
				    		}
				    	},
				    	response: function() {
				    		scope.responseHandler({ comment: angular.copy(scope.comment) });

				    			scope.comment.content = '';
				    	},
				    	clearAnswer: function() {
							delete scope.comment.parent;
				    	}
			    	});

			    	scope.$on('comment.answerTo', function(e, comment) {
		    			if(scope.comment.content.length && confirm(scope.i18n.offer.comment.discardConfirmation)) {
		    				scope.comment.content = '';
		    			}

			    		scope.comment.parent = comment;
			    		scope.comment.content = scope.comment.content;
			    	});
			    }
			};
		});

});