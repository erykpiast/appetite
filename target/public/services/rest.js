define([ 'libs/angular', 'libs/angular-resource', './module', 'services/node-rest', 'services/fake-rest' ],
function(angular, undefined, module, undefined, undefined) {
    
    module
    .factory('rest', function(nodeRest, fakeRest) {
        return angular.extend({ }, fakeRest, {
            comment: {
                retrieve: fakeRest.comment.retrieve,
                create: nodeRest.comment.create
            },
            offer: angular.extend({ }, fakeRest.offer, {
                create: nodeRest.offer.create
            }),
            offerTemplate: {
                create: nodeRest.offerTemplate.create
            },
            response: nodeRest.response,
            user: angular.extend({ }, fakeRest.user, {
                retrieve: nodeRest.user.retrieve,
                create: nodeRest.user.create
            })
        });
    });
    
});