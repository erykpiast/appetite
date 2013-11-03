define([ 'libs/angular', 'modules/filters', 'libs/angular-resource', 'libs/angular-cookies', 'libs/angular-ui-router', 'controllers', 'templates' ], function(angular, filters, undefined, undefined, undefined, controllers, templates) {

	angular.module('appetite',
		[ 'ngResource', 'ngCookies', 'ui.state', 'filters' ])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider, $cookieStoreProvider) {
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
					url: '^/',
					views: angular.extend({
						'content': {
							template: templates.main,
							controller: controllers.main
						}
					}, common)
				})
				.state('offer', {
					url: '^/offer/:id',
					views: angular.extend({
						'content': {
							template: templates.offer,
							controller: controllers.offer
						}
					}, common)
				})
				.state('test2', {
					url: '^/test2',
					views: angular.extend({
						'content': {
							template: templates.test,
							controller: controllers.main
						}
					}, common)
				});
				
		    // $locationProvider.html5Mode(true);

		    $cookieStoreProvider.setDefaultOptions({
		    	path: '/',
		    	expires: new Date(60 * 365 * 24 * 60 * 60 * 1000) // cookie 'never' expires
		    });
		})
		.run(function($rootScope, $state, i18n, auth) {

			$rootScope.i18n = i18n;
			$rootScope.currentUser = auth.currentUser;

			$rootScope.goTo = function(state, params) {
				$state.transitionTo(state, params);
			}
		});

	return angular.module('appetite');

});