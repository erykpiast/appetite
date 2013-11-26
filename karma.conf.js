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
			{ pattern: 'public/**/*.{js,tpl}', included: false },
			{ pattern: 'spec/client/rest.js', included: false },
			// { pattern: '**/offer-template-rest.integration.client.spec.js', included: false },
		    { pattern: '**/*.client.spec.js', included: false },
		    'spec/client/index.js'
		],
		frameworks: [ 'jasmine', 'requirejs' ],
		browsers: [ 'PhantomJS_Unsecure' ],
		singleRun: true,
		background: true,
		reporters: [ 'progress' ],
		colors: true
	});
};

