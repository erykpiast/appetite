define([ 'libs/angular', './module-auth' ],
function (angular, module) {

	module
	.run(function($rootScope, authConfig, authData, authGeneric, rest) {
		$rootScope.$on(authConfig.events.login, function() {
			rest.user.create().$then(function(res) {
				console.log(res.data);
			});
        });

        $rootScope.$on(authConfig.events.logout, function(e, data) {
        	// mark user entity as deleted (or rather disabled)
        });
	});

});