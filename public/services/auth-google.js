define([ 'libs/angular', './module-auth', 'libs/googlePlus' ], function (angular, module, gapi) {

	module
	.factory('google', function($rootScope, $q, resource, authConfig, authServices) {
		var login,
			accessToken;

		var scopes = {
			userInfo: {
				url: 'https://www.googleapis.com/auth/userinfo.profile',
				permissions: false
			}
		};

		var _getScopeUrl = function(scName) {

			return scopes.hasOwnProperty(scName) ? scopes[scName].url : undefined;
		};

		var _grant = function(scName) {

			return scopes.hasOwnProperty(scName) ? scopes[scName].permissions = true : false;
		};

		var _loginHandler= function(deffered, scopes, response) {
			if(response && response['access_token']) {
				accessToken = response['access_token'];

				if(!!scopes) scopes.forEach(_grant);

				$rootScope.$apply(function() {
					deffered.resolve(true);
				});

				$rootScope.$apply(function() {
					$rootScope.$emit(
						authConfig.events.login,
						{
							serviceName: __service.name,
							scopes: scopes,
							accessToken: accessToken
						}
					);
				});
			} else {
				deffered.reject(false);
				// "access_denied" - User denied access to your app
				// "immediate_failed" - Could not automatically log in the user (after rendering button, when app is not authorized)
			}
		};


		var _resRevokeToken = resource(window.location.origin + '/app/google-disconnect.php?token=:accessToken', { },
			{
				get: {
					method: 'GET',
					params: { accessToken: '' },
					dataFactory: function(response) {
						return response;
					}
				}
			}
		);


		function getUserInfo() {
			if(scopes.userInfo.permissions) {
				var deffered = $q.defer();

				gapi.client.request({
					method: 'GET',
					path: 'oauth2/v2/userinfo',
					callback: function(response) {
						response = {
                            id: response.id,
							name: response.name,
							link: response.link,
							picture: response.picture,
							gender: response.gender,
							locale: response.locale
						};

						$rootScope.$apply(function() {
							deffered.resolve(response);
						});
					}
				});

				return deffered.promise;
			} else {
				return login([ 'userInfo']).then(
					function() {
						return getUserInfo();
					},
					function() {
						return null;
					});
			}
		}

		function login(scopes) {
			var deffered = $q.defer();

			gapi.auth.authorize(
				{
					client_id: authConfig.google.id,
					scope: scopes.map(_getScopeUrl),
					immediate: false
				},
				_loginHandler.bind(null, deffered, scopes)
			);
			

			return deffered.promise;
		}


		function autoLogin(scopes) {
			var deffered = $q.defer();

			if(gapi.auth) {
				gapi.auth.authorize(
					{
						client_id: authConfig.google.id,
						scope: (scopes ? scopes.map(_getScopeUrl) : ''),
						immediate: true
					},
					_loginHandler.bind(null, deffered, scopes),
					true);
			}

			return deffered.promise;
		}


		function logout() {
			var deffered = $q.defer();

			_resRevokeToken.get({ accessToken: gapi.auth.getToken().access_token },
				function(response) {
					if(response && response.success) {
						deffered.resolve(true);

						$rootScope.$emit(
							authConfig.events.logout,
							{
								serviceName: __service.name
							}
						);
					} else {
						deffered.reject(false);
					}
				},
                function(response) {
                    if(response.status == '401' || response.status == '403') {
                        $rootScope.$emit(
    						authConfig.events.logout,
							{
								serviceName: __service.name
							}
						);
                    }
                }
			);

			return deffered.promise;
		}


		var __service = authServices.google = {
			name: 'google',
			login: login,
			autoLogin: autoLogin,
			logout: logout,
			getUserInfo: getUserInfo
		};

		return __service;
	});

});
