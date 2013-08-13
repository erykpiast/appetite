'use strict';

requirejs.config({
    baseUrl: './',
    waitSeconds: 60,
    paths: {
		'libs/requirejs-text': 'bower_components/requirejs-text/text',
		'libs/jquery': 'bower_components/jquery/jquery',
		'libs/angular': 'bower_components/angular/angular',
		'libs/angular-resource': 'bower_components/angular-resource/angular-resource',
		'libs/angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
		'libs/angular-cookies': 'bower_components/angular-cookies/angular-cookies',
		'libs/angular-ui': 'bower_components/angular-ui/build/angular-ui',
		'libs/angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router'
	},
	packages: [
        {
    		name: 'modules',
			location: 'scripts/modules'
		},
		{
			name: 'templates',
			location: 'templates'
		},
		{
			name: 'controllers',
			location: 'scripts/controllers'
		},
		{
			name: 'directives',
			location: 'scripts/directives'
		},
		{
			name: 'filters',
			location: 'scripts/filters'
		},
		{
			name: 'services',
			location: 'scripts/services'
		}
	],
	shim: {
		'libs/angular': {
			exports: 'angular',
			deps: [ 'libs/jquery' ]
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

require([ 'libs/angular', 'modules/appetite' ], function(angular) {

    angular.bootstrap(document, [ 'appetite' ]);

});
