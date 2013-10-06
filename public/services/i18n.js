define([ 'libs/angular', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('i18n', function($rootScope) {
            
            $rootScope.i18n = {
                common: {
                    lastestOffers: 'Ostatnie oferty'
                }  
            };
            
        });
    
});