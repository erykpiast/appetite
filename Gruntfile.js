'use strict';

module.exports = function(grunt) {
    var LIVEREOAD_PORT = 35729,
        appDir = 'public',
        mockupDir = 'mockup-v1';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dev: {
                options: {
                    basePath: appDir,
                    sassDir: 'sass',
                    cssDir: 'styles',
                    specify: appDir + '/sass/style.scss',
                    require: [ 'compass', 'compass-inuit', 'scut' ],
                    force: true,
                    relativeAssets: true,
                    noLineComments: true,
                    debugInfo: true
                }
            },
            mockup: {
                options: {
                    basePath: mockupDir,
                    sassDir: 'sass',
                    cssDir: 'styles',
                    specify: mockupDir + '/sass/style.scss',
                    require: [ 'compass', 'compass-inuit', 'scut', 'font-awesome-sass' ],
                    force: true,
                    relativeAssets: true,
                    noLineComments: true,
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: [ '> 1%', 'last 2 versions' ],
                map: true
            },
            dev: {
                src: appDir + '/styles/style.css',
                dest: appDir + '/styles/style.css'
            },
            mockup: {
                src: mockupDir + '/styles/style.css',
                dest: mockupDir + '/styles/style.css'
            }
        },
        develop: {
            server: {
                file: 'app.js'
            }
        },
        'http-server': {
            mockup: {
                root: mockupDir,
                port: 8080,
                host: '0.0.0.0',
                cache: 0,
                autoIndex: true,
                defaultExt: 'html'
            }
        },
        watch: {
            options: {
                livereload: LIVEREOAD_PORT
            },
            dev: {
                files: [
                    'app.js',
                    'modules/{,*/}*.js',
                    'routes/{,*/}*.js',
                    'libs/{,*/}*.js'
                ],
                tasks: [ 'develop' ]
            },
            debug: {
                files: [
                    'app.js',
                    'modules/{,*/}*.js',
                    'routes/{,*/}*.js',
                    'libs/{,*/}*.js'
                ],
                tasks: [ 'shell:debug' ]
            },
            sass: {
                files: [
                    appDir + '/sass/{,*/}*.scss'
                ],
                tasks: [ 'compass:dev', 'autoprefixer:dev' ]
            },
            karma: {
                files: [
                    'app.js',
                    'modules/*.js',
                    'routes/*.js',
                    'libs/{,*/}*.js',
                    'spec/*.js',
                    appDir + '/index.html',
                    appDir + '/scripts/{,*/}*.js',
                    appDir + '/{,*/}*.tpl'
                ],
                tasks: [ 'develop', 'compass:dev', 'autoprefixer:dev', 'karma:integration:run' ]
            },
            mockup: {
                files: [
                    mockupDir + '/sass/{,*/}*.scss',
                    mockupDir + '{,*/}*.html'
                ],
                tasks: [ 'compass:mockup', 'autoprefixer:mockup' ]
            }
        },
        karma: {
            integration: {
                configFile: 'karma.conf.js'
            }
        },
        'node-inspector': {
            dev: {
                options: {
                    'web-port': 8081,
                    'web-host': '127.0.0.1',
                    'debug-port': 5858,
                    'save-live-edit': true
                }
            }
        },
        shell: {
            debug: {
                options: {
                    stdout: true
                },
                command: 'node --debug-brk $(which grunt) develop'
            }
        },
        jasmine_node: {
            matchall: true,
            projectRoot: './spec/server',
            requirejs: false,
            forceExit: true
        },
        concurrent: {
            mockup: {
                tasks: [ 'http-server:mockup', 'watch:mockup' ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-develop');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-shell');

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-karma');
    
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-autoprefixer');


    grunt.registerTask('default', [
        'develop',
        'compass:dev',
        'autoprefixer:dev',
        'watch:dev'
    ]);
    
    grunt.registerTask('mockup', [
        'compass:mockup',
        'autoprefixer:mockup',
        'concurrent:mockup'
    ]);
    
    grunt.registerTask('debug', [
        'node-inspector:dev',
        'shell:debug',
        'watch:debug'
    ]);
    
    grunt.registerTask('test', [
       'develop',
       'compass:dev',
       'autoprefixer:dev',
       'jasmine_node',
       'karma:integration'
    ]);
};
