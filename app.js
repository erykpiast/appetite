// defining global modules >>
global.$require = require(__dirname + '/libs/$require')(__dirname); // first and last call of 'normal' require
global.extend = $require('extend');
global.Q = $require('q');
global.MathJs = $require('mathjs');
global._ = $require('/libs/underscore');

$require('/libs/std');
// << defining global modules

var path = $require('path');
var express = $require('express');
var expressParams = require('express-params');

var app = express();
expressParams.extend(app);

app
.configure(function() {
    app
        .use(express.bodyParser())
        .use(express.cookieParser())
        .set('root', __dirname)
        .set('uploadsDir', path.resolve('../public/images'))
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


app.listen(app.get('port'));