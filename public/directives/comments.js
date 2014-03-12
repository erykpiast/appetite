define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appComment', function($rootScope, $compile) {
        return {
            template: templates.comment,
            replace: true,
            restrict: 'E',
            scope: {
                comment: '=model',
                showOwnerFeatures: '&',
                showUserFeatures: '&',
                responseAcceptHandler: '&'
            },
            link: function(scope, $element) {
                angular.extend(scope, {
                    goTo: $rootScope.goTo,
                    i18n: $rootScope.i18n,
                    answerTo: function(comment) {
                        $rootScope.$broadcast('comment.answerTo', comment);
                    }
                });
            }
        };
    });


    module
    .directive('appComments', function($rootScope, $compile) {
        return {
            template: templates.comments,
            replace: true,
            restrict: 'E',
            scope: {
                comments: '=model',
                showOwnerFeatures: '&',
                showUserFeatures: '&',
                responseAcceptHandler: '&'
            },
            link: function(scope, $element) {
                scope.rootComment = {
                    children: scope.comments
                };
            }
        };
    });

});