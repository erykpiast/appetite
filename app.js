// defining global modules >>
global.$require = require(__dirname + '/libs/$require')(__dirname); // first and last call of 'normal' require
global.extend = $require('extend');
global.Q = $require('q');
global.MathJs = $require('mathjs');
global._ = $require('/libs/underscore');

$require('/libs/std');
// << defining global modules


var express = $require('express'),
    http = $require('http'),
    path = $require('path');

var appDir = (__dirname + '/public');

var app = express();

app
.configure(function() {
    app
        .use(express.bodyParser())
        .use(express.cookieParser())
        .use('/static', express.static(appDir))
        .get('/', function(req, res) {
            res.sendfile('index.html', { root: appDir });
        })
        .set('root', __dirname)
        .set('port', process.env.PORT || 3000)
        .set('db', $require('/modules/db')) // make db connection once
        .set('auth', $require('/modules/auth')(app))
        .set('rest', $require('/modules/rest')(app))
        .set('routes', $require('/routes')(app)); // use auth and router
})
.configure('devel', function() {
    app
        .use(express.logger('dev'))
        .use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});