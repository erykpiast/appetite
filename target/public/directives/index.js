(function() {

    define([ 
            'offer-thumbnail',
            'offer-author',
            'comments',
            'add-comment',
            'image-picker',
            'login',
            'current-user',
            'edit-in-place'
            ].map(function(f) { return './' + f; }),
           function() { }
    );

})();