var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

var bower = 'public/bower_components',
    spec = 'spec/client';

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        'libs/jquery': bower + '/jquery/jquery',
        'libs/jquery.cookie': bower + '/jquery.cookie/jquery.cookie',
        'mods/rest' : spec + '/rest'
    },
    
    // ask Require.js to load these files (all our tests)
    deps: tests,

    shim: {
        'libs/jquery': {
            exports: 'jQuery',
        },
        'libs/jquery.cookie': {
            deps: [ 'libs/jquery' ]
        }
    },

    // start test run, once Require.js is done
    callback: window.__karma__.start
});