(function() {
    
    var controllers = [ 'header', 'footer',
        'test', 'main',
        'offers', 'offer', 'offer-create',
        'user' ];
    
    define([ 'libs/underscore' ].concat(controllers.map(function(controller) {
    	return 'controllers/' + controller;
    })), function() {
    
        var o = { },
            _ = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);
        
        controllers.forEach(function(controller, index) {
            o[_.camelize(controller)] = args[index];
        });
    
        return o;
    
    });

})();