define([ 'libs/angular', './module-auth', 'libs/facebook' ],
function(angular, module, FB) {

    module
    .provider('authFacebook', function() {
        var provider = this;

        this.serviceName = 'facebook';

        this.setAppId = function(appId) {
            this.appId = appId;
        };

        this.$get = function(q, $rootScope) {
            function FacebookAuthService() {
                this._scopes = {
                        userInfo: {
                            url: '',
                            fieldName: 'installed',
                            permissions: false
                        }
                    };
            }

            angular.extend(FacebookAuthService.prototype, {
                name: provider.serviceName,
                init: function() {
                    this._appId = provider.appId;

                    if(!this._appId) {
                        throw new Error('No app id!');
                    }

                    FB.Event.subscribe('auth.login', this._loginHandler.bind(this));
                    FB.Event.subscribe('auth.logout', this._loginHandler.bind(this));

                    FB.init({
                        appId: this._appId,
                        status: true,
                        cookie: false
                    });

                    this._initialized = true;

                    return true;
                },
                _grant: function(scopeName) {

                    return this._scopes.hasOwnProperty(scopeName) ? this._scopes[scopeName].permissions = true : false;
                },
                _getScopeUrl: function(scopeName) {

                    return this._scopes.hasOwnProperty(scopeName) ? this._scopes[scopeName].url : undefined;
                },
                _loginHandler: function(response, scopes) {
                    if(response.status === 'connected') {
                        this.accessToken = response.authResponse.accessToken;
                        this.userId = response.authResponse.userID;

                        if(scopes) {
                            scopes.forEach(this._grant, this);
                        }

                        return true;
                    } else {
                        this.accessToken = undefined;

                        return false;
                    }
                },
                login: function(scopes) {
                    var deferred = q.defer();

                    FB.login((function(response) {
                        var result = this._loginHandler(response, scopes);

                        if(result) {
                            deferred.resolve(true);
                        } else {
                            deferred.reject(false);
                        }
                    }).bind(this), { scope: scopes.map(this._getScopeUrl, this).join(',') });

                    return deferred.promise;
                },
                _logoutHandler: function(response) {

                    return !!response;
                },
                logout: function() {
                    var deferred = q.defer();

                    FB.api('/me/permissions', 'delete', (function(response) {
                        var result = this._logoutHandler(response);
                        
                        if(result) {
                            deferred.resolve(true);  
                        } else {
                            deferred.reject(false);
                        };
                    }).bind(this));

                    return deferred.promise;
                },
                getUserInfo: function() {
                    if(this._scopes.userInfo.permissions) {
                        var deferred = q.defer();

                        FB.api('/me?fields=id,name,gender,locale,link,picture',
                            (function(response) {
                                deferred.resolve({
                                    id: response.id,
                                    name: response.name,
                                    link: response.link,
                                    picture: response.picture.data.url,
                                    gender: response.gender,
                                    locale: response.locale
                                });
                            }).bind(this)
                        );

                        return deferred.promise;
                    } else {
                        return this.login([ 'userInfo']).then(
                            function() {
                                return getUserInfo();
                            });
                    }
                },
                autoLogin: function(/* [scopes] */) {
                    var deferred = q.defer();

                    FB.getLoginStatus((function(response) {
                        var result = this._loginHandler(response);

                        if(result) {
                            FB.api('/me/permissions', (function(response) {
                                if(response && response.data) {
                                    var permissions = response.data[0],
                                        scopes = [ ];

                                    for (var scopeName in this._scopes) {
                                        var scope = this._scopes[scopeName];

                                        if(!!permissions[scope.fieldName]) {
                                            scope.permissions = true;

                                            scopes.push(scopeName);
                                        } else {
                                            scope.permissions = false;
                                        }
                                    };

                                    deferred.resolve(true);
                                }

                                deferred.resolve(false);
                            }).bind(this));
                        } else {
                            deferred.resolve(false);
                        }
                    }).bind(this), true);

                    return deferred.promise;
                }
            });

            return (new FacebookAuthService());
        };
    });

});