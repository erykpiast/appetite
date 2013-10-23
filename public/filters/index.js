(function() {
    
    var filters = [ 'for-now' ];
    
    define([ 'libs/underscore' ].concat(filters.map(function(filter) {
    	return 'filters/' + filter;
    })),
    function() {
    
        var o = { },
            _ = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);
        
        filters.forEach(function(filter, index) {
            o[_.camelize(filter)] = args[index];
        });
    
        return o;
    
    });

})();