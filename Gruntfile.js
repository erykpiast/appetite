'use strict';

var request = require('request');

module.exports = function (grunt) {
	var LIVEREOAD_PORT = 35729,
	    appDir = 'public';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
		    dev: {
		        options: {
        		    basePath: appDir,
        		    sassDir: 'sass',
        		    cssDir: 'styles',
        		    specify: appDir + '/sass/style.scss',
        		    require: [ 'compass', 'compass-inuit' ],
        		    force: true,
        		    relativeAssets: true,
        		    noLineComments: true
        		}
        	}
		},
		autoprefixer: {
			options: {
				browsers: [ '> 1%', 'last 2 version' ]
			},
			multiple_files: {
				expand: true,
				flatten: true,
				src: appDir + '/styles/*.css',
				dest: appDir + '/styles/'
			}
		},
		develop: {
			server: {
				file: 'app.js'
			}
		},
		watch: {
			options: {
				nospawn: true,
				livereload: LIVEREOAD_PORT
			},
			develop: {
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
				tasks: [ 'compass:dev', 'autoprefixer' ]
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
				tasks: [ 'develop', 'compass:dev', 'autoprefixer', 'karma:integration:run' ]
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
		    projectRoot: "./spec/server",
		    requirejs: false,
		    forceExit: true
		}
	});


	grunt.loadNpmTasks('grunt-develop');
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
		'autoprefixer',
		'watch'
	]);
	
	grunt.registerTask('debug', [
	    'node-inspector:dev',
		'shell:debug',
		'watch:debug'
	]);
	
	grunt.registerTask('test', [
	   'develop',
	   'compass:dev',
	   'autoprefixer',
	   'jasmine_node',
	   'karma:integration',
	   'watch:karma'
	]);
};
