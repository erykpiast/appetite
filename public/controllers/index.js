(function() {
    
    var controllers = [ 'header', 'footer',
        'test', 'main', 'offer' ];
    
    define(controllers.map(function(controller) {
    	return 'controllers/' + controller;
    }), function() {
    
        var o = { },
            args = arguments;
        
        controllers.forEach(function(controller, index) {
            o[controller] = args[index];
        });
    
        return o;
    
    });

})();