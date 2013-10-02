define([ 'libs/angular', 'modules/appetite' ], function(angular, appetite) {
    
    angular.module('appetite')
        .factory('drupal', function($resource) {
            return {
                user: $resource('/user/:id', { }, {
                    get: {
                        method: 'GET'
                    }
                }),
                offer: $resource('/offer/:id', { }, {
                    get: {
                        method: 'GET'
                    },
                    getAll: {
                        method: 'GET',
                        isArray: true
                    }
                }),
                offerTemplate: $resource('/offer-template/:id', { id: '@id' }, {
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