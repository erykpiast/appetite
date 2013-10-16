(function() {
    
    var directives = [ 'offer-thumbnail', 'offer-author', 'gallery' ];
    
    define([ 'libs/underscore' ].concat(directives.map(function(directive) {
    	return 'directives/' + directive;
    })),
    function() {
    
        var o = { },
            _ = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);
        
        directives.forEach(function(directive, index) {
            o[_.camelize(directive)] = args[index];
        });
    
        return o;
    
    });

})();