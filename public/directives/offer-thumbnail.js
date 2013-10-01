define([ 'libs/angular', 'modules/appetite', 'text!templates/offer-thumbnail.tpl' ],
function(angular, appetite, template) {

	return appetite
		.directive('appOfferThumbnail', function() {
			return {
			    template: template,
			    replace: true,
			    restrict: 'E',
			    scope: false,
			    controller: function($scope, $element, $attrs, $transclude) {
			    	console.warn($element);
			    },
			    compile: function compile(tElement, tAttrs, transclude) {
			    	return {
			    		pre: function preLink(scope, iElement, iAttrs, controller) {
			    			console.warn(iElement);
			    		},
			        	post: function postLink(scope, iElement, iAttrs, controller) {
			        		console.warn(iElement);
			        	}
			    	}
			    },
			    link: function postLink(scope, iElement, iAttrs) {
			    	console.warn(iElement);
			    }
			};
		});

});