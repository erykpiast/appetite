module.exports = function(config) {
	config.set({
		files: [
		    'public/app/bower_components/jquery/jquery.min.js',
		    { pattern: '**/*.browser.spec.js' }
		],
		frameworks: [ 'jasmine' ],
		browsers: [ 'PhantomJS' ],
		singleRun: true,
		reporters: [ 'progress' ],
		colors: true
	});
}

