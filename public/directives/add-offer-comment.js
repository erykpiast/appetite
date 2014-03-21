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
                showOwnerFeatures: '&'
            },
            link: function(scope, $element, attrs) {
                scope.goTo = $rootScope.goTo;
                scope.i18n = $rootScope.i18n;

                angular.extend(scope, {
                    comment: {
                        content: ''
                    },
                    addComment: function(comment) {
                        scope.commentHandler({
                            comment: comment
                        });
                    },
                    addResponse: function() {
                        scope.responseHandler({
                            comment: scope.comment
                        });
                    }
                });
            }
        };
    });

});