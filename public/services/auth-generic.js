define([ 'libs/angular', './module-auth', 'services/auth-facebook' ],
function(angular, module, undefined) {

    module
    .factory('authGeneric', function($rootScope, $q, authConfig, authFacebook) {
        function AuthService() {
            this._ = null; // current authService

            this._services = {
                    facebook: authFacebook
                };
        }

        angular.extend(AuthService.prototype, {
            _ensureInit: function() {
                if(!this._) {
                    throw new Error('No auth service attached!');
                } else {
                    return true;
                }
            },
            use: function(serviceName) {
                var service = this._services[serviceName];

                if(!!service) {
                    delete this._;

                    this._ = service;

                    return this._.init();
                } else {
                    return false;
                }
            },
            login: function(scopes) {
                this._ensureInit();

                return this._.login(scopes).then((function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this._.name,
                        userId: this._.userId,
                        accessToken: this._.accessToken
                    });

                    return true;
                }).bind(this));
            },
            logout: function() {
                this._ensureInit();

                return this._.logout().then((function() {
                    $rootScope.$broadcast(authConfig.events.logout, {
                        serviceName: this._.name,
                        userId: this._.userId
                    });

                    this._.userId = null;
                    this._.accessToken = null;

                    return true;
                }).bind(this));
            },
            getUserInfo: function() {
                this._ensureInit();

                this._.getUserInfo().then((function(userData) {
                    $rootScope.$broadcast(authConfig.events.userInfo, userData);

                    return true;
                }).bind(this));
            },
            autoLogin: function() {
                this._ensureInit();
                
                this._.autoLogin().then((function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this._.name,
                        userId: this._.userId,
                        accessToken: this._.accessToken
                    });

                    return true;
                }).bind(this));
            }
        });

        return (new AuthService());
    });

});