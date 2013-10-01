'use strict';

var request = require('request');

module.exports = function (grunt) {
	var LIVEREOAD_PORT = 35729, files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
					'modules/*.js',
					'routes/*.js',
					'public/*'
				],
				tasks: [ 'develop' ]
			},
			karma: {
			    files: [
					'app.js',
					'modules/*.js',
					'routes/*.js',
					'spec/*.js',
					'public/index.html',
					'public/scripts/{,*/}*.js',
					'public/{,*/}*.tpl'
				],
				tasks: [ 'develop', 'karma:integration:run' ]
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

	grunt.registerTask('default', [
		'develop',
		'watch:develop'
	]);
	
	grunt.registerTask('test', [
	   'develop',
	   'jasmine_node',
	   'karma:integration',
	   'watch:karma'
	]);
};
