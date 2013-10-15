define([ ], function() {
	
	Array.create = function(pseudo) {
		if((pseudo === null) || pseudo === undefined) {
			return [ ];
		} else if(Object.isString(pseudo)) {
			return [ pseudo ];
		} else {
			var a = Array.prototype.slice.call(pseudo);
			
			if(a.length !== pseudo.length) {
				return [ pseudo ];
			} else {
				return a;
			}
		}
	};


	// filters array and leave only unique values
	Array.prototype.unique = function(similarityIsEnough) {
		var arr = this.slice(0);

		var i = 0;
		while(i < arr.length) {
			var index = arr.indexOf(arr[i]);

			if(!!similarityIsEnough && (index === i)) {
				index = arr.indexOfObjectWith(arr[i]);

				if(!Object.keys(arr[i]).isEqual(Object.keys(arr[index]))) {
					index = i;
				}
			}

			if(index !== i) {
				arr.splice(index, 1);
			} else {
				i++;
			}
		}

		return arr;
	};


	Array.prototype.isEqual = function(arr, similarityIsEnough) {
		return (this.length === arr.length) && this.every(function(el) {
			return (arr.indexOf(el) !== -1) || (!similarityIsEnough && (arr.indexOfObjectWith(el) !== -1));
		}, this);
	}


	Array.prototype.indexOfObjectWith = function(searchElement /*, [fromIndex] */) {
		if(this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;

		if(len === 0) {
			return -1;
		}

		var n = 0;

		if(arguments.length > 0) {
			n = Number(arguments[1]);

			if (n !== n) {
				n = 0;
			} else if(n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}

		if (n >= len) {
			return -1;
		}

		var k = (n >= 0) ? n : Math.max(len - Math.abs(n), 0);

		for(;k < len; k++) {
			if (k in t) {
				var res = true;

				for(var prop in searchElement) {
					if(!searchElement.hasOwnProperty(prop)) {
					} else if(t[k].hasOwnProperty(prop)) {
						if(t[k][prop] !== searchElement[prop]) {
							res = false;
							break;
						}
					} else {
						res = false;
						break;
					}
				}

				if(!!res) {
					return k;
				} else {
					continue;
				}
			}
		}

		return -1;
	};


	Object.isString = function(o) {
		return ((typeof(o) === 'string') || (o instanceof String));
	};


	window.parseInt0 = function(o) {
		var parsed = parseInt(o);

		return (isNaN(parsed) ? 0 : parsed);
	}


	window.parseFloat0 = function(o) {
		var parsed = parseFloat(o);

		return (isNaN(parsed) ? 0.00 : parsed);
	}

})