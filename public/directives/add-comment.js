define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {
    'use strict';

    module
    .directive('appAddComment', function($rootScope) {
        return {
            template: templates.addComment,
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                comment: '=',
                commentParent: '=',
                addHandler: '&onSubmit',
                clearHandler: '&onCancel'
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
                        }
                    },
                    clearAnswer: function() {
                        scope.comment.content = '';
                        scope.commentParent.comment = undefined;
                    }
                });
            }
        };
    });

});