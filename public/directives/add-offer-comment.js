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
                    active: false,
                    comment: {
                        content: ''
                    },
                    activate: function() {
                        scope.active = true;
                    },
                    deactivate: function() {
                        scope.active = false;
                    },
                    addComment: function(comment) {
                        if(scope.active) {
                            scope.commentHandler({
                                comment: comment
                            });
                        } else {
                            scope.activate();
                        }
                    },
                    addResponse: function() {
                        if(scope.active) {
                            scope.responseHandler({
                                comment: scope.comment
                            });
                        } else {
                            scope.activate();
                        }
                    }
                });
            }
        };
    });

});