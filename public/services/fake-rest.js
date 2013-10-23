define([ 'libs/angular', 'libs/angular-resource', 'modules/appetite' ], function(angular, undefined, appetite) {
    
    angular.module('appetite')
        .factory('fakeRest', function($resource) {
            function _rest(path) {
                return '/static/fake-rest/' + path.replace(/^\//, '');
            }
            
            return {
                user: $resource(_rest('/user/:id.json'), { }, {
                    retrieve: {
                        method: 'GET'
                    }
                }),
                offer: angular.extend($resource(_rest('/offer/:id.json'), { id: 'all' }, {
                    retrieve: {
                        method: 'GET'
                    },
                    retrieveAll: {
                        method: 'GET',
                        isArray: true
                    }
                }), { comments: $resource(_rest('/offer/:offerId/comments.json'), { }, {
                    retrieveAll: {
                        method: 'GET',
                        isArray: true
                    }
                }) }),
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
                }),
                comment: $resource(_rest('/comment/:id.json'), { }, {
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