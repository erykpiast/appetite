define([ 'libs/angular', 'libs/angular-cookies', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('auth', function($cookies) {

            $cookies.auth = angular.toJson({ service: 'facebook', accessToken: 'a1' });
            
            return {
                currentUser: {
                    "id": 1,
                    "authService": "facebook",
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