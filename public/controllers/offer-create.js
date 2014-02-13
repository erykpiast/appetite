define(['libs/angular'], function(angular) {
    'use strict';

    function _getTags(str) {
        return str.split(',').map(function(tag) {
            return tag.trim();
        }).filter(function(tag) {
            return tag.length > 0;
        });
    }

    return function($rootScope, $scope, $q, rest) {

        function _submitTemplate() {
            var deferred = $q.defer(),
                t = $scope.offer.template;

            rest.offerTemplate.create(angular.extend({}, t, {
                tags: _getTags(t.tags),
                pictures: t.pictures.length ? t.pictures : null
            })).$promise.then(function(res) {
                console.log('template', res.data);

                deferred.resolve(res.data);
            });

            return deferred.promise;
        }

        angular.extend($scope, {
            offer: {
                details: {
                    endAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
                    place: '',
                    startAt: new Date(Date.now())
                },
                template: {
                    description: '',
                    recipe: '',
                    tags: [],
                    title: '',
                    pictures: []
                }
            },
            submitTemplate: function() {
                _submitTemplate().then(function() {
                    $rootScope.goTo('index');
                });
            },
            startOffer: function() {
                _submitTemplate().then(function(template) {
                    var d = $scope.offer.details;

                    rest.offer.create({
                        type: 'offer',
                        template: template.id,
                        place: d.place,
                        startAt: d.startAt,
                        endAt: d.endAt
                    }).$promise.then(function(res) {
                        console.log('offer', res.data);

                        $rootScope.goTo('index');
                    });
                });
            },
            getMaxEndDate: function() {
                return new Date($scope.offer.details.startAt.getTime() + (14 * 24 * 60 * 60 * 1000));
            }
        });
    };

});