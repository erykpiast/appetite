define([ 'libs/angular', 'libs/jquery', './module' ],
function(angular, $, module) {
    'use strict';

    module.directive( 'appEditInPlace', function($compile, $parse) {
        return {
            restrict: 'A',
            scope: { model: '=appEditInPlace' },
            template: '<span ng-bind="model"></span><input ng-model="model" type="text" class="edit-in-place__input" />',
            compile: function(tElement, tAttrs) {
                var $input = tElement.children('.edit-in-place__input'),
                    inputId = 'edit-in-place-' + ~~(Math.random() * Date.now());
                tAttrs
                $input.attr('id', inputId);
                
                if(tAttrs.label) {
                    var $label = angular.element('<label for="' + inputId + '" class="edit-in-place__label"></label>');
                    
                    $label.insertBefore($input);
                }
                
                return function(scope, $element, attrs) {
                    scope.editing = false;
    
                    var $input = $element.children('.edit-in-place__input');
                    $input
                        .hide()
                        .on('blur', function() {
                            $input.hide();
    
                            scope.editing = false;
                        });
                        
                    if(attrs.inputAttrs) {
                        angular.forEach($parse(attrs.inputAttrs)(scope.$parent), function(attrValue, attrName) {
                            $input.attr(attrName, attrValue);
                        });
                        
                        $compile($input[0])(scope, function(scope, cloned) {
                           // $element.append(cloned);
                        });
                        
                    }
    
                    $element
                        .addClass('edit-in-place')
                        .on('click', function(e) {
                            e.preventDefault();
    
                            $input.show();
                            $input.focus();
    
                            scope.editing = true;
                        });
                };
            }
        };
    });
});
