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
                onAnswer: '&',
                showOwnerFeatures: '&',
                showUserFeatures: '&'
            },
            link: function(scope, $element) {
                angular.extend(scope, {
                    goTo: $rootScope.goTo,
                    i18n: $rootScope.i18n,
                    answerTo: function(comment) {
                        scope.onAnswer({
                            comment: comment
                        });
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
                onAnswer: '&',
                listClassName: '@',
                listElementClassName: '@',
                showOwnerFeatures: '&',
                showUserFeatures: '&'
            },
            compile: function(tElement, tAttrs) {
                var contents = tElement.contents().remove(),
                    compiledContents;

                return function(scope, iElement, iAttrs) {
                    if(!compiledContents) {
                        compiledContents = $compile(contents);
                    }

                    compiledContents(scope, function(clone, scope) {
                        iElement.html(clone);
                    });

                    scope.answerTo = function(comment) {
                        scope.onAnswer({
                            comment: comment
                        });
                    };
                };
            }
        };
    });

});