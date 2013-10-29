define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite', 'services/node-rest', 'services/fake-rest' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('rest', function(nodeRest, fakeRest) {
            
            return angular.extend({ }, nodeRest);
        });
});