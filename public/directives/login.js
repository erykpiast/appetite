define([ 'libs/angular', 'modules/appetite', 'services/auth', 'libs/underscore', 'templates' ],
function(angular, appetite, auth, _, templates) {

	// window.___gcfg = {
	// 	lang: 'pl-PL',
	// 	parsetags: 'explicit'
	// };


	function _getService(authServices, serviceName) {
		return {
				runner: authServices[serviceName] ? new authServices[serviceName]() : undefined,
				label: _.capitalize(serviceName)
			};
	}


	appetite
		.directive('appLogin', function() {
			return {
				replace: true,
				restrict: 'E',
				template: templates.login,
				scope: true,
				link: function(scope, element, attrs) {
					scope.authServices = [ 'facebook'/*, 'google'*/ ];
				}
			};
		})
		.directive('appSignButton', function($rootScope, authServices) {
			return {
				replace: true,
				restrict: 'E',
				template: '<button ng-click="requestLogin()">{{ i18n.common.signWith }} {{ serviceLabel }}</button>',
				scope: { serviceName: '@service' },
				link: function(scope, element, attrs) {
					var service = _getService(authServices, scope.serviceName);

					if(!service.runner) {
						return false;
					}

					scope.serviceLabel = service.label;

					scope.requestLogin = function() {
						service.runner.login([ 'userInfo' ]);
					};
				}
			};
		})
		.directive('appUnsignButton', function($rootScope, authServices) {
			var services = _getServices(authServices);

			return {
				replace: true,
				restrict: 'E',
				template: '<button ng-click="requestLogout()">{{ i18n.common.unsignFrom }} {{ serviceLabel }}</button',
				scope: { serviceName: '@service' },
				link: function(scope, element, attrs) {
					var service = _getService(authServices, scope.serviceName);

					if(!service.runner) {
						return false;
					} 

					scope.serviceLabel = service.label;

					scope.requestLogout = function() {
						service.runner.logout();
					};
				}
			};
		});

});