define([ 'libs/angular', 'libs/std', 'modules/filters' ], function(angular, undefined, filters) {

	angular.module('filters')
	.filter('formatUrl', function(){
		var formats = {
				domain: 'domain'
			};

		function URL(raw) {
			this._raw = raw || '';

			this._current = this._raw;
		}

		angular.extend(URL.prototype, {
			_regExs: {
				protocol: /https?:\/\//i,
				www: /w{3}/i,
				slash: /(?:(\/\/)?[^\/]+)(\/.*)/i
			},
			getOriginalValue: function() {
				return this._raw;
			},
			getValue: function() {
				return this._current;
			},
			stripWww: function() {
				this._current = this._current.replace(this._regExs.www, '');

				return this;
			},
			stripProtocol: function() {
				this._current = this._current.replace(this._regExs.protocol, '');

				return this;
			},
			stripSlash: function() {
				this._current = this._current.replace(this._regExs.slash, '');

				return this;
			}
		});

		return function(url, format) {
			var formated = new URL(url);

			switch(format) {
				case formats['domain']:
						formated.stripWww().stripProtocol().stripSlash();
					break;
				default:

			}

			return formated.getValue();
		};
	});
});