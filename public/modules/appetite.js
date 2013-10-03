define([ 'libs/angular', 'libs/angular-resource', 'libs/angular-ui-router', 'controllers', 'templates' ], function(angular, undefined, undefined, controllers, templates) {

	angular.module('appetite',
		[ 'ngResource', 'ui.state' ])
		.config(function($stateProvider, $urlRouterProvider) {
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
						'main': {
							template: templates.main,
							controller: controllers.main
						}
					}, common)
				})
				.state('test1', {
					url: '/test1',
					views: angular.extend({
						'main': {
							template: templates.main,
							controller: controllers.test
						}
					}, common)
				})
				.state('test2', {
					url: '/test2',
					views: angular.extend({
						'main': {
							template: templates.test,
							controller: controllers.main
						}
					}, common)
				});
		});

	return angular.module('appetite');

});