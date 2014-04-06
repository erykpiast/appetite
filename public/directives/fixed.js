define([ 'libs/angular', './module' ],
function(angular, module) {
    'use strict';

    module
    .directive('appFixed', function($timeout) {
        return {
            template: '',
            restrict: 'A',
            controller: function($scope, $element, $attrs, $document, $window) {
                $scope.calculateDiff = function() {
                    var containerTop = $scope.$container.offset().top,
                        windowScrollTop = $scope.$window.scrollTop(),
                        elementHeight = $element.outerHeight(),
                        elementPositionTop = $scope.elementPositionTop,
                        windowHeight = $scope.$window.height();

                    $scope.lastDiff = (containerTop - windowScrollTop + elementPositionTop) - (windowHeight - elementHeight);
                    $scope.lastWindowScrollTop = windowScrollTop;
                };

                $scope.recalculate = function() {
                    $scope.calculateDiff();

                    if($scope.lastDiff <= 0) {
                        $element
                        .removeClass('fixed')
                        .css({
                            position: '',
                            bottom: '',
                            zIndex: '',
                            width: ''
                        });

                        $scope.fixed = false;
                    } else {
                        var elementWidth = $element.width();

                        $element
                        .addClass('fixed')
                        .css({
                            position: 'fixed',
                            bottom: 0,
                            zIndex: 100,
                            width: elementWidth + 'px'
                        });

                        $scope.fixed = true;
                    }
                };

                $scope.$window = angular.element($window);
                $scope.$body = angular.element($document.body);
                $scope.$container = $element.parent();

                $scope.$on('appFixed.recalculate', $scope.recalculate);
            },
            link: function($scope, $element, attrs) {
                $scope.elementPositionTop = $element.position().top;

                $scope.$window.on('scroll', function() {
                    var currentWindowScrollTop = $scope.$window.scrollTop();

                    if(($scope.fixed && ($scope.lastDiff <= (currentWindowScrollTop - $scope.lastWindowScrollTop)))
                    || (!$scope.fixed && ($scope.lastDiff >= (currentWindowScrollTop - $scope.lastWindowScrollTop)))) {
                        $scope.recalculate();
                    }
                });

                // wait for rendering full screen etc.
                // naive, but how can I handle that?
                $timeout(function() {
                    $scope.recalculate();
                }, 500);
                

                // var lastContainerTop = $scope.$container.offset().top;
                // $interval(function() {
                //     var currentContainerTop = $scope.$container.offset().top;

                //     if(lastContainerTop !== currentContainerTop) {
                //         lastContainerTop = currentContainerTop;

                //         $scope.recalculate();
                //     }
                // }, 500);
            }
        };
    });

});