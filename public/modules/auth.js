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
    .constant('authServices',  { })
    .factory('authService', function($rootScope, $q, authConfig) { // generic auth serivce

        function AuthService() {
            this._accessToken = null;
            this._userId = null;
            this._appId = null;
            this._initialized = false;

            setTimeout(function(that) {
                that._init();
            }, 0, this);
        }

        angular.extend(AtuhService.prototype, {
            _ensureInit: function() {
                if(!this._initialized) {
                    this._init();
                }
            },
            _getDeferred: function() {
                return $q.defer();
            },
            login: function(scopes) {
                this._ensureInit();

                return this._login(scopes).then(function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this._name,
                        userId: this._userId,
                        accessToken: this._accessToken
                    });

                    return true;
                });
            },
            logout: function() {
                this._ensureInit();

                return this._logout().then(function() {
                    $rootScope.$broadcast(authConfig.events.logout, {
                        serviceName: this._name,
                        userId: this._userId
                    });

                    this._userId = null;
                    this._accessToken = null;

                    return true;
                });
            },
            getUserInfo: function() {
                this._getUserInfo().then(function(userData) {
                    $rootScope.$broadcast(authConfig.events.userInfo, userData);

                    return true;
                });
            },
            autoLogin: function() {
                this._autoLogin().then(function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this._name,
                        userId: this._userId,
                        accessToken: this._accessToken
                    });

                    return true;
                });
            }
        });

        return AuthService;
    })
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
            e.stopPropagation();

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
            e.stopPropagation();

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

});