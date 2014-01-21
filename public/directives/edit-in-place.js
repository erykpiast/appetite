define([ 'libs/angular', 'libs/jquery', './module' ],
function(angular, $, module) {
    'use strict';

    module.directive( 'appEditInPlace', function($compile) {
        return {
            restrict: 'E',
            scope: { model: '=appEditInPlace', inputAttributes: '@' },
            template: '<input ng-model="model" type="text" class="edit-in-place__input" />',
            link: function(scope, $element, attrs) {
                scope.editing = false;

                var $input = $element.children('.edit-in-place__input');
                $input
                    .hide()
                    .insertAfter($element)
                    .on('blur', function() {
                        $input.hide();

                        scope.editing = false;
                    });

                $element
                    .addClass('edit-in-place')
                    .attr('ng-bind', '')
                    .on('click', function(e) {
                        e.preventDefault();

                        $input.show();
                        $input.focus();

                        scope.editing = true;
                    });
                
                
                $compile($element)(scope);
            }
        };
    });
});
