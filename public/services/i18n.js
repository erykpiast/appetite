define([ 'libs/angular', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('i18n', function() {
            
            return {
                common: {
                    lastestOffers: 'Ostatnie oferty',
                    ago: 'temu'
                },
                offer: {
                    acceptResponse: 'Zaakceptuj odpowiedź',
                    add: 'Dodaj własną ofertę',
                    comment: {
                        answerPrelude: 'To jest odpowiedź na komentarz użytkownika',
                        answerTo: 'Odpowiedz na komentarz',
                        clearAnswer: 'Skomentuj ofertę',
                        discardConfirmation: 'Jesteś w trakcie edycji komentarza. Czy chcesz skasować wpisany tekst przed rozpoczęciem odpowiadania na post?'
                    },
                    create: {
                        description: 'Krótki opis',
                        end: 'Zakończenie oferty',
                        example: {
                            description: 'np. "Pyszny placek ze świeżymi wiśniami na kruchym cieście"',
                            place: 'np. "Poznań, Stare Miasto"',
                            recipe: 'np. "http://www.mojeulubioneprzepisy/ciasta/kruszaniec-z-wisniami-87912.html"',
                            tags: 'np. "wiśnie, ciasto kruche, świeże owoce, kruszaniec"',
                            title: 'np. "Wiśniowy kruszaniec"'
                        },
                        place: 'Przybliżone miejsce odbioru',
                        recipe: 'Źródło przepisu',
                        start: 'Rozpoczęcie oferty',
                        submit: 'Dodaj ofertę',
                        tags: 'Słowa kluczowe',
                        title: 'Tytuł oferty'
                    },
                	recipeFrom: 'Przepis pochodzi z',
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