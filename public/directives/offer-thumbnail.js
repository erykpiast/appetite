define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appOfferThumbnail', function($rootScope) {
        return {
            template: templates.offerThumbnail,
            replace: true,
            restrict: 'E',
            scope: { offer: '=model' },
            link: function(scope, element, attrs) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;
                
            }
        };
    });

});