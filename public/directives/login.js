define([ 'libs/angular', './module', 'services/auth-generic', 'libs/underscore', 'templates' ],
function(angular, module, undefined, _, templates) {

    // window.___gcfg = {
    //  lang: 'pl-PL',
    //  parsetags: 'explicit'
    // };

    module
    .directive('appLogin', function($rootScope, authConfig) {
        return {
            replace: true,
            restrict: 'E',
            template: templates.login,
            scope: true,
            link: function(scope, element, attrs) {
                scope.authServices = [ { name: 'facebook', label: 'Facebook' } ];
                scope.currentService = null;

                $rootScope.$on(authConfig.events.login, function(e, data) {
                    scope.loggedIn = true;

                    scope.currentService = scope.authServices.filter(function(service) {
                            return service.name === data.serviceName;
                        })[0];
                });

                $rootScope.$on(authConfig.events.logout, function(e, data) {
                    scope.loggedIn = false;

                    scope.currentService = null;
                });
            }
        };
    })
    .directive('appSignButton', function($rootScope, authGeneric) {
        return {
            replace: true,
            restrict: 'E',
            template: '<button class="login__sign" ng-click="requestLogin()">{{ i18n.common.signLong }} {{ label }}</button>',
            scope: { serviceName: '@service', label: '@' },
            link: function(scope, element, attrs) {
                scope.i18n = $rootScope.i18n;

                scope.requestLogin = function() {
                    authGeneric.use(scope.serviceName);

                    authGeneric.login([ 'userInfo' ]);
                };
            }
        };
    })
    .directive('appUnsignButton', function($rootScope, authGeneric) {
        return {
            replace: true,
            restrict: 'E',
            template: '<button class="login__unsign" ng-click="requestLogout()">{{ i18n.common.unsignLong }} {{ label }}</button>',
            scope: { serviceName: '@service', label: '@' },
            link: function(scope, element, attrs) {
                scope.i18n = $rootScope.i18n;

                scope.requestLogout = function() {
                    authGeneric.use(scope.serviceName);

                    authGeneric.logout();
                };
            }
        };
    });

});