define([ 'libs/angular', 'modules/appetite', 'templates' ],
function(angular, appetite, templates) {

	return appetite
		.directive('appGallery', function() {
			return {
			    template: templates.gallery,
			    replace: true,
			    restrict: 'E',
			    scope: { pictures: '=model' },
			    link: function(scope, element, attrs) {
			    	console.log(scope.pictures);
			    }
			};
		});

});