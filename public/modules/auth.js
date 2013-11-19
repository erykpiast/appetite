define([ 'libs/angular', 'libs/angular-cookies', 'libs/underscore' ],
function(angular, undefined, _) {

    angular.module('auth', [ ])
    .constant('authConfig', {
        cookie: {
            name: 'auth'
        },
        events: {
            login: 'auth.login',
            logout: 'auth.logout',
            userInfo: 'auth.userInfo'
        },
        autoLogin: true,
        facebook: {
            id: '467246670041226'
        }
    })
    .value('authServices', { })
    .factory('authData', function($rootScope, $cookieStore, authConfig) {
        var authData,
            restored = $cookieStore.get(authConfig.cookie.name);

        if(!!restored) {
            authData = restored;
        } else {
            authData = {
                userId: undefined,
                serviceName: undefined,
                accessToken: undefined,
                scopes: undefined,
                login: false
            };
        }

        $rootScope.__authData = authData;

        $rootScope.$watch('__authData', function(newVal, oldVal) {
            if(!_.isEqual(newVal, oldVal)) {
                $cookieStore.put(authConfig.cookie.name, JSON.stringify(newVal));
            }
        }, true);

        return authData;
    })
    .run(function($rootScope, authConfig, authData, authServices) {
        $rootScope.$on(authConfig.events.login, function(e, data) {
            var service = authServices[data.serviceName];

            if(!service) {
                return;
            }

            var userInfo = {
                    serviceName: service.name
                };

            authData.serviceName = service.name;
            authData.login = true;
            authData.scopes = data.scopes;
            authData.accessToken = data.accessToken;

            service.getUserInfo().then(
                function(info) {
                    angular.extend(userInfo, info);
                    userInfo.login = true;

                    $rootScope.$broadcast(authConfig.events.userInfo, userInfo);

                    authData.userId = userInfo.id;
                }
            );

            console.log('Zalogowano przy pomocy ' + service.name);
        });

        $rootScope.$on(authConfig.events.logout, function(e, data) {
            var service = authServices[data.serviceName];

            if(!service) {
                return;
            }

            var userInfo = {
                    serviceName: service.name
                };

            authData.serviceName = undefined;
            authData.login = false;
            authData.scopes = undefined;
            authData.accessToken = undefined;
            authData.userId = undefined;
            
            $rootScope.$broadcast(authConfig.events.userInfo, null);

            console.log('Wylogowano z ' + service.name);
        });
    });

    return angular.module('auth');

});