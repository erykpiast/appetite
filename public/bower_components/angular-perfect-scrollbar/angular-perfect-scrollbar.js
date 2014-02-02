angular.module('perfect-scrollbar', [])
.directive('perfectScrollbar', function($timeout, $parse) {
	return {
		restrict: 'A',
		scope: { },
		link: function(scope, $element, attrs) {
			var settings = angular.extend({
				wheelSpeed: 100,
				wheelPropagation: false,
				minScrollbarLength: 16,
				useBothWheelAxes: false,
				useKeyboard: true,
				suppressScrollX: false,
				suppressScrollY: false,
				scrollXMarginOffset: 0,
				scrollYMarginOffset: 0
			}, $parse(attrs.perfectScrollbar)(scope.$parent));

		    $element.perfectScrollbar(settings);

			if (attrs.refreshOnChange) {
				// scope.$watchCollection(attr.refreshOnChange, function(newNames, oldNames) {
				// 	// I'm not crazy about setting timeouts but it sounds like thie is unavoidable per
				// 	// http://stackoverflow.com/questions/11125078/is-there-a-post-render-callback-for-angular-js-directive
				// 	$timeout(function() {
				// 		$element.perfectScrollbar('update');
				// 	}, 10);
				// });
			}
		}
	};
});
