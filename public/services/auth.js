define([ 'libs/angular', 'modules/auth', 'services/auth-facebook' ],
function(angular, auth, undefined) {

    auth
    .config(function(authServiceFacebookProvider) {
        authServiceFacebookProvider.setAppId('467246670041226');
    })
    .factory('auth', function($cookieStore, authServices, authServiceFacebook) {
        Array.create(arguments).slice(2).forEach(function(service) {
            authServices[service.prototype.name] = service;
        });

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