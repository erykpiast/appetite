define([ 'libs/angular', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('i18n', function() {
            
            return {
                addComment: {
                    header: 'Dodaj komentarz',
                    placeholder: 'Twój komentarz',
                    submit: 'Dodaj komentarz',
                    response: 'Odpowiedz na ofertę'
                },
                common: {
                    ago: 'temu',
                    apply: 'Zatwierdź',
                    lastestOffers: 'Ostatnie oferty'
                },
                imagePicker: {
                    addNext: 'Dodaj kolejne zdjęcie',
                    adderHeader: 'Dodawanie zdjecia',
                    header: 'Dodaj zdjęcia',
                    pasteUrl: 'Wklej adres zdjęcia',
                    urlExample: 'np. "http://static.mojeulubioneprzepisy/images/87912_01.jpg"'
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
                        detailsHeader: 'Informacje szczegółowe (możesz wypełnić później)',
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
                        saveOrStart: 'Zapisz na później lub opublikuj teraz',
                        start: 'Rozpoczęcie oferty',
                        startOffer: 'Wystartuj ofertę (uwaga, nie ma odwrotu! :)',
                        submitTemplate: 'Zapisz ofertę',
                        tags: 'Słowa kluczowe',
                        templateHeader: 'Dodawanie oferty',
                        title: 'Tytuł oferty'
                    },
                	recipeFrom: 'Przepis pochodzi z',
                    remainingTime: 'Czas do końca'
                },
                user: {
                    currentOffers: 'Bieżące oferty użytkownika'
                }
            };
            
        });
    
});