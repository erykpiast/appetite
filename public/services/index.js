(function() {
    
    var services = [ 'rest', 'i18n', 'auth' ];
    
    define([ 'libs/underscore' ].concat(services.map(function(service) {
        return 'services/' + service;
    })),
    function() {
    
        var o = { },
            _ = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);
        
        services.forEach(function(service, index) {
            o[_.camelize(service)] = args[index];
        });
    
        return o;
    
    });

})();