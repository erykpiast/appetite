var _ = $require('/libs/underscore');
var cors = $require('cors');

module.exports = function(app) {
    var exports = { };

    var restPath = app.get('rest').root;

    app
    .param('id', /^\d+$/)
    .use(cors())
    .post(restPath + '/*', app.get('auth').middleware)
    .put(restPath + '/*', app.get('auth').middleware)
    .delete(restPath + '/*', app.get('auth').middleware)
    .use(app.router);

    $require('fs').readdir(__dirname + '/', function(err, files) {
        files.filter(function(filename){
            return (/.js$/).test(filename) && ([ 'index.js' ].indexOf(filename) === -1);
        })
        .forEach(function(filename) {
            var routename = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request.js -> ActualRequest

            exports[routename] = $require(__dirname + '/' + filename)(app);
        });
    });

    return exports;
};