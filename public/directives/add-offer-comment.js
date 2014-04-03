define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {
    'use strict';

    module
    .directive('appAddOfferComment', function($rootScope) {
        return {
            template: templates.addOfferComment,
            replace: true,
            restrict: 'E',
            scope: {
                commentHandler: '&onComment',
                responseHandler: '&onResponse',
                commentParent: '=',
                showOwnerFeatures: '&',
                author: '=',
                className: '@class'
            },
            link: function(scope, $element, attrs) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;

                angular.extend(scope, {
                    activeMode: false,
                    inputPlaceholder: {
                        text: ''
                    },
                    comment: {
                        content: ''
                    },
                    activate: function(mode) {
                        scope.activeMode = mode;

                        if(mode === 'response') {
                            scope.inputPlaceholder.text = scope.i18n.offer.response.inputPlaceholder;
                        }
                    },
                    deactivate: function() {
                        scope.activeMode = null;

                        scope.inputPlaceholder.text = '';
                    },
                    addComment: function(comment) {
                        if(scope.activeMode) {
                            scope.commentHandler({
                                comment: comment
                            });
                        } else {
                            scope.activate('comment');
                        }
                    },
                    addResponse: function() {
                        if(scope.activeMode) {
                            scope.responseHandler({
                                comment: scope.comment
                            });
                        } else {
                            scope.activate('response');
                        }
                    },
                    cancel: function() {
                        scope.deactivate();
                    }
                });

                scope.$on('appAddOfferComment.activate', function(e, mode) {
                    scope.activate(mode);
                });
            },
            controller: function($scope) {
                $scope.handleScroll = function(direction) {
                    console.log(direction);
                };
            }
        };
    });

});