var Sequelize = $require('sequelize'),
	_ = $require('/libs/underscore'),
	config = $require('config').database;

// initialize database connection
var sequelize = new Sequelize(
	config.name,
	config.username,
	config.password,
	{
		define: {
			charset: 'utf8',
			collate: 'utf8_general_ci'
		}
	}
);


// load models
$require('fs').readdir(__dirname + '/models', function(err, files) {
	files.filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js');
	}).forEach(function(filename) {
		var modelname = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request.js -> ActualRequest
		module.exports[modelname] = sequelize.import(__dirname + '/models/' + filename);
	});

	// describe relationships
	(function(m) {
		m.ActualRequest.hasOne(m.Request);

    	m.Request.hasOne(m.Recipe);
		m.Request.belongsTo(m.User);

		m.Request.hasMany(m.Image);
		m.Image.hasMany(m.Request);

		m.ActualRequest.hasMany(m.RequestResponse);
		// m.RequestResponse.hasOne(m.ActualRequest);
		m.RequestResponse.belongsTo(m.User);

		m.ActualRequest.hasOne(m.Place);

		/* -- */

		m.ActualOffer.hasOne(m.Offer);

		m.Offer.hasOne(m.Recipe);
		m.Offer.belongsTo(m.User);

		m.Offer.hasMany(m.Image);
		m.Image.hasMany(m.Offer);

		m.ActualOffer.hasMany(m.OfferResponse);
		// m.OfferResponse.hasOne(m.ActualOffer);
		m.OfferResponse.belongsTo(m.User);

		m.ActualOffer.hasOne(m.Place);

		/* -- */

		m.User.hasOne(m.Avatar);
		m.User.hasOne(m.Place);

		m.Like.belongsTo(m.User);
		m.Offer.hasMany(m.Like);

		/* -- */

		m.Recipe.belongsTo(m.User);
		m.Place.belongsTo(m.User);
		m.Image.belongsTo(m.User);
		m.Avatar.belongsTo(m.User);

		console.log('Database initialization...');
        sequelize.sync({ force: false }) // try create models in db
            .success(function(err) {
                console.log('All models created in database!');
            })
            .error(function(err) {
            	throw new Error('Database initialization failed! ' + err);
            });

	})(module.exports);
});

// export connection
module.exports.sequelize = sequelize;