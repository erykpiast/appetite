// Generated on 2013-08-10 using generator-angular 0.3.1
'use strict';

var mountFolder = function(connect, dir) {
	return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
	app: 'app',
	dist: 'dist',
	expressViews: '../views'
	};

	try {
	yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
	} catch (e) {}

	grunt.initConfig({
	yeoman: yeomanConfig,
	// watch: {
	// 	index: {
	// 		files: [
	// 			'<%= yeoman.app %>/index.html'
	// 		],
	// 		tasks: ['copy:index']
	// 	}
	// },
	connect: {
		options: {
		port: 3000,
		// Change this to '0.0.0.0' to access the server from outside.
		hostname: 'localhost'
		},
		dist: {
		options: {
			middleware: function(connect) {
			return [
				mountFolder(connect, yeomanConfig.dist)
			];
			}
		}
		}
	},
	jshint: {
		options: {
		jshintrc: '.jshintrc'
		},
		all: [
		'Gruntfile.js',
		'<%= yeoman.app %>/scripts/{,*/}*.js'
		]
	},
	useminPrepare: {
		html: '<%= yeoman.app %>/index.html',
		options: {
		dest: '<%= yeoman.dist %>'
		}
	},
	usemin: {
		html: ['<%= yeoman.dist %>/{,*/}*.html'],
		css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
		options: {
		dirs: ['<%= yeoman.dist %>']
		}
	},
	imagemin: {
		dist: {
		files: [{
			expand: true,
			cwd: '<%= yeoman.app %>/images',
			src: '{,*/}*.{png,jpg,jpeg}',
			dest: '<%= yeoman.dist %>/images'
		}]
		}
	},
	svgmin: {
		dist: {
		files: [{
			expand: true,
			cwd: '<%= yeoman.app %>/images',
			src: '{,*/}*.svg',
			dest: '<%= yeoman.dist %>/images'
		}]
		}
	},
	cssmin: {
		dist: {
		files: {
			'<%= yeoman.dist %>/styles/main.css': [
			'.tmp/styles/{,*/}*.css',
			'<%= yeoman.app %>/styles/{,*/}*.css'
			]
		}
		}
	},
	htmlmin: {
		dist: {
			options: {
				removeCommentsFromCDATA: true,
				// https://github.com/yeoman/grunt-usemin/issues/44
				//collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true
			},
			files: [{
				expand: true,
				cwd: '<%= yeoman.app %>',
				src: ['*.html', 'views/*.html'],
				dest: '<%= yeoman.dist %>'
			}]
		}
	},
	// Put files not handled in other tasks here
	// copy: {
	// 	index: {
	// 		files: [{
	// 			expand: true,
	// 			cwd: '<%= yeoman.app %>',
	// 			src: [
	// 				'index.html'
	// 			],
	// 			dest: '<%= yeoman.expressViews %>'
	// 		}]
	// 	}
	// },
	concurrent: {
		dist: [
		'imagemin',
		'svgmin',
		'htmlmin'
		]
	},
	karma: {
		unit: {
		configFile: 'karma.conf.js',
		singleRun: true
		}
	},
	cdnify: {
		dist: {
		html: ['<%= yeoman.dist %>/*.html']
		}
	},
	ngmin: {
		dist: {
		files: [{
			expand: true,
			cwd: '<%= yeoman.dist %>/scripts',
			src: '*.js',
			dest: '<%= yeoman.dist %>/scripts'
		}]
		}
	},
	uglify: {
		dist: {
		files: {
			'<%= yeoman.dist %>/scripts/scripts.js': [
			'<%= yeoman.dist %>/scripts/scripts.js'
			]
		}
		}
	}
	});

	grunt.registerTask('test', [
	'clean:server',
	'concurrent:test',
	'connect:test',
	'karma'
	]);

	grunt.registerTask('default', [
	// 'jshint',
	// 'copy',
	// 'watch'
	]);
};