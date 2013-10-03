define([ 'libs/angular', 'modules/appetite', 'text!templates/offer-thumbnail.tpl' ],
function(angular, appetite, template) {

	return appetite
		.directive('appOfferThumbnail', function() {
			return {
			    template: template,
			    replace: true,
			    restrict: 'E',
			    scope: true,
			    controller: function($scope, $element, $attrs, $transclude) {
			    	$scope.els = [ 'a', 'b', 'c' ];

			    	console.warn('controller: ', $element.find('li').length);
			    },
			    compile: function compile(tElement, tAttrs, transclude) {
			    	console.warn('compile: ', tElement.find('li').length);

			    	return {
			    		pre: function preLink(scope, iElement, iAttrs, controller) {
			    			console.warn('pre link: ', iElement.find('li').length);
			    		},
			        	post: function postLink(scope, iElement, iAttrs, controller) {
			        		console.warn('post link: ', iElement.find('li').length);
			        	}
			    	}
			    }
			};
		});

});