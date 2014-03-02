define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appOfferAuthor', function($rootScope) {
        return {
            template: templates.offerAuthor,
            replace: true,
            restrict: 'E',
            scope: { author: '=model' },
            link: function(scope, element, attrs) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;
                
                scope.$watch('author', function(newValue) {
                    console.log(newValue);
                });
            }
        };
    });

});