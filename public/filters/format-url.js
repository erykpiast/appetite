define([ 'libs/angular', 'libs/std', 'modules/filters' ], function(angular, undefined, filters) {

	angular.module('filters')
	.filter('formatUrl', function(){
		var formats = {
				domain: 'domain'
			};

		function URL(raw) {
			this._raw = raw || '';

			this._parsed = this._raw.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/i);
		}

		angular.extend(URL.prototype, {
			getValue: function() {
				return this._raw;
			},
			getDomain: function() {
				return this._parsed[4];
			}
		});

		return function(url, format) {
			var formated = new URL(url);

			switch(format) {
				case formats['domain']:
						formated = formated.getDomain();
					break;
				default:

			}

			return formated;
		};
	});
});