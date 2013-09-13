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
				options: { livereload: LIVEREOAD_PORT },
			},
			css: {
				files: ['public/app/styles/{,*/}*.css'],
				options: { livereload: LIVEREOAD_PORT },
			},
			fonts: {
				files: ['public/app/fonts/{,*/}*.{woff,ttf,svg}'],
				options: { livereload: LIVEREOAD_PORT },
			},
			images: {
				files: ['public/app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
				options: { livereload: LIVEREOAD_PORT },
			},
			templates: {
				files: ['public/app/{,*/}*.tpl'],
				options: { livereload: LIVEREOAD_PORT },
			},
			html: {
				files: ['public/app/index.html'],
				options: { livereload: LIVEREOAD_PORT },
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

// 	grunt.config.requires('watch.server.files');
// 	files = grunt.file.expand(grunt.config('watch.server.files'));

// 	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted', function () {
// 		var done = this.async();
// 		setTimeout(function () {
// 			request.get('http://localhost:' + LIVEREOAD_PORT + '/changed?files=' + files.join(','),  function(err, res) {
// 					var reloaded = !err && res.statusCode === 200;
// 					if (reloaded) {
// 						grunt.log.ok('Delayed live reload successful.');
// 					} else {
// 						grunt.log.error('Unable to make delayed live reload.');
// 					}
// 					done(reloaded);
// 				});
// 		}, 500);
// 	});

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
