define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('nodeRest', function($resource) {
            function _rest(path) {
                return '/rest/' + path.replace(/^\//, '');
            }
            
            return {
                user: $resource(_rest('/user/:id'), { }, {
                    retrieve: {
                        method: 'GET'
                    }
                }),
                offer: angular.extend($resource(_rest('/offer/:id'), { }, {
                    retrieve: {
                        method: 'GET'
                    },
                    retrieveAll: {
                        method: 'GET',
                        isArray: true
                    }
                }), { comments: $resource(_rest('/offer/:offerId/comments'), { }, {
                    retrieveAll: {
                        method: 'GET',
                        isArray: true
                    }
                }) }),
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
                }),
                comment: $resource(_rest('/comment/:id'), { }, {
                    retrieve: {
                        method: 'GET'
                    },
                    create: {
                        method: 'POST'
                    }
                }),
                response: $resource(_rest('/response/:id'), { }, {
                    retrieve: {
                        method: 'GET'
                    },
                    create: {
                        method: 'POST'
                    }
                })
            };
        });
    
});