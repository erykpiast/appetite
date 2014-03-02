define([ 'libs/angular', 'libs/std', './module' ],
function(angular, undefined, module) {

	module
	.filter('forNow', function(){
		var dict = {
				digits: (function() {
						var digits = [
							'',
							{ theme: 'jed', ends: [ 'en', 'na', 'ną' ] },
							{ theme: 'dw', ends: [ 'a', 'ie' ] },
							'trzy',
							'cztery',
							'pięć',
							'sześć',
							'siedem',
							'osiem',
							'dziewięć',
							'dziesięć',
							'jedenaście',
							'dwanaście'
						];

						digits.half = 'pół';
						digits.oneAndHalf = {
							theme: 'półtor',
							ends: [ 'a', 'ej' ]
						};
						digits.conjunction = 'i';

						return digits;
					})(),
				second: {
					name: 'second',
					milliseconds: 1000,
					half: false,
					maxValue: 59,
					accusativ: true,
					feminine: true,
					ignoreOne: true,
					theme: 'sekund',
					ends: [
						'a',
						'ę',
						'y',
						'' // np. 5 sekund temu
					]
				},
				minute: {
					name: 'minute',
					milliseconds: 60000,
					half: false,
					maxValue: 59,
					accusativ: true,
					feminine: true,
					ignoreOne: true,
					theme: 'minut',
					ends: [
						'a',
						'ę',
						'y',
						'' // np. 5 minut temu
					]
				},
				hour: {
					name: 'hour',
					milliseconds: 3600000,
					half: true,
					maxValue: 23,
					accusativ: true,
					feminine: true,
					ignoreOne: true,
					theme: 'godzin',
					ends: [
						'a',
						'ę',
						'y',
						'' // np. 5 godzin temu
					]
				},
				day: {
					name: 'day',
					milliseconds: 86400000,
					half: false,
					maxValue: 13,
					theme: 'd',
					ends: [
						'zień',
						'ni'
					]
				},
				week: {
					name: 'week',
					milliseconds: 604800000,
					half: false,
					maxValue: 5,
					ignoreOne: true,
					singular: 'tydzień',
					plural: {
						theme: 'tygodni',
						ends: [
							'e',
							''
						]
					}
				},
				month: {
					name: 'month',
					milliseconds: 2628000000, // 1/12 roku
					half: false,
					maxValue: 15,
					ignoreOne: true,
					theme: 'miesi',
					ends: [
						'ąc',
						'ące',
						'ęcy'
					]
				},
				year: {
					name: 'year',
					milliseconds: 31536000000,
					half: true,
					ignoreOne: true,
					singular: {
						theme: 'rok',
						ends: [
							'u', // np. pół roku temu
							''
						]
					},
					plural: {
						theme: 'lat',
						ends: [
							'a',
							'' // np. 10 lat temu
						]
					}
				}
			},
			periods = [
				dict.year,
				dict.month,
				dict.week,
				dict.day,
				dict.hour,
				dict.minute,
				dict.second
			];


		// returns full label
		var _getNumber = function(value, word, feminine, accusativ, half, oneAndHalf, ignoreOne) {
			var integer = Math.floor(value),
				rest = value - integer;

			if(integer === 1) {
				if(rest >= 0.5 && oneAndHalf) {
					return dict.digits.oneAndHalf.theme + dict.digits.oneAndHalf.ends[!!feminine ? 1 : 0];
				} else if(ignoreOne) {
					return '';
				}
			}

			var digit = dict.digits[integer],
				number;

			if(word && !!digit) {
				if(!angular.isString(digit)) {
					number = digit.theme + digit.ends[(!!accusativ ? digit.ends.length -1 : (!!feminine ? 1 : 0))];
				} else {
					number = digit;
				}
			} else {
				number = integer + '';
			}

			if(half && rest >= 0.5) {
				number += ' ' + dict.digits.conjunction + ' ' + dict.digits.half;
			}

			return number;
		};


		var _getLabel = function(value, unit, accusativ, half) {
			var	pDict = dict[unit], // period dictionary
				integer = Math.floor(value),
				lastDigit = integer - Math.floor(value, -1),
				secondForm = ((integer < 10 || integer > 20) && (lastDigit > 1 && lastDigit < 5)),
				label = '';

			if(!!pDict) {
				value = Math.floor(value, 1);

				if(integer > 1) {
					label = (!!pDict.plural ? pDict.plural.theme + pDict.plural.ends[(secondForm ? 0 : 1)] : pDict.theme + pDict.ends[(secondForm && pDict.ends.length > 2 ? pDict.ends.length - 2 : pDict.ends.length - 1)]);
				} else {
					label = (!!pDict.singular ? (angular.isString(pDict.singular) ? pDict.singular : pDict.singular.theme + pDict.singular.ends[1]) : pDict.theme + pDict.ends[(!!accusativ ? 1 : 0)]);
				}

				if(half && (value - integer >= 0.5)) {
					label = (!!pDict.singular ? (angular.isString(pDict.singular) ? pDict.singular : pDict.singular.theme + pDict.singular.ends[0]) : pDict.theme + pDict.ends[0]);
				}
			}

			return label;
		};


		// returns timestamp converted to pair of number and unit
		var _getValue = function(timestamp, half) {
			var value = {
					number: 1,
					unit: 'second'
				};

			for(var i = 0, maxi = periods.length; i < maxi; i++) {
				var period = periods[i],
					pM = period.milliseconds;

				if(timestamp >= pM) {
					var val = timestamp/pM,
						rest = val - Math.floor(val);

					value.unit = period.name;

					if (!!rest
					&& (rest != 0.5 || !period.half)) {
						var nextPeriod = periods[i+1];

						if(nextPeriod) {
							var nPM = nextPeriod.milliseconds,
								tVal = timestamp / nPM;

							if(tVal <= nextPeriod.maxValue) {
								val = tVal;
								value.unit = nextPeriod.name;
							}
						}
					}

					value.number = Math.floor(val, 1);

					break;
				}
			}

			return value;
		};

		return function(timestamp, format) {
			if(!!timestamp && (timestamp = (new Date(timestamp)).getTime() || parseInt0(timestamp))) {
				if(!!format) {
					var tokens = /([Vv]?)([Hh]*)([Ii]*)([^Uu]+)([Uu]?)/.exec(format);

					format = {
						word: (tokens[1] == 'V'),
						half: (tokens[2].toLowerCase() == 'h'),
						oneAndHalf: (tokens[2] == 'H'),
						ignoreOne: (tokens[3].toLowerCase() == 'i'),
						separator: tokens[4],
						accusativ: (tokens[5] == 'U')
					};
				} else {
					format = {
						word: true,
						half: true,
						oneAndHalf: true,
						separator: ' ',
						accusativ: false
					};
				}

				var newValue = _getValue(Math.abs(Date.now() - timestamp), format.half),
					period = dict[newValue.unit];

				return (_getNumber(newValue.number, format.word, period.feminine, (period.accusativ && format.accusativ), (period.half && format.half), (period.half && format.oneAndHalf), (period.ignoreOne && format.ignoreOne))
						+ format.separator +
					_getLabel(newValue.number, newValue.unit, (period.accusativ && format.accusativ), (period.half && (format.half || format.oneAndHalf)))).trim();
			} else {
				return 0;
			}
		};
	});
});