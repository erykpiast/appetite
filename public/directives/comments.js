define([ 'libs/angular', './module', 'templates' ],
function(angular, module, templates) {

    module
    .directive('appComments', function($rootScope, $compile) {
        return {
            template: templates.comment,
            replace: true,
            restrict: 'E',
            scope: { comment: '=model', showOwnerFeatures: '&', showUserFeatures: '&', responseAcceptHandler: '&' },
            link: function(scope, $element, attrs) {
                angular.extend(scope, {
                    goTo: $rootScope.goTo,
                    i18n: $rootScope.i18n,
                    answerTo: function(comment) {
                        $rootScope.$broadcast('comment.answerTo', comment);
                    }
                });
            
                var $answers;
                scope.$watch('comment.children', function(answers) {
                    if (!$answers && angular.isArray(answers)) {
                        var $answers = angular.element('<ul class="comment__answers no-bullets">');
                        $element.append($answers);

                        $compile('<li ng-repeat="comment in comment.children"><app-comments model="comment" show-owner-features="showOwnerFeatures()" response-accept-handler="responseAcceptHandler(response)"></app-comments></li>')(scope, function(cloned, scope) {
                            $answers.append(cloned);
                        });
                    }

                    // !!! no support for removing comments !!!
                });
            }
        };
    });

});