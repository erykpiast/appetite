define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('fakeRest', function($resource) {
            function _rest(path) {
                return '/fake-rest/' + path.replace(/^\//, '');
            }
            
            return {
                user: $resource(_rest('/user/:id.json'), { }, {
                    get: {
                        method: 'GET'
                    }
                }),
                offer: $resource(_rest('/offer/:id.json'), { id: 'all' }, {
                    get: {
                        method: 'GET'
                    },
                    getAll: {
                        method: 'GET',
                        isArray: true
                    }
                }),
                offerTemplate: $resource(_rest('/offer-template/:id.json'), { id: '@id' }, {
                    create: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PUT'
                    },
                    destroy: {
                        method: 'DELETE'
                    }
                })
            };
        });
    
});