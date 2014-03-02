var request = $require('request'),
	fs = $require('fs'),
	q = $require('q');

function Resource(mimeTypes, savePath) {
	this.mimeTypes = Array.create(mimeTypes);
	this.savePath = savePath;

	this.data = null;

	this._fetching = null;
	this._fetchingFinished = false;
}


extend(Resource.prototype, {
	_getExtension: function(mimeType) {
		var ext;

		switch(mimeType) {
			case 'text/plain':
					ext = 'txt';
				break;
			case 'image/jpeg':
					ext = 'jpg';
				break;
			case 'image/png':
					ext = 'png';
				break;
			case 'image/gif':
					ext = 'gif';
				break;
			default:
				ext = '';
		}

		return ext;
	},
	_abortFetching: function() {
		if(this._fetching && !this._fetchingFinished) {
			this._fetching.reject(null);

			this._fetching = null;
			this._fetchingFinished = false;

			return true;
		} else {
			return false;
		}
	},
	fetch: function(url) {
		this.data = null;

		this._abortFetching();

		var deferred = this._fetching = new q.defer();
		deferred.promise.finally(function() { that._fetchingFinished = true; });

		url = url + '';

		if(url.length > 0) {
			var that = this;

			request({ method: 'GET', url: url, encoding: null }, function (error, response, body) {
	      		if (!error && response.statusCode === 200) {
			        var mimeType = response.headers["content-type"];

			        if(that.mimeTypes.contains(mimeType)) {
			        	that.data = body;
			        	that.data.mimeType = mimeType;

			        	deferred.resolve(that.data);
			      	} else {
			      		deferred.reject(that.data);
			      	}
			    } else {
					deferred.reject(that.data);
			    }
			});
		} else {
			deferred.reject(this.data);
		}

		return deferred.promise;
	},
	save: function(name) {
		var deferred = new q.defer();

		var data = this.data;

		if(data) {
			var filename = name + '.' + this._getExtension(this.data.mimeType),
			    fullPath = this.savePath + '/' + filename;

            fs.unlink(fullPath, function(error) {
    			fs.writeFile(fullPath, data, function(err) {
    				if(err) {
    					deferred.reject(null);
    				} else {
    					deferred.resolve(filename);
    				}
    			});
            });
		}

		return deferred.promise;
	}
});


module.exports = Resource;