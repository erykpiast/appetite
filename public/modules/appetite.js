define([ 'libs/angular', 'modules/filters', 'modules/auth', 'libs/angular-resource', 'libs/cookie-store', 'libs/angular-ui-router', 'controllers', 'templates' ],
function(angular, filters, auth, undefined, undefined, undefined, controllers, templates) {

	angular.module('appetite',
		[ 'ngResource', 'ngCookies', 'ui.state', 'filters', 'auth' ])
		.config(function($stateProvider, $urlRouterProvider, $locationProvider, $cookieStoreProvider) {
		    $urlRouterProvider.otherwise('/');

			var common = {
					'header@': {
						template: templates.header,
						controller: controllers.header
					},
					'footer@': {
						template: templates.footer,
						controller: controllers.footer
					}
				};

			$stateProvider
				.state('index', {
					url: '/',
					views: angular.extend({
						'content@': {
							template: templates.main,
							controller: controllers.main
						}
					}, common)
				})
				.state('offer', {
					url: '/offer',
					views: angular.extend({
						'content@': {
							template: templates.offers,
							controller: controllers.offers
						}
					}, common)
				})
				.state('offer.details', {
					url: '/{id:[0-9]{1,8}}',
					views: angular.extend({
						'content@': {
							template: templates.offer,
							controller: controllers.offer
						}
					}, common)
				})
				.state('offer.create', {
					url: '/create',
					views: angular.extend({
						'content@': {
							template: templates.offerCreate,
							controller: controllers.offerCreate
						}
					}, common)
				})
				.state('user', {
					url: '/user',
					views: angular.extend({
						'content@': {
							template: templates.users,
							controller: controllers.users
						}
					}, common)
				})
				.state('user.details', {
					url: '/{id:[0-9]{1,8}}',
					views: angular.extend({
						'content@': {
							template: templates.user,
							controller: controllers.user
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
				$state.transitionTo(state, params, { location: true, inherit: true, relative: $state.$current, notify: true });
			}
		});

	return angular.module('appetite');

});