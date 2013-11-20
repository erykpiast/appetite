(function() {

    define([ 
            'offer-thumbnail',
            'offer-author',
            'comments',
            'add-comment',
            'gallery',
            'image-picker',
            'login',
            'current-user'
            ].map(function(f) { return './' + f; }),
           function() { }
    );

})();