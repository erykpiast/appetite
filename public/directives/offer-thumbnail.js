define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appOfferThumbnail', function($rootScope) {
			return {
			    template: templates.offerThumbnail,
			    replace: true,
			    restrict: 'E',
			    scope: { offer: '=model' },
			    link: function(scope, element, attrs) {
			    	scope.goTo = $rootScope.goTo;
			    	// console.log(scope.offer);
			    }
			};
		});

});