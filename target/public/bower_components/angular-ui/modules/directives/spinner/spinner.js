/*global angular */
/*
 jQuery UI Spinner plugin wrapper

 @param [ui-spinner] {object} Options to pass to $.fn.spinner() merged onto ui.config
 */
angular.module('ui.directives')

.directive('uiSpinner', ['ui.config',
    function(uiConfig) {
        'use strict';

        var options = {};

        if (angular.isObject(uiConfig.spinner)) {
            angular.extend(options, uiConfig.spinner);
        }

        return {
            require: '?ngModel',
            link: function(scope, $element, attrs, controller) {
                function updateModel() {
                    scope.$apply(function() {
                        var value = $element.spinner('value');

                        $element.spinner('value', $element.val());

                        controller.$setViewValue(value);

                        $element.blur();
                    });
                }

                function getOptions() {
                    return angular.extend({}, uiConfig.spinner, scope.$eval(attrs['uiSpinner']));
                }

                function initWidget(options) {
                    // if we have a controller (i.e. ngModelController) then wire it up
                    if (controller) {
                        if (options.change) {
                            // caller has specified change, so call this as well as updating the model
                            var userHandler = options.change;
                            options.change = function(value, spinner) {
                                updateModel();

                                scope.$apply(function() {
                                    userHandler(value, spinner);
                                });
                            };
                        } else {
                            // no change already specified so just update the model
                            options.change = updateModel;
                        }

                        // Update the spinner when the model changes
                        controller.$render = function() {
                            $element.spinner('value', controller.$viewValue);
                        };
                    }

                    // if we don't destroy the old one it doesn't update properly when the config changes
                    // $element.spinner('destroy');

                    // create the new spinner widget
                    $element.spinner(options);

                    if (controller) {
                        // force a render to override whatever is in the input text box
                        controller.$render();
                    }
                }

                if (($element.prop('tagName') === 'INPUT') && ($element.attr('type') === 'number')) {
                    $element.attr('type', 'text');
                }

                // Watch for changes to the directives options
                scope.$watch(getOptions, initWidget, true);
            }
        };
    }
]);