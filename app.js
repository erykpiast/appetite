
/**
 * Module dependencies.
 */

var express = require('express'),
// routes = require('./routes'),
// user = require('./routes/user'),
	http = require('http'),
	path = require('path');

var app = express();

app
.configure(function() {
	app
		.set('port', process.env.PORT || 3000)
        .set('db', require(__dirname + '/modules/db')) // make db connection once
		.use(express.bodyParser())
		.use(express.methodOverride())
		.use(app.router)
		.use(express.static(__dirname + '/public/app'));

    // add all routes definitions from dir
    require('fs').readdir(__dirname + '/routes', function(err, files) {
        files.filter(function(filename){
            return (/.js$/).test(filename);
        })
        .forEach(function(route) {
            require(__dirname + '/routes/' + route)(app);
        });
    });
})
.configure('development', function() {
	app
        .use(express.logger('dev'))
		.use(express.errorHandler());
});

// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
