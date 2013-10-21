define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appComment', function($rootScope) {
			return {
			    template: templates.comment,
			    replace: true,
			    restrict: 'E',
			    scope: { comment: '=model' },
			    link: function(scope, element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	scope.i18n = $rootScope.i18n;
			    	
			    }
			};
		});

});