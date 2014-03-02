define([ 'libs/angular', './module' ],
function(angular, module) {
    
    module
	.factory('q', function($q, $rootScope) { // "angularified" version of $q service; use with third party libraries
        return {
        	defer: function() {
        		var q = $q.defer(),
        			resolve = q.resolve,
        			reject = q.reject;

        		return angular.extend(q, {
        			resolve: function() {
        				var args = arguments;

        				$rootScope.$apply(function() {
        					resolve.apply(q, args);
        				});
        			},
        			reject: function() {
        				var args = arguments;

        				$rootScope.$apply(function() {
        					reject.apply(q, args);
        				});
        			}
        		});
        	}
        };
    });

});