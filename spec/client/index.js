var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

var spec = '../spec/client/';

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/public',

    paths: {
        'text': 'bower_components/requirejs-text/text',
        'libs/jquery': 'bower_components/jquery/jquery',
        'libs/jquery-cookie': 'bower_components/jquery.cookie/jquery.cookie',
        'libs/angular': 'bower_components/angular/angular',
        'libs/angular-resource': 'bower_components/angular-resource/angular-resource',
        'libs/angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'libs/angular-cookies': 'bower_components/angular-cookies/angular-cookies',
        'libs/angular-ui': 'bower_components/angular-ui/build/angular-ui',
        'libs/angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'libs/facebook': '//connect.facebook.net/pl_PL/all',
    // for tests only >> 
        'libs/angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'mods/rest' : spec + 'rest'
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
        },
        'libs/jquery': {
            exports: 'jQuery'
        },
        'libs/jquery-cookie': {
            deps: [ 'libs/jquery' ]
        },
        'libs/facebook': {
            exports: 'FB'
        },
    // for tests only >>
        'libs/angular-mocks': {
            deps: [ 'libs/angular' ]
        },
    },

    // ask Require.js to load these files (all our tests)
    deps: tests.concat('libs/angular-mocks'),

    // start test run, once Require.js is done
    callback: window.__karma__.start
});