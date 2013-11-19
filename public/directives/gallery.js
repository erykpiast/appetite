define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appGallery', function($rootScope) {
        return {
            template: templates.gallery,
            replace: true,
            restrict: 'E',
            scope: { pictures: '=model' },
            link: function(scope, element, attrs) {
                // scope.i18n = $rootScope.i18n;
            }
        };
    });

});