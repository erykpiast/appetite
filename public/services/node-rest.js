define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('nodeRest', function($resource) {
            function _rest(path) {
                return '/rest/' + path.replace(/^\//, '');
            }
            
            return {
                user: $resource(_rest('/user/:id'), { }, {
                    get: {
                        method: 'GET'
                    }
                }),
                offer: $resource(_rest('/offer/:id'), { }, {
                    get: {
                        method: 'GET'
                    },
                    getAll: {
                        method: 'GET',
                        isArray: true
                    }
                }),
                offerTemplate: $resource(_rest('/offer-template/:id'), { id: '@id' }, {
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