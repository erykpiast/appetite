define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('rest', function(nodeRest, fakreRest) {
            var rest = fakeRest;
            
            return {
                user: rest.user,
                offer: rest.offer,
                offerTemplate: rest.offerTemplate
            };
        });
});