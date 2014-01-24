define([ 'libs/angular', 'libs/jquery', './module' ],
function(angular, $, module) {
    'use strict';

    module.directive( 'appEditInPlace', function($compile, $parse) {
        var cssClass = 'edit-in-place';

        function activate($element, $input) {
            $element
                .removeClass(cssClass)
                .addClass(cssClass + '--active');

            $input.focus();
        }


        function deactivate($element) {
            $element
                .removeClass(cssClass + '--active')
                .addClass(cssClass);
        }

        return {
            restrict: 'A',
            scope: { model: '=appEditInPlace' },
            template: function($tElement, tAttrs) {
                var template,
                    common = 'class="' + (cssClass + '__input" ng-bind="model"';
                
                if(tAttrs.inputType === 'textarea') {
                    template = '<textarea ' + common + '></textarea>';
                } else {
                    template = '<input type="' + (tAttrs.inputType || 'text') + '" ' + common + '/>';
                }
                
                if(tAttrs.label) {
                    template += '<label class="' + cssClass + '__label"></label>';
                }
                
                return template + '<span class="' + cssClass + '__value" ng-bind="model"></span>';
            },
            compile: function($tElement, tAttrs) {
                $tElement.addClass(cssClass);

                var inputId = cssClass + '--' + Math.round(Math.random() * Date.now());

                $tElement.children('.' + cssClass + '__input').attr('id', inputId);
                $tElement.children('.' + cssClass + '__label').attr('for', inputId);

                return function(scope, $element, attrs) {
                    scope.editing = false;
    
                    var $input = $element.children('.' + cssClass + '__input');
                    $input
                        .on('blur', function() {
                            deactivate($element);

                            scope.editing = false;
                        });

                    if(!attrs.defaultActive) {
                        deactivate($element);
                    } else {
                        activate($element, $input);
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
                    }
    
                    $element
                        .addClass('' + cssClass + '')
                        .on('click', function(e) {
                            if(!scope.editing) {
                                e.preventDefault();
                                
                                activate($element, $input);
    
                                scope.editing = true;
                            }
                        });
                };
            }
        };
    });
});
