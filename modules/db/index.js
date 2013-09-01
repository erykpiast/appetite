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
		var modelname = _.capitalize(_.camelize(filename)).slice(0, -3); // request-template.js -> RequestTemplate
		module.exports[modelname] = sequelize.import(__dirname + '/models/' + filename);
	});

	// describe relationships
	(function(m) {
		m.Request.hasOne(m.RequestTemplate);

    	m.Recipe.hasMany(m.RequestTemplate);
		m.RequestTemplate.belongsTo(m.User);

		m.RequestTemplate.hasMany(m.Image);
		m.Image.hasMany(m.RequestTemplate);

		m.Request.hasMany(m.RequestResponse);
		// m.RequestTemplateResponse.hasOne(m.Request);
		m.RequestResponse.belongsTo(m.User);

		m.Request.hasOne(m.Place);

		/* -- */

		m.Offer.hasOne(m.OfferTemplate);

		m.Recipe.hasMany(m.OfferTemplate);
		m.OfferTemplate.belongsTo(m.User);

		m.OfferTemplate.hasMany(m.Image);
		m.Image.hasMany(m.OfferTemplate);

		m.Offer.hasMany(m.OfferResponse);
		// m.OfferTemplateResponse.hasOne(m.Offer);
		m.OfferResponse.belongsTo(m.User);

		m.Offer.hasOne(m.Place);

		/* -- */

		m.User.hasOne(m.Avatar);
		m.User.hasOne(m.Place);

		m.Like.belongsTo(m.User);
		m.OfferTemplate.hasMany(m.Like);

		/* -- */

		m.Recipe.belongsTo(m.User);
		m.Place.belongsTo(m.User);
		m.Image.belongsTo(m.User);
		m.Avatar.belongsTo(m.User);

		console.log('Database initialization...');
		console.log('===========================================================');
        sequelize.sync({ force: true }) // try create models in db
            .success(function(err) {
                console.log('===========================================================');
                console.log('All models created in database!');
            })
            .error(function(err) {
            	throw new Error('Database initialization failed! ' + err);
            });

	})(module.exports);
});

// export connection
module.exports.sequelize = sequelize;