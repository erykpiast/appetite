define(['libs/angular', 'libs/jquery', './module'],
function(angular, $, module) {
    'use strict';

    module.directive('appTree', function($compile) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: { model: '='},
            template: '<ul>' + 
                '<li ng-transclude></li>' +
                '<li ng-repeat="child in model.children">' +
                    '<app-tree model="child">' +
                        '<div ng-transclude></div>' +
                    '</app-tree>' +
                '</li>' +
            '</ul>',
            compile: function(tElement, tAttrs) {
                var contents = tElement.contents().remove(),
                    compiledContents;

                return function(scope, iElement, iAttrs, ctrl, transclude) {
                    var trans;

                    if(!compiledContents) {
                        // compiledContents = $compile(contents, function(scope, cloneAttachFn) {
                        //     return transclude(scope, function(clone) {
                        //         cloneAttachFn(clone, scope);
                        //     });
                        // });
                        compiledContents = $compile(contents, transclude);
                    }

                    compiledContents(scope, function(clone, scope) {
                        iElement.html(clone);
                    });
                };
            }
        };
    });
});