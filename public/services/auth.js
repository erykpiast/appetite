define([ 'libs/angular', 'libs/cookie-store', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    return angular.module('appetite')
        .factory('auth', function($cookieStore) {

            $cookieStore.put('auth', { service: 'facebook', accessToken: 'a1' });
            
            return {
                currentUser: {
                    "id": 1,
                    "authService": "facebook",
                    "accessToken": "a1",
                    "fullName": "Olga Krysztofiak",
                    "gender": "female",
                    "site": "http://olgagotuje.pl/",
                    "avatar": {
                        "id": 1,
                        "filename": "1001.jpg"
                    },
                    "place": {
                        "id": 1,
                        "serviceId": "Poznań, Rataje"
                    }
                }
            };
            
        });
    
});