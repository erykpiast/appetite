var _ = $require('/libs/underscore');

module.exports = function(app) {
	var exports = { };

    var restPath = app.get('rest').path + '/*';

    app
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
    .param('id', /^\d+$/)    
    .use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    
        next();
    })
    .post(restPath, app.get('auth').middleware)
    .put(restPath, app.get('auth').middleware)
    .delete(restPath, app.get('auth').middleware);


	$require('fs').readdir(__dirname + '/', function(err, files) {
		files.filter(function(filename){
			return (/.js$/).test(filename) && ([ 'index.js', 'get-auth-data.js' ].indexOf(filename) === -1);
		})
		.forEach(function(filename) {
			var routename = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request.js -> ActualRequest

			exports[routename] = $require(__dirname + '/' + filename)(app);
		});

        app.use(app.router); // after auth
	});

	return exports;
};