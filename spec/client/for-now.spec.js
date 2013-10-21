define([ 'flrForNow' ], function() {

	describe('forNow filter - Module testing', function() {

		beforeEach(angular.mock.module('filters'));

		it('should have a "forNow" filter', inject(function($filter) {
			expect($filter('forNow')).not.toEqual(null);
		}));

	});

	Date.now = function() {
		return 1368817912431;
	};

	describe('forNow filter - Unit testing', function() {

		beforeEach(angular.mock.module('filters'));

		it('should convert timestamp to human-readable words', inject(function($filter) {
			var forNow = $filter('forNow');

			var now = Date.now();

			expect(forNow((now - 1000).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 22 * 1000).toString())).toEqual('22 sekundy');
			expect(forNow((now - 31.5 * 1000).toString())).toEqual('31 sekund');
			expect(forNow((now - 60 * 60 * 1000).toString())).toEqual('jedna godzina');
			expect(forNow((now - 24 * 60 * 60 * 1000).toString())).toEqual('jeden dzień');
			expect(forNow((now - 6 * 24 * 60 * 60 * 1000).toString())).toEqual('sześć dni');
			expect(forNow((now - 7 * 24 * 60 * 60 * 1000).toString())).toEqual('jeden tydzień');
			expect(forNow((now - 12 * 24 * 60 * 60 * 1000).toString())).toEqual('dwanaście dni');
			expect(forNow((now - 13 * 24 * 60 * 60 * 1000).toString())).toEqual('13 dni');
			expect(forNow((now - 14 * 24 * 60 * 60 * 1000).toString())).toEqual('dwa tygodnie');
			expect(forNow((now - 16 * 24 * 60 * 60 * 1000).toString())).toEqual('dwa tygodnie');
			expect(forNow((now - 18 * 24 * 60 * 60 * 1000).toString())).toEqual('dwa tygodnie');
			expect(forNow((now - 20 * 24 * 60 * 60 * 1000).toString())).toEqual('dwa tygodnie');
			expect(forNow((now - 21 * 24 * 60 * 60 * 1000).toString())).toEqual('trzy tygodnie');
			expect(forNow((now - 5 * 7 * 24 * 60 * 60 * 1000).toString())).toEqual('pięć tygodni');
			expect(forNow((now - 2628000000).toString())).toEqual('jeden miesiąc');
			expect(forNow((now - 1.5 * 2628000000).toString())).toEqual('jeden miesiąc');
			expect(forNow((now - 2 * 2628000000).toString())).toEqual('dwa miesiące');
			expect(forNow((now - 2.4 * 2628000000).toString())).toEqual('dwa miesiące');
			expect(forNow((now - 5 * 2628000000).toString())).toEqual('pięć miesięcy');
			expect(forNow((now - 365 * 24 * 60 * 60 * 1000).toString())).toEqual('jeden rok');
			expect(forNow((now - 1.6 * 365 * 24 * 60 * 60 * 1000).toString())).toEqual('półtora roku');
			expect(forNow((now - 4 * 365 * 24 * 60 * 60 * 1000).toString())).toEqual('cztery lata');
			expect(forNow((now - 4.1 * 365 * 24 * 60 * 60 * 1000).toString())).toEqual('cztery lata');
			expect(forNow((now - 4.6 * 365 * 24 * 60 * 60 * 1000).toString())).toEqual('cztery i pół roku');
			expect(forNow((now - 6.1 * 365 * 24 * 60 * 60 * 1000).toString())).toEqual('sześć lat');

		}));

	});


	describe('forNow filter - Format testing', function() {

		beforeEach(angular.mock.module('filters'));

		it('should convert timestamp to human-readable words', inject(function($filter) {
			var forNow = $filter('forNow');

			var now = Date.now();

			expect(forNow((now - 1001).toString(), 'v u')).toEqual('1 sekunda');
			expect(forNow((now - 1001).toString(), 'V U')).toEqual('jedną sekundę');
			expect(forNow((now - 1.6 * 365 * 24 * 60 * 60 * 1000).toString(), 'V U')).toEqual('jeden rok');
			expect(forNow((now - 1.6 * 365 * 24 * 60 * 60 * 1000).toString(), 'Vh U')).toEqual('jeden i pół roku');
			expect(forNow((now - 1.6 * 365 * 24 * 60 * 60 * 1000).toString(), 'VH U')).toEqual('półtora roku');
			expect(forNow((now - 2.6 * 365 * 24 * 60 * 60 * 1000).toString(), 'VH U')).toEqual('dwa i pół roku');
			expect(forNow((now - 91 * 1000).toString(), 'v u')).toEqual('1 minuta');
			expect(forNow((now - 91 * 1000).toString(), 'V U')).toEqual('jedną minutę');
			expect(forNow((now - 91 * 1000).toString(), 'v U')).toEqual('1 minutę');
			expect(forNow((now - 91 * 1000).toString(), 'vi U')).toEqual('minutę');
			expect(forNow((now - 91 * 1000).toString(), 'vHi U')).toEqual('minutę');
			expect(forNow((now - 121 * 1000).toString(), 'vi U')).toEqual('2 minuty');
			expect(forNow((now - 25 * 60 * 60 * 1000).toString(), 'vHi U')).toEqual('1 dzień');
			expect(forNow((now - 49 * 60 * 60 * 1000).toString(), 'vHi U')).toEqual('2 dni');
			
		}));	

	});


	describe('forNow filter - Range testing', function() {

		beforeEach(angular.mock.module('filters'));

		it('should convert timestamp to human-readable words', inject(function($filter) {
			var forNow = $filter('forNow');

			var now = Date.now();

			expect(forNow((now - 1).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 999).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 1000).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 1001).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 1999).toString())).toEqual('jedna sekunda');
			expect(forNow((now - 2000).toString())).toEqual('dwie sekundy');
			expect(forNow((now - 2999).toString())).toEqual('dwie sekundy');
			expect(forNow((now - 3000).toString())).toEqual('trzy sekundy');
		}));

	});

});