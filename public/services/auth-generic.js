define([ 'libs/angular', 'modules/auth' ], function(angular, auth) {

    auth
    .factory('authService', function($rootScope, $q, authConfig) {
        function AuthService() {
            this._accessToken = null;
            this._userId = null;
            this._appId = null;
            this._initialized = false;

            setTimeout(function(that) {
                that._init();
            }, 0, this);
        }

        angular.extend(AuthService.prototype, {
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

                return this._login(scopes).then((function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this.name,
                        userId: this._userId,
                        accessToken: this._accessToken
                    });

                    return true;
                }).bind(this));
            },
            logout: function() {
                this._ensureInit();

                return this._logout().then((function() {
                    $rootScope.$broadcast(authConfig.events.logout, {
                        serviceName: this._name,
                        userId: this._userId
                    });

                    this._userId = null;
                    this._accessToken = null;

                    return true;
                }).bind(this));
            },
            getUserInfo: function() {
                this._getUserInfo().then((function(userData) {
                    $rootScope.$broadcast(authConfig.events.userInfo, userData);

                    return true;
                }).bind(this));
            },
            autoLogin: function() {
                this._autoLogin().then((function() {
                    $rootScope.$broadcast(authConfig.events.login, {
                        serviceName: this._name,
                        userId: this._userId,
                        accessToken: this._accessToken
                    });

                    return true;
                }).bind(this));
            }
        });

        return AuthService;
    });

});