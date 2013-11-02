define([ 'libs/angular', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('i18n', function() {
            
            return {
                common: {
                    lastestOffers: 'Ostatnie oferty',
                    ago: 'temu'
                },
                offer: {
                	recipeFrom: 'Przepis pochodzi z',
                    acceptResponse: 'Zaakceptuj odpowiedź',
                    remainingTime: 'Czas do końca'
                },
                addComment: {
                    header: 'Dodaj komentarz',
                    placeholder: 'Twój komentarz',
                    submit: 'Dodaj komentarz',
                    response: 'Odpowiedz na ofertę'
                }
            };
            
        });
    
});