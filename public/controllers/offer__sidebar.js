define([ 'libs/angular' ],
function(angular) {

    var relatedEntities = { },
        users = [ ];


    function retrieveAuthorInfo(rest, entity) {
        if(!entity.author) {
            return false;
        } else {
            if(!relatedEntities[entity.author]) {
                relatedEntities[entity.author] = [ ];

                rest.user.retrieve({ id: entity.author }).
                    $promise.then(function(res) {
                        var user = res;

                        relatedEntities[user.id].forEach(function(entity) {
                            entity.author = user;
                        });
                        
                        users[user.id] = user;

                        relatedEntities[user.id].fetched = true;
                    });
            }

            if(!relatedEntities[entity.author].fetched) {
                relatedEntities[entity.author].push(entity);

                entity.author = { };
            } else {
                entity.author = users[entity.author];
            }

            return true;
        }
    }


    return function($rootScope, $scope, $stateParams, $timeout, rest, authData) {
        $scope.offer = { };

        var _expandAuthor = retrieveAuthorInfo.bind(null, rest);

        rest.offer.retrieve({ id: $stateParams.id })
            .$promise.then(function(res) {
                angular.extend($scope.offer, res);

                _expandAuthor($scope.offer);
            });
    };

});