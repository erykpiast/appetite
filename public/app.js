'use strict';

requirejs.config({
    baseUrl: './',
    waitSeconds: 60,
    paths: {
		'text': 'bower_components/requirejs-text/text',
		'libs/angular': 'bower_components/angular-unstable/angular',
		'libs/angular-resource': 'bower_components/angular-resource-unstable/angular-resource',
		'libs/angular-sanitize': 'bower_components/angular-sanitize-unstable/angular-sanitize',
		'libs/angular-cookies': 'bower_components/angular-cookies/angular-cookies',
		'libs/angular-ui': 'bower_components/angular-ui/build/angular-ui',
		'libs/angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router'
	},
	packages: [
		'modules',
		'templates',
		'controllers',
		'directives',
		'filters',
		'services'
	].map(function(pkg) {
		return {
			name: pkg,
			location: pkg,
			main: 'index.js'
		};
	}),
	shim: {
		'libs/angular': {
			exports: 'angular'
		},
		'libs/angular-resource': {
			deps: [ 'libs/angular' ]
		},
		'libs/angular-sanitize': {
			deps: [ 'libs/angular' ]
		},
		'libs/angular-cookies': {
			deps: [ 'libs/angular' ]
		},
		'libs/angular-ui': {
			deps: [ 'libs/angular' ]
		},
		'libs/angular-ui-router': {
			deps: [ 'libs/angular-ui' ]
		}
	}
});

require([ 'libs/angular', 'modules/appetite', 'directives', 'services' ], function(angular) {

    angular.bootstrap(document, [ 'appetite' ]);

});
