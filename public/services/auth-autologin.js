define([ 'libs/angular', 'modules/auth' ], function (angular, auth) {

	auth
	.run(function(authConfig, authData, authServices) {
		if(authConfig.autoLogin && authData.login) {
			authServices[authData.serviceName]
				.autoLogin(authData.scopes, authData.accessToken);
		}
	});

});