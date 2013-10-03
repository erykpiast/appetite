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
			    	$scope.x = {
			    	    y: [ 'a', 'b', 'c' ]
			    	};

			    	console.warn('controller: ', $element.find('.thumbnail-foreground').text());
			    },
			    compile: function compile(tElement, tAttrs, transclude) {
			    	console.warn('compile: ', tElement.find('.thumbnail-foreground').text());

			    	return {
			    		pre: function preLink(scope, iElement, iAttrs, controller) {
			    			console.warn('pre link: ', iElement.find('.thumbnail-foreground').text());
			    		},
			        	post: function postLink(scope, iElement, iAttrs, controller) {
			        		console.warn('post link: ', iElement.find('.thumbnail-foreground').text());
			        	}
			    	}
			    }
			};
		});

});