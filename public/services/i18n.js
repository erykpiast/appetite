define([ 'libs/angular', './module' ],
function(angular, module) {
    
    module
    .value('i18n', {
        addComment: {
            header: 'Dodaj komentarz',
            placeholder: 'Twój komentarz',
            submit: 'Dodaj komentarz',
            response: 'Odpowiedz na ofertę'
        },
        common: {
            ago: 'temu',
            apply: 'Zatwierdź',
            lastestOffers: 'Ostatnie oferty',
            signLong: 'Zaloguj używając',
            unsignLong: 'Wyloguj - odłącz konto'
        },
        dates: {
            dayNames: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
            dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
            dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
            monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
            'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
            monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze',
            'Lip','Sie','Wrz','Pa','Lis','Gru']
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
                clickToEdit: 'kliknij, aby edytować',
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
    });
    
});