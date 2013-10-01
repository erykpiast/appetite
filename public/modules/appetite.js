define([ 'libs/angular', 'libs/angular-ui-router', 'controllers', 'directives' ], function(angular, undefined, controllers) {

	angular.module('appetite',
		[ 'ui.state' ])
		.config(function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			var common = {
					'header': {
						templateUrl: 'templates/header.tpl',
						controller: controllers.header
					},
					'footer': {
						templateUrl: 'templates/footer.tpl',
						controller: controllers.footer
					}
				};

			$stateProvider
				.state('index', {
					url: '/',
					views: angular.extend({
						'main': {
							templateUrl: 'templates/main.tpl',
							controller: controllers.main
						}
					}, common)
				})
				.state('test1', {
					url: '/test1',
					views: angular.extend({
						'main': {
							templateUrl: 'templates/main.tpl',
							controller: controllers.test
						}
					}, common)
				})
				.state('test2', {
					url: '/test2',
					views: angular.extend({
						'main': {
							templateUrl: 'templates/test.tpl',
							controller: controllers.main
						}
					}, common)
				});
		});

	return angular.module('appetite');

});