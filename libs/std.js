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


Array.prototype.removeDuplicates = function() {
	var duplicates = [];

	for(var i = 0; i < this.length; i++)
	{
		var index = this[i] instanceof Object ? this.indexOfObjectWith(this[i]) : this.indexOf(this[i]);

		if(index != i)
		{
			duplicates.push(this.splice(index, 1));
			i--;
		}
	}

	return duplicates;
};


Object.isString = function(o) {
	return ((typeof(o) === 'string') || (o instanceof String));
};