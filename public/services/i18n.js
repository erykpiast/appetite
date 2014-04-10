define(['libs/angular', './module'],
function(angular, module) {

    module.factory('i18n', function() {
        var i18n = {
            comments: {
                answerTo: 'Odpowiedz na komentarz',
                add: {
                    answerPrelude: 'To jest odpowiedź na komentarz użytkownika',
                    clearAnswer: 'Anuluj',
                    header: 'Dodaj komentarz',
                    placeholder: 'Twój komentarz',
                    submit: 'Dodaj komentarz'
                },
                header: 'Komentarze'
            },
            common: {
                ago: 'temu',
                apply: 'Zatwierdź',
                cancel: 'Anuluj',
                lastestOffers: 'Ostatnie oferty',
                signLong: 'Zaloguj używając',
                unsignLong: 'Wyloguj – odłącz konto'
            },
            dates: {
                dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
                dayNamesShort: ['Nie', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So'],
                dayNamesMin: ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
                monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
                    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
                ],
                monthNamesShort: ['Sty', 'Lu', 'Mar', 'Kw', 'Maj', 'Cze',
                    'Lip', 'Sie', 'Wrz', 'Pa', 'Lis', 'Gru'
                ]
            },
            imagePicker: {
                addNext: 'Dodaj zdjęcie',
                adderHeader: 'Dodawanie zdjecia',
                header: 'Dodaj zdjęcia',
                pasteUrl: 'Wklej adres zdjęcia',
                urlExample: 'np. "http://static.mojeulubioneprzepisy/images/87912_01.jpg"'
            },
            offer: {
                acceptResponse: 'Zaakceptuj odpowiedź',
                add: 'Dodaj własną ofertę',
                amountUnits: {
                    centimeter: 'cm (średnica formy)',
                    piece: 'szt.',
                    gram: 'g',
                    kilogram: 'kg',
                    liter: 'l'
                },
                author: {
                    header: 'Autor oferty'
                },
                order: {
                    amountUnits: {
                        valuePlaceholder: '#',
                        centimeter: 'Forma ⌀# cm',
                        piece: '# szt.',
                        gram: '# g',
                        kilogram: '# kg',
                        liter: '# l'
                    },
                    currency: 'zł',
                    doOrder: 'Zamawiam!'
                },
                create: {
                    amount: 'Ilość',
                    clickToEdit: 'Kliknij, aby edytować',
                    description: 'Krótki opis oferty',
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
                    price: 'Cena',
                    recipe: 'Źródło przepisu',
                    saveOrStart: 'Zapisz na później lub opublikuj teraz',
                    start: 'Rozpoczęcie oferty',
                    startOffer: 'Zapisz i wystartuj',
                    submitTemplate: 'Zapisz ofertę',
                    tags: 'Słowa kluczowe',
                    templateHeader: 'Dodawanie oferty',
                    title: 'Tytuł oferty'
                },
                recipeFrom: 'Przepis pochodzi z serwisu ',
                remainingTime: 'Czas do końca',
                response: {
                    action: 'Zamów',
                    inputPlaceholder: 'Komentarz do zamówienia (widoczny dla innych użytkowników, opcjonalny)'  
                } 
            },
            user: {
                currentOffers: 'Bieżące oferty użytkownika'
            }
        };

        return i18n;
    });

});