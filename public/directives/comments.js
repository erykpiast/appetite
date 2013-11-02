define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appComments', function($rootScope, $compile) {
			return {
			    template: templates.comment,
			    replace: true,
			    restrict: 'E',
			    scope: { comment: '=model', showOwnerFeatures: '&', responseAcceptHandler: '&' },
			    link: function(scope, $element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	scope.i18n = $rootScope.i18n;

			    	scope.showOwnerFeatures();
			    
			    	if (angular.isArray(scope.comment.children)) {
			    		var $list = angular.element('<ul class="comment__answers no-bullets">');
			    		$element.append($list);

				    	$compile('<li ng-repeat="comment in comment.children"><app-comments model="comment" show-owner-features="showOwnerFeatures()" response-accept-handler="responseAcceptHandler(response)"></app-comments></li>')(scope, function(cloned, scope) {
				    		$list.append(cloned);
				    	});
				    }
			    }
			};
		});

});