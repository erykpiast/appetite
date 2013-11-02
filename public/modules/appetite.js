define([ 'libs/angular', 'modules/filters', 'libs/angular-resource', 'libs/angular-ui-router', 'controllers', 'templates' ], function(angular, filters, undefined, undefined, controllers, templates) {

	angular.module('appetite',
		[ 'ngResource', 'ngCookies', 'ui.state', 'filters' ])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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