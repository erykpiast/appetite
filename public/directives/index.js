(function() {

    define([ 
            'offer-thumbnail',
            'offer__author',
            'comments',
            'add-comment',
            'add-offer-comment',
            'image-picker',
            'login',
            'current-user',
            'edit-in-place',
            'tree',
            'fixed'
            ].map(function(f) { return './' + f; }),
           function() { }
    );

})();