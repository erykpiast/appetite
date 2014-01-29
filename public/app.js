'use strict';

requirejs.config({
    baseUrl: '/static',
    waitSeconds: 60,
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'libs/jquery': 'bower_components/jquery/jquery',
        'libs/jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
        'libs/jquery-cookie': 'bower_components/jquery.cookie/jquery.cookie',
        'libs/jquery-select2': 'bower_components/select2/select2',
        'libs/angular': 'bower_components/angular/angular',
        'libs/angular-resource': 'bower_components/angular-resource/angular-resource',
        'libs/angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'libs/angular-cookies': 'bower_components/angular-cookies/angular-cookies',
        'libs/angular-ui': 'bower_components/angular-ui/build/angular-ui',
        'libs/angular-ui-date': 'bower_components/angular-ui-date/src/date',
        'libs/angular-ui-select2': 'bower_components/angular-ui-select2/src/select2',
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
            deps: [ 'libs/jquery' ],
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
            deps: [ 'libs/angular', 'libs/jquery-ui' ]
        },
        'libs/angular-ui-date': {
            deps: [ 'libs/angular-ui' ]
        },
        'libs/angular-ui-select2': {
            deps: [ 'libs/angular-ui', 'libs/jquery-select2' ]
        },
        'libs/angular-ui-router': {
            deps: [ 'libs/angular-ui' ]
        },
        'libs/jquery': {
            exports: 'jQuery'
        },
        'libs/jquery-cookie': {
            deps: [ 'libs/jquery' ]
        },
        'libs/jquery-select2': {
            deps: [ 'libs/jquery' ]
        },
        'libs/jquery-ui': {
            deps: [ 'libs/jquery' ]
        },
        'libs/facebook': {
            exports: 'FB'
        },
    }
});

require([ 'libs/angular', 'modules/appetite' ],
function(angular) {

    angular.bootstrap(document, [ 'appetite' ]);

});
