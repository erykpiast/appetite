module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: {
            webapp: 'public',
            mockup: 'mockup-v1',
            target: {
                server: 'target/server',
                webapp: 'target/public'
            }
        },
        copy: {
            'css-assets': {
                files: [{
                        expand: true,
                        flatten: true,
                        cwd: '<%= conf.webapp %>',
                        src: [ 'bower_components/jquery-ui/themes/base/images/*' ],
                        dest: '<%= conf.target.webapp %>/styles/images'
                    },{
                        expand: true,
                        flatten: true,
                        cwd: '<%= conf.webapp %>',
                        src: [ 'bower_components/select2/*.{png,gif}' ],
                        dest: '<%= conf.target.webapp %>/styles/'
                    }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.webapp %>',
                    src: '{bower_components,libs,modules,controllers,directives,filters,services,templates,fake-rest}/**/*.{js,tpl,json}',
                    dest: '<%= conf.target.webapp %>'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    src: '{node_modules,libs,config,routes,modules}/**/*.{js,json}',
                    dest: '<%= conf.target.server %>'
                }]
            }
        },
        compass: {
            dev: {
                options: {
                    basePath: '<%= conf.webapp %>',
                    sassDir: 'sass',
                    cssDir: 'styles',
                    imagesDir: 'styles/images',
                    specify: 'style.scss',
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
                src: '<%= conf.target.webapp %>/styles/**/*.css'
            },
            mockup: {
                src: '<%= conf.target.mockup %>/styles/style.css'
            }
        },
        develop: {
            server: {
                file: '<%= conf.target.server %>/app.js'
            }
        },
        'http-server': {
            webapp: {
                root: '<%= conf.target.webapp %>',
                port: 8080,
                host: '0.0.0.0',
                cache: 0,
                autoIndex: true,
                defaultExt: 'html'
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
                files: [
                    'app.js',
                    '{node_modules,libs,config,routes,modules}/**/*.{js,json}'
                ],
                tasks: [ 'build:server' ]
            },
            css: {
                files: [
                    '<%= conf.webapp %>/sass/**/*.scss',
                    '<%= conf.webapp %>/bower_components/**/*.{scss,css}'
                ],
                tasks: [ 'build:dev:css' ]
            },
            scripts: {
                files: [
                    '<%= conf.webapp %>/index.html',
                    '<%= conf.webapp %>/{bower_components,libs,modules,controllers,directives,filters,services,templates,fake-rest}/**/*.{js,tpl,json}'
                ],
                tasks: [ 'build:dev:js' ]
            },
            livereload: {
                files: [ '<%= conf.target.webapp %>/**/*' ],
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
        build: {
            dev: {
                server: [ 'copy:server' ],
                js: [ 'copy:js' ],
                css: [ 'compass:dev', 'copy:css-assets', 'autoprefixer:dev' ]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('start-server', [ 'develop:server' ]);
    grunt.registerTask('start-webapp', [ 'http-server:webapp' ]);

    grunt.registerTask('default', [
        'build:dev',
        'start-server',
        'start-webapp',
        'watch'
    ]);
    
    grunt.registerTask('test', [
        'build:dev',
        'start-server',
        'start-webapp',
        'karma:integration'
    ]);
};
