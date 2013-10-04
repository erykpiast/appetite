'use strict';

var request = require('request');

module.exports = function (grunt) {
	var LIVEREOAD_PORT = 35729,
	    appDir = '/public';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
		    dev: {
    		    basePath: appDir,
    		    sassDir: 'sass',
    		    cssDir: 'styles',
    		  //  specify: '^[^_]*.scss$',
    		    require: 'compass-inuit',
    		    relativeAssets: true
    		},
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
					appDir + '/{,*/}*'
				],
				tasks: [ 'develop' ]
			},
			sass: {
			    files: [
					appDir + '/sass/{,*/}*'
				],
				tasks: [ 'compass' ]
			},
			karma: {
			    files: [
					'app.js',
					'modules/*.js',
					'routes/*.js',
					'spec/*.js',
					appDir + '/index.html',
					appDir + '/scripts/{,*/}*.js',
					appDir + '/{,*/}*.tpl'
				],
				tasks: [ 'develop', 'compass:dev', 'karma:integration:run' ]
			}
		},
		karma: {
		    integration: {
		        configFile: 'karma.conf.js'
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
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-karma');
	
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.registerTask('default', [
		'develop',
		'compass:dev',
		'watch:develop',
		'watch:sass'
	]);
	
	grunt.registerTask('test', [
	   'develop',
	   'compass:dev',
	   'jasmine_node',
	   'karma:integration',
	   'watch:karma'
	]);
};
