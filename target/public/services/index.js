(function() {

    define([ 
    		'q',
            'rest',
            'i18n',
            'auth-generic',
            'auth-facebook',
            'auth-autologin',
            'auth-find-or-create'
            ].map(function(f) { return './' + f; }),
           function() { }
    );

})();