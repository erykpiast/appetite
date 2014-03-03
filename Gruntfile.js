module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: {
            webapp: 'public',
            port: {
                server: 3000,
                webapp: 8080
            },
            target: {
                server: 'target/server',
                webapp: 'target/public'
            }
        },
        copy: {
            'css-assets': {
                files: [{
                        expand: true,
                        cwd: '<%= conf.webapp %>/styles/images',
                        src: '**/*.{png,gif,webp,jpg}',
                        dest: '<%= conf.target.webapp %>/styles/images'
                    },{
                        expand: true,
                        cwd: '<%= conf.webapp %>/styles/fonts',
                        src: '**/*.{woff,ttf,css}',
                        dest: '<%= conf.target.webapp %>/styles/fonts'
                    },{
                        expand: true,
                        flatten: true,
                        cwd: '<%= conf.webapp %>',
                        src: 'bower_components/jquery-ui/themes/base/images/*',
                        dest: '<%= conf.target.webapp %>/styles/images'
                    },{
                        expand: true,
                        flatten: true,
                        cwd: '<%= conf.webapp %>',
                        src: 'bower_components/select2/*.{png,gif}',
                        dest: '<%= conf.target.webapp %>/styles/'
                    }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.webapp %>',
                    src: 'index.html',
                    dest: '<%= conf.target.webapp %>'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.webapp %>/images',
                    src: [ '**/*.{png,webp,jpg}' ],
                    dest: '<%= conf.target.webapp %>/images'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.webapp %>',
                    src: [ 'app.js', '{bower_components,libs,modules,controllers,directives,filters,services,templates,fake-rest}/**/*.{js,tpl,json}' ],
                    dest: '<%= conf.target.webapp %>'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    src: [ '{node_modules,libs,config,routes,modules}/**/*.{js,json,types}', './app.js' ],
                    dest: '<%= conf.target.server %>'
                }]
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: '<%= conf.webapp %>/styles',
                    cssDir: '<%= conf.target.webapp %>/styles',
                    specify: '<%= conf.webapp %>/styles/style.scss',
                    require: [ 'compass', 'compass-inuit', 'scut', 'font-awesome-sass', 'sass-css-importer' ],
                    force: true,
                    relativeAssets: true,
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
                src: '<%= conf.target.webapp %>/styles/style.css',
                dest: '<%= conf.target.webapp %>/styles/style.css'
            }
        },
        develop: {
            server: {
                file: '<%= conf.target.server %>/app.js',
                env: { NODE_ENV: 'development', PORT: '<%= conf.port.server %>' } 
            }
        },
        'http-server': {
            webapp: {
                root: '<%= conf.target.webapp %>',
                port: '<%= conf.port.webapp %>',
                host: '0.0.0.0',
                cache: 0,
                autoIndex: true,
                defaultExt: 'html'
            }
        },
        shell: {
            killServer: {
                command: 'lsof -i:<%= conf.port.server %> -t | xargs kill'
            },
            killWebapp: {
                command: 'lsof -i:<%= conf.port.webapp %> -t | xargs kill'
            }
        },
        karma: {
            integration: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            options: {
                livereload: false
            },
            server: {
                options: {
                    spawn: false
                },
                files: [
                    'app.js',
                    '{node_modules,libs,config,routes,modules}/**/*.{js,json}'
                ],
                tasks: [ 'build:dev:server', 'start:server' ]
            },
            css: {
                files: [
                    '<%= conf.webapp %>/styles/**/*.scss',
                    '<%= conf.webapp %>/bower_components/**/*.{scss,css}'
                ],
                tasks: [ 'build:dev:webapp:css' ]
            },
            scripts: {
                files: [
                    '<%= conf.webapp %>/index.html',
                    '<%= conf.webapp %>/{bower_components,libs,modules,controllers,directives,filters,services,templates,fake-rest}/**/*.{js,tpl,json}'
                ],
                tasks: [ 'build:dev:webapp:js' ]
            },
            livereload: {
                files: [ '<%= conf.target.webapp %>/**' ],
                options: {
                    livereload: true
                }
            },
            karma: {
                files: [
                    'spec/**/*.js'
                ],
                tasks: [ 'karma:integration:run' ]
            }
        },
        clean: {
            target: [ 'target' ]
        },
        build: {
            dev: {
                options: {
                    concurrent: true,
                    logConcurrentOutput: true
                },
                server: [ 'copy:server' ],
                webapp: {
                    options: {
                        concurrent: true
                    },
                    html: [ 'copy:html' ],
                    images: [ 'copy:images' ],
                    js: [ 'copy:js' ],
                    css: [ 'compass:dev', 'copy:css-assets', 'autoprefixer:dev' ]
                }
            }
        },
        start: {
            server: [ 'develop:server' ],
            webapp: [ 'http-server:webapp' ]
        },
        stop: {
            server: [ 'shell:killServer' ],
            webapp: [ 'shell:killWebapp' ]
        },
    });

    require('load-grunt-tasks')(grunt);

    var nestedTask = require('grunt-nestedtasksrunner')(grunt);

    grunt.registerMultiTask('start', nestedTask);
    grunt.registerMultiTask('stop', nestedTask);
    grunt.registerMultiTask('build', nestedTask);

    grunt.registerTask('default', [
        'clean:target',
        'build:dev',
        'stop',
        'start',
        'watch'
    ]);
    
    grunt.registerTask('test', [
        'build:dev',
        'start-server',
        'start-webapp',
        'karma:integration'
    ]);
};
