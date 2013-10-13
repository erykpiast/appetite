define([ 'libs/angular', 'libs/angular-resource', 'libs/angular-ui-router', 'controllers', 'templates' ], function(angular, undefined, undefined, controllers, templates) {

	angular.module('appetite',
		[ 'ngResource', 'ui.state' ])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
			$locationProvider.html5Mode(true);

			$urlRouterProvider.otherwise('/');

			var common = {
					'header': {
						template: templates.header,
						controller: controllers.header
					},
					'footer': {
						template: templates.footer,
						controller: controllers.footer
					}
				};

			$stateProvider
				.state('index', {
					url: '/',
					views: angular.extend({
						'content': {
							template: templates.main,
							controller: controllers.main
						}
					}, common)
				})
				.state('offer', {
					url: '/offer/:id',
					views: angular.extend({
						'content': {
							template: templates.offer,
							controller: controllers.offer
						}
					}, common)
				})
				.state('test2', {
					url: '/test2',
					views: angular.extend({
						'content': {
							template: templates.test,
							controller: controllers.main
						}
					}, common)
				});
		})
		.run(function($rootScope, $state, i18n) {

			$rootScope.i18n = i18n;

			$rootScope.goTo = function(state, params) {
				var params = Array.prototype.slice.call(arguments, 1);

				$state.transitionTo(state, params);
			}
		});

	return angular.module('appetite');

});