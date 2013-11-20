define([ 'libs/angular', './module', 'templates', 'libs/underscore' ],
function(angular, module, templates, _) {
    'use strict';

    module
    .directive('appCurrentUser', function($rootScope, authData) {
        return {
            template: templates.currentUser,
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attrs) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;
                
                scope.authData = authData;
                scope.$watch('authData', function(newVal, oldVal) {
                    if(!_.isEqual(newVal.userInfo, oldVal.userInfo)) {
                        scope.user = newVal.userInfo;
                    }
                }, true);
            }
        };
    });

});