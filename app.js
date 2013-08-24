(function() {
// enchance standard require with function recognizing app.js dir as root path (started with '/')
	var _require = require;

	$require = (function(rootPath) {
		console.log('');

		var _r = function(resource) {
			if((resource !== null) && (resource !== undefined)) {
				resource = resource.toString();

				if(resource[0] === '/') {
					if(resource.indexOf(rootPath) !== 0) {
						resource = rootPath + resource;
					} else {
						console.log(resource);
						console.log(rootPath);
					}
				}
			}

			return _require(resource);
		};

		for (var prop in _require) {
			if(_require.hasOwnProperty(prop)) {
				_r[prop] = _require[prop];
			}
		}

		return _r;

	})(__dirname);
})();


var express = $require('express'),
	http = $require('http'),
	path = $require('path');

var app = express();

app
.configure(function() {
	app
		.set('port', process.env.PORT || 3000)
		.set('db', $require('/modules/db')) // make db connection once
		.use(express.bodyParser())
		.use(express.methodOverride())
		.use(app.router)
		.use(express.static(__dirname + '/public/app'))
	// configure route parameters
        .param(function(name, handler){
            if (handler instanceof RegExp) {
                return function(req, res, next, val) {
                    var captures = handler.exec(new String(val));

                    if (!!captures) {
                        req.params[name] = captures;

                        next();
                    } else {
                        next('route');
                    }
                };
            }
        })
        .param('id', /^\d+$/);

	// add all routes definitions from dir
	$require('fs').readdir(__dirname + '/routes', function(err, files) {
		files.filter(function(filename){
			return (/.js$/).test(filename);
		})
		.forEach(function(route) {
			$require('/routes/' + route)(app);
		});
	});
})
.configure('development', function() {
	app
		.use(express.logger('dev'))
		.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});