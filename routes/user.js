var restUrl = require('config').restUrl;

module.exports = function(app) {
    app.get(restUrl + '/user/:id', function(req, res) {
        res.json({
            id: req.param('id')
        });
    });
};