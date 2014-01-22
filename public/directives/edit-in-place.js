define([ 'libs/angular', 'libs/jquery', './module' ],
function(angular, $, module) {
    'use strict';

    module.directive( 'appEditInPlace', function($compile, $parse) {
        var cssClass = 'edit-in-place';

        return {
            restrict: 'A',
            scope: { model: '=appEditInPlace' },
            template: '<span class="' + cssClass + '__value" ng-bind="model"></span>',
            compile: function($tElement, tAttrs) {
                $tElement.addClass(cssClass);

                var inputId = cssClass + '--' + Math.round(Math.random() * Date.now()),
                    $input = angular.element(tAttrs.inputType !== 'textarea' ? '<input>' : '<textarea>');

                $input
                    .addClass(cssClass + '__input')
                    .attr({
                        'id': inputId,
                        'ng-model': 'model'
                    })
                    .appendTo($tElement);
                
                if(tAttrs.inputType !== 'textarea') {
                    $input.attr('type', tAttrs.inputType || 'text');
                }
                

                if(tAttrs.label) {
                    var $label = angular.element('<label for="' + inputId + '" class="' + cssClass + '__label"></label>');
                    
                    $label.insertAfter($input);
                }
                

                return function(scope, $element, attrs) {
                    scope.editing = false;
    
                    var $input = $element.children('.' + cssClass + '__input');
                    $input
                        .on('blur', function() {
                            $input.hide();

                            scope.editing = false;
                        });

                    if(!attrs.defaultActive) {
                        $input.hide();
                    } else {
                        $input.focus();
                    }
                        
                    if(attrs.inputAttrs) {
                        angular.forEach($parse(attrs.inputAttrs)(scope.$parent), function(attrValue, attrName) {
                            $input.attr(attrName, attrValue);
                        });
                        
                        $compile($input[0])(scope);
                        
                    }

                    var $label = $element.children('.' + cssClass + '__label');
                    if($label.length) {
                        $label.text(attrs.label);

                        $compile($label[0])(scope);
                    }
    
                    $element
                        .addClass('' + cssClass + '')
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
