define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appAddComment', function($rootScope) {
			return {
			    template: templates.addComment,
			    replace: true,
			    restrict: 'E',
			    scope: { addHandler: '&onsubmit', responseHandler: '&onresponse', showOwnerFeatures: '&' },
			    link: function(scope, $element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	scope.i18n = $rootScope.i18n;

			    	angular.extend(scope, {
			    		comment: {
			    			content: ''
			    		},
			    		addComment: function() {
				    		if(scope.comment.content.length) {
				    			scope.addHandler({ comment: angular.copy(scope.comment) });

				    			scope.comment.content = '';
				    		}
				    	},
				    	response: function() {
				    		scope.responseHandler({ comment: angular.copy(scope.comment) });

				    			scope.comment.content = '';
				    	}
			    	});
			    }
			};
		});

});