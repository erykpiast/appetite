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
					'public/app/*'
				],
				tasks: [ 'develop' ]
			},
			karma: {
			    files: [
					'app.js',
					'modules/*.js',
					'routes/*.js',
					'spec/*.js',
					'public/app/index.html',
					'public/app/scripts/{,*/}*.js',
					'public/app/{,*/}*.tpl'
				],
				tasks: [ 'develop', 'karma:integration:run' ]
			},
			js: {
				files: ['public/app/scripts/{,*/}*.js'],
				options: { livereload: true },
			},
			css: {
				files: ['public/app/styles/{,*/}*.css'],
				options: { livereload: true },
			},
			fonts: {
				files: ['public/app/fonts/{,*/}*.{woff,ttf,svg}'],
				options: { livereload: true },
			},
			images: {
				files: ['public/app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
				options: { livereload: true },
			},
			templates: {
				files: ['public/app/{,*/}*.tpl'],
				options: { livereload: true },
			},
			html: {
				files: ['public/app/index.html'],
				options: { livereload: true },
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
