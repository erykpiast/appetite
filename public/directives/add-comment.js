define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {
    'use strict';

    module
    .directive('appAddComment', function($rootScope, $interval) {
        return {
            template: templates.addComment,
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                comment: '=',
                commentParent: '=',
                addHandler: '&onSubmit',
                clearHandler: '&onCancel',
                author: '='
            },
            link: function(scope, $element) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;

                angular.extend(scope, {
                    addComment: function() {
                        if(scope.comment.content.length) {
                            scope.addHandler({
                                comment: scope.comment.content
                            });

                            scope.clearAnswer();
                        }
                    },
                    clearAnswer: function() {
                        scope.comment.content = '';
                        scope.commentParent.comment = undefined;
                    }
                });

                $interval(function() {
                    scope.currentTime = Date.now();
                }, 1000);
            }
        };
    });

});