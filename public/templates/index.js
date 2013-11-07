(function() {
    
    var templates = [ 'header', 'footer',
        'test', 'main', 'offers', 'offer', 'offer-create',
        'offer-thumbnail', 'offer-author', 'comment', 'gallery', 'add-comment', 'image-picker' ];
    
    define([ 'libs/underscore' ].concat(templates.map(function(template) {
        return 'text!templates/' + template + '.tpl';
    })),
    function() {
    
        var o = { },
            _ = arguments[0],
            args = Array.prototype.slice.call(arguments, 1);
        
        templates.forEach(function(template, index) {
            o[_.camelize(template)] = args[index];
        });
    
        return o;
    
    });

})();