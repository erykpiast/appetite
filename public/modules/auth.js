define([ 'libs/angular', 'libs/angular-cookies', 'libs/underscore' ],
function(angular, undefined, _) {

    angular.module('auth', [ 'auth.services' ])
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
    .factory('authData', function($rootScope, $cookieStore, authConfig) {
        var authData = { },
            restored = $cookieStore.get(authConfig.cookie.name);

        if(!!restored) {
            angular.extend(authData, restored, {
                restored: true
            });
        } else {
            angular.extend(authData, {
                service: undefined,
                userId: undefined,
                accessToken: undefined,
                scopes: undefined
            });
        }

        $rootScope.$on(authConfig.events.login, function(e, data) {
            angular.extend(authData, data);

            $cookieStore.put(authConfig.cookie.name, {
                service: authData.service,
                userId: authData.userId,
                accessToken: authData.accessToken
            });
        });

        $rootScope.$on(authConfig.events.logout, function(e, data) {
            authData.service = undefined;
            authData.userId = undefined;
            authData.accessToken = undefined;
            authData.scopes = undefined;

            $cookieStore.remove(authConfig.cookie.name);
        });

        return authData;
    })
    .config(function(authConfig, authFacebookProvider) {
        authFacebookProvider.setAppId(authConfig.facebook.id);
    });

    return angular.module('auth');

});