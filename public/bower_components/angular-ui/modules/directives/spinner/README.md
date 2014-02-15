# ui-spinner directive

This directive allows you to add a spinner-picker to your form elements.

# Requirements

- jQuery
- jQueryUI

# Usage

Load the script file in your application:

    <script type="text/javascript" src="angular-ui.js"></script>

Add the date module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['ui.directives'])

Apply the directive to your form elements:

    <input ui-spinner name="Price"></input>

## Options

All the jQueryUI Spinner options can be passed through the directive.

	myAppModule.controller('MyController', function($scope) {
		$scope.spinnerOptions = {
			changeYear: true,
			changeMonth: true,
			yearRange: '1900:-0'
		};
	});

    <input ui-spinner="spinnerOptions" name="Price"></input>

## Static Inline Picker

If you want a static picker then simply apply the directive to a div rather than an input element.

    <div ui-spinner="spinnerOptions" name="Price"></div>

# Working with ng-model

The ui-spinner directive plays nicely with ng-model and validation directives such as ng-required.

If you add the ng-model directive to same the element as ui-spinner then the typed number is automatically synchronized with the model value.

_The ui-spinner directive stores and expects the model value to be a standard JavaScript Number object._
