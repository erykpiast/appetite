module.exports = function(config) {
	config.set({
		files: [
		    'public/app/bower_components/jquery/jquery.min.js',
		    { pattern: '**/*.client.spec.js' }
		],
		frameworks: [ 'jasmine' ],
		browsers: [ 'PhantomJS' ],
		singleRun: true,
		port: 9876,
		runnerPort: 3000,
		background: true,
		reporters: [ 'progress' ],
		colors: true
	});
};

