define([ 'libs/angular', './module-auth' ],
function (angular, module) {

	module
	.run(function($rootScope, authConfig, authData, authGeneric, rest) {
        $rootScope.$on(authConfig.events.login, function() {
            authGeneric.getUserInfo().then(function(userData) {
                rest.user.create({
					firstName: userData.firstName,
					lastName: userData.lastName,
					gender: userData.gender,
					site: userData.site
				}).$then(function(res) {
					authData.userInfo = angular.extend({ }, res.data);
				});
            })
        });

        $rootScope.$on(authConfig.events.logout, function(e, data) {
        	$rootScope.currentUser = null;
        });
	});

});