define([ 'libs/angular', 'libs/angular-resource', './module' ],
function(angular, undefined, module) {
    
    module
    .factory('nodeRest', function($resource) {
        function _rest(path) {
            return 'http://localhost:3000/rest/' + path.replace(/^\//, '');
        }
        
        return {
            user: $resource(_rest('/user/:id'), { }, {
                create: {
                    method: 'POST'
                },
                retrieve: {
                    method: 'GET'
                }
            }),
            offer: angular.extend($resource(_rest('/offer/:id'), { }, {
                create: {
                    method: 'POST'
                },
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
                },
                update: {
                    method: 'PUT'
                }
            })
        };
    });
    
});