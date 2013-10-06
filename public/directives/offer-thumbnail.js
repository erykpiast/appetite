define([ 'libs/angular', 'modules/appetite', 'text!templates/offer-thumbnail.tpl' ],
function(angular, appetite, template) {

	return appetite
		.directive('appOfferThumbnail', function($rootScope) {
			return {
			    template: template,
			    replace: true,
			    restrict: 'E',
			    scope: { offer: '@model' },
			    link: function(scope, element, attrs) {
			    	
			    }
			};
		});

});