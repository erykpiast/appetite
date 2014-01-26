define([ 'libs/angular', 'libs/jquery', './module' ],
function(angular, $, module) {
    'use strict';

    module.directive('appEditInPlace', function($compile, $parse) {
        var cssClass = 'edit-in-place';

        return {
            restrict: 'A',
            scope: { model: '=appEditInPlace' },
            template: function($tElement, tAttrs) {
                var template,
                    common = 'class="' + cssClass + '__input"';
                
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

                    function _activate() {
                        $element
                            .removeClass(cssClass)
                            .addClass(cssClass + '--active');

                        $input.focus();

                        scope.editing = true;
                    }


                    function _deactivate() {
                        $element
                            .removeClass(cssClass + '--active')
                            .addClass(cssClass);

                        scope.editing = false;
                    }

                // prepare input >>
                    var $input = $element.children('.' + cssClass + '__input');

                    // all or no directives for input element must be defined in linking function
                    /* if you, ex. define ng-model directive in template and then recompile element
                       in linking function, model will be bound twice and you can see some glitches,
                       like cursor fleeing to end of input after typing character
                    */
                    $input.attr('ng-model', 'model');
                    if(attrs.inputAttrs) {
                        angular.forEach($parse(attrs.inputAttrs)(scope.$parent), function(attrValue, attrName) {
                            $input.attr(attrName, attrValue);
                        });
                    }

                    $compile($input)(scope);

                    $input
                        .on('blur', function() {
                            _deactivate();
                        });
                // << prepare input


                    if(!attrs.defaultActive) {
                        _deactivate();
                    } else {
                        _activate();
                    }


                    var $label = $element.children('.' + cssClass + '__label');
                    if($label.length) {
                        $label.text(attrs.label);
                    }

    
                    $element
                        .addClass('' + cssClass + '')
                        .on('click', function(e) {
                            if(!scope.editing) { // prevents calls in edit mode
                                e.preventDefault();
                                
                                _activate();
    
                                scope.editing = true;
                            }
                        });
                };
            }
        };
    });
});
