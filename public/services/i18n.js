define([ 'libs/angular', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('i18n', function() {
            
            return {
                common: {
                    lastestOffers: 'Ostatnie oferty'
                },
                offer: {
                	recipeFrom: 'Przepis pochodzi z'
                }
            };
            
        });
    
});