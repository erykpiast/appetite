// defining global modules >>
global.$require = require(__dirname + '/modules/$require')(__dirname); // first and last call of 'normal' require
global.extend = $require('extend');
global.Q = $require('q');
global.MathJs = $require('mathjs');
global._ = $require('/libs/underscore');

$require('/libs/std');
// << defining global modules


var express = $require('express'),
	http = $require('http'),
	path = $require('path');

var app = express();

app
.configure(function() {
	app
		.set('port', process.env.PORT || 3000)
		.set('db', $require('/modules/db')) // make db connection once
		.set('rest', $require('/modules/rest')(app))
		.set('routes', $require('/routes')(app))
		.use(express.bodyParser())
		.use(express.methodOverride())
		.use(app.router)
		.use(express.static(__dirname + '/public/app'))
		.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
        
            next();
        })
	// configure route parameters
        .param(function(name, handler){
            if (handler instanceof RegExp) {
                return function(req, res, next, val) {
                    var captures = handler.exec(new String(val));

                    if (!!captures) {
                        req.params[name] = captures[0];

                        next();
                    } else {
                        next('route');
                    }
                };
            }
        })
        .param('id', /^\d+$/);
})
.configure('development', function() {
	app
		.use(express.logger('dev'))
		.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});