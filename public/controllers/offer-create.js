define(['libs/angular'], function(angular) {
    'use strict';

    return function($rootScope, $scope, $q, $state, rest, i18n) {

        function _submitTemplate() {
            var deferred = $q.defer(),
                t = $scope.offer.template;

            rest.offerTemplate.create(angular.extend({}, t, {
                tags: t.tags,
                pictures: t.pictures.length ? t.pictures : null
            })).$promise.then(function(res) {
                console.log('template', res.data);

                deferred.resolve(res.data);
            });

            return deferred.promise;
        }

        angular.extend($scope, {
            amountUnits: ['piece', 'gram', 'kilogram', 'liter', 'centimeter'].map(function(key) {
                return {
                    value: key,
                    label: i18n.offer.amountUnits[key]
                };
            }),
            submitTemplate: function() {
                _submitTemplate().then(function(res) {
                    $state.go('template.details', { id: res.id });
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
                        $state.go('offer.details', { id: res.id });
                    });
                });
            },
            getMaxEndDate: function() {
                return new Date($scope.offer.details.startAt.getTime() + (14 * 24 * 60 * 60 * 1000));
            }
        });

        $scope.offer = {
            details: {
                endAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
                place: '',
                startAt: new Date(Date.now()),
                amount: {
                    value: 1,
                    unit: $scope.amountUnits[0].value
                },
                price: {
                    value: 1,
                    currency: 'PLN'
                }
            },
            template: {
                description: '',
                recipe: '',
                tags: [ ],
                title: '',
                pictures: [/*
                    'http://www.mojewypieki.com/img/images/najlepsze_ciasto_marchewkowe_1_80_small.jpg',
                    'http://www.mojewypieki.com/img/images/walewska_2_467_small.jpg'
                */]
            }
        };

    };

});