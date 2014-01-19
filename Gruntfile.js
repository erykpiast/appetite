'use strict';

module.exports = function(grunt) {
    var LIVEREOAD_PORT = 35729,
        appDir = 'public',
        mockupDir = 'mockup-v1';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            'css-assets': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: appDir,
                        src: [ 'bower_components/jquery-ui/themes/base/images/*' ],
                        dest: appDir + '/styles/images'
                    }
                ]
            }
        },
        compass: {
            dev: {
                options: {
                    basePath: appDir,
                    sassDir: 'sass',
                    cssDir: 'styles',
                    imagesDir: 'styles/images',
                    specify: appDir + '/sass/style.scss',
                    require: [ 'compass', 'compass-inuit', 'scut', 'sass-css-importer' ],
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
                livereload: false
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
                options: {
                    livereload: LIVEREOAD_PORT
                },
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
            },
            'dev-watch': {
                tasks: [ 'watch:dev', 'watch:sass' ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-develop');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-shell');

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-karma');
    
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-autoprefixer');


    grunt.registerTask('default', [
        'develop',
        'copy:css-assets',
        'compass:dev',
        'autoprefixer:dev',
        'concurrent:dev-watch'
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
