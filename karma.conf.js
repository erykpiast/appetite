module.exports = function(config) {
	config.set({
	    customLaunchers: {
            'PhantomJS_Unsecure': {
                base: 'PhantomJS',
                options: {
                    settings: {
                        webSecurityEnabled: false
                    }
                }
            }
        },
		files: [
		    'public/bower_components/jquery/jquery.min.js',
		    'public/bower_components/jquery.cookie/jquery.cookie.js',
		    { pattern: '**/*.client.spec.js' }
		],
		frameworks: [ 'jasmine' ],
		browsers: [ 'PhantomJS_Unsecure' ],
		singleRun: true,
		background: true,
		reporters: [ 'progress' ],
		colors: true
	});
};

