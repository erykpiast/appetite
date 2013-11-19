define([ 'libs/angular', 'modules/auth', 'services/auth-generic', 'libs/facebook' ],
function(angular, auth, authServiceGeneric, FB) {

    auth
    .provider('authServiceFacebook', function() {
        var provider = this;

        this.serviceName = 'facebook';

        this.setAppId = function(appId) {
            this.appId = appId;
        };

        this.$get = function(authService) {
            function FacebookAuthService() {
                authService.constructor.call(this);

                this._scopes = {
                        userInfo: {
                            url: '',
                            fieldName: 'installed',
                            permissions: false
                        }
                    };
            }

            angular.extend(FacebookAuthService.prototype, authService.prototype, {
                name: provider.serviceName,
                _init: function() {
                    this._appId = provider.appId;

                    if(!this._appId) {
                        throw new Error('No app id!');
                    }

                    FB.Event.subscribe('auth.login', this._loginHandler.bind(this));
                    FB.Event.subscribe('auth.logout', this._loginHandler.bind(this));

                    FB.init({
                        appId: this._appId,
                        status: true,
                        cookie: true
                    });

                    this._initialized = true;

                    return true;
                },
                _loginHandler: function(response, scopes) {
                    if(response.status === 'connected') {
                        this._accessToken = response.authResponse.accessToken;
                        this._userId = response.authResponse.userID;

                        if(scopes) {
                            scopes.forEach(this._grant, this);
                        }

                        return true;
                    } else {
                        this._accessToken = undefined;

                        return false;
                    }
                },
                _login: function(scopes) {
                    var deferred = this._getDeferred();

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
                _logout: function() {
                    var deferred = this._getDeferred();

                    FB.api('/me/permissions', 'delete', (function(response) {
                        var result = _logoutHandler(response);
                        
                        if(result) {
                            deffered.resolve(true);  
                        } else {
                            deffered.reject(false);
                        };
                    }).bind(this));

                    return deffered.promise;
                },
                _getUserInfo: function() {
                    if(this._scopes.userInfo.permissions) {
                        var deferred = this._getDeferred();

                        FB.api('/me?fields=id,name,gender,locale,link,picture',
                            (function(response) {
                                deffered.resolve({
                                    id: response.id,
                                    name: response.name,
                                    link: response.link,
                                    picture: response.picture.data.url,
                                    gender: response.gender,
                                    locale: response.locale
                                });
                            }).bind(this)
                        );

                        return deffered.promise;
                    } else {
                        return this._login([ 'userInfo']).then(
                            function() {
                                return getUserInfo();
                            });
                    }
                },
                _autoLogin: function(/* [scopes] */) {
                    var deferred = this._getDeferred();

                    FB.getLoginStatus((function(response) {
                        if(this._loginHandler(response)) {
                            FB.api('/me/permissions', function(response) {
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
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    }).bind(this), true);

                    return deffered.promise;
                },
                _grant: function(scopeName) {

                    return this._scopes.hasOwnProperty(scopeName) ? this._scopes[scopeName].permissions = true : false;
                },
                _getScopeUrl: function(scopeName) {

                    return this._scopes.hasOwnProperty(scopeName) ? this._scopes[scopeName].url : undefined;
                }
            });

            return FacebookAuthService;
        };
    });

});