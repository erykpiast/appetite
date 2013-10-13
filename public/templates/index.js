(function() {
    
    var templates = [ 'header', 'footer',
        'test', 'main', 'offer',
        'offer-thumbnail' ];
    
    define(templates.map(function(template) { return 'text!templates/' + template + '.tpl'; }),
    function() {
    
        var o = { },
            args = arguments;
        
        templates.forEach(function(template, index) {
            o[template] = args[index];
        });
    
        return o;
    
    });

})();