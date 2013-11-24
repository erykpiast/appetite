var _  = require('underscore');


_.str = require('underscore.string');
_.mixin(_.str.exports());


_.mixin({
    restrict: function(obj, keys) {
        var o = { };

        _.each(obj, function(value, key) {
            if(keys.indexOf(key) !== -1) {
                o[key] = value;
            }
        });

        return o;
    }
});


module.exports = _;