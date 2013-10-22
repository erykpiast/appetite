define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appComments', function($rootScope, $compile) {
			return {
			    template: templates.comment,
			    replace: true,
			    restrict: 'E',
			    scope: { comment: '=model' },
			    link: function(scope, $element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	scope.i18n = $rootScope.i18n;
			    
			    	if (angular.isArray(scope.comment.children)) {
			    		var $list = $('<ul>').appendTo($element);

				    	$compile('<li ng-repeat="comment in comment.children"><app-comments model="comment"></app-comments></li>')(scope, function(cloned, scope) {
				    		$list.append(cloned);
				    	});
				    }
			    }
			};
		});

});