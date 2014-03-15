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
        shell: {
            options: {
                stdout: true,
                stderr: true,
                async: true
            },
            restServer: {
                command: 'node app.js',
                options: {
                    execOptions: {
                        cwd: '<%= conf.target.server %>',
                        env: { NODE_ENV: 'devel', PORT: '<%= conf.port.server %>' }
                    }
                }
            },
            webappServer: {
                command: 'http-server -p <%= conf.port.webapp %> -c-11',
                options: {
                    execOptions: {
                        cwd: '<%= conf.target.webapp %>'
                    }
                }
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
                    '{libs,config,routes,modules}/**/*.{js,json}'
                    // '{node_modules,libs,config,routes,modules}/**/*.{js,json}'
                ],
                tasks: [ 'build:dev:server', 'stop:server', 'start:server' ]
            },
            css: {
                files: [
                    '<%= conf.webapp %>/styles/**/*.scss'
                    // '<%= conf.webapp %>/bower_components/**/*.{scss,css}'
                ],
                tasks: [ 'build:dev:webapp:css' ]
            },
            scripts: {
                files: [
                    '<%= conf.webapp %>/index.html',
                    '<%= conf.webapp %>/{libs,modules,controllers,directives,filters,services,templates,fake-rest}/**/*.{js,tpl,json}'
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
                server: [ 'newer:copy:server' ],
                webapp: {
                    options: {
                        concurrent: true
                    },
                    html: [ 'newer:copy:html' ],
                    images: [ 'newer:copy:images' ],
                    js: [ 'newer:copy:js' ],
                    css: [ 'compass:dev', 'newer:copy:css-assets', 'newer:autoprefixer:dev' ]
                }
            }
        },
        start: {
            server: [ 'shell:restServer' ],
            webapp: [ 'shell:webappServer' ]
        },
        stop: {
            server: [ 'shell:restServer:kill' ],
            webapp: [ 'shell:webappServer:kill' ]
        }
    });

    require('load-grunt-tasks')(grunt);

    var nestedTask = require('grunt-nestedtasksrunner')(grunt);

    grunt.registerMultiTask('start', nestedTask);
    grunt.registerMultiTask('stop', nestedTask);
    grunt.registerMultiTask('build', nestedTask);

    grunt.registerTask('default', [
        // 'clean:target',
        'build:dev',
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
