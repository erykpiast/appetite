define([ 'libs/angular', './module-auth', 'libs/underscore' ],
function (angular, module, _) {

	module
	.run(function($rootScope, authConfig, authData, authGeneric, rest) {
        $rootScope.$on(authConfig.events.login, function() {
            authGeneric.getUserInfo().then(function(userData) {
                rest.user.create(_.restrict(userData,
                	[ 'firstName', 'lastName', 'gender', 'site', 'avatar' ]))
                .$promise.then(function(res) {
					authData.userInfo = angular.extend({ }, res.data);
				});
            })
        });

        $rootScope.$on(authConfig.events.logout, function(e, data) {
        	$rootScope.currentUser = null;
        });
	});

});