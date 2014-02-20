define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appGallery', function() {
        return {
            template: templates.gallery,
            replace: true,
            restrict: 'E',
            scope: { photos: '=model' },
            link: function(scope, element, attrs) {
                
            }
        };
    });

});